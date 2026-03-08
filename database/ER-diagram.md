# CyberPress Platform - ER 图

## 实体关系图

```
┌─────────────────────────────────────────────────────────────────────────────────┐
│                        CyberPress Platform Database Schema                      │
│                            PostgreSQL 15+                                       │
└─────────────────────────────────────────────────────────────────────────────────┘

┌──────────────┐         ┌──────────────┐         ┌──────────────┐
│    users     │         │    posts     │         │  categories  │
├──────────────┤         ├──────────────┤         ├──────────────┤
│ id (PK)      │─────┐   │ id (PK)      │─────┐   │ id (PK)      │
│ username     │     │   │ title        │     │   │ name         │
│ email        │     │   │ slug         │     │   │ slug         │
│ password_hash│     │   │ content      │     │   │ description  │
│ display_name │     │   │ excerpt      │     │   │ parent_id (FK)│
│ avatar_url   │     │   │ author_id (FK)│───┘   │ post_count   │
│ bio          │     │   │ category_id (FK)│───┐   │ created_at  │
│ role         │     │   │ status       │     │   └──────────────┘
│ status       │     │   │ featured     │     │          │
│ created_at   │     │   │ view_count   │     │          │
│ updated_at   │     │   │ like_count   │     │          │
└──────────────┘     │   │ comment_count│     │          │
                     │   │ published_at │     │          │
                     │   │ created_at   │     │          │
                     │   └──────────────┘     │          │
                     │                          │          │
                     │                          │          │
                     │         ┌──────────────┐ │          │
                     │         │    tags      │ │          │
                     │         ├──────────────┤ │          │
                     │         │ id (PK)      │ │          │
                     │         │ name         │ │          │
                     │         │ slug         │ │          │
                     │         │ description  │ │          │
                     │         │ post_count   │ │          │
                     │         └──────────────┘ │          │
                     │                  │       │          │
                     │                  │       │          │
                     │         ┌────────▼───────┴──────┐   │
                     │         │    post_tags          │   │
                     │         ├──────────────────────┤   │
                     │         │ post_id (FK)          │   │
                     │         │ tag_id (FK)           │   │
                     │         └──────────────────────┘   │
                     │                                    │
                     │                                    │
┌──────────────┐     │         ┌──────────────┐         │
│   comments   │     │         │    likes     │         │
├──────────────┤     │         ├──────────────┤         │
│ id (PK)      │     │         │ id (PK)      │         │
│ post_id (FK) │─────┘         │ user_id (FK) │─────────┘
│ user_id (FK) │───────────────┤ post_id (FK) │
│ parent_id (FK)│(self-ref)    │ created_at  │
│ content      │               └──────────────┘
│ status       │
│ created_at   │         ┌──────────────┐
└──────────────┘         │  followers   │
                         ├──────────────┤
                         │ id (PK)      │
┌──────────────┐         │ follower_id (FK)│──┐
│ notifications│         │ following_id (FK)│──┤
├──────────────┤         │ created_at  │    │
│ id (PK)      │         └──────────────┘    │
│ user_id (FK) │──┐                           │
│ type         │  │                           │
│ title        │  │    ┌──────────────┐      │
│ message      │  │    │  bookmarks   │      │
│ data         │  │    ├──────────────┤      │
│ read         │  │    │ id (PK)      │      │
│ created_at   │  │    │ user_id (FK) │──────┘
└──────────────┘  │    │ post_id (FK) │
                  │    │ created_at  │
                  │    └──────────────┘
                  │
                  │    ┌──────────────┐
                  │    │ reading_list │
                  │    ├──────────────┤
                  │    │ id (PK)      │
                  │    │ user_id (FK) │──────┐
                  │    │ post_id (FK) │      │
                  │    │ progress     │      │
                  │    │ status       │      │
                  │    │ created_at  │      │
                  │    └──────────────┘      │
                  │                           │
                  │    ┌──────────────┐      │
                  └────│ analytics    │      │
                       ├──────────────┤      │
                       │ id (PK)      │      │
                       │ post_id (FK) │──────┘
                       │ user_id (FK) │
                       │ event_type   │
                       │ metadata     │
                       │ created_at  │
                       └──────────────┘
```

## 表关系说明

### 1. 用户中心 (users)
- **主键**: id (UUID)
- **关系**:
  - 一对多 → posts (作者)
  - 一对多 → comments (评论者)
  - 一对多 → likes (点赞者)
  - 一对多 → notifications (接收者)
  - 一对多 → followers (关注者/被关注者)
  - 一对多 → bookmarks (收藏者)
  - 一对多 → reading_list (阅读列表)

### 2. 内容中心 (posts)
- **主键**: id (UUID)
- **外键**:
  - author_id → users.id (作者)
  - category_id → categories.id (分类)
- **关系**:
  - 一对多 → comments (文章评论)
  - 一对多 → likes (文章点赞)
  - 一对多 → bookmarks (文章收藏)
  - 多对多 → tags (通过 post_tags)

### 3. 分类系统 (categories)
- **主键**: id (UUID)
- **自引用**: parent_id → categories.id (父子分类)
- **关系**: 一对多 → posts (分类文章)

### 4. 标签系统 (tags)
- **主键**: id (UUID)
- **关系**: 多对多 → posts (通过 post_tags)

### 5. 评论系统 (comments)
- **主键**: id (UUID)
- **外键**:
  - post_id → posts.id (文章)
  - user_id → users.id (评论者)
  - parent_id → comments.id (父评论/回复)

### 6. 互动系统
- **likes**: 存储用户对文章的点赞
- **followers**: 存储用户关注关系
- **bookmarks**: 存储用户收藏的文章
- **reading_list**: 存储用户阅读进度和列表

### 7. 通知系统 (notifications)
- **主键**: id (UUID)
- **外键**: user_id → users.id (接收者)
- **类型**: comment, like, follow, mention, system

### 8. 分析系统 (analytics)
- **主键**: id (UUID)
- **外键**:
  - post_id → posts.id (文章分析)
  - user_id → users.id (用户行为)
- **事件**: view, click, share, search, etc.

## 索引策略

### 高频查询索引
```sql
-- 用户查询
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_username ON users(username);
CREATE INDEX idx_users_status ON users(status);

-- 文章查询
CREATE INDEX idx_posts_slug ON posts(slug);
CREATE INDEX idx_posts_author ON posts(author_id);
CREATE INDEX idx_posts_category ON posts(category_id);
CREATE INDEX idx_posts_status ON posts(status);
CREATE INDEX idx_posts_published ON posts(published_at DESC);

-- 全文搜索
CREATE INDEX idx_posts_search ON posts USING gin(
    to_tsvector('english', coalesce(title, '') || ' ' || coalesce(content, ''))
);

-- 互动查询
CREATE INDEX idx_likes_user_post ON likes(user_id, post_id);
CREATE INDEX idx_bookmarks_user_post ON bookmarks(user_id, post_id);
CREATE INDEX idx_followers_relation ON followers(follower_id, following_id);

-- 通知查询
CREATE INDEX idx_notifications_user_read ON notifications(user_id, read);
```

## 数据完整性

### 外键约束
- 所有外键都设置了 ON DELETE CASCADE
- 确保数据一致性

### 检查约束
- 用户角色: admin, editor, author, subscriber
- 文章状态: draft, published, archived, deleted
- 评论状态: pending, approved, rejected, spam

### 触发器
- 自动更新 updated_at 字段
- 文章发布时自动生成 slug
- 删除用户时清理相关数据

## 性能优化

### 分区策略
- 按日期分区 analytics 表 (每月)
- 按状态分区 posts 表 (published/archived)

### 缓存策略
- Redis 缓存热门文章
- 缓存用户会话
- 缓存分类和标签

### 查询优化
- 使用连接池 (pgbouncer)
- 读写分离 (主从复制)
- 物化视图用于统计报表

## 扩展性

### 水平扩展
- 支持分片 (sharding)
- 支持 MongoDB 迁移

### 垂直扩展
- 支持 JSONB 字段存储额外数据
- 支持数组类型存储多值属性

---

**版本**: 1.0.0
**更新日期**: 2026-03-08
**维护者**: AI Database Architect
