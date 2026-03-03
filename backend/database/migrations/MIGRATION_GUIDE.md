# 🗄️ CyberPress 数据库迁移指南

## 📋 概述

本指南详细说明了 CyberPress 平台数据库迁移系统的使用方法、最佳实践和故障排除。

## 🏗️ 迁移系统架构

### 目录结构

```
backend/database/
├── migrations/              # 迁移文件目录
│   ├── 001_initial_schema.sql
│   ├── 002_add_performance_indexes.sql
│   ├── 003_add_search_optimization.sql
│   ├── 004_add_performance_monitoring.sql
│   ├── 005_add_user_preferences.sql
│   └── README.md
├── init.sql                 # 初始化脚本
├── seed-data.sql            # 种子数据
└── Makefile.postgres        # 迁移命令
```

## 🚀 快速开始

### 1. 环境准备

```bash
# 确保环境变量已配置
cd backend/database
cp .env.example .env

# 编辑 .env 文件，配置数据库连接
```

### 2. 创建数据库

```bash
# 使用 Makefile
make create-db

# 或手动创建
psql -U postgres -c "CREATE DATABASE cyberpress_db;"
```

### 3. 运行迁移

```bash
# 运行所有迁移
make migrate-up

# 运行单个迁移
make migrate-single FILE=migrations/001_initial_schema.sql

# 回滚迁移
make migrate-down VERSION=001
```

## 📝 迁移文件规范

### 命名约定

```
[VERSION]_[DESCRIPTION].sql

示例:
001_initial_schema.sql
002_add_performance_indexes.sql
003_add_search_optimization.sql
```

### 文件模板

```sql
-- ============================================
-- Migration: [DESCRIPTION]
-- Version: [VERSION]
-- Date: [YYYY-MM-DD]
-- Author: [AUTHOR]
-- ============================================

-- 开始事务
BEGIN;

-- 检查迁移版本（防止重复执行）
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM schema_migrations
        WHERE version = '[VERSION]'
    ) THEN
        -- 记录迁移版本
        INSERT INTO schema_migrations (version, applied_at)
        VALUES ('[VERSION]', NOW());
    END IF;
END $$;

-- === 迁移内容开始 ===

-- 你的 SQL 语句写在这里

-- === 迁移内容结束 ===

-- 提交事务
COMMIT;

-- 验证迁移
DO $$
BEGIN
    RAISE NOTICE 'Migration [VERSION] completed successfully';
END $$;
```

## 📊 当前迁移状态

### 已完成的迁移

| 版本 | 描述 | 日期 | 状态 |
|------|------|------|------|
| 001 | 初始化数据库架构 | 2026-03-01 | ✅ 完成 |
| 002 | 添加性能索引 | 2026-03-01 | ✅ 完成 |
| 003 | 添加全文搜索优化 | 2026-03-02 | ✅ 完成 |
| 004 | 添加性能监控 | 2026-03-02 | ✅ 完成 |
| 005 | 添加用户偏好设置 | 2026-03-02 | ✅ 完成 |

### 待开发的迁移

| 版本 | 描述 | 优先级 | 预计日期 |
|------|------|--------|----------|
| 006 | 添加通知系统 | 高 | 2026-03-04 |
| 007 | 添加社交功能 | 中 | 2026-03-05 |
| 008 | 添加多语言支持 | 中 | 2026-03-06 |

## 🔧 常用命令

### 使用 Makefile

```bash
# 查看所有可用命令
make help

# 数据库操作
make create-db          # 创建数据库
make drop-db            # 删除数据库
make reset-db           # 重置数据库
make backup-db          # 备份数据库

# 迁移操作
make migrate-up         # 运行所有待执行的迁移
make migrate-down       # 回滚最后一个迁移
make migrate-status     # 查看迁移状态
make migrate-redo       # 重新执行最后一个迁移

# 数据操作
make seed-db            # 加载种子数据
make reset-seed         # 重置并加载种子数据

# 开发工具
make db-shell           # 进入数据库 shell
make db-logs            # 查看数据库日志
make db-connect         # 测试数据库连接
```

### 使用 psql 直接操作

```bash
# 连接数据库
psql -U cyberpress -d cyberpress_db

# 执行迁移文件
psql -U cyberpress -d cyberpress_db -f migrations/001_initial_schema.sql

# 查看迁移状态
psql -U cyberpress -d cyberpress_db -c "SELECT * FROM schema_migrations ORDER BY version;"

# 回滚迁移
psql -U cyberpress -d cyberpress_db -f migrations/rollback/001_rollback.sql
```

## 📖 迁移最佳实践

### 1. 版本控制

```bash
# 每次迁移前创建分支
git checkout -b migration/add-feature-x

# 编写并测试迁移
# 提交迁移文件
git add migrations/006_add_feature_x.sql
git commit -m "Add migration for feature X"

# 推送并创建 PR
git push origin migration/add-feature-x
```

### 2. 向后兼容

```sql
-- ✅ 好的做法：添加新列时提供默认值
ALTER TABLE users ADD COLUMN theme VARCHAR(20) DEFAULT 'dark';

-- ❌ 避免：删除列而不通知
-- ALTER TABLE users DROP COLUMN old_column;

-- ✅ 好的做法：先标记为废弃
ALTER TABLE users RENAME COLUMN old_column TO old_column_deprecated;
```

### 3. 性能考虑

```sql
-- ✅ 好的做法：在非高峰期创建索引
CREATE INDEX CONCURRENTLY idx_posts_created_at ON posts(created_at);

-- ✅ 好的做法：批量操作
INSERT INTO categories (name, slug) VALUES
    ('Technology', 'technology'),
    ('Design', 'design'),
    ('Development', 'development');

-- ❌ 避免：单条插入
-- INSERT INTO categories (name, slug) VALUES ('Technology', 'technology');
-- INSERT INTO categories (name, slug) VALUES ('Design', 'design');
```

### 4. 数据安全

```sql
-- ✅ 好的做法：使用事务
BEGIN;
-- 你的修改
-- 验证结果
COMMIT; -- 或 ROLLBACK;

-- ✅ 好的做法：备份数据
CREATE TABLE posts_backup AS SELECT * FROM posts;

-- ✅ 好的做法：先在测试环境验证
```

## 🛠️ 故障排除

### 问题 1: 迁移失败

```bash
# 查看错误日志
make db-logs

# 检查迁移状态
make migrate-status

# 回滚失败的迁移
make migrate-down VERSION=005

# 修复后重新运行
make migrate-up
```

### 问题 2: 锁表超时

```sql
-- 查看当前锁
SELECT * FROM pg_stat_activity WHERE datname = 'cyberpress_db';

-- 终止长时间运行的查询
SELECT pg_terminate_backend(pid)
FROM pg_stat_activity
WHERE state = 'active'
AND query_start < now() - interval '5 minutes';
```

### 问题 3: 磁盘空间不足

```bash
# 检查数据库大小
psql -U cyberpress -d cyberpress_db -c "SELECT pg_size_pretty(pg_database_size('cyberpress_db'));"

# 清理旧数据
VACUUM FULL;

# 删除旧备份
find backups/ -name "*.sql" -mtime +7 -delete
```

## 📚 相关文档

- [数据库架构设计](./schema/01-er-diagram.md)
- [性能优化指南](./schema/02-performance.md)
- [备份恢复策略](./backup-restore.md)
- [API 文档](../../docs/API_DOCUMENTATION.md)

## 🤝 贡献指南

### 创建新迁移

1. 创建迁移文件
```bash
# 使用脚本创建新迁移
./scripts/create-migration.sh "add_new_feature"
# 或手动创建
touch migrations/006_add_new_feature.sql
```

2. 编写迁移内容
```sql
-- 遵循上述模板和最佳实践
```

3. 测试迁移
```bash
# 在测试数据库上运行
psql -U cyberpress_test -d cyberpress_test_db -f migrations/006_add_new_feature.sql

# 验证结果
psql -U cyberpress_test -d cyberpress_test_db -c "\d table_name"
```

4. 提交审核
```bash
git add migrations/006_add_new_feature.sql
git commit -m "Add migration: add_new_feature"
```

## 📞 支持

如有问题，请联系：
- **数据库管理员**: dba@cyberpress.dev
- **技术支持**: support@cyberpress.dev
- **GitHub Issues**: [提交问题](https://github.com/your-repo/issues)

---

**最后更新**: 2026-03-03
**维护者**: AI 开发团队
