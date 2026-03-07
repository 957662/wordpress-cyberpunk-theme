# CyberPress Platform - ER 图

## 数据库实体关系图

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                        CyberPress Platform Schema                            │
│                    PostgreSQL Database Architecture                         │
└─────────────────────────────────────────────────────────────────────────────┘

┌──────────────────┐
│     users        │  用户表
├──────────────────┤
│ id (PK)          │  UUID
│ username         │  VARCHAR(60) UNIQUE
│ email            │  VARCHAR(100) UNIQUE
│ password_hash    │  VARCHAR(255)
│ display_name     │  VARCHAR(100)
│ avatar_url       │  VARCHAR(500)
│ bio              │  TEXT
│ website          │  VARCHAR(255)
│ role             │  ENUM (subscriber, contributor, author, editor, admin)
│ status           │  ENUM (active, inactive, pending, banned)
│ email_verified_at│  TIMESTAMP
│ last_login_at    │  TIMESTAMP
│ created_at       │  TIMESTAMP
│ updated_at       │  TIMESTAMP
│ deleted_at       │  TIMESTAMP (软删除)
│ metadata         │  JSONB
└──────────────────┘
         │
         │ 1:N
         │
         ├─── posts (author_id) ───────────────────────────────────────┐
         │                                                              │
         │ 1:N                                                         │
         │                                                              │
    ┌─────────────────────────────────────────────────────────────────────┐
    │                            posts                                    │
    │                              文章表                                  │
    ├─────────────────────────────────────────────────────────────────────┤
    │ id (PK)                  │ UUID                                     │
    │ title                    │ VARCHAR(255)                             │
    │ slug                     │ VARCHAR(255) UNIQUE                      │
    │ excerpt                  │ TEXT                                     │
    │ content                  │ TEXT                                     │
    │ author_id (FK)           │ UUID → users(id)                         │
    │ featured_image_id        │ UUID → media(id)                         │
    │ status                   │ ENUM (draft, pending, private, publish)  │
    │ post_type                │ ENUM (post, page, portfolio, attachment) │
    │ comment_status           │ BOOLEAN                                  │
    │ ping_status              │ BOOLEAN                                  │
    │ password                 │ VARCHAR(255)                             │
    │ view_count               │ BIGINT                                   │
    │ like_count               │ INTEGER                                  │
    │ comment_count            │ INTEGER                                  │
    │ is_featured              │ BOOLEAN                                  │
    │ is_sticky                │ BOOLEAN                                  │
    │ menu_order               │ INTEGER                                  │
    │ meta_title               │ VARCHAR(255)                             │
    │ meta_description         │ TEXT                                     │
    │ meta_keywords            │ VARCHAR(500)                             │
    │ published_at             │ TIMESTAMP                                │
    │ created_at               │ TIMESTAMP                                │
    │ updated_at               │ TIMESTAMP                                │
    │ deleted_at               │ TIMESTAMP (软删除)                        │
    │ metadata                 │ JSONB                                    │
    └─────────────────────────────────────────────────────────────────────┘
         │
         │ 1:N
         │
    ┌─────┴──────────────────────────────────┐
    │                                        │
    │                                        │
    │ N:M                                    │ N:M
    │                                        │
┌───┴────┐                            ┌──────┴────────┐
│        │                            │               │
│        │                            │               │
▼        ▼                            ▼               ▼
┌──────────────────┐            ┌─────────────────────────────────────────┐
│   categories     │            │                tags                      │
│     分类表        │            │               标签表                      │
├──────────────────┤            ├─────────────────────────────────────────┤
│ id (PK)          │ UUID       │ id (PK)            │ UUID               │
│ name             │ VARCHAR    │ name               │ VARCHAR(100)        │
│ slug             │ VARCHAR    │ slug               │ VARCHAR(100) UNIQUE │
│ description      │ TEXT       │ description        │ TEXT                │
│ parent_id (FK)   │ UUID → self│ color              │ VARCHAR(7)          │
│ icon             │ VARCHAR    │ post_count         │ INTEGER             │
│ color            │ VARCHAR    │ created_at         │ TIMESTAMP           │
│ cover_image_url  │ VARCHAR    │ updated_at         │ TIMESTAMP           │
│ sort_order       │ INTEGER    │ metadata           │ JSONB               │
│ post_count       │ INTEGER    └─────────────────────────────────────────┘
│ created_at       │ TIMESTAMP                    │
│ updated_at       │ TIMESTAMP                    │
│ metadata         │ JSONB                        │ N:M
└──────────────────┘                            │
         │                                      │
         │                                      │
    ┌────┴─────────────────┐           ┌────────┴─────────┐
    │                      │           │                  │
    │ N:M                  │           │                  │ N:M
    │                      │           │                  │
┌───┴──────────────────────┴───┐ ┌─────┴──────────────────┴──────┐
│        post_categories       │ │          post_tags              │
│      文章分类关系表            │ │        文章标签关系表            │
├──────────────────────────────┤ ├────────────────────────────────┤
│ id (PK)            │ UUID    │ │ id (PK)            │ UUID      │
│ post_id (FK)       │ UUID →  │ │ post_id (FK)       │ UUID →    │
│ category_id (FK)   │ UUID →  │ │ tag_id (FK)        │ UUID →    │
│ created_at         │ TIMESTAMP│ │ created_at         │ TIMESTAMP │
└──────────────────────────────┘ └────────────────────────────────┘
    │                                  │
    │                                  │
    └──────────────┬───────────────────┘
                   │
                   │ 1:N
                   │
    ┌──────────────────────────────────────────────────────────────┐
    │                        comments                              │
    │                          评论表                               │
    ├──────────────────────────────────────────────────────────────┤
    │ id (PK)              │ UUID                                  │
    │ post_id (FK)         │ UUID → posts(id)                      │
    │ author_id (FK)       │ UUID → users(id) (可选)               │
    │ parent_id (FK)       │ UUID → comments(id) (自引用)           │
    │ author_name          │ VARCHAR(100) (匿名评论)                │
    │ author_email         │ VARCHAR(100) (匿名评论)                │
    │ author_url           │ VARCHAR(255) (匿名评论)                │
    │ author_ip            │ VARCHAR(45)                            │
    │ content              │ TEXT                                  │
    │ karma                │ INTEGER                               │
    │ status               │ ENUM (pending, approved, spam, trash)  │
    │ agent                │ VARCHAR(255)                           │
    │ created_at           │ TIMESTAMP                              │
    │ updated_at           │ TIMESTAMP                              │
    │ deleted_at           │ TIMESTAMP (软删除)                      │
    │ metadata             │ JSONB                                 │
    └──────────────────────────────────────────────────────────────┘
                   │
                   │ 1:N
                   │
    ┌──────────────────────────────────────────────────────────────┐
    │                        media                                 │
    │                         媒体表                                │
    ├──────────────────────────────────────────────────────────────┤
    │ id (PK)              │ UUID                                  │
    │ title                │ VARCHAR(255)                          │
    │ filename             │ VARCHAR(255)                          │
    │ url                  │ VARCHAR(512)                          │
    │ mime_type            │ VARCHAR(100)                          │
    │ file_size            │ BIGINT                                │
    │ width                │ INTEGER (图片宽度)                     │
    │ height               │ INTEGER (图片高度)                     │
    │ alt_text             │ VARCHAR(255)                          │
    │ description          │ TEXT                                  │
    │ caption              │ TEXT                                  │
    │ uploader_id (FK)     │ UUID → users(id)                       │
    │ post_id (FK)         │ UUID → posts(id) (可选)                │
    │ created_at           │ TIMESTAMP                             │
    │ updated_at           │ TIMESTAMP                             │
    │ metadata             │ JSONB                                 │
    └──────────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────────────────┐
│                            元数据表                                   │
├──────────────────────────────────────────────────────────────────────┤
│                                                                      │
│  ┌──────────────────┐    ┌──────────────────┐                       │
│  │   options        │    │   user_meta      │                       │
│  │    选项表         │    │   用户元数据表    │                       │
│  ├──────────────────┤    ├──────────────────┤                       │
│  │ id (PK)          │ UUID│ id (PK)          │ UUID                  │
│  │ option_name      │ VARCHAR│ user_id (FK) │ UUID → users(id)      │
│  │ option_value     │ TEXT│ meta_key        │ VARCHAR(255)          │
│  │ autoload         │ BOOLEAN│ meta_value    │ TEXT                  │
│  │ created_at       │ TIMESTAMP│ created_at   │ TIMESTAMP             │
│  │ updated_at       │ TIMESTAMP│ updated_at   │ TIMESTAMP             │
│  └──────────────────┘    └──────────────────┘                       │
│                                                                      │
│  ┌──────────────────┐                                               │
│  │   post_meta      │                                               │
│  │  文章元数据表     │                                               │
│  ├──────────────────┤                                               │
│  │ id (PK)          │ UUID                                          │
│  │ post_id (FK)     │ UUID → posts(id)                              │
│  │ meta_key         │ VARCHAR(255)                                  │
│  │ meta_value       │ TEXT                                          │
│  │ created_at       │ TIMESTAMP                                     │
│  │ updated_at       │ TIMESTAMP                                     │
│  └──────────────────┘                                               │
└──────────────────────────────────────────────────────────────────────┘
```

## 关系说明

### 一对多关系 (1:N)

1. **users → posts**
   - 一个用户可以写多篇文章
   - 外键：posts.author_id → users.id

2. **users → comments**
   - 一个用户可以发表多条评论
   - 外键：comments.author_id → users.id

3. **users → media**
   - 一个用户可以上传多个媒体文件
   - 外键：media.uploader_id → users.id

4. **posts → comments**
   - 一篇文章可以有多个评论
   - 外键：comments.post_id → posts.id

5. **posts → media**
   - 一篇文章可以关联多个媒体文件
   - 外键：media.post_id → posts.id

6. **comments → comments** (自引用)
   - 评论可以嵌套回复
   - 外键：comments.parent_id → comments.id

7. **categories → categories** (自引用)
   - 分类可以有子分类
   - 外键：categories.parent_id → categories.id

### 多对多关系 (N:M)

1. **posts ↔ categories**
   - 通过中间表 `post_categories` 关联
   - 外键：
     - post_categories.post_id → posts.id
     - post_categories.category_id → categories.id

2. **posts ↔ tags**
   - 通过中间表 `post_tags` 关联
   - 外键：
     - post_tags.post_id → posts.id
     - post_tags.tag_id → tags.id

### 一对一关系 (1:1)

1. **posts → media** (特色图片)
   - 一篇文章可以有一个特色图片
   - 外键：posts.featured_image_id → media.id (可选)

## 级联操作

### CASCADE (级联删除)
- 删除用户时，删除其所有文章
- 删除文章时，删除相关评论和分类/标签关系
- 删除分类/标签时，删除相关关系

### SET NULL (设置为 NULL)
- 删除用户时，评论的 author_id 设为 NULL
- 删除文章时，媒体的 post_id 设为 NULL
- 删除父分类时，子分类的 parent_id 设为 NULL
- 删除父评论时，子评论的 parent_id 设为 NULL

## 约束说明

### 唯一性约束 (UNIQUE)
- users.username
- users.email
- posts.slug
- categories.slug
- tags.slug
- options.option_name
- post_categories (post_id, category_id) 组合唯一
- post_tags (post_id, tag_id) 组合唯一
- user_meta (user_id, meta_key) 组合唯一
- post_meta (post_id, meta_key) 组合唯一

### 检查约束 (CHECK)
- users.username: 正则表达式格式检查
- users.email: 邮箱格式检查

## 软删除

以下表支持软删除（通过 `deleted_at` 字段）：
- users
- posts
- comments

软删除的数据不会物理删除，只是在查询时过滤掉 `deleted_at IS NOT NULL` 的记录。

## JSONB 元数据

以下表包含 `metadata` 字段（JSONB 类型），用于存储灵活的扩展数据：
- users.metadata
- categories.metadata
- tags.metadata
- posts.metadata
- comments.metadata
- media.metadata

JSONB 字段支持：
- 灵活的数据结构
- 高效的查询和索引
- 无需修改表结构即可添加新字段

## 性能优化

### 索引策略
- 主键：所有表的 id 字段
- 外键：所有外键字段
- 唯一键：所有唯一约束字段
- 复合索引：常用查询组合
- 全文搜索：使用 GIN 索引
- JSONB：使用 GIN 索引

### 触发器
- 自动更新 `updated_at` 时间戳
- 自动更新分类/标签的文章计数
- 自动更新文章的评论计数

### 视图
- post_stats: 文章统计
- popular_posts: 热门文章
- category_stats: 分类统计
- tag_stats: 标签统计

---

**文档版本**: 1.0.0
**最后更新**: 2026-03-08
**作者**: Claude (Database Architect)
