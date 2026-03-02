/**
 * 阅读进度条组件
 */

'use client';

import { motion, useScroll, useSpring } from 'framer-motion';
import { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';

export interface ReadingProgressBarProps {
  className?: string;
  position?: 'top' | 'bottom';
  color?: 'cyan' | 'purple' | 'pink' | 'yellow';
  height?: number;
  showPercentage?: boolean;
  style?: 'fixed' | 'sticky';
}

export function ReadingProgressBar({
  className,
  position = 'top',
  color = 'cyan',
  height = 3,
  showPercentage = false,
  style = 'fixed',
}: ReadingProgressBarProps) {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  });

  const [percentage, setPercentage] = useState(0);

  useEffect(() => {
    const unsubscribe = scrollYProgress.on('change', (latest) => {
      setPercentage(Math.round(latest * 100));
    });
    return () => unsubscribe();
  }, [scrollYProgress]);

  const colors = {
    cyan: 'bg-cyber-cyan',
    purple: 'bg-cyber-purple',
    pink: 'bg-cyber-pink',
    yellow: 'bg-cyber-yellow',
  };

  const positionClasses = {
    top: style === 'fixed' ? 'top-0' : 'top-0',
    bottom: style === 'fixed' ? 'bottom-0' : 'bottom-0',
  };

  return (
    <div
      className={cn(
        'left-0 right-0 z-50',
        positionClasses[position],
        style === 'fixed' ? 'fixed' : 'sticky',
        className
      )}
    >
      {/* 进度条 */}
      <div className="h-px bg-cyber-border/50">
        <motion.div
          className={cn('h-full origin-left', colors[color])}
          style={{
            height,
            scaleX,
          }}
        />
      </div>

      {/* 百分比显示 */}
      {showPercentage && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className={cn(
            'px-3 py-1 text-xs font-mono bg-cyber-dark/90 backdrop-blur-sm',
            position === 'top' ? 'float-right mt-1' : 'float-right mb-1'
          )}
        >
          {percentage}%
        </motion.div>
      )}
    </div>
  );
}

// 圆形进度指示器
export function CircularProgressIndicator({ className }: { className?: string }) {
  const { scrollYProgress } = useScroll();
  const [percentage, setPercentage] = useState(0);

  useEffect(() => {
    const unsubscribe = scrollYProgress.on('change', (latest) => {
      setPercentage(Math.round(latest * 100));
    });
    return () => unsubscribe();
  }, [scrollYProgress]);

  return (
    <div className={cn('fixed top-24 right-4 z-40', className)}>
      <div className="relative w-12 h-12">
        <svg className="transform -rotate-90 w-12 h-12">
          <circle
            cx="24"
            cy="24"
            r="20"
            stroke="currentColor"
            strokeWidth="3"
            fill="transparent"
            className="text-cyber-border/30"
          />
          <motion.circle
            cx="24"
            cy="24"
            r="20"
            stroke="currentColor"
            strokeWidth="3"
            fill="transparent"
            strokeDasharray={125.6}
            strokeDashoffset={125.6 - (125.6 * percentage) / 100}
            className="text-cyber-cyan"
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-xs font-mono text-cyber-cyan">{percentage}%</span>
        </div>
      </div>
    </div>
  );
}

// 侧边阅读进度条
export function SideReadingProgress({ className }: { className?: string }) {
  const { scrollYProgress } = useScroll();

  return (
    <div className={cn('fixed right-0 top-0 bottom-0 w-1 z-50', className)}>
      <motion.div
        className="h-full bg-gradient-to-b from-cyber-cyan via-cyber-purple to-cyber-pink origin-top"
        style={{ scaleY: scrollYProgress }}
      />
    </div>
  );
}

// 阅读时间估算
export function ReadingTimeEstimate({
  content,
  wordsPerMinute = 200,
}: {
  content: string;
  wordsPerMinute?: number;
}) {
  const words = content.trim().split(/\s+/).length;
  const minutes = Math.ceil(words / wordsPerMinute);

  return (
    <div className="flex items-center gap-2 text-sm text-gray-400">
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
        />
      </svg>
      <span>阅读时间: {minutes} 分钟</span>
    </div>
  );
}

// 滚动提示组件
export function ScrollIndicator() {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const handleScroll = () => {
      setIsVisible(window.scrollY < 100);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: isVisible ? 1 : 0, y: isVisible ? 0 : -20 }}
      className="fixed bottom-8 left-1/2 -translate-x-1/2 z-40"
    >
      <motion.div
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
        className="w-6 h-10 border-2 border-cyber-cyan/50 rounded-full flex items-start justify-center p-2 cursor-pointer"
        onClick={() => window.scrollTo({ top: window.innerHeight, behavior: 'smooth' })}
      >
        <motion.div className="w-1.5 h-1.5 bg-cyber-cyan rounded-full" />
      </motion.div>
    </motion.div>
  );
}

// 返回顶部按钮（带进度）
export function BackToTopWithProgress() {
  const [scrollProgress, setScrollProgress] = useState(0);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = scrollTop / docHeight;
      setScrollProgress(Math.min(progress, 1));
      setIsVisible(scrollTop > 300);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <motion.button
      initial={{ scale: 0, opacity: 0 }}
      animate={{
        scale: isVisible ? 1 : 0,
        opacity: isVisible ? 1 : 0,
      }}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      onClick={scrollToTop}
      className="fixed bottom-8 right-8 w-12 h-12 z-40 rounded-full bg-cyber-card border border-cyber-cyan/30 text-cyber-cyan hover:bg-cyber-cyan hover:text-cyber-dark transition-all shadow-neon-cyan"
      aria-label="返回顶部"
    >
      <div className="absolute inset-0 flex items-center justify-center">
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
        </svg>
      </div>

      {/* 圆形进度 */}
      <svg className="absolute inset-0 transform -rotate-90 w-12 h-12 -z-10">
        <motion.circle
          cx="24"
          cy="24"
          r="22"
          stroke="currentColor"
          strokeWidth="2"
          fill="transparent"
          className="text-cyber-cyan/30"
          strokeDasharray={138.16}
          strokeDashoffset={138.16 * (1 - scrollProgress)}
        />
      </svg>
    </motion.button>
  );
}

// 章节进度导航
export function ChapterProgress({
  chapters,
}: {
  chapters: { id: string; title: string }[];
}) {
  const [activeChapter, setActiveChapter] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const chapterElements = chapters.map((ch) =>
        document.getElementById(ch.id)
      );

      for (let i = chapterElements.length - 1; i >= 0; i--) {
        const element = chapterElements[i];
        if (element) {
          const rect = element.getBoundingClientRect();
          if (rect.top <= 200) {
            setActiveChapter(i);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [chapters]);

  return (
    <div className="fixed right-4 top-1/2 -translate-y-1/2 z-40 space-y-3">
      {chapters.map((chapter, index) => (
        <motion.button
          key={chapter.id}
          whileHover={{ scale: 1.2 }}
          onClick={() => {
            document.getElementById(chapter.id)?.scrollIntoView({
              behavior: 'smooth',
            });
          }}
          className={cn(
            'w-3 h-3 rounded-full transition-all',
            index === activeChapter
              ? 'bg-cyber-cyan shadow-neon-cyan'
              : 'bg-cyber-border hover:bg-cyber-purple'
          )}
          title={chapter.title}
        />
      ))}
    </div>
  );
}
