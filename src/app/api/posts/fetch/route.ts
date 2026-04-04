import { NextResponse } from 'next/server';
import { createServerClient } from '@/lib/supabase/server';
import { Post } from '@/types';

export const dynamic = 'force-dynamic';
export const revalidate = 60; // ISR - revalidate every minute

export async function GET() {
  try {
    const supabase = createServerClient();

    // Fetch published posts ordered by views (trending first)
    const { data, error } = await supabase
      .from('posts')
      .select('*')
      .eq('status', 'Published')
      .order('views', { ascending: false })
      .limit(50);

    if (error) throw error;

    return NextResponse.json({
      posts: (data || []) as Post[],
    });
  } catch (error) {
    console.error('Fetch posts error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch posts' },
      { status: 500 }
    );
  }
}
