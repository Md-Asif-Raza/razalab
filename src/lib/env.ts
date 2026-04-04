import { z } from 'zod';

const EnvSchema = z.object({
  NEXT_PUBLIC_SUPABASE_URL:      z.string().url(),
  NEXT_PUBLIC_SUPABASE_ANON_KEY: z.string().min(10),
  SUPABASE_SERVICE_ROLE_KEY:     z.string().min(10),
  SUPABASE_JWT_SECRET:           z.string().min(10),
  NEXT_PUBLIC_SITE_URL:          z.string().url().optional().default('http://localhost:3000'),
  SESSION_SECRET:                z.string().min(32),
  NODE_ENV:                      z.enum(['development', 'production', 'test']).default('development'),
}).partial({
  SUPABASE_JWT_SECRET: true,
  SESSION_SECRET: true,
});

// We validate immediately on import
const processEnv = {
  NEXT_PUBLIC_SUPABASE_URL:      process.env.NEXT_PUBLIC_SUPABASE_URL,
  NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  SUPABASE_SERVICE_ROLE_KEY:     process.env.SUPABASE_SERVICE_ROLE_KEY,
  SUPABASE_JWT_SECRET:           process.env.SUPABASE_JWT_SECRET,
  NEXT_PUBLIC_SITE_URL:          process.env.NEXT_PUBLIC_SITE_URL,
  SESSION_SECRET:                process.env.SESSION_SECRET,
  NODE_ENV:                      process.env.NODE_ENV,
};

const parsed = EnvSchema.safeParse(processEnv);

if (!parsed.success) {
  const isDev = process.env.NODE_ENV !== 'production';
  console.error('❌ Invalid environment variables:', parsed.error.flatten().fieldErrors);
  
  if (!isDev) {
    throw new Error('Invalid environment variables. Check your .env file or environment settings.');
  }
}

// Fallbacks for development to prevent crashes
export const env = {
  ...parsed.data,
  SESSION_SECRET: parsed.data?.SESSION_SECRET || 'a-very-secret-fallback-string-32-chars-long',
  SUPABASE_JWT_SECRET: parsed.data?.SUPABASE_JWT_SECRET || 'fallback-jwt-secret',
} as z.infer<typeof EnvSchema> & { SESSION_SECRET: string; SUPABASE_JWT_SECRET: string };
