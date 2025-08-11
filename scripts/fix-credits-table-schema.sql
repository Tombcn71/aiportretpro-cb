-- First, let's check if credits table exists and fix the schema
CREATE TABLE IF NOT EXISTS credits (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  credits INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Add unique constraint on user_id (this is what was missing!)
ALTER TABLE credits 
ADD CONSTRAINT credits_user_id_unique UNIQUE (user_id);

-- Create index for better performance
CREATE INDEX IF NOT EXISTS idx_credits_user_id ON credits(user_id);

-- Verify the schema
SELECT table_name, column_name, data_type, is_nullable
FROM information_schema.columns 
WHERE table_schema = 'public' AND table_name = 'credits'
ORDER BY ordinal_position;

-- Show constraints
SELECT constraint_name, constraint_type 
FROM information_schema.table_constraints 
WHERE table_name = 'credits' AND table_schema = 'public';
