# 🚀 CyberPress Platform - 数据库快速启动指南

> 完整的 PostgreSQL 数据库管理和使用指南

---

## 📋 目录

1. [快速开始](#快速开始)
2. [数据库初始化](#数据库初始化)
3. [性能优化](#性能优化)
4. [备份和恢复](#备份和恢复)
5. [监控和维护](#监控和维护)
6. [数据迁移](#数据迁移)
7. [常见问题](#常见问题)

---

## 🚀 快速开始

### 前置要求

```bash
# 检查 PostgreSQL 版本
psql --version  # 需要 PostgreSQL 15+

# 检查安装的扩展
psql -l | grep postgres
```

### 环境配置

创建 `.env` 文件：

```bash
# 数据库连接
DB_NAME=cyberpress
DB_USER=postgres
DB_PASSWORD=your_secure_password
DB_HOST=localhost
DB_PORT=5432

# 备份配置
BACKUP_DIR=/var/backups/postgresql
DAYS_TO_KEEP=7

# 监控配置
SLOW_QUERY_THRESHOLD=5
MAX_CONNECTIONS_WARNING=80
```

### 快速初始化（5分钟）

```bash
# 1. 进入数据库目录
cd backend/database

# 2. 运行初始化脚本
psql -U postgres -d postgres -f scripts/01-init-database.sql

# 3. 应用性能优化
psql -U postgres -d cyberpress -f scripts/02-performance-optimization.sql

# 4. 验证安装
psql -U postgres -d cyberpress -c "\dt"
```

---

## 🗄️ 数据库初始化

### 完整初始化

```bash
# 使用初始化脚本
./scripts/init-database.sh

# 或手动执行
psql -U postgres -d postgres -f scripts/01-init-database.sql
```

### 初始化内容

初始化脚本会创建：

- **17 个核心表**
  - users（用户表）
  - posts（文章表）
  - comments（评论表）
  - categories（分类表）
  - tags（标签表）
  - media（媒体表）
  - portfolios（作品集表）
  - 等等...

- **50+ 个索引**
  - 主键索引
  - 外键索引
  - 唯一索引
  - 全文搜索索引
  - 复合索引

- **10+ 个触发器**
  - 自动更新时间戳
  - 自动计数更新
  - 数据完整性检查

- **默认数据**
  - 管理员账户：`admin` / `admin123`
  - 默认分类：Technology, Programming, Design, Cyberpunk
  - 默认标签：JavaScript, Python, React, etc.

### 验证安装

```sql
-- 查看所有表
\dt

-- 查看表结构
\d users

-- 查看索引
\di

-- 查看函数
\df

-- 测试查询
SELECT COUNT(*) FROM users;
SELECT * FROM categories;
```

---

## ⚡ 性能优化

### 自动优化

```bash
# 应用所有性能优化
psql -U postgres -d cyberpress -f scripts/02-performance-optimization.sql
```

### 优化内容

#### 1. 高级索引

```sql
-- 复合索引
CREATE INDEX idx_posts_author_status_published
    ON posts(author_id, status, published_at DESC)
    WHERE status = 'publish';

-- 部分索引
CREATE INDEX idx_posts_published
    ON posts(published_at DESC)
    WHERE status = 'publish';

-- 表达式索引
CREATE INDEX idx_users_email_lower
    ON users(LOWER(email));

-- JSONB 索引
CREATE INDEX idx_posts_meta_gin
    ON posts USING gin(meta);
```

#### 2. 物化视图

```sql
-- 刷新物化视图
REFRESH MATERIALIZED VIEW CONCURRENTLY mv_daily_stats;
REFRESH MATERIALIZED VIEW CONCURRENTLY mv_user_stats;

-- 查询物化视图
SELECT * FROM v_popular_posts LIMIT 10;
```

#### 3. 性能函数

```sql
-- 获取文章列表（带分页）
SELECT * FROM get_posts_with_pagination(1, 10, 'publish');

-- 更新浏览量
SELECT increment_post_views(123);

-- 获取用户统计数据
SELECT * FROM get_user_dashboard_stats(1);
```

#### 4. 数据库配置

编辑 `postgresql.conf`：

```ini
# 内存配置
shared_buffers = 256MB
effective_cache_size = 1GB
work_mem = 4MB

# 检查点配置
checkpoint_completion_target = 0.9
wal_buffers = 16MB

# 查询优化
random_page_cost = 1.1  # SSD
effective_io_concurrency = 200
```

---

## 💾 备份和恢复

### 自动备份

```bash
# 使备份脚本可执行
chmod +x scripts/03-database-backup.sh

# 执行完整备份
./scripts/03-database-backup.sh --backup

# 执行日备份
./scripts/03-database-backup.sh --daily

# 执行周备份
./scripts/03-database-backup.sh --weekly
```

### 定时备份

```bash
# 编辑 crontab
crontab -e

# 添加定时任务
# 每天凌晨 2 点执行备份
0 2 * * * /path/to/scripts/03-database-backup.sh --daily

# 每周日凌晨 3 点执行备份
0 3 * * 0 /path/to/scripts/03-database-backup.sh --weekly

# 每月 1 号凌晨 4 点执行备份
0 4 1 * * /path/to/scripts/03-database-backup.sh --monthly
```

### 手动备份

```bash
# 完整备份
pg_dump -U postgres -d cyberpress > backup.sql

# 压缩备份
pg_dump -U postgres -d cyberpress | gzip > backup.sql.gz

# 仅备份结构
pg_dump -U postgres -d cyberpress --schema-only > schema.sql

# 备份特定表
pg_dump -U postgres -d cyberpress -t users -t posts > tables.sql
```

### 恢复数据库

```bash
# 使用脚本恢复
./scripts/03-database-backup.sh --restore /path/to/backup.sql.gz

# 手动恢复
psql -U postgres -d cyberpress < backup.sql

# 恢复压缩备份
gunzip -c backup.sql.gz | psql -U postgres -d cyberpress
```

---

## 📊 监控和维护

### 实时监控

```bash
# 使监控脚本可执行
chmod +x scripts/04-database-monitor.sh

# 执行完整监控
./scripts/04-database-monitor.sh --all

# 监控连接数
./scripts/04-database-monitor.sh --connections

# 监控慢查询
./scripts/04-database-monitor.sh --slow-queries

# 生成监控报告
./scripts/04-database-monitor.sh --report
```

### 定期维护

```bash
# 1. 更新统计信息
psql -U postgres -d cyberpress -c "ANALYZE;"

# 2. 清理死元组
psql -U postgres -d cyberpress -c "VACUUM;"

# 3. 完整清理
psql -U postgres -d cyberpress -c "VACUUM FULL;"

# 4. 重建索引
psql -U postgres -d cyberpress -c "REINDEX DATABASE cyberpress;"
```

### 性能查询

```sql
-- 查看慢查询
SELECT query, calls, mean_time, max_time
FROM pg_stat_statements
ORDER BY mean_time DESC
LIMIT 10;

-- 查看表大小
SELECT
    tablename,
    pg_size_pretty(pg_total_relation_size(tablename::regclass)) as size
FROM pg_tables
WHERE schemaname = 'public'
ORDER BY pg_total_relation_size(tablename::regclass) DESC;

-- 查看缓存命中率
SELECT
    sum(heap_blks_hit) / (sum(heap_blks_hit) + sum(heap_blks_read)) * 100
    as cache_hit_ratio
FROM pg_statio_user_tables;

-- 查看锁等待
SELECT * FROM pg_stat_activity WHERE wait_event_type = 'Lock';
```

---

## 🔄 数据迁移

### 执行迁移

```bash
# 应用所有迁移
psql -U postgres -d cyberpress -f scripts/05-data-migration.sql

# 查看迁移历史
psql -U postgres -d cyberpress -c "SELECT * FROM schema_migrations ORDER BY applied_at;"
```

### 迁移内容

| 版本 | 描述 |
|------|------|
| 001 | 初始数据库架构 |
| 002 | 全文搜索优化 |
| 003 | 用户偏好设置 |
| 004 | 性能监控表 |
| 005 | 文章表优化 |
| 006 | 活动日志 |
| 007 | 评论系统优化 |
| 008 | 标签云统计 |
| 009 | 用户关系系统 |
| 010 | 内容版本控制 |

### 自定义迁移

```sql
-- 1. 创建迁移函数
CREATE OR REPLACE FUNCTION migration_011_new_feature()
RETURNS VOID AS $$
BEGIN
    -- 检查是否已应用
    IF is_migration_applied('011_new_feature') THEN
        RAISE NOTICE 'Migration already applied';
        RETURN;
    END IF;

    -- 执行迁移操作
    ALTER TABLE posts ADD COLUMN new_field VARCHAR(255);

    -- 记录迁移
    INSERT INTO schema_migrations (version, description, applied_at)
    VALUES ('011_new_feature', 'Add new field to posts', CURRENT_TIMESTAMP);
END;
$$ LANGUAGE plpgsql;

-- 2. 执行迁移
SELECT migration_011_new_feature();
```

---

## 🔧 常见问题

### 连接问题

```bash
# 检查 PostgreSQL 是否运行
sudo systemctl status postgresql

# 检查连接
psql -U postgres -h localhost -p 5432 -d cyberpress

# 查看连接数
psql -U postgres -d cyberpress -c "SELECT count(*) FROM pg_stat_activity;"
```

### 性能问题

```sql
-- 查看慢查询
SELECT * FROM pg_stat_statements ORDER BY mean_time DESC LIMIT 10;

-- 查看锁等待
SELECT * FROM pg_stat_activity WHERE wait_event IS NOT NULL;

-- 查看表膨胀
SELECT
    schemaname, relname,
    n_dead_tup, n_live_tup,
    round(100 * n_dead_tup / (n_live_tup + n_dead_tup), 2) as dead_ratio
FROM pg_stat_user_tables
ORDER BY dead_ratio DESC;
```

### 磁盘空间

```bash
# 查看数据库大小
psql -U postgres -d cyberpress -c "SELECT pg_size_pretty(pg_database_size('cyberpress'));"

# 查看表大小
psql -U postgres -d cyberpress -c "
SELECT
    tablename,
    pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename)) as size
FROM pg_tables
WHERE schemaname = 'public'
ORDER BY pg_total_relation_size(schemaname||'.'||tablename) DESC;
"

# 清理磁盘空间
VACUUM FULL;
REINDEX DATABASE cyberpress;
```

---

## 📚 参考资源

### 官方文档

- [PostgreSQL 文档](https://www.postgresql.org/docs/)
- [pg_stat_statements](https://www.postgresql.org/docs/current/pgstatstatements.html)
- [pg_trgm (全文搜索)](https://www.postgresql.org/docs/current/pgtrgm.html)

### 项目文档

- [ER 图](./schema/01-er-diagram.md)
- [API 文档](../../API_DOCUMENTATION.md)
- [开发指南](../../DEVELOPMENT_TASKS.md)

---

## 🎯 最佳实践

### 1. 定期备份

```bash
# 每日自动备份
0 2 * * * /path/to/scripts/03-database-backup.sh --daily
```

### 2. 监控性能

```bash
# 每小时性能检查
0 * * * * /path/to/scripts/04-database-monitor.sh --all
```

### 3. 定期维护

```sql
-- 每周执行
VACUUM ANALYZE;

-- 每月执行
REINDEX DATABASE cyberpress;
```

### 4. 安全建议

- 使用强密码
- 限制网络访问
- 定期更新 PostgreSQL
- 启用 SSL 连接
- 定期审计权限

---

## 📞 支持

如有问题，请查看：
- 项目文档
- PostgreSQL 官方文档
- GitHub Issues

---

**创建日期:** 2026-03-06
**版本:** 1.0.0
**维护者:** AI Development Team
