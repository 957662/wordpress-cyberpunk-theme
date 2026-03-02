# CyberPress Graphics Components Guide - 图形组件使用指南

## 📚 目录

1. [图标组件](#图标组件)
2. [徽章组件](#徽章组件)
3. [装饰组件](#装饰组件)
4. [背景图案](#背景图案)
5. [加载器](#加载器)
6. [配色参考](#配色参考)

---

## 🎨 图标组件

### 基础图标

CyberPress 提供了完整的图标库，涵盖导航、内容、操作、状态、社交等多种类型。

#### 导入方式

```tsx
// 单个导入
import { HomeIcon, SearchIcon, UserIcon } from '@/components/icons';

// 批量导入
import * as Icons from '@/components/icons';

// 通过 graphics 组件导入（包含所有图形相关组件）
import { HomeIcon, GitHubIcon, BellIcon } from '@/components/graphics';
```

#### 基础用法

```tsx
// 默认用法
<HomeIcon size={24} />

// 带颜色变体
<SearchIcon size={32} variant="purple" />

// 带动画
<LoadingIcon size={48} variant="cyan" animated={true} />

// 自定义样式
<GitHubIcon
  size={24}
  className="hover:text-cyber-cyan transition-colors"
/>
```

#### 新增图标（Phase 3）

| 图标 | 说明 | 变体 |
|-----|------|------|
| DownloadIcon | 下载图标 | cyan/purple/pink/yellow |
| UploadIcon | 上传图标 | cyan/purple/pink/yellow |
| EditIcon | 编辑图标 | cyan/purple/pink/yellow |
| TrashIcon | 删除图标 | cyan/purple/pink/yellow |
| SaveIcon | 保存图标 | cyan/purple/pink/yellow |
| RefreshIcon | 刷新图标 | cyan/purple/pink/yellow, animated |
| LinkedInIcon | LinkedIn 社交 | cyan/purple/pink/yellow |
| EmailIcon | 邮箱图标 | cyan/purple/pink/yellow |
| FolderIcon | 文件夹图标 | cyan/purple/pink/yellow |
| VideoIcon | 视频图标 | cyan/purple/pink/yellow |
| MicIcon | 麦克风图标 | cyan/purple/pink/yellow |
| BellIcon | 通知铃铛 | cyan/purple/pink/yellow |

---

## 🏷️ 徽章组件

### CyberBadge

赛博朋克风格的徽章组件，用于显示标签、状态或装饰性徽章。

```tsx
import { CyberBadge } from '@/components/graphics';

// 基础徽章
<CyberBadge text="新功能" variant="cyan" size="md" />

// 不同形状
<CyberBadge text="热门" variant="pink" shape="pill" />
<CyberBadge text="Beta" variant="yellow" shape="hexagon" />

// 带图标
<CyberBadge
  text="已认证"
  variant="green"
  icon={<CheckIcon size={16} />}
/>

// 发光效果
<CyberBadge
  text="重要"
  variant="red"
  glow={true}
  animated={true}
/>
```

#### CyberBadge Props

| 属性 | 类型 | 默认值 | 说明 |
|-----|------|--------|------|
| text | string | - | 徽章文本 |
| variant | 'cyan' \| 'purple' \| 'pink' \| 'yellow' \| 'green' \| 'red' | 'cyan' | 颜色变体 |
| size | 'sm' \| 'md' \| 'lg' | 'md' | 尺寸 |
| shape | 'rounded' \| 'pill' \| 'hexagon' \| 'square' | 'rounded' | 形状 |
| animated | boolean | false | 是否动画 |
| glow | boolean | false | 是否发光 |
| icon | ReactNode | - | 图标 |
| className | string | '' | 自定义类名 |

### CyberStatusBadge

专门用于显示状态的徽章组件。

```tsx
import { CyberStatusBadge } from '@/components/graphics';

// 在线状态
<CyberStatusBadge status="online" />

// 离线状态
<CyberStatusBadge status="offline" showText={true} />

// 忙碌状态
<CyberStatusBadge status="busy" size="lg" />

// 离开状态
<CyberStatusBadge status="away" />
```

---

## 🎭 装饰组件

### CyberDecoration

提供各种赛博朋克风格的装饰元素。

```tsx
import { CyberDecoration } from '@/components/graphics';

// 角落装饰
<CyberDecoration type="corner" variant="cyan" size={100} />

// 分割线
<CyberDecoration type="divider" variant="purple" />

// 框架
<CyberDecoration type="frame" variant="pink" size={150} />

// 网格背景
<CyberDecoration type="grid" variant="yellow" size={200} />

// 电路装饰
<CyberDecoration type="circuit" variant="cyan" size={120} animated={true} />
```

---

## 🌐 背景图案

### CyberPattern

提供各种可重复使用的背景图案。

```tsx
import { CyberPattern } from '@/components/graphics';

// 网格图案
<div className="relative">
  <CyberPattern type="grid" variant="cyan" opacity={0.1} size={20} />
  {/* 内容 */}
</div>

// 点阵图案
<CyberPattern type="dots" variant="purple" opacity={0.15} size={15} />

// 六边形图案
<CyberPattern type="hexagons" variant="pink" opacity={0.1} size={30} />

// 电路图案
<CyberPattern type="circuit" variant="cyan" opacity={0.08} size={25} />

// 矩阵图案
<CyberPattern type="matrix" variant="green" opacity={0.1} size={16} />

// 扫描线
<CyberPattern type="scanlines" variant="cyan" opacity={0.05} size={4} />
```

---

## ⏳ 加载器

### CyberLoader

各种风格的赛博朋克加载动画。

```tsx
import { CyberLoader } from '@/components/graphics';

// 旋转加载器
<CyberLoader type="spinner" variant="cyan" size={48} />

// 脉冲加载器
<CyberLoader type="pulse" variant="purple" size={64} />

// 点状加载器
<CyberLoader type="dots" variant="pink" size={40} />

// 条形加载器
<CyberLoader type="bars" variant="yellow" size={48} />

// 六边形加载器
<CyberLoader type="hexagon" variant="cyan" size={56} />

// 电路加载器
<CyberLoader type="circuit" variant="purple" size={48} />

// 带文本
<CyberLoader
  type="spinner"
  variant="cyan"
  size={48}
  text="加载中..."
/>
```

---

## 🎨 配色参考

### 核心颜色

```
深空黑: #0a0a0f
霓虹青: #00f0ff
赛博紫: #9d00ff
激光粉: #ff0080
赛博绿: #00ff88
电压黄: #f0ff00
```

### 使用建议

| 用途 | 推荐颜色 |
|-----|---------|
| 主按钮/链接 | 霓虹青 |
| 次要按钮 | 赛博紫 |
| 警告/重要 | 激光粉 |
| 高亮/评分 | 电压黄 |
| 成功/在线 | 赛博绿 |
| 错误/危险 | 警告红 |

---

**版本**: v3.0.0
**最后更新**: 2026-03-03
**维护者**: CyberPress AI Design Team
