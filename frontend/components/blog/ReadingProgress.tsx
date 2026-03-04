'use client';

/**
 * ReadingProgress Component
 * 阅读进度指示器组件
 * 显示文章阅读进度
 */

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

interface ReadingProgressProps {
  /** 目标元素的ID，默认为文章内容 */
  targetId?: string;
  /** 进度条位置 */
  position?: 'top' | 'bottom';
  /** 进度条颜色 */
  color?: string;
  /** 进度条高度 */
  height?: number;
  /** 是否显示百分比文字 */
  showPercentage?: boolean;
  /** 自定义样式 */
  className?: string;
}

export function ReadingProgress({
  targetId = 'article-content',
  position = 'top',
  color = '#00f0ff',
  height = 3,
  showPercentage = false,
  className = '',
}: ReadingProgressProps) {
  const [progress, setProgress] = useState(0);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const targetElement = document.getElementById(targetId);

      if (!targetElement) {
        // 如果没有指定元素，使用整个页面
        const scrollTop = window.scrollY;
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        const scrollPercent = (scrollTop / docHeight) * 100;
        setProgress(Math.min(100, Math.max(0, scrollPercent)));
        return;
      }

      // 计算目标元素的阅读进度
      const elementTop = targetElement.offsetTop;
      const elementHeight = targetElement.offsetHeight;
      const windowHeight = window.innerHeight;
      const scrollTop = window.scrollY;

      // 当元素进入视口时开始计算
      const startReading = scrollTop - elementTop + windowHeight;
      const totalHeight = elementHeight;
      const percentage = (startReading / totalHeight) * 100;

      const finalProgress = Math.min(100, Math.max(0, percentage));
      setProgress(finalProgress);

      // 控制进度条显示/隐藏
      setIsVisible(scrollTop > elementTop - windowHeight);
    };

    // 初始计算
    handleScroll();

    // 添加滚动监听
    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [targetId]);

  if (!isVisible && position === 'top') {
    return null;
  }

  return (
    <div className={`fixed left-0 right-0 z-50 ${position === 'top' ? 'top-0' : 'bottom-0'} ${className}`}>
      {/* 进度条背景 */}
      <div
        className="w-full bg-cyber-dark/50"
        style={{ height: `${height}px` }}
      >
        {/* 进度条 */}
        <motion.div
          className="h-full"
          style={{ backgroundColor: color }}
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.1 }}
        />
      </div>

      {/* 百分比显示 */}
      {showPercentage && (
        <div className="absolute right-4 -top-8 px-3 py-1 bg-cyber-card border border-cyber-border rounded-lg">
          <span className="text-xs font-mono text-cyber-cyan">
            {Math.round(progress)}%
          </span>
        </div>
      )}
    </div>
  );
}

/**
 * CircularReadingProgress Component
 * 圆形阅读进度指示器
 */
interface CircularReadingProgressProps {
  /** 目标元素的ID */
  targetId?: string;
  /** 圆形进度条大小 */
  size?: number;
  /** 进度条宽度 */
  strokeWidth?: number;
  /** 进度条颜色 */
  color?: string;
  /** 背景颜色 */
  backgroundColor?: string;
  /** 是否显示百分比 */
  showPercentage?: boolean;
  /** 自定义样式 */
  className?: string;
  /** 位置 */
  position?: {
    top?: string;
    bottom?: string;
    left?: string;
    right?: string;
  };
}

export function CircularReadingProgress({
  targetId = 'article-content',
  size = 60,
  strokeWidth = 4,
  color = '#00f0ff',
  backgroundColor = 'rgba(26, 26, 46, 0.8)',
  showPercentage = true,
  className = '',
  position = { bottom: '2rem', right: '2rem' },
}: CircularReadingProgressProps) {
  const [progress, setProgress] = useState(0);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const targetElement = document.getElementById(targetId);

      if (!targetElement) {
        const scrollTop = window.scrollY;
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        const scrollPercent = (scrollTop / docHeight) * 100;
        setProgress(Math.min(100, Math.max(0, scrollPercent)));
        return;
      }

      const elementTop = targetElement.offsetTop;
      const elementHeight = targetElement.offsetHeight;
      const windowHeight = window.innerHeight;
      const scrollTop = window.scrollY;

      const startReading = scrollTop - elementTop + windowHeight;
      const totalHeight = elementHeight;
      const percentage = (startReading / totalHeight) * 100;

      const finalProgress = Math.min(100, Math.max(0, percentage));
      setProgress(finalProgress);
      setIsVisible(scrollTop > elementTop - windowHeight);
    };

    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [targetId]);

  if (!isVisible) {
    return null;
  }

  // SVG圆形进度条参数
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (progress / 100) * circumference;

  return (
    <div
      className={`fixed z-50 ${className}`}
      style={{
        width: `${size}px`,
        height: `${size}px`,
        ...position,
      }}
    >
      <svg
        width={size}
        height={size}
        className="transform -rotate-90"
      >
        {/* 背景圆 */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="rgba(42, 42, 74, 0.5)"
          strokeWidth={strokeWidth}
        />

        {/* 进度圆 */}
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 0.1 }}
          style={{
            filter: `drop-shadow(0 0 6px ${color})`,
          }}
        />
      </svg>

      {/* 百分比文字 */}
      {showPercentage && (
        <div
          className="absolute inset-0 flex items-center justify-center"
          style={{ backgroundColor: 'transparent' }}
        >
          <span className="text-xs font-mono font-bold text-white">
            {Math.round(progress)}%
          </span>
        </div>
      )}
    </div>
  );
}
