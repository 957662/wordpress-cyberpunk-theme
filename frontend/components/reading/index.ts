/**
 * Reading Components - 阅读相关组件统一导出
 *
 * 包含以下组件：
 * - ReadingTracker: 阅读进度追踪器
 * - ReadingStatsCard: 阅读统计卡片
 * - ChapterNavigator: 章节导航
 * - ReadingTimeCalculator: 阅读时间计算器
 * - ReadingControlBar: 阅读控制栏
 */

// 核心组件
export { ReadingTracker } from './ReadingTracker';
export type {
  ReadingProgress,
  Section,
  ReadingTrackerProps,
} from './ReadingTracker';

export { ReadingStatsCard } from './ReadingStatsCard';
export type {
  ReadingStats,
  Achievement,
  ReadingStatsCardProps,
} from './ReadingStatsCard';

export { ChapterNavigator } from './ChapterNavigator';
export type {
  Chapter,
  ChapterNavigatorProps,
} from './ChapterNavigator';

export { ReadingTimeCalculator, calculateReadingTime } from './ReadingTimeCalculator';
export type {
  ReadingTimeOptions,
  ReadingTimeResult,
  ReadingTimeCalculatorProps,
} from './ReadingTimeCalculator';

export { ReadingControlBar } from './ReadingControlBar';
export type {
  ReadingSettings,
  ReadingControlBarProps,
} from './ReadingControlBar';

// 便捷组合导出
export { default as ReadingTracker } from './ReadingTracker';
export { default as ReadingStatsCard } from './ReadingStatsCard';
export { default as ChapterNavigator } from './ChapterNavigator';
export { default as ReadingTimeCalculator } from './ReadingTimeCalculator';
export { default as ReadingControlBar } from './ReadingControlBar';
