'use server';
import { revalidatePath, revalidateTag } from 'next/cache';
import { unstable_cache } from 'next/cache';
import { createServerClient } from './supabase/server';

// =============================================
// CAMPAIGNS
// =============================================
const _fetchCampaigns = async () => {
  const supabase = createServerClient();
  const { data, error } = await supabase
    .from('campaigns')
    .select('*')
    .order('sort_order', { ascending: true });
  if (error) return [];
  return data || [];
};

// Cache campaign data for 60s — revalidated on-demand via tag
export const getCampaigns = unstable_cache(
  _fetchCampaigns,
  ['campaigns-list'],
  { revalidate: 60, tags: ['campaigns'] }
);

export async function syncCampaign(data: any) {
  const supabase = createServerClient();
  const payload: any = {
    name: data.name,
    category: data.category,
    result: data.result,
    price: data.price,
    description: data.description,
    graph_data: data.graphData || data.graph_data,
    img_url: data.img || data.img_url,
    sort_order: data.sort_order || 0,
    is_active: data.is_active !== false,
    // Detailed View Fields
    index_label: data.index_label,
    tag: data.tag,
    views_total: data.views_total,
    roi: data.roi,
    creators_count: data.creators_count,
    budget_label: data.budget_label,
    cpm_label: data.cpm_label,
    duration_label: data.duration_label,
    challenge_text: data.challenge_text,
    what_we_did_text: data.what_we_did_text,
    why_it_worked_text: data.why_it_worked_text,
    learned_text: data.learned_text,
    updated_at: new Date().toISOString(),
  };
  if (data.id) payload.id = data.id;

  const { error } = await supabase.from('campaigns').upsert(payload);
  if (error) throw new Error(`Sync Failed: ${error.message}`);
  revalidateTag('campaigns');
  revalidatePath('/');
  revalidatePath('/clients');
  return { success: true };
}

export async function deleteCampaign(id: string) {
  const supabase = createServerClient();
  const { error } = await supabase.from('campaigns').delete().eq('id', id);
  if (error) throw new Error(`Delete Failed: ${error.message}`);
  revalidateTag('campaigns');
  revalidatePath('/');
  revalidatePath('/clients');
  return { success: true };
}

// =============================================
// TESTIMONIALS
// =============================================
export async function getTestimonials() {
  const supabase = createServerClient();
  const { data, error } = await supabase
    .from('testimonials')
    .select('*')
    .order('sort_order', { ascending: true });
  if (error) return [];
  return data || [];
}

export async function syncTestimonial(data: any) {
  const supabase = createServerClient();
  const payload: any = {
    name: data.name,
    role: data.role,
    quote: data.quote,
    avatar_url: data.avatar_url || data.avatar,
    sort_order: data.sort_order || 0,
    is_active: data.is_active !== false,
    updated_at: new Date().toISOString(),
  };
  if (data.id) payload.id = data.id;

  const { error } = await supabase.from('testimonials').upsert(payload);
  if (error) throw new Error(`Sync Failed: ${error.message}`);
  revalidatePath('/');
  return { success: true };
}

export async function deleteTestimonial(id: string) {
  const supabase = createServerClient();
  const { error } = await supabase.from('testimonials').delete().eq('id', id);
  if (error) throw new Error(`Delete Failed: ${error.message}`);
  revalidatePath('/');
  return { success: true };
}

// =============================================
// REVIEWS
// =============================================
export async function getReviews() {
  const supabase = createServerClient();
  const { data, error } = await supabase
    .from('reviews')
    .select('*')
    .order('sort_order', { ascending: true });
  if (error) return [];
  return data || [];
}

export async function syncReview(data: any) {
  const supabase = createServerClient();
  const payload: any = {
    name: data.name,
    handle: data.handle,
    content: data.content,
    stars: data.stars || 5,
    avatar_url: data.avatar_url || data.avatar,
    sort_order: data.sort_order || 0,
    is_active: data.is_active !== false,
    updated_at: new Date().toISOString(),
  };
  if (data.id) payload.id = data.id;

  const { error } = await supabase.from('reviews').upsert(payload);
  if (error) throw new Error(`Sync Failed: ${error.message}`);
  revalidatePath('/');
  return { success: true };
}

export async function deleteReview(id: string) {
  const supabase = createServerClient();
  const { error } = await supabase.from('reviews').delete().eq('id', id);
  if (error) throw new Error(`Delete Failed: ${error.message}`);
  revalidatePath('/');
  return { success: true };
}

// =============================================
// FAQS
// =============================================
export async function getFaqs() {
  const supabase = createServerClient();
  const { data, error } = await supabase
    .from('faqs')
    .select('*')
    .order('sort_order', { ascending: true });
  if (error) return [];
  return data || [];
}

export async function syncFaq(data: any) {
  const supabase = createServerClient();
  const payload: any = {
    question: data.question,
    answer: data.answer,
    sort_order: data.sort_order || 0,
    is_active: data.is_active !== false,
    updated_at: new Date().toISOString(),
  };
  if (data.id) payload.id = data.id;

  const { error } = await supabase.from('faqs').upsert(payload);
  if (error) throw new Error(`Sync Failed: ${error.message}`);
  revalidatePath('/');
  return { success: true };
}

export async function deleteFaq(id: string) {
  const supabase = createServerClient();
  const { error } = await supabase.from('faqs').delete().eq('id', id);
  if (error) throw new Error(`Delete Failed: ${error.message}`);
  revalidatePath('/');
  return { success: true };
}

// =============================================
// HERO CONTENT
// =============================================
export async function getHeroContent() {
  const supabase = createServerClient();
  const { data, error } = await supabase
    .from('hero_content')
    .select('*')
    .eq('id', 'main')
    .single();
  if (error) return null;
  return data;
}

export async function syncHeroContent(data: any) {
  const supabase = createServerClient();
  const { error } = await supabase.from('hero_content').upsert({
    id: 'main',
    title: data.title,
    title_accent: data.title_accent,
    subtitle: data.subtitle,
    cta_text: data.cta_text,
    cta_link: data.cta_link,
    stats_text: data.stats_text,
    updated_at: new Date().toISOString(),
  });
  if (error) throw new Error(`Sync Failed: ${error.message}`);
  revalidatePath('/');
  return { success: true };
}

// =============================================
// SITE SETTINGS
// =============================================
export async function getSiteSettings() {
  const supabase = createServerClient();
  const { data, error } = await supabase
    .from('site_settings')
    .select('*')
    .eq('id', 'global')
    .single();
  if (error) return null;
  return data;
}

export async function syncSiteSettings(data: any) {
  const supabase = createServerClient();
  const { error } = await supabase.from('site_settings').upsert({
    id: 'global',
    instagram_url: data.instagram_url,
    youtube_url: data.youtube_url,
    twitter_url: data.twitter_url,
    video_url: data.video_url,
    video_poster: data.video_poster,
    video_caption: data.video_caption,
    video_cta_text: data.video_cta_text,
    video_cta_link: data.video_cta_link,
    cta_title: data.cta_title,
    cta_title_accent: data.cta_title_accent,
    cta_subtitle: data.cta_subtitle,
    cta_button_text: data.cta_button_text,
    cta_button_link: data.cta_button_link,
    // Calculator Settings
    target_cpm: data.target_cpm,
    organic_cpm: data.organic_cpm,
    platform_multiplier: data.platform_multiplier,
    days_multiplier: data.days_multiplier,
    updated_at: new Date().toISOString(),
  });
  if (error) throw new Error(`Sync Failed: ${error.message}`);
  revalidatePath('/');
  return { success: true };
}

// =============================================
// BRANDS
// =============================================
export async function getBrands() {
  const supabase = createServerClient();
  const { data, error } = await supabase
    .from('brands')
    .select('*')
    .order('sort_order', { ascending: true });
  if (error) return [];
  return data || [];
}

export async function syncBrand(data: any) {
  const supabase = createServerClient();
  const payload: any = {
    name: data.name,
    is_bold: data.is_bold || false,
    sort_order: data.sort_order || 0,
  };
  if (data.id) payload.id = data.id;

  const { error } = await supabase.from('brands').upsert(payload);
  if (error) throw new Error(`Sync Failed: ${error.message}`);
  revalidatePath('/');
  return { success: true };
}

export async function deleteBrand(id: string) {
  const supabase = createServerClient();
  const { error } = await supabase.from('brands').delete().eq('id', id);
  if (error) throw new Error(`Delete Failed: ${error.message}`);
  revalidatePath('/');
  return { success: true };
}

// =============================================
// TECH STACK (WHAT WE DO)
// =============================================
export async function getTechStack() {
  const supabase = createServerClient();
  const { data, error } = await supabase
    .from('tech_stack')
    .select('*')
    .order('sort_order', { ascending: true });
  if (error) return [];
  return data || [];
}

export async function syncTechStack(data: any) {
  const supabase = createServerClient();
  const payload: any = {
    name: data.name,
    icon: data.icon,
    description: data.description,
    sort_order: data.sort_order || 0,
  };
  if (data.id) payload.id = data.id;

  const { error } = await supabase.from('tech_stack').upsert(payload);
  if (error) throw new Error(`Sync Failed: ${error.message}`);
  revalidatePath('/');
  return { success: true };
}

export async function deleteTechStack(id: string) {
  const supabase = createServerClient();
  const { error } = await supabase.from('tech_stack').delete().eq('id', id);
  if (error) throw new Error(`Delete Failed: ${error.message}`);
  revalidatePath('/');
  return { success: true };
}

// =============================================
// IMAGE UPLOAD to Supabase Storage
// =============================================
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

export async function uploadImage(formData: FormData) {
  const supabase = createServerClient();
  const file = formData.get('file') as File;
  if (!file) throw new Error('No file provided');

  // ENFORCE SIZE LIMIT (5MB)
  if (file.size > MAX_FILE_SIZE) {
    throw new Error('File is too large. Max size is 5MB.');
  }

  const ext = file.name.split('.').pop();
  const filename = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;

  try {
    // Attempt upload to 'media' bucket
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('media')
      .upload(filename, file, {
        cacheControl: 'public, max-age=31536000, immutable',
        upsert: false,
        contentType: file.type || 'image/png'
      });

    if (uploadError) {
      // If bucket doesn't exist, this is a common failure
      if (uploadError.message.includes('not found') || uploadError.message.includes('bucket')) {
        throw new Error("Storage Bucket 'media' not found. Please create a public bucket named 'media' in your Supabase project.");
      }
      throw new Error(`Upload Failed: ${uploadError.message}`);
    }

    const { data: urlData } = supabase.storage.from('media').getPublicUrl(filename);
    if (!urlData.publicUrl) throw new Error('Failed to generate public URL');

    return { url: urlData.publicUrl };
  } catch (err: any) {
    console.error('SERVER ACTION UPLOAD ERROR:', err);
    throw err;
  }
}
