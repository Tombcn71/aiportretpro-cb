-- Check the current schema of the projects table
SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns 
WHERE table_name = 'projects' 
ORDER BY ordinal_position;

-- Also check what columns actually exist
SELECT * FROM projects LIMIT 1;
