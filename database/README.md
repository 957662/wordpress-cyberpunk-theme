# 🗄️ CyberPress Platform - Database System

> PostgreSQL 数据库完整架构和管理工具

---

## 📋 目录结构

```
database/
├── README.md                           # 本文件
├── schema/
│   ├── er-diagram.md                  # ER 图说明
│   ├── postgres-schema.sql            # 完整数据库架构
│   └── tables-reference.md            # 表结构参考
├── migrations/
│   ├── 001_initial_schema.sql         # 初始架构
│   ├── 002_social_features.sql        # 社交功能
│   ├── 003_reading_progress.sql       # 阅读进度
│   ├── 004_audit_logs.sql             # 审计日志
│   └── 005_performance_metrics.sql    # 性能指标
├── scripts/
│   ├── init-database.sh               # 初始化脚本
│   ├── backup-database.sh             # 备份脚本
│   ├── restore-database.sh            # 恢复脚本
│   ├── monitor-database.sh            # 监控脚本
│   └── migrate-database.sh            # 迁移脚本
└── tools/
    ├── db-utils.sh                    # 数据库工具集
    └── seed-data.sql                  # 种子数据
```

---

## 🚀 快速开始

### 1. 使用 Docker（推荐）

```bash
# 启动数据库服务
cd database
docker-compose -f docker-compose.db.yml up -d

# 查看日志
docker-compose -f docker-compose.db.yml logs -f postgres

# 初始化数据库
docker exec -i cyberpress-postgres psql -U postgres -d cyberpress_db < schema/postgres-schema.sql
```

### 2. 手动安装

```bash
# 安装 PostgreSQL 15+
sudo apt-get install postgresql-15 postgresql-contrib-15

# 创建数据库
sudo -u postgres createdb cyberpress_db

# 初始化架构
psql -U postgres -d cyberpress_db -f schema/postgres-schema.sql
```

### 3. 使用初始化脚本

```bash
# 使脚本可执行
chmod +x scripts/init-database.sh

# 运行初始化
./scripts/init-database.sh
```

---

## 📊 数据库架构

### 核心表

| 表名 | 说明 | 主要字段 |
|------|------|---------|
| `users` | 用户表 | id, username, email, role, status |
| `posts` | 文章表 | id, author_id, title, content, status |
| `categories` | 分类表 | id, name, slug, parent_id |
| `tags` | 标签表 | id, name, slug, color |
| `comments` | 评论表 | id, post_id, author_id, content, status |
| `media` | 媒体表 | id, file_name, file_path, mime_type |
| `portfolios` | 作品集表 | id, author_id, title, project_url |
| `pages` | 页面表 | id, title, slug, content, template |

### 社交功能表

| 表名 | 说明 | 主要字段 |
|------|------|---------|
| `likes` | 点赞表 | id, user_id, target_type, target_id |
| `bookmarks` | 收藏表 | id, user_id, post_id, folder |
| `follows` | 关注表 | id, follower_id, following_id |
| `notifications` | 通知表 | id, user_id, type, title, is_read |

### 扩展功能表

| 表名 | 说明 | 主要字段 |
|------|------|---------|
| `reading_progress` | 阅读进度 | id, user_id, post_id, progress_percent |
| `audit_logs` | 审计日志 | id, user_id, action, entity_type, entity_id |
| `settings` | 系统设置 | id, key, value, category |
| `analytics` | 统计分析 | id, post_id, user_id, session_id, duration |

### 关系表

| 表名 | 说明 | 主要字段 |
|------|------|---------|
| `post_categories` | 文章-分类关系 | post_id, category_id |
| `post_tags` | 文章-标签关系 | post_id, tag_id |

---

## 🔧 数据库工具

### 初始化数据库

```bash
./scripts/init-database.sh
```

**功能：**
- 创建数据库和用户
- 应用完整的表架构
- 创建所有索引
- 设置触发器
- 插入初始数据

### 备份数据库

```bash
# 完整备份
./scripts/backup-database.sh

# 仅备份数据
./scripts/backup-database.sh --data-only

# 仅备份结构
./scripts/backup-database.sh --schema-only
```

**备份位置：** `../backups/postgresql/`

### 恢复数据库

```bash
./scripts/restore-database.sh /path/to/backup.dump.gz
```

### 监控数据库

```bash
# 完整监控报告
./scripts/monitor-database.sh --all

# 检查慢查询
./scripts/monitor-database.sh --slow-queries

# 检查表大小
./scripts/monitor-database.sh --table-sizes

# 检查连接数
./scripts/monitor-database.sh --connections
```

### 运行迁移

```bash
# 应用所有待执行的迁移
./scripts/migrate-database.sh

# 查看迁移历史
./scripts/migrate-database.sh --history

# 创建新迁移
./scripts/migrate-database.sh --create migration_name
```

### 数据库工具集

```bash
# 使工具可执行
chmod +x tools/db-utils.sh

# 可用命令
./tools/db-utils.sh status          # 查看数据库状态
./tools/db-utils.sh size            # 查看数据库大小
./tools/db-utils.sh vacuum          # 优化数据库
./tools/db-utils.sh reindex         # 重建索引
./tools/db-utils.sh analyze         # 分析统计信息
./tools/db-utils.sh clean-backups   # 清理旧备份
```

---

## 📈 性能优化

### 索引策略

数据库包含以下类型的索引：

1. **B-tree 索引** - 用于等值查询和范围查询
2. **GIN 索引** - 用于全文搜索和 JSONB 字段
3. **部分索引** - 仅索引特定条件的数据
4. **复合索引** - 多列组合索引
5. **表达式索引** - 基于表达式的索引

### 物化视图

```sql
-- 热门文章视图
CREATE MATERIALIZED VIEW mv_popular_posts AS
SELECT p.*, u.username as author_name
FROM posts p
JOIN users u ON p.author_id = u.id
WHERE p.status = 'published'
ORDER BY p.view_count DESC;

-- 定期刷新
REFRESH MATERIALIZED VIEW CONCURRENTLY mv_popular_posts;
```

### 触发器

数据库使用触发器实现：

1. **自动更新时间戳** - `updated_at` 字段
2. **自动计数更新** - 评论数、点赞数
3. **数据完整性检查** - 外键约束、CHECK 约束
4. **审计日志** - 记录数据变更

---

## 🔐 安全建议

### 1. 连接安全

```bash
# 使用 SSL 连接
psql "host=localhost dbname=cyberpress_db user=postgres sslmode=require"

# 限制连接 IP
# 在 pg_hba.conf 中配置：
# host    cyberpress_db    postgres    192.168.1.0/24    scram-sha-256
```

### 2. 用户权限

```sql
-- 创建只读用户
CREATE USER cyberpress_readonly WITH PASSWORD 'secure_password';
GRANT CONNECT ON DATABASE cyberpress_db TO cyberpress_readonly;
GRANT USAGE ON SCHEMA public TO cyberpress_readonly;
GRANT SELECT ON ALL TABLES IN SCHEMA public TO cyberpress_readonly;

-- 创建应用用户
CREATE USER cyberpress_app WITH PASSWORD 'secure_password';
GRANT CONNECT ON DATABASE cyberpress_db TO cyberpress_app;
GRANT USAGE ON SCHEMA public TO cyberpress_app;
GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA public TO cyberpress_app;
```

### 3. 数据加密

```sql
-- 启用 pgcrypto 扩展
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- 加密敏感数据
SELECT pgp_sym_encrypt('sensitive_data', 'encryption_key');
```

---

## 📊 监控和维护

### 日常维护

```bash
# 每日任务（通过 cron 自动执行）
0 2 * * * /path/to/scripts/backup-database.sh --daily
0 3 * * * /path/to/scripts/monitor-database.sh --all
0 4 * * 0 /path/to/scripts/vacuum-database.sh

# 每周任务
0 5 * * 0 /path/to/scripts/backup-database.sh --weekly
0 6 * * 0 /path/to/tools/db-utils.sh reindex

# 每月任务
0 7 1 * * /path/to/scripts/backup-database.sh --monthly
```

### 性能监控

```sql
-- 查看慢查询
SELECT query, calls, mean_time, max_time
FROM pg_stat_statements
ORDER BY mean_time DESC
LIMIT 10;

-- 查看表膨胀
SELECT
    schemaname, relname,
    n_dead_tup, n_live_tup,
    round(100 * n_dead_tup / (n_live_tup + n_dead_tup), 2) as dead_ratio
FROM pg_stat_user_tables
ORDER BY dead_ratio DESC;

-- 查看缓存命中率
SELECT
    sum(heap_blks_hit) / (sum(heap_blks_hit) + sum(heap_blks_read)) * 100
    as cache_hit_ratio
FROM pg_statio_user_tables;
```

---

## 🧪 测试数据

### 加载种子数据

```bash
psql -U postgres -d cyberpress_db -f tools/seed-data.sql
```

**种子数据包含：**
- 10 个测试用户
- 50 篇测试文章
- 20 个分类
- 50 个标签
- 200 条评论
- 示例媒体文件
- 示例作品集

---

## 🐛 故障排除

### 连接问题

```bash
# 检查 PostgreSQL 是否运行
sudo systemctl status postgresql

# 检查端口
netstat -an | grep 5432

# 测试连接
psql -U postgres -h localhost -p 5432 -d cyberpress_db
```

### 性能问题

```sql
-- 查看当前活动查询
SELECT pid, now() - query_start as duration, query
FROM pg_stat_activity
WHERE state = 'active'
ORDER BY duration DESC;

-- 终止长时间运行的查询
SELECT pg_terminate_backend(pid)
FROM pg_stat_activity
WHERE state = 'active'
AND now() - query_start > interval '5 minutes';
```

### 磁盘空间

```bash
# 查看数据库大小
psql -U postgres -d cyberpress_db -c "SELECT pg_size_pretty(pg_database_size('cyberpress_db'));"

# 清理空间
VACUUM FULL;
REINDEX DATABASE cyberpress_db;
```

---

## 📚 参考资源

### 官方文档

- [PostgreSQL 文档](https://www.postgresql.org/docs/15/)
- [PostgreSQL 性能调优](https://www.postgresql.org/docs/current/performance-tips.html)
- [pg_stat_statements](https://www.postgresql.org/docs/current/pgstatstatements.html)

### 项目文档

- [API 文档](../API_DOCUMENTATION.md)
- [开发指南](../DEVELOPMENT_GUIDE.md)
- [ER 图](./schema/er-diagram.md)
- [表结构参考](./schema/tables-reference.md)

---

## 📝 变更日志

### v1.0.0 (2026-03-07)

- ✅ 完整的数据库架构
- ✅ 社交功能表（点赞、收藏、关注）
- ✅ 阅读进度追踪
- ✅ 审计日志系统
- ✅ 性能优化和索引
- ✅ 自动化脚本
- ✅ 监控工具

---

## 🤝 贡献

欢迎提交问题和改进建议！

---

**创建日期:** 2026-03-07
**版本:** 1.0.0
**维护者:** AI Development Team
