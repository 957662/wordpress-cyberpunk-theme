# CyberPress Design Quick Reference - 设计快速参考

## 🎨 配色速查

### 主色板
```css
/* 使用 Tailwind 类名 */
bg-cyber-dark      /* #0a0a0f - 深空黑 */
bg-cyber-cyan      /* #00f0ff - 霓虹青 */
bg-cyber-purple    /* #9d00ff - 赛博紫 */
bg-cyber-pink      /* #ff0080 - 激光粉 */
bg-cyber-yellow    /* #f0ff00 - 电压黄 */
bg-cyber-green     /* #00ff88 - 赛博绿 */
```

### 常用组合
```tsx
// 主要按钮
<button className="bg-gradient-to-r from-cyber-cyan to-cyber-purple text-white">
  Click Me
</button>

// 次要按钮
<button className="border-2 border-cyber-cyan text-cyber-cyan hover:bg-cyber-cyan/10">
  Cancel
</button>

// 卡片
<div className="bg-cyber-card border border-cyber-border">
  Content
</div>
```

## 📐 尺寸速查

### 图标尺寸
| Tailwind | 实际尺寸 | 用途 |
|----------|----------|------|
| `w-4 h-4` | 16px | 内联小图标 |
| `w-5 h-5` | 20px | 紧凑图标 |
| `w-6 h-6` | 24px | 标准图标 |
| `w-8 h-8` | 32px | 功能图标 |
| `w-12 h-12` | 48px | 展示图标 |
| `w-16 h-16` | 64px | Hero 图标 |

### 间距
| Tailwind | 实际尺寸 | 用途 |
|----------|----------|------|
| `p-2` | 8px | 紧凑内边距 |
| `p-4` | 16px | 标准内边距 |
| `p-6` | 24px | 宽松内边距 |
| `gap-2` | 8px | 紧凑间距 |
| `gap-4` | 16px | 标准间距 |
| `gap-6` | 24px | 宽松间距 |

## 🎯 常用组件

### 按钮
```tsx
// 主要按钮
<button className="px-6 py-3 bg-gradient-to-r from-cyber-cyan to-cyber-purple text-white font-semibold rounded hover:shadow-[0_0_20px_rgba(0,240,255,0.5)] transition-shadow">
  Primary Button
</button>

// 危险按钮
<button className="px-6 py-3 bg-gradient-to-r from-cyber-pink to-cyber-orange text-white font-semibold rounded hover:shadow-[0_0_20px_rgba(255,0,128,0.5)] transition-shadow">
  Delete
</button>

// 幽灵按钮
<button className="px-6 py-3 border-2 border-cyber-cyan text-cyber-cyan font-semibold rounded hover:bg-cyber-cyan/10 transition-colors">
  Ghost Button
</button>
```

### 卡片
```tsx
<div className="p-6 bg-cyber-card border border-cyber-border rounded-lg hover:border-cyber-cyan hover:shadow-[0_0_20px_rgba(0,240,255,0.2)] transition-all">
  <h3 className="text-xl font-bold text-cyber-cyan mb-2">Card Title</h3>
  <p className="text-gray-300">Card content goes here...</p>
</div>
```

### 输入框
```tsx
<input
  type="text"
  className="w-full px-4 py-3 bg-cyber-dark border-2 border-cyber-border rounded-lg focus:border-cyber-cyan focus:shadow-[0_0_10px_rgba(0,240,255,0.3)] outline-none transition-all"
  placeholder="Enter text..."
/>
```

### 标签
```tsx
// 默认标签
<span className="px-3 py-1 bg-cyber-cyan/10 border border-cyber-cyan text-cyber-cyan text-sm rounded-full">
  Tag
</span>

// 不同颜色
<span className="px-3 py-1 bg-cyber-purple/10 border border-cyber-purple text-cyber-purple text-sm rounded-full">
  Purple
</span>

<span className="px-3 py-1 bg-cyber-pink/10 border border-cyber-pink text-cyber-pink text-sm rounded-full">
  Pink
</span>
```

## 🎭 效果类

### 发光效果
```tsx
// 青色发光
<div className="shadow-[0_0_10px_rgba(0,240,255,0.5)]">
  Glowing Content
</div>

// 紫色发光
<div className="shadow-[0_0_10px_rgba(157,0,255,0.5)]">
  Glowing Content
</div>

// 强发光
<div className="shadow-[0_0_20px_rgba(0,240,255,0.8)]">
  Strong Glow
</div>
```

### 渐变
```tsx
// 线性渐变
<div className="bg-gradient-to-r from-cyber-cyan via-cyber-purple to-cyber-pink">
  Gradient
</div>

// 径向渐变
<div className="bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-cyber-cyan via-cyber-purple to-cyber-dark">
  Radial
</div>
```

### 动画
```tsx
// 旋转
<div className="animate-spin">...</div>

// 脉冲
<div className="animate-pulse">...</div>

// 弹跳
<div className="animate-bounce">...</div>

// 自定义动画
<div className="animate-[glitch_1s_infinite]">...</div>
```

## 🖼️ 背景图案

### 网格背景
```tsx
<div className="relative bg-cyber-dark">
  <div
    className="absolute inset-0 opacity-20"
    style={{
      backgroundImage: "url('/patterns/cyber-grid.svg')",
      backgroundRepeat: 'repeat',
      backgroundSize: '200px 200px'
    }}
  />
  <div className="relative z-10">
    Content
  </div>
</div>
```

### 扫描线
```tsx
<div className="relative bg-cyber-dark">
  <div
    className="absolute inset-0 opacity-10 pointer-events-none"
    style={{
      backgroundImage: "url('/patterns/scanlines.svg')"
    }}
  />
  Content
</div>
```

## 📱 响应式设计

### 断点
```tsx
// 移动端优先
<div className="w-full md:w-1/2 lg:w-1/3">
  Responsive
</div>

// 隐藏/显示
<div className="hidden md:block">
  Desktop only
</div>

<div className="block md:hidden">
  Mobile only
</div>
```

### 响应式图标
```tsx
<Image
  src="/icons/icon.svg"
  alt="Icon"
  width={24}
  height={24}
  className="w-5 h-5 md:w-6 md:h-6 lg:w-8 lg:h-8"
/>
```

## 🎨 文字样式

### 标题
```tsx
<h1 className="text-4xl font-bold text-cyber-cyan">
  Main Heading
</h1>

<h2 className="text-3xl font-semibold text-cyber-purple">
  Sub Heading
</h2>

<h3 className="text-2xl font-medium text-white">
  Section Title
</h3>
```

### 正文
```tsx
<p className="text-base text-gray-300 leading-relaxed">
  Body text with comfortable line height for reading.
</p>

<p className="text-sm text-gray-400">
  Small text for captions and labels.
</p>
```

### 代码
```tsx
<code className="px-2 py-1 bg-cyber-card border border-cyber-border text-cyber-cyan text-sm rounded font-mono">
  inline code
</code>

<pre className="p-4 bg-cyber-dark border border-cyber-border rounded-lg overflow-x-auto">
  <code className="text-cyber-green text-sm font-mono">
    code block
  </code>
</pre>
```

## 🔧 工具类组合

### Flexbox
```tsx
// 水平居中
<div className="flex justify-center items-center">
  Centered
</div>

// 间距
<div className="flex gap-4">
  <div>Item 1</div>
  <div>Item 2</div>
</div>

// 响应式
<div className="flex flex-col md:flex-row">
  Responsive
</div>
```

### Grid
```tsx
// 固定列
<div className="grid grid-cols-3 gap-4">
  <div>1</div>
  <div>2</div>
  <div>3</div>
</div>

// 响应式列
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
  Responsive
</div>
```

## 🎯 常见模式

### Hero 区域
```tsx
<section className="relative min-h-screen flex items-center justify-center bg-cyber-dark overflow-hidden">
  {/* 背景图案 */}
  <div className="absolute inset-0 opacity-20">
    <Image src="/patterns/cyber-grid.svg" fill alt="grid" />
  </div>

  {/* 内容 */}
  <div className="relative z-10 text-center px-4">
    <h1 className="text-5xl md:text-7xl font-bold text-cyber-cyan mb-6">
      Welcome to CyberPress
    </h1>
    <p className="text-xl md:text-2xl text-gray-300 mb-8">
      The future of blogging is here
    </p>
    <button className="px-8 py-4 bg-gradient-to-r from-cyber-cyan to-cyber-purple text-white text-lg font-semibold rounded hover:shadow-[0_0_30px_rgba(0,240,255,0.6)] transition-shadow">
      Get Started
    </button>
  </div>
</section>
```

### 特性网格
```tsx
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
  {features.map((feature) => (
    <div
      key={feature.id}
      className="p-6 bg-cyber-card border border-cyber-border rounded-lg hover:border-cyber-cyan hover:shadow-[0_0_20px_rgba(0,240,255,0.2)] transition-all group"
    >
      <div className="w-12 h-12 mb-4 bg-cyber-cyan/10 rounded-lg flex items-center justify-center group-hover:bg-cyber-cyan/20 transition-colors">
        <Image src={feature.icon} alt={feature.title} width={24} height={24} />
      </div>
      <h3 className="text-xl font-bold text-cyber-cyan mb-2">
        {feature.title}
      </h3>
      <p className="text-gray-300">
        {feature.description}
      </p>
    </div>
  ))}
</div>
```

### 导航栏
```tsx
<nav className="sticky top-0 z-50 bg-cyber-dark/80 backdrop-blur-md border-b border-cyber-border">
  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    <div className="flex items-center justify-between h-16">
      {/* Logo */}
      <Link href="/" className="flex items-center gap-2">
        <Image src="/logo-icon.svg" alt="Logo" width={32} height={32} />
        <span className="text-xl font-bold text-cyber-cyan">CyberPress</span>
      </Link>

      {/* Navigation Links */}
      <div className="hidden md:flex items-center gap-6">
        <Link href="/blog" className="text-gray-300 hover:text-cyber-cyan transition-colors">
          Blog
        </Link>
        <Link href="/about" className="text-gray-300 hover:text-cyber-cyan transition-colors">
          About
        </Link>
        <Link href="/contact" className="text-gray-300 hover:text-cyber-cyan transition-colors">
          Contact
        </Link>
      </div>

      {/* CTA Button */}
      <button className="px-4 py-2 bg-cyber-cyan/10 border border-cyber-cyan text-cyber-cyan rounded hover:bg-cyber-cyan/20 transition-colors">
        Subscribe
      </button>
    </div>
  </div>
</nav>
```

## 📚 快速链接

- [完整配色参考](./COLOR_REFERENCE.md)
- [图标清单](./ICON_MANIFEST.md)
- [图形素材指南](./GRAPHICS_GUIDE.md)
- [图标使用指南](./ICON_USAGE_GUIDE.md)

---

**最后更新**: 2026-03-06
**维护团队**: CyberPress AI Development Team
