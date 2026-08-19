import { building } from '$app/env';
import { defineEnvVars } from '@sveltejs/kit/env';
import * as v from 'valibot';

export const variables = defineEnvVars({
	DATABASE_URL: { description: 'The database connection string.', static: true },
	PUBLISHER_PDS: { description: 'The publisher PDS URL.', static: true },
	PUBLISHER_DID: { description: 'The publisher DID.', static: true },
	PUBLISHER_PASSWORD: { description: 'The publisher password.', static: true },
	FEED_NAME: { description: 'The feed name.', static: true },
	FEED_HOSTNAME: { description: 'The hostname of the server hosting the feed.', static: true },
	DISCORD_WEBHOOK_URL: {
		description: 'The Discord webhook URL.',
		static: true,
		schema: building ? v.optional(v.string()) : v.string()
	}
});
