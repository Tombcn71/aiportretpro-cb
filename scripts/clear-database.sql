-- Clear all data from the database tables
-- This will remove all users, projects, purchases, and credits

-- Delete all projects first (due to foreign key constraints)
DELETE FROM projects;

-- Delete all purchases
DELETE FROM purchases;

-- Delete all credits
DELETE FROM credits;

-- Delete all users
DELETE FROM users;

-- Reset auto-increment counters (if using PostgreSQL sequences)
ALTER SEQUENCE IF EXISTS users_id_seq RESTART WITH 1;
ALTER SEQUENCE IF EXISTS projects_id_seq RESTART WITH 1;
ALTER SEQUENCE IF EXISTS purchases_id_seq RESTART WITH 1;
ALTER SEQUENCE IF EXISTS credits_id_seq RESTART WITH 1;

-- Verify tables are empty
SELECT 'users' as table_name, COUNT(*) as record_count FROM users
UNION ALL
SELECT 'projects' as table_name, COUNT(*) as record_count FROM projects
UNION ALL
SELECT 'purchases' as table_name, COUNT(*) as record_count FROM purchases
UNION ALL
SELECT 'credits' as table_name, COUNT(*) as record_count FROM credits;
