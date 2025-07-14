-- Check which projects have photos in the database
SELECT 
    id,
    name,
    status,
    created_at,
    CASE 
        WHEN generated_photos IS NULL THEN 'NULL'
        WHEN generated_photos = '[]' THEN 'EMPTY ARRAY'
        ELSE 'HAS PHOTOS'
    END as photo_status,
    CASE 
        WHEN generated_photos IS NOT NULL AND generated_photos != '[]' 
        THEN json_array_length(generated_photos::json)
        ELSE 0
    END as photo_count,
    LEFT(generated_photos::text, 200) as photo_sample
FROM projects 
ORDER BY id DESC 
LIMIT 20;

-- Check recent webhook logs to see what Astria is sending
SELECT 
    project_id,
    webhook_type,
    processed,
    created_at,
    LEFT(request_body::text, 300) as body_sample,
    error_message
FROM webhook_logs 
WHERE project_id IN (SELECT id FROM projects ORDER BY id DESC LIMIT 10)
ORDER BY created_at DESC 
LIMIT 30;

-- Check specific project 39
SELECT 
    id,
    name,
    status,
    generated_photos,
    CASE 
        WHEN generated_photos IS NOT NULL AND generated_photos != '[]' 
        THEN json_array_length(generated_photos::json)
        ELSE 0
    END as actual_photo_count
FROM projects 
WHERE id = 39;
