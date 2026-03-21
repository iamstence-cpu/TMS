import { z } from 'zod';

const envSchema = z.object({
  DATABASE_URL: z.string().min(1),
  LLM_PROVIDER: z.string().default('openai-compatible'),
  LLM_MODEL: z.string().default('gpt-4o-mini'),
  OPENAI_API_KEY: z.string().optional(),
  OPENAI_BASE_URL: z.string().default('https://api.openai.com/v1')
});

export const env = envSchema.parse({
  DATABASE_URL: process.env.DATABASE_URL,
  LLM_PROVIDER: process.env.LLM_PROVIDER,
  LLM_MODEL: process.env.LLM_MODEL,
  OPENAI_API_KEY: process.env.OPENAI_API_KEY,
  OPENAI_BASE_URL: process.env.OPENAI_BASE_URL
});
