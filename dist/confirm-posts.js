import { and, desc, eq, notLike } from 'drizzle-orm';
import express from 'express';
import { post } from './db/schema.js';
const makeRouter = (ctx) => {
    const router = express.Router();
    router.get('/confirm', async (_req, res) => {
        let results = await ctx.db
            .select()
            .from(post)
            .where(and(eq(post.confirmed, false), notLike(post.uri, `%${process.env.FEEDGEN_PUBLISHER_DID}%`)))
            .orderBy(desc(post.indexedAt), desc(post.cid))
            .execute();
        res.setHeader('Content-type', 'text/html');
        return res.send(results
            .map((result) => `<a target="_blank" href="${result.uri
            ?.replace('at://', 'https://bsky.app/profile/')
            .replace('app.bsky.feed.post', 'post')}">${result.uri}</a><br/>`)
            .join('\n'));
    });
    return router;
};
export default makeRouter;
