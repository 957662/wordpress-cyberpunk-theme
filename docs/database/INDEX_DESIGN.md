# CyberPress Platform - 索引设计文档

## 📋 目录
- [索引设计原则](#索引设计原则)
- [各表索引详情](#各表索引详情)
- [全文搜索索引](#全文搜索索引)
- [复合索引设计](#复合索引设计)
- [索引优化策略](#索引优化策略)
- [索引维护建议](#索引维护建议)

---

## 索引设计原则

### 1. 选择性原则
- 在选择性高的列上创建索引（如唯一值多的列）
- 避免在选择性低的列上创建索引（如性别、状态）

### 2. 查询模式
- 为频繁查询的列创建索引
- 为 WHERE、JOIN、ORDER BY 子句中的列创建索引

### 3. 索引类型
- **B-tree索引**: 默认类型，适合等值和范围查询
- **GIN索引**: 适合全文搜索和JSONB数据
- **Hash索引**: 仅适合等值查询
- **BRIN索引**: 适合大表的顺序数据

### 4. 索引成本
- 索引增加写入成本
- 占用额外存储空间
- 需要定期维护

---

## 各表索引详情

### users 表索引

```sql
-- 主键索引（自动创建）
PRIMARY KEY (id)

-- 唯一索引（登录查询）
CREATE UNIQUE INDEX idx_users_email ON users(email);

-- 角色筛选索引（管理后台）
CREATE INDEX idx_users_role ON users(role) WHERE status = 'active';

-- 状态筛选索引
CREATE INDEX idx_users_status ON users(status);

-- 时间排序索引（用户列表）
CREATE INDEX idx_users_created_at ON users(created_at DESC);

-- 复合索引（用户搜索）
CREATE INDEX idx_users_name_email ON users USING gin(
    to_tsvector('english', coalesce(name, '') || ' ' || coalesce(email, ''))
);
```

**查询场景：**
- 登录验证: `WHERE email = ?`
- 用户列表: `WHERE role = ? ORDER BY created_at DESC`
- 用户搜索: `WHERE name LIKE ? OR email LIKE ?`

---

### user_sessions 表索引

```sql
-- 主键索引
PRIMARY KEY (id)

-- 唯一索引（令牌验证）
CREATE UNIQUE INDEX idx_sessions_token ON user_sessions(token);

-- 用户会话查询
CREATE INDEX idx_sessions_user_id ON user_sessions(user_id);

-- 过期清理查询
CREATE INDEX idx_sessions_expires_at ON user_sessions(expires_at);

-- 复合索引（活跃会话）
CREATE INDEX idx_sessions_active ON user_sessions(user_id, expires_at)
WHERE expires_at > CURRENT_TIMESTAMP;
```

**查询场景：**
- JWT验证: `WHERE token = ? AND expires_at > NOW()`
- 用户会话: `WHERE user_id = ?`
- 清理过期: `DELETE WHERE expires_at < NOW()`

---

### posts 表索引

```sql
-- 主键索引
PRIMARY KEY (id)

-- 唯一索引（slug查询）
CREATE UNIQUE INDEX idx_posts_slug ON posts(slug);

-- 全文搜索索引（重要）
CREATE INDEX idx_posts_search ON posts USING gin(
    to_tsvector('english', coalesce(title, '') || ' ' || coalesce(content, ''))
);

-- 作者文章查询
CREATE INDEX idx_posts_author_id ON posts(author_id);

-- 分类文章查询
CREATE INDEX idx_posts_category_id ON posts(category_id);

-- 状态筛选（部分索引，只索引已发布）
CREATE INDEX idx_posts_status ON posts(status, published_at DESC)
WHERE status = 'published';

-- 热门文章排序
CREATE INDEX idx_posts_view_count ON posts(view_count DESC)
WHERE status = 'published';

-- 时间线查询
CREATE INDEX idx_posts_published_at ON posts(published_at DESC)
WHERE status = 'published';

-- 最新文章
CREATE INDEX idx_posts_created_at ON posts(created_at DESC);

-- 复合索引（首页列表）
CREATE INDEX idx_posts_home_list ON posts(status, published_at DESC, view_count DESC)
WHERE status = 'published';

-- 复合索引（相关文章）
CREATE INDEX idx_posts_related ON posts(category_id, published_at DESC)
WHERE status = 'published';
```

**查询场景：**
- 文章详情: `WHERE slug = ?`
- 全文搜索: `WHERE to_tsvector('english', title || ' ' || content) @@ to_tsquery(?)`
- 首页列表: `WHERE status = 'published' ORDER BY published_at DESC`
- 热门文章: `WHERE status = 'published' ORDER BY view_count DESC`
- 作者文章: `WHERE author_id = ? AND status = 'published'`

---

### categories 表索引

```sql
-- 主键索引
PRIMARY KEY (id)

-- 唯一索引（slug查询）
CREATE UNIQUE INDEX idx_categories_slug ON categories(slug);

-- 父分类查询（支持层级）
CREATE INDEX idx_categories_parent_id ON categories(parent_id);

-- 排序索引
CREATE INDEX idx_categories_sort_order ON categories(sort_order);

-- 复合索引（分类列表）
CREATE INDEX idx_categories_list ON categories(parent_id, sort_order);
```

**查询场景：**
- 分类查询: `WHERE slug = ?`
- 层级分类: `WHERE parent_id = ?`
- 分类列表: `ORDER BY sort_order`

---

### tags 表索引

```sql
-- 主键索引
PRIMARY KEY (id)

-- 唯一索引
CREATE UNIQUE INDEX idx_tags_slug ON tags(slug);

-- 热门标签
CREATE INDEX idx_tags_post_count ON tags(post_count DESC);

-- 标签搜索
CREATE INDEX idx_tags_name ON tags USING gin(to_tsvector('english', name));
```

**查询场景：**
- 标签查询: `WHERE slug = ?`
- 热门标签: `ORDER BY post_count DESC`
- 标签搜索: `WHERE name LIKE ?`

---

### post_tags 表索引

```sql
-- 主键索引
PRIMARY KEY (post_id, tag_id)

-- 反向查询（某标签的所有文章）
CREATE INDEX idx_post_tags_tag_id ON post_tags(tag_id);
```

**查询场景：**
- 文章标签: `WHERE post_id = ?`
- 标签文章: `WHERE tag_id = ?`

---

### comments 表索引

```sql
-- 主键索引
PRIMARY KEY (id)

-- 文章评论查询
CREATE INDEX idx_comments_post_id ON comments(post_id, created_at DESC);

-- 嵌套评论查询
CREATE INDEX idx_comments_parent_id ON comments(parent_id);

-- 用户评论查询
CREATE INDEX idx_comments_author_id ON comments(author_id, created_at DESC);

-- 状态筛选（审核用）
CREATE INDEX idx_comments_status ON comments(status, created_at);

-- 最新评论
CREATE INDEX idx_comments_created_at ON comments(created_at DESC);

-- 复合索引（评论列表）
CREATE INDEX idx_comments_list ON comments(post_id, status, created_at DESC)
WHERE status = 'approved';

-- 部分索引（只索引待审核）
CREATE INDEX idx_comments_pending ON comments(created_at)
WHERE status = 'pending';
```

**查询场景：**
- 文章评论: `WHERE post_id = ? AND status = 'approved'`
- 评论回复: `WHERE parent_id = ?`
- 用户评论: `WHERE author_id = ?`
- 审核列表: `WHERE status = 'pending'`

---

### comment_likes 表索引

```sql
-- 主键索引
PRIMARY KEY (comment_id, user_id)

-- 用户点赞查询
CREATE INDEX idx_comment_likes_user_id ON comment_likes(user_id);

-- 检查是否点赞
CREATE UNIQUE INDEX idx_comment_likes_check ON comment_likes(user_id, comment_id);
```

**查询场景：**
- 点赞状态: `WHERE comment_id = ? AND user_id = ?`
- 用户点赞: `WHERE user_id = ?`

---

### notifications 表索引

```sql
-- 主键索引
PRIMARY KEY (id)

-- 用户通知查询
CREATE INDEX idx_notifications_user_id ON notifications(user_id, created_at DESC);

-- 未读通知筛选
CREATE INDEX idx_notifications_read ON notifications(user_id, read, created_at DESC)
WHERE read = FALSE;

-- 类型筛选
CREATE INDEX idx_notifications_type ON notifications(user_id, type, created_at DESC);
```

**查询场景：**
- 通知列表: `WHERE user_id = ? ORDER BY created_at DESC`
- 未读通知: `WHERE user_id = ? AND read = FALSE`
- 类型通知: `WHERE user_id = ? AND type = ?`

---

### activity_log 表索引

```sql
-- 主键索引
PRIMARY KEY (id)

-- 用户活动查询
CREATE INDEX idx_activity_user_id ON activity_log(user_id, created_at DESC);

-- 实体活动查询
CREATE INDEX idx_activity_entity ON activity_log(entity_type, entity_id, created_at DESC);

-- 操作类型筛选
CREATE INDEX idx_activity_action ON activity_log(action, created_at DESC);

-- 时间范围查询
CREATE INDEX idx_activity_created_at ON activity_log(created_at DESC);
```

**查询场景：**
- 用户活动: `WHERE user_id = ? ORDER BY created_at DESC`
- 实体活动: `WHERE entity_type = ? AND entity_id = ?`
- 操作审计: `WHERE action = ?`

---

### page_views 表索引

```sql
-- 主键索引
PRIMARY KEY (id)

-- 文章浏览统计
CREATE INDEX idx_page_views_post_id ON page_views(post_id, created_at);

-- 路径统计
CREATE INDEX idx_page_views_path ON page_views(path, created_at);

-- 会话查询
CREATE INDEX idx_page_views_session ON page_views(session_id, created_at);

-- 时间范围查询（BRIN索引，适合大表）
CREATE INDEX idx_page_views_created_at ON page_views USING brin(created_at);

-- 复合索引（统计查询）
CREATE INDEX idx_page_views_stats ON page_views(post_id, created_at)
WHERE created_at > CURRENT_DATE - INTERVAL '30 days';
```

**查询场景：**
- 文章浏览: `WHERE post_id = ? AND created_at >= ?`
- 路径统计: `WHERE path = ?`
- 访问统计: `WHERE post_id = ? AND created_at >= ? AND created_at < ?`

---

### media_files 表索引

```sql
-- 主键索引
PRIMARY KEY (id)

-- MIME类型筛选
CREATE INDEX idx_media_files_mime_type ON media_files(mime_type);

-- 用户文件查询
CREATE INDEX idx_media_files_uploaded_by ON media_files(uploaded_by, created_at DESC);

-- 文件搜索
CREATE INDEX idx_media_files_name ON media_files USING gin(
    to_tsvector('english', original_filename)
);
```

**查询场景：**
- 类型筛选: `WHERE mime_type LIKE 'image/%'`
- 用户文件: `WHERE uploaded_by = ?`
- 文件搜索: `WHERE original_filename LIKE ?`

---

### newsletter_subscriptions 表索引

```sql
-- 主键索引
PRIMARY KEY (id)

-- 唯一索引
CREATE UNIQUE INDEX idx_newsletter_email ON newsletter_subscriptions(email);

-- 状态筛选
CREATE INDEX idx_newsletter_status ON newsletter_subscriptions(status);

-- 确认令牌
CREATE UNIQUE INDEX idx_newsletter_confirm_token ON newsletter_subscriptions(confirm_token)
WHERE confirm_token IS NOT NULL;

-- 取消令牌
CREATE UNIQUE INDEX idx_newsletter_unsubscribe_token ON newsletter_subscriptions(unsubscribe_token)
WHERE unsubscribe_token IS NOT NULL;
```

**查询场景：**
- 订阅查询: `WHERE email = ?`
- 状态筛选: `WHERE status = 'active'`
- 令牌确认: `WHERE confirm_token = ?`

---

## 全文搜索索引

### PostgreSQL 全文搜索配置

```sql
-- 创建全文搜索配置
CREATE TEXT SEARCH CONFIGURATION cyberpress (COPY = simple);

-- 添加自定义字典
ALTER TEXT SEARCH CONFIGURATION cyberpress
    ALTER MAPPING FOR asciiword, word WITH english_stem;
```

### posts 表全文搜索优化

```sql
-- 1. 基础全文索引
CREATE INDEX idx_posts_search ON posts USING gin(
    to_tsvector('english', title || ' ' || content)
);

-- 2. 带权重的全文索引
CREATE INDEX idx_posts_search_weighted ON posts USING gin(
    setweight(to_tsvector('english', coalesce(title, '')), 'A') ||
    setweight(to_tsvector('english', coalesce(excerpt, '')), 'B') ||
    setweight(to_tsvector('english', coalesce(content, '')), 'C')
);

-- 3. 用于高亮的索引
CREATE INDEX idx_posts_search_raw ON posts USING gin(
    to_tsvector('english', title),
    to_tsvector('english', content)
);
```

### 全文搜索查询示例

```sql
-- 简单搜索
SELECT * FROM posts
WHERE to_tsvector('english', title || ' ' || content) @@ to_tsquery('english', 'python & django');

-- 短语搜索
SELECT * FROM posts
WHERE to_tsvector('english', title || ' ' || content) @@ phraseto_tsquery('english', 'machine learning');

-- 排名搜索（按相关性排序）
SELECT *,
    ts_rank(to_tsvector('english', title || ' ' || content), to_tsquery('english', 'react & nextjs')) as rank
FROM posts
WHERE to_tsvector('english', title || ' ' || content) @@ to_tsquery('english', 'react & nextjs')
ORDER BY rank DESC;

-- 高亮搜索结果
SELECT
    title,
    ts_headline('english', content, to_tsquery('english', 'database'), 'MaxWords=50, MinWords=20') as highlight
FROM posts
WHERE to_tsvector('english', title || ' ' || content) @@ to_tsquery('english', 'database');
```

---

## 复合索引设计

### 复合索引设计原则

1. **最左前缀原则**: 复合索引 (a, b, c) 支持: a, ab, abc 查询
2. **选择性原则**: 将选择性高的列放前面
3. **覆盖索引**: 索引包含查询所需的所有列，避免回表

### 常用复合索引

```sql
-- 首页文章列表
CREATE INDEX idx_posts_home ON posts(status, published_at DESC, view_count DESC)
INCLUDE (title, slug, featured_image, author_id);

-- 相关文章
CREATE INDEX idx_posts_related ON posts(category_id, published_at DESC)
WHERE status = 'published';

-- 作者文章列表
CREATE INDEX idx_posts_author_list ON posts(author_id, status, published_at DESC)
INCLUDE (title, slug, view_count);

-- 评论列表（含分页）
CREATE INDEX idx_comments_post_page ON comments(post_id, status, created_at DESC)
INCLUDE (author_name, content, like_count)
WHERE status = 'approved';

-- 用户通知列表
CREATE INDEX idx_notifications_user_list ON notifications(user_id, read, created_at DESC)
INCLUDE (type, title, message);

-- 活动日志查询
CREATE INDEX idx_activity_user_action ON activity_log(user_id, action, created_at DESC)
INCLUDE (entity_type, entity_id, description);
```

---

## 索引优化策略

### 1. 部分索引（Partial Index）

只索引满足条件的数据，减少索引大小：

```sql
-- 只索引已发布的文章
CREATE INDEX idx_posts_published ON posts(published_at DESC)
WHERE status = 'published';

-- 只索引待审核的评论
CREATE INDEX idx_comments_pending ON comments(created_at)
WHERE status = 'pending';

-- 只索引未读通知
CREATE INDEX idx_notifications_unread ON notifications(user_id, created_at DESC)
WHERE read = FALSE;
```

### 2. 表达式索引

索引计算结果，加速特定查询：

```sql
-- 不区分大小写的邮箱查询
CREATE INDEX idx_users_email_lower ON users(lower(email));

-- URL slug 的规范化
CREATE INDEX idx_posts_slug_lower ON posts(lower(slug));

-- 日期范围查询
CREATE INDEX idx_posts_date ON posts(date_trunc('day', published_at));
```

### 3. 包含索引（Covering Index）

索引包含查询所需的所有列：

```sql
-- 首页文章列表（包含所有显示字段）
CREATE INDEX idx_posts_home_cover ON posts(status, published_at DESC)
INCLUDE (title, slug, excerpt, featured_image, view_count, author_id)
WHERE status = 'published';

-- 评论列表（包含作者信息）
CREATE INDEX idx_comments_cover ON comments(post_id, created_at DESC)
INCLUDE (author_name, author_email, content, like_count)
WHERE status = 'approved';
```

### 4. BRIN 索引

适合大表的顺序数据：

```sql
-- 页面浏览表（按时间顺序）
CREATE INDEX idx_page_views_brin ON page_views USING brin(created_at);

-- 活动日志表
CREATE INDEX idx_activity_brin ON activity_log USING brin(created_at);
```

---

## 索引维护建议

### 1. 定期分析

```sql
-- 分析表统计信息
ANALYZE posts;

-- 分析所有表
ANALYZE;
```

### 2. 重建索引

```sql
-- 重建单个索引
REINDEX INDEX idx_posts_search;

-- 重建表的所有索引
REINDEX TABLE posts;

-- 重建数据库的所有索引
REINDEX DATABASE cyberpress;
```

### 3. 清理死元组

```sql
-- 清理表并更新统计信息
VACUUM ANALYZE posts;

-- 并行清理（适合大表）
VACUUM (ANALYZE, INDEX_CLEANUP ON) posts;
```

### 4. 监控索引使用

```sql
-- 查看未使用的索引
SELECT
    schemaname,
    tablename,
    indexname,
    idx_scan as index_scans,
    idx_tup_read as tuples_read,
    idx_tup_fetch as tuples_fetched
FROM pg_stat_user_indexes
WHERE idx_scan = 0
    AND indexname NOT LIKE '%_pkey'
ORDER BY schemaname, tablename;

-- 查看索引大小
SELECT
    schemaname,
    tablename,
    indexname,
    pg_size_pretty(pg_relation_size(indexrelid)) as size
FROM pg_stat_user_indexes
ORDER BY pg_relation_size(indexrelid) DESC;

-- 查看索引效率
SELECT
    schemaname,
    tablename,
    indexname,
    idx_scan,
    idx_tup_read,
    idx_tup_fetch,
    idx_tup_read::float / idx_scan as tuples_per_scan
FROM pg_stat_user_indexes
WHERE idx_scan > 0
ORDER BY tuples_per_scan DESC;
```

### 5. 索引优化建议

```sql
-- 查找可以优化的查询
SELECT
    query,
    calls,
    total_time,
    mean_time,
    rows
FROM pg_stat_statements
ORDER BY mean_time DESC
LIMIT 10;

-- 查找缺失的索引
SELECT
    schemaname,
    tablename,
    attname,
    n_distinct,
    correlation
FROM pg_stats
WHERE schemaname = 'public'
    AND n_distinct > 100
ORDER BY n_distinct DESC;
```

---

## 性能测试

### 索引性能对比

```sql
-- 测试查询：获取首页文章列表
EXPLAIN ANALYZE
SELECT * FROM posts
WHERE status = 'published'
ORDER BY published_at DESC
LIMIT 10;

-- 测试查询：全文搜索
EXPLAIN ANALYZE
SELECT * FROM posts
WHERE to_tsvector('english', title || ' ' || content) @@ to_tsquery('react & nextjs')
ORDER BY published_at DESC;

-- 测试查询：评论列表
EXPLAIN ANALYZE
SELECT * FROM comments
WHERE post_id = '...' AND status = 'approved'
ORDER BY created_at DESC;
```

---

## 索引设计检查清单

- [ ] 所有主键都有索引（自动创建）
- [ ] 所有外键都有索引
- [ ] 频繁查询的 WHERE 列有索引
- [ ] JOIN 列有索引
- [ ] ORDER BY 列有索引
- [ ] 全文搜索字段有 GIN 索引
- [ ] 复合查询有复合索引
- [ ] 大表有分区或 BRIN 索引
- [ ] 定期执行 ANALYZE
- [ ] 定期执行 VACUUM
- [ ] 监控索引使用情况
- [ ] 删除未使用的索引

---

## 总结

好的索引设计可以显著提升数据库性能，但需要根据实际查询模式进行调整。建议：

1. **先测量，后优化**: 使用 EXPLAIN ANALYZE 分析查询
2. **逐步添加**: 一次添加一个索引，测量效果
3. **定期审查**: 定期检查索引使用情况，删除无用索引
4. **平衡读写**: 索引加速读取，但减慢写入
5. **监控维护**: 定期维护索引，保持最佳性能
