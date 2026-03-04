# CyberPress Platform - 数据库文档

## 📚 目录

- [概述](#概述)
- [快速开始](#快速开始)
- [数据库架构](#数据库架构)
- [表结构说明](#表结构说明)
- [索引设计](#索引设计)
- [性能优化](#性能优化)
- [备份与恢复](#备份与恢复)
- [维护任务](#维护任务)
- [安全建议](#安全建议)

---

## 概述

CyberPress Platform 使用 PostgreSQL 作为主数据库，采用模块化设计，分为以下几个主要功能模块：

### 核心模块

1. **用户系统** - 用户管理、资料、设置
2. **内容管理** - 文章、分类、标签、媒体
3. **评论系统** - 评论、点赞、嵌套回复
4. **社交功能** - 关注、动态、通知、消息
5. **分析统计** - 页面浏览、用户行为、性能监控
6. **认证授权** - API令牌、OAuth、权限管理

### 技术栈

- **数据库**: PostgreSQL 15+
- **扩展**: uuid-ossp, pg_trgm, btree_gin, btree_gist
- **连接池**: PgBouncer (生产环境)
- **备份**: pg_dump, WAL归档

---

## 快速开始

### 1. 安装 PostgreSQL

```bash
# Ubuntu/Debian
sudo apt-get install postgresql-15 postgresql-contrib-15

# macOS
brew install postgresql@15

# Windows
# 下载安装程序: https://www.postgresql.org/download/windows/
```

### 2. 创建数据库

```bash
# 切换到 postgres 用户
sudo -u postgres psql

# 创建数据库和用户
CREATE DATABASE cyberpress_platform;
CREATE USER cyberpress_app WITH PASSWORD 'secure_password_here';
GRANT ALL PRIVILEGES ON DATABASE cyberpress_platform TO cyberpress_app;
\q
```

### 3. 初始化数据库

```bash
# 进入数据库目录
cd backend/database

# 方式1: 使用初始化脚本
psql -U postgres -d cyberpress_platform -f init/01-init-database.sql

# 方式2: 分别执行各个模块
psql -U postgres -d cyberpress_platform -f schema/01-core-schema.sql
psql -U postgres -d cyberpress_platform -f schema/02-social-schema.sql
psql -U postgres -d cyberpress_platform -f schema/03-analytics-schema.sql
psql -U postgres -d cyberpress_platform -f schema/04-auth-schema.sql
psql -U postgres -d cyberpress_platform -f indexes/performance-indexes.sql

# 插入示例数据（可选）
psql -U postgres -d cyberpress_platform -f init/02-seed-data.sql
```

### 4. 验证安装

```bash
psql -U postgres -d cyberpress_platform -c "\dt"
```

应该看到所有已创建的表。

---

## 数据库架构

### ER 图

详细的实体关系图请参考: [er-diagram.md](er-diagram.md)

### 核心表关系

```
users (1) ──< (1) user_profiles
users (1) ──< (1) user_settings
users (1) ──< (N) posts
users (1) ──< (N) comments
users (1) ──< (N) user_follows

posts (1) ──< (N) post_meta
posts (M) ──> (N) categories
posts (M) ──> (N) tags

comments (1) ──< (N) comment_likes
```

---

## 表结构说明

### 用户系统表

#### users
用户主表，存储核心用户信息。

| 字段 | 类型 | 说明 |
|------|------|------|
| id | BIGSERIAL | 主键 |
| email | VARCHAR(255) | 邮箱（唯一） |
| username | VARCHAR(100) | 用户名（唯一） |
| password_hash | VARCHAR(255) | 密码哈希 |
| role | VARCHAR(50) | 角色：admin, editor, author, subscriber |
| status | VARCHAR(50) | 状态：active, inactive, suspended |
| created_at | TIMESTAMPTZ | 创建时间 |
| updated_at | TIMESTAMPTZ | 更新时间 |

#### user_profiles
用户资料表（一对一）。

| 字段 | 类型 | 说明 |
|------|------|------|
| id | BIGSERIAL | 主键 |
| user_id | BIGINT | 用户ID（外键） |
| display_name | VARCHAR(255) | 显示名称 |
| bio | TEXT | 个人简介 |
| avatar_url | VARCHAR(500) | 头像URL |
| followers_count | INT | 粉丝数 |
| following_count | INT | 关注数 |

#### user_settings
用户设置表（一对一）。

| 字段 | 类型 | 说明 |
|------|------|------|
| id | BIGSERIAL | 主键 |
| user_id | BIGINT | 用户ID（外键） |
| theme | VARCHAR(20) | 主题：dark, light |
| language | VARCHAR(10) | 语言 |
| timezone | VARCHAR(50) | 时区 |
| email_notifications | BOOLEAN | 邮件通知开关 |

### 内容管理表

#### posts
文章主表。

| 字段 | 类型 | 说明 |
|------|------|------|
| id | BIGSERIAL | 主键 |
| author_id | BIGINT | 作者ID |
| title | VARCHAR(500) | 标题 |
| slug | VARCHAR(500) | URL slug（唯一） |
| content | TEXT | 内容 |
| status | VARCHAR(50) | 状态：draft, publish, pending |
| featured | BOOLEAN | 是否精选 |
| view_count | INT | 浏览数 |
| like_count | INT | 点赞数 |
| comment_count | INT | 评论数 |
| published_at | TIMESTAMPTZ | 发布时间 |

#### categories
分类表（树形结构）。

| 字段 | 类型 | 说明 |
|------|------|------|
| id | BIGSERIAL | 主键 |
| parent_id | BIGINT | 父分类ID |
| name | VARCHAR(255) | 分类名称 |
| slug | VARCHAR(255) | URL slug（唯一） |
| post_count | INT | 文章数 |

#### tags
标签表。

| 字段 | 类型 | 说明 |
|------|------|------|
| id | BIGSERIAL | 主键 |
| name | VARCHAR(255) | 标签名称 |
| slug | VARCHAR(255) | URL slug（唯一） |
| post_count | INT | 文章数 |

#### post_categories
文章分类关联表（多对多）。

#### post_tags
文章标签关联表（多对多）。

### 评论系统表

#### comments
评论表（支持嵌套）。

| 字段 | 类型 | 说明 |
|------|------|------|
| id | BIGSERIAL | 主键 |
| post_id | BIGINT | 文章ID |
| author_id | BIGINT | 作者ID |
| parent_id | BIGINT | 父评论ID |
| content | TEXT | 评论内容 |
| status | VARCHAR(50) | 状态：pending, approved, spam |
| like_count | INT | 点赞数 |

#### comment_likes
评论点赞表。

### 社交功能表

#### user_follows
用户关注关系表。

| 字段 | 类型 | 说明 |
|------|------|------|
| id | BIGSERIAL | 主键 |
| follower_id | BIGINT | 关注者ID |
| following_id | BIGINT | 被关注者ID |
| status | VARCHAR(50) | 状态：active, blocked |

#### activities
用户动态表。

| 字段 | 类型 | 说明 |
|------|------|------|
| id | BIGSERIAL | 主键 |
| user_id | BIGINT | 用户ID |
| type | VARCHAR(100) | 动态类型 |
| content | TEXT | 内容 |
| visibility | VARCHAR(50) | 可见性 |

#### notifications
通知表。

| 字段 | 类型 | 说明 |
|------|------|------|
| id | BIGSERIAL | 主键 |
| user_id | BIGINT | 接收者ID |
| type | VARCHAR(100) | 通知类型 |
| title | VARCHAR(500) | 标题 |
| message | TEXT | 消息内容 |
| is_read | BOOLEAN | 是否已读 |

### 分析统计表

#### analytics_events
通用分析事件表。

#### page_views
页面浏览记录表（按月分区）。

#### sessions
用户会话表。

#### post_statistics
文章统计表（每日）。

#### user_statistics
用户统计表（每日）。

### 认证授权表

#### api_tokens
API访问令牌表。

#### refresh_tokens
刷新令牌表。

#### roles
角色表。

#### permissions
权限表。

#### user_roles
用户角色关联表。

---

## 索引设计

### 主键索引
所有表的 `id` 字段自动创建主键索引。

### 唯一索引
- `users.email`, `users.username`
- `posts.slug`
- `categories.slug`, `tags.slug`
- `api_tokens.token`

### 性能索引
详见 [indexes/performance-indexes.sql](indexes/performance-indexes.sql)

主要性能索引：
- 文章查询：`idx_posts_author_list`, `idx_posts_featured_articles`
- 评论查询：`idx_comments_post_approved`
- 全文搜索：`idx_posts_fulltext_chinese`
- 社交功能：`idx_user_follows_following_list`

### 全文搜索索引
使用 PostgreSQL 的 gin 索引支持全文搜索：

```sql
CREATE INDEX idx_posts_fulltext
ON posts USING gin(to_tsvector('chinese', title || ' ' || content));
```

---

## 性能优化

### 查询优化

1. **使用 EXPLAIN ANALYZE**
```sql
EXPLAIN ANALYZE
SELECT * FROM posts WHERE status = 'publish' ORDER BY published_at DESC LIMIT 10;
```

2. **避免 SELECT ***
```sql
-- 好的做法
SELECT id, title, slug, author_id FROM posts WHERE status = 'publish';

-- 避免
SELECT * FROM posts WHERE status = 'publish';
```

3. **使用 LIMIT**
```sql
SELECT * FROM posts ORDER BY published_at DESC LIMIT 20;
```

4. **批量操作**
```sql
-- 批量插入
INSERT INTO posts (title, content) VALUES
    ('Title 1', 'Content 1'),
    ('Title 2', 'Content 2'),
    ('Title 3', 'Content 3');
```

### 连接池配置

使用 PgBouncer 进行连接池管理：

```ini
[databases]
cyberpress_platform = host=localhost port=5432 dbname=cyberpress_platform

[pgbouncer]
pool_mode = transaction
max_client_conn = 1000
default_pool_size = 100
server_idle_timeout = 600
```

### 缓存策略

1. **应用层缓存** - Redis
2. **查询缓存** - PostgreSQL 内置
3. **物化视图** - 复杂统计查询

### 分区表

`page_views` 表按月分区，提高查询性能和数据管理：

```sql
CREATE TABLE page_views_2026_03 PARTITION OF page_views
FOR VALUES FROM ('2026-03-01') TO ('2026-04-01');
```

---

## 备份与恢复

### 备份

#### 逻辑备份（pg_dump）

```bash
# 完整备份
pg_dump -U postgres -d cyberpress_platform -F c -f backup_$(date +%Y%m%d).dump

# 仅备份结构
pg_dump -U postgres -d cyberpress_platform --schema-only -f schema_$(date +%Y%m%d).sql

# 仅备份数据
pg_dump -U postgres -d cyberpress_platform --data-only -f data_$(date +%Y%m%d).sql

# 备份特定表
pg_dump -U postgres -d cyberpress_platform -t posts -t users -f tables_backup.sql
```

#### 物理备份（pg_basebackup）

```bash
pg_basebackup -U postgres -D /var/lib/postgresql/backup -Ft -z -P
```

### 恢复

```bash
# 从逻辑备份恢复
pg_restore -U postgres -d cyberpress_platform backup_20260305.dump

# 从 SQL 文件恢复
psql -U postgres -d cyberpress_platform < backup.sql
```

### 自动化备份脚本

```bash
#!/bin/bash
# backup.sh

BACKUP_DIR="/var/backups/postgresql"
DATE=$(date +%Y%m%d_%H%M%S)
DATABASE="cyberpress_platform"

mkdir -p $BACKUP_DIR

pg_dump -U postgres -d $DATABASE -F c -f $BACKUP_DIR/${DATABASE}_${DATE}.dump

# 保留最近30天的备份
find $BACKUP_DIR -name "${DATABASE}_*.dump" -mtime +30 -delete
```

添加到 crontab：

```bash
# 每天凌晨2点备份
0 2 * * * /path/to/backup.sh
```

---

## 维护任务

### 日常维护

```sql
-- 1. 更新统计信息
ANALYZE;

-- 2. 清理死元组
VACUUM;

-- 3. 完全清理
VACUUM FULL ANALYZE;

-- 4. 重建索引
REINDEX DATABASE cyberpress_platform;
```

### 定期任务

#### 1. 清理旧数据

```sql
-- 删除90天前的审计日志
DELETE FROM audit_logs WHERE created_at < CURRENT_DATE - INTERVAL '90 days';

-- 删除180天前的页面浏览记录
DELETE FROM page_views WHERE created_at < CURRENT_DATE - INTERVAL '180 days';
```

#### 2. 归档数据

```sql
-- 将旧文章移动到归档表
INSERT INTO posts_archive
SELECT * FROM posts WHERE published_at < CURRENT_DATE - INTERVAL '2 years';

DELETE FROM posts WHERE published_at < CURRENT_DATE - INTERVAL '2 years';
```

#### 3. 优化表

```sql
-- 优化特定表
VACUUM FULL ANALYZE posts;
VACUUM FULL ANALYZE comments;
VACUUM FULL ANALYZE users;
```

### 监控查询

```sql
-- 查看表大小
SELECT
    tablename,
    pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename)) AS size
FROM pg_tables
WHERE schemaname = 'public'
ORDER BY pg_total_relation_size(schemaname||'.'||tablename) DESC;

-- 查看索引使用情况
SELECT
    schemaname,
    tablename,
    indexname,
    idx_scan,
    pg_size_pretty(pg_relation_size(indexrelid)) AS index_size
FROM pg_stat_user_indexes
ORDER BY idx_scan ASC;

-- 查看慢查询
SELECT
    query,
    calls,
    total_time,
    mean_time
FROM pg_stat_statements
ORDER BY mean_time DESC
LIMIT 10;
```

---

## 安全建议

### 1. 密码安全

- 使用强密码
- 定期更换密码
- 使用 `bcrypt` 或 `scrypt` 哈希密码

```sql
-- 生成 bcrypt 哈希（应用层）
password_hash = bcrypt.hash(password, 10);
```

### 2. 连接安全

```bash
# 配置 pg_hba.conf
# TYPE  DATABASE        USER            ADDRESS                 METHOD
host    cyberpress_platform cyberpress_app 192.168.1.0/24      scram-sha-256
```

### 3. 权限管理

```sql
-- 创建只读用户
CREATE USER readonly_user WITH PASSWORD 'readonly_password';
GRANT CONNECT ON DATABASE cyberpress_platform TO readonly_user;
GRANT USAGE ON SCHEMA public TO readonly_user;
GRANT SELECT ON ALL TABLES IN SCHEMA public TO readonly_user;
```

### 4. SSL/TLS 加密

```bash
# postgresql.conf
ssl = on
ssl_cert_file = 'server.crt'
ssl_key_file = 'server.key'
```

### 5. 审计日志

启用审计日志记录所有敏感操作：

```sql
-- 审计日志会自动记录到 audit_logs 表
```

### 6. 防止 SQL 注入

- 使用参数化查询
- 验证所有输入
- 使用 ORM 或查询构建器

```javascript
// 好的做法（参数化）
db.query('SELECT * FROM users WHERE id = $1', [userId]);

// 避免（SQL注入风险）
db.query(`SELECT * FROM users WHERE id = ${userId}`);
```

---

## 常见问题

### Q: 如何重置数据库？

```bash
psql -U postgres -d cyberpress_platform -f init/00-drop-all.sql
psql -U postgres -d cyberpress_platform -f init/01-init-database.sql
```

### Q: 如何查看表结构？

```bash
psql -U postgres -d cyberpress_platform -c "\d posts"
```

### Q: 如何导出数据？

```bash
pg_dump -U postgres -d cyberpress_platform -t posts -t users -f export.sql
```

### Q: 数据库连接数达到上限？

```sql
-- 查看当前连接
SELECT count(*) FROM pg_stat_activity;

-- 查看最大连接数
SHOW max_connections;

-- 终止空闲连接
SELECT pg_terminate_backend(pid)
FROM pg_stat_activity
WHERE state = 'idle'
AND state_change < CURRENT_TIMESTAMP - INTERVAL '10 minutes';
```

---

## 附录

### A. 数据库配置参数

```ini
# postgresql.conf

shared_buffers = 256MB
effective_cache_size = 1GB
maintenance_work_mem = 64MB
checkpoint_completion_target = 0.9
wal_buffers = 16MB
default_statistics_target = 100
random_page_cost = 1.1
effective_io_concurrency = 200
work_mem = 2621kB
min_wal_size = 1GB
max_wal_size = 4GB
max_worker_processes = 4
max_parallel_workers_per_gather = 2
max_parallel_workers = 4
max_parallel_maintenance_workers = 2
```

### B. 有用的 SQL 查询

```sql
-- 查看数据库大小
SELECT pg_size_pretty(pg_database_size('cyberpress_platform'));

-- 查看表行数
SELECT
    schemaname,
    tablename,
    n_live_tup AS row_count
FROM pg_stat_user_tables
ORDER BY n_live_tup DESC;

-- 查看索引大小
SELECT
    tablename,
    indexname,
    pg_size_pretty(pg_relation_size(indexrelid)) AS index_size
FROM pg_stat_user_indexes
ORDER BY pg_relation_size(indexrelid) DESC;
```

---

## 📁 文件说明

### Schema 文件
- `schema/01-core-schema.sql` - 核心表结构（用户、文章、分类、标签、媒体、评论）
- `schema/02-social-schema.sql` - 社交功能表（关注、动态、通知、消息）
- `schema/03-analytics-schema.sql` - 分析统计表（事件、浏览、会话、性能）
- `schema/04-auth-schema.sql` - 认证授权表（令牌、角色、权限、审计）

### 索引文件
- `indexes/performance-indexes.sql` - 性能优化索引

### 初始化文件
- `init/00-drop-all.sql` - 删除所有表（谨慎使用）
- `init/01-init-database.sql` - 完整数据库初始化
- `init/02-seed-data.sql` - 示例数据

### 文档
- `er-diagram.md` - 实体关系图
- `README.md` - 本文档

---

**文档版本**: v1.0
**最后更新**: 2026-03-05
**维护者**: CyberPress Team
