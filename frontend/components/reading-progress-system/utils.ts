/**
 * Reading Progress System Utilities
 */

/**
 * Calculate estimated reading time based on word count
 */
export function calculateReadingTime(
  content: string,
  wordsPerMinute: number = 200
): {
  minutes: number;
  seconds: number;
  formatted: string;
  wordCount: number;
} {
  const words = content.trim().split(/\s+/).length;
  const totalSeconds = Math.ceil((words / wordsPerMinute) * 60);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;

  let formatted = '';
  if (minutes > 0) {
    formatted = seconds > 0 ? `${minutes}m ${seconds}s` : `${minutes}m`;
  } else {
    formatted = `${seconds}s`;
  }

  return {
    minutes,
    seconds,
    formatted,
    wordCount: words,
  };
}

/**
 * Calculate scroll progress percentage
 */
export function calculateScrollProgress(
  scrollTop: number,
  scrollHeight: number,
  clientHeight: number
): number {
  const maxScroll = scrollHeight - clientHeight;
  if (maxScroll <= 0) return 100;
  return Math.min(100, Math.max(0, (scrollTop / maxScroll) * 100));
}

/**
 * Format time duration in human-readable format
 */
export function formatDuration(seconds: number): string {
  if (seconds < 60) {
    return `${seconds}s`;
  }

  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;

  if (minutes < 60) {
    return remainingSeconds > 0 ? `${minutes}m ${remainingSeconds}s` : `${minutes}m`;
  }

  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;

  if (remainingMinutes > 0) {
    return `${hours}h ${remainingMinutes}m`;
  }

  return `${hours}h`;
}

/**
 * Format word count with locale
 */
export function formatWordCount(count: number): string {
  return count.toLocaleString('zh-CN');
}

/**
 * Calculate reading speed (words per minute)
 */
export function calculateReadingSpeed(
  wordCount: number,
  timeSpentSeconds: number
): number {
  if (timeSpentSeconds <= 0) return 0;
  const minutes = timeSpentSeconds / 60;
  return Math.round(wordCount / minutes);
}

/**
 * Get reading speed rating
 */
export function getReadingSpeedRating(wpm: number): {
  level: 'slow' | 'normal' | 'fast' | 'very-fast';
  color: string;
  label: string;
} {
  if (wpm < 150) {
    return {
      level: 'slow',
      color: '#ff6b6b',
      label: '轻松阅读',
    };
  }

  if (wpm < 250) {
    return {
      level: 'normal',
      color: '#4ecdc4',
      label: '正常速度',
    };
  }

  if (wpm < 350) {
    return {
      level: 'fast',
      color: '#45b7d1',
      label: '快速阅读',
    };
  }

  return {
    level: 'very-fast',
    color: '#96c93d',
    label: '极速阅读',
  };
}

/**
 * Generate reading milestones based on content length
 */
export function generateMilestones(wordCount: number): number[] {
  const milestones = [10, 25, 50, 75, 90, 100];

  // Add intermediate milestones for longer content
  if (wordCount > 1000) {
    return [10, 25, 50, 75, 90, 100];
  }

  if (wordCount > 500) {
    return [25, 50, 75, 100];
  }

  return [50, 100];
}

/**
 * Check if user has reached a milestone
 */
export function hasReachedMilestone(
  progress: number,
  milestone: number,
  threshold: number = 2
): boolean {
  return progress >= milestone - threshold && progress <= milestone + threshold;
}

/**
 * Calculate completion percentage considering scroll depth
 */
export function calculateCompletion(
  scrollProgress: number,
  timeSpent: number,
  estimatedTime: number
): number {
  // Weight scroll progress more heavily than time
  const scrollWeight = 0.8;
  const timeWeight = 0.2;

  const timeProgress = Math.min(100, (timeSpent / estimatedTime) * 100);

  return Math.round(
    scrollProgress * scrollWeight + timeProgress * timeWeight
  );
}

/**
 * Get theme colors for progress indicators
 */
export function getThemeColors(theme: 'cyan' | 'purple' | 'pink' | 'green'): {
  primary: string;
  glow: string;
  background: string;
  text: string;
} {
  const themes = {
    cyan: {
      primary: '#00f0ff',
      glow: 'rgba(0, 240, 255, 0.5)',
      background: 'rgba(0, 240, 255, 0.1)',
      text: '#00f0ff',
    },
    purple: {
      primary: '#9d00ff',
      glow: 'rgba(157, 0, 255, 0.5)',
      background: 'rgba(157, 0, 255, 0.1)',
      text: '#9d00ff',
    },
    pink: {
      primary: '#ff0080',
      glow: 'rgba(255, 0, 128, 0.5)',
      background: 'rgba(255, 0, 128, 0.1)',
      text: '#ff0080',
    },
    green: {
      primary: '#00ff88',
      glow: 'rgba(0, 255, 136, 0.5)',
      background: 'rgba(0, 255, 136, 0.1)',
      text: '#00ff88',
    },
  };

  return themes[theme];
}

/**
 * Debounce function
 */
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout | null = null;

  return function executedFunction(...args: Parameters<T>) {
    const later = () => {
      timeout = null;
      func(...args);
    };

    if (timeout) {
      clearTimeout(timeout);
    }

    timeout = setTimeout(later, wait);
  };
}

/**
 * Throttle function
 */
export function throttle<T extends (...args: any[]) => any>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle: boolean;

  return function executedFunction(...args: Parameters<T>) {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
}

/**
 * Save reading progress to localStorage
 */
export function saveReadingProgress(
  articleId: string,
  progress: number,
  timeSpent: number
): void {
  try {
    const key = `reading-progress-${articleId}`;
    const data = {
      progress,
      timeSpent,
      lastUpdated: Date.now(),
    };
    localStorage.setItem(key, JSON.stringify(data));
  } catch (error) {
    console.error('Failed to save reading progress:', error);
  }
}

/**
 * Load reading progress from localStorage
 */
export function loadReadingProgress(
  articleId: string
): { progress: number; timeSpent: number; lastUpdated: number } | null {
  try {
    const key = `reading-progress-${articleId}`;
    const data = localStorage.getItem(key);

    if (data) {
      return JSON.parse(data);
    }

    return null;
  } catch (error) {
    console.error('Failed to load reading progress:', error);
    return null;
  }
}

/**
 * Clear reading progress from localStorage
 */
export function clearReadingProgress(articleId: string): void {
  try {
    const key = `reading-progress-${articleId}`;
    localStorage.removeItem(key);
  } catch (error) {
    console.error('Failed to clear reading progress:', error);
  }
}
