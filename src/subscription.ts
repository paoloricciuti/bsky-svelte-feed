import { inArray } from 'drizzle-orm';
import { check } from './ai.js';
import { post } from './db/schema.js';
import {
	OutputSchema as RepoEvent,
	isCommit,
} from './lexicon/types/com/atproto/sync/subscribeRepos.js';
import { FirehoseSubscriptionBase, getOpsByType } from './util/subscription.js';

export class FirehoseSubscription extends FirehoseSubscriptionBase {
	async handleEvent(evt: RepoEvent) {
		if (!isCommit(evt)) return;

		const ops = await getOpsByType(evt);

		const postsToDelete = ops.posts.deletes.map((del) => del.uri);
		const postsToCreatePromises = await Promise.allSettled(
			ops.posts.creates
				.filter((create) => {
					if (create.record.text.toLowerCase().includes('svelte')) {
						console.log(create.record.text);
					}
					// only svelte-related posts
					return create.record.text.toLowerCase().includes('svelte');
				})
				.map(async (create) => {
					const text = create.record.text.toLowerCase();
					let confidence = 0;
					// if we have this in the sentence we are 100% sure they are talking about
					// the framework
					if (
						text.includes('sveltekit') ||
						text.includes('svelte-kit') ||
						text.includes('svelte kit') ||
						text.includes('sveltejs')
					) {
						confidence = 1;
					} else {
						const author = await create.get_author();
						const text_and_bio =
							create.record.text +
							' ' +
							(author.description ? `<bio>${author.description}</bio>` : '');
						confidence = await check(text_and_bio);
					}
					console.log(confidence, create.record.text);

					// map svelte-related posts to a db row
					return {
						uri: create.uri,
						cid: create.cid,
						indexedAt: new Date().toISOString(),
						confidence,
					};
				}),
		);

		const postsToCreate = postsToCreatePromises
			.filter((post) => post.status === 'fulfilled')
			.filter((post) => post.value.confidence > 0.8)
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
