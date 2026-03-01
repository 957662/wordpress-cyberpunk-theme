# CyberPress Icon Library - 图标清单

## 📋 概述

CyberPress 图标库包含 28 个精心设计的赛博朋克风格图标，支持多种颜色变体和尺寸。

## 🎨 图标分类

### 品牌标识 (Brand)
- `CyberIcon` - 赛博装饰图标（通用科技装饰）
- `LoadingIcon` - 加载动画图标

### 导航 (Navigation)
- `MenuIcon` - 菜单/汉堡包图标（支持开关状态）
- `ArrowIcon` - 箭头图标（支持四个方向）
- `ExternalLinkIcon` - 外部链接图标

### 操作 (Actions)
- `SearchIcon` - 搜索图标
- `ShareIcon` - 分享图标
- `CopyIcon` - 复制图标
- `CheckIcon` - 勾选/成功图标
- `CloseIcon` - 关闭图标
- `FilterIcon` - 筛选图标
- `SortIcon` - 排序图标（支持升序/降序）

### 内容 (Content)
- `BlogIcon` - 博客图标
- `PortfolioIcon` - 作品集图标
- `CalendarIcon` - 日历图标
- `TagIcon` - 标签图标
- `CodeIcon` - 代码图标
- `CommentIcon` - 评论图标
- `HeartIcon` - 心形/收藏图标（支持填充/轮廓）
- `StarIcon` - 星星图标（支持填充/轮廓）

### 用户 (User)
- `UserIcon` - 用户图标
- `SettingsIcon` - 设置图标
- `ThemeIcon` - 主题切换图标（支持亮色/暗色）

### 社交 (Social)
- `GitHubIcon` - GitHub 图标（支持填充/轮廓）
- `TwitterIcon` - Twitter/X 图标

### 状态 (Status)
- `InfoIcon` - 信息图标
- `WarningIcon` - 警告图标
- `ErrorIcon` - 错误图标

## 🎯 颜色变体

所有支持变体的图标可使用以下颜色：

| 变体名称 | 颜色值 | 用途 |
|---------|--------|------|
| `cyan` | `#00f0ff` | 主要操作、信息 |
| `purple` | `#9d00ff` | 次要操作、品牌 |
| `pink` | `#ff0080` | 强调、删除 |
| `yellow` | `#f0ff00` | 警告、收藏 |
| `green` | `#00ff88` | 成功、确认 |

## 📐 使用示例

### 基础使用
```tsx
import { SearchIcon, BlogIcon, UserIcon } from '@/components/icons';

// 默认尺寸和颜色
<SearchIcon />

// 自定义尺寸
<BlogIcon size={32} />

// 自定义类名
<UserIcon className="text-cyber-cyan" />

// 颜色变体（仅支持变体的图标）
<HeartIcon variant="pink" />
```

### 高级用法
```tsx
// 箭头方向
<ArrowIcon direction="up" />
<ArrowIcon direction="right" variant="purple" />

// 填充模式
<GitHubIcon filled={true} />
<StarIcon filled={true} variant="yellow" />

// 主题切换
<ThemeIcon mode="dark" />
<ThemeIcon mode="light" />

// 菜单状态
<MenuIcon isOpen={false} /> // 汉堡包
<MenuIcon isOpen={true} />  // X 关闭

// 排序方向
<SortIcon direction="asc" />
<SortIcon direction="desc" />
```

## 🎨 设计规范

### 尺寸规格
- **默认尺寸**: 24x24px
- **最小尺寸**: 16x16px
- **最大尺寸**: 64x64px
- **推荐尺寸**: 16, 20, 24, 32, 40, 48px

### 视觉特征
- **线条宽度**: 2px（标准），1-2px（细节）
- **发光效果**: 所有图标带有赛博朋克霓虹发光
- **科技元素**: 电路节点、连接线、角标装饰
- **渐变应用**: 多色渐变增强科技感

### 动画支持
- `LoadingIcon` - 旋转动画
- `ThemeIcon` - 切换动画
- 其他图标可通过 CSS 添加自定义动画

## 📦 技术细节

### 组件属性
```typescript
interface BaseIconProps {
  size?: number;        // 图标尺寸（默认 24）
  className?: string;   // 自定义类名
}

interface VariantIconProps extends BaseIconProps {
  variant?: 'cyan' | 'purple' | 'pink' | 'yellow' | 'green';
}
```

### 依赖项
- 无外部依赖
- 纯 SVG + TypeScript
- 支持 Tailwind CSS 类名
- 兼容 React 18+

### 性能优化
- 内联 SVG，无额外请求
- 支持 SSR/SSG
- Tree-shakeable 导出
- 可通过 CSS 控制样式

## 🔄 版本历史

### v1.0.0 (2026-03-02)
- 初始发布
- 28 个核心图标
- 5 种颜色变体
- 完整 TypeScript 支持

## 📝 未来计划

- [ ] 添加更多社交图标（LinkedIn, Discord 等）
- [ ] 支持动画变体
- [ ] 添加图标字体版本
- [ ] Figma 设计系统导出

---

**设计团队**: CyberPress AI Design Team
**最后更新**: 2026-03-02
