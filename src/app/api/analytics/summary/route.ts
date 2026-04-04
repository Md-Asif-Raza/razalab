import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseAuthClient } from '@/lib/auth';

export async function GET(req: NextRequest) {
  try {
    const supabase = getSupabaseAuthClient();

    // 1. totalViews & activePosts
    const { data: postStats, error: postError } = await supabase
      .from('posts')
      .select('views')
      .eq('status', 'Published');

    if (postError) {
      console.error('Post stats error:', postError);
      return NextResponse.json({ error: 'Database error', code: 'DB_ERROR' }, { status: 500 });
    }

    const totalViews = postStats.reduce((acc, p) => acc + Number(p.views), 0);
    const activePosts = postStats.length;

    // 2. activeCampaigns & totalBudget
    const { data: campaignStats, error: campaignError } = await supabase
      .from('campaigns')
      .select('budget')
      .eq('status', 'active');

    if (campaignError) {
      console.error('Campaign stats error:', campaignError);
      return NextResponse.json({ error: 'Database error', code: 'DB_ERROR' }, { status: 500 });
    }

    const activeCampaigns = campaignStats.length;
    const totalBudget = campaignStats.reduce((acc, c) => acc + Number(c.budget), 0);

    return NextResponse.json({
      totalViews,
      activePosts,
      activeCampaigns,
      totalBudget,
    });
  } catch (err) {
    console.error('GET analytics error:', err);
    return NextResponse.json({ error: 'Internal server error', code: 'SERVER_ERROR' }, { status: 500 });
  }
}
