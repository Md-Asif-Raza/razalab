-- Raza Labs Database Schema Migration
-- Execute these SQL statements in Supabase console

-- 1. Create campaigns table
CREATE TABLE IF NOT EXISTS campaigns (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  creator TEXT NOT NULL,
  budget DECIMAL(12,2) NOT NULL DEFAULT 0,
  earned DECIMAL(12,2) NOT NULL DEFAULT 0,
  members INT NOT NULL DEFAULT 0,
  platforms TEXT[] DEFAULT '{}',
  verified BOOLEAN DEFAULT FALSE,
  media_url TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- 2. Create posts table
CREATE TABLE IF NOT EXISTS posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('video', 'image')),
  views BIGINT NOT NULL DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'Draft' CHECK (status IN ('Published', 'Draft')),
  media_url TEXT,
  campaign_id UUID REFERENCES campaigns(id) ON DELETE SET NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- 3. Create view_tracking table
CREATE TABLE IF NOT EXISTS view_tracking (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id UUID NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
  ip_address TEXT NOT NULL,
  last_tracked TIMESTAMP DEFAULT NOW(),
  UNIQUE(post_id, ip_address)
);

-- 4. Create admin_users table
CREATE TABLE IF NOT EXISTS admin_users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT UNIQUE NOT NULL,
  full_name TEXT,
  role TEXT DEFAULT 'admin' CHECK (role IN ('admin', 'moderator')),
  created_at TIMESTAMP DEFAULT NOW()
);

-- 5. Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_campaigns_verified ON campaigns(verified);
CREATE INDEX IF NOT EXISTS idx_campaigns_created_at ON campaigns(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_posts_status ON posts(status);
CREATE INDEX IF NOT EXISTS idx_posts_campaign_id ON posts(campaign_id);
CREATE INDEX IF NOT EXISTS idx_posts_created_at ON posts(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_posts_views ON posts(views DESC);
CREATE INDEX IF NOT EXISTS idx_view_tracking_post_id ON view_tracking(post_id);

-- 6. Create increment_post_views function
CREATE OR REPLACE FUNCTION increment_post_views(post_id_param UUID)
RETURNS void AS $$
BEGIN
  UPDATE posts
  SET views = views + 1, updated_at = NOW()
  WHERE id = post_id_param;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 7. Enable Row Level Security
ALTER TABLE campaigns ENABLE ROW LEVEL SECURITY;
ALTER TABLE posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE view_tracking ENABLE ROW LEVEL SECURITY;

-- 8. Create RLS policies for campaigns
CREATE POLICY "Campaigns are viewable by all" 
  ON campaigns FOR SELECT 
  USING (true);

CREATE POLICY "Only admins can insert campaigns"
  ON campaigns FOR INSERT
  WITH CHECK (auth.uid() IN (SELECT id FROM admin_users));

CREATE POLICY "Only admins can update campaigns"
  ON campaigns FOR UPDATE
  USING (auth.uid() IN (SELECT id FROM admin_users));

CREATE POLICY "Only admins can delete campaigns"
  ON campaigns FOR DELETE
  USING (auth.uid() IN (SELECT id FROM admin_users));

-- 9. Create RLS policies for posts
CREATE POLICY "Posts are viewable by all" 
  ON posts FOR SELECT 
  USING (true);

CREATE POLICY "Only admins can insert posts"
  ON posts FOR INSERT
  WITH CHECK (auth.uid() IN (SELECT id FROM admin_users));

CREATE POLICY "Only admins can update posts"
  ON posts FOR UPDATE
  USING (auth.uid() IN (SELECT id FROM admin_users));

CREATE POLICY "Only admins can delete posts"
  ON posts FOR DELETE
  USING (auth.uid() IN (SELECT id FROM admin_users));

-- 10. Create RLS policies for view_tracking
CREATE POLICY "View tracking is readable by all"
  ON view_tracking FOR SELECT
  USING (true);

CREATE POLICY "Anyone can insert view tracking"
  ON view_tracking FOR INSERT
  WITH CHECK (true);

-- 11. Create RLS policies for admin_users
CREATE POLICY "Admin users are viewable by all"
  ON admin_users FOR SELECT
  USING (true);

-- Insert initial admin user (replace with your email)
-- INSERT INTO admin_users (id, email, full_name, role)
-- VALUES ('user-id-here', 'admin@razalabs.com', 'Admin User', 'admin');
