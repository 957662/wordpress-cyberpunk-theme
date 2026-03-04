/**
 * 阅读进度条组件
 * CyberPress Platform
 */

'use client';

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

interface ReadingProgressProps {
  color?: string;
  height?: number;
  position?: 'top' | 'bottom';
  showPercentage?: boolean;
  className?: string;
}

export const ReadingProgress: React.FC<ReadingProgressProps> = ({
  color = '#00f0ff',
  height = 3,
  position = 'top',
  showPercentage = false,
  className = '',
}) => {
  const [progress, setProgress] = useState(0);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight;
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      const scrollableHeight = documentHeight - windowHeight;

      const newProgress = (scrollTop / scrollableHeight) * 100;
      setProgress(Math.min(100, Math.max(0, newProgress)));

      // 当滚动超过 10% 时显示进度条
      setIsVisible(newProgress > 10);
    };

    // 初始计算
    handleScroll();

    // 添加滚动监听
    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const positionClass = position === 'top' ? 'top-0' : 'bottom-0';

  return (
    <>
      {/* 进度条 */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: isVisible ? 1 : 0 }}
        transition={{ duration: 0.3 }}
        className={`fixed left-0 right-0 z-50 ${positionClass} ${className}`}
        style={{ height: `${height}px` }}
      >
        {/* 背景条 */}
        <div className="absolute inset-0 bg-cyber-dark/50" />

        {/* 进度条 */}
        <motion.div
          className="absolute left-0 top-0 bottom-0 origin-left"
          style={{
            backgroundColor: color,
            boxShadow: `0 0 10px ${color}, 0 0 20px ${color}`,
          }}
          initial={{ scaleX: 0 }}
          animate={{ scaleX: progress / 100 }}
          transition={{ type: 'spring', damping: 20, stiffness: 100 }}
        />
      </motion.div>

      {/* 百分比显示 */}
      {showPercentage && isVisible && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          className="fixed top-16 right-4 z-50 bg-cyber-dark/90 backdrop-blur-sm border border-cyber-cyan/30 rounded-lg px-3 py-2"
        >
          <div className="flex items-center gap-2">
            <div
              className="w-2 h-2 rounded-full"
              style={{ backgroundColor: color }}
            />
            <span className="text-sm font-medium text-white">
              {Math.round(progress)}%
            </span>
          </div>
        </motion.div>
      )}
    </>
  );
};

export default ReadingProgress;
