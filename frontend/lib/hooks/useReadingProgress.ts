/**
 * useReadingProgress - 阅读进度 Hook
 *
 * 跟踪用户在页面或文章中的阅读进度
 *
 * @example
 * const readingProgress = useReadingProgress();
 * <div style={{ transform: `scaleX(${readingProgress})` }} />
 */

import { useState, useEffect } from 'react';

interface UseReadingProgressOptions {
  /**
   * 要跟踪的容器元素，默认为整个文档
   */
  containerRef?: React.RefObject<HTMLElement>;

  /**
   * 更新频率（毫秒），默认为 100ms
   */
  updateInterval?: number;

  /**
   * 是否启用，默认为 true
   */
  enabled?: boolean;
}

interface UseReadingProgressReturn {
  /**
   * 阅读进度值，范围 0-1
   */
  progress: number;

  /**
   * 阅读进度百分比，范围 0-100
   */
  percentage: number;

  /**
   * 是否开始阅读
   */
  isReading: boolean;

  /**
   * 是否完成阅读
   */
  isCompleted: boolean;

  /**
   * 重置阅读进度
   */
  reset: () => void;
}

export function useReadingProgress({
  containerRef,
  updateInterval = 100,
  enabled = true,
}: UseReadingProgressOptions = {}): UseReadingProgressReturn {
  const [progress, setProgress] = useState(0);
  const [isReading, setIsReading] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);

  const reset = () => {
    setProgress(0);
    setIsReading(false);
    setIsCompleted(false);
  };

  useEffect(() => {
    if (!enabled) return;

    const container = containerRef?.current || document.documentElement;
    let animationFrameId: number;
    let lastUpdateTime = 0;

    const updateProgress = (timestamp: number) => {
      // 限制更新频率
      if (timestamp - lastUpdateTime < updateInterval) {
        animationFrameId = requestAnimationFrame(updateProgress);
        return;
      }

      lastUpdateTime = timestamp;

      // 计算阅读进度
      const scrollTop = container.scrollTop;
      const scrollHeight = container.scrollHeight;
      const clientHeight = container.clientHeight;

      const scrollableDistance = scrollHeight - clientHeight;
      const currentProgress = scrollableDistance > 0 ? scrollTop / scrollableDistance : 0;

      // 更新状态
      setProgress(Math.min(1, Math.max(0, currentProgress)));

      // 判断是否开始阅读（滚动超过 5%）
      setIsReading(currentProgress > 0.05);

      // 判断是否完成阅读（滚动超过 95%）
      setIsCompleted(currentProgress > 0.95);

      // 继续下一帧
      animationFrameId = requestAnimationFrame(updateProgress);
    };

    // 开始监听
    animationFrameId = requestAnimationFrame(updateProgress);

    // 清理
    return () => {
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }
    };
  }, [containerRef, updateInterval, enabled]);

  return {
    progress,
    percentage: progress * 100,
    isReading,
    isCompleted,
    reset,
  };
}

/**
 * useReadingProgressWithThreshold - 带阈值检测的阅读进度 Hook
 *
 * 在达到特定进度阈值时触发回调
 */

interface ReadingProgressThreshold {
  /**
   * 阈值百分比（0-100）
   */
  value: number;

  /**
   * 达到阈值时的回调
   */
  onThreshold?: () => void;

  /**
   * 是否已触发
   */
  triggered?: boolean;
}

interface UseReadingProgressWithThresholdOptions extends UseReadingProgressOptions {
  /**
   * 进度阈值数组
   */
  thresholds?: number[];
}

export function useReadingProgressWithThreshold({
  thresholds = [25, 50, 75, 100],
  ...options
}: UseReadingProgressWithThresholdOptions): UseReadingProgressReturn & {
  triggeredThresholds: number[];
} {
  const [triggeredThresholds, setTriggeredThresholds] = useState<number[]>([]);
  const baseHook = useReadingProgress(options);

  useEffect(() => {
    const { percentage } = baseHook;

    thresholds.forEach((threshold) => {
      // 检查是否达到阈值且未触发
      if (
        percentage >= threshold &&
        !triggeredThresholds.includes(threshold)
      ) {
        setTriggeredThresholds((prev) => [...prev, threshold]);

        // 触发回调（可以在这里添加事件跟踪）
        if (typeof window !== 'undefined' && window.gtag) {
          window.gtag('event', 'reading_progress', {
            event_category: 'engagement',
            event_label: `${threshold}%`,
            value: threshold,
          });
        }
      }
    });
  }, [baseHook.percentage, thresholds, triggeredThresholds]);

  return {
    ...baseHook,
    triggeredThresholds,
  };
}

/**
 * useChapterProgress - 章节阅读进度 Hook
 *
 * 跟踪文章中各个章节的阅读进度
 */

interface Chapter {
  id: string;
  title: string;
  element: HTMLElement | null;
}

interface UseChapterProgressOptions {
  /**
   * 章节选择器
   */
  chapterSelector?: string;

  /**
   * 更新频率（毫秒）
   */
  updateInterval?: number;
}

interface ChapterProgress {
  id: string;
  title: string;
  progress: number;
  isVisible: boolean;
  isCompleted: boolean;
}

export function useChapterProgress({
  chapterSelector = 'h2, h3',
  updateInterval = 200,
}: UseChapterProgressOptions = {}) {
  const [chapters, setChapters] = useState<Chapter[]>([]);
  const [currentChapterId, setCurrentChapterId] = useState<string>('');
  const [chapterProgress, setChapterProgress] = useState<ChapterProgress[]>([]);

  // 初始化章节
  useEffect(() => {
    const elements = document.querySelectorAll(chapterSelector);
    const chapterList: Chapter[] = Array.from(elements).map((el, index) => ({
      id: `chapter-${index}`,
      title: el.textContent || '',
      element: el as HTMLElement,
    }));

    setChapters(chapterList);
  }, [chapterSelector]);

  // 更新章节进度
  useEffect(() => {
    let animationFrameId: number;
    let lastUpdateTime = 0;

    const updateChapters = (timestamp: number) => {
      if (timestamp - lastUpdateTime < updateInterval) {
        animationFrameId = requestAnimationFrame(updateChapters);
        return;
      }

      lastUpdateTime = timestamp;

      const viewportMiddle = window.innerHeight / 2;
      let closestChapter = '';
      let minDistance = Infinity;

      const progressData: ChapterProgress[] = chapters.map((chapter) => {
        if (!chapter.element) {
          return {
            id: chapter.id,
            title: chapter.title,
            progress: 0,
            isVisible: false,
            isCompleted: false,
          };
        }

        const rect = chapter.element.getBoundingClientRect();
        const distance = Math.abs(rect.top - viewportMiddle);

        // 找到最近的章节
        if (distance < minDistance) {
          minDistance = distance;
          closestChapter = chapter.id;
        }

        // 计算可见性
        const isVisible = rect.top < window.innerHeight && rect.bottom > 0;
        const isCompleted = rect.top < 0;
        const progress = Math.max(0, Math.min(1, 1 - rect.top / window.innerHeight));

        return {
          id: chapter.id,
          title: chapter.title,
          progress,
          isVisible,
          isCompleted,
        };
      });

      setChapterProgress(progressData);
      setCurrentChapterId(closestChapter);

      animationFrameId = requestAnimationFrame(updateChapters);
    };

    animationFrameId = requestAnimationFrame(updateChapters);

    return () => {
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }
    };
  }, [chapters, updateInterval]);

  return {
    chapters: chapterProgress,
    currentChapterId,
    currentChapter: chapterProgress.find((c) => c.id === currentChapterId),
  };
}

export default useReadingProgress;
