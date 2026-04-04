import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { getSupabaseAuthClient } from '@/lib/auth';

const PostUpdateSchema = z.object({
  title: z.string().min(3).max(200).optional(),
  status: z.enum(['Published', 'Draft']).optional(),
});

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = params;
    const body = await req.json();

    const val = PostUpdateSchema.safeParse(body);
    if (!val.success) {
      return NextResponse.json({ error: 'Validation error', code: 'VALIDATION_ERROR', details: val.error.flatten() }, { status: 400 });
    }

    if (Object.keys(val.data).length === 0) {
      return NextResponse.json({ error: 'No fields provided', code: 'VALIDATION_ERROR' }, { status: 400 });
    }

    const supabase = getSupabaseAuthClient();
    const { data: post, error } = await supabase
      .from('posts')
      .update(val.data)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      if (error.code === 'PGRST116') return NextResponse.json({ error: 'Post not found', code: 'NOT_FOUND' }, { status: 404 });
      return NextResponse.json({ error: 'Database error', code: 'DB_ERROR' }, { status: 500 });
    }

    return NextResponse.json({ post });
  } catch (err) {
    console.error('PATCH post error:', err);
    return NextResponse.json({ error: 'Internal server error', code: 'SERVER_ERROR' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = params;
    const supabase = getSupabaseAuthClient();

    // 1. Fetch to get storage_path
    const { data: post, error: fetchError } = await supabase
      .from('posts')
      .select('storage_path')
      .eq('id', id)
      .single();

    if (fetchError) {
      if (fetchError.code === 'PGRST116') return NextResponse.json({ error: 'Post not found', code: 'NOT_FOUND' }, { status: 404 });
      return NextResponse.json({ error: 'Database error', code: 'DB_ERROR' }, { status: 500 });
    }

    // 2. Delete from Storage
    if (post.storage_path) {
      const { error: storageError } = await supabase.storage.from('post-media').remove([post.storage_path]);
      if (storageError) {
        console.error('Storage delete error:', storageError);
        // We log but continue to delete DB row as per PRD (soft failure)
      }
    }

    // 3. Delete from DB
    const { error: deleteError } = await supabase.from('posts').delete().eq('id', id);

    if (deleteError) {
      return NextResponse.json({ error: 'Database delete error', code: 'DB_ERROR' }, { status: 500 });
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error('DELETE post error:', err);
    return NextResponse.json({ error: 'Internal server error', code: 'SERVER_ERROR' }, { status: 500 });
  }
}
