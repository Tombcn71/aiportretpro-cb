-- Fix malformed JSON strings in generated_photos column
-- Convert double-escaped JSON strings to proper PostgreSQL arrays

UPDATE projects 
SET generated_photos = CASE
  -- If it's a malformed JSON string starting with "\"[" and ending with "]\""
  WHEN generated_photos::text LIKE '"\[%\]"' THEN
    -- Remove the outer quotes and unescape the inner quotes
    REPLACE(REPLACE(generated_photos::text, '\"', '"'), '""', '"')::text[]
  -- If it's already a proper array, keep it
  WHEN generated_photos IS NOT NULL THEN
    generated_photos
  ELSE
    NULL
END
WHERE generated_photos IS NOT NULL;

-- Check the results
SELECT id, name, 
       CASE 
         WHEN generated_photos IS NULL THEN 'NULL'
         WHEN array_length(generated_photos, 1) IS NULL THEN 'EMPTY ARRAY'
         ELSE array_length(generated_photos, 1)::text || ' photos'
       END as photo_count
FROM projects 
WHERE generated_photos IS NOT NULL OR id = 42
ORDER BY id;
