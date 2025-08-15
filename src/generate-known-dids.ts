import { Agent } from '@atproto/api';
import { ListItemView } from './lexicon/types/app/bsky/graph/defs.js';
import fs from 'node:fs/promises';

const [, , name = 'known-dids'] = process.argv;

console.log('Updating', name, '...');

const NAME_TO_LIST_MAP = {
	'known-dids': process.env.KNOWN_LISTS,
	'banned-dids': process.env.BANNED_LISTS,
	'mod-dids': process.env.MOD_LISTS,
};

const agent = new Agent('https://public.api.bsky.app');

let global_list: Array<string> = [];

async function fetch_known_list(list_uri: string) {
	let list: Array<ListItemView> = [];

	async function fetch_list(cursor?: string) {
		let bsky_list = await agent.app.bsky.graph.getList({
			list: list_uri,
			cursor,
		});

		list.push(...bsky_list.data.items);
		return [bsky_list.data.cursor, bsky_list.data.list.listItemCount] as const;
	}

	let [cursor, count] = await fetch_list();

	while (count != null && list.length < count) {
		[cursor, count] = await fetch_list(cursor);
	}

	console.log('fetched list ', list_uri);
	global_list.push(...list.map((user) => user.subject.did));
}

for (let list of NAME_TO_LIST_MAP[name]?.split(',') ?? []) {
	await fetch_known_list(list);
}

fs.writeFile(name + '.json', JSON.stringify([...new Set(global_list)]));
