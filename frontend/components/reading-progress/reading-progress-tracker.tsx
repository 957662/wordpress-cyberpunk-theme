'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, useScroll, useSpring } from 'framer-motion';
import { BookOpen, Clock, Eye, ChevronUp } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ReadingProgressTrackerProps {
  className?: string;
  targetId?: string;
  showScrollIndicator?: boolean;
  showTimeIndicator?: boolean;
  showPercentage?: boolean;
  onStartReading?: () => void;
  onCompleteReading?: () => void;
  onProgressChange?: (progress: number) => void;
}

interface ReadingStats {
  startTime: Date | null;
  elapsedTime: number;
  estimatedTime: number;
  isCompleted: boolean;
}

export function ReadingProgressTracker({
  className,
  targetId,
  showScrollIndicator = true,
  showTimeIndicator = true,
  showPercentage = true,
  onStartReading,
  onCompleteReading,
  onProgressChange
}: ReadingProgressTrackerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const targetRef = useRef<HTMLElement | null>(null);
  const [stats, setStats] = useState<ReadingStats>({
    startTime: null,
    elapsedTime: 0,
    estimatedTime: 0,
    isCompleted: false
  });
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [isReading, setIsReading] = useState(false);

  // 滚动进度
  const { scrollYProgress } = useScroll({
    container: targetId ? undefined : containerRef,
    target: targetId ? targetRef : undefined,
    offset: ['start start', 'end end']
  });

  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  useEffect(() => {
    if (targetId) {
      targetRef.current = document.getElementById(targetId);
    }
  }, [targetId]);

  // 计时器
  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (isReading && !stats.isCompleted) {
      interval = setInterval(() => {
        setStats((prev) => ({
          ...prev,
          elapsedTime: prev.elapsedTime + 1
        }));
      }, 1000);
    }

    return () => clearInterval(interval);
  }, [isReading, stats.isCompleted]);

  // 监听滚动开始阅读
  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      setShowScrollTop(scrollTop > 300);

      if (!isReading && scrollTop > 100) {
        setIsReading(true);
        if (!stats.startTime) {
          setStats((prev) => ({ ...prev, startTime: new Date() }));
          onStartReading?.();
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isReading, stats.startTime, onStartReading]);

  // 监听进度变化
  useEffect(() => {
    const unsubscribe = scrollYProgress.on('change', (latest) => {
      const progress = Math.round(latest * 100);
      onProgressChange?.(progress);

      // 估算剩余时间
      if (stats.startTime && stats.elapsedTime > 0) {
        const rate = progress / stats.elapsedTime;
        const remaining = rate > 0 ? Math.round((100 - progress) / rate) : 0;
        setStats((prev) => ({ ...prev, estimatedTime: remaining }));
      }

      // 完成阅读
      if (progress >= 95 && !stats.isCompleted) {
        setStats((prev) => ({ ...prev, isCompleted: true }));
        onCompleteReading?.();
      }
    });

    return () => unsubscribe();
  }, [scrollYProgress, stats.startTime, stats.elapsedTime, stats.isCompleted, onProgressChange, onCompleteReading]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const progress = Math.round(scrollYProgress.get() * 100);

  return (
    <>
      {/* 顶部进度条 */}
      <motion.div
        className={cn(
          'fixed top-0 left-0 right-0 h-1 bg-gray-900 z-50 origin-left',
          className
        )}
        style={{ scaleX }}
      />

      {/* 浮动指示器 */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className={cn(
          'fixed bottom-6 right-6 z-50',
          'bg-black/80 backdrop-blur-xl rounded-2xl border border-cyan-500/30',
          'shadow-[0_0_40px_rgba(0,240,255,0.2)]',
          'p-4 min-w-[200px]'
        )}
      >
        {/* 进度百分比 */}
        {showPercentage && (
          <div className="flex items-center gap-2 mb-3">
            <BookOpen className="w-4 h-4 text-cyan-400" />
            <div className="flex-1">
              <div className="flex justify-between text-xs text-gray-400 mb-1">
                <span>阅读进度</span>
                <span className="text-cyan-400 font-medium">{progress}%</span>
              </div>
              <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-gradient-to-r from-cyan-500 to-purple-500"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          </div>
        )}

        {/* 时间指示器 */}
        {showTimeIndicator && stats.startTime && (
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="text-gray-400 flex items-center gap-1">
                <Clock className="w-3 h-3" />
                已阅读
              </span>
              <span className="text-white font-medium">{formatTime(stats.elapsedTime)}</span>
            </div>
            {!stats.isCompleted && (
              <div className="flex items-center justify-between text-xs">
                <span className="text-gray-400 flex items-center gap-1">
                  <Eye className="w-3 h-3" />
                  预计剩余
                </span>
                <span className="text-gray-300">{formatTime(stats.estimatedTime)}</span>
              </div>
            )}
          </div>
        )}

        {/* 完成状态 */}
        {stats.isCompleted && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="mt-3 p-2 bg-green-500/20 rounded-lg flex items-center gap-2 text-green-400 text-xs"
          >
            <BookOpen className="w-4 h-4" />
            <span>阅读完成！</span>
          </motion.div>
        )}
      </motion.div>

      {/* 回到顶部按钮 */}
      <AnimatePresence>
        {showScrollIndicator && showScrollTop && (
          <motion.button
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0 }}
            onClick={scrollToTop}
            className={cn(
              'fixed bottom-6 left-6 z-50',
              'p-3 bg-gradient-to-r from-cyan-600 to-purple-600 rounded-xl',
              'text-white shadow-[0_0_20px_rgba(0,240,255,0.3)]',
              'hover:shadow-[0_0_30px_rgba(0,240,255,0.5)]',
              'transition-all duration-300'
            )}
          >
            <ChevronUp className="w-5 h-5" />
          </motion.button>
        )}
      </AnimatePresence>
    </>
  );
}

// 章节进度组件
interface ChapterProgressProps {
  chapters: {
    id: string;
    title: string;
    elementId: string;
  }[];
  currentChapter?: string;
  onChapterClick?: (chapterId: string) => void;
}

export function ChapterProgress({
  chapters,
  currentChapter,
  onChapterClick
}: ChapterProgressProps) {
  const [activeChapter, setActiveChapter] = useState(currentChapter);

  useEffect(() => {
    const handleScroll = () => {
      for (const chapter of chapters) {
        const element = document.getElementById(chapter.elementId);
        if (element) {
          const rect = element.getBoundingClientRect();
          if (rect.top <= 200 && rect.bottom >= 200) {
            setActiveChapter(chapter.id);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [chapters]);

  return (
    <nav className="sticky top-20 bg-black/50 backdrop-blur-xl rounded-2xl border border-cyan-500/30 p-4">
      <h3 className="text-sm font-bold text-white mb-3 flex items-center gap-2">
        <BookOpen className="w-4 h-4 text-cyan-400" />
        目录
      </h3>
      <ul className="space-y-2">
        {chapters.map((chapter, index) => (
          <motion.li
            key={chapter.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <button
              onClick={() => {
                onChapterClick?.(chapter.id);
                const element = document.getElementById(chapter.elementId);
                element?.scrollIntoView({ behavior: 'smooth', block: 'start' });
              }}
              className={cn(
                'w-full text-left px-3 py-2 rounded-lg transition-all duration-300 text-sm',
                activeChapter === chapter.id
                  ? 'bg-cyan-500/20 text-cyan-400 border-l-2 border-cyan-500'
                  : 'text-gray-400 hover:bg-gray-800/50 hover:text-gray-300'
              )}
            >
              {chapter.title}
            </button>
          </motion.li>
        ))}
      </ul>
    </nav>
  );
}
