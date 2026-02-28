# 🚀 Phase 2.2 - Widget 系统快速开始指南

> **开发者实战指南**
> **版本**: 2.3.0
> **日期**: 2026-03-01
> **开发周期**: 2 天 (16 小时)

---

## 📋 开发前检查清单

### 环境要求

```yaml
WordPress:
  版本: ≥ 6.4
  状态: ✅ 已安装

PHP:
  版本: ≥ 8.0
  状态: ✅ 已配置

开发工具:
  VS Code: ✅ 推荐
  Chrome DevTools: ✅ 必需
  WordPress 环境: ✅ 必需

主题版本:
  当前: 2.2.0
  目标: 2.3.0
```

### 当前状态

```yaml
✅ Phase 1 完成 (基础模板)
✅ Phase 2.1 完成 (AJAX + 前端交互)
🔄 Phase 2.2 开始 (Widget 系统)
⏳ Phase 2.3 待开发 (短代码系统)
```

---

## 🎯 Day 6: 基础 Widget 开发 (8 小时)

### 任务概览

```yaml
上午任务 (4h):
  ✅ 1. 创建 Widget 目录结构 (30min)
  ✅ 2. 实现关于我 Widget (2h)
  ✅ 3. 添加 Widget 样式 (1h)
  ✅ 4. 基础测试 (30min)

下午任务 (4h):
  ✅ 5. 实现最新文章 Widget (2h)
  ✅ 6. 添加缩略图支持 (1h)
  ✅ 7. 完整测试 (1h)
```

---

## 📝 Day 6 详细步骤

### 步骤 1: 创建文件结构 (30 分钟)

#### 1.1 创建目录

```bash
# 进入主题目录
cd /root/.openclaw/workspace/wordpress-cyber-theme

# 创建 Widget 目录
mkdir -p inc/widgets
mkdir -p assets/css
mkdir -p assets/js

# 验证目录创建
ls -la inc/
ls -la assets/
```

#### 1.2 创建文件

```bash
# 创建 Widget 文件
touch inc/widgets/class-about-me-widget.php
touch inc/widgets/class-recent-posts-widget.php

# 创建样式文件
touch assets/css/widget-styles.css

# 创建 JavaScript 文件
touch assets/js/widget-admin.js
touch assets/js/widgets.js

# 验证文件创建
ls -la inc/widgets/
ls -la assets/css/
ls -la assets/js/
```

#### 1.3 更新 functions.php

在 `functions.php` 文件末尾添加：

```php
/**
 * Load Widget Files
 * Version 2.3.0
 */
function cyberpunk_load_widgets() {
    // About Me Widget
    require_once get_template_directory() . '/inc/widgets/class-about-me-widget.php';

    // Recent Posts Widget
    require_once get_template_directory() . '/inc/widgets/class-recent-posts-widget.php';
}
add_action('after_setup_theme', 'cyberpunk_load_widgets');

/**
 * Enqueue Widget Styles
 */
function cyberpunk_widget_styles() {
    wp_enqueue_style(
        'cyberpunk-widget-styles',
        get_template_directory_uri() . '/assets/css/widget-styles.css',
        array(),
        '2.3.0'
    );

    // Widget JavaScript
    wp_enqueue_script(
        'cyberpunk-widget-scripts',
        get_template_directory_uri() . '/assets/js/widgets.js',
        array('jquery'),
        '2.3.0',
        true
    );

    // Localize script
    wp_localize_script('cyberpunk-widget-scripts', 'cyberpunkWidget', array(
        'ajaxUrl' => admin_url('admin-ajax.php'),
        'nonce' => wp_create_nonce('cyberpunk-widget-nonce'),
    ));
}
add_action('wp_enqueue_scripts', 'cyberpunk_widget_styles');

/**
 * Enqueue Admin Widget Scripts
 */
function cyberpunk_widget_admin_scripts($hook) {
    if ('widgets.php' !== $hook) {
        return;
    }

    wp_enqueue_media();

    wp_enqueue_script(
        'cyberpunk-widget-admin',
        get_template_directory_uri() . '/assets/js/widget-admin.js',
        array('jquery'),
        '2.3.0',
        true
    );
}
add_action('admin_enqueue_scripts', 'cyberpunk_widget_admin_scripts');
```

---

### 步骤 2: 实现关于我 Widget (2 小时)

#### 2.1 创建 About Me Widget

**文件**: `inc/widgets/class-about-me-widget.php`

完整代码见技术设计文档，这里提供核心部分：

```php
<?php
/**
 * Cyberpunk About Me Widget
 *
 * @package WordPress_Cyberpunk_Theme
 * @since 2.3.0
 */

if (!defined('ABSPATH')) {
    exit;
}

class Cyberpunk_About_Me_Widget extends WP_Widget {

    /**
     * Constructor
     */
    public function __construct() {
        parent::__construct(
            'cyberpunk_about_me',
            __('Cyberpunk About Me', 'cyberpunk-theme'),
            array(
                'description' => __('Display author information with cyberpunk style', 'cyberpunk-theme'),
                'classname' => 'cyberpunk-widget-about-me',
                'customize_selective_refresh' => true,
            )
        );
    }

    /**
     * Frontend Display
     */
    public function widget($args, $instance) {
        echo $args['before_widget'];

        // Title
        if (!empty($instance['title'])) {
            echo $args['before_title'] . apply_filters('widget_title', $instance['title']) . $args['after_title'];
        }

        // Avatar
        $avatar_url = !empty($instance['avatar']) ? $instance['avatar'] : get_avatar_url(get_option('admin_email'));

        // Widget Content
        ?>
        <div class="cyberpunk-about-me-widget">
            <?php if ($avatar_url) : ?>
                <div class="about-me-avatar">
                    <img src="<?php echo esc_url($avatar_url); ?>"
                         alt="<?php esc_attr_e('Author Avatar', 'cyberpunk-theme'); ?>"
                         loading="lazy">
                </div>
            <?php endif; ?>

            <?php if (!empty($instance['biography'])) : ?>
                <div class="about-me-bio">
                    <?php echo wp_kses_post($instance['biography']); ?>
                </div>
            <?php endif; ?>

            <?php if (!empty($instance['show_email']) || !empty($instance['show_location'])) : ?>
                <div class="about-me-details">
                    <?php if (!empty($instance['show_email'])) : ?>
                        <div class="about-me-item">
                            <span class="cyber-icon">📧</span>
                            <a href="mailto:<?php echo esc_attr(get_option('admin_email')); ?>">
                                <?php esc_html_e('Email', 'cyberpunk-theme'); ?>
                            </a>
                        </div>
                    <?php endif; ?>

                    <?php if (!empty($instance['location'])) : ?>
                        <div class="about-me-item">
                            <span class="cyber-icon">📍</span>
                            <span><?php echo esc_html($instance['location']); ?></span>
                        </div>
                    <?php endif; ?>
                </div>
            <?php endif; ?>

            <?php
            // Social Links
            $social_platforms = array('facebook', 'twitter', 'instagram', 'github');
            $has_social = false;

            foreach ($social_platforms as $platform) {
                if (!empty($instance[$platform])) {
                    $has_social = true;
                    break;
                }
            }

            if ($has_social) :
            ?>
                <div class="about-me-social">
                    <?php foreach ($social_platforms as $platform) :
                        if (!empty($instance[$platform])) :
                            $icons = array(
                                'facebook' => 'fab fa-facebook-f',
                                'twitter' => 'fab fa-twitter',
                                'instagram' => 'fab fa-instagram',
                                'github' => 'fab fa-github',
                            );
                    ?>
                        <a href="<?php echo esc_url($instance[$platform]); ?>"
                           class="social-link social-<?php echo esc_attr($platform); ?>"
                           target="_blank"
                           rel="noopener noreferrer">
                            <i class="<?php echo esc_attr($icons[$platform]); ?>"></i>
                        </a>
                    <?php
                        endif;
                    endforeach; ?>
                </div>
            <?php endif; ?>
        </div>
        <?php

        echo $args['after_widget'];
    }

    /**
     * Backend Form
     */
    public function form($instance) {
        $defaults = array(
            'title' => __('About Me', 'cyberpunk-theme'),
            'avatar' => '',
            'biography' => '',
            'location' => '',
            'show_email' => true,
            'facebook' => '',
            'twitter' => '',
            'instagram' => '',
            'github' => '',
        );

        $instance = wp_parse_args((array) $instance, $defaults);

        // Output form fields...
        ?>
        <p>
            <label for="<?php echo $this->get_field_id('title'); ?>">
                <?php esc_html_e('Title:', 'cyberpunk-theme'); ?>
            </label>
            <input class="widefat"
                   id="<?php echo $this->get_field_id('title'); ?>"
                   name="<?php echo $this->get_field_name('title'); ?>"
                   type="text"
                   value="<?php echo esc_attr($instance['title']); ?>">
        </p>

        <!-- More form fields... -->
        <?php
    }

    /**
     * Save Settings
     */
    public function update($new_instance, $old_instance) {
        $instance = array();

        $instance['title'] = sanitize_text_field($new_instance['title']);
        $instance['avatar'] = esc_url_raw($new_instance['avatar']);
        $instance['biography'] = wp_kses_post($new_instance['biography']);
        $instance['location'] = sanitize_text_field($new_instance['location']);
        $instance['show_email'] = !empty($new_instance['show_email']);

        // Sanitize social links
        $social_platforms = array('facebook', 'twitter', 'instagram', 'github');
        foreach ($social_platforms as $platform) {
            $instance[$platform] = esc_url_raw($new_instance[$platform]);
        }

        return $instance;
    }
}

// Register Widget
function register_cyberpunk_about_me_widget() {
    register_widget('Cyberpunk_About_Me_Widget');
}
add_action('widgets_init', 'register_cyberpunk_about_me_widget');
```

#### 2.2 测试 About Me Widget

```bash
# 1. 登录 WordPress 后台
# URL: http://localhost/wp-admin

# 2. 导航到 外观 → Widget

# 3. 拖拽 "Cyberpunk About Me" Widget 到侧边栏

# 4. 配置选项:
#    - Title: About Me
#    - Avatar: 上传图片或留空使用 Gravatar
#    - Biography: 写一段简介
#    - Location: 你的位置
#    - Social Links: 添加社交媒体链接

# 5. 点击 "保存"

# 6. 访问前端查看效果
# URL: http://localhost/
```

---

### 步骤 3: 添加 Widget 样式 (1 小时)

#### 3.1 创建样式文件

**文件**: `assets/css/widget-styles.css`

```css
/**
 * Cyberpunk Widget Styles
 * Version: 2.3.0
 */

/* CSS Variables */
:root {
    --neon-cyan: #00f0ff;
    --neon-magenta: #ff00ff;
    --neon-yellow: #f0ff00;
    --bg-dark: #0a0a0f;
    --bg-card: #12121a;
    --bg-input: #1a1a24;
    --text-primary: #e0e0e0;
    --text-secondary: #a0a0b0;
    --text-muted: #707080;
    --border-color: #2a2a3a;
    --border-radius: 8px;
}

/* ============================================
   About Me Widget
   ============================================ */

.cyberpunk-widget-about-me {
    position: relative;
    padding: 24px;
    background: var(--bg-card);
    border: 1px solid var(--border-color);
    border-radius: var(--border-radius);
    overflow: hidden;
}

/* Neon Border Effect */
.cyberpunk-widget-about-me::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 2px;
    background: linear-gradient(90deg,
        var(--neon-cyan) 0%,
        var(--neon-magenta) 50%,
        var(--neon-yellow) 100%);
    animation: border-flow 3s linear infinite;
}

@keyframes border-flow {
    0% { background-position: 0% 50%; }
    100% { background-position: 200% 50%; }
}

/* Avatar */
.about-me-avatar {
    text-align: center;
    margin-bottom: 16px;
}

.about-me-avatar img {
    width: 120px;
    height: 120px;
    border-radius: 50%;
    border: 3px solid var(--neon-cyan);
    box-shadow: 0 0 20px rgba(0, 240, 255, 0.5);
    transition: all 0.3s ease;
}

.about-me-avatar img:hover {
    transform: scale(1.05);
    box-shadow: 0 0 30px rgba(0, 240, 255, 0.8);
}

/* Biography */
.about-me-bio {
    color: var(--text-primary);
    line-height: 1.6;
    margin-bottom: 16px;
    font-size: 16px;
}

/* Details */
.about-me-details {
    display: flex;
    flex-direction: column;
    gap: 8px;
    margin-bottom: 16px;
}

.about-me-item {
    display: flex;
    align-items: center;
    gap: 8px;
    color: var(--text-secondary);
    font-size: 14px;
    transition: all 0.2s ease;
}

.about-me-item:hover {
    color: var(--neon-cyan);
    transform: translateX(5px);
}

.about-me-item a {
    color: inherit;
    text-decoration: none;
}

.about-me-item a:hover {
    text-shadow: 0 0 10px var(--neon-cyan);
}

/* Social Links */
.about-me-social {
    display: flex;
    gap: 8px;
    flex-wrap: wrap;
}

.social-link {
    width: 36px;
    height: 36px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: var(--bg-input);
    border: 1px solid var(--border-color);
    border-radius: 4px;
    color: var(--text-secondary);
    font-size: 16px;
    transition: all 0.3s ease;
}

.social-link:hover {
    transform: translateY(-3px);
    box-shadow: 0 5px 15px rgba(0, 240, 255, 0.4);
}

.social-facebook:hover {
    border-color: #1877f2;
    color: #1877f2;
}

.social-twitter:hover {
    border-color: #1da1f2;
    color: #1da1f2;
}

.social-instagram:hover {
    border-color: #e4405f;
    color: #e4405f;
}

.social-github:hover {
    border-color: #333;
    color: #fff;
}

/* Responsive */
@media (max-width: 768px) {
    .about-me-avatar img {
        width: 100px;
        height: 100px;
    }

    .about-me-social {
        justify-content: center;
    }
}
```

#### 3.2 验证样式

```bash
# 1. 刷新前端页面
# 2. 检查 Chrome DevTools:
#    - Elements 面板检查 CSS 是否加载
#    - Network 面板检查 widget-styles.css 是否加载
# 3. 验证效果:
#    - 霓虹边框动画
#    - 头像悬停效果
#    - 社交链接悬停效果
```

---

### 步骤 4: 基础测试 (30 分钟)

#### 4.1 功能测试清单

```yaml
About Me Widget:
  ✅ Widget 在后台可见
  ✅ 可以添加到侧边栏
  ✅ 表单字段正常显示
  ✅ 数据可以保存
  ✅ 前端正常显示
  ✅ 头像显示正确
  ✅ 社交链接可点击
  ✅ 样式加载正确
  ✅ 响应式正常
  ✅ 动画流畅

浏览器测试:
  ✅ Chrome
  ✅ Firefox
  ✅ Safari (可选)
  ✅ Edge (可选)

响应式测试:
  ✅ Desktop (1920x1080)
  ✅ Laptop (1366x768)
  ✅ Tablet (768x1024)
  ✅ Mobile (375x667)
```

#### 4.2 性能测试

```bash
# 使用 Chrome DevTools
# 1. Performance 面板录制页面加载
# 2. 检查 Widget 渲染时间
# 3. 验证内存使用

# 目标:
# - 渲染时间: < 50ms
# - 内存占用: < 2MB
```

---

### 步骤 5: 实现最新文章 Widget (2 小时)

#### 5.1 创建 Recent Posts Widget

**文件**: `inc/widgets/class-recent-posts-widget.php`

完整代码见技术设计文档。

#### 5.2 测试 Recent Posts Widget

```bash
# 1. 添加 Widget 到侧边栏
# 2. 配置选项:
#    - Title: Recent Posts
#    - Number: 5
#    - Show Thumbnail: ✓
#    - Show Date: ✓
#    - Show Excerpt: ✓

# 3. 访问前端查看效果
# 4. 测试不同配置组合
```

---

### 步骤 6: 添加缩略图支持 (1 小时)

#### 6.1 添加缩略图样式

```css
/* Recent Posts Widget - Thumbnail */
.recent-post-thumbnail {
    flex-shrink: 0;
    width: 80px;
    height: 80px;
    border-radius: var(--border-radius);
    overflow: hidden;
    border: 2px solid var(--border-color);
    transition: all 0.3s ease;
}

.recent-post:hover .recent-post-thumbnail {
    border-color: var(--neon-cyan);
    box-shadow: 0 0 15px rgba(0, 240, 255, 0.5);
}

.recent-post-img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform 0.3s ease;
}

.recent-post:hover .recent-post-img {
    transform: scale(1.1);
}
```

---

### 步骤 7: 完整测试 (1 小时)

#### 7.1 综合测试清单

```yaml
功能测试:
  ✅ 两个 Widget 都可以添加
  ✅ 配置选项都能正常保存
  ✅ 前端显示正确
  ✅ 缩略图显示正常
  ✅ 响应式布局正常

样式测试:
  ✅ 霓虹边框效果
  ✅ 悬停动画流畅
  ✅ 颜色符合主题
  ✅ 移动端适配

性能测试:
  ✅ 渲染时间 < 50ms
  ✅ 无内存泄漏
  ✅ 无控制台错误
```

---

## 🎯 Day 7: 高级 Widget 开发 (8 小时)

### 任务概览

```yaml
上午任务 (4h):
  ✅ 1. 实现社交链接 Widget (2h)
  ✅ 2. 实现热门文章 Widget (2h)

下午任务 (4h):
  ✅ 3. 完善样式和动画 (1h)
  ✅ 4. 添加 JavaScript 交互 (1h)
  ✅ 5. 综合测试 (2h)
```

---

## 📝 Day 7 详细步骤

### 步骤 1: 实现社交链接 Widget (2 小时)

**文件**: `inc/widgets/class-social-links-widget.php`

```php
<?php
/**
 * Cyberpunk Social Links Widget
 *
 * @package WordPress_Cyberpunk_Theme
 * @since 2.3.0
 */

if (!defined('ABSPATH')) {
    exit;
}

class Cyberpunk_Social_Links_Widget extends WP_Widget {

    public function __construct() {
        parent::__construct(
            'cyberpunk_social_links',
            __('Cyberpunk Social Links', 'cyberpunk-theme'),
            array(
                'description' => __('Display social media links with cyberpunk style', 'cyberpunk-theme'),
                'classname' => 'cyberpunk-widget-social-links',
            )
        );
    }

    public function widget($args, $instance) {
        echo $args['before_widget'];

        if (!empty($instance['title'])) {
            echo $args['before_title'] . apply_filters('widget_title', $instance['title']) . $args['after_title'];
        }

        $social_platforms = array(
            'facebook' => array('icon' => 'fab fa-facebook-f', 'color' => '#1877f2'),
            'twitter' => array('icon' => 'fab fa-twitter', 'color' => '#1da1f2'),
            'instagram' => array('icon' => 'fab fa-instagram', 'color' => '#e4405f'),
            'linkedin' => array('icon' => 'fab fa-linkedin-in', 'color' => '#0077b5'),
            'github' => array('icon' => 'fab fa-github', 'color' => '#333'),
            'discord' => array('icon' => 'fab fa-discord', 'color' => '#5865f2'),
        );

        ?>
        <div class="cyberpunk-social-links-widget">
            <div class="social-links-grid">
                <?php foreach ($social_platforms as $platform => $data) :
                    if (!empty($instance[$platform])) :
                        ?>
                        <a href="<?php echo esc_url($instance[$platform]); ?>"
                           class="social-link-card social-<?php echo esc_attr($platform); ?>"
                           target="_blank"
                           rel="noopener noreferrer"
                           style="--social-color: <?php echo esc_attr($data['color']); ?>;">
                            <i class="<?php echo esc_attr($data['icon']); ?>"></i>
                        </a>
                    <?php
                    endif;
                endforeach; ?>
            </div>
        </div>
        <?php

        echo $args['after_widget'];
    }

    public function form($instance) {
        $defaults = array(
            'title' => __('Follow Me', 'cyberpunk-theme'),
            'facebook' => '',
            'twitter' => '',
            'instagram' => '',
            'linkedin' => '',
            'github' => '',
            'discord' => '',
        );

        $instance = wp_parse_args((array) $instance, $defaults);

        // Form fields...
    }

    public function update($new_instance, $old_instance) {
        $instance = array();
        $instance['title'] = sanitize_text_field($new_instance['title']);

        $social_platforms = array('facebook', 'twitter', 'instagram', 'linkedin', 'github', 'discord');
        foreach ($social_platforms as $platform) {
            $instance[$platform] = esc_url_raw($new_instance[$platform]);
        }

        return $instance;
    }
}

function register_cyberpunk_social_links_widget() {
    register_widget('Cyberpunk_Social_Links_Widget');
}
add_action('widgets_init', 'register_cyberpunk_social_links_widget');
```

---

### 步骤 2: 实现热门文章 Widget (2 小时)

**文件**: `inc/widgets/class-popular-posts-widget.php`

```php
<?php
/**
 * Cyberpunk Popular Posts Widget
 *
 * @package WordPress_Cyberpunk_Theme
 * @since 2.3.0
 */

if (!defined('ABSPATH')) {
    exit;
}

class Cyberpunk_Popular_Posts_Widget extends WP_Widget {

    public function __construct() {
        parent::__construct(
            'cyberpunk_popular_posts',
            __('Cyberpunk Popular Posts', 'cyberpunk-theme'),
            array(
                'description' => __('Display popular posts with cyberpunk style', 'cyberpunk-theme'),
                'classname' => 'cyberpunk-widget-popular-posts',
            )
        );
    }

    public function widget($args, $instance) {
        echo $args['before_widget'];

        if (!empty($instance['title'])) {
            echo $args['before_title'] . apply_filters('widget_title', $instance['title']) . $args['after_title'];
        }

        $number = !empty($instance['number']) ? absint($instance['number']) : 5;
        $time_range = !empty($instance['time_range']) ? $instance['time_range'] : 'all';

        $args = array(
            'post_type' => 'post',
            'post_status' => 'publish',
            'posts_per_page' => $number,
            'meta_key' => 'post_views_count',
            'orderby' => 'meta_value_num',
            'order' => 'DESC',
            'ignore_sticky_posts' => true,
        );

        if ($time_range !== 'all') {
            $date_query = array(
                array(
                    'after' => $time_range === 'week' ? '1 week ago' : '1 month ago',
                ),
            );
            $args['date_query'] = $date_query;
        }

        $posts = new WP_Query($args);

        if ($posts->have_posts()) :
            ?>

            <div class="cyberpunk-popular-posts-widget">
                <ul class="popular-posts-list">
                    <?php
                    $rank = 1;
                    while ($posts->have_posts()) : $posts->the_post();
                        ?>
                        <li class="popular-post-item" data-rank="<?php echo esc_attr($rank); ?>">
                            <div class="post-rank"><?php echo esc_html($rank); ?></div>
                            <div class="post-content">
                                <h3 class="post-title">
                                    <a href="<?php the_permalink(); ?>"><?php the_title(); ?></a>
                                </h3>
                                <?php if (!empty($instance['show_views'])) : ?>
                                    <div class="post-views">
                                        <?php echo esc_html(get_post_meta(get_the_ID(), 'post_views_count', true)); ?> views
                                    </div>
                                <?php endif; ?>
                            </div>
                        </li>
                        <?php
                        $rank++;
                    endwhile;
                    ?>
                </ul>
            </div>

            <?php
        endif;

        wp_reset_postdata();

        echo $args['after_widget'];
    }

    public function form($instance) {
        // Form implementation
    }

    public function update($new_instance, $old_instance) {
        $instance = array();
        $instance['title'] = sanitize_text_field($new_instance['title']);
        $instance['number'] = absint($new_instance['number']);
        $instance['time_range'] = sanitize_text_field($new_instance['time_range']);
        $instance['show_views'] = !empty($new_instance['show_views']);

        return $instance;
    }
}

function register_cyberpunk_popular_posts_widget() {
    register_widget('Cyberpunk_Popular_Posts_Widget');
}
add_action('widgets_init', 'register_cyberpunk_popular_posts_widget');
```

---

### 步骤 3-5: 完善和测试 (4 小时)

#### 样式优化

```css
/* Social Links Widget */
.cyberpunk-social-links-widget {
    position: relative;
    padding: 24px;
}

.social-links-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(60px, 1fr));
    gap: 12px;
}

.social-link-card {
    width: 60px;
    height: 60px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: var(--bg-input);
    border: 2px solid var(--border-color);
    border-radius: 8px;
    color: var(--text-secondary);
    font-size: 24px;
    transition: all 0.3s ease;
    position: relative;
    overflow: hidden;
}

.social-link-card::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: var(--social-color);
    opacity: 0;
    transition: opacity 0.3s ease;
}

.social-link-card:hover::before {
    opacity: 0.2;
}

.social-link-card:hover {
    border-color: var(--social-color);
    color: var(--social-color);
    transform: translateY(-5px) scale(1.05);
    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.3), 0 0 20px var(--social-color);
}

/* Popular Posts Widget */
.cyberpunk-popular-posts-widget {
    position: relative;
    padding: 24px;
}

.popular-posts-list {
    list-style: none;
    margin: 0;
    padding: 0;
}

.popular-post-item {
    display: flex;
    gap: 16px;
    padding: 12px;
    margin-bottom: 12px;
    background: var(--bg-input);
    border-radius: var(--border-radius);
    transition: all 0.3s ease;
}

.popular-post-item:hover {
    transform: translateX(5px);
    background: rgba(0, 240, 255, 0.05);
}

.post-rank {
    width: 32px;
    height: 32px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: linear-gradient(135deg, var(--neon-cyan), var(--neon-magenta));
    color: #fff;
    font-weight: bold;
    border-radius: 50%;
    font-size: 14px;
    flex-shrink: 0;
}

.popular-post-item:nth-child(1) .post-rank {
    background: linear-gradient(135deg, #ffd700, #ffed4e);
    font-size: 18px;
}

.popular-post-item:nth-child(2) .post-rank {
    background: linear-gradient(135deg, #c0c0c0, #e8e8e8);
}

.popular-post-item:nth-child(3) .post-rank {
    background: linear-gradient(135deg, #cd7f32, #daa06d);
}
```

---

## ✅ 验收标准

### Day 6 检查清单

```yaml
✅ About Me Widget:
   - [ ] 正常显示头像
   - [ ] 显示个人简介
   - [ ] 显示联系信息
   - [ ] 社交链接可点击
   - [ ] 霓虹边框动画正常
   - [ ] 悬停效果流畅

✅ Recent Posts Widget:
   - [ ] 显示文章列表
   - [ ] 缩略图正常显示
   - [ ] 日期显示正确
   - [ ] 摘要长度正确
   - [ ] 排除当前文章功能正常

✅ 样式和响应式:
   - [ ] 桌面端显示正常
   - [ ] 平板端显示正常
   - [ ] 移动端显示正常
   - [ ] 无控制台错误
```

### Day 7 检查清单

```yaml
✅ Social Links Widget:
   - [ ] 显示所有社交平台
   - [ ] 链接可点击
   - [ ] 悬停效果正常
   - [ ] 颜色变化正确

✅ Popular Posts Widget:
   - [ ] 按浏览量排序
   - [ ] 显示排名徽章
   - [ ] 显示浏览次数
   - [ ] 时间范围筛选正常

✅ 综合测试:
   - [ ] 所有 Widget 同时显示
   - [ ] 性能达标 (< 50ms)
   - [ ] 内存占用合理 (< 2MB)
   - [ ] 所有浏览器兼容
```

---

## 📊 最终验收评分

### 功能完整性 (40 分)

- [ ] 4 个 Widget 全部实现 (10 分)
- [ ] 所有配置选项正常 (10 分)
- [ ] 定制器集成正常 (10 分)
- [ ] 前端显示正确 (10 分)

**小计**: ___ / 40

### 代码质量 (20 分)

- [ ] 符合 WordPress 标准 (5 分)
- [ ] 注释完整 > 90% (5 分)
- [ ] 无 PHP 错误 (5 分)
- [ ] 安全措施完善 (5 分)

**小计**: ___ / 20

### 性能指标 (20 分)

- [ ] 渲染时间 < 50ms (5 分)
- [ ] 内存占用 < 2MB (5 分)
- [ ] 缓存正常工作 (5 分)
- [ ] 无性能瓶颈 (5 分)

**小计**: ___ / 20

### 用户体验 (20 分)

- [ ] 响应式设计 (5 分)
- [ ] 动画流畅 (5 分)
- [ ] 霓虹效果符合主题 (5 分)
- [ ] 移动端体验 (5 分)

**小计**: ___ / 20

---

## 🎉 总分

**总分**: ___ / 100

**通过标准**: ≥ 80 分
**优秀标准**: ≥ 90 分

---

**文档版本**: 1.0.0
**创建日期**: 2026-03-01
**作者**: Chief Architect
**状态**: ✅ Ready for Development

---

**🚀 准备好开始开发了吗？让我们开始吧！**
