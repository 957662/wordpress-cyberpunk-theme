# 📋 CyberPress Platform - Database Tables Reference

> 完整的数据库表结构参考手册

---

## 📚 目录

1. [核心表](#核心表)
2. [社交功能表](#社交功能表)
3. [系统功能表](#系统功能表)
4. [关系表](#关系表)
5. [数据类型](#数据类型)
6. [索引列表](#索引列表)
7. [触发器列表](#触发器列表)
8. [视图列表](#视图列表)

---

## 核心表

### 1. users（用户表）

存储用户账户和个人信息。

| 字段名 | 类型 | 约束 | 默认值 | 说明 |
|--------|------|------|--------|------|
| id | UUID | PRIMARY KEY | uuid_generate_v4() | 用户唯一标识 |
| username | VARCHAR(50) | UNIQUE, NOT NULL | - | 用户名 |
| email | VARCHAR(255) | UNIQUE, NOT NULL | - | 邮箱地址 |
| password_hash | VARCHAR(255) | NOT NULL | - | 密码哈希 |
| display_name | VARCHAR(100) | - | NULL | 显示名称 |
| bio | TEXT | - | NULL | 个人简介 |
| avatar_url | VARCHAR(500) | - | NULL | 头像URL |
| website_url | VARCHAR(500) | - | NULL | 个人网站 |
| location | VARCHAR(100) | - | NULL | 位置 |
| birth_date | DATE | - | NULL | 出生日期 |
| role | user_role | - | 'author' | 用户角色 |
| status | user_status | - | 'active' | 用户状态 |
| email_verified_at | TIMESTAMP | - | NULL | 邮箱验证时间 |
| last_login_at | TIMESTAMP | - | NULL | 最后登录时间 |
| login_count | INTEGER | - | 0 | 登录次数 |
| metadata | JSONB | - | '{}' | 元数据 |
| preferences | JSONB | - | {...} | 用户偏好设置 |
| created_at | TIMESTAMP | - | CURRENT_TIMESTAMP | 创建时间 |
| updated_at | TIMESTAMP | - | CURRENT_TIMESTAMP | 更新时间 |

**角色类型：**
- `admin` - 管理员
- `editor` - 编辑
- `author` - 作者
- `subscriber` - 订阅者

**状态类型：**
- `active` - 激活
- `inactive` - 未激活
- `banned` - 已封禁
- `pending` - 待审核

### 2. categories（分类表）

存储文章分类信息，支持层级结构。

| 字段名 | 类型 | 约束 | 默认值 | 说明 |
|--------|------|------|--------|------|
| id | UUID | PRIMARY KEY | uuid_generate_v4() | 分类唯一标识 |
| name | VARCHAR(100) | NOT NULL | - | 分类名称 |
| slug | VARCHAR(100) | UNIQUE, NOT NULL | - | URL友好名称 |
| description | TEXT | - | NULL | 分类描述 |
| parent_id | UUID | FOREIGN KEY | NULL | 父分类ID |
| icon | VARCHAR(50) | - | NULL | 图标 |
| color | VARCHAR(7) | - | NULL | 颜色代码 |
| cover_image | VARCHAR(500) | - | NULL | 封面图片 |
| sort_order | INTEGER | - | 0 | 排序顺序 |
| post_count | INTEGER | - | 0 | 文章计数 |
| metadata | JSONB | - | '{}' | 元数据 |
| created_at | TIMESTAMP | - | CURRENT_TIMESTAMP | 创建时间 |
| updated_at | TIMESTAMP | - | CURRENT_TIMESTAMP | 更新时间 |

### 3. tags（标签表）

存储文章标签信息。

| 字段名 | 类型 | 约束 | 默认值 | 说明 |
|--------|------|------|--------|------|
| id | UUID | PRIMARY KEY | uuid_generate_v4() | 标签唯一标识 |
| name | VARCHAR(50) | NOT NULL | - | 标签名称 |
| slug | VARCHAR(50) | UNIQUE, NOT NULL | - | URL友好名称 |
| description | TEXT | - | NULL | 标签描述 |
| color | VARCHAR(7) | - | NULL | 颜色代码 |
| icon | VARCHAR(50) | - | NULL | 图标 |
| usage_count | INTEGER | - | 0 | 使用次数 |
| metadata | JSONB | - | '{}' | 元数据 |
| created_at | TIMESTAMP | - | CURRENT_TIMESTAMP | 创建时间 |
| updated_at | TIMESTAMP | - | CURRENT_TIMESTAMP | 更新时间 |

### 4. posts（文章表）

存储文章和内容。

| 字段名 | 类型 | 约束 | 默认值 | 说明 |
|--------|------|------|--------|------|
| id | UUID | PRIMARY KEY | uuid_generate_v4() | 文章唯一标识 |
| author_id | UUID | FOREIGN KEY, NOT NULL | - | 作者ID |
| title | VARCHAR(255) | NOT NULL | - | 文章标题 |
| slug | VARCHAR(255) | UNIQUE, NOT NULL | - | URL友好名称 |
| excerpt | TEXT | - | NULL | 文章摘要 |
| content | TEXT | NOT NULL | - | 文章内容（Markdown） |
| content_html | TEXT | - | NULL | HTML内容 |
| featured_image_url | VARCHAR(500) | - | NULL | 特色图片URL |
| status | post_status | - | 'draft' | 文章状态 |
| post_type | post_type | - | 'post' | 文章类型 |
| comment_status | VARCHAR(20) | CHECK | 'open' | 评论状态 |
| ping_status | VARCHAR(20) | - | 'open' | Ping状态 |
| password | VARCHAR(255) | - | NULL | 密码保护 |
| view_count | INTEGER | - | 0 | 浏览次数 |
| like_count | INTEGER | - | 0 | 点赞数 |
| comment_count | INTEGER | - | 0 | 评论数 |
| is_featured | BOOLEAN | - | FALSE | 是否精选 |
| is_sticky | BOOLEAN | - | FALSE | 是否置顶 |
| is_sponsored | BOOLEAN | - | FALSE | 是否赞助 |
| reading_time | INTEGER | - | 0 | 阅读时间（分钟） |
| published_at | TIMESTAMP | - | NULL | 发布时间 |
| scheduled_at | TIMESTAMP | - | NULL | 计划发布时间 |
| metadata | JSONB | - | '{}' | 元数据 |
| seo_data | JSONB | - | {...} | SEO数据 |
| created_at | TIMESTAMP | - | CURRENT_TIMESTAMP | 创建时间 |
| updated_at | TIMESTAMP | - | CURRENT_TIMESTAMP | 更新时间 |

**文章状态：**
- `draft` - 草稿
- `published` - 已发布
- `private` - 私密
- `trash` - 回收站
- `scheduled` - 计划发布

**文章类型：**
- `post` - 文章
- `portfolio` - 作品集
- `page` - 页面

### 5. comments（评论表）

存储文章评论。

| 字段名 | 类型 | 约束 | 默认值 | 说明 |
|--------|------|------|--------|------|
| id | UUID | PRIMARY KEY | uuid_generate_v4() | 评论唯一标识 |
| post_id | UUID | FOREIGN KEY, NOT NULL | - | 文章ID |
| author_id | UUID | FOREIGN KEY | NULL | 作者ID |
| parent_id | UUID | FOREIGN KEY | NULL | 父评论ID |
| author_name | VARCHAR(100) | - | NULL | 作者名称 |
| author_email | VARCHAR(255) | - | NULL | 作者邮箱 |
| author_url | VARCHAR(500) | - | NULL | 作者URL |
| author_ip | VARCHAR(45) | - | NULL | 作者IP |
| content | TEXT | NOT NULL | - | 评论内容 |
| content_html | TEXT | - | NULL | HTML内容 |
| status | comment_status | - | 'pending' | 评论状态 |
| agent | VARCHAR(255) | - | NULL | 用户代理 |
| like_count | INTEGER | - | 0 | 点赞数 |
| metadata | JSONB | - | '{}' | 元数据 |
| created_at | TIMESTAMP | - | CURRENT_TIMESTAMP | 创建时间 |
| updated_at | TIMESTAMP | - | CURRENT_TIMESTAMP | 更新时间 |

**评论状态：**
- `pending` - 待审核
- `approved` - 已批准
- `spam` - 垃圾评论
- `trash` - 回收站

### 6. media（媒体库表）

存储上传的媒体文件信息。

| 字段名 | 类型 | 约束 | 默认值 | 说明 |
|--------|------|------|--------|------|
| id | UUID | PRIMARY KEY | uuid_generate_v4() | 媒体唯一标识 |
| uploader_id | UUID | FOREIGN KEY, NOT NULL | - | 上传者ID |
| file_name | VARCHAR(255) | NOT NULL | - | 文件名 |
| file_path | VARCHAR(500) | NOT NULL | - | 文件路径 |
| file_url | VARCHAR(500) | NOT NULL | - | 文件URL |
| file_size | BIGINT | - | NULL | 文件大小（字节） |
| mime_type | VARCHAR(100) | - | NULL | MIME类型 |
| file_type | media_type | - | 'other' | 文件类型 |
| width | INTEGER | - | NULL | 图片宽度（像素） |
| height | INTEGER | - | NULL | 图片高度（像素） |
| duration | INTEGER | - | NULL | 视频时长（秒） |
| alt_text | VARCHAR(255) | - | NULL | 替代文本 |
| caption | TEXT | - | NULL | 说明文字 |
| description | TEXT | - | NULL | 描述 |
| thumbnail_url | VARCHAR(500) | - | NULL | 缩略图URL |
| metadata | JSONB | - | '{}' | 元数据 |
| created_at | TIMESTAMP | - | CURRENT_TIMESTAMP | 创建时间 |
| updated_at | TIMESTAMP | - | CURRENT_TIMESTAMP | 更新时间 |

**媒体类型：**
- `image` - 图片
- `video` - 视频
- `audio` - 音频
- `document` - 文档
- `other` - 其他

### 7. portfolios（作品集表）

存储用户作品集信息。

| 字段名 | 类型 | 约束 | 默认值 | 说明 |
|--------|------|------|--------|------|
| id | UUID | PRIMARY KEY | uuid_generate_v4() | 作品唯一标识 |
| author_id | UUID | FOREIGN KEY, NOT NULL | - | 作者ID |
| title | VARCHAR(255) | NOT NULL | - | 作品标题 |
| slug | VARCHAR(255) | UNIQUE, NOT NULL | - | URL友好名称 |
| description | TEXT | - | NULL | 作品描述 |
| content | TEXT | NOT NULL | - | 作品内容 |
| content_html | TEXT | - | NULL | HTML内容 |
| project_url | VARCHAR(500) | - | NULL | 项目URL |
| github_url | VARCHAR(500) | - | NULL | GitHub URL |
| demo_url | VARCHAR(500) | - | NULL | 演示URL |
| featured_image_url | VARCHAR(500) | - | NULL | 特色图片URL |
| gallery | JSONB | - | [] | 作品集图库 |
| technologies | JSONB | - | [] | 使用技术 |
| start_date | DATE | - | NULL | 开始日期 |
| end_date | DATE | - | NULL | 结束日期 |
| status | post_status | - | 'draft' | 作品状态 |
| sort_order | INTEGER | - | 0 | 排序顺序 |
| is_featured | BOOLEAN | - | FALSE | 是否精选 |
| view_count | INTEGER | - | 0 | 浏览次数 |
| like_count | INTEGER | - | 0 | 点赞数 |
| metadata | JSONB | - | '{}' | 元数据 |
| created_at | TIMESTAMP | - | CURRENT_TIMESTAMP | 创建时间 |
| updated_at | TIMESTAMP | - | CURRENT_TIMESTAMP | 更新时间 |

### 8. pages（页面表）

存储静态页面信息。

| 字段名 | 类型 | 约束 | 默认值 | 说明 |
|--------|------|------|--------|------|
| id | UUID | PRIMARY KEY | uuid_generate_v4() | 页面唯一标识 |
| author_id | UUID | FOREIGN KEY, NOT NULL | - | 作者ID |
| title | VARCHAR(255) | NOT NULL | - | 页面标题 |
| slug | VARCHAR(255) | UNIQUE, NOT NULL | - | URL友好名称 |
| content | TEXT | NOT NULL | - | 页面内容 |
| content_html | TEXT | - | NULL | HTML内容 |
| featured_image_url | VARCHAR(500) | - | NULL | 特色图片URL |
| template | VARCHAR(50) | - | 'default' | 页面模板 |
| status | post_status | - | 'draft' | 页面状态 |
| parent_id | UUID | FOREIGN KEY | NULL | 父页面ID |
| sort_order | INTEGER | - | 0 | 排序顺序 |
| view_count | INTEGER | - | 0 | 浏览次数 |
| metadata | JSONB | - | '{}' | 元数据 |
| created_at | TIMESTAMP | - | CURRENT_TIMESTAMP | 创建时间 |
| updated_at | TIMESTAMP | - | CURRENT_TIMESTAMP | 更新时间 |

---

## 社交功能表

### 9. likes（点赞表）

存储用户点赞记录。

| 字段名 | 类型 | 约束 | 默认值 | 说明 |
|--------|------|------|--------|------|
| id | UUID | PRIMARY KEY | uuid_generate_v4() | 点赞记录ID |
| user_id | UUID | FOREIGN KEY, NOT NULL | - | 用户ID |
| target_type | VARCHAR(20) | CHECK, NOT NULL | - | 目标类型 |
| target_id | UUID | NOT NULL | - | 目标ID |
| created_at | TIMESTAMP | - | CURRENT_TIMESTAMP | 创建时间 |

**唯一约束：** `(user_id, target_type, target_id)`

**目标类型：**
- `post` - 文章
- `comment` - 评论
- `portfolio` - 作品集

### 10. bookmarks（收藏表）

存储用户收藏的文章。

| 字段名 | 类型 | 约束 | 默认值 | 说明 |
|--------|------|------|--------|------|
| id | UUID | PRIMARY KEY | uuid_generate_v4() | 收藏记录ID |
| user_id | UUID | FOREIGN KEY, NOT NULL | - | 用户ID |
| post_id | UUID | FOREIGN KEY, NOT NULL | - | 文章ID |
| folder | VARCHAR(50) | - | 'default' | 收藏夹 |
| notes | TEXT | - | NULL | 备注 |
| is_favorite | BOOLEAN | - | FALSE | 是否特别收藏 |
| created_at | TIMESTAMP | - | CURRENT_TIMESTAMP | 创建时间 |
| updated_at | TIMESTAMP | - | CURRENT_TIMESTAMP | 更新时间 |

**唯一约束：** `(user_id, post_id)`

### 11. follows（关注表）

存储用户关注关系。

| 字段名 | 类型 | 约束 | 默认值 | 说明 |
|--------|------|------|--------|------|
| id | UUID | PRIMARY KEY | uuid_generate_v4() | 关注记录ID |
| follower_id | UUID | FOREIGN KEY, NOT NULL | - | 关注者ID |
| following_id | UUID | FOREIGN KEY, NOT NULL | - | 被关注者ID |
| created_at | TIMESTAMP | - | CURRENT_TIMESTAMP | 关注时间 |

**唯一约束：** `(follower_id, following_id)`
**检查约束：** `follower_id != following_id`（不能关注自己）

### 12. notifications（通知表）

存储用户通知。

| 字段名 | 类型 | 约束 | 默认值 | 说明 |
|--------|------|------|--------|------|
| id | UUID | PRIMARY KEY | uuid_generate_v4() | 通知ID |
| user_id | UUID | FOREIGN KEY, NOT NULL | - | 用户ID |
| type | notification_type | NOT NULL | - | 通知类型 |
| title | VARCHAR(255) | NOT NULL | - | 通知标题 |
| content | TEXT | - | NULL | 通知内容 |
| link_url | VARCHAR(500) | - | NULL | 链接URL |
| is_read | BOOLEAN | - | FALSE | 是否已读 |
| metadata | JSONB | - | '{}' | 元数据 |
| created_at | TIMESTAMP | - | CURRENT_TIMESTAMP | 创建时间 |

**通知类型：**
- `comment` - 新评论
- `like` - 新点赞
- `follow` - 新关注
- `mention` - 提及
- `reply` - 回复
- `system` - 系统通知
- `welcome` - 欢迎通知

### 13. reading_progress（阅读进度表）

存储用户阅读进度。

| 字段名 | 类型 | 约束 | 默认值 | 说明 |
|--------|------|------|--------|------|
| id | UUID | PRIMARY KEY | uuid_generate_v4() | 进度记录ID |
| user_id | UUID | FOREIGN KEY, NOT NULL | - | 用户ID |
| post_id | UUID | FOREIGN KEY, NOT NULL | - | 文章ID |
| is_read | BOOLEAN | - | FALSE | 是否已读 |
| is_favorite | BOOLEAN | - | FALSE | 是否特别收藏 |
| notes | TEXT | - | NULL | 笔记 |
| progress_percent | INTEGER | CHECK | 0 | 阅读进度（0-100） |
| last_position | INTEGER | - | 0 | 最后阅读位置 |
| read_time | INTEGER | - | 0 | 阅读时长（秒） |
| created_at | TIMESTAMP | - | CURRENT_TIMESTAMP | 创建时间 |
| updated_at | TIMESTAMP | - | CURRENT_TIMESTAMP | 更新时间 |

**唯一约束：** `(user_id, post_id)`
**检查约束：** `progress_percent >= 0 AND progress_percent <= 100`

---

## 系统功能表

### 14. analytics（统计分析表）

存储网站访问统计。

| 字段名 | 类型 | 约束 | 默认值 | 说明 |
|--------|------|------|--------|------|
| id | BIGSERIAL | PRIMARY KEY | - | 统计记录ID |
| post_id | UUID | FOREIGN KEY | NULL | 文章ID |
| user_id | UUID | FOREIGN KEY | NULL | 用户ID |
| session_id | VARCHAR(255) | - | NULL | 会话ID |
| ip_address | VARCHAR(45) | - | NULL | IP地址 |
| user_agent | VARCHAR(255) | - | NULL | 用户代理 |
| referrer | VARCHAR(500) | - | NULL | 来源页面 |
| page_url | VARCHAR(500) | - | NULL | 页面URL |
| duration_seconds | INTEGER | - | NULL | 停留时长（秒） |
| event_type | VARCHAR(50) | - | 'view' | 事件类型 |
| metadata | JSONB | - | '{}' | 元数据 |
| created_at | TIMESTAMP | - | CURRENT_TIMESTAMP | 创建时间 |

### 15. search_logs（搜索日志表）

存储搜索查询记录。

| 字段名 | 类型 | 约束 | 默认值 | 说明 |
|--------|------|------|--------|------|
| id | BIGSERIAL | PRIMARY KEY | - | 搜索记录ID |
| query | TEXT | NOT NULL | - | 搜索查询 |
| results_count | INTEGER | - | 0 | 结果数量 |
| clicked_ids | JSONB | - | [] | 点击的文章ID |
| user_id | UUID | FOREIGN KEY | NULL | 用户ID |
| ip_address | VARCHAR(45) | - | NULL | IP地址 |
| user_agent | VARCHAR(255) | - | NULL | 用户代理 |
| created_at | TIMESTAMP | - | CURRENT_TIMESTAMP | 创建时间 |

### 16. audit_logs（审计日志表）

存储系统审计日志。

| 字段名 | 类型 | 约束 | 默认值 | 说明 |
|--------|------|------|--------|------|
| id | BIGSERIAL | PRIMARY KEY | - | 日志记录ID |
| user_id | UUID | FOREIGN KEY | NULL | 用户ID |
| action | audit_action | NOT NULL | - | 操作类型 |
| entity_type | VARCHAR(50) | NOT NULL | - | 实体类型 |
| entity_id | UUID | NOT NULL | - | 实体ID |
| old_values | JSONB | - | NULL | 旧值 |
| new_values | JSONB | - | NULL | 新值 |
| ip_address | VARCHAR(45) | - | NULL | IP地址 |
| user_agent | VARCHAR(255) | - | NULL | 用户代理 |
| created_at | TIMESTAMP | - | CURRENT_TIMESTAMP | 创建时间 |

**操作类型：**
- `create` - 创建
- `update` - 更新
- `delete` - 删除
- `login` - 登录
- `logout` - 登出
- `view` - 查看
- `export` - 导出
- `import` - 导入

### 17. settings（系统设置表）

存储系统配置。

| 字段名 | 类型 | 约束 | 默认值 | 说明 |
|--------|------|------|--------|------|
| id | BIGSERIAL | PRIMARY KEY | - | 设置ID |
| key | VARCHAR(100) | UNIQUE, NOT NULL | - | 设置键 |
| value | TEXT | - | NULL | 设置值 |
| value_type | VARCHAR(20) | - | 'string' | 值类型 |
| category | VARCHAR(50) | - | 'general' | 分类 |
| description | TEXT | - | NULL | 描述 |
| is_public | BOOLEAN | - | FALSE | 是否公开 |
| is_editable | BOOLEAN | - | TRUE | 是否可编辑 |
| updated_at | TIMESTAMP | - | CURRENT_TIMESTAMP | 更新时间 |

**值类型：**
- `string` - 字符串
- `number` - 数字
- `boolean` - 布尔值
- `json` - JSON对象

### 18. schema_migrations（迁移历史表）

存储数据库迁移历史。

| 字段名 | 类型 | 约束 | 默认值 | 说明 |
|--------|------|------|--------|------|
| id | BIGSERIAL | PRIMARY KEY | - | 记录ID |
| version | VARCHAR(50) | UNIQUE, NOT NULL | - | 迁移版本 |
| description | TEXT | - | NULL | 描述 |
| applied_at | TIMESTAMP | - | CURRENT_TIMESTAMP | 应用时间 |

---

## 关系表

### 19. post_categories（文章-分类关系表）

文章和分类的多对多关系。

| 字段名 | 类型 | 约束 | 默认值 | 说明 |
|--------|------|------|--------|------|
| post_id | UUID | FOREIGN KEY, NOT NULL | - | 文章ID |
| category_id | UUID | FOREIGN KEY, NOT NULL | - | 分类ID |
| is_primary | BOOLEAN | - | FALSE | 是否主分类 |
| created_at | TIMESTAMP | - | CURRENT_TIMESTAMP | 创建时间 |

**主键：** `(post_id, category_id)`

### 20. post_tags（文章-标签关系表）

文章和标签的多对多关系。

| 字段名 | 类型 | 约束 | 默认值 | 说明 |
|--------|------|------|--------|------|
| post_id | UUID | FOREIGN KEY, NOT NULL | - | 文章ID |
| tag_id | UUID | FOREIGN KEY, NOT NULL | - | 标签ID |
| created_at | TIMESTAMP | - | CURRENT_TIMESTAMP | 创建时间 |

**主键：** `(post_id, tag_id)`

---

## 数据类型

### 枚举类型

#### user_role
```sql
CREATE TYPE user_role AS ENUM ('admin', 'editor', 'author', 'subscriber');
```

#### user_status
```sql
CREATE TYPE user_status AS ENUM ('active', 'inactive', 'banned', 'pending');
```

#### post_status
```sql
CREATE TYPE post_status AS ENUM ('draft', 'published', 'private', 'trash', 'scheduled');
```

#### post_type
```sql
CREATE TYPE post_type AS ENUM ('post', 'portfolio', 'page');
```

#### comment_status
```sql
CREATE TYPE comment_status AS ENUM ('pending', 'approved', 'spam', 'trash');
```

#### media_type
```sql
CREATE TYPE media_type AS ENUM ('image', 'video', 'audio', 'document', 'other');
```

#### notification_type
```sql
CREATE TYPE notification_type AS ENUM (
    'comment', 'like', 'follow', 'mention',
    'reply', 'system', 'welcome'
);
```

#### audit_action
```sql
CREATE TYPE audit_action AS ENUM (
    'create', 'update', 'delete', 'login',
    'logout', 'view', 'export', 'import'
);
```

---

## 索引列表

### 用户表索引
- `idx_users_email` - 邮箱索引
- `idx_users_username` - 用户名索引
- `idx_users_status` - 状态索引
- `idx_users_role` - 角色索引
- `idx_users_created_at` - 创建时间索引

### 文章表索引
- `idx_posts_author_id` - 作者索引
- `idx_posts_slug` - URL索引
- `idx_posts_status` - 状态索引
- `idx_posts_post_type` - 类型索引
- `idx_posts_published_at` - 发布时间索引
- `idx_posts_is_featured` - 精选文章索引
- `idx_posts_is_sticky` - 置顶文章索引
- `idx_posts_view_count` - 浏览量索引
- `idx_posts_like_count` - 点赞数索引
- `idx_posts_comment_count` - 评论数索引
- `idx_posts_title_gin` - 标题全文搜索索引
- `idx_posts_content_gin` - 内容全文搜索索引
- `idx_posts_excerpt_gin` - 摘要全文搜索索引
- `idx_posts_metadata_gin` - 元数据索引
- `idx_posts_seo_gin` - SEO数据索引

### 社交功能索引
- `idx_likes_user_id` - 用户点赞索引
- `idx_likes_target` - 目标点赞索引
- `idx_bookmarks_user_id` - 用户收藏索引
- `idx_bookmarks_post_id` - 文章收藏索引
- `idx_follows_follower_id` - 关注者索引
- `idx_follows_following_id` - 被关注者索引
- `idx_notifications_user_id` - 用户通知索引
- `idx_notifications_is_read` - 已读状态索引
- `idx_notifications_created_at` - 通知时间索引
- `idx_reading_progress_user_id` - 用户阅读进度索引
- `idx_reading_progress_post_id` - 文章阅读进度索引
- `idx_reading_progress_is_favorite` - 特别收藏索引

---

## 触发器列表

### 自动更新触发器
- `update_users_updated_at` - 更新用户表时间戳
- `update_categories_updated_at` - 更新分类表时间戳
- `update_tags_updated_at` - 更新标签表时间戳
- `update_posts_updated_at` - 更新文章表时间戳
- `update_comments_updated_at` - 更新评论表时间戳
- `update_portfolios_updated_at` - 更新作品集表时间戳
- `update_media_updated_at` - 更新媒体表时间戳
- `update_pages_updated_at` - 更新页面表时间戳
- `update_bookmarks_updated_at` - 更新收藏表时间戳
- `update_reading_progress_updated_at` - 更新阅读进度表时间戳

### 计数更新触发器
- `trigger_update_category_post_count` - 更新分类文章计数
- `trigger_update_tag_usage_count` - 更新标签使用计数
- `trigger_update_post_like_count` - 更新文章点赞计数
- `trigger_update_comment_like_count` - 更新评论点赞计数

### 审计触发器（可选）
- `trigger_audit_posts` - 文章审计日志
- `trigger_audit_users` - 用户审计日志

---

## 视图列表

### 统计视图
- `post_stats` - 文章统计视图
- `popular_posts` - 热门文章视图
- `user_stats` - 用户统计视图
- `category_stats` - 分类统计视图
- `tag_cloud` - 标签云视图

---

## 常用查询示例

### 获取文章列表（带分页）
```sql
SELECT * FROM post_stats
WHERE status = 'published'
ORDER BY published_at DESC
LIMIT 10 OFFSET 0;
```

### 获取用户统计信息
```sql
SELECT * FROM user_stats WHERE id = $1;
```

### 搜索文章
```sql
SELECT * FROM search_posts('搜索关键词', 'published', 20, 0);
```

### 获取用户仪表盘统计
```sql
SELECT * FROM get_user_dashboard_stats($1);
```

---

**创建日期:** 2026-03-07
**版本:** 1.0.0
**维护者:** AI Development Team
