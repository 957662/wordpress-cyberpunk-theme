/**
 * Reading Progress System Type Definitions
 */

export type ReadingTheme = 'cyan' | 'purple' | 'pink' | 'green';

export type ReadingPosition = 'top' | 'bottom' | 'floating';

export interface ReadingStats {
  estimatedTime: number;
  actualTime: number;
  progress: number;
  isComplete: boolean;
  wordsRead: number;
  totalWords: number;
}

export interface ReadingProgressData {
  progress: number;
  isReading: boolean;
  timeSpent: number;
  wordsRead: number;
  scrollDepth: number;
}

export interface ReadingTimeData {
  estimated: number;
  actual: number;
  words: number;
}

export interface ScrollDepthData {
  reachedDepth: number[];
  maxDepth: number;
}

export interface ReadingMilestone {
  percentage: number;
  reached: boolean;
  timestamp: number;
}

export interface ReadingSession {
  articleId: string;
  startTime: number;
  endTime?: number;
  progress: number;
  timeSpent: number;
  completed: boolean;
  milestones: ReadingMilestone[];
}

export interface ReadingHistory {
  sessions: ReadingSession[];
  totalArticles: number;
  totalReadingTime: number;
  averageReadingSpeed: number;
  completedArticles: number;
}

export interface ReadingProgressStorage {
  progress: number;
  timeSpent: number;
  lastUpdated: number;
}

export interface ThemeColors {
  primary: string;
  glow: string;
  background: string;
  text: string;
}

export interface ReadingTimeCalculation {
  minutes: number;
  seconds: number;
  formatted: string;
  wordCount: number;
}

export interface ReadingSpeedRating {
  level: 'slow' | 'normal' | 'fast' | 'very-fast';
  color: string;
  label: string;
}

export interface ReadingProgressOptions {
  showStats?: boolean;
  showProgress?: boolean;
  showTime?: boolean;
  position?: ReadingPosition;
  theme?: ReadingTheme;
  autoSave?: boolean;
  articleId?: string;
  milestones?: number[];
  onMilestoneReached?: (milestone: number) => void;
  onComplete?: () => void;
}

export interface UseReadingProgressOptions {
  containerRef?: React.RefObject<HTMLElement>;
  threshold?: number;
  debounceMs?: number;
}

export interface UseReadingTimeOptions {
  wordsPerMinute?: number;
  content?: string;
}

export interface UseScrollDepthOptions {
  depthMarkers?: number[];
  containerRef?: React.RefObject<HTMLElement>;
  onDepthReached?: (depth: number) => void;
}
