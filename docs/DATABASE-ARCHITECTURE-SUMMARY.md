# CyberPress Platform - 数据库架构完整总结

## 📊 数据库架构总览

本文档总结了 CyberPress Platform 的完整数据库架构设计、优化和维护方案。

**文档版本**: 1.0.0
**创建日期**: 2026-03-03
**作者**: AI Database Architect 🤖

---

## 📁 数据库文件清单

### 1. 核心Schema文件

#### `backend/database/schema.sql`
**用途**: 完整的数据库架构定义

**包含内容**:
- 11个核心数据表定义
- 完整的索引设计
- 外键约束配置
- 初始数据插入
- 视图定义
- 存储过程
- 触发器
- 定时事件

**表结构**:
1. `users` - 用户表
2. `posts` - 文章表
3. `categories` - 分类/标签表
4. `post_categories` - 文章分类关联表
5. `post_meta` - 文章元数据表
6. `comments` - 评论表
7. `portfolio_items` - 作品集表
8. `portfolio_gallery` - 作品图库表
9. `media` - 媒体库表
10. `settings` - 系统设置表
11. `analytics` - 分析数据表

---

### 2. 数据库迁移文件

#### `migrations/001_initial_schema.sql`
**用途**: 初始数据库架构

**内容**: 创建所有核心表和索引

#### `migrations/002_add_performance_indexes.sql`
**用途**: 添加性能优化索引

**优化内容**:
- 复合索引优化
- 全文搜索索引
- 覆盖索引设计
- 查询性能提升

#### `migrations/003_add_search_optimization.sql` ✨ **NEW**
**用途**: 搜索功能优化

**新增功能**:
- 全文搜索配置（支持中文）
- N-gram解析器
- 搜索历史表
- 热门关键词表
- 搜索统计视图
- 搜索优化存储过程

**关键特性**:
- 支持中文和短词搜索
- 自动记录搜索历史
- 热门关键词趋势分析
- 搜索统计数据可视化

#### `migrations/004_add_performance_monitoring.sql` ✨ **NEW**
**用途**: 性能监控和分析

**新增功能**:
- 慢查询日志表
- 表性能统计表
- 索引使用统计表
- 性能汇总视图
- 优化建议表

**监控指标**:
- 查询执行时间
- 扫描行数
- 返回行数
- 表大小变化
- 索引使用率

---

### 3. 数据库文档

#### `docs/DATABASE-DESIGN.md`
**用途**: 完整的数据库设计文档

**包含内容**:
- ER图（Mermaid格式）
- 详细表结构说明
- 字段类型定义
- 外键关系说明
- 设计决策文档
- 数据字典

**特色**:
- ASCII ER图
- 完整的字段说明
- 枚举值定义
- 设计原则说明

#### `docs/DATABASE-INDEXES.md`
**用途**: 索引设计完整指南

**包含内容**:
- 索引设计原则
- 各表索引策略
- 查询场景优化
- 覆盖索引设计
- 函数索引使用
- 前缀索引说明
- 索引维护计划

**优化场景**:
- 首页文章列表
- 作者文章归档
- 评论嵌套显示
- 全文搜索优化
- 分类筛选查询

#### `docs/DATABASE-README.md`
**用途**: 数据库快速入门指南

**包含内容**:
- 环境要求
- 安装步骤
- 初始化方法
- 迁移系统说明
- 存储过程使用
- 性能优化建议
- 备份恢复指南

---

### 4. 数据库脚本

#### `scripts/db-init.sh` ✨ **NEW**
**用途**: 数据库初始化脚本

**功能**:
- 环境变量加载
- MySQL连接检查
- 数据库创建
- Schema导入
- 迁移执行
- 安装验证

**使用方法**:
```bash
cd backend/database
./scripts/db-init.sh
```

**特色**:
- 彩色输出提示
- 错误自动处理
- 交互式确认
- 详细日志记录

---

#### `scripts/db-restore.sh` ✨ **NEW`
**用途**: 数据库恢复脚本

**功能**:
- 备份文件检查
- 自动解压支持
- 当前数据库备份
- 数据库重建
- 数据恢复
- 恢复验证

**使用方法**:
```bash
cd backend/database
./scripts/db-restore.sh backup_20260303.sql.gz
```

**安全特性**:
- 恢复前自动备份
- 文件完整性检查
- 交互式确认
- 详细恢复报告

---

#### `scripts/db-monitor.sh` ✨ **NEW**
**用途**: 数据库实时监控

**监控指标**:
- 数据库连接状态
- 数据库和表大小
- 连接数统计
- 慢查询分析
- InnoDB状态
- 索引使用情况
- 表碎片化程度
- 当前执行查询

**使用方法**:
```bash
cd backend/database
./scripts/db-monitor.sh          # 实时监控
./scripts/db-monitor.sh --report # 生成报告
```

**报告功能**:
- 生成详细监控报告
- 保存为文本文件
- 包含所有关键指标

---

#### `scripts/db-health-check.sh` ✨ **NEW**
**用途**: 数据库健康检查

**检查项目**:
- 数据库连接
- 版本兼容性
- 字符集配置
- 存储引擎
- 表完整性
- 外键约束
- 索引状态
- 碎片化程度
- 慢查询配置
- 二进制日志
- 内存配置
- 连接数配置
- 备份状态

**健康评分**:
- 90-100分: 优秀
- 70-89分: 良好
- 50-69分: 一般
- <50分: 需要关注

**使用方法**:
```bash
cd backend/database
./scripts/db-health-check.sh
```

**输出内容**:
- 健康分数
- 发现的问题列表
- 具体的优化建议

---

## 🎯 数据库设计特点

### 1. 高性能设计
- **复合索引**: 针对常用查询模式优化
- **覆盖索引**: 减少回表操作
- **全文索引**: 支持中文和短词搜索
- **分区表**: 为大数据量表预留分区支持

### 2. 数据完整性
- **外键约束**: 确保引用完整性
- **唯一约束**: 防止重复数据
- **枚举类型**: 限制字段值范围
- **触发器**: 自动维护关联数据

### 3. 可扩展性
- **元数据表**: EAV模型支持自定义字段
- **JSON字段**: 灵活存储复杂数据
- **软删除**: 保留删除数据便于恢复
- **审计字段**: 完整的时间追踪

### 4. 可维护性
- **迁移系统**: 版本化数据库变更
- **性能监控**: 自动收集性能数据
- **慢查询日志**: 识别性能瓶颈
- **自动化脚本**: 简化日常运维

---

## 📈 性能优化策略

### 索引优化
```sql
-- 复合索引示例
CREATE INDEX idx_author_status_published
ON posts(author_id, status, published_at DESC);

-- 覆盖索引示例
CREATE INDEX idx_cover_post_list
ON posts(status, post_type, published_at DESC, id, title, excerpt);
```

### 查询优化
```sql
-- 使用全文索引
SELECT * FROM posts
WHERE MATCH(title, content, excerpt)
AGAINST('keyword' IN NATURAL LANGUAGE MODE)
  AND status = 'publish';

-- 使用索引排序
SELECT * FROM posts
WHERE status = 'publish'
ORDER BY published_at DESC
LIMIT 20;
```

### 缓存策略
- 查询缓存（MySQL层）
- 应用层缓存（Redis）
- 静态页面缓存
- CDN加速

---

## 🔧 运维工具

### 日常维护
```bash
# 每日任务
./scripts/db-health-check.sh      # 健康检查
./scripts/db-monitor.sh --report   # 生成报告

# 每周任务
./scripts/backup.sh                # 自动备份
mysqlcheck -o cyberpress           # 优化表

# 每月任务
mysql -e "CALL sp_cleanup_old_data(90)"  # 清理旧数据
./scripts/db-restore.sh backup.sql.gz     # 测试恢复
```

### 性能监控
```bash
# 实时监控
watch -n 5 './scripts/db-monitor.sh'

# 慢查询分析
mysql -e "SELECT * FROM v_slow_query_summary LIMIT 10"

# 索引使用分析
mysql -e "SELECT * FROM v_unused_indexes"
```

### 备份策略
```bash
# 完整备份
mysqldump --single-transaction --routines --triggers \
  cyberpress | gzip > backup_$(date +%Y%m%d).sql.gz

# 仅备份结构
mysqldump --no-data cyberpress > schema_backup.sql

# 仅备份数据
mysqldump --no-create-info cyberpress > data_backup.sql
```

---

## 📊 ER图总览

### 核心关系
```
users (1:N) posts
users (1:N) comments
users (1:N) media

posts (N:M) categories
posts (1:N) comments
posts (1:N) post_meta

categories (1:N) categories (self-referential)

portfolio_items (1:N) portfolio_gallery

posts (1:N) analytics
```

### 关键设计决策

#### 1. 分类和标签统一表
- 使用 `type` 字段区分
- 分类支持层级（parent_id）
- 简化查询逻辑

#### 2. EAV模型存储元数据
- 灵活扩展字段
- 无需修改表结构
- 支持插件系统

#### 3. 软删除设计
- 使用 status 标记删除
- 可恢复误删内容
- 保留审计记录

#### 4. 时间戳设计
- created_at: 创建时间
- updated_at: 更新时间
- published_at: 发布时间
- 支持自动更新

---

## 🚀 快速开始

### 1. 初始化数据库
```bash
cd backend/database

# 编辑环境变量
cp .env.example .env
vim .env

# 初始化数据库
./scripts/db-init.sh
```

### 2. 验证安装
```bash
# 健康检查
./scripts/db-health-check.sh

# 监控数据库
./scripts/db-monitor.sh
```

### 3. 性能优化
```bash
# 查看慢查询
mysql -e "SELECT * FROM v_slow_query_summary LIMIT 10"

# 检查索引使用
mysql -e "SELECT * FROM index_usage_stats WHERE is_used = false"

# 优化表
mysql -e "OPTIMIZE TABLE posts, comments"
```

---

## 📚 相关文档

1. **设计文档**
   - [DATABASE-DESIGN.md](./DATABASE-DESIGN.md) - 完整设计文档
   - [DATABASE-INDEXES.md](./DATABASE-INDEXES.md) - 索引设计指南

2. **操作手册**
   - [DATABASE-README.md](./DATABASE-README.md) - 快速入门
   - 本文档 - 架构总结

3. **项目文档**
   - [PROJECT.md](../PROJECT.md) - 项目规划
   - [README.md](../README.md) - 项目说明

---

## 🎓 最佳实践

### 开发环境
- 使用 Docker Compose 快速部署
- 配置慢查询日志
- 定期备份数据
- 监控性能指标

### 生产环境
- 启用二进制日志
- 配置主从复制
- 设置定期备份
- 监控数据库健康
- 优化索引配置
- 调整内存参数

### 安全建议
- 使用强密码
- 限制远程访问
- 定期更新MySQL
- 启用SSL连接
- 备份加密存储
- 审计日志记录

---

## 📞 技术支持

如有问题，请参考：
- [GitHub Issues](https://github.com/cyberpress/platform/issues)
- 技术文档：docs/DATABASE-README.md
- 数据库文档：docs/DATABASE-DESIGN.md

---

## 📝 更新日志

### v1.0.0 (2026-03-03)
- ✅ 完整的数据库Schema设计
- ✅ 11个核心数据表
- ✅ 4个迁移文件
- ✅ 详细的文档
- ✅ 4个实用脚本
- ✅ 搜索优化支持
- ✅ 性能监控支持

---

**文档作者**: AI Database Architect 🤖
**最后更新**: 2026-03-03
**许可证**: MIT
