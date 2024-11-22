export default function (server, ctx) {
    server.com.atproto.moderation.createReport(async ({ input, req }) => {
        console.log(input, req.rawHeaders);
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
