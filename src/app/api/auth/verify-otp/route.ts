import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const ADMIN_EMAIL = (process.env.ADMIN_EMAIL || 'arifm9991@gmail.com').trim().toLowerCase();

export async function POST(request: Request) {
  try {
    const { email, token } = await request.json();

    if (!email || !token) {
      return NextResponse.json({ error: 'Email and OTP code are required.' }, { status: 400 });
    }

    if (email.trim().toLowerCase() !== ADMIN_EMAIL) {
      return NextResponse.json({ error: 'Access denied.' }, { status: 403 });
    }

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
    const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

    const authClient = createClient(supabaseUrl, anonKey, {
      auth: { autoRefreshToken: false, persistSession: false },
    });

    const { data, error } = await authClient.auth.verifyOtp({
      email: ADMIN_EMAIL,
      token,
      type: 'email',
    });

    if (error || !data.session) {
      return NextResponse.json({ error: error?.message || 'Invalid OTP code.' }, { status: 401 });
    }

    const session = {
      access_token: data.session.access_token,
      refresh_token: data.session.refresh_token,
      user: { id: data.user!.id, email: data.user!.email },
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
  } catch (err: any) {
    console.error('Verify OTP error:', err);
    return NextResponse.json({ error: 'Internal server error.' }, { status: 500 });
  }
}
