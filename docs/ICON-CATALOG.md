# CyberPress 图标清单

本文档列出了项目中所有可用的图标组件。

## 使用方式

```tsx
import { IconName } from '@/components/icons';

// 基础用法
<IconName size={24} />

// 自定义颜色
<IconName size={32} className="text-cyber-cyan" />

// 内联样式
<IconName size={20} style={{ color: '#00f0ff' }} />
```

## 图标列表

### 导航图标

#### MenuIcon
菜单图标，用于汉堡菜单
```tsx
<MenuIcon size={24} className="text-cyber-cyan" />
```
- Props: `size`, `className`
- 常用尺寸: 24, 32

#### ArrowIcon
箭头图标，支持方向变化
```tsx
<ArrowIcon size={20} direction="right" />
```
- Props: `size`, `className`, `direction` ('up', 'down', 'left', 'right')
- 常用尺寸: 16, 20, 24

### 功能图标

#### SearchIcon
搜索图标
```tsx
<SearchIcon size={20} />
```
- Props: `size`, `className`
- 常用尺寸: 16, 20, 24

#### LoadingIcon
加载动画图标
```tsx
<LoadingIcon size={32} />
```
- Props: `size`, `className`
- 常用尺寸: 24, 32, 48

#### ThemeIcon
主题切换图标
```tsx
<ThemeIcon size={24} theme="dark" />
```
- Props: `size`, `className`, `theme` ('light', 'dark', 'auto')
- 常用尺寸: 20, 24

#### FilterIcon
过滤图标
```tsx
<FilterIcon size={20} />
```
- Props: `size`, `className`
- 常用尺寸: 16, 20

#### SortIcon
排序图标
```tsx
<SortIcon size={20} direction="asc" />
```
- Props: `size`, `className`, `direction` ('asc', 'desc')
- 常用尺寸: 16, 20

### 社交图标

#### GitHubIcon
GitHub 图标
```tsx
<GitHubIcon size={24} />
```
- Props: `size`, `className`
- 常用尺寸: 20, 24, 32

#### TwitterIcon
Twitter/X 图标
```tsx
<TwitterIcon size={24} />
```
- Props: `size`, `className`
- 常用尺寸: 20, 24, 32

### 内容类型图标

#### BlogIcon
博客图标
```tsx
<BlogIcon size={24} />
```
- Props: `size`, `className`
- 常用尺寸: 20, 24, 32

#### PortfolioIcon
作品集图标
```tsx
<PortfolioIcon size={24} />
```
- Props: `size`, `className`
- 常用尺寸: 20, 24, 32

#### CodeIcon
代码图标
```tsx
<CodeIcon size={20} />
```
- Props: `size`, `className`
- 常用尺寸: 16, 20, 24

### 元数据图标

#### CalendarIcon
日历图标
```tsx
<CalendarIcon size={16} />
```
- Props: `size`, `className`
- 常用尺寸: 14, 16, 20

#### TagIcon
标签图标
```tsx
<TagIcon size={16} />
```
- Props: `size`, `className`
- 常用尺寸: 14, 16

#### StarIcon
星标图标
```tsx
<StarIcon size={20} filled={true} />
```
- Props: `size`, `className`, `filled`
- 常用尺寸: 16, 20, 24

### 用户相关图标

#### UserIcon
用户图标
```tsx
<UserIcon size={24} />
```
- Props: `size`, `className`
- 常用尺寸: 20, 24, 32

#### SettingsIcon
设置图标
```tsx
<SettingsIcon size={20} />
```
- Props: `size`, `className`
- 常用尺寸: 18, 20, 24

### 交互图标

#### HeartIcon
爱心图标
```tsx
<HeartIcon size={20} filled={false} />
```
- Props: `size`, `className`, `filled`
- 常用尺寸: 16, 20, 24

#### CommentIcon
评论图标
```tsx
<CommentIcon size={20} />
```
- Props: `size`, `className`
- 常用尺寸: 16, 20, 24

#### ShareIcon
分享图标
```tsx
<ShareIcon size={20} />
```
- Props: `size`, `className`
- 常用尺寸: 16, 20, 24

#### CopyIcon
复制图标
```tsx
<CopyIcon size={20} />
```
- Props: `size`, `className`
- 常用尺寸: 16, 20

#### ExternalLinkIcon
外部链接图标
```tsx
<ExternalLinkIcon size={16} />
```
- Props: `size`, `className`
- 常用尺寸: 14, 16, 20

### 状态图标

#### CheckIcon
成功/勾选图标
```tsx
<CheckIcon size={20} />
```
- Props: `size`, `className`
- 常用尺寸: 16, 20, 24

#### CloseIcon
关闭/取消图标
```tsx
<CloseIcon size={20} />
```
- Props: `size`, `className`
- 常用尺寸: 16, 20, 24

#### InfoIcon
信息图标
```tsx
<InfoIcon size={20} />
```
- Props: `size`, `className`
- 常用尺寸: 16, 20, 24

#### WarningIcon
警告图标
```tsx
<WarningIcon size={20} />
```
- Props: `size`, `className`
- 常用尺寸: 16, 20, 24

#### ErrorIcon
错误图标
```tsx
<ErrorIcon size={20} />
```
- Props: `size`, `className`
- 常用尺寸: 16, 20, 24

### 品牌图标

#### CyberIcon
赛博核心图标（品牌标识）
```tsx
<CyberIcon size={48} variant="full" />
```
- Props: `size`, `className`, `variant` ('simple', 'full')
- 常用尺寸: 24, 32, 48, 64

## 图标尺寸规范

| 用途 | 尺寸 | 示例 |
|------|------|------|
| 内联小图标 | 14-16px | 按钮、标签内 |
| 标准图标 | 18-20px | 列表项、工具栏 |
| 导航图标 | 24px | 菜单、页脚 |
| 大图标 | 32-48px | 功能展示区 |
| 特大图标 | 64px+ | 首页展示 |

## 颜色规范

### 默认颜色
图标默认继承文本颜色 `currentColor`，可通过 `className` 修改：

```tsx
<!-- 霓虹青 -->
<IconName className="text-cyber-cyan" />

<!-- 霓虹紫 -->
<IconName className="text-cyber-purple" />

<!-- 霓虹粉 -->
<IconName className="text-cyber-pink" />

<!-- 灰色 -->
<IconName className="text-gray-400" />
```

### 悬停效果
```tsx
<IconName
  size={24}
  className="text-cyber-cyan hover:text-cyber-purple transition-colors"
/>
```

### 发光效果
```tsx
<IconName
  size={32}
  className="text-cyber-cyan drop-shadow-[0_0_8px_rgba(0,240,255,0.8)]"
/>
```

## 动画图标

### 旋转动画
```tsx
<LoadingIcon size={32} className="animate-spin" />
```

### 脉冲动画
```tsx
<IconName size={24} className="animate-pulse" />
```

### 自定义动画
```tsx
<IconName
  size={24}
  className="transition-transform duration-200 hover:scale-110"
/>
```

## 无障碍支持

### ARIA 标签
```tsx
<SearchIcon
  size={20}
  aria-label="搜索"
  role="img"
/>
```

### 隐藏文本
```tsx
<button>
  <SearchIcon size={20} aria-hidden="true" />
  <span className="sr-only">搜索</span>
</button>
```

## 组合使用

### 图标 + 文字
```tsx
<div className="flex items-center gap-2">
  <CalendarIcon size={16} className="text-cyber-cyan" />
  <span>2024-03-02</span>
</div>
```

### 图标按钮
```tsx
<button className="p-2 rounded hover:bg-cyber-muted transition-colors">
  <ThemeIcon size={20} />
</button>
```

### 图标徽章
```tsx
<div className="relative">
  <NotificationIcon size={24} />
  <span className="absolute -top-1 -right-1 w-4 h-4 bg-cyber-pink rounded-full text-xs flex items-center justify-center">
    3
  </span>
</div>
```

## 图标导出

所有图标从 `@/components/icons` 统一导出：

```tsx
// 导入单个图标
import { SearchIcon } from '@/components/icons';

// 导入多个图标
import { SearchIcon, MenuIcon, UserIcon } from '@/components/icons';

// 导入所有图标
import * as Icons from '@/components/icons';
```

## 图标开发规范

### 创建新图标
1. SVG 格式，24x24 视口
2. 使用 `stroke` 和 `fill` 属性
3. 支持自定义颜色
4. 保持一致的 stroke-width
5. 添加 TypeScript 类型定义

### 文件命名
- PascalCase: `IconName.tsx`
- Props 类型: `IconNameProps`

### 导出
在 `@/components/icons/index.ts` 中添加导出

## 图标优化

### 性能建议
- 使用适当的尺寸
- 避免不必要的动画
- 使用 CSS 过渡而非 JavaScript 动画
- 考虑图标雪碧图或 SVG 精灵

### 图标精灵
项目支持 SVG 精灵优化：
```tsx
import { IconSprite } from '@/components/icons/IconSprite';

<IconSprite name="search" size={20} />
```

## 更新日志

### v1.0.0 (2024-03-02)
- 初始图标库
- 包含 30+ 基础图标
- 支持赛博朋克配色
- TypeScript 类型支持
