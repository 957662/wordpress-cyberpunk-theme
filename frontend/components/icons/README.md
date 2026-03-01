# CyberPress Icon Library

赛博朋克风格的 React 图标组件库

## 🚀 快速开始

```tsx
import { SearchIcon, BlogIcon, CpuIcon } from '@/components/icons';

<SearchIcon size={24} />
<BlogIcon size={32} variant="purple" />
<CpuIcon size={48} variant="cyan" animated={true} />
```

## 📦 包含的图标

### 导航图标 (5个)
- `HomeIcon` - 首页
- `BlogIcon` - 博客
- `PortfolioIcon` - 作品集
- `SearchIcon` - 搜索
- `ArrowIcon` - 箭头

### 社交媒体 (8个)
- `GitHubIcon` - GitHub
- `TwitterIcon` - Twitter/X
- `DiscordIcon` - Discord
- `YouTubeIcon` - YouTube
- `DribbbleIcon` - Dribbble
- `LinkedInIcon` - LinkedIn
- `EmailIcon` - 邮件
- `RSSIcon` - RSS

### UI 元素 (16个)
- `CalendarIcon` - 日期
- `TagIcon` - 标签
- `StarIcon` - 星标
- `UserIcon` - 用户
- `SettingsIcon` - 设置
- `CodeIcon` - 代码
- `TerminalIcon` - 终端
- `CheckIcon` - 勾选
- `WarningIcon` - 警告
- `ErrorIcon` - 错误
- `InfoIcon` - 信息
- `ShieldLockIcon` - 安全锁
- `UnlockIcon` - 解锁
- `LockIcon` - 锁定
- `ThemeIcon` - 主题切换

### 操作图标 (10个)
- `MenuIcon` - 菜单
- `CloseIcon` - 关闭
- `LoadingIcon` - 加载
- `ExternalLinkIcon` - 外部链接
- `HeartIcon` - 点赞
- `CommentIcon` - 评论
- `ShareIcon` - 分享
- `CopyIcon` - 复制
- `FilterIcon` - 筛选
- `SortIcon` - 排序

### 文件系统 (2个)
- `FileIcon` - 文件
- `ArchiveIcon` - 压缩包

### 媒体图标 (3个)
- `MusicIcon` - 音乐
- `CameraIcon` - 相机
- `TerminalIcon` - 终端

### 状态图标 (3个)
- `OnlineIcon` - 在线
- `OfflineIcon` - 离线
- `SyncIcon` - 同步

### 工具图标 (7个)
- `GlobeIcon` - 地球
- `ZapIcon` - 闪电
- `DownloadIcon` - 下载
- `UploadIcon` - 上传
- `EyeIcon` - 查看
- `EyeOffIcon` - 隐藏
- `BookmarkIcon` - 书签

### 赛博科技 (6个)
- `CyberIcon` - 赛博主题
- `CpuIcon` - CPU
- `DatabaseIcon` - 数据库
- `NetworkIcon` - 网络
- `HologramIcon` - 全息投影
- `ChipIcon` - 芯片

**总计: 69 个图标**

## 🎨 颜色变体

所有图标支持以下赛博朋克配色：

```tsx
variant="cyan"    // 霓虹青 #00f0ff (默认)
variant="purple"  // 赛博紫 #9d00ff
variant="pink"    // 激光粉 #ff0080
variant="yellow"  // 电压黄 #f0ff00
variant="green"   // 矩阵绿 #00ff88 (部分图标)
```

## 📐 尺寸规格

推荐使用的标准尺寸：

```tsx
size={16}  // 小尺寸：按钮、列表
size={20}  // 中小尺寸：输入框
size={24}  // 标准尺寸：导航、卡片（默认）
size={32}  // 大尺寸：标题、装饰
size={48}  // 超大尺寸：英雄区
size={64}  // 特大尺寸：背景装饰
```

## ⚙️ Props 接口

```typescript
interface IconProps {
  size?: number;              // 图标尺寸 (默认: 24)
  variant?: 'cyan' | 'purple' | 'pink' | 'yellow' | 'green';
  className?: string;         // 自定义类名
  animated?: boolean;         // 是否启用动画 (默认: false)
}
```

## 💡 使用示例

### 基础用法
```tsx
<SearchIcon size={24} />
<BlogIcon size={32} variant="purple" />
<CpuIcon size={48} variant="cyan" animated={true} />
```

### 按钮图标
```tsx
<button className="flex items-center gap-2">
  <DownloadIcon size={20} variant="cyan" />
  <span>下载</span>
</button>
```

### 自定义样式
```tsx
<SearchIcon
  size={24}
  variant="cyan"
  className="text-cyber-cyan hover:text-cyber-purple transition"
/>
```

### 条件渲染
```tsx
{status === 'online' ? (
  <OnlineIcon size={16} variant="green" animated={true} />
) : (
  <OfflineIcon size={16} variant="pink" />
)}
```

## 🎯 最佳实践

### ✅ 推荐
- 使用标准尺寸（16, 20, 24, 32, 48, 64）
- 根据语义选择合适的颜色
- 为图标添加 `aria-label` 提升可访问性
- 按需导入图标以优化性能

### ❌ 避免
- 使用不规范的尺寸
- 颜色与语义不符
- 过度使用动画效果
- 全量导入所有图标

## 📚 相关文档

- [完整图标清单 v2.0](../../docs/ICON_MANIFEST_V2.md) - 详细的图标使用说明
- [图标使用指南](../../docs/ICON_USAGE_GUIDE.md) - 完整的使用教程
- [快速参考](../../docs/ICON_QUICK_REF.md) - 常用代码片段
- [配色参考](../../docs/COLOR_REFERENCE.md) - 赛博朋克配色方案

## 🔧 技术规格

- **框架**: React 18+
- **语言**: TypeScript
- **格式**: SVG
- **样式**: Tailwind CSS
- **发光效果**: SVG Filters
- **动画**: Tailwind Animations

## 📝 添加新图标

### 1. 创建图标组件

```tsx
// frontend/components/icons/MyNewIcon.tsx
interface MyNewIconProps {
  size?: number;
  variant?: 'cyan' | 'purple' | 'pink' | 'yellow';
  className?: string;
  animated?: boolean;
}

const colorMap = {
  cyan: '#00f0ff',
  purple: '#9d00ff',
  pink: '#ff0080',
  yellow: '#f0ff00',
};

export const MyNewIcon: React.FC<MyNewIconProps> = ({
  size = 24,
  variant = 'cyan',
  className = '',
  animated = false,
}) => {
  const color = colorMap[variant];
  const animationClass = animated ? 'animate-pulse' : '';

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`${className} ${animationClass}`}
    >
      {/* SVG 内容 */}
    </svg>
  );
};

export default MyNewIcon;
```

### 2. 更新导出文件

```tsx
// frontend/components/icons/index.ts
export { MyNewIcon } from './MyNewIcon';
export type { MyNewIconProps } from './MyNewIcon';
```

### 3. 使用新图标

```tsx
import { MyNewIcon } from '@/components/icons';

<MyNewIcon size={24} variant="cyan" />
```

## 🌟 特色功能

- ✨ **赛博朋克风格** - 霓虹发光效果
- 🎨 **多色变体** - 5种赛博朋克配色
- ⚡ **动画支持** - 脉冲、旋转等动画
- 📱 **响应式** - 完全响应式设计
- 🔧 **TypeScript** - 完整类型支持
- ♿ **可访问性** - 支持屏幕阅读器
- 🎯 **Tailwind** - 原生 Tailwind 类名支持

## 📄 许可证

MIT License - CyberPress Platform

---

**版本**: v2.0
**更新时间**: 2026-03-02
**图标总数**: 69 个
**设计团队**: CyberPress AI Design Team
