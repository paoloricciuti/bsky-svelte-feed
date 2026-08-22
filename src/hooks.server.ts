import { db } from '#lib/server/db/index.js';
import { post } from '#lib/server/db/schema.js';
import { PUBLISHER_DID } from '$app/env/private';
import { Jetstream, websocketTransport } from '@bsky/jetstream';
import { eq } from 'drizzle-orm';
import { lookup } from 'node:dns/promises';
import { get_feed_info } from './feed/get-url.js';
import { router } from './lex-router/index.js';
import * as app from './lexicons/app.js';
import {
	banned_dids,
	known_dids,
	refresh_banned_dids,
	refresh_known_dids
} from '#lib/read-dids.js';
import { delete_from_discord, post_to_discord } from '#lib/discord.js';
import { check } from '#lib/claude.js';
import { get_thread } from '#lib/get-thread.js';

const JETSTREAM_ENDPOINT = 'https://jetstream.us-west.bsky.network';

export async function handle({ event, resolve }) {
	if (event.url.pathname === '/.well-known/did.json') {
		const feed_info = await get_feed_info();
		return Response.json({
			'@context': ['https://www.w3.org/ns/did/v1'],
			id: `did:web:${feed_info.url.host}`,
			service: [
				{
					id: '#bsky_fg',
					type: 'BskyFeedGenerator',
					serviceEndpoint: feed_info.url.origin
				}
			]
		});
	}

	const response = await router.fetch(event.request);
	return response.ok ? response : resolve(event);
}

export function init() {
	const jetstream_hostname = new URL(JETSTREAM_ENDPOINT).hostname;
	console.info('jetstream starting', {
		endpoint: JETSTREAM_ENDPOINT,
		node_version: process.version
	});
	void lookup(jetstream_hostname, { all: true })
		.then((addresses) => {
			console.info('jetstream DNS resolved', {
				endpoint: JETSTREAM_ENDPOINT,
				hostname: jetstream_hostname,
				addresses
			});
		})
		.catch((error) => {
			console.warn('jetstream DNS resolution failed', {
				endpoint: JETSTREAM_ENDPOINT,
				hostname: jetstream_hostname,
				error
			});
		});

	const known_svelte_words = [
		'sveltekit',
		'svelte-kit',
		'svelte kit',
		'sveltejs',
		'svelte js',
		'svelte.dev',
		'sveltesociety.dev',
		'svelte.london'
	];

	const jetstream = new Jetstream(JETSTREAM_ENDPOINT);
	const abort_controller = new AbortController();
	process.once('sveltekit:shutdown', (shutdown_reason) => {
		console.info('jetstream shutting down', { endpoint: JETSTREAM_ENDPOINT, shutdown_reason });
		abort_controller.abort(shutdown_reason);
	});
	const live_transport = websocketTransport({
		onOpen: () => {
			console.info('jetstream transport opened', { endpoint: JETSTREAM_ENDPOINT });
		},
		onConnect: () => {
			if (!abort_controller.signal.aborted) {
				console.info('jetstream connected', { endpoint: JETSTREAM_ENDPOINT });
			}
		},
		onDisconnect: () => {
			if (!abort_controller.signal.aborted) {
				console.warn('jetstream disconnected', { endpoint: JETSTREAM_ENDPOINT });
			}
		},
		onReconnect: (error, { attempt }) => {
			if (!abort_controller.signal.aborted) {
				console.warn('jetstream reconnect failed', {
					endpoint: JETSTREAM_ENDPOINT,
					attempt_number: attempt + 1,
					error
				});
			}
		},
		onError: (error) => {
			if (!abort_controller.signal.aborted) {
				console.error('jetstream transport error', { endpoint: JETSTREAM_ENDPOINT, error });
			}
		},
		onClose: (detail) => {
			console.info('jetstream transport closed', { endpoint: JETSTREAM_ENDPOINT, ...detail });
		}
	});

	refresh_known_dids();
	refresh_banned_dids();

	let has_received_first_event = false;
	(async () => {
		for await (const data of jetstream.live({
			collections: [app.bsky.feed.post],
			kinds: ['commit'],
			signal: abort_controller.signal,
			liveTransport: live_transport,
			onError: (error) => {
				if (!abort_controller.signal.aborted) console.error('jetstream event decode error', error);
			}
		})) {
			if (!has_received_first_event) {
				has_received_first_event = true;
				console.info('jetstream received first event', { endpoint: JETSTREAM_ENDPOINT });
			}
			if (data.kind !== 'commit') continue;
			// using an IIFE to avoid blocking the loop with the db operations
			(async () => {
				if (data.commit.operation === 'delete') {
					const returning = await db
						.delete(post)
						.where(eq(post.uri, `at://${data.did}/app.bsky.feed.post/${data.commit.rkey}`))
						.returning();
					if (returning.length > 0) {
						for (const deleted of returning) {
							if (deleted.discord_id) {
								delete_from_discord(deleted.discord_id);
							}
						}
					}
				} else if (data.commit.operation === 'create') {
					const create = data.commit;
					const images =
						create.record.embed && 'images' in create.record.embed
							? create.record.embed.images
							: undefined;
					const is_svelte =
						(create.record.text.toLowerCase().includes('svelte') ||
							images?.some((img) => img.alt?.toLowerCase().includes('svelte')) ||
							data.did === PUBLISHER_DID) &&
						(!banned_dids || !banned_dids.has(data.did));
					if (!is_svelte) return;
					refresh_known_dids();
					refresh_banned_dids();
					const banned = banned_dids != null && banned_dids.has(data.did);

					if (banned) return;

					let text = create.record.text.toLowerCase();
					// this will always be true unless it's a post by me that doesn't mention svelte (i know it's impossible)
					let include = text.includes('svelte');

					// if the text doesn't include svelte let's try with the images
					if (!include && data.did !== PUBLISHER_DID) {
						text = (images?.filter((img) => img.alt?.toLowerCase().includes('svelte')) ?? [])
							.map((img) => img.alt)
							.join('');
						include = text.includes('svelte');
						console.log('using alt images');
					}

					console.log(text);

					let claude_answer;

					if (
						(known_dids == null || !known_dids.has(data.did)) &&
						!known_svelte_words.some((word) => text.includes(word))
					) {
						// if we don't have any known svelte word in the post we can check with
						// claude 💰💰💰
						console.log('using claude to determine');
						let thread_context: string[] = [];
						if (create.record.reply) {
							try {
								thread_context = await get_thread(create.record.reply.parent.uri);
							} catch (error) {
								console.warn('could not fetch thread for ai context', {
									reply: create.record.reply,
									error
								});
							}
						}
						({ result: include, text: claude_answer } = await check(text, thread_context));
					}

					console.log(include, text, banned);

					let discord_id: string | undefined = undefined;

					const uri = `at://${data.did}/app.bsky.feed.post/${create.rkey}`;

					if (include) {
						const res = await post_to_discord(uri);
						if (res) {
							discord_id = res.id;
						}
					}
					db.insert(post)
						.values({
							cid: create.cid,
							uri,
							indexedAt: new Date().toISOString(),
							text: include ? undefined : create.record.text,
							confirmed: include,
							discord_id,
							claude_answer
						})
						.onConflictDoNothing()
						.execute();
				}
			})();
		}
	})().catch((error) => {
		if (error.name === 'LexValidationError') return;
		if (!abort_controller.signal.aborted) {
			console.error('jetstream stream exited unexpectedly', error);
			throw error;
		}
	});
}
