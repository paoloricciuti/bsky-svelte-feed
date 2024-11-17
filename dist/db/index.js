import 'dotenv/config';
import { drizzle } from 'drizzle-orm/libsql';
import { createClient } from '@libsql/client';
console.log(process.env.FEEDGEN_SQLITE_LOCATION);
const sqlite = createClient({
    url: 'file:' + process.env.FEEDGEN_SQLITE_LOCATION,
});
export const db = drizzle(sqlite);
