import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { getSupabaseAuthClient, setSession, hashIp } from '@/lib/auth';

const LoginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8).max(128),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const result = LoginSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        { error: 'Invalid request body', code: 'INVALID_BODY', details: result.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const { email, password } = result.data;
    const supabase = getSupabaseAuthClient();
    
    // Attempt sign in
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    // Logging (Section 9.3)
    const ip = req.headers.get('x-forwarded-for')?.split(',')[0] || '127.0.0.1';
    const ipHash = await hashIp(ip);
    
    await supabase.from('auth_log').insert({
      ip_hash: ipHash,
      attempted_email: email,
      result: error ? 'failure' : 'success',
      request_id: req.headers.get('x-request-id') || null,
    });

    if (error) {
      return NextResponse.json(
        { error: 'Invalid credentials', code: 'AUTH_FAILED' },
        { status: 401 }
      );
    }

    // Set session cookie
    await setSession(data.session);

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error('Login error:', err);
    return NextResponse.json(
      { error: 'Internal server error', code: 'SERVER_ERROR' },
      { status: 500 }
    );
  }
}
