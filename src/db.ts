import path from 'node:path';
import postgres from 'postgres';
import { drizzle } from 'drizzle-orm/postgres-js';
import { DRIZZLE_DEBUG, POSTGRES_URL } from './config.js';
import { migrate } from 'drizzle-orm/node-postgres/migrator';

export const client = postgres(POSTGRES_URL);
export const db = drizzle(client, { logger: DRIZZLE_DEBUG, casing: 'snake_case' });

const MIGRATIONS_DIR = path.join(import.meta.dirname, '..', 'migrations');

export const runMigrations = async () => {
  await migrate(db, { migrationsFolder: MIGRATIONS_DIR });
};

export const disconnectFromDb = async () => {
  await client.end();
};
