-- Fix malformed JSON string data in projects table
-- Your database stores arrays as JSON strings, not PostgreSQL arrays

-- First, let's see what we're dealing with
SELECT 
  id, 
  name,
  generated_photos,
  LENGTH(generated_photos) as json_length,
  CASE 
    WHEN generated_photos IS NULL THEN 'null'
    WHEN generated_photos = '' THEN 'empty_string'
    WHEN generated_photos = '[]' THEN 'empty_array'
    WHEN generated_photos::text ~ '^\[.*\]$' THEN 'valid_json_array'
    ELSE 'invalid_format'
  END as photo_status
FROM projects 
ORDER BY id DESC
LIMIT 20;

-- Fix any NULL or empty string arrays by setting them to empty JSON arrays
UPDATE projects 
SET generated_photos = '[]'
WHERE generated_photos IS NULL OR generated_photos = '';

-- Check for malformed JSON and fix it
UPDATE projects 
SET generated_photos = '[]'
WHERE generated_photos IS NOT NULL 
  AND generated_photos != ''
  AND NOT (generated_photos::text ~ '^\[.*\]$');

-- Verify JSON validity for existing data
DO $$
DECLARE
    rec RECORD;
    is_valid_json BOOLEAN;
BEGIN
    FOR rec IN SELECT id, generated_photos FROM projects WHERE generated_photos IS NOT NULL AND generated_photos != '' LOOP
        BEGIN
            -- Try to parse as JSON
            PERFORM rec.generated_photos::json;
            is_valid_json := TRUE;
        EXCEPTION WHEN OTHERS THEN
            is_valid_json := FALSE;
            -- Fix invalid JSON
            UPDATE projects SET generated_photos = '[]' WHERE id = rec.id;
            RAISE NOTICE 'Fixed invalid JSON for project ID: %', rec.id;
        END;
    END LOOP;
END $$;

-- Verify the fix
SELECT 
  COUNT(*) as total_projects,
  COUNT(CASE WHEN generated_photos IS NOT NULL AND generated_photos != '' THEN 1 END) as projects_with_photo_data,
  COUNT(CASE WHEN generated_photos IS NOT NULL AND generated_photos != '' AND generated_photos != '[]' THEN 1 END) as projects_with_actual_photos
FROM projects;

-- Show sample of fixed data with photo counts
SELECT 
  id, 
  name, 
  status,
  CASE 
    WHEN generated_photos IS NULL OR generated_photos = '' OR generated_photos = '[]' THEN 0
    ELSE (SELECT array_length(array(SELECT json_array_elements_text(generated_photos::json)), 1))
  END as photo_count,
  LEFT(generated_photos, 100) as photos_sample,
  created_at
FROM projects 
WHERE generated_photos IS NOT NULL 
ORDER BY id DESC
LIMIT 10;
