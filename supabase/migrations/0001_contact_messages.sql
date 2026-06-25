CREATE TABLE IF NOT EXISTS contact_messages (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  subject TEXT NOT NULL,
  message TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- RLS for contact_messages
ALTER TABLE contact_messages ENABLE ROW LEVEL SECURITY;

-- Allow anyone to insert contact messages (even unauthenticated users)
DROP POLICY IF EXISTS "Anyone can insert contact messages" ON contact_messages;
CREATE POLICY "Anyone can insert contact messages" 
ON contact_messages FOR INSERT WITH CHECK (true);

-- Only authenticated users (admins) could theoretically view, but for now we just restrict SELECT
DROP POLICY IF EXISTS "Nobody can view contact messages via API" ON contact_messages;
CREATE POLICY "Nobody can view contact messages via API" 
ON contact_messages FOR SELECT USING (false);
