/**
 * 阅读进度条组件
 * 显示页面滚动阅读进度
 */

'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface ReadingProgressBarProps {
  className?: string;
  color?: string;
  height?: number;
  position?: 'top' | 'bottom';
  showPercentage?: boolean;
}

export function ReadingProgressBar({
  className,
  color = 'var(--cyber-primary)',
  height = 4,
  position = 'top',
  showPercentage = false,
}: ReadingProgressBarProps) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight;
      const scrollTop = window.scrollY;
      const scrollableHeight = documentHeight - windowHeight;
      const scrollProgress = (scrollTop / scrollableHeight) * 100;
      setProgress(Math.min(100, Math.max(0, scrollProgress)));
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      <motion.div
        className={cn(
          'fixed left-0 right-0 z-50 origin-left',
          position === 'top' ? 'top-0' : 'bottom-0',
          className
        )}
        style={{
          height: `${height}px`,
          backgroundColor: 'transparent',
        }}
      >
        <motion.div
          className="h-full"
          style={{
            backgroundColor: color,
            scaleX: progress / 100,
            transformOrigin: 'left',
          }}
        />
      </motion.div>
      {showPercentage && (
        <div
          className={cn(
            'fixed z-50 rounded-lg bg-foreground/10 px-2 py-1 text-xs font-medium backdrop-blur-sm',
            position === 'top' ? 'top-2 right-2' : 'bottom-2 right-2'
          )}
        >
          {Math.round(progress)}%
        </div>
      )}
    </>
  );
}
