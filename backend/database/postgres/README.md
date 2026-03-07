# CyberPress Platform - PostgreSQL 数据库文档

## 📋 概述

CyberPress Platform 是一个赛博朋克风格的博客平台，使用 PostgreSQL 作为主要数据库。本文档提供了完整的数据库架构、表结构、索引设计和初始化指南。

## 🗂️ 文件列表

### 数据库架构文件

| 文件名 | 说明 | 优先级 |
|--------|------|--------|
| `architecture.sql` | 完整的数据库架构脚本（包含表、索引、触发器、视图） | ⭐⭐⭐ |
| `01-init-database.sql` | 数据库初始化脚本（创建数据库、用户、扩展） | ⭐⭐⭐ |
| `02-seed-data.sql` | 种子数据脚本（插入测试数据） | ⭐⭐ |

### 文档文件

| 文件名 | 说明 |
|--------|------|
| `ER_DIAGRAM.md` | 数据库实体关系图（ER图） |
| `TABLE_STRUCTURE.md` | 详细的表结构说明 |
| `INDEX_DESIGN.md` | 索引设计和优化指南 |
| `README.md` | 本文件 |

## 🚀 快速开始

### 步骤 1: 安装 PostgreSQL

确保你的系统已安装 PostgreSQL 14 或更高版本。

```bash
# 检查 PostgreSQL 版本
psql --version
```

### 步骤 2: 初始化数据库

```bash
# 进入数据库目录
cd backend/database/postgres

# 初始化数据库（创建数据库和用户）
psql -U postgres -d postgres -f 01-init-database.sql
```

### 步骤 3: 创建架构

```bash
# 创建表结构、索引、触发器等
psql -U cyberpress_user -d cyberpress_db -f architecture.sql
```

### 步骤 4: 导入种子数据（可选）

```bash
# 导入测试数据
psql -U cyberpress_user -d cyberpress_db -f 02-seed-data.sql
```

## 📊 数据库结构

### 核心表

1. **users** - 用户表
   - 存储用户信息（管理员、作者、订阅者等）
   - 支持软删除和扩展元数据

2. **posts** - 文章表
   - 存储文章、页面等内容
   - 支持多种状态（草稿、已发布、私密等）
   - 全文搜索支持

3. **categories** - 分类表
   - 支持多级分类
   - 自动文章计数

4. **tags** - 标签表
   - 灵活的标签系统
   - 自动文章计数

5. **comments** - 评论表
   - 支持嵌套回复
   - 支持匿名评论

6. **media** - 媒体表
   - 存储上传的文件信息
   - 支持多种媒体类型

### 关系表

- **post_categories** - 文章分类关系
- **post_tags** - 文章标签关系

### 元数据表

- **options** - 系统配置
- **user_meta** - 用户扩展信息
- **post_meta** - 文章扩展信息

## 🔑 关键特性

### 1. UUID 主键

所有表使用 UUID 作为主键，提供更好的分布式支持和安全性。

### 2. 软删除

用户、文章、评论支持软删除，数据不会物理删除，只在查询时过滤。

### 3. JSONB 元数据

多个表包含 JSONB 字段，支持灵活的扩展数据存储。

### 4. 全文搜索

PostgreSQL 原生全文搜索，支持英文和中文（需要配置）。

### 5. 自动维护

触发器自动更新：
- `updated_at` 时间戳
- 分类/标签文章计数
- 文章评论计数

### 6. 性能优化

- 完善的索引设计
- 物化视图
- 查询优化

## 📈 性能优化

### 索引策略

- **B-Tree 索引**: 等值查询、范围查询、排序
- **GIN 索引**: 全文搜索、JSONB 查询
- **部分索引**: 仅索引常用子集

### 查询优化

```sql
-- 使用 EXPLAIN ANALYZE 分析查询
EXPLAIN ANALYZE
SELECT * FROM posts
WHERE status = 'publish'
ORDER BY published_at DESC
LIMIT 10;

-- 全文搜索
SELECT * FROM posts
WHERE to_tsvector('english', title || ' ' || content)
  @@ to_tsquery('search')
  AND status = 'publish';
```

### 维护命令

```sql
-- 清理死元组
VACUUM ANALYZE posts;

-- 重建索引
REINDEX TABLE posts;

-- 分析表
ANALYZE posts;
```

## 🔧 配置说明

### 数据库连接

```env
# .env
DATABASE_URL=postgresql://cyberpress_user:password@localhost:5432/cyberpress_db
```

### 性能调优

编辑 `postgresql.conf`：

```conf
# 内存配置
shared_buffers = 256MB
effective_cache_size = 1GB
maintenance_work_mem = 64MB

# 连接配置
max_connections = 100

# WAL 配置
wal_buffers = 16MB
checkpoint_completion_target = 0.9
```

## 🧪 测试账号

种子数据创建了以下测试账号：

| 角色 | 用户名 | 密码 |
|------|--------|------|
| 管理员 | admin | password123 |
| 作者 | author1 | password123 |
| 用户 | user1 | password123 |

⚠️ **警告**: 这些账号仅用于开发，生产环境请修改密码！

## 📚 文档索引

- [ER 图](./ER_DIAGRAM.md) - 查看数据库关系图
- [表结构](./TABLE_STRUCTURE.md) - 详细的字段说明
- [索引设计](./INDEX_DESIGN.md) - 索引优化指南

## 🔐 安全建议

1. **修改默认密码**
   ```sql
   ALTER USER cyberpress_user WITH PASSWORD 'your_secure_password';
   ```

2. **限制访问**
   - 配置 `pg_hba.conf` 限制访问IP
   - 使用防火墙保护数据库端口

3. **启用 SSL**（生产环境）
   ```conf
   ssl = on
   ssl_cert_file = 'server.crt'
   ssl_key_file = 'server.key'
   ```

4. **定期备份**
   ```bash
   pg_dump -U cyberpress_user cyberpress_db > backup.sql
   ```

## 🛠️ 常用命令

### 连接数据库

```bash
psql -U cyberpress_user -d cyberpress_db
```

### 导出数据库

```bash
pg_dump -U cyberpress_user cyberpress_db > backup.sql
```

### 导入数据库

```bash
psql -U cyberpress_user cyberpress_db < backup.sql
```

### 查看表大小

```sql
SELECT
  tablename,
  pg_size_pretty(pg_total_relation_size(tablename::regclass)) AS size
FROM pg_tables
WHERE schemaname = 'public'
ORDER BY pg_total_relation_size(tablename::regclass) DESC;
```

### 查看索引使用情况

```sql
SELECT
  schemaname,
  tablename,
  indexname,
  idx_scan as scans
FROM pg_stat_user_indexes
ORDER BY idx_scan DESC;
```

## 📞 支持

如有问题，请查看：

1. [PostgreSQL 官方文档](https://www.postgresql.org/docs/)
2. [项目主文档](../../../README.md)
3. 提交 Issue

## 📝 更新日志

### v1.0.0 (2026-03-08)

- ✅ 初始版本发布
- ✅ 完整的数据库架构
- ✅ 11 个核心表
- ✅ 完善的索引设计
- ✅ 触发器和视图
- ✅ 种子数据脚本
- ✅ 完整的文档

## 📄 许可证

MIT License

---

**作者**: Claude (Database Architect)
**创建时间**: 2026-03-08
**版本**: 1.0.0
