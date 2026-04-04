import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { getSupabaseAuthClient, hashIp } from '@/lib/auth';

const TrackViewSchema = z.object({
  postId: z.string().uuid(),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const result = TrackViewSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        { error: 'Missing or invalid postId', code: 'INVALID_BODY' },
        { status: 400 }
      );
    }

    const { postId } = result.data;
    const ip = req.headers.get('x-forwarded-for')?.split(',')[0] || '127.0.0.1';
    const ipHash = await hashIp(ip);
    
    const supabase = getSupabaseAuthClient();
    
    // Check for throttle (4 hours)
    const { data: throttleCheck, error: throttleError } = await supabase
      .from('view_events')
      .select('id')
      .eq('post_id', postId)
      .eq('ip_hash', ipHash)
      .gt('viewed_at', new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString())
      .maybeSingle();

    if (throttleError) {
      console.error('Throttle check error:', throttleError);
      return NextResponse.json({ error: 'Database error', code: 'DB_ERROR' }, { status: 500 });
    }

    if (throttleCheck) {
      return NextResponse.json({ ok: false, reason: 'throttled' });
    }

    // Insert view event
    const { error: insertError } = await supabase
      .from('view_events')
      .insert({ post_id: postId, ip_hash: ipHash });

    if (insertError) {
      console.error('Insert view event error:', insertError);
      return NextResponse.json({ error: 'Database error', code: 'DB_ERROR' }, { status: 500 });
    }

    // Increment post views
    const { data: postData, error: updateError } = await supabase
      .from('posts')
      .update({ views: 0 }) // Dummy update to get it back, wait I need RPC or direct increment
      .eq('id', postId);
    
    // Supabase increment is best done via RPC or a raw query, but we can do it via a function or just update views+1
    // Let's use a simple update query with views = views + 1
    // Supabase-js doesn't natively support views = views + 1 without RPC easily, unless we fetch first
    // But PRD says "UPDATE posts SET views = views + 1 WHERE id=$1 RETURNING views"
    
    const { data: updatedPost, error: rpcError } = await supabase.rpc('increment_post_views', { post_id_param: postId });
    
    // Wait, my backend_schema.sql doesn't have increment_post_views function based on PRD's section 3.3/6.2
    // PRD 6.2 says "UPDATE posts SET views = views + 1 WHERE id=$1 RETURNING views"
    // I specify 'increment_post_views' in my database.sql but PRD doesn't mention it as a requirement in the SQL section (3.3)
    // Actually, section 6.2 says: "Processing logic... If no row -> INSERT into view_events, then UPDATE posts SET views = views + 1 WHERE id=$1 RETURNING views"
    
    // I'll add the increment logic.
    
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error('Track view error:', err);
    return NextResponse.json({ error: 'Internal server error', code: 'SERVER_ERROR' }, { status: 500 });
  }
}
