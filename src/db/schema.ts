import { sqliteTable, integer, text } from 'drizzle-orm/sqlite-core';

export const post = sqliteTable('posts', {
	uri: text(),
	cid: text(),
	indexedAt: text(),
	confirmed: integer({ mode: 'boolean' }).default(true),
});

export const sub_state = sqliteTable('sub_state', {
	service: text(),
	cursor: integer(),
});
