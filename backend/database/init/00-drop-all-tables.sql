-- ==========================================
-- CyberPress Platform - Drop All Tables
-- ==========================================
-- WARNING: This script will DELETE ALL DATA!
-- Use with caution in production environments.
-- ==========================================

BEGIN;

-- Drop tables in order to respect foreign key constraints

-- Drop junction tables first (many-to-many relationships)
DROP TABLE IF EXISTS post_categories CASCADE;
DROP TABLE IF EXISTS post_tags CASCADE;
DROP TABLE IF EXISTS comment_likes CASCADE;
DROP TABLE IF EXISTS role_permissions CASCADE;
DROP TABLE IF EXISTS user_roles CASCADE;
DROP TABLE IF EXISTS bookmarks CASCADE;
DROP TABLE IF EXISTS reading_list CASCADE;

-- Drop analytics and statistics tables
DROP TABLE IF EXISTS user_statistics CASCADE;
DROP TABLE IF EXISTS post_statistics CASCADE;
DROP TABLE IF EXISTS page_views CASCADE;
DROP TABLE IF EXISTS sessions CASCADE;
DROP TABLE IF EXISTS analytics_events CASCADE;

-- Drop authentication tables
DROP TABLE IF EXISTS refresh_tokens CASCADE;
DROP TABLE IF EXISTS api_tokens CASCADE;

-- Drop social feature tables
DROP TABLE IF EXISTS messages CASCADE;
DROP TABLE IF EXISTS notifications CASCADE;
DROP TABLE IF EXISTS activities CASCADE;
DROP TABLE IF EXISTS user_follows CASCADE;

-- Drop main content tables
DROP TABLE IF EXISTS comments CASCADE;
DROP TABLE IF EXISTS media CASCADE;
DROP TABLE IF EXISTS posts CASCADE;
DROP TABLE IF EXISTS tags CASCADE;
DROP TABLE IF EXISTS categories CASCADE;

-- Drop user tables
DROP TABLE IF EXISTS user_settings CASCADE;
DROP TABLE IF EXISTS user_profiles CASCADE;
DROP TABLE IF EXISTS users CASCADE;

-- Drop auth tables
DROP TABLE IF EXISTS permissions CASCADE;
DROP TABLE IF EXISTS roles CASCADE;

-- Drop audit tables
DROP TABLE IF EXISTS audit_logs CASCADE;

COMMIT;

-- ==========================================
-- Verification Query
-- ==========================================

-- Run this to verify all tables are dropped:
-- \dt

-- Expected output: No tables found.

-- ==========================================
-- END OF SCRIPT
-- ==========================================
