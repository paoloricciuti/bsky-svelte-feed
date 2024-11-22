export default function (server, ctx) {
    server.com.atproto.moderation.createReport(async ({ params, input, auth }) => {
        console.log(params, input, auth);
        return {
            status: 200,
        };
    });
}
