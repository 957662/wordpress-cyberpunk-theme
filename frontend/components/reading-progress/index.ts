/**
 * 阅读进度追踪组件
 *
 * 提供文章阅读进度追踪、阅读时间估算、阅读统计等功能
 *
 * @example
 * ```tsx
 * import {
 *   ReadingProgressBar,
 *   ReadingTimeEstimator,
 *   ReadingStatsCard,
 *   ReadingHistory,
 *   ReadingGoalSetting,
 *   ReadingAchievement,
 *   useReadingProgress
 * } from '@/components/reading-progress';
 * ```
 */

// 核心组件
export { ReadingProgressBar } from './ReadingProgressBar';
export { ReadingTimeEstimator, useReadingTime } from './ReadingTimeEstimator';
export { ReadingStatsCard } from './ReadingStatsCard';
export { ReadingHistory } from './ReadingHistory';
export { ReadingProgressRing } from './ReadingProgressRing';

// 高级组件
export { ReadingGoalSetting, ReadingGoalList } from './ReadingGoalSetting';
export { ReadingAchievement, AchievementStats } from './ReadingAchievement';

// Hooks
export {
  useReadingProgress,
  useReadingTimeEstimate,
  useReadingHistory,
  useReadingStats,
} from './useReadingProgress';

// 服务
export {
  ReadingProgressService,
  readingProgressService,
  updateReadingProgress,
  getReadingProgress,
  getReadingHistory,
  getReadingStats,
} from './ReadingProgressService';

// 类型
export type {
  ReadingProgressData,
  ReadingHistoryItem,
  ReadingStats,
  ReadingGoal,
  Achievement,
  ReadingTimeEstimate,
  ReadingProgressOptions,
  ReadingProgressState,
} from '@/types/reading-progress.types';
