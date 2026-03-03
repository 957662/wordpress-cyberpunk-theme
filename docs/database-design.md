# CyberPress Platform - 数据库设计文档

## 📊 数据库架构概览

### WordPress 核心表结构

#### 1. 文章内容相关表

**wp_posts** - 文章/页面主表
```sql
CREATE TABLE wp_posts (
  ID bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT,
  post_author bigint(20) UNSIGNED NOT NULL DEFAULT 0,
  post_date datetime NOT NULL DEFAULT '0000-00-00 00:00:00',
  post_date_gmt datetime NOT NULL DEFAULT '0000-00-00 00:00:00',
  post_content longtext NOT NULL,
  post_title text NOT NULL,
  post_excerpt text NOT NULL,
  post_status varchar(20) NOT NULL DEFAULT 'publish',
  comment_status varchar(20) NOT NULL DEFAULT 'open',
  ping_status varchar(20) NOT NULL DEFAULT 'open',
  post_password varchar(255) NOT NULL DEFAULT '',
  post_name varchar(200) NOT NULL DEFAULT '',
  to_ping text NOT NULL,
  pinged text NOT NULL,
  post_modified datetime NOT NULL DEFAULT '0000-00-00 00:00:00',
  post_modified_gmt datetime NOT NULL DEFAULT '0000-00-00 00:00:00',
  post_content_filtered longtext NOT NULL,
  post_parent bigint(20) UNSIGNED NOT NULL DEFAULT 0,
  guid varchar(255) NOT NULL DEFAULT '',
  menu_order int(11) NOT NULL DEFAULT 0,
  post_type varchar(20) NOT NULL DEFAULT 'post',
  post_mime_type varchar(100) NOT NULL DEFAULT '',
  comment_count bigint(20) NOT NULL DEFAULT 0,
  PRIMARY KEY  (ID),
  KEY post_name (post_name(191)),
  KEY type_status_date (post_type,post_status,post_date,ID),
  KEY post_parent (post_parent),
  KEY post_author (post_author)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
```

**wp_postmeta** - 文章元数据表
```sql
CREATE TABLE wp_postmeta (
  meta_id bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT,
  post_id bigint(20) UNSIGNED NOT NULL DEFAULT 0,
  meta_key varchar(255) DEFAULT NULL,
  meta_value longtext DEFAULT NULL,
  PRIMARY KEY  (meta_id),
  KEY post_id (post_id),
  KEY meta_key (meta_key(191))
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
```

#### 2. 分类和标签相关表

**wp_terms** - 分类/标签主表
```sql
CREATE TABLE wp_terms (
  term_id bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT,
  name varchar(200) NOT NULL DEFAULT '',
  slug varchar(200) NOT NULL DEFAULT '',
  term_group bigint(10) NOT NULL DEFAULT 0,
  PRIMARY KEY  (term_id),
  KEY slug (slug(191)),
  KEY name (name(191))
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
```

**wp_term_taxonomy** - 分类法表
```sql
CREATE TABLE wp_term_taxonomy (
  term_taxonomy_id bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT,
  term_id bigint(20) UNSIGNED NOT NULL DEFAULT 0,
  taxonomy varchar(32) NOT NULL DEFAULT '',
  description longtext NOT NULL,
  parent bigint(20) UNSIGNED NOT NULL DEFAULT 0,
  count bigint(20) NOT NULL DEFAULT 0,
  PRIMARY KEY  (term_taxonomy_id),
  UNIQUE KEY term_id_taxonomy (term_id,taxonomy),
  KEY taxonomy (taxonomy)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
```

**wp_term_relationships** - 文章与分类关系表
```sql
CREATE TABLE wp_term_relationships (
  object_id bigint(20) UNSIGNED NOT NULL DEFAULT 0,
  term_taxonomy_id bigint(20) UNSIGNED NOT NULL DEFAULT 0,
  term_order int(11) NOT NULL DEFAULT 0,
  PRIMARY KEY  (object_id,term_taxonomy_id),
  KEY term_taxonomy_id (term_taxonomy_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
```

#### 3. 用户相关表

**wp_users** - 用户主表
```sql
CREATE TABLE wp_users (
  ID bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT,
  user_login varchar(60) NOT NULL DEFAULT '',
  user_pass varchar(255) NOT NULL DEFAULT '',
  user_nicename varchar(50) NOT NULL DEFAULT '',
  user_email varchar(100) NOT NULL DEFAULT '',
  user_url varchar(100) NOT NULL DEFAULT '',
  user_registered datetime NOT NULL DEFAULT '0000-00-00 00:00:00',
  user_activation_key varchar(255) NOT NULL DEFAULT '',
  user_status int(11) NOT NULL DEFAULT 0,
  display_name varchar(250) NOT NULL DEFAULT '',
  PRIMARY KEY  (ID),
  KEY user_login_key (user_login),
  KEY user_nicename (user_nicename),
  KEY user_email (user_email)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
```

**wp_usermeta** - 用户元数据表
```sql
CREATE TABLE wp_usermeta (
  umeta_id bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT,
  user_id bigint(20) UNSIGNED NOT NULL DEFAULT 0,
  meta_key varchar(255) DEFAULT NULL,
  meta_value longtext DEFAULT NULL,
  PRIMARY KEY  (umeta_id),
  KEY user_id (user_id),
  KEY meta_key (meta_key(191))
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
```

#### 4. 评论相关表

**wp_comments** - 评论表
```sql
CREATE TABLE wp_comments (
  comment_ID bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT,
  comment_post_ID bigint(20) UNSIGNED NOT NULL DEFAULT 0,
  comment_author tinytext NOT NULL,
  comment_author_email varchar(100) NOT NULL DEFAULT '',
  comment_author_url varchar(200) NOT NULL DEFAULT '',
  comment_author_IP varchar(100) NOT NULL DEFAULT '',
  comment_date datetime NOT NULL DEFAULT '0000-00-00 00:00:00',
  comment_date_gmt datetime NOT NULL DEFAULT '0000-00-00 00:00:00',
  comment_content text NOT NULL,
  comment_karma int(11) NOT NULL DEFAULT 0,
  comment_approved varchar(20) NOT NULL DEFAULT '1',
  comment_agent varchar(255) NOT NULL DEFAULT '',
  comment_type varchar(20) NOT NULL DEFAULT 'comment',
  comment_parent bigint(20) UNSIGNED NOT NULL DEFAULT 0,
  user_id bigint(20) UNSIGNED NOT NULL DEFAULT 0,
  PRIMARY KEY  (comment_ID),
  KEY comment_post_ID (comment_post_ID),
  KEY comment_approved_date_gmt (comment_approved,comment_date_gmt),
  KEY comment_date_gmt (comment_date_gmt),
  KEY comment_parent (comment_parent),
  KEY comment_author_email (comment_author_email(10))
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
```

**wp_commentmeta** - 评论元数据表
```sql
CREATE TABLE wp_commentmeta (
  meta_id bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT,
  comment_id bigint(20) UNSIGNED NOT NULL DEFAULT 0,
  meta_key varchar(255) DEFAULT NULL,
  meta_value longtext DEFAULT NULL,
  PRIMARY KEY  (meta_id),
  KEY comment_id (comment_id),
  KEY meta_key (meta_key(191))
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
```

#### 5. 选项和设置相关表

**wp_options** - 系统选项表
```sql
CREATE TABLE wp_options (
  option_id bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT,
  option_name varchar(191) NOT NULL DEFAULT '',
  option_value longtext NOT NULL,
  autoload varchar(20) NOT NULL DEFAULT 'yes',
  PRIMARY KEY  (option_id),
  UNIQUE KEY option_name (option_name)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
```

## 🎯 自定义文章类型 (Custom Post Types)

### 作品集 (Portfolio)

```php
// 注册作品集文章类型
register_post_type('portfolio', [
  'label' => '作品集',
  'public' => true,
  'show_ui' => true,
  'capability_type' => 'post',
  'hierarchical' => false,
  'rewrite' => ['slug' => 'portfolio'],
  'query_var' => true,
  'supports' => ['title', 'editor', 'thumbnail', 'excerpt', 'custom-fields'],
  'taxonomies' => ['portfolio_category', 'portfolio_tag'],
]);
```

### 项目 (Project)

```php
register_post_type('project', [
  'label' => '项目',
  'public' => true,
  'show_ui' => true,
  'capability_type' => 'post',
  'hierarchical' => false,
  'rewrite' => ['slug' => 'project'],
  'supports' => ['title', 'editor', 'thumbnail', 'excerpt', 'custom-fields'],
]);
```

## 📁 自定义分类法 (Taxonomies)

### 作品集分类

```php
register_taxonomy('portfolio_category', 'portfolio', [
  'label' => '作品集分类',
  'rewrite' => ['slug' => 'portfolio-category'],
  'hierarchical' => true,
]);
```

### 作品集标签

```php
register_taxonomy('portfolio_tag', 'portfolio', [
  'label' => '作品集标签',
  'rewrite' => ['slug' => 'portfolio-tag'],
  'hierarchical' => false,
]);
```

## 🔑 自定义字段 (ACF)

### 文章自定义字段

```php
// 文章阅读时间
acf_add_local_field_group([
  'key' => 'group_post_fields',
  'title' => '文章字段',
  'fields' => [
    [
      'key' => 'field_reading_time',
      'label' => '阅读时间（分钟）',
      'name' => 'reading_time',
      'type' => 'number',
    ],
    [
      'key' => 'field_featured',
      'label' => '是否为精选文章',
      'name' => 'is_featured',
      'type' => 'true_false',
    ],
    [
      'key' => 'field_views',
      'label' => '浏览次数',
      'name' => 'views_count',
      'type' => 'number',
    ],
  ],
  'location' => [
    [
      [
        'param' => 'post_type',
        'operator' => '==',
        'value' => 'post',
      ],
    ],
  ],
]);
```

### 作品集自定义字段

```php
acf_add_local_field_group([
  'key' => 'group_portfolio_fields',
  'title' => '作品集字段',
  'fields' => [
    [
      'key' => 'field_project_url',
      'label' => '项目链接',
      'name' => 'project_url',
      'type' => 'url',
    ],
    [
      'key' => 'field_github_url',
      'label' => 'GitHub 链接',
      'name' => 'github_url',
      'type' => 'url',
    ],
    [
      'key' => 'field_client',
      'label' => '客户名称',
      'name' => 'client_name',
      'type' => 'text',
    ],
    [
      'key' => 'field_completion_date',
      'label' => '完成日期',
      'name' => 'completion_date',
      'type' => 'date_picker',
    ],
    [
      'key' => 'field_gallery',
      'label' => '项目图片库',
      'name' => 'project_gallery',
      'type' => 'gallery',
    ],
  ],
  'location' => [
    [
      [
        'param' => 'post_type',
        'operator' => '==',
        'value' => 'portfolio',
      ],
    ],
  ],
]);
```

## 📊 ER 图

```
┌─────────────┐         ┌──────────────────┐         ┌──────────────┐
│   wp_users  │         │    wp_posts      │         │  wp_terms    │
├─────────────┤         ├──────────────────┤         ├──────────────┤
│ ID (PK)     │◄───────│ ID (PK)          │         │ term_id (PK) │
│ user_login  │         │ post_author      │         │ name         │
│ user_email  │         │ post_title       │         │ slug         │
│ display_name│         │ post_content     │         └──────┬───────┘
└─────────────┘         │ post_date        │                │
                        │ post_status      │                │
                        │ post_type        │                │
                        └────────┬─────────┘                │
                                 │                          │
        ┌────────────────────────┼──────────────────────────┘
        │                        │
        │                        │
┌───────▼────────┐     ┌────────▼─────────┐
│  wp_postmeta   │     │ wp_term_relationships│
├────────────────┤     ├─────────────────┤
│ meta_id (PK)   │     │ object_id        │
│ post_id (FK)   │     │ term_taxonomy_id │
│ meta_key       │     └────────┬─────────┘
│ meta_value     │              │
└────────────────┘              │
                                 │
                        ┌────────▼───────────────┐
                        │  wp_term_taxonomy      │
                        ├────────────────────────┤
                        │ term_taxonomy_id (PK)  │
                        │ term_id (FK)           │
                        │ taxonomy               │
                        │ parent                 │
                        └───────────────────────┘
```

## 🚀 性能优化索引

### 添加自定义索引

```sql
-- 文章查询优化
ALTER TABLE wp_posts ADD INDEX idx_post_type_status (post_type, post_status);
ALTER TABLE wp_posts ADD INDEX idx_date_type_status (post_date, post_type, post_status);

-- 元数据查询优化
ALTER TABLE wp_postmeta ADD INDEX idx_post_meta_key (post_id, meta_key);

-- 分类查询优化
ALTER TABLE wp_term_relationships ADD INDEX idx_term_taxonomy (term_taxonomy_id);
ALTER TABLE wp_term_taxonomy ADD INDEX idx_taxonomy_count (taxonomy, count);

-- 评论查询优化
ALTER TABLE wp_comments ADD INDEX idx_approved_post (comment_approved, comment_post_ID);
```

## 📦 数据迁移脚本

### 示例：批量导入文章

```sql
INSERT INTO wp_posts (
  post_author,
  post_date,
  post_date_gmt,
  post_content,
  post_title,
  post_excerpt,
  post_status,
  post_name,
  post_type
) VALUES
(1, NOW(), UTC_TIMESTAMP(), '文章内容1', '文章标题1', '摘要1', 'publish', 'article-1', 'post'),
(1, NOW(), UTC_TIMESTAMP(), '文章内容2', '文章标题2', '摘要2', 'publish', 'article-2', 'post');
```

### 示例：批量添加分类

```sql
INSERT INTO wp_terms (name, slug, term_group) VALUES
('技术', 'tech', 0),
('设计', 'design', 0),
('教程', 'tutorial', 0);

INSERT INTO wp_term_taxonomy (term_id, taxonomy, description, parent, count) VALUES
(1, 'category', '技术相关文章', 0, 0),
(2, 'category', '设计相关文章', 0, 0),
(3, 'category', '教程类文章', 0, 0);
```

## 🔒 安全建议

1. **表前缀修改**: 修改默认的 `wp_` 前缀
2. **SQL注入防护**: 使用 WordPress 的 $wpdb->prepare()
3. **数据验证**: 使用 WordPress 的 sanitize 函数
4. **定期备份**: 设置自动备份策略
5. **权限控制**: 严格控制数据库用户权限

## 📚 相关文档

- [WordPress REST API 手册](https://developer.wordpress.org/rest-api/)
- [ACF 文档](https://www.advancedcustomfields.com/resources/)
- [WordPress 数据库结构](https://codex.wordpress.org/Database_Description)

---

**最后更新**: 2026-03-03
**版本**: 1.0.0
