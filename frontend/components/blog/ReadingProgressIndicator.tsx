/**
 * ReadingProgressIndicator - 阅读进度指示器
 * 显示文章阅读进度百分比
 */

'use client';

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

export interface ReadingProgressIndicatorProps {
  targetId?: string;
  position?: 'top' | 'bottom';
  showPercentage?: boolean;
  color?: string;
  height?: number;
  className?: string;
}

export const ReadingProgressIndicator: React.FC<ReadingProgressIndicatorProps> = ({
  targetId = 'article-content',
  position = 'top',
  showPercentage = false,
  color = 'bg-cyber-cyan',
  height = 3,
  className,
}) => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const targetElement = document.getElementById(targetId);
      if (!targetElement) return;

      const windowHeight = window.innerHeight;
      const elementTop = targetElement.offsetTop;
      const elementHeight = targetElement.offsetHeight;
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;

      // 计算进度
      const startReading = elementTop - windowHeight / 2;
      const endReading = elementTop + elementHeight - windowHeight / 2;
      const totalDistance = endReading - startReading;
      const currentDistance = scrollTop - startReading;

      let percentage = (currentDistance / totalDistance) * 100;
      percentage = Math.max(0, Math.min(100, percentage));

      setProgress(percentage);
    };

    // 初始计算
    handleScroll();

    // 添加滚动监听
    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [targetId]);

  const positionStyles = {
    top: 'top-0 left-0 right-0',
    bottom: 'bottom-0 left-0 right-0',
  };

  return (
    <div
      className={cn(
        'fixed z-50 pointer-events-none',
        positionStyles[position],
        className
      )}
      style={{ height: `${height}px` }}
    >
      {/* 背景条 */}
      <div className="absolute inset-0 bg-cyber-cyan/10" />

      {/* 进度条 */}
      <motion.div
        className={cn('absolute left-0 top-0 bottom-0', color)}
        style={{ width: `${progress}%` }}
        transition={{ duration: 0.1 }}
      />

      {/* 发光效果 */}
      <motion.div
        className={cn(
          'absolute top-0 bottom-0 w-20 blur-lg',
          color.replace('bg-', 'bg-').replace('-500', '-400')
        )}
        style={{
          left: `${progress}%`,
          transform: 'translateX(-50%)',
        }}
      />
    </div>
  );
};

/**
 * 阅读进度圆形指示器
 */
export interface ReadingProgressCircleProps {
  progress: number;
  size?: number;
  strokeWidth?: number;
  className?: string;
  showText?: boolean;
}

export const ReadingProgressCircle: React.FC<ReadingProgressCircleProps> = ({
  progress,
  size = 60,
  strokeWidth = 4,
  className,
  showText = true,
}) => {
  const normalizedProgress = Math.max(0, Math.min(100, progress));
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - (normalizedProgress / 100) * circumference;

  return (
    <div
      className={cn('relative inline-flex items-center justify-center', className)}
      style={{ width: size, height: size }}
    >
      <svg width={size} height={size} className="transform -rotate-90">
        {/* 背景圆 */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="currentColor"
          strokeWidth={strokeWidth}
          fill="none"
          className="text-cyber-cyan/10"
        />

        {/* 进度圆 */}
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="currentColor"
          strokeWidth={strokeWidth}
          fill="none"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 0.5 }}
          className="text-cyber-cyan"
          strokeLinecap="round"
        />
      </svg>

      {/* 百分比文本 */}
      {showText && (
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-xs font-bold text-cyber-cyan">
            {Math.round(normalizedProgress)}%
          </span>
        </div>
      )}
    </div>
  );
};

export default ReadingProgressIndicator;
