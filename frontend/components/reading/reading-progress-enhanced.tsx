'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Clock, Eye, Bookmark, Share2, Heart, Settings } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface ReadingProgressConfig {
  enableProgressBar?: boolean;
  enableReadingTime?: boolean;
  enableProgressIndicator?: boolean;
  enableSaveProgress?: boolean;
  enableScrollDepth?: boolean;
  updateInterval?: number; // ms
}

export interface ReadingProgressData {
  postId: string;
  title: string;
  progress: number;
  readingTime?: number;
  lastPosition: number;
  scrollDepth: {
    quarter: boolean;
    half: boolean;
    threeQuarter: boolean;
    complete: boolean;
  };
  timestamp: number;
}

interface ReadingProgressEnhancedProps {
  postId: string;
  title: string;
  contentRef?: React.RefObject<HTMLElement>;
  config?: ReadingProgressConfig;
  className?: string;
  onSaveProgress?: (data: ReadingProgressData) => void;
  onMilestone?: (milestone: string) => void;
}

const defaultConfig: ReadingProgressConfig = {
  enableProgressBar: true,
  enableReadingTime: true,
  enableProgressIndicator: true,
  enableSaveProgress: true,
  enableScrollDepth: true,
  updateInterval: 1000,
};

export function ReadingProgressEnhanced({
  postId,
  title,
  contentRef,
  config = defaultConfig,
  className,
  onSaveProgress,
  onMilestone,
}: ReadingProgressEnhancedProps) {
  const [progress, setProgress] = useState(0);
  const [readingTime, setReadingTime] = useState(0);
  const [isVisible, setIsVisible] = useState(true);
  const [isSaved, setIsSaved] = useState(false);
  const [scrollDepth, setScrollDepth] = useState({
    quarter: false,
    half: false,
    threeQuarter: false,
    complete: false,
  });
  const [showMenu, setShowMenu] = useState(false);

  const finalConfig = { ...defaultConfig, ...config };

  // 计算阅读进度
  const calculateProgress = useCallback(() => {
    if (!contentRef?.current) return 0;

    const element = contentRef.current;
    const scrollTop = window.scrollY || document.documentElement.scrollTop;
    const scrollHeight = element.scrollHeight - window.innerHeight;
    const progress = scrollHeight > 0 ? (scrollTop / scrollHeight) * 100 : 0;

    return Math.min(100, Math.max(0, progress));
  }, [contentRef]);

  // 更新滚动深度
  const updateScrollDepth = useCallback((currentProgress: number) => {
    const newDepth = { ...scrollDepth };

    if (currentProgress >= 25 && !newDepth.quarter) {
      newDepth.quarter = true;
      onMilestone?.('25%');
    }
    if (currentProgress >= 50 && !newDepth.half) {
      newDepth.half = true;
      onMilestone?.('50%');
    }
    if (currentProgress >= 75 && !newDepth.threeQuarter) {
      newDepth.threeQuarter = true;
      onMilestone?.('75%');
    }
    if (currentProgress >= 100 && !newDepth.complete) {
      newDepth.complete = true;
      onMilestone?.('100%');
    }

    setScrollDepth(newDepth);
  }, [scrollDepth, onMilestone]);

  // 保存阅读进度
  const saveProgress = useCallback((currentProgress: number, currentTime: number) => {
    const data: ReadingProgressData = {
      postId,
      title,
      progress: currentProgress,
      readingTime: currentTime,
      lastPosition: window.scrollY,
      scrollDepth,
      timestamp: Date.now(),
    };

    // 保存到 localStorage
    try {
      const key = `reading-progress-${postId}`;
      localStorage.setItem(key, JSON.stringify(data));
    } catch (error) {
      console.error('Failed to save reading progress:', error);
    }

    onSaveProgress?.(data);
  }, [postId, title, scrollDepth, onSaveProgress]);

  // 恢复阅读进度
  useEffect(() => {
    if (!finalConfig.enableSaveProgress) return;

    try {
      const key = `reading-progress-${postId}`;
      const saved = localStorage.getItem(key);

      if (saved) {
        const data: ReadingProgressData = JSON.parse(saved);

        // 恢复滚动位置
        if (data.lastPosition && data.lastPosition > 0) {
          window.scrollTo({
            top: data.lastPosition,
            behavior: 'smooth',
          });
        }

        // 恢复滚动深度
        setScrollDepth(data.scrollDepth || {
          quarter: false,
          half: false,
          threeQuarter: false,
          complete: false,
        });

        setIsSaved(true);
      }
    } catch (error) {
      console.error('Failed to restore reading progress:', error);
    }
  }, [postId, finalConfig.enableSaveProgress]);

  // 监听滚动事件
  useEffect(() => {
    if (!contentRef?.current) return;

    let animationFrameId: number;
    let lastUpdateTime = Date.now();

    const handleScroll = () => {
      const now = Date.now();
      if (now - lastUpdateTime < finalConfig.updateInterval!) {
        animationFrameId = requestAnimationFrame(handleScroll);
        return;
      }

      lastUpdateTime = now;

      const currentProgress = calculateProgress();
      setProgress(currentProgress);

      if (finalConfig.enableScrollDepth) {
        updateScrollDepth(currentProgress);
      }

      if (finalConfig.enableSaveProgress) {
        saveProgress(currentProgress, readingTime);
      }

      // 控制进度条显示/隐藏
      setIsVisible(currentProgress > 5 && currentProgress < 95);
    };

    const rafHandleScroll = () => {
      animationFrameId = requestAnimationFrame(handleScroll);
    };

    window.addEventListener('scroll', rafHandleScroll, { passive: true });

    return () => {
      window.removeEventListener('scroll', rafHandleScroll);
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }
    };
  }, [
    contentRef,
    calculateProgress,
    updateScrollDepth,
    saveProgress,
    readingTime,
    finalConfig,
  ]);

  // 计时器
  useEffect(() => {
    if (!finalConfig.enableReadingTime) return;

    const interval = setInterval(() => {
      setReadingTime(prev => prev + 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [finalConfig.enableReadingTime]);

  // 格式化阅读时间
  const formatReadingTime = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;

    if (minutes < 1) {
      return `${remainingSeconds}s`;
    }

    return remainingSeconds > 0
      ? `${minutes}m ${remainingSeconds}s`
      : `${minutes}m`;
  };

  // 手动保存进度
  const handleSaveProgress = () => {
    saveProgress(progress, readingTime);
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2000);
  };

  return (
    <>
      {/* 顶部进度条 */}
      <AnimatePresence>
        {isVisible && finalConfig.enableProgressBar && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className={cn(
              "fixed top-0 left-0 right-0 z-50 h-1 bg-cyber-dark/80 backdrop-blur-sm",
              className
            )}
          >
            <motion.div
              className="h-full bg-gradient-to-r from-cyber-cyan via-cyber-purple to-cyber-pink"
              style={{ width: `${progress}%` }}
              transition={{ duration: 0.3 }}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* 浮动控制按钮 */}
      {finalConfig.enableProgressIndicator && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="fixed bottom-6 right-6 z-40"
        >
          <div className="relative">
            {/* 主按钮 */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowMenu(!showMenu)}
              className="relative w-14 h-14 rounded-full bg-gradient-to-r from-cyber-cyan to-cyber-purple text-white shadow-lg shadow-cyber-cyan/20 flex items-center justify-center"
            >
              <Clock className="w-6 h-6" />

              {/* 进度环 */}
              <svg className="absolute inset-0 w-full h-full -rotate-90">
                <circle
                  cx="28"
                  cy="28"
                  r="26"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  className="text-cyber-dark/30"
                />
                <circle
                  cx="28"
                  cy="28"
                  r="26"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeDasharray={163.36}
                  strokeDashoffset={163.36 * (1 - progress / 100)}
                  className="text-white"
                />
              </svg>

              {/* 进度百分比 */}
              <span className="absolute -bottom-8 left-1/2 -translate-x-1/2 text-xs font-bold text-cyber-cyan">
                {Math.round(progress)}%
              </span>
            </motion.button>

            {/* 展开菜单 */}
            <AnimatePresence>
              {showMenu && (
                <motion.div
                  initial={{ opacity: 0, y: 20, scale: 0.9 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 20, scale: 0.9 }}
                  className="absolute bottom-full right-0 mb-2 w-48 p-3 rounded-xl bg-cyber-dark border border-cyber-cyan/20 shadow-xl shadow-cyber-cyan/10"
                >
                  {/* 阅读时间 */}
                  {finalConfig.enableReadingTime && (
                    <div className="flex items-center gap-2 mb-2 p-2 rounded-lg bg-cyber-muted/50">
                      <Clock className="w-4 h-4 text-cyber-cyan" />
                      <span className="text-sm text-white">
                        {formatReadingTime(readingTime)}
                      </span>
                    </div>
                  )}

                  {/* 滚动深度指示器 */}
                  {finalConfig.enableScrollDepth && (
                    <div className="flex items-center gap-1 mb-2 p-2 rounded-lg bg-cyber-muted/50">
                      {[
                        { key: 'quarter', value: 25 },
                        { key: 'half', value: 50 },
                        { key: 'threeQuarter', value: 75 },
                        { key: 'complete', value: 100 },
                      ].map(({ key, value }) => (
                        <div
                          key={key}
                          className={cn(
                            "flex-1 h-1.5 rounded-full transition-colors",
                            scrollDepth[key as keyof typeof scrollDepth]
                              ? "bg-gradient-to-r from-cyber-cyan to-cyber-purple"
                              : "bg-cyber-muted"
                          )}
                          title={`${value}%`}
                        />
                      ))}
                    </div>
                  )}

                  {/* 操作按钮 */}
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={handleSaveProgress}
                      className={cn(
                        "flex items-center justify-center gap-1 px-2 py-1.5 rounded-lg text-xs font-medium transition-all",
                        isSaved
                          ? "bg-cyber-green/20 text-cyber-green"
                          : "bg-cyber-muted/50 text-white hover:bg-cyber-muted"
                      )}
                    >
                      <Bookmark className="w-3 h-3" />
                      {isSaved ? '已保存' : '保存'}
                    </button>

                    <button
                      className="flex items-center justify-center gap-1 px-2 py-1.5 rounded-lg text-xs font-medium bg-cyber-muted/50 text-white hover:bg-cyber-muted transition-all"
                    >
                      <Share2 className="w-3 h-3" />
                      分享
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      )}
    </>
  );
}

// 导出便捷组件
export function ReadingProgressBar({ className }: { className?: string }) {
  return (
    <div className={cn("fixed top-0 left-0 right-0 z-50 h-0.5 bg-cyber-dark", className)}>
      <motion.div
        className="h-full bg-gradient-to-r from-cyber-cyan via-cyber-purple to-cyber-pink"
        initial={{ width: 0 }}
        whileInView={{ width: "100%" }}
        transition={{ duration: 0.5 }}
      />
    </div>
  );
}

export function ReadingTime({ content }: { content: string }) {
  const calculateReadingTime = (text: string): number => {
    const wordsPerMinute = 200;
    const words = text.trim().split(/\s+/).length;
    return Math.ceil(words / wordsPerMinute);
  };

  const minutes = calculateReadingTime(content);

  return (
    <div className="flex items-center gap-2 text-sm text-gray-400">
      <Clock className="w-4 h-4" />
      <span>{minutes} 分钟阅读</span>
    </div>
  );
}
