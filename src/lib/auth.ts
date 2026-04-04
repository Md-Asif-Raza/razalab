import { createClient } from '@supabase/supabase-js';
import { cookies } from 'next/headers';
import { env } from './env';

const COOKIE_NAME = 'sb-session';

export function getSupabaseAuthClient() {
  return createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}

export async function setSession(session: any) {
  const cookieStore = await cookies();
  cookieStore.set(COOKIE_NAME, JSON.stringify(session), {
    httpOnly: true,
    secure: env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 604800, // 7 days
    path: '/',
  });
}

export async function clearSession() {
  const cookieStore = await cookies();
  cookieStore.delete(COOKIE_NAME);
}

export async function getSession() {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get(COOKIE_NAME);
  if (!sessionCookie) return null;
  try {
    return JSON.parse(sessionCookie.value);
  } catch {
    return null;
  }
}

export async function validateSession() {
  const session = await getSession();
  if (!session?.access_token) return null;

  const supabase = getSupabaseAuthClient();
  const { data: { user }, error } = await supabase.auth.getUser(session.access_token);
  if (error || !user) return null;
  return user;
}

export async function hashIp(ip: string) {
  const encoder = new TextEncoder();
  const data = encoder.encode(ip + env.SESSION_SECRET);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}
