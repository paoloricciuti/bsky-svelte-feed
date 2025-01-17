import { inArray } from 'drizzle-orm';
import { check } from './ai.js';
import { post } from './db/schema.js';
import {
	OutputSchema as RepoEvent,
	isCommit,
} from './lexicon/types/com/atproto/sync/subscribeRepos.js';
import { FirehoseSubscriptionBase, getOpsByType } from './util/subscription.js';
import fs from 'node:fs/promises';

const known_svelte_words = [
	'sveltekit',
	'svelte-kit',
	'svelte kit',
	'sveltejs',
	'svelte js',
	'svelte.dev',
	'sveltesociety.dev',
	'svelte.london',
];

let known_dids: Set<string> | undefined;
let known_dids_last_read_at: Date | undefined;

export class FirehoseSubscription extends FirehoseSubscriptionBase {
	async handleEvent(evt: RepoEvent) {
		if (!isCommit(evt)) return;
		if (evt.blocks.length === 0) return;
		let ops: Awaited<ReturnType<typeof getOpsByType> | undefined>;
		try {
			ops = await getOpsByType(evt);
		} catch {}

		if (!ops) {
			console.log("can't get ops by type", evt.repo, evt.blocks.length);
			return;
		}

		const postsToDelete = ops.posts.deletes.map((del) => del.uri);
		const postsToCreatePromises = await Promise.allSettled(
			ops.posts.creates
				.filter((create) => {
					// only svelte-related posts
					return (
						create.record.text.toLowerCase().includes('svelte') ||
						create.author === process.env.FEEDGEN_PUBLISHER_DID
					);
				})
				.map(async (create) => {
					try {
						const stat = await fs.stat('known-dids.json');
						if (
							!known_dids ||
							!known_dids_last_read_at ||
							stat.mtime.getTime() > known_dids_last_read_at.getTime()
						) {
							let known_dids_string = await fs.readFile(
								'known-dids.json',
								'utf-8',
							);
							known_dids = new Set(JSON.parse(known_dids_string));
							known_dids_last_read_at = stat.mtime;
							console.log('known dids read at time', stat.mtime.toString());
						}
					} catch {
						console.log('something went wrong reading the file');
					}
					let text = create.record.text.toLowerCase();
					// this will always be true unless it's a post by me that doesn't mention svelte (i know it's impossible)
					let include = text.includes('svelte');

					let claude_answer;

					if (
						(known_dids == null || !known_dids.has(create.author)) &&
						!known_svelte_words.some((word) => text.includes(word))
					) {
						// if we don't have any known svelte word in the post we can check with
						// claude 💰💰💰
						console.log('using claude to determine');
						({ result: include, text: claude_answer } = await check(
							create.record.text,
						));
					}

					console.log(include, text);

					// map svelte-related posts to a db row
					return {
						uri: create.uri,
						cid: create.cid,
						indexedAt: new Date().toISOString(),
						confirmed: include,
						text: include ? undefined : create.record.text,
						claude_answer,
					};
				}),
		);

		const postsToCreate = postsToCreatePromises
			.filter((post) => post.status === 'fulfilled')
			.map((post) => post.value);

		if (postsToDelete.length > 0) {
			await this.db
				.delete(post)
				.where(inArray(post.uri, postsToDelete))
				.execute();
		}
		if (postsToCreate.length > 0) {
			await this.db
				.insert(post)
				.values(postsToCreate)
				.onConflictDoNothing()
				.execute();
		}
	}
}
