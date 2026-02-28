# 🚀 WordPress Cyberpunk Theme - 实施指南

> **快速开始主题增强开发**
> **版本**: 1.0.0
> **日期**: 2026-02-28

---

## 📋 目录

1. [快速开始](#快速开始)
2. [目录结构设置](#目录结构设置)
3. [核心功能实施](#核心功能实施)
4. [代码示例](#代码示例)
5. [测试指南](#测试指南)
6. [部署清单](#部署清单)

---

## 🚀 快速开始

### 前置条件

```yaml
Requirements:
  PHP: 7.4 或更高版本
  WordPress: 5.0 或更高版本
  MySQL: 5.7+ / MariaDB 10.2+
  Web Server: Apache/Nginx

Recommended:
  Memory: 256M+
  Max Execution Time: 300s
  PHP Extensions:
    - curl
    - json
    - mbstring
    - gd
    - zip
```

### 5分钟快速设置

```bash
# 1. 进入主题目录
cd /path/to/wordpress/wp-content/themes/wordpress-cyber-theme

# 2. 创建新的目录结构
mkdir -p assets/{css,js,images,fonts}
mkdir -p inc
mkdir -p template-parts
mkdir -p templates

# 3. 设置文件权限
chmod -R 755 .
chown -R www-data:www-data .

# 4. 在 WordPress 后台激活主题
# Appearance → Themes → Activate "Cyberpunk Theme"
```

---

## 📁 目录结构设置

### Step 1: 创建模块化目录结构

```bash
wordpress-cyber-theme/
├── assets/
│   ├── css/
│   │   ├── admin.css
│   │   ├── editor.css
│   │   └── custom.css
│   ├── js/
│   │   ├── main.js
│   │   ├── admin.js
│   │   └── ajax.js
│   └── images/
├── inc/
│   ├── customizer.php
│   ├── options-page.php
│   ├── ajax-handlers.php
│   ├── custom-post-types.php
│   ├── rest-api.php
│   ├── widgets.php
│   ├── shortcodes.php
│   └── performance.php
├── template-parts/
│   ├── content-card.php
│   ├── navigation.php
│   └── pagination.php
└── templates/
    ├── template-hero.php
    └── template-grid.php
```

### Step 2: 更新 functions.php

在现有的 `functions.php` 文件末尾添加：

```php
/**
 * Load theme files
 */
function cyberpunk_theme_files() {
    // Customizer
    require_once get_template_directory() . '/inc/customizer.php';

    // AJAX Handlers
    require_once get_template_directory() . '/inc/ajax-handlers.php';

    // Custom Post Types
    require_once get_template_directory() . '/inc/custom-post-types.php';

    // REST API
    require_once get_template_directory() . '/inc/rest-api.php';

    // Widgets
    require_once get_template_directory() . '/inc/widgets.php';

    // Shortcodes
    require_once get_template_directory() . '/inc/shortcodes.php';

    // Performance
    require_once get_template_directory() . '/inc/performance.php';
}
add_action('after_setup_theme', 'cyberpunk_theme_files');
```

---

## 🔧 核心功能实施

### 优先级 P0 (必须)

#### 1. 主题定制器

创建文件: `inc/customizer.php`

```php
<?php
/**
 * Theme Customizer
 */

function cyberpunk_customize_register($wp_customize) {
    // 添加面板
    $wp_customize->add_panel('cyberpunk_options', array(
        'title' => __('Cyberpunk Options', 'cyberpunk'),
        'priority' => 10,
    ));

    // 颜色设置
    $wp_customize->add_section('cyberpunk_colors', array(
        'title' => __('Colors', 'cyberpunk'),
        'panel' => 'cyberpunk_options',
    ));

    // 主色调
    $wp_customize->add_setting('primary_color', array(
        'default' => '#00f0ff',
        'sanitize_callback' => 'sanitize_hex_color',
    ));

    $wp_customize->add_control(new WP_Customize_Color_Control(
        $wp_customize,
        'primary_color',
        array(
            'label' => __('Primary Color', 'cyberpunk'),
            'section' => 'cyberpunk_colors',
        )
    ));
}
add_action('customize_register', 'cyberpunk_customize_register');

// 输出自定义 CSS
function cyberpunk_customizer_css() {
    ?>
    <style type="text/css">
        :root {
            --neon-cyan: <?php echo esc_attr(get_theme_mod('primary_color', '#00f0ff')); ?>;
        }
    </style>
    <?php
}
add_action('wp_head', 'cyberpunk_customizer_css');
```

#### 2. AJAX 支持

创建文件: `inc/ajax-handlers.php`

```php
<?php
/**
 * AJAX Handlers
 */

// 加载更多文章
function cyberpunk_load_more() {
    check_ajax_referer('cyberpunk_nonce', 'nonce');

    $paged = isset($_POST['page']) ? intval($_POST['page']) : 1;

    $args = array(
        'post_type' => 'post',
        'paged' => $paged,
        'posts_per_page' => 6,
    );

    $query = new WP_Query($args);

    if ($query->have_posts()) {
        ob_start();
        while ($query->have_posts()) {
            $query->the_post();
            get_template_part('template-parts/content', 'card');
        }
        $html = ob_get_clean();

        wp_send_json_success(array('html' => $html));
    }

    wp_die();
}
add_action('wp_ajax_load_more', 'cyberpunk_load_more');
add_action('wp_ajax_nopriv_load_more', 'cyberpunk_load_more');
```

### 优先级 P1 (重要)

#### 3. 自定义文章类型

创建文件: `inc/custom-post-types.php`

```php
<?php
/**
 * Custom Post Types
 */

function cyberpunk_register_cpts() {
    // Portfolio
    register_post_type('portfolio', array(
        'labels' => array(
            'name' => __('Portfolio', 'cyberpunk'),
            'singular_name' => __('Portfolio Item', 'cyberpunk'),
        ),
        'public' => true,
        'has_archive' => true,
        'menu_icon' => 'dashicons-art',
        'supports' => array('title', 'editor', 'thumbnail'),
        'show_in_rest' => true,
    ));
}
add_action('init', 'cyberpunk_register_cpts');
```

#### 4. 性能优化

创建文件: `inc/performance.php`

```php
<?php
/**
 * Performance Optimization
 */

// 禁用 Emoji
function cyberpunk_disable_emojis() {
    remove_action('wp_head', 'print_emoji_detection_script', 7);
    remove_action('wp_print_styles', 'print_emoji_styles');
}
add_action('init', 'cyberpunk_disable_emojis');

// 移除不必要的脚本
function cyberpunk_clean_head() {
    remove_action('wp_head', 'wp_generator');
    remove_action('wp_head', 'wlwmanifest_link');
    remove_action('wp_head', 'rsd_link');
}
add_action('init', 'cyberpunk_clean_head');

// 延迟加载脚本
function cyberpunk_defer_scripts($tag, $handle) {
    $defer = array('cyberpunk-main');

    if (in_array($handle, $defer)) {
        return str_replace(' src', ' defer src', $tag);
    }

    return $tag;
}
add_filter('script_loader_tag', 'cyberpunk_defer_scripts', 10, 2);
```

---

## 💻 代码示例

### 示例 1: 模板组件

创建文件: `template-parts/content-card.php`

```php
<?php
/**
 * Content Card Template Part
 */

$classes = array('post-card', 'cyberpunk-card');
?>

<article id="post-<?php the_ID(); ?>" <?php post_class($classes); ?>>
    <?php if (has_post_thumbnail()) : ?>
        <div class="post-thumbnail">
            <a href="<?php the_permalink(); ?>">
                <?php the_post_thumbnail('cyberpunk-card'); ?>
            </a>
        </div>
    <?php endif; ?>

    <div class="post-content">
        <header class="entry-header">
            <?php
            the_title('<h2 class="entry-title"><a href="' . esc_url(get_permalink()) . '">', '</a></h2>');
            ?>
        </header>

        <div class="entry-meta">
            <span class="posted-on">
                <time datetime="<?php echo get_the_date('c'); ?>">
                    <?php echo get_the_date(); ?>
                </time>
            </span>
        </div>

        <div class="entry-content">
            <?php the_excerpt(); ?>
        </div>

        <a href="<?php the_permalink(); ?>" class="read-more-btn">
            <?php _e('Read More', 'cyberpunk'); ?>
        </a>
    </div>
</article>
```

### 示例 2: AJAX 脚本

创建文件: `assets/js/ajax.js`

```javascript
/**
 * Cyberpunk AJAX Functions
 */

(function($) {
    'use strict';

    // Load More Posts
    $('.load-more-btn').on('click', function(e) {
        e.preventDefault();

        var $btn = $(this);
        var page = $btn.data('page') + 1;
        var postsContainer = $('.posts-grid');

        $btn.text('Loading...');

        $.ajax({
            url: cyberpunkAjax.ajaxurl,
            type: 'POST',
            data: {
                action: 'cyberpunk_load_more',
                nonce: cyberpunkAjax.nonce,
                page: page
            },
            success: function(response) {
                if (response.success) {
                    postsContainer.append(response.data.html);
                    $btn.data('page', page);
                    $btn.text('Load More');
                } else {
                    $btn.text('No More Posts');
                }
            },
            error: function() {
                $btn.text('Error. Try Again.');
            }
        });
    });

    // Live Search
    $('#search-input').on('keyup', function() {
        var query = $(this).val();
        var resultsContainer = $('.search-results');

        if (query.length < 3) {
            resultsContainer.empty();
            return;
        }

        $.ajax({
            url: cyberpunkAjax.ajaxurl,
            type: 'POST',
            data: {
                action: 'cyberpunk_live_search',
                nonce: cyberpunkAjax.nonce,
                query: query
            },
            success: function(response) {
                if (response.success) {
                    var html = '';
                    $.each(response.data.results, function(i, post) {
                        html += '<div class="search-result-item">';
                        html += '<a href="' + post.permalink + '">' + post.title + '</a>';
                        html += '</div>';
                    });
                    resultsContainer.html(html);
                }
            }
        });
    });

})(jQuery);
```

### 示例 3: 管理后台样式

创建文件: `assets/css/admin.css`

```css
/**
 * Cyberpunk Admin Styles
 */

/* Customizer Panel */
.wp-customizer .cyberpunk-options {
    background: #0a0a0f;
    color: #00f0ff;
    font-family: 'Courier New', monospace;
}

/* Color Picker */
.wp-picker-container .wp-color-result.button {
    border: 2px solid #00f0ff;
    box-shadow: 0 0 10px rgba(0, 240, 255, 0.5);
}

/* Admin Menu */
#adminmenu .toplevel_page_cyberpunk-options {
    background: linear-gradient(90deg, #0a0a0f, #1a1a2e);
}

#adminmenu .toplevel_page_cyberpunk-options .wp-menu-image {
    color: #00f0ff;
}
```

---

## 🧪 测试指南

### 单元测试

创建文件: `tests/test-theme-functions.php`

```php
<?php
/**
 * Theme Functions Tests
 */

class CyberpunkThemeTests extends WP_UnitTestCase {

    /**
     * Test theme setup
     */
    public function test_theme_setup() {
        $this->assertTrue(theme_supports('title-tag'));
        $this->assertTrue(theme_supports('post-thumbnails'));
    }

    /**
     * Test customizer settings
     */
    public function test_customizer_settings() {
        $color = get_theme_mod('primary_color', '#00f0ff');
        $this->assertEquals('#00f0ff', $color);
    }

    /**
     * Test AJAX endpoint
     */
    public function test_ajax_load_more() {
        // Create test posts
        $this->factory->post->create_many(5);

        // Make AJAX request
        try {
            $this->_handleAjax('cyberpunk_load_more');
        } catch (WPAjaxDieStopException $e) {
            // Expected
        }

        $response = json_decode($this->_last_response, true);
        $this->assertTrue($response['success']);
    }
}
```

### 手动测试清单

```markdown
## 测试清单

### Frontend
- [ ] 首页正常显示
- [ ] 文章列表正常显示
- [ ] 单篇文章正常显示
- [ ] 评论功能正常
- [ ] 搜索功能正常
- [ ] 侧边栏正常显示
- [ ] 响应式设计正常

### Backend
- [ ] 主题选项面板正常
- [ ] 自定义器保存设置
- [ ] AJAX 加载文章
- [ ] 自定义文章类型
- [ ] REST API 端点

### Performance
- [ ] 页面加载速度 < 2s
- [ ] 图片懒加载工作
- [ ] CSS/JS 压缩
- [ ] 缓存功能正常

### Security
- [ ] CSRF 保护
- [ ] XSS 防护
- [ ] 数据清理正常
- [ ] Nonce 验证
```

---

## 🚀 部署清单

### 生产环境检查

```yaml
Pre-Deployment:
  - [ ] 备份数据库
  - [ ] 备份现有主题文件
  - [ ] 测试环境验证
  - [ ] 性能测试通过
  - [ ] 安全扫描通过

Deployment:
  - [ ] 上传主题文件
  - [ ] 激活主题
  - [ ] 清除缓存
  - [ ] 测试核心功能
  - [ ] 检查错误日志

Post-Deployment:
  - [ ] 监控性能指标
  - [ ] 检查 404 错误
  - [ ] 验证 SEO 元数据
  - [ ] 测试表单提交
  - [ ] 备份新版本
```

### 部署脚本

```bash
#!/bin/bash
# deploy.sh

echo "🚀 Starting deployment..."

# Backup
echo "📦 Creating backup..."
wp db export backup-$(date +%Y%m%d).sql --path=/path/to/wordpress

# Upload files
echo "📤 Uploading files..."
rsync -avz --delete \
  --exclude='.git' \
  --exclude='node_modules' \
  ./ user@server:/path/to/themes/wordpress-cyber-theme/

# Clear cache
echo "🧹 Clearing cache..."
wp cache flush --path=/path/to/wordpress

# Health check
echo "🏥 Health check..."
curl -I https://yoursite.com

echo "✅ Deployment complete!"
```

---

## 📊 性能基准

### 目标指标

```yaml
Page Load:
  Time to Interactive: < 3s
  First Contentful Paint: < 1.5s
  Largest Contentful Paint: < 2.5s

Resource Optimization:
  CSS Size: < 50KB
  JS Size: < 100KB
  Images: WebP format

Caching:
  Page Cache: Hit rate > 90%
  Object Cache: Hit rate > 80%
```

### 监控工具推荐

1. **Query Monitor** - WordPress 调试
2. **New Relic** - 应用性能监控
3. **Google PageSpeed Insights** - 页面性能
4. **GTmetrix** - 详细性能报告

---

## 🆘 常见问题

### 问题 1: AJAX 返回 400 错误

```php
// 检查 nonce
add_action('wp_ajax_my_action', 'my_ajax_handler');
add_action('wp_ajax_nopriv_my_action', 'my_ajax_handler');

// 确保传递 nonce
check_ajax_referer('cyberpunk_nonce', 'nonce');
```

### 问题 2: 自定义器设置不生效

```php
// 检查传输方式
$wp_customize->add_setting('my_setting', array(
    'transport' => 'refresh', // 或 'postMessage'
));

// 确保输出 CSS
add_action('wp_head', 'output_customizer_css');
```

### 问题 3: 性能优化后样式混乱

```css
/* 检查 CSS 加载顺序 */
/* 确保 critical CSS 内联 */
/* 非关键 CSS 异步加载 */
```

---

## 📚 资源链接

### 官方文档
- [WordPress Theme Handbook](https://developer.wordpress.org/themes/)
- [Plugin Developer Handbook](https://developer.wordpress.org/plugins/)
- [REST API Handbook](https://developer.wordpress.org/rest-api/)

### 工具
- [WordPress Plugin Directory](https://wordpress.org/plugins/)
- [Theme Shaper](https://themeshaper.com/)
- [GenerateWP](https://generatewp.com/)

---

**版本**: 1.0.0
**最后更新**: 2026-02-28
**状态**: ✅ Ready for Development
