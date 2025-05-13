import { parseEnv } from 'znv';
import { z } from 'zod';
import 'dotenv/config';

export const {
  NODE_ENV = 'development',

  PORT = 3000,
} = parseEnv(process.env, {
  NODE_ENV: z.enum(['development', 'test', 'production']).optional(),

  PORT: z.number().optional(),
});
