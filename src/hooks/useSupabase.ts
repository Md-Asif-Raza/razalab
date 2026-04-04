'use client';
import { useEffect, useState, useCallback } from 'react';
import { supabase } from '@/lib/supabase/client';
import { User } from '@supabase/supabase-js';
import { Campaign, Post } from '@/types';

interface UseSupabaseResult {
  campaigns: Campaign[];
  posts: Post[];
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

/**
 * Hook to fetch public campaigns and posts from Supabase
 */
export function useSupabaseData(): UseSupabaseResult {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const [campaignsRes, postsRes] = await Promise.all([
        supabase
          .from('campaigns')
          .select('*')
          .eq('verified', true)
          .order('created_at', { ascending: false })
          .limit(12),
        supabase
          .from('posts')
          .select('*')
          .eq('status', 'Published')
          .order('views', { ascending: false })
          .limit(50),
      ]);

      if (campaignsRes.error) throw campaignsRes.error;
      if (postsRes.error) throw postsRes.error;

      setCampaigns(campaignsRes.data || []);
      setPosts(postsRes.data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch data');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return {
    campaigns,
    posts,
    loading,
    error,
    refetch: fetchData,
  };
}

/**
 * Hook for managing admin authentication
 */
export function useSupabaseAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Check current session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user || null);
      setLoading(false);
    });

    // Subscribe to auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user || null);
    });

    return () => subscription?.unsubscribe();
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    try {
      setError(null);
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error) throw error;
      setUser(data.user);
      return data.user;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Login failed';
      setError(message);
      throw err;
    }
  }, []);

  const logout = useCallback(async () => {
    try {
      setError(null);
      await supabase.auth.signOut();
      setUser(null);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Logout failed';
      setError(message);
      throw err;
    }
  }, []);

  return {
    user,
    loading,
    error,
    login,
    logout,
    isAuthenticated: !!user,
  };
}

/**
 * Hook to track post views
 */
export function useTrackPostView(postId: string) {
  const trackView = useCallback(async () => {
    try {
      const response = await fetch('/api/track-view', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ postId }),
      });

      if (!response.ok) {
        throw new Error(`Track view failed with status ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Failed to track view:', error);
      throw error;
    }
  }, [postId]);

  return { trackView };
}

/**
 * Hook to manage file uploads to Supabase Storage
 */
export function useFileUpload(bucket: 'posts-media' | 'campaign-assets') {
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);

  const upload = useCallback(
    async (file: File): Promise<string | null> => {
      try {
        setUploading(true);
        setError(null);
        setProgress(0);

        // Validate file
        const maxSize = 100 * 1024 * 1024; // 100MB
        if (file.size > maxSize) {
          throw new Error('File size exceeds 100MB limit');
        }

        const allowedTypes = [
          'image/jpeg',
          'image/png',
          'image/webp',
          'video/mp4',
        ];
        if (!allowedTypes.includes(file.type)) {
          throw new Error('Invalid file type');
        }

        // Generate unique filename
        const fileExt = file.name.split('.').pop();
        const fileName = `${Date.now()}_${Math.random().toString(36).slice(2)}.${fileExt}`;
        const filePath = `${bucket}/${fileName}`;

        // Upload file
        const { error: uploadError } = await supabase.storage
          .from(bucket)
          .upload(filePath, file);

        if (uploadError) throw uploadError;

        // Get public URL
        const { data } = supabase.storage.from(bucket).getPublicUrl(filePath);

        setProgress(100);
        return data.publicUrl;
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Upload failed';
        setError(message);
        throw err;
      } finally {
        setUploading(false);
      }
    },
    [bucket]
  );

  return {
    upload,
    uploading,
    progress,
    error,
  };
}
