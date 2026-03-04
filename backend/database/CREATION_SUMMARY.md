# CyberPress Platform - 数据库创建总结

## ✅ 已创建的文件

### 📁 目录结构

```
backend/database/
├── er-diagram.md                          # ER 实体关系图
├── README.md                              # 完整数据库文档
├── QUICKREF.md                            # 快速参考手册
├── schema/                                # 表结构定义
│   ├── 01-core-schema.sql                 # 核心表（用户、文章、评论等）
│   ├── 02-social-schema.sql               # 社交功能表（关注、动态、通知）
│   ├── 03-analytics-schema.sql            # 分析统计表（事件、浏览、性能）
│   └── 04-auth-schema.sql                 # 认证授权表（令牌、角色、权限）
├── indexes/                               # 索引定义
│   └── performance-indexes.sql            # 性能优化索引
└── init/                                  # 初始化脚本
    ├── 00-drop-all.sql                    # 删除所有表
    ├── 01-init-database.sql               # 完整初始化脚本
    └── 02-seed-data.sql                   # 示例数据
```

---

## 📊 数据库架构概览

### 核心模块

#### 1. 用户系统（3个表）
- **users** - 用户主表
- **user_profiles** - 用户资料（一对一）
- **user_settings** - 用户设置（一对一）

#### 2. 内容管理（7个表）
- **posts** - 文章主表
- **post_meta** - 文章元数据
- **categories** - 分类（树形结构）
- **tags** - 标签
- **post_categories** - 文章分类关联（多对多）
- **post_tags** - 文章标签关联（多对多）
- **media** - 媒体文件

#### 3. 评论系统（2个表）
- **comments** - 评论（支持嵌套）
- **comment_likes** - 评论点赞

#### 4. 社交功能（11个表）
- **user_follows** - 用户关注关系
- **follow_requests** - 关注请求
- **activities** - 用户动态
- **activity_likes** - 动态点赞
- **activity_comments** - 动态评论
- **notifications** - 通知
- **notification_preferences** - 通知偏好
- **conversations** - 会话
- **conversation_participants** - 会话参与者
- **messages** - 消息
- **message_read_status** - 消息阅读状态

#### 5. 分析统计（8个表）
- **analytics_events** - 通用分析事件
- **page_views** - 页面浏览（分区表）
- **sessions** - 用户会话
- **post_statistics** - 文章统计（每日）
- **user_statistics** - 用户统计（每日）
- **api_performance** - API 性能监控
- **query_performance** - 查询性能监控
- **search_queries** - 搜索查询统计

#### 6. 认证授权（11个表）
- **api_tokens** - API 访问令牌
- **refresh_tokens** - 刷新令牌
- **authorization_codes** - OAuth 授权码
- **roles** - 角色
- **permissions** - 权限
- **role_permissions** - 角色权限关联
- **user_roles** - 用户角色关联
- **audit_logs** - 审计日志
- **login_history** - 登录历史
- **two_factor_auth** - 两步认证配置
- **two_factor_attempts** - 两步认证尝试

**总计：42 个表**

---

## 🎯 关键特性

### 1. 数据完整性
- ✅ 外键约束确保引用完整性
- ✅ CHECK 约束验证数据有效性
- ✅ 唯一约束防止重复数据
- ✅ 触发器自动更新统计字段

### 2. 性能优化
- ✅ 主键索引（所有表）
- ✅ 唯一索引（关键字段）
- ✅ 复合索引（常见查询）
- ✅ 全文搜索索引（GIN）
- ✅ 条件索引（部分索引）
- ✅ 表达式索引（函数索引）
- ✅ 分区表（page_views）

### 3. 安全性
- ✅ 密码哈希（bcrypt）
- ✅ API 令牌加密
- ✅ SQL 注入防护（参数化查询）
- ✅ 审计日志
- ✅ 两步认证支持
- ✅ 权限管理系统

### 4. 可扩展性
- ✅ 模块化设计
- ✅ 软删除支持（deleted_at）
- ✅ JSONB 字段（灵活数据）
- ✅ 分区表（大数据量）
- ✅ 物化视图（复杂查询）

---

## 🚀 快速开始

### 1. 安装 PostgreSQL

```bash
# Ubuntu/Debian
sudo apt-get install postgresql-15 postgresql-contrib-15

# macOS
brew install postgresql@15
```

### 2. 创建数据库

```bash
sudo -u postgres psql
CREATE DATABASE cyberpress_platform;
CREATE USER cyberpress_app WITH PASSWORD 'your_password';
GRANT ALL PRIVILEGES ON DATABASE cyberpress_platform TO cyberpress_app;
\q
```

### 3. 初始化数据库

```bash
cd backend/database

# 方式1：一键初始化（推荐）
psql -U postgres -d cyberpress_platform -f init/01-init-database.sql

# 方式2：分步初始化
psql -U postgres -d cyberpress_platform -f schema/01-core-schema.sql
psql -U postgres -d cyberpress_platform -f schema/02-social-schema.sql
psql -U postgres -d cyberpress_platform -f schema/03-analytics-schema.sql
psql -U postgres -d cyberpress_platform -f schema/04-auth-schema.sql
psql -U postgres -d cyberpress_platform -f indexes/performance-indexes.sql
```

### 4. 插入示例数据（可选）

```bash
psql -U postgres -d cyberpress_platform -f init/02-seed-data.sql
```

### 5. 验证安装

```bash
psql -U postgres -d cyberpress_platform -c "\dt"
```

应该看到所有已创建的表。

---

## 📖 使用指南

### 连接数据库

```bash
psql -U postgres -d cyberpress_platform
```

### 查看表结构

```sql
-- 查看所有表
\dt

-- 查看特定表结构
\d posts

-- 查看索引
\di
```

### 常用查询

```sql
-- 获取最新文章
SELECT p.*, u.username
FROM posts p
LEFT JOIN users u ON p.author_id = u.id
WHERE p.status = 'publish'
ORDER BY p.published_at DESC
LIMIT 10;

-- 搜索用户
SELECT * FROM users
WHERE username ILIKE '%keyword%'
OR email ILIKE '%keyword%';

-- 获取用户统计
SELECT
    COUNT(*) FILTER (WHERE status = 'active') AS active_users,
    COUNT(*) FILTER (WHERE created_at > CURRENT_DATE - INTERVAL '7 days') AS new_users
FROM users;
```

---

## 🔧 维护命令

### 日常维护

```sql
-- 更新统计信息
ANALYZE;

-- 清理死元组
VACUUM;

-- 完全清理
VACUUM FULL ANALYZE;

-- 重建索引
REINDEX DATABASE cyberpress_platform;
```

### 备份

```bash
# 逻辑备份
pg_dump -U postgres cyberpress_platform -F c -f backup.dump

# SQL 格式备份
pg_dump -U postgres cyberpress_platform -f backup.sql

# 恢复
pg_restore -U postgres -d cyberpress_platform backup.dump
```

---

## 📚 文档索引

1. **[README.md](README.md)** - 完整数据库文档
   - 详细表结构说明
   - 索引设计
   - 性能优化指南
   - 备份与恢复
   - 安全建议

2. **[er-diagram.md](er-diagram.md)** - ER 实体关系图
   - 完整的表关系图
   - 表关系说明
   - 索引策略

3. **[QUICKREF.md](QUICKREF.md)** - 快速参考手册
   - 常用命令
   - 查询示例
   - 性能优化
   - 故障排查

---

## 🎨 设计亮点

### 1. 软删除支持
所有核心表都包含 `deleted_at` 字段，支持数据恢复。

### 2. 时间戳自动更新
使用触发器自动更新 `updated_at` 字段。

### 3. 统计数据自动维护
通过触发器自动更新 `comment_count`、`post_count` 等统计字段。

### 4. 全文搜索
使用 PostgreSQL 的 GIN 索引支持中文全文搜索。

### 5. 分区表
`page_views` 表按月分区，提高查询性能和数据管理效率。

### 6. JSONB 灵活性
使用 JSONB 字段存储复杂数据结构，如社交链接、设置等。

### 7. 审计日志
完整的审计日志系统，记录所有重要操作。

---

## 🔒 安全建议

1. **修改默认密码**
   - 默认管理员密码：`admin123`
   - 生产环境必须修改！

2. **限制数据库访问**
   - 配置 `pg_hba.conf` 限制 IP 访问
   - 使用 SSL/TLS 加密连接

3. **定期备份**
   - 设置自动备份计划
   - 测试备份恢复流程

4. **监控日志**
   - 启用慢查询日志
   - 定期检查审计日志

5. **更新权限**
   - 遵循最小权限原则
   - 定期审查用户权限

---

## 📊 性能指标

### 预期性能

- 用户查询：< 10ms
- 文章列表查询：< 50ms
- 全文搜索：< 100ms
- 统计查询：< 200ms

### 优化策略

1. **索引覆盖** - 创建覆盖索引减少回表
2. **分区表** - 大表按时间分区
3. **连接池** - 使用 PgBouncer
4. **缓存** - 应用层 Redis 缓存
5. **物化视图** - 复杂统计查询

---

## 🎯 下一步

### 1. 应用集成
- 配置应用数据库连接
- 实现 ORM 模型
- 编写数据访问层

### 2. API 开发
- 创建 RESTful API
- 实现 GraphQL 接口
- 添加实时功能（WebSocket）

### 3. 测试
- 单元测试
- 集成测试
- 性能测试

### 4. 部署
- 配置生产环境
- 设置监控
- 配置自动备份

---

## 📝 更新日志

### v1.0 (2026-03-05)
- ✅ 创建核心表结构
- ✅ 实现社交功能
- ✅ 添加分析统计
- ✅ 完善认证授权
- ✅ 创建性能索引
- ✅ 编写完整文档

---

## 👥 贡献

欢迎提交 Issue 和 Pull Request！

---

## 📄 许可证

MIT License

---

**文档版本**: v1.0
**创建日期**: 2026-03-05
**维护者**: CyberPress Team
**数据库版本**: PostgreSQL 15+
**表总数**: 42
**索引总数**: 100+

---

## 🎉 完成

数据库设计已完成！所有文件都已创建并放置在正确的目录中。

### 文件清单

✅ `/backend/database/er-diagram.md` - ER 图
✅ `/backend/database/schema/01-core-schema.sql` - 核心表结构
✅ `/backend/database/schema/02-social-schema.sql` - 社交功能表
✅ `/backend/database/schema/03-analytics-schema.sql` - 分析统计表
✅ `/backend/database/schema/04-auth-schema.sql` - 认证授权表
✅ `/backend/database/indexes/performance-indexes.sql` - 性能索引
✅ `/backend/database/init/00-drop-all.sql` - 删除脚本
✅ `/backend/database/init/01-init-database.sql` - 初始化脚本
✅ `/backend/database/init/02-seed-data.sql` - 示例数据
✅ `/backend/database/README.md` - 完整文档
✅ `/backend/database/QUICKREF.md` - 快速参考

所有文件都是完整、可运行的代码，没有占位符！🚀
