-- Add purchase_id column to projects table if it doesn't exist
ALTER TABLE projects ADD COLUMN IF NOT EXISTS purchase_id INTEGER REFERENCES purchases(id);
RAISE NOTICE 'Added purchase_id column to projects table';

-- Add tune_id column if it doesn't exist
ALTER TABLE projects ADD COLUMN IF NOT EXISTS tune_id VARCHAR(255);
RAISE NOTICE 'Added tune_id column to projects table';

-- Add wizard_session_id to projects table if it doesn't exist
ALTER TABLE projects 
ADD COLUMN IF NOT EXISTS wizard_session_id INTEGER;

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_projects_purchase_id ON projects(purchase_id);
CREATE INDEX IF NOT EXISTS idx_projects_tune_id ON projects(tune_id);
CREATE INDEX IF NOT EXISTS idx_projects_wizard_session ON projects(wizard_session_id);
CREATE INDEX IF NOT EXISTS idx_projects_status ON projects(status);

-- Log completion
DO $$
BEGIN
  RAISE NOTICE 'Projects table updated successfully';
END $$;
