import { drizzle, NeonClient } from 'drizzle-orm/neon-serverless';
import { neon } from '@neondatabase/serverless';
import * as schema from './schema';

if (!process.env.DATABASE_URL) {
  throw new Error('DATABASE_URL environment variable is not set');
}

// Create the Neon client with proper typing
const sql = neon(process.env.DATABASE_URL);
export const db = drizzle(sql as unknown as NeonClient, { schema });

export * from './schema';
