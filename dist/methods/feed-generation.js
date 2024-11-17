import { AtUri } from '@atproto/syntax';
import { InvalidRequestError } from '@atproto/xrpc-server';
import algos from '../algos/index.js';
export default function (server, ctx) {
    server.app.bsky.feed.getFeedSkeleton(async ({ params, req }) => {
        const feedUri = new AtUri(params.feed);
        const algo = algos[feedUri.rkey];
        if (feedUri.hostname !== ctx.cfg.publisherDid ||
            feedUri.collection !== 'app.bsky.feed.generator' ||
            !algo) {
            throw new InvalidRequestError('Unsupported algorithm', 'UnsupportedAlgorithm');
        }
        const body = await algo(ctx, params);
        return {
            encoding: 'application/json',
            body: body,
        };
    });
}
