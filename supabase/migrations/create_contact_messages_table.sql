-- Create contact_messages table
CREATE TABLE IF NOT EXISTS contact_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  subject TEXT NOT NULL,
  message TEXT NOT NULL,
  image_data TEXT, -- Base64 encoded image (optional)
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  read BOOLEAN DEFAULT FALSE
);

-- Enable Row Level Security
ALTER TABLE contact_messages ENABLE ROW LEVEL SECURITY;

-- Create policy: Only authenticated admins can read messages
-- For now, we don't create any SELECT policy (messages are write-only from public)
-- You can manually check messages in Supabase Dashboard

-- Create policy: Anyone can insert a contact message (public form)
CREATE POLICY "Anyone can insert contact messages"
ON contact_messages
FOR INSERT
TO anon, authenticated
WITH CHECK (true);

-- Create index on created_at for efficient sorting
CREATE INDEX idx_contact_messages_created_at ON contact_messages(created_at DESC);

-- Create index on read status for filtering
CREATE INDEX idx_contact_messages_read ON contact_messages(read);
