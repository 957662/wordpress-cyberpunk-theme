# CyberPress Platform - 索引设计文档

## 索引策略

本文档详细说明 CyberPress Platform 数据库的索引设计，包括索引类型、选择原因和性能优化建议。

---

## 索引类型说明

### 1. B-Tree 索引（默认）
- **用途**: 等值查询、范围查询、排序
- **适用场景**: 大多数常规查询
- **示例**: username, email, created_at

### 2. GIN 索引（广义倒排索引）
- **用途**: 全文搜索、JSONB 查询、数组查询
- **适用场景**: 复杂的文本搜索、JSONB 字段
- **示例**: to_tsvector(), metadata

### 3. GiST 索引（通用搜索树）
- **用途**: 地理空间数据、全文搜索
- **适用场景**: 地理位置、模糊搜索

---

## 表索引详情

### 1. users 表

| 索引名 | 类型 | 字段 | 用途 | 查询示例 |
|--------|------|------|------|----------|
| `idx_users_username` | B-Tree | username | 用户名查找 | `WHERE username = 'admin'` |
| `idx_users_email` | B-Tree | email | 邮箱查找 | `WHERE email = 'user@example.com'` |
| `idx_users_role` | B-Tree | role | 按角色筛选 | `WHERE role = 'author'` |
| `idx_users_status` | B-Tree | status | 按状态筛选 | `WHERE status = 'active'` |
| `idx_users_created_at` | B-Tree | created_at DESC | 按创建时间排序 | `ORDER BY created_at DESC` |
| `idx_users_metadata` | GIN | metadata | JSONB 查询 | `WHERE metadata @> '{"theme":"dark"}'` |

**查询优化示例**:
```sql
-- 用户登录（使用 username 或 email 索引）
SELECT * FROM users WHERE username = 'admin';
SELECT * FROM users WHERE email = 'admin@example.com';

-- 获取活跃用户（使用 status 和 created_at 索引）
SELECT * FROM users
WHERE status = 'active'
ORDER BY created_at DESC
LIMIT 10;

-- 按角色查询用户（使用 role 索引）
SELECT * FROM users WHERE role = 'author';

-- JSONB 查询（使用 metadata GIN 索引）
SELECT * FROM users WHERE metadata @> '{"notifications": true}';
```

---

### 2. categories 表

| 索引名 | 类型 | 字段 | 用途 | 查询示例 |
|--------|------|------|------|----------|
| `idx_categories_slug` | B-Tree | slug | 按slug查找 | `WHERE slug = 'tech'` |
| `idx_categories_parent_id` | B-Tree | parent_id | 获取子分类 | `WHERE parent_id = 'xxx'` |
| `idx_categories_sort_order` | B-Tree | sort_order | 按顺序排序 | `ORDER BY sort_order` |

**查询优化示例**:
```sql
-- 通过slug获取分类（使用 slug 索引）
SELECT * FROM categories WHERE slug = 'tech';

-- 获取顶级分类（使用 parent_id 索引）
SELECT * FROM categories WHERE parent_id IS NULL;

-- 获取子分类（使用 parent_id 索引）
SELECT * FROM categories WHERE parent_id = 'uuid';

-- 按顺序获取分类（使用 sort_order 索引）
SELECT * FROM categories ORDER BY sort_order;
```

---

### 3. tags 表

| 索引名 | 类型 | 字段 | 用途 | 查询示例 |
|--------|------|------|------|----------|
| `idx_tags_slug` | B-Tree | slug | 按slug查找 | `WHERE slug = 'javascript'` |
| `idx_tags_name` | GIN | name (gin_trgm_ops) | 全文搜索（模糊匹配） | `WHERE name ILIKE '%script%'` |

**查询优化示例**:
```sql
-- 精确查找标签（使用 slug 索引）
SELECT * FROM tags WHERE slug = 'javascript';

-- 模糊搜索标签（使用 name GIN 索引）
SELECT * FROM tags WHERE name ILIKE '%script%';

-- 获取热门标签（按 post_count 排序）
SELECT * FROM tags ORDER BY post_count DESC LIMIT 20;
```

---

### 4. posts 表

| 索引名 | 类型 | 字段 | 用途 | 查询示例 |
|--------|------|------|------|----------|
| `idx_posts_slug` | B-Tree | slug | 按slug查找 | `WHERE slug = 'post-title'` |
| `idx_posts_author_id` | B-Tree | author_id | 按作者筛选 | `WHERE author_id = 'uuid'` |
| `idx_posts_status` | B-Tree | status | 按状态筛选 | `WHERE status = 'publish'` |
| `idx_posts_post_type` | B-Tree | post_type | 按类型筛选 | `WHERE post_type = 'post'` |
| `idx_posts_published_at` | B-Tree | published_at DESC | 按发布时间排序 | `ORDER BY published_at DESC` |
| `idx_posts_is_featured` | B-Tree | is_featured | 获取精选文章 | `WHERE is_featured = true` |
| `idx_posts_is_sticky` | B-Tree | is_sticky | 获取置顶文章 | `WHERE is_sticky = true` |
| `idx_posts_view_count` | B-Tree | view_count DESC | 按浏览量排序 | `ORDER BY view_count DESC` |
| `idx_posts_title_search` | GIN | to_tsvector('english', title) | 标题全文搜索 | `WHERE to_tsvector('english', title) @@ to_tsquery('search')` |
| `idx_posts_content_search` | GIN | to_tsvector('english', content) | 内容全文搜索 | `WHERE to_tsvector('english', content) @@ to_tsquery('search')` |
| `idx_posts_combined_search` | GIN | to_tsvector('english', title \|\| ' ' \|\| content) | 组合全文搜索 | 全文搜索标题和内容 |
| `idx_posts_metadata` | GIN | metadata | JSONB 查询 | `WHERE metadata @> '{"featured": true}'` |

**查询优化示例**:
```sql
-- 获取已发布的文章（使用 status 和 published_at 索引）
SELECT * FROM posts
WHERE status = 'publish'
ORDER BY published_at DESC
LIMIT 10;

-- 获取作者的文章（使用 author_id 和 status 索引）
SELECT * FROM posts
WHERE author_id = 'uuid'
  AND status = 'publish'
ORDER BY published_at DESC;

-- 获取精选文章（使用 is_featured 索引）
SELECT * FROM posts
WHERE is_featured = true
  AND status = 'publish'
ORDER BY published_at DESC;

-- 全文搜索（使用 combined_search GIN 索引）
SELECT * FROM posts
WHERE to_tsvector('english', coalesce(title, '') || ' ' || coalesce(content, '')
      @@ to_tsquery('english', 'PostgreSQL & Database')
  AND status = 'publish'
ORDER BY published_at DESC;

-- 热门文章（使用 view_count 索引）
SELECT * FROM posts
WHERE status = 'publish'
ORDER BY view_count DESC
LIMIT 10;

-- JSONB 查询（使用 metadata GIN 索引）
SELECT * FROM posts
WHERE metadata @> '{"difficulty": "advanced"}'
  AND status = 'publish';
```

---

### 5. post_categories 表

| 索引名 | 类型 | 字段 | 用途 | 查询示例 |
|--------|------|------|------|----------|
| `idx_post_categories_post_id` | B-Tree | post_id | 查找文章的分类 | `WHERE post_id = 'uuid'` |
| `idx_post_categories_category_id` | B-Tree | category_id | 查找分类的文章 | `WHERE category_id = 'uuid'` |

**查询优化示例**:
```sql
-- 获取文章的分类
SELECT c.*
FROM categories c
JOIN post_categories pc ON c.id = pc.category_id
WHERE pc.post_id = 'uuid';

-- 获取分类下的文章
SELECT p.*
FROM posts p
JOIN post_categories pc ON p.id = pc.post_id
WHERE pc.category_id = 'uuid'
  AND p.status = 'publish'
ORDER BY p.published_at DESC;
```

---

### 6. post_tags 表

| 索引名 | 类型 | 字段 | 用途 | 查询示例 |
|--------|------|------|------|----------|
| `idx_post_tags_post_id` | B-Tree | post_id | 查找文章的标签 | `WHERE post_id = 'uuid'` |
| `idx_post_tags_tag_id` | B-Tree | tag_id | 查找标签的文章 | `WHERE tag_id = 'uuid'` |

**查询优化示例**:
```sql
-- 获取文章的标签
SELECT t.*
FROM tags t
JOIN post_tags pt ON t.id = pt.tag_id
WHERE pt.post_id = 'uuid';

-- 获取标签下的文章
SELECT p.*
FROM posts p
JOIN post_tags pt ON p.id = pt.post_id
WHERE pt.tag_id = 'uuid'
  AND p.status = 'publish'
ORDER BY p.published_at DESC;
```

---

### 7. comments 表

| 索引名 | 类型 | 字段 | 用途 | 查询示例 |
|--------|------|------|------|----------|
| `idx_comments_post_id` | B-Tree | post_id | 查找文章的评论 | `WHERE post_id = 'uuid'` |
| `idx_comments_author_id` | B-Tree | author_id | 查找用户的评论 | `WHERE author_id = 'uuid'` |
| `idx_comments_parent_id` | B-Tree | parent_id | 查找子评论 | `WHERE parent_id = 'uuid'` |
| `idx_comments_status` | B-Tree | status | 按状态筛选 | `WHERE status = 'approved'` |
| `idx_comments_created_at` | B-Tree | created_at DESC | 按时间排序 | `ORDER BY created_at DESC` |

**查询优化示例**:
```sql
-- 获取文章的已批准评论（使用 post_id 和 status 索引）
SELECT * FROM comments
WHERE post_id = 'uuid'
  AND status = 'approved'
ORDER BY created_at DESC;

-- 获取用户的评论（使用 author_id 索引）
SELECT * FROM comments
WHERE author_id = 'uuid'
ORDER BY created_at DESC;

-- 获取待审核评论（使用 status 索引）
SELECT * FROM comments
WHERE status = 'pending'
ORDER BY created_at DESC;
```

---

### 8. media 表

| 索引名 | 类型 | 字段 | 用途 | 查询示例 |
|--------|------|------|------|----------|
| `idx_media_post_id` | B-Tree | post_id | 查找文章的媒体 | `WHERE post_id = 'uuid'` |
| `idx_media_uploader_id` | B-Tree | uploader_id | 查找用户的媒体 | `WHERE uploader_id = 'uuid'` |
| `idx_media_mime_type` | B-Tree | mime_type | 按类型筛选 | `WHERE mime_type LIKE 'image/%'` |
| `idx_media_created_at` | B-Tree | created_at DESC | 按时间排序 | `ORDER BY created_at DESC` |

**查询优化示例**:
```sql
-- 获取文章的媒体（使用 post_id 索引）
SELECT * FROM media WHERE post_id = 'uuid';

-- 获取用户的媒体（使用 uploader_id 和 created_at 索引）
SELECT * FROM media
WHERE uploader_id = 'uuid'
ORDER BY created_at DESC;

-- 获取所有图片（使用 mime_type 索引）
SELECT * FROM media
WHERE mime_type LIKE 'image/%'
ORDER BY created_at DESC;
```

---

### 9. options 表

| 索引名 | 类型 | 字段 | 用途 | 查询示例 |
|--------|------|------|------|----------|
| `idx_options_option_name` | B-Tree | option_name | 按名称查找 | `WHERE option_name = 'site_name'` |
| `idx_options_autoload` | B-Tree | autoload | 获取自动加载的选项 | `WHERE autoload = true` |

**查询优化示例**:
```sql
-- 获取特定选项（使用 option_name 索引）
SELECT * FROM options WHERE option_name = 'site_name';

-- 获取所有自动加载的选项（使用 autoload 索引）
SELECT * FROM options WHERE autoload = true;
```

---

### 10. user_meta 表

| 索引名 | 类型 | 字段 | 用途 | 查询示例 |
|--------|------|------|------|----------|
| `idx_user_meta_user_id` | B-Tree | user_id | 查找用户的元数据 | `WHERE user_id = 'uuid'` |
| `idx_user_meta_meta_key` | B-Tree | meta_key | 按键查找 | `WHERE meta_key = 'preferences'` |

**查询优化示例**:
```sql
-- 获取用户的所有元数据
SELECT * FROM user_meta WHERE user_id = 'uuid';

-- 获取特定键的元数据
SELECT * FROM user_meta
WHERE user_id = 'uuid'
  AND meta_key = 'preferences';
```

---

### 11. post_meta 表

| 索引名 | 类型 | 字段 | 用途 | 查询示例 |
|--------|------|------|------|----------|
| `idx_post_meta_post_id` | B-Tree | post_id | 查找文章的元数据 | `WHERE post_id = 'uuid'` |
| `idx_post_meta_meta_key` | B-Tree | meta_key | 按键查找 | `WHERE meta_key = 'views'` |

**查询优化示例**:
```sql
-- 获取文章的所有元数据
SELECT * FROM post_meta WHERE post_id = 'uuid';

-- 获取特定键的元数据
SELECT * FROM post_meta
WHERE post_id = 'uuid'
  AND meta_key = 'views';
```

---

## 复合索引建议

根据常见查询模式，可以添加以下复合索引以提升性能：

```sql
-- 文章列表页查询（状态 + 类型 + 发布时间）
CREATE INDEX idx_posts_status_type_published
ON posts(status, post_type, published_at DESC)
WHERE status = 'publish';

-- 作者文章列表（作者 + 状态 + 发布时间）
CREATE INDEX idx_posts_author_status_published
ON posts(author_id, status, published_at DESC)
WHERE status = 'publish';

-- 热门文章（状态 + 浏览量 + 发布时间）
CREATE INDEX idx_posts_status_views_published
ON posts(status, view_count DESC, published_at DESC)
WHERE status = 'publish' AND view_count > 0;

-- 评论查询（文章 + 状态 + 时间）
CREATE INDEX idx_comments_post_status_created
ON comments(post_id, status, created_at DESC)
WHERE status = 'approved';
```

---

## 全文搜索优化

### 中文全文搜索

如果需要支持中文全文搜索，可以安装 `zhparser` 扩展：

```sql
CREATE EXTENSION zhparser;

CREATE TEXT SEARCH CONFIGURATION chinese (COPY = simple);

ALTER TEXT SEARCH CONFIGURATION chinese
  ALTER MAPPING FOR asciiword, word, hword, hword_part, numword
  WITH zhparser;
```

### 全文搜索函数

```sql
-- 创建全文搜索函数
CREATE OR REPLACE FUNCTION post_search(search_query TEXT)
RETURNS TABLE (
  id UUID,
  title VARCHAR(255),
  slug VARCHAR(255),
  excerpt TEXT,
  rank REAL
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    p.id,
    p.title,
    p.slug,
    p.excerpt,
    ts_rank(
      to_tsvector('english', coalesce(p.title, '') || ' ' || coalesce(p.content, '')),
      to_tsquery('english', search_query)
    ) as rank
  FROM posts p
  WHERE to_tsvector('english', coalesce(p.title, '') || ' ' || coalesce(p.content, ''))
        @@ to_tsquery('english', search_query)
    AND p.status = 'publish'
    AND p.deleted_at IS NULL
  ORDER BY rank DESC, p.published_at DESC;
END;
$$ LANGUAGE plpgsql;
```

---

## 索引维护

### 检查索引使用情况

```sql
-- 查看索引使用统计
SELECT
  schemaname,
  tablename,
  indexname,
  idx_scan as index_scans,
  idx_tup_read as tuples_read,
  idx_tup_fetch as tuples_fetched
FROM pg_stat_user_indexes
ORDER BY idx_scan DESC;

-- 查找未使用的索引
SELECT
  schemaname,
  tablename,
  indexname,
  idx_scan
FROM pg_stat_user_indexes
WHERE idx_scan = 0
  AND indexname NOT LIKE '%_pkey'
ORDER BY tablename, indexname;
```

### 重建索引

```sql
-- 重建单个索引
REINDEX INDEX idx_posts_slug;

-- 重建表的所有索引
REINDEX TABLE posts;

-- 重建数据库的所有索引
REINDEX DATABASE cyberpress_db;
```

### 分析表以更新统计信息

```sql
-- 分析单个表
ANALYZE posts;

-- 分析所有表
ANALYZE;
```

---

## 索引大小监控

```sql
-- 查看索引大小
SELECT
  tablename,
  indexname,
  pg_size_pretty(pg_relation_size(indexrelid)) as size
FROM pg_stat_user_indexes
ORDER BY pg_relation_size(indexrelid) DESC;

-- 查看表和索引的总大小
SELECT
  tablename,
  pg_size_pretty(pg_total_relation_size(tablename::regclass)) as total_size,
  pg_size_pretty(pg_relation_size(tablename::regclass)) as table_size,
  pg_size_pretty(pg_total_relation_size(tablename::regclass) - pg_relation_size(tablename::regclass)) as indexes_size
FROM pg_tables
WHERE schemaname = 'public'
ORDER BY pg_total_relation_size(tablename::regclass) DESC;
```

---

## 性能优化建议

### 1. 适度索引
- 索引不是越多越好，每个索引都会增加写操作的开销
- 只为常用查询创建索引
- 定期检查并删除未使用的索引

### 2. 复合索引顺序
- 将选择性高的字段放在前面
- 考虑查询的排序和筛选条件
- 遵循 "最常用的列最左" 原则

### 3. 部分索引
- 对于经常查询特定子集的数据，使用 WHERE 条件创建部分索引
- 例如：只对已发布的文章创建索引

### 4. 覆盖索引
- 创建包含查询所需所有字段的索引
- 避免回表查询，提升性能

### 5. 定期维护
- 定期运行 `ANALYZE` 更新统计信息
- 定期运行 `VACUUM` 清理死元组
- 监控索引使用情况，删除不必要的索引

---

## 查询优化示例

### 使用 EXPLAIN ANALYZE

```sql
EXPLAIN ANALYZE
SELECT * FROM posts
WHERE status = 'publish'
  AND author_id = 'uuid'
ORDER BY published_at DESC
LIMIT 10;
```

### 使用 EXPLAIN (ANALYZE, BUFFERS)

```sql
EXPLAIN (ANALYZE, BUFFERS)
SELECT * FROM posts
WHERE to_tsvector('english', title || ' ' || content)
  @@ to_tsquery('search')
  AND status = 'publish';
```

---

**文档版本**: 1.0.0
**最后更新**: 2026-03-08
**作者**: Claude (Database Architect)
