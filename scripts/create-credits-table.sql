-- Create credits table for the credit system
CREATE TABLE IF NOT EXISTS credits (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  credits INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Add credits_used column to projects table
ALTER TABLE projects 
ADD COLUMN IF NOT EXISTS credits_used INTEGER DEFAULT 0;

-- Create index for better performance
CREATE INDEX IF NOT EXISTS idx_credits_user_id ON credits(user_id);

-- Insert some test credits for existing users (optional)
INSERT INTO credits (user_id, credits)
SELECT id, 5 FROM users 
ON CONFLICT DO NOTHING;

-- Verify the schema
SELECT table_name, column_name, data_type 
FROM information_schema.columns 
WHERE table_schema = 'public' AND table_name IN ('credits', 'projects')
ORDER BY table_name, ordinal_position;
