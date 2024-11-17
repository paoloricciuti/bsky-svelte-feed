import algos from '../algos/index.js';
import { AtUri } from '@atproto/syntax';
export default function (server, ctx) {
    server.app.bsky.feed.describeFeedGenerator(async () => {
        const feeds = Object.keys(algos).map((shortname) => ({
            uri: AtUri.make(ctx.cfg.publisherDid, 'app.bsky.feed.generator', shortname).toString(),
        }));
        return {
            encoding: 'application/json',
            body: {
                did: ctx.cfg.serviceDid,
                feeds,
            },
        };
    });
}
