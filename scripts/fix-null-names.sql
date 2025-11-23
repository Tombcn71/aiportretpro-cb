-- Fix users with NULL or empty name by using email prefix
-- This fixes the issue where email signup users had NULL name/image

UPDATE users 
SET 
  name = COALESCE(NULLIF(name, ''), split_part(email, '@', 1)),
  image = COALESCE(image, ''),
  updated_at = CURRENT_TIMESTAMP
WHERE name IS NULL OR name = '';

-- Verify the fix
SELECT id, email, name, image, created_at 
FROM users 
ORDER BY created_at DESC 
LIMIT 10;

