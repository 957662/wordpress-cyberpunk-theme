# 🚀 Phase 2.2 快速开始指南

> **WordPress Cyberpunk Theme - Phase 2.2 开发指南**
> **日期**: 2026-03-01
> **预计时间**: 10 天
> **难度**: 中高级

---

## 📋 开发前检查清单

### 环境要求

```bash
✅ WordPress 6.4+
✅ PHP 8.0+
✅ MySQL 5.7+
✅ 启用 WP_DEBUG
✅ Git 版本控制
```

### 当前状态

```yaml
项目版本: 2.2.0
代码量: 10,180+ 行
完成度: 60%
Phase 2.1: ✅ 100%
Phase 2.2: 🔄 0%
```

---

## 🎯 Day 1: Widget 系统 (About Me + Recent Posts)

### 步骤 1: 创建 Widget 文件结构

```bash
# 进入项目目录
cd /root/.openclaw/workspace/wordpress-cyber-theme

# 创建目录
mkdir -p inc/widgets
mkdir -p template-parts/widgets

# 创建文件
touch inc/widgets/class-about-me-widget.php
touch inc/widgets/class-recent-posts-widget.php
```

### 步骤 2: 编写 About Me Widget

复制以下代码到 `inc/widgets/class-about-me-widget.php`:

```php
<?php
/**
 * About Me Widget
 *
 * @package Cyberpunk_Theme
 */

if (!defined('ABSPATH')) {
    exit;
}

class Cyberpunk_About_Me_Widget extends WP_Widget {

    public function __construct() {
        parent::__construct(
            'cyberpunk_about_me',
            __('Cyberpunk About Me', 'cyberpunk'),
            array(
                'description' => __('Display author information with social links', 'cyberpunk'),
                'classname' => 'cyberpunk-widget-about-me',
            )
        );
    }

    public function widget($args, $instance) {
        $title = apply_filters('widget_title', $instance['title']);
        $avatar = !empty($instance['avatar']) ? esc_url($instance['avatar']) : '';
        $name = !empty($instance['name']) ? sanitize_text_field($instance['name']) : '';
        $role = !empty($instance['role']) ? sanitize_text_field($instance['role']) : '';
        $bio = !empty($instance['bio']) ? wp_kses_post($instance['bio']) : '';

        echo $args['before_widget'];

        if (!empty($title)) {
            echo $args['before_title'] . $title . $args['after_title'];
        }
        ?>
        <div class="cyberpunk-about-me">
            <?php if (!empty($avatar)) : ?>
                <div class="about-me-avatar">
                    <img src="<?php echo $avatar; ?>" alt="<?php echo esc_attr($name); ?>">
                </div>
            <?php endif; ?>

            <?php if (!empty($name)) : ?>
                <h3 class="about-me-name"><?php echo $name; ?></h3>
            <?php endif; ?>

            <?php if (!empty($role)) : ?>
                <p class="about-me-role"><?php echo $role; ?></p>
            <?php endif; ?>

            <?php if (!empty($bio)) : ?>
                <div class="about-me-bio"><?php echo $bio; ?></div>
            <?php endif; ?>
        </div>
        <?php
        echo $args['after_widget'];
    }

    public function form($instance) {
        $defaults = array(
            'title' => __('About Me', 'cyberpunk'),
            'avatar' => '',
            'name' => '',
            'role' => '',
            'bio' => '',
        );
        $instance = wp_parse_args((array) $instance, $defaults);
        ?>
        <p>
            <label for="<?php echo $this->get_field_id('title'); ?>">
                <?php _e('Title:', 'cyberpunk'); ?>
            </label>
            <input class="widefat"
                   id="<?php echo $this->get_field_id('title'); ?>"
                   name="<?php echo $this->get_field_name('title'); ?>"
                   type="text"
                   value="<?php echo esc_attr($instance['title']); ?>">
        </p>

        <p>
            <label for="<?php echo $this->get_field_id('avatar'); ?>">
                <?php _e('Avatar URL:', 'cyberpunk'); ?>
            </label>
            <input class="widefat"
                   id="<?php echo $this->get_field_id('avatar'); ?>"
                   name="<?php echo $this->get_field_name('avatar'); ?>"
                   type="text"
                   value="<?php echo esc_attr($instance['avatar']); ?>">
        </p>

        <p>
            <label for="<?php echo $this->get_field_id('name'); ?>">
                <?php _e('Name:', 'cyberpunk'); ?>
            </label>
            <input class="widefat"
                   id="<?php echo $this->get_field_id('name'); ?>"
                   name="<?php echo $this->get_field_name('name'); ?>"
                   type="text"
                   value="<?php echo esc_attr($instance['name']); ?>">
        </p>

        <p>
            <label for="<?php echo $this->get_field_id('role'); ?>">
                <?php _e('Role:', 'cyberpunk'); ?>
            </label>
            <input class="widefat"
                   id="<?php echo $this->get_field_id('role'); ?>"
                   name="<?php echo $this->get_field_name('role'); ?>"
                   type="text"
                   value="<?php echo esc_attr($instance['role']); ?>">
        </p>

        <p>
            <label for="<?php echo $this->get_field_id('bio'); ?>">
                <?php _e('Bio:', 'cyberpunk'); ?>
            </label>
            <textarea class="widefat"
                      id="<?php echo $this->get_field_id('bio'); ?>"
                      name="<?php echo $this->get_field_name('bio'); ?>"
                      rows="5"><?php echo esc_textarea($instance['bio']); ?></textarea>
        </p>
        <?php
    }

    public function update($new_instance, $old_instance) {
        $instance = array();
        $instance['title'] = sanitize_text_field($new_instance['title']);
        $instance['avatar'] = esc_url_raw($new_instance['avatar']);
        $instance['name'] = sanitize_text_field($new_instance['name']);
        $instance['role'] = sanitize_text_field($new_instance['role']);
        $instance['bio'] = sanitize_textarea_field($new_instance['bio']);
        return $instance;
    }
}

// Register widget
function cyberpunk_register_about_me_widget() {
    register_widget('Cyberpunk_About_Me_Widget');
}
add_action('widgets_init', 'cyberpunk_register_about_me_widget');
```

### 步骤 3: 编写 Recent Posts Widget

创建 `inc/widgets/class-recent-posts-widget.php`:

```php
<?php
/**
 * Recent Posts Widget
 *
 * @package Cyberpunk_Theme
 */

if (!defined('ABSPATH')) {
    exit;
}

class Cyberpunk_Recent_Posts_Widget extends WP_Widget {

    public function __construct() {
        parent::__construct(
            'cyberpunk_recent_posts',
            __('Cyberpunk Recent Posts', 'cyberpunk'),
            array(
                'description' => __('Display recent posts with thumbnails', 'cyberpunk'),
                'classname' => 'cyberpunk-widget-recent-posts',
            )
        );
    }

    public function widget($args, $instance) {
        $title = apply_filters('widget_title', $instance['title']);
        $number = absint($instance['number']);
        $show_thumbnail = !empty($instance['show_thumbnail']);

        $query = new WP_Query(array(
            'post_type' => 'post',
            'posts_per_page' => $number,
            'ignore_sticky_posts' => true,
        ));

        echo $args['before_widget'];

        if (!empty($title)) {
            echo $args['before_title'] . $title . $args['after_title'];
        }

        if ($query->have_posts()) {
            echo '<div class="cyberpunk-recent-posts">';

            while ($query->have_posts()) {
                $query->the_post();
                ?>
                <div class="recent-post-item">
                    <?php if ($show_thumbnail && has_post_thumbnail()) : ?>
                        <div class="recent-post-thumbnail">
                            <a href="<?php the_permalink(); ?>">
                                <?php the_post_thumbnail('cyberpunk-thumbnail'); ?>
                            </a>
                        </div>
                    <?php endif; ?>

                    <div class="recent-post-content">
                        <h4 class="recent-post-title">
                            <a href="<?php the_permalink(); ?>"><?php the_title(); ?></a>
                        </h4>
                        <div class="recent-post-date">
                            <?php echo get_the_date(); ?>
                        </div>
                    </div>
                </div>
                <?php
            }

            echo '</div>';
            wp_reset_postdata();
        }

        echo $args['after_widget'];
    }

    public function form($instance) {
        $defaults = array(
            'title' => __('Recent Posts', 'cyberpunk'),
            'number' => 5,
            'show_thumbnail' => true,
        );
        $instance = wp_parse_args((array) $instance, $defaults);
        ?>
        <p>
            <label for="<?php echo $this->get_field_id('title'); ?>">
                <?php _e('Title:', 'cyberpunk'); ?>
            </label>
            <input class="widefat"
                   id="<?php echo $this->get_field_id('title'); ?>"
                   name="<?php echo $this->get_field_name('title'); ?>"
                   type="text"
                   value="<?php echo esc_attr($instance['title']); ?>">
        </p>

        <p>
            <label for="<?php echo $this->get_field_id('number'); ?>">
                <?php _e('Number of posts:', 'cyberpunk'); ?>
            </label>
            <input class="tiny-text"
                   id="<?php echo $this->get_field_id('number'); ?>"
                   name="<?php echo $this->get_field_name('number'); ?>"
                   type="number"
                   min="1"
                   max="10"
                   value="<?php echo esc_attr($instance['number']); ?>">
        </p>

        <p>
            <input class="checkbox"
                   id="<?php echo $this->get_field_id('show_thumbnail'); ?>"
                   name="<?php echo $this->get_field_name('show_thumbnail'); ?>"
                   type="checkbox"
                   <?php checked($instance['show_thumbnail']); ?>>
            <label for="<?php echo $this->get_field_id('show_thumbnail'); ?>">
                <?php _e('Show thumbnail', 'cyberpunk'); ?>
            </label>
        </p>
        <?php
    }

    public function update($new_instance, $old_instance) {
        $instance = array();
        $instance['title'] = sanitize_text_field($new_instance['title']);
        $instance['number'] = absint($new_instance['number']);
        $instance['show_thumbnail'] = isset($new_instance['show_thumbnail']) ? 1 : 0;
        return $instance;
    }
}

function cyberpunk_register_recent_posts_widget() {
    register_widget('Cyberpunk_Recent_Posts_Widget');
}
add_action('widgets_init', 'cyberpunk_register_recent_posts_widget');
```

### 步骤 4: 添加 Widget 样式

在 `assets/css/widget-styles.css` 添加:

```css
/* Widget Base Styles */
.widget {
    background: var(--bg-card);
    border: 1px solid var(--border-glow);
    padding: 20px;
    margin-bottom: 30px;
}

.widget-title {
    color: var(--neon-cyan);
    font-size: 1.2rem;
    margin-bottom: 15px;
    padding-bottom: 10px;
    border-bottom: 1px solid var(--border-glow);
    text-shadow: 0 0 10px var(--neon-cyan);
}

/* About Me Widget */
.cyberpunk-about-me {
    text-align: center;
}

.about-me-avatar img {
    width: 100px;
    height: 100px;
    border-radius: 50%;
    border: 2px solid var(--neon-cyan);
    box-shadow: 0 0 15px var(--neon-cyan);
    margin-bottom: 15px;
}

.about-me-name {
    color: var(--neon-cyan);
    font-size: 1.3rem;
    margin-bottom: 5px;
}

.about-me-role {
    color: var(--text-dim);
    font-size: 0.9rem;
    text-transform: uppercase;
    letter-spacing: 2px;
    margin-bottom: 15px;
}

.about-me-bio {
    color: var(--text-main);
    line-height: 1.6;
}

/* Recent Posts Widget */
.cyberpunk-recent-posts {
    display: flex;
    flex-direction: column;
    gap: 15px;
}

.recent-post-item {
    display: flex;
    gap: 15px;
    padding-bottom: 15px;
    border-bottom: 1px solid rgba(0, 240, 255, 0.1);
}

.recent-post-item:last-child {
    border-bottom: none;
    padding-bottom: 0;
}

.recent-post-thumbnail img {
    width: 60px;
    height: 60px;
    object-fit: cover;
    border: 1px solid var(--border-glow);
}

.recent-post-title a {
    color: var(--neon-cyan);
    text-decoration: none;
    font-size: 0.95rem;
}

.recent-post-title a:hover {
    color: var(--neon-magenta);
    text-shadow: 0 0 5px var(--neon-magenta);
}

.recent-post-date {
    color: var(--text-dim);
    font-size: 0.8rem;
    margin-top: 5px;
}
```

### 步骤 5: 加载 Widget 样式

在 `functions.php` 添加:

```php
/**
 * Enqueue widget styles
 */
function cyberpunk_widget_styles() {
    wp_enqueue_style(
        'cyberpunk-widget-styles',
        get_template_directory_uri() . '/assets/css/widget-styles.css',
        array(),
        '2.3.0'
    );
}
add_action('wp_enqueue_scripts', 'cyberpunk_widget_styles');
```

### 步骤 6: 测试 Widget

1. 进入 WordPress 后台
2. 外观 → Widget
3. 拖动 "Cyberpunk About Me" 到侧边栏
4. 配置选项并保存
5. 访问前端查看效果

---

## 🎯 Day 2: Widget 系统 (Social + Popular)

### Social Links Widget

创建 `inc/widgets/class-social-links-widget.php`:

```php
<?php
/**
 * Social Links Widget
 *
 * @package Cyberpunk_Theme
 */

if (!defined('ABSPATH')) {
    exit;
}

class Cyberpunk_Social_Links_Widget extends WP_Widget {

    public function __construct() {
        parent::__construct(
            'cyberpunk_social_links',
            __('Cyberpunk Social Links', 'cyberpunk'),
            array(
                'description' => __('Display social media links', 'cyberpunk'),
                'classname' => 'cyberpunk-widget-social-links',
            )
        );
    }

    public function widget($args, $instance) {
        $title = apply_filters('widget_title', $instance['title']);
        $new_window = !empty($instance['new_window']) ? true : false;

        $platforms = array(
            'twitter' => $instance['twitter'] ?? '',
            'facebook' => $instance['facebook'] ?? '',
            'instagram' => $instance['instagram'] ?? '',
            'linkedin' => $instance['linkedin'] ?? '',
            'github' => $instance['github'] ?? '',
            'youtube' => $instance['youtube'] ?? '',
        );

        $platforms = array_filter($platforms);

        echo $args['before_widget'];

        if (!empty($title)) {
            echo $args['before_title'] . $title . $args['after_title'];
        }
        ?>

        <div class="cyberpunk-social-links">
            <?php foreach ($platforms as $platform => $url) : ?>
                <a href="<?php echo esc_url($url); ?>"
                   class="social-link social-link-<?php echo esc_attr($platform); ?>"
                   target="<?php echo $new_window ? '_blank' : '_self'; ?>"
                   rel="noopener noreferrer"
                   aria-label="<?php echo esc_attr($platform); ?>">
                    <span class="social-icon"><?php echo $this->get_icon($platform); ?></span>
                </a>
            <?php endforeach; ?>
        </div>

        <?php
        echo $args['after_widget'];
    }

    private function get_icon($platform) {
        $icons = array(
            'twitter' => '𝕏',
            'facebook' => 'f',
            'instagram' => '📷',
            'linkedin' => 'in',
            'github' => '⌘',
            'youtube' => '▶',
        );

        return $icons[$platform] ?? '•';
    }

    public function form($instance) {
        $defaults = array(
            'title' => __('Follow Me', 'cyberpunk'),
            'twitter' => '',
            'facebook' => '',
            'instagram' => '',
            'linkedin' => '',
            'github' => '',
            'youtube' => '',
            'new_window' => true,
        );
        $instance = wp_parse_args((array) $instance, $defaults);

        $platforms = array(
            'twitter' => 'Twitter',
            'facebook' => 'Facebook',
            'instagram' => 'Instagram',
            'linkedin' => 'LinkedIn',
            'github' => 'GitHub',
            'youtube' => 'YouTube',
        );
        ?>

        <p>
            <label for="<?php echo $this->get_field_id('title'); ?>">
                <?php _e('Title:', 'cyberpunk'); ?>
            </label>
            <input class="widefat"
                   id="<?php echo $this->get_field_id('title'); ?>"
                   name="<?php echo $this->get_field_name('title'); ?>"
                   type="text"
                   value="<?php echo esc_attr($instance['title']); ?>">
        </p>

        <?php foreach ($platforms as $key => $label) : ?>
            <p>
                <label for="<?php echo $this->get_field_id($key); ?>">
                    <?php echo esc_html($label); ?> URL:
                </label>
                <input class="widefat"
                       id="<?php echo $this->get_field_id($key); ?>"
                       name="<?php echo $this->get_field_name($key); ?>"
                       type="text"
                       value="<?php echo esc_attr($instance[$key]); ?>">
            </p>
        <?php endforeach; ?>

        <p>
            <input class="checkbox"
                   id="<?php echo $this->get_field_id('new_window'); ?>"
                   name="<?php echo $this->get_field_name('new_window'); ?>"
                   type="checkbox"
                   <?php checked($instance['new_window']); ?>>
            <label for="<?php echo $this->get_field_id('new_window'); ?>">
                <?php _e('Open in new window', 'cyberpunk'); ?>
            </label>
        </p>
        <?php
    }

    public function update($new_instance, $old_instance) {
        $instance = array();
        $instance['title'] = sanitize_text_field($new_instance['title']);
        $instance['twitter'] = esc_url_raw($new_instance['twitter']);
        $instance['facebook'] = esc_url_raw($new_instance['facebook']);
        $instance['instagram'] = esc_url_raw($new_instance['instagram']);
        $instance['linkedin'] = esc_url_raw($new_instance['linkedin']);
        $instance['github'] = esc_url_raw($new_instance['github']);
        $instance['youtube'] = esc_url_raw($new_instance['youtube']);
        $instance['new_window'] = isset($new_instance['new_window']) ? 1 : 0;
        return $instance;
    }
}

function cyberpunk_register_social_links_widget() {
    register_widget('Cyberpunk_Social_Links_Widget');
}
add_action('widgets_init', 'cyberpunk_register_social_links_widget');
```

### Social Links 样式

添加到 `widget-styles.css`:

```css
/* Social Links Widget */
.cyberpunk-social-links {
    display: flex;
    gap: 10px;
    flex-wrap: wrap;
}

.social-link {
    width: 40px;
    height: 40px;
    display: flex;
    align-items: center;
    justify-content: center;
    border: 1px solid var(--border-glow);
    color: var(--neon-cyan);
    transition: all 0.3s ease;
    font-weight: bold;
}

.social-link:hover {
    background: var(--neon-cyan);
    color: var(--bg-dark);
    box-shadow: 0 0 15px var(--neon-cyan);
    transform: translateY(-3px);
}

.social-link-twitter:hover {
    background: #1DA1F2;
    box-shadow: 0 0 15px #1DA1F2;
}

.social-link-facebook:hover {
    background: #4267B2;
    box-shadow: 0 0 15px #4267B2;
}

.social-link-instagram:hover {
    background: linear-gradient(45deg, #f09433, #e6683c, #dc2743, #cc2366, #bc1888);
}

.social-link-linkedin:hover {
    background: #0077B5;
    box-shadow: 0 0 15px #0077B5;
}

.social-link-github:hover {
    background: #333;
    box-shadow: 0 0 15px #333;
}

.social-link-youtube:hover {
    background: #FF0000;
    box-shadow: 0 0 15px #FF0000;
}
```

---

## 🎯 Day 3: 短代码系统 (Button + Alert)

### Button 短代码

创建 `inc/shortcodes.php`:

```php
<?php
/**
 * Shortcodes
 *
 * @package Cyberpunk_Theme
 */

if (!defined('ABSPATH')) {
    exit;
}

/**
 * Button Shortcode
 * Usage: [cyber_button url="#" color="cyan" size="medium"]Click Me[/cyber_button]
 */
function cyberpunk_button_shortcode($atts, $content = '') {
    $atts = shortcode_atts(array(
        'url' => '#',
        'color' => 'cyan',
        'size' => 'medium',
        'icon' => '',
        'target' => '_self',
    ), $atts);

    $allowed_colors = array('cyan', 'magenta', 'yellow');
    if (!in_array($atts['color'], $allowed_colors)) {
        $atts['color'] = 'cyan';
    }

    $allowed_sizes = array('small', 'medium', 'large');
    if (!in_array($atts['size'], $allowed_sizes)) {
        $atts['size'] = 'medium';
    }

    $classes = array(
        'cyber-button',
        'cyber-button-' . $atts['color'],
        'cyber-button-' . $atts['size'],
    );

    $button_text = !empty($content) ? $content : __('Click', 'cyberpunk');

    return sprintf(
        '<a href="%s" class="%s" target="%s">%s%s</a>',
        esc_url($atts['url']),
        esc_attr(implode(' ', $classes)),
        esc_attr($atts['target']),
        !empty($atts['icon']) ? '<span class="cyber-button-icon">' . esc_html($atts['icon']) . '</span>' : '',
        esc_html($button_text)
    );
}
add_shortcode('cyber_button', 'cyberpunk_button_shortcode');

/**
 * Alert Shortcode
 * Usage: [cyber_alert type="warning"]Alert message[/cyber_alert]
 */
function cyberpunk_alert_shortcode($atts, $content = '') {
    $atts = shortcode_atts(array(
        'type' => 'info',
        'title' => '',
        'dismissible' => 'true',
    ), $atts);

    $allowed_types = array('info', 'success', 'warning', 'error');
    if (!in_array($atts['type'], $allowed_types)) {
        $atts['type'] = 'info';
    }

    $dismissible = $atts['dismissible'] === 'true';

    ob_start();
    ?>
    <div class="cyber-alert cyber-alert-<?php echo esc_attr($atts['type']); ?>" role="alert">
        <?php if ($dismissible) : ?>
            <button type="button" class="cyber-alert-close" aria-label="<?php _e('Close', 'cyberpunk'); ?>">
                <span>&times;</span>
            </button>
        <?php endif; ?>

        <?php if (!empty($atts['title'])) : ?>
            <strong class="cyber-alert-title"><?php echo esc_html($atts['title']); ?></strong>
        <?php endif; ?>

        <div class="cyber-alert-content">
            <?php echo wp_kses_post($content); ?>
        </div>
    </div>
    <?php
    return ob_get_clean();
}
add_shortcode('cyber_alert', 'cyberpunk_alert_shortcode');
```

### 短代码样式

创建 `assets/css/shortcode-styles.css`:

```css
/* Button Shortcode */
.cyber-button {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    padding: 12px 30px;
    background: transparent;
    border: 2px solid;
    text-transform: uppercase;
    letter-spacing: 2px;
    font-size: 0.85rem;
    font-weight: 600;
    text-decoration: none;
    cursor: pointer;
    position: relative;
    overflow: hidden;
    transition: all 0.3s ease;
}

.cyber-button-cyan {
    border-color: var(--neon-cyan);
    color: var(--neon-cyan);
}

.cyber-button-magenta {
    border-color: var(--neon-magenta);
    color: var(--neon-magenta);
}

.cyber-button-yellow {
    border-color: var(--neon-yellow);
    color: var(--neon-yellow);
}

.cyber-button-small {
    padding: 8px 16px;
    font-size: 0.75rem;
}

.cyber-button-medium {
    padding: 12px 30px;
    font-size: 0.85rem;
}

.cyber-button-large {
    padding: 16px 40px;
    font-size: 1rem;
}

.cyber-button::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 0;
    height: 100%;
    background: currentColor;
    transition: width 0.3s ease;
    z-index: -1;
}

.cyber-button:hover {
    color: var(--bg-dark);
}

.cyber-button:hover::after {
    width: 100%;
}

/* Alert Shortcode */
.cyber-alert {
    position: relative;
    padding: 15px 20px;
    margin-bottom: 20px;
    border: 2px solid;
    border-radius: 4px;
}

.cyber-alert-info {
    border-color: var(--neon-cyan);
    color: var(--neon-cyan);
    background: rgba(0, 240, 255, 0.05);
}

.cyber-alert-success {
    border-color: #00ff00;
    color: #00ff00;
    background: rgba(0, 255, 0, 0.05);
}

.cyber-alert-warning {
    border-color: var(--neon-yellow);
    color: var(--neon-yellow);
    background: rgba(240, 255, 0, 0.05);
}

.cyber-alert-error {
    border-color: var(--neon-magenta);
    color: var(--neon-magenta);
    background: rgba(255, 0, 255, 0.05);
}

.cyber-alert-close {
    position: absolute;
    top: 10px;
    right: 10px;
    background: transparent;
    border: none;
    color: inherit;
    font-size: 1.5rem;
    cursor: pointer;
    padding: 0;
    width: 25px;
    height: 25px;
    display: flex;
    align-items: center;
    justify-content: center;
}

.cyber-alert-close:hover {
    transform: rotate(90deg);
}
```

### 加载短代码样式

在 `functions.php` 添加:

```php
/**
 * Enqueue shortcode styles
 */
function cyberpunk_shortcode_styles() {
    wp_enqueue_style(
        'cyberpunk-shortcode-styles',
        get_template_directory_uri() . '/assets/css/shortcode-styles.css',
        array(),
        '2.3.0'
    );
}
add_action('wp_enqueue_scripts', 'cyberpunk_shortcode_styles');
```

### 测试短代码

在页面或文章中添加:

```
[cyber_button url="https://example.com" color="cyan" size="large"]Click Me[/cyber_button]

[cyber_alert type="warning" title="Warning"]This is a warning message![/cyber_alert]
```

---

## 🎯 Day 4-5: 性能优化

### 图片优化

创建 `inc/performance.php`:

```php
<?php
/**
 * Performance Optimizations
 *
 * @package Cyberpunk_Theme
 */

if (!defined('ABSPATH')) {
    exit;
}

/**
 * Add lazy loading to images
 */
function cyberpunk_lazy_load_images($content) {
    if (is_feed()) {
        return $content;
    }

    $pattern = '/<img([^>]+)src=([\'"])([^\'">]+)\2([^>]*)>/i';

    $replacement = function($matches) {
        $attributes = $matches[1] . $matches[4];

        if (strpos($attributes, 'loading=') !== false) {
            return $matches[0];
        }

        if (strpos($matches[3], 'data:') === 0) {
            return $matches[0];
        }

        return sprintf(
            '<img%1$s src=%2$s%3$s%2$s loading="lazy" decoding="async"%4$s>',
            $attributes,
            $matches[2],
            $matches[3],
            ''
        );
    };

    return preg_replace_callback($pattern, $replacement, $content);
}
add_filter('the_content', 'cyberpunk_lazy_load_images');
add_filter('post_thumbnail_html', 'cyberpunk_lazy_load_images');

/**
 * Defer JavaScript
 */
function cyberpunk_defer_scripts($tag, $handle, $src) {
    $defer_scripts = array('jquery', 'cyberpunk-main');

    if (in_array($handle, $defer_scripts)) {
        return '<script src="' . esc_url($src) . '" defer></script>' . "\n";
    }

    return $tag;
}
add_filter('script_loader_tag', 'cyberpunk_defer_scripts', 10, 3);

/**
 * Remove unnecessary scripts
 */
function cyberpunk_cleanup_scripts() {
    wp_dequeue_script('wp-embed');
}
add_action('wp_enqueue_scripts', 'cyberpunk_cleanup_scripts');

/**
 * Fragment cache wrapper
 */
function cyberpunk_fragment_cache($key, $callback, $expiration = 3600) {
    $cache_key = 'cyberpunk_fragment_' . md5($key);
    $output = get_transient($cache_key);

    if (false !== $output) {
        return $output;
    }

    ob_start();
    call_user_func($callback);
    $output = ob_get_clean();

    set_transient($cache_key, $output, $expiration);

    return $output;
}
```

### 使用 Fragment Cache 示例

在模板中使用:

```php
<?php
echo cyberpunk_fragment_cache('recent_posts_' . get_queried_object_id(), function() {
    $args = array('numberposts' => 5);
    $posts = wp_get_recent_posts($args);

    foreach ($posts as $post) {
        // Render posts
    }
}, 3600);
?>
```

---

## 🎯 Day 6-7: 安全加固

### CSRF 保护

创建 `inc/security.php`:

```php
<?php
/**
 * Security Enhancements
 *
 * @package Cyberpunk_Theme
 */

if (!defined('ABSPATH')) {
    exit;
}

/**
 * Security Headers
 */
function cyberpunk_security_headers() {
    // Content Security Policy
    header('Content-Security-Policy: default-src \'self\'; script-src \'self\' \'unsafe-inline\' \'unsafe-eval\'; style-src \'self\' \'unsafe-inline\'');

    // X-Frame-Options
    header('X-Frame-Options: SAMEORIGIN');

    // X-Content-Type-Options
    header('X-Content-Type-Options: nosniff');

    // X-XSS-Protection
    header('X-XSS-Protection: 1; mode=block');

    // Referrer-Policy
    header('Referrer-Policy: strict-origin-when-cross-origin');
}
add_action('send_headers', 'cyberpunk_security_headers');

/**
 * Remove WordPress version
 */
remove_action('wp_head', 'wp_generator');

/**
 * Disable XML-RPC
 */
add_filter('xmlrpc_enabled', '__return_false');

/**
 * Disable REST API for non-logged users
 */
function cyberpunk_restrict_rest_api() {
    if (!is_user_logged_in()) {
        wp_die(__('Unauthorized', 'cyberpunk'), 401);
    }
}
// add_filter('rest_authentication_errors', 'cyberpunk_restrict_rest_api');

/**
 * Sanitize input helper
 */
function cyberpunk_sanitize_input($input, $type = 'text') {
    switch ($type) {
        case 'email':
            return sanitize_email($input);
        case 'url':
            return esc_url_raw($input);
        case 'html':
            return wp_kses_post($input);
        case 'integer':
            return absint($input);
        default:
            return sanitize_text_field($input);
    }
}

/**
 * Validate nonce helper
 */
function cyberpunk_verify_nonce($action, $nonce = null) {
    if (!$nonce) {
        $nonce = isset($_REQUEST['_wpnonce']) ? $_REQUEST['_wpnonce'] : '';
    }

    if (!wp_verify_nonce($nonce, $action)) {
        wp_die(__('Security check failed', 'cyberpunk'));
    }

    return true;
}
```

---

## 📋 每日检查清单

### Widget 开发 (Day 1-2)

- [ ] 创建 Widget 文件
- [ ] 实现 widget() 方法
- [ ] 实现 form() 方法
- [ ] 实现 update() 方法
- [ ] 添加 CSS 样式
- [ ] 在后台测试
- [ ] 在前端验证

### 短代码开发 (Day 3-4)

- [ ] 创建短代码文件
- [ ] 实现短代码函数
- [ ] 添加 CSS 样式
- [ ] 在编辑器中测试
- [ ] 验证属性处理
- [ ] 测试嵌套短代码

### 性能优化 (Day 5-6)

- [ ] 实现懒加载
- [ ] 优化资源加载
- [ ] 添加缓存机制
- [ ] 测试 PageSpeed
- [ ] 优化数据库查询
- [ ] 验证加载时间

### 安全加固 (Day 7-8)

- [ ] 添加安全头部
- [ ] 实现 CSRF 保护
- [ ] 添加输入验证
- [ ] 测试安全性
- [ ] 运行 WPScan
- [ ] 修复发现的问题

---

## 🧪 测试命令

### 性能测试

```bash
# 使用 Lighthouse CLI
npx lighthouse https://example.com --view

# 使用 PageSpeed Insights API
curl https://www.googleapis.com/pagespeedonline/v5/runPagespeed?url=https://example.com&strategy=mobile
```

### 安全测试

```bash
# 使用 WPScan
wpscan --url https://example.com --enumerate u

# 检查安全头部
curl -I https://example.com
```

---

## 📝 提交代码

```bash
# 添加更改
git add .

# 提交
git commit -m "feat: add widget system for Phase 2.2

- Implement About Me Widget
- Implement Recent Posts Widget
- Add widget styles
- Test widget functionality

Co-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>"

# 推送
git push origin phase-2.2-development
```

---

## 🆘 常见问题

### Q: Widget 不显示？

检查:
1. Widget 是否正确注册
2. functions.php 是否加载了 widget 文件
3. 是否在后台添加到了侧边栏

### Q: 短代码不工作？

检查:
1. 短代码函数是否添加到 add_shortcode
2. 短代码名称是否正确
3. 是否在页面/文章编辑器中使用

### Q: 样式不生效？

检查:
1. CSS 文件是否正确加载
2. wp_enqueue_style 是否正确调用
3. 浏览器缓存是否清除

---

## 📚 参考资源

- WordPress Widget API: https://developer.wordpress.org/apis/handbook/widgets/
- Shortcode API: https://developer.wordpress.org/plugins/shortcodes/
- Performance: https://developer.wordpress.org/apis/performance/

---

**祝您开发顺利！💜**

如有问题，请查看完整技术方案: `ARCHITECT_PHASE2_2_COMPLETE_SOLUTION.md`
