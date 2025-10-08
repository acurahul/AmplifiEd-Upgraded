# Database Setup Guide

## Step 1: Create .env file

Create a `.env` file in the root directory of your project with your Supabase credentials:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-here
```

## Step 2: Get your Supabase credentials

1. Go to your Supabase project dashboard
2. Click on "Settings" → "API"
3. Copy the following values:
   - **Project URL** → `NEXT_PUBLIC_SUPABASE_URL`
   - **anon/public key** → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - **service_role key** → `SUPABASE_SERVICE_ROLE_KEY`

## Step 3: Run the database check

```bash
cd scripts
npm install
node check_db.js
```

## Step 4: If you get permission errors

If you get RLS (Row Level Security) errors, you have two options:

### Option A: Use Service Role Key (Recommended for admin scripts)
Update the script to use the service role key instead of the anon key for database inspection.

### Option B: Temporarily disable RLS
In your Supabase dashboard:
1. Go to Authentication → Policies
2. Temporarily disable RLS on tables you want to inspect
3. Re-enable after checking

## Expected Output

The script should show:
- ✅ Tables found and their structure
- ✅ Sample data from each table
- ✅ Relationships between tables
- ✅ Row counts

If everything looks good, we can proceed with implementing the enrollment feature!
