# CyberPress Platform - 完整图形资源指南

## 📊 资源概览

本文档提供 CyberPress Platform 项目所有图形资源的完整清单和使用指南。

---

## 🎯 Logo 系列

### 主要 Logo 文件

| 文件路径 | 尺寸 | 用途 | 格式 |
|---------|------|------|------|
| `/public/logo-main.svg` | 512x512 | 页面主 Logo、页眉 | SVG (动画) |
| `/public/logo-square.svg` | 512x512 | 社交媒体、应用图标 | SVG (动画) |
| `/public/logo-favicon.svg` | 64x64 | 浏览器标签页图标 | SVG (静态) |
| `/public/og-image.svg` | 1200x630 | Open Graph 社交分享 | SVG |

### 使用方式

```tsx
import Image from 'next/image';

// 主 Logo
<Image src="/logo-main.svg" alt="CyberPress" width={200} height={200} />

// 方形 Logo
<Image src="/logo-square.svg" alt="CyberPress" width={512} height={512} />

// Favicon
<Image src="/logo-favicon.svg" alt="CyberPress" width={64} height={64} />
```

---

## 🎨 图标库

### 导航图标 (Navigation)

| 图标 | 文件名 | 用途 |
|------|--------|------|
| 🏠 | `home.svg` | 首页 |
| 📄 | `blog.svg` | 博客 |
| 🖼️ | `portfolio.svg` | 作品集 |
| ℹ️ | `about.svg` | 关于 |
| 🔍 | `search.svg` | 搜索 |
| ☰ | `menu.svg` | 菜单 |

### 社交图标 (Social)

| 图标 | 文件名 | 用途 |
|------|--------|------|
| 🐙 | `github.svg` | GitHub |
| 𝕏 | `twitter.svg` | Twitter/X |
| 💼 | `linkedin.svg` | LinkedIn |
| ✉️ | `email.svg` | 邮箱 |
| 📡 | `rss.svg` | RSS 订阅 |

### UI 操作图标 (UI Actions)

| 图标 | 文件名 | 用途 |
|------|--------|------|
| ✏️ | `edit.svg` | 编辑 |
| 🗑️ | `trash.svg` | 删除 |
| 💾 | `save.svg` | 保存 |
| 📋 | `copy.svg` | 复制 |
| 🔗 | `link-2.svg` | 链接 |
| 📎 | `paperclip.svg` | 附件 |
| 🔄 | `refresh.svg` | 刷新 |
| ⬇️ | `download.svg` | 下载 |
| ⬆️ | `upload.svg` | 上传 |

### 状态图标 (Status)

| 图标 | 文件名 | 用途 |
|------|--------|------|
| ✅ | `check.svg` | 成功 |
| ⚠️ | `alert.svg` | 警告 |
| ❌ | `close.svg` | 关闭 |
| ℹ️ | `info.svg` | 信息 |
| 🔒 | `lock.svg` | 锁定 |
| 🔓 | `unlock.svg` | 解锁 |
| 🛡️ | `shield.svg` | 安全 |

### 媒体图标 (Media)

| 图标 | 文件名 | 用途 |
|------|--------|------|
| 🖼️ | `image.svg` | 图片 |
| 🎥 | `video.svg` | 视频 |
| 🎤 | `mic.svg` | 音频 |
| 📁 | `folder.svg` | 文件夹 |
| 📄 | `file-text.svg` | 文档 |
| 💻 | `code.svg` | 代码 |

### 开发图标 (Development)

| 图标 | 文件名 | 用途 |
|------|--------|------|
| 🖥️ | `terminal.svg` | 终端 |
| 🗄️ | `database.svg` | 数据库 |
| 🌐 | `server.svg` | 服务器 |
| ☁️ | `cloud.svg` | 云服务 |
| 🔀 | `git-branch.svg` | Git 分支 |
| 🔗 | `git-commit.svg` | Git 提交 |
| ⏱️ | `history.svg` | 历史 |
| #️⃣ | `hash.svg` | 标签 |

### 主题图标 (Theme)

| 图标 | 文件名 | 用途 |
|------|--------|------|
| ☀️ | `sun.svg` | 浅色模式 |
| 🌙 | `moon.svg` | 深色模式 |
| ⚙️ | `settings.svg` | 设置 |
| 👤 | `user.svg` | 用户 |
| 🔔 | `bell.svg` | 通知 |
| 💬 | `comment.svg` | 评论 |
| 📑 | `bookmark.svg` | 书签 |

### 导航箭头 (Arrows)

| 图标 | 文件名 | 用途 |
|------|--------|------|
| → | `arrow-right.svg` | 右箭头 |
| ← | `arrow-left.svg` | 左箭头 |
| ↑ | `chevron-up.svg` | 上箭头 |
| ↓ | `chevron-down.svg` | 下箭头 |
| ⮕ | `chevron-right.svg` | 右 chevron |
| ⬅ | `chevron-left.svg` | 左 chevron |

### 其他图标 (Misc)

| 图标 | 文件名 | 用途 |
|------|--------|------|
| 👁️ | `eye.svg` | 显示 |
| 👁️‍🗨️ | `eye-off.svg` | 隐藏 |
| ❤️ | `heart.svg` | 喜欢 |
| ⭐ | `star.svg` | 收藏 |
| ⚡ | `zap.svg` | 快速 |
| 🔍 | `filter.svg` | 筛选 |
| 📊 | `grid-layout.svg` | 网格 |
| ⋯ | `more-horizontal.svg` | 更多 |

### 图标使用示例

```tsx
import Image from 'next/image';

// 基础使用
<Image src="/icons/home.svg" alt="Home" width={24} height={24} />

// 带样式类
<Image
  src="/icons/github.svg"
  alt="GitHub"
  width={20}
  height={20}
  className="text-cyber-cyan hover:text-cyber-purple transition-colors"
/>

// 作为 React 组件
function Icon({ src, alt, size = 24, className = '' }: IconProps) {
  return (
    <Image
      src={`/icons/${src}.svg`}
      alt={alt}
      width={size}
      height={size}
      className={`inline-block ${className}`}
    />
  );
}
```

---

## 🖼️ 插画 (Illustrations)

### 可用插画

| 文件名 | 尺寸 | 主题 | 用途 |
|--------|------|------|------|
| `cyber-city.svg` | 800x400 | 赛博朋克城市 | Hero 区域、404 页面 |
| `developer-workspace.svg` | 600x400 | 开发工作空间 | 关于页面、博客特色图片 |
| `network-nodes.svg` | 600x400 | 网络节点 | 技术架构、API 文档 |
| `server-rack.svg` | - | 服务器机架 | 基础设施相关 |
| `code-screen.svg` | - | 代码屏幕 | 编程相关内容 |
| `circuit-board.svg` | - | 电路板 | 技术背景 |
| `network-globe.svg` | - | 地球网络 | 全球化主题 |

### 插画使用示例

```tsx
// Hero 区域使用
<section className="relative">
  <Image
    src="/illustrations/cyber-city.svg"
    alt="Cyber City"
    fill
    className="object-cover"
  />
  <div className="absolute inset-0 bg-gradient-to-t from-cyber-black"/>
</section>

// 文章特色图片
<Image
  src="/illustrations/developer-workspace.svg"
  alt="Developer Workspace"
  width={600}
  height={400}
  className="rounded-lg"
/>
```

---

## 🎨 背景图案 (Patterns)

### 可用图案

| 文件名 | 类型 | 主题 | 用途 |
|--------|------|------|------|
| `grid.svg` | 填充图案 | 网格 | 背景 |
| `circuit.svg` | 填充图案 | 电路 | 技术背景 |
| `scanlines.svg` | 填充图案 | 扫描线 | 复古效果 |
| `noise.svg` | 填充图案 | 噪点 | 纹理 |
| `hexagon.svg` | 填充图案 | 六边形 | 科技背景 |
| `matrix.svg` | 填充图案 | 矩阵 | 黑客风格 |
| `holographic.svg` | 填充图案 | 全息 | 未来感 |
| `hex-grid.svg` | 填充图案 | 六边形网格 | 高级网格 |

### 背景图案使用

```css
/* CSS 方式 */
.cyber-grid-bg {
  background-image: url('/patterns/grid.svg');
  background-repeat: repeat;
}

/* Tailwind 方式 */
<div className="bg-[url('/patterns/circuit.svg')]">
  内容
</div>

/* React 方式 */
<div style={{
  backgroundImage: "url('/patterns/matrix.svg')",
  backgroundRepeat: 'repeat'
}}>
  内容
</div>
```

---

## 🖼️ 背景图片 (Backgrounds)

### 可用背景

| 文件名 | 尺寸 | 用途 |
|--------|------|------|
| `hero-bg.svg` | 1920x1080 | 首页 Hero |
| `card-bg.svg` | - | 卡片背景 |
| `loading-bg.svg` | - | 加载页面 |
| `404-bg.svg` | - | 404 页面 |

---

## ✨ 装饰元素 (Decorations)

### 可用装饰

| 文件名 | 尺寸 | 用途 |
|--------|------|------|
| `corner-bracket.svg` | 100x100 | 边框装饰 |
| `divider-line.svg` | 400x20 | 分隔线 |
| `loader-ring.svg` | 80x80 | 加载动画 |

### 装饰元素使用

```tsx
// 边框装饰
<div className="absolute top-0 left-0">
  <Image src="/decorations/corner-bracket.svg" alt="" width={100} height={100} />
</div>

// 分隔线
<hr className="my-8" style={{
  backgroundImage: "url('/decorations/divider-line.svg')",
  height: '20px',
  border: 'none'
}}/>

// 加载动画
<Image
  src="/decorations/loader-ring.svg"
  alt="Loading..."
  width={80}
  height={80}
  className="animate-spin-slow"
/>
```

---

## 🎨 配色方案

### 核心颜色

```css
/* 主色调 */
--cyber-black: #0a0a0f;
--cyber-cyan: #00f0ff;
--cyber-purple: #9d00ff;
--cyber-pink: #ff0080;
--cyber-yellow: #f0ff00;
--cyber-green: #00ff88;

/* 灰度 */
--cyber-gray-100: #e0e0e0;
--cyber-gray-200: #a0a0b0;
--cyber-gray-300: #606070;
--cyber-gray-400: #303040;
```

### 发光效果

```css
/* 霓虹发光 */
.neon-glow-cyan {
  box-shadow: 0 0 5px #00f0ff, 0 0 10px #00f0ff, 0 0 20px #00f0ff;
}

.neon-glow-purple {
  box-shadow: 0 0 5px #9d00ff, 0 0 10px #9d00ff, 0 0 20px #9d00ff;
}

.neon-glow-pink {
  box-shadow: 0 0 5px #ff0080, 0 0 10px #ff0080, 0 0 20px #ff0080;
}
```

### 渐变

```css
/* 赛博渐变 */
.cyber-gradient {
  background: linear-gradient(135deg, #00f0ff 0%, #9d00ff 50%, #ff0080 100%);
}

/* 霓虹渐变 */
.neon-gradient {
  background: linear-gradient(135deg, #00f0ff 0%, #9d00ff 100%);
}
```

---

## 📐 技术规格

### SVG 标准

- **格式**: SVG 1.1
- **描边**: `currentColor` (可变色)
- **描边宽度**: 1.5px - 2px
- **线条端点**: round
- **线条连接**: round
- **尺寸**: 24x24 (图标), 可缩放

### 动画支持

- ✅ SMIL 动画
- ✅ CSS 动画
- ✅ JavaScript 控制

### 优化

- ✅ 已压缩
- ✅ 可访问性 (ARIA)
- ✅ 响应式设计
- ✅ 深色/浅色模式

---

## 🎯 最佳实践

### 1. 图标尺寸

```tsx
// 小图标 (按钮内)
<Icon size={16} />

// 标准图标 (导航)
<Icon size={24} />

// 大图标 (特色)
<Icon size={32} />

// 超大图标 (Hero)
<Icon size={48} />
```

### 2. 颜色使用

```tsx
// 主色
className="text-cyber-cyan"

// 次色
className="text-cyber-purple"

// 强调色
className="text-cyber-pink"

// 高亮色
className="text-cyber-yellow"
```

### 3. 动画效果

```tsx
// 发光脉冲
className="animate-pulse-glow"

// 悬浮
className="animate-float"

// 故障效果
className="animate-glitch"
```

### 4. 响应式图片

```tsx
<Image
  src="/illustrations/cyber-city.svg"
  alt="Cyber City"
  fill
  sizes="(max-width: 768px) 100vw, 50vw"
  className="object-cover"
/>
```

---

## 📚 相关文档

- [图标清单](/public/ICON_MANIFEST.md) - 详细图标目录
- [配色参考](/public/COLOR_PALETTE.md) - 完整配色方案
- [项目 README](/PROJECT.md) - 项目总览

---

## 🔄 更新日志

### 2026-03-02
- ✅ 创建 Logo 系列 (main, square, favicon)
- ✅ 创建 60+ 功能图标
- ✅ 创建 7 个插画
- ✅ 创建 8 个背景图案
- ✅ 创建装饰元素
- ✅ 创建 SVG Sprite 系统
- ✅ 编写完整文档

---

## 📧 反馈与贡献

如需添加新的图形素材或报告问题，请联系设计团队。

---

**最后更新**: 2026-03-02
**版本**: 1.0.0
**设计系统**: CyberPress Design System v1.0
