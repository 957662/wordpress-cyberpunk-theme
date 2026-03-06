# CyberPress Platform - 数据库架构文档

## 📚 文档导航

本文档包含 CyberPress Platform 数据库架构的完整文档集合。

### 核心文档

1. [ER图（实体关系图）](./ER_DIAGRAM.md)
   - 完整的数据库实体关系图
   - 表之间的关系说明
   - 数据流向图
   - 设计特点分析

2. [表结构详细文档](./TABLE_STRUCTURE.md)
   - 每个表的详细字段说明
   - 索引设计
   - 触发器配置
   - 约束和默认值

3. [索引设计文档](./INDEX_DESIGN.md)
   - 索引设计原则
   - 各表索引详情
   - 全文搜索索引
   - 索引优化策略
   - 索引维护建议

4. [初始化脚本](../../backend/database/init/00-complete-schema.sql)
   - 完整的数据库初始化脚本
   - 包含所有表、索引、触发器
   - 初始数据
   - 即用型SQL

### 运维文档

5. [优化指南](./OPTIMIZATION_GUIDE.md)
   - 查询优化技巧
   - 索引优化
   - 表结构优化
   - 缓存策略
   - 分区策略
   - 性能测试

6. [迁移指南](./MIGRATION_GUIDE.md)
   - 数据库版本控制
   - 迁移脚本编写
   - 回滚策略
   - 迁移工具
   - 最佳实践

7. [备份恢复](./BACKUP_RESTORE.md)
   - 备份策略
   - 自动备份脚本
   - 恢复流程
   - 灾难恢复计划
   - 监控与告警

8. [安全最佳实践](./SECURITY_BEST_PRACTICES.md)
   - 访问控制
   - 数据加密
   - SQL注入防护
   - 审计日志
   - 安全配置
   - 漏洞扫描

---

## 🗄️ 数据库概览

### 技术栈

- **数据库**: PostgreSQL 15+
- **扩展**: uuid-ossp, pg_trgm, btree_gin, pgcrypto
- **连接池**: PgBouncer (可选)
- **备份**: pg_dump, WAL归档
- **监控**: pg_stat_statements, pgBadger

### 核心表结构

```
┌─────────────────┐
│     users       │ 用户表
├─────────────────┤
│ user_sessions   │ 会话表
│ user_preferences│ 偏好设置
└─────────────────┘
        ↓
┌─────────────────┐
│  categories     │ 分类表
│  tags          │ 标签表
└─────────────────┘
        ↓
┌─────────────────┐
│     posts       │ 文章表
├─────────────────┤
│ post_tags      │ 文章标签关联
│ post_meta      │ 文章元数据
└─────────────────┘
        ↓
┌─────────────────┐
│   comments      │ 评论表
├─────────────────┤
│ comment_likes  │ 评论点赞
└─────────────────┘
        ↓
┌─────────────────┐
│ notifications   │ 通知表
│ activity_log   │ 活动日志
│ page_views     │ 页面浏览
└─────────────────┘
```

### 关键特性

- ✅ **UUID主键**: 分布式友好，安全性高
- ✅ **全文搜索**: PostgreSQL GIN索引，高性能搜索
- ✅ **软删除**: 通过status字段实现软删除
- ✅ **审计日志**: 完整的操作审计追踪
- ✅ **时间戳**: 所有表都有created_at/updated_at
- ✅ **层级结构**: 支持分类和评论的层级结构
- ✅ **JSONB**: 灵活的JSON数据存储
- ✅ **触发器**: 自动更新统计信息
- ✅ **部分索引**: 优化索引大小和性能
- ✅ **物化视图**: 加速复杂查询

---

## 🚀 快速开始

### 1. 初始化数据库

```bash
# 连接到 PostgreSQL
psql -U postgres

# 创建数据库和用户
CREATE DATABASE cyberpress_db;
CREATE USER cyberpress_app WITH PASSWORD 'your_password';
GRANT ALL PRIVILEGES ON DATABASE cyberpress_db TO cyberpress_app;

# 退出并连接到新数据库
\q
psql -U cyberpress_app -d cyberpress_db

# 执行初始化脚本
\i backend/database/init/00-complete-schema.sql
```

### 2. 配置环境变量

```bash
# .env
DB_HOST=localhost
DB_PORT=5432
DB_NAME=cyberpress_db
DB_USER=cyberpress_app
DB_PASSWORD=your_password
```

### 3. 使用数据库客户端

```typescript
// frontend/lib/api/database-client.ts
import {
  findUserByEmail,
  findPublishedPosts,
  searchPosts
} from '@/lib/api/database-client';

// 查询用户
const user = await findUserByEmail('user@example.com');

// 查询文章列表
const { data: posts, total } = await findPublishedPosts({
  limit: 10,
  offset: 0
});

// 全文搜索
const results = await searchPosts('react nextjs', { limit: 20 });
```

---

## 📊 数据库统计

### 表数量统计

| 类别 | 数量 |
|------|------|
| 核心业务表 | 15+ |
| 系统表 | 5+ |
| 视图 | 3+ |
| 函数 | 10+ |
| 触发器 | 15+ |

### 索引统计

| 类型 | 数量 |
|------|------|
| B-tree索引 | 40+ |
| GIN索引 | 5+ |
| BRIN索引 | 2+ |
| 部分索引 | 10+ |

### 预估数据量

| 表名 | 预估行数 | 年增长率 |
|------|---------|---------|
| users | 1K-100K | 20% |
| posts | 10K-1M | 50% |
| comments | 100K-10M | 100% |
| page_views | 1M-1B | 200% |

---

## 🔧 性能指标

### 查询性能目标

| 查询类型 | 目标响应时间 |
|---------|-------------|
| 首页文章列表 | < 50ms |
| 文章详情页 | < 30ms |
| 全文搜索 | < 100ms |
| 评论列表 | < 50ms |
| 用户登录 | < 100ms |

### 优化策略

- ✅ 使用部分索引减少索引大小
- ✅ 使用物化视图缓存复杂查询
- ✅ 使用连接池减少连接开销
- ✅ 使用 Redis 缓存热点数据
- ✅ 定期 VACUUM 和 ANALYZE
- ✅ 监控慢查询并优化

---

## 🔒 安全措施

### 访问控制

- ✅ 最小权限原则
- ✅ 专用数据库用户
- ✅ SSL/TLS 加密连接
- ✅ IP 白名单限制

### 数据保护

- ✅ 密码使用 bcrypt 哈希
- ✅ 敏感字段加密存储
- ✅ SQL 注入防护
- ✅ 完整的审计日志

### 备份策略

- ✅ 每日完整备份
- ✅ 每小时增量备份
- ✅ WAL 日志归档
- ✅ 异地备份存储

---

## 📈 监控指标

### 关键指标

- 连接数使用率
- 查询响应时间
- 慢查询数量
- 缓存命中率
- 磁盘使用率
- 复制延迟（如果有）

### 告警规则

- 连接数 > 80%
- 慢查询 > 1s
- 磁盘使用 > 80%
- 备份失败
- 复制延迟 > 10s

---

## 🔄 运维流程

### 日常维护

```bash
# 每日任务
0 2 * * * /usr/local/bin/backup-cyberpress.sh        # 备份
0 3 * * * /usr/local/bin/vacuum-database.sh          # 清理
0 4 * * * /usr/local/bin/analyze-database.sh         # 分析
0 */6 * * * /usr/local/bin/check-backup.sh           # 检查备份

# 每周任务
0 5 * * 0 /usr/local/bin/cleanup-old-logs.sh         # 清理日志
0 6 * * 0 /usr/local/bin/optimize-tables.sh          # 优化表
```

### 升级流程

1. 在开发环境测试
2. 在测试环境验证
3. 备份生产数据库
4. 执行迁移脚本
5. 验证数据完整性
6. 监控应用性能

---

## 📞 故障排查

### 常见问题

#### 问题：连接池耗尽

```bash
# 检查当前连接数
SELECT count(*) FROM pg_stat_activity;

# 查看长时间运行的查询
SELECT pid, now() - query_start as duration, query
FROM pg_stat_activity
WHERE state = 'active'
ORDER BY duration DESC;

# 终止长时间运行的查询
SELECT pg_terminate_backend(pid);
```

#### 问题：查询慢

```sql
-- 分析查询计划
EXPLAIN ANALYZE SELECT * FROM posts WHERE status = 'published';

-- 检查索引使用情况
SELECT * FROM pg_stat_user_indexes WHERE schemaname = 'public';

-- 更新统计信息
ANALYZE posts;
```

#### 问题：磁盘空间不足

```bash
# 清理旧 WAL 文件
pg_archivecleanup /var/lib/postgresql/wal_archive 000000010000000000000001

# 清理旧备份
find /var/backups/postgresql -name "*.backup.gz" -mtime +7 -delete

# VACUUM FULL 表（需要锁表）
VACUUM FULL posts;
```

---

## 🎯 最佳实践

### 开发阶段

- ✅ 使用参数化查询
- ✅ 避免 SELECT *
- ✅ 使用事务保证数据一致性
- ✅ 合理使用索引
- ✅ 定期测试查询性能

### 生产环境

- ✅ 启用慢查询日志
- ✅ 定期备份和恢复测试
- ✅ 监控数据库性能
- ✅ 设置告警规则
- ✅ 定期安全扫描

### 代码审查

- ✅ SQL 语句审查
- ✅ 权限检查
- ✅ 性能评估
- ✅ 安全风险识别

---

## 📚 相关资源

### 官方文档

- [PostgreSQL 文档](https://www.postgresql.org/docs/)
- [pgcrypto 加密扩展](https://www.postgresql.org/docs/current/pgcrypto.html)
- [全文搜索](https://www.postgresql.org/docs/current/textsearch.html)

### 工具

- [pgAdmin](https://www.pgadmin.org/) - 图形化管理工具
- [psql](https://www.postgresql.org/docs/current/app-psql.html) - 命令行工具
- [pg_dump](https://www.postgresql.org/docs/current/app-pgdump.html) - 备份工具
- [pgBadger](https://dalibo.github.io/pgbadger/) - 日志分析工具

### 社区

- [PostgreSQL 论坛](https://www.postgresql.org/list/)
- [Stack Overflow](https://stackoverflow.com/questions/tagged/postgresql)
- [Reddit r/PostgreSQL](https://reddit.com/r/PostgreSQL)

---

## 📝 更新日志

### v1.0.0 (2024-01-01)

- ✅ 初始数据库结构
- ✅ 核心功能表（用户、文章、评论）
- ✅ 全文搜索支持
- ✅ 基础索引和触发器

### v1.1.0 (2024-01-15)

- ✅ 添加全文搜索优化
- ✅ 添加阅读列表功能
- ✅ 性能优化索引
- ✅ 物化视图

### v1.2.0 (2024-02-01)

- ✅ 添加社交功能（关注、点赞）
- ✅ 添加活动日志
- ✅ 审计触发器
- ✅ 安全增强

### v1.3.0 (2024-02-15)

- ✅ 添加阅读列表
- ✅ 添加阅读历史
- ✅ 性能监控表
- ✅ 备份优化

### v1.4.0 (2024-03-01)

- ✅ 性能优化
- ✅ 分区支持
- ✅ 缓存策略
- ✅ 灾难恢复

---

## 👥 贡献者

数据库架构设计由 AI 团队完成，包括：
- 🤖 AI 数据库架构师
- 🤖 AI 后端开发工程师
- 🤖 AI DevOps 工程师
- 🤖 AI 安全专家

---

## 📄 许可证

MIT License - 详见项目根目录 LICENSE 文件

---

## 🙏 致谢

感谢 PostgreSQL 社区的优秀工作和持续支持！

---

**最后更新**: 2026-03-06
**文档版本**: 1.4.0
**维护者**: CyberPress Development Team
