# Raza Labs: Firebase → Supabase + Framer Motion Migration Plan

**Status:** Implementation Guide  
**Date:** April 4, 2026  
**Target Completion:** 4 weeks  

---

## Executive Summary

This document outlines the complete migration from Firebase to Supabase, implementation of Framer Motion animations, and adoption of glassmorphism UI design patterns. The migration preserves all existing functionality while adding enterprise-grade scalability and modern aesthetic.

---

## Phase 1: Dependencies & Setup (Days 1-2)

### 1.1 Update package.json

**Remove:**
```json
{
  "firebase": "^12.11.0",
  "firebase-admin": "^13.7.0"
}
```

**Add:**
```json
{
  "@supabase/supabase-js": "^2.43.0",
  "@supabase/auth-helpers-nextjs": "^0.7.0",
  "framer-motion": "^11.0.0",
  "zod": "^3.22.0",
  "react-hot-toast": "^2.4.0"
}
```

### 1.2 Environment Variables Setup

Create `.env.local`:
```env
# Supabase Configuration (PUBLIC)
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key

# Supabase Configuration (SERVER-SIDE)
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# Application Settings
NEXT_PUBLIC_API_BASE_URL=http://localhost:3000
NODE_ENV=development
```

Create `.env.example`:
```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
NEXT_PUBLIC_API_BASE_URL=http://localhost:3000
```

---

## Phase 2: Supabase Infrastructure (Days 3-5)

### 2.1 Database Schema Setup

**Execute in Supabase SQL Editor:**

#### Create `campaigns` table:
```sql
CREATE TABLE campaigns (
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

CREATE INDEX idx_campaigns_verified ON campaigns(verified);
CREATE INDEX idx_campaigns_created_at ON campaigns(created_at DESC);
```

#### Create `posts` table:
```sql
CREATE TABLE posts (
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

CREATE INDEX idx_posts_status ON posts(status);
CREATE INDEX idx_posts_campaign_id ON posts(campaign_id);
CREATE INDEX idx_posts_created_at ON posts(created_at DESC);
```

#### Create `view_tracking` table:
```sql
CREATE TABLE view_tracking (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id UUID NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
  ip_address TEXT NOT NULL,
  last_tracked TIMESTAMP DEFAULT NOW(),
  UNIQUE(post_id, ip_address)
);

CREATE INDEX idx_view_tracking_post_id ON view_tracking(post_id);
```

#### Create `admin_users` table:
```sql
CREATE TABLE admin_users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT UNIQUE NOT NULL,
  full_name TEXT,
  role TEXT DEFAULT 'admin' CHECK (role IN ('admin', 'moderator')),
  created_at TIMESTAMP DEFAULT NOW()
);
```

### 2.2 Row Level Security (RLS) Policies

```sql
-- posts table policies
CREATE POLICY "Posts are viewable by all" 
  ON posts FOR SELECT 
  USING (true);

CREATE POLICY "Only admins can insert posts"
  ON posts FOR INSERT
  WITH CHECK (auth.uid() IN (SELECT id FROM admin_users));

CREATE POLICY "Only admins can update posts"
  ON posts FOR UPDATE
  USING (auth.uid() IN (SELECT id FROM admin_users));

-- campaigns table policies
CREATE POLICY "Campaigns are viewable by all"
  ON campaigns FOR SELECT
  USING (true);

CREATE POLICY "Only admins can insert campaigns"
  ON campaigns FOR INSERT
  WITH CHECK (auth.uid() IN (SELECT id FROM admin_users));

CREATE POLICY "Only admins can update campaigns"
  ON campaigns FOR UPDATE
  USING (auth.uid() IN (SELECT id FROM admin_users));

-- Enable RLS
ALTER TABLE posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE campaigns ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;
```

### 2.3 Storage Buckets

Create in Supabase Storage:
- `posts-media` (public bucket for video/image thumbnails)
- `campaign-assets` (public bucket for brand logos)

```sql
-- Storage bucket policies (optional SQL setup)
CREATE POLICY "Public Access"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'posts-media' OR bucket_id = 'campaign-assets');
```

---

## Phase 3: Backend Implementation (Days 6-10)

### 3.1 Create Supabase Configuration

**File: `src/lib/supabase/client.ts`**
```typescript
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type Database = {
  public: {
    Tables: {
      campaigns: {
        Row: {
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
      };
      posts: {
        Row: {
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
      };
    };
  };
};
```

**File: `src/lib/supabase/server.ts`**
```typescript
import { createClient } from '@supabase/supabase-js';
import { type Database } from './client';

export function createServerClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

  return createClient<Database>(supabaseUrl, supabaseServiceKey);
}
```

### 3.2 Update API Routes for Supabase

**File: `src/app/api/auth/login/route.ts`** (Refactored)
```typescript
import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase/client';

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password required' },
        { status: 400 }
      );
    }

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      return NextResponse.json(
        { error: error.message },
        { status: 401 }
      );
    }

    // Set session cookie
    const response = NextResponse.json({ status: 'success', user: data.user });
    
    response.cookies.set('sb-access-token', data.session?.access_token || '', {
      maxAge: 60 * 60 * 24 * 7,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      path: '/',
      sameSite: 'lax',
    });

    return response;
  } catch (error) {
    return NextResponse.json(
      { error: 'Authentication failed' },
      { status: 500 }
    );
  }
}
```

**File: `src/app/api/track-view/route.ts`** (Refactored for Supabase)
```typescript
import { NextResponse } from 'next/server';
import { createServerClient } from '@/lib/supabase/server';

export const dynamic = 'force-dynamic';

const VIEW_CACHE = new Map<string, number>();
const THROTTLE_DURATION = 1000 * 60 * 60 * 4; // 4 hours

export async function POST(request: Request) {
  try {
    const { postId } = await request.json();

    if (!postId) {
      return NextResponse.json(
        { error: 'postId required' },
        { status: 400 }
      );
    }

    const ip = request.headers.get('x-forwarded-for') || 'anonymous';
    const cacheKey = `${ip}:${postId}`;
    const now = Date.now();

    const lastView = VIEW_CACHE.get(cacheKey);
    if (lastView && now - lastView < THROTTLE_DURATION) {
      return NextResponse.json({ status: 'throttled' }, { status: 200 });
    }

    const supabase = createServerClient();

    // Upsert view tracking record
    const { error: trackError } = await supabase
      .from('view_tracking')
      .upsert(
        { post_id: postId, ip_address: ip, last_tracked: new Date().toISOString() },
        { onConflict: 'post_id,ip_address' }
      );

    if (trackError) throw trackError;

    // Increment view count
    const { error: updateError } = await supabase.rpc('increment_post_views', {
      post_id_param: postId,
    });

    if (updateError) throw updateError;

    // Update cache
    VIEW_CACHE.set(cacheKey, now);

    // Cleanup cache if too large
    if (VIEW_CACHE.size > 50000) {
      VIEW_CACHE.clear();
    }

    return NextResponse.json({ status: 'tracked' }, { status: 200 });
  } catch (error) {
    console.error('Tracking error:', error);
    return NextResponse.json(
      { error: 'Tracking failed' },
      { status: 500 }
    );
  }
}
```

**Database Function: `increment_post_views`**
```sql
CREATE OR REPLACE FUNCTION increment_post_views(post_id_param UUID)
RETURNS void AS $$
BEGIN
  UPDATE posts
  SET views = views + 1
  WHERE id = post_id_param;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
```

---

## Phase 4: Frontend Components with Framer Motion (Days 11-15)

### 4.1 Glassmorphism Card Component

**File: `src/components/ui/GlassCard.tsx`**
```typescript
'use client';
import { ReactNode } from 'react';
import { motion } from 'framer-motion';
import clsx from 'clsx';

interface GlassCardProps {
  children: ReactNode;
  className?: string;
  delay?: number;
  hover?: boolean;
  onClick?: () => void;
}

export function GlassCard({
  children,
  className,
  delay = 0,
  hover = true,
  onClick,
}: GlassCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      whileHover={hover ? { y: -8, boxShadow: '0 20px 40px rgba(0, 255, 200, 0.1)' } : {}}
      transition={{
        duration: 0.6,
        delay,
        type: 'spring',
        stiffness: 100,
      }}
      onClick={onClick}
      className={clsx(
        'relative backdrop-blur-lg bg-white/5 border border-white/10 rounded-2xl',
        'hover:border-white/20 transition-colors duration-300',
        'overflow-hidden group',
        onClick && 'cursor-pointer',
        className
      )}
    >
      {/* Background gradient effect */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      
      {/* Content */}
      <div className="relative z-10">{children}</div>
    </motion.div>
  );
}
```

### 4.2 Animated Campaign Card Component

**File: `src/components/CampaignCard.tsx`**
```typescript
'use client';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { Campaign } from '@/types';

interface CampaignCardProps {
  campaign: Campaign;
  index: number;
}

export function CampaignCard({ campaign, index }: CampaignCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      whileInView={{ opacity: 1, scale: 1 }}
      whileHover={{ scale: 1.05 }}
      transition={{
        duration: 0.5,
        delay: index * 0.1,
        type: 'spring',
        stiffness: 200,
      }}
      viewport={{ once: true, amount: 0.3 }}
      className="group relative h-80 rounded-2xl overflow-hidden cursor-pointer"
    >
      {/* Background image with overlay */}
      <div className="absolute inset-0">
        {campaign.media_url && (
          <Image
            src={campaign.media_url}
            alt={campaign.title}
            fill
            className="object-cover group-hover:scale-110 transition-transform duration-500"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />
      </div>

      {/* Content */}
      <div className="relative z-10 h-full flex flex-col justify-between p-6">
        {/* Top: Verified Badge */}
        {campaign.verified && (
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="flex items-center gap-2 w-fit"
          >
            <div className="w-2 h-2 rounded-full bg-cyan-400" />
            <span className="text-xs font-semibold text-cyan-400 uppercase tracking-wider">
              Verified Campaign
            </span>
          </motion.div>
        )}

        {/* Bottom: Campaign Info */}
        <div className="space-y-4">
          <div>
            <h3 className="text-xl font-bold text-white mb-2">{campaign.title}</h3>
            <p className="text-sm text-gray-300">by {campaign.creator}</p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 gap-4 pt-4 border-t border-white/10">
            <div>
              <p className="text-xs text-gray-400 uppercase tracking-wider">Budget</p>
              <p className="text-lg font-semibold text-white">
                ${campaign.budget.toLocaleString()}
              </p>
            </div>
            <div>
              <p className="text-xs text-gray-400 uppercase tracking-wider">Earned</p>
              <p className="text-lg font-semibold text-cyan-400">
                ${campaign.earned.toLocaleString()}
              </p>
            </div>
          </div>

          {/* Platforms */}
          <div className="flex flex-wrap gap-2">
            {campaign.platforms?.map((platform) => (
              <motion.span
                key={platform}
                whileHover={{ scale: 1.1 }}
                className="text-xs px-3 py-1 rounded-full bg-white/10 text-white/80"
              >
                {platform}
              </motion.span>
            ))}
          </div>
        </div>
      </div>

      {/* Hover glow effect */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-cyan-500/0 via-cyan-500/10 to-transparent opacity-0 group-hover:opacity-100 blur-xl transition-opacity duration-500"
        initial={{ opacity: 0 }}
        whileHover={{ opacity: 1 }}
      />
    </motion.div>
  );
}
```

### 4.3 Animated Section Wrapper

**File: `src/components/ui/AnimatedSection.tsx`**
```typescript
'use client';
import { ReactNode } from 'react';
import { motion } from 'framer-motion';

interface AnimatedSectionProps {
  children: ReactNode;
  delay?: number;
}

export function AnimatedSection({ children, delay = 0 }: AnimatedSectionProps) {
  return (
    <motion.section
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      transition={{ duration: 0.8, delay }}
      viewport={{ once: true, amount: 0.2 }}
    >
      {children}
    </motion.section>
  );
}
```

---

## Phase 5: Admin Dashboard with Glassmorphism (Days 16-20)

### 5.1 Updated Admin Component Structure

**File: `src/components/admin/AdminLayout.tsx`**
```typescript
'use client';
import { ReactNode } from 'react';
import { motion } from 'framer-motion';
import { AdminSidebar } from './AdminSidebar';
import { AdminHeader } from './AdminHeader';

interface AdminLayoutProps {
  children: ReactNode;
  currentTab: string;
}

export function AdminLayout({ children, currentTab }: AdminLayoutProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      {/* Animated background elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <motion.div
          animate={{
            x: [0, 100, 0],
            y: [0, 100, 0],
          }}
          transition={{ duration: 20, repeat: Infinity }}
          className="absolute top-20 left-20 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl"
        />
        <motion.div
          animate={{
            x: [0, -100, 0],
            y: [0, -100, 0],
          }}
          transition={{ duration: 25, repeat: Infinity }}
          className="absolute bottom-20 right-20 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl"
        />
      </div>

      <div className="relative z-10 flex h-screen">
        <AdminSidebar currentTab={currentTab} />
        
        <div className="flex-1 flex flex-col overflow-hidden">
          <AdminHeader />
          
          <motion.main
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="flex-1 overflow-auto"
          >
            {children}
          </motion.main>
        </div>
      </div>
    </div>
  );
}
```

### 5.2 Glassmorphism Form Component

**File: `src/components/admin/GlassForm.tsx`**
```typescript
'use client';
import { ReactNode } from 'react';
import { motion } from 'framer-motion';
import { GlassCard } from '@/components/ui/GlassCard';

interface GlassFormProps {
  children: ReactNode;
  onSubmit: (e: React.FormEvent) => void;
  title: string;
  loading?: boolean;
}

export function GlassForm({
  children,
  onSubmit,
  title,
  loading = false,
}: GlassFormProps) {
  return (
    <GlassCard className="p-8 max-w-2xl mx-auto">
      <form onSubmit={onSubmit} className="space-y-6">
        <motion.h2
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-3xl font-bold text-white mb-8"
        >
          {title}
        </motion.h2>

        {children}

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="flex gap-4"
        >
          <button
            type="submit"
            disabled={loading}
            className="flex-1 py-3 px-6 rounded-lg bg-gradient-to-r from-cyan-500 to-blue-500 
                       text-white font-semibold hover:shadow-lg hover:shadow-cyan-500/50 
                       transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Processing...' : 'Submit'}
          </button>
        </motion.div>
      </form>
    </GlassCard>
  );
}
```

### 5.3 Input Component with Glassmorphism

**File: `src/components/admin/GlassInput.tsx`**
```typescript
'use client';
import { inputHTMLAttributes } from 'react';
import { motion } from 'framer-motion';

interface GlassInputProps extends inputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export function GlassInput({
  label,
  error,
  ...props
}: GlassInputProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-2"
    >
      {label && (
        <label className="block text-sm font-medium text-white/90">
          {label}
        </label>
      )}
      
      <input
        {...props}
        className="w-full px-4 py-3 rounded-lg backdrop-blur-sm bg-white/5 border border-white/10
                   text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-cyan-500
                   focus:border-transparent transition-all duration-300 hover:bg-white/8"
      />
      
      {error && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-sm text-red-400"
        >
          {error}
        </motion.p>
      )}
    </motion.div>
  );
}
```

---

## Phase 6: Data Migration (Days 21-22)

### 6.1 Migration Script

**File: `scripts/migrate-firebase-to-supabase.ts`**
```typescript
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs } from 'firebase/firestore';
import { createClient } from '@supabase/supabase-js';

const firebaseConfig = {
  // Your Firebase config
};

const firebaseApp = initializeApp(firebaseConfig);
const firebaseDb = getFirestore(firebaseApp);

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

async function migrateData() {
  console.log('Starting migration from Firebase to Supabase...');

  // Migrate posts
  const postsSnapshot = await getDocs(collection(firebaseDb, 'posts'));
  const posts = postsSnapshot.docs.map(doc => ({
    title: doc.data().title,
    type: doc.data().type || 'image',
    views: doc.data().views || 0,
    status: doc.data().status || 'Published',
    media_url: doc.data().mediaUrl || null,
    created_at: doc.data().createdAt?.toDate().toISOString() || new Date().toISOString(),
  }));

  const { error: postsError } = await supabase
    .from('posts')
    .insert(posts);

  if (postsError) {
    console.error('Posts migration error:', postsError);
  } else {
    console.log(`✓ Migrated ${posts.length} posts`);
  }

  console.log('Migration complete!');
}

migrateData().catch(console.error);
```

---

## Phase 7: Testing & Optimization (Days 23-28)

### 7.1 Testing Checklist
- [ ] Supabase connections working
- [ ] Authentication flow complete
- [ ] View tracking functional
- [ ] File uploads to storage buckets
- [ ] Animations smooth on 60fps
- [ ] Glassmorphism rendering correctly
- [ ] RLS policies enforced
- [ ] Responsive design on mobile

### 7.2 Performance Optimization
- Image lazy loading optimization
- Bundle size analysis
- Database query optimization
- Animation frame rate tuning

---

## Phase 8: Deployment (Days 29-30)

### 8.1 Environment Setup on Vercel
- Configure environment variables
- Set up Supabase webhook for real-time updates
- Enable Edge Functions if using

### 8.2 Go-Live Checklist
- [ ] All tests passing
- [ ] Supabase backups configured
- [ ] Error monitoring (Sentry) active
- [ ] Analytics configured
- [ ] DNS and SSL verified

---

## Rollback Plan

If critical issues arise:

1. **Database:** Keep Firebase data in read-only mode for 30 days
2. **API:** Route switch via Next.js middleware
3. **Frontend:** Feature flag for Supabase/Firebase selection

```typescript
// Example feature flag (src/lib/flags.ts)
export const USE_SUPABASE = process.env.NEXT_PUBLIC_USE_SUPABASE === 'true';
```

---

## File Structure After Migration

```
src/
├── app/
│   ├── admin/
│   │   ├── page.tsx (refactored)
│   │   └── layout.tsx
│   ├── api/
│   │   ├── auth/login/route.ts
│   │   ├── track-view/route.ts
│   │   └── upload/route.ts (new)
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx
├── components/
│   ├── admin/
│   │   ├── AdminLayout.tsx (new)
│   │   ├── AdminSidebar.tsx (new)
│   │   ├── AdminHeader.tsx (new)
│   │   ├── GlassForm.tsx (new)
│   │   ├── GlassInput.tsx (new)
│   │   ├── DashboardStats.tsx (new)
│   │   └── FileUpload.tsx (new)
│   ├── ui/
│   │   ├── GlassCard.tsx (new)
│   │   └── AnimatedSection.tsx (new)
│   ├── CampaignCard.tsx (new - with Framer Motion)
│   ├── Section*.tsx (updated with Framer Motion)
│   └── ...existing components
├── lib/
│   ├── supabase/
│   │   ├── client.ts (new)
│   │   └── server.ts (new)
│   ├── types/
│   │ └── index.ts (new)
│   └── ...existing utils
├── hooks/
│   ├── useSupabase.ts (new)
│   └── useAuth.ts (new)
└── types/
    └── index.ts (new)
```

---

## Success Metrics

- ✓ All existing features working with Supabase
- ✓ Animations running at 60+ FPS
- ✓ Glassmorphism UI applied consistently
- ✓ Admin dashboard fully responsive
- ✓ View tracking accurate with throttling
- ✓ Page load time < 2.5 seconds
- ✓ Lighthouse score > 85
- ✓ Zero unhandled errors in production

---

**Next Steps:**
1. Initialize Supabase project (see Phase 2)
2. Update package.json with new dependencies
3. Follow Phase 3-5 for backend and frontend implementation
4. Execute Phase 6 for data migration
5. Complete testing in Phase 7

