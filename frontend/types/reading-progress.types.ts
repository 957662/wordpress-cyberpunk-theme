/**
 * 阅读进度相关类型定义
 */

export interface ReadingProgressData {
  /** 文章ID */
  articleId: string;
  /** 阅读进度百分比 (0-100) */
  progress: number;
  /** 阅读时长（秒） */
  readingTime: number;
  /** 最后阅读位置（滚动位置） */
  lastPosition: number;
  /** 最后阅读时间 */
  lastReadAt: string;
  /** 是否已完成 */
  isCompleted: boolean;
}

export interface ReadingHistoryItem {
  /** 历史记录ID */
  id: string;
  /** 文章ID */
  articleId: string;
  /** 文章标题 */
  title: string;
  /** 文章链接 */
  slug: string;
  /** 阅读进度百分比 */
  progress: number;
  /** 阅读时长（秒） */
  readingTime: number;
  /** 最后阅读时间 */
  lastReadAt: string;
  /** 是否已完成 */
  isCompleted: boolean;
  /** 文章封面图 */
  coverImage?: string;
}

export interface ReadingStats {
  /** 已读文章总数 */
  totalArticles: number;
  /** 总阅读时长（分钟） */
  totalReadingTime: number;
  /** 本周阅读文章数 */
  weeklyArticles: number;
  /** 本月阅读文章数 */
  monthlyArticles?: number;
  /** 连续阅读天数 */
  readingStreak: number;
  /** 阅读完成率 */
  completionRate: number;
  /** 获得成就数 */
  achievements: number;
  /** 平均阅读时长（分钟/篇） */
  averageReadingTime?: number;
  /** 最喜欢的分类 */
  favoriteCategories?: string[];
  /** 最高效时段 */
  mostProductiveHour?: number;
  /** 阅读目标进度 */
  readingGoalProgress?: {
    daily: GoalProgress;
    weekly: GoalProgress;
    monthly: GoalProgress;
  };
}

export interface GoalProgress {
  /** 当前进度 */
  current: number;
  /** 目标值 */
  target: number;
  /** 是否已达成 */
  achieved: boolean;
}

export interface ReadingGoal {
  /** 目标ID */
  id: string;
  /** 目标类型 */
  type: 'daily' | 'weekly' | 'monthly';
  /** 目标文章数 */
  articleCount: number;
  /** 目标阅读时长（分钟） */
  readingTime: number;
  /** 当前完成数 */
  currentCount: number;
  /** 当前阅读时长（分钟） */
  currentReadingTime: number;
  /** 开始日期 */
  startDate: string;
  /** 结束日期 */
  endDate: string;
  /** 是否已达成 */
  isAchieved: boolean;
}

export interface Achievement {
  /** 成就ID */
  id: string;
  /** 成就标题 */
  title: string;
  /** 成就描述 */
  description: string;
  /** 成就图标类型 */
  icon: 'trophy' | 'star' | 'flame' | 'target' | 'book' | 'clock' | 'zap' | 'medal' | 'crown';
  /** 成就稀有度 */
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  /** 是否已解锁 */
  isUnlocked: boolean;
  /** 解锁时间 */
  unlockedAt?: string;
  /** 进度 (0-100) */
  progress: number;
  /** 成就类型 */
  type: 'reading' | 'streak' | 'time' | 'special';
}

export interface ReadingTimeEstimate {
  /** 字数 */
  wordCount: number;
  /** 预估阅读时长（分钟） */
  readingTime: number;
}

export interface ReadingProgressOptions {
  /** 文章ID */
  articleId: string;
  /** 是否自动追踪 */
  autoTrack?: boolean;
  /** 更新频率（毫秒） */
  updateInterval?: number;
  /** 阅读速度（字/分钟）*/
  wordsPerMinute?: number;
  /** 进度变化回调 */
  onProgressChange?: (progress: number) => void;
  /** 完成回调 */
  onComplete?: () => void;
}

export interface ReadingProgressState {
  /** 当前进度百分比 */
  progress: number;
  /** 阅读时长（秒） */
  readingTime: number;
  /** 最后阅读位置 */
  lastPosition: number;
  /** 是否已完成 */
  isCompleted: boolean;
  /** 是否正在阅读 */
  isReading: boolean;
}

// API 响应类型
export interface ReadingProgressResponse {
  success: boolean;
  data?: ReadingProgressData;
  error?: string;
}

export interface ReadingHistoryResponse {
  success: boolean;
  items?: ReadingHistoryItem[];
  total?: number;
  hasMore?: boolean;
  error?: string;
}

export interface ReadingStatsResponse {
  success: boolean;
  data?: ReadingStats;
  error?: string;
}

// 服务相关类型
export interface ReadingProgressService {
  updateProgress(
    articleId: string,
    progress: number,
    additionalTime?: number,
    lastPosition?: number
  ): void;
  getProgress(articleId: string): ReadingProgressData | undefined;
  deleteProgress(articleId: string): void;
  clearAllProgress(): void;
  addToHistory(item: Omit<ReadingHistoryItem, 'id'>): void;
  getHistory(): ReadingHistoryItem[];
  deleteFromHistory(id: string): void;
  clearHistory(): void;
  getStats(): ReadingStats;
  exportData(): string;
  importData(jsonData: string): boolean;
}
