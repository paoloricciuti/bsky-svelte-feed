import { Client, type DatetimeString } from '@atproto/lex';
import { PasswordSession } from '@atproto/lex-password-session';
import * as app from '../lexicons/app.js';
import {
	PUBLISHER_PDS,
	PUBLISHER_DID,
	PUBLISHER_PASSWORD,
	FEED_NAME,
	FEED_HOSTNAME
} from '$app/env/private';
import { getTunnelUrl } from 'virtual:vite-plugin-cloudflare-tunnel';
import { dev } from '$app/env';

// Create a session
async function login() {
	const service = PUBLISHER_PDS;
	const identifier = PUBLISHER_DID;
	const password = PUBLISHER_PASSWORD;
	const session = await PasswordSession.login({
		service,
		identifier,
		password
	});

	return session;
}

export async function get_feed_info() {
	const feed_uri = `at://${PUBLISHER_DID}/app.bsky.feed.generator/${FEED_NAME}`;
	if (dev) {
		return { url: new URL(getTunnelUrl()), feed_uri };
	}
	return { url: new URL(`https://${FEED_HOSTNAME}`), feed_uri };
}

if (dev) {
	const session = await login();
	const client = new Client(session);

	const url = new URL(getTunnelUrl());

	try {
		const feed = await client.get(app.bsky.feed.generator, {
			rkey: FEED_NAME
		});

		await client.put(
			app.bsky.feed.generator,
			{
				...feed.value,
				did: `did:web:${url.host}`
			},
			{ rkey: FEED_NAME }
		);
	} catch {
		// no feed let's create one
		await client.create(
			app.bsky.feed.generator,
			{
				did: `did:web:${url.host}`,
				createdAt: new Date().toISOString() as DatetimeString,
				description: 'A test feed that tunnels to development',
				displayName: 'Test 🧪'
			},
			{ rkey: FEED_NAME }
		);
	}
}
