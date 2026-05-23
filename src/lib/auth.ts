import { createClient } from '@supabase/supabase-js';
import { cookies } from 'next/headers';
import { env } from './env';

// =============================================
// ADMIN EMAIL — Only this email can access admin
// =============================================
export const ADMIN_EMAIL = (process.env.ADMIN_EMAIL || 'arifm9991@gmail.com').trim().toLowerCase();

const COOKIE_NAME = 'sb-session';

/**
 * Creates a Supabase client with the ANON key (for auth operations like signIn).
 */
export function getAuthClient() {
  return createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.NEXT_PUBLIC_SUPABASE_ANON_KEY, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
}

/**
 * Creates a Supabase client with the SERVICE ROLE key (for admin operations).
 */
export function getAdminClient() {
  return createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
}

/**
 * Checks if the given email matches the admin email.
 */
export function isAdminEmail(email: string): boolean {
  return email.trim().toLowerCase() === ADMIN_EMAIL;
}

/**
 * Stores the Supabase session in an httpOnly cookie.
 */
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

/**
 * Clears the session cookie.
 */
export async function clearSession() {
  const cookieStore = await cookies();
  cookieStore.delete(COOKIE_NAME);
}

/**
 * Reads the session from the cookie.
 */
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

/**
 * Validates the current session against Supabase and checks admin email.
 */
export async function validateSession() {
  const session = await getSession();
  if (!session?.access_token) return null;

  const supabase = getAdminClient();
  const { data: { user }, error } = await supabase.auth.getUser(session.access_token);
  if (error || !user) return null;
  if (!isAdminEmail(user.email || '')) return null;
  return user;
}

export async function hashIp(ip: string) {
  const encoder = new TextEncoder();
  const data = encoder.encode(ip + env.SESSION_SECRET);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}
