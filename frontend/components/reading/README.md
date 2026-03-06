# 阅读进度追踪系统 - 完整指南

## 📖 概述

这是一套功能完整的阅读体验增强系统，包含5个核心组件：

1. **ReadingTracker** - 实时阅读进度追踪
2. **ReadingStatsCard** - 阅读数据统计展示
3. **ChapterNavigator** - 章节快速导航
4. **ReadingTimeCalculator** - 智能阅读时间估算
5. **ReadingControlBar** - 阅读个性化设置

## ✨ 特性

- 🎯 **实时追踪** - 精确检测阅读位置和进度
- 📊 **数据统计** - 完整的阅读数据分析和可视化
- 🧭 **章节导航** - 快速跳转到文章任意章节
- ⏱️ **智能估算** - 考虑代码、图片的准确时间估算
- 🎨 **个性化** - 字体、主题、布局等多种定制选项
- 📱 **响应式** - 完美适配各种设备尺寸
- ⚡ **高性能** - 优化的滚动检测和渲染
- 🔧 **TypeScript** - 完整的类型定义

## 📦 安装

组件已集成到项目中，位于 `@/components/reading`。

```bash
# 无需额外安装，依赖项已在项目中
npm install framer-motion lucide-react clsx
```

## 🚀 快速开始

### 基础用法

```tsx
import {
  ReadingTracker,
  ReadingStatsCard,
  ChapterNavigator
} from '@/components/reading';

export default function ArticlePage() {
  return (
    <div>
      {/* 顶部进度条 */}
      <ReadingTracker contentRef={contentRef} />

      {/* 章节导航 */}
      <ChapterNavigator chapters={chapters} />

      {/* 文章内容 */}
      <article ref={contentRef}>
        {/* 内容 */}
      </article>
    </div>
  );
}
```

## 📚 组件文档

### 1. ReadingTracker - 阅读进度追踪器

实时追踪用户的阅读进度，支持多种展示模式。

#### Props

```typescript
interface ReadingTrackerProps {
  contentRef?: React.RefObject<HTMLElement>;  // 内容区域引用
  sections?: string[];                          // 章节标题列表
  totalWords?: number;                          // 总字数
  averageReadingSpeed?: number;                 // 平均阅读速度
  showPosition?: 'top' | 'bottom' | 'both';     // 显示位置
  variant?: 'linear' | 'circular' | 'minimal';  // 显示样式
  className?: string;
}
```

#### 使用示例

```tsx
const contentRef = useRef<HTMLDivElement>(null);

<ReadingTracker
  contentRef={contentRef}
  sections={['引言', '正文', '结论']}
  totalWords={1500}
  showPosition="top"
  variant="linear"
/>
```

#### 进度数据

组件内部计算的进度数据：

```typescript
interface ReadingProgress {
  percentage: number;              // 百分比 (0-100)
  currentSection: number;          // 当前章节索引
  totalSections: number;           // 总章节数
  timeSpent: number;              // 已用时间(分钟)
  estimatedTimeRemaining: number; // 预计剩余时间
  wordsRead: number;              // 已读字数
  totalWords: number;             // 总字数
}
```

---

### 2. ReadingStatsCard - 阅读统计卡片

展示用户的阅读统计数据和成就。

#### Props

```typescript
interface ReadingStatsCardProps {
  stats: ReadingStats;              // 统计数据
  variant?: 'compact' | 'detailed' | 'minimal';  // 显示模式
  showAchievements?: boolean;       // 显示成就
  showTrends?: boolean;            // 显示趋势
  className?: string;
}
```

#### 数据结构

```typescript
interface ReadingStats {
  totalArticles: number;           // 阅读文章数
  totalWords: number;              // 总阅读字数
  totalReadingTime: number;        // 总阅读时长(分钟)
  currentStreak: number;           // 当前连续天数
  longestStreak: number;           // 最长连续天数
  averageReadingSpeed: number;     // 平均阅读速度
  completionRate: number;          // 完成率百分比
  thisWeekReading: number;         // 本周阅读字数
  thisMonthReading: number;        // 本月阅读字数
  favoriteCategories: string[];    // 常读分类
  recentAchievements: Achievement[]; // 最近成就
}
```

#### 使用示例

```tsx
const stats: ReadingStats = {
  totalArticles: 42,
  totalWords: 125000,
  totalReadingTime: 680,
  currentStreak: 7,
  longestStreak: 14,
  averageReadingSpeed: 245,
  completionRate: 85,
  thisWeekReading: 8500,
  thisMonthReading: 32000,
  favoriteCategories: ['技术', '编程'],
  recentAchievements: [],
};

<ReadingStatsCard
  stats={stats}
  variant="detailed"
  showAchievements
/>
```

---

### 3. ChapterNavigator - 章节导航器

提供文章章节的快速导航和进度展示。

#### Props

```typescript
interface ChapterNavigatorProps {
  chapters: Chapter[];                      // 章节数据
  currentChapterId?: string;               // 当前章节ID
  onChapterChange?: (chapterId: string) => void;  // 切换回调
  position?: 'sidebar' | 'floating' | 'inline';  // 布局位置
  variant?: 'full' | 'minimal' | 'compact';      // 显示模式
  showProgress?: boolean;                  // 显示进度
  showTime?: boolean;                     // 显示时间
  className?: string;
}
```

#### 数据结构

```typescript
interface Chapter {
  id: string;              // 唯一标识
  title: string;           // 章节标题
  slug: string;            // URL slug
  estimatedTime: number;   // 预计阅读时间(分钟)
  wordCount: number;       // 字数
  completed: boolean;      // 是否已完成
  current?: boolean;       // 是否当前章节
}
```

#### 使用示例

```tsx
const chapters: Chapter[] = [
  {
    id: 'intro',
    title: '引言',
    slug: 'introduction',
    estimatedTime: 2,
    wordCount: 150,
    completed: true,
  },
  // ... 更多章节
];

<ChapterNavigator
  chapters={chapters}
  currentChapterId="intro"
  onChapterChange={(id) => console.log(id)}
  position="sidebar"
  variant="full"
/>
```

---

### 4. ReadingTimeCalculator - 阅读时间计算器

根据文章内容精确估算阅读时间。

#### Props

```typescript
interface ReadingTimeCalculatorProps {
  content: string;                // HTML内容
  options?: ReadingTimeOptions;   // 计算选项
  variant?: 'badge' | 'detailed' | 'compact';  // 显示模式
  showBreakdown?: boolean;        // 显示时间分解
  showDifficulty?: boolean;       // 显示难度评级
  className?: string;
}
```

#### 计算选项

```typescript
interface ReadingTimeOptions {
  wordsPerMinute?: number;           // 默认阅读速度 (默认200)
  imagesPerMinute?: number;          // 查看图片速度 (默认1)
  codeReadingMultiplier?: number;    // 代码阅读系数 (默认2.5)
  technicalContentMultiplier?: number; // 技术内容系数 (默认1.5)
}
```

#### 使用示例

```tsx
<ReadingTimeCalculator
  content={articleContent}
  variant="detailed"
  showBreakdown
  showDifficulty
  options={{
    wordsPerMinute: 200,
    codeReadingMultiplier: 2.5,
  }}
/>
```

#### 辅助函数

```typescript
// 服务端计算阅读时间
import { calculateReadingTime } from '@/components/reading';

const result = calculateReadingTime(content);
// { totalMinutes, formattedTime, wordCount, ... }
```

---

### 5. ReadingControlBar - 阅读控制栏

提供阅读体验的各种控制选项。

#### Props

```typescript
interface ReadingControlBarProps {
  settings?: ReadingSettings;                  // 当前设置
  onSettingsChange?: (settings: ReadingSettings) => void;
  onBookmark?: () => void;                     // 收藏回调
  onShare?: () => void;                        // 分享回调
  onPrint?: () => void;                        // 打印回调
  onToggleSpeech?: () => void;                 // 朗读回调
  isSpeaking?: boolean;                        // 是否正在朗读
  isBookmarked?: boolean;                      // 是否已收藏
  position?: 'bottom' | 'top';                 // 显示位置
  className?: string;
}
```

#### 阅读设置

```typescript
interface ReadingSettings {
  fontSize: number;           // 字体大小 (14-24)
  lineHeight: number;         // 行高 (1.4-2.0)
  textAlign: 'left' | 'center' | 'justify';
  theme: 'light' | 'dark' | 'sepia' | 'cyber';
  fontFamily: 'sans' | 'serif' | 'mono';
  width: 'narrow' | 'medium' | 'wide';
}
```

#### 使用示例

```tsx
const [settings, setSettings] = useState<ReadingSettings>({
  fontSize: 16,
  lineHeight: 1.6,
  textAlign: 'left',
  theme: 'cyber',
  fontFamily: 'sans',
  width: 'medium',
});

<ReadingControlBar
  settings={settings}
  onSettingsChange={setSettings}
  onBookmark={() => handleBookmark()}
  onToggleSpeech={() => handleSpeech()}
  isSpeaking={isSpeaking}
  position="bottom"
/>
```

---

## 🎨 主题定制

组件支持赛博朋克风格主题，可通过 Tailwind CSS 类名定制：

```css
/* 自定义颜色 */
--cyber-dark: #0a0a0f;
--cyber-cyan: #00f0ff;
--cyber-purple: #9d00ff;
--cyber-pink: #ff0080;
--cyber-green: #00ff88;
--cyber-yellow: #f0ff00;
```

---

## 🔧 高级用法

### 完整集成示例

```tsx
'use client';

import { useRef, useState } from 'react';
import {
  ReadingTracker,
  ReadingStatsCard,
  ChapterNavigator,
  ReadingTimeCalculator,
  ReadingControlBar,
  type Chapter,
  type ReadingSettings,
} from '@/components/reading';

export default function ArticlePage() {
  const contentRef = useRef<HTMLDivElement>(null);
  const [settings, setSettings] = useState<ReadingSettings>({
    fontSize: 16,
    lineHeight: 1.6,
    textAlign: 'left',
    theme: 'cyber',
    fontFamily: 'sans',
    width: 'medium',
  });

  const chapters: Chapter[] = [
    { id: '1', title: '第一章', slug: 'ch1', estimatedTime: 5, wordCount: 500, completed: false },
    { id: '2', title: '第二章', slug: 'ch2', estimatedTime: 5, wordCount: 500, completed: false },
  ];

  return (
    <div className="min-h-screen bg-cyber-dark">
      {/* 进度追踪 */}
      <ReadingTracker contentRef={contentRef} sections={chapters.map(c => c.title)} />

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-4 gap-8">
          {/* 侧边导航 */}
          <aside className="lg:col-span-1">
            <ChapterNavigator
              chapters={chapters}
              position="sidebar"
              variant="full"
            />
          </aside>

          {/* 主内容 */}
          <main className="lg:col-span-3">
            <article ref={contentRef} style={{ fontSize: `${settings.fontSize}px` }}>
              {/* 文章内容 */}
            </article>
          </main>
        </div>
      </div>

      {/* 底部控制栏 */}
      <ReadingControlBar
        settings={settings}
        onSettingsChange={setSettings}
        position="bottom"
      />
    </div>
  );
}
```

### 性能优化建议

1. **节流滚动事件** - 组件已内置节流，默认100ms
2. **使用Intersection Observer** - 比滚动监听更高效
3. **代码分割** - 按需加载组件
4. **SSR兼容** - 使用 `'use client'` 标记客户端组件

---

## 📱 响应式设计

组件完全响应式，支持：

- 📱 手机端 (< 768px)
- 📱 平板端 (768px - 1024px)
- 💻 桌面端 (> 1024px)

不同尺寸下自动调整布局和交互方式。

---

## 🧪 测试

```bash
# 运行单元测试
npm test

# 运行集成测试
npm run test:integration

# 运行E2E测试
npm run test:e2e
```

---

## 📄 License

MIT License

---

## 🤝 贡献

欢迎提交 Issue 和 Pull Request！

---

## 📞 支持

有问题？查看 `/reading-demo` 页面的完整示例。
