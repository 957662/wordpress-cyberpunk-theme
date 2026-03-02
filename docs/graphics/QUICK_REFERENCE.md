# CyberPress Platform - 图形设计快速参考

## 🎨 核心颜色

```css
/* 主色调 */
--cyber-dark: #0a0a0f;      /* 深空黑 */
--cyber-cyan: #00f0ff;      /* 霓虹青 */
--cyber-purple: #9d00ff;    /* 赛博紫 */
--cyber-pink: #ff0080;      /* 激光粉 */
--cyber-yellow: #f0ff00;    /* 电压黄 */

/* 中性色 */
--cyber-darker: #050508;    /* 更深黑 */
--cyber-muted: #1a1a2e;     /* 静音紫 */
--cyber-card: #16162a;      /* 卡片色 */
--cyber-border: #2a2a4a;    /* 边框色 */
```

## 📦 快速导入

### Logo 组件
```tsx
import { Logo } from '@/components/ui/Logo';

<Logo variant="main" size={200} />
<Logo variant="horizontal" size={120} />
<Logo variant="icon" size={64} />
```

### 图标组件
```tsx
import { Icon, HomeIcon, SearchIcon } from '@/components/ui/Icon';

<Icon name="home" size={24} color="cyan" />
<HomeIcon size={24} color="purple" animated />
```

### 效果组件
```tsx
import {
  NeonText,
  CyberGlow,
  CyberCard,
  CyberButton,
  CyberBadge,
  CyberBorder,
  CyberDivider,
  HolographicCard,
} from '@/components/effects';

<NeonText color="cyan" size="lg">霓虹文字</NeonText>
<CyberCard variant="neon" color="purple">卡片</CyberCard>
<CyberButton variant="primary" color="cyan">按钮</CyberButton>
```

## 🎯 Tailwind 类名速查

### 颜色类
```tsx
className="text-cyber-cyan"      // 文字颜色
className="bg-cyber-dark"         // 背景颜色
className="border-cyber-border"   // 边框颜色
```

### 发光效果
```tsx
className="shadow-neon-cyan"      // 霓虹青发光
className="shadow-neon-purple"    // 赛博紫发光
className="shadow-neon-pink"      // 激光粉发光
className="shadow-neon-yellow"    // 电压黄发光
```

### 文字发光
```tsx
className="text-glow-cyan"        // 青色文字发光
className="text-glow-purple"      // 紫色文字发光
className="text-glow-pink"        // 粉色文字发光
```

## 🎨 常用组合

### 按钮 + 图标
```tsx
<CyberButton
  variant="primary"
  color="cyan"
  icon={<ArrowRightIcon size={16} />}
  iconPosition="right"
>
  下一步
</CyberButton>
```

### 卡片 + 徽章
```tsx
<CyberCard variant="neon" color="purple">
  <div className="flex gap-2 mb-4">
    <CyberBadge variant="solid" color="cyan">标签</CyberBadge>
    <CyberBadge variant="outline" color="purple">分类</CyberBadge>
  </div>
  <h3><NeonText color="cyan">标题</NeonText></h3>
</CyberCard>
```

### 发光容器
```tsx
<CyberGlow color="cyan" intensity="high" animated>
  <div>发光内容</div>
</CyberGlow>
```

## 🖼️ SVG 资源路径

### Logo
```
/logo.svg              - 横版 Logo
/logo-main.svg         - 主 Logo
/logo-icon.svg         - 图标 Logo
/logo-square.svg       - 方形 Logo
/logo-favicon.svg      - Favicon
/og-image.svg          - OG Image
```

### 图标
```
/icons/{name}.svg      - 功能图标
```

### 背景
```
/backgrounds/hero-bg.svg      - Hero 背景
/backgrounds/card-bg.svg      - 卡片背景
/backgrounds/loading-bg.svg   - 加载背景
/backgrounds/404-bg.svg       - 404 背景
```

### 图案
```
/patterns/grid.svg            - 网格
/patterns/circuit.svg         - 电路板
/patterns/scanlines.svg       - 扫描线
/patterns/hex-grid.svg        - 六边形网格
/patterns/holographic.svg     - 全息
/patterns/matrix.svg          - 矩阵
```

### 装饰
```
/decorations/corner-bracket.svg    - 角落装饰
/decorations/divider-line.svg      - 分割线
/decorations/loader-ring.svg       - 加载环
```

### 插画
```
/illustrations/server-rack.svg         - 服务器
/illustrations/code-screen.svg         - 代码屏幕
/illustrations/circuit-board.svg       - 电路板
/illustrations/network-globe.svg       - 网络地球
/illustrations/cyber-city.svg          - 赛博城市
```

## 🎭 组件 Props 速查

### Logo
| Prop | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| variant | 'main' \| 'horizontal' \| 'icon' \| 'square' | 'main' | Logo 变体 |
| size | number | 200 | 尺寸（px） |
| animated | boolean | false | 是否动画 |
| priority | boolean | false | 优先加载 |

### Icon
| Prop | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| name | string | - | 图标名称 |
| size | number | 24 | 尺寸（px） |
| color | 'cyan' \| 'purple' \| 'pink' \| 'yellow' \| 'green' \| 'orange' | 'cyan' | 颜色 |
| animated | boolean | false | 是否动画 |

### NeonText
| Prop | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| color | 'cyan' \| 'purple' \| 'pink' \| 'yellow' | 'cyan' | 颜色 |
| size | 'sm' \| 'md' \| 'lg' \| 'xl' | 'md' | 尺寸 |
| flicker | boolean | false | 是否闪烁 |

### CyberCard
| Prop | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| variant | 'default' \| 'neon' \| 'holographic' \| 'glass' | 'default' | 变体 |
| color | 'cyan' \| 'purple' \| 'pink' \| 'yellow' | 'cyan' | 颜色 |
| size | 'sm' \| 'md' \| 'lg' | 'md' | 尺寸 |
| hover | boolean | true | 悬停效果 |
| clickable | boolean | false | 可点击 |

### CyberButton
| Prop | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| variant | 'primary' \| 'secondary' \| 'outline' \| 'ghost' | 'primary' | 变体 |
| color | 'cyan' \| 'purple' \| 'pink' \| 'yellow' | 'cyan' | 颜色 |
| size | 'sm' \| 'md' \| 'lg' | 'md' | 尺寸 |
| fullWidth | boolean | false | 全宽 |
| icon | ReactNode | - | 图标 |

### CyberBadge
| Prop | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| variant | 'solid' \| 'outline' \| 'glow' | 'solid' | 变体 |
| color | 'cyan' \| 'purple' \| 'pink' \| 'yellow' \| 'green' \| 'orange' | 'cyan' | 颜色 |
| size | 'sm' \| 'md' \| 'lg' | 'md' | 尺寸 |
| dot | boolean | false | 状态点 |
| pulse | boolean | false | 脉冲动画 |

## 🔧 动画类名

```tsx
// 悬停效果
hover:scale-105              // 悬停放大
hover:scale-110              // 悬停更大
hover:-translate-y-1         // 悬停上移

// 过渡
transition-all               // 所有属性
transition-transform         // 变换
transition-colors            // 颜色

// 持续时间
duration-150                 // 150ms
duration-300                 // 300ms
duration-500                 // 500ms

// 内置动画
animate-pulse                // 脉冲
animate-spin                 // 旋转
animate-bounce               // 弹跳
```

## 📐 尺寸规范

### 间距（4px 基础）
```tsx
p-1   // 4px
p-2   // 8px
p-3   // 12px
p-4   // 16px
p-6   // 24px
p-8   // 32px
```

### 图标尺寸
```tsx
w-4 h-4   // 16px
w-5 h-5   // 20px
w-6 h-6   // 24px
w-8 h-8   // 32px
w-12 h-12 // 48px
```

### 圆角
```tsx
rounded     // 4px
rounded-lg  // 8px
rounded-xl  // 12px
rounded-2xl // 16px
rounded-full // 50%
```

## ✅ 最佳实践

### ✅ DO
- 使用 SVG 格式
- 保持适当留白
- 确保对比度
- 使用 Tailwind 类
- 优化动画性能

### ❌ DON'T
- 不要过度使用发光
- 不要混用太多颜色
- 不要创建过小的可点击元素
- 不要忽略移动端
- 不要忘记 alt 属性

## 📱 响应式断点

```tsx
sm:  // 640px
md:  // 768px
lg:  // 1024px
xl:  // 1280px
2xl: // 1536px

// 示例
className="w-24 md:w-32 lg:w-40"
```

## 🔗 相关链接

- [完整文档](./README.md)
- [配色参考](./COLOR_PALETTE.md)
- [图标清单](./ICONS.md)
- [Logo 指南](./LOGO_GUIDE.md)
- [组件展示](./GRAPHICS_SHOWCASE.md)
- [素材汇总](./ASSETS_SUMMARY.md)

---

**最后更新**: 2026-03-03
**版本**: 1.0.0
