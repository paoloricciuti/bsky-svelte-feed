import { eq } from 'drizzle-orm';
import { validateAuth } from '../auth.js';
import { AppContext } from '../config.js';
import { post } from '../db/schema.js';
import { Server } from '../lexicon/index.js';
import fs from 'node:fs/promises';
import {
	delete_from_discord,
	post_to_discord,
} from '../util/discord-webhook.js';

let mods_dids: Set<string> | undefined;
let mods_dids_last_read_at: Date | undefined;

export default function (server: Server, ctx: AppContext) {
	server.com.atproto.moderation.createReport(async ({ input, req }) => {
		const requesterDid = await validateAuth(req, null, ctx.didResolver);

		if (
			typeof input.body.subject.uri !== 'string' ||
			typeof input.body.subject.cid !== 'string'
		) {
			return {
				status: 500,
			};
		}

		const [already_exists] = await ctx.db
			.select()
			.from(post)
			.where(eq(post.uri, input.body.subject.uri))
			.execute();

		try {
			const stat = await fs.stat('mod-dids.json');
			if (
				!mods_dids ||
				!mods_dids_last_read_at ||
				stat.mtime.getTime() > mods_dids_last_read_at.getTime()
			) {
				let known_dids_string = await fs.readFile('known-dids.json', 'utf-8');
				mods_dids = new Set(JSON.parse(known_dids_string));
				mods_dids_last_read_at = stat.mtime;
				console.log('mod dids read at time', stat.mtime.toString());
			}
		} catch {
			console.log('something went wrong reading the mod dids file');
		}

		console.log({ requesterDid, mods: [...(mods_dids ?? [])] });

		if (
			requesterDid === process.env.FEEDGEN_PUBLISHER_DID ||
			mods_dids?.has(requesterDid)
		) {
			if (already_exists && already_exists.confirmed) {
				const returning = await ctx.db
					.delete(post)
					.where(eq(post.uri, already_exists.uri!))
					.returning();
				for (let deleted of returning) {
					if (deleted.discord_id) {
						delete_from_discord(deleted.discord_id);
					}
				}
			} else if (already_exists && !already_exists.confirmed) {
				const discord_post = await post_to_discord(input.body.subject.uri);
				await ctx.db
					.update(post)
					.set({
						confirmed: true,
						discord_id: discord_post?.id,
					})
					.where(eq(post.uri, already_exists.uri!))
					.execute();
			} else {
				const discord_post = await post_to_discord(input.body.subject.uri);
				await ctx.db
					.insert(post)
					.values({
						cid: input.body.subject.cid,
						uri: input.body.subject.uri,
						discord_id: discord_post?.id,
						indexedAt: new Date().toISOString(),
					})
					.onConflictDoNothing()
					.execute();
			}
		} else {
			if (already_exists && already_exists.confirmed) {
				await ctx.db
					.update(post)
					.set({
						reported: true,
						claude_answer: input.body.reason || already_exists.claude_answer,
					})
					.where(eq(post.uri, already_exists.uri!))
					.execute();
			} else if (!already_exists) {
				await ctx.db
					.insert(post)
					.values({
						cid: input.body.subject.cid,
						uri: input.body.subject.uri,
						indexedAt: new Date().toISOString(),
						confirmed: false,
						claude_answer: input.body.reason || 'reported',
					})
					.onConflictDoNothing()
					.execute();
			}
		}

		delete input.body.subject.type;
		return {
			encoding: 'application/json',
			body: {
				...input.body,
				createdAt: new Date().toISOString(),
				id: Date.now(),
				reportedBy: requesterDid,
			},
		};
	});
}
