# CyberPress Platform - ER 图（实体关系图）

## 📊 数据库实体关系图

```
┌─────────────────┐       ┌──────────────────┐       ┌─────────────────┐
│     users       │       │ user_sessions    │       │ user_preferences│
├─────────────────┤       ├──────────────────┤       ├─────────────────┤
│ id (PK)         │───┐   │ id (PK)          │       │ user_id (PK)    │
│ email           │   └───│ user_id (FK)     │───┐   │ theme           │
│ password_hash   │       │ token            │   └───│ language        │
│ name            │       │ refresh_token    │       │ timezone        │
│ avatar_url      │       │ expires_at       │       │ email_notifs    │
│ bio             │       │ created_at       │       │ created_at      │
│ role            │       └──────────────────┘       │ updated_at      │
│ status          │                                   └─────────────────┘
│ created_at      │
│ updated_at      │                                   1:1 关系
└─────────────────┘
       │
       │ 1:N
       ↓
┌─────────────────┐       ┌──────────────────┐       ┌─────────────────┐
│     posts       │◄──────│   post_tags      │───────►│      tags       │
├─────────────────┤       ├──────────────────┤       ├─────────────────┤
│ id (PK)         │       │ post_id (PK,FK)  │       │ id (PK)         │
│ title           │       │ tag_id (PK,FK)   │       │ name            │
│ slug            │       │ created_at       │       │ slug            │
│ excerpt         │       └──────────────────┘       │ description     │
│ content         │                                   │ post_count      │
│ featured_image  │           N:M 关系                 │ created_at      │
│ author_id (FK)  │                                   │ updated_at      │
│ category_id (FK)│                                   └─────────────────┘
│ status          │
│ published_at    │       ┌──────────────────┐
│ view_count      │       │   post_meta      │
│ like_count      │       ├──────────────────┤
│ comment_count   │       │ id (PK)          │
│ created_at      │───────│ post_id (FK)     │
│ updated_at      │       │ meta_key         │
└─────────────────┘       │ meta_value       │
       │                 │ created_at       │
       │ 1:N             │ updated_at       │
       ↓                 └──────────────────┘
┌─────────────────┐
│   comments      │       ┌──────────────────┐
├─────────────────┤       │ comment_likes    │
│ id (PK)         │───────├──────────────────┤
│ post_id (FK)    │       │ comment_id (PK,FK)│
│ parent_id (FK)  │       │ user_id (PK,FK)   │
│ author_name     │       │ created_at        │
│ author_email    │       └──────────────────┘
│ author_id (FK)  │
│ content         │           N:M 关系
│ status          │
│ like_count      │
│ depth           │
│ created_at      │
│ updated_at      │
└─────────────────┘
       │
       │ 1:N (自引用)
       ↓
   [parent_comment]

┌─────────────────┐
│   categories    │
├─────────────────┤
│ id (PK)         │
│ name            │
│ slug            │
│ description     │
│ parent_id (FK)  │───┐ (自引用，支持层级分类)
│ icon            │   │
│ color           │   │
│ sort_order      │   │
│ post_count      │   │
│ created_at      │   │
│ updated_at      │   │
└─────────────────┘   │
       │              │
       │ 1:N          │
       ↓              │
  [posts]             │
                      │
                      │ 1:N (父分类)
                      ↓
                 [parent_category]

┌─────────────────┐       ┌──────────────────┐
│  notifications  │       │   activity_log   │
├─────────────────┤       ├──────────────────┤
│ id (PK)         │       │ id (PK)          │
│ user_id (FK)    │       │ user_id (FK)     │
│ type            │       │ action           │
│ title           │       │ entity_type      │
│ message         │       │ entity_id        │
│ data (JSONB)    │       │ description      │
│ read            │       │ ip_address       │
│ created_at      │       │ user_agent       │
└─────────────────┘       │ created_at       │
                          └──────────────────┘

┌─────────────────┐       ┌──────────────────┐       ┌─────────────────┐
│  media_files    │       │   page_views     │       │newsletter_subs  │
├─────────────────┤       ├──────────────────┤       ├─────────────────┤
│ id (PK)         │       │ id (PK)          │       │ id (PK)         │
│ filename        │       │ post_id (FK)     │       │ email           │
│ original_name   │       │ path             │       │ name            │
│ mime_type       │       │ referrer         │       │ status          │
│ size            │       │ user_agent       │       │ confirm_token   │
│ width           │       │ ip_address       │       │ unsubscribe_tok │
│ height          │       │ session_id       │       │ subscribed_at   │
│ url             │       │ created_at       │       │ confirmed_at    │
│ alt_text        │       └──────────────────┘       │ unsubscribed_at │
│ uploaded_by (FK)│                                   └─────────────────┘
│ created_at      │
└─────────────────┘

┌─────────────────┐
│    settings     │
├─────────────────┤
│ key (PK)        │
│ value           │
│ description     │
│ type            │
│ updated_at      │
└─────────────────┘
```

## 🔗 关系说明

### 一对一关系 (1:1)
- **users ↔ user_preferences**: 每个用户有唯一偏好设置
- **users ↔ user_sessions**: 通过会话令牌关联（技术上1:N，但用户通常有少量活动会话）

### 一对多关系 (1:N)
- **users → posts**: 一个用户可以写多篇文章
- **users → comments**: 一个用户可以写多条评论
- **posts → comments**: 一篇文章有多条评论
- **posts → post_meta**: 一篇文章有多个元数据字段
- **categories → posts**: 一个分类包含多篇文章（支持层级分类）
- **users → notifications**: 一个用户有多条通知
- **users → activity_log**: 一个用户有多条活动记录
- **comments → comments**: 自引用，支持嵌套评论（parent_id）

### 多对多关系 (N:M)
- **posts ↔ tags**: 通过 `post_tags` 表关联
- **comments ↔ users**: 通过 `comment_likes` 表关联（点赞）

## 📈 数据流向

```
用户注册/登录
    ↓
用户会话 (user_sessions)
    ↓
创建文章 (posts)
    ↓
关联分类/标签 (categories, tags, post_tags)
    ↓
用户评论 (comments)
    ↓
点赞互动 (comment_likes)
    ↓
活动记录 (activity_log)
    ↓
发送通知 (notifications)
```

## 🎯 关键设计特点

### 1. **UUID 主键**
- 所有表使用 UUID 而非自增 ID
- 优势：分布式友好、安全性高、不可预测

### 2. **软删除设计**
- 通过 `status` 字段实现软删除
- 保留数据用于审计和恢复

### 3. **时间戳追踪**
- `created_at`: 记录创建时间
- `updated_at`: 记录更新时间（自动触发器更新）

### 4. **全文搜索支持**
- posts 表使用 GIN 索引支持全文搜索
- 使用 `to_tsvector('english', ...)` 函数

### 5. **JSONB 数据存储**
- notifications.data: 存储结构化通知数据
- 支持高效的 JSON 查询和索引

### 6. **层级结构支持**
- categories.parent_id: 支持多级分类
- comments.parent_id: 支持嵌套评论
- comments.depth: 记录评论深度

### 7. **会话管理**
- JWT 令牌存储在 user_sessions
- 支持令牌刷新和过期管理
- 记录用户代理和IP地址

### 8. **性能优化**
- 合理的索引设计
- 外键约束确保数据完整性
- 分区表支持（page_views 可按时间分区）

## 📊 数据量预估

| 表名 | 预估行数 | 增长率 | 存储需求 |
|------|---------|--------|----------|
| users | 1K-100K | 慢 | 小 |
| posts | 10K-1M | 中 | 中 |
| comments | 100K-10M | 快 | 大 |
| page_views | 1M-1B | 很快 | 很大 |
| notifications | 100K-10M | 快 | 大 |

## 🔒 安全考虑

1. **密码哈希**: users.password_hash 使用 bcrypt
2. **令牌安全**: 会话令牌加密存储
3. **IP追踪**: 记录敏感操作的IP地址
4. **SQL注入防护**: 使用参数化查询
5. **权限控制**: users.role 字段实现RBAC

## 🚀 性能优化建议

1. **读写分离**: 主库写，从库读
2. **缓存层**: Redis 缓存热点数据
3. **分区策略**: page_views 按月分区
4. **归档策略**: 历史数据定期归档
5. **连接池**: 使用连接池管理数据库连接
