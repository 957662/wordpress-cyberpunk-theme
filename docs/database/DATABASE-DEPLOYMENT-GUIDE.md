# 🚀 WordPress Cyberpunk Theme - 数据库部署指南

> **数据库架构师 - 部署文档**
> **版本**: 2.0.0
> **日期**: 2026-02-28
> **目标受众**: DevOps工程师、系统管理员

---

## 📋 目录

1. [部署前检查](#部署前检查)
2. [快速部署](#快速部署)
3. [生产环境部署](#生产环境部署)
4. [数据迁移](#数据迁移)
5. [性能优化](#性能优化)
6. [监控与告警](#监控与告警)
7. [故障恢复](#故障恢复)
8. [常见问题](#常见问题)

---

## 部署前检查

### 系统要求

```yaml
最低配置:
  MySQL版本: 5.7+ (推荐 8.0+)
  PHP版本: 7.4+ (推荐 8.0+)
  WordPress: 5.0+ (推荐 6.2+)
  内存: 最低 512MB (推荐 1GB+)
  磁盘空间: 最低 100MB 可用空间

必需权限:
  - CREATE, ALTER, DROP (表/视图/存储过程/事件)
  - INSERT, UPDATE, DELETE, SELECT
  - INDEX, CREATE TEMPORARY TABLES
  - EVENT (事件调度器权限)
```

### 检查脚本

```bash
# 1. 检查MySQL版本
mysql --version

# 2. 检查事件调度器状态
mysql -u root -p -e "SHOW VARIABLES LIKE 'event_scheduler';"

# 3. 检查表前缀
mysql -u root -p -e "SELECT table_name FROM information_schema.tables WHERE table_schema = DATABASE();"

# 4. 检查磁盘空间
df -h

# 5. 检查InnoDB引擎支持
mysql -u root -p -e "SHOW ENGINES;"
```

---

## 快速部署

### 方法 1: 自动部署（推荐）

```bash
#!/bin/bash
# cyberpunk-db-deploy.sh

set -e

# 配置
DB_NAME="your_database_name"
DB_USER="your_db_user"
DB_PASS="your_db_password"
DB_HOST="localhost"
TABLE_PREFIX="wp_"

# 颜色输出
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

echo -e "${GREEN}🚀 Cyberpunk Theme Database Deployment${NC}"
echo "======================================"

# 1. 备份现有数据库
echo -e "${YELLOW}📦 Creating backup...${NC}"
mysqldump -h "$DB_HOST" -u "$DB_USER" -p"$DB_PASS" "$DB_NAME" \
  > backup_$(date +%Y%m%d_%H%M%S).sql
echo -e "${GREEN}✅ Backup created${NC}"

# 2. 替换表前缀
echo -e "${YELLOW}🔧 Processing SQL script...${NC}"
sed "s/@prefix/$TABLE_PREFIX/g" \
  docs/database/CYBERPUNK_DATABASE_COMPLETE.sql \
  > /tmp/cyberpunk_deploy.sql

# 3. 执行SQL脚本
echo -e "${YELLOW}⚡ Executing SQL...${NC}"
mysql -h "$DB_HOST" -u "$DB_USER" -p"$DB_PASS" "$DB_NAME" < /tmp/cyberpunk_deploy.sql

# 4. 清理临时文件
rm /tmp/cyberpunk_deploy.sql

# 5. 验证部署
echo -e "${YELLOW}🔍 Verifying deployment...${NC}"
TABLE_COUNT=$(mysql -h "$DB_HOST" -u "$DB_USER" -p"$DB_PASS" "$DB_NAME" -sN \
  -e "SELECT COUNT(*) FROM information_schema.tables
       WHERE table_schema = '$DB_NAME'
       AND table_name LIKE '${TABLE_PREFIX}cyberpunk%';")

echo -e "${GREEN}✅ Deployment complete!${NC}"
echo "Created $TABLE_COUNT Cyberpunk tables."
echo ""
echo "Next steps:"
echo "1. Test the database: see section 'Verification Tests'"
echo "2. Configure WordPress settings"
echo "3. Monitor performance: see section 'Monitoring'"
```

### 方法 2: 手动部署

#### 步骤 1: 备份数据库

```bash
# 完整备份
mysqldump -u username -p database_name > backup_$(date +%Y%m%d).sql

# 仅备份结构
mysqldump -u username -p --no-data database_name > schema_backup.sql
```

#### 步骤 2: 编辑表前缀

```bash
# 查看当前WordPress表前缀
mysql -u username -p -e "USE database_name; SHOW TABLES;"

# 替换脚本中的@prefix为实际前缀
sed 's/@prefix/wp_/g' CYBERPUNK_DATABASE_COMPLETE.sql > deploy.sql
```

#### 步骤 3: 执行部署

```bash
# 方法 A: 使用mysql命令
mysql -u username -p database_name < deploy.sql

# 方法 B: 使用phpMyAdmin
# 1. 登录phpMyAdmin
# 2. 选择数据库
# 3. 点击"导入"标签
# 4. 选择deploy.sql文件
# 5. 点击"执行"
```

#### 步骤 4: 验证部署

```sql
-- 检查表是否创建成功
SHOW TABLES LIKE 'wp_cyberpunk%';

-- 检查视图
SHOW CREATE VIEW wp_cyberpunk_post_stats;

-- 检查存储过程
SHOW PROCEDURE STATUS WHERE Db = DATABASE();

-- 检查事件
SHOW EVENTS;
```

---

## 生产环境部署

### 安全加固

```sql
-- 1. 创建专用数据库用户
CREATE USER 'cyberpunk_app'@'localhost' IDENTIFIED BY 'strong_password_here';

-- 2. 授予最小权限
GRANT SELECT, INSERT, UPDATE, DELETE ON wordpress_db.wp_cyberpunk% TO 'cyberpunk_app'@'localhost';
GRANT SELECT, INSERT, UPDATE ON wordpress_db.wp_postmeta TO 'cyberpunk_app'@'localhost';
GRANT SELECT ON wordpress_db.wp_posts TO 'cyberpunk_app'@'localhost';
GRANT SELECT ON wordpress_db.wp_users TO 'cyberpunk_app'@'localhost';

-- 3. 刷新权限
FLUSH PRIVILEGES;
```

### 性能优化配置

```ini
# /etc/my.cnf (MySQL配置文件)

[mysqld]
# 启用事件调度器
event_scheduler=ON

# InnoDB缓冲池大小 (设置为服务器内存的70-80%)
innodb_buffer_pool_size=1G

# InnoDB日志文件大小
innodb_log_file_size=256M

# 查询缓存 (MySQL 5.7及以下)
query_cache_type=1
query_cache_size=64M

# 临时表大小
tmp_table_size=64M
max_heap_table_size=64M

# 连接数
max_connections=200

# 慢查询日志
slow_query_log=1
slow_query_log_file=/var/log/mysql/slow.log
long_query_time=2

# 重启MySQL
# systemctl restart mysqld
```

### WordPress配置

```php
// wp-config.php

// 表前缀 (必须与数据库一致)
$table_prefix = 'wp_';

// 启用对象缓存
define('WP_CACHE', true);

// 禁用文章修订 (节省空间)
define('WP_POST_REVISIONS', 3);

// 自动保存间隔
define('AUTOSAVE_INTERVAL', 300); // 5分钟

// 心跳设置
define('WP_HTTP_BLOCK_EXTERNAL', true);

// 增加内存限制
define('WP_MEMORY_LIMIT', '256M');

// 优化查询
define('CUSTOM_USER_TABLE', $table_prefix . 'users');
define('CUSTOM_USER_META_TABLE', $table_prefix . 'usermeta');
```

---

## 数据迁移

### 从PostMeta迁移到自定义表

#### 迁移前准备

```sql
-- 1. 备份现有数据
CREATE TABLE wp_postmeta_backup AS SELECT * FROM wp_postmeta;
CREATE TABLE wp_usermeta_backup AS SELECT * FROM wp_usermeta;

-- 2. 检查现有数据量
SELECT
  meta_key,
  COUNT(*) as count
FROM wp_postmeta
WHERE meta_key LIKE '_cyberpunk%'
GROUP BY meta_key;

SELECT
  meta_key,
  COUNT(*) as count
FROM wp_usermeta
WHERE meta_key LIKE '_cyberpunk%'
GROUP BY meta_key;
```

#### 执行迁移

```bash
# 迁移脚本已包含在主脚本中
# 如需单独执行，请运行:

# 迁移点赞数据
mysql -u username -p database_name <<EOF
INSERT IGNORE INTO wp_cyberpunk_user_actions (user_id, post_id, action_type, action_time, ip_address)
SELECT
  CAST(um.user_id AS UNSIGNED),
  CAST(SUBSTRING_INDEX(SUBSTRING_INDEX(um.meta_value, ',', n.n), ',', -1) AS UNSIGNED),
  'like',
  NOW(),
  '0.0.0.0'
FROM wp_usermeta um
JOIN (
  SELECT 1 AS n UNION ALL SELECT 2 UNION ALL SELECT 3 UNION ALL
  SELECT 4 UNION ALL SELECT 5 UNION ALL SELECT 6 UNION ALL SELECT 7 UNION ALL
  SELECT 8 UNION ALL SELECT 9 UNION ALL SELECT 10
) n
ON n.n <= LENGTH(um.meta_value) - LENGTH(REPLACE(um.meta_value, ',', '')) + 1
WHERE um.meta_key = '_cyberpunk_liked_posts'
AND um.meta_value != '';
EOF

# 验证迁移结果
mysql -u username -p database_name -e "
  SELECT COUNT(*) as migrated_likes FROM wp_cyberpunk_user_actions WHERE action_type = 'like';
"
```

#### 迁移后验证

```sql
-- 验证数据一致性
SELECT
  (SELECT COUNT(*) FROM wp_usermeta WHERE meta_key = '_cyberpunk_liked_posts') as old_count,
  (SELECT COUNT(*) FROM wp_cyberpunk_user_actions WHERE action_type = 'like') as new_count;

-- 检查是否有数据丢失
SELECT
  um.user_id,
  um.meta_value as old_likes,
  (SELECT GROUP_CONCAT(post_id)
   FROM wp_cyberpunk_user_actions
   WHERE user_id = um.user_id AND action_type = 'like') as new_likes
FROM wp_usermeta um
WHERE um.meta_key = '_cyberpunk_liked_posts'
HAVING old_likes != new_likes;
```

---

## 性能优化

### 索引优化

```sql
-- 1. 分析表统计信息
ANALYZE TABLE wp_cyberpunk_visits;
ANALYZE TABLE wp_cyberpunk_user_actions;
ANALYZE TABLE wp_cyberpunk_shares;
ANALYZE TABLE wp_cyberpunk_reading_progress;

-- 2. 检查索引使用情况
SELECT
  TABLE_NAME,
  INDEX_NAME,
  CARDINALITY,
  SEQ_IN_INDEX,
  COLUMN_NAME
FROM information_schema.STATISTICS
WHERE table_schema = DATABASE()
AND TABLE_NAME LIKE 'wp_cyberpunk%'
ORDER BY TABLE_NAME, INDEX_NAME, SEQ_IN_INDEX;

-- 3. 优化表
OPTIMIZE TABLE wp_cyberpunk_visits;
OPTIMIZE TABLE wp_cyberpunk_user_actions;
```

### 查询优化

```sql
-- 使用EXPLAIN分析查询
EXPLAIN SELECT
  COUNT(*)
FROM wp_cyberpunk_user_actions
WHERE post_id = 123
AND action_type = 'like';

-- 预期结果:
-- - type: ref (使用索引)
-- - key: idx_post_action_type
-- - rows: 10 (扫描行数少)

-- 如果type=ALL,说明需要优化
```

### 缓存策略

```php
// 在WordPress中启用Redis缓存

// 1. 安装Redis Object Cache插件
// wp plugin install redis-cache --activate

// 2. 配置wp-config.php
define('WP_REDIS_HOST', '127.0.0.1');
define('WP_REDIS_PORT', 6379);
define('WP_REDIS_DATABASE', 0);
define('WP_REDIS_PREFIX', 'cyberpunk_');

// 3. 连接数据库
define('WP_CACHE_KEY_SALT', 'cyberpunk_');
```

---

## 监控与告警

### 关键监控指标

```sql
-- 1. 表大小监控
SELECT
  TABLE_NAME,
  ROUND(((data_length + index_length) / 1024 / 1024), 2) AS size_mb,
  TABLE_ROWS,
  ROUND((index_length / 1024 / 1024), 2) AS index_size_mb,
  ROUND((data_free / 1024 / 1024), 2) AS fragmentation_mb
FROM information_schema.TABLES
WHERE table_schema = DATABASE()
AND TABLE_NAME LIKE 'wp_cyberpunk%'
ORDER BY (data_length + index_length) DESC;

-- 2. 查询性能监控
SELECT
  query_time,
  lock_time,
  rows_sent,
  rows_examined,
  sql_text
FROM mysql.slow_log
WHERE sql_text LIKE '%cyberpunk%'
ORDER BY query_time DESC
LIMIT 20;

-- 3. 并发连接监控
SHOW PROCESSLIST;

-- 4. InnoDB状态
SHOW ENGINE INNODB STATUS\G
```

### 设置告警

```bash
#!/bin/bash
# cyberpunk-monitor.sh

# 检查表大小
TABLE_SIZE=$(mysql -u root -p"password" -sN -e "
  SELECT ROUND(SUM(data_length + index_length) / 1024 / 1024, 2)
  FROM information_schema.tables
  WHERE table_schema = 'wordpress_db'
  AND table_name LIKE 'wp_cyberpunk%'
")

THRESHOLD=500

if (( $(echo "$TABLE_SIZE > $THRESHOLD" | bc -l) )); then
  echo "WARNING: Cyberpunk tables size: ${TABLE_SIZE}MB (Threshold: ${THRESHOLD}MB)"
  # 发送邮件告警
  # mail -s "Database Size Alert" admin@example.com
fi

# 检查事件调度器
EVENT_SCHEDULER=$(mysql -u root -p"password" -sN -e "SHOW VARIABLES LIKE 'event_scheduler'" | awk '{print $2}')

if [ "$EVENT_SCHEDULER" != "ON" ]; then
  echo "ERROR: Event scheduler is OFF"
  # 尝试启用
  mysql -u root -p"password" -e "SET GLOBAL event_scheduler = ON;"
fi
```

---

## 故障恢复

### 备份策略

```bash
#!/bin/bash
# cyberpunk-backup.sh

BACKUP_DIR="/var/backups/cyberpunk"
DATE=$(date +%Y%m%d_%H%M%S)
DB_NAME="wordpress_db"

# 创建备份目录
mkdir -p "$BACKUP_DIR"

# 1. 完整备份
mysqldump -u root -p"password" \
  --single-transaction \
  --routines \
  --events \
  --triggers \
  "$DB_NAME" > "$BACKUP_DIR/full_backup_$DATE.sql"

# 2. 仅备份Cyberpunk表
mysqldump -u root -p"password" \
  "$DB_NAME" \
  wp_cyberpunk_visits \
  wp_cyberpunk_user_actions \
  wp_cyberpunk_shares \
  wp_cyberpunk_reading_progress > "$BACKUP_DIR/cyberpunk_tables_$DATE.sql"

# 3. 压缩备份
gzip "$BACKUP_DIR"/*_$DATE.sql

# 4. 删除30天前的备份
find "$BACKUP_DIR" -name "*.sql.gz" -mtime +30 -delete

echo "Backup completed: $BACKUP_DIR/*_$DATE.sql.gz"
```

### 恢复流程

```bash
# 1. 停止WordPress
systemctl stop apache2

# 2. 解压备份
gunzip -c backup_20260228.sql.gz > restore.sql

# 3. 恢复数据库
mysql -u root -p wordpress_db < restore.sql

# 4. 验证数据
mysql -u root -p wordpress_db -e "SHOW TABLES LIKE 'wp_cyberpunk%';"

# 5. 启动WordPress
systemctl start apache2
```

---

## 常见问题

### Q1: 事件调度器未启动

**症状**: 定时清理任务未执行

**解决方案**:
```sql
-- 临时启用
SET GLOBAL event_scheduler = ON;

-- 永久启用: 编辑 /etc/my.cnf
[mysqld]
event_scheduler=ON

-- 重启MySQL
systemctl restart mysqld
```

### Q2: 表前缀不匹配

**症状**: 表创建成功但查询失败

**解决方案**:
```bash
# 检查WordPress配置
grep "\$table_prefix" wp-config.php

# 重新执行SQL脚本
sed "s/@prefix/your_prefix_/g" CYBERPUNK_DATABASE_COMPLETE.sql | mysql -u root -p db_name
```

### Q3: 性能下降

**症状**: 查询变慢

**诊断步骤**:
```sql
-- 1. 检查慢查询
SHOW VARIABLES LIKE 'slow_query_log%';

-- 2. 启用慢查询日志
SET GLOBAL slow_query_log = 'ON';
SET GLOBAL long_query_time = 2;

-- 3. 分析查询
EXPLAIN SELECT ... ;

-- 4. 优化表
OPTIMIZE TABLE wp_cyberpunk_visits;
```

### Q4: 数据不一致

**症状**: 自定义表与PostMeta数据不匹配

**解决方案**:
```sql
-- 重新同步点赞计数
CALL cyberpunk_sync_like_count(123);

-- 批量同步所有文章
INSERT INTO wp_postmeta (post_id, meta_key, meta_value)
SELECT
  p.ID,
  '_cyberpunk_like_count',
  (SELECT COUNT(*)
   FROM wp_cyberpunk_user_actions
   WHERE post_id = p.ID
   AND action_type = 'like')
FROM wp_posts p
WHERE p.post_status = 'publish'
ON DUPLICATE KEY UPDATE
  meta_value = VALUES(meta_value);
```

---

## 验证测试

### 功能测试

```sql
-- 1. 测试点赞
CALL cyberpunk_increment_views(1);

-- 2. 测试热门文章查询
CALL cyberpunk_get_popular_posts(10, 'post', 30);

-- 3. 测试用户收藏查询
CALL cyberpunk_get_user_bookmarks(1, 10);

-- 4. 查看文章统计
SELECT * FROM wp_cyberpunk_post_stats LIMIT 10;

-- 5. 查看用户活跃度
SELECT * FROM wp_cyberpunk_user_activity LIMIT 10;
```

### 性能测试

```bash
# 使用Apache Bench进行压力测试
ab -n 1000 -c 10 https://your-site.com/

# 预期结果:
# - Requests per second: >100
# - Time per request: <100ms
```

---

## 部署清单

```yaml
部署前:
  ✅ 备份现有数据库
  ✅ 检查MySQL版本 (5.7+)
  ✅ 验证表前缀
  ✅ 检查磁盘空间
  ✅ 准备回滚方案

部署中:
  ✅ 替换表前缀占位符
  ✅ 执行SQL脚本
  ✅ 验证表创建
  ✅ 验证视图创建
  ✅ 验证存储过程
  ✅ 验证事件调度器

部署后:
  ✅ 运行功能测试
  ✅ 运行性能测试
  ✅ 配置监控告警
  ✅ 设置自动备份
  ✅ 更新文档

上线检查:
  ✅ 数据库用户权限最小化
  ✅ 启用事件调度器
  ✅ 配置慢查询日志
  ✅ 设置定期优化任务
  ✅ 配置WordPress缓存
```

---

## 📞 技术支持

- **项目路径**: `/root/.openclaw/workspace/wordpress-cyber-theme`
- **文档位置**: `docs/database/`
- **问题反馈**: 查看故障排查指南

---

**版本**: 2.0.0
**最后更新**: 2026-02-28
**作者**: Database Architect

**🎯 部署成功！**
