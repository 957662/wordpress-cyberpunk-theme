# CyberPress Platform - Entity Relationship Diagram

## 数据库 ER 图

```
┌─────────────────┐
│     users       │
├─────────────────┤
│ id (PK)         │───┐
│ username        │   │
│ email           │   │
│ password_hash   │   │
│ display_name    │   │
│ role            │   │
│ status          │   │
│ created_at      │   │
└─────────────────┘   │
                      │
                      │
                      ▼
              ┌─────────────────┐       ┌──────────────────┐
              │     posts       │       │    portfolios    │
              ├─────────────────┤       ├──────────────────┤
              │ id (PK)         │       │ id (PK)          │
              │ author_id (FK)  │◄──────│ author_id (FK)   │
              │ title           │       │ title            │
              │ slug            │       │ slug             │
              │ content         │       │ description      │
              │ status          │       │ project_url      │
              │ view_count      │       │ github_url       │
              │ like_count      │       │ technologies     │
              └─────────────────┘       └──────────────────┘
                      │
                      │
        ┌─────────────┼─────────────┐
        │             │             │
        ▼             ▼             ▼
┌──────────────┐ ┌──────────┐ ┌────────────┐
│post_categories│ │post_tags │ │  comments  │
├──────────────┤ ├──────────┤ ├────────────┤
│post_id (FK)  │ │post_id   │ │id (PK)     │
│category_id   │ │tag_id    │ │post_id (FK)│
│(FK)          │ │(FK)      │ │author_id   │
└──────────────┘ └──────────┘ │parent_id   │
                                 │content    │
                                 │status     │
                                 └────────────┘

┌─────────────┐       ┌─────────────┐       ┌─────────────┐
│ categories  │       │    tags     │       │   media     │
├─────────────┤       ├─────────────┤       ├─────────────┤
│ id (PK)     │       │ id (PK)     │       │ id (PK)     │
│ name        │       │ name        │       │ file_name   │
│ slug        │       │ slug        │       │ file_url    │
│ parent_id   │       │ usage_count │       │ file_type   │
│ color       │       │ color       │       │ uploader_id │
└─────────────┘       └─────────────┘       └─────────────┘

┌─────────────┐       ┌─────────────┐       ┌─────────────┐
│ analytics   │       │search_logs  │       │notifications│
├─────────────┤       ├─────────────┤       ├─────────────┤
│ id (PK)     │       │ id (PK)     │       │ id (PK)     │
│ post_id     │       │ query       │       │ user_id     │
│ user_id     │       │ results     │       │ type        │
│ session_id  │       │ created_at  │       │ is_read     │
│ ip_address  │       └─────────────┘       │ created_at  │
└─────────────┘                               └─────────────┘

┌─────────────────┐
│  reading_list   │
├─────────────────┤
│ id (PK)         │
│ user_id (FK)    │
│ post_id (FK)    │
│ is_read         │
│ is_favorite     │
│ progress_percent│
└─────────────────┘
```

## 表关系说明

### 1. 核心实体关系

#### users → posts (一对多)
- 一个用户可以写多篇文章
- 关系: `posts.author_id → users.id`

#### users → portfolios (一对多)
- 一个用户可以有多个作品项目
- 关系: `portfolios.author_id → users.id`

#### users → comments (一对多)
- 一个用户可以发表多条评论
- 关系: `comments.author_id → users.id`

#### users → media (一对多)
- 一个用户可以上传多个媒体文件
- 关系: `media.uploader_id → users.id`

### 2. 内容组织关系

#### posts ↔ categories (多对多)
- 一篇文章可以属于多个分类
- 一个分类可以包含多篇文章
- 通过 `post_categories` 表关联

#### posts ↔ tags (多对多)
- 一篇文章可以有多个标签
- 一个标签可以用于多篇文章
- 通过 `post_tags` 表关联

#### categories → categories (自引用一对多)
- 分类可以有子分类
- 关系: `categories.parent_id → categories.id`

### 3. 评论关系

#### comments → posts (多对一)
- 多条评论属于一篇文章
- 关系: `comments.post_id → posts.id`

#### comments → comments (自引用一对多)
- 评论可以有回复（嵌套评论）
- 关系: `comments.parent_id → comments.id`

### 4. 统计和分析关系

#### posts → analytics (一对多)
- 一篇文章可以有多条访问记录
- 关系: `analytics.post_id → posts.id`

#### posts → reading_list (一对多)
- 一篇文章可以被多个用户添加到阅读列表
- 关系: `reading_list.post_id → posts.id`

#### users → reading_list (一对多)
- 一个用户可以有多篇文章在阅读列表中
- 关系: `reading_list.user_id → users.id`

### 5. 通知关系

#### users → notifications (一对多)
- 一个用户可以接收多条通知
- 关系: `notifications.user_id → users.id`

## 索引策略

### 主要索引

1. **用户表索引**
   - `idx_users_email` - 邮箱登录
   - `idx_users_username` - 用户名查询
   - `idx_users_status` - 按状态筛选

2. **文章表索引**
   - `idx_posts_slug` - URL 查询
   - `idx_posts_author_id` - 作者文章列表
   - `idx_posts_published_at` - 按发布时间排序
   - `idx_posts_title_gin` - 全文搜索

3. **评论表索引**
   - `idx_comments_post_id` - 文章评论列表
   - `idx_comments_status` - 审核状态筛选

### 全文搜索索引

```sql
-- 文章标题全文搜索
CREATE INDEX idx_posts_title_gin ON posts 
USING gin(to_tsvector('english', title));

-- 文章内容全文搜索
CREATE INDEX idx_posts_content_gin ON posts 
USING gin(to_tsvector('english', content));

-- 搜索日志全文搜索
CREATE INDEX idx_search_logs_query_gin ON search_logs 
USING gin(to_tsvector('english', query));
```

## 数据流图

### 文章发布流程

```
┌────────┐
│ User   │
└────┬───┘
     │ creates
     ▼
┌────────┐
│  Post  │────┐
└────┬───┘    │
     │        │ relates to
     │        ▼
     │   ┌──────────┐
     │   │Category  │
     │   └──────────┘
     │
     │ generates
     ▼
┌──────────┐
│Analytics │
└──────────┘
```

### 评论流程

```
┌────────┐       ┌────────┐
│ Visitor│───────│ Comment│
└────────┘       └────┬───┘
                      │ on
                      ▼
                   ┌────────┐
                   │  Post  │
                   └────────┘
```

## 规范化设计

### 第一范式 (1NF)
- 所有字段都是原子值
- 没有重复组

### 第二范式 (2NF)
- 所有非主键字段完全依赖于主键
- 消除了部分依赖

### 第三范式 (3NF)
- 所有非主键字段直接依赖于主键
- 消除了传递依赖

### 反规范化优化

为了提高查询性能，在某些表中进行了适度的反规范化：

1. **posts 表**
   - `view_count` - 浏览计数（避免频繁 join）
   - `like_count` - 点赞计数

2. **categories 表**
   - `usage_count` - 使用计数（快速统计）

3. **tags 表**
   - `usage_count` - 使用计数（快速统计）

## 扩展性设计

### 1. JSONB 字段
多个表包含 `metadata` 字段（JSONB 类型），用于存储灵活的扩展数据：

- `users.metadata` - 用户偏好设置
- `posts.metadata` - 文章自定义字段
- `portfolios.metadata` - 项目元数据

### 2. 多态关联
通过 JSONB 字段实现灵活的关联关系：

- `notifications` - 支持多种通知类型
- `analytics` - 支持不同类型的统计数据

### 3. 分区策略（未来扩展）

对于大型表，可以考虑按时间分区：

```sql
-- analytics 表按月分区
CREATE TABLE analytics (
    id BIGSERIAL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) PARTITION BY RANGE (created_at);

CREATE TABLE analytics_2026_03 PARTITION OF analytics
FOR VALUES FROM ('2026-03-01') TO ('2026-04-01');
```

## 安全考虑

### 1. 外键约束
- 确保数据完整性
- 防止孤儿记录

### 2. 级联删除
- `ON DELETE CASCADE` - 删除用户时删除其内容
- `ON DELETE SET NULL` - 保留内容但移除用户关联

### 3. 触发器
- 自动更新 `updated_at` 字段
- 自动更新统计计数

### 4. 权限控制

```sql
-- 只读用户
GRANT SELECT ON ALL TABLES TO cyberpress_read;

-- 读写用户
GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES TO cyberpress_write;
```

## 性能优化建议

### 1. 定期维护

```sql
-- 定期分析表
ANALYZE;

-- 定期清理死元组
VACUUM;

-- 完全清理并分析
VACUUM ANALYZE;
```

### 2. 索引维护

```bash
# 使用提供的优化脚本
./scripts/optimize-db.sh
```

### 3. 查询优化

- 使用 EXPLAIN ANALYZE 分析慢查询
- 为常用查询创建合适的索引
- 避免全表扫描

### 4. 连接池配置

建议使用 PgBouncer 或类似的连接池工具：

```ini
[pgbouncer]
pool_mode = transaction
max_client_conn = 1000
default_pool_size = 50
```

## 备份和恢复

### 备份

```bash
# 完整备份
./scripts/backup-db.sh

# 指定备份目录
BACKUP_DIR=/path/to/backups ./scripts/backup-db.sh
```

### 恢复

```bash
# 列出可用备份
./scripts/restore-db-simple.sh --list

# 恢复最新备份
./scripts/restore-db-simple.sh /var/backups/postgresql/cyberpress_20260303.sql.gz
```

---

**文档版本:** 1.0.0  
**最后更新:** 2026-03-03  
**作者:** AI Database Architect
