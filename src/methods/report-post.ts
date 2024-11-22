import { AppContext } from '../config.js';
import { Server } from '../lexicon/index.js';

export default function (server: Server, ctx: AppContext) {
	server.com.atproto.moderation.createReport(
		async ({ params, input, auth }) => {
			console.log(params, input, auth);
			return {
				status: 200,
			};
		},
	);
}
