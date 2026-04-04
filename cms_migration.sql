-- =============================================
-- Raza Labs CMS Migration
-- Run this in Supabase SQL Editor (one time)
-- =============================================

-- 1. FAQs table
CREATE TABLE IF NOT EXISTS faqs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  question TEXT NOT NULL,
  answer TEXT NOT NULL,
  sort_order INT DEFAULT 0,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

ALTER TABLE faqs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "FAQs are viewable by all" ON faqs FOR SELECT USING (true);
CREATE POLICY "Service role can manage faqs" ON faqs FOR ALL USING (true) WITH CHECK (true);

-- 2. Hero content table (single row)
CREATE TABLE IF NOT EXISTS hero_content (
  id TEXT PRIMARY KEY DEFAULT 'main',
  title TEXT NOT NULL DEFAULT 'The Raza Labs',
  title_accent TEXT NOT NULL DEFAULT 'for organic marketing',
  subtitle TEXT NOT NULL DEFAULT '',
  cta_text TEXT NOT NULL DEFAULT 'Get In Touch',
  cta_link TEXT NOT NULL DEFAULT '#cta-end',
  stats_text TEXT DEFAULT '527,00,000+',
  updated_at TIMESTAMP DEFAULT NOW()
);

ALTER TABLE hero_content ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Hero content is viewable by all" ON hero_content FOR SELECT USING (true);
CREATE POLICY "Service role can manage hero" ON hero_content FOR ALL USING (true) WITH CHECK (true);

-- 3. Site settings table (single row)
CREATE TABLE IF NOT EXISTS site_settings (
  id TEXT PRIMARY KEY DEFAULT 'global',
  -- Social links
  instagram_url TEXT DEFAULT 'https://instagram.com',
  youtube_url TEXT DEFAULT 'https://youtube.com',
  twitter_url TEXT DEFAULT 'https://x.com',
  -- Video section
  video_url TEXT DEFAULT '',
  video_poster TEXT DEFAULT '',
  video_caption TEXT DEFAULT 'Over 527 million views generated across clients',
  -- CTA section
  cta_title TEXT DEFAULT 'The Raza Labs',
  cta_title_accent TEXT DEFAULT 'for organic growth',
  cta_subtitle TEXT DEFAULT '12 brands applied in the last 7 days. Spots fill fast — book your onboarding call before the next batch closes.',
  cta_button_text TEXT DEFAULT 'Get in Touch →',
  cta_button_link TEXT DEFAULT '#calculator',
  updated_at TIMESTAMP DEFAULT NOW()
);

ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Settings are viewable by all" ON site_settings FOR SELECT USING (true);
CREATE POLICY "Service role can manage settings" ON site_settings FOR ALL USING (true) WITH CHECK (true);

-- 4. Ensure campaigns table has the right columns for our CMS
-- (Add columns if they don't exist — safe to run multiple times)
DO $$ BEGIN
  ALTER TABLE campaigns ADD COLUMN IF NOT EXISTS name TEXT;
  ALTER TABLE campaigns ADD COLUMN IF NOT EXISTS category TEXT;
  ALTER TABLE campaigns ADD COLUMN IF NOT EXISTS result TEXT;
  ALTER TABLE campaigns ADD COLUMN IF NOT EXISTS price TEXT;
  ALTER TABLE campaigns ADD COLUMN IF NOT EXISTS description TEXT;
  ALTER TABLE campaigns ADD COLUMN IF NOT EXISTS graph_data TEXT;
  ALTER TABLE campaigns ADD COLUMN IF NOT EXISTS img_url TEXT;
  ALTER TABLE campaigns ADD COLUMN IF NOT EXISTS sort_order INT DEFAULT 0;
  ALTER TABLE campaigns ADD COLUMN IF NOT EXISTS is_active BOOLEAN DEFAULT TRUE;
EXCEPTION WHEN OTHERS THEN NULL;
END $$;

-- 5. Ensure testimonials table exists
CREATE TABLE IF NOT EXISTS testimonials (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  role TEXT,
  quote TEXT NOT NULL,
  avatar_url TEXT,
  sort_order INT DEFAULT 0,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

ALTER TABLE testimonials ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Testimonials viewable by all" ON testimonials FOR SELECT USING (true);
CREATE POLICY "Service role can manage testimonials" ON testimonials FOR ALL USING (true) WITH CHECK (true);

-- 6. Ensure reviews table exists
CREATE TABLE IF NOT EXISTS reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  handle TEXT,
  content TEXT NOT NULL,
  stars INT DEFAULT 5,
  avatar_url TEXT,
  sort_order INT DEFAULT 0,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Reviews viewable by all" ON reviews FOR SELECT USING (true);
CREATE POLICY "Service role can manage reviews" ON reviews FOR ALL USING (true) WITH CHECK (true);

-- 7. Brands table
CREATE TABLE IF NOT EXISTS brands (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  is_bold BOOLEAN DEFAULT FALSE,
  sort_order INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW()
);
ALTER TABLE brands ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Brands viewable by all" ON brands FOR SELECT USING (true);
CREATE POLICY "Service role can manage brands" ON brands FOR ALL USING (true) WITH CHECK (true);

-- 8. Tech Stack (What We Do) table
CREATE TABLE IF NOT EXISTS tech_stack (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  icon TEXT,
  description TEXT,
  sort_order INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW()
);
ALTER TABLE tech_stack ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Tech stack viewable by all" ON tech_stack FOR SELECT USING (true);
CREATE POLICY "Service role can manage tech stack" ON tech_stack FOR ALL USING (true) WITH CHECK (true);

-- 9. Calculator settings in site_settings
ALTER TABLE site_settings ADD COLUMN IF NOT EXISTS target_cpm DECIMAL(10,2) DEFAULT 25.00;
ALTER TABLE site_settings ADD COLUMN IF NOT EXISTS organic_cpm DECIMAL(10,2) DEFAULT 1.00;
ALTER TABLE site_settings ADD COLUMN IF NOT EXISTS platform_multiplier INT DEFAULT 3;
ALTER TABLE site_settings ADD COLUMN IF NOT EXISTS days_multiplier INT DEFAULT 7;

-- 10. Insert default settings rows
INSERT INTO site_settings (id) VALUES ('global') ON CONFLICT (id) DO NOTHING;
INSERT INTO hero_content (id) VALUES ('main') ON CONFLICT (id) DO NOTHING;
