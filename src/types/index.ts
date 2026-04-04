export type { Campaign, Post } from '@/lib/supabase/client';

export interface CampaignFilters {
  verified?: boolean;
  creator?: string;
  limit?: number;
  offset?: number;
}

export interface PostFilters {
  status?: 'Published' | 'Draft';
  type?: 'video' | 'image';
  limit?: number;
  offset?: number;
}
