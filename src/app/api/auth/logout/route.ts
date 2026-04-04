import { NextRequest, NextResponse } from 'next/server';
import { clearSession, getSupabaseAuthClient, getSession } from '@/lib/auth';

export async function POST(req: NextRequest) {
  const session = await getSession();
  
  if (session?.access_token) {
    const supabase = getSupabaseAuthClient();
    await supabase.auth.signOut();
  }

  await clearSession();
  return NextResponse.json({ ok: true });
}
