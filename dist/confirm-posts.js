import { desc, eq, or } from 'drizzle-orm';
import express from 'express';
import { post } from './db/schema.js';
import { Agent } from '@atproto/api';
import cookie from 'cookie-parser';
const makeRouter = (ctx) => {
    const router = express.Router();
    router.use(cookie());
    router.get('/confirm', async (_req, res) => {
        const agent = new Agent('https://public.api.bsky.app');
        let results = await ctx.db
            .select()
            .from(post)
            .where(or(eq(post.confirmed, false), eq(post.reported, true)))
            .orderBy(desc(post.indexedAt), desc(post.cid))
            .execute();
        res.setHeader('Content-type', 'text/html');
        const posts = await Promise.allSettled(results.map(async (result) => {
            let text = result.text;
            if (!text) {
                const bsky_post = await agent.getPostThread({
                    uri: result.uri,
                });
                text = bsky_post.data.thread.post.record.text;
                ctx.db
                    .update(post)
                    .set({
                    text,
                })
                    .where(eq(post.uri, result.uri))
                    .execute();
            }
            return `
				<div class="card${result.reported ? ' reported' : ''}">
					<div>${text}</div>
					<pre>Claude: ${result.claude_answer}</pre>
					<div class="actions">
						<a target="_blank" href="${result.uri
                ?.replace('at://', 'https://bsky.app/profile/')
                .replace('app.bsky.feed.post', 'post')}">Bsky 🦋</a>
						<a target="_blank" href="/confirm/approve?id=${result.uri}">Approve</a>
						<a target="_blank" href="/confirm/delete?id=${result.uri}">Delete</a>
					</div>
				</div>`;
        }));
        let html = `
		<head>
			<meta name="viewport" content="width=device-width, initial-scale=1" />
		</head>
		<style>
			main{
				display: grid;
				grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
				gap: 1rem;
			}
			.card {
				display: grid;
				grid-template-rows: 1fr auto auto;
				place-items: center;
				font-family: sans-serif;
				align-content: space-between;
				gap: 1rem;
				background-color: #ff3e0033;
				border-radius: .5rem;
				padding: 1rem;
			}
			.card.reported{
				background-color: #ff000077;
			}
			.card > div{
				height: 100%;
			}
			.card a{
				display: grid;
				background-color: #ff3e00;
				border-radius: .5rem;
				padding: .5rem;
				color: white;
				font-weight: bold;
				text-decoration: none;
				width: 100%;
				text-align: center;
				place-content: center;
			}
			.actions{
				display: flex;
				width: 100%;
				gap: .5rem;
			}
			pre{
				width: 100%;
				overflow: auto;
				background: rgb(255 255 255 / .5);
				padding: .5rem;
				margin: 0;
			}
		</style>
		<main>
		${posts
            .filter((res) => res.status === 'fulfilled')
            .map((res) => res.value)
            .join('\n')}
		</main>`;
        return res.send(html);
    });
    router.get('/confirm/approve', async (req, res) => {
        const id = req.query.id;
        if (!id || req.cookies['bsky-feed-pass'] !== process.env.APPROVE_PASSWORD) {
            res.setHeader('Content-type', 'text/html');
            let html = `
			<h1 class="font-familiy: sans-serif">Unauth!</h1>
			<script>
			setTimeout(()=>window.close(), 5000);
			</script>
			`;
            return res.send(html);
        }
        await ctx.db
            .update(post)
            .set({
            confirmed: true,
            reported: false,
        })
            .where(eq(post.uri, id.toString()))
            .execute();
        res.setHeader('Content-type', 'text/html');
        let html = `
		<h1 class="font-familiy: sans-serif">Done!</h1>
		<script>
			setTimeout(()=>window.close(), 5000);
		</script>
		`;
        return res.send(html);
    });
    router.get('/confirm/delete', async (req, res) => {
        const id = req.query.id;
        if (!id || req.cookies['bsky-feed-pass'] !== process.env.APPROVE_PASSWORD) {
            res.setHeader('Content-type', 'text/html');
            let html = `
			<h1 class="font-familiy: sans-serif">Unauth!</h1>
			<script>
			setTimeout(()=>window.close(), 5000);
			</script>
			`;
            return res.send(html);
        }
        await ctx.db.delete(post).where(eq(post.uri, id.toString())).execute();
        res.setHeader('Content-type', 'text/html');
        let html = `
		<h1 class="font-familiy: sans-serif">Done!</h1>
		<script>
			setTimeout(()=>window.close(), 5000);
		</script>
		`;
        return res.send(html);
    });
    return router;
};
export default makeRouter;
