import { AppContext } from '../config.js';
import { Server } from '../lexicon/index.js';

export default function (server: Server, ctx: AppContext) {
	server.com.atproto.moderation.createReport(async ({ input, req }) => {
		console.log(input, req.body);
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
