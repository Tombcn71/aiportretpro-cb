-- Add missing columns to projects table
ALTER TABLE projects 
ADD COLUMN IF NOT EXISTS prediction_id VARCHAR(255),
ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP;

-- Create index for better performance
CREATE INDEX IF NOT EXISTS idx_projects_user_id ON projects(user_id);
CREATE INDEX IF NOT EXISTS idx_projects_status ON projects(status);
CREATE INDEX IF NOT EXISTS idx_purchases_stripe_session ON purchases(stripe_session_id);

-- Update existing projects to have updated_at
UPDATE projects SET updated_at = created_at WHERE updated_at IS NULL;
