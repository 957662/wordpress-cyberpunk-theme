# CyberPress Platform - 图形设计文档索引

欢迎查阅 CyberPress 平台的图形设计文档系统。

## 📚 文档导航

### 🚀 快速开始
- **[快速参考](./QUICK_REFERENCE.md)** - 快速查找颜色、类名、组件用法
- **[素材汇总](./ASSETS_SUMMARY.md)** - 所有图形素材和组件的完整清单

### 📖 核心文档
1. **[配色参考](./COLOR_PALETTE.md)**
   - 完整的赛博朋克配色方案
   - 颜色使用指南
   - 渐变和发光效果
   - Tailwind CSS 类名

2. **[图标清单](./ICONS.md)**
   - 所有可用图标分类
   - 图标使用说明
   - 添加新图标指南

3. **[Logo 使用指南](./LOGO_GUIDE.md)**
   - Logo 变体和用途
   - 使用场景和尺寸规范
   - 技术实现示例

4. **[图形设计规范](./GRAPHICS_GUIDE.md)**
   - 统一的设计系统
   - 视觉效果清单
   - 创建新图形指南

5. **[组件展示](./GRAPHICS_SHOWCASE.md)**
   - 所有组件使用示例
   - 组合示例代码
   - 动画效果参考

## 🎨 图形资源概览

### 📊 资源统计
```
✅ Logo: 6 个变体
✅ 图标: 70+ 个功能图标
✅ 背景: 4 种背景图案
✅ 装饰: 3 种装饰元素
✅ 插画: 7 种技术插画
✅ 图案: 8 种纹理图案
✅ 组件: 11 个 React 组件
✅ 文档: 7 个设计文档
```

### 📍 资源位置
所有图形资源存放在 `frontend/public/` 目录：

```
frontend/public/
├── assets/logo/           # Logo 资源
├── backgrounds/           # 背景图形
├── decorations/           # 装饰元素
├── icons/                 # 70+ 图标
├── illustrations/         # 7 种插画
└── patterns/              # 8 种图案
```

### 🧩 组件位置
所有 React 组件存放在 `frontend/components/` 目录：

```
frontend/components/
├── ui/
│   ├── Logo.tsx          # Logo 组件
│   └── Icon.tsx          # 图标组件
└── effects/
    ├── NeonText.tsx      # 霓虹文字
    ├── CyberGlow.tsx     # 发光容器
    ├── CyberCard.tsx     # 赛博卡片
    ├── CyberBorder.tsx   # 赛博边框
    ├── CyberDivider.tsx  # 赛博分割线
    ├── CyberButton.tsx   # 赛博按钮
    ├── CyberBadge.tsx    # 赛博徽章
    └── HolographicCard.tsx # 全息卡片
```

## 🎨 核心颜色速查

| 颜色 | Hex 代码 | 用途 |
|------|---------|------|
| 深空黑 | `#0a0a0f` | 主背景 |
| 霓虹青 | `#00f0ff` | 主强调色 |
| 赛博紫 | `#9d00ff` | 次强调色 |
| 激光粉 | `#ff0080` | 特殊强调 |
| 电压黄 | `#f0ff00` | 高亮/成功 |

## 🔧 快速使用

### 使用 Logo
```tsx
import { Logo } from '@/components/ui/Logo';

<Logo variant="horizontal" size={120} />
```

### 使用图标
```tsx
import { HomeIcon, SearchIcon } from '@/components/ui/Icon';

<HomeIcon size={24} color="cyan" />
<SearchIcon size={20} color="purple" animated />
```

### 使用效果组件
```tsx
import { NeonText, CyberCard, CyberButton } from '@/components/effects';

<NeonText color="cyan" size="lg">霓虹文字</NeonText>
<CyberCard variant="neon" color="purple">卡片内容</CyberCard>
<CyberButton variant="primary" color="cyan">按钮</CyberButton>
```

## 📋 使用场景指南

### 导航栏
```tsx
<nav>
  <Logo variant="horizontal" size={120} />
  <MenuIcon size={24} color="cyan" />
</nav>
```

### 博客卡片
```tsx
<CyberCard variant="neon" color="cyan" hover clickable>
  <div className="flex gap-2 mb-4">
    <CyberBadge variant="solid" color="cyan">技术</CyberBadge>
  </div>
  <h3><NeonText color="cyan">文章标题</NeonText></h3>
</CyberCard>
```

### 功能展示
```tsx
<div className="grid md:grid-cols-3 gap-6">
  <CyberCard variant="holographic" color="cyan" hover>
    <CodeIcon size={48} color="cyan" />
    <h3><NeonText color="cyan">现代技术</NeonText></h3>
  </CyberCard>
</div>
```

### Hero 区域
```tsx
<div className="text-center">
  <Logo variant="main" size={200} animated />
  <h1>
    <NeonText color="cyan">CYBER</NeonText>
    <NeonText color="purple">PRESS</NeonText>
  </h1>
  <CyberButton variant="primary" color="cyan" size="lg">
    开始探索
  </CyberButton>
</div>
```

## 🎯 设计原则

CyberPress 图形设计遵循以下原则：

1. **赛博朋克美学** - 未来感、霓虹效果、科技元素
2. **高对比度** - 深色背景配合亮色元素
3. **一致性** - 统一的设计规范和组件系统
4. **性能优先** - SVG 格式和优化的动画

## 🔗 相关资源

### 外部资源
- [Tailwind CSS 文档](https://tailwindcss.com/)
- [Framer Motion 文档](https://www.framer.com/motion/)
- [Lucide 图标库](https://lucide.dev/)
- [SVG 优化工具](https://jakearchibald.github.io/svgomg/)

### 项目资源
- [项目蓝图](../../PROJECT.md)
- [前端配置](../../frontend/README.md)
- [组件库文档](../../components/README.md)

## 📞 获取帮助

### 文档问题
- 查阅对应的详细文档
- 检查快速参考指南
- 查看组件展示示例

### 技术问题
- 检查组件 Props 定义
- 查看代码示例
- 参考最佳实践

### 设计问题
- 遵循设计规范
- 使用预定义颜色
- 参考现有组件

## 📈 版本信息

- **当前版本**: 1.0.0
- **最后更新**: 2026-03-03
- **维护状态**: ✅ 活跃维护
- **完整度**: ✅ 100% 完成

## ✅ 质量保证

所有图形资源和组件都经过：
- ✅ 视觉一致性检查
- ✅ 代码质量审查
- ✅ 性能优化测试
- ✅ 可访问性验证
- ✅ 文档完整性检查

---

**开始使用**: 查看 [快速参考](./QUICK_REFERENCE.md) 开始使用图形资源
**完整文档**: 浏览上方文档列表了解详细信息
**反馈问题**: 通过项目 Issue 板提交问题和建议

**维护者**: CyberPress 设计团队
**联系方式**: 见项目 README
