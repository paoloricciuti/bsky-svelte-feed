import { Subscription } from '@atproto/xrpc-server';
import { cborToLexRecord, readCar } from '@atproto/repo';
import { BlobRef } from '@atproto/lexicon';
import { ids, lexicons } from '../lexicon/lexicons.js';
import { isCommit, } from '../lexicon/types/com/atproto/sync/subscribeRepos.js';
import { sub_state } from '../db/schema.js';
import { eq } from 'drizzle-orm';
import { DidResolver, getPds } from '@atproto/identity';
const did_resolver = new DidResolver({});
export class FirehoseSubscriptionBase {
    db;
    service;
    sub;
    constructor(db, service) {
        this.db = db;
        this.service = service;
        this.sub = new Subscription({
            service: service,
            method: ids.ComAtprotoSyncSubscribeRepos,
            getParams: () => this.getCursor(),
            validate: (value) => {
                try {
                    return lexicons.assertValidXrpcMessage(ids.ComAtprotoSyncSubscribeRepos, value);
                }
                catch (err) {
                    console.error('repo subscription skipped invalid message', err);
                }
            },
        });
    }
    async run(subscriptionReconnectDelay) {
        try {
            for await (const evt of this.sub) {
                this.handleEvent(evt).catch(async (err) => {
                    if (isCommit(evt)) {
                        const ops = await getOpsByType(evt);
                        console.log(ops);
                    }
                    console.error('repo subscription could not handle message', err.stack);
                });
                // update stored cursor every 20 events or so
                if (isCommit(evt) && evt.seq % 20 === 0) {
                    await this.updateCursor(evt.seq);
                }
            }
        }
        catch (err) {
            console.error('repo subscription errored', err);
            setTimeout(() => this.run(subscriptionReconnectDelay), subscriptionReconnectDelay);
        }
    }
    async updateCursor(cursor) {
        await this.db
            .update(sub_state)
            .set({ cursor })
            .where(eq(sub_state.service, this.service))
            .execute();
    }
    async getCursor() {
        const res = await this.db
            .select()
            .from(sub_state)
            .where(eq(sub_state.service, this.service))
            .execute();
        return res && res[0] ? { cursor: res[0].cursor } : {};
    }
}
async function get_author(author_did) {
    const did_document = await did_resolver.resolve(author_did);
    if (!did_document)
        return;
    const pds = getPds(did_document);
    const getRecordUrl = new URL(`${pds}/xrpc/com.atproto.repo.getRecord`);
    getRecordUrl.searchParams.set('repo', did_document.id);
    getRecordUrl.searchParams.set('collection', 'app.bsky.actor.profile');
    getRecordUrl.searchParams.set('rkey', 'self');
    return fetch(getRecordUrl.toString(), {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
    }).then((res) => res.json());
}
export const getOpsByType = async (evt) => {
    const car = await readCar(evt.blocks);
    const opsByType = {
        posts: { creates: [], deletes: [] },
        reposts: { creates: [], deletes: [] },
        likes: { creates: [], deletes: [] },
        follows: { creates: [], deletes: [] },
    };
    for (const op of evt.ops) {
        const uri = `at://${evt.repo}/${op.path}`;
        const [collection] = op.path.split('/');
        if (op.action === 'update')
            continue; // updates not supported yet
        if (op.action === 'create') {
            if (!op.cid)
                continue;
            const recordBytes = car.blocks.get(op.cid);
            if (!recordBytes)
                continue;
            const record = cborToLexRecord(recordBytes);
            const create = {
                uri,
                cid: op.cid.toString(),
                author: evt.repo,
                get_author() {
                    return get_author(evt.repo).catch(() => {
                        console.log("couldn't get author");
                        return {};
                    });
                },
            };
            if (collection === ids.AppBskyFeedPost && isPost(record)) {
                opsByType.posts.creates.push({ record, ...create });
            }
            else if (collection === ids.AppBskyFeedRepost && isRepost(record)) {
                opsByType.reposts.creates.push({ record, ...create });
            }
            else if (collection === ids.AppBskyFeedLike && isLike(record)) {
                opsByType.likes.creates.push({ record, ...create });
            }
            else if (collection === ids.AppBskyGraphFollow && isFollow(record)) {
                opsByType.follows.creates.push({ record, ...create });
            }
        }
        if (op.action === 'delete') {
            if (collection === ids.AppBskyFeedPost) {
                opsByType.posts.deletes.push({ uri });
            }
            else if (collection === ids.AppBskyFeedRepost) {
                opsByType.reposts.deletes.push({ uri });
            }
            else if (collection === ids.AppBskyFeedLike) {
                opsByType.likes.deletes.push({ uri });
            }
            else if (collection === ids.AppBskyGraphFollow) {
                opsByType.follows.deletes.push({ uri });
            }
        }
    }
    return opsByType;
};
export const isPost = (obj) => {
    return isType(obj, ids.AppBskyFeedPost);
};
export const isRepost = (obj) => {
    return isType(obj, ids.AppBskyFeedRepost);
};
export const isLike = (obj) => {
    return isType(obj, ids.AppBskyFeedLike);
};
export const isFollow = (obj) => {
    return isType(obj, ids.AppBskyGraphFollow);
};
const isType = (obj, nsid) => {
    try {
        lexicons.assertValidRecord(nsid, fixBlobRefs(obj));
        return true;
    }
    catch (err) {
        return false;
    }
};
// @TODO right now record validation fails on BlobRefs
// simply because multiple packages have their own copy
// of the BlobRef class, causing instanceof checks to fail.
// This is a temporary solution.
const fixBlobRefs = (obj) => {
    if (Array.isArray(obj)) {
        return obj.map(fixBlobRefs);
    }
    if (obj && typeof obj === 'object') {
        if (obj.constructor.name === 'BlobRef') {
            const blob = obj;
            return new BlobRef(blob.ref, blob.mimeType, blob.size, blob.original);
        }
        return Object.entries(obj).reduce((acc, [key, val]) => {
            return Object.assign(acc, { [key]: fixBlobRefs(val) });
        }, {});
    }
    return obj;
};
