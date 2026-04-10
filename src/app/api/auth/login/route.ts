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
    const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
    const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

    const authClient = createClient(supabaseUrl, anonKey, {
      auth: { autoRefreshToken: false, persistSession: false },
    });

    const adminClient = createClient(supabaseUrl, serviceRoleKey, {
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

    // Sign-in failed — maybe user doesn't exist yet. Try creating.
    const { error: createError } = await adminClient.auth.admin.createUser({
      email: ADMIN_EMAIL,
      password,
      email_confirm: true,
    });

    if (createError) {
      // User exists but password is wrong
      return NextResponse.json({ error: 'Invalid password.' }, { status: 401 });
    }

    // User was just created — now sign in
    const { data: data2, error: error2 } = await authClient.auth.signInWithPassword({
      email: ADMIN_EMAIL,
      password,
    });

    if (error2 || !data2.session) {
      return NextResponse.json({ error: 'Login failed after account creation.' }, { status: 500 });
    }

    const session2 = {
      access_token: data2.session.access_token,
      refresh_token: data2.session.refresh_token,
      user: { id: data2.user.id, email: data2.user.email },
    };

    const response = NextResponse.json({ success: true, firstLogin: true });
    response.cookies.set('sb-session', JSON.stringify(session2), {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 604800,
      path: '/',
    });
    return response;
  } catch (err: any) {
    console.error('Login error:', err);
    return NextResponse.json({ error: 'Internal server error.' }, { status: 500 });
  }
}
