# CyberPress 平台 - 图形资产清单

> 完整的图形素材目录和使用指南

**版本**: 2.0.0
**最后更新**: 2026-03-06
**维护者**: CyberPress 设计团队

---

## 📦 资产目录结构

```
frontend/public/
├── logo/                           # Logo 资源
│   ├── logo.svg                    # 横向 Logo (带文字)
│   └── logo-icon.svg               # 图标 Logo (纯图标)
│
├── icons/                          # SVG 图标
│   ├── *.svg                       # 基础图标 (100+)
│   └── cyberpunk/                  # 赛博朋克风格图标
│       ├── cloud-sync.svg
│       ├── security-lock.svg
│       ├── code-terminal.svg
│       ├── dashboard.svg
│       ├── analytics.svg
│       ├── api.svg
│       ├── deployment.svg
│       ├── database-cluster.svg
│       ├── ai-neural.svg
│       └── optimization.svg
│
├── illustrations/                  # 插画资源
│   ├── hero-cyber-city.svg         # 首页赛博城市
│   ├── server-room.svg             # 服务器机房
│   ├── coding-workspace.svg        # 编码工作区
│   └── cloud-storage.svg           # 云存储
│
└── decorations/                    # 装饰元素
    ├── grid-pattern.svg            # 网格图案
    ├── circuit-lines.svg           # 电路线条
    └── hexagon-pattern.svg         # 六边形图案
```

---

## 🎨 Logo 资源

### 主 Logo (logo.svg)
- **尺寸**: 200x60
- **格式**: SVG
- **变体**: 横向布局，带 CYBER PRESS 文字
- **使用场景**: 导航栏、页眉、品牌展示

### 图标 Logo (logo-icon.svg)
- **尺寸**: 64x64
- **格式**: SVG
- **变体**: 纯图标，六边形电路设计
- **使用场景**: Favicon、App 图标、小尺寸展示

### Logo 使用示例
```tsx
import { Logo } from '@/components/graphics';

// 导航栏 Logo
<Logo variant="horizontal" size={120} />

// 页面 Logo
<Logo variant="vertical" size={200} />

// 图标 Logo
<Logo variant="icon" size={64} />
```

---

## 🔷 赛博朋克图标

### 新增图标 (2026-03-06)

| 图标 | 文件名 | 用途 |
|------|--------|------|
| ☁️ | cloud-sync.svg | 云同步 |
| 🔒 | security-lock.svg | 安全锁定 |
| 💻 | code-terminal.svg | 代码终端 |
| 📊 | dashboard.svg | 仪表盘 |
| 📈 | analytics.svg | 数据分析 |
| 🔌 | api.svg | API 接口 |
| 🚀 | deployment.svg | 部署发布 |
| 🗄️ | database-cluster.svg | 数据库集群 |
| 🧠 | ai-neural.svg | AI 神经网络 |
| ⚡ | optimization.svg | 性能优化 |

### 图标使用示例
```tsx
import Image from 'next/image';

// 使用 Next.js Image 组件
<Image
  src="/icons/cyberpunk/cloud-sync.svg"
  alt="Cloud Sync"
  width={24}
  height={24}
  className="text-cyber-cyan"
/>

// 使用 SVG 内联
<svg className="w-6 h-6">
  <use href="/icons/cyberpunk/security-lock.svg#icon" />
</svg>
```

---

## 🖼️ 插画资源

### 首页赛博城市 (hero-cyber-city.svg)
- **尺寸**: 800x400
- **主题**: 赛博朋克城市夜景
- **元素**: 霓虹建筑、全息广告、数据流
- **使用场景**: 首页 Hero 区域、登录页背景

### 服务器机房 (server-room.svg)
- **尺寸**: 400x300
- **主题**: 数据中心服务器
- **元素**: 机柜、LED 指示灯、数据活动
- **使用场景**: 技术页面、服务器状态页

### 编码工作区 (coding-workspace.svg)
- **尺寸**: 400x300
- **主题**: 开发者工作环境
- **元素**: 显示器、键盘、咖啡杯、代码
- **使用场景**: 博客文章、开发文档

### 云存储 (cloud-storage.svg)
- **尺寸**: 400x250
- **主题**: 云端数据同步
- **元素**: 云服务器、数据流、同步动画
- **使用场景**: 功能介绍、产品页面

### 插画使用示例
```tsx
import Image from 'next/image';

// 作为背景
<div className="relative">
  <Image
    src="/illustrations/hero-cyber-city.svg"
    alt="Cyber City"
    fill
    className="object-cover"
  />
  <div className="relative z-10">
    <h1>欢迎来到 CyberPress</h1>
  </div>
</div>

// 作为内容图片
<Image
  src="/illustrations/coding-workspace.svg"
  alt="Coding Workspace"
  width={400}
  height={300}
  className="rounded-lg"
/>
```

---

## 🎭 装饰元素

### 网格图案 (grid-pattern.svg)
- **尺寸**: 100x100 (可平铺)
- **类型**: 赛博网格
- **颜色**: 霓虹青 (#00f0ff)
- **使用**: 背景纹理、卡片装饰

### 电路线条 (circuit-lines.svg)
- **尺寸**: 200x100
- **类型**: 电路板图案
- **动画**: 数据流动效果
- **使用**: 技术背景、页脚装饰

### 六边形图案 (hexagon-pattern.svg)
- **尺寸**: 120x104 (可平铺)
- **类型**: 蜂窝结构
- **颜色**: 赛博紫 (#9d00ff)
- **使用**: 科技感背景、分隔区域

### 装饰元素使用示例
```tsx
// CSS 背景使用
<div style={{
  backgroundImage: 'url(/decorations/grid-pattern.svg)',
  backgroundRepeat: 'repeat',
  opacity: 0.3
}}>
  内容区域
</div>

// 使用 DecorativePattern 组件
import { DecorativePattern } from '@/components/graphics';

<DecorativePattern type="grid" opacity={0.3} />
```

---

## 🎨 React 组件

### Logo 组件
```tsx
import { Logo } from '@/components/graphics';

<Logo
  variant="horizontal"  // 'horizontal' | 'icon' | 'vertical'
  size={120}
  showText={true}
  className="hover:opacity-80 transition-opacity"
/>
```

### NeonText 组件
```tsx
import { NeonText } from '@/components/graphics';

<NeonText
  color="cyan"      // 'cyan' | 'purple' | 'pink' | 'yellow' | 'green'
  size="xl"         // 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl'
  intensity="high"  // 'low' | 'medium' | 'high'
  as="h1"
>
  霓虹文字效果
</NeonText>
```

### CyberGlow 组件
```tsx
import { CyberGlow } from '@/components/graphics';

<CyberGlow
  color="purple"
  intensity="medium"
  hover={true}
>
  发光内容
</CyberGlow>
```

### DecorativePattern 组件
```tsx
import { DecorativePattern } from '@/components/graphics';

<DecorativePattern
  type="circuit"   // 'grid' | 'circuit' | 'hexagon' | 'dots'
  opacity={0.3}
  animated={true}
/>
```

---

## 🎯 使用指南

### 1. 基础用法

#### 使用 Next.js Image 组件（推荐）
```tsx
import Image from 'next/image';

<Image
  src="/icons/cyberpunk/cloud-sync.svg"
  alt="Cloud Sync"
  width={24}
  height={24}
  className="inline-block"
/>
```

#### 使用 img 标签
```html
<img
  src="/icons/cyberpunk/security-lock.svg"
  alt="Security Lock"
  class="w-6 h-6"
/>
```

#### 使用 CSS 背景
```css
.cyber-background {
  background-image: url('/decorations/grid-pattern.svg');
  background-repeat: repeat;
  opacity: 0.3;
}
```

### 2. 颜色自定义

SVG 图标可以通过 CSS `currentColor` 继承颜色：

```tsx
<Image
  src="/icons/cyberpunk/api.svg"
  alt="API"
  className="text-cyber-cyan hover:text-cyber-purple transition-colors"
/>
```

### 3. 尺寸调整

使用 Tailwind CSS 类调整尺寸：

```tsx
// 小图标
<Image src="/icons/home.svg" alt="Home" className="w-4 h-4" />

// 中等图标
<Image src="/icons/home.svg" alt="Home" className="w-6 h-6" />

// 大图标
<Image src="/icons/home.svg" alt="Home" className="w-12 h-12" />
```

### 4. 动画效果

添加 Tailwind 动画类：

```tsx
<Image
  src="/icons/loading.svg"
  alt="Loading"
  className="w-6 h-6 animate-spin"
/>

<Image
  src="/icons/zap.svg"
  alt="Zap"
  className="w-6 h-6 animate-pulse"
/>
```

---

## 📐 规格说明

### 图标规格
- **视图框**: 24x24 (标准)
- **描边宽度**: 2px
- **线条端点**: round
- **线条连接**: round
- **填充**: none (描边风格)

### Logo 规格
- **主 Logo**: 200x60
- **图标 Logo**: 64x64
- **最小尺寸**: 32x32 (保持清晰度)

### 插画规格
- **大插画**: 800x400
- **中插画**: 400x300
- **小插画**: 200x150

---

## 🎨 配色方案

所有图形资源使用赛博朋克配色：

```css
/* 主色调 */
--cyber-dark: #0a0a0f;       /* 深空黑 */
--cyber-cyan: #00f0ff;       /* 霓虹青 */
--cyber-purple: #9d00ff;     /* 赛博紫 */
--cyber-pink: #ff0080;       /* 激光粉 */
--cyber-yellow: #f0ff00;     /* 电压黄 */
--cyber-green: #00ff88;      /* 霓虹绿 */
```

---

## 🔧 工具和资源

### SVG 优化
- [SVGO](https://jakearchibald.github.io/svgomg/) - 在线 SVG 优化工具
- [SVG Crop](https://svgcrop.com/) - SVG 裁剪工具

### 设计工具
- [Figma](https://www.figma.com/) - 界面设计
- [Illustrator](https://www.adobe.com/products/illustrator) - 矢量图形
- [Inkscape](https://inkscape.org/) - 免费矢量编辑器

### 图标库参考
- [Lucide](https://lucide.dev/) - 简洁图标库
- [Heroicons](https://heroicons.com/) - Tailwind 图标库
- [Tabler Icons](https://tabler-icons.io/) - 开源图标集

---

## 📝 版本历史

### v2.0.0 (2026-03-06)
- ✨ 新增 Logo 资源（横向和图标版本）
- ✨ 新增 10 个赛博朋克风格图标
- ✨ 新增 4 个插画资源
- ✨ 新增 3 个装饰图案
- ✨ 新增 React 图形组件
- 📝 完善文档和使用指南

### v1.0.0 (2026-03-03)
- 🎉 初始图形设计系统
- 🎨 基础配色方案
- 🔷 基础图标集合

---

## 🤝 贡献指南

### 添加新图标
1. 创建 24x24 视图框的 SVG
2. 应用赛博朋克风格（发光效果、渐变）
3. 保存到相应目录
4. 更新此文档

### 添加新插画
1. 使用标准尺寸（800x400 或 400x300）
2. 保持赛博朋克美学
3. 添加适当的动画效果
4. 优化 SVG 代码大小

### 创建新组件
1. 遵循现有组件结构
2. 添加 TypeScript 类型
3. 包含使用示例
4. 更新导出文件

---

## 📧 联系方式

- **设计团队**: design@cyberpress.dev
- **项目 Issue**: [GitHub Issues](https://github.com/cyberpress/platform/issues)
- **设计规范**: [docs/graphics/README.md](./README.md)

---

**© 2026 CyberPress Platform. All rights reserved.**
