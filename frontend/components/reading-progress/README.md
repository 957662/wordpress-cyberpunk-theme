# 阅读进度追踪系统

完整的文章阅读进度追踪、统计和管理系统。

## 功能特性

### 📖 核心功能
- **进度追踪**: 实时追踪文章阅读进度
- **时间估算**: 智能估算阅读时间（支持中英文）
- **阅读历史**: 记录和管理阅读历史
- **数据统计**: 完整的阅读统计数据

### 🎯 高级功能
- **目标设置**: 每日/每周/每月阅读目标
- **成就系统**: 多种成就和徽章解锁
- **数据同步**: 本地存储 + 服务器同步
- **导入导出**: 数据备份和恢复

## 安装使用

### 1. 基础组件

#### 阅读进度条
```tsx
import { ReadingProgressBar } from '@/components/reading-progress';

function ArticlePage() {
  return (
    <>
      <ReadingProgressBar
        position="top"
        color="#3b82f6"
        height={4}
        showPercentage
      />
      <article>文章内容...</article>
    </>
  );
}
```

#### 阅读时间估算
```tsx
import { ReadingTimeEstimator } from '@/components/reading-progress';

function ArticleHeader({ content }) {
  return (
    <ReadingTimeEstimator
      content={content}
      wordsPerMinute={200}
      showIcon
      label="预计阅读时间"
    />
  );
}
```

#### 阅读统计卡片
```tsx
import { ReadingStatsCard } from '@/components/reading-progress';

function Dashboard() {
  const stats = {
    totalArticles: 156,
    totalReadingTime: 2450,
    weeklyArticles: 12,
    readingStreak: 7,
    completionRate: 85,
    achievements: 23,
  };

  return (
    <ReadingStatsCard
      stats={stats}
      variant="detailed"
      onClick={() => console.log('查看详情')}
    />
  );
}
```

### 2. 高级组件

#### 阅读目标设置
```tsx
import { ReadingGoalSetting } from '@/components/reading-progress';

function GoalSettings() {
  const goal = {
    id: '1',
    type: 'daily',
    articleCount: 5,
    readingTime: 60,
    currentCount: 3,
    currentReadingTime: 45,
    startDate: '2024-03-06',
    endDate: '2024-03-06',
    isAchieved: false,
  };

  return (
    <ReadingGoalSetting
      goal={goal}
      onUpdate={(newGoal) => console.log('更新目标:', newGoal)}
      onDelete={(id) => console.log('删除目标:', id)}
    />
  );
}
```

#### 成就系统
```tsx
import { ReadingAchievement } from '@/components/reading-progress';

function AchievementsPage() {
  const achievements = [
    {
      id: '1',
      title: '初出茅庐',
      description: '完成第一篇文章阅读',
      icon: 'book',
      rarity: 'common',
      isUnlocked: true,
      progress: 100,
      type: 'reading',
    },
    // ... 更多成就
  ];

  return (
    <ReadingAchievement
      achievements={achievements}
      viewMode="grid"
      onAchievementClick={(achievement) => console.log('点击成就:', achievement)}
    />
  );
}
```

### 3. Hooks

#### useReadingProgress
```tsx
import { useReadingProgress } from '@/components/reading-progress';

function ArticlePage({ article }) {
  const {
    progress,
    isCompleted,
    isReading,
    markAsRead,
    resetProgress,
    scrollToLastPosition,
  } = useReadingProgress({
    articleId: article.id,
    autoTrack: true,
    onProgressChange: (p) => console.log('进度:', p),
    onComplete: () => console.log('阅读完成！'),
  });

  return (
    <div>
      <div>进度: {progress.toFixed(1)}%</div>
      {isCompleted && <div>✅ 已完成</div>}
      <button onClick={markAsRead}>标记为已读</button>
    </div>
  );
}
```

#### useReadingTimeEstimate
```tsx
import { useReadingTimeEstimate } from '@/components/reading-progress';

function ArticleMeta({ content }) {
  const { wordCount, readingTime } = useReadingTimeEstimate(content);

  return (
    <div>
      <span>{wordCount} 字</span>
      <span>约 {readingTime} 分钟</span>
    </div>
  );
}
```

#### useReadingHistory
```tsx
import { useReadingHistory } from '@/components/reading-progress';

function HistoryPage() {
  const { history, addToHistory, removeFromHistory, clearHistory } = useReadingHistory();

  return (
    <div>
      {history.map(item => (
        <div key={item.id}>
          <h3>{item.title}</h3>
          <p>进度: {item.progress}%</p>
        </div>
      ))}
    </div>
  );
}
```

#### useReadingStats
```tsx
import { useReadingStats } from '@/components/reading-progress';

function StatsDashboard() {
  const { stats, refreshStats } = useReadingStats();

  return (
    <div>
      <div>总文章: {stats.totalArticles}</div>
      <div>阅读时长: {stats.totalReadingTime} 分钟</div>
      <button onClick={refreshStats}>刷新统计</button>
    </div>
  );
}
```

### 4. 服务

#### ReadingProgressService
```tsx
import { readingProgressService } from '@/components/reading-progress';

// 更新进度
readingProgressService.updateProgress('article-1', 75, 300, 1200);

// 获取进度
const progress = readingProgressService.getProgress('article-1');

// 添加到历史
readingProgressService.addToHistory({
  articleId: 'article-1',
  title: '文章标题',
  slug: 'article-slug',
  progress: 75,
  readingTime: 300,
  lastReadAt: new Date().toISOString(),
  isCompleted: false,
});

// 获取统计
const stats = readingProgressService.getStats();

// 导出数据
const jsonData = readingProgressService.exportData();

// 导入数据
readingProgressService.importData(jsonData);
```

## API 路由

### GET /api/reading-progress
获取阅读进度

```tsx
const response = await fetch('/api/reading-progress?articleId=123');
const data = await response.json();
```

### POST /api/reading-progress
更新阅读进度

```tsx
await fetch('/api/reading-progress', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    articleId: '123',
    progress: 75,
    readingTime: 300,
    lastPosition: 1200,
    isCompleted: false,
  }),
});
```

### GET /api/reading-history
获取阅读历史

```tsx
const response = await fetch('/api/reading-history?limit=20&offset=0&filter=all');
const data = await response.json();
```

### GET /api/reading-stats
获取阅读统计

```tsx
const response = await fetch('/api/reading-stats');
const stats = await response.json();
```

## 类型定义

所有类型都导出自 `@/types/reading-progress.types`：

```tsx
import type {
  ReadingProgressData,
  ReadingHistoryItem,
  ReadingStats,
  ReadingGoal,
  Achievement,
} from '@/types/reading-progress.types';
```

## 演示页面

查看完整功能演示：
```
/reading-progress-demo
```

## 配置选项

### ReadingProgressBar
| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| position | 'top' \| 'bottom' | 'top' | 进度条位置 |
| color | string | '#3b82f6' | 进度条颜色 |
| height | number | 4 | 进度条高度（px） |
| showPercentage | boolean | false | 显示百分比 |
| targetSelector | string | 'main' | 目标元素选择器 |

### ReadingTimeEstimator
| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| content | string | - | 文章内容 |
| wordsPerMinute | number | 200 | 阅读速度（字/分钟） |
| showIcon | boolean | true | 显示图标 |
| label | string | '阅读时间' | 标签文本 |

### ReadingStatsCard
| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| stats | ReadingStats | - | 统计数据 |
| variant | 'default' \| 'compact' \| 'detailed' | 'default' | 卡片样式 |
| onClick | function | - | 点击回调 |

## 浏览器支持

- Chrome/Edge >= 90
- Firefox >= 88
- Safari >= 14
- Opera >= 76

## 依赖项

- react >= 18.2.0
- framer-motion >= 11.0.0
- lucide-react >= 0.363.0

## 开发

```bash
# 安装依赖
npm install

# 运行开发服务器
npm run dev

# 运行测试
npm test

# 构建生产版本
npm run build
```

## 许可证

MIT
