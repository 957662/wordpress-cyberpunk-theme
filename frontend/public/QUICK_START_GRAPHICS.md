# CyberPress 图形素材快速参考

## 🎯 快速导航

- [Logo 使用](#logo-使用)
- [图标使用](#图标使用)
- [插画使用](#插画使用)
- [装饰元素](#装饰元素)
- [配色参考](#配色参考)
- [常见问题](#常见问题)

---

## 🎨 Logo 使用

### 方式一: Next.js Image 组件
```tsx
import Image from 'next/image';

// 主 Logo
<Image src="/logo-main.svg" alt="CyberPress" width={200} height={200} />

// 图标 Logo
<Image src="/logo-icon.svg" alt="CyberPress Icon" width={100} height={100} />

// 单色版本
<Image src="/brand/logo-monochrome.svg" alt="CyberPress" width={200} height={200} />
```

### 方式二: CSS 背景
```css
.logo-bg {
  background-image: url('/logo-main.svg');
  background-size: contain;
  background-repeat: no-repeat;
}
```

### 可用 Logo 变体
| 文件 | 用途 | 尺寸 |
|------|------|------|
| `logo-main.svg` | 主 Logo | 200x200 |
| `logo-icon.svg` | 应用图标 | 100x100 |
| `logo-mark.svg` | Favicon | 50x50 |
| `logo-square.svg` | 社交媒体 | 200x200 |
| `brand/logo-monochrome.svg` | 单色版本 | 200x200 |
| `brand/logo-outline.svg` | 线框版本 | 200x200 |

---

## 🔧 图标使用

### 方式一: 直接使用 SVG
```tsx
<Image src="/icons/home.svg" alt="Home" width={24} height={24} />
```

### 方式二: 作为 React 组件
```tsx
import { HomeIcon, SearchIcon, UserIcon } from '@/components/icons';

<HomeIcon size={24} />
<SearchIcon size={20} className="text-cyber-cyan" />
<UserIcon size={32} className="text-cyber-purple" />
```

### 常用图标快速查找

#### 导航类
```tsx
// 首页
<Image src="/icons/home.svg" />

// 博客
<Image src="/icons/blog.svg" />

// 关于
<Image src="/icons/about.svg" />

// 作品集
<Image src="/icons/portfolio.svg" />

// 搜索
<Image src="/icons/search.svg" />
```

#### 社交类
```tsx
// GitHub
<Image src="/icons/github.svg" />

// Twitter
<Image src="/icons/twitter.svg" />

// LinkedIn
<Image src="/icons/linkedin.svg" />

// Email
<Image src="/icons/email.svg" />
```

#### 操作类
```tsx
// 编辑
<Image src="/icons/edit.svg" />

// 删除
<Image src="/icons/trash.svg" />

// 保存
<Image src="/icons/save.svg" />

// 复制
<Image src="/icons/copy.svg" />

// 下载
<Image src="/icons/download.svg" />
```

#### 状态类
```tsx
// 成功
<Image src="/icons/check.svg" />

// 警告
<Image src="/icons/alert.svg" />

// 收藏
<Image src="/icons/heart.svg" />

// 书签
<Image src="/icons/bookmark.svg" />
```

#### 赛博朋克图标 (新增)
```tsx
// 霓虹 WiFi
<Image src="/icons/neon-wifi.svg" />

// 数据脉冲
<Image src="/icons/data-pulse.svg" />

// 矩阵代码
<Image src="/icons/matrix-code.svg" />

// 赛博时钟
<Image src="/icons/clock-cyber.svg" />

// 防火墙
<Image src="/icons/firewall.svg" />
```

---

## 🖼️ 插画使用

### 页面状态插画
```tsx
// 空状态
<Image src="/illustrations/empty-state.svg" width={400} height={400} />

// 错误状态
<Image src="/illustrations/error-state.svg" width={400} height={400} />

// 成功状态
<Image src="/illustrations/success-state.svg" width={400} height={400} />

// 404 页面
<Image src="/illustrations/404-cyber.svg" width={400} height={400} />
```

### 技术主题插画 (新增)
```tsx
// AI 助手
<Image src="/illustrations/ai-assistant.svg" width={400} height={400} />

// 赛博连接
<Image src="/illustrations/cyber-connection.svg" width={400} height={400} />

// 安全扫描
<Image src="/illustrations/security-scan.svg" width={400} height={400} />

// 数据库集群
<Image src="/illustrations/database-cluster.svg" width={400} height={400} />

// AI 实验室
<Image src="/illustrations/cyber-ai-lab.svg" width={400} height={400} />

// DevOps 流水线
<Image src="/illustrations/cyber-devops.svg" width={400} height={400} />
```

---

## 🎭 装饰元素使用

### 加载动画
```tsx
// 六边形加载器 (新增)
<Image src="/decorations/hex-loader.svg" className="animate-spin" />

// 加载环
<Image src="/decorations/loader-ring.svg" className="animate-spin" />
```

### 按钮装饰 (新增)
```tsx
<div className="relative">
  <Image src="/decorations/cyber-button.svg" alt="" className="absolute inset-0" />
  <button className="relative z-10">Click Me</button>
</div>
```

### 动画效果 (新增)
```tsx
// 动画电路
<Image src="/decorations/circuit-lines-animated.svg" width={400} height={100} />

// 数据流
<Image src="/decorations/data-flow.svg" width={200} height={50} />
```

### 角落装饰
```tsx
// 左上角
<Image src="/decorations/cyber-corner.svg" className="absolute top-0 left-0" />

// 右上角 (需要旋转)
<Image src="/decorations/cyber-corner.svg" className="absolute top-0 right-0 rotate-90" />
```

---

## 🎨 配色参考

### CSS 变量
```css
/* 主色 */
--cyber-cyan: #00f0ff;
--cyber-purple: #9d00ff;
--cyber-pink: #ff0080;

/* 辅助色 */
--cyber-green: #00ff88;
--cyber-yellow: #f0ff00;
--cyber-orange: #ff6600;

/* 背景色 */
--cyber-dark: #0a0a0f;
--cyber-darker: #050508;
--cyber-card: #16162a;
```

### Tailwind 类名
```tsx
// 主色
<div className="text-cyber-cyan">青色文字</div>
<div className="text-cyber-purple">紫色文字</div>
<div className="text-cyber-pink">粉色文字</div>

// 背景
<div className="bg-cyber-dark">深色背景</div>
<div className="bg-cyber-card">卡片背景</div>

// 边框
<div className="border border-cyber-cyan">青色边框</div>
```

### 渐变
```tsx
// 品牌渐变
<div className="bg-gradient-to-r from-cyber-cyan to-cyber-purple">
  品牌渐变
</div>

// 三色渐变
<div className="bg-gradient-to-r from-cyber-cyan via-cyber-purple to-cyber-pink">
  三色渐变
</div>
```

---

## 📋 常见使用场景

### 1. 导航栏
```tsx
<nav className="bg-cyber-dark border-b border-cyber-cyan">
  <Image src="/logo-icon.svg" alt="Logo" width={40} height={40} />
  <div className="flex gap-4">
    <Image src="/icons/home.svg" alt="Home" width={24} height={24} />
    <Image src="/icons/blog.svg" alt="Blog" width={24} height={24} />
    <Image src="/icons/about.svg" alt="About" width={24} height={24} />
  </div>
</nav>
```

### 2. 卡片
```tsx
<div className="bg-cyber-card border border-cyber-cyan p-6 rounded-lg">
  <div className="flex items-center gap-3 mb-4">
    <Image src="/icons/code.svg" alt="Code" width={24} height={24} />
    <h3 className="text-cyber-cyan">Code</h3>
  </div>
  <p className="text-gray-300">Card content...</p>
</div>
```

### 3. 按钮
```tsx
<button className="relative overflow-hidden bg-gradient-to-r from-cyber-cyan to-cyber-purple text-white px-6 py-3 rounded-lg">
  <span className="relative z-10">Click Me</span>
</button>
```

### 4. 加载状态
```tsx
<div className="flex items-center justify-center">
  <Image src="/decorations/hex-loader.svg" alt="Loading" className="animate-spin" />
</div>
```

### 5. 空状态
```tsx
<div className="flex flex-col items-center">
  <Image src="/illustrations/empty-state.svg" alt="Empty" width={400} height={400} />
  <p className="text-cyber-cyan mt-4">暂无内容</p>
</div>
```

---

## 🔧 自定义样式

### 修改图标颜色
```tsx
// 使用 Tailwind 类名
<Image src="/icons/home.svg" className="text-cyber-cyan" />

// 使用 style
<Image src="/icons/home.svg" style={{ filter: 'brightness(0) saturate(100%) invert(48%) sepia(89%) saturate(436%) hue-rotate(123deg) brightness(97%) contrast(101%)' }} />
```

### 发光效果
```css
/* Tailwind */
.shadow-neon {
  box-shadow: 0 0 5px #00f0ff, 0 0 10px #00f0ff;
}

/* 自定义 */
.glow-effect {
  filter: drop-shadow(0 0 5px #00f0ff) drop-shadow(0 0 10px #00f0ff);
}
```

---

## ❓ 常见问题

### Q: 如何更改图标颜色?
A: 使用 Tailwind 的 `text-*` 类名或 CSS `filter` 属性。

### Q: 图标可以缩放吗?
A: 可以，所有图标都是 SVG 矢量格式，可以任意缩放不失真。

### Q: 如何添加动画?
A: 使用 Tailwind 的 `animate-spin`、`animate-pulse` 等类名，或自定义 CSS 动画。

### Q: 图标支持深色模式吗?
A: 支持，所有图标都为深色模式优化，可以通过 CSS 调整适应浅色模式。

### Q: 如何使用自己的图标?
A: 将 SVG 文件放入 `/public/icons/` 目录，然后按照相同方式引用。

---

## 📚 相关文档

- [完整图标清单](./ICON_MANIFEST_COMPLETE.md)
- [交付文档](./GRAPHICS_DELIVERABLES_FINAL.md)
- [项目总结](./GRAPHICS_PROJECT_SUMMARY.md)
- [配色参考](../docs/COLOR_REFERENCE.md)

---

## 🚀 快速开始

### 1. 复制基本模板
```tsx
import Image from 'next/image';

export default function Page() {
  return (
    <div className="bg-cyber-dark min-h-screen">
      <header className="flex items-center gap-4 p-4">
        <Image src="/logo-icon.svg" alt="Logo" width={40} height={40} />
        <h1 className="text-cyber-cyan">CyberPress</h1>
      </header>
      <main className="p-8">
        <div className="bg-cyber-card border border-cyber-cyan rounded-lg p-6">
          <h2 className="text-2xl text-cyber-purple mb-4">Welcome</h2>
          <p className="text-gray-300">Start building your cyberpunk UI!</p>
        </div>
      </main>
    </div>
  );
}
```

### 2. 添加图标
```tsx
<div className="flex gap-4">
  <Image src="/icons/home.svg" alt="Home" width={24} height={24} />
  <Image src="/icons/blog.svg" alt="Blog" width={24} height={24} />
  <Image src="/icons/github.svg" alt="GitHub" width={24} height={24} />
</div>
```

### 3. 使用插画
```tsx
<Image src="/illustrations/ai-assistant.svg" alt="AI" width={400} height={400} />
```

---

**版本**: v1.0.0
**更新**: 2026-03-07
**维护**: CyberPress AI Design Team
