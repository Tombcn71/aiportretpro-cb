-- Ensure credits table exists with correct structure
CREATE TABLE IF NOT EXISTS credits (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    credits INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id)
);

-- Add credits for existing purchases that don't have credits yet
INSERT INTO credits (user_id, credits)
SELECT DISTINCT p.user_id, 1
FROM purchases p
WHERE p.status = 'completed'
AND NOT EXISTS (SELECT 1 FROM credits c WHERE c.user_id = p.user_id)
ON CONFLICT (user_id) DO NOTHING;

-- Fix existing pending purchases and add credits
UPDATE purchases SET status = 'completed' WHERE status = 'pending';

-- Add credits for user 1 (you have 5 purchases)
INSERT INTO credits (user_id, credits)
VALUES (1, 5)
ON CONFLICT (user_id) 
DO UPDATE SET credits = credits.credits + 5;
