-- Check project 39 (martina) specifically - simple version
SELECT 
    id,
    name,
    status,
    created_at,
    generated_photos
FROM projects 
WHERE id = 39;

-- Check all recent projects - simple version
SELECT 
    id,
    name,
    status,
    created_at,
    generated_photos
FROM projects 
ORDER BY id DESC 
LIMIT 10;

-- Check webhook logs for project 39
SELECT 
    project_id,
    webhook_type,
    processed,
    created_at,
    request_body,
    error_message
FROM webhook_logs 
WHERE project_id = 39
ORDER BY created_at DESC 
LIMIT 10;

-- Check the data type of generated_photos column
SELECT 
    column_name,
    data_type,
    is_nullable
FROM information_schema.columns 
WHERE table_name = 'projects' 
AND column_name = 'generated_photos';
