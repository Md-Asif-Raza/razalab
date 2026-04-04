import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { getSupabaseAuthClient } from '@/lib/auth';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const status = searchParams.get('status');
    const limit = parseInt(searchParams.get('limit') || '50');
    const offset = parseInt(searchParams.get('offset') || '0');

    const supabase = getSupabaseAuthClient();
    
    let query = supabase
      .from('posts')
      .select('*', { count: 'exact' })
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);

    if (status) {
      query = query.eq('status', status);
    }

    const { data: posts, count, error } = await query;

    if (error) {
      console.error('Fetch posts error:', error);
      return NextResponse.json({ error: 'Database error', code: 'DB_ERROR' }, { status: 500 });
    }

    return NextResponse.json({ posts: posts || [], total: count || 0 });
  } catch (err) {
    console.error('GET posts error:', err);
    return NextResponse.json({ error: 'Internal server error', code: 'SERVER_ERROR' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const title = formData.get('title') as string;
    const file = formData.get('file') as File;
    const status = (formData.get('status') as string) || 'Draft';

    // 1. Zod Validation (Section 8.2)
    const PostCreateSchema = z.object({
      title: z.string().min(3).max(200),
      status: z.enum(['Published', 'Draft']),
    });

    const val = PostCreateSchema.safeParse({ title, status });
    if (!val.success) {
      return NextResponse.json({ error: 'Validation error', code: 'VALIDATION_ERROR', details: val.error.flatten() }, { status: 400 });
    }

    if (!file) {
      return NextResponse.json({ error: 'File missing', code: 'VALIDATION_ERROR' }, { status: 400 });
    }

    // 2. File Validation
    const isImage = file.type.startsWith('image/');
    const isVideo = file.type.startsWith('video/');
    if (!isImage && !isVideo) {
      return NextResponse.json({ error: 'Invalid file type', code: 'INVALID_FILE_TYPE' }, { status: 415 });
    }

    const maxSize = 500 * 1024 * 1024; // 500MB
    if (file.size > maxSize) {
      return NextResponse.json({ error: 'File too large', code: 'FILE_TOO_LARGE' }, { status: 413 });
    }

    // 3. Storage Logic
    const supabase = getSupabaseAuthClient();
    const type = isImage ? 'image' : 'video';
    const uuid = crypto.randomUUID();
    const timestamp = Date.now();
    const sanitizedName = file.name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9\-.]/g, '');
    const storagePath = `posts/${type}s/${uuid}/${timestamp}_${sanitizedName}`;

    const { error: uploadError } = await supabase.storage
      .from('post-media')
      .upload(storagePath, file, { contentType: file.type });

    if (uploadError) {
      console.error('Upload error:', uploadError);
      return NextResponse.json({ error: 'Storage error', code: 'STORAGE_ERROR' }, { status: 500 });
    }

    // 4. DB Insert
    const { data: publicUrlData } = supabase.storage.from('post-media').getPublicUrl(storagePath);
    
    const { data: post, error: dbError } = await supabase
      .from('posts')
      .insert({
        id: uuid,
        title,
        type,
        status,
        media_url: publicUrlData.publicUrl,
        storage_path: storagePath,
      })
      .select()
      .single();

    if (dbError) {
      console.error('DB Insert Error:', dbError);
      // Rollback Storage
      await supabase.storage.from('post-media').remove([storagePath]);
      return NextResponse.json({ error: 'Database error', code: 'DB_ERROR' }, { status: 500 });
    }

    return NextResponse.json({ post: post }, { status: 201 });
  } catch (err) {
    console.error('POST posts error:', err);
    return NextResponse.json({ error: 'Internal server error', code: 'SERVER_ERROR' }, { status: 500 });
  }
}
