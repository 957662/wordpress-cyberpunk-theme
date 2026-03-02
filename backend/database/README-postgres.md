# CyberPress Platform - PostgreSQL 数据库架构

## 📁 文件结构

```
backend/database/
├── schema/                      # 数据库架构定义
│   ├── 01-er-diagram.md         # ER 图设计文档
│   ├── 02-tables.sql            # 表结构定义
│   ├── 03-indexes.sql           # 索引设计
│   └── 04-initial-data.sql      # 初始数据
├── functions/                   # 数据库函数
│   └── 01-utility-functions.sql # 实用工具函数
├── README-postgres.md           # PostgreSQL 文档（本文件）
└── README.md                    # MySQL 文档（原有）
```

## 🚀 快速开始

### 1. 创建数据库

```bash
# 创建数据库
createdb -U postgres cyberpress

# 或使用 psql
psql -U postgres
CREATE DATABASE cyberpress;
\q
```

### 2. 执行初始化

```bash
# 执行完整初始化
psql -U postgres -d cyberpress -f schema/02-tables.sql
psql -U postgres -d cyberpress -f schema/03-indexes.sql
psql -U postgres -d cyberpress -f schema/04-initial-data.sql
psql -U postgres -d cyberpress -f functions/01-utility-functions.sql
```

### 3. 验证安装

```sql
-- 查看所有表
\dt

-- 查看用户
SELECT username, role FROM users;

-- 查看文章统计
SELECT COUNT(*) FROM posts WHERE status = 'publish';
```

## 📊 核心功能

### 数据库函数

#### 搜索功能

```sql
-- 全文搜索
SELECT * FROM search_posts('Next.js', NULL, NULL, 20, 0);

-- 按分类搜索
SELECT * FROM search_posts('React', 'web-development', NULL, 10, 0);
```

#### 统计功能

```sql
-- 获取文章统计
SELECT * FROM get_post_stats(1);

-- 获取用户统计
SELECT * FROM get_user_stats(1);

-- 获取站点统计
SELECT * FROM get_site_stats();
```

#### 推荐系统

```sql
-- 相关文章
SELECT * FROM get_related_posts(1, 4);

-- 热门文章
SELECT * FROM get_trending_posts(7, 10);
```

#### 互动功能

```sql
-- 增加浏览量
SELECT increment_post_views(1);

-- 切换点赞
SELECT toggle_post_like(1, 1);
```

## 🔧 维护任务

### 定期维护

```sql
-- 清理垃圾评论
SELECT clean_spam_comments();

-- 清理过期会话
SELECT clean_expired_sessions();

-- 归档旧数据
SELECT archive_old_analytics(90);

-- 刷新物化视图
REFRESH MATERIALIZED VIEW CONCURRENTLY mv_popular_posts;
```

### 性能优化

```sql
-- 分析表
ANALYZE posts;

-- 清理死元组
VACUUM ANALYZE posts;

-- 重建索引
REINDEX TABLE CONCURRENTLY posts;
```

## 📈 监控

### 查看表大小

```sql
SELECT
    tablename,
    pg_size_pretty(pg_total_relation_size(tablename::regclass)) as size
FROM pg_tables
WHERE schemaname = 'public'
ORDER BY pg_total_relation_size(tablename::regclass) DESC;
```

### 查看慢查询

```sql
-- 需要安装 pg_stat_statements 扩展
CREATE EXTENSION IF NOT EXISTS pg_stat_statements;

SELECT
    query,
    calls,
    total_exec_time,
    mean_exec_time
FROM pg_stat_statements
ORDER BY total_exec_time DESC
LIMIT 10;
```

## 💾 备份

```bash
# 完整备份
pg_dump -U postgres -d cyberpress -F c -f backup.dump

# 仅架构
pg_dump -U postgres -d cyberpress --schema-only -f schema.sql

# 仅数据
pg_dump -U postgres -d cyberpress --data-only -f data.sql
```

## 🔐 安全配置

```sql
-- 创建只读用户
CREATE USER cyberpress_read WITH PASSWORD 'readonly_password';
GRANT CONNECT ON DATABASE cyberpress TO cyberpress_read;
GRANT SELECT ON ALL TABLES IN SCHEMA public TO cyberpress_read;

-- 创建应用用户
CREATE USER cyberpress_app WITH PASSWORD 'app_password';
GRANT CONNECT ON DATABASE cyberpress TO cyberpress_app;
GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA public TO cyberpress_app;
```

## 📚 参考文档

- [PostgreSQL 文档](https://www.postgresql.org/docs/)
- [全文搜索](https://www.postgresql.org/docs/current/textsearch.html)
- [JSONB 类型](https://www.postgresql.org/docs/current/datatype-json.html)

---

**版本**: 1.0.0  
**最后更新**: 2026-03-03
