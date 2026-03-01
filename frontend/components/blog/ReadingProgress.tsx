'use client';

import React, { useEffect, useState } from 'react';
import { motion, useSpring, useMotionValue } from 'framer-motion';
import { cn } from '@/lib/utils';

interface ReadingProgressProps {
  className?: string;
  variant?: 'top' | 'bottom' | 'both';
  color?: 'cyan' | 'purple' | 'pink' | 'gradient';
  height?: number;
  showPercentage?: boolean;
  smooth?: boolean;
}

export const ReadingProgress: React.FC<ReadingProgressProps> = ({
  className,
  variant = 'top',
  color = 'gradient',
  height = 3,
  showPercentage = false,
  smooth = true,
}) => {
  const [progress, setProgress] = useState(0);
  const springProgress = useSpring(0, { stiffness: 100, damping: 30 });

  useEffect(() => {
    if (!smooth) {
      springProgress.set(progress);
      return;
    }

    springProgress.set(progress);
  }, [progress, springProgress, smooth]);

  useEffect(() => {
    const handleScroll = () => {
      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight;
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      const scrollableHeight = documentHeight - windowHeight;
      const scrollProgress = (scrollTop / scrollableHeight) * 100;

      setProgress(Math.min(Math.max(scrollProgress, 0), 100));
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const colorClasses: Record<string, string> = {
    cyan: 'bg-cyber-cyan',
    purple: 'bg-cyber-purple',
    pink: 'bg-cyber-pink',
    gradient: 'bg-gradient-to-r from-cyber-cyan via-cyber-purple to-cyber-pink',
  };

  const progressBar = (
    <motion.div
      className={cn(
        'origin-left',
        colorClasses[color],
        smooth && 'transition-transform'
      )}
      style={{
        scaleX: smooth ? springProgress : progress / 100,
      }}
    />
  );

  const topBar = variant === 'top' || variant === 'both' ? (
    <div className="fixed top-0 left-0 right-0 z-50 h-1 bg-dark-800">
      <motion.div
        className={cn('h-full', colorClasses[color])}
        style={{
          width: smooth ? `${springProgress.get()}%` : `${progress}%`,
        }}
      />
    </div>
  ) : null;

  const bottomBar = variant === 'bottom' || variant === 'both' ? (
    <div className="fixed bottom-0 left-0 right-0 z-50 h-1 bg-dark-800">
      <motion.div
        className={cn('h-full', colorClasses[color])}
        style={{
          width: smooth ? `${springProgress.get()}%` : `${progress}%`,
        }}
      />
    </div>
  ) : null;

  return (
    <>
      {topBar}
      {bottomBar}
      {showPercentage && (
        <div
          className={cn(
            'fixed bottom-6 right-6 z-50',
            'px-3 py-2 rounded-lg bg-dark-800/90 backdrop-blur-sm',
            'border border-dark-700 shadow-lg',
            className
          )}
        >
          <div className="text-sm font-mono text-gray-400">
            {Math.round(smooth ? springProgress.get() : progress)}%
          </div>
        </div>
      )}
    </>
  );
};

interface ChapterProgressProps {
  chapters: Array<{
    id: string;
    title: string;
    elementId: string;
  }>;
  className?: string;
}

export const ChapterProgress: React.FC<ChapterProgressProps> = ({
  chapters,
  className,
}) => {
  const [currentChapter, setCurrentChapter] = useState<string | null>(null);

  useEffect(() => {
    const handleScroll = () => {
      const chapterElements = chapters
        .map((chapter) => ({
          ...chapter,
          element: document.getElementById(chapter.elementId),
        }))
        .filter((chapter) => chapter.element !== null);

      const viewportMiddle = window.innerHeight / 2;
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;

      for (const chapter of chapterElements) {
        const element = chapter.element!;
        const rect = element.getBoundingClientRect();
        const elementTop = rect.top + scrollTop;

        if (elementTop <= scrollTop + viewportMiddle) {
          setCurrentChapter(chapter.id);
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    return () => window.removeEventListener('scroll', handleScroll);
  }, [chapters]);

  const scrollToChapter = (elementId: string) => {
    const element = document.getElementById(elementId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <nav
      className={cn(
        'fixed right-6 top-1/2 transform -translate-y-1/2 z-40',
        'hidden lg:block',
        className
      )}
    >
      <div className="flex flex-col gap-2 p-3 rounded-lg bg-dark-800/90 backdrop-blur-sm border border-dark-700">
        {chapters.map((chapter, index) => {
          const isActive = chapter.id === currentChapter;
          const isCompleted = chapters.findIndex((ch) => ch.id === currentChapter) > index;

          return (
            <button
              key={chapter.id}
              onClick={() => scrollToChapter(chapter.elementId)}
              className={cn(
                'w-2 h-2 rounded-full transition-all',
                isActive
                  ? 'bg-cyber-cyan w-3 h-3'
                  : isCompleted
                  ? 'bg-cyber-purple'
                  : 'bg-dark-700'
              )}
              title={chapter.title}
            />
          );
        })}
      </div>
    </nav>
  );
};

interface ScrollIndicatorProps {
  className?: string;
  onClick?: () => void;
}

export const ScrollIndicator: React.FC<ScrollIndicatorProps> = ({
  className,
  onClick,
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 1, duration: 0.5 }}
      className={cn('fixed bottom-8 left-1/2 transform -translate-x-1/2 z-40', className)}
    >
      <motion.button
        onClick={onClick}
        className="flex flex-col items-center gap-2 text-gray-400 hover:text-cyber-cyan transition-colors"
        animate={{ y: [0, 10, 0] }}
        transition={{ repeat: Infinity, duration: 1.5 }}
      >
        <span className="text-xs">向下滚动</span>
        <svg
          className="w-6 h-6"
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path d="M19 14l-7 7m0 0l-7-7m7 7V3"></path>
        </svg>
      </motion.button>
    </motion.div>
  );
};

interface EstimatedReadTimeProps {
  content: string;
  wordsPerMinute?: number;
  className?: string;
  variant?: 'default' | 'compact';
}

export const EstimatedReadTime: React.FC<EstimatedReadTimeProps> = ({
  content,
  wordsPerMinute = 200,
  className,
  variant = 'default',
}) => {
  const wordCount = content.trim().split(/\s+/).length;
  const readTime = Math.ceil(wordCount / wordsPerMinute);

  if (variant === 'compact') {
    return (
      <span className={cn('text-xs text-gray-500', className)}>
        {readTime} 分钟阅读
      </span>
    );
  }

  return (
    <div
      className={cn(
        'inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-dark-800 border border-dark-700',
        className
      )}
    >
      <svg
        className="w-4 h-4 text-cyber-cyan"
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
      </svg>
      <span className="text-sm text-gray-300">
        约 <span className="font-semibold text-cyber-cyan">{readTime}</span>{' '}
        分钟阅读
      </span>
    </div>
  );
};

export default ReadingProgress;
