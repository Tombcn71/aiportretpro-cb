-- Check if credits table exists and create if needed
CREATE TABLE IF NOT EXISTS credits (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  credits INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(user_id)
);

-- Check current credits
SELECT 
  u.email,
  c.credits,
  c.created_at,
  c.updated_at
FROM credits c
JOIN users u ON c.user_id = u.id
ORDER BY c.updated_at DESC;

-- Check recent purchases
SELECT 
  u.email,
  p.plan_type,
  p.headshots_included,
  p.status,
  p.created_at
FROM purchases p
JOIN users u ON p.user_id = u.id
ORDER BY p.created_at DESC
LIMIT 10;
