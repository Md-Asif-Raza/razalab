import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const ADMIN_EMAIL = 'arifm9991@gmail.com';

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json({ error: 'Email and password are required.' }, { status: 400 });
    }

    if (email.trim().toLowerCase() !== ADMIN_EMAIL) {
      return NextResponse.json({ error: 'Access denied. Only the admin can login.' }, { status: 403 });
    }

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
    const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

    const authClient = createClient(supabaseUrl, anonKey, {
      auth: { autoRefreshToken: false, persistSession: false },
    });

    // Attempt sign-in
    const { data, error } = await authClient.auth.signInWithPassword({
      email: ADMIN_EMAIL,
      password,
    });

    if (!error && data.session) {
      // Successful login
      const session = {
        access_token: data.session.access_token,
        refresh_token: data.session.refresh_token,
        user: { id: data.user.id, email: data.user.email },
      };

      const response = NextResponse.json({ success: true });
      response.cookies.set('sb-session', JSON.stringify(session), {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 604800,
        path: '/',
      });
      return response;
    }

    // Sign-in failed
    return NextResponse.json({ error: 'Invalid password.' }, { status: 401 });
  } catch (err: any) {
    console.error('Login error:', err);
    return NextResponse.json({ error: 'Internal server error.' }, { status: 500 });
  }
}
