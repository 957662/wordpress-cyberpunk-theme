# CyberPress 图形库迁移指南

本指南帮助你从其他图标库迁移到 CyberPress 图形库。

## 📖 目录

- [从 Font Awesome 迁移](#从-font-awesome-迁移)
- [从 Lucide React 迁移](#从-lucide-react-迁移)
- [从 Heroicons 迁移](#从-heroicons-迁移)
- [从 Material Icons 迁移](#从-material-icons-迁移)
- [通用迁移步骤](#通用迁移步骤)
- [API 差异](#api-差异)

## 🎯 从 Font Awesome 迁移

### Font Awesome (React)

```tsx
// ❌ 之前 - Font Awesome
import { FaHome, FaGithub, FaSearch } from 'react-icons/fa';

<FaHome className="text-cyan-400" size={24} />
<FaGithub className="text-purple-400" size={24} />
<FaSearch className="text-pink-400" size={24} />
```

```tsx
// ✅ 之后 - CyberPress
import { HomeIcon, GitHubIcon, SearchIcon } from '@/components/graphics';

<HomeIcon size={24} color="#00f0ff" />
<GitHubIcon size={24} color="#9d00ff" />
<SearchIcon size={24} color="#ff0080" />
```

### 图标对照表

| Font Awesome | CyberPress | 说明 |
|--------------|------------|------|
| `FaHome` | `HomeIcon` | 首页 |
| `FaGithub` | `GitHubIcon` | GitHub |
| `FaSearch` | `SearchIcon` | 搜索 |
| `FaBars` | `MenuIcon` | 菜单 |
| `FaTimes` | `CloseIcon` | 关闭 |
| `FaUser` | `UserIcon` | 用户 |
| `FaCog` | `SettingsIcon` | 设置 |
| `FaEdit` | `EditIcon` | 编辑 |
| `FaTrash` | `DeleteIcon` | 删除 |
| `FaSave` | `SaveIcon` | 保存 |

## 🎯 从 Lucide React 迁移

### Lucide React

```tsx
// ❌ 之前 - Lucide React
import { Home, Github, Search } from 'lucide-react';

<Home size={24} className="text-cyan-500" />
<Github size={24} className="text-purple-500" />
<Search size={24} className="text-pink-500" />
```

```tsx
// ✅ 之后 - CyberPress
import { HomeIcon, GitHubIcon, SearchIcon } from '@/components/graphics';

<HomeIcon size={24} variant="cyan" />
<GitHubIcon size={24} variant="purple" />
<SearchIcon size={24} variant="pink" />
```

### 图标对照表

| Lucide | CyberPress | 说明 |
|--------|------------|------|
| `Home` | `HomeIcon` | 首页 |
| `Github` | `GitHubIcon` | GitHub |
| `Search` | `SearchIcon` | 搜索 |
| `Menu` | `MenuIcon` | 菜单 |
| `X` | `CloseIcon` | 关闭 |
| `User` | `UserIcon` | 用户 |
| `Settings` | `SettingsIcon` | 设置 |
| `Edit` | `EditIcon` | 编辑 |
| `Trash2` | `DeleteIcon` | 删除 |
| `Save` | `SaveIcon` | 保存 |

## 🎯 从 Heroicons 迁移

### Heroicons

```tsx
// ❌ 之前 - Heroicons
import {
  HomeIcon,
  GitHubIcon,
  MagnifyingGlassIcon
} from '@heroicons/react/24/outline';

<HomeIcon className="w-6 h-6 text-cyan-400" />
<GitHubIcon className="w-6 h-6 text-purple-400" />
<MagnifyingGlassIcon className="w-6 h-6 text-pink-400" />
```

```tsx
// ✅ 之后 - CyberPress
import { HomeIcon, GitHubIcon, SearchIcon } from '@/components/graphics';

<HomeIcon size={24} variant="cyan" />
<GitHubIcon size={24} variant="purple" />
<SearchIcon size={24} variant="pink" />
```

### 图标对照表

| Heroicons | CyberPress | 说明 |
|-----------|------------|------|
| `HomeIcon` | `HomeIcon` | 首页 |
| `MagnifyingGlassIcon` | `SearchIcon` | 搜索 |
| `Bars3Icon` | `MenuIcon` | 菜单 |
| `XMarkIcon` | `CloseIcon` | 关闭 |
| `UserIcon` | `UserIcon` | 用户 |
| `CogIcon` | `SettingsIcon` | 设置 |
| `PencilIcon` | `EditIcon` | 编辑 |
| `TrashIcon` | `DeleteIcon` | 删除 |
| `BookmarkIcon` | `BookmarkIcon` | 书签 |

## 🎯 从 Material Icons 迁移

### Material Icons

```tsx
// ❌ 之前 - Material Icons
import HomeIcon from '@material-ui/icons/Home';
import GitHubIcon from '@material-ui/icons/GitHub';
import SearchIcon from '@material-ui/icons/Search';

<HomeIcon style={{ color: '#00f0ff', fontSize: 24 }} />
<GitHubIcon style={{ color: '#9d00ff', fontSize: 24 }} />
<SearchIcon style={{ color: '#ff0080', fontSize: 24 }} />
```

```tsx
// ✅ 之后 - CyberPress
import { HomeIcon, GitHubIcon, SearchIcon } from '@/components/graphics';

<HomeIcon size={24} variant="cyan" />
<GitHubIcon size={24} variant="purple" />
<SearchIcon size={24} variant="pink" />
```

## 🔄 通用迁移步骤

### 1. 安装依赖

```bash
# CyberPress 图形库已经包含在项目中
# 无需额外安装
```

### 2. 更新导入

```tsx
// 批量替换导入
// 之前
import { Icon1, Icon2, Icon3 } from 'old-library';

// 之后
import { Icon1, Icon2, Icon3 } from '@/components/graphics';
```

### 3. 更新组件属性

```tsx
// 尺寸属性
// 之前
<Icon size="large" />
<Icon fontSize={24} />
<Icon className="w-6 h-6" />

// 之后
<Icon size={24} />

// 颜色属性
// 之前
<Icon className="text-cyan-400" />
<Icon style={{ color: '#00f0ff' }} />

// 之后
<Icon variant="cyan" />
<Icon color="#00f0ff" />
```

### 4. 更新样式

```tsx
// Tailwind 类名映射
className="text-cyan-400" → variant="cyan"
className="text-purple-400" → variant="purple"
className="text-pink-400" → variant="pink"
className="w-6 h-6" → size={24}
className="w-8 h-8" → size={32}
```

## 📊 API 差异

### 尺寸属性对比

| 库 | 尺寸属性 | 示例 |
|---|---------|------|
| Font Awesome | `size` | `<Icon size="2x" />` |
| Lucide | `size` | `<Icon size={24} />` |
| Heroicons | Tailwind 类 | `<Icon className="w-6 h-6" />` |
| Material | `fontSize` | `<Icon fontSize="large" />` |
| **CyberPress** | `size` | `<Icon size={24} />` |

### 颜色属性对比

| 库 | 颜色属性 | 示例 |
|---|---------|------|
| Font Awesome | `className` | `<Icon className="text-cyan-400" />` |
| Lucide | `className` | `<Icon className="text-cyan-400" />` |
| Heroicons | `className` | `<Icon className="text-cyan-400" />` |
| Material | `style` | `<Icon style={{ color: '#00f0ff' }} />` |
| **CyberPress** | `variant` / `color` | `<Icon variant="cyan" />` |

### 特殊属性

```tsx
// CyberPress 独有属性

// 发光效果
<Icon glow />

// 点击事件
<Icon onClick={() => {}} />

// 自定义类名
<Icon className="custom-class" />

// 动画效果
<Logo animated />
```

## 🛠️ 迁移脚本

### 批量查找和替换

```bash
# 查找所有旧的图标导入
grep -r "from 'old-library'" src/

# 使用 sed 批量替换（需要先备份）
find src/ -type f -name "*.tsx" -exec sed -i 's/old-library/@\/components\/graphics/g' {} +
```

### VS Code 正则表达式替换

```regex
# 查找
import \{([^}]+)\} from ['"]old-library['"]

# 替换
import {$1} from '@/components/graphics'
```

## ⚠️ 常见问题

### 问题 1: 图标不显示

```tsx
// ❌ 错误 - 导入路径错误
import { HomeIcon } from './components/graphics';

// ✅ 正确 - 使用别名
import { HomeIcon } from '@/components/graphics';
```

### 问题 2: TypeScript 类型错误

```tsx
// ❌ 错误 - 类型不匹配
<HomeIcon size="24" />

// ✅ 正确 - 使用数字
<HomeIcon size={24} />

// ✅ 正确 - 使用类型
import type { SVGIconProps } from '@/components/graphics';

const props: SVGIconProps = {
  size: 24,
  variant: 'cyan',
};
```

### 问题 3: 颜色不生效

```tsx
// ❌ 错误 - variant 值错误
<HomeIcon variant="blue" />

// ✅ 正确 - 使用有效的 variant
<HomeIcon variant="cyan" />
<HomeIcon color="#00f0ff" />
```

## 📚 相关资源

- [图标清单](./ICON_LIST.md) - 所有可用图标
- [使用示例](./EXAMPLES.tsx) - 代码示例
- [配色参考](./COLOR_REFERENCE.md) - 颜色规范

## 🔄 更新日志

### v1.0.0 (2026-03-02)
- 初始迁移指南发布
- Font Awesome 迁移路径
- Lucide React 迁移路径
- Heroicons 迁移路径
- Material Icons 迁移路径
