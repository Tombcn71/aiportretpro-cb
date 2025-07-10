-- Fix the credits table to have proper unique constraint
DROP TABLE IF EXISTS credits CASCADE;

CREATE TABLE credits (
  id SERIAL PRIMARY KEY,
  user_id TEXT NOT NULL UNIQUE,
  credits INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create index for faster lookups
CREATE INDEX idx_credits_user_id ON credits(user_id);

-- Insert default credits for existing users who don't have credits yet
INSERT INTO credits (user_id, credits)
SELECT DISTINCT user_id, 0
FROM projects 
WHERE user_id NOT IN (SELECT user_id FROM credits)
ON CONFLICT (user_id) DO NOTHING;
