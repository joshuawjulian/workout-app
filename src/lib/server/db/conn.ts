//connect to the postgres database and return postgresjs client
import { env } from '$env/dynamic/private';
import { drizzle } from 'drizzle-orm/postgres-js';
import * as authSchema from '../../schema/auth.schema';
import * as dictSchema from '../../schema/dict.schema';

const connectionString = env.POSTGRES_URL;
if (!connectionString) {
	throw new Error('POSTGRES_URL environment variable is not set');
}

const schema = {
	...authSchema,
	...dictSchema
	// Add other schemas here as they're created
};

export const db = drizzle(connectionString, { logger: false, schema });
