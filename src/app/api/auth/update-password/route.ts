import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const ADMIN_EMAIL = 'arifm9991@gmail.com';

export async function POST(request: Request) {
  try {
    const { password, access_token } = await request.json();

    if (!password || !access_token) {
      return NextResponse.json({ error: 'New password and reset token are required.' }, { status: 400 });
    }

    if (password.length < 8) {
      return NextResponse.json({ error: 'Password must be at least 8 characters.' }, { status: 400 });
    }

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
    const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

    const adminClient = createClient(supabaseUrl, serviceRoleKey, {
      auth: { autoRefreshToken: false, persistSession: false },
    });

    // Validate the recovery token and get the user
    const { data: { user }, error: userError } = await adminClient.auth.getUser(access_token);

    if (userError || !user) {
      return NextResponse.json({ error: 'Invalid or expired reset token.' }, { status: 401 });
    }

    if (user.email?.trim().toLowerCase() !== ADMIN_EMAIL) {
      return NextResponse.json({ error: 'Access denied.' }, { status: 403 });
    }

    // Update the password using admin API
    const { error } = await adminClient.auth.admin.updateUserById(user.id, {
      password,
    });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, message: 'Password updated successfully.' });
  } catch (err: any) {
    console.error('Update password error:', err);
    return NextResponse.json({ error: 'Internal server error.' }, { status: 500 });
  }
}
