# CyberPress Database

CyberPress Platform 的 MySQL 数据库架构。

## 📋 目录

- [快速开始](#快速开始)
- [数据库结构](#数据库结构)
- [迁移系统](#迁移系统)
- [存储过程](#存储过程)
- [性能优化](#性能优化)
- [备份与恢复](#备份与恢复)
- [故障排查](#故障排查)

---

## 🚀 快速开始

### 1. 环境要求

- **MySQL**: 8.0+ 或 MariaDB 10.6+
- **PHP**: 8.1+ (如果使用 WordPress)
- **内存**: 最低 512MB，推荐 2GB+
- **磁盘**: 最低 1GB 可用空间

### 2. 创建数据库

```bash
# 登录 MySQL
mysql -u root -p

# 创建数据库和用户
CREATE DATABASE cyberpress CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE USER 'cyberpress'@'localhost' IDENTIFIED BY 'your_secure_password';
GRANT ALL PRIVILEGES ON cyberpress.* TO 'cyberpress'@'localhost';
FLUSH PRIVILEGES;
```

### 3. 初始化数据库

```bash
# 方式1: 使用完整schema
mysql -u cyberpress -p cyberpress < schema.sql

# 方式2: 使用迁移系统
mysql -u cyberpress -p cyberpress < migrations/001_initial_schema.sql
mysql -u cyberpress -p cyberpress < migrations/002_add_performance_indexes.sql
```

### 4. 验证安装

```sql
-- 查看所有表
SHOW TABLES;

-- 查看迁移记录
SELECT * FROM migrations ORDER BY executed_at;

-- 查看默认管理员
SELECT id, email, username, role FROM users WHERE role = 'administrator';
```

---

## 📊 数据库结构

### 核心表

| 表名 | 说明 | 记录数预估 |
|------|------|-----------|
| `users` | 用户信息 | 1,000 |
| `posts` | 文章/页面 | 50,000 |
| `categories` | 分类和标签 | 500 |
| `post_categories` | 文章分类关联 | 150,000 |
| `post_meta` | 文章元数据 | 200,000 |
| `comments` | 评论 | 100,000 |
| `portfolio_items` | 作品集 | 200 |
| `portfolio_gallery` | 作品图片 | 1,000 |
| `media` | 媒体库 | 10,000 |
| `settings` | 系统设置 | 100 |
| `analytics` | 统计数据 | 1,000,000+ |

### ER 图

详细的实体关系图请查看: [docs/DATABASE-DESIGN.md](../../docs/DATABASE-DESIGN.md)

### 索引设计

完整的索引设计文档: [docs/DATABASE-INDEXES.md](../../docs/DATABASE-INDEXES.md)

---

## 🔄 迁移系统

### 迁移文件结构

```
backend/database/
├── schema.sql                    # 完整数据库架构
├── migrations/
│   ├── 001_initial_schema.sql    # 初始架构
│   ├── 002_add_indexes.sql       # 性能索引
│   └── 003_*.sql                # 未来迁移
└── README.md                     # 本文件
```

### 创建新迁移

1. **命名规范**: `XXX_description.sql`
   - XXX: 三位数字序号
   - description: 简短描述（snake_case）

2. **迁移模板**:

```sql
-- =====================================================
-- Migration: XXX_migration_name
-- =====================================================
-- Version: 1.0.0
-- Created: YYYY-MM-DD
-- Description: 迁移描述
-- =====================================================

-- 记录迁移
INSERT INTO `migrations` (`migration`, `batch`)
VALUES ('XXX_migration_name', 1);

-- 你的迁移SQL
-- ...

-- 验证脚本（可选）
-- ...

SELECT 'Migration XXX completed!' AS message;
```

### 运行迁移

```bash
# 运行单个迁移
mysql -u cyberpress -p cyberpress < migrations/003_new_feature.sql

# 运行所有未执行的迁移
# (需要自行编写迁移脚本或使用工具)
```

### 迁移最佳实践

- ✅ **向后兼容**: 确保新旧代码都能运行
- ✅ **可回滚**: 准备回滚脚本
- ✅ **测试先行**: 在开发环境测试
- ✅ **备份数据**: 运行前备份
- ✅ **原子操作**: 使用事务

---

## 🔧 存储过程

### sp_increment_post_views

增加文章浏览次数并更新统计。

```sql
CALL sp_increment_post_views(123);
```

### sp_update_category_counts

更新所有分类的文章计数。

```sql
CALL sp_update_category_counts();
```

### sp_cleanup_old_data

清理指定天数前的旧数据。

```sql
-- 清理30天前的垃圾数据
CALL sp_cleanup_old_data(30);
```

### sp_bulk_update_post_status

批量更新文章状态。

```sql
-- 将文章 1,2,3 设为已发布
CALL sp_bulk_update_post_status('1,2,3', 'publish');
```

---

## ⚡ 性能优化

### 1. 慢查询监控

```sql
-- 启用慢查询日志
SET GLOBAL slow_query_log = 'ON';
SET GLOBAL long_query_time = 1;  -- 1秒
SET GLOBAL log_queries_not_using_indexes = 'ON';

-- 查看慢查询
SELECT * FROM mysql.slow_log ORDER BY start_time DESC LIMIT 10;
```

### 2. 索引分析

```sql
-- 查看表索引
SHOW INDEX FROM posts;

-- 分析索引使用情况
EXPLAIN SELECT * FROM posts WHERE status = 'publish' ORDER BY published_at DESC;

-- 查看索引基数
ANALYZE TABLE posts;
SHOW INDEX FROM posts;
```

### 3. 查询优化示例

**优化前**:
```sql
SELECT * FROM posts
WHERE content LIKE '%keyword%';
```

**优化后**:
```sql
-- 使用全文索引
SELECT * FROM posts
WHERE MATCH(title, content, excerpt) AGAINST('keyword' IN NATURAL LANGUAGE MODE);
```

### 4. 配置优化

```ini
# my.cnf / my.ini

[mysqld]
# InnoDB 缓冲池大小（物理内存的 70-80%）
innodb_buffer_pool_size = 2G

# 连接数
max_connections = 200

# 查询缓存（MySQL 5.7及以下）
query_cache_size = 128M
query_cache_type = 1

# 临时表大小
tmp_table_size = 128M
max_heap_table_size = 128M

# 日志
slow_query_log = 1
long_query_time = 1
```

---

## 💾 备份与恢复

### 备份策略

#### 1. 完整备份

```bash
# 使用 mysqldump
mysqldump -u cyberpress -p cyberpress > backup_$(date +%Y%m%d).sql

# 压缩备份
mysqldump -u cyberpress -p cyberpress | gzip > backup_$(date +%Y%m%d).sql.gz

# 仅备份数据（不含结构）
mysqldump -u cyberpress -p --no-create-info cyberpress > data_backup.sql

# 仅备份结构（不含数据）
mysqldump -u cyberpress -p --no-data cyberpress > schema_backup.sql
```

#### 2. 自动备份脚本

```bash
#!/bin/bash
# backup.sh - 每日自动备份

BACKUP_DIR="/var/backups/cyberpress"
DATE=$(date +%Y%m%d_%H%M%S)
DB_NAME="cyberpress"
DB_USER="cyberpress"
DB_PASS="your_password"

# 创建备份目录
mkdir -p $BACKUP_DIR

# 备份数据库
mysqldump -u $DB_USER -p$DB_PASS $DB_NAME | gzip > $BACKUP_DIR/backup_$DATE.sql.gz

# 保留最近7天的备份
find $BACKUP_DIR -name "backup_*.sql.gz" -mtime +7 -delete

echo "Backup completed: backup_$DATE.sql.gz"
```

添加到 crontab:
```bash
# 每天凌晨2点备份
0 2 * * * /path/to/backup.sh
```

### 恢复数据

```bash
# 从备份恢复
mysql -u cyberpress -p cyberpress < backup_20260302.sql

# 从压缩备份恢复
gunzip < backup_20260302.sql.gz | mysql -u cyberpress -p cyberpress

# 恢复单个表
mysql -u cyberpress -p cyberpress < posts_table_backup.sql
```

### 点时间恢复（PITR）

如果开启了二进制日志:

```bash
# 1. 恢复全量备份
mysql -u cyberpress -p cyberpress < full_backup.sql

# 2. 应用二进制日志
mysqlbinlog --start-datetime="2026-03-01 00:00:00" \
            --stop-datetime="2026-03-02 12:00:00" \
            mysql-bin.000123 | mysql -u cyberpress -p cyberpress
```

---

## 🔍 故障排查

### 常见问题

#### 1. 连接错误

```
ERROR 2002 (HY000): Can't connect to local MySQL server through socket
```

**解决方案**:
```bash
# 检查 MySQL 状态
systemctl status mysql

# 启动 MySQL
systemctl start mysql

# 检查 socket 文件
ls -la /var/run/mysqld/mysqld.sock
```

#### 2. 权限错误

```
ERROR 1142 (42000): SELECT command denied to user
```

**解决方案**:
```sql
GRANT SELECT, INSERT, UPDATE, DELETE ON cyberpress.* TO 'cyberpress'@'localhost';
FLUSH PRIVILEGES;
```

#### 3. 表损坏

```
ERROR 1194 (HY000): Table 'posts' is marked as crashed
```

**解决方案**:
```sql
-- 检查表
CHECK TABLE posts;

-- 修复表
REPAIR TABLE posts;

-- 优化表
OPTIMIZE TABLE posts;
```

#### 4. 磁盘空间不足

```bash
# 检查磁盘使用
df -h

# 清理二进制日志
PURGE BINARY LOGS BEFORE DATE(NOW() - INTERVAL 7 DAY);

-- 删除旧数据
CALL sp_cleanup_old_data(90);
```

#### 5. 慢查询

```sql
-- 查看正在执行的查询
SHOW PROCESSLIST;

-- 终止长时间运行的查询
KILL 123;

-- 分析查询
EXPLAIN SELECT * FROM posts WHERE ...;
```

### 监控查询

```sql
-- 查看数据库大小
SELECT
  table_schema AS 'Database',
  ROUND(SUM(data_length + index_length) / 1024 / 1024, 2) AS 'Size (MB)'
FROM information_schema.tables
GROUP BY table_schema;

-- 查看表大小
SELECT
  table_name,
  ROUND(((data_length + index_length) / 1024 / 1024), 2) AS 'Size (MB)'
FROM information_schema.tables
WHERE table_schema = 'cyberpress'
ORDER BY (data_length + index_length) DESC;

-- 查看连接数
SHOW STATUS LIKE 'Threads_connected';
SHOW STATUS LIKE 'Max_used_connections';

-- 查看InnoDB状态
SHOW ENGINE INNODB STATUS\G
```

---

## 📚 相关文档

- [数据库设计文档](../../docs/DATABASE-DESIGN.md)
- [索引设计文档](../../docs/DATABASE-INDEXES.md)
- [项目架构文档](../../docs/ARCHITECTURE.md)
- [开发指南](../../docs/DEVELOPMENT.md)

---

## 🔐 安全建议

1. **定期备份**: 每天自动备份
2. **强密码**: 使用复杂的数据库密码
3. **限制访问**: 只允许本地或特定IP访问
4. **定期更新**: 保持 MySQL 版本最新
5. **监控日志**: 定期检查慢查询和错误日志
6. **权限分离**: 不同应用使用不同数据库用户

---

## 📞 支持

如有问题，请联系:
- **Email**: dba@cyberpress.com
- **GitHub Issues**: https://github.com/cyberpress/platform/issues

---

**最后更新**: 2026-03-02
**版本**: 1.0.0
