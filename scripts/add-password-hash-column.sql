-- Add password_hash column to users table for email/password authentication
ALTER TABLE users ADD COLUMN IF NOT EXISTS password_hash TEXT;

-- Add index on email for faster lookups
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);

-- Add index on password_hash for faster authentication
CREATE INDEX IF NOT EXISTS idx_users_password_hash ON users(password_hash) WHERE password_hash IS NOT NULL; 