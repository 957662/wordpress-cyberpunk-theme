'use client';

import { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Clock, Eye, Award, BookOpen } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ReadingProgressSystemProps {
  content: string;
  className?: string;
  showStats?: boolean;
  showProgress?: boolean;
  showTime?: boolean;
  position?: 'top' | 'bottom' | 'floating';
  theme?: 'cyan' | 'purple' | 'pink' | 'green';
}

interface ReadingStats {
  estimatedTime: number;
  actualTime: number;
  progress: number;
  isComplete: boolean;
  wordsRead: number;
  totalWords: number;
}

export function ReadingProgressSystem({
  content,
  className,
  showStats = true,
  showProgress = true,
  showTime = true,
  position = 'top',
  theme = 'cyan',
}: ReadingProgressSystemProps) {
  const [stats, setStats] = useState<ReadingStats>({
    estimatedTime: 0,
    actualTime: 0,
    progress: 0,
    isComplete: false,
    wordsRead: 0,
    totalWords: 0,
  });

  const [isHovered, setIsHovered] = useState(false);
  const startTimeRef = useRef<number>(Date.now());
  const containerRef = useRef<HTMLDivElement>(null);
  const hasCompletedRef = useRef(false);

  // Calculate reading time (average 200 words per minute)
  useEffect(() => {
    const words = content.trim().split(/\s+/).length;
    const estimatedMinutes = Math.ceil(words / 200);

    setStats(prev => ({
      ...prev,
      totalWords: words,
      estimatedTime: estimatedMinutes,
    }));
  }, [content]);

  // Track scroll progress
  useEffect(() => {
    const handleScroll = () => {
      if (!containerRef.current) return;

      const container = containerRef.current;
      const scrollTop = window.scrollY;
      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight;

      // Calculate progress based on article position
      const containerTop = container.offsetTop;
      const containerHeight = container.offsetHeight;
      const containerBottom = containerTop + containerHeight;

      // Check if article is in view
      if (scrollTop >= containerTop && scrollTop <= containerBottom) {
        const progress = Math.min(
          100,
          Math.max(0, ((scrollTop - containerTop) / (containerHeight - windowHeight)) * 100)
        );

        setStats(prev => ({
          ...prev,
          progress: Math.round(progress),
          wordsRead: Math.round((progress / 100) * prev.totalWords),
        }));
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Track actual reading time
  useEffect(() => {
    const interval = setInterval(() => {
      if (stats.progress > 0 && stats.progress < 100) {
        const elapsed = Math.floor((Date.now() - startTimeRef.current) / 1000 / 60);
        setStats(prev => ({
          ...prev,
          actualTime: elapsed,
        }));
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [stats.progress]);

  // Check completion
  useEffect(() => {
    if (stats.progress >= 95 && !hasCompletedRef.current) {
      hasCompletedRef.current = true;
      setStats(prev => ({ ...prev, isComplete: true }));

      // Optional: Show completion animation or trigger callback
      if (typeof window !== 'undefined' && (window as any).gtag) {
        (window as any).gtag('event', 'article_complete', {
          estimated_time: stats.estimatedTime,
          actual_time: stats.actualTime,
        });
      }
    }
  }, [stats.progress, stats.estimatedTime, stats.actualTime]);

  const themeColors = {
    cyan: {
      primary: '#00f0ff',
      glow: 'rgba(0, 240, 255, 0.5)',
    },
    purple: {
      primary: '#9d00ff',
      glow: 'rgba(157, 0, 255, 0.5)',
    },
    pink: {
      primary: '#ff0080',
      glow: 'rgba(255, 0, 128, 0.5)',
    },
    green: {
      primary: '#00ff88',
      glow: 'rgba(0, 255, 136, 0.5)',
    },
  };

  const colors = themeColors[theme];

  const formatTime = (minutes: number) => {
    if (minutes < 1) return '< 1m';
    if (minutes < 60) return `${minutes}m`;
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
  };

  const PositionWrapper = position === 'floating' ? motion.div : 'div';
  const positionProps = position === 'floating' ? {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    className: 'fixed bottom-6 right-6 z-50',
  } : {};

  return (
    <PositionWrapper {...positionProps}>
      <div
        ref={containerRef}
        className={cn(
          'reading-progress-system',
          'bg-black/40 backdrop-blur-md',
          'border border-white/10',
          'rounded-lg overflow-hidden',
          'transition-all duration-300',
          isHovered && 'shadow-lg',
          position === 'floating' && 'p-4',
          position !== 'floating' && 'mb-4 p-3',
          className
        )}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Progress Bar */}
        {showProgress && (
          <div className="relative h-1 bg-white/5 rounded-full overflow-hidden mb-3">
            <motion.div
              className="absolute top-0 left-0 h-full rounded-full"
              style={{
                backgroundColor: colors.primary,
                boxShadow: `0 0 10px ${colors.glow}`,
              }}
              initial={{ width: 0 }}
              animate={{ width: `${stats.progress}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>
        )}

        {/* Stats Panel */}
        <AnimatePresence>
          {(showStats || showTime || isHovered) && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="space-y-2"
            >
              <div className="flex items-center justify-between">
                {/* Reading Time */}
                {showTime && (
                  <div className="flex items-center gap-2 text-xs text-gray-400">
                    <Clock className="w-4 h-4" style={{ color: colors.primary }} />
                    <span>
                      {formatTime(stats.actualTime || stats.estimatedTime)}阅读
                    </span>
                    {stats.actualTime > 0 && stats.actualTime !== stats.estimatedTime && (
                      <span className="text-gray-500">
                        (预计 {formatTime(stats.estimatedTime)})
                      </span>
                    )}
                  </div>
                )}

                {/* Progress Percentage */}
                {showStats && (
                  <div className="flex items-center gap-2 text-xs">
                    <Eye className="w-4 h-4 text-gray-400" />
                    <span className="text-gray-300 font-mono">
                      {stats.progress}%
                    </span>
                  </div>
                )}
              </div>

              {/* Word Count */}
              {showStats && stats.progress > 0 && (
                <div className="flex items-center justify-between text-xs text-gray-500">
                  <div className="flex items-center gap-2">
                    <BookOpen className="w-3 h-3" />
                    <span>
                      {stats.wordsRead.toLocaleString()} / {stats.totalWords.toLocaleString()} 字
                    </span>
                  </div>
                  {stats.isComplete && (
                    <div className="flex items-center gap-1 text-green-400">
                      <Award className="w-3 h-3" />
                      <span className="font-medium">已完成</span>
                    </div>
                  )}
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Completion Badge */}
        <AnimatePresence>
          {stats.isComplete && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="mt-3 p-2 bg-green-500/10 border border-green-500/30 rounded-lg"
            >
              <div className="flex items-center gap-2 text-green-400">
                <Award className="w-4 h-4" />
                <span className="text-xs font-medium">
                  恭喜！您已读完这篇文章
                </span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </PositionWrapper>
  );
}

// Predefined presets
export function CompactReadingProgress({ content, className }: { content: string; className?: string }) {
  return (
    <ReadingProgressSystem
      content={content}
      className={className}
      showStats={false}
      showTime={false}
      position="top"
      theme="cyan"
    />
  );
}

export function FloatingReadingProgress({ content }: { content: string }) {
  return (
    <ReadingProgressSystem
      content={content}
      showStats
      showProgress
      showTime
      position="floating"
      theme="purple"
    />
  );
}

export function DetailedReadingStats({ content, className }: { content: string; className?: string }) {
  return (
    <ReadingProgressSystem
      content={content}
      className={className}
      showStats
      showProgress
      showTime
      position="bottom"
      theme="green"
    />
  );
}
