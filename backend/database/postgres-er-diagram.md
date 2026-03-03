# CyberPress Platform - PostgreSQL ER 图

## 实体关系图 (ER Diagram)

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                         CYBERPRESS PLATFORM DATABASE                         │
│                              PostgreSQL Schema                               │
└─────────────────────────────────────────────────────────────────────────────┘

┌──────────────────────┐       ┌──────────────────────┐       ┌──────────────────────┐
│      users           │       │     posts            │       │    categories        │
├──────────────────────┤       ├──────────────────────┤       ├──────────────────────┤
│ id (PK)             │◄──────│ author_id (FK)       │       │ id (PK)             │
│ username            │       │ id (PK)             │◄──────│ slug               │
│ email               │       │ title               │       │ name               │
│ password_hash       │       │ slug                │       │ description        │
│ full_name           │       │ excerpt             │       │ parent_id (FK)     │
│ avatar_url          │       │ content             │       │ icon               │
│ bio                 │       │ featured_image      │       │ created_at         │
│ website             │       │ category_id (FK)    │       │ updated_at         │
│ location            │       │ status              │       └──────────────────────┘
│ twitter_handle      │       │ post_type           │                │
│ github_handle       │       │ meta                │                │
│ role                │       │ published_at        │                │
│ is_verified         │       │ created_at          │                │
│ is_active           │       │ updated_at          │                │
│ last_login_at       │       │ view_count          │                │
│ created_at          │       │ likes_count         │                │
│ updated_at          │       └──────────────────────┘                │
└──────────────────────┘                │                              │
         │                              │                              │
         │                              │                              │
         │                              ▼                              │
         │                 ┌──────────────────────┐                    │
         │                 │      tags            │                    │
         │                 ├──────────────────────┤                    │
         │                 │ id (PK)             │◄────────────────────┘
         │                 │ name                │
         │                 │ slug                │
         │                 │ description         │
         │                 │ post_count          │
         │                 │ created_at          │
         │                 └──────────────────────┘
         │                              │
         │                              │
         ▼                              ▼
┌──────────────────────┐       ┌──────────────────────┐
│     comments         │       │   post_tags          │
├──────────────────────┤       ├──────────────────────┤
│ id (PK)             │       │ post_id (FK)         │
│ post_id (FK)        │───────││ tag_id (FK)          │
│ user_id (FK)        │───────││ created_at          │
│ parent_id (FK)      │◄──────┘└──────────────────────┘
│ author_name         │              │
│ author_email        │              │
│ content             │              │
│ status              │              ▼
│ ip_address          │       ┌──────────────────────┐
│ user_agent          │       │    media             │
│ created_at          │       ├──────────────────────┤
│ updated_at          │       │ id (PK)             │
│ likes_count         │       │ filename            │
└──────────────────────┘       │ file_path           │
         │                      │ file_size           │
         │                      │ mime_type           │
         │                      │ width               │
         │                      │ height              │
         │                      │ alt_text            │
         │                      │ caption             │
         │                      │ uploaded_by (FK)    │
         │                      │ created_at          │
         ▼                      └──────────────────────┘
┌──────────────────────┐
│    portfolios        │
├──────────────────────┤
│ id (PK)             │
│ title               │
│ slug                │
│ description         │
│ content             │
│ featured_image      │
│ project_url         │
│ github_url          │
│ technologies        │
│ start_date          │
│ end_date            │
│ status              │
│ sort_order          │
│ created_at          │
│ updated_at          │
└──────────────────────┘

┌──────────────────────┐       ┌──────────────────────┐
│    analytics         │       │  reading_list        │
├──────────────────────┤       ├──────────────────────┤
│ id (PK)             │       │ id (PK)             │
│ post_id (FK)        │       │ user_id (FK)        │
│ session_id          │       │ post_id (FK)        │
│ user_id (FK)        │       │ notes               │
│ event_type          │       │ is_read             │
│ event_data          │       │ progress            │
│ ip_address          │       │ created_at          │
│ user_agent          │       │ updated_at          │
│ referrer            │       └──────────────────────┘
│ created_at          │
└──────────────────────┘

┌──────────────────────┐       ┌──────────────────────┐
│  notifications       │       │     settings         │
├──────────────────────┤       ├──────────────────────┤
│ id (PK)             │       │ id (PK)             │
│ user_id (FK)        │       │ user_id (FK)        │
│ type                │       │ key                 │
│ title               │       │ value               │
│ message             │       │ type                │
│ data                │       │ category            │
│ is_read             │       │ created_at          │
│ created_at          │       │ updated_at          │
└──────────────────────┘       └──────────────────────┘
```

## 关系说明

### 主要关系
1. **users → posts** (1:N) - 一个用户可以写多篇文章
2. **categories → posts** (1:N) - 一个分类包含多篇文章
3. **posts → comments** (1:N) - 一篇文章有多条评论
4. **comments → comments** (1:N) - 评论支持嵌套回复
5. **posts ↔ tags** (N:M) - 文章和标签多对多关系
6. **categories → categories** (1:N) - 支持分类层级
7. **users → reading_list** (1:N) - 用户阅读列表
8. **users → notifications** (1:N) - 用户通知
9. **users → settings** (1:N) - 用户设置

### 索引关系
- **主键 (PK)**: 每个表都有自增 ID 作为主键
- **外键 (FK)**: 关联其他表的字段
- **唯一索引**: username, email, slug 等

## 数据类型说明

```sql
-- 主键
id BIGSERIAL PRIMARY KEY

-- 字符串
username VARCHAR(50) UNIQUE
email VARCHAR(255) UNIQUE
title VARCHAR(255)
slug VARCHAR(191) UNIQUE  -- 支持索引的最大长度

-- 文本
content TEXT
bio TEXT

-- 时间
created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
updated_at TIMESTAMP WITH TIME ZONE
published_at TIMESTAMP WITH TIME ZONE

-- 数值
view_count INTEGER DEFAULT 0
likes_count INTEGER DEFAULT 0

-- 布尔
is_active BOOLEAN DEFAULT TRUE
is_verified BOOLEAN DEFAULT FALSE

-- JSON
meta JSONB
event_data JSONB

-- 枚举
status VARCHAR(20) -- 'draft', 'published', 'archived'
role VARCHAR(20) -- 'admin', 'editor', 'author', 'subscriber'
```

## 完整性约束

### 外键约束
```sql
-- 删除用户时级联删除其内容
ON DELETE CASCADE

-- 删除分类时设置为 NULL
ON DELETE SET NULL

-- 更新时级联更新
ON UPDATE CASCADE
```

### 检查约束
```sql
-- 状态检查
CHECK (status IN ('draft', 'published', 'archived'))

-- 角色检查
CHECK (role IN ('admin', 'editor', 'author', 'subscriber'))
```

## 性能优化考虑

1. **索引策略**
   - 主键自动创建索引
   - 外键字段创建索引
   - 常用查询字段创建索引
   - 全文搜索使用 GIN 索引

2. **分区考虑**
   - analytics 表按时间分区
   - posts 表按年份分区（可选）

3. **缓存策略**
   - 热点数据使用 Redis 缓存
   - 查询结果缓存
   - 物化视图用于复杂统计
