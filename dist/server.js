import events from 'events';
import express from 'express';
import { DidResolver, MemoryCache } from '@atproto/identity';
import { createServer } from './lexicon/index.js';
import feedGeneration from './methods/feed-generation.js';
import describeGenerator from './methods/describe-generator.js';
import { FirehoseSubscription } from './subscription.js';
import wellKnown from './well-known.js';
import { db as database } from './db/index.js';
export class FeedGenerator {
    app;
    server;
    db;
    firehose;
    cfg;
    constructor(app, db, firehose, cfg) {
        this.app = app;
        this.db = db;
        this.firehose = firehose;
        this.cfg = cfg;
    }
    static create(cfg) {
        const app = express();
        const firehose = new FirehoseSubscription(database, cfg.subscriptionEndpoint);
        const didCache = new MemoryCache();
        const didResolver = new DidResolver({
            plcUrl: 'https://plc.directory',
            didCache,
        });
        const server = createServer({
            validateResponse: true,
            payload: {
                jsonLimit: 100 * 1024, // 100kb
                textLimit: 100 * 1024, // 100kb
                blobLimit: 5 * 1024 * 1024, // 5mb
            },
        });
        const ctx = {
            db: database,
            didResolver,
            cfg,
        };
        feedGeneration(server, ctx);
        describeGenerator(server, ctx);
        app.use((req, res, next) => {
            console.log(req.method, req.hostname, req.path);
            next();
        });
        app.use(server.xrpc.router);
        app.use(wellKnown(ctx));
        return new FeedGenerator(app, database, firehose, cfg);
    }
    async start() {
        this.firehose.run(this.cfg.subscriptionReconnectDelay);
        this.server = this.app.listen(this.cfg.port, this.cfg.listenhost);
        await events.once(this.server, 'listening');
        return this.server;
    }
}
export default FeedGenerator;
