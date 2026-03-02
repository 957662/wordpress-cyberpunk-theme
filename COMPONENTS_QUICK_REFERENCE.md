# 组件快速参考清单

## 🎤 语音组件 (/components/voice/)

| 组件 | 功能 | 导入 |
|------|------|------|
| VoiceInput | 语音输入识别 | `import { VoiceInput } from '@/components/voice'` |
| VoiceCommands | 语音命令控制 | `import { VoiceCommands } from '@/components/voice'` |
| useCommonVoiceCommands | 预定义命令 Hook | `import { useCommonVoiceCommands } from '@/components/voice'` |

---

## 👥 协作组件 (/components/collaborative/)

| 组件 | 功能 | 导入 |
|------|------|------|
| CursorTracker | 实时光标跟踪 | `import { CursorTracker } from '@/components/collaborative'` |
| MockCursorTracker | 模拟光标演示 | `import { MockCursorTracker } from '@/components/collaborative'` |
| PresenceIndicator | 用户状态指示器 | `import { PresenceIndicator } from '@/components/collaborative'` |

---

## 🔍 搜索组件 (/components/search/)

| 组件 | 功能 | 导入 |
|------|------|------|
| SearchHighlight | 内容搜索高亮 | `import { SearchHighlight } from '@/components/search'` |
| TextSearch | 文本列表搜索 | `import { TextSearch } from '@/components/search'` |
| RealTimeSearch | 实时搜索 | `import { RealTimeSearch } from '@/components/search'` |
| SearchBar | 搜索栏 | `import { SearchBar } from '@/components/search'` |
| SearchDialog | 搜索对话框 | `import { SearchDialog } from '@/components/search'` |
| AdvancedSearch | 高级搜索 | `import { AdvancedSearch } from '@/components/search'` |

---

## 📝 编辑器组件 (/components/editor/)

| 组件 | 功能 | 导入 |
|------|------|------|
| CodeEditor | 代码编辑器 | `import { CodeEditor } from '@/components/editor'` |
| CodeEditorWithPreview | 带预览的编辑器 | `import { CodeEditorWithPreview } from '@/components/editor'` |
| DocumentDiff | 文档对比 | `import { DocumentDiff } from '@/components/editor'` |

---

## 🛠️ 实用工具 (/components/utility/)

| 组件 | 功能 | 导入 |
|------|------|------|
| LazyImage | 懒加载图片 | `import { LazyImage } from '@/components/utility'` |
| BlurImage | 背景模糊图片 | `import { BlurImage } from '@/components/utility'` |
| ProgressiveImage | 渐进式图片 | `import { ProgressiveImage } from '@/components/utility'` |
| Skeleton | 基础骨架屏 | `import { Skeleton } from '@/components/utility'` |
| TextSkeleton | 文本骨架屏 | `import { TextSkeleton } from '@/components/utility'` |
| CardSkeleton | 卡片骨架屏 | `import { CardSkeleton } from '@/components/utility'` |
| ListSkeleton | 列表骨架屏 | `import { ListSkeleton } from '@/components/utility'` |
| TableSkeleton | 表格骨架屏 | `import { TableSkeleton } from '@/components/utility'` |
| ImageCardSkeleton | 图片卡片骨架屏 | `import { ImageCardSkeleton } from '@/components/utility'` |
| CommentSkeleton | 评论骨架屏 | `import { CommentSkeleton } from '@/components/utility'` |
| SkeletonWrapper | 骨架屏包装器 | `import { SkeletonWrapper } from '@/components/utility'` |
| PrintButton | 打印按钮 | `import { PrintButton } from '@/components/utility'` |

---

## ⌨️ 键盘组件 (/components/keyboard/)

| 组件 | 功能 | 导入 |
|------|------|------|
| CommandPalette | 命令面板 | `import { CommandPalette } from '@/components/keyboard'` |
| ShortcutHint | 快捷键提示 | `import { ShortcutHint } from '@/components/keyboard'` |
| ShortcutTooltip | 快捷键工具提示 | `import { ShortcutTooltip } from '@/components/keyboard'` |
| ShortcutBadge | 快捷键徽章 | `import { ShortcutBadge } from '@/components/keyboard'` |

---

## 🔥 其他重要组件

### UI 组件 (/components/ui/)
- Button, Card, Dialog, Input, Select, Tabs, 等

### 布局组件 (/components/layout/)
- Header, Footer, Sidebar, Navigation

### 效果组件 (/components/effects/)
- FlipCard, FloatingCard, HolographicCard, GlowingCard

### 图表组件 (/components/charts/)
- BarChart, PieChart, AreaChart, RadarChart

### 计时器组件 (/components/timer/)
- Timer, Stopwatch, IntervalTimer, SegmentedTimer

### 网络组件 (/components/network/)
- NetworkStatus, SpeedTest

---

## 🎯 使用技巧

### 1. 快速开始
```typescript
// 查看示例页面
// /examples/new-features-showcase
```

### 2. 类型导入
```typescript
import type {
  VoiceInputProps,
  UserPresence,
  CommandItem,
  Shortcut,
} from '@/components';
```

### 3. 批量导入
```typescript
import {
  VoiceInput,
  VoiceCommands,
  CursorTracker,
  SearchHighlight,
  DocumentDiff,
  LazyImage,
  CommandPalette,
} from '@/components';
```

---

## 📊 组件统计

| 类别 | 数量 |
|------|------|
| 语音组件 | 3 |
| 协作组件 | 3 |
| 搜索组件 | 6 |
| 编辑器组件 | 3 |
| 实用工具 | 12 |
| 键盘组件 | 4 |
| **总计** | **31+** |

---

## 🔗 相关文档

- **安装指南**: NEW_COMPONENTS_INSTALLATION.md
- **详细报告**: NEW_COMPONENTS_CREATED_REPORT_2026_03_03.md
- **完成总结**: SESSION_COMPLETE_2026_03_03_NEW_COMPONENTS.md

---

**最后更新**: 2026-03-03
**项目**: CyberPress Platform
