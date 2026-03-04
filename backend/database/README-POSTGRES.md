# CyberPress Platform - PostgreSQL Database Guide

## 📋 目录

- [快速开始](#快速开始)
- [架构设计](#架构设计)
- [安装指南](#安装指南)
- [维护脚本](#维护脚本)
- [查询示例](#查询示例)
- [性能优化](#性能优化)
- [备份恢复](#备份恢复)
- [监控](#监控)

---

## 🚀 快速开始

### 前置要求

- PostgreSQL 15+ 
- Linux/MacOS/Windows
- 基本的 SQL 知识

### 一键初始化

```bash
cd backend/database
./scripts/init-db.sh
```

这将：
1. 创建数据库和用户
2. 导入数据库架构
3. 导入种子数据
4. 创建配置文件

---

## 🏗️ 架构设计

### 核心表结构

```
users (用户表)
  ├─ posts (文章表)
  │   ├─ post_categories (文章分类关系)
  │   └─ post_tags (文章标签关系)
  ├─ portfolios (作品集表)
  ├─ comments (评论表)
  └─ media (媒体库表)

categories (分类表)
tags (标签表)

analytics (统计分析表)
search_logs (搜索日志表)
notifications (通知表)
reading_list (阅读列表表)
```

### 详细设计

查看完整的 ER 图文档：
- [ER Diagram](./docs/database/ER-DIAGRAM-POSTGRES.md)

---

## 📦 安装指南

### 1. 使用 Docker (推荐)

```bash
# 启动 PostgreSQL 容器
docker run -d \
  --name cyberpress-postgres \
  -e POSTGRES_PASSWORD=postgres \
  -e POSTGRES_DB=cyberpress \
  -p 5432:5432 \
  -v postgres_data:/var/lib/postgresql/data \
  postgres:15

# 等待数据库启动
docker logs -f cyberpress-postgres

# 初始化数据库
docker exec -it cyberpress-postgres psql -U postgres -f /path/to/schema.sql
```

### 2. 手动安装

#### Ubuntu/Debian

```bash
# 安装 PostgreSQL
sudo apt update
sudo apt install postgresql-15 postgresql-contrib-15

# 启动服务
sudo systemctl start postgresql
sudo systemctl enable postgresql

# 切换到 postgres 用户
sudo -u postgres psql

# 创建数据库和用户
CREATE DATABASE cyberpress;
CREATE USER cyberpress WITH PASSWORD 'your_password';
GRANT ALL PRIVILEGES ON DATABASE cyberpress TO cyberpress;
```

#### MacOS

```bash
# 使用 Homebrew 安装
brew install postgresql@15

# 启动服务
brew services start postgresql@15

# 创建数据库
createdb cyberpress

# 初始化
psql -d cyberpress -f schema.sql
```

---

## 🛠️ 维护脚本

### 1. 数据库初始化

```bash
./scripts/init-db.sh
```

**功能:**
- 创建数据库和用户
- 导入架构
- 导入种子数据
- 创建配置文件

**环境变量:**
```bash
export DB_HOST=localhost
export DB_PORT=5432
export DB_NAME=cyberpress
export DB_USER=cyberpress
export DB_PASSWORD=your_password
```

### 2. 数据库备份

```bash
./scripts/backup-db.sh
```

**功能:**
- 完整数据库备份
- 自动压缩
- 清理旧备份
- 发送通知（可选）

**配置:**
```bash
export BACKUP_DIR=/path/to/backups
export RETENTION_DAYS=30
export SLACK_WEBHOOK_URL=https://hooks.slack.com/...
```

### 3. 数据库恢复

```bash
# 列出可用备份
./scripts/restore-db-simple.sh --list

# 恢复备份
./scripts/restore-db-simple.sh /path/to/backup.sql.gz
```

### 4. 数据库优化

```bash
./scripts/optimize-db.sh
```

**功能:**
- ANALYZE 表
- VACUUM 清理
- 重建索引
- 清理旧数据
- 更新统计信息

### 5. 数据库监控

```bash
./scripts/monitor-db.sh
```

**监控指标:**
- 数据库连接
- 表大小
- 索引使用
- 缓存命中率
- 慢查询
- 锁等待

---

## 📊 查询示例

### 常用查询

查看 [queries-examples.sql](./queries-examples.sql) 获取更多示例。

#### 获取最新文章

```sql
SELECT 
    p.title,
    p.slug,
    u.username as author,
    p.view_count,
    p.published_at
FROM posts p
JOIN users u ON p.author_id = u.id
WHERE p.status = 'published'
ORDER BY p.published_at DESC
LIMIT 10;
```

#### 搜索文章

```sql
SELECT 
    title,
    slug,
    ts_rank(to_tsvector('english', title || ' ' || content), query) as rank
FROM posts, 
     to_tsquery('english', 'Next.js') query
WHERE to_tsvector('english', title || ' ' || content) @@ query
  AND status = 'published'
ORDER BY rank DESC;
```

---

## ⚡ 性能优化

### 1. 索引策略

#### 查看索引使用情况

```sql
SELECT 
    schemaname,
    tablename,
    indexname,
    idx_scan,
    idx_tup_read
FROM pg_stat_user_indexes
WHERE idx_scan = 0
ORDER BY schemaname, tablename;
```

#### 创建索引

```sql
-- 创建 B-tree 索引
CREATE INDEX idx_posts_published_at ON posts(published_at DESC);

-- 创建 GIN 索引（全文搜索）
CREATE INDEX idx_posts_content_gin ON posts 
USING gin(to_tsvector('english', content));

-- 创建部分索引
CREATE INDEX idx_posts_published ON posts(status) 
WHERE status = 'published';
```

### 2. 查询优化

#### 使用 EXPLAIN ANALYZE

```sql
EXPLAIN ANALYZE
SELECT * FROM posts 
WHERE status = 'published' 
ORDER BY published_at DESC 
LIMIT 10;
```

#### 优化建议

- 使用 `EXPLAIN ANALYZE` 分析慢查询
- 为常用查询创建合适的索引
- 避免 `SELECT *`，只查询需要的字段
- 使用 `LIMIT` 限制结果集
- 避免 N+1 查询

### 3. 定期维护

```bash
# 每日优化
0 2 * * * /path/to/optimize-db.sh

# 每周完整备份
0 3 * * 0 /path/to/backup-db.sh
```

---

## 💾 备份恢复

### 备份策略

#### 1. 逻辑备份 (pg_dump)

```bash
# 完整备份
pg_dump -h localhost -U cyberpress -d cyberpress \
  --verbose --no-owner --no-acl \
  -F c -f /backup/cyberpress.dump

# 仅备份架构
pg_dump -h localhost -U cyberpress -d cyberpress \
  --schema-only -f /backup/schema.sql

# 仅备份数据
pg_dump -h localhost -U cyberpress -d cyberpress \
  --data-only -f /backup/data.sql
```

#### 2. 物理备份

使用 pgBackRest 或其他工具进行物理备份。

### 恢复流程

```bash
# 恢复逻辑备份
pg_restore -h localhost -U cyberpress -d cyberpress \
  --verbose --no-owner --no-acl \
  /backup/cyberpress.dump

# 或使用提供的脚本
./scripts/restore-db-simple.sh /backup/cyberpress.dump
```

---

## 📈 监控

### 关键指标

1. **连接数**
```sql
SELECT count(*) FROM pg_stat_activity;
```

2. **数据库大小**
```sql
SELECT pg_size_pretty(pg_database_size('cyberpress'));
```

3. **表大小**
```sql
SELECT 
    tablename,
    pg_size_pretty(pg_total_relation_size(tablename::regclass)) as size
FROM pg_tables 
WHERE schemaname = 'public'
ORDER BY pg_total_relation_size(tablename::regclass) DESC;
```

4. **缓存命中率**
```sql
SELECT 
    sum(heap_blks_hit) / (sum(heap_blks_hit) + sum(heap_blks_read)) * 100 
    as cache_hit_ratio
FROM pg_statio_user_tables;
```

### 监控工具

- **内置**: 使用提供的 `monitor-db.sh` 脚本
- **外部**: 
  - pgAdmin
  - Datadog
  - New Relic
  - Prometheus + Grafana

---

## 🔧 配置优化

### postgresql.conf 关键参数

```ini
# 连接设置
max_connections = 100
shared_buffers = 256MB
effective_cache_size = 1GB

# WAL 设置
wal_buffers = 16MB
checkpoint_completion_target = 0.9

# 查询优化
random_page_cost = 1.1
effective_io_concurrency = 200

# 日志
logging_collector = on
log_directory = 'log'
log_filename = 'postgresql-%Y-%m-%d_%H%M%S.log'
log_min_duration_statement = 1000
```

---

## 🛡️ 安全

### 1. 权限管理

```sql
-- 创建只读用户
CREATE USER cyberpress_read WITH PASSWORD 'readonly_password';
GRANT CONNECT ON DATABASE cyberpress TO cyberpress_read;
GRANT USAGE ON SCHEMA public TO cyberpress_read;
GRANT SELECT ON ALL TABLES IN SCHEMA public TO cyberpress_read;

-- 创建读写用户
CREATE USER cyberpress_write WITH PASSWORD 'write_password';
GRANT CONNECT ON DATABASE cyberpress TO cyberpress_write;
GRANT USAGE ON SCHEMA public TO cyberpress_write;
GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA public TO cyberpress_write;
```

### 2. 数据加密

- 启用 SSL 连接
- 使用 `pgcrypto` 扩展加密敏感数据
- 定期更新密码

### 3. 审计日志

```sql
-- 安装 pgaudit 扩展
CREATE EXTENSION pgaudit;

-- 配置审计
ALTER SYSTEM SET pgaudit.log = 'WRITE';
ALTER SYSTEM SET pgaudit.log_client = on;
```

---

## 📚 参考资料

### 官方文档

- [PostgreSQL Documentation](https://www.postgresql.org/docs/)
- [PostgreSQL Performance Tuning](https://wiki.postgresql.org/wiki/Performance_Optimization)

### 社区资源

- [Stack Overflow - PostgreSQL](https://stackoverflow.com/questions/tagged/postgresql)
- [Reddit - r/PostgreSQL](https://reddit.com/r/PostgreSQL)

### 工具

- **pgAdmin** - 图形化管理工具
- **psql** - 命令行客户端
- **pgBouncer** - 连接池
- **pgBackRest** - 备份工具

---

## ❓ 常见问题

### Q: 如何重置管理员密码？

```sql
-- 连接到数据库
psql -U postgres -d cyberpress

-- 更新密码
UPDATE users 
SET password_hash = '$2b$12$...' 
WHERE username = 'admin';
```

### Q: 如何清理日志表？

```sql
-- 删除 30 天前的日志
DELETE FROM analytics 
WHERE created_at < NOW() - INTERVAL '30 days';

DELETE FROM search_logs 
WHERE created_at < NOW() - INTERVAL '30 days';
```

### Q: 数据库连接失败怎么办？

1. 检查 PostgreSQL 是否运行：
```bash
pg_isready -h localhost -p 5432
```

2. 检查连接配置：
```bash
cat backend/.env | grep DB_
```

3. 检查防火墙设置

---

## 📞 支持

如有问题，请联系：
- Email: support@2835879683@qq.com
- GitHub Issues: [提交问题](https://github.com/your-repo/issues)

---

**版本:** 1.0.0  
**最后更新:** 2026-03-03  
**作者:** AI Database Architect
