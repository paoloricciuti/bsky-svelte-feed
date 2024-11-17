import { Agent } from '@atproto/api';
import fs from 'node:fs/promises';
const agent = new Agent('https://public.api.bsky.app');
let global_list = [];
async function fetch_known_list(list_uri) {
    let list = [];
    async function fetch_list(cursor) {
        let bsky_list = await agent.app.bsky.graph.getList({
            list: 'at://did:plc:nlvjelw3dy3pddq7qoglleko/app.bsky.graph.list/3l6ucet66fw2w',
            cursor,
        });
        list.push(...bsky_list.data.items);
        return [bsky_list.data.cursor, bsky_list.data.list.listItemCount];
    }
    let [cursor, count] = await fetch_list();
    while (count != null && list.length < count) {
        [cursor, count] = await fetch_list(cursor);
    }
    console.log('fetched list ', list_uri);
    global_list.push(...list.map((user) => user.subject.did));
}
for (let list of process.env.KNOWN_LISTS?.split(',') ?? []) {
    await fetch_known_list(list);
}
fs.writeFile('known-dids.json', JSON.stringify([...new Set(global_list)]));
