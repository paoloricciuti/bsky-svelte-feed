import { LexRouter, LexServerAuthError } from '@atproto/lex-server';
import * as app from '../lexicons/app.js';
import * as com from '../lexicons/com.js';
import { get_feed_info } from '../feed/get-url.js';
import { db } from '#lib/server/db/index.js';
import { post } from '#lib/server/db/schema.js';
import { and, desc, eq, lt } from 'drizzle-orm';
import { mods_dids, refresh_mods_dids } from '#lib/read-dids.js';
import { delete_from_discord, post_to_discord } from '#lib/discord.js';
import { PUBLISHER_DID } from '$app/env/private';
import { verifyJwt } from '@atproto/xrpc-server';
import { IdResolver } from '@atproto/identity';

const id_resolver = new IdResolver();
export const router = new LexRouter();

const LABELER_POST_URI = 'at://did:plc:ezyrzvz3yoglekd4j2szmiys/app.bsky.feed.post/3lfcn5fw6v22h';

const SVELTE_STARTER_PACK_URI =
	'at://did:plc:nlvjelw3dy3pddq7qoglleko/app.bsky.feed.post/3likl37wjdc2q';

const TOP_POST_FREQUENCY = 0.99;

router
	.add(app.bsky.feed.describeFeedGenerator, async () => {
		const feed_info = await get_feed_info();
		return Response.json({
			did: `did:web:${feed_info.url.host}`,
			feeds: [{ uri: feed_info.feed_uri }]
		});
	})
	.add(app.bsky.feed.getFeedSkeleton, async ({ params }) => {
		let time_str;
		if (params.cursor) {
			time_str = new Date(parseInt(params.cursor, 10)).toISOString();
		}

		const builder = db
			.select()
			.from(post)
			.where(and(eq(post.confirmed, true), time_str ? lt(post.indexedAt, time_str) : undefined))
			.orderBy(desc(post.indexedAt), desc(post.cid))
			.limit(params.limit);

		const res = await builder.execute();

		const feed = res.map((row) => ({
			post: row.uri!
		}));

		if (
			Math.random() > TOP_POST_FREQUENCY &&
			feed.findIndex((post) => post.post === LABELER_POST_URI) === -1
		) {
			console.log('Pushing labeler post');
			feed.unshift({
				post: LABELER_POST_URI
			});
		} else if (
			Math.random() > TOP_POST_FREQUENCY &&
			feed.findIndex((post) => post.post === SVELTE_STARTER_PACK_URI) === -1
		) {
			console.log('Pushing Svelte starter pack post');
			feed.unshift({
				post: SVELTE_STARTER_PACK_URI
			});
		}

		let cursor: string | undefined;
		const last = res.at(-1);
		if (last && last.indexedAt) {
			cursor = new Date(last.indexedAt).getTime().toString(10);
		}
		return Response.json({
			cursor,
			feed
		});
	})
	.add(com.atproto.moderation.createReport, {
		async auth({ request }) {
			const header = request.headers.get('authorization');
			if (!header?.startsWith('Bearer ')) {
				throw new LexServerAuthError('AuthenticationRequired', 'Bearer token required', {
					Bearer: { realm: 'labeler' }
				});
			}
			const jwt = header.slice(7);
			try {
				const payload = await verifyJwt(
					jwt,
					null,
					'com.atproto.moderation.createReport',
					async (did, force) => {
						const atproto_data = await id_resolver.did.resolveAtprotoData(did, force);
						return atproto_data.signingKey;
					}
				);
				return { did: payload.iss };
			} catch {
				throw new LexServerAuthError('InvalidToken', 'Invalid service auth token', {
					Bearer: { realm: 'labeler', error: 'invalid_token' }
				});
			}
		},
		async handler({ input, credentials: { did: requester_did } }) {
			const subject =
				'uri' in input.body.subject && 'cid' in input.body.subject ? input.body.subject : undefined;
			if (
				!subject ||
				('uri' in subject &&
					typeof subject.uri === 'string' &&
					'cid' in subject &&
					typeof subject.cid === 'string')
			) {
				return Response.json({
					status: 500
				});
			}

			const [already_exists] = await db
				.select()
				.from(post)
				.where(eq(post.uri, subject.uri))
				.execute();

			await refresh_mods_dids();

			if (requester_did === PUBLISHER_DID || mods_dids?.has(requester_did)) {
				if (already_exists && already_exists.confirmed) {
					const returning = await db
						.delete(post)
						.where(eq(post.uri, already_exists.uri!))
						.returning();
					for (const deleted of returning) {
						if (deleted.discord_id) {
							delete_from_discord(deleted.discord_id);
						}
					}
				} else if (already_exists && !already_exists.confirmed) {
					const discord_post = await post_to_discord(subject.uri);
					await db
						.update(post)
						.set({
							confirmed: true,
							discord_id: discord_post?.id
						})
						.where(eq(post.uri, already_exists.uri!))
						.execute();
				} else {
					const discord_post = await post_to_discord(subject.uri);
					await db
						.insert(post)
						.values({
							cid: subject.cid,
							uri: subject.uri,
							discord_id: discord_post?.id,
							indexedAt: new Date().toISOString()
						})
						.onConflictDoNothing()
						.execute();
				}
			} else {
				if (already_exists && already_exists.confirmed) {
					await db
						.update(post)
						.set({
							reported: true,
							claude_answer: input.body.reason || already_exists.claude_answer
						})
						.where(eq(post.uri, already_exists.uri!))
						.execute();
				} else if (!already_exists) {
					await db
						.insert(post)
						.values({
							cid: subject.cid,
							uri: subject.uri,
							indexedAt: new Date().toISOString(),
							confirmed: false,
							claude_answer: input.body.reason || 'reported'
						})
						.onConflictDoNothing()
						.execute();
				}
			}

			const { cid, uri } = subject;
			return Response.json({
				encoding: 'application/json',
				body: {
					cid,
					uri,
					createdAt: new Date().toISOString(),
					id: Date.now(),
					reportedBy: requester_did
				}
			});
		}
	});
