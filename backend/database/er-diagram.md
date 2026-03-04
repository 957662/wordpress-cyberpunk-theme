# CyberPress Platform - ER Diagram

## 数据库实体关系图

```
┌─────────────────────────────────────────────────────────────────────────────────┐
│                        CyberPress Platform Database                            │
│                          PostgreSQL Schema v1.0                                │
└─────────────────────────────────────────────────────────────────────────────────┘

┌──────────────────┐       ┌──────────────────┐       ┌──────────────────┐
│     users        │       │   user_profiles  │       │  user_settings   │
├──────────────────┤       ├──────────────────┤       ├──────────────────┤
│ id (PK)          │───┐   │ id (PK)          │───┐   │ id (PK)          │
│ email (UNIQUE)   │   └───│ user_id (FK)     │   └───│ user_id (FK)     │
│ username (UNIQUE)│       │ display_name     │       │ theme            │
│ password_hash    │       │ bio              │       │ language         │
│ role             │       │ avatar_url       │       │ timezone         │
│ status           │       │ website          │       │ notifications    │
│ created_at       │       │ location         │       │ privacy_level    │
│ updated_at       │       │ birth_date       │       │ created_at       │
│ last_login_at    │       │ gender           │       │ updated_at       │
└──────────────────┘       │ social_links     │       └──────────────────┘
                           │ created_at       │
                           │ updated_at       │
                           └──────────────────┘

┌──────────────────┐       ┌──────────────────┐       ┌──────────────────┐
│     posts        │       │   post_meta      │       │     categories   │
├──────────────────┤       ├──────────────────┤       ├──────────────────┤
│ id (PK)          │───┐   │ id (PK)          │───┐   │ id (PK)          │
│ author_id (FK)   │   └───│ post_id (FK)     │   └───│ name (UNIQUE)    │
│ title            │       │ meta_key         │       │ slug (UNIQUE)    │
│ slug (UNIQUE)    │       │ meta_value       │       │ description      │
│ content          │       └──────────────────┘       │ parent_id (FK)   │
│ excerpt          │                                  │ created_at       │
│ status           │                                  │ updated_at       │
│ post_type        │       ┌──────────────────┐       └──────────────────┘
│ comment_count    │──────│  post_categories │
│ view_count       │       ├──────────────────┤
│ like_count       │       │ post_id (FK)     │◄─────┐
│ featured         │       │ category_id (FK) │─────┘
│ created_at       │       └──────────────────┘
│ updated_at       │       │
│ published_at     │       │
└──────────────────┘       └──────────────────┘

┌──────────────────┐       ┌──────────────────┐       ┌──────────────────┐
│     tags         │       │    post_tags     │       │     comments     │
├──────────────────┤       ├──────────────────┤       ├──────────────────┤
│ id (PK)          │───┐   │ post_id (FK)     │───┐   │ id (PK)          │
│ name (UNIQUE)    │   └───│ tag_id (FK)      │   └───│ post_id (FK)     │
│ slug (UNIQUE)    │       └──────────────────┘       │ author_id (FK)   │
│ description      │                                  │ parent_id (FK)   │
│ created_at       │       ┌──────────────────┐       │ content          │
│ updated_at       │       │     media        │       │ status           │
└──────────────────┘       ├──────────────────┤       │ created_at       │
                           │ id (PK)          │       │ updated_at       │
                           │ author_id (FK)   │       └──────────────────┘
                           │ title            │                 │
                           │ filename         │                 │
                           │ file_path        │                 │
                           │ file_size        │                 │
                           │ mime_type        │                 │
                           │ dimensions       │       ┌──────────────────┐
                           │ alt_text         │       │ comment_likes    │
                           │ created_at       │       ├──────────────────┤
                           └──────────────────┘       │ id (PK)          │
                                                      │ comment_id (FK)  │◄───┐
                                                      │ user_id (FK)     │    │
┌──────────────────┐       ┌──────────────────┐       │ created_at       │    │
│   user_follows   │       │    notifications │       └──────────────────┘    │
├──────────────────┤       ├──────────────────┤                                │
│ id (PK)          │       │ id (PK)          │       ┌──────────────────┐    │
│ follower_id (FK) │       │ user_id (FK)     │       │  activities      │    │
│ following_id (FK)│       │ type             │       ├──────────────────┤    │
│ created_at       │       │ title            │       │ id (PK)          │    │
└──────────────────┘       │ message          │       │ user_id (FK)     │    │
                           │ data (JSONB)     │       │ type             │    │
                           │ read_at          │       │ post_id (FK)     │◄───┘
                           │ created_at       │       │ data (JSONB)     │
                           └──────────────────┘       │ created_at       │
                                                      └──────────────────┘

┌──────────────────┐       ┌──────────────────┐       ┌──────────────────┐
│     analytics    │       │ page_views       │       │   sessions      │
├──────────────────┤       ├──────────────────┤       ├──────────────────┤
│ id (PK)          │       │ id (PK)          │       │ id (PK)          │
│ event_type       │       │ session_id (FK)  │◄───┐  │ user_id (FK)     │
│ user_id (FK)     │       │ post_id (FK)     │    │  │ ip_address       │
│ post_id (FK)     │       │ url              │    │  │ user_agent      │
│ data (JSONB)     │       │ referrer         │    │  │ started_at       │
│ created_at       │       │ duration         │    │  │ last_activity   │
└──────────────────┘       │ created_at       │    │  └──────────────────┘
                           └──────────────────┘    │
                                                   │
┌──────────────────┐       ┌──────────────────┐    │
│   api_tokens     │       │  refresh_tokens  │    │
├──────────────────┤       ├──────────────────┤    │
│ id (PK)          │       │ id (PK)          │    │
│ user_id (FK)     │       │ user_id (FK)     │    │
│ token (UNIQUE)   │       │ token (UNIQUE)   │    │
│ name             │       │ expires_at       │    │
│ scopes           │       │ revoked_at       │    │
│ expires_at       │       │ created_at       │    │
│ last_used_at     │       └──────────────────┘    │
│ created_at       │                                │
└──────────────────┘                                │
                                                    │
┌──────────────────┐       ┌──────────────────┐    │
│    roles         │       │ permissions      │    │
├──────────────────┤       ├──────────────────┤    │
│ id (PK)          │       │ id (PK)          │    │
│ name (UNIQUE)    │       │ role_id (FK)     │◄───┘
│ description      │       │ resource         │
│ created_at       │       │ action           │
└──────────────────┘       │ condition        │
                           │ created_at       │
                           └──────────────────┘
```

## 表关系说明

### 核心业务实体

1. **用户系统**
   - `users` - 用户主表
   - `user_profiles` - 用户资料（一对一）
   - `user_settings` - 用户设置（一对一）

2. **内容管理**
   - `posts` - 文章/内容主表
   - `post_meta` - 文章元数据（一对多）
   - `categories` - 分类（树形结构）
   - `tags` - 标签
   - `post_categories` - 文章分类关联（多对多）
   - `post_tags` - 文章标签关联（多对多）

3. **媒体管理**
   - `media` - 媒体文件（图片、视频等）

4. **评论系统**
   - `comments` - 评论（支持嵌套回复）
   - `comment_likes` - 评论点赞

5. **社交功能**
   - `user_follows` - 用户关注关系
   - `activities` - 用户动态/活动流
   - `notifications` - 通知系统

6. **分析统计**
   - `analytics` - 通用分析事件
   - `page_views` - 页面浏览记录
   - `sessions` - 用户会话

7. **认证授权**
   - `api_tokens` - API 访问令牌
   - `refresh_tokens` - 刷新令牌
   - `roles` - 角色定义
   - `permissions` - 权限定义

## 关键关系

```
users (1) ──< (1) user_profiles
users (1) ──< (1) user_settings
users (1) ──< (N) posts
users (1) ──< (N) comments
users (1) ──< (N) media
users (1) ──< (N) activities
users (1) ──< (N) notifications

posts (1) ──< (N) post_meta
posts (1) ──< (N) comments
posts (M) ──> (N) categories (通过 post_categories)
posts (M) ──> (N) tags (通过 post_tags)

categories (1) ──< (N) post_categories
categories (1) ──< (N) categories (自连接，父分类)

comments (1) ──< (N) comments (自连接，父评论)
comments (1) ──< (N) comment_likes
```

## 索引策略

### 主键索引
- 所有表的 `id` 字段（BIGINT AUTO_INCREMENT）

### 唯一索引
- `users.email`, `users.username`
- `posts.slug`
- `categories.name`, `categories.slug`
- `tags.name`, `tags.slug`
- `api_tokens.token`
- `refresh_tokens.token`

### 性能索引
- `posts(author_id, status, created_at)` - 作者文章列表
- `posts(status, published_at)` - 首页文章流
- `posts(featured, status, created_at)` - 精选内容
- `comments(post_id, created_at)` - 文章评论列表
- `activities(user_id, created_at)` - 用户动态
- `notifications(user_id, read_at)` - 未读通知
- `page_views(session_id, created_at)` - 会话浏览记录

### 全文搜索索引
- `posts(title, content)` - 文章搜索
- `users(username, display_name)` - 用户搜索

## 数据完整性

### 外键约束
- 所有外键都有 `ON DELETE CASCADE` 或 `ON DELETE SET NULL`
- 防止孤立记录

### 检查约束
- `users.email` - 邮箱格式
- `posts.status` - 状态枚举值
- `posts.post_type` - 类型枚举值

### 触发器
- `updated_at` 自动更新
- 文章发布时间自动设置
- 评论数自动更新
- 浏览数自动更新

## 性能优化

1. **分区策略**
   - `analytics` 表按月分区
   - `page_views` 表按月分区

2. **缓存表**
   - 用户关注数缓存
   - 文章统计数缓存

3. **物化视图**
   - 热门文章排行
   - 活跃用户排行
   - 标签云

4. **数据库连接池**
   - 应用层连接池配置
   - 最大连接数：100

## 数据归档

1. **冷数据归档**
   - 超过1年的分析数据
   - 超过6个月的浏览记录

2. **软删除**
   - 所有核心表支持 `deleted_at`
   - 支持数据恢复

## 安全性

1. **敏感数据加密**
   - `users.password_hash` - bcrypt 哈希
   - `api_tokens.token` - 不可逆加密

2. **审计日志**
   - 所有修改操作记录
   - 登录历史追踪

3. **数据脱敏**
   - 日志中的敏感信息脱敏
   - API 响应数据过滤

---

**数据库版本**: v1.0
**最后更新**: 2026-03-05
**维护者**: CyberPress Team
