-- CyberPress Platform - Seed Data
-- This file contains initial seed data for development and testing

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Insert sample users
INSERT INTO users (id, email, username, full_name, hashed_password, avatar_url, bio, is_active, is_verified, role, created_at, updated_at)
VALUES
    (
        uuid_generate_v4(),
        'admin@cyberpress.dev',
        'admin',
        'Cyber Admin',
        '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewY5NU9bK8fk.5qW', -- password: admin123
        'https://api.dicebear.com/7.x/avataaars/svg?seed=admin',
        'System Administrator',
        true,
        true,
        'admin',
        NOW(),
        NOW()
    ),
    (
        uuid_generate_v4(),
        'editor@cyberpress.dev',
        'editor',
        'Cyber Editor',
        '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewY5NU9bK8fk.5qW',
        'https://api.dicebear.com/7.x/avataaars/svg?seed=editor',
        'Content Editor',
        true,
        true,
        'editor',
        NOW(),
        NOW()
    ),
    (
        uuid_generate_v4(),
        'user@cyberpress.dev',
        'user',
        'Cyber User',
        '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewY5NU9bK8fk.5qW',
        'https://api.dicebear.com/7.x/avataaars/svg?seed=user',
        'Regular user',
        true,
        true,
        'user',
        NOW(),
        NOW()
    )
ON CONFLICT (email) DO NOTHING;

-- Insert sample categories
INSERT INTO categories (id, name, slug, description, icon, color, parent_id, sort_order, created_at, updated_at)
VALUES
    (
        uuid_generate_v4(),
        'Technology',
        'technology',
        'Latest in tech, programming, and digital innovation',
        'microchip',
        '#00f0ff',
        NULL,
        1,
        NOW(),
        NOW()
    ),
    (
        uuid_generate_v4(),
        'Cybersecurity',
        'cybersecurity',
        'Security, privacy, and digital protection',
        'shield',
        '#ff0080',
        NULL,
        2,
        NOW(),
        NOW()
    ),
    (
        uuid_generate_v4(),
        'AI & Machine Learning',
        'ai-machine-learning',
        'Artificial intelligence and ML advancements',
        'brain',
        '#9d00ff',
        NULL,
        3,
        NOW(),
        NOW()
    ),
    (
        uuid_generate_v4(),
        'Web Development',
        'web-development',
        'Frontend, backend, and fullstack development',
        'code',
        '#00ff88',
        NULL,
        4,
        NOW(),
        NOW()
    ),
    (
        uuid_generate_v4(),
        'DevOps',
        'devops',
        'CI/CD, containers, and infrastructure',
        'server',
        '#f0ff00',
        NULL,
        5,
        NOW(),
        NOW()
    )
ON CONFLICT (slug) DO NOTHING;

-- Insert sample tags
INSERT INTO tags (id, name, slug, description, color, created_at, updated_at)
VALUES
    (uuid_generate_v4(), 'JavaScript', 'javascript', 'JavaScript programming language', '#f7df1e', NOW(), NOW()),
    (uuid_generate_v4(), 'Python', 'python', 'Python programming language', '#3776ab', NOW(), NOW()),
    (uuid_generate_v4(), 'React', 'react', 'React JavaScript library', '#61dafb', NOW(), NOW()),
    (uuid_generate_v4(), 'Next.js', 'nextjs', 'Next.js React framework', '#000000', NOW(), NOW()),
    (uuid_generate_v4(), 'FastAPI', 'fastapi', 'FastAPI Python framework', '#05998b', NOW(), NOW()),
    (uuid_generate_v4(), 'PostgreSQL', 'postgresql', 'PostgreSQL database', '#336791', NOW(), NOW()),
    (uuid_generate_v4(), 'Docker', 'docker', 'Docker containers', '#2496ed', NOW(), NOW()),
    (uuid_generate_v4(), 'Cybersecurity', 'cybersecurity', 'Security and privacy', '#ff0080', NOW(), NOW()),
    (uuid_generate_v4(), 'Cloud', 'cloud', 'Cloud computing', '#00f0ff', NOW(), NOW()),
    (uuid_generate_v4(), 'AI', 'artificial-intelligence', 'Artificial Intelligence', '#9d00ff', NOW(), NOW())
ON CONFLICT (slug) DO NOTHING;

-- Get admin user ID for posts
DO $$
DECLARE
    admin_user_id UUID;
    tech_category_id UUID;
BEGIN
    SELECT id INTO admin_user_id FROM users WHERE username = 'admin' LIMIT 1;
    SELECT id INTO tech_category_id FROM categories WHERE slug = 'technology' LIMIT 1;

    IF admin_user_id IS NOT NULL THEN
        -- Insert sample posts
        INSERT INTO posts (id, title, slug, content, excerpt, featured_image, author_id, category_id, status, published_at, created_at, updated_at)
        VALUES
            (
                uuid_generate_v4(),
                'Welcome to CyberPress Platform',
                'welcome-to-cyberpress-platform',
                '# Welcome to CyberPress Platform

CyberPress is a modern blog platform built with cutting-edge technology.

## Features

- **FastAPI Backend**: High-performance Python backend
- **Next.js Frontend**: Modern React framework
- **PostgreSQL Database**: Robust data storage
- **Cyberpunk Design**: Unique visual style

## Getting Started

Check out our documentation to learn more about the platform.

```python
# Example code
print("Hello, CyberPress!")
```',
                'Welcome to CyberPress Platform - a modern blog platform with cyberpunk aesthetics.',
                'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=1200',
                admin_user_id,
                tech_category_id,
                'published',
                NOW(),
                NOW(),
                NOW()
            ),
            (
                uuid_generate_v4(),
                'Building Modern Web Applications with Next.js 14',
                'building-modern-web-apps-nextjs-14',
                '# Building Modern Web Applications

Next.js 14 brings revolutionary features to web development.

## Server Components

Server Components allow you to build faster apps by reducing client-side JavaScript.

## App Router

The new App Router provides a modern way to build layouts and nested routes.

```tsx
export default function Page() {
  return <div>Hello, Next.js!</div>
}
```',
                'Learn how to build modern web applications using Next.js 14 with Server Components and the new App Router.',
                'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=1200',
                admin_user_id,
                tech_category_id,
                'published',
                NOW() - INTERVAL '1 day',
                NOW() - INTERVAL '1 day',
                NOW() - INTERVAL '1 day'
            ),
            (
                uuid_generate_v4(),
                'FastAPI: The Fastest Python Framework',
                'fastapi-fastest-python-framework',
                '# Why Choose FastAPI?

FastAPI is a modern, fast web framework for building APIs with Python 3.7+.

## Key Features

- **Fast**: Very high performance, on par with NodeJS and Go
- **Fast to code**: Increase the speed to develop features by about 200% to 300%
- **Fewer bugs**: Reduce about 40% of human errors
- **Intuitive**: Great editor support
- **Easy**: Designed to be easy to use and learn

```python
from fastapi import FastAPI

app = FastAPI()

@app.get("/")
def read_root():
    return {"Hello": "World"}
```',
                'Discover why FastAPI is the fastest Python framework for building APIs.',
                'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=1200',
                admin_user_id,
                tech_category_id,
                'published',
                NOW() - INTERVAL '2 days',
                NOW() - INTERVAL '2 days',
                NOW() - INTERVAL '2 days'
            )
        ON CONFLICT (slug) DO NOTHING;
    END IF;
END $$;

-- Insert sample settings
INSERT INTO settings (key, value, description, category, created_at, updated_at)
VALUES
    ('site_name', 'CyberPress Platform', 'Website name', 'general', NOW(), NOW()),
    ('site_description', 'A modern cyberpunk-style blog platform', 'Website description', 'general', NOW(), NOW()),
    ('site_keywords', 'blog, cyberpunk, technology, programming', 'SEO keywords', 'seo', NOW(), NOW()),
    ('posts_per_page', '10', 'Number of posts per page', 'display', NOW(), NOW()),
    ('enable_comments', 'true', 'Enable comments on posts', 'features', NOW(), NOW()),
    ('enable_registrations', 'true', 'Allow user registrations', 'features', NOW(), NOW()),
    ('default_post_status', 'draft', 'Default status for new posts', 'content', NOW(), NOW())
ON CONFLICT (key) DO NOTHING;

-- Insert sample notifications (for admin user)
DO $$
DECLARE
    admin_user_id UUID;
BEGIN
    SELECT id INTO admin_user_id FROM users WHERE username = 'admin' LIMIT 1;

    IF admin_user_id IS NOT NULL THEN
        INSERT INTO notifications (id, user_id, type, title, message, link, is_read, created_at)
        VALUES
            (
                uuid_generate_v4(),
                admin_user_id,
                'welcome',
                'Welcome to CyberPress!',
                'Thank you for installing CyberPress Platform. Start creating amazing content!',
                '/admin',
                false,
                NOW()
            ),
            (
                uuid_generate_v4(),
                admin_user_id,
                'system',
                'Setup Complete',
                'Your platform is ready. Configure your settings in the admin panel.',
                '/admin/settings',
                false,
                NOW()
            )
        ON CONFLICT DO NOTHING;
    END IF;
END $$;

-- Create analytics tables if they don't exist
CREATE TABLE IF NOT EXISTS page_views (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    path VARCHAR(500) NOT NULL,
    title VARCHAR(255),
    user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    ip_address INET,
    user_agent TEXT,
    referrer TEXT,
    session_id VARCHAR(255),
    viewed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_page_views_path ON page_views(path);
CREATE INDEX IF NOT EXISTS idx_page_views_viewed_at ON page_views(viewed_at);
CREATE INDEX IF NOT EXISTS idx_page_views_user_id ON page_views(user_id);

-- Create events table for tracking
CREATE TABLE IF NOT EXISTS events (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    event_type VARCHAR(100) NOT NULL,
    event_name VARCHAR(255) NOT NULL,
    user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    session_id VARCHAR(255),
    properties JSONB,
    ip_address INET,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_events_type ON events(event_type);
CREATE INDEX IF NOT EXISTS idx_events_user_id ON events(user_id);
CREATE INDEX IF NOT EXISTS idx_events_created_at ON events(created_at);

-- Success message
DO $$
BEGIN
    RAISE NOTICE 'Seed data inserted successfully!';
END $$;
