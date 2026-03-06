/**
 * Reading Progress System - Complete Export
 *
 * A comprehensive reading progress tracking system for Next.js applications
 */

// Main Components
export {
  ReadingProgressSystem,
  CompactReadingProgress,
  FloatingReadingProgress,
  DetailedReadingStats,
} from './ReadingProgressSystem';

// Hooks
export {
  useReadingProgress,
  useReadingTime,
  useScrollDepth,
} from './useReadingProgress';

// Utilities
export {
  calculateReadingTime,
  calculateScrollProgress,
  formatDuration,
  formatWordCount,
  calculateReadingSpeed,
  getReadingSpeedRating,
  generateMilestones,
  hasReachedMilestone,
  calculateCompletion,
  getThemeColors,
  debounce,
  throttle,
  saveReadingProgress,
  loadReadingProgress,
  clearReadingProgress,
} from './utils';

// Types
export type {
  ReadingTheme,
  ReadingPosition,
  ReadingStats,
  ReadingProgressData,
  ReadingTimeData,
  ScrollDepthData,
  ReadingMilestone,
  ReadingSession,
  ReadingHistory,
  ReadingProgressStorage,
  ThemeColors,
  ReadingTimeCalculation,
  ReadingSpeedRating,
  ReadingProgressOptions,
  UseReadingProgressOptions,
  UseReadingTimeOptions,
  UseScrollDepthOptions,
} from './types';
