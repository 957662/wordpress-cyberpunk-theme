# CyberPress Platform - 表结构详细文档

## 数据库表结构

本文档详细描述 CyberPress Platform 数据库中所有表的结构。

---

## 1. users (用户表)

存储平台用户信息，包括管理员、作者、订阅者等。

### 字段说明

| 字段名 | 类型 | 约束 | 默认值 | 说明 |
|--------|------|------|--------|------|
| id | UUID | PRIMARY KEY | uuid_generate_v4() | 用户唯一标识 |
| username | VARCHAR(60) | NOT NULL, UNIQUE | - | 用户名，3-30字符，字母数字下划线 |
| email | VARCHAR(100) | NOT NULL, UNIQUE | - | 邮箱地址 |
| password_hash | VARCHAR(255) | NOT NULL | - | 密码哈希（bcrypt） |
| display_name | VARCHAR(100) | NULL | - | 显示名称 |
| avatar_url | VARCHAR(500) | NULL | - | 头像URL |
| bio | TEXT | NULL | - | 个人简介 |
| website | VARCHAR(255) | NULL | - | 个人网站 |
| role | user_role | NOT NULL | 'subscriber' | 用户角色（枚举） |
| status | user_status | NOT NULL | 'pending' | 账户状态（枚举） |
| email_verified_at | TIMESTAMPTZ | NULL | - | 邮箱验证时间 |
| last_login_at | TIMESTAMPTZ | NULL | - | 最后登录时间 |
| created_at | TIMESTAMPTZ | NOT NULL | CURRENT_TIMESTAMP | 创建时间 |
| updated_at | TIMESTAMPTZ | NOT NULL | CURRENT_TIMESTAMP | 更新时间 |
| deleted_at | TIMESTAMPTZ | NULL | - | 软删除时间 |
| metadata | JSONB | NOT NULL | '{}'::jsonb | 扩展元数据 |

### 枚举类型

**user_role**
- `subscriber`: 订阅者（只读权限）
- `contributor`: 贡献者（可投稿）
- `author`: 作者（可发布自己的文章）
- `editor`: 编辑（可管理所有文章）
- `admin`: 管理员（完全权限）

**user_status**
- `active`: 活跃
- `inactive`: 非活跃
- `pending`: 待审核
- `banned`: 已封禁

### 约束

- `username_format`: 用户名必须匹配正则 `^[a-zA-Z0-9_-]{3,30}$`
- `email_format`: 邮箱必须匹配邮箱格式正则

### 索引

- `idx_users_username`: username
- `idx_users_email`: email
- `idx_users_role`: role
- `idx_users_status`: status
- `idx_users_created_at`: created_at DESC
- `idx_users_metadata`: metadata (GIN)

---

## 2. categories (分类表)

存储文章分类信息，支持多级分类。

### 字段说明

| 字段名 | 类型 | 约束 | 默认值 | 说明 |
|--------|------|------|--------|------|
| id | UUID | PRIMARY KEY | uuid_generate_v4() | 分类唯一标识 |
| name | VARCHAR(100) | NOT NULL | - | 分类名称 |
| slug | VARCHAR(100) | NOT NULL, UNIQUE | - | URL友好的标识符 |
| description | TEXT | NULL | - | 分类描述 |
| parent_id | UUID | FOREIGN KEY | NULL | 父分类ID（自引用） |
| icon | VARCHAR(50) | NULL | - | 图标名称 |
| color | VARCHAR(7) | NOT NULL | '#00f0ff' | 分类颜色（十六进制） |
| cover_image_url | VARCHAR(500) | NULL | - | 封面图片URL |
| sort_order | INTEGER | NOT NULL | 0 | 排序顺序 |
| post_count | INTEGER | NOT NULL | 0 | 文章计数（自动更新） |
| created_at | TIMESTAMPTZ | NOT NULL | CURRENT_TIMESTAMP | 创建时间 |
| updated_at | TIMESTAMPTZ | NOT NULL | CURRENT_TIMESTAMP | 更新时间 |
| metadata | JSONB | NOT NULL | '{}'::jsonb | 扩展元数据 |

### 外键

- `parent_id` → `categories(id)` ON DELETE SET NULL

### 索引

- `idx_categories_slug`: slug
- `idx_categories_parent_id`: parent_id
- `idx_categories_sort_order`: sort_order

---

## 3. tags (标签表)

存储文章标签信息。

### 字段说明

| 字段名 | 类型 | 约束 | 默认值 | 说明 |
|--------|------|------|--------|------|
| id | UUID | PRIMARY KEY | uuid_generate_v4() | 标签唯一标识 |
| name | VARCHAR(100) | NOT NULL | - | 标签名称 |
| slug | VARCHAR(100) | NOT NULL, UNIQUE | - | URL友好的标识符 |
| description | TEXT | NULL | - | 标签描述 |
| color | VARCHAR(7) | NOT NULL | '#9d00ff' | 标签颜色（十六进制） |
| post_count | INTEGER | NOT NULL | 0 | 文章计数（自动更新） |
| created_at | TIMESTAMPTZ | NOT NULL | CURRENT_TIMESTAMP | 创建时间 |
| updated_at | TIMESTAMPTZ | NOT NULL | CURRENT_TIMESTAMP | 更新时间 |
| metadata | JSONB | NOT NULL | '{}'::jsonb | 扩展元数据 |

### 索引

- `idx_tags_slug`: slug
- `idx_tags_name`: name (GIN with gin_trgm_ops - 用于全文搜索)

---

## 4. posts (文章表)

存储所有文章、页面等内容。

### 字段说明

| 字段名 | 类型 | 约束 | 默认值 | 说明 |
|--------|------|------|--------|------|
| id | UUID | PRIMARY KEY | uuid_generate_v4() | 文章唯一标识 |
| title | VARCHAR(255) | NOT NULL | - | 文章标题 |
| slug | VARCHAR(255) | NOT NULL, UNIQUE | - | URL友好的标识符 |
| excerpt | TEXT | NULL | - | 文章摘要 |
| content | TEXT | NOT NULL | - | 文章内容（支持Markdown） |
| author_id | UUID | FOREIGN KEY, NOT NULL | - | 作者ID |
| featured_image_id | UUID | FOREIGN KEY | NULL | 特色图片ID |
| status | post_status | NOT NULL | 'draft' | 文章状态（枚举） |
| post_type | post_type | NOT NULL | 'post' | 文章类型（枚举） |
| comment_status | BOOLEAN | NOT NULL | TRUE | 是否允许评论 |
| ping_status | BOOLEAN | NOT NULL | TRUE | 是否允许引用通知 |
| password | VARCHAR(255) | NULL | - | 密码保护（密码） |
| view_count | BIGINT | NOT NULL | 0 | 浏览次数 |
| like_count | INTEGER | NOT NULL | 0 | 点赞数 |
| comment_count | INTEGER | NOT NULL | 0 | 评论数（自动更新） |
| is_featured | BOOLEAN | NOT NULL | FALSE | 是否为精选文章 |
| is_sticky | BOOLEAN | NOT NULL | FALSE | 是否置顶 |
| menu_order | INTEGER | NOT NULL | 0 | 菜单排序 |
| meta_title | VARCHAR(255) | NULL | - | SEO标题 |
| meta_description | TEXT | NULL | - | SEO描述 |
| meta_keywords | VARCHAR(500) | NULL | - | SEO关键词 |
| published_at | TIMESTAMPTZ | NULL | - | 发布时间 |
| created_at | TIMESTAMPTZ | NOT NULL | CURRENT_TIMESTAMP | 创建时间 |
| updated_at | TIMESTAMPTZ | NOT NULL | CURRENT_TIMESTAMP | 更新时间 |
| deleted_at | TIMESTAMPTZ | NULL | - | 软删除时间 |
| metadata | JSONB | NOT NULL | '{}'::jsonb | 扩展元数据 |

### 枚举类型

**post_status**
- `draft`: 草稿
- `pending`: 待审核
- `private`: 私密
- `publish`: 已发布
- `future`: 定时发布
- `trash`: 回收站

**post_type**
- `post`: 博客文章
- `page`: 静态页面
- `portfolio`: 作品集
- `attachment`: 附件

### 外键

- `author_id` → `users(id)` ON DELETE CASCADE
- `featured_image_id` → `media(id)` ON DELETE SET NULL (逻辑外键，非强制)

### 索引

- `idx_posts_slug`: slug
- `idx_posts_author_id`: author_id
- `idx_posts_status`: status
- `idx_posts_post_type`: post_type
- `idx_posts_published_at`: published_at DESC
- `idx_posts_is_featured`: is_featured
- `idx_posts_is_sticky`: is_sticky
- `idx_posts_view_count`: view_count DESC
- `idx_posts_title_search`: to_tsvector('english', title) (GIN)
- `idx_posts_content_search`: to_tsvector('english', content) (GIN)
- `idx_posts_combined_search`: to_tsvector('english', title || ' ' || content) (GIN)
- `idx_posts_metadata`: metadata (GIN)

---

## 5. post_categories (文章分类关系表)

存储文章和分类的多对多关系。

### 字段说明

| 字段名 | 类型 | 约束 | 默认值 | 说明 |
|--------|------|------|--------|------|
| id | UUID | PRIMARY KEY | uuid_generate_v4() | 关系唯一标识 |
| post_id | UUID | FOREIGN KEY, NOT NULL | - | 文章ID |
| category_id | UUID | FOREIGN KEY, NOT NULL | - | 分类ID |
| created_at | TIMESTAMPTZ | NOT NULL | CURRENT_TIMESTAMP | 创建时间 |

### 外键

- `post_id` → `posts(id)` ON DELETE CASCADE
- `category_id` → `categories(id)` ON DELETE CASCADE

### 约束

- `unique_post_category`: (post_id, category_id) 组合唯一

### 索引

- `idx_post_categories_post_id`: post_id
- `idx_post_categories_category_id`: category_id

---

## 6. post_tags (文章标签关系表)

存储文章和标签的多对多关系。

### 字段说明

| 字段名 | 类型 | 约束 | 默认值 | 说明 |
|--------|------|------|--------|------|
| id | UUID | PRIMARY KEY | uuid_generate_v4() | 关系唯一标识 |
| post_id | UUID | FOREIGN KEY, NOT NULL | - | 文章ID |
| tag_id | UUID | FOREIGN KEY, NOT NULL | - | 标签ID |
| created_at | TIMESTAMPTZ | NOT NULL | CURRENT_TIMESTAMP | 创建时间 |

### 外键

- `post_id` → `posts(id)` ON DELETE CASCADE
- `tag_id` → `tags(id)` ON DELETE CASCADE

### 约束

- `unique_post_tag`: (post_id, tag_id) 组合唯一

### 索引

- `idx_post_tags_post_id`: post_id
- `idx_post_tags_tag_id`: tag_id

---

## 7. comments (评论表)

存储文章评论，支持嵌套回复。

### 字段说明

| 字段名 | 类型 | 约束 | 默认值 | 说明 |
|--------|------|------|--------|------|
| id | UUID | PRIMARY KEY | uuid_generate_v4() | 评论唯一标识 |
| post_id | UUID | FOREIGN KEY, NOT NULL | - | 文章ID |
| author_id | UUID | FOREIGN KEY | NULL | 评论者ID（登录用户） |
| parent_id | UUID | FOREIGN KEY | NULL | 父评论ID（嵌套回复） |
| author_name | VARCHAR(100) | NULL | - | 评论者名称（匿名） |
| author_email | VARCHAR(100) | NULL | - | 评论者邮箱（匿名） |
| author_url | VARCHAR(255) | NULL | - | 评论者网站（匿名） |
| author_ip | VARCHAR(45) | NULL | - | 评论者IP地址 |
| content | TEXT | NOT NULL | - | 评论内容 |
| karma | INTEGER | NOT NULL | 0 | 评分 |
| status | comment_status | NOT NULL | 'pending' | 评论状态（枚举） |
| agent | VARCHAR(255) | NULL | - | 用户代理字符串 |
| created_at | TIMESTAMPTZ | NOT NULL | CURRENT_TIMESTAMP | 创建时间 |
| updated_at | TIMESTAMPTZ | NOT NULL | CURRENT_TIMESTAMP | 更新时间 |
| deleted_at | TIMESTAMPTZ | NULL | - | 软删除时间 |
| metadata | JSONB | NOT NULL | '{}'::jsonb | 扩展元数据 |

### 枚举类型

**comment_status**
- `pending`: 待审核
- `approved`: 已批准
- `spam`: 垃圾评论
- `trash`: 回收站

### 外键

- `post_id` → `posts(id)` ON DELETE CASCADE
- `author_id` → `users(id)` ON DELETE SET NULL
- `parent_id` → `comments(id)` ON DELETE CASCADE

### 索引

- `idx_comments_post_id`: post_id
- `idx_comments_author_id`: author_id
- `idx_comments_parent_id`: parent_id
- `idx_comments_status`: status
- `idx_comments_created_at`: created_at DESC

---

## 8. media (媒体表)

存储上传的媒体文件信息。

### 字段说明

| 字段名 | 类型 | 约束 | 默认值 | 说明 |
|--------|------|------|--------|------|
| id | UUID | PRIMARY KEY | uuid_generate_v4() | 媒体唯一标识 |
| title | VARCHAR(255) | NULL | - | 媒体标题 |
| filename | VARCHAR(255) | NOT NULL | - | 文件名 |
| url | VARCHAR(512) | NOT NULL | - | 文件URL |
| mime_type | VARCHAR(100) | NOT NULL | - | MIME类型 |
| file_size | BIGINT | NOT NULL | - | 文件大小（字节） |
| width | INTEGER | NULL | - | 图片宽度（像素） |
| height | INTEGER | NULL | - | 图片高度（像素） |
| alt_text | VARCHAR(255) | NULL | - | 替代文本 |
| description | TEXT | NULL | - | 描述 |
| caption | TEXT | NULL | - | 标题文字 |
| uploader_id | UUID | FOREIGN KEY, NOT NULL | - | 上传者ID |
| post_id | UUID | FOREIGN KEY | NULL | 关联文章ID |
| created_at | TIMESTAMPTZ | NOT NULL | CURRENT_TIMESTAMP | 创建时间 |
| updated_at | TIMESTAMPTZ | NOT NULL | CURRENT_TIMESTAMP | 更新时间 |
| metadata | JSONB | NOT NULL | '{}'::jsonb | 扩展元数据 |

### 外键

- `uploader_id` → `users(id)` ON DELETE CASCADE
- `post_id` → `posts(id)` ON DELETE SET NULL

### 索引

- `idx_media_post_id`: post_id
- `idx_media_uploader_id`: uploader_id
- `idx_media_mime_type`: mime_type
- `idx_media_created_at`: created_at DESC

---

## 9. options (选项表)

存储系统配置选项。

### 字段说明

| 字段名 | 类型 | 约束 | 默认值 | 说明 |
|--------|------|------|--------|------|
| id | UUID | PRIMARY KEY | uuid_generate_v4() | 选项唯一标识 |
| option_name | VARCHAR(191) | NOT NULL, UNIQUE | - | 选项名称 |
| option_value | TEXT | NOT NULL | - | 选项值 |
| autoload | BOOLEAN | NOT NULL | TRUE | 是否自动加载 |
| created_at | TIMESTAMPTZ | NOT NULL | CURRENT_TIMESTAMP | 创建时间 |
| updated_at | TIMESTAMPTZ | NOT NULL | CURRENT_TIMESTAMP | 更新时间 |

### 索引

- `idx_options_option_name`: option_name
- `idx_options_autoload`: autoload

### 常用选项

- `site_name`: 站点名称
- `site_description`: 站点描述
- `site_url`: 站点URL
- `admin_email`: 管理员邮箱
- `users_can_register`: 是否允许用户注册
- `posts_per_page`: 每页文章数
- `date_format`: 日期格式
- `time_format`: 时间格式
- `timezone`: 时区
- `comment_moderation`: 是否评论需要审核
- `theme`: 主题名称

---

## 10. user_meta (用户元数据表)

存储用户的扩展信息。

### 字段说明

| 字段名 | 类型 | 约束 | 默认值 | 说明 |
|--------|------|------|--------|------|
| id | UUID | PRIMARY KEY | uuid_generate_v4() | 元数据唯一标识 |
| user_id | UUID | FOREIGN KEY, NOT NULL | - | 用户ID |
| meta_key | VARCHAR(255) | NOT NULL | - | 元数据键 |
| meta_value | TEXT | NULL | - | 元数据值 |
| created_at | TIMESTAMPTZ | NOT NULL | CURRENT_TIMESTAMP | 创建时间 |
| updated_at | TIMESTAMPTZ | NOT NULL | CURRENT_TIMESTAMP | 更新时间 |

### 外键

- `user_id` → `users(id)` ON DELETE CASCADE

### 约束

- `unique_user_meta`: (user_id, meta_key) 组合唯一

### 索引

- `idx_user_meta_user_id`: user_id
- `idx_user_meta_meta_key`: meta_key

---

## 11. post_meta (文章元数据表)

存储文章的扩展信息。

### 字段说明

| 字段名 | 类型 | 约束 | 默认值 | 说明 |
|--------|------|------|--------|------|
| id | UUID | PRIMARY KEY | uuid_generate_v4() | 元数据唯一标识 |
| post_id | UUID | FOREIGN KEY, NOT NULL | - | 文章ID |
| meta_key | VARCHAR(255) | NOT NULL | - | 元数据键 |
| meta_value | TEXT | NULL | - | 元数据值 |
| created_at | TIMESTAMPTZ | NOT NULL | CURRENT_TIMESTAMP | 创建时间 |
| updated_at | TIMESTAMPTZ | NOT NULL | CURRENT_TIMESTAMP | 更新时间 |

### 外键

- `post_id` → `posts(id)` ON DELETE CASCADE

### 约束

- `unique_post_meta`: (post_id, meta_key) 组合唯一

### 索引

- `idx_post_meta_post_id`: post_id
- `idx_post_meta_meta_key`: meta_key

---

## 数据类型说明

### UUID
- 使用 `uuid_generate_v4()` 生成随机 UUID
- 更好的分布式支持
- 防止ID暴露

### TIMESTAMPTZ
- 带时区的时间戳
- 自动处理时区转换
- 推荐用于所有时间字段

### JSONB
- 二进制 JSON 格式
- 支持高效查询和索引
- 可存储任意结构的数据

### ENUM
- user_role: 用户角色枚举
- user_status: 用户状态枚举
- post_status: 文章状态枚举
- post_type: 文章类型枚举
- comment_status: 评论状态枚举

---

## 自动维护字段

以下字段通过触发器自动维护，无需手动更新：

1. **updated_at**: 所有表都有此字段，自动更新为当前时间戳
2. **post_count**: categories.tags 表，自动统计文章数
3. **comment_count**: posts 表，自动统计评论数

---

## 软删除

以下表支持软删除（deleted_at 字段）：
- users
- posts
- comments

查询时应该过滤 `deleted_at IS NOT NULL` 的记录。

---

**文档版本**: 1.0.0
**最后更新**: 2026-03-08
**作者**: Claude (Database Architect)
