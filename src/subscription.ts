import { post } from './db/schema'
import { inArray } from 'drizzle-orm'
import {
  OutputSchema as RepoEvent,
  isCommit,
} from './lexicon/types/com/atproto/sync/subscribeRepos'
import { FirehoseSubscriptionBase, getOpsByType } from './util/subscription'

export class FirehoseSubscription extends FirehoseSubscriptionBase {
  async handleEvent(evt: RepoEvent) {
    if (!isCommit(evt)) return

    const ops = await getOpsByType(evt)

    const postsToDelete = ops.posts.deletes.map((del) => del.uri)
    const postsToCreate = ops.posts.creates
      .filter((create) => {
        // only svelte-related posts
        return create.record.text.toLowerCase().includes('svelte')
      })
      .map((create) => {
        // map svelte-related posts to a db row
        return {
          uri: create.uri,
          cid: create.cid,
          indexedAt: new Date().toISOString(),
        }
      })

    if (postsToDelete.length > 0) {
      await this.db
        .delete(post)
        .where(inArray(post.uri, postsToDelete))
        .execute()
    }
    if (postsToCreate.length > 0) {
      await this.db
        .insert(post)
        .values(postsToCreate)
        .onConflictDoNothing()
        .execute()
    }
  }
}
