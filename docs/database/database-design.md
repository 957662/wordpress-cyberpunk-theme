# CyberPress Platform - Database Design Document

## Overview

CyberPress Platform uses PostgreSQL 15+ as its primary database, chosen for its:
- **ACID compliance** for data integrity
- **Advanced JSON support** via JSONB
- **Full-text search** capabilities
- **Strong reliability** and performance
- **Extensive indexing** options

## ER Diagram

```
┌─────────────┐       ┌─────────────┐       ┌──────────────┐
│   Users     │──────<│   Posts     │>──────│  Categories  │
│             │       │             │<──────│              │
│ - id        │       │ - id        │       │ - id         │
│ - username  │       │ - title     │       │ - name       │
│ - email     │       │ - slug      │       └──────────────┘
│ - password  │       │ - content   │
│ - role      │       │ - author_id │
└─────────────┘       │ - status    │
       │              │ - view_cnt  │
       │              └─────────────┘
       │                     │
       │                     │
       v                     v
┌─────────────┐       ┌─────────────┐       ┌──────────────┐
│  Follows    │       │  Comments   │       │     Tags      │
│             │       │             │       └──────────────┘
│ - follower  │       │ - id        │              ▲
│ - following │       │ - post_id   │              │
└─────────────┘       │ - author_id │              │
                      │ - content   │              │
                      └─────────────┘              │
                            │                      │
                            │                      │
                            v                      │
                   ┌─────────────┐                │
                   │    Likes    │                │
                   │             │                │
                   │ - user_id   │                │
                   │ - target_id │                │
                   └─────────────┘                │
                                                  │
                   ┌─────────────┐                │
                   │ Bookmarks   │                │
                   │             │                │
                   │ - user_id   │                │
                   │ - post_id   │                │
                   └─────────────┘                │
                                                  │
                   ┌─────────────┐                │
                   │ReadingProg. │                │
                   │             │                │
                   │ - user_id   │                │
                   │ - post_id   │                │
                   │ - progress  │                │
                   └─────────────┘                │
                                                  │
                                      ┌───────────┴──────────┐
                                      │  post_tags (Junction) │
                                      └──────────────────────┘
```

## Table Specifications

### 1. Users

Stores user account information and authentication data.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | UUID | PRIMARY KEY | Unique user identifier |
| username | VARCHAR(50) | UNIQUE, NOT NULL | Display username |
| email | VARCHAR(255) | UNIQUE, NOT NULL | Email address |
| password_hash | VARCHAR(255) | NOT NULL | Bcrypt hash of password |
| role | user_role | DEFAULT 'subscriber' | User role enum |
| avatar_url | TEXT | - | Profile picture URL |
| bio | TEXT | - | User biography |
| website | VARCHAR(255) | - | Personal website |
| location | VARCHAR(100) | - | Geographic location |
| is_verified | BOOLEAN | DEFAULT FALSE | Email verification status |
| is_active | BOOLEAN | DEFAULT TRUE | Account active status |
| email_notifications_enabled | BOOLEAN | DEFAULT TRUE | Email preferences |
| last_login_at | TIMESTAMP | - | Last login timestamp |
| created_at | TIMESTAMP | DEFAULT NOW() | Account creation date |
| updated_at | TIMESTAMP | DEFAULT NOW() | Last update timestamp |

**Indexes:**
- `idx_users_email` (email)
- `idx_users_username` (username)
- `idx_users_role` (role)

### 2. Posts

Stores blog posts and articles.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | UUID | PRIMARY KEY | Unique post identifier |
| title | VARCHAR(255) | NOT NULL | Post title |
| slug | VARCHAR(255) | UNIQUE, NOT NULL | URL-friendly identifier |
| excerpt | TEXT | - | Post summary/excerpt |
| content | TEXT | NOT NULL | Markdown content |
| content_html | TEXT | - | Rendered HTML |
| featured_image_url | TEXT | - | Featured image URL |
| author_id | UUID | FOREIGN KEY → users(id) | Post author |
| status | post_status | DEFAULT 'draft' | Post status enum |
| comment_enabled | BOOLEAN | DEFAULT TRUE | Comments allowed |
| is_featured | BOOLEAN | DEFAULT FALSE | Featured post flag |
| view_count | BIGINT | DEFAULT 0 | View counter |
| like_count | INT | DEFAULT 0 | Like counter |
| comment_count | INT | DEFAULT 0 | Comment counter |
| reading_time | INT | - | Estimated minutes |
| published_at | TIMESTAMP | - | Publication date |
| scheduled_at | TIMESTAMP | - | Scheduled publish date |
| created_at | TIMESTAMP | DEFAULT NOW() | Creation date |
| updated_at | TIMESTAMP | DEFAULT NOW() | Last update timestamp |

**Indexes:**
- `idx_posts_author` (author_id)
- `idx_posts_status` (status)
- `idx_posts_published` (published_at DESC)
- `idx_posts_slug` (slug)
- `idx_posts_search` (GIN full-text)

### 3. Categories

Hierarchical categorization system.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | UUID | PRIMARY KEY | Category identifier |
| name | VARCHAR(100) | UNIQUE, NOT NULL | Category name |
| slug | VARCHAR(100) | UNIQUE, NOT NULL | URL-friendly name |
| description | TEXT | - | Category description |
| parent_id | UUID | FOREIGN KEY → categories(id) | Parent category |
| icon | VARCHAR(50) | - | Icon name |
| color | VARCHAR(7) | - | Hex color code |
| post_count | INT | DEFAULT 0 | Cached post count |
| display_order | INT | DEFAULT 0 | Sort order |
| created_at | TIMESTAMP | DEFAULT NOW() | Creation date |
| updated_at | TIMESTAMP | DEFAULT NOW() | Last update timestamp |

### 4. Tags

Flexible tagging system.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | UUID | PRIMARY KEY | Tag identifier |
| name | VARCHAR(50) | UNIQUE, NOT NULL | Tag name |
| slug | VARCHAR(50) | UNIQUE, NOT NULL | URL-friendly name |
| description | TEXT | - | Tag description |
| post_count | INT | DEFAULT 0 | Cached post count |
| created_at | TIMESTAMP | DEFAULT NOW() | Creation date |
| updated_at | TIMESTAMP | DEFAULT NOW() | Last update timestamp |

**Indexes:**
- `idx_tags_search` (GIN full-text on name)

### 5. Comments

Nested comment system.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | UUID | PRIMARY KEY | Comment identifier |
| post_id | UUID | FOREIGN KEY → posts(id) | Associated post |
| author_id | UUID | FOREIGN KEY → users(id) | Comment author |
| parent_id | UUID | FOREIGN KEY → comments(id) | Parent comment (nested) |
| content | TEXT | NOT NULL | Comment content |
| content_html | TEXT | - | Rendered HTML |
| status | comment_status | DEFAULT 'pending' | Moderation status |
| ip_address | INET | - | Submit IP address |
| user_agent | TEXT | - | Browser user agent |
| like_count | INT | DEFAULT 0 | Like counter |
| created_at | TIMESTAMP | DEFAULT NOW() | Creation date |
| updated_at | TIMESTAMP | DEFAULT NOW() | Last update timestamp |
| deleted_at | TIMESTAMP | - | Soft delete timestamp |

**Indexes:**
- `idx_comments_post` (post_id)
- `idx_comments_author` (author_id)
- `idx_comments_parent` (parent_id)
- `idx_comments_status` (status)

### 6. Likes

Generic like system for posts and comments.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | UUID | PRIMARY KEY | Like identifier |
| user_id | UUID | FOREIGN KEY → users(id) | Liking user |
| target_id | UUID | NOT NULL | Target entity ID |
| target_type | VARCHAR(20) | NOT NULL | Entity type ('post', 'comment') |
| created_at | TIMESTAMP | DEFAULT NOW() | Creation date |

**Constraints:**
- UNIQUE(user_id, target_id, target_type)

**Indexes:**
- `idx_likes_user` (user_id)
- `idx_likes_target` (target_id, target_type)

### 7. Bookmarks

User bookmark/saved posts system.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | UUID | PRIMARY KEY | Bookmark identifier |
| user_id | UUID | FOREIGN KEY → users(id) | Bookmarking user |
| post_id | UUID | FOREIGN KEY → posts(id) | Bookmarked post |
| notes | TEXT | - | User notes |
| is_private | BOOLEAN | DEFAULT TRUE | Privacy setting |
| created_at | TIMESTAMP | DEFAULT NOW() | Creation date |
| updated_at | TIMESTAMP | DEFAULT NOW() | Last update timestamp |

**Constraints:**
- UNIQUE(user_id, post_id)

**Indexes:**
- `idx_bookmarks_user` (user_id)
- `idx_bookmarks_post` (post_id)

### 8. Follows

User following system.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | UUID | PRIMARY KEY | Follow identifier |
| follower_id | UUID | FOREIGN KEY → users(id) | Follower user |
| following_id | UUID | FOREIGN KEY → users(id) | Followed user |
| created_at | TIMESTAMP | DEFAULT NOW() | Creation date |

**Constraints:**
- UNIQUE(follower_id, following_id)
- CHECK(follower_id != following_id)

**Indexes:**
- `idx_follows_follower` (follower_id)
- `idx_follows_following` (following_id)

### 9. Notifications

User notification system.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | UUID | PRIMARY KEY | Notification ID |
| user_id | UUID | FOREIGN KEY → users(id) | Recipient user |
| type | notification_type | NOT NULL | Notification type |
| title | VARCHAR(255) | NOT NULL | Notification title |
| message | TEXT | NOT NULL | Notification content |
| link | TEXT | - | Action link |
| data | JSONB | - | Additional data |
| is_read | BOOLEAN | DEFAULT FALSE | Read status |
| created_at | TIMESTAMP | DEFAULT NOW() | Creation date |
| read_at | TIMESTAMP | - | Read timestamp |

**Indexes:**
- `idx_notifications_user` (user_id)
- `idx_notifications_read` (is_read)
- `idx_notifications_created` (created_at DESC)

### 10. Reading Progress

Track user reading progress.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | UUID | PRIMARY KEY | Progress ID |
| user_id | UUID | FOREIGN KEY → users(id) | Reading user |
| post_id | UUID | FOREIGN KEY → posts(id) | Post being read |
| progress | DECIMAL(5,2) | DEFAULT 0 | Percentage (0-100) |
| last_position | INT | DEFAULT 0 | Character position |
| completed | BOOLEAN | DEFAULT FALSE | Completion status |
| created_at | TIMESTAMP | DEFAULT NOW() | Creation date |
| updated_at | TIMESTAMP | DEFAULT NOW() | Last update timestamp |

**Constraints:**
- UNIQUE(user_id, post_id)

**Indexes:**
- `idx_reading_progress_user` (user_id)
- `idx_reading_progress_post` (post_id)
- `idx_reading_progress_completed` (user_id, completed) WHERE completed = TRUE

### 11. Audit Logs

System audit trail.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | UUID | PRIMARY KEY | Log entry ID |
| user_id | UUID | FOREIGN KEY → users(id) | Acting user |
| action | VARCHAR(50) | NOT NULL | Action performed |
| entity_type | VARCHAR(50) | NOT NULL | Entity type |
| entity_id | UUID | NOT NULL | Entity ID |
| changes | JSONB | - | Before/after values |
| ip_address | INET | - | Client IP |
| user_agent | TEXT | - | Browser info |
| created_at | TIMESTAMP | DEFAULT NOW() | Timestamp |

**Indexes:**
- `idx_audit_logs_user` (user_id)
- `idx_audit_logs_entity` (entity_type, entity_id)
- `idx_audit_logs_created` (created_at DESC)

### 12. Settings

Global application settings.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| key | VARCHAR(100) | PRIMARY KEY | Setting key |
| value | JSONB | NOT NULL | Setting value |
| description | TEXT | - | Setting description |
| updated_at | TIMESTAMP | DEFAULT NOW() | Last update |
| updated_by | UUID | FOREIGN KEY → users(id) | Updating user |

## Junction Tables

### post_categories
Links posts to categories (many-to-many).

| Column | Type | Constraints |
|--------|------|-------------|
| post_id | UUID | FOREIGN KEY → posts(id) |
| category_id | UUID | FOREIGN KEY → categories(id) |

**Primary Key:** (post_id, category_id)

### post_tags
Links posts to tags (many-to-many).

| Column | Type | Constraints |
|--------|------|-------------|
| post_id | UUID | FOREIGN KEY → posts(id) |
| tag_id | UUID | FOREIGN KEY → tags(id) |

**Primary Key:** (post_id, tag_id)

## Data Types

### Enums

```sql
-- User roles
CREATE TYPE user_role AS ENUM ('admin', 'editor', 'author', 'subscriber');

-- Post statuses
CREATE TYPE post_status AS ENUM ('draft', 'published', 'archived', 'scheduled');

-- Comment moderation statuses
CREATE TYPE comment_status AS ENUM ('pending', 'approved', 'rejected', 'spam');

-- Notification types
CREATE TYPE notification_type AS ENUM ('comment', 'like', 'follow', 'mention', 'system');
```

## Performance Optimization

### Indexing Strategy

1. **Primary Keys:** All tables use UUID primary keys
2. **Foreign Keys:** Indexed for JOIN performance
3. **Search Indexes:** Full-text GIN indexes on content
4. **Composite Indexes:** Optimized for common query patterns
5. **Partial Indexes:** For filtered queries (e.g., published posts)

### Query Optimization

- **View:** `post_details` - Pre-computed post information with joins
- **Materialized Views:** Consider for analytics
- **Connection Pooling:** Use PgBouncer in production
- **Caching:** Redis for frequently accessed data

## Backup & Recovery

### Backup Strategy

```bash
# Full backup
pg_dump -U cyberpress_user -d cyberpress_db -F c -f backup.dump

# Schema-only backup
pg_dump -U cyberpress_user -d cyberpress_db --schema-only -f schema.sql

# Data-only backup
pg_dump -U cyberpress_user -d cyberpress_db --data-only -f data.sql
```

### Recovery

```bash
# Restore from backup
pg_restore -U cyberpress_user -d cyberpress_db backup.dump

# Restore from SQL file
psql -U cyberpress_user -d cyberpress_db < schema.sql
```

## Security Considerations

1. **Password Hashing:** Use bcrypt with cost factor 12
2. **SQL Injection:** Use parameterized queries
3. **Row-Level Security:** Consider for multi-tenant scenarios
4. **Encryption:** Use pgcrypto for sensitive data
5. **Audit Logging:** Track all data modifications
6. **Regular Backups:** Automated daily backups
7. **Access Control:** Principle of least privilege

## Monitoring

### Key Metrics to Monitor

- Connection count
- Query performance (slow query log)
- Table bloat
- Index usage
- Cache hit ratio
- Replication lag (if using replicas)

### Useful Queries

```sql
-- Table sizes
SELECT
    schemaname,
    tablename,
    pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename)) AS size
FROM pg_tables
WHERE schemaname = 'public'
ORDER BY pg_total_relation_size(schemaname||'.'||tablename) DESC;

-- Index usage
SELECT
    schemaname,
    tablename,
    indexname,
    idx_scan,
    idx_tup_read,
    idx_tup_fetch
FROM pg_stat_user_indexes
ORDER BY idx_scan DESC;

-- Slow queries (requires pg_stat_statements)
SELECT
    query,
    calls,
    total_time,
    mean_time
FROM pg_stat_statements
ORDER BY mean_time DESC
LIMIT 10;
```

## Migration Strategy

Use Alembic for version-controlled migrations:

```bash
# Create new migration
alembic revision --autogenerate -m "description"

# Apply migrations
alembic upgrade head

# Rollback
alembic downgrade -1
```

## Maintenance

### Regular Tasks

- **VACUUM ANALYZE:** Weekly (or configure autovacuum)
- **REINDEX:** Monthly for heavily updated tables
- **Statistics Update:** Automatic via autovacuum
- **Index Maintenance:** Monitor and rebuild fragmented indexes

### Cleanup

```sql
-- Clean up old soft-deleted records
DELETE FROM comments WHERE deleted_at < NOW() - INTERVAL '1 year';

-- Archive old audit logs
DELETE FROM audit_logs WHERE created_at < NOW() - INTERVAL '2 years';
```

---

**Document Version:** 1.0.0
**Last Updated:** 2026-03-06
**Maintainer:** CyberPress Development Team
