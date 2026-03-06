# CyberPress Platform - 数据库快速启动指南

**最后更新**: 2026-03-06
**版本**: 1.0.0

---

## 📋 概述

本指南将帮助你快速设置和初始化 CyberPress Platform 的 PostgreSQL 数据库。

---

## 🔧 前置要求

### 必需软件

- **PostgreSQL**: 15.0 或更高版本
- **Python**: 3.11 或更高版本（用于密码哈希等操作）
- **psql**: PostgreSQL 命令行工具

### 检查安装

```bash
# 检查 PostgreSQL
psql --version

# 检查 Python
python3 --version
```

---

## 🚀 快速开始

### 方式 1: 使用初始化脚本（推荐）

1. **配置环境变量**

```bash
export DB_HOST=localhost
export DB_PORT=5432
export DB_NAME=cyberpress_db
export DB_USER=cyberpress_user
export DB_PASSWORD=your_secure_password
```

2. **运行初始化脚本**

```bash
cd backend/database
chmod +x init-database.sh
./init-database.sh
```

3. **验证安装**

```bash
psql -h $DB_HOST -U $DB_USER -d $DB_NAME -c "\dt"
```

### 方式 2: 手动设置

1. **创建数据库**

```bash
psql -U postgres -c "CREATE DATABASE cyberpress_db ENCODING 'UTF8';"
psql -U postgres -c "CREATE USER cyberpress_user WITH PASSWORD 'your_password';"
psql -U postgres -c "GRANT ALL PRIVILEGES ON DATABASE cyberpress_db TO cyberpress_user;"
```

2. **执行架构脚本**

```bash
psql -U cyberpress_user -d cyberpress_db -f schema/cyberpress-architecture.sql
```

3. **执行迁移脚本**

```bash
psql -U cyberpress_user -d cyberpress_db -f migrations/migrations.sql
```

4. **填充种子数据（可选）**

```bash
psql -U cyberpress_user -d cyberpress_db -f seeds/seeds.sql
```

---

## 📁 文件结构

```
backend/database/
├── schema/
│   ├── cyberpress-architecture.sql    # 完整数据库架构
│   └── README.md                       # 架构文档
├── migrations/
│   └── migrations.sql                  # 数据库迁移
├── seeds/
│   └── seeds.sql                       # 种子数据
├── init-database.sh                    # 初始化脚本
└── README.md                           # 本文档
```

---

## 🔐 默认账户

### 管理员账户

初始化后会创建一个管理员账户：

- **用户名**: `admin`
- **邮箱**: `admin@cyberpress.com`
- **密码**: `admin123`

⚠️ **重要**: 首次登录后请立即修改密码！

### 测试用户

种子数据中包含的测试用户：

| 用户名 | 邮箱 | 密码 | 角色 |
|--------|------|------|------|
| alice | alice@example.com | (与admin相同) | 普通用户 |
| bob | bob@example.com | (与admin相同) | 普通用户 |
| charlie | charlie@example.com | (与admin相同) | 普通用户 |

所有测试用户的密码哈希都是 `admin123` 对应的哈希值。

---

## 🔧 配置

### 环境变量

在项目的 `.env` 文件中配置数据库连接：

```env
# 数据库配置
DATABASE_URL=postgresql://cyberpress_user:your_password@localhost:5432/cyberpress_db
DB_HOST=localhost
DB_PORT=5432
DB_NAME=cyberpress_db
DB_USER=cyberpress_user
DB_PASSWORD=your_password
```

### FastAPI 配置

在 `backend/app/core/config.py` 中：

```python
class Settings(BaseSettings):
    database_url: str = Field(
        default="postgresql://cyberpress_user:password@localhost:5432/cyberpress_db",
        env="DATABASE_URL"
    )
    # ... 其他配置
```

---

## 📊 数据库架构概览

### 核心表

| 表名 | 说明 | 记录数 |
|------|------|--------|
| users | 用户表 | ~6 |
| posts | 文章表 | ~5 |
| categories | 分类表 | ~8 |
| tags | 标签表 | ~20 |
| comments | 评论表 | ~3 |
| likes | 点赞表 | ~10 |
| bookmarks | 收藏表 | ~5 |
| follows | 关注表 | ~10 |
| notifications | 通知表 | ~30 |

### 关系图

```
users (1) ──< (N) posts
users (1) ──< (N) comments
users (1) ──< (N) likes
users (1) ──< (N) bookmarks
users (1) ──< (N) follows
posts (1) ──< (N) comments
posts (1) ──< (N) post_tags (N) tags
```

---

## 🛠️ 常用命令

### 连接数据库

```bash
psql -h localhost -U cyberpress_user -d cyberpress_db
```

### 查看所有表

```sql
\dt
```

### 查看表结构

```sql
\d users
```

### 执行查询

```bash
psql -h localhost -U cyberpress_user -d cyberpress_db -c "SELECT * FROM users;"
```

### 导出数据库

```bash
pg_dump -h localhost -U cyberpress_user cyberpress_db > backup.sql
```

### 导入数据库

```bash
psql -h localhost -U cyberpress_user cyberpress_db < backup.sql
```

---

## 🔍 验证安装

### 检查表是否创建成功

```sql
SELECT table_name, table_type
FROM information_schema.tables
WHERE table_schema = 'public'
ORDER BY table_name;
```

### 检查数据是否填充

```sql
-- 用户数量
SELECT COUNT(*) FROM users;

-- 文章数量
SELECT COUNT(*) FROM posts;

-- 评论数量
SELECT COUNT(*) FROM comments;
```

### 测试查询

```sql
-- 获取最新文章
SELECT
    p.title,
    u.username,
    c.name as category,
    p.published_at
FROM posts p
JOIN users u ON p.author_id = u.id
LEFT JOIN categories c ON p.category_id = c.id
ORDER BY p.published_at DESC
LIMIT 10;
```

---

## 🐛 故障排除

### 问题 1: 连接被拒绝

**错误**: `psql: error: connection refused`

**解决方案**:
1. 检查 PostgreSQL 服务是否运行：
   ```bash
   sudo systemctl status postgresql
   ```
2. 检查 `pg_hba.conf` 配置是否允许本地连接
3. 确认端口号（默认 5432）

### 问题 2: 权限不足

**错误**: `ERROR: permission denied`

**解决方案**:
```sql
GRANT ALL PRIVILEGES ON DATABASE cyberpress_db TO cyberpress_user;
GRANT ALL PRIVILEGES ON SCHEMA public TO cyberpress_user;
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO cyberpress_user;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO cyberpress_user;
```

### 问题 3: 密码哈希错误

**错误**: 密码验证失败

**解决方案**:
使用 Python 生成正确的密码哈希：
```python
import bcrypt
password = "your_password"
hash = bcrypt.hashpw(password.encode(), bcrypt.gensalt()).decode()
print(hash)
```

### 问题 4: 扩展不存在

**错误**: `could not open extension control file`

**解决方案**:
```sql
-- 安装 PostgreSQL 扩展包
sudo apt-get install postgresql-15-postgis-3  # Ubuntu/Debian
```

---

## 📝 下一步

1. **配置后端服务**
   - 更新 `backend/.env` 中的数据库配置
   - 运行数据库迁移：`alembic upgrade head`
   - 启动后端：`uvicorn main:app --reload`

2. **配置前端服务**
   - 更新 `frontend/.env.local` 中的 API 地址
   - 启动前端：`npm run dev`

3. **访问应用**
   - 前端: http://localhost:3000
   - 后端 API: http://localhost:8000
   - API 文档: http://localhost:8000/docs

---

## 📚 相关文档

- [数据库架构文档](./schema/README.md)
- [项目 README](../../README.md)
- [API 文档](../../API_DOCUMENTATION.md)
- [部署指南](../../DEPLOYMENT_GUIDE.md)

---

## 🆘 支持

如有问题，请：

1. 查看上述故障排除部分
2. 检查 PostgreSQL 日志：`/var/log/postgresql/`
3. 在 GitHub Issues 中提问
4. 联系开发团队

---

**版本**: 1.0.0
**最后更新**: 2026-03-06
**维护者**: CyberPress Development Team
