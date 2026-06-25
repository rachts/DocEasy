# Supabase Setup Guide for DocEasy V2

Welcome to the new DocEasy! This platform has been completely migrated from MongoDB/custom JWT to Supabase for authentication, database, and storage.

## 1. Project Initialization
1. Create a new project in [Supabase](https://supabase.com).
2. Go to **Project Settings -> API** and copy:
   - `Project URL`
   - `anon` `public` key
3. Rename `.env.example` to `.env.local` in the project root and add your keys:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
   ```

## 2. Authentication
DocEasy now uses Supabase Auth with SSR support.
1. In the Supabase Dashboard, go to **Authentication -> Providers**.
2. Enable **Email** (with Confirm Email turned off for local testing, or configured as desired).
3. Enable **Google** (if using OAuth) and provide your Google Client ID and Secret.

## 3. Database Schema
Execute the initial SQL migration script located in the repository:
- Navigate to `supabase/migrations/0000_initial_schema.sql`.
- Copy its contents and run it in the Supabase Dashboard SQL Editor.

This script creates:
- `profiles`: Linked via trigger to `auth.users`
- `files`: Tracks uploaded and processed files
- `activity_logs`: Logs user actions
- `favorites`: Tracks starred files
- `ai_jobs`: Keeps track of background AI tasks

## 4. Storage Buckets
The SQL script also creates the necessary storage buckets.
Verify these buckets exist in **Storage**:
- `uploads` (Private)
- `exports` (Private)
- `avatars` (Public)

Row Level Security (RLS) is fully configured for all buckets.

## 5. Running the Application
Ensure dependencies are installed:
```bash
npm install
```

Start the development server:
```bash
npm run dev
```

You are now ready to use DocEasy V2 with a production-ready Supabase backend!
