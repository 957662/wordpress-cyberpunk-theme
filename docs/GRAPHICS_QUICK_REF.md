# CyberPress 图形素材快速参考

> 快速查找和使用 CyberPress 图形素材

---

## 🚀 快速开始

### 导入图标组件
```tsx
// 单个导入
import { CpuIcon } from '@/components/icons';

// 批量导入
import * as Icons from '@/components/icons';

// 使用
<CpuIcon size={48} variant="cyan" />
```

### 使用 Logo
```tsx
import Image from 'next/image';

<Image src="/logo-main.svg" alt="CyberPress" width={200} height={80} />
```

### 使用插图
```tsx
<Image src="/illustrations/server-rack.svg" alt="Server" width={400} height={300} />
```

---

## 🎨 颜色速查

| 颜色 | HEX | 用途 | Tailwind |
|------|-----|------|----------|
| 深空黑 | `#0a0a0f` | 主背景 | `bg-cyber-dark` |
| 霓虹青 | `#00f0ff` | 主强调色 | `text-cyber-cyan` |
| 赛博紫 | `#9d00ff` | 次强调色 | `text-cyber-purple` |
| 激光粉 | `#ff0080` | 强调色 | `text-cyber-pink` |
| 电压黄 | `#f0ff00` | 高亮色 | `text-cyber-yellow` |

---

## 🔧 赛博朋克图标

### CpuIcon - 处理器
```tsx
<CpuIcon size={48} variant="cyan" animated={false} />
```
**变体**: `cyan` | `purple` | `pink` | `yellow`

### DatabaseIcon - 数据库
```tsx
<DatabaseIcon size={48} variant="purple" animated={false} />
```

### NetworkIcon - 网络
```tsx
<NetworkIcon size={48} variant="pink" animated={false} />
```

### ShieldLockIcon - 安全锁
```tsx
<ShieldLockIcon size={48} variant="yellow" locked={true} />
```

### HologramIcon - 全息图
```tsx
<HologramIcon size={48} variant="cyan" animated={false} />
```

### ChipIcon - 芯片
```tsx
<ChipIcon size={48} variant="purple" animated={false} />
```

---

## 🖼️ 插图素材

### 服务器机架
```tsx
<Image src="/illustrations/server-rack.svg" width={400} height={300} alt="Server" />
```

### 电路板
```tsx
<Image src="/illustrations/circuit-board.svg" width={400} height={300} alt="Circuit" />
```

### 代码屏幕
```tsx
<Image src="/illustrations/code-screen.svg" width={400} height={300} alt="Code" />
```

### 网络地球
```tsx
<Image src="/illustrations/network-globe.svg" width={400} height={300} alt="Network" />
```

---

## 📐 常用尺寸

| 用途 | 尺寸 | 示例 |
|------|------|------|
| 小图标 | 16-24 | `<Icon size={20} />` |
| 标准图标 | 32-48 | `<Icon size={32} />` |
| 大图标 | 64-96 | `<Icon size={64} />` |
| Logo 标准 | 200x80 | `width={200} height={80}` |
| Logo 方形 | 512x512 | `width={512} height={512}` |
| 插图标准 | 400x300 | `width={400} height={300}` |

---

## ✨ 常用效果

### 发光效果
```css
/* Tailwind */
className="shadow-neon-cyan"

/* 自定义 */
style={{ boxShadow: '0 0 5px #00f0ff, 0 0 10px #00f0ff' }}
```

### 渐变背景
```css
/* Tailwind */
className="bg-gradient-to-r from-cyber-cyan to-cyber-purple"

/* 自定义 */
style={{ background: 'linear-gradient(135deg, #00f0ff 0%, #9d00ff 100%)' }}
```

### 动画
```tsx
// 脉冲
className="animate-pulse"

// 旋转
className="animate-spin"

// 内置动画
<CpuIcon animated={true} />
```

---

## 🎯 使用场景示例

### 导航栏 Logo
```tsx
<Link href="/">
  <Image src="/logo-main.svg" alt="CyberPress" width={150} height={60} />
</Link>
```

### 功能按钮图标
```tsx
<button className="flex items-center gap-2">
  <CpuIcon size={20} variant="cyan" />
  <span>处理中</span>
</button>
```

### 技术展示插图
```tsx
<div className="relative h-64">
  <Image src="/illustrations/server-rack.svg" alt="Server" fill className="object-contain" />
</div>
```

### 背景装饰
```tsx
<div className="absolute inset-0 opacity-10 pointer-events-none">
  <Image src="/illustrations/circuit-board.svg" alt="" fill />
</div>
```

### 状态指示器
```tsx
<div className="flex items-center gap-2">
  <NetworkIcon size={16} variant="green" />
  <span className="text-sm">在线</span>
</div>
```

---

## 📦 文件路径速查

```
Logo 文件:
├── /logo-main.svg           主 Logo
├── /logo-favicon.svg        图标 Logo
├── /logo-square.svg         方形 Logo
└── /og-image.svg            OG 分享图

插图文件:
├── /illustrations/server-rack.svg
├── /illustrations/circuit-board.svg
├── /illustrations/code-screen.svg
└── /illustrations/network-globe.svg

图标组件:
├── @/components/icons/CpuIcon
├── @/components/icons/DatabaseIcon
├── @/components/icons/NetworkIcon
├── @/components/icons/ShieldLockIcon
├── @/components/icons/HologramIcon
└── @/components/icons/ChipIcon
```

---

## 💡 最佳实践

### 1. 性能优化
```tsx
// 使用 Next.js Image 组件
import Image from 'next/image';

// 添加尺寸
<Image src="/logo.svg" width={200} height={80} alt="Logo" />

// 响应式
<Image src="/illustration.svg" fill sizes="(max-width: 768px) 100vw, 50vw" alt="" />
```

### 2. 可访问性
```tsx
// 添加 alt 文本
<Image src="/logo.svg" alt="CyberPress Logo" width={200} height={80} />

// 装饰性图片
<Image src="/pattern.svg" alt="" role="presentation" />

// 图标添加 aria-label
<CpuIcon aria-label="处理器" />
```

### 3. 响应式设计
```tsx
// 根据屏幕尺寸调整
<CpuIcon size={isMobile ? 32 : 48} />

// 条件渲染
<div className="hidden md:block">
  <CpuIcon size={48} />
</div>
```

### 4. 主题适配
```tsx
// 根据主题选择颜色
<CpuIcon variant={theme === 'dark' ? 'cyan' : 'purple'} />

// 使用 Tailwind 暗色模式
<CpuIcon className="dark:text-cyber-cyan text-cyber-purple" />
```

---

## 🐛 常见问题

### Q: 图标不显示？
**A**: 检查导入路径和组件名称是否正确

### Q: 颜色不生效？
**A**: 确保使用正确的 variant 名称或 Tailwind 类

### Q: 动画卡顿？
**A**: 减少同时动画的元素数量，使用 CSS transform

### Q: SVG 在某些浏览器模糊？
**A**: 确保 viewBox 和尺寸比例正确

---

## 📚 相关文档

- [完整使用指南](./GRAPHICS_GUIDE.md)
- [素材清单](./GRAPHICS_MANIFEST.md)
- [图标清单](../frontend/public/ICON_MANIFEST.md)
- [配色方案](../frontend/public/COLOR_PALETTE.md)

---

**最后更新**: 2026-03-02
**版本**: v2.0.0
