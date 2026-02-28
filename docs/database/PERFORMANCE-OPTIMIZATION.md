# ⚡ WordPress Cyberpunk Theme - 数据库性能优化指南

> **首席数据库架构师性能优化方案**
> **版本**: 1.0.0
> **日期**: 2026-02-28
> **数据库**: MySQL 5.7+ / MariaDB 10.2+

---

## 目录

1. [查询优化](#查询优化)
2. [索引优化](#索引优化)
3. [缓存策略](#缓存策略)
4. [表优化](#表优化)
5. [服务器优化](#服务器优化)
6. [监控与诊断](#监控与诊断)
7. [最佳实践](#最佳实践)

---

## 查询优化

### 1. 避免 SELECT *

```php
// ❌ 慢查询
$results = $wpdb->get_results("SELECT * FROM {$wpdb->prefix}cyberpunk_visits");

// ✅ 优化查询
$results = $wpdb->get_results("
    SELECT visit_id, post_id, visit_time
    FROM {$wpdb->prefix}cyberpunk_visits
    WHERE post_id = {$post_id}
");

// ✅ 使用 WordPress 函数
$visits = get_posts(array(
    'fields' => 'ids', // 只获取 ID
    'posts_per_page' => 10,
));
```

### 2. 使用 LIMIT 分页

```php
// ❌ 可能返回大量数据
$results = $wpdb->get_results("
    SELECT * FROM {$wpdb->prefix}cyberpunk_visits
");

// ✅ 分页查询
$page = 1;
$per_page = 50;
$offset = ($page - 1) * $per_page;

$results = $wpdb->get_results($wpdb->prepare("
    SELECT * FROM {$wpdb->prefix}cyberpunk_visits
    ORDER BY visit_time DESC
    LIMIT %d OFFSET %d
", $per_page, $offset));
```

### 3. 优化 JOIN 查询

```php
// ❌ 多次查询
foreach ($post_ids as $post_id) {
    $views = get_post_meta($post_id, 'cyberpunk_views_count', true);
    $likes = $wpdb->get_var($wpdb->prepare(
        "SELECT COUNT(*) FROM {$wpdb->prefix}cyberpunk_user_actions
        WHERE post_id = %d AND action_type = 'like'",
        $post_id
    ));
}

// ✅ 单次 JOIN 查询
$results = $wpdb->get_results("
    SELECT
        p.ID,
        CAST(COALESCE(pm.meta_value, 0) AS UNSIGNED) as views,
        COUNT(cua.action_id) as likes
    FROM {$wpdb->posts} p
    LEFT JOIN {$wpdb->postmeta} pm
        ON p.ID = pm.post_id
        AND pm.meta_key = 'cyberpunk_views_count'
    LEFT JOIN {$wpdb->prefix}cyberpunk_user_actions cua
        ON p.ID = cua.post_id
        AND cua.action_type = 'like'
    WHERE p.ID IN (" . implode(',', $post_ids) . ")
    AND p.post_status = 'publish'
    GROUP BY p.ID
");
```

### 4. 使用 EXISTS 替代 IN (子查询)

```php
// ❌ 慢查询 (IN 子查询)
$results = $wpdb->get_results("
    SELECT * FROM {$wpdb->posts}
    WHERE ID IN (
        SELECT post_id FROM {$wpdb->prefix}cyberpunk_visits
        WHERE visit_time > '2026-01-01'
    )
");

// ✅ 优化查询 (EXISTS)
$results = $wpdb->get_results("
    SELECT p.* FROM {$wpdb->posts} p
    WHERE EXISTS (
        SELECT 1 FROM {$wpdb->prefix}cyberpunk_visits cv
        WHERE cv.post_id = p.ID
        AND cv.visit_time > '2026-01-01'
    )
");
```

### 5. 避免 ORDER BY RAND()

```php
// ❌ 极慢 (全表扫描 + 排序)
$results = $wpdb->get_results("
    SELECT * FROM {$wpdb->posts}
    ORDER BY RAND()
    LIMIT 10
");

// ✅ 优化方案 1: 使用 PHP 随机
$post_ids = get_posts(array(
    'fields' => 'ids',
    'posts_per_page' => 100,
));
shuffle($post_ids);
$random_ids = array_slice($post_ids, 0, 10);

// ✅ 优化方案 2: 使用 RAND() + 索引
$results = $wpdb->get_results("
    SELECT p.* FROM {$wpdb->posts} p
    INNER JOIN (
        SELECT ID FROM {$wpdb->posts}
        WHERE post_type = 'post'
        AND post_status = 'publish'
        ORDER BY RAND()
        LIMIT 10
    ) AS random_ids ON p.ID = random_ids.ID
");
```

---

## 索引优化

### 1. 分析查询使用 EXPLAIN

```php
// 分析查询执行计划
$results = $wpdb->get_results("
    EXPLAIN SELECT *
    FROM {$wpdb->prefix}cyberpunk_visits
    WHERE post_id = 123
    ORDER BY visit_time DESC
    LIMIT 10
");

// 输出结果分析
print_r($results);
// 关注以下列:
// - type: 应为 'ref', 'range', 'index', 或 'const' (避免 'ALL')
// - possible_keys: 可能使用的索引
// - key: 实际使用的索引
// - rows: 扫描的行数 (越少越好)
// - Extra: 'Using filesort' 或 'Using temporary' 表示需要优化
```

### 2. 添加缺失的索引

```sql
-- 查找未使用索引的查询
-- 使用 Query Monitor 或 MySQL Slow Query Log

-- 添加常用查询索引
ALTER TABLE wp_cyberpunk_visits
ADD INDEX idx_post_time (post_id, visit_time);

-- 添加覆盖索引 (Covering Index)
ALTER TABLE wp_cyberpunk_user_actions
ADD INDEX idx_user_post_action (user_id, post_id, action_type, action_time);

-- 添加全文索引 (用于搜索)
ALTER TABLE wp_posts
ADD FULLTEXT INDEX idx_post_content (post_title, post_content)
WITH PARSER ngram;
```

### 3. 删除冗余索引

```sql
-- 查找重复或冗余的索引
SELECT
    TABLE_NAME,
    INDEX_NAME,
    COLUMN_NAME,
    SEQ_IN_INDEX
FROM information_schema.STATISTICS
WHERE TABLE_SCHEMA = 'your_database'
AND TABLE_NAME LIKE 'cyberpunk%'
ORDER BY TABLE_NAME, INDEX_NAME, SEQ_IN_INDEX;

-- 删除重复索引
ALTER TABLE wp_cyberpunk_visits
DROP INDEX idx_duplicate_index;
```

### 4. 索引维护

```sql
-- 分析表 (更新索引统计信息)
ANALYZE TABLE wp_cyberpunk_visits;
ANALYZE TABLE wp_cyberpunk_user_actions;
ANALYZE TABLE wp_cyberpunk_shares;

-- 优化表 (重建索引、回收空间)
OPTIMIZE TABLE wp_cyberpunk_visits;
OPTIMIZE TABLE wp_cyberpunk_user_actions;
OPTIMIZE TABLE wp_cyberpunk_shares;

-- 检查表完整性
CHECK TABLE wp_cyberpunk_visits;
CHECK TABLE wp_cyberpunk_user_actions;
CHECK TABLE wp_cyberpunk_shares;

-- 修复表 (如果发现问题)
REPAIR TABLE wp_cyberpunk_visits;
```

---

## 缓存策略

### 1. WordPress Object Cache

```php
/**
 * 使用 Object Cache API
 */
function cyberpunk_get_popular_posts($limit = 10) {
    $cache_key = 'cyberpunk_popular_posts_' . $limit;

    // 尝试从缓存获取
    $cached = wp_cache_get($cache_key, 'cyberpunk');
    if (false !== $cached) {
        return $cached;
    }

    // 查询数据
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

    // 存入缓存 (1小时)
    wp_cache_set($cache_key, $results, 'cyberpunk', HOUR_IN_SECONDS);

    return $results;
}
```

### 2. Transients API

```php
/**
 * 使用 Transients 缓存 (持久化)
 */
function cyberpunk_get_site_stats() {
    $transient_key = 'cyberpunk_site_stats';

    // 尝试获取缓存数据
    $stats = get_transient($transient_key);
    if (false !== $stats) {
        return $stats;
    }

    // 生成统计数据
    $stats = array(
        'total_posts' => wp_count_posts()->publish,
        'total_views' => cyberpunk_get_total_views(),
        'total_likes' => cyberpunk_get_total_likes(),
        'active_users' => cyberpunk_get_active_users(),
    );

    // 缓存 12 小时
    set_transient($transient_key, $stats, 12 * HOUR_IN_SECONDS);

    return $stats;
}

// 文章更新时清除缓存
add_action('save_post', 'cyberpunk_clear_stats_cache');
function cyberpunk_clear_stats_cache($post_id) {
    delete_transient('cyberpunk_site_stats');
}
```

### 3. Redis/Memcached 对象缓存

```php
/**
 * 配置 Redis 对象缓存
 * 安装: https://wordpress.org/plugins/redis-cache/
 */

// wp-config.php 配置
define('WP_REDIS_HOST', '127.0.0.1');
define('WP_REDIS_PORT', 6379);
define('WP_REDIS_DATABASE', 0);
define('WP_REDIS_MAXTTL', 86400);

// 使用示例 (与 Object Cache API 相同)
$data = wp_cache_get('my_key');
if (false === $data) {
    $data = expensive_query();
    wp_cache_set('my_key', $data, 'cyberpunk', 3600);
}
```

### 4. 查询结果缓存

```php
/**
 * 缓存复杂查询结果
 */
function cyberpunk_get_user_reading_history($user_id, $limit = 20) {
    $cache_key = "cyberpunk_reading_history_{$user_id}_{$limit}";

    $cached = get_transient($cache_key);
    if (false !== $cached) {
        return $cached;
    }

    global $wpdb;

    $results = $wpdb->get_results($wpdb->prepare("
        SELECT DISTINCT
            p.ID,
            p.post_title,
            p.post_date,
            MAX(cv.visit_time) as last_visit
        FROM {$wpdb->prefix}cyberpunk_visits cv
        INNER JOIN {$wpdb->posts} p ON cv.post_id = p.ID
        WHERE cv.user_id = %d
        AND p.post_status = 'publish'
        GROUP BY p.ID
        ORDER BY last_visit DESC
        LIMIT %d
    ", $user_id, $limit));

    // 缓存 30 分钟
    set_transient($cache_key, $results, 30 * MINUTE_IN_SECONDS);

    return $results;
}
```

### 5. Fragment Caching (片段缓存)

```php
/**
 * 缓存页面片段
 */
function cyberpunk_cache_popular_posts_widget() {
    $cache_key = 'cyberpunk_widget_popular_posts';

    // 尝试从缓存获取
    $output = get_transient($cache_key);
    if (false !== $output) {
        echo $output;
        return;
    }

    // 开启输出缓冲
    ob_start();

    // 生成 widget 内容
    echo '<div class="popular-posts-widget">';
    $posts = cyberpunk_get_popular_posts(5);
    foreach ($posts as $post) {
        echo '<div class="post-item">';
        echo '<a href="' . get_permalink($post->ID) . '">';
        echo esc_html($post->post_title);
        echo '</a>';
        echo '<span class="views">' . $post->views . ' views</span>';
        echo '</div>';
    }
    echo '</div>';

    // 获取输出内容
    $output = ob_get_clean();

    // 缓存 1 小时
    set_transient($cache_key, $output, HOUR_IN_SECONDS);

    // 输出内容
    echo $output;
}

// 清除 widget 缓存
add_action('save_post', 'cyberpunk_clear_widget_cache');
function cyberpunk_clear_widget_cache() {
    delete_transient('cyberpunk_widget_popular_posts');
}
```

---

## 表优化

### 1. 选择合适的存储引擎

```sql
-- InnoDB (推荐)
-- 支持事务、外键、行级锁
-- 适合: 高并发、事务性操作

CREATE TABLE wp_cyberpunk_visits (
    -- ...
) ENGINE=InnoDB;

-- MyISAM (特定场景)
-- 表级锁、全文索引 (MySQL 5.5-)
-- 适合: 只读或写少读多的场景

CREATE TABLE wp_cyberpunk_archive (
    -- ...
) ENGINE=MyISAM;
```

### 2. 优化字段类型

```sql
-- ❌ 过大字段类型
ALTER TABLE wp_cyberpunk_visits
MODIFY COLUMN visit_id BIGINT UNSIGNED;

-- ✅ 合适字段类型
ALTER TABLE wp_cyberpunk_visits
MODIFY COLUMN visit_id MEDIUMINT UNSIGNED; -- 最多 1600 万条

-- ✅ 使用 ENUM 代替 VARCHAR
ALTER TABLE wp_cyberpunk_user_actions
MODIFY COLUMN action_type ENUM('like', 'bookmark', 'share');

-- ✅ 使用合适的日期类型
ALTER TABLE wp_cyberpunk_visits
MODIFY COLUMN visit_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP; -- 比 DATETIME 更小
```

### 3. 表分区 (Partitioning)

```sql
-- 按日期分区 (适用于访问日志表)
ALTER TABLE wp_cyberpunk_visits
PARTITION BY RANGE (YEAR(visit_time)) (
    PARTITION p2023 VALUES LESS THAN (2024),
    PARTITION p2024 VALUES LESS THAN (2025),
    PARTITION p2025 VALUES LESS THAN (2026),
    PARTITION p2026 VALUES LESS THAN (2027),
    PARTITION pmax VALUES LESS THAN MAXVALUE
);

-- 查询特定分区 (更快)
SELECT * FROM wp_cyberpunk_visits PARTITION (p2026)
WHERE visit_time >= '2026-01-01';

-- 删除旧分区 (快速删除数据)
ALTER TABLE wp_cyberpunk_visits DROP PARTITION p2023;
```

### 4. 定期清理数据

```php
/**
 * 定期清理访问日志 (保留 90 天)
 */
add_action('cyberpunk_daily_cleanup', 'cyberpunk_clean_old_visits');

function cyberpunk_clean_old_visits() {
    global $wpdb;

    $rows_deleted = $wpdb->query($wpdb->prepare("
        DELETE FROM {$wpdb->prefix}cyberpunk_visits
        WHERE visit_time < %s
    ", date('Y-m-d H:i:s', strtotime('-90 days'))));

    error_log("Deleted {$rows_deleted} old visit records");

    // 优化表
    $wpdb->query("OPTIMIZE TABLE {$wpdb->prefix}cyberpunk_visits");
}

// 定时任务
if (!wp_next_scheduled('cyberpunk_daily_cleanup')) {
    wp_schedule_event(time(), 'daily', 'cyberpunk_daily_cleanup');
}
```

---

## 服务器优化

### 1. MySQL 配置优化 (my.cnf)

```ini
[mysqld]
# 连接设置
max_connections = 200
max_user_connections = 150

# 缓冲区设置
innodb_buffer_pool_size = 2G          # 70-80% 可用 RAM
innodb_log_file_size = 256M
innodb_log_buffer_size = 16M

# 查询缓存 (MySQL 5.7-)
query_cache_size = 128M
query_cache_limit = 2M

# 临时表
tmp_table_size = 256M
max_heap_table_size = 256M

# 慢查询日志
slow_query_log = 1
slow_query_log_file = /var/log/mysql/slow-query.log
long_query_time = 2

# InnoDB 设置
innodb_file_per_table = 1
innodb_flush_method = O_DIRECT
innodb_flush_log_at_trx_commit = 2
```

### 2. 启用查询缓存 (MySQL 5.7 及以下)

```sql
-- 检查查询缓存状态
SHOW VARIABLES LIKE 'query_cache%';

-- 启用查询缓存 (需要 super 权限)
SET GLOBAL query_cache_type = ON;
SET GLOBAL query_cache_size = 134217728; -- 128MB

-- 查询缓存命中率
SHOW STATUS LIKE 'Qcache%';
```

### 3. 配置连接池

```php
/**
 * 使用持久连接 (谨慎使用)
 * wp-config.php
 */
define('WP_USE_EXT_MYSQL', true); // 使用 mysql_connect 而非 mysqli

/**
 * 或使用 mysqli 持久连接
 */
$wpdb = new wpdb(DB_USER, DB_PASSWORD, DB_NAME, DB_HOST, new mysqli_driver_persistent());
```

---

## 监控与诊断

### 1. 启用慢查询日志

```sql
-- 启用慢查询日志
SET GLOBAL slow_query_log = 'ON';
SET GLOBAL long_query_time = 2; -- 2 秒
SET GLOBAL log_queries_not_using_indexes = 'ON';

-- 查看慢查询日志
-- Linux: tail -f /var/log/mysql/slow-query.log
-- Windows: type C:\xampp\mysql\data\slow-query.log
```

### 2. 使用 Query Monitor 插件

```php
/**
 * Query Monitor Plugin
 * https://wordpress.org/plugins/query-monitor/
 *
 * 功能:
 * - 显示所有数据库查询
 * - 识别慢查询
 * - 显示查询错误
 * - 分析重复查询
 * - 显示对象缓存使用情况
 */
```

### 3. 自定义性能监控

```php
/**
 * 记录慢查询
 */
add_action('wp_loaded', function() {
    if (!current_user_can('manage_options')) {
        return;
    }

    add_filter('query', function($query) {
        global $wpdb;

        $start = microtime(true);
        $result = $wpdb->query($query);
        $time = microtime(true) - $start;

        // 记录超过 100ms 的查询
        if ($time > 0.1) {
            error_log(sprintf(
                "[CYBERPUNK] Slow Query (%.4fs): %s",
                $time,
                $query
            ));
        }

        return $result;
    });
});
```

### 4. 数据库健康检查

```php
/**
 * 数据库健康检查报告
 */
function cyberpunk_db_health_report() {
    global $wpdb;

    $report = array();

    // 检查表大小
    $tables = array(
        $wpdb->posts,
        $wpdb->postmeta,
        $wpdb->prefix . 'cyberpunk_visits',
        $wpdb->prefix . 'cyberpunk_user_actions',
        $wpdb->prefix . 'cyberpunk_shares',
    );

    foreach ($tables as $table) {
        $size = $wpdb->get_row($wpdb->prepare("
            SELECT
                ROUND((data_length + index_length) / 1024 / 1024, 2) AS size_mb,
                table_rows AS rows,
                ROUND(data_length / 1024 / 1024, 2) AS data_mb,
                ROUND(index_length / 1024 / 1024, 2) AS index_mb
            FROM information_schema.TABLES
            WHERE table_schema = DATABASE()
            AND table_name = %s
        ", $table));

        $report[$table] = $size;
    }

    // 检查未使用的索引
    // (需要 MySQL 5.7+ sys schema)

    // 检查索引碎片率
    foreach ($tables as $table) {
        $fragmentation = $wpdb->get_var($wpdb->prepare("
            SELECT ROUND(
                (data_free / (data_length + index_length)) * 100,
                2
            )
            FROM information_schema.TABLES
            WHERE table_schema = DATABASE()
            AND table_name = %s
        ", $table));

        $report[$table]->fragmentation = $fragmentation . '%';
    }

    return $report;
}

// 显示报告 (管理员可见)
add_action('wp_dashboard_setup', function() {
    wp_add_dashboard_widget(
        'cyberpunk_db_health',
        'Database Health Report',
        function() {
            $report = cyberpunk_db_health_report();
            echo '<pre>' . print_r($report, true) . '</pre>';
        }
    );
});
```

---

## 最佳实践

### 1. 预处理语句

```php
// ❌ 不安全 (SQL 注入风险)
$post_id = $_GET['post_id'];
$results = $wpdb->get_results("SELECT * FROM {$wpdb->posts} WHERE ID = {$post_id}");

// ✅ 安全 (使用 prepare)
$post_id = intval($_GET['post_id']);
$results = $wpdb->get_results($wpdb->prepare(
    "SELECT * FROM {$wpdb->posts} WHERE ID = %d",
    $post_id
));
```

### 2. 批量操作

```php
// ❌ 循环插入 (慢)
foreach ($items as $item) {
    $wpdb->insert(
        $wpdb->prefix . 'cyberpunk_visits',
        $item
    );
}

// ✅ 批量插入 (快)
$values = array();
$placeholders = array();
foreach ($items as $item) {
    $values[] = $item['post_id'];
    $values[] = $item['user_id'];
    $values[] = $item['ip_address'];
    $placeholders[] = '(%d, %d, %s)';
}

$query = sprintf(
    "INSERT INTO {$wpdb->prefix}cyberpunk_visits (post_id, user_id, ip_address) VALUES %s",
    implode(', ', $placeholders)
);

$wpdb->query($wpdb->prepare($query, $values));
```

### 3. 使用 WordPress Cache API

```php
// ❌ 每次都查询
function get_post_views($post_id) {
    return get_post_meta($post_id, 'cyberpunk_views_count', true);
}

// ✅ 使用缓存
function get_post_views_cached($post_id) {
    $cache_key = "cyberpunk_views_{$post_id}";
    $views = wp_cache_get($cache_key, 'cyberpunk');

    if (false === $views) {
        $views = get_post_meta($post_id, 'cyberpunk_views_count', true);
        wp_cache_set($cache_key, $views, 'cyberpunk', 3600);
    }

    return $views;
}
```

### 4. 避免过度使用 PostMeta

```php
// ❌ 为每个点赞创建一条 postmeta 记录
for ($i = 0; $i < 100; $i++) {
    add_post_meta($post_id, 'user_like', $user_id);
}

// ✅ 使用自定义表
$wpdb->insert(
    $wpdb->prefix . 'cyberpunk_user_actions',
    array(
        'user_id' => $user_id,
        'post_id' => $post_id,
        'action_type' => 'like',
    )
);

// ✅ 或使用 JSON 存储 (简单场景)
$likes = get_post_meta($post_id, 'cyberpunk_likes', true);
$likes[] = $user_id;
update_post_meta($post_id, 'cyberpunk_likes', array_unique($likes));
```

### 5. 定期维护

```php
/**
 * 定期数据库维护任务
 */
add_action('cyberpunk_weekly_maintenance', 'cyberpunk_db_maintenance');

function cyberpunk_db_maintenance() {
    global $wpdb;

    // 1. 清理旧访问日志 (90天)
    $wpdb->query($wpdb->prepare(
        "DELETE FROM {$wpdb->prefix}cyberpunk_visits
        WHERE visit_time < %s",
        date('Y-m-d H:i:s', strtotime('-90 days'))
    ));

    // 2. 清理 transients 过期数据
    $wpdb->query("
        DELETE FROM {$wpdb->options}
        WHERE option_name LIKE '_transient_%'
        AND option_value < UNIX_TIMESTAMP()
    ");

    // 3. 优化表
    $tables = array(
        $wpdb->posts,
        $wpdb->postmeta,
        $wpdb->options,
        $wpdb->prefix . 'cyberpunk_visits',
        $wpdb->prefix . 'cyberpunk_user_actions',
        $wpdb->prefix . 'cyberpunk_shares',
    );

    foreach ($tables as $table) {
        $wpdb->query("OPTIMIZE TABLE {$table}");
    }

    // 4. 分析表 (更新索引统计)
    foreach ($tables as $table) {
        $wpdb->query("ANALYZE TABLE {$table}");
    }

    // 5. 记录日志
    error_log('[CYBERPUNK] Weekly database maintenance completed');
}

// 定时任务 (每周日凌晨 2 点)
if (!wp_next_scheduled('cyberpunk_weekly_maintenance')) {
    wp_schedule_event(
        strtotime('next Sunday 2:00am'),
        'weekly',
        'cyberpunk_weekly_maintenance'
    );
}
```

---

## 性能基准

### 预期性能指标

```yaml
查询响应时间:
  简单查询 (单表): < 10ms
  复杂查询 (JOIN): < 100ms
  报表查询 (聚合): < 500ms

索引使用率:
  所有查询应使用索引: > 95%
  覆盖索引查询: > 80%

缓存命中率:
  Object Cache: > 90%
  Query Cache: > 85%

数据库服务器:
  CPU 使用率: < 50%
  内存使用: < 70% innodb_buffer_pool
  磁盘 I/O: < 30%
```

### 性能测试脚本

```php
/**
 * 数据库性能测试
 */
function cyberpunk_benchmark_db() {
    if (!current_user_can('manage_options')) {
        return;
    }

    global $wpdb;

    $results = array();

    // 测试 1: 简单查询
    $start = microtime(true);
    $wpdb->get_var("SELECT COUNT(*) FROM {$wpdb->posts}");
    $results['simple_query'] = round((microtime(true) - $start) * 1000, 2) . 'ms';

    // 测试 2: JOIN 查询
    $start = microtime(true);
    $wpdb->get_results("
        SELECT p.ID, pm.meta_value
        FROM {$wpdb->posts} p
        LEFT JOIN {$wpdb->postmeta} pm ON p.ID = pm.post_id
        LIMIT 100
    ");
    $results['join_query'] = round((microtime(true) - $start) * 1000, 2) . 'ms';

    // 测试 3: 复杂聚合查询
    $start = microtime(true);
    $wpdb->get_results("
        SELECT
            p.ID,
            COUNT(cv.visit_id) as visits
        FROM {$wpdb->posts} p
        LEFT JOIN {$wpdb->prefix}cyberpunk_visits cv
            ON p.ID = cv.post_id
        WHERE p.post_type = 'post'
        AND p.post_status = 'publish'
        GROUP BY p.ID
        LIMIT 50
    ");
    $results['aggregate_query'] = round((microtime(true) - $start) * 1000, 2) . 'ms';

    // 显示结果
    echo '<div class="notice notice-info">';
    echo '<p><strong>Database Performance Benchmark:</strong></p>';
    echo '<ul>';
    foreach ($results as $test => $time) {
        echo "<li>{$test}: {$time}</li>";
    }
    echo '</ul>';
    echo '</div>';
}

add_action('admin_notices', 'cyberpunk_benchmark_db');
```

---

## 总结

本性能优化指南涵盖了 WordPress Cyberpunk Theme 数据库的完整优化方案：

### 核心优化技术
- ✅ **查询优化** - SELECT 优化、JOIN 优化、分页
- ✅ **索引优化** - 分析查询、添加索引、删除冗余
- ✅ **缓存策略** - Object Cache、Transients、Redis
- ✅ **表优化** - 存储引擎、字段类型、分区
- ✅ **服务器优化** - MySQL 配置、连接池
- ✅ **监控诊断** - 慢查询日志、健康检查

### 预期性能提升
- **查询速度**: 提升 50-80%
- **并发能力**: 提升 2-3 倍
- **数据库负载**: 降低 40-60%

---

**版本**: 1.0.0
**日期**: 2026-02-28
**作者**: Database Architect
