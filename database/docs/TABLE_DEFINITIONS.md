# CyberPress Platform - 完整表结构定义

## 1. 用户表 (users)

```sql
CREATE TABLE users (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    avatar_url VARCHAR(500),
    cover_url VARCHAR(500),
    bio TEXT,
    website VARCHAR(255),
    location VARCHAR(100),
    birth_date DATE,

    -- 状态字段
    status ENUM('active', 'inactive', 'banned', 'pending') DEFAULT 'pending',
    email_verified BOOLEAN DEFAULT FALSE,
    phone VARCHAR(20),
    phone_verified BOOLEAN DEFAULT FALSE,

    -- 统计字段（冗余设计，提升查询性能）
    followers_count INT DEFAULT 0,
    following_count INT DEFAULT 0,
    posts_count INT DEFAULT 0,

    -- 时间戳
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP NULL,

    -- 索引
    INDEX idx_username (username),
    INDEX idx_email (email),
    INDEX idx_status (status),
    INDEX idx_created_at (created_at),

    -- 全文搜索
    FULLTEXT idx_ft_search (username, bio)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
COMMENT='用户主表';
```

## 2. 用户资料表 (user_profiles)

```sql
CREATE TABLE user_profiles (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    user_id BIGINT UNIQUE NOT NULL,

    -- 个人信息
    display_name VARCHAR(100),
    real_name VARCHAR(100),
    gender ENUM('male', 'female', 'other', 'prefer_not_to_say'),
    birth_date DATE,

    -- 社交信息
    website VARCHAR(255),
    github VARCHAR(100),
    twitter VARCHAR(100),
    linkedin VARCHAR(100),

    -- 偏好设置
    language VARCHAR(10) DEFAULT 'zh-CN',
    timezone VARCHAR(50) DEFAULT 'Asia/Shanghai',
    theme ENUM('light', 'dark', 'auto') DEFAULT 'auto',

    -- 隐私设置
    profile_visibility ENUM('public', 'followers_only', 'private') DEFAULT 'public',
    show_email BOOLEAN DEFAULT FALSE,
    show_location BOOLEAN DEFAULT FALSE,
    allow_messages BOOLEAN DEFAULT TRUE,

    -- 通知设置（JSON格式）
    notification_preferences JSON,

    -- 时间戳
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_user_id (user_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
COMMENT='用户详细资料表';
```

## 3. 关注关系表 (followers)

```sql
CREATE TABLE followers (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    follower_id BIGINT NOT NULL COMMENT '关注者ID',
    following_id BIGINT NOT NULL COMMENT '被关注者ID',

    -- 时间戳
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    -- 外键约束
    FOREIGN KEY (follower_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (following_id) REFERENCES users(id) ON DELETE CASCADE,

    -- 唯一约束（防止重复关注）
    UNIQUE KEY uk_follow (follower_id, following_id),

    -- 检查约束（不能关注自己）
    CHECK (follower_id != following_id),

    -- 索引
    INDEX idx_follower (follower_id),
    INDEX idx_following (following_id),
    INDEX idx_created_at (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
COMMENT='用户关注关系表';
```

## 4. 文章表 (posts)

```sql
CREATE TABLE posts (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    author_id BIGINT NOT NULL,

    -- 内容字段
    title VARCHAR(500) NOT NULL,
    slug VARCHAR(500) UNIQUE NOT NULL,
    excerpt TEXT,
    content LONGTEXT NOT NULL,

    -- 媒体
    featured_image VARCHAR(500),
    cover_image VARCHAR(500),

    -- 分类和标签
    category_id BIGINT,
    primary_tag_id BIGINT,

    -- 状态字段
    status ENUM('draft', 'published', 'scheduled', 'archived') DEFAULT 'draft',
    post_type ENUM('post', 'page', 'custom') DEFAULT 'post',

    -- SEO
    meta_title VARCHAR(200),
    meta_description TEXT,
    meta_keywords VARCHAR(500),

    -- 统计字段（冗余设计）
    view_count INT DEFAULT 0,
    like_count INT DEFAULT 0,
    comment_count INT DEFAULT 0,
    bookmark_count INT DEFAULT 0,

    -- 阅读相关
    reading_time INT COMMENT '预估阅读时间（分钟）',
    word_count INT DEFAULT 0,

    -- 优先级和特色
    is_featured BOOLEAN DEFAULT FALSE,
    is_pinned BOOLEAN DEFAULT FALSE,
    is_trending BOOLEAN DEFAULT FALSE,
    priority INT DEFAULT 0,

    -- 时间戳
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    published_at TIMESTAMP NULL,
    scheduled_at TIMESTAMP NULL,
    deleted_at TIMESTAMP NULL,

    -- 外键约束
    FOREIGN KEY (author_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE SET NULL,
    FOREIGN KEY (primary_tag_id) REFERENCES tags(id) ON DELETE SET NULL,

    -- 索引
    INDEX idx_author (author_id),
    INDEX idx_status (status),
    INDEX idx_slug (slug),
    INDEX idx_published_at (published_at),
    INDEX idx_created_at (created_at),
    INDEX idx_featured (is_featured, status),
    INDEX idx_trending (is_trending, status),
    INDEX idx_category (category_id),
    INDEX idx_performance (status, published_at, view_count DESC),

    -- 全文搜索
    FULLTEXT idx_ft_content (title, content, excerpt)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
COMMENT='文章主表';
```

## 5. 分类表 (categories)

```sql
CREATE TABLE categories (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    slug VARCHAR(100) UNIQUE NOT NULL,
    description TEXT,

    -- 层级关系
    parent_id BIGINT,
    level INT DEFAULT 0,
    path VARCHAR(500),

    -- 媒体
    icon VARCHAR(100),
    color VARCHAR(20),
    image VARCHAR(500),

    -- 统计
    post_count INT DEFAULT 0,

    -- 显示设置
    display_order INT DEFAULT 0,
    is_visible BOOLEAN DEFAULT TRUE,

    -- 时间戳
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    FOREIGN KEY (parent_id) REFERENCES categories(id) ON DELETE SET NULL,
    INDEX idx_slug (slug),
    INDEX idx_parent (parent_id),
    INDEX idx_display_order (display_order)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
COMMENT='文章分类表';
```

## 6. 标签表 (tags)

```sql
CREATE TABLE tags (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(50) UNIQUE NOT NULL,
    slug VARCHAR(50) UNIQUE NOT NULL,
    description TEXT,

    -- 样式
    color VARCHAR(20),
    icon VARCHAR(100),

    -- 统计
    post_count INT DEFAULT 0,

    -- 显示设置
    display_order INT DEFAULT 0,
    is_visible BOOLEAN DEFAULT TRUE,

    -- 时间戳
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    INDEX idx_slug (slug),
    INDEX idx_name (name),
    INDEX idx_post_count (post_count DESC)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
COMMENT='文章标签表';
```

## 7. 文章-分类关联表 (post_categories)

```sql
CREATE TABLE post_categories (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    post_id BIGINT NOT NULL,
    category_id BIGINT NOT NULL,

    -- 时间戳
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (post_id) REFERENCES posts(id) ON DELETE CASCADE,
    FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE CASCADE,

    UNIQUE KEY uk_post_category (post_id, category_id),
    INDEX idx_post (post_id),
    INDEX idx_category (category_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
COMMENT='文章-分类关联表（多对多）';
```

## 8. 文章-标签关联表 (post_tags)

```sql
CREATE TABLE post_tags (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    post_id BIGINT NOT NULL,
    tag_id BIGINT NOT NULL,

    -- 时间戳
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (post_id) REFERENCES posts(id) ON DELETE CASCADE,
    FOREIGN KEY (tag_id) REFERENCES tags(id) ON DELETE CASCADE,

    UNIQUE KEY uk_post_tag (post_id, tag_id),
    INDEX idx_post (post_id),
    INDEX idx_tag (tag_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
COMMENT='文章-标签关联表（多对多）';
```

## 9. 评论表 (comments)

```sql
CREATE TABLE comments (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    post_id BIGINT NOT NULL,
    author_id BIGINT NOT NULL,

    -- 层级关系（支持回复）
    parent_id BIGINT,
    thread_id BIGINT COMMENT '顶层评论ID，方便查询整个讨论',

    -- 内容
    content TEXT NOT NULL,

    -- 状态
    status ENUM('pending', 'approved', 'rejected', 'spam') DEFAULT 'pending',

    -- 统计
    like_count INT DEFAULT 0,
    reply_count INT DEFAULT 0,

    -- IP和User-Agent（用于反垃圾）
    ip_address VARCHAR(45),
    user_agent VARCHAR(500),

    -- 时间戳
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP NULL,

    FOREIGN KEY (post_id) REFERENCES posts(id) ON DELETE CASCADE,
    FOREIGN KEY (author_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (parent_id) REFERENCES comments(id) ON DELETE CASCADE,

    INDEX idx_post (post_id),
    INDEX idx_author (author_id),
    INDEX idx_parent (parent_id),
    INDEX idx_thread (thread_id),
    INDEX idx_status (status),
    INDEX idx_created_at (created_at),
    INDEX idx_performance (post_id, status, created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
COMMENT='文章评论表';
```

## 10. 点赞表 (likes)

```sql
CREATE TABLE likes (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    user_id BIGINT NOT NULL,
    target_id BIGINT NOT NULL COMMENT '目标ID（文章/评论）',
    target_type ENUM('post', 'comment') NOT NULL COMMENT '目标类型',

    -- 时间戳
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,

    UNIQUE KEY uk_like (user_id, target_id, target_type),
    INDEX idx_user (user_id),
    INDEX idx_target (target_id, target_type),
    INDEX idx_created_at (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
COMMENT='点赞表';
```

## 11. 收藏夹表 (bookmark_folders)

```sql
CREATE TABLE bookmark_folders (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    user_id BIGINT NOT NULL,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    icon VARCHAR(100),
    color VARCHAR(20),

    -- 显示设置
    is_public BOOLEAN DEFAULT FALSE,
    display_order INT DEFAULT 0,

    -- 统计
    bookmark_count INT DEFAULT 0,

    -- 时间戳
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_user (user_id),
    INDEX idx_display_order (display_order)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
COMMENT='收藏夹表';
```

## 12. 收藏表 (bookmarks)

```sql
CREATE TABLE bookmarks (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    user_id BIGINT NOT NULL,
    post_id BIGINT NOT NULL,
    folder_id BIGINT,

    -- 备注
    note TEXT,
    tags VARCHAR(500) COMMENT '用户自定义标签，逗号分隔',

    -- 时间戳
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (post_id) REFERENCES posts(id) ON DELETE CASCADE,
    FOREIGN KEY (folder_id) REFERENCES bookmark_folders(id) ON DELETE SET NULL,

    UNIQUE KEY uk_bookmark (user_id, post_id),
    INDEX idx_user (user_id),
    INDEX idx_post (post_id),
    INDEX idx_folder (folder_id),
    INDEX idx_created_at (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
COMMENT='收藏表';
```

## 13. 阅读历史表 (reading_history)

```sql
CREATE TABLE reading_history (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    user_id BIGINT NOT NULL,
    post_id BIGINT NOT NULL,

    -- 阅读进度
    progress_percent INT DEFAULT 0 COMMENT '阅读进度百分比',
    scroll_position INT DEFAULT 0 COMMENT '滚动位置（像素）',
    time_spent INT DEFAULT 0 COMMENT '阅读时长（秒）',

    -- 状态
    is_completed BOOLEAN DEFAULT FALSE,
    last_read_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    -- 首次阅读
    first_read_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    -- 阅读次数
    read_count INT DEFAULT 1,

    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (post_id) REFERENCES posts(id) ON DELETE CASCADE,

    UNIQUE KEY uk_reading (user_id, post_id),
    INDEX idx_user (user_id),
    INDEX idx_post (post_id),
    INDEX idx_last_read (last_read_at),
    INDEX idx_progress (user_id, is_completed)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
COMMENT='阅读历史表';
```

## 14. 阅读列表表 (reading_list)

```sql
CREATE TABLE reading_list (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    user_id BIGINT NOT NULL,
    post_id BIGINT NOT NULL,

    -- 优先级
    priority INT DEFAULT 0,

    -- 备注
    note TEXT,

    -- 时间戳
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (post_id) REFERENCES posts(id) ON DELETE CASCADE,

    UNIQUE KEY uk_reading_list (user_id, post_id),
    INDEX idx_user (user_id),
    INDEX idx_priority (user_id, priority)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
COMMENT='阅读列表（稍后阅读）';
```

## 15. 通知表 (notifications)

```sql
CREATE TABLE notifications (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    user_id BIGINT NOT NULL COMMENT '接收者ID',
    sender_id BIGINT COMMENT '发送者ID（系统通知为NULL）',

    -- 类型
    type ENUM(
        'follow', 'like', 'comment', 'mention',
        'reply', 'bookmark', 'system', 'welcome'
    ) NOT NULL,

    -- 内容
    title VARCHAR(200) NOT NULL,
    content TEXT,

    -- 关联数据
    target_id BIGINT COMMENT '关联对象ID',
    target_type VARCHAR(50) COMMENT '关联对象类型',

    -- 状态
    is_read BOOLEAN DEFAULT FALSE,
    read_at TIMESTAMP NULL,

    -- 时间戳
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (sender_id) REFERENCES users(id) ON DELETE SET NULL,

    INDEX idx_user_unread (user_id, is_read),
    INDEX idx_created_at (created_at),
    INDEX idx_type (type)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
COMMENT='用户通知表';
```

## 16. 文章浏览统计表 (post_views)

```sql
CREATE TABLE post_views (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    post_id BIGINT NOT NULL,
    user_id BIGINT COMMENT '用户ID（游客为NULL）',

    -- 访问信息
    ip_address VARCHAR(45),
    user_agent VARCHAR(500),
    referrer VARCHAR(500),

    -- 会话信息
    session_id VARCHAR(100),

    -- 时间戳
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (post_id) REFERENCES posts(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL,

    INDEX idx_post_date (post_id, created_at),
    INDEX idx_user (user_id),
    INDEX idx_session (session_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
COMMENT='文章浏览统计表'
PARTITION BY RANGE (YEAR(created_at)) (
    PARTITION p2023 VALUES LESS THAN (2024),
    PARTITION p2024 VALUES LESS THAN (2025),
    PARTITION p2025 VALUES LESS THAN (2026),
    PARTITION p2026 VALUES LESS THAN (2027),
    PARTITION p_future VALUES LESS THAN MAXVALUE
);
```

## 17. 媒体文件表 (media)

```sql
CREATE TABLE media (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    uploader_id BIGINT NOT NULL,

    -- 文件信息
    filename VARCHAR(255) NOT NULL,
    original_filename VARCHAR(255) NOT NULL,
    mime_type VARCHAR(100) NOT NULL,
    file_size BIGINT NOT NULL COMMENT '文件大小（字节）',

    -- 存储路径
    storage_path VARCHAR(500) NOT NULL,
    url VARCHAR(500) NOT NULL,
    thumbnail_url VARCHAR(500),

    -- 媒体类型
    media_type ENUM('image', 'video', 'audio', 'document', 'other') NOT NULL,

    -- 图片特有字段
    width INT,
    height INT,
    alt_text VARCHAR(500),
    caption TEXT,

    -- 关联
    post_id BIGINT COMMENT '关联的文章ID',

    -- 状态
    status ENUM('uploading', 'processing', 'ready', 'error') DEFAULT 'uploading',

    -- 时间戳
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    FOREIGN KEY (uploader_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (post_id) REFERENCES posts(id) ON DELETE SET NULL,

    INDEX idx_uploader (uploader_id),
    INDEX idx_post (post_id),
    INDEX idx_type (media_type),
    INDEX idx_status (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
COMMENT='媒体文件表';
```

## 18. 分析事件表 (analytics_events)

```sql
CREATE TABLE analytics_events (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,

    -- 会话信息
    session_id VARCHAR(100) NOT NULL,
    user_id BIGINT COMMENT '用户ID（游客为NULL）',

    -- 事件信息
    event_type VARCHAR(50) NOT NULL COMMENT '事件类型',
    event_category VARCHAR(50) COMMENT '事件分类',
    event_label VARCHAR(200) COMMENT '事件标签',

    -- 页面信息
    page_url VARCHAR(500),
    page_title VARCHAR(200),
    referrer VARCHAR(500),

    -- 设备信息
    ip_address VARCHAR(45),
    user_agent VARCHAR(500),
    device_type ENUM('desktop', 'tablet', 'mobile', 'bot'),
    browser VARCHAR(50),
    os VARCHAR(50),

    -- 自定义属性（JSON）
    properties JSON,

    -- 时间戳
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    INDEX idx_session (session_id),
    INDEX idx_user (user_id),
    INDEX idx_type (event_type),
    INDEX idx_created_at (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
COMMENT='分析事件表';
```

---

**创建时间**: 2026-03-07
**架构师**: AI Database Architect
**版本**: 1.0.0
**数据库**: MySQL 8.0+ / PostgreSQL 15+
