# CyberPress Platform - 图形设计文档

欢迎查阅 CyberPress 平台的图形设计文档。本目录包含所有与图形设计相关的规范和指南。

## 📚 文档目录

### 核心文档
- **[配色参考](./COLOR_PALETTE.md)** - 完整的赛博朋克配色方案和使用指南
- **[图标清单](./ICONS.md)** - 所有可用图标的目录和使用说明
- **[Logo 使用指南](./LOGO_GUIDE.md)** - Logo 变体、使用场景和最佳实践
- **[图形设计规范](./GRAPHICS_GUIDE.md)** - 统一的图形设计系统规范

## 🎨 快速参考

### 主要颜色
```css
霓虹青: #00f0ff
赛博紫: #9d00ff
激光粉: #ff0080
电压黄: #f0ff00
深空黑: #0a0a0f
```

### 常用图标
```tsx
import { HomeIcon, SearchIcon, MenuIcon } from '@/components/ui/Icon';

<HomeIcon size={24} color="cyan" />
<SearchIcon size={20} color="purple" />
<MenuIcon size={24} color="pink" />
```

### Logo 使用
```tsx
import { Logo } from '@/components/ui/Logo';

<Logo variant="horizontal" size={120} />
```

### 视觉效果组件
```tsx
import { NeonText, CyberGlow, HolographicCard } from '@/components/effects';

<NeonText color="cyan" size="lg">霓虹文字</NeonText>
<CyberGlow color="purple" intensity="high">发光内容</CyberGlow>
<HolographicCard hover>全息卡片内容</HolographicCard>
```

## 🎯 设计原则

CyberPress 的图形设计遵循以下原则：

1. **赛博朋克美学** - 使用霓虹色彩、发光效果和科技元素
2. **高对比度** - 确保深色背景上的内容清晰可见
3. **一致性强** - 所有图形元素遵循统一的设计规范
4. **性能优先** - 使用 SVG 格式和优化的动画

## 📦 资源文件位置

所有图形资源存放在 `frontend/public/` 目录：

```
frontend/public/
├── assets/logo/           # Logo 资源
├── backgrounds/           # 背景图形
├── decorations/           # 装饰元素
├── icons/                 # 图标集合
├── illustrations/         # 插画资源
└── patterns/              # 纹理图案
```

## 🛠️ 组件库

项目提供了多个可复用的图形组件：

### UI 组件
- `Logo` - Logo 显示组件
- `Icon` - 图标组件及预定义图标
- `NeonText` - 霓虹发光文字
- `CyberButton` - 赛博朋克按钮
- `CyberBadge` - 赛博朋克徽章

### 效果组件
- `CyberGlow` - 发光效果容器
- `HolographicCard` - 全息投影卡片
- 更多特效组件见 `frontend/components/effects/`

## 📖 使用指南

### 1. 添加新图标
1. 创建 SVG 文件（24x24 视图框）
2. 应用赛博朋克风格（发光效果）
3. 保存到 `frontend/public/icons/`
4. 在 `ICONS.md` 中记录
5. 可选：在 `Icon.tsx` 中添加预定义组件

### 2. 使用颜色
优先使用 Tailwind CSS 类：
```tsx
className="text-cyber-cyan bg-cyber-dark border-cyber-border"
```

或使用 CSS 变量：
```css
color: var(--cyber-cyan);
background: var(--cyber-dark);
```

### 3. 创建发光效果
使用 Tailwind 阴影类：
```tsx
className="shadow-neon-cyan"
className="shadow-glow-purple"
```

或使用 `CyberGlow` 组件包裹内容。

## 🎓 最佳实践

### ✅ 推荐做法
- 使用 SVG 格式的图形
- 保持适当的留白和安全区域
- 确保文字和背景有足够对比度
- 使用统一的间距系统（4px 基础网格）
- 优化动画性能（使用 transform 和 opacity）

### ❌ 避免做法
- 不要过度使用发光效果
- 不要混用过多颜色（一次不超过 3 种）
- 不要创建过小的可点击元素（最小 44x44px）
- 不要忽略移动端体验

## 🔗 相关资源

- [Tailwind CSS 文档](https://tailwindcss.com/)
- [Framer Motion 文档](https://www.framer.com/motion/)
- [SVG 优化工具](https://jakearchibald.github.io/svgomg/)
- [颜色对比度检查器](https://webaim.org/resources/contrastchecker/)

## 📝 版本历史

### v1.0.0 (2026-03-03)
- 初始图形设计系统
- 完整的配色方案
- Logo 和图标系统
- 基础效果组件

## 🤝 贡献指南

如需添加新的图形元素或修改设计规范：

1. 检查现有文档确保不重复
2. 遵循现有的设计原则
3. 更新相关文档
4. 在项目中测试实际效果
5. 提交变更并说明理由

## 📧 联系方式

如有设计相关问题，请联系：
- CyberPress 设计团队
- 项目 Issue 板

---

**最后更新**: 2026-03-03
**版本**: 1.0.0
**维护者**: CyberPress 设计团队
