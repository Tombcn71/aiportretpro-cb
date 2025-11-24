-- Add password reset columns to users table
ALTER TABLE users ADD COLUMN IF NOT EXISTS reset_token TEXT;
ALTER TABLE users ADD COLUMN IF NOT EXISTS reset_token_expires TIMESTAMP;

-- Add index on reset_token for faster lookups
CREATE INDEX IF NOT EXISTS idx_users_reset_token ON users(reset_token) WHERE reset_token IS NOT NULL;

-- Clean up expired tokens (optional, can be run periodically)
-- UPDATE users SET reset_token = NULL, reset_token_expires = NULL WHERE reset_token_expires < CURRENT_TIMESTAMP;


