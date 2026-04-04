import { NextResponse } from 'next/server';
import { z } from 'zod';
import { createServerClient } from '@/lib/supabase/server';

export const dynamic = 'force-dynamic';

const uploadSchema = z.object({
  title: z
    .string()
    .min(3, 'Title must be at least 3 characters')
    .max(100, 'Title must be less than 100 characters'),
  type: z.enum(['image', 'video']),
  media_url: z.string().url('Invalid media URL'),
  campaign_id: z.string().uuid().optional().nullable(),
});

export async function POST(request: Request) {
  try {
    // For production, verify auth header
    const authHeader = request.headers.get('authorization');
    if (!authHeader?.startsWith('Bearer ')) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const payload = uploadSchema.parse(body);

    const supabase = createServerClient();

    // Insert post into database
    const { data, error } = await (supabase
      .from('posts') as any)
      .insert([{
        title: payload.title,
        type: payload.type,
        media_url: payload.media_url,
        campaign_id: payload.campaign_id || null,
        status: 'Published',
        views: 0,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      }] as any)
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({
      status: 'success',
      post: data,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation failed', details: error.errors },
        { status: 400 }
      );
    }

    console.error('Upload error:', error);
    return NextResponse.json(
      { error: 'Failed to create post' },
      { status: 500 }
    );
  }
}
