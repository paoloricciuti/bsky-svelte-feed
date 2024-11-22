import { eq } from 'drizzle-orm';
import { validateAuth } from '../auth.js';
import { post } from '../db/schema.js';
export default function (server, ctx) {
    server.com.atproto.moderation.createReport(async ({ input, req }) => {
        const requesterDid = await validateAuth(req, null, ctx.didResolver);
        if (requesterDid !== process.env.FEEDGEN_PUBLISHER_DID) {
            return {
                status: 401,
            };
        }
        if (typeof input.body.subject.uri !== 'string' ||
            typeof input.body.subject.cid !== 'string') {
            return {
                status: 500,
            };
        }
        const [already_exists] = await ctx.db
            .select()
            .from(post)
            .where(eq(post.uri, input.body.subject.uri))
            .execute();
        if (already_exists) {
            await ctx.db
                .delete(post)
                .where(eq(post.uri, already_exists.uri))
                .execute();
        }
        else {
            await ctx.db
                .insert(post)
                .values({
                cid: input.body.subject.cid,
                uri: input.body.subject.uri,
                indexedAt: new Date().toISOString(),
            })
                .onConflictDoNothing()
                .execute();
        }
        return {
            status: 200,
            encoding: 'application/json',
            body: {
                createdAt: new Date().toISOString(),
            },
        };
    });
}
