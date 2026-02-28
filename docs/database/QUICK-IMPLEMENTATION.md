# 🚀 WordPress Cyberpunk Theme - Phase 2 快速实施指南

> **数据库优化快速启动**
> **预计时间**: 2-3天
> **难度**: ⭐⭐⭐ (中等)

---

## 📋 实施清单

### Day 1: 数据库初始化 (4小时)

- [ ] **Step 1.1**: 备份当前数据库 (15分钟)
- [ ] **Step 1.2**: 执行SQL脚本创建新表 (30分钟)
- [ ] **Step 1.3**: 验证表创建成功 (15分钟)
- [ ] **Step 1.4**: 数据迁移测试 (2小时)
- [ ] **Step 1.5**: 验证数据一致性 (1小时)

### Day 2: 代码重构 (6小时)

- [ ] **Step 2.1**: 创建数据访问层类 (2小时)
- [ ] **Step 2.2**: 重构AJAX处理器 (2小时)
- [ ] **Step 2.3**: 更新REST API (1小时)
- [ ] **Step 2.4**: 单元测试 (1小时)

### Day 3: 测试与部署 (4小时)

- [ ] **Step 3.1**: 功能测试 (2小时)
- [ ] **Step 3.2**: 性能测试 (1小时)
- [ ] **Step 3.3**: 部署到生产环境 (1小时)

---

## 🔧 Step-by-Step 指南

### Step 1: 数据库初始化

#### 1.1 备份当前数据库

```bash
# 使用 wp-cli 备份
wp db export backup_before_phase2_$(date +%Y%m%d_%H%M%S).sql

# 或使用 mysqldump
mysqldump -u username -p database_name > backup_$(date +%Y%m%d).sql
```

#### 1.2 执行SQL脚本

```bash
# 方法 1: 使用 wp-cli
wp db query < docs/database/phase-2-optimization.sql

# 方法 2: 使用 MySQL 命令行
mysql -u username -p database_name < docs/database/phase-2-optimization.sql

# 方法 3: 使用 phpMyAdmin
# 在 phpMyAdmin 中导入 SQL 文件
```

**重要**: 在执行前,请根据实际表前缀修改SQL中的 `@prefix` 变量:

```sql
-- 如果你的表前缀是 wp_,无需修改
-- 如果是其他前缀,如 wp_test_,修改为:
SET @prefix = 'wp_test_';
```

#### 1.3 验证表创建

```sql
-- 登录MySQL
mysql -u username -p database_name

-- 执行验证查询
SHOW TABLES LIKE 'wp_cyberpunk%';

-- 预期输出:
-- wp_cyberpunk_user_actions
-- wp_cyberpunk_visits
-- wp_cyberpunk_reading_progress
-- wp_cyberpunk_shares
```

#### 1.4 数据迁移验证

```sql
-- 检查迁移的数据
SELECT
    'Total User Actions' as Info,
    COUNT(*) as Count
FROM wp_cyberpunk_user_actions;

-- 预期: 应该看到现有的点赞和书签数据
```

---

### Step 2: 代码重构

#### 2.1 创建数据访问层

创建新文件: `/inc/database/class-cyberpunk-data-layer.php`

```php
<?php
/**
 * Cyberpunk Theme - Data Access Layer
 * 数据访问层 - 优先使用自定义表,降级到PostMeta
 */

if (!defined('ABSPATH')) {
    exit;
}

class Cyberpunk_Data_Layer {

    /**
     * 获取文章点赞数
     */
    public static function get_like_count($post_id) {
        global $wpdb;

        // 优先从自定义表查询
        $count = $wpdb->get_var($wpdb->prepare(
            "SELECT COUNT(*) FROM {$wpdb->prefix}cyberpunk_user_actions
            WHERE post_id = %d AND action_type = 'like'",
            $post_id
        ));

        if ($count !== false && $count !== null) {
            return (int) $count;
        }

        // 降级到PostMeta
        $count = get_post_meta($post_id, '_cyberpunk_like_count', true);
        return $count ? (int) $count : 0;
    }

    /**
     * 切换点赞状态
     */
    public static function toggle_like($post_id, $user_id = 0) {
        global $wpdb;

        if (empty($user_id)) {
            $user_id = get_current_user_id();
        }

        $table = $wpdb->prefix . 'cyberpunk_user_actions';
        $is_liked = self::is_liked($post_id, $user_id);

        if ($is_liked) {
            // 取消点赞
            $wpdb->delete(
                $table,
                array(
                    'user_id' => $user_id,
                    'post_id' => $post_id,
                    'action_type' => 'like'
                )
            );
            $action = 'unliked';
        } else {
            // 添加点赞
            $wpdb->insert(
                $table,
                array(
                    'user_id' => $user_id,
                    'post_id' => $post_id,
                    'action_type' => 'like',
                    'action_time' => current_time('mysql'),
                    'ip_address' => self::_get_ip()
                )
            );
            $action = 'liked';
        }

        // 同步PostMeta
        self::_sync_like_meta($post_id, $user_id, !$is_liked);

        return array(
            'action' => $action,
            'count' => self::get_like_count($post_id)
        );
    }

    /**
     * 检查是否已点赞
     */
    public static function is_liked($post_id, $user_id = 0) {
        global $wpdb;

        if (empty($user_id)) {
            $user_id = get_current_user_id();
        }

        $exists = $wpdb->get_var($wpdb->prepare(
            "SELECT COUNT(*) FROM {$wpdb->prefix}cyberpunk_user_actions
            WHERE user_id = %d AND post_id = %d AND action_type = 'like'",
            $user_id,
            $post_id
        ));

        return $exists > 0;
    }

    /**
     * 同步PostMeta (保持兼容性)
     */
    private static function _sync_like_meta($post_id, $user_id, $add = true) {
        // 同步点赞计数
        $count = self::get_like_count($post_id);
        update_post_meta($post_id, '_cyberpunk_like_count', $count);

        // 同步用户点赞列表
        $liked_posts = get_user_meta($user_id, '_cyberpunk_liked_posts', true);
        $liked_posts = $liked_posts ? explode(',', $liked_posts) : array();

        if ($add) {
            $liked_posts[] = $post_id;
        } else {
            $liked_posts = array_diff($liked_posts, array($post_id));
        }

        update_user_meta($user_id, '_cyberpunk_liked_posts', implode(',', array_unique($liked_posts)));
    }

    /**
     * 获取用户IP
     */
    private static function _get_ip() {
        $ip = '';

        if (!empty($_SERVER['HTTP_CLIENT_IP'])) {
            $ip = $_SERVER['HTTP_CLIENT_IP'];
        } elseif (!empty($_SERVER['HTTP_X_FORWARDED_FOR'])) {
            $ip = $_SERVER['HTTP_X_FORWARDED_FOR'];
        } else {
            $ip = $_SERVER['REMOTE_ADDR'];
        }

        return sanitize_text_field($ip);
    }
}
```

#### 2.2 更新 functions.php

在 `functions.php` 中添加:

```php
// 加载数据访问层
require_once get_template_directory() . '/inc/database/class-cyberpunk-data-layer.php';
```

#### 2.3 重构 AJAX 处理器

修改 `inc/ajax-handlers.php` 中的点赞函数:

```php
/**
 * Handle Post Like/Unlike (使用新数据层)
 */
function cyberpunk_ajax_like_post() {

    // Verify nonce
    if (!cyberpunk_verify_ajax_nonce()) {
        return;
    }

    // Get post ID
    $post_id = isset($_POST['post_id']) ? intval($_POST['post_id']) : 0;

    if (!$post_id || !post_exists($post_id)) {
        cyberpunk_ajax_response(false, __('Invalid post ID.', 'cyberpunk'));
        return;
    }

    // 使用新的数据访问层
    $result = Cyberpunk_Data_Layer::toggle_like($post_id);

    // Send response
    cyberpunk_ajax_response(true, $result['action'] === 'liked' ? __('Post liked', 'cyberpunk') : __('Post unliked', 'cyberpunk'), array(
        'post_id' => $post_id,
        'like_count' => $result['count'],
        'action' => $result['action'],
        'like_text' => $result['count'] === 1 ? __('1 Like', 'cyberpunk') : sprintf(__('%d Likes', 'cyberpunk'), $result['count']),
    ));
}
```

---

### Step 3: 测试与验证

#### 3.1 功能测试

创建测试文件: `/test-database-optimization.php`

```php
<?php
/**
 * 数据库优化功能测试
 */

// 加载WordPress
require_once __DIR__ . '/wp-load.php';

echo "=== Cyberpunk Theme Database Optimization Test ===\n\n";

// 测试 1: 点赞功能
echo "Test 1: Toggle Like\n";
$post_id = 1; // 替换为实际的文章ID
$user_id = 1; // 替换为实际的用户ID

$result = Cyberpunk_Data_Layer::toggle_like($post_id, $user_id);
echo "  Result: " . print_r($result, true) . "\n";

// 验证点赞数
$count = Cyberpunk_Data_Layer::get_like_count($post_id);
echo "  Like Count: {$count}\n";

// 验证是否已点赞
$is_liked = Cyberpunk_Data_Layer::is_liked($post_id, $user_id);
echo "  Is Liked: " . ($is_liked ? 'Yes' : 'No') . "\n\n";

// 测试 2: 取消点赞
echo "Test 2: Unlike\n";
$result = Cyberpunk_Data_Layer::toggle_like($post_id, $user_id);
echo "  Result: " . print_r($result, true) . "\n\n";

// 测试 3: 获取用户点赞列表
echo "Test 3: Get User Likes\n";
$likes = Cyberpunk_Data_Layer::get_user_likes($user_id);
echo "  Total Likes: " . count($likes) . "\n\n";

// 测试 4: 性能测试
echo "Test 4: Performance Test\n";
$iterations = 1000;
$start = microtime(true);

for ($i = 0; $i < $iterations; $i++) {
    Cyberpunk_Data_Layer::get_like_count($post_id);
}

$time = microtime(true) - $start;
echo "  {$iterations} queries: " . round($time * 1000, 2) . "ms\n";
echo "  Average: " . round(($time / $iterations) * 1000, 4) . "ms per query\n\n";

echo "=== Tests Complete ===\n";
```

运行测试:

```bash
php test-database-optimization.php
```

#### 3.2 性能对比测试

```php
<?php
/**
 * 性能对比测试: PostMeta vs 自定义表
 */

require_once __DIR__ . '/wp-load.php';

echo "=== Performance Comparison ===\n\n";

$post_id = 1;
$iterations = 1000;

// 测试 1: 旧方案 (PostMeta + 字符串)
echo "Old Method (PostMeta):\n";
$start = microtime(true);

for ($i = 0; $i < $iterations; $i++) {
    // 模拟旧方案查询
    global $wpdb;
    $count = $wpdb->get_var($wpdb->prepare(
        "SELECT COUNT(*) FROM {$wpdb->usermeta}
        WHERE meta_key = '_cyberpunk_liked_posts'
        AND meta_value REGEXP %s",
        '(^|,)' . $post_id . '(,|$)'
    ));
}

$old_time = microtime(true) - $start;
echo "  Time: " . round($old_time * 1000, 2) . "ms\n\n";

// 测试 2: 新方案 (自定义表)
echo "New Method (Custom Table):\n";
$start = microtime(true);

for ($i = 0; $i < $iterations; $i++) {
    $count = Cyberpunk_Data_Layer::get_like_count($post_id);
}

$new_time = microtime(true) - $start;
echo "  Time: " . round($new_time * 1000, 2) . "ms\n\n";

// 性能提升
$improvement = $old_time / $new_time;
echo "Performance Improvement: " . round($improvement, 2) . "x faster ⚡\n";
```

---

## 🎯 验收标准

### 功能验收

- [ ] 点赞功能正常工作
- [ ] 取消点赞功能正常
- [ ] 点赞数显示正确
- [ ] 用户点赞列表正确显示
- [ ] 数据迁移无遗漏
- [ ] PostMeta同步正常

### 性能验收

- [ ] 点赞查询 < 5ms
- [ ] 用户点赞列表 < 10ms
- [ ] 热门文章统计 < 50ms
- [ ] 1000次查询总耗时 < 200ms

### 数据完整性

- [ ] 无数据丢失
- [ ] PostMeta与自定义表数据一致
- [ ] UNIQUE约束正常工作
- [ ] 索引正常使用

---

## 📊 监控与维护

### 启用监控

```php
// 在functions.php中添加
add_action('wp_loaded', function() {
    if (!current_user_can('manage_options')) {
        return;
    }

    // 记录慢查询
    add_filter('query', function($query) {
        global $wpdb;

        if (strpos($query, 'cyberpunk') === false) {
            return $query;
        }

        $start = microtime(true);
        $result = $wpdb->query($query);
        $time = microtime(true) - $start;

        if ($time > 0.05) { // 超过50ms
            error_log(sprintf(
                "[CYBERPUNK] Slow Query (%.4fs): %s",
                $time,
                substr($query, 0, 200)
            ));
        }

        return $result;
    });
});
```

### 定期维护任务

```php
// 定时清理任务
add_action('cyberpunk_weekly_maintenance', function() {
    global $wpdb;

    // 1. 清理90天前的访问日志
    $wpdb->query($wpdb->prepare(
        "DELETE FROM {$wpdb->prefix}cyberpunk_visits
        WHERE visit_time < %s",
        date('Y-m-d H:i:s', strtotime('-90 days'))
    ));

    // 2. 优化表
    $wpdb->query("OPTIMIZE TABLE {$wpdb->prefix}cyberpunk_visits");
    $wpdb->query("OPTIMIZE TABLE {$wpdb->prefix}cyberpunk_user_actions");

    error_log('[CYBERPUNK] Weekly maintenance completed');
});

// 注册定时任务
if (!wp_next_scheduled('cyberpunk_weekly_maintenance')) {
    wp_schedule_event(
        strtotime('next Sunday 2:00am'),
        'weekly',
        'cyberpunk_weekly_maintenance'
    );
}
```

---

## 🆘 故障排查

### 问题 1: SQL脚本执行失败

**症状**: 执行SQL时出现错误

**解决方案**:
```sql
-- 检查表前缀
SHOW TABLES LIKE 'wp_%';

-- 如果前缀不是 wp_,修改SQL中的SET @prefix语句
SET @prefix = 'your_prefix_';
```

### 问题 2: 数据迁移后数量不匹配

**症状**: PostMeta和自定义表数据不一致

**解决方案**:
```php
// 重新同步数据
wp shell
> Cyberpunk_DB_Migration::migrate_likes();
> Cyberpunk_DB_Migration::migrate_bookmarks();
```

### 问题 3: 性能未提升

**症状**: 查询速度仍然很慢

**检查清单**:
```sql
-- 1. 检查索引是否使用
EXPLAIN SELECT COUNT(*) FROM wp_cyberpunk_user_actions
WHERE post_id = 123 AND action_type = 'like';

-- 应该看到: type=ref, key=idx_post_action_type

-- 2. 检查表状态
SHOW TABLE STATUS LIKE 'wp_cyberpunk_user_actions';

-- 3. 分析表
ANALYZE TABLE wp_cyberpunk_user_actions;
```

---

## 📞 技术支持

- **文档**: `/docs/database/`
- **ER图**: `/docs/database/ER-DIAGRAM.md`
- **性能优化**: `/docs/database/PERFORMANCE-OPTIMIZATION.md`
- **完整方案**: `/docs/database/PHASE-2-DATABASE-OPTIMIZATION.md`

---

**版本**: 1.0.0
**日期**: 2026-02-28
**作者**: Database Architect
**状态**: ✅ Ready for Implementation
