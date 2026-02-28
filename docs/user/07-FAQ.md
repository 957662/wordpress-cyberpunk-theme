# ❓ 常见问题解答 (FAQ)

> **最后更新**: 2026-03-01
> **问题数量**: 50+
> **涵盖范围**: 安装、配置、功能、定制、故障排除

---

## 📋 快速导航

- [📦 安装相关](#安装相关)
- [🎨 定制相关](#定制相关)
- [⚙️ 功能相关](#功能相关)
- [🔧 技术相关](#技术相关)
- [💰 商业相关](#商业相关)
- [🆘 故障排除](#故障排除)

---

## 📦 安装相关

### 📥 主题下载与安装

**Q: 从哪里下载主题？**

A: 官方渠道：
- [GitHub Releases](https://github.com/your-repo/wordpress-cyber-theme/releases) - 最新稳定版
- [WordPress.org 主题目录](https://wordpress.org/themes/cyberpunk/) - 免费版
- 官网: [cyberpunk-theme.com](https://cyberpunk-theme.com) - Premium 版

---

**Q: 安装失败，提示"样式缺失"怎么办？**

A: 解决步骤：
1. 确认 `style.css` 文件存在
2. 检查文件权限是否为 644
3. 清除浏览器和服务器缓存
4. 重新上传主题文件夹

```bash
# 检查文件
ls -la /wp-content/themes/cyberpunk/style.css

# 修复权限
chmod 644 style.css
```

---

**Q: 可以上传多个主题吗？**

A: 可以。WordPress 支持安装多个主题，但同时只能激活一个。

```yaml
已安装主题:
  - Cyberpunk Theme (激活)
  - Twenty Twenty-Four
  - Astra
```

---

**Q: 如何更新主题？**

A: 更新方法：

**方法 A: 后台更新**
```
外观 > 主题 > 查看更新 > 更新
```

**方法 B: 手动更新**
```bash
1. 备份当前版本
2. 下载新版本 ZIP
3. 删除旧主题文件夹
4. 上传新版本
5. 重新激活
```

**方法 C: Git 更新（开发者）**
```bash
git pull origin main
```

> ⚠️ **注意**: 更新前务必备份！

---

**Q: 主题更新后我的设置会丢失吗？**

A: 不会。主题选项保存在数据库中，更新主题不会影响。

但是：
- 如果你有直接修改主题文件，更新会覆盖这些修改
- 建议：使用子主题来保存定制

---

**Q: 可以从其他主题迁移吗？**

A: 可以。WordPress 主题切换不会影响内容。

```yaml
迁移步骤:
  1. 备份网站
  2. 安装并激活 Cyberpunk Theme
  3. 检查菜单和小工具
  4. 重新配置主题选项
  5. 调整自定义 CSS
```

---

**Q: 如何导入演示数据？**

A: 使用插件：

```yaml
推荐插件:
  - One Click Demo Import
  - Importer from WordPress
  - Demo Data Importer

步骤:
  1. 安装插件
  2. 主题自带演示数据 XML
  3. 导入数据
  4. 导入小工具
```

---

## 🎨 定制相关

### 🎨 颜色和外观

**Q: 如何修改霓虹颜色？**

A: 主题定制器：

```
外观 > 自定义 > 颜色

主色调 (霓虹青): #00f0ff
强调色 (霓虹品红): #ff00ff
```

也可以通过 CSS：

```css
/* 外观 > 自定义 > 额外 CSS */
:root {
    --neon-cyan: #00ff00; /* 改为绿色 */
}
```

---

**Q: 如何更换字体？**

A: 主题定制器：

```
外观 > 自定义 > 字体

标题字体: Courier New / 自定义
正文字体: Courier New / 自定义
```

或使用 Google Fonts：

```css
/* functions.php */
function cyberpunk_google_fonts() {
    wp_enqueue_style('cyberpunk-fonts', 'https://fonts.googleapis.com/css2?family=Orbitron:wght@400;700&display=swap');
}
add_action('wp_enqueue_scripts', 'cyberpunk_google_fonts');

/* style.css */
body {
    font-family: 'Orbitron', sans-serif;
}
```

---

**Q: 如何禁用扫描线效果？**

A: 主题定制器：

```
外观 > 自定义 > 高级选项
扫描线效果: 关闭
```

或使用 CSS：

```css
/* 外观 > 自定义 > 额外 CSS */
body::before {
    display: none;
}
```

---

**Q: 如何调整发光强度？**

A: 修改 CSS 变量：

```css
/* 外观 > 自定义 > 额外 CSS */
:root {
    --border-glow: rgba(0, 240, 255, 0.2); /* 降低透明度 */
}
```

或完全禁用：

```css
h1, h2, h3 {
    text-shadow: none !important;
}
```

---

**Q: 如何修改 Logo 尺寸？**

A: 主题定制器：

```
外观 > 自定义 > 站点身份

Logo 宽度: 调整滑块
Logo 高度: 调整滑块
```

或使用 CSS：

```css
.custom-logo-link img {
    max-width: 300px;
    height: auto;
}
```

---

### 📐 布局调整

**Q: 如何调整容器宽度？**

A: 修改 CSS：

```css
/* 外观 > 自定义 > 额外 CSS */
.container {
    max-width: 1400px; /* 默认 1200px */
}
```

---

**Q: 如何隐藏侧边栏？**

A: 方法 1：使用全宽页面模板

方法 2：使用 CSS

```css
/* 隐藏侧边栏 */
#secondary {
    display: none;
}

/* 内容全宽 */
.primary-content {
    width: 100%;
}
```

---

**Q: 如何调整侧边栏宽度？**

A: 修改 CSS：

```css
/* 外观 > 自定义 > 额外 CSS */
#secondary {
    width: 350px; /* 默认 300px */
}

.primary-content {
    width: calc(100% - 350px);
}
```

---

### 🎭 高级定制

**Q: 如何添加自定义 CSS？**

A: 主题定制器：

```
外观 > 自定义 > 额外 CSS

/* 在这里添加你的 CSS */
body {
    background: #000;
}
```

> 💡 **优点**: 主题更新不会丢失

---

**Q: 如何编辑主题文件？**

A: 方法：

**方法 A: 后台编辑器**
```
外观 > 主题编辑器
选择文件: style.css
编辑并保存
```

**方法 B: FTP/SSH**
```bash
# 编辑文件
nano /wp-content/themes/cyberpunk/style.css
```

**方法 C: 本地编辑**
```bash
# 使用 Git 工作流
git clone
# 本地编辑
git commit
git push
```

> ⚠️ **警告**: 直接编辑主题文件，更新会丢失！建议使用子主题。

---

**Q: 如何创建子主题？**

A: 步骤：

```bash
1. 创建文件夹 /wp-content/themes/cyberpunk-child

2. 创建 style.css:
/*
Theme Name: Cyberpunk Child
Template: cyberpunk
*/

3. 创建 functions.php:
<?php
function cyberpunk_child_enqueue() {
    wp_enqueue_style('parent-style', get_template_directory_uri()('/style.css'));
}
add_action('wp_enqueue_scripts', 'cyberpunk_child_enqueue');
?>

4. 激活子主题
```

详细指南: [子主题开发](./03-CUSTOMIZATION/child-theme.md)

---

## ⚙️ 功能相关

### 📺 Portfolio 功能

**Q: Portfolio 项目不显示？**

A: 检查清单：

```yaml
检查项:
  [ ] 项目已发布 (非草稿)
  [ ] 创建了 Portfolio 页面
  [ ] 页面使用了 Portfolio Archive 模板
  [ ] 清除了缓存
  [ ] 刷新了固定链接
```

---

**Q: 如何创建 Portfolio 分类？**

A: Portfolio > Portfolio Categories > 添加新分类

```yaml
分类名称: 网页设计
别名: web-design
父级: 无
描述: 网页设计相关项目
```

---

**Q: Portfolio 短代码参数有哪些？**

A: 完整参数：

```shortcode
[portfolio
  count="6"              // 数量
  columns="3"            // 列数: 2/3/4
  filter="yes"           // 筛选器: yes/no
  category="slug"        // 分类别名
  order="DESC"           // 排序
  orderby="date"         // 排序依据
  layout="grid"          // 布局: grid/list
]
```

---

### 📝 博客功能

**Q: 如何设置特色图片？**

A: 编辑文章/页面：

```
右侧边栏 > 特色图像 > 设置特色图像

推荐尺寸: 1200x675 像素
```

---

**Q: 摘要长度如何调整？**

A: 修改 `functions.php`：

```php
function cyberpunk_excerpt_length($length) {
    return 50; // 改为 50 字
}
add_filter('excerpt_length', 'cyberpunk_excerpt_length');
```

---

**Q: 如何启用/禁用评论？**

A: 全局设置：

```
设置 > 讨论

默认文章设置:
  [ ] 尝试通知文章中链接的文章
  [x] 允许访客在文章发表评论
```

单篇设置：

```
编辑文章 > 右上角"屏幕选项"
[✓] 讨论
讨论设置:
  [ ] 允许评论
```

---

### 🎛️ 小工具和菜单

**Q: 如何添加小工具？**

A: 外观 > 小工具

```yaml
可用小工具区域:
  - Primary Sidebar (主侧边栏)
  - Footer 1 (页脚第一列)
  - Footer 2 (页脚第二列)
  - Footer 3 (页脚第三列)

内置小工具:
  - About Me Widget
  - Recent Posts Widget
  - Social Links Widget
  - Popular Posts Widget
```

---

**Q: 如何创建菜单？**

A: 外观 > 菜单

```yaml
步骤:
  1. 创建新菜单
  2. 添加页面/文章/分类
  3. 选择菜单位置
     - Primary Menu (主导航)
     - Footer Menu (页脚)
     - Social Menu (社交链接)
  4. 保存菜单
```

---

**Q: 如何添加社交媒体图标？**

A: 方法：

**方法 A: 社交菜单**
```
外观 > 菜单 > 创建新菜单
添加自定义链接:
  - URL: https://twitter.com/yourname
  - 链接文字: Twitter
分配位置: Social Menu
```

**方法 B: Social Links Widget**
```
外观 > 小工具
添加 "Social Links" 小工具
填写社交媒体 URL
```

---

## 🔧 技术相关

### 🌐 性能优化

**Q: 如何提高网站速度？**

A: 优化建议：

```yaml
缓存:
  - 安装缓存插件 (WP Rocket, W3 Total Cache)
  - 启用浏览器缓存
  - 启用 Gzip 压缩

图片:
  - 压缩图片 (TinyPNG, ImageOptim)
  - 使用 WebP 格式
  - 启用懒加载

代码:
  - 最小化 CSS/JS
  - 删除未使用的插件
  - 使用 CDN

服务器:
  - 升级 PHP 版本
  - 使用更好的主机
  - 启用 Redis/Memcached
```

---

**Q: 主题兼容哪些插件？**

A: 测试兼容：

```yaml
完全兼容:
  ✓ WooCommerce
  ✓ Contact Form 7
  ✓ Jetpack
  ✓ Yoast SEO
  ✓ Elementor
  ✓ WPML

部分兼容:
  ⚠️ 一些缓存插件 (可能需要调整)
  ⚠️ 一些优化插件 (可能冲突)

测试中:
  🔄 其他流行插件
```

---

**Q: 主题支持 Gutenberg 吗？**

A: 完全支持！

```yaml
支持功能:
  ✓ 宽对齐
  ✓ 全宽对齐
  ✓ 所有核心区块
  ✓ 颜色设置
  ✓ 字体大小设置
  ✓ 自定义 CSS

推荐区块:
  - 标题
  - 段落
  - 图片
  - 画廊
  - 列
  - 组
  - 分隔符
```

---

**Q: 如何使用短代码？**

A: 在任何文章/页面中使用：

```shortcode
[cyberpunk_button url="#" color="cyan"]按钮文本[/cyberpunk_button]

[portfolio count="6" columns="3"]

[cyberpunk_alert type="warning"]警告内容[/cyberpunk_alert]
```

完整列表: [短代码参考](./04-ADVANCED/shortcodes.md)

---

### 🔌 REST API

**Q: 主题有 REST API 吗？**

A: 是的。主题包含 REST API 端点：

```bash
# Portfolio 项目
GET /wp-json/cyberpunk/v1/portfolio

# 配置选项
GET /wp-json/cyberpunk/v1/settings

# 统计数据
GET /wp-json/cyberpunk/v1/stats
```

文档: [REST API 指南](./04-ADVANCED/rest-api.md)

---

## 💰 商业相关

### 🆓 免费版 vs Premium 版

**Q: 免费版和付费版有什么区别？**

A: 对比：

| 功能 | 免费版 | Premium |
|------|--------|---------|
| 基础功能 | ✅ | ✅ |
| Portfolio | ✅ | ✅ |
| 定制器选项 | 基础 | 完整 |
| 预设主题 | 3个 | 20+ |
| 小工具 | 4个 | 15+ |
| 短代码 | 5个 | 30+ |
| 优先支持 | 社区 | 邮件 |
| 高级功能 | ❌ | ✅ |
| 定期更新 | 60天 | 永久 |
| 一键演示 | ❌ | ✅ |

---

**Q: 价格是多少？**

A: Premium 版定价：

```yaml
Personal License:  $59/年  (1 个网站)
Developer License: $149/年  (无限网站)
Lifetime:         $299    (永久, 无限网站)

包含:
  ✅ 所有高级功能
  ✅ 优先邮件支持
  ✅ 终身更新
  ✅ 演示数据
  ✅ PSD 设计文件
```

---

**Q: 可以用于商业项目吗？**

A: 可以！

```yaml
许可证: GPL v2 或更高

允许:
  ✅ 商业使用
  ✅ 客户项目
  ✅ 主题销售 (基于 GPL)
  ✅ 修改和再分发

限制:
  ❌ 移除版权声明 (可付费移除)
  ❌ 声明独家拥有
```

---

**Q: 如何获得技术支持？**

A: 支持渠道：

```yaml
免费用户:
  📘 文档
  💬 社区论坛
  🐛 GitHub Issues
  📺 YouTube 视频

Premium 用户:
  ✅ 以上所有
  📧 优先邮件支持
  💬 实时聊天 (工作日)
  🎥 一对一视频指导
```

---

**Q: 可以退款吗？**

A: 退款政策：

```yaml
条件:
  - 14 天内
  - 技术问题无法解决
  - 提供详细问题描述

不支持:
  ❌ "我不喜欢" (原因不充分)
  ❌ 购买错误 (应先阅读文档)
  ❌ 已使用超过 14 天

流程:
  1. 发邮件到 support@cyberpunk-theme.com
  2. 说明问题和购买信息
  3. 我们会在 5 个工作日内处理
```

---

## 🆘 故障排除

### 🔴 常见错误

**Q: 白屏错误 (White Screen of Death)**

A: 解决步骤：

```yaml
1. 启用调试:
   编辑 wp-config.php
   define('WP_DEBUG', true);

2. 查看错误日志:
   /wp-content/debug.log

3. 常见原因:
   - 内存不足
   - PHP 版本过低
   - 插件冲突

4. 解决方案:
   - 增加 memory_limit
   - 升级 PHP 到 7.4+
   - 禁用所有插件测试
```

---

**Q: 样式加载不正常？**

A: 解决方案：

```yaml
步骤:
  1. 清除所有缓存
     - 浏览器缓存 (Ctrl+Shift+R)
     - 服务器缓存
     - CDN 缓存

  2. 检查文件完整性:
     ls -la style.css

  3. 检查控制台错误:
     F12 > Console

  4. 重新生成 CSS:
     外观 > 自定义 > 发布

  5. 禁用优化插件:
     Autoptimize, WP Optimize
```

---

**Q: 图片不显示？**

A: 解决方案：

```yaml
检查:
  1. 图片上传是否成功
  2. 文件权限是否正确 (755)
  3. URL 是否正确
  4. 是否有防盗链

解决:
  - 重新生成缩略图
  - 检查 .htaccess 规则
  - 禁用图片优化插件
```

---

**Q: 更新后网站崩溃？**

A: 紧急恢复：

```bash
# 通过 FTP
1. 重命名主题文件夹
   cyberpunk → cyberpunk-backup

2. WordPress 自动切换到默认主题

3. 重新下载旧版本
4. 恢复网站
5. 联系支持
```

---

## 📞 仍需要帮助？

### 获取支持

```yaml
📘 查看文档:
   - [完整文档索引](./INDEX.md)
   - [故障排除指南](./04-ADVANCED/troubleshooting.md)

💬 社区支持:
   - [论坛](https://forum.cyberpunk-theme.com)
   - [Discord](https://discord.gg/cyberpunk)
   - [Reddit](https://reddit.com/r/cyberpunktheme)

📧 联系支持:
   - Email: support@cyberpunk-theme.com
   - Premium: 24 小时响应
   - Free: 48-72 小时响应

🐛 报告 Bug:
   - [GitHub Issues](https://github.com/your-repo/wordpress-cyber-theme/issues)
```

### 提问技巧

```yaml
好的提问:
  ✅ 详细的描述
  ✅ 截图/错误信息
  ✅ 网站地址
  ✅ 使用的插件
  ✅ PHP/WordPress 版本

不好的提问:
  ❌ "不工作了"
  ❌ "怎么弄?"
  ❌ "快点帮我"
```

---

**希望这 FAQ 能解决你的问题！如未解决，请通过上述渠道联系我们。💜**

---

*文档版本: 1.0.0 | 最后更新: 2026-03-01 | 总问题数: 50+*
