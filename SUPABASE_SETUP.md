# Supabase Setup Guide - Raza Labs

## Prerequisites
- Supabase account (https://supabase.com)
- GitHub account for OAuth (optional)
- Basic CLI knowledge

---

## Step 1: Create Supabase Project

1. Go to [https://app.supabase.com](https://app.supabase.com)
2. Click "New Project"
3. Choose organization (or create new)
4. **Project name:** `raza-labs`
5. **Database password:** Generate strong password (save securely)
6. **Region:** Choose closest to your target audience
7. Click "Create new project"

Wait for project initialization (~2 minutes)

---

## Step 2: Get API Keys

1. Go to **Settings** → **API**
2. Copy these keys to `.env.local`:
   - **Project URL** → `NEXT_PUBLIC_SUPABASE_URL`
   - **Anon Key** → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - **Service Role Key** → `SUPABASE_SERVICE_ROLE_KEY` (⚠️ Keep secret!)

---

## Step 3: Run Database Migrations

1. Go to **SQL Editor** in Supabase console
2. Click "New Query"
3. Copy contents from `database.sql` file in project root
4. Paste into SQL Editor
5. Click "Run"

✅ Database schema is now ready!

---

## Step 4: Create Storage Buckets

1. Go to **Storage** → **Buckets**
2. Click "New Bucket"
3. **Name:** `posts-media` → Public (toggle ON)
4. Create another: `campaign-assets` → Public (toggle ON)

---

## Step 5: Set Up Authentication

### Enable Email/Password Auth
1. Go to **Authentication** → **Users**
2. Click your avatar → **Auth Admin** (visible after first user signup)

### Create Your Admin User (Manual Setup)
1. Go to **SQL Editor** → New Query:

```sql
-- Insert admin user (replace email)
INSERT INTO admin_users (id, email, full_name, role)
SELECT 
  id,
  email,
  'Admin User',
  'admin'
FROM auth.users 
WHERE email = 'your-email@example.com'
LIMIT 1;
```

2. Run query

Or sign up normally via your app, then run the SQL above.

---

## Step 6: Configure Row Level Security (Optional)

If SQL migration didn't apply RLS policies, run this:

```sql
-- Enable RLS on all tables
ALTER TABLE campaigns ENABLE ROW LEVEL SECURITY;
ALTER TABLE posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;

-- Drop old policies if they exist
DROP POLICY IF EXISTS "Campaigns are viewable by all" ON campaigns;
DROP POLICY IF EXISTS "Only admins can insert campaigns" ON campaigns;

-- Create new policies
CREATE POLICY "Campaigns are viewable by all" 
  ON campaigns FOR SELECT USING (true);

CREATE POLICY "Only admins can insert campaigns"
  ON campaigns FOR INSERT
  WITH CHECK (auth.uid() IN (SELECT id FROM admin_users));
```

---

## Step 7: Test Configuration

### Test in Next.js Project

```bash
# 1. Install dependencies
npm install

# 2. Create .env.local with your keys
cp .env.example .env.local
# Edit .env.local and add your Supabase URL and keys

# 3. Start dev server
npm run dev

# 4. Visit http://localhost:3000
```

### Test Database Connection

In your app, create a test script:

```typescript
import { supabase } from '@/lib/supabase/client';

async function testConnection() {
  const { data, error } = await supabase
    .from('campaigns')
    .select('count(*)', { count: 'exact' });

  if (error) console.error('Error:', error);
  else console.log('Connected! Rows:', data);
}

testConnection();
```

---

## Step 8: Load Sample Data

Run in Supabase SQL Editor:

```sql
-- Insert sample campaigns
INSERT INTO campaigns (title, creator, budget, earned, members, platforms, verified)
VALUES
  ('Summer Social Boost', 'Alex Chen', 5000.00, 3200.00, 12, '{"tiktok","instagram"}', true),
  ('Brand Awareness Campaign', 'Maya Rodriguez', 8000.00, 6500.00, 18, '{"youtube","tiktok"}', true),
  ('Product Launch', 'John Smith', 10000.00, 8900.00, 25, '{"instagram","tiktok","youtube"}', true);

-- Insert sample posts
INSERT INTO posts (title, type, views, status)
VALUES
  ('Epic Product Unboxing', 'video', 125000, 'Published'),
  ('Behind the Scenes', 'image', 45000, 'Published'),
  ('Tutorial: How to Get Started', 'video', 89000, 'Published');
```

---

## Step 9: Environment Variables

Create `.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-here

NEXT_PUBLIC_API_BASE_URL=http://localhost:3000
NODE_ENV=development
```

---

## Troubleshooting

### "PostgreSQL error could not connect"
- Check database password is correct
- Wait for project to fully initialize
- Verify network firewall isn't blocking connections

### "Policies not applying"
- Ensure RLS is enabled: `ALTER TABLE table_name ENABLE ROW LEVEL SECURITY;`
- Check policies exist: **Authentication** → **Policies**
- May need to turn off/on RLS for policies to activate

### "File uploads not working"
- Verify bucket exists and is **Public**
- Check CORS settings in Storage

### "Authentication failing"
- Verify user exists in `auth.users`
- Check role is set in `admin_users` table
- Ensure password is at least 6 characters

---

## Next Steps

1. ✅ Database schema created
2. ✅ Storage buckets configured
3. ✅ Authentication set up
4. Now proceed with Next.js integration
5. Update components with Supabase data
6. Deploy to Vercel with environment variables

---

## Resources

- [Supabase Docs](https://supabase.com/docs)
- [Supabase CLI](https://supabase.com/docs/guides/cli)
- [PostgreSQL Docs](https://www.postgresql.org/docs/)
- [Row Level Security](https://supabase.com/docs/guides/auth/row-level-security)

