import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import { env } from '$env/dynamic/private';
import * as schema from './schema';

// Use the DATABASE_URL from environment variables
// If during build, use a dummy connection that won't actually be used
const connectionString = env.DATABASE_URL;

// Create the PostgreSQL connection with connection pooling configuration
const client = postgres(connectionString as string, {
  max: 10, // maximum number of connections
  idle_timeout: 20, // how long a connection can stay idle before being closed (in seconds)
  connect_timeout: 10 // connection timeout (in seconds)
});

// Initialize drizzle with the schema
export const db = drizzle(client, { schema });

// Initialize database
import { initDatabase } from './init';
initDatabase().catch(console.error);