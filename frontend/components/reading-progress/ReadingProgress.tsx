'use client';

import React, { useEffect, useState, useRef } from 'react';
import { motion, useScroll, useSpring } from 'framer-motion';
import { cn } from '@/lib/utils';

/**
 * ReadingProgress Bar - 文章阅读进度条组件
 *
 * 功能特性：
 * - 顶部/底部固定进度条
 * - 圆形进度指示器
 * - 自定义颜色和主题
 * - 平滑动画效果
 * - 响应式设计
 */

export interface ReadingProgressProps {
  /** 进度条位置 */
  position?: 'top' | 'bottom' | 'both';
  /** 进度条样式 */
  variant?: 'bar' | 'circle' | 'dots';
  /** 进度条颜色 */
  color?: string;
  /** 进度条高度（bar模式） */
  height?: number;
  /** 是否显示百分比文本 */
  showPercentage?: boolean;
  /** 容器类名 */
  className?: string;
  /** 自定义样式 */
  style?: React.CSSProperties;
  /** 阅读目标（用于圆形进度） */
  target?: number;
  /** 是否启用渐变效果 */
  gradient?: boolean;
  /** 渐变起始颜色 */
  gradientFrom?: string;
  /** 渐变结束颜色 */
  gradientTo?: string;
}

/**
 * 进度条组件
 */
const ProgressBar: React.FC<{
  progress: number;
  height: number;
  color: string;
  gradient: boolean;
  gradientFrom: string;
  gradientTo: string;
  className?: string;
}> = ({ progress, height, color, gradient, gradientFrom, gradientTo, className }) => {
  return (
    <div
      className={cn(
        'fixed left-0 right-0 z-50',
        className
      )}
      style={{
        height: `${height}px`,
        backgroundColor: 'rgba(0, 0, 0, 0.1)',
      }}
    >
      <motion.div
        className="h-full"
        style={{
          width: `${progress}%`,
          backgroundColor: color,
          backgroundImage: gradient
            ? `linear-gradient(90deg, ${gradientFrom}, ${gradientTo})`
            : undefined,
        }}
        initial={{ width: 0 }}
        animate={{ width: `${progress}%` }}
        transition={{ duration: 0.3, ease: 'easeOut' }}
      />
    </div>
  );
};

/**
 * 圆形进度指示器
 */
const CircleProgress: React.FC<{
  progress: number;
  color: string;
  size?: number;
  showPercentage?: boolean;
  className?: string;
}> = ({ progress, color, size = 60, showPercentage = true, className }) => {
  const radius = (size - 8) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  return (
    <div
      className={cn(
        'fixed z-50 flex items-center justify-center',
        className
      )}
      style={{
        width: `${size}px`,
        height: `${size}px`,
      }}
    >
      <svg width={size} height={size} className="transform -rotate-90">
        {/* 背景圆 */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="rgba(255, 255, 255, 0.1)"
          strokeWidth="4"
          fill="none"
        />
        {/* 进度圆 */}
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={color}
          strokeWidth="4"
          fill="none"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset }}
          transition={{ duration: 0.3, ease: 'easeOut' }}
          strokeLinecap="round"
          style={{
            filter: `drop-shadow(0 0 6px ${color})`,
          }}
        />
      </svg>
      {showPercentage && (
        <span className="absolute text-xs font-bold" style={{ color }}>
          {Math.round(progress)}%
        </span>
      )}
    </div>
  );
};

/**
 * 点状进度指示器
 */
const DotsProgress: React.FC<{
  progress: number;
  color: string;
  dotCount?: number;
  className?: string;
}> = ({ progress, color, dotCount = 10, className }) => {
  const activeDots = Math.floor((progress / 100) * dotCount);

  return (
    <div
      className={cn(
        'fixed left-1/2 transform -translate-x-1/2 z-50 flex items-center gap-1.5',
        className
      )}
    >
      {Array.from({ length: dotCount }).map((_, i) => (
        <motion.div
          key={i}
          className="rounded-full transition-colors duration-300"
          style={{
            width: '8px',
            height: '8px',
            backgroundColor: i < activeDots ? color : 'rgba(255, 255, 255, 0.2)',
            boxShadow: i < activeDots ? `0 0 8px ${color}` : 'none',
          }}
          initial={{ scale: 0.8 }}
          animate={{ scale: i < activeDots ? 1 : 0.8 }}
          transition={{ duration: 0.2 }}
        />
      ))}
    </div>
  );
};

/**
 * ReadingProgress 主组件
 */
export const ReadingProgress: React.FC<ReadingProgressProps> = ({
  position = 'top',
  variant = 'bar',
  color = '#00f0ff',
  height = 3,
  showPercentage = false,
  className,
  style,
  target = 100,
  gradient = false,
  gradientFrom = '#00f0ff',
  gradientTo = '#9d00ff',
}) => {
  const [progress, setProgress] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    container: containerRef,
    offset: ['start start', 'end end'],
  });

  const smoothProgress = useSpring(scrollYProgress, {
    damping: 20,
    stiffness: 100,
  });

  useEffect(() => {
    const unsubscribe = smoothProgress.on('change', (latest) => {
      setProgress(Math.min(latest * 100, 100));
    });
    return unsubscribe;
  }, [smoothProgress]);

  // 根据位置确定类名
  const getPositionClass = (pos: string) => {
    switch (pos) {
      case 'top':
        return 'top-0';
      case 'bottom':
        return 'bottom-0';
      default:
        return 'top-0';
    }
  };

  // 渲染进度指示器
  const renderProgress = () => {
    const posClass = getPositionClass(position);

    switch (variant) {
      case 'circle':
        return (
          <CircleProgress
            progress={progress}
            color={color}
            showPercentage={showPercentage}
            className={cn(posClass, 'right-6 m-4', className)}
          />
        );

      case 'dots':
        return (
          <DotsProgress
            progress={progress}
            color={color}
            className={cn(posClass, 'py-3', className)}
          />
        );

      default:
        return (
          <ProgressBar
            progress={progress}
            height={height}
            color={color}
            gradient={gradient}
            gradientFrom={gradientFrom}
            gradientTo={gradientTo}
            className={cn(posClass, className)}
          />
        );
    }
  };

  return (
    <div ref={containerRef} style={style}>
      {position === 'both' || position === 'top' ? renderProgress() : null}
      {position === 'both' ? (
        <div className="mt-8">
          {renderProgress()}
        </div>
      ) : null}
    </div>
  );
};

/**
 * 便捷组件：顶部进度条
 */
export const TopProgressBar: React.FC<Omit<ReadingProgressProps, 'position'>> = (props) => {
  return <ReadingProgress {...props} position="top" />;
};

/**
 * 便捷组件：底部进度条
 */
export const BottomProgressBar: React.FC<Omit<ReadingProgressProps, 'position'>> = (props) => {
  return <ReadingProgress {...props} position="bottom" />;
};

/**
 * 便捷组件：圆形进度指示器
 */
export const CircleProgressIndicator: React.FC<
  Omit<ReadingProgressProps, 'position' | 'variant'> & {
    position?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left';
  }
> = ({ position = 'bottom-right', ...props }) => {
  const posClass = {
    'top-right': 'top-6 right-6',
    'top-left': 'top-6 left-6',
    'bottom-right': 'bottom-6 right-6',
    'bottom-left': 'bottom-6 left-6',
  }[position];

  return (
    <ReadingProgress
      {...props}
      position="top"
      variant="circle"
      className={posClass}
    />
  );
};

export default ReadingProgress;
