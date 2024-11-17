import { inArray } from 'drizzle-orm';
import { check } from './ai.js';
import { post } from './db/schema.js';
import {
	OutputSchema as RepoEvent,
	isCommit,
} from './lexicon/types/com/atproto/sync/subscribeRepos.js';
import { FirehoseSubscriptionBase, getOpsByType } from './util/subscription.js';

const known_svelte_words = [
	'sveltekit',
	'svelte-kit',
	'svelte kit',
	'sveltejs',
	'svelte js',
	'svelte.dev',
	'sveltesociety.dev',
];

export class FirehoseSubscription extends FirehoseSubscriptionBase {
	async handleEvent(evt: RepoEvent) {
		if (!isCommit(evt)) return;

		let ops: Awaited<ReturnType<typeof getOpsByType> | undefined>;
		try {
			ops = await getOpsByType(evt);
		} catch {}

		if (!ops) {
			console.log("can't get ops by type");
			return;
		}

		const postsToDelete = ops.posts.deletes.map((del) => del.uri);
		const postsToCreatePromises = await Promise.allSettled(
			ops.posts.creates
				.filter((create) => {
					// only svelte-related posts
					return create.record.text.toLowerCase().includes('svelte');
				})
				.map(async (create) => {
					let text = create.record.text.toLowerCase();
					let include = true;
					// if we don't have any known svelte word in the post we can check with
					// claude 💰💰💰
					if (!known_svelte_words.some((word) => text.includes(word))) {
						console.log('using claude to determine');
						include = await check(create.record.text);
					}

					console.log(include, text);

					// map svelte-related posts to a db row
					return {
						uri: create.uri,
						cid: create.cid,
						indexedAt: new Date().toISOString(),
						include,
					};
				}),
		);

		const postsToCreate = postsToCreatePromises
			.filter((post) => post.status === 'fulfilled')
			.filter((post) => post.value.include)
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
