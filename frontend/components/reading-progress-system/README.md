# 阅读进度追踪系统

一个功能强大、高性能的阅读进度追踪系统，专为 Next.js 应用程序设计。

## ✨ 特性

- 🎯 **实时进度追踪** - 精确追踪用户的阅读进度
- ⏱️ **智能时间估算** - 基于字数自动计算阅读时间
- 🎨 **多种主题** - 内置 4 种赛博朋克风格主题
- 📱 **响应式设计** - 完美适配所有设备
- 💾 **本地存储** - 自动保存阅读进度
- 🚀 **高性能** - 使用节流和防抖优化性能
- 🎭 **动画效果** - Framer Motion 驱动的流畅动画
- 📊 **详细统计** - 提供完整的阅读数据分析

## 📦 安装

确保已安装以下依赖：

```bash
npm install framer-motion lucide-react clsx
```

## 🚀 快速开始

### 基础用法

```tsx
import { ReadingProgressSystem } from '@/components/reading-progress-system';

export default function BlogPost({ content }) {
  return (
    <div>
      <ReadingProgressSystem content={content} />
      <article>{content}</article>
    </div>
  );
}
```

### 预设组件

系统提供了三个预设组件，满足不同场景的需求：

#### 1. 简洁模式 - 顶部进度条

```tsx
import { CompactReadingProgress } from '@/components/reading-progress-system';

<CompactReadingProgress content={content} />
```

只显示进度条，适合极简风格。

#### 2. 浮动模式 - 右下角浮动

```tsx
import { FloatingReadingProgress } from '@/components/reading-progress-system';

<FloatingReadingProgress content={content} />
```

浮动在页面右下角，不占用布局空间。

#### 3. 详细模式 - 完整统计

```tsx
import { DetailedReadingStats } from '@/components/reading-progress-system';

<DetailedReadingStats content={content} />
```

显示完整的阅读统计信息，包括阅读时间、字数、进度等。

## ⚙️ 配置选项

### ReadingProgressSystem Props

| 属性 | 类型 | 默认值 | 描述 |
|------|------|--------|------|
| `content` | `string` | *必需* | 文章内容，用于计算字数和阅读时间 |
| `showStats` | `boolean` | `true` | 显示统计信息 |
| `showProgress` | `boolean` | `true` | 显示进度条 |
| `showTime` | `boolean` | `true` | 显示阅读时间 |
| `position` | `'top' \| 'bottom' \| 'floating'` | `'top'` | 组件显示位置 |
| `theme` | `'cyan' \| 'purple' \| 'pink' \| 'green'` | `'cyan'` | 主题颜色 |
| `className` | `string` | `undefined` | 自定义类名 |

### 主题颜色

系统内置了 4 种赛博朋克风格主题：

- **cyan** (#00f0ff) - 霓虹青
- **purple** (#9d00ff) - 赛博紫
- **pink** (#ff0080) - 激光粉
- **green** (#00ff88) - 赛博绿

## 🪝 自定义 Hooks

### useReadingProgress

追踪阅读进度和滚动深度。

```tsx
import { useReadingProgress } from '@/components/reading-progress-system';

function MyComponent() {
  const progress = useReadingProgress({
    threshold: 0.1,    // 10% 阈值
    debounceMs: 100,   // 100ms 防抖
  });

  return (
    <div>
      <p>进度: {progress.progress}%</p>
      <p>是否正在阅读: {progress.isReading ? '是' : '否'}</p>
      <p>阅读时长: {progress.timeSpent}秒</p>
    </div>
  );
}
```

### useReadingTime

计算阅读时间。

```tsx
import { useReadingTime } from '@/components/reading-progress-system';

function MyComponent() {
  const readingTime = useReadingTime({
    wordsPerMinute: 200,  // 每分钟阅读字数
    content: 'your content here',
  });

  return (
    <div>
      <p>预计阅读时间: {readingTime.estimated}分钟</p>
      <p>实际阅读时间: {readingTime.actual}分钟</p>
      <p>字数: {readingTime.words}</p>
    </div>
  );
}
```

### useScrollDepth

追踪滚动深度。

```tsx
import { useScrollDepth } from '@/components/reading-progress-system';

function MyComponent() {
  const { reachedDepth, maxDepth } = useScrollDepth({
    depthMarkers: [25, 50, 75, 90, 100],
    onDepthReached: (depth) => {
      console.log(`Reached ${depth}% depth`);
    },
  });

  return (
    <div>
      <p>最大深度: {maxDepth}%</p>
      <p>已到达深度: {reachedDepth.join(', ')}%</p>
    </div>
  );
}
```

## 🛠️ 工具函数

### calculateReadingTime

计算预计阅读时间。

```tsx
import { calculateReadingTime } from '@/components/reading-progress-system';

const result = calculateReadingTime('Your content here', 200);

console.log(result);
// {
//   minutes: 5,
//   seconds: 30,
//   formatted: "5m 30s",
//   wordCount: 1100
// }
```

### formatDuration

格式化时间持续时间。

```tsx
import { formatDuration } from '@/components/reading-progress-system';

formatDuration(45);    // "45s"
formatDuration(90);    // "1m 30s"
formatDuration(3600);  // "1h"
```

### calculateReadingSpeed

计算阅读速度（字/分钟）。

```tsx
import { calculateReadingSpeed } from '@/components/reading-progress-system';

const wpm = calculateReadingSpeed(1000, 300); // 200 字/分钟
```

### 本地存储

保存和加载阅读进度：

```tsx
import {
  saveReadingProgress,
  loadReadingProgress,
  clearReadingProgress
} from '@/components/reading-progress-system';

// 保存进度
saveReadingProgress('article-123', 75, 300);

// 加载进度
const progress = loadReadingProgress('article-123');
// { progress: 75, timeSpent: 300, lastUpdated: 1646880000000 }

// 清除进度
clearReadingProgress('article-123');
```

## 📝 完整示例

```tsx
'use client';

import { useState } from 'react';
import {
  ReadingProgressSystem,
  useReadingProgress,
  useReadingTime,
} from '@/components/reading-progress-system';

export default function BlogPost({ post }) {
  const [theme, setTheme] = useState<'cyan' | 'purple'>('cyan');
  const progress = useReadingProgress();
  const readingTime = useReadingTime({ content: post.content });

  return (
    <div className="min-h-screen bg-black text-white">
      {/* 进度追踪器 */}
      <ReadingProgressSystem
        content={post.content}
        theme={theme}
        position="top"
        showStats
        showProgress
        showTime
      />

      {/* 文章内容 */}
      <article className="max-w-4xl mx-auto py-8">
        <h1 className="text-4xl font-bold mb-4">{post.title}</h1>

        <div className="flex gap-4 mb-8 text-sm text-gray-400">
          <span>⏱️ {readingTime.estimated}分钟阅读</span>
          <span>📊 {progress.progress}% 完成</span>
          <span>⏰ {Math.floor(progress.timeSpent / 60)}分钟</span>
        </div>

        <div className="prose prose-invert">
          {post.content}
        </div>
      </article>
    </div>
  );
}
```

## 🎨 样式自定义

系统使用 Tailwind CSS，可以通过 `className` 属性自定义样式：

```tsx
<ReadingProgressSystem
  content={content}
  className="custom-reading-progress"
/>
```

然后在你的 CSS 文件中：

```css
.custom-reading-progress {
  /* 你的自定义样式 */
}
```

## 📊 性能优化

系统内置了多项性能优化：

1. **防抖处理** - 滚动事件使用 100ms 防抖
2. **节流处理** - 可选的节流函数
3. **被动监听** - 使用 `{ passive: true }` 优化滚动监听
4. **本地存储缓存** - 减少重复计算

## 🔧 高级用法

### 自定义主题

```tsx
import { getThemeColors } from '@/components/reading-progress-system';

const customTheme = getThemeColors('cyan');
// {
//   primary: '#00f0ff',
//   glow: 'rgba(0, 240, 255, 0.5)',
//   background: 'rgba(0, 240, 255, 0.1)',
//   text: '#00f0ff'
// }
```

### 阅读里程碑

```tsx
import { generateMilestones } from '@/components/reading-progress-system';

const milestones = generateMilestones(2000);
// [10, 25, 50, 75, 90, 100]
```

### 阅读速度评级

```tsx
import { getReadingSpeedRating } from '@/components/reading-progress-system';

const rating = getReadingSpeedRating(250);
// {
//   level: 'normal',
//   color: '#4ecdc4',
//   label: '正常速度'
// }
```

## 🐛 故障排查

### 进度不更新

确保包裹内容元素有正确的高度：

```tsx
<div ref={contentRef} style={{ minHeight: '100vh' }}>
  {content}
</div>
```

### 时间计算不准确

调整 `wordsPerMinute` 参数以匹配你的内容类型：

```tsx
<ReadingProgressSystem
  content={content}
  wordsPerMinute={150}  // 技术文档使用较低值
/>
```

### 性能问题

增加防抖时间：

```tsx
useReadingProgress({
  debounceMs: 200,  // 从 100ms 增加到 200ms
});
```

## 📄 许可证

MIT

## 🤝 贡献

欢迎提交 Issue 和 Pull Request！

## 📮 联系方式

- 项目：CyberPress Platform
- 团队：AI Development Team
- 邮箱：2835879683@qq.com
