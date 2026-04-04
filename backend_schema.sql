-- Raza Labs Backend Schema (v1.0)
-- Based on April 2026 PRD

-- 1. CAMPAIGNS TABLE
CREATE TABLE IF NOT EXISTS public.campaigns (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL CHECK (char_length(title) BETWEEN 3 AND 120),
    creator TEXT NOT NULL,
    purpose TEXT NOT NULL CHECK (purpose IN ('Personal brand', 'Brand awareness', 'Music promotion', 'Content creator')),
    budget NUMERIC(12,2) NOT NULL DEFAULT 0,
    earned NUMERIC(12,2) NOT NULL DEFAULT 0,
    members INTEGER NOT NULL DEFAULT 0,
    rpm NUMERIC(8,2) NOT NULL DEFAULT 0,
    platforms TEXT[] NOT NULL DEFAULT '{}',
    verified BOOLEAN NOT NULL DEFAULT false,
    media_url TEXT,
    description TEXT CHECK (char_length(description) <= 500),
    avatar_initials TEXT NOT NULL CHECK (char_length(avatar_initials) = 2),
    status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'paused', 'completed')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 2. POSTS TABLE
CREATE TABLE IF NOT EXISTS public.posts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL CHECK (char_length(title) BETWEEN 3 AND 200),
    type TEXT NOT NULL CHECK (type IN ('video', 'image')),
    media_url TEXT NOT NULL,
    storage_path TEXT NOT NULL,
    views BIGINT NOT NULL DEFAULT 0,
    status TEXT NOT NULL DEFAULT 'Draft' CHECK (status IN ('Published', 'Draft')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 3. VIEW EVENTS TABLE (Rate limiting)
CREATE TABLE IF NOT EXISTS public.view_events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    post_id UUID NOT NULL REFERENCES public.posts(id) ON DELETE CASCADE,
    ip_hash TEXT NOT NULL,
    viewed_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 4. INDEXES
-- Campaigns
CREATE INDEX IF NOT EXISTS idx_campaigns_status_created ON public.campaigns (status, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_campaigns_verified ON public.campaigns (verified);

-- Posts
CREATE INDEX IF NOT EXISTS idx_posts_status_created ON public.posts (status, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_posts_views ON public.posts (views DESC);

-- View Events
CREATE INDEX IF NOT EXISTS idx_view_events_tracking ON public.view_events (post_id, ip_hash, viewed_at DESC);

-- 5. UPDATED_AT TRIGGER
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER tr_campaigns_updated_at
    BEFORE UPDATE ON public.campaigns
    FOR EACH ROW
    EXECUTE FUNCTION public.set_updated_at();

-- 6. ROW LEVEL SECURITY (RLS)
ALTER TABLE public.campaigns ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.view_events ENABLE ROW LEVEL SECURITY;

-- Policies: Campaigns
CREATE POLICY "Allow public SELECT on campaigns" ON public.campaigns
    FOR SELECT TO public USING (true);

CREATE POLICY "Allow authenticated INSERT on campaigns" ON public.campaigns
    FOR INSERT TO authenticated WITH CHECK (true);

CREATE POLICY "Allow authenticated UPDATE on campaigns" ON public.campaigns
    FOR UPDATE TO authenticated USING (true);

CREATE POLICY "Allow authenticated DELETE on campaigns" ON public.campaigns
    FOR DELETE TO authenticated USING (true);

-- Policies: Posts
CREATE POLICY "Allow public SELECT on posts" ON public.posts
    FOR SELECT TO public USING (true);

CREATE POLICY "Allow authenticated INSERT on posts" ON public.posts
    FOR INSERT TO authenticated WITH CHECK (true);

CREATE POLICY "Allow authenticated UPDATE on posts" ON public.posts
    FOR UPDATE TO authenticated USING (true);

CREATE POLICY "Allow authenticated DELETE on posts" ON public.posts
    FOR DELETE TO authenticated USING (true);

-- Policies: View Events
CREATE POLICY "Allow public INSERT on view_events" ON public.view_events
    FOR INSERT TO public WITH CHECK (true);

CREATE POLICY "Allow authenticated SELECT on view_events" ON public.view_events
    FOR SELECT TO authenticated USING (true);

CREATE POLICY "Allow authenticated DELETE on view_events" ON public.view_events
    FOR DELETE TO authenticated USING (true);

-- 7. CLEANUP JOB (Concept)
-- Note: pg_cron must be enabled in Supabase for this to run automatically
-- SELECT cron.schedule('view-events-cleanup', '0 0 * * *', $$
--     DELETE FROM view_events WHERE viewed_at < NOW() - INTERVAL '24 hours';
-- 8. AUTH LOG (Section 9.3)
CREATE TABLE IF NOT EXISTS public.auth_log (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    request_id TEXT,
    ip_hash TEXT NOT NULL,
    attempted_email TEXT NOT NULL,
    result TEXT NOT NULL, -- 'success' | 'failure'
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.auth_log ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Only authenticated can read auth_log" ON public.auth_log
    FOR SELECT TO authenticated USING (true);
