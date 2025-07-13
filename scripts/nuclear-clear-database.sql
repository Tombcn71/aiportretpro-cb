-- Disable foreign key constraints temporarily
SET session_replication_role = replica;

-- Clear all data from tables
TRUNCATE TABLE projects RESTART IDENTITY CASCADE;
TRUNCATE TABLE purchases RESTART IDENTITY CASCADE;
TRUNCATE TABLE credits RESTART IDENTITY CASCADE;
TRUNCATE TABLE users RESTART IDENTITY CASCADE;

-- Re-enable foreign key constraints
SET session_replication_role = DEFAULT;

-- Verify tables are empty
SELECT 'projects' as table_name, COUNT(*) as row_count FROM projects
UNION ALL
SELECT 'purchases' as table_name, COUNT(*) as row_count FROM purchases
UNION ALL
SELECT 'credits' as table_name, COUNT(*) as row_count FROM credits
UNION ALL
SELECT 'users' as table_name, COUNT(*) as row_count FROM users;
