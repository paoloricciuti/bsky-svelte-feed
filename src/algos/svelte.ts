import { QueryParams } from '../lexicon/types/app/bsky/feed/getFeedSkeleton'
import { AppContext } from '../config'
import { post } from '../db/schema'
import { lt } from 'drizzle-orm'

// max 15 chars
export const shortname = 'svelte'

export const handler = async (ctx: AppContext, params: QueryParams) => {
  let timeStr
  if (params.cursor) {
    timeStr = new Date(parseInt(params.cursor, 10)).toISOString()
  }

  let builder = ctx.db
    .select()
    .from(post)
    .where(timeStr ? lt(post.indexedAt, timeStr) : undefined)
    .orderBy(post.indexedAt, post.cid)
    .limit(params.limit)

  const res = await builder.execute()

  const feed = res.map((row) => ({
    post: row.uri!,
  }))

  let cursor: string | undefined
  const last = res.at(-1)
  if (last && last.indexedAt) {
    cursor = new Date(last.indexedAt).getTime().toString(10)
  }

  return {
    cursor,
    feed,
  }
}
