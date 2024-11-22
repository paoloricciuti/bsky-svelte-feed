import { validateAuth } from '../auth.js';
import { AppContext } from '../config.js';
import { Server } from '../lexicon/index.js';

export default function (server: Server, ctx: AppContext) {
	server.com.atproto.moderation.createReport(async ({ input, req }) => {
		const requesterDid = await validateAuth(
			req,
			ctx.cfg.serviceDid,
			ctx.didResolver,
		);

		console.log(input, req.rawHeaders, requesterDid);

		return {
			status: 200,
			encoding: 'application/json',
			body: {
				createdAt: new Date().toISOString(),
				id: 0,
				reasonType: 'com.atproto.moderation.defs#reasonOther',
				reportedBy: '',
				subject: { ...input },
			},
		};
	});
}
