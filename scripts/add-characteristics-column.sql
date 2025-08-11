-- Add characteristics column to projects table
ALTER TABLE projects ADD COLUMN IF NOT EXISTS characteristics JSONB;

-- Update existing projects to have empty characteristics
UPDATE projects SET characteristics = '{}'::jsonb WHERE characteristics IS NULL;

-- Add comment to explain the characteristics structure
COMMENT ON COLUMN projects.characteristics IS 'JSON object containing user characteristics like age, eye_color, hair_color, hair_length, hair_type, body_type'; 