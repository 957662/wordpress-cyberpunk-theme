# CyberPress Platform - 数据库设计文档

## 📊 ER 图

```
┌─────────────────────┐     ┌─────────────────────┐     ┌─────────────────────┐
│      users          │     │      posts          │     │      categories     │
├─────────────────────┤     ├─────────────────────┤     ├─────────────────────┤
│ id (PK)            │     │ id (PK)            │     │ id (PK)            │
│ email              │     │ title              │     │ name               │
│ username           │     │ slug               │     │ slug               │
│ password_hash      │     │ content            │     │ description        │
│ first_name         │     │ excerpt            │     │ parent_id (FK)     │
│ last_name          │     │ author_id (FK)     │     │ count              │
│ avatar_url         │     │ featured_image     │     └─────────────────────┘
│ bio                │     │ status             │              │
│ role               │     │ post_type          │              │
│ created_at         │     │ created_at         │              │
│ updated_at         │     │ updated_at         │              │
│ last_login_at      │     │ published_at       │              │
└─────────────────────┘     │ view_count         │              │
         │                  └─────────────────────┘              │
         │                           │                         │
         │                           │                         │
         │                   ┌───────┴────────┐                │
         │                   │                 │                │
         ▼                   ▼                 ▼                ▼
┌─────────────────────┐ ┌──────────────┐ ┌─────────────┐ ┌──────────────┐
│     comments        │ │   post_meta  │ │  post_tags  │ │tag_category  │
├─────────────────────┤ ├──────────────┤ ├─────────────┤ ├──────────────┤
│ id (PK)            │ │ id (PK)      │ │ post_id (FK)│ │ post_id (FK) │
│ post_id (FK)       │ │ post_id (FK) │ │ tag_id (FK) │ │ category_id  │
│ author_id (FK)     │ │ meta_key     │ └─────────────┘ │ (FK)         │
│ parent_id (FK)     │ │ meta_value   │                 └──────────────┘
│ content            │ └──────────────┘
│ status             │
│ created_at         │   ┌──────────────────────────┐
│ approved_at        │   │      portfolio_items     │
└─────────────────────┘   ├──────────────────────────┤
                          │ id (PK)                  │
                          │ title                    │
                          │ slug                     │
                          │ description              │
                          │ content                  │
                          │ featured_image           │
                          │ demo_url                 │
                          │ source_url               │
                          │ technologies (JSON)      │
                          │ status                   │
                          │ sort_order               │
                          │ created_at               │
                          │ updated_at               │
                          └──────────────────────────┘
                                    │
                                    │
                                    ▼
                          ┌──────────────────────────┐
                          │   portfolio_gallery      │
                          ├──────────────────────────┤
                          │ id (PK)                  │
                          │ portfolio_item_id (FK)   │
                          │ image_url                │
                          │ thumbnail_url            │
                          │ alt_text                 │
                          │ caption                  │
                          │ sort_order               │
                          └──────────────────────────┘
```

## 🗂️ 表结构设计

### 1. 用户表 (users)

存储系统用户信息，包括管理员、编辑、作者等。

| 字段名 | 类型 | 长度 | 允许NULL | 默认值 | 说明 |
|--------|------|------|----------|--------|------|
| id | BIGINT | - | NO | AUTO_INCREMENT | 主键 |
| email | VARCHAR | 255 | NO | - | 登录邮箱（唯一） |
| username | VARCHAR | 100 | NO | - | 用户名（唯一） |
| password_hash | VARCHAR | 255 | NO | - | 密码哈希 |
| first_name | VARCHAR | 100 | YES | NULL | 名字 |
| last_name | VARCHAR | 100 | YES | NULL | 姓氏 |
| avatar_url | VARCHAR | 500 | YES | NULL | 头像URL |
| bio | TEXT | - | YES | NULL | 个人简介 |
| role | ENUM | - | NO | 'subscriber' | 用户角色 |
| status | ENUM | - | NO | 'active' | 账号状态 |
| created_at | TIMESTAMP | - | NO | CURRENT_TIMESTAMP | 创建时间 |
| updated_at | TIMESTAMP | - | NO | CURRENT_TIMESTAMP ON UPDATE | 更新时间 |
| last_login_at | TIMESTAMP | - | YES | NULL | 最后登录时间 |
| email_verified_at | TIMESTAMP | - | YES | NULL | 邮箱验证时间 |

**索引:**
- PRIMARY KEY (`id`)
- UNIQUE KEY `uk_email` (`email`)
- UNIQUE KEY `uk_username` (`username`)
- INDEX `idx_role` (`role`)
- INDEX `idx_status` (`status`)

**角色枚举值:**
- `subscriber` - 订阅者
- `contributor` - 贡献者
- `author` - 作者
- `editor` - 编辑
- `administrator` - 管理员

**状态枚举值:**
- `active` - 激活
- `inactive` - 未激活
- `suspended` - 暂停
- `banned` - 封禁

---

### 2. 文章表 (posts)

存储博客文章、页面等所有内容类型。

| 字段名 | 类型 | 长度 | 允许NULL | 默认值 | 说明 |
|--------|------|------|----------|--------|------|
| id | BIGINT | - | NO | AUTO_INCREMENT | 主键 |
| title | VARCHAR | 500 | NO | - | 文章标题 |
| slug | VARCHAR | 500 | NO | - | URL友好字符串 |
| content | LONGTEXT | - | NO | - | 文章内容（HTML/Markdown） |
| excerpt | TEXT | - | YES | NULL | 文章摘要 |
| author_id | BIGINT | - | NO | - | 作者ID（外键） |
| featured_image | VARCHAR | 500 | YES | NULL | 特色图片URL |
| status | ENUM | - | NO | 'draft' | 文章状态 |
| post_type | ENUM | - | NO | 'post' | 内容类型 |
| comment_status | ENUM | - | NO | 'open' | 评论状态 |
| view_count | BIGINT | - | NO | 0 | 浏览次数 |
| like_count | INT | - | NO | 0 | 点赞数 |
| created_at | TIMESTAMP | - | NO | CURRENT_TIMESTAMP | 创建时间 |
| updated_at | TIMESTAMP | - | NO | CURRENT_TIMESTAMP ON UPDATE | 更新时间 |
| published_at | TIMESTAMP | - | YES | NULL | 发布时间 |

**索引:**
- PRIMARY KEY (`id`)
- UNIQUE KEY `uk_slug` (`slug`)
- INDEX `idx_author` (`author_id`)
- INDEX `idx_status` (`status`)
- INDEX `idx_post_type` (`post_type`)
- INDEX `idx_published_at` (`published_at`)
- INDEX `idx_view_count` (`view_count`)
- INDEX `idx_created_at` (`created_at`)
- FULLTEXT INDEX `ft_search` (`title`, `content`, `excerpt`)

**内容类型枚举值:**
- `post` - 博客文章
- `page` - 静态页面
- `portfolio` - 作品集

**状态枚举值:**
- `draft` - 草稿
- `pending` - 待审核
- `publish` - 已发布
- `private` - 私密
- `trash` - 回收站

---

### 3. 分类表 (categories)

文章分类和标签的层级结构。

| 字段名 | 类型 | 长度 | 允许NULL | 默认值 | 说明 |
|--------|------|------|----------|--------|------|
| id | BIGINT | - | NO | AUTO_INCREMENT | 主键 |
| name | VARCHAR | 200 | NO | - | 分类名称 |
| slug | VARCHAR | 200 | NO | - | URL友好字符串 |
| description | TEXT | - | YES | NULL | 分类描述 |
| parent_id | BIGINT | - | YES | NULL | 父分类ID |
| type | ENUM | - | NO | 'category' | 分类类型 |
| count | INT | - | NO | 0 | 关联文章数 |
| icon | VARCHAR | 100 | YES | NULL | 图标名称 |
| color | VARCHAR | 20 | YES | NULL | 分类颜色 |
| sort_order | INT | - | NO | 0 | 排序顺序 |
| created_at | TIMESTAMP | - | NO | CURRENT_TIMESTAMP | 创建时间 |
| updated_at | TIMESTAMP | - | NO | CURRENT_TIMESTAMP ON UPDATE | 更新时间 |

**索引:**
- PRIMARY KEY (`id`)
- UNIQUE KEY `uk_slug_type` (`slug`, `type`)
- INDEX `idx_parent` (`parent_id`)
- INDEX `idx_type` (`type`)
- INDEX `idx_count` (`count`)

**类型枚举值:**
- `category` - 分类
- `tag` - 标签

---

### 4. 文章分类关联表 (post_categories)

多对多关联表，连接文章与分类/标签。

| 字段名 | 类型 | 长度 | 允许NULL | 默认值 | 说明 |
|--------|------|------|----------|--------|------|
| id | BIGINT | - | NO | AUTO_INCREMENT | 主键 |
| post_id | BIGINT | - | NO | - | 文章ID |
| category_id | BIGINT | - | NO | - | 分类/标签ID |
| created_at | TIMESTAMP | - | NO | CURRENT_TIMESTAMP | 创建时间 |

**索引:**
- PRIMARY KEY (`id`)
- UNIQUE KEY `uk_post_category` (`post_id`, `category_id`)
- INDEX `idx_category` (`category_id`)

---

### 5. 文章元数据表 (post_meta)

存储文章的扩展元数据（键值对）。

| 字段名 | 类型 | 长度 | 允许NULL | 默认值 | 说明 |
|--------|------|------|----------|--------|------|
| id | BIGINT | - | NO | AUTO_INCREMENT | 主键 |
| post_id | BIGINT | - | NO | - | 文章ID |
| meta_key | VARCHAR | 255 | NO | - | 元数据键名 |
| meta_value | LONGTEXT | - | YES | NULL | 元数据值（JSON） |
| created_at | TIMESTAMP | - | NO | CURRENT_TIMESTAMP | 创建时间 |
| updated_at | TIMESTAMP | - | NO | CURRENT_TIMESTAMP ON UPDATE | 更新时间 |

**索引:**
- PRIMARY KEY (`id`)
- UNIQUE KEY `uk_post_meta_key` (`post_id`, `meta_key`)
- INDEX `idx_meta_key` (`meta_key`)

**常用元数据键:**
- `seo_title` - SEO标题
- `seo_description` - SEO描述
- `seo_keywords` - SEO关键词
- `featured` - 是否精选
- `views` - 浏览次数（冗余）
- `reading_time` - 阅读时长
- `template` - 页面模板

---

### 6. 评论表 (comments)

存储文章评论及回复。

| 字段名 | 类型 | 长度 | 允许NULL | 默认值 | 说明 |
|--------|------|------|----------|--------|------|
| id | BIGINT | - | NO | AUTO_INCREMENT | 主键 |
| post_id | BIGINT | - | NO | - | 文章ID |
| author_id | BIGINT | - | YES | NULL | 注册用户ID |
| parent_id | BIGINT | - | YES | NULL | 父评论ID（用于回复） |
| author_name | VARCHAR | 200 | YES | NULL | 访客姓名 |
| author_email | VARCHAR | 255 | YES | NULL | 访客邮箱 |
| author_ip | VARCHAR | 100 | YES | NULL | 访客IP |
| content | TEXT | - | NO | - | 评论内容 |
| status | ENUM | - | NO | 'pending' | 评论状态 |
| created_at | TIMESTAMP | - | NO | CURRENT_TIMESTAMP | 创建时间 |
| updated_at | TIMESTAMP | - | NO | CURRENT_TIMESTAMP ON UPDATE | 更新时间 |
| approved_at | TIMESTAMP | - | YES | NULL | 审核通过时间 |
| approved_by | BIGINT | - | YES | NULL | 审核人ID |

**索引:**
- PRIMARY KEY (`id`)
- INDEX `idx_post` (`post_id`)
- INDEX `idx_author` (`author_id`)
- INDEX `idx_parent` (`parent_id`)
- INDEX `idx_status` (`status`)
- INDEX `idx_created_at` (`created_at`)

**状态枚举值:**
- `pending` - 待审核
- `approved` - 已通过
- `spam` - 垃圾评论
- `trash` - 回收站

---

### 7. 作品集表 (portfolio_items)

存储项目作品信息。

| 字段名 | 类型 | 长度 | 允许NULL | 默认值 | 说明 |
|--------|------|------|----------|--------|------|
| id | BIGINT | - | NO | AUTO_INCREMENT | 主键 |
| title | VARCHAR | 500 | NO | - | 项目标题 |
| slug | VARCHAR | 500 | NO | - | URL友好字符串 |
| description | TEXT | - | YES | NULL | 项目描述 |
| content | LONGTEXT | - | YES | NULL | 详细内容 |
| featured_image | VARCHAR | 500 | YES | NULL | 特色图片URL |
| demo_url | VARCHAR | 500 | YES | NULL | 演示链接 |
| source_url | VARCHAR | 500 | YES | NULL | 源码链接 |
| technologies | JSON | - | YES | NULL | 技术栈数组 |
| status | ENUM | - | NO | 'draft' | 状态 |
| sort_order | INT | - | NO | 0 | 排序顺序 |
| featured | BOOLEAN | - | NO | false | 是否精选 |
| created_at | TIMESTAMP | - | NO | CURRENT_TIMESTAMP | 创建时间 |
| updated_at | TIMESTAMP | - | NO | CURRENT_TIMESTAMP ON UPDATE | 更新时间 |
| published_at | TIMESTAMP | - | YES | NULL | 发布时间 |

**索引:**
- PRIMARY KEY (`id`)
- UNIQUE KEY `uk_slug` (`slug`)
- INDEX `idx_status` (`status`)
- INDEX `idx_featured` (`featured`)
- INDEX `idx_sort_order` (`sort_order`)
- INDEX `idx_published_at` (`published_at`)
- FULLTEXT INDEX `ft_search` (`title`, `description`)

**技术栈JSON格式:**
```json
["React", "TypeScript", "Next.js", "Tailwind CSS"]
```

---

### 8. 作品集图库表 (portfolio_gallery)

存储作品集的多张图片。

| 字段名 | 类型 | 长度 | 允许NULL | 默认值 | 说明 |
|--------|------|------|----------|--------|------|
| id | BIGINT | - | NO | AUTO_INCREMENT | 主键 |
| portfolio_item_id | BIGINT | - | NO | - | 作品ID |
| image_url | VARCHAR | 500 | NO | - | 图片URL |
| thumbnail_url | VARCHAR | 500 | YES | NULL | 缩略图URL |
| alt_text | VARCHAR | 500 | YES | NULL | 替代文本 |
| caption | TEXT | - | YES | NULL | 图片说明 |
| sort_order | INT | - | NO | 0 | 排序顺序 |
| created_at | TIMESTAMP | - | NO | CURRENT_TIMESTAMP | 创建时间 |

**索引:**
- PRIMARY KEY (`id`)
- INDEX `idx_portfolio` (`portfolio_item_id`)
- INDEX `idx_sort_order` (`sort_order`)

---

### 9. 媒体库表 (media)

存储上传的媒体文件信息。

| 字段名 | 类型 | 长度 | 允许NULL | 默认值 | 说明 |
|--------|------|------|----------|--------|------|
| id | BIGINT | - | NO | AUTO_INCREMENT | 主键 |
| filename | VARCHAR | 500 | NO | - | 文件名 |
| url | VARCHAR | 1000 | NO | - | 文件URL |
| file_path | VARCHAR | 1000 | NO | - | 服务器路径 |
| mime_type | VARCHAR | 200 | NO | - | MIME类型 |
| file_size | BIGINT | - | NO | 0 | 文件大小（字节） |
| width | INT | - | YES | NULL | 图片宽度 |
| height | INT | - | YES | NULL | 图片高度 |
| alt_text | VARCHAR | 500 | YES | NULL | 替代文本 |
| title | VARCHAR | 500 | YES | NULL | 媒体标题 |
| description | TEXT | - | YES | NULL | 媒体描述 |
| uploaded_by | BIGINT | - | NO | - | 上传者ID |
| created_at | TIMESTAMP | - | NO | CURRENT_TIMESTAMP | 上传时间 |

**索引:**
- PRIMARY KEY (`id`)
- INDEX `idx_mime_type` (`mime_type`)
- INDEX `idx_uploaded_by` (`uploaded_by`)
- INDEX `idx_created_at` (`created_at`)

---

### 10. 系统设置表 (settings)

存储系统级别的配置。

| 字段名 | 类型 | 长度 | 允许NULL | 默认值 | 说明 |
|--------|------|------|----------|--------|------|
| id | BIGINT | - | NO | AUTO_INCREMENT | 主键 |
| setting_key | VARCHAR | 200 | NO | - | 设置键名 |
| setting_value | LONGTEXT | - | YES | NULL | 设置值（JSON） |
| setting_type | ENUM | - | NO | 'string' | 值类型 |
| category | VARCHAR | 100 | NO | 'general' | 设置分类 |
| description | TEXT | - | YES | NULL | 设置说明 |
| is_public | BOOLEAN | - | NO | false | 是否公开访问 |
| created_at | TIMESTAMP | - | NO | CURRENT_TIMESTAMP | 创建时间 |
| updated_at | TIMESTAMP | - | NO | CURRENT_TIMESTAMP ON UPDATE | 更新时间 |

**索引:**
- PRIMARY KEY (`id`)
- UNIQUE KEY `uk_setting_key` (`setting_key`)
- INDEX `idx_category` (`category`)

---

### 11. 分析数据表 (analytics)

存储网站访问统计。

| 字段名 | 类型 | 长度 | 允许NULL | 默认值 | 说明 |
|--------|------|------|----------|--------|------|
| id | BIGINT | - | NO | AUTO_INCREMENT | 主键 |
| date | DATE | - | NO | - | 统计日期 |
| post_id | BIGINT | - | YES | NULL | 文章ID（NULL=总览） |
| views | INT | - | NO | 0 | 浏览量 |
| visitors | INT | - | NO | 0 | 访客数 |
| unique_visitors | INT | - | NO | 0 | 独立访客 |
| bounce_rate | DECIMAL | 5,2 | YES | NULL | 跳出率 |
| avg_time_on_page | INT | - | YES | NULL | 平均停留时间（秒） |
| created_at | TIMESTAMP | - | NO | CURRENT_TIMESTAMP | 创建时间 |
| updated_at | TIMESTAMP | - | NO | CURRENT_TIMESTAMP ON UPDATE | 更新时间 |

**索引:**
- PRIMARY KEY (`id`)
- UNIQUE KEY `uk_date_post` (`date`, `post_id`)
- INDEX `idx_post` (`post_id`)
- INDEX `idx_date` (`date`)

---

## 🔗 外键关系

```sql
-- 用户相关
ALTER TABLE posts ADD CONSTRAINT fk_posts_author
  FOREIGN KEY (author_id) REFERENCES users(id) ON DELETE SET NULL;

ALTER TABLE comments ADD CONSTRAINT fk_comments_author
  FOREIGN KEY (author_id) REFERENCES users(id) ON DELETE SET NULL;

ALTER TABLE comments ADD CONSTRAINT fk_comments_approved_by
  FOREIGN KEY (approved_by) REFERENCES users(id) ON DELETE SET NULL;

-- 文章相关
ALTER TABLE comments ADD CONSTRAINT fk_comments_post
  FOREIGN KEY (post_id) REFERENCES posts(id) ON DELETE CASCADE;

ALTER TABLE comments ADD CONSTRAINT fk_comments_parent
  FOREIGN KEY (parent_id) REFERENCES comments(id) ON DELETE CASCADE;

-- 分类相关
ALTER TABLE categories ADD CONSTRAINT fk_categories_parent
  FOREIGN KEY (parent_id) REFERENCES categories(id) ON DELETE SET NULL;

ALTER TABLE post_categories ADD CONSTRAINT fk_pc_post
  FOREIGN KEY (post_id) REFERENCES posts(id) ON DELETE CASCADE;

ALTER TABLE post_categories ADD CONSTRAINT fk_pc_category
  FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE CASCADE;

-- 元数据
ALTER TABLE post_meta ADD CONSTRAINT fk_postmeta_post
  FOREIGN KEY (post_id) REFERENCES posts(id) ON DELETE CASCADE;

-- 作品集
ALTER TABLE portfolio_gallery ADD CONSTRAINT fk_gallery_portfolio
  FOREIGN KEY (portfolio_item_id) REFERENCES portfolio_items(id) ON DELETE CASCADE;

-- 媒体
ALTER TABLE media ADD CONSTRAINT fk_media_uploader
  FOREIGN KEY (uploaded_by) REFERENCES users(id) ON DELETE SET NULL;

-- 分析
ALTER TABLE analytics ADD CONSTRAINT fk_analytics_post
  FOREIGN KEY (post_id) REFERENCES posts(id) ON DELETE CASCADE;
```

## 📈 数据类型说明

### 整型选择
- **BIGINT**: 主键、外键、计数器
- **INT**: 状态计数、排序、ID引用
- **SMALLINT**: 状态枚举、小范围数字

### 字符串选择
- **VARCHAR(100-500)**: 短文本、URL、名称
- **TEXT**: 描述、内容摘要
- **LONGTEXT**: 文章内容、长JSON

### 时间类型
- **TIMESTAMP**: 自动更新的时间戳
- **DATE**: 日期统计

### JSON类型
- MySQL 5.7+ 的原生JSON类型
- 支持JSON路径查询和索引

---

## 🎯 设计原则

1. **规范化设计**: 遵循第三范式，减少数据冗余
2. **适当冗余**: 热点数据冗余（如view_count）减少JOIN
3. **索引优化**: 为常用查询路径创建复合索引
4. **软删除**: 重要数据使用status字段标记删除
5. **时间追踪**: 所有表包含created_at和updated_at
6. **国际化支持**: 使用VARCHAR而非固定长度字符类型

---

## 📊 预估数据量

| 表名 | 预估行数 | 增长速度 |
|------|----------|----------|
| users | 1,000 | 慢 |
| posts | 50,000 | 中 |
| categories | 500 | 慢 |
| post_meta | 200,000 | 快 |
| comments | 100,000 | 中 |
| portfolio_items | 200 | 慢 |
| portfolio_gallery | 1,000 | 慢 |
| media | 10,000 | 中 |
| settings | 100 | 慢 |
| analytics | 1,000,000+ | 快 |

---

**文档版本**: 1.0
**创建时间**: 2026-03-02
**作者**: Database Architect
**数据库版本**: MySQL 8.0+ / PostgreSQL 15+
