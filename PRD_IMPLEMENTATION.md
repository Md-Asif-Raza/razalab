# Raza Labs PRD Implementation Guide

## Overview
Updated PRD for Raza Labs with Supabase backend, Framer Motion animations, and glassmorphism UI patterns.

---

## Database Schema

### campaigns table
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
```

### posts table
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
```

### view_tracking table
```sql
CREATE TABLE view_tracking (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id UUID NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
  ip_address TEXT NOT NULL,
  last_tracked TIMESTAMP DEFAULT NOW(),
  UNIQUE(post_id, ip_address)
);
```

### admin_users table
```sql
CREATE TABLE admin_users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT UNIQUE NOT NULL,
  full_name TEXT,
  role TEXT DEFAULT 'admin' CHECK (role IN ('admin', 'moderator')),
  created_at TIMESTAMP DEFAULT NOW()
);
```

---

## Key Files Created

### Configuration
- `src/lib/supabase/client.ts` - Client-side Supabase instance
- `src/lib/supabase/server.ts` - Server-side Supabase instance
- `src/types/index.ts` - TypeScript type definitions

### UI Components (Glassmorphism)
- `src/components/ui/GlassCard.tsx` - Reusable glass card component
- `src/components/ui/AnimatedSection.tsx` - Animated section wrapper
- `src/components/CampaignCard.tsx` - Campaign card with Framer Motion

### Admin Components
- `src/components/admin/AdminLayout.tsx` - Admin dashboard layout
- `src/components/admin/GlassForm.tsx` - Glass-style form container
- `src/components/admin/GlassInput.tsx` - Glass-style input field
- `src/components/admin/FileUpload.tsx` - File upload component

### API Routes
- `src/app/api/auth/login/route.ts` - Supabase authentication
- `src/app/api/track-view/route.ts` - View tracking with throttling
- `src/app/api/posts/create/route.ts` - Create posts
- `src/app/api/posts/fetch/route.ts` - Fetch published posts
- `src/app/api/campaigns/fetch/route.ts` - Fetch campaigns

### Hooks
- `src/hooks/useSupabase.ts` - Custom hooks for Supabase operations

---

## Implementation Checklist

### Phase 1: Setup
- [ ] Create Supabase project
- [ ] Install dependencies: `npm install`
- [ ] Configure environment variables in `.env.local`
- [ ] Run database migrations in Supabase console

### Phase 2: Backend
- [ ] Create all database tables
- [ ] Set up Row Level Security policies
- [ ] Create storage buckets
- [ ] Test API endpoints with cURL/Postman

### Phase 3: Frontend
- [ ] Update existing components with Framer Motion
- [ ] Import new glass components in layouts
- [ ] Implement custom hooks where needed
- [ ] Test animations on 60fps

### Phase 4: Admin
- [ ] Rebuild admin dashboard with glassmorphism
- [ ] Integrate file upload functionality
- [ ] Add form validation with Zod
- [ ] Implement error handling with react-hot-toast

### Phase 5: Testing & Deployment
- [ ] Test authentication flow
- [ ] Test view tracking
- [ ] Test file uploads
- [ ] Deploy to Vercel

---

## Styling Approach

### Glassmorphism Design System
- **Backdrop Blur:** `backdrop-blur-lg`
- **Background:** `bg-white/5` with `border border-white/10`
- **Hover State:** Increased opacity and glow effects
- **Colors:** Deep dark backgrounds with cyan/blue accents

### Framer Motion Patterns
- **Entrance:** `initial={{ opacity: 0, y: 20 }}` → `animate={{ opacity: 1, y: 0 }}`
- **Hover:** `whileHover={{ scale: 1.05 }}`
- **Scroll:** `whileInView={{ opacity: 1 }}` with `viewport={{ once: true }}`
- **Spring Physics:** `type: 'spring', stiffness: 200`

---

## Performance Considerations

1. **Image Optimization**
   - Use `next/image` for all images
   - Lazy load images with `loading="lazy"`
   - Generate multiple sizes with `sizes` prop

2. **Animation Optimization**
   - Use `will-change` for animated elements
   - Prefer `transform` and `opacity` over layout properties
   - Profile with DevTools Performance tab

3. **Database Queries**
   - Use `limit()` for pagination
   - Index frequently queried columns
   - Use `select()` to fetch only needed columns

4. **Caching**
   - Next.js ISR with `revalidate` in API routes
   - Client-side caching with React Query (optional)
   - Redis integration for high-traffic endpoints

---

## Security Checklist

- [ ] Row Level Security policies configured
- [ ] API endpoints validate authentication
- [ ] Input validation with Zod schemas
- [ ] Rate limiting on POST endpoints
- [ ] File upload validation (size, type)
- [ ] Environment variables properly secured

---

## Next Steps

1. Set up Supabase project and environment
2. Run database migrations
3. Test API endpoints
4. Update existing components with new patterns
5. Deploy to production

