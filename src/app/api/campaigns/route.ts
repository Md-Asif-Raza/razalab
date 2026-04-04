import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { getSupabaseAuthClient } from '@/lib/auth';

// 8.3 Campaign Create Schema
const CampaignCreateSchema = z.object({
  title:           z.string().min(3).max(120),
  creator:         z.string().min(1).max(80),
  purpose:         z.enum(['Personal brand', 'Brand awareness', 'Music promotion', 'Content creator']),
  budget:          z.coerce.number().positive(),
  rpm:             z.coerce.number().positive(),
  platforms:       z.array(z.string()).min(1),
  avatar_initials: z.string().length(2),
  description:     z.string().max(500).optional(),
  verified:        z.coerce.boolean().optional().default(false),
});

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const status = searchParams.get('status') || 'active';
    const verified = searchParams.get('verified') === 'true';
    const limit = Math.min(parseInt(searchParams.get('limit') || '50'), 100);
    const offset = parseInt(searchParams.get('offset') || '0');

    const supabase = getSupabaseAuthClient();
    let query = supabase
      .from('campaigns')
      .select('*', { count: 'exact' })
      .eq('status', status)
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);

    if (searchParams.has('verified')) {
      query = query.eq('verified', verified);
    }

    const { data: campaigns, count, error } = await query;

    if (error) {
      console.error('Fetch campaigns error:', error);
      return NextResponse.json({ error: 'Database error', code: 'DB_ERROR' }, { status: 500 });
    }

    // Edge Caching (Section 6.4)
    const response = NextResponse.json({ campaigns: campaigns || [], total: count || 0 });
    response.headers.set('Cache-Control', 's-maxage=60, stale-while-revalidate=300');
    return response;
  } catch (err) {
    console.error('GET campaigns error:', err);
    return NextResponse.json({ error: 'Internal server error', code: 'SERVER_ERROR' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    
    // Parse platforms (comma separated or multi-part)
    const platformsRaw = formData.get('platforms') as string;
    const platforms = platformsRaw ? platformsRaw.split(',').map(p => p.trim()) : [];

    const data = {
      title:           formData.get('title'),
      creator:         formData.get('creator'),
      purpose:         formData.get('purpose'),
      budget:          formData.get('budget'),
      rpm:             formData.get('rpm'),
      platforms:       platforms,
      avatar_initials: formData.get('avatar_initials'),
      description:     formData.get('description'),
      verified:        formData.get('verified') === 'true',
    };

    const val = CampaignCreateSchema.safeParse(data);
    if (!val.success) {
      return NextResponse.json({ error: 'Validation error', code: 'VALIDATION_ERROR', details: val.error.flatten() }, { status: 400 });
    }

    const file = formData.get('file') as File;
    let mediaUrl = null;
    let storagePath = null;

    const supabase = getSupabaseAuthClient();

    if (file) {
      const uuid = crypto.randomUUID();
      const sanitizedName = file.name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9\-.]/g, '');
      storagePath = `campaigns/${uuid}/${Date.now()}_${sanitizedName}`;

      const { error: uploadError } = await supabase.storage
        .from('campaign-media')
        .upload(storagePath, file, { contentType: file.type });

      if (uploadError) {
        return NextResponse.json({ error: 'Storage error', code: 'STORAGE_ERROR' }, { status: 500 });
      }

      const { data: publicUrlData } = supabase.storage.from('campaign-media').getPublicUrl(storagePath);
      mediaUrl = publicUrlData.publicUrl;
    }

    const { data: campaign, error: dbError } = await supabase
      .from('campaigns')
      .insert({
        ...val.data,
        media_url: mediaUrl,
      })
      .select()
      .single();

    if (dbError) {
      if (storagePath) await supabase.storage.from('campaign-media').remove([storagePath]);
      return NextResponse.json({ error: 'Database error', code: 'DB_ERROR' }, { status: 500 });
    }

    return NextResponse.json({ campaign }, { status: 201 });
  } catch (err) {
    console.error('POST campaigns error:', err);
    return NextResponse.json({ error: 'Internal server error', code: 'SERVER_ERROR' }, { status: 500 });
  }
}
