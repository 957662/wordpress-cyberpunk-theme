# CyberPress 图标组件使用指南

## 📦 组件结构

```
frontend/components/icons/
├── index.ts              # 统一导出
├── CyberIcon.tsx         # 赛博装饰图标
├── NavigationIcons.tsx   # 导航图标组
├── ActionIcons.tsx       # 操作图标组
├── SocialIcons.tsx       # 社交图标组
└── StatusIcons.tsx       # 状态图标组
```

---

## 🎯 基础用法

### 单个导入
```tsx
import { HomeIcon } from '@/components/icons';

export default function Page() {
  return (
    <div>
      <HomeIcon size={24} />
      <HomeIcon size={32} className="text-cyber-cyan" />
    </div>
  );
}
```

### 批量导入
```tsx
import * as Icons from '@/components/icons';

export default function Page() {
  return (
    <div>
      <Icons.HomeIcon size={24} />
      <Icons.SettingsIcon size={24} />
      <Icons.UserIcon size={24} />
    </div>
  );
}
```

---

## 🔧 API 接口

### 基础属性
```typescript
interface BaseIconProps {
  size?: number;        // 图标尺寸（默认 24）
  className?: string;   // 自定义 Tailwind 类名
}
```

### 扩展属性
```typescript
interface IconProps extends BaseIconProps {
  variant?: 'solid' | 'outline';  // 实心/描边
  color?: string;                  // 自定义颜色
  filled?: boolean;                // 填充模式
}
```

---

## 🎨 样式定制

### 尺寸变体
```tsx
<HomeIcon size={16} />   // 小
<HomeIcon size={24} />   // 标准
<HomeIcon size={32} />   // 大
<HomeIcon size={48} />   // 超大
```

### 颜色定制
```tsx
// 使用 Tailwind 类名
<HomeIcon className="text-cyber-cyan" />
<HomeIcon className="text-cyber-purple" />
<HomeIcon className="text-cyber-pink" />

// 使用颜色属性
<HomeIcon color="#00f0ff" />
```

### 渐变效果
```tsx
<HeartIcon className="bg-gradient-to-r from-cyber-cyan to-cyber-purple" />
```

---

## ⚡ 动画效果

### 旋转动画
```tsx
<LoadingIcon className="animate-spin" />
<RefreshIcon className="animate-spin" />
```

### 脉冲动画
```tsx
<BellIcon className="animate-pulse" />
<ZapIcon className="animate-pulse" />
```

### 弹跳动画
```tsx
<StarIcon className="animate-bounce" />
```

---

## 🎭 状态图标

### 点赞/收藏
```tsx
// 空心状态
<HeartIcon size={24} variant="outline" />

// 实心状态
<HeartIcon size={24} variant="solid" className="text-cyber-pink" />

// 动态切换
const [liked, setLiked] = useState(false);

<HeartIcon
  size={24}
  variant={liked ? 'solid' : 'outline'}
  className={liked ? 'text-cyber-pink' : 'text-gray-400'}
  onClick={() => setLiked(!liked)}
/>
```

### 星级评分
```tsx
<StarIcon size={20} filled className="text-cyber-yellow" />
<StarIcon size={20} filled className="text-cyber-yellow" />
<StarIcon size={20} filled className="text-cyber-yellow" />
<StarIcon size={20} className="text-gray-600" />
<StarIcon size={20} className="text-gray-600" />
```

### 主题切换
```tsx
const [isDark, setIsDark] = useState(true);

{isDark ? (
  <MoonIcon
    size={24}
    className="text-cyber-purple"
    onClick={() => setIsDark(false)}
  />
) : (
  <SunIcon
    size={24}
    className="text-cyber-yellow"
    onClick={() => setIsDark(true)}
  />
)}
```

---

## 🔔 通知图标

### 红点提示
```tsx
<div className="relative">
  <BellIcon size={24} />
  {hasNotification && (
    <span className="absolute -top-1 -right-1 flex h-3 w-3">
      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyber-pink opacity-75"></span>
      <span className="relative inline-flex rounded-full h-3 w-3 bg-cyber-pink"></span>
    </span>
  )}
</div>
```

### 计数提示
```tsx
<div className="relative">
  <MessageSquareIcon size={24} />
  {count > 0 && (
    <span className="absolute -top-1 -right-1 bg-cyber-pink text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
      {count > 9 ? '9+' : count}
    </span>
  )}
</div>
```

---

## 🎪 组合使用

### 图标 + 文字
```tsx
<div className="flex items-center gap-2">
  <DownloadIcon size={20} className="text-cyber-cyan" />
  <span>下载文件</span>
</div>
```

### 图标按钮
```tsx
<button className="flex items-center gap-2 px-4 py-2 bg-cyber-card border border-cyber-cyan rounded hover:bg-cyber-cyan/10 transition">
  <EditIcon size={18} />
  <span>编辑</span>
</button>
```

### 图标组
```tsx
<div className="flex gap-4">
  <GitHubIcon size={32} className="hover:text-cyber-cyan transition" />
  <TwitterIcon size={32} className="hover:text-cyber-cyan transition" />
  <LinkedInIcon size={32} className="hover:text-cyber-cyan transition" />
</div>
```

---

## 📱 响应式图标

```tsx
<div className="hidden md:block">
  <SearchIcon size={24} />
</div>

<div className="block md:hidden">
  <SearchIcon size={20} />
</div>
```

---

## ♿ 可访问性

### ARIA 标签
```tsx
<SearchIcon
  size={24}
  aria-label="搜索"
  role="button"
  tabIndex={0}
/>
```

### 语义化图标
```tsx
<button aria-label="关闭对话框">
  <CloseIcon size={24} />
</button>
```

---

## 🎯 性能优化

### 懒加载
```tsx
import dynamic from 'next/dynamic';

const HeavyIcon = dynamic(() => import('@/components/icons/SettingsIcon'), {
  loading: () => <LoadingIcon size={24} />
});
```

### 图标预加载
```tsx
// 在 layout.tsx 中预加载常用图标
<link rel="preload" href="/icons/home.svg" as="image" />
```

---

## 🛠️ 自定义图标

### 创建新图标
```tsx
// frontend/components/icons/CustomIcon.tsx
import { BaseIconProps } from './types';

export const CustomIcon = ({ size = 24, className = '' }: BaseIconProps) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      className={className}
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* SVG 内容 */}
      <path d="M12 2L2 7l10 5 10-5-10-5z" stroke="currentColor" strokeWidth="2" />
    </svg>
  );
};
```

### 导出新图标
```tsx
// frontend/components/icons/index.ts
export { CustomIcon } from './CustomIcon';
```

---

## 📋 完整图标列表

### 导航类
- HomeIcon
- BlogIcon
- AboutIcon
- PortfolioIcon
- SearchIcon
- MenuIcon

### 箭头类
- ArrowLeftIcon
- ArrowRightIcon
- ChevronUpIcon
- ChevronDownIcon
- ChevronLeftIcon
- ChevronRightIcon

### 操作类
- EditIcon
- TrashIcon
- SaveIcon
- RefreshIcon
- CopyIcon
- DownloadIcon
- UploadIcon

### 用户类
- UserIcon
- SettingsIcon
- LogInIcon
- LogOutIcon
- ShieldIcon
- LockIcon
- UnlockIcon

### 社交类
- GitHubIcon
- TwitterIcon
- LinkedInIcon
- EmailIcon
- RSSIcon

### 状态类
- LoadingIcon
- CheckIcon
- AlertIcon
- CloseIcon
- HeartIcon
- StarIcon
- BookmarkIcon
- CommentIcon

### 技术类
- CodeIcon
- TerminalIcon
- DatabaseIcon
- ServerIcon
- CloudIcon
- GitBranchIcon
- GitCommitIcon

---

**最后更新**: 2026-03-07
**维护者**: CyberPress AI Design Team