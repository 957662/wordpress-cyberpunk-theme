# CyberPress 图形设计资源

[![Version](https://img.shields.io/badge/version-2.0.0-cyan.svg)](https://github.com/cyberpress-platform)
[![License](https://img.shields.io/badge/license-MIT-purple.svg)](LICENSE)
[![Style](https://img.shields.io/badge/style-cyberpunk-pink.svg)](https://cyberpress.dev)

> 🎨 赛博朋克风格的完整图形设计系统

---

## 📋 概述

CyberPress Platform 提供了一套完整的赛博朋克风格图形设计资源，包括图标、Logo、配色方案和动画效果。

### ✨ 特性

- 🎨 **赛博朋克美学** - 霓虹发光、科技线条
- 📦 **120+ 图标** - 基于 Lucide React + 自定义赛博朋克图标
- 🌈 **完整配色** - 5 种霓虹色 + 渐变系统
- 🔄 **原生动画** - SVG 动画 + Framer Motion
- 📱 **响应式** - 适配所有设备
- 🎯 **TypeScript** - 完整类型支持

---

## 🚀 快速开始

### 安装依赖

```bash
# 已在 package.json 中配置
npm install lucide-react framer-motion
```

### 使用图标

```tsx
// 导入图标
import { SearchIcon, GitHubIcon } from '@/components/icons';

// 使用图标
<SearchIcon size={24} className="text-cyber-cyan" />

// 或者批量导入
import * as Icons from '@/components/icons';
<Icons.SearchIcon size={24} />
```

### 使用颜色

```tsx
// Tailwind 类名
<button className="bg-gradient-to-r from-cyber-cyan to-cyber-purple">
  点击我
</button>

// 内联样式
<div style={{ color: '#00f0ff' }}>霓虹青文字</div>
```

---

## 📦 资源目录

```
cyberpress-platform/
├── frontend/
│   ├── components/
│   │   └── icons/
│   │       ├── index.tsx              # 图标导出
│   │       ├── IconGallery.tsx        # 图标画廊
│   │       └── [50+ 图标组件]
│   │
│   ├── public/
│   │   ├── icons/
│   │   │   ├── cyberpunk/             # 赛博朋克 SVG 图标 (40+)
│   │   │   ├── [基础图标].svg         # 基础 SVG 图标
│   │   │   └── ...
│   │   │
│   │   ├── patterns/                  # 背景图案
│   │   ├── backgrounds/               # 背景图形
│   │   └── logo*.svg                  # Logo 文件
│   │
│   └── docs/                          # 文档
│       ├── ICON_MANIFEST.md           # 图标清单
│       ├── COLOR_REFERENCE.md         # 配色参考
│       └── ...
│
└── GRAPHICS_DESIGN_SUMMARY.md         # 设计总结
```

---

## 🎨 核心颜色

| 颜色 | HEX | 用途 | Tailwind 类名 |
|------|-----|------|--------------|
| 霓虹青 | `#00f0ff` | 主要操作 | `text-cyber-cyan` |
| 赛博紫 | `#9d00ff` | 次要操作 | `text-cyber-purple` |
| 激光粉 | `#ff0080` | 危险/强调 | `text-cyber-pink` |
| 电压黄 | `#f0ff00` | 警告/高亮 | `text-cyber-yellow` |
| 矩阵绿 | `#00ff88` | 成功/确认 | `text-cyber-green` |

### 渐变效果

```tsx
// 主品牌渐变
className="bg-gradient-to-r from-cyber-cyan to-cyber-purple"

// 三色渐变
className="bg-gradient-to-r from-cyber-cyan via-cyber-purple to-cyber-pink"

// 文本渐变
className="bg-gradient-to-r from-cyber-cyan to-cyber-purple bg-clip-text text-transparent"
```

---

## 📚 图标分类

### 基础图标 (Lucide React)

- **导航** (7): Home, Menu, Arrow, Chevron, ExternalLink...
- **操作** (9): Search, Edit, Trash, Save, Refresh, Filter, Copy...
- **状态** (7): Check, Alert, Info, Star, Loader, Eye...
- **社交** (4): GitHub, Twitter, Mail, Share...
- **用户** (4): User, Settings, LogOut, LogIn...
- **内容** (9): BookOpen, Code, Image, Video, Music, Folder...
- **科技** (7): Cpu, Zap, Terminal, Database, Server, Cloud...
- **交互** (4): Heart, Theme, Mic, Camera...

### 赛博朋克图标

位于 `frontend/public/icons/cyberpunk/`

- **核心科技**: microchip, circuit-board, neon-grid, hologram-display, data-stream
- **视觉效果**: glitch-effect, energy-field, cyber-eye, data-cube
- **设备工具**: drone, cyber-skull, warning-sign, shield-cyber, rocket-cyber

---

## 🎯 常用组件

### 按钮

```tsx
// 主要按钮
<button className="px-6 py-2 bg-gradient-to-r from-cyber-cyan to-cyber-purple text-white font-bold rounded-lg hover:shadow-neon-cyan transition-all">
  主要按钮
</button>

// 次要按钮
<button className="px-6 py-2 border-2 border-cyber-cyan text-cyber-cyan font-bold rounded-lg hover:bg-cyber-cyan hover:text-black transition-all">
  次要按钮
</button>
```

### 卡片

```tsx
<div className="bg-cyber-card border border-cyber-border rounded-lg p-6 hover:border-cyber-cyan hover:shadow-neon-cyan transition-all">
  <h3 className="text-xl font-bold text-cyber-cyan mb-2">标题</h3>
  <p className="text-cyber-gray-200">内容</p>
</div>
```

### 输入框

```tsx
<input
  type="text"
  placeholder="搜索..."
  className="w-full px-4 py-2 bg-cyber-dark border-2 border-cyber-border rounded-lg text-white focus:border-cyber-cyan focus:outline-none"
/>
```

---

## 🖼️ Logo 使用

```tsx
import Image from 'next/image';

// 主 Logo
<Image src="/logo-main.svg" alt="CyberPress" width={200} height={60} />

// 图标版
<Image src="/logo-icon.svg" alt="CyberPress Icon" width={100} height={100} />

// 或使用组件
import { Logo } from '@/components/icons';
<Logo className="w-40 h-12" />
```

---

## ✨ 动画效果

### Framer Motion

```tsx
import { motion } from 'framer-motion';

// 淡入
<motion.div
  initial={{ opacity: 0 }}
  animate={{ opacity: 1 }}
  transition={{ duration: 0.3 }}
>
  内容
</motion.div>

// 悬浮效果
<motion.button
  whileHover={{ scale: 1.05 }}
  whileTap={{ scale: 0.95 }}
>
  按钮
</motion.button>
```

### SVG 原生动画

赛博朋克图标包含内置 SVG 动画，直接导入即可使用：

```tsx
<img src="/icons/cyberpunk/microchip.svg" alt="Microchip" />
```

---

## 📖 文档

- **[图标清单](./frontend/docs/ICON_MANIFEST.md)** - 完整图标目录
- **[配色参考](./frontend/docs/COLOR_REFERENCE.md)** - 颜色系统详解
- **[快速参考](./frontend/docs/GRAPHICS_QUICK_REFERENCE.md)** - 快速查询指南
- **[设计总结](./GRAPHICS_DESIGN_SUMMARY.md)** - 项目完成报告

---

## 🎨 图标画廊

访问 `/icon-gallery` 路由查看所有可用图标：

```tsx
import IconGallery from '@/components/icons/IconGallery';

export default function GalleryPage() {
  return <IconGallery />;
}
```

---

## 🔧 配置

### Tailwind CSS

已在 `tailwind.config.ts` 中配置：

```typescript
colors: {
  'cyber-cyan': '#00f0ff',
  'cyber-purple': '#9d00ff',
  'cyber-pink': '#ff0080',
  'cyber-yellow': '#f0ff00',
  'cyber-green': '#00ff88',
  'cyber-dark': '#0a0a0f',
  // ...
}
```

---

## 📊 浏览器支持

- ✅ Chrome/Edge 90+
- ✅ Firefox 88+
- ✅ Safari 14+
- ✅ iOS Safari 14+
- ✅ Android Chrome 90+

---

## 🤝 贡献

欢迎提交 Issue 和 Pull Request！

---

## 📄 许可

MIT License

---

## 🙏 致谢

本设计系统基于：

- [Lucide](https://lucide.dev/) - 优秀的图标库
- [Tailwind CSS](https://tailwindcss.com/) - 实用工具框架
- [Framer Motion](https://www.framer.com/motion/) - 动画库
- [Next.js](https://nextjs.org/) - React 框架

---

**版本**: v2.0.0
**最后更新**: 2026-03-06
**维护团队**: CyberPress AI Design Team

---

<div align="center">

**[⬆ 返回顶部](#cyberpress-图形设计资源)**

Made with 💜 by CyberPress Team

</div>
