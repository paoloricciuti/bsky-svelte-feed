import type { AtUriString } from '@atproto/lex';
import { Client } from '@atproto/lex';
import fs from 'node:fs/promises';
import * as app from '../src/lexicons/app.ts';
import type { ListItemView } from '../src/lexicons/app/bsky/graph/defs.defs.ts';
import { PasswordSession } from '@atproto/lex-password-session';

const NAME_TO_LIST_MAP = {
	'known-dids': process.env.KNOWN_LISTS,
	'banned-dids': process.env.BANNED_LISTS,
	'mod-dids': process.env.MOD_LISTS
};

const requested_names = process.argv.slice(2);
const names = (requested_names.length > 0 ? requested_names : ['known-dids']).map((name) => {
	if (!Object.hasOwn(NAME_TO_LIST_MAP, name)) {
		throw new Error(`Unknown list name: ${name}`);
	}

	return name as keyof typeof NAME_TO_LIST_MAP;
});

async function login() {
	const service = process.env.PUBLISHER_PDS!;
	const identifier = process.env.PUBLISHER_DID!;
	const password = process.env.PUBLISHER_PASSWORD!;
	const session = await PasswordSession.login({
		service,
		identifier,
		password
	});

	return session;
}

await using session = await login();

const agent = new Client(session);

async function regenerate(name: keyof typeof NAME_TO_LIST_MAP) {
	console.log('Updating', name, '...');
	const global_list: Array<string> = [];

	async function fetch_known_list(list_uri: string) {
		const list: Array<ListItemView> = [];

		async function fetch_list(cursor?: string) {
			const bsky_list = await agent.call(app.bsky.graph.getList, {
				list: list_uri as AtUriString,
				cursor
			});

			list.push(...bsky_list.items);
			return [bsky_list.cursor, bsky_list.list.listItemCount] as const;
		}

		let [cursor, count] = await fetch_list();

		while (count != null && list.length < count) {
			[cursor, count] = await fetch_list(cursor);
		}

		console.log('fetched list', list_uri, list.length);
		global_list.push(...list.map((user) => user.subject.did));
	}

	for (const list of NAME_TO_LIST_MAP[name]?.split(',') ?? []) {
		await fetch_known_list(list);
	}

	console.log('Updating', name + '.json', 'with', global_list.length, 'items');
	await fs.writeFile(name + '.json', JSON.stringify([...new Set(global_list)]));
}

for (const name of names) {
	await regenerate(name);
}
