//connect to the postgres database and return postgresjs client
import { env } from '$env/dynamic/private';
import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';

const connectionString = env.POSTGRES_URL;
if (!connectionString) {
	throw new Error('POSTGRES_URL environment variable is not set');
}

export const sql = postgres(connectionString, {
	max: 1, // Set the maximum number of connections to 1
	idle_timeout: 1000 // Set the idle timeout to 1 second
});
export const db = drizzle(sql);
