# 📚 CyberPress 数据库文档索引

> 完整的数据库系统文档导航

## 🎯 快速导航

### 📖 核心文档
- [数据库介绍](../schema/00-introduction.md) - 数据库架构概览
- [ER 图](../schema/er-diagram.md) - 实体关系图
- [表结构参考](../schema/tables-reference.md) - 详细表结构说明

### 🚀 安装部署
- [README](../README.md) - 数据库系统说明
- [初始化脚本](../schema/init.sh) - 一键初始化脚本
- [Docker 部署](../docker-compose.db.yml) - Docker Compose 配置

### 📊 SQL 脚本
- [PostgreSQL 初始化](../schema/01-init-database-postgres.sql) - PostgreSQL 完整架构
- [核心架构](../schema/core-schema.sql) - 核心表结构
- [性能架构](../schema/performance-schema.sql) - 性能优化架构

### 🛠️ 工具脚本
- [数据库初始化](../scripts/init-database.sh) - 初始化脚本
- [数据库备份](../scripts/backup-database.sh) - 备份脚本
- [数据库恢复](../scripts/restore-database.sh) - 恢复脚本
- [数据库监控](../scripts/monitor-database.sh) - 监控脚本
- [数据库迁移](../scripts/migrate-database.sh) - 迁移脚本

### 📋 迁移文件
- [初始架构](../migrations/001_initial_schema.sql)
- [社交功能](../migrations/002_social_features.sql)
- [阅读进度](../migrations/003_reading_progress.sql)
- [审计日志](../migrations/004_audit_logs.sql)
- [性能指标](../migrations/005_performance_metrics.sql)

---

## 🎓 使用指南

### 新手入门

1. **快速开始**
   ```bash
   cd database
   ./schema/init.sh
   ```

2. **查看架构**
   - 阅读 [数据库介绍](../schema/00-introduction.md)
   - 查看 [ER 图](../schema/er-diagram.md)

3. **运行测试**
   ```bash
   psql -U postgres -d cyberpress_db -f tools/seed-data.sql
   ```

### 常见操作

#### 查看数据库状态
```bash
./tools/db-utils.sh status
```

#### 备份数据库
```bash
./scripts/backup-database.sh
```

#### 监控性能
```bash
./scripts/monitor-database.sh --all
```

#### 运行迁移
```bash
./scripts/migrate-database.sh
```

---

## 📊 表结构速查

### 核心表
| 表名 | 说明 | 文档 |
|------|------|------|
| `users` | 用户表 | [详情](../schema/tables-reference.md#users) |
| `posts` | 文章表 | [详情](../schema/tables-reference.md#posts) |
| `categories` | 分类表 | [详情](../schema/tables-reference.md#categories) |
| `tags` | 标签表 | [详情](../schema/tables-reference.md#tags) |
| `comments` | 评论表 | [详情](../schema/tables-reference.md#comments) |
| `media` | 媒体表 | [详情](../schema/tables-reference.md#media) |

### 社交功能表
| 表名 | 说明 | 文档 |
|------|------|------|
| `likes` | 点赞表 | [详情](../schema/tables-reference.md#likes) |
| `bookmarks` | 收藏表 | [详情](../schema/tables-reference.md#bookmarks) |
| `follows` | 关注表 | [详情](../schema/tables-reference.md#follows) |
| `notifications` | 通知表 | [详情](../schema/tables-reference.md#notifications) |

### 扩展功能表
| 表名 | 说明 | 文档 |
|------|------|------|
| `reading_progress` | 阅读进度 | [详情](../schema/tables-reference.md#reading_progress) |
| `audit_logs` | 审计日志 | [详情](../schema/tables-reference.md#audit_logs) |
| `analytics` | 统计分析 | [详情](../schema/tables-reference.md#analytics) |

---

## 🔧 维护指南

### 日常维护

#### 每日任务
```bash
# 备份数据库
./scripts/backup-database.sh --daily

# 监控性能
./scripts/monitor-database.sh --all
```

#### 每周任务
```bash
# 完整备份
./scripts/backup-database.sh --weekly

# 重建索引
./tools/db-utils.sh reindex

# 分析统计信息
./tools/db-utils.sh analyze
```

#### 每月任务
```bash
# 月度备份
./scripts/backup-database.sh --monthly

# 清理旧备份
./tools/db-utils.sh clean-backups

# 数据库优化
./tools/db-utils.sh vacuum
```

---

## 🚨 故障排除

### 常见问题

#### 连接失败
```bash
# 检查服务状态
sudo systemctl status postgresql

# 测试连接
psql -U postgres -h localhost -p 5432 -d cyberpress_db
```

#### 性能问题
```sql
-- 查看慢查询
SELECT query, calls, mean_time, max_time
FROM pg_stat_statements
ORDER BY mean_time DESC
LIMIT 10;
```

#### 磁盘空间
```bash
# 查看数据库大小
psql -U postgres -d cyberpress_db -c "SELECT pg_size_pretty(pg_database_size('cyberpress_db'));"

# 清理空间
./tools/db-utils.sh vacuum
```

---

## 📚 参考资源

### 官方文档
- [PostgreSQL 15 文档](https://www.postgresql.org/docs/15/)
- [PostgreSQL 性能调优](https://www.postgresql.org/docs/current/performance-tips.html)

### 项目文档
- [项目 README](../../README.md)
- [开发指南](../../DEVELOPMENT_GUIDE.md)
- [API 文档](../../API_DOCUMENTATION.md)

---

## 📝 更新日志

### v1.0.0 (2026-03-07)
- ✅ 完整的数据库架构
- ✅ 社交功能支持
- ✅ 性能优化索引
- ✅ 自动化脚本
- ✅ 完整文档

---

**创建日期**: 2026-03-07
**版本**: 1.0.0
**维护者**: AI Development Team
