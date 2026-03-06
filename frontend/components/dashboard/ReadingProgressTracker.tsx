'use client';

import React, { useEffect, useState, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BookOpen, Clock, CheckCircle, TrendingUp } from 'lucide-react';
import { readingProgressApi, ReadingProgress } from '@/services/api/readingProgress';
import { useLocalStorage } from '@/hooks/useLocalStorage';

interface ReadingProgressTrackerProps {
  articleId: string;
  articleTitle: string;
  userId?: string;
  autoSave?: boolean;
  saveInterval?: number;
  onComplete?: () => void;
}

/**
 * 阅读进度追踪器组件
 * 自动追踪用户的阅读进度并保存到服务器
 *
 * @example
 * <ReadingProgressTracker
 *   articleId="123"
 *   articleTitle="我的文章标题"
 *   autoSave={true}
 *   saveInterval={5000}
 *   onComplete={() => console.log('文章已读完成')}
 * />
 */
export const ReadingProgressTracker: React.FC<ReadingProgressTrackerProps> = ({
  articleId,
  articleTitle,
  userId,
  autoSave = true,
  saveInterval = 5000,
  onComplete,
}) => {
  const [progress, setProgress] = useState<ReadingProgress | null>(null);
  const [currentProgress, setCurrentProgress] = useState(0);
  const [readingTime, setReadingTime] = useState(0);
  const [isSaving, setIsSaving] = useState(false);
  const [showCompletion, setShowCompletion] = useState(false);
  const [hasRestored, setHasRestored] = useState(false);

  const saveTimerRef = useRef<NodeJS.Timeout>();
  const readingStartRef = useRef<number>();
  const containerRef = useRef<HTMLDivElement>(null);

  // 本地缓存上次的阅读位置
  const [localProgress, setLocalProgress] = useLocalStorage(
    `reading-progress-${articleId}`,
    { position: 0, progress: 0, time: 0 }
  );

  /**
   * 加载已保存的阅读进度
   */
  useEffect(() => {
    const loadProgress = async () => {
      try {
        const saved = await readingProgressApi.getArticleProgress(articleId);
        if (saved) {
          setProgress(saved);
          setCurrentProgress(saved.progress);
          setReadingTime(saved.totalTime);

          // 恢复阅读位置
          if (saved.lastPosition > 0 && containerRef.current) {
            containerRef.current.scrollTop = saved.lastPosition;
          }
        } else if (localProgress.position > 0 && !hasRestored) {
          // 从本地缓存恢复
          setTimeout(() => {
            if (containerRef.current) {
              containerRef.current.scrollTop = localProgress.position;
              setCurrentProgress(localProgress.progress);
              setReadingTime(localProgress.time);
              setHasRestored(true);
            }
          }, 100);
        }
      } catch (error) {
        console.error('加载阅读进度失败:', error);
      }
    };

    loadProgress();
  }, [articleId, localProgress, hasRestored]);

  /**
   * 监听滚动事件，更新阅读进度
   */
  const handleScroll = useCallback(() => {
    if (!containerRef.current) return;

    const container = containerRef.current;
    const scrollTop = container.scrollTop;
    const scrollHeight = container.scrollHeight - container.clientHeight;
    const progressPercent = scrollHeight > 0 ? (scrollTop / scrollHeight) * 100 : 0;

    const roundedProgress = Math.round(progressPercent);
    setCurrentProgress(roundedProgress);

    // 更新本地缓存
    setLocalProgress({
      position: scrollTop,
      progress: roundedProgress,
      time: readingTime,
    });

    // 检查是否完成阅读（进度>=90%）
    if (roundedProgress >= 90 && !showCompletion) {
      setShowCompletion(true);
      if (onComplete) {
        onComplete();
      }

      // 自动标记为已完成
      readingProgressApi.markAsCompleted(articleId).catch(console.error);
    }
  }, [articleId, readingTime, showCompletion, onComplete, setLocalProgress]);

  /**
   * 节流滚动事件
   */
  useEffect(() => {
    if (!containerRef.current) return;

    let ticking = false;
    const throttledScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          handleScroll();
          ticking = false;
        });
        ticking = true;
      }
    };

    const container = containerRef.current;
    container.addEventListener('scroll', throttledScroll, { passive: true });

    return () => {
      container.removeEventListener('scroll', throttledScroll);
    };
  }, [handleScroll]);

  /**
   * 计时阅读时间
   */
  useEffect(() => {
    const startTime = Date.now();
    readingStartRef.current = startTime;

    const timer = setInterval(() => {
      const elapsed = Math.floor((Date.now() - startTime) / 1000);
      setReadingTime(elapsed);
    }, 1000);

    return () => {
      clearInterval(timer);
    };
  }, []);

  /**
   * 自动保存阅读进度
   */
  useEffect(() => {
    if (!autoSave) return;

    const saveProgress = async () => {
      if (!containerRef.current) return;

      setIsSaving(true);
      try {
        const position = containerRef.current.scrollTop;

        await readingProgressApi.upsertProgress({
          articleId,
          articleTitle,
          progress: currentProgress,
          lastPosition: position,
          totalTime: readingTime,
          completed: currentProgress >= 90,
        });

        setProgress((prev) => ({
          ...prev!,
          progress: currentProgress,
          lastPosition: position,
          totalTime: readingTime,
          completed: currentProgress >= 90,
        } as ReadingProgress));
      } catch (error) {
        console.error('保存阅读进度失败:', error);
      } finally {
        setIsSaving(false);
      }
    };

    // 定时保存
    saveTimerRef.current = setInterval(() => {
      saveProgress();
    }, saveInterval);

    // 页面卸载时保存
    const handleBeforeUnload = () => {
      saveProgress();
    };

    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      clearInterval(saveTimerRef.current);
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [articleId, articleTitle, currentProgress, readingTime, autoSave, saveInterval]);

  /**
   * 格式化阅读时间
   */
  const formatReadingTime = (seconds: number): string => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;

    if (hours > 0) {
      return `${hours}小时${minutes}分钟`;
    } else if (minutes > 0) {
      return `${minutes}分钟${secs}秒`;
    } else {
      return `${secs}秒`;
    }
  };

  /**
   * 渲染进度条
   */
  const renderProgressBar = () => {
    const progressWidth = Math.min(currentProgress, 100);

    return (
      <div className="fixed top-0 left-0 right-0 z-50 h-1 bg-cyber-dark/50 backdrop-blur-sm">
        <motion.div
          className="h-full bg-gradient-to-r from-cyber-cyan via-cyber-purple to-cyber-pink"
          initial={{ width: 0 }}
          animate={{ width: `${progressWidth}%` }}
          transition={{ duration: 0.3 }}
        />
      </div>
    );
  };

  /**
   * 渲染阅读状态指示器
   */
  const renderStatusIndicator = () => {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="fixed bottom-6 right-6 z-50"
      >
        <div className="cyber-card bg-cyber-dark/90 backdrop-blur-md border border-cyber-cyan/30 rounded-lg p-4 shadow-lg shadow-cyber-cyan/20">
          <div className="flex items-center gap-3">
            {/* 图标 */}
            <div className="relative">
              <BookOpen className="w-6 h-6 text-cyber-cyan" />
              {isSaving && (
                <motion.div
                  className="absolute -top-1 -right-1 w-3 h-3 bg-cyber-green rounded-full"
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 0.5, repeat: Infinity }}
                />
              )}
            </div>

            {/* 进度信息 */}
            <div className="flex-1">
              <div className="flex items-center justify-between gap-4 mb-1">
                <span className="text-sm font-medium text-gray-200">阅读进度</span>
                <span className="text-sm font-bold text-cyber-cyan">
                  {currentProgress}%
                </span>
              </div>

              {/* 进度条 */}
              <div className="w-full h-2 bg-gray-700 rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-gradient-to-r from-cyber-cyan to-cyber-purple"
                  initial={{ width: 0 }}
                  animate={{ width: `${Math.min(currentProgress, 100)}%` }}
                  transition={{ duration: 0.3 }}
                />
              </div>

              {/* 阅读时间 */}
              <div className="flex items-center gap-2 mt-2 text-xs text-gray-400">
                <Clock className="w-3 h-3" />
                <span>已阅读 {formatReadingTime(readingTime)}</span>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    );
  };

  return (
    <>
      {renderProgressBar()}
      {renderStatusIndicator()}

      {/* 完成提示 */}
      <AnimatePresence>
        {showCompletion && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
            onClick={() => setShowCompletion(false)}
          >
            <div className="cyber-card bg-cyber-dark border border-cyber-green/50 rounded-2xl p-8 text-center shadow-2xl shadow-cyber-green/20">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: 'spring' }}
              >
                <CheckCircle className="w-20 h-20 text-cyber-green mx-auto mb-4" />
              </motion.div>

              <h3 className="text-2xl font-bold text-white mb-2">阅读完成！</h3>
              <p className="text-gray-400 mb-6">
                太棒了！您已完成本文的阅读
              </p>

              <div className="flex items-center justify-center gap-6 text-sm">
                <div className="flex items-center gap-2 text-cyber-cyan">
                  <Clock className="w-4 h-4" />
                  <span>{formatReadingTime(readingTime)}</span>
                </div>
                <div className="flex items-center gap-2 text-cyber-purple">
                  <TrendingUp className="w-4 h-4" />
                  <span>{currentProgress}% 完成</span>
                </div>
              </div>

              <button
                onClick={() => setShowCompletion(false)}
                className="mt-6 px-6 py-2 bg-cyber-green/20 hover:bg-cyber-green/30 text-cyber-green border border-cyber-green/50 rounded-lg transition-colors"
              >
                继续阅读
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default ReadingProgressTracker;
