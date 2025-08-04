-- Fix credits for existing purchases
UPDATE purchases SET status = 'completed', updated_at = CURRENT_TIMESTAMP WHERE user_id = 1 AND status = 'pending';

-- Ensure credits table exists with proper structure
CREATE TABLE IF NOT EXISTS credits (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id),
    credits INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id)
);

-- Set user 1 to have 5 credits (for the 5 purchases)
INSERT INTO credits (user_id, credits, created_at, updated_at)
VALUES (1, 5, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
ON CONFLICT (user_id) 
DO UPDATE SET 
  credits = 5,
  updated_at = CURRENT_TIMESTAMP;
