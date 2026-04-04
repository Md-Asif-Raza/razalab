import { NextResponse } from 'next/server';
import { createServerClient } from '@/lib/supabase/server';
import { Campaign } from '@/types';

export const dynamic = 'force-dynamic';
export const revalidate = 60; // ISR - revalidate every minute

export async function GET() {
  try {
    const supabase = createServerClient();

    // Fetch verified campaigns only for public display
    const { data, error } = await supabase
      .from('campaigns')
      .select('*')
      .eq('verified', true)
      .order('created_at', { ascending: false })
      .limit(12);

    if (error) throw error;

    return NextResponse.json({
      campaigns: (data || []) as Campaign[],
    });
  } catch (error) {
    console.error('Fetch campaigns error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch campaigns' },
      { status: 500 }
    );
  }
}
