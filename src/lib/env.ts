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

const isServer = typeof window === 'undefined';

// We validate immediately on import, but only for the environment we are in
const processEnv = {
  NEXT_PUBLIC_SUPABASE_URL:      process.env.NEXT_PUBLIC_SUPABASE_URL,
  NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  SUPABASE_SERVICE_ROLE_KEY:     process.env.SUPABASE_SERVICE_ROLE_KEY,
  SUPABASE_JWT_SECRET:           process.env.SUPABASE_JWT_SECRET,
  NEXT_PUBLIC_SITE_URL:          process.env.NEXT_PUBLIC_SITE_URL,
  SESSION_SECRET:                process.env.SESSION_SECRET,
  NODE_ENV:                      process.env.NODE_ENV,
};

// If on client, we only care about NEXT_PUBLIC_ variables
const schemaToUse = isServer ? EnvSchema : EnvSchema.partial({
  SUPABASE_SERVICE_ROLE_KEY: true,
  SUPABASE_JWT_SECRET: true,
  SESSION_SECRET: true,
});

const parsed = schemaToUse.safeParse(processEnv);

if (!parsed.success) {
  const isDev = process.env.NODE_ENV !== 'production';
  // Only log full errors on server or if public vars are missing on client
  if (isServer || !parsed.error.issues.every(i => !i.path.includes('NEXT_PUBLIC'))) {
    console.error('❌ Invalid environment variables:', parsed.error.flatten().fieldErrors);
    if (!isDev) throw new Error('Invalid environment variables.');
  }
}

export const env = {
  ...parsed.data,
  SESSION_SECRET: parsed.data?.SESSION_SECRET || 'fallback-secret-for-client-bundle',
  SUPABASE_JWT_SECRET: parsed.data?.SUPABASE_JWT_SECRET || 'fallback-jwt-for-client-bundle',
} as z.infer<typeof EnvSchema> & { SESSION_SECRET: string; SUPABASE_JWT_SECRET: string };
