import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('Supabase credentials not found in environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type Campaign = {
  id: string;
  title: string;
  creator: string;
  budget: number;
  earned: number;
  members: number;
  platforms: string[];
  verified: boolean;
  media_url: string | null;
  created_at: string;
  updated_at: string;
};

export type Post = {
  id: string;
  title: string;
  type: 'video' | 'image';
  views: number;
  status: 'Published' | 'Draft';
  media_url: string | null;
  campaign_id: string | null;
  created_at: string;
  updated_at: string;
};

export type Database = {
  public: {
    Tables: {
      campaigns: {
        Row: Campaign;
      };
      posts: {
        Row: Post;
      };
      admin_users: {
        Row: {
          id: string;
          email: string;
          full_name: string | null;
          role: 'admin' | 'moderator';
          created_at: string;
        };
      };
      view_tracking: {
        Row: {
          id: string;
          post_id: string;
          ip_address: string;
          last_tracked: string;
        };
      };
    };
  };
};
