import { useState, useEffect } from 'react';

interface ReadingProgressOptions {
  /**
   * 是否启用阅读进度追踪
   * @default true
   */
  enabled?: boolean;
  /**
   * 更新频率（毫秒）
   * @default 100
   */
  updateInterval?: number;
}

interface ReadingProgressData {
  /**
   * 阅读进度百分比 (0-100)
   */
  progress: number;
  /**
   * 已阅读的像素值
   */
  readPixels: number;
  /**
   * 总内容高度（像素）
   */
  totalHeight: number;
  /**
   * 可见视口高度（像素）
   */
  viewportHeight: number;
  /**
   * 是否已开始阅读
   */
  isReading: boolean;
  /**
   * 是否已完成阅读
   */
  isComplete: boolean;
}

/**
 * 阅读进度追踪 Hook
 *
 * 追踪用户的阅读进度，用于显示进度条、保存阅读位置等
 *
 * @example
 * ```tsx
 * const { progress, isReading, isComplete } = useReadingProgress();
 *
 * return (
 *   <>
 *     <div style={{ width: `${progress}%` }} />
 *     {isComplete && <Confetti />}
 *   </>
 * );
 * ```
 */
export function useReadingProgress(
  options: ReadingProgressOptions = {}
): ReadingProgressData {
  const { enabled = true, updateInterval = 100 } = options;

  const [progress, setProgress] = useState(0);
  const [readPixels, setReadPixels] = useState(0);
  const [totalHeight, setTotalHeight] = useState(0);
  const [viewportHeight, setViewportHeight] = useState(0);
  const [isReading, setIsReading] = useState(false);
  const [isComplete, setIsComplete] = useState(false);

  useEffect(() => {
    if (!enabled) return;

    let rafId: number;
    let lastUpdate = 0;

    const updateProgress = (timestamp: number) => {
      // 限制更新频率
      if (timestamp - lastUpdate < updateInterval) {
        rafId = requestAnimationFrame(updateProgress);
        return;
      }

      lastUpdate = timestamp;

      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight;
      const winHeight = window.innerHeight;
      const totalReadable = docHeight - winHeight;

      const currentProgress = Math.min(
        (scrollTop / totalReadable) * 100,
        100
      );

      setProgress(currentProgress);
      setReadPixels(scrollTop);
      setTotalHeight(docHeight);
      setViewportHeight(winHeight);
      setIsReading(scrollTop > 100);
      setIsComplete(currentProgress >= 99);

      rafId = requestAnimationFrame(updateProgress);
    };

    rafId = requestAnimationFrame(updateProgress);

    return () => {
      if (rafId) {
        cancelAnimationFrame(rafId);
      }
    };
  }, [enabled, updateInterval]);

  return {
    progress,
    readPixels,
    totalHeight,
    viewportHeight,
    isReading,
    isComplete,
  };
}

/**
 * 阅读时间估算 Hook
 *
 * 根据内容长度和阅读速度估算阅读时间
 *
 * @example
 * ```tsx
 * const { readingTime, wordCount } = useReadingTime(content);
 * <span>预计阅读时间: {readingTime} 分钟</span>
 * ```
 */
export function useReadingTime(content: string, wordsPerMinute = 200) {
  const [readingTime, setReadingTime] = useState(0);
  const [wordCount, setWordCount] = useState(0);

  useEffect(() => {
    if (!content) {
      setReadingTime(0);
      setWordCount(0);
      return;
    }

    // 移除 HTML 标签
    const textContent = content.replace(/<[^>]*>/g, ' ');
    // 移除多余空格
    const cleanText = textContent.replace(/\s+/g, ' ').trim();
    // 计算字数（英文按单词，中文按字符）
    const words = cleanText.split(' ');
    const count = cleanText.length;

    setWordCount(count);
    setReadingTime(Math.ceil(count / wordsPerMinute));
  }, [content, wordsPerMinute]);

  return { readingTime, wordCount };
}

/**
 * 阅读历史 Hook
 *
 * 保存用户的阅读历史到 localStorage
 *
 * @example
 * ```tsx
 * const { history, addToHistory, isInHistory } = useReadingHistory();
 *
 * useEffect(() => {
 *   if (isComplete) {
 *     addToHistory(postId);
 *   }
 * }, [isComplete]);
 * ```
 */
export function useReadingHistory(maxItems = 50) {
  const [history, setHistory] = useState<string[]>([]);

  useEffect(() => {
    // 从 localStorage 加载历史
    try {
      const saved = localStorage.getItem('reading-history');
      if (saved) {
        setHistory(JSON.parse(saved));
      }
    } catch (error) {
      console.error('Failed to load reading history:', error);
    }
  }, []);

  const addToHistory = (itemId: string) => {
    setHistory((prev) => {
      const newHistory = [itemId, ...prev.filter((id) => id !== itemId)];
      const limited = newHistory.slice(0, maxItems);

      try {
        localStorage.setItem('reading-history', JSON.stringify(limited));
      } catch (error) {
        console.error('Failed to save reading history:', error);
      }

      return limited;
    });
  };

  const removeFromHistory = (itemId: string) => {
    setHistory((prev) => {
      const newHistory = prev.filter((id) => id !== itemId);

      try {
        localStorage.setItem('reading-history', JSON.stringify(newHistory));
      } catch (error) {
        console.error('Failed to update reading history:', error);
      }

      return newHistory;
    });
  };

  const clearHistory = () => {
    setHistory([]);
    try {
      localStorage.removeItem('reading-history');
    } catch (error) {
      console.error('Failed to clear reading history:', error);
    }
  };

  const isInHistory = (itemId: string) => {
    return history.includes(itemId);
  };

  return {
    history,
    addToHistory,
    removeFromHistory,
    clearHistory,
    isInHistory,
  };
}
