import { db } from '#lib/server/db/index.js';
import { post } from '#lib/server/db/schema.js';
import { PUBLISHER_DID } from '$app/env/private';
import { Jetstream } from '@bsky/jetstream';
import { eq } from 'drizzle-orm';
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

	const jetstream = new Jetstream('https://jetstream.us-east.bsky.network');

	refresh_known_dids();
	refresh_banned_dids();

	(async () => {
		for await (const data of jetstream.live({
			collections: [app.bsky.feed.post],
			kinds: ['commit']
		})) {
			if (data.kind !== 'commit') continue;
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
				if (!is_svelte) continue;
				refresh_known_dids();
				refresh_banned_dids();
				const banned = banned_dids != null && banned_dids.has(data.did);

				if (banned) continue;

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
					({ result: include, text: claude_answer } = await check(text));
				}

				console.log(include, text, banned);

				let discord_id: string | undefined = undefined;

				const uri = `at://${data.did}/app.bsky.feed.post/${create.rkey}`;

				if (include) {
					const res = await post_to_discord(uri);
					if (res) {
						discord_id = res.id;
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
			}
		}
	})();
}
