# 🧪 Task 1.1 - 快速测试指南

> **JavaScript 资源系统 - 测试步骤**
> **版本**: 2.0.0
> **日期**: 2026-02-28

---

## ⚡ 快速验证

### 1. 检查文件是否正确加载

在浏览器中打开主题，按 `F12` 打开开发者工具：

**Console 标签**:
```javascript
// 应该看到以下输出
🌃 Cyberpunk Theme initialized successfully
```

**Network 标签**:
```
✅ main.js           (应该加载)
✅ main-styles.css   (应该加载)
✅ ajax.js           (应该加载)
```

**Elements 标签**:
```html
<!-- 应该在 <head> 中看到 -->
<link rel="stylesheet" id="cyberpunk-main-styles" ...>
<script src="main.js" defer></script>
```

---

## 📱 功能测试步骤

### Test 1: 移动端菜单

#### 步骤:

1. **打开移动端模拟**
   - Chrome: F12 → Toggle device toolbar (Ctrl+Shift+M)
   - 选择设备: iPhone 12 Pro (390px)

2. **测试菜单按钮**
   ```
   ✅ 看到汉堡菜单图标 (三条线)
   ✅ 点击按钮
   ✅ 菜单从右侧滑入
   ✅ 汉堡图标变成 X
   ✅ body 滚动被锁定
   ```

3. **测试关闭功能**
   ```
   ✅ 点击菜单外的区域
   ✅ 菜单滑出
   ✅ 或按 ESC 键
   ✅ 菜单关闭
   ```

4. **测试菜单项**
   ```
   ✅ 点击菜单项链接
   ✅ 页面跳转
   ✅ 菜单自动关闭
   ```

#### 预期结果:
- 动画流畅 (无卡顿)
- 霓虹发光效果
- 响应式正常

---

### Test 2: 回到顶部按钮

#### 步骤:

1. **初始状态**
   ```
   ✅ 按钮不可见
   ```

2. **向下滚动**
   ```
   ✅ 滚动超过 300px
   ✅ 按钮从底部淡入
   ✅ 带有向上箭头图标
   ✅ 圆形按钮，霓虹边框
   ```

3. **测试点击**
   ```
   ✅ 点击按钮
   ✅ 平滑滚动到顶部
   ✅ 按钮淡出
   ```

4. **键盘测试**
   ```
   ✅ Tab 键聚焦按钮
   ✅ 按 Enter/Space
   ✅ 正常滚动到顶部
   ```

#### 预期结果:
- hover 时按钮发光
- 向上箭头有动画
- 平滑滚动效果

---

### Test 3: 搜索表单

#### 步骤:

1. **准备测试**
   - 确保主题中有 `.search-toggle` 按钮
   - 或在 `header.php` 中添加:
   ```html
   <button class="search-toggle">[SEARCH]</button>
   ```

2. **测试打开**
   ```
   ✅ 点击搜索按钮
   ✅ 全屏覆盖层淡入
   ✅ 背景模糊
   ✅ 搜索框自动聚焦
   ✅ 搜索框有霓虹边框
   ```

3. **测试输入**
   ```
   ✅ 输入文字
   ✅ 边框发光效果
   ✅ placeholder 显示
   ```

4. **测试关闭**
   ```
   ✅ 点击覆盖层外部
   ✅ 或按 ESC 键
   ✅ 覆盖层淡出
   ```

#### 预期结果:
- 缩放动画 (scale 0.9 → 1)
- 输入框聚焦时发光
- 背景模糊效果清晰

---

### Test 4: 平滑滚动

#### 步骤:

1. **创建测试链接**
   ```html
   <a href="#section1">跳转到 Section 1</a>
   <div id="section1" style="margin-top: 500px;">Section 1</div>
   ```

2. **测试点击**
   ```
   ✅ 点击链接
   ✅ 平滑滚动到目标
   ✅ 不是瞬间跳转
   ✅ 偏移量正确 (80px)
   ```

3. **测试特殊链接**
   ```html
   <a href="#">Top</a>
   <a href="#top">Top</a>
   ```
   ```
   ✅ 点击都滚动到顶部
   ✅ 平滑效果
   ```

#### 预期结果:
- scroll-behavior: smooth 生效
- header 不遮挡内容

---

### Test 5: 图片懒加载

#### 步骤:

1. **准备测试图片**
   ```html
   <img data-src="image.jpg" class="lazyload" alt="Test">
   ```

2. **初始状态**
   ```
   ✅ 图片不可见
   ✅ 或显示 loading 占位符
   ```

3. **滚动到图片**
   ```
   ✅ 图片进入视口
   ✅ 开始加载
   ✅ 加载完成后淡入
   ✅ 添加 .loaded 类
   ```

4. **检查 Network**
   ```
   ✅ 图片在需要时才请求
   ```

#### 预期结果:
- 提前 50px 开始加载
- 淡入动画流畅
- 原生 loading="lazy" 优先

---

### Test 6: 霓虹效果

#### 步骤:

1. **准备测试元素**
   ```html
   <h2 class="neon-text glitch-effect">测试标题</h2>
   <div class="neon-box">测试盒子</div>
   ```

2. **滚动观察**
   ```
   ✅ 元素进入视口 20%
   ✅ neon-activated 类添加
   ✅ 开始 neonPulse 动画
   ✅ glitch 效果随机触发
   ```

3. **观察效果**
   ```
   ✅ 亮度变化 (1.0 → 1.3 → 1.0)
   ✅ 随机故障效果
   ✅ 色相旋转
   ```

#### 预期结果:
- 视觉效果明显
- 动画循环流畅
- 性能无明显影响

---

### Test 7: Sticky Header

#### 步骤:

1. **初始状态**
   ```
   ✅ Header 正常显示
   ✅ 无固定定位
   ```

2. **向下滚动**
   ```
   ✅ 滚动超过 100px
   ✅ Header 固定在顶部
   ✅ 背景半透明模糊
   ✅ 底部霓虹边框
   ✅ body 添加 padding-top
   ```

3. **向上滚动**
   ```
   ✅ 滚动回顶部
   ✅ Header 恢复正常
   ✅ padding-top 移除
   ```

#### 预期结果:
- 过渡动画流畅
- 不遮挡内容
- 背景模糊清晰

---

### Test 8: 无障碍功能

#### 步骤:

1. **Skip Links 测试**
   ```html
   <a href="#main" class="skip-link">Skip to content</a>
   ```
   ```
   ✅ Tab 键聚焦
   ✅ 按Enter 跳转
   ✅ 焦点正确设置
   ```

2. **键盘导航**
   ```
   ✅ 按 Tab 键
   ✅ 焦点指示器显示
   ✅ focus 样式明显
   ✅ 焦点顺序正确
   ```

3. **ARIA 属性**
   ```
   ✅ 按钮有 aria-label
   ✅ 菜单有 aria-expanded
   ✅ 正确更新状态
   ```

4. **屏幕阅读器**
   ```
   ✅ 使用 NVDA/VoiceOver
   ✅ 正确朗读内容
   ✅ 角色正确识别
   ```

#### 预期结果:
- 完全键盘可访问
- ARIA 属性完整
- 对比度符合 WCAG AA

---

## 🐛 常见问题排查

### 问题 1: JavaScript 未加载

**症状**: Console 中看到 `Uncaught ReferenceError`

**检查**:
```javascript
// 1. 检查文件路径
wp_enqueue_script('cyberpunk-main', ...)

// 2. 检查文件是否存在
ls assets/js/main.js

// 3. 检查依赖关系
// main.js 不依赖 jQuery，可以独立加载
```

**解决**:
```php
// 确保在 theme-integration.php 中正确加载
if (file_exists(get_template_directory() . '/assets/js/main.js')) {
    wp_enqueue_script('cyberpunk-main', ...);
}
```

---

### 问题 2: CSS 样式未生效

**症状**: 按钮没有样式，布局错乱

**检查**:
```css
/* 1. 检查 CSS 是否加载 */
/* 在 <head> 中查找 main-styles.css */

/* 2. 检查选择器优先级 */
.menu-toggle { ... }

/* 3. 检查 CSS 变量 */
:root {
    --neon-cyan: #00f0ff;
}
```

**解决**:
```php
// 确保 CSS 加载顺序正确
wp_enqueue_style('cyberpunk-main-styles', ..., array('cyberpunk-style'));
```

---

### 问题 3: 懒加载不工作

**症状**: 图片不显示，或一次性加载全部

**检查**:
```javascript
// 1. 检查浏览器支持
console.log('loading' in HTMLImageElement.prototype);

// 2. 检查 IntersectionObserver
console.log('IntersectionObserver' in window);

// 3. 检查 data-src 属性
<img data-src="image.jpg" class="lazyload">
```

**解决**:
```javascript
// 使用原生 loading 属性
<img src="image.jpg" loading="lazy" alt="...">
```

---

### 问题 4: 移动菜单不显示

**症状**: 在移动端看不到菜单按钮

**检查**:
```css
/* 1. 检查媒体查询 */
@media (max-width: 768px) {
    .menu-toggle {
        display: inline-flex; /* 必须 */
    }
}
```

**解决**:
```css
/* 确保桌面端隐藏，移动端显示 */
.menu-toggle {
    display: none;
}

@media (max-width: 768px) {
    .menu-toggle {
        display: inline-flex;
    }
}
```

---

## 📊 性能测试

### Lighthouse 测试

1. 打开 Chrome DevTools
2. Lighthouse 标签
3. 选择 Categories: Performance, Accessibility
4. 点击 "Analyze page load"

**预期结果**:
```
Performance:     90+ ✅
Accessibility:   95+ ✅
Best Practices:  90+ ✅
SEO:            90+ ✅
```

---

## ✅ 验收标准

所有测试通过后，确认:

```yaml
✅ 功能完整性
  ✅ 所有模块正常工作
  ✅ 无 JavaScript 错误
  ✅ 无 CSS 样式问题

✅ 浏览器兼容性
  ✅ Chrome/Firefox/Safari/Edge
  ✅ 移动端浏览器

✅ 响应式设计
  ✅ Desktop/Tablet/Mobile
  ✅ 横屏/竖屏

✅ 性能
  ✅ Lighthouse > 90
  ✅ 加载时间 < 3s

✅ 无障碍
  ✅ 键盘可访问
  ✅ ARIA 完整
  ✅ 对比度符合标准

✅ 代码质量
  ✅ ESLint 通过
  ✅ 注释完整
  ✅ 模块化清晰
```

---

## 📞 获取帮助

如果测试失败:

1. **查看 Console 错误**
   - F12 → Console
   - 记录错误信息

2. **检查 Network**
   - 文件是否加载
   - HTTP 状态码

3. **验证 HTML**
   - 元素是否存在
   - class 是否正确

4. **查看文档**
   - TASK_1.1_COMPLETION_REPORT.md
   - FRONTEND_DEVELOPMENT_PLAN.md

---

**测试完成后**，请在 TASK_CHECKLIST.md 中更新进度:

```markdown
- [x] **1.1** 更新 `inc/theme-integration.php`
  - [x] 1.1.1 添加 `wp_enqueue_script` 调用
  - [x] 1.1.2 添加 `wp_localize_script` 传递数据
  - [x] 1.1.3 实现条件加载逻辑
  - [x] 1.1.4 添加脚本依赖管理
  - [x] 1.1.5 添加版本号参数

- [x] **1.2** 创建 `assets/js/main.js`
  - [x] 1.2.1 实现移动菜单切换功能
  - [x] 1.2.2 实现回到顶部按钮功能
  - [x] 1.2.3 实现搜索表单展开/收起功能
  - [x] 1.2.4 实现平滑滚动
  - [x] 1.2.5 实现图片懒加载
  - [x] 1.2.6 添加工具函数

- [x] **1.3** 验证 JavaScript 加载
  - [x] 1.3.1 检查浏览器控制台无错误
  - [x] 1.3.2 验证 `cyberpunkAjax` 对象存在
  - [x] 1.3.3 测试所有功能正常工作
  - [x] 1.3.4 Chrome/Firefox/Safari 跨浏览器测试
```

---

**Happy Testing!** 🚀
