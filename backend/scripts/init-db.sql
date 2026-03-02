-- CyberPress Database Initialization Script
-- Run this script to create initial database schema and seed data

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";

-- Create custom types
CREATE TYPE user_role AS ENUM ('admin', 'editor', 'author', 'subscriber');
CREATE TYPE post_status AS ENUM ('draft', 'published', 'archived', 'scheduled');
CREATE TYPE comment_status AS ENUM ('pending', 'approved', 'rejected', 'spam');

-- Create indexes for better search performance
CREATE INDEX IF NOT EXISTS idx_posts_title ON posts USING gin(title gin_trgm_ops);
CREATE INDEX IF NOT EXISTS idx_posts_content ON posts USING gin(content gin_trgm_ops);
CREATE INDEX IF NOT EXISTS idx_posts_slug ON posts(slug);
CREATE INDEX IF NOT EXISTS idx_posts_status ON posts(status);
CREATE INDEX IF NOT EXISTS idx_posts_created_at ON posts(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_posts_category_id ON posts(category_id);

CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_username ON users(username);

CREATE INDEX IF NOT EXISTS idx_comments_post_id ON comments(post_id);
CREATE INDEX IF NOT EXISTS idx_comments_status ON comments(status);

-- Create admin user (password: admin123 - change this in production!)
INSERT INTO users (id, username, email, hashed_password, full_name, role, is_active, created_at, updated_at)
VALUES (
    uuid_generate_v4(),
    'admin',
    'admin@cyberpress.dev',
    '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewY5GyYzpLaEmc0i', -- admin123
    'CyberPress Admin',
    'admin',
    true,
    NOW(),
    NOW()
) ON CONFLICT (email) DO NOTHING;

-- Create sample categories
INSERT INTO categories (id, name, slug, description, created_at, updated_at)
VALUES
    (uuid_generate_v4(), 'Technology', 'technology', 'Latest tech news and updates', NOW(), NOW()),
    (uuid_generate_v4(), 'Development', 'development', 'Programming and development articles', NOW(), NOW()),
    (uuid_generate_v4(), 'Design', 'design', 'UI/UX design insights', NOW(), NOW()),
    (uuid_generate_v4(), 'Cybersecurity', 'cybersecurity', 'Security best practices', NOW(), NOW())
ON CONFLICT (slug) DO NOTHING;

-- Create sample tags
INSERT INTO tags (id, name, slug, created_at, updated_at)
VALUES
    (uuid_generate_v4(), 'JavaScript', 'javascript', NOW(), NOW()),
    (uuid_generate_v4(), 'Python', 'python', NOW(), NOW()),
    (uuid_generate_v4(), 'React', 'react', NOW(), NOW()),
    (uuid_generate_v4(), 'Next.js', 'nextjs', NOW(), NOW()),
    (uuid_generate_v4(), 'Cyberpunk', 'cyberpunk', NOW(), NOW()),
    (uuid_generate_v4(), 'AI', 'ai', NOW(), NOW())
ON CONFLICT (slug) DO NOTHING;

-- Create sample post
INSERT INTO posts (id, title, slug, content, excerpt, status, author_id, category_id, created_at, updated_at, published_at)
SELECT
    uuid_generate_v4(),
    'Welcome to CyberPress',
    'welcome-to-cyberpress',
    '# Welcome to CyberPress Platform

This is your first post on the CyberPress platform. CyberPress is a cutting-edge blogging platform with a cyberpunk aesthetic.

## Features

- **Modern Design**: Cyberpunk-inspired UI with neon effects
- **Fast Performance**: Built with Next.js 14 and FastAPI
- **Secure**: JWT authentication and secure data handling
- **Flexible**: Support for multiple post types and media

## Getting Started

To create a new post, navigate to the admin dashboard and click "New Post".

Enjoy your cyberpunk blogging experience! 🚀',
    'Welcome to CyberPress - your new cyberpunk blogging platform!',
    'published',
    (SELECT id FROM users WHERE username = 'admin'),
    (SELECT id FROM categories WHERE slug = 'technology'),
    NOW(),
    NOW(),
    NOW()
ON CONFLICT (slug) DO NOTHING;

-- Grant necessary permissions
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO cyberpress;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO cyberpress;
GRANT EXECUTE ON ALL FUNCTIONS IN SCHEMA public TO cyberpress;

-- Create admin function for updating timestamps
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for automatic updated_at
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_posts_updated_at BEFORE UPDATE ON posts
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_categories_updated_at BEFORE UPDATE ON categories
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_tags_updated_at BEFORE UPDATE ON tags
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_comments_updated_at BEFORE UPDATE ON comments
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Success message
DO $$
BEGIN
    RAISE NOTICE 'CyberPress database initialized successfully!';
    RAISE NOTICE 'Default admin user: admin / admin123 (CHANGE THIS IN PRODUCTION!)';
END $$;
