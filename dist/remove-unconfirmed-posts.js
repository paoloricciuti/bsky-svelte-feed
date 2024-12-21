import { eq } from 'drizzle-orm';
import { db } from './db/index.js';
import { post } from './db/schema.js';
async function delete_posts() {
    try {
        await db.delete(post).where(eq(post.confirmed, false));
        console.log('cleared unconfirmed posts');
    }
    catch (e) {
        console.log('error deleting posts', e);
    }
}
await delete_posts();
