import { defineConfig } from 'drizzle-kit';

export default defineConfig({
	schema: './src/lib/schema/*.schema.ts',
	out: './.drizzle',
	dialect: 'postgresql',
	dbCredentials: {
		url: process.env.POSTGRES_URL || ''
	},
	breakpoints: true,
	verbose: true
});
