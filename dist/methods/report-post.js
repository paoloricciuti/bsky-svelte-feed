import { eq } from 'drizzle-orm';
import { validateAuth } from '../auth.js';
import { post } from '../db/schema.js';
export default function (server, ctx) {
    server.com.atproto.moderation.createReport(async ({ input, req }) => {
        const requesterDid = await validateAuth(req, null, ctx.didResolver);
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
        if (requesterDid === process.env.FEEDGEN_PUBLISHER_DID) {
            if (already_exists && already_exists.confirmed) {
                await ctx.db
                    .delete(post)
                    .where(eq(post.uri, already_exists.uri))
                    .execute();
            }
            else if (already_exists && !already_exists.confirmed) {
                await ctx.db
                    .update(post)
                    .set({
                    confirmed: true,
                })
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
        }
        else {
            if (already_exists && already_exists.confirmed) {
                await ctx.db
                    .update(post)
                    .set({
                    reported: true,
                })
                    .where(eq(post.uri, already_exists.uri))
                    .execute();
            }
            else if (!already_exists) {
                await ctx.db
                    .insert(post)
                    .values({
                    cid: input.body.subject.cid,
                    uri: input.body.subject.uri,
                    indexedAt: new Date().toISOString(),
                    confirmed: false,
                    claude_answer: input.body.reason || 'reported',
                })
                    .onConflictDoNothing()
                    .execute();
            }
        }
        delete input.body.subject.type;
        return {
            encoding: 'application/json',
            body: {
                ...input.body,
                createdAt: new Date().toISOString(),
                id: Date.now(),
                reportedBy: requesterDid,
            },
        };
    });
}
