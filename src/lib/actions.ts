'use server';
import { revalidatePath } from 'next/cache';
import { createServerClient } from './supabase/server';

/**
 * MASTER DATA SYNC ACTIONS
 * Powering the Raza Labs 'All See' Experience
 */

export async function syncCampaign(data: any) {
  const supabase = createServerClient();
  const { error } = await supabase
    .from('campaigns')
    .upsert({
      id: data.id || undefined,
      name: data.name,
      category: data.category,
      result: data.result,
      price: data.price,
      description: data.description,
      graph_data: data.graphData,
      img_url: data.img,
      updated_at: new Date().toISOString(),
    });

  if (error) throw new Error(`Sync Failed: ${error.message}`);
  revalidatePath('/');
  return { success: true };
}

export async function syncTestimonial(data: any) {
  const supabase = createServerClient();
  const { error } = await supabase
    .from('testimonials')
    .upsert({
      id: data.id || undefined,
      name: data.name,
      role: data.role,
      quote: data.quote,
      avatar_url: data.avatar,
      updated_at: new Date().toISOString(),
    });

  if (error) throw new Error(`Sync Failed: ${error.message}`);
  revalidatePath('/');
  return { success: true };
}

export async function syncReview(data: any) {
  const supabase = createServerClient();
  const { error } = await supabase
    .from('reviews')
    .upsert({
      id: data.id || undefined,
      name: data.name,
      handle: data.handle,
      content: data.content,
      stars: data.stars,
      avatar_url: data.avatar,
      updated_at: new Date().toISOString(),
    });

  if (error) throw new Error(`Sync Failed: ${error.message}`);
  revalidatePath('/');
  return { success: true };
}

export async function syncSettings(data: any) {
  const supabase = createServerClient();
  const { error } = await supabase
    .from('settings')
    .upsert({
      id: 'global_config',
      instagram_url: data.instagram,
      youtube_url: data.youtube,
      twitter_url: data.twitter,
      cta_url: data.ctaUrl,
      updated_at: new Date().toISOString(),
    });

  if (error) throw new Error(`Sync Failed: ${error.message}`);
  revalidatePath('/');
  return { success: true };
}
