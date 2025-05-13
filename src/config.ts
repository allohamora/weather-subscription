import { parseEnv } from 'znv';
import { z } from 'zod';
import 'dotenv/config';

export const {
  NODE_ENV = 'development',
  PORT = 3000,

  POSTGRES_URL,
  DRIZZLE_DEBUG = true,

  JWT_SECRET,
  JWT_EXPIRES_IN,
} = parseEnv(process.env, {
  NODE_ENV: z.enum(['development', 'test', 'production']).optional(),
  PORT: z.number().optional(),

  POSTGRES_URL: z.string().url(),
  DRIZZLE_DEBUG: z.boolean().optional(),

  JWT_SECRET: z.string(),
  JWT_EXPIRES_IN: z.number(),
});
