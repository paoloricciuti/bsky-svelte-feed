import { createHash, timingSafeEqual } from 'node:crypto';
import * as v from 'valibot';
import { error, invalid } from '@sveltejs/kit';
import { form, getRequestEvent, query } from '$app/server';
import { APPROVE_PASSWORD } from '$app/env/private';
import { db } from '#lib/server/db/index.js';
import { post } from '#lib/server/db/schema.js';
import { post_to_discord, delete_from_discord } from '#lib/discord.js';
import { desc, eq, or } from 'drizzle-orm';

const COOKIE_NAME = 'bsky-feed-pass';

function hash(value: string) {
	return createHash('sha256').update(value).digest('hex');
}

function is_authenticated() {
	const { cookies } = getRequestEvent();
	const cookie = cookies.get(COOKIE_NAME);
	if (!cookie) return false;
	const expected = hash(APPROVE_PASSWORD);
	if (cookie.length !== expected.length) return false;
	return timingSafeEqual(Buffer.from(cookie), Buffer.from(expected));
}

function guard() {
	if (!is_authenticated()) {
		error(401, 'Unauthorized');
	}
}

export const logged_in = query(async () => {
	return is_authenticated();
});

export const login = form(
	v.object({
		_password: v.pipe(v.string(), v.nonEmpty('Password is required'))
	}),
	async ({ _password }, issue) => {
		const { cookies } = getRequestEvent();
		if (_password !== APPROVE_PASSWORD) {
			invalid(issue._password('Wrong password'));
		}
		cookies.set(COOKIE_NAME, hash(APPROVE_PASSWORD), {
			path: '/',
			httpOnly: true,
			sameSite: 'lax',
			maxAge: 60 * 60 * 24 * 365
		});
		void logged_in().refresh();
		void get_pending_posts().refresh();
	}
);

type BskyPost = {
	uri: string;
	author: {
		handle: string;
		displayName?: string;
		avatar?: string;
	};
	record: {
		text: string;
		createdAt: string;
	};
};

async function fetch_bsky_posts(uris: string[]) {
	const posts = new Map<string, BskyPost>();
	// getPosts accepts at most 25 uris per call
	for (let i = 0; i < uris.length; i += 25) {
		const chunk = uris.slice(i, i + 25);
		const params = new URLSearchParams();
		for (const uri of chunk) params.append('uris', uri);
		try {
			const res = await fetch(`https://public.api.bsky.app/xrpc/app.bsky.feed.getPosts?${params}`);
			if (!res.ok) continue;
			const data = (await res.json()) as { posts: BskyPost[] };
			for (const bsky_post of data.posts) {
				posts.set(bsky_post.uri, bsky_post);
			}
		} catch {
			// ignore fetch failures, we'll fall back to the stored text
		}
	}
	return posts;
}

export const get_pending_posts = query(async () => {
	guard();

	const rows = await db
		.select()
		.from(post)
		.where(or(eq(post.confirmed, false), eq(post.reported, true)))
		.orderBy(desc(post.indexedAt), desc(post.cid))
		.execute();

	const bsky_posts = await fetch_bsky_posts(
		rows.map((row) => row.uri).filter((uri) => uri !== null)
	);

	return rows.map((row) => {
		const bsky_post = row.uri ? bsky_posts.get(row.uri) : undefined;
		return {
			uri: row.uri,
			indexedAt: row.indexedAt,
			text: bsky_post?.record.text ?? row.text,
			claude_answer: row.claude_answer,
			confirmed: row.confirmed,
			reported: row.reported,
			author: bsky_post?.author ?? null,
			url: row.uri
				?.replace('at://', 'https://bsky.app/profile/')
				.replace('app.bsky.feed.post', 'post')
		};
	});
});

export const approve = form(v.object({ uri: v.string() }), async ({ uri }) => {
	guard();

	const [row] = await db.select().from(post).where(eq(post.uri, uri)).execute();
	if (!row) error(404, 'Post not found');

	let discord_id = row.discord_id;
	if (!discord_id) {
		const message = await post_to_discord(uri);
		discord_id = message?.id ?? null;
	}

	await db
		.update(post)
		.set({ confirmed: true, reported: false, discord_id })
		.where(eq(post.uri, uri))
		.execute();

	void get_pending_posts().refresh();
});

export const remove_all = form(async () => {
	guard();

	const rows = await db
		.select()
		.from(post)
		.where(or(eq(post.confirmed, false), eq(post.reported, true)))
		.execute();

	for (const row of rows) {
		if (row.discord_id) {
			await delete_from_discord(row.discord_id);
		}
	}

	await db
		.delete(post)
		.where(or(eq(post.confirmed, false), eq(post.reported, true)))
		.execute();

	void get_pending_posts().refresh();
});

export const remove = form(v.object({ uri: v.string() }), async ({ uri }) => {
	guard();

	const [row] = await db.select().from(post).where(eq(post.uri, uri)).execute();
	if (!row) error(404, 'Post not found');

	if (row.discord_id) {
		await delete_from_discord(row.discord_id);
	}

	await db.delete(post).where(eq(post.uri, uri)).execute();

	void get_pending_posts().refresh();
});
