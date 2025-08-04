-- Add tune_id column if it doesn't exist
ALTER TABLE projects 
ADD COLUMN IF NOT EXISTS tune_id VARCHAR(255);

-- Create index for better performance on tune_id
CREATE INDEX IF NOT EXISTS idx_projects_tune_id ON projects(tune_id);

-- Update project 40 with the correct tune_id (same as prediction_id for now)
UPDATE projects 
SET tune_id = prediction_id::text
WHERE id = 40 AND tune_id IS NULL;

-- Verify the update
SELECT id, name, prediction_id, tune_id, status, generated_photos IS NOT NULL as has_photos
FROM projects 
WHERE id = 40;

-- Show all projects with their tune_id status
SELECT id, name, prediction_id, tune_id, status, 
       CASE 
         WHEN generated_photos IS NOT NULL THEN 'HAS_PHOTOS'
         ELSE 'NO_PHOTOS'
       END as photo_status
FROM projects 
ORDER BY id;
