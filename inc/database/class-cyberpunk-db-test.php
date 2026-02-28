<?php
/**
 * Cyberpunk Theme - Database Integration Tests
 *
 * 数据库集成测试套件
 * 测试所有数据库功能和性能
 *
 * @package Cyberpunk_Theme
 * @version 2.0.0
 * @since 2.0.0
 * @author Database Architect
 */

defined('ABSPATH') || exit;

class Cyberpunk_DB_Tests {

    /**
     * 测试结果
     */
    private static $results = array();

    /**
     * 运行所有测试
     */
    public static function run_all_tests() {
        echo "<!-- Cyberpunk Database Tests -->\n";
        echo "<style>
            .cyberpunk-test { font-family: monospace; padding: 20px; background: #0a0e27; color: #00f0ff; }
            .test-pass { color: #00ff41; }
            .test-fail { color: #ff0055; }
            .test-info { color: #f0ff00; }
        </style>";

        self::test_table_exists();
        self::test_like_system();
        self::test_bookmark_system();
        self::test_visit_system();
        self::test_reading_progress();
        self::test_performance();

        self::print_results();
    }

    /**
     * 测试1: 检查表是否存在
     */
    private static function test_table_exists() {
        global $wpdb;

        $tables = array(
            'visits' => $wpdb->prefix . 'cyberpunk_visits',
            'user_actions' => $wpdb->prefix . 'cyberpunk_user_actions',
            'shares' => $wpdb->prefix . 'cyberpunk_shares',
            'reading_progress' => $wpdb->prefix . 'cyberpunk_reading_progress'
        );

        foreach ($tables as $key => $table) {
            $exists = $wpdb->get_var("SHOW TABLES LIKE '$table'");
            self::add_result("Table $table", $exists ? 'PASS' : 'FAIL', $exists ? "Table exists" : "Table NOT found");
        }

        // 检查视图
        $view = $wpdb->prefix . 'cyberpunk_post_stats';
        $view_exists = $wpdb->get_var("SHOW TABLES LIKE '$view'");
        self::add_result("View $view", $view_exists ? 'PASS' : 'FAIL', $view_exists ? "View exists" : "View NOT found");
    }

    /**
     * 测试2: 点赞系统
     */
    private static function test_like_system() {
        // 获取或创建测试文章
        $test_post = wp_insert_post(array(
            'post_title' => 'Cyberpunk Test Post',
            'post_content' => 'Test content for database integration',
            'post_status' => 'draft',
            'post_author' => 1
        ));

        $test_user = 1;

        // 测试点赞
        Cyberpunk_Data_Layer::toggle_like($test_post, $test_user);
        $is_liked = Cyberpunk_Data_Layer::is_liked($test_post, $test_user);
        $like_count = Cyberpunk_Data_Layer::get_like_count($test_post);

        self::add_result(
            'Like System - Add Like',
            ($is_liked && $like_count >= 1) ? 'PASS' : 'FAIL',
            "Liked: $is_liked, Count: $like_count"
        );

        // 测试取消点赞
        Cyberpunk_Data_Layer::toggle_like($test_post, $test_user);
        $is_liked_after = Cyberpunk_Data_Layer::is_liked($test_post, $test_user);

        self::add_result(
            'Like System - Remove Like',
            !$is_liked_after ? 'PASS' : 'FAIL',
            "Liked after unlike: $is_liked_after (should be 0)"
        );

        // 清理测试文章
        wp_delete_post($test_post, true);
    }

    /**
     * 测试3: 收藏系统
     */
    private static function test_bookmark_system() {
        $test_post = wp_insert_post(array(
            'post_title' => 'Cyberpunk Bookmark Test',
            'post_content' => 'Test bookmark functionality',
            'post_status' => 'draft',
            'post_author' => 1
        ));

        $test_user = 1;

        // 测试添加收藏
        Cyberpunk_Data_Layer::toggle_bookmark($test_post, $test_user);
        $is_bookmarked = Cyberpunk_Data_Layer::is_bookmarked($test_post, $test_user);

        self::add_result(
            'Bookmark System - Add Bookmark',
            $is_bookmarked ? 'PASS' : 'FAIL',
            "Bookmarked: $is_bookmarked"
        );

        // 测试取消收藏
        Cyberpunk_Data_Layer::toggle_bookmark($test_post, $test_user);
        $is_bookmarked_after = Cyberpunk_Data_Layer::is_bookmarked($test_post, $test_user);

        self::add_result(
            'Bookmark System - Remove Bookmark',
            !$is_bookmarked_after ? 'PASS' : 'FAIL',
            "Bookmarked after remove: $is_bookmarked_after (should be 0)"
        );

        // 清理
        wp_delete_post($test_post, true);
    }

    /**
     * 测试4: 访问日志系统
     */
    private static function test_visit_system() {
        global $wpdb;

        $test_post = wp_insert_post(array(
            'post_title' => 'Cyberpunk Visit Test',
            'post_content' => 'Test visit tracking',
            'post_status' => 'draft',
            'post_author' => 1
        ));

        // 记录访问
        $visit_id = Cyberpunk_Data_Layer::record_visit($test_post, 1);

        // 验证访问记录
        $visit_count = $wpdb->get_var($wpdb->prepare(
            "SELECT COUNT(*) FROM {$wpdb->prefix}cyberpunk_visits WHERE post_id = %d",
            $test_post
        ));

        self::add_result(
            'Visit System - Record Visit',
            ($visit_id && $visit_count >= 1) ? 'PASS' : 'FAIL',
            "Visit ID: $visit_id, Count: $visit_count"
        );

        // 清理
        wp_delete_post($test_post, true);
    }

    /**
     * 测试5: 阅读进度系统
     */
    private static function test_reading_progress() {
        $test_post = wp_insert_post(array(
            'post_title' => 'Cyberpunk Reading Progress Test',
            'post_content' => 'Test reading progress tracking',
            'post_status' => 'draft',
            'post_author' => 1
        ));

        $test_user = 1;
        $test_progress = 50.5;

        // 保存阅读进度
        Cyberpunk_Data_Layer::save_reading_progress($test_post, $test_progress, $test_user);

        // 获取阅读进度
        $saved_progress = Cyberpunk_Data_Layer::get_reading_progress($test_post, $test_user);

        self::add_result(
            'Reading Progress - Save/Load',
            ($saved_progress == $test_progress) ? 'PASS' : 'FAIL',
            "Expected: $test_progress, Got: $saved_progress"
        );

        // 清理
        wp_delete_post($test_post, true);
    }

    /**
     * 测试6: 性能测试
     */
    private static function test_performance() {
        global $wpdb;

        $start_time = microtime(true);

        // 执行100次点赞查询
        for ($i = 0; $i < 100; $i++) {
            $wpdb->get_var(
                "SELECT COUNT(*) FROM {$wpdb->prefix}cyberpunk_user_actions
                WHERE post_id = 1 AND action_type = 'like'"
            );
        }

        $end_time = microtime(true);
        $total_time = ($end_time - $start_time) * 1000; // 转换为毫秒
        $avg_time = $total_time / 100;

        $status = ($avg_time < 2) ? 'PASS' : 'FAIL'; // 平均查询时间应小于2ms

        self::add_result(
            'Performance - Like Query (100x)',
            $status,
            sprintf("Average: %.2fms (Target: <2ms)", $avg_time)
        );
    }

    /**
     * 添加测试结果
     */
    private static function add_result($name, $status, $message) {
        self::$results[] = array(
            'name' => $name,
            'status' => $status,
            'message' => $message
        );
    }

    /**
     * 打印测试结果
     */
    private static function print_results() {
        echo "<div class='cyberpunk-test'>";
        echo "<h2>🗄️ Cyberpunk Database Integration Tests</h2>";
        echo "<pre>";

        $pass_count = 0;
        $fail_count = 0;

        foreach (self::$results as $result) {
            $class = ($result['status'] === 'PASS') ? 'test-pass' : 'test-fail';
            $symbol = ($result['status'] === 'PASS') ? '✅' : '❌';

            echo "<span class='$class'>$symbol {$result['name']}</span>\n";
            echo "   Status: <span class='$class'>{$result['status']}</span>\n";
            echo "   Message: <span class='test-info'>{$result['message']}</span>\n";
            echo "\n";

            if ($result['status'] === 'PASS') {
                $pass_count++;
            } else {
                $fail_count++;
            }
        }

        echo "========================================\n";
        echo "Total Tests: " . count(self::$results) . "\n";
        echo "<span class='test-pass'>Passed: $pass_count</span>\n";
        echo "<span class='test-fail'>Failed: $fail_count</span>\n";
        echo "========================================\n";

        echo "</pre></div>";

        // 如果是在CLI环境中运行
        if (php_sapi_name() === 'cli') {
            echo "\n🗄️ Cyberpunk Database Tests\n";
            echo "========================================\n";
            foreach (self::$results as $result) {
                $symbol = ($result['status'] === 'PASS') ? '✅' : '❌';
                echo "$symbol {$result['name']}: {$result['status']}\n";
                echo "   {$result['message']}\n\n";
            }
            echo "========================================\n";
            echo "Total: " . count(self::$results) . " | ";
            echo "Pass: $pass_count | Fail: $fail_count\n";
        }
    }
}

// 如果直接访问此文件，运行测试
if (isset($_GET['cyberpunk_db_test'])) {
    add_action('wp', function() {
        if (current_user_can('manage_options')) {
            Cyberpunk_DB_Tests::run_all_tests();
            exit;
        }
    });
}

// CLI测试命令
if (php_sapi_name() === 'cli') {
    // 使用: wp eval 'require_once "/path/to/class-cyberpunk-db-test.php"; Cyberpunk_DB_Tests::run_all_tests();'
}
