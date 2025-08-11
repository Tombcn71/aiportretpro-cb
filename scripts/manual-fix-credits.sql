-- Create credits table if missing
CREATE TABLE IF NOT EXISTS credits (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    credits INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id)
);

-- Add 1 credit to all users who made a completed purchase but have no credits
INSERT INTO credits (user_id, credits)
SELECT DISTINCT p.user_id, 1
FROM purchases p
LEFT JOIN credits c ON p.user_id = c.user_id
WHERE p.status = 'completed' 
AND c.user_id IS NULL
ON CONFLICT (user_id) DO NOTHING;

-- Check results
SELECT 
    u.email,
    p.status as purchase_status,
    c.credits,
    p.created_at as purchase_date
FROM users u
LEFT JOIN purchases p ON u.id = p.user_id
LEFT JOIN credits c ON u.id = c.user_id
ORDER BY p.created_at DESC;
