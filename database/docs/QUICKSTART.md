# CyberPress Platform - 数据库快速入门指南

## 🚀 5分钟快速启动

### 第一步：选择数据库

本项目支持两种数据库：

| 数据库 | 版本要求 | 推荐场景 | 安装难度 |
|--------|---------|---------|---------|
| **MySQL** | 8.0+ | 传统部署、简单易用 | ⭐⭐ |
| **PostgreSQL** | 15+ | 高级功能、复杂查询 | ⭐⭐⭐ |

**推荐**: 如果不确定，选择 **PostgreSQL**，它功能更强大。

### 第二步：安装数据库

#### 方案 A: 使用 Docker（推荐）

**MySQL**:
```bash
docker run --name cyberpress-mysql \
  -e MYSQL_ROOT_PASSWORD=your_password \
  -e MYSQL_DATABASE=cyberpress \
  -p 3306:3306 \
  -v mysql-data:/var/lib/mysql \
  -d mysql:8.0
```

**PostgreSQL**:
```bash
docker run --name cyberpress-postgres \
  -e POSTGRES_USER=postgres \
  -e POSTGRES_PASSWORD=your_password \
  -e POSTGRES_DB=cyberpress \
  -p 5432:5432 \
  -v postgres-data:/var/lib/postgresql/data \
  -d postgres:15
```

#### 方案 B: 本地安装

**macOS**:
```bash
# MySQL
brew install mysql
brew services start mysql

# PostgreSQL
brew install postgresql@15
brew services start postgresql@15
```

**Ubuntu**:
```bash
# MySQL
sudo apt-get install mysql-server
sudo systemctl start mysql

# PostgreSQL
sudo apt-get install postgresql-15
sudo systemctl start postgresql
```

### 第三步：初始化数据库

**MySQL**:
```bash
# 进入 Docker 容器
docker exec -it cyberpress-mysql bash

# 或从主机执行
mysql -h 127.0.0.1 -P 3306 -u root -p

# 执行初始化脚本
mysql -u root -p cyberpress < database/schema/01-init-database.sql
```

**PostgreSQL**:
```bash
# 进入 Docker 容器
docker exec -it cyberpress-postgres psql -U postgres

# 或从主机执行
psql -h 127.0.0.1 -p 5432 -U postgres -d cyberpress

# 执行初始化脚本
psql -U postgres -d cyberpress -f database/schema/01-init-database-postgres.sql
```

### 第四步：验证安装

```sql
-- 查看所有表
\dt  -- PostgreSQL
SHOW TABLES;  -- MySQL

-- 查看默认数据
SELECT * FROM categories;
SELECT * FROM tags;

-- 查看表结构
\d users  -- PostgreSQL
DESCRIBE users;  -- MySQL
```

✅ **完成！** 数据库已准备就绪。

---

## 📊 数据库结构概览

### 核心表（必知）

| 表名 | 用途 | 记录数 |
|------|------|--------|
| `users` | 用户信息 | - |
| `posts` | 文章内容 | - |
| `comments` | 文章评论 | - |
| `categories` | 文章分类 | 5条（预设） |
| `tags` | 文章标签 | 10条（预设） |

### 关系图

```
用户(users) → 发布 → 文章(posts)
              ↓ 评论 ↓
           评论(comments)

用户(users) → 关注 → 用户(users)
用户(users) → 点赞 → 文章(posts)
用户(users) → 收藏 → 文章(posts)
```

---

## 🔧 常用操作

### 1. 备份数据库

**MySQL**:
```bash
# 备份
mysqldump -u root -p cyberpress > backup_$(date +%Y%m%d).sql

# 恢复
mysql -u root -p cyberpress < backup_20260307.sql
```

**PostgreSQL**:
```bash
# 备份
pg_dump -U postgres cyberpress > backup_$(date +%Y%m%d).sql

# 恢复
psql -U postgres cyberpress < backup_20260307.sql
```

### 2. 查看数据库大小

**MySQL**:
```sql
SELECT
    table_name AS 'Table',
    ROUND(((data_length + index_length) / 1024 / 1024), 2) AS 'Size (MB)'
FROM information_schema.TABLES
WHERE table_schema = 'cyberpress'
ORDER BY (data_length + index_length) DESC;
```

**PostgreSQL**:
```sql
SELECT
    tablename AS "Table",
    pg_size_pretty(pg_total_relation_size(tablename::regclass)) AS "Size"
FROM pg_tables
WHERE schemaname = 'public'
ORDER BY pg_total_relation_size(tablename::regclass) DESC;
```

### 3. 重置数据库

**⚠️ 警告：此操作会删除所有数据！**

**MySQL**:
```bash
mysql -u root -p -e "DROP DATABASE cyberpress; CREATE DATABASE cyberpress;"
mysql -u root -p cyberpress < database/schema/01-init-database.sql
```

**PostgreSQL**:
```bash
psql -U postgres -c "DROP DATABASE cyberpress;"
psql -U postgres -c "CREATE DATABASE cyberpress;"
psql -U postgres cyberpress < database/schema/01-init-database-postgres.sql
```

---

## 🎯 下一步

### 配置应用连接

**Backend (FastAPI)**:

编辑 `backend/.env`:
```bash
# MySQL
DATABASE_URL=mysql+aiomysql://root:password@localhost:3306/cyberpress

# PostgreSQL
DATABASE_URL=postgresql+asyncpg://postgres:password@localhost:5432/cyberpress
```

**Frontend (Next.js)**:

编辑 `frontend/.env.local`:
```bash
# 如果需要直连数据库（不推荐）
DATABASE_URL=mysql://root:password@localhost:3306/cyberpress

# 推荐：通过 API 访问
NEXT_PUBLIC_API_URL=http://localhost:8000
```

### 插入测试数据

```sql
-- 创建测试用户
INSERT INTO users (username, email, password_hash, status) VALUES
('test_user', 'test@example.com', 'hashed_password', 'active');

-- 创建测试文章
INSERT INTO posts (author_id, title, slug, content, status, published_at) VALUES
(1, 'Hello World', 'hello-world', '# Welcome\n\nThis is my first post!', 'published', NOW());

-- 创建测试评论
INSERT INTO comments (post_id, author_id, content, status) VALUES
(1, 1, 'Great article!', 'approved');
```

### 运行查询测试

```sql
-- 查询所有已发布文章
SELECT * FROM posts WHERE status = 'published';

-- 查询最新10篇文章
SELECT * FROM posts
WHERE status = 'published'
ORDER BY published_at DESC
LIMIT 10;

-- 查询某用户的文章
SELECT * FROM posts
WHERE author_id = 1 AND status = 'published'
ORDER BY published_at DESC;

-- 统计各状态文章数
SELECT status, COUNT(*) as count
FROM posts
GROUP BY status;
```

---

## 🔍 故障排查

### 问题1：无法连接数据库

**症状**:
```
Connection refused: localhost:3306
```

**解决方案**:
```bash
# 检查数据库是否运行
docker ps | grep cyberpress  # Docker
sudo systemctl status mysql  # 本地安装

# 检查端口
netstat -an | grep 3306  # MySQL
netstat -an | grep 5432  # PostgreSQL

# 检查防火墙
sudo ufw allow 3306  # MySQL
sudo ufw allow 5432  # PostgreSQL
```

### 问题2：权限错误

**症状**:
```
ERROR 1045 (28000): Access denied for user 'root'@'localhost'
```

**解决方案**:
```bash
# 重置密码（MySQL）
docker exec -it cyberpress-mysql mysql -u root -p
ALTER USER 'root'@'%' IDENTIFIED WITH mysql_native_password BY 'new_password';
FLUSH PRIVILEGES;

# 重置密码（PostgreSQL）
docker exec -it cyberpress-postgres psql -U postgres
ALTER USER postgres WITH PASSWORD 'new_password';
```

### 问题3：表不存在

**症状**:
```
ERROR 1146: Table 'cyberpress.users' doesn't exist
```

**解决方案**:
```bash
# 确认已执行初始化脚本
mysql -u root -p cyberpress < database/schema/01-init-database.sql

# 验证表是否创建
mysql -u root -p cyberpress -e "SHOW TABLES;"
```

---

## 📚 进阶学习

### 性能优化

1. **索引优化**
   - 查看 [INDEX_DESIGN.md](./INDEX_DESIGN.md)
   - 学习如何创建高效索引

2. **查询优化**
   - 查看 [QUERY_OPTIMIZATION.md](./QUERY_OPTIMIZATION.md)
   - 学习优化慢查询

3. **分区表**
   - `post_views` 表已按年分区
   - 提升大数据量查询性能

### 监控工具

```bash
# 安装 pg_stat_statements (PostgreSQL)
psql -U postgres -d cyberpress -c "CREATE EXTENSION pg_stat_statements;"

# 查看慢查询
SELECT query, calls, mean_time
FROM pg_stat_statements
ORDER BY mean_time DESC
LIMIT 10;
```

### 数据迁移

如果需要从 MySQL 迁移到 PostgreSQL：
- 查看 [MIGRATION_GUIDE.md](./MIGRATION_GUIDE.md)
- 提供完整的迁移方案

---

## 💡 最佳实践

### 1. 定期备份

```bash
# 添加到 crontab
0 2 * * * /path/to/backup-script.sh
```

### 2. 监控慢查询

```sql
-- 启用慢查询日志
SET GLOBAL slow_query_log = 'ON';
SET GLOBAL long_query_time = 1;
```

### 3. 定期维护

```sql
-- 每周执行
VACUUM ANALYZE;  -- PostgreSQL
OPTIMIZE TABLE posts;  -- MySQL
```

### 4. 安全设置

```sql
-- 创建只读用户
CREATE USER 'readonly'@'%' IDENTIFIED BY 'secure_password';
GRANT SELECT ON cyberpress.* TO 'readonly'@'%';
```

---

## 🆘 获取帮助

遇到问题？

1. **查看文档**
   - [ER图设计](./ER_DIAGRAM.md)
   - [表结构定义](./TABLE_DEFINITIONS.md)
   - [索引设计](./INDEX_DESIGN.md)

2. **检查日志**
   ```bash
   # Docker 日志
   docker logs cyberpress-mysql
   docker logs cyberpress-postgres
   ```

3. **社区支持**
   - 提交 Issue
   - 查看已有问题

---

**恭喜！** 🎉 你已成功配置 CyberPress 数据库。

现在可以：
- ✅ 启动后端服务
- ✅ 运行前端应用
- ✅ 开始开发和测试

**下一步**: 查看 [项目主 README](../../README.md) 了解完整的启动流程。
