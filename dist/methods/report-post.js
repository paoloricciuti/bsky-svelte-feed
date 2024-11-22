import { validateAuth } from '../auth.js';
export default function (server, ctx) {
    server.com.atproto.moderation.createReport(async ({ input, req }) => {
        const requesterDid = await validateAuth(req, null, ctx.didResolver);
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
