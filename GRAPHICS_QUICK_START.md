# CyberPress 图形组件快速开始

> 🎨 赛博朋克风格 SVG 图形组件库
> 📅 版本: 4.0.0
> ✨ 完整、可运行、开箱即用

---

## 🚀 快速开始

### 1. 导入组件

```typescript
// 从主入口导入所有组件
import {
  CyberPressLogo,
  ServerIcon,
  CodeBracketIcon,
  TerminalIcon,
  ServerRackIllustration,
  GridPattern,
  getColor,
  getGradient
} from '@/components/graphics';
```

### 2. 使用 Logo

```tsx
// 完整版 Logo
<CyberPressLogo variant="full" size="large" animated />

// 仅图标
<CyberPressLogo variant="icon" size="medium" color="cyan" />

// 极简版
<CyberPressLogo variant="minimal" size="small" />

// 文字版
<CyberPressLogo variant="text" size="xlarge" showTagline />
```

### 3. 使用图标

```tsx
// 服务器图标
<ServerIcon size={48} variant="cyan" animated />

// 代码图标
<CodeBracketIcon size={64} variant="purple" />

// 终端图标
<TerminalIcon size={32} variant="green" animated />
```

### 4. 使用插画

```tsx
// 服务器机架插画
<ServerRackIllustration width={600} height={400} variant="cyan" animated />

// 电路板插画
<CircuitBoardIllustration width={400} height={300} variant="purple" />

// 网络地球插画
<NetworkGlobeIllustration width={800} height={600} variant="green" animated />
```

### 5. 使用图案

```tsx
// 网格图案
<GridPattern width={1920} height={1080} variant="cyan" density="medium" />

// 扫描线图案
<ScanlinesPattern variant="purple" />

// 矩阵雨图案
<MatrixRainPattern variant="green" animated />
```

### 6. 使用配色

```typescript
// 获取颜色
const cyanColor = getColor('cyan'); // '#00f0ff'
const purpleColor = getColor('purple'); // '#9d00ff'

// 获取渐变
const primaryGradient = getGradient('primary');
// 'linear-gradient(135deg, #00f0ff 0%, #9d00ff 100%)'

// 获取阴影
const glowShadow = getShadow('glowCyan');
// '0 0 20px rgba(0, 240, 255, 0.5)'
```

---

## 📋 组件列表

### Logo 组件

| 组件 | 变体 | 尺寸 | 配色 |
|------|------|------|------|
| CyberPressLogo | 4 种 | 6 种 | 5 种 |

### 科技图标

| 图标 | 用途 |
|------|------|
| ServerIcon | 服务器 |
| CodeBracketIcon | 代码 |
| TerminalIcon | 终端 |
| CloudIcon | 云端 |
| ShieldSecureIcon | 安全 |
| GitBranchIcon | Git |

### 插画组件

| 插画 | 尺寸 | 动画 |
|------|------|------|
| ServerRackIllustration | 自定义 | ✅ |
| CircuitBoardIllustration | 自定义 | ✅ |
| NetworkGlobeIllustration | 自定义 | ✅ |
| CodeScreenIllustration | 自定义 | ✅ |

### 图案组件

| 图案 | 动画 | 密度 |
|------|------|------|
| GridPattern | ❌ | 3 种 |
| ScanlinesPattern | ❌ | 3 种 |
| HexagonPattern | ❌ | 3 种 |
| CircuitPattern | ✅ | 3 种 |
| DotPattern | ✅ | 3 种 |
| MatrixRainPattern | ✅ | 3 种 |

---

## 🎨 配色方案

### 霓虹色系

```typescript
// 可用颜色
'cyan'    // '#00f0ff' - 霓虹青
'purple'  // '#9d00ff' - 赛博紫
'pink'    // '#ff0080' - 激光粉
'yellow'  // '#f0ff00' - 电压黄
'green'   // '#00ff88' - 矩阵绿
'orange'  // '#ff8000' - 等离子橙
'red'     // '#ff0040' - 警告红
'blue'    // '#0080ff' - 电光蓝
```

### 渐变色系

```typescript
// 可用渐变
'primary'    // Cyan → Purple
'secondary'  // Pink → Yellow
'dark'       // 深色渐变
'cyber'      // 彩虹渐变
'matrix'     // 矩阵渐变
'neon'       // 霓虹渐变
'sunset'     // 日落渐变
'ocean'      // 海洋渐变
```

---

## 📖 完整示例

```tsx
'use client';

import React from 'react';
import {
  CyberPressLogo,
  ServerIcon,
  CodeBracketIcon,
  ServerRackIllustration,
  GridPattern,
  getColor
} from '@/components/graphics';

export default function MyPage() {
  return (
    <div className="min-h-screen" style={{ backgroundColor: getColor('cyan') }}>
      {/* 背景图案 */}
      <div className="fixed inset-0 -z-10 opacity-5">
        <GridPattern width={1920} height={1080} variant="cyan" />
      </div>

      {/* 头部 */}
      <header className="border-b">
        <div className="container mx-auto px-4 py-6">
          <CyberPressLogo variant="full" size="large" animated />
        </div>
      </header>

      {/* 主内容 */}
      <main className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* 卡片 1 */}
          <div className="bg-white/10 rounded-lg p-6">
            <ServerIcon size={64} variant="cyan" animated />
            <h2 className="text-xl font-bold mt-4">服务器架构</h2>
            <p className="mt-2">高性能服务器集群</p>
          </div>

          {/* 卡片 2 */}
          <div className="bg-white/10 rounded-lg p-6">
            <CodeBracketIcon size={64} variant="purple" animated />
            <h2 className="text-xl font-bold mt-4">代码开发</h2>
            <p className="mt-2">现代化开发工具</p>
          </div>
        </div>

        {/* 插画展示 */}
        <div className="mt-12">
          <ServerRackIllustration width={800} height={600} variant="cyan" animated />
        </div>
      </main>
    </div>
  );
}
```

---

## 🔧 高级用法

### 自定义尺寸

```tsx
// Logo
<CyberPressLogo size={200} />

// 图标
<ServerIcon size={100} />

// 插画
<ServerRackIllustration width={1200} height={800} />

// 图案
<GridPattern width={3840} height={2160} />
```

### 组合使用

```tsx
<div className="relative">
  <GridPattern width={800} height={600} variant="cyan" />
  <div className="absolute inset-0 flex items-center justify-center">
    <CyberPressLogo variant="icon" size="xlarge" animated />
  </div>
</div>
```

### 条件渲染

```tsx
<CyberPressLogo
  variant={isMobile ? 'icon' : 'full'}
  size={isMobile ? 'medium' : 'large'}
  animated={userPrefs.animations}
/>
```

---

## 📚 相关文档

- [完整图标清单](./frontend/components/graphics/ICON_MANIFEST.md)
- [配色参考](./frontend/components/graphics/COLOR_REFERENCE.md)
- [开发总结](./GRAPHICS_DEVELOPMENT_SUMMARY.md)
- [项目文档](./frontend/components/graphics/README.md)

---

## 🎯 下一步

1. 在你的页面中导入并使用组件
2. 根据需要调整尺寸和配色
3. 启用或禁用动画效果
4. 参考文档了解更多用法

---

**版本**: 4.0.0
**更新时间**: 2026-03-05
**许可证**: MIT
