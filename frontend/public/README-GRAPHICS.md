# CyberPress Graphics - 图形素材说明

## 📁 目录结构

```
frontend/public/
├── logo.svg              # 主 Logo（带文字）
├── logo-icon.svg         # Logo 图标（六边形）
└── logo-mark.svg         # Logo 标志（简化版 favicon）

frontend/components/icons/
├── index.ts              # 统一导出
├── CyberIcon.tsx         # 赛博装饰图标
├── MenuIcon.tsx          # 菜单图标
├── SearchIcon.tsx        # 搜索图标
├── ArrowIcon.tsx         # 箭头图标
├── LoadingIcon.tsx       # 加载图标
├── GitHubIcon.tsx        # GitHub 图标
├── TwitterIcon.tsx       # Twitter 图标
├── BlogIcon.tsx          # 博客图标
├── PortfolioIcon.tsx     # 作品集图标
├── CalendarIcon.tsx      # 日历图标
├── TagIcon.tsx           # 标签图标
├── CodeIcon.tsx          # 代码图标
├── ThemeIcon.tsx         # 主题图标
├── UserIcon.tsx          # 用户图标
├── SettingsIcon.tsx      # 设置图标
├── HeartIcon.tsx         # 心形图标
├── CommentIcon.tsx       # 评论图标
├── ShareIcon.tsx         # 分享图标
├── CopyIcon.tsx          # 复制图标
├── ExternalLinkIcon.tsx  # 外部链接图标
├── CheckIcon.tsx         # 勾选图标
├── CloseIcon.tsx         # 关闭图标
├── WarningIcon.tsx       # 警告图标
├── ErrorIcon.tsx         # 错误图标
├── InfoIcon.tsx          # 信息图标
├── StarIcon.tsx          # 星星图标
├── FilterIcon.tsx        # 筛选图标
└── SortIcon.tsx          # 排序图标
```

## 🎨 Logo 使用指南

### logo.svg - 主 Logo
**用途**: 导航栏、页眉、品牌展示
**尺寸**: 200x60
**格式**: SVG
**使用示例**:
```tsx
<Image src="/logo.svg" alt="CyberPress" width={200} height={60} />
```

### logo-icon.svg - Logo 图标
**用途**: 应用图标、加载页、独立展示
**尺寸**: 100x100
**格式**: SVG
**使用示例**:
```tsx
<Image src="/logo-icon.svg" alt="CyberPress Icon" width={100} height={100} />
```

### logo-mark.svg - Logo 标志
**用途**: Favicon、PWA 图标、小尺寸展示
**尺寸**: 50x50
**格式**: SVG
**使用示例**:
```tsx
<link rel="icon" href="/logo-mark.svg" />
```

## 🎯 图标使用指南

### 导入方式

```tsx
// 单个导入
import { SearchIcon } from '@/components/icons';

// 批量导入
import * as Icons from '@/components/icons';

// 使用
<SearchIcon size={24} />
<Icons.SearchIcon size={24} />
```

### 通用属性

所有图标都支持以下属性：

```typescript
{
  size?: number;        // 图标尺寸（默认 24）
  className?: string;   // 自定义 Tailwind 类名
}
```

### 特殊属性

部分图标支持额外属性：

```tsx
// 颜色变体
<HeartIcon variant="pink" />
<ArrowIcon variant="cyan" />

// 方向控制
<ArrowIcon direction="up" />

// 填充模式
<GitHubIcon filled={true} />
<StarIcon filled={true} />

// 状态切换
<MenuIcon isOpen={true} />
<ThemeIcon mode="dark" />

// 排序方向
<SortIcon direction="asc" />
```

## 🎨 设计规范

### 视觉特征
- ✅ **赛博朋克风格**: 霓虹发光、科技线条
- ✅ **渐变应用**: 多色渐变增强层次
- ✅ **电路元素**: 节点、连接线装饰
- ✅ **一致性强**: 统一的设计语言

### 动画支持
```css
/* 旋转动画（加载图标） */
@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

/* 发光动画 */
@keyframes glow {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
}

/* 使用 */
<LoadingIcon className="animate-spin" />
```

## 📱 响应式使用

```tsx
// 响应式尺寸
<SearchIcon size={isMobile ? 20 : 24} />

// 响应式显示
<div className="hidden md:block">
  <MenuIcon size={24} />
</div>
```

## 🎯 性能优化

### 最佳实践
1. **内联 SVG**: 图标组件直接内联，无额外请求
2. **Tree Shaking**: 按需导入，未使用的图标会被剔除
3. **CSS 控制**: 通过 className 而非 inline style 控制样式
4. **缓存策略**: Logo 文件存储在 public 目录，可被缓存

### 懒加载示例
```tsx
// 懒加载图标组件
const HeavyIcon = dynamic(() => import('@/components/icons/SettingsIcon'), {
  loading: () => <LoadingIcon />
});
```

## 🔧 自定义扩展

### 添加新图标

1. 创建新的图标组件：
```tsx
// frontend/components/icons/NewIcon.tsx
interface NewIconProps {
  size?: number;
  className?: string;
}

export const NewIcon = ({ size = 24, className = '' }: NewIconProps) => {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
      {/* SVG 内容 */}
    </svg>
  );
};
```

2. 更新导出文件：
```tsx
// frontend/components/icons/index.ts
export { NewIcon } from './NewIcon';
export type { NewIconProps } from './NewIcon';
```

## 📋 检查清单

使用图标前请确认：

- [ ] 导入路径正确
- [ ] 尺寸适配当前布局
- [ ] 颜色符合设计规范
- [ ] 可访问性（添加 aria-label）
- [ ] 响应式测试
- [ ] 动画性能检查

## 🌐 浏览器兼容性

- ✅ Chrome/Edge 90+
- ✅ Firefox 88+
- ✅ Safari 14+
- ✅ iOS Safari 14+
- ✅ Android Chrome 90+

## 📞 技术支持

如需帮助，请参考：
- [图标清单](../docs/ICON_MANIFEST.md)
- [配色参考](../docs/COLOR_REFERENCE.md)
- [Tailwind 配置](../tailwind.config.ts)

---

**版本**: v1.0.0
**最后更新**: 2026-03-02
**维护者**: CyberPress AI Design Team
