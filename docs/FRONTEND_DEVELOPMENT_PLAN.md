# 🎨 WordPress Cyberpunk Theme - 前端开发技术方案

> **资深前端架构师方案**
> **日期**: 2026-02-28
> **版本**: 1.0.0
> **项目**: WordPress Cyberpunk Theme v2.0

---

## 📊 项目现状评估

### 当前前端完成度

```
┌────────────────────────────────────────────────────────────┐
│                    前端模块完成度分析                      │
├────────────────────────────────────────────────────────────┤
│                                                              │
│  ✅ 已完成 (75%)                                             │
│  ├─ CSS 样式系统           1,191 行  │ 100% │               │
│  ├─ 基础模板文件           11 个     │ 100% │               │
│  ├─ 响应式设计                       │ 100% │               │
│  ├─ JavaScript 模块      543 行    │  90% │               │
│                                                              │
│  ⚠️  部分完成 (40%)                                          │
│  ├─ AJAX 后端集成                   │ 30%  │               │
│  ├─ Template Components              │ 20%  │               │
│  ├─ 实时搜索功能                     │ 50%  │               │
│                                                              │
│  ❌ 未完成 (0%)                                               │
│  ├─ 自定义文章类型模板              │  0%  │               │
│  ├─ Portfolio 展示页面              │  0%  │               │
│  ├─ 短代码系统                       │  0%  │               │
│  ├─ Gutenberg 区块                  │  0%  │               │
│                                                              │
└────────────────────────────────────────────────────────────┘
```

### 技术栈分析

| 技术 | 当前版本 | 推荐版本 | 状态 |
|:-----|:---------|:---------|:-----|
| CSS | 原生 CSS3 | CSS Variables + Flexbox/Grid | ✅ 优秀 |
| JavaScript | jQuery (依赖 WP) | ES6+ / Vanilla JS | ⚠️ 可优化 |
| 构建工具 | 无 | Vite / Webpack | ❌ 缺失 |
| 模块化 | 部分模块化 | ES Modules | ⚠️ 待改进 |
| 类型检查 | 无 | TypeScript | 🔄 可选 |

---

## 🎯 前端开发任务优先级

### 🔴 P0 - 核心功能（必须完成）

#### Task 1: 完善 AJAX 功能集成 (2天)

**目标**: 将已有的 `ajax.js` 完全集成到主题中

**文件结构**:
```
assets/
├── js/
│   ├── ajax.js                    # ✅ 已有 (543 行)
│   ├── ajax-handlers.js           # ⚠️ 需要创建
│   └── customizer-preview.js      # ⚠️ 需要创建
inc/
├── ajax-handlers.php              # ⚠️ 需要更新
└── theme-integration.php          # ✅ 已有
```

**技术要点**:

1. **确保脚本正确加载** (`inc/theme-integration.php`)
   ```php
   function cyberpunk_enqueue_assets() {
       // AJAX Scripts
       wp_enqueue_script(
           'cyberpunk-ajax',
           get_template_directory_uri() . '/assets/js/ajax.js',
           array('jquery'),
           '1.0.0',
           true
       );

       // Localize Script
       wp_localize_script('cyberpunk-ajax', 'cyberpunkAjax', array(
           'ajaxurl' => admin_url('admin-ajax.php'),
           'nonce' => wp_create_nonce('cyberpunk_nonce'),
           'rest_url' => rest_url('cyberpunk/v1/'),
           'strings' => array(
               'loading' => __('Loading...', 'cyberpunk'),
               'nomore' => __('No more posts', 'cyberpunk'),
               'error' => __('Error loading posts', 'cyberpunk'),
           )
       ));
   }
   ```

2. **创建 AJAX 处理器** (`inc/ajax-handlers.php`)
   ```php
   <?php
   /**
    * AJAX Handlers for Cyberpunk Theme
    *
    * @package Cyberpunk_Theme
    */

   // Prevent direct access
   if (!defined('ABSPATH')) {
       exit;
   }

   /**
    * ============================================
    * 1. LOAD MORE POSTS
    * ============================================
    */
   function cyberpunk_ajax_load_more() {
       // Security check
       check_ajax_referer('cyberpunk_nonce', 'nonce');

       // Get parameters
       $paged = isset($_POST['page']) ? intval($_POST['page']) : 1;
       $posts_per_page = isset($_POST['posts_per_page']) ? intval($_POST['posts_per_page']) : 6;

       // Query arguments
       $args = array(
           'post_type' => 'post',
           'post_status' => 'publish',
           'paged' => $paged,
           'posts_per_page' => $posts_per_page,
           'ignore_sticky_posts' => 1,
       );

       $query = new WP_Query($args);

       if ($query->have_posts()) {
           ob_start();

           while ($query->have_posts()) {
               $query->the_post();
               get_template_part('template-parts/content', 'card');
           }

           $html = ob_get_clean();
           wp_reset_postdata();

           wp_send_json_success(array(
               'html' => $html,
               'current_page' => $paged,
               'max_pages' => $query->max_num_pages,
               'found_posts' => $query->found_posts,
           ));
       } else {
           wp_send_json_error(__('No more posts found', 'cyberpunk'));
       }

       wp_die();
   }
   add_action('wp_ajax_cyberpunk_load_more', 'cyberpunk_ajax_load_more');
   add_action('wp_ajax_nopriv_cyberpunk_load_more', 'cyberpunk_ajax_load_more');

   /**
    * ============================================
    * 2. LIVE SEARCH
    * ============================================
    */
   function cyberpunk_ajax_search() {
       check_ajax_referer('cyberpunk_nonce', 'nonce');

       $query = isset($_POST['query']) ? sanitize_text_field($_POST['query']) : '';

       if (strlen($query) < 2) {
           wp_send_json_error(__('Query too short', 'cyberpunk'));
       }

       $args = array(
           'post_type' => array('post', 'page'),
           'post_status' => 'publish',
           's' => $query,
           'posts_per_page' => 5,
       );

       $search_query = new WP_Query($args);
       $results = array();

       if ($search_query->have_posts()) {
           while ($search_query->have_posts()) {
               $search_query->the_post();

               $results[] = array(
                   'id' => get_the_ID(),
                   'type' => get_post_type(),
                   'title' => get_the_title(),
                   'excerpt' => wp_trim_words(get_the_excerpt(), 15),
                   'permalink' => get_permalink(),
                   'thumbnail' => get_the_post_thumbnail_url(get_the_ID(), 'thumbnail'),
                   'date' => get_the_date(),
               );
           }
           wp_reset_postdata();
       }

       wp_send_json_success(array(
           'results' => $results,
           'count' => count($results),
       ));
   }
   add_action('wp_ajax_cyberpunk_search', 'cyberpunk_ajax_search');
   add_action('wp_ajax_nopriv_cyberpunk_search', 'cyberpunk_ajax_search');

   /**
    * ============================================
    * 3. POST LIKE/BOOKMARK
    * ============================================
    */
   function cyberpunk_ajax_post_like() {
       check_ajax_referer('cyberpunk_nonce', 'nonce');

       $post_id = isset($_POST['post_id']) ? intval($_POST['post_id']) : 0;

       if (!$post_id || !get_post($post_id)) {
           wp_send_json_error(__('Invalid post ID', 'cyberpunk'));
       }

       $likes_key = 'cyberpunk_post_likes';
       $likes = get_post_meta($post_id, $likes_key, true);
       $likes = $likes ? intval($likes) : 0;

       // Track user likes (using cookies for guests, user meta for logged in)
       if (is_user_logged_in()) {
           $user_id = get_current_user_id();
           $liked_key = 'cyberpunk_liked_posts_' . $user_id;
           $liked_posts = get_user_meta($user_id, $liked_key, true);
           $liked_posts = is_array($liked_posts) ? $liked_posts : array();
       } else {
           $liked_posts = isset($_COOKIE['cyberpunk_liked_posts'])
               ? explode(',', $_COOKIE['cyberpunk_liked_posts'])
               : array();
       }

       if (in_array($post_id, $liked_posts)) {
           // Unlike
           $likes = max(0, $likes - 1);
           $liked_posts = array_diff($liked_posts, array($post_id));
           $action = 'unliked';
       } else {
           // Like
           $likes++;
           $liked_posts[] = $post_id;
           $action = 'liked';
       }

       // Save
       update_post_meta($post_id, $likes_key, $likes);

       if (is_user_logged_in()) {
           update_user_meta($user_id, $liked_key, array_values($liked_posts));
       } else {
           setcookie('cyberpunk_liked_posts', implode(',', $liked_posts), time() + YEAR_IN_SECONDS, '/');
       }

       wp_send_json_success(array(
           'likes' => $likes,
           'action' => $action,
       ));
   }
   add_action('wp_ajax_cyberpunk_post_like', 'cyberpunk_ajax_post_like');
   add_action('wp_ajax_nopriv_cyberpunk_post_like', 'cyberpunk_post_like');

   /**
    * ============================================
    * 4. LOAD THEME CONFIG
    * ============================================
    */
   function cyberpunk_ajax_get_config() {
       check_ajax_referer('cyberpunk_nonce', 'nonce');

       $config = array(
           'colors' => array(
               'primary' => get_theme_mod('cyberpunk_primary_color', '#00f0ff'),
               'secondary' => get_theme_mod('cyberpunk_secondary_color', '#ff00ff'),
               'accent' => get_theme_mod('cyberpunk_accent_color', '#f0ff00'),
               'background' => get_theme_mod('cyberpunk_bg_color', '#0a0a0f'),
           ),
           'effects' => array(
               'scanlines' => get_theme_mod('cyberpunk_scanlines', true),
               'glitch' => get_theme_mod('cyberpunk_glitch_effect', true),
               'neon_glow' => get_theme_mod('cyberpunk_neon_glow', true),
           ),
           'typography' => array(
               'heading_font' => get_theme_mod('cyberpunk_heading_font', 'Orbitron'),
               'body_font' => get_theme_mod('cyberpunk_body_font', 'Rajdhani'),
           ),
       );

       wp_send_json_success($config);
   }
   add_action('wp_ajax_cyberpunk_get_config', 'cyberpunk_ajax_get_config');
   add_action('wp_ajax_nopriv_cyberpunk_get_config', 'cyberpunk_ajax_get_config');
   ```

3. **更新前端模板** (`index.php`, `archive.php`)

   在 `index.php` 的分页位置添加：
   ```php
   <?php
   // 替换原有的分页为 AJAX Load More
   if ($wp_query->max_num_pages > 1) :
   ?>
   <div class="load-more-container">
       <button class="load-more-btn cyber-button neon-box" data-page="1" data-max-pages="<?php echo esc_attr($wp_query->max_num_pages); ?>">
           <span class="cyber-button-text">[LOAD_MORE]</span>
       </button>
       <div class="loading-spinner" style="display:none;">
           <div class="cyber-loader"></div>
       </div>
   </div>
   <?php endif; ?>
   ```

4. **添加实时搜索** (`header.php`)

   在导航菜单后添加：
   ```php
   <div class="live-search-wrapper">
       <input
           type="search"
           id="search-input"
           class="search-input neon-box"
           placeholder="<?php _e('SEARCH_DATABASE...', 'cyberpunk'); ?>"
           autocomplete="off"
       />
       <div class="search-results" style="display:none;"></div>
   </div>
   ```

---

#### Task 2: 创建 Template Components (1.5天)

**目标**: 创建可复用的前端组件

**文件结构**:
```
template-parts/
├── content/
│   ├── content-card.php           # ⚠️ 新建 - 文章卡片
│   ├── content-single.php         # ⚠️ 新建 - 单篇文章
│   ├── content-page.php           # ⚠️ 新建 - 页面内容
│   └── content-none.php           # ⚠️ 新建 - 无结果
├── header/
│   ├── header-branding.php        # ⚠️ 新建 - 品牌/Logo
│   └── header-navigation.php      # ⚠️ 新建 - 导航菜单
└── footer/
    └── footer-widgets.php         # ⚠️ 新建 - 页脚小工具
```

**组件代码示例**:

##### 1. `template-parts/content/content-card.php`
```php
<?php
/**
 * Content Card Component
 * Used in post grids, archives, and blog listings
 *
 * @package Cyberpunk_Theme
 */

if (!defined('ABSPATH')) {
    exit;
}

global $post;
?>

<article id="post-<?php the_ID(); ?>" <?php post_class('post-card cyber-card'); ?> data-post-id="<?php the_ID(); ?>">
    <?php if (has_post_thumbnail()) : ?>
        <div class="post-thumbnail">
            <a href="<?php the_permalink(); ?>" class="thumbnail-link">
                <?php the_post_thumbnail('cyberpunk-card', array('class' => 'cyber-img')); ?>
                <div class="thumbnail-overlay">
                    <span class="view-text">[VIEW_ENTRY]</span>
                </div>
            </a>
        </div>
    <?php endif; ?>

    <div class="post-content-wrapper">
        <header class="entry-header">
            <?php
            the_title('<h2 class="entry-title neon-text"><a href="' . esc_url(get_permalink()) . '" rel="bookmark">', '</a></h2>');
            ?>
        </header>

        <div class="entry-meta">
            <span class="posted-on">
                <time class="entry-date" datetime="<?php echo get_the_date(DATE_W3C); ?>">
                    <?php echo get_the_date(); ?>
                </time>
            </span>
            <?php if (get_the_category()) : ?>
                <span class="cat-links">
                    <?php the_category(' '); ?>
                </span>
            <?php endif; ?>
        </div>

        <div class="entry-excerpt">
            <?php the_excerpt(); ?>
        </div>

        <footer class="entry-footer">
            <div class="entry-actions">
                <a href="<?php the_permalink(); ?>" class="read-more-link cyber-button">
                    <?php _e('[READ_MORE]', 'cyberpunk'); ?>
                </a>
                <button class="like-button" data-post-id="<?php the_ID(); ?>">
                    <span class="like-icon">♡</span>
                    <span class="like-count"><?php echo intval(get_post_meta(get_the_ID(), 'cyberpunk_post_likes', true)); ?></span>
                </button>
            </div>
        </footer>
    </div>
</article>
```

##### 2. `template-parts/header/header-navigation.php`
```php
<?php
/**
 * Navigation Component
 *
 * @package Cyberpunk_Theme
 */

if (!defined('ABSPATH')) {
    exit;
}
?>

<nav id="site-navigation" class="main-navigation" aria-label="<?php _e('Main Menu', 'cyberpunk'); ?>">
    <button
        class="menu-toggle cyber-button"
        aria-controls="primary-menu"
        aria-expanded="false"
        type="button"
    >
        <span class="hamburger">
            <span></span>
            <span></span>
            <span></span>
        </span>
        <span class="menu-text"><?php _e('[MENU]', 'cyberpunk'); ?></span>
    </button>

    <?php
    wp_nav_menu(array(
        'theme_location' => 'primary',
        'menu_id' => 'primary-menu',
        'menu_class' => 'nav-menu',
        'container' => false,
        'fallback_cb' => 'cyberpunk_fallback_menu',
        'walker' => new Cyberpunk_Walker_Nav_Menu(),
    ));
    ?>
</nav>

<?php
/**
 * Fallback Menu
 */
function cyberpunk_fallback_menu() {
    ?>
    <ul class="nav-menu">
        <li class="menu-item"><a href="<?php echo esc_url(home_url('/')); ?>"><?php _e('Home', 'cyberpunk'); ?></a></li>
        <?php wp_list_pages(array('title_li' => '', 'depth' => 1)); ?>
    </ul>
    <?php
}

/**
 * Custom Walker for Cyberpunk Menu
 */
class Cyberpunk_Walker_Nav_Menu extends Walker_Nav_Menu {
    function start_el(&$output, $item, $depth = 0, $args = array(), $id = 0) {
        $output .= '<li class="menu-item menu-item-' . $item->ID;

        if (in_array('current-menu-item', $item->classes)) {
            $output .= ' current-menu-item';
        }

        $output .= '">';

        $attributes = !empty($item->attr_title) ? ' title="' . esc_attr($item->attr_title) . '"' : '';
        $attributes .= !empty($item->target) ? ' target="' . esc_attr($item->target) . '"' : '';
        $attributes .= !empty($item->xfn) ? ' rel="' . esc_attr($item->xfn) . '"' : '';
        $attributes .= !empty($item->url) ? ' href="' . esc_url($item->url) . '"' : '';

        $output .= '<a' . $attributes . ' class="menu-link">';
        $output .= '<span class="link-text">' . esc_html($item->title) . '</span>';
        $output .= '</a>';
    }
}
```

---

#### Task 3: 自定义文章类型前端 (1.5天)

**目标**: 为 Portfolio CPT 创建前端展示

**文件结构**:
```
├── archive-portfolio.php           # ⚠️ 新建 - 作品集归档
├── single-portfolio.php            # ⚠️ 新建 - 单个作品
└── template-parts/
    └── content-portfolio.php       # ⚠️ 新建 - 作品卡片
```

##### 1. `archive-portfolio.php`
```php
<?php
/**
 * Portfolio Archive Template
 *
 * @package Cyberpunk_Theme
 */

get_header(); ?>

<main id="primary" class="site-main portfolio-archive">
    <div class="container">
        <header class="page-header">
            <h1 class="page-title neon-text glitch-effect"><?php post_type_archive_title(); ?></h1>
            <?php if ($description = get_the_post_type_description('portfolio')) : ?>
                <div class="archive-description"><?php echo wp_kses_post($description); ?></div>
            <?php endif; ?>
        </header>

        <?php if (have_posts()) : ?>
            <div class="portfolio-grid">
                <?php
                while (have_posts()) :
                    the_post();
                    get_template_part('template-parts/content', 'portfolio');
                endwhile;
                ?>
            </div>

            <?php the_posts_pagination(array(
                'mid_size' => 2,
                'prev_text' => __('&larr;', 'cyberpunk'),
                'next_text' => __('&rarr;', 'cyberpunk'),
            )); ?>

        <?php else : ?>
            <div class="no-portfolio">
                <p><?php _e('No portfolio items found.', 'cyberpunk'); ?></p>
            </div>
        <?php endif; ?>
    </div>
</main>

<?php
get_footer();
```

##### 2. `template-parts/content-portfolio.php`
```php
<?php
/**
 * Portfolio Item Card
 *
 * @package Cyberpunk_Theme
 */

if (!defined('ABSPATH')) {
    exit;
}

// Get project categories
$categories = get_the_terms(get_the_ID(), 'project_category');
?>

<article id="post-<?php the_ID(); ?>" <?php post_class('portfolio-item'); ?>>
    <div class="portfolio-thumbnail">
        <a href="<?php the_permalink(); ?>">
            <?php
            if (has_post_thumbnail()) {
                the_post_thumbnail('cyberpunk-card');
            } else {
                echo '<div class="placeholder-thumbnail">' . __('No Image', 'cyberpunk') . '</div>';
            }
            ?>
            <div class="portfolio-overlay">
                <span class="view-project"><?php _e('[VIEW_PROJECT]', 'cyberpunk'); ?></span>
            </div>
        </a>
    </div>

    <div class="portfolio-content">
        <?php if ($categories && !is_wp_error($categories)) : ?>
            <div class="portfolio-categories">
                <?php foreach ($categories as $category) : ?>
                    <span class="category-tag neon-box"><?php echo esc_html($category->name); ?></span>
                <?php endforeach; ?>
            </div>
        <?php endif; ?>

        <h2 class="portfolio-title">
            <a href="<?php the_permalink(); ?>"><?php the_title(); ?></a>
        </h2>

        <div class="portfolio-excerpt">
            <?php the_excerpt(); ?>
        </div>

        <div class="portfolio-meta">
            <span class="project-year">
                <?php echo get_the_date('Y'); ?>
            </span>
        </div>
    </div>
</article>
```

---

### 🟡 P1 - 增强功能（可选但推荐）

#### Task 4: 自定义颜色系统 (1天)

**目标**: 实现动态主题颜色切换

**技术方案**:

1. **创建颜色预设系统**
```php
// inc/color-presets.php
function cyberpunk_get_color_presets() {
    return array(
        'cyber-default' => array(
            'name' => __('Default Cyberpunk', 'cyberpunk'),
            'colors' => array(
                'primary' => '#00f0ff',
                'secondary' => '#ff00ff',
                'accent' => '#f0ff00',
                'background' => '#0a0a0f',
            ),
        ),
        'matrix-green' => array(
            'name' => __('Matrix Green', 'cyberpunk'),
            'colors' => array(
                'primary' => '#00ff41',
                'secondary' => '#008f11',
                'accent' => '#003b00',
                'background' => '#000000',
            ),
        ),
        'retro-wave' => array(
            'name' => __('Retro Wave', 'cyberpunk'),
            'colors' => array(
                'primary' => '#ff6ec7',
                'secondary' => '#00d9ff',
                'accent' => '#ffeb3b',
                'background' => '#2d1b4e',
            ),
        ),
        'bladerunner' => array(
            'name' => __('Blade Runner', 'cyberpunk'),
            'colors' => array(
                'primary' => '#ff9d00',
                'secondary' => '#00bfff',
                'accent' => '#ff0040',
                'background' => '#0a0a12',
            ),
        ),
    );
}
```

2. **CSS 变量动态更新**
```javascript
// assets/js/color-switcher.js
const CyberpunkColorSwitcher = {
    init() {
        this.presetButtons = document.querySelectorAll('.color-preset-btn');
        this.bindEvents();
    },

    bindEvents() {
        this.presetButtons.forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                const preset = btn.dataset.preset;
                this.applyPreset(preset);
            });
        });
    },

    applyPreset(presetName) {
        // Fetch preset colors
        fetch(cyberpunkAjax.ajaxurl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: new URLSearchParams({
                action: 'cyberpunk_get_preset_colors',
                nonce: cyberpunkAjax.nonce,
                preset: presetName
            })
        })
        .then(res => res.json())
        .then(response => {
            if (response.success) {
                this.updateCSSVariables(response.data.colors);
                this.savePreference(presetName);
            }
        });
    },

    updateCSSVariables(colors) {
        const root = document.documentElement;
        root.style.setProperty('--neon-cyan', colors.primary);
        root.style.setProperty('--neon-magenta', colors.secondary);
        root.style.setProperty('--neon-yellow', colors.accent);
        root.style.setProperty('--bg-dark', colors.background);
    },

    savePreference(presetName) {
        localStorage.setItem('cyberpunk_color_preset', presetName);
    }
};

document.addEventListener('DOMContentLoaded', () => {
    CyberpunkColorSwitcher.init();
});
```

---

#### Task 5: 性能优化 (1天)

**优化清单**:

1. **图片懒加载优化**
```php
// 添加到 functions.php
function cyberpunk_add_lazyload_to_images($content) {
    if (is_admin() || is_feed()) return $content;

    $content = preg_replace(
        '/<img([^>]+)src=([\'"])([^\'">]+)\2([^>]*)>/i',
        '<img$1data-src=$2$3$2 src="data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7" class="lazyload"$4>',
        $content
    );

    return $content;
}
add_filter('the_content', 'cyberpunk_add_lazyload_to_images');
```

2. **CSS 优化**
```css
/* Critical CSS - 内联到头部 */
:root {
    --neon-cyan: #00f0ff;
    --neon-magenta: #ff00ff;
    --neon-yellow: #f0ff00;
    --bg-dark: #0a0a0f;
}

/* 关键路径样式 */
body {
    background: var(--bg-dark);
    font-family: 'Rajdhani', sans-serif;
}

/* 其余样式延迟加载 */
```

3. **JavaScript 异步加载**
```php
// 修改脚本加载
function cyberpunk_async_scripts($url) {
    if (strpos($url, 'ajax.js') !== false) {
        return str_replace(' src', ' async defer src', $url);
    }
    return $url;
}
add_filter('script_loader_tag', 'cyberpunk_async_scripts', 10, 2);
```

---

### 🟢 P2 - 高级功能（未来规划）

#### Task 6: REST API 集成 (1.5天)

#### Task 7: PWA 支持 (2天)

#### Task 8: 短代码系统 (1天)

---

## 🛠️ 开发工具链

### 推荐的构建流程

**当前状态**: 无构建工具
**推荐方案**: Vite (现代化、快速)

**配置示例**:
```javascript
// vite.config.js
import { defineConfig } from 'vite';
import path from 'path';

export default defineConfig({
  build: {
    lib: {
      entry: {
        ajax: path.resolve(__dirname, 'assets/js/src/ajax.js'),
        main: path.resolve(__dirname, 'assets/js/src/main.js'),
      },
      outDir: 'assets/js/dist',
      formats: ['iife'],
    },
    rollupOptions: {
      output: {
        entryFileNames: '[name].js',
        chunkFileNames: '[name].js',
        assetFileNames: '[name][extname]',
      },
    },
  },
  server: {
    proxy: {
      '/wp-admin/admin-ajax.php': {
        target: 'http://localhost:8000',
        changeOrigin: true,
      },
    },
  },
});
```

### 代码规范

```json
// .eslintrc.json
{
  "extends": ["wordpress"],
  "env": {
    "browser": true,
    "es6": true
  },
  "rules": {
    "no-var": "error",
    "prefer-arrow-callback": "error",
    "prefer-template": "error"
  }
}
```

```css
/* .stylelintrc.json */
{
  "extends": "stylelint-config-standard",
  "rules": {
    "selector-class-pattern": "^[a-z][a-z0-9-]*$",
    "custom-property-pattern": "^[a-z][a-z0-9-]*$"
  }
}
```

---

## 📋 测试清单

### 前端功能测试

```markdown
### AJAX 功能
- [ ] Load More 按钮加载文章
- [ ] 实时搜索返回结果
- [ ] 文章点赞功能正常
- [ ] 无 JavaScript 控制台错误

### 响应式设计
- [ ] 桌面端 (> 1200px)
- [ ] 平板 (768px - 1199px)
- [ ] 手机 (< 768px)
- [ ] 横屏/竖屏切换

### 浏览器兼容性
- [ ] Chrome (最新 2 版本)
- [ ] Firefox (最新 2 版本)
- [ ] Safari (macOS + iOS)
- [ ] Edge (最新版本)

### 性能指标
- [ ] Lighthouse Performance > 90
- [ ] First Contentful Paint < 1.5s
- [ ] Time to Interactive < 3s
- [ ] Cumulative Layout Shift < 0.1

### 可访问性
- [ ] 键盘导航可用
- [ ] ARIA 标签完整
- [ ] 对比度符合 WCAG AA
- [ ] 屏幕阅读器测试通过
```

---

## 📊 交付清单

### P0 任务交付物

```
✅ inc/ajax-handlers.php (350 行)
✅ template-parts/content/content-card.php (80 行)
✅ template-parts/content/content-single.php (100 行)
✅ template-parts/header/header-navigation.php (150 行)
✅ template-parts/content/content-portfolio.php (90 行)
✅ archive-portfolio.php (60 行)
✅ single-portfolio.php (120 行)
✅ 更新后的 index.php
✅ 更新后的 archive.php
✅ 更新后的 header.php
✅ 更新后的 functions.php
```

### 文档交付物

```
✅ FRONTEND_API_REFERENCE.md
✅ COMPONENT_DOCUMENTATION.md
✅ TESTING_GUIDE.md
✅ PERFORMANCE_OPTIMIZATION.md
```

---

## 🚀 实施时间表

```
Week 1 (Day 1-5)
├─ Day 1-2: AJAX 功能集成
├─ Day 3-4: Template Components
├─ Day 5: Portfolio CPT 前端
└─ Day 5: 测试与修复

Week 2 (Day 6-10)
├─ Day 6: 颜色系统
├─ Day 7: 性能优化
├─ Day 8-9: 全面测试
└─ Day 10: 文档编写
```

---

## 📞 技术支持

### 相关文档

- [TECHNICAL_ARCHITECTURE.md](./TECHNICAL_ARCHITECTURE.md)
- [NEXT_STEPS_TASK_SUMMARY.md](./NEXT_STEPS_TASK_SUMMARY.md)
- [IMPLEMENTATION_GUIDE.md](./IMPLEMENTATION_GUIDE.md)

### 外部资源

- [WordPress Theme Handbook](https://developer.wordpress.org/themes/)
- [AJAX in Plugins](https://developer.wordpress.org/plugins/javascript/ajax/)
- [Theme Customizer API](https://developer.wordpress.org/themes/customize-api/)

---

**文档版本**: 1.0.0
**创建日期**: 2026-02-28
**作者**: Frontend Architect
**状态**: ✅ Ready for Implementation
**预计完成**: 7-10 个工作日

---

*"Code is poetry. Design is art. Cyberpunk is lifestyle."*
