import { eq } from 'drizzle-orm';
import { db } from './db/index.js';
import { post } from './db/schema.js';
import { Agent } from '@atproto/api';
const regex = /.+\/profile\/(?<repo>.+?)\/post\/(?<rkey>.+?)$/;
const [, , post_url] = process.argv;
async function delete_post() {
    if (post_url) {
        const agent = new Agent('https://public.api.bsky.app');
        const match = post_url.match(regex);
        if (!match) {
            console.log('not a post url');
            return;
        }
        const bsky_post = await agent.getPost({
            repo: match.groups.repo,
            rkey: match.groups.rkey,
        });
        console.log('deleting post', bsky_post.cid);
        try {
            await db.delete(post).where(eq(post.cid, bsky_post.cid));
            console.log('post correctly deleted');
        }
        catch (e) {
            console.log('error deleting post', e);
        }
    }
}
await delete_post();
