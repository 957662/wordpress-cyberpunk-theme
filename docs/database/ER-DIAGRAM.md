# 📊 WordPress Cyberpunk Theme - ER 图文档

> **数据库实体关系图**
> **版本**: 1.0.0
> **日期**: 2026-02-28

---

## 目录

1. [完整 ER 图](#完整-er-图)
2. [核心表关系](#核心表关系)
3. [自定义表结构](#自定义表结构)
4. [数据流向图](#数据流向图)
5. [查询关系图](#查询关系图)

---

## 完整 ER 图

```
┌─────────────────────────────────────────────────────────────────────────────────────┐
│                    CYBERPUNK THEME - COMPLETE DATABASE SCHEMA                       │
├─────────────────────────────────────────────────────────────────────────────────────┤
│                                                                                     │
│  ┌─────────────────────────────────────────────────────────────────────────────┐   │
│  │                         WORDPRESS CORE TABLES                                │   │
│  │  ┌──────────────┐          ┌──────────────┐          ┌──────────────┐      │   │
│  │  │  wp_posts    │          │ wp_postmeta  │          │  wp_users    │      │   │
│  │  │              │  1    n  │              │  n   1   │              │      │   │
│  │  │ ┌─────────┐  │◄─────────│┌───────────┐ │◄──────────│┌──────────┐ │      │   │
│  │  │ │ID (PK)  │  │          ││meta_id   │ │          │ │ID (PK)  │ │      │   │
│  │  │ │post_    │  │          ││post_id FK│ │          │ │user_    │ │      │   │
│  │  │ │title    │  │          ││meta_key  │ │          │ │login    │ │      │   │
│  │  │ │post_    │  │          ││meta_     │ │          │ │user_    │ │      │   │
│  │  │ │type     │  │          ││value     │ │          │ │email    │ │      │   │
│  │  │ │status   │  │          │└───────────┘ │          │ └──────────┘ │      │   │
│  │  │ └─────────┘  │          └──────────────┘          └──────┬───────┘      │   │
│  │  └──────┬───────┘                                          │             │   │
│  │         │                                                    │             │   │
│  │         │                                                    │             │   │
│  │         │ 1                                                n│             │   │
│  │         └────────────────────────────────────────────────────┘             │   │
│  └─────────────────────────────────────────────────────────────────────────────┘   │
│                                    │                                             │
│                                    │                                             │
│                                    ▼                                             │
│  ┌─────────────────────────────────────────────────────────────────────────────┐   │
│  │                      CYBERPUNK CUSTOM TABLES                                │   │
│  │                                                                              │   │
│  │  ┌──────────────────────────────────────────────────────────────────────┐  │   │
│  │  │                        cyberpunk_visits                              │  │   │
│  │  │                                                                      │  │   │
│  │  │  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐            │  │   │
│  │  │  │visit_id  │  │ post_id  │  │ user_id  │  │visit_time│            │  │   │
│  │  │  │  (PK)    │  │  (FK)    │  │  (FK)    │  │          │            │  │   │
│  │  │  │bigint    │  │  bigint  │  │  bigint  │  │ datetime │            │  │   │
│  │  │  └──────────┘  └──────────┘  └──────────┘  └──────────┘            │  │   │
│  │  │                                                                      │  │   │
│  │  │  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐            │  │   │
│  │  │  │ip_address│  │user_agent│  │visit_url │  │referer   │            │  │   │
│  │  │  │varchar45 │  │varchar255│  │varchar500│  │varchar500│            │  │   │
│  │  │  └──────────┘  └──────────┘  └──────────┘  └──────────┘            │  │   │
│  │  └──────────────────────────────────────────────────────────────────────┘  │   │
│  │                                                                              │   │
│  │  ┌──────────────────────────────────────────────────────────────────────┐  │   │
│  │  │                    cyberpunk_user_actions                             │  │   │
│  │  │                                                                      │  │   │
│  │  │  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐            │  │   │
│  │  │  │action_id │  │ post_id  │  │ user_id  │  │action_   │            │  │   │
│  │  │  │  (PK)    │  │  (FK)    │  │  (FK)    │  │type      │            │  │   │
│  │  │  │bigint    │  │  bigint  │  │  bigint  │  │enum      │            │  │   │
│  │  │  └──────────┘  └──────────┘  └──────────┘  └──────────┘            │  │   │
│  │  │                                                                      │  │   │
│  │  │  ┌──────────┐  ┌──────────┐                                        │  │   │
│  │  │  │action_   │  │ip_address│                                        │  │   │
│  │  │  │time      │  │varchar45 │                                        │  │   │
│  │  │  │datetime  │  └──────────┘                                        │  │   │
│  │  │  └──────────┘                                                     │  │   │
│  │  │                                                                      │  │   │
│  │  │  UNIQUE KEY (user_id, post_id, action_type)                         │  │   │
│  │  └──────────────────────────────────────────────────────────────────────┘  │   │
│  │                                                                              │   │
│  │  ┌──────────────────────────────────────────────────────────────────────┐  │   │
│  │  │                      cyberpunk_shares                                │  │   │
│  │  │                                                                      │  │   │
│  │  │  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐            │  │   │
│  │  │  │share_id  │  │ post_id  │  │platform  │  │share_    │            │  │   │
│  │  │  │  (PK)    │  │  (FK)    │  │          │  │count     │            │  │   │
│  │  │  │bigint    │  │  bigint  │  │varchar50 │  │int       │            │  │   │
│  │  │  └──────────┘  └──────────┘  └──────────┘  └──────────┘            │  │   │
│  │  │                                                                      │  │   │
│  │  │  ┌──────────┐  ┌──────────┐                                        │  │   │
│  │  │  │share_url │  │last_     │                                        │  │   │
│  │  │  │varchar500│  │updated   │                                        │  │   │
│  │  │  └──────────┘  │datetime  │                                        │  │   │
│  │  │                └──────────┘                                        │  │   │
│  │  │                                                                      │  │   │
│  │  │  UNIQUE KEY (post_id, platform)                                     │  │   │
│  │  └──────────────────────────────────────────────────────────────────────┘  │   │
│  │                                                                              │   │
│  └─────────────────────────────────────────────────────────────────────────────┘   │
│                                                                                     │
│  ┌─────────────────────────────────────────────────────────────────────────────┐   │
│  │                          VIEWS (Virtual Tables)                             │   │
│  │                                                                              │   │
│  │  ┌────────────────────────────────────────────────────────────────────┐    │   │
│  │  │              cyberpunk_post_stats (Aggregated View)                 │    │   │
│  │  │  ┌─────────┐ ┌─────┐ ┌─────┐ ┌──────┐ ┌──────┐ ┌─────┐            │    │   │
│  │  │  │post_id  │ │views│ │likes│ │books.│ │shares│ │comms│            │    │   │
│  │  │  └─────────┘ └─────┘ └─────┘ └──────┘ └──────┘ └─────┘            │    │   │
│  │  └────────────────────────────────────────────────────────────────────┘    │   │
│  │                                                                              │   │
│  │  ┌────────────────────────────────────────────────────────────────────┐    │   │
│  │  │            cyberpunk_user_activity (User Analytics)                 │    │   │
│  │  │  ┌─────────┐ ┌─────┐ ┌──────┐ ┌───────┐ ┌─────────┐               │    │   │
│  │  │  │user_id  │ │likes│ │books.│ │visits │ │last_visit│              │    │   │
│  │  │  └─────────┘ └─────┘ └──────┘ └───────┘ └─────────┘               │    │   │
│  │  └────────────────────────────────────────────────────────────────────┘    │   │
│  │                                                                              │   │
│  └─────────────────────────────────────────────────────────────────────────────┘   │
│                                                                                     │
└─────────────────────────────────────────────────────────────────────────────────────┘
```

---

## 核心表关系

### 1. 文章与元数据关系 (1:N)

```
┌──────────────────┐         ┌──────────────────┐
│   wp_posts       │  1   n  │   wp_postmeta    │
├──────────────────├─────────┤──────────────────┤
│ ID (PK)          │─────────│ meta_id (PK)     │
│ post_title       │         │ post_id (FK)     │
│ post_type        │         │ meta_key         │
│ post_status      │         │ meta_value       │
│ post_date        │         │                  │
└──────────────────┘         └──────────────────┘

关系说明:
- 一个文章 (wp_posts) 可以有多个元数据 (wp_postmeta)
- 通过 post_id 关联
- Meta Keys 示例:
  * cyberpunk_views_count
  * cyberpunk_likes_count
  * cyberpunk_featured_color
```

### 2. 用户与动作关系 (1:N)

```
┌──────────────────┐         ┌──────────────────────────────┐
│   wp_users       │  1   n  │ cyberpunk_user_actions       │
├──────────────────├─────────┤──────────────────────────────┤
│ ID (PK)          │─────────│ action_id (PK)               │
│ user_login       │         │ user_id (FK)                 │
│ user_email       │         │ post_id (FK)                 │
│ display_name     │         │ action_type (like/bookmark)  │
└──────────────────┘         │ action_time                  │
                             │ ip_address                   │
                             └──────────────────────────────┘

关系说明:
- 一个用户可以执行多个操作
- 操作类型: like, bookmark, share
- UNIQUE KEY 防止重复操作
```

### 3. 文章与访问记录关系 (1:N)

```
┌──────────────────┐         ┌──────────────────────────────┐
│   wp_posts       │  1   n  │ cyberpunk_visits              │
├──────────────────├─────────┤──────────────────────────────┤
│ ID (PK)          │─────────│ visit_id (PK)                 │
│ post_title       │         │ post_id (FK)                  │
│ post_type        │         │ user_id (FK)                  │
└──────────────────┘         │ visit_time                    │
                             │ ip_address                    │
                             │ user_agent                    │
                             │ visit_url                     │
                             └──────────────────────────────┘

关系说明:
- 一个文章可以有多次访问记录
- 记录每次访问的详细信息
- 定期清理旧数据 (90天)
```

### 4. 文章与分享统计关系 (1:N)

```
┌──────────────────┐         ┌──────────────────────────────┐
│   wp_posts       │  1   n  │ cyberpunk_shares              │
├──────────────────├─────────┤──────────────────────────────┤
│ ID (PK)          │─────────│ share_id (PK)                 │
│ post_title       │         │ post_id (FK)                  │
└──────────────────┘         │ platform (fb/twitter/linkedin)│
                             │ share_count                   │
                             │ last_updated                  │
                             └──────────────────────────────┘

关系说明:
- 一个文章在多个平台被分享
- 每个平台一条记录 (UNIQUE KEY)
- 实时更新分享计数
```

---

## 自定义表结构

### Table: cyberpunk_visits (访问日志表)

```yaml
表名: wp_cyberpunk_visits
用途: 记录文章访问历史
引擎: InnoDB
字符集: utf8mb4_unicode_ci

字段:
  - visit_id:
      类型: bigint(20) UNSIGNED
      属性: PRIMARY KEY, AUTO_INCREMENT
      说明: 访问记录唯一标识

  - post_id:
      类型: bigint(20) UNSIGNED
      属性: NOT NULL, INDEX
      外键: wp_posts.ID
      说明: 被访问的文章ID

  - user_id:
      类型: bigint(20) UNSIGNED
      属性: NOT NULL, DEFAULT 0, INDEX
      外键: wp_users.ID
      说明: 访问用户ID (0=游客)

  - ip_address:
      类型: varchar(45)
      属性: NOT NULL
      说明: IP地址 (支持IPv6)

  - user_agent:
      类型: varchar(255)
      属性: NOT NULL
      说明: 浏览器User Agent

  - visit_url:
      类型: varchar(500)
      属性: NOT NULL
      说明: 访问的URL

  - referer:
      类型: varchar(500)
      属性: DEFAULT ''
      说明: 来源页面URL

  - visit_time:
      类型: datetime
      属性: NOT NULL, DEFAULT NOW(), INDEX
      说明: 访问时间

  - session_id:
      类型: varchar(100)
      属性: NOT NULL, INDEX
      说明: 会话ID

索引:
  - PRIMARY: visit_id
  - idx_post_id: post_id
  - idx_user_id: user_id
  - idx_visit_time: visit_time
  - idx_post_time: (post_id, visit_time) 复合索引
  - idx_user_time: (user_id, visit_time) 复合索引
```

### Table: cyberpunk_user_actions (用户互动表)

```yaml
表名: wp_cyberpunk_user_actions
用途: 记录用户点赞、收藏、分享等互动
引擎: InnoDB
字符集: utf8mb4_unicode_ci

字段:
  - action_id:
      类型: bigint(20) UNSIGNED
      属性: PRIMARY KEY, AUTO_INCREMENT
      说明: 动作记录唯一标识

  - user_id:
      类型: bigint(20) UNSIGNED
      属性: NOT NULL, INDEX
      外键: wp_users.ID
      说明: 执行操作的用户ID

  - post_id:
      类型: bigint(20) UNSIGNED
      属性: NOT NULL, INDEX
      外键: wp_posts.ID
      说明: 被操作的文章ID

  - action_type:
      类型: ENUM('like', 'bookmark', 'share')
      属性: NOT NULL, INDEX
      说明: 动作类型

  - action_time:
      类型: datetime
      属性: NOT NULL, DEFAULT NOW(), INDEX
      说明: 操作时间

  - ip_address:
      类型: varchar(45)
      属性: NOT NULL
      说明: IP地址

索引:
  - PRIMARY: action_id
  - UNIQUE: idx_unique_user_post (user_id, post_id, action_type)
  - idx_user_id: user_id
  - idx_post_id: post_id
  - idx_action_type: action_type
  - idx_action_time: action_time
  - idx_user_action: (user_id, action_type)
  - idx_post_action: (post_id, action_type)

约束:
  - UNIQUE KEY 防止用户重复操作同一文章
```

### Table: cyberpunk_shares (社交分享统计表)

```yaml
表名: wp_cyberpunk_shares
用途: 记录各社交平台分享次数
引擎: InnoDB
字符集: utf8mb4_unicode_ci

字段:
  - share_id:
      类型: bigint(20) UNSIGNED
      属性: PRIMARY KEY, AUTO_INCREMENT
      说明: 分享记录唯一标识

  - post_id:
      类型: bigint(20) UNSIGNED
      属性: NOT NULL, INDEX
      外键: wp_posts.ID
      说明: 被分享的文章ID

  - platform:
      类型: varchar(50)
      属性: NOT NULL, INDEX
      说明: 社交平台名称
      可选值: facebook, twitter, linkedin, pinterest, whatsapp

  - share_count:
      类型: int(11) UNSIGNED
      属性: NOT NULL, DEFAULT 0, INDEX
      说明: 分享次数

  - share_url:
      类型: varchar(500)
      属性: NULL
      说明: 分享链接

  - last_updated:
      类型: datetime
      属性: NOT NULL, DEFAULT NOW() ON UPDATE NOW()
      说明: 最后更新时间

索引:
  - PRIMARY: share_id
  - UNIQUE: idx_unique_post_platform (post_id, platform)
  - idx_post_id: post_id
  - idx_platform: platform
  - idx_share_count: share_count

约束:
  - UNIQUE KEY 确保每篇文章每个平台只有一条记录
```

---

## 数据流向图

### 用户访问文章数据流

```
┌─────────┐
│  User   │
└────┬────┘
     │ 1. Request Post
     ▼
┌───────────────────────────────────────────────────────────┐
│                    WordPress Frontend                      │
│  ┌───────────────┐  ┌───────────────┐  ┌───────────────┐ │
│  │ Single.php    │  │ Functions.php │  │ AJAX Handlers │ │
│  └───────┬───────┘  └───────┬───────┘  └───────┬───────┘ │
└──────────┼──────────────────┼──────────────────┼──────────┘
           │                  │                  │
           │ 2. Track Visit   │ 3. Update Views  │
           ▼                  ▼                  ▼
┌───────────────────────────────────────────────────────────┐
│                      Database Layer                        │
│                                                           │
│  ┌─────────────────────────────────────────────────────┐ │
│  │  INSERT INTO cyberpunk_visits                        │ │
│  │  - post_id, user_id, ip, url, referer, time         │ │
│  └─────────────────────────────────────────────────────┘ │
│                                                           │
│  ┌─────────────────────────────────────────────────────┐ │
│  │  CALL cyberpunk_increment_views(post_id)            │ │
│  │  - Updates wp_postmeta cyberpunk_views_count        │ │
│  └─────────────────────────────────────────────────────┘ │
│                                                           │
└───────────────────────────────────────────────────────────┘
           │
           │ 4. Return Updated Stats
           ▼
┌───────────────────────────────────────────────────────────┐
│                    Frontend Display                       │
│  - Show updated view count                                │
│  - Show like button                                       │
│  - Show bookmark button                                   │
└───────────────────────────────────────────────────────────┘
```

### 用户点赞数据流

```
┌─────────┐
│  User   │
└────┬────┘
     │ 1. Click Like Button
     ▼
┌───────────────────────────────────────────────────────────┐
│                    AJAX Request                           │
│  - POST: action=cyberpunk_like_post                       │
│  - Data: post_id, nonce                                   │
└───────────────────────┬───────────────────────────────────┘
                        │
                        ▼
┌───────────────────────────────────────────────────────────┐
│              Server-Side Handler (PHP)                    │
│                                                           │
│  1. Verify Nonce                                          │
│  2. Check User Permissions                                │
│  3. Check if Already Liked                                │
│                                                           │
│     IF NOT EXISTS:                                        │
│        - INSERT INTO cyberpunk_user_actions               │
│        - Update wp_postmeta likes_count                   │
│     ELSE:                                                 │
│        - DELETE FROM cyberpunk_user_actions               │
│        - Update wp_postmeta likes_count                   │
│                                                           │
└───────────────────────┬───────────────────────────────────┘
                        │
                        │ 4. JSON Response
                        ▼
┌───────────────────────────────────────────────────────────┐
│                 Frontend Update                           │
│  - Update like count display                              │
│  - Toggle button state                                    │
│  - Show success message                                   │
└───────────────────────────────────────────────────────────┘
```

### 定时清理任务数据流

```
┌───────────────────────────────────────────────────────────┐
│              MySQL Event Scheduler                        │
│                                                           │
│  Event: cyberpunk_daily_cleanup                           │
│  Schedule: Every 1 Day at 3:00 AM                        │
└───────────────────────┬───────────────────────────────────┘
                        │
                        │ Trigger
                        ▼
┌───────────────────────────────────────────────────────────┐
│         Stored Procedure: cyberpunk_clean_old_visits      │
│                                                           │
│  INPUT: days_to_keep = 90                                 │
│                                                           │
│  DELETE FROM wp_cyberpunk_visits                          │
│  WHERE visit_time < DATE_SUB(NOW(), INTERVAL 90 DAY)      │
│                                                           │
│  RETURN: deleted_rows                                     │
│                                                           │
└───────────────────────┬───────────────────────────────────┘
                        │
                        │ Log Results
                        ▼
┌───────────────────────────────────────────────────────────┐
│                    wp_options                             │
│  - Update cyberpunk_last_cleanup                          │
│  - Log deleted_rows count                                 │
└───────────────────────────────────────────────────────────┘
```

---

## 查询关系图

### 查询 1: 获取热门文章

```
┌───────────────────────────────────────────────────────────┐
│              Query: Get Popular Posts                     │
│                                                           │
│  SELECT                                                   │
│    p.ID, p.post_title,                                   │
│    pm.meta_value as views_count,                         │
│    COUNT(cua.action_id) as likes_count,                  │
│    p.comment_count                                       │
│  FROM wp_posts p                                         │
│  LEFT JOIN wp_postmeta pm                                │
│    ON p.ID = pm.post_id                                  │
│    AND pm.meta_key = 'cyberpunk_views_count'             │
│  LEFT JOIN cyberpunk_user_actions cua                    │
│    ON p.ID = cua.post_id                                 │
│    AND cua.action_type = 'like'                          │
│  WHERE p.post_type = 'post'                              │
│    AND p.post_status = 'publish'                         │
│  ORDER BY views_count DESC                               │
│  LIMIT 10                                                │
│                                                           │
│  ┌──────────┐   ┌──────────┐   ┌──────────┐            │
│  │wp_posts  │   │wp_post-  │   │cyberpunk_│            │
│  │          │   │meta      │   │user_     │            │
│  │          ├───│          ├───│actions   │            │
│  │          │   │          │   │          │            │
│  └──────────┘   └──────────┘   └──────────┘            │
│       │               │               │                 │
│       └───────────────┴───────────────┘                 │
│                       │                                 │
│                       ▼                                 │
│              ┌──────────────┐                           │
│              │  Result Set  │                           │
│              └──────────────┘                           │
└───────────────────────────────────────────────────────────┘
```

### 查询 2: 获取用户收藏列表

```
┌───────────────────────────────────────────────────────────┐
│           Query: Get User Bookmarks                       │
│                                                           │
│  SELECT                                                   │
│    p.ID, p.post_title, p.post_date,                      │
│    p.post_excerpt, pm.meta_value as views                │
│  FROM wp_posts p                                         │
│  INNER JOIN cyberpunk_user_actions cua                   │
│    ON p.ID = cua.post_id                                 │
│  LEFT JOIN wp_postmeta pm                                │
│    ON p.ID = pm.post_id                                  │
│    AND pm.meta_key = 'cyberpunk_views_count'             │
│  WHERE cua.user_id = :user_id                            │
│    AND cua.action_type = 'bookmark'                      │
│    AND p.post_status = 'publish'                         │
│  ORDER BY cua.action_time DESC                           │
│                                                           │
│  ┌──────────┐   ┌──────────┐                           │
│  │wp_posts  │   │cyberpunk_│                           │
│  │          │   │user_     │                           │
│  │          ├───│actions   │                           │
│  │          │   │          │                           │
│  └──────────┘   └──────────┘                           │
│       ▲               │                                 │
│       │               │                                 │
│       │    ┌──────────┴──────────┐                      │
│       └────│     JOIN Result     │                      │
│            └─────────────────────┘                      │
│                       │                                 │
│                       ▼                                 │
│              ┌──────────────┐                           │
│              │ User's Saved │                           │
│              │   Articles   │                           │
│              └──────────────┘                           │
└───────────────────────────────────────────────────────────┘
```

### 查询 3: 统计文章总分享数

```
┌───────────────────────────────────────────────────────────┐
│         Query: Get Total Shares by Post                   │
│                                                           │
│  SELECT                                                   │
│    p.ID, p.post_title,                                   │
│    SUM(cs.share_count) as total_shares,                  │
│    GROUP_CONCAT(cs.platform) as platforms                │
│  FROM wp_posts p                                         │
│  LEFT JOIN cyberpunk_shares cs                           │
│    ON p.ID = cs.post_id                                  │
│  WHERE p.post_type = 'post'                              │
│    AND p.post_status = 'publish'                         │
│  GROUP BY p.ID                                           │
│  ORDER BY total_shares DESC                              │
│                                                           │
│  ┌──────────┐   ┌──────────┐                           │
│  │wp_posts  │   │cyberpunk_│                           │
│  │          │   │shares    │                           │
│  │          ├───│          │                           │
│  │          │   │          │                           │
│  └──────────┘   └──────────┘                           │
│       │               │                                 │
│       └───────────────┘                                 │
│              │ GROUP BY                                  │
│              ▼                                          │
│     ┌──────────────────┐                                │
│     │ Aggregated Stats │                                │
│     │ - Total Shares   │                                │
│     │ - All Platforms  │                                │
│     └──────────────────┘                                │
└───────────────────────────────────────────────────────────┘
```

### 查询 4: 文章访问统计 (使用视图)

```
┌───────────────────────────────────────────────────────────┐
│         Query: Post Stats (Using View)                    │
│                                                           │
│  SELECT * FROM wp_cyberpunk_post_stats                   │
│  WHERE post_id = :post_id                                │
│                                                           │
│  ┌─────────────────────────────────────────────────────┐│
│  │         VIEW: cyberpunk_post_stats                  ││
│  │                                                      ││
│  │  ┌──────────┐  ┌──────────┐  ┌──────────┐        ││
│  │  │wp_posts  │  │wp_post-  │  │cyberpunk_│        ││
│  │  │          │  │meta      │  │user_     │        ││
│  │  │          ├──│          ├──│actions   │        ││
│  │  │          │  │          │  │          │        ││
│  │  └──────────┘  └──────────┘  └──────────┘        ││
│  │       │              │              │             ││
│  │       └──────────────┴──────────────┘             ││
│  │                      │                            ││
│  │                      ▼                            ││
│  │         ┌──────────────────────┐                 ││
│  │         │  Aggregated View     │                 ││
│  │         │ - views_count        │                 ││
│  │         │ - likes_count        │                 ││
│  │         │ - bookmarks_count    │                 ││
│  │         │ - total_shares       │                 ││
│  │         │ - comments_count     │                 ││
│  │         └──────────────────────┘                 ││
│  └─────────────────────────────────────────────────────┘│
└───────────────────────────────────────────────────────────┘
```

---

## 总结

本 ER 图文档展示了 WordPress Cyberpunk Theme 的完整数据库架构：

### 核心组件
- ✅ **3 张自定义表** - 访问日志、用户动作、分享统计
- ✅ **2 个视图** - 文章统计、用户活跃度
- ✅ **4 个存储过程** - 清理日志、更新浏览数等
- ✅ **1 个定时事件** - 每日清理任务

### 关系特点
- 1:N 关系 - 文章与元数据、用户与操作
- UNIQUE 约束 - 防止重复操作
- 外键关联 - 数据一致性
- 复合索引 - 查询性能优化

---

**版本**: 1.0.0
**日期**: 2026-02-28
**作者**: Database Architect
