/**
 * 阅读进度追踪 Hook
 *
 * 提供便捷的阅读进度管理功能
 */

'use client';

import { useEffect, useState, useCallback, useRef } from 'react';
import { readingProgressService } from './ReadingProgressService';

export interface UseReadingProgressOptions {
  /** 文章ID */
  articleId: string;
  /** 是否自动追踪进度 */
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

/**
 * 阅读进度追踪 Hook
 *
 * @example
 * ```tsx
 * function ArticlePage({ article }) {
 *   const { progress, isCompleted, markAsRead } = useReadingProgress({
 *     articleId: article.id,
 *     autoTrack: true,
 *     onComplete: () => console.log('文章阅读完成！'),
 *   });
 *
 *   return (
 *     <div>
 *       <ReadingProgressBar progress={progress} />
 *       <ArticleContent content={article.content} />
 *     </div>
 *   );
 * }
 * ```
 */
export const useReadingProgress = (options: UseReadingProgressOptions) => {
  const {
    articleId,
    autoTrack = true,
    updateInterval = 5000,
    wordsPerMinute = 200,
    onProgressChange,
    onComplete,
  } = options;

  const [state, setState] = useState<ReadingProgressState>({
    progress: 0,
    readingTime: 0,
    lastPosition: 0,
    isCompleted: false,
    isReading: false,
  });

  const trackingTimerRef = useRef<NodeJS.Timeout | null>(null);
  const startTimeRef = useRef<number | null>(null);
  const lastPositionRef = useRef<number>(0);

  // 加载已保存的进度
  useEffect(() => {
    const savedProgress = readingProgressService.getProgress(articleId);
    if (savedProgress) {
      setState({
        progress: savedProgress.progress,
        readingTime: savedProgress.readingTime,
        lastPosition: savedProgress.lastPosition,
        isCompleted: savedProgress.isCompleted,
        isReading: false,
      });
      lastPositionRef.current = savedProgress.lastPosition;
    }
  }, [articleId]);

  // 计算阅读进度
  const calculateProgress = useCallback(() => {
    const articleElement = document.querySelector('article') || document.querySelector('main');
    if (!articleElement) return 0;

    const rect = articleElement.getBoundingClientRect();
    const windowHeight = window.innerHeight;
    const documentHeight = document.documentElement.scrollHeight;

    // 计算文章内容区域
    const articleTop = rect.top + window.scrollY;
    const articleHeight = rect.height;
    const articleBottom = articleTop + articleHeight;

    // 当前滚动位置
    const scrollTop = window.scrollY + windowHeight / 2;

    // 计算进度
    let progress = 0;
    if (scrollTop <= articleTop) {
      progress = 0;
    } else if (scrollTop >= articleBottom) {
      progress = 100;
    } else {
      progress = ((scrollTop - articleTop) / articleHeight) * 100;
    }

    return Math.min(100, Math.max(0, progress));
  }, []);

  // 更新进度
  const updateProgress = useCallback(() => {
    const progress = calculateProgress();
    const currentTime = Date.now();
    const additionalTime = startTimeRef.current
      ? Math.floor((currentTime - startTimeRef.current) / 1000)
      : 0;

    const position = window.scrollY;
    const isCompleted = progress >= 100;

    setState((prevState) => ({
      ...prevState,
      progress,
      lastPosition: position,
      isCompleted,
    }));

    // 更新服务
    readingProgressService.updateProgress(
      articleId,
      progress,
      additionalTime,
      position
    );

    // 触发回调
    onProgressChange?.(progress);

    // 检查完成
    if (isCompleted && !state.isCompleted) {
      onComplete?.();
    }

    // 重置计时器
    startTimeRef.current = currentTime;
    lastPositionRef.current = position;
  }, [articleId, calculateProgress, onProgressChange, onComplete, state.isCompleted]);

  // 开始阅读
  const startReading = useCallback(() => {
    if (!state.isReading) {
      setState((prev) => ({ ...prev, isReading: true }));
      startTimeRef.current = Date.now();
    }
  }, [state.isReading]);

  // 停止阅读
  const stopReading = useCallback(() => {
    if (state.isReading) {
      setState((prev) => ({ ...prev, isReading: false }));
      updateProgress();
      startTimeRef.current = null;
    }
  }, [state.isReading, updateProgress]);

  // 手动标记为已读
  const markAsRead = useCallback(() => {
    readingProgressService.updateProgress(articleId, 100, 0, window.scrollY);
    setState((prev) => ({ ...prev, progress: 100, isCompleted: true }));
    onComplete?.();
  }, [articleId, onComplete]);

  // 重置进度
  const resetProgress = useCallback(() => {
    readingProgressService.deleteProgress(articleId);
    setState({
      progress: 0,
      readingTime: 0,
      lastPosition: 0,
      isCompleted: false,
      isReading: false,
    });
    startTimeRef.current = null;
  }, [articleId]);

  // 跳转到上次阅读位置
  const scrollToLastPosition = useCallback(() => {
    const savedProgress = readingProgressService.getProgress(articleId);
    if (savedProgress && savedProgress.lastPosition > 0) {
      window.scrollTo({
        top: savedProgress.lastPosition,
        behavior: 'smooth',
      });
    }
  }, [articleId]);

  // 自动追踪
  useEffect(() => {
    if (!autoTrack) return;

    const handleScroll = () => {
      const scrolled = window.scrollY;
      const timeSinceLastScroll = Date.now() - (startTimeRef.current || Date.now());

      // 检测用户正在阅读
      if (timeSinceLastScroll < 100) {
        startReading();
      }
    };

    const handleVisibilityChange = () => {
      if (document.hidden) {
        stopReading();
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    document.addEventListener('visibilitychange', handleVisibilityChange);

    // 定时更新进度
    trackingTimerRef.current = setInterval(() => {
      if (state.isReading) {
        updateProgress();
      }
    }, updateInterval);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      if (trackingTimerRef.current) {
        clearInterval(trackingTimerRef.current);
      }
      stopReading();
    };
  }, [autoTrack, updateInterval, state.isReading, startReading, stopReading, updateProgress]);

  // 页面卸载时保存进度
  useEffect(() => {
    return () => {
      if (state.isReading) {
        updateProgress();
      }
    };
  }, [state.isReading, updateProgress]);

  return {
    ...state,
    updateProgress,
    markAsRead,
    resetProgress,
    scrollToLastPosition,
    startReading,
    stopReading,
  };
};

/**
 * 阅读时间估算 Hook
 *
 * @example
 * ```tsx
 * const { readingTime, wordCount } = useReadingTimeEstimate(article.content);
 * ```
 */
export const useReadingTimeEstimate = (
  content: string,
  wordsPerMinute: number = 200
) => {
  const [wordCount, setWordCount] = useState(0);
  const [readingTime, setReadingTime] = useState(0);

  useEffect(() => {
    if (!content) {
      setWordCount(0);
      setReadingTime(0);
      return;
    }

    // 移除HTML标签
    const cleanText = content.replace(/<[^>]*>/g, '').trim();

    // 计算中文字符
    const chineseChars = (cleanText.match(/[\u4e00-\u9fa5]/g) || []).length;

    // 计算英文单词
    const englishWords = (cleanText.match(/[a-zA-Z]+/g) || []).length;

    const totalWords = chineseChars + englishWords;
    const minutes = Math.ceil(totalWords / wordsPerMinute);

    setWordCount(totalWords);
    setReadingTime(minutes);
  }, [content, wordsPerMinute]);

  return { wordCount, readingTime };
};

/**
 * 阅读历史 Hook
 *
 * @example
 * ```tsx
 * const { history, addToHistory, removeFromHistory } = useReadingHistory();
 * ```
 */
export const useReadingHistory = () => {
  const [history, setHistory] = useState(() =>
    readingProgressService.getHistory()
  );

  const refreshHistory = useCallback(() => {
    setHistory(readingProgressService.getHistory());
  }, []);

  const addToHistory = useCallback((
    item: Omit<{
      id: string;
      articleId: string;
      title: string;
      slug: string;
      progress: number;
      readingTime: number;
      lastReadAt: string;
      isCompleted: boolean;
      coverImage?: string;
    }, 'id'>
  ) => {
    readingProgressService.addToHistory(item);
    refreshHistory();
  }, [refreshHistory]);

  const removeFromHistory = useCallback((id: string) => {
    readingProgressService.deleteFromHistory(id);
    refreshHistory();
  }, [refreshHistory]);

  const clearHistory = useCallback(() => {
    readingProgressService.clearHistory();
    refreshHistory();
  }, [refreshHistory]);

  return {
    history,
    addToHistory,
    removeFromHistory,
    clearHistory,
    refreshHistory,
  };
};

/**
 * 阅读统计 Hook
 *
 * @example
 * ```tsx
 * const { stats, refreshStats } = useReadingStats();
 * ```
 */
export const useReadingStats = () => {
  const [stats, setStats] = useState(() =>
    readingProgressService.getStats()
  );

  const refreshStats = useCallback(() => {
    setStats(readingProgressService.getStats());
  }, []);

  return {
    stats,
    refreshStats,
  };
};

export default useReadingProgress;
