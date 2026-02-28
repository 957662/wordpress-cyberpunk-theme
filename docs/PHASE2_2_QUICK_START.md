# 🚀 Phase 2.2 快速开始指南

> **WordPress Cyberpunk Theme**
> **开始日期**: 2026-03-02
> **开发周期**: 10 天
> **目标**: 完成 Widget 系统、短代码系统、性能优化和安全加固

---

## 📋 目录

1. [快速概览](#快速概览)
2. [环境准备](#环境准备)
3. [Day 6-7: Widget 系统](#day-6-7-widget-系统)
4. [Day 8-9: 短代码系统](#day-8-9-短代码系统)
5. [Day 10-11: 性能优化](#day-10-11-性能优化)
6. [Day 12-13: 安全加固](#day-12-13-安全加固)
7. [Day 14-15: 测试与部署](#day-14-15-测试与部署)

---

## 快速概览

### Phase 2.2 核心目标

```yaml
主要交付物:
  1. Widget 系统 (4个 Widget)
  2. 短代码系统 (6个短代码)
  3. 性能优化模块
  4. 安全加固模块

时间安排:
  Week 1 (Day 6-10): Widget + 短代码 + 性能
  Week 2 (Day 11-15): 缓存 + 安全 + 测试 + 文档

成功标准:
  - 功能完整性: 40分
  - 代码质量: 20分
  - 性能指标: 20分
  - 文档完整: 10分
  - 测试通过: 10分
  总分 ≥ 80分
```

### 文件结构预览

```
wordpress-cyber-theme/
├── inc/
│   ├── widgets.php (新建, ~800行)
│   ├── shortcodes.php (新建, ~600行)
│   ├── performance.php (新建, ~700行)
│   └── security.php (新建, ~500行)
├── assets/
│   ├── css/
│   │   ├── widget-styles.css (新建, ~500行)
│   │   └── shortcode-styles.css (新建, ~400行)
│   └── js/
│       ├── widgets.js (新建, ~300行)
│       └── shortcodes.js (新建, ~200行)
└── docs/
    ├── PHASE2_2_TECHNICAL_SOLUTION.md
    ├── PHASE2_STATUS_REPORT.md
    └── PHASE2_2_QUICK_START.md
```

---

## 环境准备

### 1. 检查当前状态

```bash
# 进入项目目录
cd /root/.openclaw/workspace/wordpress-cyber-theme

# 检查 Git 状态
git status

# 查看当前分支
git branch

# 确保在 main 分支且是最新的
git checkout main
git pull origin main
```

### 2. 创建开发分支

```bash
# 创建 Phase 2.2 开发分支
git checkout -b phase-2.2-development

# 验证分支
git branch
```

### 3. 启用调试模式

```php
// 在 wp-config.php 中添加或确认以下设置
define('WP_DEBUG', true);
define('WP_DEBUG_LOG', true);
define('WP_DEBUG_DISPLAY', false);
```

### 4. 准备开发工具

```bash
# 安装开发依赖（如果有 package.json）
npm install

# 安装 PHP 依赖（如果有 composer.json）
composer install
```

---

## Day 6-7: Widget 系统

### Day 6 任务清单

#### ✅ 任务 6.1: 创建 widgets.php (2小时)

**步骤**:

```bash
# 1. 创建文件
cd /root/.openclaw/workspace/wordpress-cyber-theme/inc
touch widgets.php
```

**代码模板**:

```php
<?php
/**
 * Cyberpunk Theme - Custom Widgets
 *
 * @package Cyberpunk_Theme
 * @version 2.2.0
 */

defined('ABSPATH') || exit;

/**
 * Register Widget Areas
 */
function cyberpunk_widget_areas_init() {
    // Hero Widget Area
    register_sidebar(array(
        'name'          => __('Hero Section', 'cyberpunk'),
        'id'            => 'hero-section',
        'description'   => __('Widgets in the hero section', 'cyberpunk'),
        'before_widget' => '<div id="%1$s" class="hero-widget %2$s">',
        'after_widget'  => '</div>',
        'before_title'  => '<h2 class="widget-title">',
        'after_title'   => '</h2>',
    ));

    // Sidebar Widget Area
    register_sidebar(array(
        'name'          => __('Sidebar', 'cyberpunk'),
        'id'            => 'sidebar',
        'description'   => __('Main sidebar widget area', 'cyberpunk'),
        'before_widget' => '<div id="%1$s" class="widget %2$s">',
        'after_widget'  => '</div>',
        'before_title'  => '<h3 class="widget-title">',
        'after_title'   => '</h3>',
    ));
}
add_action('widgets_init', 'cyberpunk_widget_areas_init');

/**
 * Load Widget Files
 */
require_once get_template_directory() . '/inc/widgets/class-about-me-widget.php';
require_once get_template_directory() . '/inc/widgets/class-recent-posts-widget.php';
require_once get_template_directory() . '/inc/widgets/class-social-links-widget.php';
require_once get_template_directory() . '/inc/widgets/class-popular-posts-widget.php';

/**
 * Register Widgets
 */
function cyberpunk_register_widgets() {
    register_widget('Cyberpunk_About_Me_Widget');
    register_widget('Cyberpunk_Recent_Posts_Widget');
    register_widget('Cyberpunk_Social_Links_Widget');
    register_widget('Cyberpunk_Popular_Posts_Widget');
}
add_action('widgets_init', 'cyberpunk_register_widgets');
```

**测试**:
```bash
# 在 WordPress 后台
1. 访问 外观 > Widget
2. 应该能看到新的 Widget Areas
3. 应该能看到 4 个新的 Widget
```

#### ✅ 任务 6.2: 创建 About Me Widget (3小时)

**步骤**:

```bash
# 创建 Widget 目录
mkdir -p inc/widgets

# 创建 About Me Widget 文件
touch inc/widgets/class-about-me-widget.php
```

**代码实现**: 参考 `PHASE2_2_TECHNICAL_SOLUTION.md` 第 5.1.1 节

**测试**:
```bash
# 在 WordPress 后台
1. 外观 > Widget
2. 拖拽 "About Me" 到 Sidebar
3. 填写 Widget 选项
4. 保存并查看前端
```

#### ✅ 任务 6.3: 创建 Recent Posts Widget (2小时)

**步骤**:

```bash
# 创建 Recent Posts Widget 文件
touch inc/widgets/class-recent-posts-widget.php
```

**代码实现**: 参考 `PHASE2_2_TECHNICAL_SOLUTION.md` 第 5.1.2 节

#### ✅ 任务 6.4: 创建 Widget CSS 样式 (2小时)

**步骤**:

```bash
# 创建 Widget 样式文件
cd /root/.openclaw/workspace/wordpress-cyber-theme/assets/css
touch widget-styles.css
```

**代码实现**: 参考 `PHASE2_2_TECHNICAL_SOLUTION.md` 第 5.1.1 节的 CSS

**加载样式**:

```php
// 在 inc/theme-integration.php 中添加
function cyberpunk_enqueue_widget_styles() {
    if (file_exists(get_template_directory() . '/assets/css/widget-styles.css')) {
        wp_enqueue_style(
            'cyberpunk-widget-styles',
            get_template_directory_uri() . '/assets/css/widget-styles.css',
            array(),
            wp_get_theme()->get('Version')
        );
    }
}
add_action('wp_enqueue_scripts', 'cyberpunk_enqueue_widget_styles');
```

### Day 7 任务清单

#### ✅ 任务 7.1: 创建 Social Links Widget (1.5小时)

**步骤**:

```bash
# 创建 Social Links Widget 文件
touch inc/widgets/class-social-links-widget.php
```

**代码实现**: 参考 `PHASE2_2_TECHNICAL_SOLUTION.md` 第 5.1.3 节

#### ✅ 任务 7.2: 创建 Popular Posts Widget (2小时)

**步骤**:

```bash
# 创建 Popular Posts Widget 文件
touch inc/widgets/class-popular-posts-widget.php
```

**代码实现**: 参考 `PHASE2_2_TECHNICAL_SOLUTION.md` 的相关章节

#### ✅ 任务 7.3: 创建 Widget JavaScript (2小时)

**步骤**:

```bash
# 创建 Widget JS 文件
cd /root/.openclaw/workspace/wordpress-cyber-theme/assets/js
touch widgets.js
```

**代码实现**: 参考 `PHASE2_2_TECHNICAL_SOLUTION.md` 第 8.1 节

**加载脚本**:

```php
// 在 inc/theme-integration.php 中添加
function cyberpunk_enqueue_widget_scripts() {
    if (file_exists(get_template_directory() . '/assets/js/widgets.js')) {
        wp_enqueue_script(
            'cyberpunk-widgets',
            get_template_directory_uri() . '/assets/js/widgets.js',
            array('jquery'),
            wp_get_theme()->get('Version'),
            true
        );
    }
}
add_action('wp_enqueue_scripts', 'cyberpunk_enqueue_widget_scripts');
```

#### ✅ 任务 7.4: Widget 测试 (2.5小时)

**测试清单**:

```yaml
功能测试:
  - [ ] About Me Widget 显示正确
  - [ ] Recent Posts Widget 查询正确
  - [ ] Social Links Widget 链接有效
  - [ ] Popular Posts Widget 排序正确
  - [ ] Widget 选项保存正常
  - [ ] Widget 删除正常

响应式测试:
  - [ ] 桌面端显示正常
  - [ ] 平板显示正常
  - [ ] 手机显示正常

浏览器兼容性:
  - [ ] Chrome 测试通过
  - [ ] Firefox 测试通过
  - [ ] Safari 测试通过
  - [ ] Edge 测试通过
```

---

## Day 8-9: 短代码系统

### Day 8 任务清单

#### ✅ 任务 8.1: 创建 shortcodes.php (1小时)

**步骤**:

```bash
# 创建短代码文件
cd /root/.openclaw/workspace/wordpress-cyber-theme/inc
touch shortcodes.php
```

**代码模板**:

```php
<?php
/**
 * Cyberpunk Theme - Shortcodes
 *
 * @package Cyberpunk_Theme
 * @version 2.2.0
 */

defined('ABSPATH') || exit;

/**
 * Button Shortcode
 * [cyber_button url="..." color="cyan"]Click[/cyber_button]
 */
function cyberpunk_button_shortcode($atts, $content = '') {
    // 实现代码
}
add_shortcode('cyber_button', 'cyberpunk_button_shortcode');

/**
 * Alert Shortcode
 * [cyber_alert type="warning"]Message[/cyber_alert]
 */
function cyberpunk_alert_shortcode($atts, $content = '') {
    // 实现代码
}
add_shortcode('cyber_alert', 'cyberpunk_alert_shortcode');

/**
 * Columns Shortcode
 * [cyber_columns][cyber_col width="1/2"]...[/cyber_col][/cyber_columns]
 */
function cyberpunk_columns_shortcode($atts, $content = '') {
    // 实现代码
}
add_shortcode('cyber_columns', 'cyberpunk_columns_shortcode');

function cyberpunk_column_shortcode($atts, $content = '') {
    // 实现代码
}
add_shortcode('cyber_col', 'cyberpunk_column_shortcode');

// 更多短代码...
```

**加载短代码**:

```php
// 在 inc/theme-integration.php 中添加
function cyberpunk_load_shortcodes() {
    if (file_exists(get_template_directory() . '/inc/shortcodes.php')) {
        require_once get_template_directory() . '/inc/shortcodes.php';
    }
}
add_action('after_setup_theme', 'cyberpunk_load_shortcodes');
```

#### ✅ 任务 8.2: 实现 Button 短代码 (2小时)

**代码实现**: 参考 `PHASE2_2_TECHNICAL_SOLUTION.md` 第 5.2.1 节

**测试**:
```html
<!-- 在编辑器中测试 -->
[cyber_button url="https://example.com" color="cyan" size="large"]Click Me[/cyber_button]

[cyber_button url="https://example.com" color="magenta" size="medium"]Download[/cyber_button]
```

#### ✅ 任务 8.3: 实现 Alert 短代码 (1.5小时)

**代码实现**: 参考 `PHASE2_2_TECHNICAL_SOLUTION.md` 第 5.2.2 节

**测试**:
```html
[cyber_alert type="info"]This is an info message[/cyber_alert]
[cyber_alert type="warning" dismissible="true"]This is a warning[/cyber_alert]
[cyber_alert type="error"]This is an error message[/cyber_alert]
```

#### ✅ 任务 8.4: 实现 Columns 短代码 (1.5小时)

**代码实现**: 参考 `PHASE2_2_TECHNICAL_SOLUTION.md` 第 5.2.3 节

**测试**:
```html
[cyber_columns]
  [cyber_col width="1/2"]Left Column[/cyber_col]
  [cyber_col width="1/2"]Right Column[/cyber_col]
[/cyber_columns]
```

#### ✅ 任务 8.5: 创建短代码 CSS (2小时)

**步骤**:

```bash
# 创建短代码样式文件
cd /root/.openclaw/workspace/wordpress-cyber-theme/assets/css
touch shortcode-styles.css
```

**代码实现**: 参考 `PHASE2_2_TECHNICAL_SOLUTION.md` 第 5.2 节的 CSS

**加载样式**:

```php
// 在 inc/theme-integration.php 中添加
function cyberpunk_enqueue_shortcode_styles() {
    if (file_exists(get_template_directory() . '/assets/css/shortcode-styles.css')) {
        wp_enqueue_style(
            'cyberpunk-shortcode-styles',
            get_template_directory_uri() . '/assets/css/shortcode-styles.css',
            array(),
            wp_get_theme()->get('Version')
        );
    }
}
add_action('wp_enqueue_scripts', 'cyberpunk_enqueue_shortcode_styles');
```

### Day 9 任务清单

#### ✅ 任务 9.1: 实现 Gallery 短代码 (2小时)

**功能需求**:
- 从媒体库选择图片
- 网格布局
- Lightbox 效果
- 懒加载

**代码模板**:

```php
/**
 * Gallery Shortcode
 * [cyber_gallery ids="1,2,3" columns="3"]
 */
function cyberpunk_gallery_shortcode($atts) {
    $atts = shortcode_atts(array(
        'ids'     => '',
        'columns' => 3,
        'size'    => 'medium',
    ), $atts);

    if (empty($atts['ids'])) {
        return '';
    }

    $ids = explode(',', $atts['ids']);
    $columns = intval($atts['columns']);

    $html = '<div class="cyber-gallery cyber-gallery-' . $columns . '-columns">';

    foreach ($ids as $id) {
        $img_url = wp_get_attachment_image_url($id, $atts['size']);
        $full_url = wp_get_attachment_image_url($id, 'full');
        $alt = get_post_meta($id, '_wp_attachment_image_alt', true);

        $html .= sprintf(
            '<div class="gallery-item">
                <img src="%s" alt="%s" data-full="%s" loading="lazy">
            </div>',
            esc_url($img_url),
            esc_attr($alt),
            esc_url($full_url)
        );
    }

    $html .= '</div>';

    return $html;
}
add_shortcode('cyber_gallery', 'cyberpunk_gallery_shortcode');
```

#### ✅ 任务 9.2: 实现 Video 短代码 (1.5小时)

**功能需求**:
- 支持 YouTube
- 支持 Vimeo
- 支持自托管视频
- 响应式嵌入

**代码模板**:

```php
/**
 * Video Shortcode
 * [cyber_video type="youtube" id="VIDEO_ID"]
 */
function cyberpunk_video_shortcode($atts) {
    $atts = shortcode_atts(array(
        'type' => 'youtube',
        'id'   => '',
        'url'  => '',
        'width' => '100%',
        'height' => 'auto',
    ), $atts);

    $html = '<div class="cyber-video-wrapper">';

    switch ($atts['type']) {
        case 'youtube':
            if (!empty($atts['id'])) {
                $html .= sprintf(
                    '<iframe src="https://www.youtube.com/embed/%s" width="%s" height="%s" frameborder="0" allowfullscreen></iframe>',
                    esc_attr($atts['id']),
                    esc_attr($atts['width']),
                    esc_attr($atts['height'])
                );
            }
            break;

        case 'vimeo':
            if (!empty($atts['id'])) {
                $html .= sprintf(
                    '<iframe src="https://player.vimeo.com/video/%s" width="%s" height="%s" frameborder="0" allowfullscreen></iframe>',
                    esc_attr($atts['id']),
                    esc_attr($atts['width']),
                    esc_attr($atts['height'])
                );
            }
            break;

        case 'self':
            if (!empty($atts['url'])) {
                $html .= sprintf(
                    '<video src="%s" width="%s" height="%s" controls></video>',
                    esc_url($atts['url']),
                    esc_attr($atts['width']),
                    esc_attr($atts['height'])
                );
            }
            break;
    }

    $html .= '</div>';

    return $html;
}
add_shortcode('cyber_video', 'cyberpunk_video_shortcode');
```

#### ✅ 任务 9.3: 实现 Progress Bar 短代码 (1.5小时)

**功能需求**:
- 自定义颜色
- 动画效果
- 自定义宽度

**代码模板**:

```php
/**
 * Progress Bar Shortcode
 * [cyber_progress value="75" color="cyan"]75%[/cyber_progress]
 */
function cyberpunk_progress_shortcode($atts, $content = '') {
    $atts = shortcode_atts(array(
        'value' => 0,
        'color' => 'cyan',
        'height' => '30px',
        'striped' => 'false',
    ), $atts);

    $classes = array(
        'cyber-progress-bar',
        'cyber-progress-' . $atts['color'],
    );

    if ($atts['striped'] === 'true') {
        $classes[] = 'striped';
    }

    $html = sprintf(
        '<div class="%s" style="height: %s;">
            <div class="cyber-progress-fill" style="width: %s;">
                <span class="cyber-progress-text">%s</span>
            </div>
        </div>',
        esc_attr(implode(' ', $classes)),
        esc_attr($atts['height']),
        esc_attr($atts['value'] . '%'),
        do_shortcode($content)
    );

    return $html;
}
add_shortcode('cyber_progress', 'cyberpunk_progress_shortcode');
```

#### ✅ 任务 9.4: 短代码测试 (3小时)

**测试清单**:

```yaml
功能测试:
  - [ ] Button 短代码渲染正确
  - [ ] Alert 短代码关闭功能正常
  - [ ] Columns 短代码布局正确
  - [ ] Gallery 短代码 Lightbox 工作
  - [ ] Video 短代码嵌入正确
  - [ ] Progress 短代码动画正常

嵌套测试:
  - [ ] 短代码嵌套正常
  - [ ] 多个短代码组合正常

响应式测试:
  - [ ] 桌面端显示正常
  - [ ] 平板显示正常
  - [ ] 手机显示正常
```

---

## Day 10-11: 性能优化

### Day 10 任务清单

#### ✅ 任务 10.1: 创建 performance.php (1小时)

**步骤**:

```bash
# 创建性能优化文件
cd /root/.openclaw/workspace/wordpress-cyber-theme/inc
touch performance.php
```

**代码模板**:

```php
<?php
/**
 * Cyberpunk Theme - Performance Optimization
 *
 * @package Cyberpunk_Theme
 * @version 2.2.0
 */

defined('ABSPATH') || exit;

/**
 * Image Optimization
 */
// WebP support, lazy loading, responsive images...

/**
 * CSS/JS Optimization
 */
// Minification, concatenation, async loading...

/**
 * Caching Strategy
 */
// Fragment caching, object caching, transients...

/**
 * Database Optimization
 */
// Query optimization, indexing, cleanup...
```

**加载模块**:

```php
// 在 inc/theme-integration.php 中添加
function cyberpunk_load_performance() {
    if (file_exists(get_template_directory() . '/inc/performance.php')) {
        require_once get_template_directory() . '/inc/performance.php';
    }
}
add_action('after_setup_theme', 'cyberpunk_load_performance');
```

#### ✅ 任务 10.2: 图片优化 (3小时)

**实现要点**:
1. WebP 自动转换
2. 响应式图片
3. 懒加载
4. 图片压缩

**代码示例**: 参考 `PHASE2_2_TECHNICAL_SOLUTION.md` 第 10.1 节

#### ✅ 任务 10.3: CSS/JS 优化 (3小时)

**实现要点**:
1. 移除不必要的 CSS/JS
2. 延迟加载非关键脚本
3. 异步加载
4. 代码压缩（生产环境）

**代码示例**: 参考 `PHASE2_2_TECHNICAL_SOLUTION.md` 第 10.2 节

### Day 11 任务清单

#### ✅ 任务 11.1: 缓存策略 (3小时)

**实现要点**:
1. Fragment Caching
2. Object Caching
3. Transient API
4. 页面缓存

**代码示例**: 参考 `PHASE2_2_TECHNICAL_SOLUTION.md` 第 10.3 节

#### ✅ 任务 11.2: 数据库优化 (2.5小时)

**实现要点**:
1. 查询优化
2. 索引优化
3. 自动清理
4. 慢查询日志

**代码示例**:

```php
/**
 * Optimize Database Queries
 */
add_action('pre_get_posts', 'cyberpunk_optimize_query');

function cyberpunk_optimize_query($query) {
    if (!is_admin() && $query->is_main_query()) {
        // 只查询需要的字段
        $query->set('fields', 'ids');
    }
}

/**
 * Automatic Database Cleanup
 */
add_action('wp_scheduled_delete', 'cyberpunk_database_cleanup');

function cyberpunk_database_cleanup() {
    // 清理修订版本
    wp_delete_post_revision(get_post());

    // 清理垃圾评论
    $spam_comments = get_comments(array('status' => 'spam'));
    foreach ($spam_comments as $comment) {
        wp_delete_comment($comment->comment_ID, true);
    }

    // 清理过期 transient
    global $wpdb;
    $wpdb->query(
        "DELETE FROM {$wpdb->options}
        WHERE option_name LIKE '_transient_%'
        AND option_value < UNIX_TIMESTAMP()"
    );
}
```

#### ✅ 任务 11.3: 性能测试 (2.5小时)

**测试工具**:
1. PageSpeed Insights
2. GTmetrix
3. Lighthouse
4. WebPageTest

**测试清单**:

```yaml
性能指标:
  - [ ] PageSpeed Desktop ≥ 90
  - [ ] PageSpeed Mobile ≥ 85
  - [ ] FCP < 1.0s
  - [ ] LCP < 2.5s
  - [ ] TTI < 3.5s

资源优化:
  - [ ] 图片使用 WebP
  - [ ] CSS/JS 已压缩
  - [ ] 懒加载工作正常
  - [ ] 缓存策略有效
```

---

## Day 12-13: 安全加固

### Day 12 任务清单

#### ✅ 任务 12.1: 创建 security.php (1小时)

**步骤**:

```bash
# 创建安全文件
cd /root/.openclaw/workspace/wordpress-cyber-theme/inc
touch security.php
```

**代码模板**:

```php
<?php
/**
 * Cyberpunk Theme - Security
 *
 * @package Cyberpunk_Theme
 * @version 2.2.0
 */

defined('ABSPATH') || exit;

/**
 * CSRF Protection
 */
// Token generation, validation...

/**
 * Input Validation
 */
// Data sanitization, validation...

/**
 * Security Headers
 */
// CSP, HSTS, X-Frame-Options...

/**
 * Audit Logging
 */
// Login logs, operation logs...
```

**加载模块**:

```php
// 在 inc/theme-integration.php 中添加
function cyberpunk_load_security() {
    if (file_exists(get_template_directory() . '/inc/security.php')) {
        require_once get_template_directory() . '/inc/security.php';
    }
}
add_action('after_setup_theme', 'cyberpunk_load_security');
```

#### ✅ 任务 12.2: CSRF 保护 (3小时)

**实现要点**:
1. Token 生成
2. Token 验证
3. AJAX 保护
4. 表单保护

**代码示例**: 参考 `PHASE2_2_TECHNICAL_SOLUTION.md` 第 11.1 节

#### ✅ 任务 12.3: 输入验证 (3小时)

**实现要点**:
1. 数据净化
2. 数据验证
3. XSS 防护
4. SQL 注入防护

**代码示例**: 参考 `PHASE2_2_TECHNICAL_SOLUTION.md` 第 11.2 节

### Day 13 任务清单

#### ✅ 任务 13.1: 安全头部 (2小时)

**实现要点**:
1. Content Security Policy
2. HSTS
3. X-Frame-Options
4. 其他安全头部

**代码示例**: 参考 `PHASE2_2_TECHNICAL_SOLUTION.md` 第 11.3 节

#### ✅ 任务 13.2: 审计日志 (3小时)

**实现要点**:
1. 登录日志
2. 操作日志
3. 错误日志
4. 日志查看器

**代码示例**:

```php
/**
 * Audit Logging System
 */

// 创建日志表
function cyberpunk_create_audit_log_table() {
    global $wpdb;
    $table_name = $wpdb->prefix . 'cyberpunk_audit_logs';
    $charset_collate = $wpdb->get_charset_collate();

    $sql = "CREATE TABLE $table_name (
        id bigint(20) NOT NULL AUTO_INCREMENT,
        user_id bigint(20) NOT NULL,
        action varchar(255) NOT NULL,
        object_type varchar(100) DEFAULT NULL,
        object_id bigint(20) DEFAULT NULL,
        ip_address varchar(45) DEFAULT NULL,
        user_agent text DEFAULT NULL,
        created_at datetime DEFAULT CURRENT_TIMESTAMP,
        PRIMARY KEY  (id),
        KEY user_id (user_id),
        KEY action (action),
        KEY created_at (created_at)
    ) $charset_collate;";

    require_once(ABSPATH . 'wp-admin/includes/upgrade.php');
    dbDelta($sql);
}
register_activation_hook(__FILE__, 'cyberpunk_create_audit_log_table');

// 记录日志
function cyberpunk_log_audit($action, $object_type = null, $object_id = null) {
    global $wpdb;
    $table_name = $wpdb->prefix . 'cyberpunk_audit_logs';

    $data = array(
        'user_id' => get_current_user_id(),
        'action' => $action,
        'object_type' => $object_type,
        'object_id' => $object_id,
        'ip_address' => $_SERVER['REMOTE_ADDR'],
        'user_agent' => $_SERVER['HTTP_USER_AGENT'],
    );

    $wpdb->insert($table_name, $data);
}

// 使用示例
add_action('wp_login', 'cyberpunk_log_login', 10, 2);
function cyberpunk_log_login($user_login, $user) {
    cyberpunk_log_audit('user_login', 'user', $user->ID);
}
```

#### ✅ 任务 13.3: 安全测试 (3小时)

**测试清单**:

```yaml
安全测试:
  - [ ] XSS 攻击测试通过
  - [ ] CSRF 攻击测试通过
  - [ ] SQL 注入测试通过
  - [ ] 文件上传测试通过
  - [ ] 权限测试通过

工具测试:
  - [ ] WPScan 扫描无高危漏洞
  - [ ] 安全头部正确设置
  - [ ] CSP 有效且无误报
```

---

## Day 14-15: 测试与部署

### Day 14 任务清单

#### ✅ 任务 14.1: 功能测试 (3小时)

**测试范围**:
- 所有 Widget 功能
- 所有短代码功能
- AJAX 功能
- 响应式功能

**测试工具**: 手动测试 + 自动化测试

#### ✅ 任务 14.2: 性能测试 (2小时)

**测试工具**:
1. PageSpeed Insights
2. GTmetrix
3. Lighthouse

**目标分数**:
- Desktop: ≥ 90
- Mobile: ≥ 85

#### ✅ 任务 14.3: 安全测试 (2小时)

**测试工具**:
1. WPScan
2. Burp Suite
3. OWASP ZAP

**目标**: 无已知高危漏洞

#### ✅ 任务 14.4: 兼容性测试 (1小时)

**测试范围**:
- Chrome (最新版)
- Firefox (最新版)
- Safari (最新版)
- Edge (最新版)
- 移动浏览器

### Day 15 任务清单

#### ✅ 任务 15.1: 用户文档 (3小时)

**文档内容**:
1. Widget 使用指南
2. 短代码参考手册
3. 主题定制指南
4. 常见问题解答

**文件**: `docs/USER_GUIDE.md`

#### ✅ 任务 15.2: 开发者文档 (2小时)

**文档内容**:
1. 代码结构说明
2. API 文档
3. 扩展开发指南
4. 贡献指南

**文件**: `docs/DEVELOPER_GUIDE.md`

#### ✅ 任务 15.3: 更新主文档 (1小时)

**更新内容**:
1. README.md
2. changelog.md
3. 版本号更新

#### ✅ 任务 15.4: 发布准备 (2小时)

**发布清单**:

```yaml
代码审查:
  - [ ] 代码审查完成
  - [ ] 所有测试通过
  - [ ] 无已知 Bug

文档更新:
  - [ ] 用户文档完成
  - [ ] 开发者文档完成
  - [ ] README 更新
  - [ ] 更新日志完成

版本控制:
  - [ ] 版本号更新
  - [ ] Git 标签创建
  - [ ] 发布分支创建

备份:
  - [ ] 数据库备份
  - [ ] 文件备份
  - [ ] 配置备份
```

---

## 📊 每日检查清单

### 每日开始

```yaml
☐ 检查 Git 状态
☐ 拉取最新代码
☐ 查看今日任务
☐ 准备开发环境
☐ 启用调试模式
```

### 每日结束

```yaml
☐ 提交代码
☐ 编写提交信息
☐ 推送到远程
☐ 更新进度
☐ 记录问题
☐ 准备明日计划
```

---

## 🎯 成功标准

### Phase 2.2 验收标准

```yaml
功能完整性 (40分):
  - [ ] 所有 Widget 功能正常 (10分)
  - [ ] 所有短代码正确渲染 (10分)
  - [ ] 性能优化生效 (10分)
  - [ ] 安全措施到位 (10分)

代码质量 (20分):
  - [ ] 符合 WordPress 编码规范 (10分)
  - [ ] 无 PHP 错误/警告 (5分)
  - [ ] 无 JavaScript 错误 (5分)

性能 (20分):
  - [ ] PageSpeed > 90 (10分)
  - [ ] 加载时间 < 2s (5分)
  - [ ] 内存使用 < 64MB (5分)

文档 (10分):
  - [ ] 用户文档完整 (5分)
  - [ ] 开发者文档完整 (5分)

测试 (10分):
  - [ ] 所有测试通过 (5分)
  - [ ] 无已知 Bug (5分)

总分: ______ / 100
通过标准: ≥ 80 分
```

---

## 🚀 快速命令参考

### Git 命令

```bash
# 创建新分支
git checkout -b phase-2.2-development

# 查看状态
git status

# 添加文件
git add .

# 提交
git commit -m "feat: add widget system"

# 推送
git push origin phase-2.2-development

# 查看日志
git log --oneline --graph
```

### WP-CLI 命令

```bash
# 清除缓存
wp cache flush

# 重新生成缩略图
wp media regenerate

# 检查版本
wp core version

# 更新数据库
wp core update-db

# 导出数据库
wp db export backup.sql
```

### 调试命令

```bash
# 查看日志
tail -f wp-content/debug.log

# 清除日志
> wp-content/debug.log

# 检查 PHP 错误
php -l file.php

# 检查 JS 语法
eslint file.js
```

---

## 📞 获取帮助

### 文档资源

- **技术方案**: `docs/PHASE2_2_TECHNICAL_SOLUTION.md`
- **状态报告**: `docs/PHASE2_STATUS_REPORT.md`
- **WordPress Widget API**: https://developer.wordpress.org/apis/handbook/widgets/
- **Shortcode API**: https://developer.wordpress.org/plugins/shortcodes/

### 社区支持

- **WordPress Forum**: https://wordpress.org/support/
- **Stack Overflow**: https://stackoverflow.com/questions/tagged/wordpress
- **Discord**: #cyberpunk-theme

---

## 🎉 开始开发

准备好了吗？让我们开始 Phase 2.2 的开发之旅！

```bash
# 第一步：创建开发分支
cd /root/.openclaw/workspace/wordpress-cyber-theme
git checkout -b phase-2.2-development

# 第二步：创建第一个文件
touch inc/widgets.php

# 第三步：开始编码！
```

**祝开发顺利！** 🚀💜

---

**文档版本**: 1.0.0
**创建日期**: 2026-03-01
**作者**: Claude AI Assistant
**项目**: WordPress Cyberpunk Theme Phase 2.2
