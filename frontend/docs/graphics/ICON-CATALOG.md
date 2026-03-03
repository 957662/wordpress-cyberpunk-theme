# CyberPress 图标清单

> 完整的图标库目录和使用指南

## 📋 目录

- [导航图标](#导航图标)
- [功能图标](#功能图标)
- [社交媒体图标](#社交媒体图标)
- [编辑图标](#编辑图标)
- [UI 状态图标](#ui-状态图标)
- [特效图标](#特效图标)
- [使用指南](#使用指南)

---

## 导航图标

### HomeIcon
**用途**: 首页导航

```tsx
import { HomeIcon } from '@/components/graphics/SVGIcons';

<HomeIcon size={24} className="text-cyber-cyan" />
```

**尺寸**: 16, 20, 24, 28, 32
**变体**: 默认, 发光

---

### MenuIcon
**用途**: 菜单按钮

```tsx
<MenuIcon size={24} glow={true} />
```

**尺寸**: 16, 20, 24, 28, 32

---

### CloseIcon
**用途**: 关闭/取消

```tsx
<CloseIcon size={20} />
```

---

### ChevronIcon
**用途**: 折叠/展开、面包屑导航

**方向**: left, right, up, down

```tsx
<ChevronIcon direction="right" size={20} />
```

---

## 功能图标

### SearchIcon
**用途**: 搜索功能

```tsx
<SearchIcon size={24} glow={true} />
```

---

### UserIcon
**用途**: 用户账户、个人资料

```tsx
<UserIcon size={24} />
```

---

### SettingsIcon
**用途**: 设置、配置

```tsx
<SettingsIcon size={24} />
```

---

### BellIcon
**用途**: 通知、提醒

```tsx
<BellIcon size={24} className="text-cyber-pink" />
```

---

### DownloadIcon
**用途**: 下载内容

```tsx
<DownloadIcon size={20} />
```

---

### UploadIcon
**用途**: 上传文件

```tsx
<UploadIcon size={20} />
```

---

### FilterIcon
**用途**: 内容筛选

```tsx
<FilterIcon size={20} />
```

---

### SortIcon
**用途**: 排序选项

```tsx
<SortIcon size={20} />
```

---

## 社交媒体图标

### GitHubIcon
**用途**: GitHub 链接

```tsx
<GitHubIcon size={24} />
```

---

### TwitterIcon
**用途**: Twitter/X 链接

```tsx
<TwitterIcon size={24} />
```

---

### LinkedInIcon
**用途**: LinkedIn 链接

```tsx
<LinkedInIcon size={24} />
```

---

### EmailIcon
**用途**: 邮箱联系

```tsx
<EmailIcon size={24} />
```

---

### RSSIcon
**用途**: RSS 订阅

```tsx
<RSSIcon size={24} glow={true} />
```

---

## 编辑图标

### EditIcon
**用途**: 编辑内容

```tsx
<EditIcon size={20} />
```

---

### DeleteIcon
**用途**: 删除内容

```tsx
<DeleteIcon size={20} className="text-red-500" />
```

---

### SaveIcon
**用途**: 保存更改

```tsx
<SaveIcon size={20} />
```

---

### CopyIcon
**用途**: 复制内容

```tsx
<CopyIcon size={20} />
```

---

### PasteIcon
**用途**: 粘贴内容

```tsx
<PasteIcon size={20} />
```

---

## UI 状态图标

### LoadingIcon
**用途**: 加载状态

```tsx
<LoadingIcon size={24} />
```

**特性**: 旋转动画

---

### CheckIcon
**用途**: 成功状态

```tsx
<CheckIcon size={20} className="text-green-500" />
```

---

### ErrorIcon
**用途**: 错误状态

```tsx
<ErrorIcon size={20} className="text-red-500" />
```

---

### WarningIcon
**用途**: 警告提示

```tsx
<WarningIcon size={20} className="text-yellow-500" />
```

---

### InfoIcon
**用途**: 信息提示

```tsx
<InfoIcon size={20} className="text-blue-500" />
```

---

## 特效图标

### GlitchIcon
**用途**: 装饰性故障效果图标

```tsx
<GlitchIcon size={32} />
```

**特性**: CSS 故障动画

---

### NeonIcon
**用途**: 霓虹发光图标

```tsx
<NeonIcon size={32} glow={true} color="#00f0ff" />
```

**特性**: 强烈发光效果

---

### PulseIcon
**用途**: 脉冲动画图标

```tsx
<PulseIcon size={24} />
```

**特性**: 脉冲缩放动画

---

## 使用指南

### 基础用法

```tsx
import { HomeIcon, SearchIcon, UserIcon } from '@/components/graphics/SVGIcons';

function Component() {
  return (
    <div className="flex gap-4">
      <HomeIcon size={24} />
      <SearchIcon size={24} glow={true} />
      <UserIcon size={24} className="text-cyber-cyan" />
    </div>
  );
}
```

### 自定义颜色

```tsx
// 使用 className
<HomeIcon size={24} className="text-cyber-cyan" />

// 使用 color 属性
<HomeIcon size={24} color="#00f0ff" />
```

### 发光效果

```tsx
<SearchIcon size={24} glow={true} />
```

### 点击事件

```tsx
<SettingsIcon
  size={24}
  onClick={() => console.log('Settings clicked')}
  className="cursor-pointer"
/>
```

### 动画组合

```tsx
import { motion } from 'framer-motion';
import { HomeIcon } from '@/components/graphics/SVGIcons';

<motion.div
  whileHover={{ scale: 1.1 }}
  whileTap={{ scale: 0.9 }}
>
  <HomeIcon size={24} glow={true} />
</motion.div>
```

---

## 配色方案

### 推荐颜色组合

```tsx
// 青色主题
<Icon size={24} className="text-cyber-cyan" />

// 紫色主题
<Icon size={24} className="text-cyber-purple" />

// 粉色主题
<Icon size={24} className="text-cyber-pink" />

// 渐变效果
<Icon size={24} className="text-transparent bg-clip-text bg-gradient-to-r from-cyber-cyan to-cyber-purple" />
```

---

## 图标尺寸指南

| 用途 | 尺寸 |
|------|------|
| 按钮 | 20-24px |
| 导航 | 24-28px |
| 标题 | 32-48px |
| 正文内联 | 16-20px |
| 小型徽章 | 12-16px |

---

## 性能优化

### 按需导入

```tsx
// ✅ 推荐
import { HomeIcon } from '@/components/graphics/SVGIcons';

// ❌ 避免
import * as Icons from '@/components/graphics/SVGIcons';
```

### 图标缓存

所有 SVG 图标都是内联的，会自动被 Next.js 缓存。

---

## 未来扩展

计划添加的图标分类：

- [ ] 媒体图标 (视频、音频、图片)
- [ ] 文件类型图标 (PDF、DOC、ZIP)
- [ ] 支付图标 (信用卡、PayPal)
- [ ] 更多社交媒体 (Discord、Telegram)
- [ ] 区块链相关图标

---

**最后更新**: 2026-03-03
**版本**: 1.0.0
**维护者**: Design Team
