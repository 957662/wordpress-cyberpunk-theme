# CyberPress Platform - 表结构详细文档

## 📚 目录
- [用户相关表](#用户相关表)
- [内容相关表](#内容相关表)
- [社交相关表](#社交相关表)
- [系统相关表](#系统相关表)

---

## 用户相关表

### users - 用户表

存储平台用户的基本信息和认证数据。

| 字段名 | 类型 | 约束 | 默认值 | 说明 |
|--------|------|------|--------|------|
| id | UUID | PRIMARY KEY | uuid_generate_v4() | 用户唯一标识 |
| email | VARCHAR(255) | UNIQUE NOT NULL | - | 用户邮箱（登录名） |
| password_hash | VARCHAR(255) | NOT NULL | - | bcrypt 密码哈希 |
| name | VARCHAR(255) | NOT NULL | - | 用户显示名称 |
| avatar_url | TEXT | - | NULL | 头像URL |
| bio | TEXT | - | NULL | 个人简介 |
| website | VARCHAR(255) | - | NULL | 个人网站 |
| location | VARCHAR(255) | - | NULL | 所在地 |
| role | VARCHAR(50) | NOT NULL | 'subscriber' | 用户角色 |
| status | VARCHAR(50) | NOT NULL | 'active' | 账号状态 |
| email_verified | BOOLEAN | - | FALSE | 邮箱验证状态 |
| last_login_at | TIMESTAMP | - | NULL | 最后登录时间 |
| created_at | TIMESTAMP | - | CURRENT_TIMESTAMP | 创建时间 |
| updated_at | TIMESTAMP | - | CURRENT_TIMESTAMP | 更新时间 |

**角色枚举值：**
- `admin`: 管理员 - 完全权限
- `editor`: 编辑 - 可管理所有内容
- `author`: 作者 - 可发布自己的文章
- `contributor`: 贡献者 - 可投稿，需审核
- `subscriber`: 订阅者 - 仅可评论

**状态枚举值：**
- `active`: 活跃
- `inactive`: 非活跃
- `suspended`: 暂停
- `banned`: 封禁

**索引：**
```sql
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role ON users(role);
CREATE INDEX idx_users_status ON users(status);
CREATE INDEX idx_users_created_at ON users(created_at);
```

---

### user_sessions - 用户会话表

管理用户的登录会话和JWT令牌。

| 字段名 | 类型 | 约束 | 默认值 | 说明 |
|--------|------|------|--------|------|
| id | UUID | PRIMARY KEY | uuid_generate_v4() | 会话唯一标识 |
| user_id | UUID | FOREIGN KEY → users(id) | NOT NULL | 关联用户 |
| token | VARCHAR(500) | UNIQUE NOT NULL | - | JWT访问令牌 |
| refresh_token | VARCHAR(500) | UNIQUE | NULL | 刷新令牌 |
| user_agent | TEXT | - | NULL | 客户端User-Agent |
| ip_address | INET | - | NULL | 登录IP地址 |
| expires_at | TIMESTAMP | NOT NULL | - | 令牌过期时间 |
| created_at | TIMESTAMP | - | CURRENT_TIMESTAMP | 创建时间 |

**索引：**
```sql
CREATE INDEX idx_sessions_user_id ON user_sessions(user_id);
CREATE INDEX idx_sessions_token ON user_sessions(token);
CREATE INDEX idx_sessions_expires_at ON user_sessions(expires_at);
```

**使用场景：**
- JWT令牌验证
- 会话管理
- 多设备登录控制
- 安全审计

---

### user_preferences - 用户偏好设置表

存储用户的个人偏好设置。

| 字段名 | 类型 | 约束 | 默认值 | 说明 |
|--------|------|------|--------|------|
| user_id | UUID | PRIMARY KEY, FOREIGN KEY | NOT NULL | 关联用户 |
| theme | VARCHAR(50) | - | 'dark' | 主题偏好 |
| language | VARCHAR(10) | - | 'en' | 语言设置 |
| timezone | VARCHAR(100) | - | 'UTC' | 时区设置 |
| email_notifications | BOOLEAN | - | TRUE | 邮件通知开关 |
| push_notifications | BOOLEAN | - | FALSE | 推送通知开关 |
| newsletter_subscribed | BOOLEAN | - | FALSE | 订阅新闻简报 |
| created_at | TIMESTAMP | - | CURRENT_TIMESTAMP | 创建时间 |
| updated_at | TIMESTAMP | - | CURRENT_TIMESTAMP | 更新时间 |

**主题枚举值：**
- `light`: 浅色主题
- `dark`: 深色主题
- `auto`: 自动切换

---

## 内容相关表

### posts - 文章表

存储博客文章的核心内容。

| 字段名 | 类型 | 约束 | 默认值 | 说明 |
|--------|------|------|--------|------|
| id | UUID | PRIMARY KEY | uuid_generate_v4() | 文章唯一标识 |
| title | VARCHAR(500) | NOT NULL | - | 文章标题 |
| slug | VARCHAR(500) | UNIQUE NOT NULL | - | URL友好的唯一标识 |
| excerpt | TEXT | - | NULL | 文章摘要 |
| content | TEXT | NOT NULL | - | 文章正文（Markdown） |
| featured_image | TEXT | - | NULL | 特色图片URL |
| author_id | UUID | FOREIGN KEY → users(id) | NOT NULL | 作者ID |
| category_id | UUID | FOREIGN KEY → categories(id) | NULL | 分类ID |
| status | VARCHAR(50) | NOT NULL | 'draft' | 发布状态 |
| comment_status | VARCHAR(50) | NOT NULL | 'open' | 评论状态 |
| published_at | TIMESTAMP | - | NULL | 发布时间 |
| scheduled_at | TIMESTAMP | - | NULL | 定时发布时间 |
| view_count | INTEGER | - | 0 | 浏览次数 |
| like_count | INTEGER | - | 0 | 点赞数 |
| comment_count | INTEGER | - | 0 | 评论数 |
| created_at | TIMESTAMP | - | CURRENT_TIMESTAMP | 创建时间 |
| updated_at | TIMESTAMP | - | CURRENT_TIMESTAMP | 更新时间 |

**状态枚举值：**
- `draft`: 草稿
- `published`: 已发布
- `scheduled`: 定时发布
- `archived`: 已归档

**评论状态枚举值：**
- `open`: 开放评论
- `closed`: 关闭评论

**索引：**
```sql
-- 全文搜索索引
CREATE INDEX idx_posts_search ON posts USING gin(to_tsvector('english', title || ' ' || content));

-- 常规查询索引
CREATE INDEX idx_posts_slug ON posts(slug);
CREATE INDEX idx_posts_author_id ON posts(author_id);
CREATE INDEX idx_posts_category_id ON posts(category_id);
CREATE INDEX idx_posts_status ON posts(status);
CREATE INDEX idx_posts_published_at ON posts(published_at DESC);
CREATE INDEX idx_posts_view_count ON posts(view_count DESC);
CREATE INDEX idx_posts_created_at ON posts(created_at DESC);
```

---

### categories - 分类表

管理文章分类，支持层级结构。

| 字段名 | 类型 | 约束 | 默认值 | 说明 |
|--------|------|------|--------|------|
| id | UUID | PRIMARY KEY | uuid_generate_v4() | 分类唯一标识 |
| name | VARCHAR(255) | NOT NULL | - | 分类名称 |
| slug | VARCHAR(255) | UNIQUE NOT NULL | - | URL友好标识 |
| description | TEXT | - | NULL | 分类描述 |
| parent_id | UUID | FOREIGN KEY → categories(id) | NULL | 父分类ID |
| icon | VARCHAR(100) | - | NULL | 图标名称 |
| color | VARCHAR(20) | - | NULL | 主题颜色 |
| sort_order | INTEGER | - | 0 | 排序顺序 |
| post_count | INTEGER | - | 0 | 文章数量 |
| created_at | TIMESTAMP | - | CURRENT_TIMESTAMP | 创建时间 |
| updated_at | TIMESTAMP | - | CURRENT_TIMESTAMP | 更新时间 |

**索引：**
```sql
CREATE INDEX idx_categories_slug ON categories(slug);
CREATE INDEX idx_categories_parent_id ON categories(parent_id);
```

**层级示例：**
```
Technology (技术)
├── Programming (编程)
│   ├── Web Development
│   └── Mobile Development
└── AI & Machine Learning
```

---

### tags - 标签表

管理文章标签，用于灵活分类。

| 字段名 | 类型 | 约束 | 默认值 | 说明 |
|--------|------|------|--------|------|
| id | UUID | PRIMARY KEY | uuid_generate_v4() | 标签唯一标识 |
| name | VARCHAR(255) | NOT NULL | - | 标签名称 |
| slug | VARCHAR(255) | UNIQUE NOT NULL | - | URL友好标识 |
| description | TEXT | - | NULL | 标签描述 |
| post_count | INTEGER | - | 0 | 使用次数 |
| created_at | TIMESTAMP | - | CURRENT_TIMESTAMP | 创建时间 |
| updated_at | TIMESTAMP | - | CURRENT_TIMESTAMP | 更新时间 |

**索引：**
```sql
CREATE INDEX idx_tags_slug ON tags(slug);
```

---

### post_tags - 文章标签关联表

实现文章与标签的多对多关系。

| 字段名 | 类型 | 约束 | 默认值 | 说明 |
|--------|------|------|--------|------|
| post_id | UUID | FOREIGN KEY → posts(id), PRIMARY KEY | NOT NULL | 文章ID |
| tag_id | UUID | FOREIGN KEY → tags(id), PRIMARY KEY | NOT NULL | 标签ID |
| created_at | TIMESTAMP | - | CURRENT_TIMESTAMP | 创建时间 |

**索引：**
```sql
CREATE INDEX idx_post_tags_tag_id ON post_tags(tag_id);
```

---

### post_meta - 文章元数据表

存储文章的扩展字段和SEO数据。

| 字段名 | 类型 | 约束 | 默认值 | 说明 |
|--------|------|------|--------|------|
| id | UUID | PRIMARY KEY | uuid_generate_v4() | 元数据唯一标识 |
| post_id | UUID | FOREIGN KEY → posts(id) | NOT NULL | 文章ID |
| meta_key | VARCHAR(255) | NOT NULL | - | 元数据键名 |
| meta_value | TEXT | - | NULL | 元数据值 |
| created_at | TIMESTAMP | - | CURRENT_TIMESTAMP | 创建时间 |
| updated_at | TIMESTAMP | - | CURRENT_TIMESTAMP | 更新时间 |

**唯一约束：**
```sql
UNIQUE(post_id, meta_key)
```

**常用元数据键：**
- `_seo_title`: SEO标题
- `_seo_description`: SEO描述
- `_seo_keywords`: SEO关键词
- `_reading_time`: 阅读时间（分钟）
- `_featured`: 是否精选
- `_views_today`: 今日浏览数

**索引：**
```sql
CREATE INDEX idx_post_meta_post_id ON post_meta(post_id);
CREATE INDEX idx_post_meta_key ON post_meta(meta_key);
```

---

## 社交相关表

### comments - 评论表

存储用户评论，支持嵌套回复。

| 字段名 | 类型 | 约束 | 默认值 | 说明 |
|--------|------|------|--------|------|
| id | UUID | PRIMARY KEY | uuid_generate_v4() | 评论唯一标识 |
| post_id | UUID | FOREIGN KEY → posts(id) | NOT NULL | 文章ID |
| parent_id | UUID | FOREIGN KEY → comments(id) | NULL | 父评论ID（嵌套） |
| author_name | VARCHAR(255) | NOT NULL | - | 作者名称 |
| author_email | VARCHAR(255) | NOT NULL | - | 作者邮箱 |
| author_url | VARCHAR(500) | - | NULL | 作者网站 |
| author_id | UUID | FOREIGN KEY → users(id) | NULL | 注册用户ID |
| content | TEXT | NOT NULL | - | 评论内容 |
| status | VARCHAR(50) | NOT NULL | 'pending' | 审核状态 |
| ip_address | INET | - | NULL | 评论者IP |
| user_agent | TEXT | - | NULL | 浏览器UA |
| like_count | INTEGER | - | 0 | 点赞数 |
| depth | INTEGER | - | 0 | 嵌套深度 |
| created_at | TIMESTAMP | - | CURRENT_TIMESTAMP | 创建时间 |
| updated_at | TIMESTAMP | - | CURRENT_TIMESTAMP | 更新时间 |

**状态枚举值：**
- `pending`: 待审核
- `approved`: 已批准
- `rejected`: 已拒绝
- `spam`: 垃圾评论

**索引：**
```sql
CREATE INDEX idx_comments_post_id ON comments(post_id);
CREATE INDEX idx_comments_parent_id ON comments(parent_id);
CREATE INDEX idx_comments_author_id ON comments(author_id);
CREATE INDEX idx_comments_status ON comments(status);
CREATE INDEX idx_comments_created_at ON comments(created_at DESC);
```

---

### comment_likes - 评论点赞表

记录用户对评论的点赞。

| 字段名 | 类型 | 约束 | 默认值 | 说明 |
|--------|------|------|--------|------|
| comment_id | UUID | FOREIGN KEY → comments(id), PRIMARY KEY | NOT NULL | 评论ID |
| user_id | UUID | FOREIGN KEY → users(id), PRIMARY KEY | NULL | 用户ID |
| created_at | TIMESTAMP | - | CURRENT_TIMESTAMP | 点赞时间 |

**索引：**
```sql
CREATE INDEX idx_comment_likes_user_id ON comment_likes(user_id);
```

---

## 系统相关表

### notifications - 通知表

存储用户通知消息。

| 字段名 | 类型 | 约束 | 默认值 | 说明 |
|--------|------|------|--------|------|
| id | UUID | PRIMARY KEY | uuid_generate_v4() | 通知唯一标识 |
| user_id | UUID | FOREIGN KEY → users(id) | NOT NULL | 接收用户ID |
| type | VARCHAR(100) | NOT NULL | - | 通知类型 |
| title | VARCHAR(500) | NOT NULL | - | 通知标题 |
| message | TEXT | NOT NULL | - | 通知内容 |
| data | JSONB | - | NULL | 扩展数据 |
| read | BOOLEAN | - | FALSE | 已读状态 |
| created_at | TIMESTAMP | - | CURRENT_TIMESTAMP | 创建时间 |

**通知类型：**
- `comment_new`: 新评论
- `comment_reply`: 评论回复
- `like_new`: 新点赞
- `follow_new`: 新关注
- `post_published`: 文章发布
- `system`: 系统通知

**索引：**
```sql
CREATE INDEX idx_notifications_user_id ON notifications(user_id);
CREATE INDEX idx_notifications_read ON notifications(read);
CREATE INDEX idx_notifications_created_at ON notifications(created_at DESC);
```

---

### activity_log - 活动日志表

记录用户操作和系统事件。

| 字段名 | 类型 | 约束 | 默认值 | 说明 |
|--------|------|------|--------|------|
| id | UUID | PRIMARY KEY | uuid_generate_v4() | 日志唯一标识 |
| user_id | UUID | FOREIGN KEY → users(id) | NULL | 操作用户ID |
| action | VARCHAR(100) | NOT NULL | - | 操作类型 |
| entity_type | VARCHAR(100) | - | NULL | 实体类型 |
| entity_id | UUID | - | NULL | 实体ID |
| description | TEXT | - | NULL | 操作描述 |
| ip_address | INET | - | NULL | 操作IP |
| user_agent | TEXT | - | NULL | 浏览器UA |
| created_at | TIMESTAMP | - | CURRENT_TIMESTAMP | 创建时间 |

**操作类型示例：**
- `user.login`: 用户登录
- `user.logout`: 用户登出
- `post.create`: 创建文章
- `post.update`: 更新文章
- `post.delete`: 删除文章
- `comment.create`: 发表评论

**索引：**
```sql
CREATE INDEX idx_activity_user_id ON activity_log(user_id);
CREATE INDEX idx_activity_entity ON activity_log(entity_type, entity_id);
CREATE INDEX idx_activity_created_at ON activity_log(created_at DESC);
```

---

### page_views - 页面浏览表

记录页面访问统计。

| 字段名 | 类型 | 约束 | 默认值 | 说明 |
|--------|------|------|--------|------|
| id | UUID | PRIMARY KEY | uuid_generate_v4() | 记录唯一标识 |
| post_id | UUID | FOREIGN KEY → posts(id) | NULL | 文章ID |
| path | VARCHAR(500) | NOT NULL | - | 访问路径 |
| referrer | TEXT | - | NULL | 来源页面 |
| user_agent | TEXT | - | NULL | 浏览器UA |
| ip_address | INET | - | NULL | 访问IP |
| session_id | VARCHAR(255) | - | NULL | 会话ID |
| created_at | TIMESTAMP | - | CURRENT_TIMESTAMP | 访问时间 |

**索引：**
```sql
CREATE INDEX idx_page_views_post_id ON page_views(post_id);
CREATE INDEX idx_page_views_path ON page_views(path);
CREATE INDEX idx_page_views_created_at ON page_views(created_at);
```

---

### media_files - 媒体文件表

管理上传的媒体文件。

| 字段名 | 类型 | 约束 | 默认值 | 说明 |
|--------|------|------|--------|------|
| id | UUID | PRIMARY KEY | uuid_generate_v4() | 文件唯一标识 |
| filename | VARCHAR(500) | NOT NULL | - | 存储文件名 |
| original_filename | VARCHAR(500) | NOT NULL | - | 原始文件名 |
| mime_type | VARCHAR(100) | NOT NULL | - | MIME类型 |
| size | BIGINT | NOT NULL | - | 文件大小（字节） |
| width | INTEGER | - | NULL | 图片宽度 |
| height | INTEGER | - | NULL | 图片高度 |
| url | TEXT | NOT NULL | - | 访问URL |
| alt_text | VARCHAR(500) | - | NULL | 替代文本 |
| caption | TEXT | - | NULL | 图片说明 |
| uploaded_by | UUID | FOREIGN KEY → users(id) | NULL | 上传用户ID |
| created_at | TIMESTAMP | - | CURRENT_TIMESTAMP | 上传时间 |

**索引：**
```sql
CREATE INDEX idx_media_files_mime_type ON media_files(mime_type);
CREATE INDEX idx_media_files_uploaded_by ON media_files(uploaded_by);
```

---

### newsletter_subscriptions - 邮件订阅表

管理邮件简报订阅。

| 字段名 | 类型 | 约束 | 默认值 | 说明 |
|--------|------|------|--------|------|
| id | UUID | PRIMARY KEY | uuid_generate_v4() | 订阅唯一标识 |
| email | VARCHAR(255) | UNIQUE NOT NULL | - | 订阅邮箱 |
| name | VARCHAR(255) | - | NULL | 订阅者名称 |
| status | VARCHAR(50) | NOT NULL | 'pending' | 订阅状态 |
| confirm_token | VARCHAR(255) | UNIQUE | NULL | 确认令牌 |
| unsubscribe_token | VARCHAR(255) | UNIQUE | NULL | 取消令牌 |
| subscribed_at | TIMESTAMP | - | CURRENT_TIMESTAMP | 订阅时间 |
| unsubscribed_at | TIMESTAMP | - | NULL | 取消时间 |
| confirmed_at | TIMESTAMP | - | NULL | 确认时间 |

**状态枚举值：**
- `pending`: 待确认
- `active`: 已激活
- `unsubscribed`: 已取消
- `bounced`: 退信

**索引：**
```sql
CREATE INDEX idx_newsletter_email ON newsletter_subscriptions(email);
CREATE INDEX idx_newsletter_status ON newsletter_subscriptions(status);
```

---

### settings - 系统设置表

存储系统全局配置。

| 字段名 | 类型 | 约束 | 默认值 | 说明 |
|--------|------|------|--------|------|
| key | VARCHAR(255) | PRIMARY KEY | - | 设置键名 |
| value | TEXT | NOT NULL | - | 设置值 |
| description | TEXT | - | NULL | 设置说明 |
| type | VARCHAR(50) | NOT NULL | 'string' | 值类型 |
| updated_at | TIMESTAMP | - | CURRENT_TIMESTAMP | 更新时间 |

**类型枚举值：**
- `string`: 字符串
- `number`: 数字
- `boolean`: 布尔值
- `json`: JSON数据

**预设配置：**
| key | value | description | type |
|-----|-------|-------------|------|
| site_title | CyberPress | 网站标题 | string |
| site_description | A modern blogging platform | 网站描述 | string |
| posts_per_page | 10 | 每页文章数 | number |
| comments_enabled | true | 启用评论 | boolean |

---

## 🔧 触发器

### updated_at 自动更新触发器

```sql
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;
```

应用于所有包含 `updated_at` 字段的表：

```sql
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_posts_updated_at BEFORE UPDATE ON posts
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ... 其他表
```

---

## 📊 数据完整性约束

### 外键约束
- 所有外键都有适当的 ON DELETE 行为：
  - `CASCADE`: 删除父记录时同时删除子记录
  - `SET NULL`: 删除父记录时子记录外键设为 NULL
  - `RESTRICT`: 有子记录时禁止删除父记录

### 检查约束
- 枚举类型字段的值范围检查
- 确保数据一致性

### 唯一约束
- 确保关键字段的唯一性
- 防止重复数据

---

## 🚀 性能优化建议

### 1. 分区策略
对大表（如 `page_views`）按时间分区：
```sql
CREATE TABLE page_views (
    -- ...
) PARTITION BY RANGE (created_at);

CREATE TABLE page_views_2024_01 PARTITION OF page_views
    FOR VALUES FROM ('2024-01-01') TO ('2024-02-01');
```

### 2. 物化视图
对复杂查询创建物化视图：
```sql
CREATE MATERIALIZED VIEW post_stats AS
SELECT
    p.id,
    p.title,
    p.view_count,
    p.like_count,
    p.comment_count,
    c.name as category_name,
    u.name as author_name
FROM posts p
LEFT JOIN categories c ON p.category_id = c.id
LEFT JOIN users u ON p.author_id = u.id;
```

### 3. 定期维护
- 定期 VACUUM 和 ANALYZE
- 重建碎片化索引
- 归档历史数据
