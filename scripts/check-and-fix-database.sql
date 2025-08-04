-- Check current database schema
SELECT 
    table_name,
    column_name,
    data_type,
    is_nullable,
    column_default
FROM information_schema.columns 
WHERE table_schema = 'public' 
AND table_name IN ('projects', 'users', 'purchases', 'credits')
ORDER BY table_name, ordinal_position;

-- Check if generated_photos column exists and is correct type
SELECT 
    column_name,
    data_type,
    is_nullable
FROM information_schema.columns 
WHERE table_schema = 'public' 
AND table_name = 'projects' 
AND column_name = 'generated_photos';

-- Check current projects data
SELECT 
    id,
    name,
    status,
    prediction_id,
    generated_photos,
    pg_typeof(generated_photos) as photos_type,
    array_length(generated_photos, 1) as photo_count,
    created_at
FROM projects 
ORDER BY id DESC 
LIMIT 5;

-- Fix database schema if needed
ALTER TABLE projects 
ADD COLUMN IF NOT EXISTS generated_photos TEXT[];

ALTER TABLE projects 
ADD COLUMN IF NOT EXISTS prediction_id VARCHAR(255);

ALTER TABLE projects 
ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP;

-- Create indexes if missing
CREATE INDEX IF NOT EXISTS idx_projects_prediction_id ON projects(prediction_id);
CREATE INDEX IF NOT EXISTS idx_projects_status ON projects(status);

-- Verify the fixes
SELECT 
    'projects' as table_name,
    COUNT(*) as total_rows,
    COUNT(CASE WHEN generated_photos IS NOT NULL THEN 1 END) as rows_with_photos,
    COUNT(CASE WHEN prediction_id IS NOT NULL THEN 1 END) as rows_with_prediction_id
FROM projects;
