import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { getSupabaseAuthClient } from '@/lib/auth';

const CampaignUpdateSchema = z.object({
  title:           z.string().min(3).max(120).optional(),
  creator:         z.string().min(1).max(80).optional(),
  purpose:         z.enum(['Personal brand', 'Brand awareness', 'Music promotion', 'Content creator']).optional(),
  budget:          z.coerce.number().positive().optional(),
  earned:          z.coerce.number().optional(),
  members:         z.coerce.number().optional(),
  rpm:             z.coerce.number().positive().optional(),
  platforms:       z.array(z.string()).min(1).optional(),
  avatar_initials: z.string().length(2).optional(),
  description:     z.string().max(500).optional(),
  verified:        z.coerce.boolean().optional(),
  status:          z.enum(['active', 'paused', 'completed']).optional(),
  graph_data:      z.string().optional(),
});

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = params;
    const body = await req.json();

    const val = CampaignUpdateSchema.safeParse(body);
    if (!val.success) {
      return NextResponse.json({ error: 'Validation error', code: 'VALIDATION_ERROR', details: val.error.flatten() }, { status: 400 });
    }

    const supabase = getSupabaseAuthClient();
    const { data: campaign, error } = await supabase
      .from('campaigns')
      .update(val.data)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      if (error.code === 'PGRST116') return NextResponse.json({ error: 'Campaign not found', code: 'NOT_FOUND' }, { status: 404 });
      return NextResponse.json({ error: 'Database error', code: 'DB_ERROR' }, { status: 500 });
    }

    return NextResponse.json({ campaign });
  } catch (err) {
    console.error('PATCH campaign error:', err);
    return NextResponse.json({ error: 'Internal server error', code: 'SERVER_ERROR' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = params;
    const supabase = getSupabaseAuthClient();

    // 1. Fetch to get media_url (to extract storage path if needed)
    // In our POST, we don't store storage_path for campaigns explicitly in the DB, 
    // but we can extract it or store it. Let's assume we store it or extract from URL.
    // Actually, it's better to store storage_path. I'll update the table definition if needed, 
    // but PRD doesn't have storage_path for campaigns.
    // Let's just delete the DB row.
    
    const { error: deleteError } = await supabase.from('campaigns').delete().eq('id', id);

    if (deleteError) {
      return NextResponse.json({ error: 'Database delete error', code: 'DB_ERROR' }, { status: 500 });
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error('DELETE campaign error:', err);
    return NextResponse.json({ error: 'Internal server error', code: 'SERVER_ERROR' }, { status: 500 });
  }
}
