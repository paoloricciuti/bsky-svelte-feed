"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.handler = exports.shortname = void 0;
const schema_1 = require("../db/schema");
const drizzle_orm_1 = require("drizzle-orm");
// max 15 chars
exports.shortname = 'whats-alf';
const handler = (ctx, params) => __awaiter(void 0, void 0, void 0, function* () {
    let timeStr;
    if (params.cursor) {
        timeStr = new Date(parseInt(params.cursor, 10)).toISOString();
    }
    let builder = ctx.db
        .select()
        .from(schema_1.post)
        .where(timeStr ? (0, drizzle_orm_1.lt)(schema_1.post.indexedAt, timeStr) : undefined)
        .orderBy(schema_1.post.indexedAt, schema_1.post.cid)
        .limit(params.limit);
    const res = yield builder.execute();
    const feed = res.map((row) => ({
        post: row.uri,
    }));
    let cursor;
    const last = res.at(-1);
    if (last && last.indexedAt) {
        cursor = new Date(last.indexedAt).getTime().toString(10);
    }
    return {
        cursor,
        feed,
    };
});
exports.handler = handler;
