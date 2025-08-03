-- Add purchase_id column to projects table if it doesn't exist
ALTER TABLE projects 
ADD COLUMN IF NOT EXISTS purchase_id INTEGER REFERENCES purchases(id) ON DELETE SET NULL;

-- Create index on purchase_id for faster joins
CREATE INDEX IF NOT EXISTS idx_projects_purchase_id ON projects(purchase_id);

-- Update existing projects to have a default purchase record if needed
-- This is a one-time migration script
DO $$
BEGIN
  -- Only run if there are projects without purchase_id
  IF EXISTS (SELECT 1 FROM projects WHERE purchase_id IS NULL LIMIT 1) THEN
    -- Create a default purchase for existing projects
    INSERT INTO purchases (user_id, stripe_session_id, plan_type, amount, headshots_included, status, created_at, updated_at)
    SELECT DISTINCT 
      p.user_id,
      'legacy_' || p.id::text,
      'professional',
      1999,
      40,
      'completed',
      p.created_at,
      p.updated_at
    FROM projects p
    WHERE p.purchase_id IS NULL
    ON CONFLICT (stripe_session_id) DO NOTHING;
    
    -- Link projects to their purchases
    UPDATE projects 
    SET purchase_id = pu.id
    FROM purchases pu
    WHERE projects.purchase_id IS NULL 
    AND pu.stripe_session_id = 'legacy_' || projects.id::text;
  END IF;
END $$;
