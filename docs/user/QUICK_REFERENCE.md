# 🎴 用户文档快速参考卡
## User Documentation Quick Reference Card

> **用途**: 快速查阅的袖珍参考指南
> **版本**: 1.0.0
> **更新日期**: 2026-03-01

---

## 📌 文档结构速览

```
user/
├── 📘 README.md (5分钟上手)
├── 📗 INSTALLATION.md (安装指南)
├── 📕 CONFIGURATION/ (配置)
│   ├── theme-customizer.md
│   ├── menus.md
│   └── widgets.md
├── 📙 FEATURES/ (功能)
│   ├── portfolio.md
│   ├── blog.md
│   └── comments.md
├── 📓 CUSTOMIZATION/ (定制)
│   ├── colors.md
│   └── css.md
├── 📔 ADVANCED/ (高级)
│   ├── shortcodes.md
│   └── troubleshooting.md
└── 📒 FAQ.md (常见问题)
```

---

## 🎯 用户画像与推荐路径

### 🌱 新手博主 (5分钟/天)
```
推荐阅读顺序:
00-README.md → 01-INSTALLATION.md → 03-CONFIGURATION/theme-customizer.md
```

### 💼 小企业主 (2小时/周)
```
推荐阅读顺序:
00-README.md → 04-FEATURES/portfolio.md → 03-CONFIGURATION/
```

### 🛠️ 开发者 (按需)
```
推荐阅读顺序:
05-CUSTOMIZATION/ → 06-ADVANCED/ → 查看技术文档
```

---

## ⚡ 5 分钟紧急指南

### 🚨 问题快速定位

| 问题 | 快速解决 | 详细文档 |
|------|----------|----------|
| **样式错乱** | 清除缓存 → Ctrl+Shift+R | troubleshooting.md#样式错乱 |
| **图片不显示** | 工具→重新生成缩略图 | troubleshooting.md#图片问题 |
| **Portfolio 失效** | 检查页面模板 | portfolio.md#故障排除 |
| **无法登录** | 重置密码 | troubleshooting.md#登录问题 |
| **更新失败** | 手动上传 | troubleshooting.md#更新失败 |

---

## 📦 安装检查清单

### ✅ 安装前 (2分钟)
- [ ] WordPress 5.0+?
- [ ] PHP 7.4+?
- [ ] 备份网站?
- [ ] 禁用缓存插件?

### ✅ 安装后 (5分钟)
- [ ] 主题已激活?
- [ ] 样式正确加载?
- [ ] 菜单正常显示?
- [ ] 小工具可以添加?

---

## 🎨 常用定制速查

### 颜色定制
```css
/* 外观 > 自定义 > 额外 CSS */

/* 主色调 (霓虹青) */
:root {
    --neon-cyan: #00f0ff;
}

/* 强调色 (霓虹品红) */
:root {
    --neon-magenta: #ff00ff;
}

/* 背景色 */
:root {
    --bg-dark: #0a0a0f;
}
```

### 字体定制
```css
/* 修改字体 */
body {
    font-family: 'Your Font', sans-serif;
}

/* 修改字号 */
body {
    font-size: 18px;
}
```

### 布局定制
```css
/* 容器宽度 */
.container {
    max-width: 1400px;
}

/* 侧边栏宽度 */
#secondary {
    width: 350px;
}
```

---

## 🔖 短代码速查表

### Portfolio
```shortcode
[portfolio count="6" columns="3" filter="yes"]
```

### Blog Posts
```shortcode
[cyberpunk_posts count="3" category="news"]
```

### Button
```shortcode
[cyberpunk_button url="#" color="cyan"]按钮文本[/cyberpunk_button]
```

### Alert
```shortcode
[cyberpunk_alert type="warning"]警告内容[/cyberpunk_alert]
```

---

## 🧩 小工具速查

| 小工具 | 位置 | 用途 |
|--------|------|------|
| **About Me** | Sidebar/页脚 | 个人简介 |
| **Recent Posts** | Sidebar/页脚 | 最新文章 |
| **Popular Posts** | Sidebar/页脚 | 热门文章 |
| **Social Links** | 页脚 | 社交链接 |
| **Search** | Sidebar/页脚 | 搜索框 |

---

## 📐 尺寸规格速查

### 图片尺寸
| 类型 | 推荐尺寸 | 用途 |
|------|----------|------|
| **Logo** | 400x100px | 网站 Logo |
| **特色图片** | 1200x675px | 文章缩略图 |
| **Portfolio** | 1200x600px | 项目封面 |
| **缩略图** | 600x400px | 列表显示 |
| **站点图标** | 512x512px | 浏览器图标 |

### 容器宽度
| 断点 | 宽度 | 设备 |
|------|------|------|
| **Desktop** | 1200px | 桌面 |
| **Tablet** | 768px | 平板 |
| **Mobile** | 480px | 手机 |

---

## 🎯 核心功能开关

### 主题定制器路径
```
外观 > 自定义 > [设置区域]
```

### 视觉效果开关
| 效果 | 路径 | 开关 |
|------|------|------|
| **扫描线** | 自定义 > 高级 > 视觉效果 | ✅ ON |
| **发光** | 自定义 > 高级 > 视觉效果 | ✅ ON |
| **动画** | 自定义 > 高级 > 性能 | ✅ ON |

---

## 📊 性能优化检查清单

### ⚡ 基础优化 (5分钟)
- [ ] 启用缓存插件 (WP Super Cache)
- [ ] 压缩图片 (Smush)
- [ ] 延迟加载已启用
- [ ] 精简插件数量

### 🚀 高级优化 (15分钟)
- [ ] 配置 CDN (Cloudflare)
- [ ] 启用 GZIP 压缩
- [ ] 优化数据库 (WP-Optimize)
- [ ] 最小化 CSS/JS

---

## 🔧 故障排除流程图

```
问题发生
    │
    ├─ 样式问题?
    │   └─ 清除缓存 → 检查 style.css → 检查权限
    │
    ├─ 功能失效?
    │   └─ 停用插件 → 逐个启用 → 找出冲突
    │
    ├─ 图片问题?
    │   └─ 重新生成缩略图 → 检查上传文件夹
    │
    └─ 无法登录?
        └─ 重置密码 → 检查 Cookie → 清除浏览器缓存
```

---

## 📞 支持渠道速查

### 🆘 紧急问题 (24h)
- **付费用户**: support@cyberpunk-theme.com
- **Discord**: discord.gg/cyberpunk

### 📖 自助服务
- **文档**: docs.cyberpunk-theme.com
- **论坛**: forum.cyberpunk-theme.com
- **FAQ**: user/FAQ.md

### 📺 学习资源
- **视频**: youtube.com/@cyberpunk-theme
- **博客**: blog.cyberpunk-theme.com

---

## 🎓 学习路径图

### 第1周: 基础入门
```
Day 1-2: 安装和激活
Day 3-4: 主题定制器
Day 5-7: 发布内容
```

### 第2周: 核心功能
```
Day 8-10: Portfolio 设置
Day 11-12: 菜单和小工具
Day 13-14: 优化调整
```

### 第3周: 深度定制
```
Day 15-17: CSS 定制
Day 18-19: 子主题
Day 20-21: 性能优化
```

### 第4周: 高级应用
```
Day 22-24: 短代码
Day 25-26: REST API
Day 27-30: 完整项目
```

---

## 📝 文档写作规范

### 标题层级
```markdown
# H1: 文档标题 (每文档1个)
## H2: 主要章节
### H3: 小节
#### H4: 细节 (尽量少用)
```

### 提示框语法
```markdown
> 💡 **提示**: 有用建议
> ⚠️ **注意**: 重要警告
> ❌ **错误**: 常见错误
> ✅ **成功**: 完成提示
```

### 代码块
````markdown
```css
/* CSS 代码 */
body { }
```

```shortcode
/* 短代码 */
[portfolio]
```
````

### 截图规范
- **尺寸**: 最大 1200px 宽
- **格式**: PNG (清晰) 或 JPG (小文件)
- **命名**: 功能-step-数字.png
- **标注**: 使用箭头和文字标注关键区域

---

## 📦 交付检查清单

### ✅ 每个文档必须包含
- [ ] 清晰的标题
- [ ] 阅读时间
- [ ] 难度评级
- [ ] 更新日期
- [ ] 目录 (长文档)
- [ ] 截图 (操作步骤)
- [ ] 代码示例 (技术文档)
- [ ] 相关链接

### ✅ 发布前检查
- [ ] 所有链接有效
- [ ] 所有截图清晰
- [ ] 代码示例可运行
- [ ] 拼写检查完成
- [ ] 同行评审通过

---

## 🎯 质量标准

### 用户满意度指标
- **清晰度**: 4.5/5
- **完整性**: 95% 功能覆盖
- **准确性**: 100% 技术正确
- **易用性**: 80% 独立解决问题

### 持续改进
- **月度审查**: 每月检查准确性
- **用户反馈**: 收集并分析反馈
- **版本同步**: 代码更新后48h内更新文档

---

## 🔗 快速链接

### 内部文档
- [技术架构](../TECHNICAL_ARCHITECTURE.md)
- [实施指南](../IMPLEMENTATION_GUIDE.md)
- [开发文档](../INDEX.md)

### 外部资源
- [WordPress 官方文档](https://wordpress.org/documentation/)
- [主题开发手册](https://developer.wordpress.org/themes/)
- [插件开发手册](https://developer.wordpress.org/plugins/)

---

## 📅 版本历史

| 版本 | 日期 | 变更 |
|------|------|------|
| 1.0.0 | 2026-03-01 | 初始版本 |

---

## 💬 反馈

> **这个参考卡有用吗？**
>
> 请告诉我们你的想法:
> - 📝 [GitHub Issues](https://github.com/cyberpunk-theme/issues)
> - 📧 [Email](mailto:docs@cyberpunk-theme.com)

---

**打印建议**: 双面打印，随身携带
**数字版本**: 保存在手机/平板以备查阅
**更新频率**: 每月更新

---

**文档版本**: 1.0.0
**创建日期**: 2026-03-01
**下次审查**: 2026-04-01
