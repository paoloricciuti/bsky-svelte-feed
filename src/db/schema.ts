import { sqliteTable, integer, text } from 'drizzle-orm/sqlite-core';

export const post = sqliteTable('posts', {
	uri: text(),
	cid: text(),
	indexedAt: text(),
	text: text(),
	claude_answer: text(),
	confirmed: integer({ mode: 'boolean' }).default(true),
	reported: integer({ mode: 'boolean' }).default(false),
});

export const sub_state = sqliteTable('sub_state', {
	service: text(),
	cursor: integer(),
});
