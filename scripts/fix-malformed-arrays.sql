-- Fix malformed array data in projects table
-- This script handles various malformed array formats

-- First, let's see what we're dealing with
SELECT 
  id, 
  name,
  generated_photos::text as raw_photos,
  CASE 
    WHEN generated_photos IS NULL THEN 'null'
    WHEN generated_photos::text = '[]' THEN 'empty_array'
    WHEN generated_photos::text = '"[]"' THEN 'malformed_string'
    WHEN generated_photos::text LIKE '"%"' THEN 'string_wrapped'
    ELSE 'unknown'
  END as photo_status
FROM projects 
WHERE generated_photos IS NOT NULL;

-- Fix projects where generated_photos is a string instead of proper JSONB
UPDATE projects 
SET generated_photos = '[]'::jsonb
WHERE generated_photos::text = '"[]"' 
   OR generated_photos::text = '[]'
   OR generated_photos IS NULL;

-- Fix any remaining malformed entries by setting them to empty array
UPDATE projects 
SET generated_photos = '[]'::jsonb
WHERE generated_photos IS NOT NULL 
  AND (
    generated_photos::text ~ '^".*"$' 
    OR generated_photos::text = ''
  );

-- Verify the fix
SELECT 
  COUNT(*) as total_projects,
  COUNT(CASE WHEN generated_photos IS NOT NULL THEN 1 END) as projects_with_photos,
  COUNT(CASE WHEN jsonb_array_length(generated_photos) > 0 THEN 1 END) as projects_with_actual_photos
FROM projects;

-- Show sample of fixed data
SELECT 
  id, 
  name, 
  status,
  generated_photos,
  jsonb_array_length(generated_photos) as photo_count
FROM projects 
WHERE generated_photos IS NOT NULL 
LIMIT 5;
