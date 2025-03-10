import { inArray } from 'drizzle-orm';
import { check } from './ai.js';
import { post } from './db/schema.js';
import { isCommit, } from './lexicon/types/com/atproto/sync/subscribeRepos.js';
import { FirehoseSubscriptionBase, getOpsByType } from './util/subscription.js';
import fs from 'node:fs/promises';
const known_svelte_words = [
    'sveltekit',
    'svelte-kit',
    'svelte kit',
    'sveltejs',
    'svelte js',
    'svelte.dev',
    'sveltesociety.dev',
    'svelte.london',
];
let known_dids;
let known_dids_last_read_at;
let banned_dids;
let banned_dids_last_read_at;
export class FirehoseSubscription extends FirehoseSubscriptionBase {
    async handleEvent(evt) {
        if (!isCommit(evt))
            return;
        if (evt.blocks.length === 0)
            return;
        let ops;
        try {
            ops = await getOpsByType(evt);
        }
        catch { }
        if (!ops) {
            console.log("can't get ops by type", evt.repo, evt.blocks.length);
            return;
        }
        const postsToDelete = ops.posts.deletes.map((del) => del.uri);
        const postsToCreatePromises = await Promise.allSettled(ops.posts.creates
            .filter((create) => {
            // only svelte-related posts
            return (create.record.text.toLowerCase().includes('svelte') ||
                create.record.embed?.images?.some((img) => img.alt?.toLowerCase().includes('svelte')) ||
                (create.author === process.env.FEEDGEN_PUBLISHER_DID &&
                    (!banned_dids || !banned_dids.has(create.author))));
        })
            .map(async (create) => {
            try {
                const stat = await fs.stat('known-dids.json');
                if (!known_dids ||
                    !known_dids_last_read_at ||
                    stat.mtime.getTime() > known_dids_last_read_at.getTime()) {
                    let known_dids_string = await fs.readFile('known-dids.json', 'utf-8');
                    known_dids = new Set(JSON.parse(known_dids_string));
                    known_dids_last_read_at = stat.mtime;
                    console.log('known dids read at time', stat.mtime.toString());
                }
            }
            catch {
                console.log('something went wrong reading the known dids file');
            }
            try {
                const stat = await fs.stat('banned-dids.json');
                if (!banned_dids ||
                    !banned_dids_last_read_at ||
                    stat.mtime.getTime() > banned_dids_last_read_at.getTime()) {
                    let banned_dids_string = await fs.readFile('banned-dids.json', 'utf-8');
                    banned_dids = new Set(JSON.parse(banned_dids_string));
                    banned_dids_last_read_at = stat.mtime;
                    console.log('banned dids read at time', stat.mtime.toString());
                }
            }
            catch {
                console.log('something went wrong reading the banned dids file');
            }
            let text = create.record.text.toLowerCase();
            // this will always be true unless it's a post by me that doesn't mention svelte (i know it's impossible)
            let include = text.includes('svelte');
            // if the text doesn't include svelte let's try with the images
            if (!include && create.author !== process.env.FEEDGEN_PUBLISHER_DID) {
                text = create.record.embed?.images
                    ?.filter((img) => img.alt?.toLowerCase().includes('svelte'))
                    .map((img) => img.alt)
                    .join('');
                include = text.includes('svelte');
                console.log('using alt images');
            }
            console.log(text);
            let claude_answer;
            if ((known_dids == null || !known_dids.has(create.author)) &&
                !known_svelte_words.some((word) => text.includes(word))) {
                // if we don't have any known svelte word in the post we can check with
                // claude 💰💰💰
                console.log('using claude to determine');
                ({ result: include, text: claude_answer } = await check(text));
            }
            const banned = banned_dids != null && banned_dids.has(create.author);
            console.log(include, text, banned);
            // map svelte-related posts to a db row
            return {
                uri: create.uri,
                cid: create.cid,
                indexedAt: new Date().toISOString(),
                confirmed: include,
                text: include ? undefined : create.record.text,
                claude_answer,
                banned,
            };
        }));
        const postsToCreate = postsToCreatePromises
            .filter((post) => post.status === 'fulfilled')
            .filter((post) => !post.value.banned)
            .map((post) => post.value);
        if (postsToDelete.length > 0) {
            await this.db
                .delete(post)
                .where(inArray(post.uri, postsToDelete))
                .execute();
        }
        if (postsToCreate.length > 0) {
            await this.db
                .insert(post)
                .values(postsToCreate)
                .onConflictDoNothing()
                .execute();
        }
    }
}
