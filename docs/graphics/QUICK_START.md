# CyberPress 图形素材快速参考

> 快速查找和使用图形资源的速查表

## 📁 已创建的文件列表

### Logo 资源 (2 个文件)
```
✅ frontend/public/logo/logo.svg              # 横向 Logo (200x60)
✅ frontend/public/logo/logo-icon.svg         # 图标 Logo (64x64)
```

### 赛博朋克图标 (10 个文件)
```
✅ frontend/public/icons/cyberpunk/cloud-sync.svg
✅ frontend/public/icons/cyberpunk/security-lock.svg
✅ frontend/public/icons/cyberpunk/code-terminal.svg
✅ frontend/public/icons/cyberpunk/dashboard.svg
✅ frontend/public/icons/cyberpunk/analytics.svg
✅ frontend/public/icons/cyberpunk/api.svg
✅ frontend/public/icons/cyberpunk/deployment.svg
✅ frontend/public/icons/cyberpunk/database-cluster.svg
✅ frontend/public/icons/cyberpunk/ai-neural.svg
✅ frontend/public/icons/cyberpunk/optimization.svg
```

### 插画资源 (4 个文件)
```
✅ frontend/public/illustrations/hero-cyber-city.svg     # 赛博城市 (800x400)
✅ frontend/public/illustrations/server-room.svg         # 服务器机房 (400x300)
✅ frontend/public/illustrations/coding-workspace.svg    # 编码工作区 (400x300)
✅ frontend/public/illustrations/cloud-storage.svg       # 云存储 (400x250)
```

### 装饰元素 (3 个文件)
```
✅ frontend/public/decorations/grid-pattern.svg         # 网格图案
✅ frontend/public/decorations/circuit-lines.svg        # 电路线条
✅ frontend/public/decorations/hexagon-pattern.svg      # 六边形图案
```

### React 组件 (4 个文件)
```
✅ frontend/components/graphics/Logo.tsx                # Logo 组件
✅ frontend/components/graphics/NeonText.tsx            # 霓虹文字组件
✅ frontend/components/graphics/CyberGlow.tsx           # 发光效果组件
✅ frontend/components/graphics/DecorativePattern.tsx   # 装饰图案组件
✅ frontend/components/graphics/index.tsx               # 统一导出
```

### 文档 (2 个文件)
```
✅ docs/graphics/GRAPHICS_ASSETS.md                     # 完整资产清单
✅ docs/graphics/QUICK_START.md                         # 本快速参考
```

---

## 🚀 快速使用

### 1. 使用 Logo
```tsx
import { Logo } from '@/components/graphics';

// 横向 Logo (带文字)
<Logo variant="horizontal" size={120} />

// 图标 Logo
<Logo variant="icon" size={64} />

// 垂直 Logo
<Logo variant="vertical" size={200} />
```

### 2. 使用图标
```tsx
import Image from 'next/image';

<Image
  src="/icons/cyberpunk/cloud-sync.svg"
  alt="Cloud Sync"
  width={24}
  height={24}
  className="text-cyber-cyan"
/>
```

### 3. 使用插画
```tsx
import Image from 'next/image';

<Image
  src="/illustrations/hero-cyber-city.svg"
  alt="Cyber City"
  width={800}
  height={400}
  className="w-full"
/>
```

### 4. 使用装饰图案
```tsx
import { DecorativePattern } from '@/components/graphics';

<DecorativePattern type="grid" opacity={0.3} />
```

### 5. 使用霓虹效果
```tsx
import { NeonText } from '@/components/graphics';

<NeonText color="cyan" size="xl" intensity="high">
  霓虹文字
</NeonText>
```

---

## 🎨 颜色速查

| 颜色名称 | HEX 值 | Tailwind 类 |
|---------|--------|-------------|
| 霓虹青 | #00f0ff | text-cyber-cyan |
| 赛博紫 | #9d00ff | text-cyber-purple |
| 激光粉 | #ff0080 | text-cyber-pink |
| 电压黄 | #f0ff00 | text-cyber-yellow |
| 霓虹绿 | #00ff88 | text-cyber-green |
| 深空黑 | #0a0a0f | bg-cyber-dark |

---

## 📐 尺寸规格

| 类型 | 标准尺寸 | 最小尺寸 |
|------|---------|---------|
| 小图标 | 16x16 | 12x12 |
| 标准图标 | 24x24 | 16x16 |
| 大图标 | 32x32 | 24x24 |
| Logo 图标 | 64x64 | 32x32 |
| Logo 横向 | 200x60 | 100x30 |
| 小插画 | 200x150 | 100x75 |
| 中插画 | 400x300 | 200x150 |
| 大插画 | 800x400 | 400x200 |

---

## ✨ 动画效果

### 旋转动画
```tsx
<Image src="/icons/loading.svg" className="animate-spin" />
```

### 脉冲动画
```tsx
<Image src="/icons/zap.svg" className="animate-pulse" />
```

### 弹跳动画
```tsx
<Image src="/icons/bell.svg" className="animate-bounce" />
```

---

## 🔧 Tailwind 配置

确保 `tailwind.config.js` 包含以下配置：

```javascript
module.exports = {
  theme: {
    extend: {
      colors: {
        'cyber-dark': '#0a0a0f',
        'cyber-cyan': '#00f0ff',
        'cyber-purple': '#9d00ff',
        'cyber-pink': '#ff0080',
        'cyber-yellow': '#f0ff00',
        'cyber-green': '#00ff88',
      },
      boxShadow: {
        'neon-cyan': '0 0 10px rgba(0, 240, 255, 0.5)',
        'neon-purple': '0 0 10px rgba(157, 0, 255, 0.5)',
        'neon-pink': '0 0 10px rgba(255, 0, 128, 0.5)',
      },
    },
  },
}
```

---

## 📝 常见用例

### 导航栏 Logo
```tsx
<nav className="flex items-center gap-2">
  <Logo variant="horizontal" size={100} />
</nav>
```

### 按钮图标
```tsx
<button className="flex items-center gap-2">
  <Image src="/icons/cyberpunk/api.svg" width={16} height={16} />
  <span>API 文档</span>
</button>
```

### 功能卡片
```tsx
<div className="p-4 border border-cyber-cyan rounded">
  <Image src="/icons/cyberpunk/dashboard.svg" width={32} height={32} />
  <h3>仪表盘</h3>
</div>
```

### 页面背景
```tsx
<div className="relative">
  <Image
    src="/illustrations/hero-cyber-city.svg"
    alt="Background"
    fill
    className="object-cover opacity-20"
  />
  <div className="relative z-10">
    {/* 页面内容 */}
  </div>
</div>
```

---

## 🎯 最佳实践

1. **使用 Next.js Image 组件** - 自动优化和懒加载
2. **设置正确的尺寸** - 避免布局偏移
3. **添加 alt 文本** - 提高可访问性
4. **使用 CSS 类控制颜色** - 灵活性更高
5. **保持一致的尺寸** - 使用标准尺寸

---

## 📚 相关文档

- [完整资产清单](./GRAPHICS_ASSETS.md)
- [配色参考](./COLOR_REFERENCE.md)
- [图标清单](./ICONS.md)
- [设计规范](./README.md)

---

**创建时间**: 2026-03-06
**文件总数**: 25 个
**组件总数**: 5 个
