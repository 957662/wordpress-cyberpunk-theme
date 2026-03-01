# CyberPress Platform - 数据库索引设计

## 🎯 索引设计原则

### 1. 索引选择策略
- **高选择性列优先**: 唯一值多的列更适合建索引
- **查询模式驱动**: 根据实际查询频率设计索引
- **复合索引顺序**: 最常用列在前，选择性高的列在前
- **覆盖索引**: 尽量包含查询所需的所有字段

### 2. 索引类型说明
- **PRIMARY KEY**: 主键索引（聚簇索引）
- **UNIQUE KEY**: 唯一索引（保证数据唯一性）
- **INDEX**: 普通索引（加速查询）
- **FULLTEXT**: 全文索引（文本搜索）
- **COMPOSITE**: 复合索引（多列组合）

---

## 📊 各表索引设计

### 1. users 表

#### 现有索引
```sql
PRIMARY KEY (id)
UNIQUE KEY uk_email (email)
UNIQUE KEY uk_username (username)
INDEX idx_role (role)
INDEX idx_status (status)
INDEX idx_created_at (created_at)
```

#### 查询场景优化

**场景1: 用户登录**
```sql
-- 查询语句
SELECT * FROM users WHERE email = ? AND status = 'active';

-- 现有索引: uk_email (email)
-- 评估: ✅ 已优化，email是唯一索引
-- 性能: O(log n)，最佳
```

**场景2: 管理员列表（分页）**
```sql
-- 查询语句
SELECT * FROM users
WHERE role = 'administrator'
ORDER BY created_at DESC
LIMIT 20 OFFSET 0;

-- 建议新增复合索引
CREATE INDEX idx_role_created ON users(role, created_at DESC);

-- 评估: ✅ 覆盖WHERE和ORDER BY
-- 性能: 避免filesort，提升分页性能
```

**场景3: 用户搜索**
```sql
-- 查询语句
SELECT * FROM users
WHERE username LIKE '%keyword%' OR email LIKE '%keyword%';

-- 评估: ⚠️ 前缀模糊查询无法使用索引
-- 建议: 使用ElasticSearch或考虑添加username的前缀索引
ALTER TABLE users ADD INDEX idx_username_prefix(username(10));
```

---

### 2. posts 表

#### 现有索引
```sql
PRIMARY KEY (id)
UNIQUE KEY uk_slug (slug)
INDEX idx_author (author_id)
INDEX idx_status (status)
INDEX idx_post_type (post_type)
INDEX idx_published_at (published_at)
INDEX idx_view_count (view_count)
INDEX idx_created_at (created_at)
FULLTEXT INDEX ft_search (title, content, excerpt)
```

#### 查询场景优化

**场景1: 首页文章列表**
```sql
-- 查询语句
SELECT p.*, u.username, u.avatar_url
FROM posts p
LEFT JOIN users u ON p.author_id = u.id
WHERE p.status = 'publish'
  AND p.post_type = 'post'
ORDER BY p.published_at DESC
LIMIT 10;

-- 现有索引: idx_published_at (published_at)
-- 评估: ✅ 已优化
-- 性能: 使用索引排序，高效
```

**场景2: 作者文章列表**
```sql
-- 查询语句
SELECT * FROM posts
WHERE author_id = ? AND status = 'publish'
ORDER BY published_at DESC
LIMIT 20;

-- 建议新增复合索引
CREATE INDEX idx_author_status_published ON posts(author_id, status, published_at DESC);

-- 评估: ✅ 覆盖WHERE和ORDER BY
-- 性能: 避免filesort，加速作者归档页
```

**场景3: 热门文章**
```sql
-- 查询语句
SELECT * FROM posts
WHERE status = 'publish' AND post_type = 'post'
ORDER BY view_count DESC, published_at DESC
LIMIT 10;

-- 建议新增复合索引
CREATE INDEX idx_status_type_views_published
ON posts(status, post_type, view_count DESC, published_at DESC);

-- 评估: ✅ 完全覆盖查询和排序
-- 性能: 高效获取热门文章
```

**场景4: 全文搜索**
```sql
-- 查询语句
SELECT * FROM posts
WHERE MATCH(title, content, excerpt) AGAINST('keyword' IN NATURAL LANGUAGE MODE)
  AND status = 'publish'
ORDER BY published_at DESC
LIMIT 20;

-- 现有索引: ft_search (title, content, excerpt)
-- 评估: ⚠️ 全文索引与status过滤的优化
-- 建议: 考虑使用覆盖索引或ElasticSearch
CREATE INDEX idx_status_published ON posts(status, published_at DESC);
```

**场景5: 相关文章推荐**
```sql
-- 查询语句
SELECT p.*, COUNT(pc.category_id) as common_count
FROM posts p
JOIN post_categories pc ON p.id = pc.post_id
WHERE pc.category_id IN (?, ?, ?)
  AND p.id != ?
  AND p.status = 'publish'
GROUP BY p.id
ORDER BY common_count DESC, p.published_at DESC
LIMIT 5;

-- 评估: 依赖post_categories表的索引
-- 需要确保post_categories有合适的索引
```

---

### 3. categories 表

#### 现有索引
```sql
PRIMARY KEY (id)
UNIQUE KEY uk_slug_type (slug, type)
INDEX idx_parent (parent_id)
INDEX idx_type (type)
INDEX idx_count (count)
```

#### 查询场景优化

**场景1: 获取分类树**
```sql
-- 查询语句（递归查询）
WITH RECURSIVE category_tree AS (
  SELECT * FROM categories WHERE parent_id IS NULL AND type = 'category'
  UNION ALL
  SELECT c.* FROM categories c
  JOIN category_tree ct ON c.parent_id = ct.id
)
SELECT * FROM category_tree ORDER BY sort_order;

-- 评估: ✅ idx_parent和idx_type覆盖查询
-- 性能: 递归查询性能良好
```

**场景2: 热门标签**
```sql
-- 查询语句
SELECT c.*, COUNT(pc.post_id) as post_count
FROM categories c
JOIN post_categories pc ON c.id = pc.category_id
WHERE c.type = 'tag'
GROUP BY c.id
ORDER BY post_count DESC
LIMIT 20;

-- 建议新增复合索引
CREATE INDEX idx_type_count_sort ON categories(type, count DESC, sort_order);

-- 评估: ✅ 覆盖GROUP BY和ORDER BY
-- 性能: 加速热门标签查询
```

---

### 4. post_categories 表

#### 现有索引
```sql
PRIMARY KEY (id)
UNIQUE KEY uk_post_category (post_id, category_id)
INDEX idx_category (category_id)
```

#### 查询场景优化

**场景1: 文章的所有分类**
```sql
-- 查询语句
SELECT c.* FROM categories c
JOIN post_categories pc ON c.id = pc.category_id
WHERE pc.post_id = ?;

-- 现有索引: uk_post_category (post_id, category_id)
-- 评估: ✅ 已优化
-- 性能: 唯一索引快速查找
```

**场景2: 分类下的文章（分页）**
```sql
-- 查询语句
SELECT p.* FROM posts p
JOIN post_categories pc ON p.id = pc.post_id
WHERE pc.category_id = ? AND p.status = 'publish'
ORDER BY p.published_at DESC
LIMIT 20 OFFSET 0;

-- 建议新增复合索引
CREATE INDEX idx_category_post ON post_categories(category_id, post_id);

-- 评估: 与uk_post_category相反顺序
-- 性能: 优化按分类查询文章的场景
```

**场景3: 多分类筛选**
```sql
-- 查询语句
SELECT DISTINCT p.* FROM posts p
JOIN post_categories pc ON p.id = pc.post_id
WHERE pc.category_id IN (?, ?, ?)
  AND p.status = 'publish'
ORDER BY p.published_at DESC
LIMIT 20;

-- 评估: ✅ idx_category_post可以优化
-- 性能: IN查询使用索引范围扫描
```

---

### 5. comments 表

#### 现有索引
```sql
PRIMARY KEY (id)
INDEX idx_post (post_id)
INDEX idx_author (author_id)
INDEX idx_parent (parent_id)
INDEX idx_status (status)
INDEX idx_created_at (created_at)
```

#### 查询场景优化

**场景1: 文章评论（嵌套显示）**
```sql
-- 查询语句
SELECT * FROM comments
WHERE post_id = ? AND status = 'approved' AND parent_id IS NULL
ORDER BY created_at DESC;

-- 建议新增复合索引
CREATE INDEX idx_post_status_parent_created
ON comments(post_id, status, parent_id, created_at DESC);

-- 评估: ✅ 完全覆盖WHERE和ORDER BY
-- 性能: 高效获取顶级评论
```

**场景2: 评论回复**
```sql
-- 查询语句
SELECT * FROM comments
WHERE parent_id = ? AND status = 'approved'
ORDER BY created_at ASC;

-- 建议新增复合索引
CREATE INDEX idx_parent_status_created
ON comments(parent_id, status, created_at ASC);

-- 评估: ✅ 覆盖WHERE和ORDER BY
-- 性能: 快速加载评论回复
```

**场景3: 待审核评论**
```sql
-- 查询语句
SELECT c.*, p.title as post_title
FROM comments c
JOIN posts p ON c.post_id = p.id
WHERE c.status = 'pending'
ORDER BY c.created_at DESC
LIMIT 50;

-- 现有索引: idx_status (status), idx_created_at (created_at)
-- 评估: ⚠️ 两个独立索引，MySQL可能只使用一个
-- 建议新增复合索引
CREATE INDEX idx_status_created ON comments(status, created_at DESC);

-- 性能: 完全覆盖管理后台的待审核列表
```

---

### 6. portfolio_items 表

#### 现有索引
```sql
PRIMARY KEY (id)
UNIQUE KEY uk_slug (slug)
INDEX idx_status (status)
INDEX idx_featured (featured)
INDEX idx_sort_order (sort_order)
INDEX idx_published_at (published_at)
FULLTEXT INDEX ft_search (title, description)
```

#### 查询场景优化

**场景1: 首页精选作品**
```sql
-- 查询语句
SELECT * FROM portfolio_items
WHERE featured = 1 AND status = 'publish'
ORDER BY sort_order ASC, published_at DESC
LIMIT 6;

-- 建议新增复合索引
CREATE INDEX idx_featured_status_sort_published
ON portfolio_items(featured, status, sort_order, published_at DESC);

-- 评估: ✅ 完全覆盖查询和排序
-- 性能: 高效获取精选作品
```

**场景2: 技术栈筛选**
```sql
-- 查询语句
SELECT * FROM portfolio_items
WHERE status = 'publish'
  AND JSON_CONTAINS(technologies, '"React"')
ORDER BY published_at DESC;

-- 评估: ⚠️ JSON查询无法使用传统索引
-- 建议: MySQL 8.0+ 使用函数索引
CREATE INDEX idx_technologies
ON portfolio_items((CAST(technologies AS CHAR(255) ARRAY)));

-- 或者考虑使用ElasticSearch
```

---

### 7. analytics 表

#### 现有索引
```sql
PRIMARY KEY (id)
UNIQUE KEY uk_date_post (date, post_id)
INDEX idx_post (post_id)
INDEX idx_date (date)
```

#### 查询场景优化

**场景1: 文章浏览趋势**
```sql
-- 查询语句
SELECT date, SUM(views) as total_views
FROM analytics
WHERE post_id = ? AND date >= DATE_SUB(NOW(), INTERVAL 30 DAY)
GROUP BY date
ORDER BY date;

-- 现有索引: uk_date_post (date, post_id)
-- 评估: ✅ 已优化
-- 性能: 复合索引完美覆盖查询
```

**场景2: 全站访问统计**
```sql
-- 查询语句
SELECT date, SUM(views) as total_views, SUM(visitors) as total_visitors
FROM analytics
WHERE date >= DATE_SUB(NOW(), INTERVAL 7 DAY)
GROUP BY date
ORDER BY date;

-- 建议新增索引
CREATE INDEX idx_date_views ON analytics(date, views, visitors);

-- 评估: ✅ 覆盖索引，避免回表
-- 性能: 加速统计查询
```

---

## 🔧 高级索引策略

### 1. 覆盖索引设计

为常用查询创建覆盖索引，避免回表操作：

```sql
-- 文章列表查询的覆盖索引
CREATE INDEX idx_cover_post_list
ON posts(status, post_type, published_at DESC, id, title, excerpt, featured_image);

-- 评论列表的覆盖索引
CREATE INDEX idx_cover_comment_list
ON comments(post_id, status, created_at DESC, id, author_name, content);
```

### 2. 函数索引（MySQL 8.0+）

```sql
-- 不区分大小写的用户名搜索
CREATE INDEX idx_username_lower
ON users((LOWER(username)));

-- JSON数组索引
CREATE INDEX idx_portfolio_tech
ON portfolio_items((JSON_LENGTH(technologies)));
```

### 3. 前缀索引

对于长文本列，使用前缀索引节省空间：

```sql
-- URL列的前缀索引
CREATE INDEX idx_url_prefix ON posts(slug(100));

-- 内容摘要的前缀索引
CREATE INDEX idx_excerpt_prefix ON posts(excerpt(50));
```

---

## 📈 索引监控与维护

### 1. 索引使用率监控

```sql
-- 查看未使用的索引
SELECT
    object_schema,
    object_name,
    index_name
FROM performance_schema.table_io_waits_summary_by_index_usage
WHERE index_name IS NOT NULL
  AND count_star = 0
  AND object_schema = 'cyberpress'
ORDER BY object_schema, object_name;

-- 查看索引统计信息
SELECT
    table_name,
    index_name,
    cardinality,
    column_name
FROM information_schema.statistics
WHERE table_schema = 'cyberpress'
ORDER BY table_name, index_name, seq_in_index;
```

### 2. 索引重建计划

```sql
-- 分析表并重建索引
ANALYZE TABLE posts;
OPTIMIZE TABLE posts;

-- 定期维护（建议每月一次）
-- 对于频繁更新的表，定期执行OPTIMIZE TABLE
```

### 3. 索引大小监控

```sql
-- 查看索引大小
SELECT
    table_name,
    ROUND(((data_length + index_length) / 1024 / 1024), 2) AS 'Size (MB)',
    ROUND((index_length / 1024 / 1024), 2) AS 'Index Size (MB)'
FROM information_schema.tables
WHERE table_schema = 'cyberpress'
ORDER BY (data_length + index_length) DESC;
```

---

## ⚠️ 索引使用注意事项

### 1. 避免过度索引

每增加一个索引，INSERT/UPDATE/DELETE性能会下降。建议：
- 单表索引数量不超过5个（主键除外）
- 复合索引列数不超过3-4个
- 定期清理未使用的索引

### 2. 复合索引列顺序

遵循"最左前缀"原则：
```sql
-- 好的设计
CREATE INDEX idx_a_b_c ON table(a, b, c);

-- 可以使用: WHERE a = ?, WHERE a = ? AND b = ?, WHERE a = ? AND b = ? AND c = ?
-- 不能使用: WHERE b = ?, WHERE c = ?, WHERE b = ? AND c = ?
```

### 3. ORDER BY 优化

确保索引列顺序与ORDER BY一致：
```sql
-- 查询
SELECT * FROM posts ORDER BY published_at DESC, created_at DESC;

-- 索引
CREATE INDEX idx_order ON posts(published_at DESC, created_at DESC);
```

### 4. LIKE 查询优化

```sql
-- 可以使用索引
WHERE column LIKE 'prefix%'

-- 无法使用索引
WHERE column LIKE '%keyword%'
WHERE column LIKE '%suffix'
```

---

## 🎯 索引性能基准

### 预期查询性能

| 查询类型 | 无索引 | 有索引 | 提升倍数 |
|---------|--------|--------|----------|
| 主键查询 | O(n) | O(log n) | 100x+ |
| 唯一键查询 | O(n) | O(log n) | 100x+ |
| 范围查询 | O(n) | O(log n + k) | 50x+ |
| 排序查询 | O(n log n) | O(log n) | 20x+ |
| JOIN查询 | O(n*m) | O(n*log m) | 30x+ |

### 索引大小估算

```
单列索引大小 ≈ 列长度 × 行数 × 1.2（索引开销）
复合索引大小 ≈ 各列长度之和 × 行数 × 1.2

示例：posts表（50,000行）
- id (BIGINT): 8 bytes × 50,000 × 1.2 ≈ 480 KB
- slug (VARCHAR 500): 平均100 × 50,000 × 1.2 ≈ 6 MB
- 复合索引 (author, status, published): 8 + 4 + 8 = 20 × 50,000 × 1.2 ≈ 1.2 MB
```

---

## 📋 索引维护计划

### 每日任务
- 监控慢查询日志
- 检查索引使用率

### 每周任务
- 分析表碎片化情况
- 更新索引统计信息

### 每月任务
- 运行OPTIMIZE TABLE
- 清理未使用的索引
- 评估新索引需求

### 每季度任务
- 全面索引性能审查
- 根据查询模式调整索引
- 索引容量规划

---

**文档版本**: 1.0
**创建时间**: 2026-03-02
**适用数据库**: MySQL 8.0+, PostgreSQL 15+
