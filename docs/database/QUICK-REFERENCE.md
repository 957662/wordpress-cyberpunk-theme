# 📖 WordPress Cyberpunk Theme - 数据库快速参考

> **快速参考手册**
> **版本**: 1.0.0
> **日期**: 2026-02-28

---

## 📋 表结构速查

### 自定义表

| 表名 | 用途 | 记录数估算 |
|:-----|:-----|:----------|
| `wp_cyberpunk_visits` | 访问日志 | 10,000+/月 |
| `wp_cyberpunk_user_actions` | 用户互动 (点赞/收藏) | 5,000+/月 |
| `wp_cyberpunk_shares` | 社交分享统计 | 500 (固定) |

### WordPress 核心 PostMeta Keys

```php
// 文章统计
'cyberpunk_views_count'      // 浏览次数
'cyberpunk_likes_count'      // 点赞数
'cyberpunk_shares_count'     // 分享数

// 文章特色
'cyberpunk_featured_color'   // 特色颜色 (#hex)
'cyberpunk_neon_intensity'   // 霓虹强度 (1-10)
'cyberpunk_disable_effects'  // 禁用特效

// Portfolio 项目
'cyberpunk_project_url'      // 项目链接
'cyberpunk_project_client'   // 客户名称
'cyberpunk_project_tech'     // 技术栈 (array)
```

---

## 🔧 常用 SQL 查询

### 获取文章统计

```sql
-- 单篇文章统计
SELECT
    p.ID,
    p.post_title,
    CAST(COALESCE(pm.meta_value, 0) AS UNSIGNED) as views,
    (SELECT COUNT(*)
     FROM wp_cyberpunk_user_actions
     WHERE post_id = p.ID AND action_type = 'like') as likes,
    (SELECT COUNT(*)
     FROM wp_cyberpunk_user_actions
     WHERE post_id = p.ID AND action_type = 'bookmark') as bookmarks
FROM wp_posts p
LEFT JOIN wp_postmeta pm
    ON p.ID = pm.post_id
    AND pm.meta_key = 'cyberpunk_views_count'
WHERE p.ID = 123;

-- 热门文章 TOP 10
SELECT
    p.ID,
    p.post_title,
    CAST(COALESCE(pm.meta_value, 0) AS UNSIGNED) as views
FROM wp_posts p
LEFT JOIN wp_postmeta pm
    ON p.ID = pm.post_id
    AND pm.meta_key = 'cyberpunk_views_count'
WHERE p.post_type = 'post'
AND p.post_status = 'publish'
ORDER BY views DESC
LIMIT 10;
```

### 用户查询

```sql
-- 用户活跃度统计
SELECT
    u.ID,
    u.user_login,
    (SELECT COUNT(*)
     FROM wp_cyberpunk_user_actions
     WHERE user_id = u.ID AND action_type = 'like') as total_likes,
    (SELECT COUNT(*)
     FROM wp_cyberpunk_user_actions
     WHERE user_id = u.ID AND action_type = 'bookmark') as total_bookmarks,
    (SELECT COUNT(*)
     FROM wp_cyberpunk_visits
     WHERE user_id = u.ID) as total_visits
FROM wp_users u
WHERE u.ID = 1;

-- 用户最近访问记录
SELECT
    p.post_title,
    cv.visit_time
FROM wp_cyberpunk_visits cv
INNER JOIN wp_posts p ON cv.post_id = p.ID
WHERE cv.user_id = 1
ORDER BY cv.visit_time DESC
LIMIT 20;
```

### 数据清理

```sql
-- 删除 90 天前的访问日志
DELETE FROM wp_cyberpunk_visits
WHERE visit_time < DATE_SUB(NOW(), INTERVAL 90 DAY);

-- 删除无效的用户动作记录 (文章已删除)
DELETE FROM wp_cyberpunk_user_actions
WHERE post_id NOT IN (SELECT ID FROM wp_posts);

-- 优化表
OPTIMIZE TABLE wp_cyberpunk_visits;
OPTIMIZE TABLE wp_cyberpunk_user_actions;
OPTIMIZE TABLE wp_cyberpunk_shares;
```

---

## 💻 PHP 函数速查

### 文章统计

```php
// 获取浏览数
function cyberpunk_get_views($post_id) {
    $views = get_post_meta($post_id, 'cyberpunk_views_count', true);
    return $views ? $views : 0;
}

// 更新浏览数
function cyberpunk_update_views($post_id) {
    $views = cyberpunk_get_views($post_id);
    update_post_meta($post_id, 'cyberpunk_views_count', $views + 1);
}

// 获取点赞数
function cyberpunk_get_likes($post_id) {
    global $wpdb;
    return $wpdb->get_var($wpdb->prepare(
        "SELECT COUNT(*) FROM {$wpdb->prefix}cyberpunk_user_actions
        WHERE post_id = %d AND action_type = 'like'",
        $post_id
    ));
}

// 获取总分享数
function cyberpunk_get_shares($post_id) {
    global $wpdb;
    return $wpdb->get_var($wpdb->prepare(
        "SELECT SUM(share_count) FROM {$wpdb->prefix}cyberpunk_shares
        WHERE post_id = %d",
        $post_id
    ));
}
```

### 用户互动

```php
// 点赞文章
function cyberpunk_like_post($post_id, $user_id = null) {
    global $wpdb;

    if (null === $user_id) {
        $user_id = get_current_user_id();
    }

    $table = $wpdb->prefix . 'cyberpunk_user_actions';

    // 检查是否已点赞
    $exists = $wpdb->get_var($wpdb->prepare(
        "SELECT COUNT(*) FROM {$table}
        WHERE user_id = %d AND post_id = %d AND action_type = 'like'",
        $user_id,
        $post_id
    ));

    if ($exists) {
        // 取消点赞
        $wpdb->delete(
            $table,
            array(
                'user_id' => $user_id,
                'post_id' => $post_id,
                'action_type' => 'like',
            ),
            array('%d', '%d', '%s')
        );
        return false;
    } else {
        // 添加点赞
        $wpdb->insert(
            $table,
            array(
                'user_id' => $user_id,
                'post_id' => $post_id,
                'action_type' => 'like',
                'ip_address' => $_SERVER['REMOTE_ADDR'],
            ),
            array('%d', '%d', '%s', '%s')
        );
        return true;
    }
}

// 收藏文章
function cyberpunk_bookmark_post($post_id, $user_id = null) {
    global $wpdb;

    if (null === $user_id) {
        $user_id = get_current_user_id();
    }

    $table = $wpdb->prefix . 'cyberpunk_user_actions';

    $exists = $wpdb->get_var($wpdb->prepare(
        "SELECT COUNT(*) FROM {$table}
        WHERE user_id = %d AND post_id = %d AND action_type = 'bookmark'",
        $user_id,
        $post_id
    ));

    if ($exists) {
        $wpdb->delete(
            $table,
            array(
                'user_id' => $user_id,
                'post_id' => $post_id,
                'action_type' => 'bookmark',
            ),
            array('%d', '%d', '%s')
        );
        return false;
    } else {
        $wpdb->insert(
            $table,
            array(
                'user_id' => $user_id,
                'post_id' => $post_id,
                'action_type' => 'bookmark',
                'ip_address' => $_SERVER['REMOTE_ADDR'],
            ),
            array('%d', '%d', '%s', '%s')
        );
        return true;
    }
}

// 获取用户收藏列表
function cyberpunk_get_user_bookmarks($user_id = null) {
    global $wpdb;

    if (null === $user_id) {
        $user_id = get_current_user_id();
    }

    return $wpdb->get_col($wpdb->prepare(
        "SELECT post_id FROM {$wpdb->prefix}cyberpunk_user_actions
        WHERE user_id = %d AND action_type = 'bookmark'
        ORDER BY action_time DESC",
        $user_id
    ));
}
```

### 缓存函数

```php
// 带缓存的热门文章
function cyberpunk_get_popular_posts($limit = 10) {
    $cache_key = "cyberpunk_popular_{$limit}";

    $cached = wp_cache_get($cache_key, 'cyberpunk');
    if (false !== $cached) {
        return $cached;
    }

    global $wpdb;

    $results = $wpdb->get_results($wpdb->prepare("
        SELECT
            p.ID,
            p.post_title,
            CAST(COALESCE(pm.meta_value, 0) AS UNSIGNED) as views
        FROM {$wpdb->posts} p
        LEFT JOIN {$wpdb->postmeta} pm
            ON p.ID = pm.post_id
            AND pm.meta_key = 'cyberpunk_views_count'
        WHERE p.post_type = 'post'
        AND p.post_status = 'publish'
        ORDER BY views DESC, p.post_date DESC
        LIMIT %d
    ", $limit));

    wp_cache_set($cache_key, $results, 'cyberpunk', HOUR_IN_SECONDS);

    return $results;
}

// 清除缓存
function cyberpunk_clear_cache($post_id) {
    wp_cache_delete('cyberpunk_popular_10', 'cyberpunk');
    wp_cache_delete('cyberpunk_popular_20', 'cyberpunk');
    delete_transient('cyberpunk_site_stats');
}

// 文章更新时清除缓存
add_action('save_post', 'cyberpunk_clear_cache');
```

---

## 🗄️ 存储过程

### 调用存储过程

```sql
-- 清理旧访问日志 (保留 90 天)
CALL cyberpunk_clean_old_visits(90);

-- 更新文章浏览数
CALL cyberpunk_increment_views(123);

-- 获取热门文章
CALL cyberpunk_get_popular_posts(10, 'post');
```

---

## 📊 数据库初始化

### 快速初始化

```bash
# 1. 替换表前缀
sed 's/@prefix/wp_/g' init-cyberpunk-db.sql > init-final.sql

# 2. 导入数据库
mysql -u username -p database_name < init-final.sql

# 3. 验证安装
mysql -u username -p database_name -e "
    SELECT
        TABLE_NAME,
        TABLE_ROWS,
        ROUND((data_length + index_length) / 1024 / 1024, 2) AS size_mb
    FROM information_schema.TABLES
    WHERE TABLE_SCHEMA = 'database_name'
    AND TABLE_NAME LIKE 'wp_cyberpunk%';
"
```

---

## ⚡ 性能优化快速提示

### 查询优化

```php
// ❌ 慢
$posts = get_posts(array('posts_per_page' => -1));

// ✅ 快
$posts = get_posts(array('posts_per_page' => 100));

// ❌ 慢
foreach ($post_ids as $id) {
    $meta = get_post_meta($id, 'key', true);
}

// ✅ 快
$meta_values = array();
foreach ($post_ids as $id) {
    $meta_values[$id] = wp_cache_get("meta_{$id}", 'cyberpunk');
}
```

### 索引检查

```sql
-- 分析查询
EXPLAIN SELECT * FROM wp_cyberpunk_visits
WHERE post_id = 123 ORDER BY visit_time DESC;

-- 检查是否使用索引
-- type 应为 'ref', 'range', 或 'index' (不是 'ALL')
-- key 应显示实际使用的索引
-- rows 应该越小越好
```

---

## 🔍 故障排查

### 常见问题

**问题**: 查询慢
```sql
-- 检查慢查询日志
SHOW VARIABLES LIKE 'slow_query_log%';

-- 启用慢查询日志
SET GLOBAL slow_query_log = 'ON';
SET GLOBAL long_query_time = 1;
```

**问题**: 索引未使用
```sql
-- 分析表
ANALYZE TABLE wp_cyberpunk_visits;

-- 检查索引
SHOW INDEX FROM wp_cyberpunk_visits;
```

**问题**: 表锁死
```sql
-- 查看锁状态
SHOW OPEN TABLES WHERE In_use > 0;

-- 查看进程
SHOW FULL PROCESSLIST;

-- 终止进程
KILL 123;
```

---

## 📝 维护命令

### 定期维护脚本

```bash
#!/bin/bash
# cyberpunk-db-maintenance.sh

DB_NAME="your_database"
DB_USER="your_username"
DB_PASS="your_password"

# 备份数据库
mysqldump -u $DB_USER -p$DB_PASS $DB_NAME > backup_$(date +%Y%m%d).sql

# 清理旧访问日志 (90天)
mysql -u $DB_USER -p$DB_PASS $DB_NAME -e "
    DELETE FROM wp_cyberpunk_visits
    WHERE visit_time < DATE_SUB(NOW(), INTERVAL 90 DAY);
"

# 优化表
mysql -u $DB_USER -p$DB_PASS $DB_NAME -e "
    OPTIMIZE TABLE wp_cyberpunk_visits;
    OPTIMIZE TABLE wp_cyberpunk_user_actions;
    OPTIMIZE TABLE wp_cyberpunk_shares;
"

echo "Maintenance completed: $(date)"
```

---

## 🔗 相关资源

- **完整架构文档**: `README.md`
- **SQL 初始化脚本**: `init-cyberpunk-db.sql`
- **ER 图文档**: `ER-DIAGRAM.md`
- **性能优化指南**: `PERFORMANCE-OPTIMIZATION.md`

---

**版本**: 1.0.0
**最后更新**: 2026-02-28
