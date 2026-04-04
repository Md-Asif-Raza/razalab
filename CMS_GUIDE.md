# 📝 Raza Labs CMS Guide

This project is a high-fidelity agency platform with a 100% native Supabase integration. No Firebase is used.

## 📊 Content Management
The admin panel at `/admin` (or `/login` to authenticate) allows full control over:
- **Campaigns**: Add New, Edit, Delete, Upload Images, and Graph Data.
- **Why Us (Testimonials)**: Edit entries, roles, and avatars.
- **Reviews (Testimonials Slider)**: Management of review quotes and star ratings.
- **FAQs**: Sortable question/answer management.
- **Brands & Logos**: Manage the marquee marquee of brand names (Bold/Normal styles).
- **Hero & CTA**: Live editing of headline, sub-headline, and button text/links.
- **Media**: Update the YouTube/MP4 video URL and poster image.
- **Calculator**: Adjust Target CPM ($), Organic CPM ($), and volume multipliers.

## 🗄️ Database Setup (Supabase)
To synchronize your local development or staging environment with the database, run the following script in your Supabase SQL Editor:
- **Source**: [cms_migration.sql](cms_migration.sql)
- **Features**: 8 Tables with Row Level Security (RLS) enabled.

## 🎬 Media Management
The CMS supports direct image uploads to the `posts-media` bucket and stores the public URLs in the database.
- **Storage**: Supabase Storage
- **Folder**: posts-media (ensure this bucket exists in your Supabase dashboard)

## 🔧 Environment Variables
The following keys are required in your `.env` file:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY` (for admin operations)
- `SESSION_SECRET` (32-char UUID for auth signing)
- `SUPABASE_JWT_SECRET` (for backend token validation)

## 🔐 Security
- **Middleware**: Admin routes are protected via a session cookie proxy.
- **RLS**: Row-level security policies ensure only authorized service role actions can modify the database.

---
**Status:** ✅ Production Ready | 100% Supabase Integrated
