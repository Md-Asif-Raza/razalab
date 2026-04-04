import { NextResponse } from 'next/server';
import { z } from 'zod';
import { createServerClient } from '@/lib/supabase/server';

export const dynamic = 'force-dynamic';

const campaignSchema = z.object({
  title: z
    .string()
    .min(3, 'Title must be at least 3 characters')
    .max(200, 'Title must be less than 200 characters'),
  creator: z
    .string()
    .min(2, 'Creator name must be at least 2 characters')
    .max(100, 'Creator name must be less than 100 characters'),
  budget: z.number().min(0, 'Budget must be non-negative').default(0),
  earned: z.number().min(0, 'Earned must be non-negative').default(0),
  members: z.number().min(0, 'Members must be non-negative').default(0),
  rate: z.number().min(0, 'Rate must be non-negative').default(0),
  platforms: z.array(z.string()).default([]),
  verified: z.boolean().default(false),
  mediaUrl: z.string().url().optional().nullable(),
  graphData: z.string().optional().default('20,40,35,50,45,60,80'),
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
    const payload = campaignSchema.parse(body);

    const supabase = createServerClient();

    // Insert campaign into database
    const { data, error } = await (supabase
      .from('campaigns') as any)
      .insert([{
        title: payload.title,
        creator: payload.creator,
        budget: payload.budget,
        earned: payload.earned,
        members: payload.members,
        rate: payload.rate,
        platforms: payload.platforms,
        verified: payload.verified,
        media_url: payload.mediaUrl || null,
        graph_data: payload.graphData,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      }] as any)
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({
      status: 'success',
      campaign: data,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation failed', details: error.errors },
        { status: 400 }
      );
    }

    console.error('Campaign creation error:', error);
    return NextResponse.json(
      { error: 'Failed to create campaign' },
      { status: 500 }
    );
  }
}
