-- NUCLEAR OPTION: Completely wipe all data from database
-- This will forcefully remove EVERYTHING

-- First, disable foreign key constraints temporarily
SET session_replication_role = replica;

-- TRUNCATE all tables (this is more aggressive than DELETE)
TRUNCATE TABLE projects RESTART IDENTITY CASCADE;
TRUNCATE TABLE purchases RESTART IDENTITY CASCADE;
TRUNCATE TABLE credits RESTART IDENTITY CASCADE;
TRUNCATE TABLE users RESTART IDENTITY CASCADE;

-- Re-enable foreign key constraints
SET session_replication_role = DEFAULT;

-- Double check - force delete any remaining records
DELETE FROM projects WHERE true;
DELETE FROM purchases WHERE true;
DELETE FROM credits WHERE true;
DELETE FROM users WHERE true;

-- Reset all sequences to 1
SELECT setval(pg_get_serial_sequence('users', 'id'), 1, false);
SELECT setval(pg_get_serial_sequence('projects', 'id'), 1, false);
SELECT setval(pg_get_serial_sequence('purchases', 'id'), 1, false);
SELECT setval(pg_get_serial_sequence('credits', 'id'), 1, false);

-- Final verification - should all return 0
SELECT 'FINAL CHECK - users' as table_name, COUNT(*) as records FROM users
UNION ALL
SELECT 'FINAL CHECK - projects' as table_name, COUNT(*) as records FROM projects
UNION ALL
SELECT 'FINAL CHECK - purchases' as table_name, COUNT(*) as records FROM purchases
UNION ALL
SELECT 'FINAL CHECK - credits' as table_name, COUNT(*) as records FROM credits;
