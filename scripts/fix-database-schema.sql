-- Add updated_at column to users table if it doesn't exist
ALTER TABLE users 
ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP;

-- Add missing columns to projects table
ALTER TABLE projects 
ADD COLUMN IF NOT EXISTS prediction_id VARCHAR(255),
ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP;

-- Add updated_at column to purchases table
ALTER TABLE purchases
ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP;

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_projects_user_id ON projects(user_id);
CREATE INDEX IF NOT EXISTS idx_projects_status ON projects(status);
CREATE INDEX IF NOT EXISTS idx_purchases_stripe_session ON purchases(stripe_session_id);
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);

-- Update existing records to have updated_at
UPDATE users SET updated_at = created_at WHERE updated_at IS NULL;
UPDATE projects SET updated_at = created_at WHERE updated_at IS NULL;
UPDATE purchases SET updated_at = created_at WHERE updated_at IS NULL;

-- Verify the schema
SELECT table_name, column_name, data_type 
FROM information_schema.columns 
WHERE table_schema = 'public' 
ORDER BY table_name, ordinal_position;
