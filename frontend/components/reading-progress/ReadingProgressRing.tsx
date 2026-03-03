'use client';

/**
 * ReadingProgressRing - 环形阅读进度指示器
 * 用于显示长篇文章的阅读进度
 */

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { BookOpen } from 'lucide-react';

interface ReadingProgressRingProps {
  /** 尺寸 */
  size?: number;
  /** 描边宽度 */
  strokeWidth?: number;
  /** 自定义样式类名 */
  className?: string;
  /** 显示图标 */
  showIcon?: boolean;
}

export function ReadingProgressRing({
  size = 120,
  strokeWidth = 8,
  className = '',
  showIcon = true,
}: ReadingProgressRingProps) {
  const [progress, setProgress] = useState(0);
  const [isVisible, setIsVisible] = useState(false);

  // 计算圆周长
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;

  useEffect(() => {
    const handleScroll = () => {
      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight;
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      const scrollableHeight = documentHeight - windowHeight;
      const scrolled = (scrollTop / scrollableHeight) * 100;

      setProgress(Math.min(Math.max(scrolled, 0), 100));

      // 滚动超过 500px 后显示
      if (scrollTop > 500) {
        setIsVisible(true);
      } else if (scrollTop < 300) {
        setIsVisible(false);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // 计算描边偏移量
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8, y: 20 }}
      animate={{
        opacity: isVisible ? 1 : 0,
        scale: isVisible ? 1 : 0.8,
        y: isVisible ? 0 : 20,
      }}
      transition={{ duration: 0.3 }}
      className={`fixed bottom-8 right-8 z-50 ${className}`}
    >
      <div className="relative" style={{ width: size, height: size }}>
        {/* 背景圆 */}
        <svg
          width={size}
          height={size}
          className="transform -rotate-90"
        >
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke="rgba(0, 240, 255, 0.1)"
            strokeWidth={strokeWidth}
            fill="none"
          />
          {/* 进度圆 */}
          <motion.circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke="url(#gradient)"
            strokeWidth={strokeWidth}
            fill="none"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset }}
            transition={{ duration: 0.3 }}
            style={{
              filter: 'drop-shadow(0 0 8px rgba(0, 240, 255, 0.5))',
            }}
          />
          {/* 渐变定义 */}
          <defs>
            <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#00f0ff" />
              <stop offset="50%" stopColor="#9d00ff" />
              <stop offset="100%" stopColor="#ff0080" />
            </linearGradient>
          </defs>
        </svg>

        {/* 中心内容 */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          {showIcon ? (
            <BookOpen className="w-5 h-5 text-cyber-cyan mb-1" />
          ) : null}
          <span className="text-xl font-bold text-white">
            {Math.round(progress)}%
          </span>
        </div>

        {/* 点击返回顶部 */}
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="absolute inset-0 cursor-pointer hover:scale-110 transition-transform"
          aria-label="返回顶部"
        >
          <span className="sr-only">返回顶部</span>
        </button>
      </div>
    </motion.div>
  );
}

export default ReadingProgressRing;
