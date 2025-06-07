import { defineConfig } from 'drizzle-kit';
import * as dotenv from 'dotenv';


dotenv.config();

const DATABASE_URL = process.env.PUBLIC_DATABASE_URL || 'dummy:postgres';

if (!DATABASE_URL) {
	console.warn('DATABASE_URL is not set. Drizzle operations may fail.');
}

export default defineConfig({
	schema: './src/lib/server/db/schema.ts',
	dbCredentials: {
		url: DATABASE_URL || ''
	},
	verbose: true,
	strict: true,
	dialect: 'postgresql'
});