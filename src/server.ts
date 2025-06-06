import http from 'http';
import events from 'events';
import express from 'express';
import { DidResolver, MemoryCache } from '@atproto/identity';
import { createServer } from './lexicon/index.js';
import feedGeneration from './methods/feed-generation.js';
import describeGenerator from './methods/describe-generator.js';
import { FirehoseSubscription } from './subscription.js';
import { AppContext, Config } from './config.js';
import wellKnown from './well-known.js';
import confirm_posts from './confirm-posts.js';
import { db as database } from './db/index.js';
import reportPost from './methods/report-post.js';

export class FeedGenerator {
	public app: express.Application;
	public server?: http.Server;
	public db: typeof database;
	public firehose: FirehoseSubscription;
	public cfg: Config;

	constructor(
		app: express.Application,
		db: typeof database,
		firehose: FirehoseSubscription,
		cfg: Config,
	) {
		this.app = app;
		this.db = db;
		this.firehose = firehose;
		this.cfg = cfg;
	}

	static create(cfg: Config) {
		const app = express();
		const firehose = new FirehoseSubscription(
			database,
			cfg.subscriptionEndpoint,
		);

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
		const ctx: AppContext = {
			db: database,
			didResolver,
			cfg,
		};
		feedGeneration(server, ctx);
		describeGenerator(server, ctx);
		reportPost(server, ctx);
		app.use((req, res, next) => {
			console.log(req.method, req.hostname, req.path);
			next();
		});
		app.use(server.xrpc.router);
		app.use(wellKnown(ctx));
		app.use(confirm_posts(ctx));

		return new FeedGenerator(app, database, firehose, cfg);
	}

	async start(): Promise<http.Server> {
		this.firehose.run(this.cfg.subscriptionReconnectDelay);
		this.server = this.app.listen(this.cfg.port, this.cfg.listenhost);
		await events.once(this.server, 'listening');
		return this.server;
	}
}

export default FeedGenerator;
