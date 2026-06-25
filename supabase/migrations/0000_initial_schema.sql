-- Extension for UUID generation
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Clean up existing tables to ensure a fresh schema
DROP TABLE IF EXISTS ai_jobs CASCADE;
DROP TABLE IF EXISTS favorites CASCADE;
DROP TABLE IF EXISTS activity_logs CASCADE;
DROP TABLE IF EXISTS files CASCADE;
DROP TABLE IF EXISTS profiles CASCADE;

-------------------------------------------------------------------------------
-- 1. PROFILES
-------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  full_name TEXT,
  avatar_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- RLS for profiles
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view their own profile" ON profiles;
CREATE POLICY "Users can view their own profile" 
ON profiles FOR SELECT USING (auth.uid()::text = id::text);

DROP POLICY IF EXISTS "Users can insert their own profile" ON profiles;
CREATE POLICY "Users can insert their own profile" 
ON profiles FOR INSERT WITH CHECK (auth.uid()::text = id::text);

DROP POLICY IF EXISTS "Users can update their own profile" ON profiles;
CREATE POLICY "Users can update their own profile" 
ON profiles FOR UPDATE USING (auth.uid()::text = id::text);

-------------------------------------------------------------------------------
-- 2. FILES
-------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS files (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  file_name TEXT NOT NULL,
  file_type TEXT NOT NULL,
  original_size BIGINT,
  processed_size BIGINT,
  storage_path TEXT NOT NULL,
  tool_used TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- RLS for files
ALTER TABLE files ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view own files" ON files;
CREATE POLICY "Users can view own files" 
ON files FOR SELECT USING (auth.uid()::text = user_id::text);

DROP POLICY IF EXISTS "Users can insert own files" ON files;
CREATE POLICY "Users can insert own files" 
ON files FOR INSERT WITH CHECK (auth.uid()::text = user_id::text);

DROP POLICY IF EXISTS "Users can update own files" ON files;
CREATE POLICY "Users can update own files" 
ON files FOR UPDATE USING (auth.uid()::text = user_id::text);

DROP POLICY IF EXISTS "Users can delete own files" ON files;
CREATE POLICY "Users can delete own files" 
ON files FOR DELETE USING (auth.uid()::text = user_id::text);

-------------------------------------------------------------------------------
-- 3. ACTIVITY LOGS
-------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS activity_logs (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  action TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- RLS for activity_logs
ALTER TABLE activity_logs ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view own activity logs" ON activity_logs;
CREATE POLICY "Users can view own activity logs" 
ON activity_logs FOR SELECT USING (auth.uid()::text = user_id::text);

DROP POLICY IF EXISTS "Users can insert own activity logs" ON activity_logs;
CREATE POLICY "Users can insert own activity logs" 
ON activity_logs FOR INSERT WITH CHECK (auth.uid()::text = user_id::text);

-------------------------------------------------------------------------------
-- 4. FAVORITES
-------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS favorites (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  file_id UUID REFERENCES files(id) ON DELETE CASCADE,
  UNIQUE(user_id, file_id)
);

-- RLS for favorites
ALTER TABLE favorites ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view own favorites" ON favorites;
CREATE POLICY "Users can view own favorites" 
ON favorites FOR SELECT USING (auth.uid()::text = user_id::text);

DROP POLICY IF EXISTS "Users can insert own favorites" ON favorites;
CREATE POLICY "Users can insert own favorites" 
ON favorites FOR INSERT WITH CHECK (auth.uid()::text = user_id::text);

DROP POLICY IF EXISTS "Users can delete own favorites" ON favorites;
CREATE POLICY "Users can delete own favorites" 
ON favorites FOR DELETE USING (auth.uid()::text = user_id::text);

-------------------------------------------------------------------------------
-- 5. AI JOBS
-------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS ai_jobs (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  file_id UUID REFERENCES files(id) ON DELETE CASCADE,
  job_type TEXT NOT NULL,
  result JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- RLS for ai_jobs
ALTER TABLE ai_jobs ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view own AI jobs" ON ai_jobs;
CREATE POLICY "Users can view own AI jobs" 
ON ai_jobs FOR SELECT USING (auth.uid()::text = user_id::text);

DROP POLICY IF EXISTS "Users can insert own AI jobs" ON ai_jobs;
CREATE POLICY "Users can insert own AI jobs" 
ON ai_jobs FOR INSERT WITH CHECK (auth.uid()::text = user_id::text);

DROP POLICY IF EXISTS "Users can update own AI jobs" ON ai_jobs;
CREATE POLICY "Users can update own AI jobs" 
ON ai_jobs FOR UPDATE USING (auth.uid()::text = user_id::text);

DROP POLICY IF EXISTS "Users can delete own AI jobs" ON ai_jobs;
CREATE POLICY "Users can delete own AI jobs" 
ON ai_jobs FOR DELETE USING (auth.uid()::text = user_id::text);

-------------------------------------------------------------------------------
-- 6. STORAGE BUCKETS
-------------------------------------------------------------------------------
-- Insert buckets into storage.buckets
INSERT INTO storage.buckets (id, name, public) VALUES ('uploads', 'uploads', false) ON CONFLICT DO NOTHING;
INSERT INTO storage.buckets (id, name, public) VALUES ('exports', 'exports', false) ON CONFLICT DO NOTHING;
INSERT INTO storage.buckets (id, name, public) VALUES ('avatars', 'avatars', true) ON CONFLICT DO NOTHING;

-- RLS for uploads
DROP POLICY IF EXISTS "Users can upload their own files" ON storage.objects;
CREATE POLICY "Users can upload their own files" 
ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'uploads' AND owner::text = auth.uid()::text);

DROP POLICY IF EXISTS "Users can read their own uploads" ON storage.objects;
CREATE POLICY "Users can read their own uploads" 
ON storage.objects FOR SELECT USING (bucket_id = 'uploads' AND owner::text = auth.uid()::text);

-- RLS for exports
DROP POLICY IF EXISTS "System can upload exports, users read own" ON storage.objects;
CREATE POLICY "System can upload exports, users read own" 
ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'exports' AND owner::text = auth.uid()::text);

DROP POLICY IF EXISTS "Users can read their own exports" ON storage.objects;
CREATE POLICY "Users can read their own exports" 
ON storage.objects FOR SELECT USING (bucket_id = 'exports' AND owner::text = auth.uid()::text);

-- RLS for avatars
DROP POLICY IF EXISTS "Anyone can view avatars" ON storage.objects;
CREATE POLICY "Anyone can view avatars" 
ON storage.objects FOR SELECT USING (bucket_id = 'avatars');

DROP POLICY IF EXISTS "Users can upload own avatars" ON storage.objects;
CREATE POLICY "Users can upload own avatars" 
ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'avatars' AND owner::text = auth.uid()::text);

DROP POLICY IF EXISTS "Users can update own avatars" ON storage.objects;
CREATE POLICY "Users can update own avatars" 
ON storage.objects FOR UPDATE USING (bucket_id = 'avatars' AND owner::text = auth.uid()::text);
