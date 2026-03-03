'use client';

/**
 * ReadingProgress - 阅读进度条组件
 * 显示用户在页面上的阅读进度
 */

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

interface ReadingProgressProps {
  /** 颜色主题 */
  color?: string;
  /** 高度 */
  height?: number;
  /** 位置 */
  position?: 'top' | 'bottom';
  /** 显示百分比文字 */
  showPercentage?: boolean;
  /** 自定义样式类名 */
  className?: string;
}

export function ReadingProgress({
  color = '#00f0ff',
  height = 3,
  position = 'top',
  showPercentage = false,
  className = '',
}: ReadingProgressProps) {
  const [progress, setProgress] = useState(0);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight;
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      const scrollableHeight = documentHeight - windowHeight;
      const scrolled = (scrollTop / scrollableHeight) * 100;

      setProgress(Math.min(Math.max(scrolled, 0), 100));

      // 只在滚动后显示进度条
      if (scrollTop > 100) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    // 初始化
    handleScroll();

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      {/* 进度条 */}
      <motion.div
        initial={{ opacity: 0, y: position === 'top' ? -10 : 10 }}
        animate={{ opacity: isVisible ? 1 : 0, y: isVisible ? 0 : (position === 'top' ? -10 : 10) }}
        transition={{ duration: 0.3 }}
        className={`fixed left-0 right-0 z-50 ${position === 'top' ? 'top-0' : 'bottom-0'} ${className}`}
        style={{ height: `${height}px` }}
      >
        {/* 背景轨道 */}
        <div className="absolute inset-0 bg-cyber-border/30" />

        {/* 进度填充 */}
        <motion.div
          className="absolute left-0 top-0 bottom-0 bg-gradient-to-r from-cyber-cyan via-cyber-purple to-cyber-pink"
          style={{
            width: `${progress}%`,
            boxShadow: `0 0 ${height * 3}px ${color}`,
          }}
          transition={{ duration: 0.1 }}
        />

        {/* 发光效果 */}
        <motion.div
          className="absolute top-0 bottom-0 w-1 bg-white/80 blur-sm"
          style={{ left: `${progress}%` }}
        />
      </motion.div>

      {/* 百分比指示器 */}
      {showPercentage && isVisible && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className={`fixed ${position === 'top' ? 'top-4' : 'bottom-4'} right-4 z-50`}
        >
          <div className="px-3 py-1.5 bg-cyber-dark/90 backdrop-blur-sm border border-cyber-cyan/30 rounded-full">
            <span className="text-sm font-mono text-cyber-cyan">
              {Math.round(progress)}%
            </span>
          </div>
        </motion.div>
      )}
    </>
  );
}

export default ReadingProgress;
