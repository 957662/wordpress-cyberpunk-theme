'use client';

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface ReadingProgressProps {
  position?: 'top' | 'bottom';
  color?: 'cyan' | 'purple' | 'pink' | 'gradient';
  size?: 'thin' | 'medium' | 'thick';
  showPercentage?: boolean;
  className?: string;
}

export const ReadingProgress: React.FC<ReadingProgressProps> = ({
  position = 'top',
  color = 'cyan',
  size = 'medium',
  showPercentage = false,
  className,
}) => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const calculateProgress = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight;
      const winHeight = window.innerHeight;
      const scrollPercent = (scrollTop / (docHeight - winHeight)) * 100;
      setProgress(Math.min(100, Math.max(0, scrollPercent)));
    };

    let ticking = false;
    const onScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          calculateProgress();
          ticking = false;
        });
        ticking = true;
      }
    };

    calculateProgress();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const sizeClasses = {
    thin: 'h-[2px]',
    medium: 'h-[4px]',
    thick: 'h-[6px]',
  };

  const colorClasses = {
    cyan: 'bg-cyan-500',
    purple: 'bg-purple-500',
    pink: 'bg-pink-500',
    gradient: 'bg-gradient-to-r from-cyan-500 via-purple-500 to-pink-500',
  };

  const shadowColor = {
    cyan: 'shadow-cyan-500/50',
    purple: 'shadow-purple-500/50',
    pink: 'shadow-pink-500/50',
    gradient: 'shadow-purple-500/50',
  };

  return (
    <div className={cn('fixed left-0 right-0 z-50', position === 'top' ? 'top-0' : 'bottom-0', className)}>
      <div className={cn('w-full bg-gray-200 dark:bg-gray-800', sizeClasses[size])}>
        <motion.div
          className={cn('transition-all duration-150 ease-out', colorClasses[color], `shadow-lg ${shadowColor[color]}`)}
          style={{ width: `${progress}%` }}
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.2 }}
        />
      </div>
      {showPercentage && (
        <div className="absolute right-4 -top-8">
          <div className="bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 text-xs px-2 py-1 rounded-full font-medium">
            {Math.round(progress)}%
          </div>
        </div>
      )}
    </div>
  );
};

export default ReadingProgress;
