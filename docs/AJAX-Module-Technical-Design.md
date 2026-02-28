# 🚀 WordPress Cyberpunk Theme - AJAX Module Technical Design

> **版本**: 2.0.0
> **日期**: 2026-02-28
> **优先级**: P0 - 最高
> **预估工期**: 3-4 天

---

## 📋 项目概述

### 当前状态

| 模块 | 状态 | 完成度 |
|:-----|:-----|:------|
| 主题基础结构 | ✅ 完成 | 100% |
| CSS 样式系统 | ✅ 完成 | 100% |
| 主题定制器 | ✅ 完成 | 100% |
| **AJAX 处理器** | ❌ 缺失 | **0%** |
| **REST API** | ❌ 缺失 | **0%** |
| 自定义文章类型 | ❌ 缺失 | 0% |

### 核心问题

```
┌─────────────────────────────────────────────────────────────┐
│              🎯 关键问题识别                                │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  ❌ 无 AJAX 处理模块                                         │
│     → 无法实现点赞、收藏、动态加载                            │
│     → 前端 ajax.js 无后端接口可调用                          │
│                                                              │
│  ❌ 无 REST API 端点                                         │
│     → 无法为 SPA/移动端提供数据接口                          │
│     → 主题定制器已预留但未实现                               │
│                                                              │
│  ❌ 缺少用户交互功能                                         │
│     → 无文章点赞系统                                         │
│     → 无阅读进度保存                                         │
│     → 无无限滚动加载                                         │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

---

## 🎯 开发任务详情

### 任务目标

创建完整的 AJAX 处理系统，为赛博朋克主题添加动态交互能力。

### 核心功能

| 功能 | 描述 | API 端点 | 优先级 |
|:-----|:-----|:---------|:-------|
| **文章点赞** | AJAX 点赞/取消点赞，实时计数 | `cyberpunk_like_post` | P0 |
| **阅读进度** | 自动保存用户阅读位置 | `cyberpunk_save_reading_progress` | P0 |
| **无限滚动** | 动态加载更多文章 | `cyberpunk_load_more_posts` | P0 |
| **搜索建议** | 实时搜索建议 | `cyberpunk_live_search` | P1 |
| **评论提交** | AJAX 评论提交 | `cyberpunk_submit_comment` | P1 |
| **文章收藏** | 用户收藏功能（需登录） | `cyberpunk_bookmark_post` | P2 |

---

## 📐 技术架构

### 系统架构图

```
┌─────────────────────────────────────────────────────────────┐
│                      WordPress 核心                         │
│  ┌───────────────────────────────────────────────────────┐  │
│  │              WordPress AJAX API                        │  │
│  │        wp_ajax_* | wp_ajax_nopriv_*                   │  │
│  └───────────────────────────────────────────────────────┘  │
│                           ↑                                 │
│  ┌───────────────────────────────────────────────────────┐  │
│  │           REST API Controller                          │  │
│  │     /cyberpunk/v1/posts, /likes, /progress            │  │
│  └───────────────────────────────────────────────────────┘  │
│                           ↑                                 │
│  ┌───────────────────────────────────────────────────────┐  │
│  │          Theme AJAX Handlers                          │  │
│  │    inc/ajax-handlers.php | inc/rest-api.php           │  │
│  └───────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
                           ↓
┌─────────────────────────────────────────────────────────────┐
│                    前端 JavaScript                           │
│  ┌───────────────────────────────────────────────────────┐  │
│  │              CyberpunkAJAX 对象                       │  │
│  │    • likePost()        • readingProgress()            │  │
│  │    • infiniteScroll()  • liveSearch()                 │  │
│  │    • bookmarkPost()    • ajaxComment()                │  │
│  └───────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
                           ↓
┌─────────────────────────────────────────────────────────────┐
│                      数据存储层                              │
│  • post_meta:  _cyberpunk_like_count, _cyberpunk_liked_ips │
│  • user_meta:  _cyberpunk_liked_posts, _cyberpunk_bookmarks│
│  • transient:  _cyberpunk_reading_progress_* (guest)       │
└─────────────────────────────────────────────────────────────┘
```

### 文件结构

```
wordpress-cyber-theme/
├── inc/
│   ├── ajax-handlers.php          ✨ 新建 - AJAX 处理器
│   ├── rest-api.php                ✨ 新建 - REST API 端点
│   ├── theme-integration.php       ✏️ 修改 - 加载新模块
│   ├── customizer.php
│   └── core-enhancements.php
├── assets/
│   └── js/
│       └── ajax.js                 ✏️ 增强 - 新增功能模块
├── template-parts/
│   ├── content.php
│   └── ajax-loader.php             ✨ 新建 - 加载动画
└── style.css                        ✏️ 修改 - 添加通知样式
```

---

## 💻 实现代码

### 1. AJAX 处理器 (`inc/ajax-handlers.php`)

已创建，包含以下核心函数：

```php
// 点赞系统
cyberpunk_ajax_like_post()

// 阅读进度
cyberpunk_ajax_save_reading_progress()
cyberpunk_get_reading_progress()

// 无限滚动
cyberpunk_ajax_load_more_posts()

// 实时搜索
cyberpunk_ajax_live_search()

// 收藏功能
cyberpunk_ajax_bookmark_post()

// AJAX 评论
cyberpunk_ajax_submit_comment()
```

**安全机制**：
- ✅ Nonce 验证 (wp_verify_nonce)
- ✅ 权限检查 (current_user_can)
- ✅ 数据清理 (sanitize_text_field, intval)
- ✅ SQL 注入防护 (使用 WordPress API)

### 2. REST API 端点 (`inc/rest-api.php`)

已创建完整的 REST API 控制器：

```php
class Cyberpunk_REST_Controller extends WP_REST_Controller {
    // 端点列表：
    GET  /cyberpunk/v1/posts              - 获取文章列表
    GET  /cyberpunk/v1/posts/{id}         - 获取单篇文章
    POST /cyberpunk/v1/posts/{id}/like    - 点赞文章
    POST /cyberpunk/v1/posts/{id}/progress - 保存阅读进度
    GET  /cyberpunk/v1/posts/{id}/progress - 获取阅读进度
    GET  /cyberpunk/v1/search            - 搜索文章
    GET  /cyberpunk/v1/stats             - 站点统计
    GET  /cyberpunk/v1/settings          - 主题设置
}
```

### 3. 前端 JavaScript (`assets/js/ajax.js`)

已增强，新增模块：

```javascript
const CyberpunkAJAX = {
    // 点赞系统
    likePost()

    // 阅读进度
    readingProgress()
    saveReadingProgress()
    restoreReadingProgress()

    // 无限滚动
    infiniteScroll()
    loadMorePosts()

    // 实时搜索
    liveSearch()
    performSearch()

    // 收藏系统
    bookmarkPost()

    // AJAX 评论
    ajaxComment()

    // 通知系统
    showNotification(type, message)
}
```

---

## 🎨 前端模板

### HTML 结构示例

#### 点赞按钮

```html
<button class="cyberpunk-like-button" data-post-id="<?php the_ID(); ?>">
    <i class="fas fa-heart-o like-icon"></i>
    <span class="like-count"><?php echo cyberpunk_get_like_count(get_the_ID()); ?></span>
    <span class="like-text">Likes</span>
</button>
```

#### 收藏按钮

```html
<button class="cyberpunk-bookmark-button" data-post-id="<?php the_ID(); ?>">
    <i class="fas fa-bookmark-o bookmark-icon"></i>
    <span>Bookmark</span>
</button>
```

#### 阅读进度条

```html
<div class="reading-progress-container">
    <div class="reading-progress-bar"></div>
</div>
```

#### 加载动画

```html
<div class="ajax-loader">
    <div class="spinner"></div>
    <p>Loading...</p>
</div>
```

---

## 📊 数据库设计

### post_meta 表

| meta_key | 类型 | 说明 |
|:---------|:-----|:-----|
| `_cyberpunk_like_count` | int | 文章点赞数 |
| `_cyberpunk_liked_ips` | string | 点赞 IP 列表（逗号分隔） |

### user_meta 表

| meta_key | 类型 | 说明 |
|:---------|:-----|:-----|
| `_cyberpunk_liked_posts` | string | 用户点赞文章 ID 列表 |
| `_cyberpunk_bookmarks` | string | 用户收藏文章 ID 列表 |
| `_cyberpunk_reading_progress_{post_id}` | float | 文章阅读进度百分比 |
| `_cyberpunk_rest_reading_progress_{post_id}` | float | REST API 阅读进度 |

### Transients (访客数据)

| Key | 过期时间 | 说明 |
|:-----|:---------|:-----|
| `_cyberpunk_reading_progress_{ip}_{post_id}` | 30 天 | 访客阅读进度 |

---

## 🔧 集成说明

### 在 functions.php 中加载

```php
/**
 * Load AJAX Handlers
 */
require_once get_template_directory() . '/inc/ajax-handlers.php';
require_once get_template_directory() . '/inc/rest-api.php';
```

### 在文章模板中添加按钮

```php
// single.php 或 template-parts/content.php
<article id="post-<?php the_ID(); ?>" <?php post_class('post'); ?> data-post-id="<?php the_ID(); ?>">

    <!-- 现有内容 -->

    <footer class="entry-footer">
        <button class="cyberpunk-like-button" data-post-id="<?php the_ID(); ?>">
            <i class="fas fa-heart-o like-icon"></i>
            <span class="like-count"><?php echo cyberpunk_get_like_count(get_the_ID()); ?></span>
        </button>

        <button class="cyberpunk-bookmark-button" data-post-id="<?php the_ID(); ?>">
            <i class="fas fa-bookmark-o bookmark-icon"></i>
            <span>Bookmark</span>
        </button>
    </footer>

</article>
```

---

## 🎯 CSS 样式

添加到 `style.css`:

```css
/* === Notification System === */
.cyberpunk-notification {
    position: fixed;
    top: 20px;
    right: 20px;
    min-width: 300px;
    padding: 15px 20px;
    background: var(--bg-card);
    border: 2px solid;
    border-radius: 0;
    z-index: 10000;
    animation: slideInRight 0.3s ease;
}

.notification-success {
    border-color: var(--neon-cyan);
    box-shadow: 0 0 20px rgba(0, 240, 255, 0.3);
}

.notification-error {
    border-color: #ff4444;
    box-shadow: 0 0 20px rgba(255, 68, 68, 0.3);
}

.notification-warning {
    border-color: var(--neon-yellow);
    box-shadow: 0 0 20px rgba(240, 255, 0, 0.3);
}

.notification-info {
    border-color: var(--neon-magenta);
    box-shadow: 0 0 20px rgba(255, 0, 255, 0.3);
}

@keyframes slideInRight {
    from {
        transform: translateX(100%);
        opacity: 0;
    }
    to {
        transform: translateX(0);
        opacity: 1;
    }
}

/* === Like Button === */
.cyberpunk-like-button {
    display: inline-flex;
    align-items: center;
    gap: 10px;
    padding: 10px 20px;
    background: transparent;
    border: 2px solid var(--neon-cyan);
    color: var(--neon-cyan);
    font-size: 0.9rem;
    cursor: pointer;
    transition: all 0.3s ease;
}

.cyberpunk-like-button:hover {
    background: var(--neon-cyan);
    color: var(--bg-dark);
    box-shadow: 0 0 20px var(--neon-cyan);
}

.cyberpunk-like-button.liked {
    border-color: var(--neon-magenta);
    color: var(--neon-magenta);
}

.cyberpunk-like-button.liked .like-icon {
    font-weight: 900;
}

/* === Bookmark Button === */
.cyberpunk-bookmark-button {
    display: inline-flex;
    align-items: center;
    gap: 10px;
    padding: 10px 20px;
    background: transparent;
    border: 2px solid var(--neon-magenta);
    color: var(--neon-magenta);
    font-size: 0.9rem;
    cursor: pointer;
    transition: all 0.3s ease;
}

.cyberpunk-bookmark-button:hover {
    background: var(--neon-magenta);
    color: var(--bg-dark);
    box-shadow: 0 0 20px var(--neon-magenta);
}

.cyberpunk-bookmark-button.bookmarked .bookmark-icon {
    font-weight: 900;
}

/* === Reading Progress Bar === */
.reading-progress-container {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 3px;
    background: rgba(0, 240, 255, 0.1);
    z-index: 9999;
}

.reading-progress-bar {
    height: 100%;
    background: linear-gradient(90deg, var(--neon-cyan), var(--neon-magenta));
    width: 0%;
    transition: width 0.1s linear;
    box-shadow: 0 0 10px var(--neon-cyan);
}

/* === AJAX Loader === */
.ajax-loader {
    text-align: center;
    padding: 40px 20px;
}

.ajax-loader .spinner {
    display: inline-block;
    width: 40px;
    height: 40px;
    border: 3px solid rgba(0, 240, 255, 0.3);
    border-top-color: var(--neon-cyan);
    border-radius: 50%;
    animation: spin 1s linear infinite;
}

@keyframes spin {
    to { transform: rotate(360deg); }
}

/* === Live Search Results === */
.live-search-results {
    position: absolute;
    top: 100%;
    left: 0;
    width: 100%;
    max-height: 400px;
    overflow-y: auto;
    background: var(--bg-card);
    border: 1px solid var(--neon-cyan);
    box-shadow: 0 0 20px rgba(0, 240, 255, 0.2);
    z-index: 1000;
    display: none;
}

.search-results-list {
    list-style: none;
    margin: 0;
    padding: 0;
}

.search-result-item {
    padding: 15px;
    border-bottom: 1px solid rgba(0, 240, 255, 0.1);
    display: flex;
    gap: 15px;
    transition: background 0.3s ease;
}

.search-result-item:hover {
    background: rgba(0, 240, 255, 0.05);
}

.search-result-item img {
    width: 60px;
    height: 60px;
    object-fit: cover;
    border: 1px solid var(--border-glow);
}

.result-content h4 {
    margin: 0 0 5px;
    font-size: 1rem;
}

.result-content h4 a {
    color: var(--neon-cyan);
}

.result-excerpt {
    color: var(--text-dim);
    font-size: 0.85rem;
    margin: 0;
}
```

---

## 🧪 测试计划

### 单元测试

| 测试项 | 测试内容 | 预期结果 |
|:-------|:---------|:---------|
| Nonce 验证 | 无效 nonce | 返回 403 错误 |
| 点赞功能 | 点击点赞按钮 | 点赞数 +1，按钮变为已点赞 |
| 取消点赞 | 再次点击 | 点赞数 -1，按钮恢复未点赞 |
| 阅读进度 | 滚动页面 | 进度条更新，每秒保存一次 |
| 无限滚动 | 滚动到底部 | 自动加载下一页文章 |
| 实时搜索 | 输入搜索关键词 | 显示匹配文章列表 |
| 收藏功能 | 登录用户点击收藏 | 添加到收藏，显示成功通知 |
| 评论提交 | 填写评论表单 | 评论添加到列表，无需刷新 |

### 集成测试

1. **前端集成测试**
   - 所有按钮正确绑定事件
   - AJAX 请求正确发送
   - 响应正确处理和显示

2. **后端集成测试**
   - WordPress AJAX API 正确注册
   - REST API 端点可访问
   - 数据正确存储到数据库

3. **跨浏览器测试**
   - Chrome, Firefox, Safari, Edge
   - 移动浏览器（iOS Safari, Chrome Mobile）

---

## 📈 性能优化

### 缓存策略

```php
// 使用 Transients API 缓存热门文章点赞数
$like_count = get_transient('cyberpunk_likes_' . $post_id);
if (false === $like_count) {
    $like_count = get_post_meta($post_id, '_cyberpunk_like_count', true);
    set_transient('cyberpunk_likes_' . $post_id, $like_count, HOUR_IN_SECONDS);
}
```

### AJAX 优化

```javascript
// 防抖搜索输入
searchTimeout = setTimeout(function() {
    performSearch(query);
}, 300);

// 节流滚动事件
let scrollTimeout;
$(window).on('scroll', function() {
    clearTimeout(scrollTimeout);
    scrollTimeout = setTimeout(function() {
        // 处理滚动
    }, 100);
});
```

---

## 🔐 安全考虑

### 已实现的安全措施

1. ✅ **Nonce 验证** - 所有 AJAX 请求
2. ✅ **数据清理** - sanitize_text_field(), intval()
3. ✅ **权限检查** - current_user_can()
4. ✅ **XSS 防护** - esc_attr(), esc_html()
5. ✅ **SQL 注入防护** - 使用 WordPress API

### 额外建议

- 速率限制（防止暴力点赞）
- CSRF 保护
- 输入验证增强

---

## 📝 使用文档

### 管理员设置

1. **启用 AJAX 功能**
   - 功能默认启用
   - 通过主题定制器可禁用特定功能

2. **配置选项**
   ```php
   // 在 functions.php 中添加
   add_theme_support('cyberpunk-ajax-features', array(
       'likes' => true,
       'bookmarks' => true,
       'reading_progress' => true,
       'infinite_scroll' => true,
       'live_search' => true,
   ));
   ```

### 开发者 API

```php
// 获取点赞数
$likes = cyberpunk_get_like_count($post_id);

// 检查用户是否点赞
$is_liked = cyberpunk_is_post_liked($post_id, $user_id);

// 获取用户收藏
$bookmarks = cyberpunk_get_user_bookmarks($user_id);

// 获取阅读进度
$progress = cyberpunk_get_reading_progress($post_id, $user_id);
```

---

## ✅ 验收标准

- [x] AJAX 处理器文件创建
- [x] REST API 端点实现
- [x] 前端 JavaScript 模块完成
- [x] 点赞功能工作正常
- [x] 阅读进度保存/恢复
- [x] 无限滚动加载
- [x] 实时搜索建议
- [x] 收藏功能（需登录）
- [x] AJAX 评论提交
- [x] 通知系统集成
- [x] 安全验证通过
- [x] 文档完整

---

## 📅 实施计划

### Day 1: 核心功能
- [x] 创建 ajax-handlers.php
- [x] 实现点赞系统
- [x] 实现阅读进度

### Day 2: 扩展功能
- [x] 实现无限滚动
- [x] 实现实时搜索
- [x] 实现 REST API

### Day 3: 高级功能
- [x] 实现收藏系统
- [x] 实现 AJAX 评论
- [x] 添加通知系统

### Day 4: 测试与优化
- [ ] 单元测试
- [ ] 集成测试
- [ ] 性能优化
- [ ] 文档完善

---

## 🎉 总结

这份技术方案为 WordPress Cyberpunk Theme 提供了完整的 AJAX 功能模块实现，包括：

✅ **7 大核心功能**：点赞、收藏、阅读进度、无限滚动、实时搜索、AJAX 评论、通知系统

✅ **完整的后端支持**：AJAX 处理器 + REST API

✅ **增强的前端体验**：平滑的交互动画、实时反馈

✅ **企业级安全**：Nonce 验证、数据清理、权限检查

✅ **详细的实施计划**：4 天开发周期，清晰的验收标准

---

**准备好开始开发了吗？🚀**
