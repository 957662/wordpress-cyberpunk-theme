# CyberPress Platform - 图标清单

## 📁 图标文件结构

```
frontend/public/
├── logo.svg              # 主 Logo (200x200)
├── logo-icon.svg         # 小图标 Logo (64x64)
├── logo-square.svg       # 方形 Logo (512x512)
└── icons/                # 功能图标目录
    ├── navigation/       # 导航图标
    ├── social/           # 社交媒体图标
    ├── ui/               # UI 元素图标
    └── actions/          # 操作图标
```

---

## 🎯 Logo 变体

| 文件名 | 尺寸 | 用途 |
|--------|------|------|
| `logo.svg` | 200x200 | 页面头部、关于页 |
| `logo-icon.svg` | 64x64 | 浏览器标签、小图标 |
| `logo-square.svg` | 512x512 | 社交媒体头像、应用图标 |

---

## 🧭 导航图标 (Navigation)

| 图标 | 文件名 | 用途 |
|------|--------|------|
| 🏠 | `home.svg` | 首页导航 |
| 📄 | `blog.svg` | 博客页面 |
| 🖼️ | `portfolio.svg` | 作品集 |
| ℹ️ | `about.svg` | 关于页面 |
| 🔍 | `search.svg` | 搜索功能 |

---

## 🌐 社交媒体图标 (Social)

| 图标 | 文件名 | 用途 |
|------|--------|------|
| 🐙 | `github.svg` | GitHub 链接 |
| 𝕏 | `twitter.svg` | Twitter/X 链接 |
| 💼 | `linkedin.svg` | LinkedIn 链接 |
| ✉️ | `email.svg` | 邮件联系 |
| 📡 | `rss.svg` | RSS 订阅 |
| 💬 | `discord.svg` | Discord 链接 |
| 📺 | `youtube.svg` | YouTube 链接 |
| 🎨 | `dribbble.svg` | Dribbble 链接 |
| 🎯 | `figma.svg` | Figma 链接 |

---

## 🎨 UI 元素图标 (UI Elements)

| 图标 | 文件名 | 用途 |
|------|--------|------|
| 📅 | `calendar.svg` | 日期显示 |
| 🏷️ | `tag.svg` | 标签/分类 |
| ⭐ | `star.svg` | 收藏/评分 |
| 👤 | `user.svg` | 用户头像 |
| ☀️ | `sun.svg` | 浅色模式 |
| 🌙 | `moon.svg` | 深色模式 |
| ⚙️ | `settings.svg` | 设置 |
| 💻 | `terminal.svg` | 代码终端 |
| ⚠️ | `alert.svg` | 警告提示 |
| ✅ | `check.svg` | 成功确认 |
| 🔔 | `bell.svg` | 通知 |
| ⊞ | `grid.svg` | 网格视图 |
| ☰ | `list.svg` | 列表视图 |
| ⚙️ | `sliders.svg` | 设置/筛选 |

---

## ⚡ 操作图标 (Actions)

| 图标 | 文件名 | 用途 |
|------|--------|------|
| ➡️ | `arrow-right.svg` | 下一步/继续 |
| ⬅️ | `arrow-left.svg` | 上一步/返回 |
| ☰ | `menu.svg` | 菜单按钮 |
| ✕ | `close.svg` | 关闭/取消 |
| ⏳ | `loading.svg` | 加载状态 |
| 💻 | `code.svg` | 查看代码 |
| 🔗 | `external-link.svg` | 外部链接 |
| ❤️ | `heart.svg` | 点赞/喜欢 |
| 📤 | `share.svg` | 分享 |
| 🔽 | `filter.svg` | 筛选/过滤 |
| ⤢ | `expand.svg` | 全屏/展开 |
| ⤡ | `minimize.svg` | 最小化/收起 |

---

## 🎨 使用方式

### 在 React 组件中使用

```tsx
import Image from 'next/image';

// 使用 Logo
<Image src="/logo.svg" alt="CyberPress Logo" width={200} height={200} />

// 使用图标
<Image src="/icons/home.svg" alt="Home" width={24} height={24} />
```

### 作为 SVG 直接引入

```tsx
// components/Icon.tsx
export function HomeIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      width="24"
      height="24"
      fill="none"
      stroke="currentColor"
    >
      <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
      <polyline points="9,22 9,12 15,12 15,22"/>
    </svg>
  );
}
```

### 使用 Lucide React（推荐）

项目已安装 `lucide-react`，推荐使用：

```tsx
import { Home, Blog, Search, Github, Twitter } from 'lucide-react';

<Home className="w-6 h-6 text-cyber-cyan" />
<Search size={24} strokeWidth={2} />
```

---

## 🔧 技术规格

- **格式**: SVG
- **描边宽度**: 2px
- **描边样式**: round caps & joins
- **颜色**: `currentColor` (继承父元素颜色)
- **尺寸**: 24x24 (标准), 可缩放
- **发光效果**: 内置霓虹滤镜

---

## 🎨 赛博朋克配色方案

所有图标都使用 `currentColor`，配合 Tailwind CSS 的赛博朋克主题色：

```css
/* 霓虹青 */
.text-cyber-cyan { color: #00f0ff; }

/* 赛博紫 */
.text-cyber-purple { color: #9d00ff; }

/* 激光粉 */
.text-cyber-pink { color: #ff0080; }

/* 电压黄 */
.text-cyber-yellow { color: #f0ff00; }
```

---

---

## 📁 文件类型图标 (File Types)

| 图标 | 文件名 | 用途 |
|------|--------|------|
| 📄 | `file-pdf.svg` | PDF 文件 |
| 🖼️ | `file-image.svg` | 图片文件 |
| 💻 | `file-code.svg` | 代码文件 |
| 📦 | `file-zip.svg` | 压缩文件 |

---

## 🛠️ 开发工具图标 (Dev Tools)

| 图标 | 文件名 | 用途 |
|------|--------|------|
| 🦊 | `gitlab.svg` | GitLab |
| 📦 | `npm.svg` | NPM |
| 🐳 | `docker.svg` | Docker |
| ▲ | `vercel.svg` | Vercel |

---

## 📝 注意事项

1. 所有图标已内置发光滤镜效果
2. 支持深色/浅色主题自动切换
3. SVG 格式确保在任何分辨率下清晰显示
4. 使用 `currentColor` 实现动态颜色变化
5. 建议优先使用 `lucide-react` 库中的图标

---

## 📊 图标统计

| 类别 | 数量 |
|------|------|
| 导航图标 | 5 |
| 社交媒体 | 9 |
| UI 元素 | 14 |
| 操作图标 | 12 |
| 文件类型 | 4 |
| 开发工具 | 4 |
| **总计** | **48+** |

---

**最后更新**: 2026-03-03
**版本**: v2.0
