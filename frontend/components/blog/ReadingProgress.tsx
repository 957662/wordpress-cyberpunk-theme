'use client';

import { motion, useScroll, useSpring } from 'framer-motion';
import { useEffect, useState } from 'react';

interface ReadingProgressProps {
  /**
   * 进度条位置
   * @default 'top'
   */
  position?: 'top' | 'bottom';

  /**
   * 进度条高度
   * @default 3
   */
  height?: number;

  /**
   * 进度条颜色
   * @default '#00f0ff'
   */
  color?: string;

  /**
   * 是否显示百分比
   * @default false
   */
  showPercentage?: boolean;

  /**
   * 自定义样式类名
   */
  className?: string;
}

/**
 * 阅读进度条组件
 *
 * 用于显示文章阅读进度的进度条，支持顶部和底部两种位置。
 * 使用 Framer Motion 实现流畅的动画效果。
 *
 * @example
 * ```tsx
 * <ReadingProgress />
 * <ReadingProgress position="bottom" showPercentage />
 * <ReadingProgress color="#9d00ff" height={5} />
 * ```
 */
export function ReadingProgress({
  position = 'top',
  height = 3,
  color = '#00f0ff',
  showPercentage = false,
  className = '',
}: ReadingProgressProps) {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  });

  const [isVisible, setIsVisible] = useState(false);
  const [percentage, setPercentage] = useState(0);

  useEffect(() => {
    const unsubscribe = scrollYProgress.on('change', (latest) => {
      const percent = Math.round(latest * 100);
      setPercentage(percent);

      // 只在有滚动且未到达底部时显示
      if (latest > 0.01 && latest < 0.99) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    });

    return () => unsubscribe();
  }, [scrollYProgress]);

  const positionClasses = {
    top: 'top-0 left-0 right-0',
    bottom: 'bottom-0 left-0 right-0',
  };

  return (
    <>
      {/* 进度条 */}
      <motion.div
        className={`fixed z-50 ${positionClasses[position]} ${className}`}
        initial={{ opacity: 0 }}
        animate={{ opacity: isVisible ? 1 : 0 }}
        transition={{ duration: 0.3 }}
      >
        <motion.div
          className="h-full origin-left"
          style={{
            scaleX,
            height: \`\${height}px\`,
            backgroundColor: color,
            boxShadow: \`0 0 10px \${color}, 0 0 20px \${color}\`,
          }}
        />
      </motion.div>

      {/* 百分比显示 */}
      {showPercentage && (
        <motion.div
          className={\`fixed z-50 \${
            position === 'top'
              ? 'top-4 right-4'
              : 'bottom-4 right-4'
          } bg-cyber-dark/90 backdrop-blur-sm border border-cyber-cyan/30 rounded-lg px-3 py-2\`}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: isVisible ? 1 : 0, scale: isVisible ? 1 : 0.8 }}
          transition={{ duration: 0.3 }}
        >
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-cyber-cyan animate-pulse" />
            <span className="text-cyber-cyan font-mono text-sm font-bold">
              {percentage}%
            </span>
          </div>
        </motion.div>
      )}
    </>
  );
}

/**
 * 圆形阅读进度指示器
 */
interface CircularReadingProgressProps {
  /**
   * 指示器大小（像素）
   * @default 60
   */
  size?: number;

  /**
   * 进度条宽度（像素）
   * @default 4
   */
  strokeWidth?: number;

  /**
   * 进度条颜色
   * @default '#00f0ff'
   */
  color?: string;

  /**
   * 背景圆圈颜色
   * @default '#1a1a2e'
   */
  backgroundColor?: string;

  /**
   * 位置
   * @default 'bottom-right'
   */
  position?: 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left';

  /**
   * 是否显示百分比文字
   * @default true
   */
  showText?: boolean;

  /**
   * 自定义样式类名
   */
  className?: string;
}

export function CircularReadingProgress({
  size = 60,
  strokeWidth = 4,
  color = '#00f0ff',
  backgroundColor = '#1a1a2e',
  position = 'bottom-right',
  showText = true,
  className = '',
}: CircularReadingProgressProps) {
  const { scrollYProgress } = useScroll();
  const [progress, setProgress] = useState(0);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const unsubscribe = scrollYProgress.on('change', (latest) => {
      const percent = Math.round(latest * 100);
      setProgress(percent);

      if (latest > 0.01 && latest < 0.99) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    });

    return () => unsubscribe();
  }, [scrollYProgress]);

  // 计算 SVG 路径
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (progress / 100) * circumference;

  const positionClasses = {
    'bottom-right': 'bottom-8 right-8',
    'bottom-left': 'bottom-8 left-8',
    'top-right': 'top-8 right-8',
    'top-left': 'top-8 left-8',
  };

  return (
    <motion.div
      className={\`fixed z-50 \${positionClasses[position]} \${className}\`}
      initial={{ opacity: 0, scale: 0 }}
      animate={{
        opacity: isVisible ? 1 : 0,
        scale: isVisible ? 1 : 0,
      }}
      transition={{ duration: 0.3, type: 'spring', stiffness: 200, damping: 20 }}
    >
      <div className="relative">
        {/* 背景圆 */}
        <svg
          width={size}
          height={size}
          className="transform -rotate-90"
          style={{ filter: \`drop-shadow(0 0 6px \${color})\` }}
        >
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke={backgroundColor}
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
            strokeLinecap="round"
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset: offset }}
            transition={{ duration: 0.3 }}
            style={{
              strokeDasharray: circumference,
            }}
          />
        </svg>

        {/* 百分比文字 */}
        {showText && (
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-cyber-cyan font-mono text-xs font-bold">
              {progress}%
            </span>
          </div>
        )}
      </div>
    </motion.div>
  );
}

/**
 * 阅读时间估算和进度组件
 */
interface ReadingTimeProgressProps {
  /**
   * 文章字数
   */
  wordCount: number;

  /**
   * 平均阅读速度（字/分钟）
   * @default 200
   */
  readingSpeed?: number;

  /**
   * 自定义样式类名
   */
  className?: string;
}

export function ReadingTimeProgress({
  wordCount,
  readingSpeed = 200,
  className = '',
}: ReadingTimeProgressProps) {
  // 计算阅读时间
  const readingTime = Math.ceil(wordCount / readingSpeed);

  const { scrollYProgress } = useScroll();
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const unsubscribe = scrollYProgress.on('change', (latest) => {
      setProgress(Math.round(latest * 100));
    });

    return () => unsubscribe();
  }, [scrollYProgress]);

  return (
    <div
      className={\`flex items-center gap-3 text-sm text-gray-400 \${className}\`}
    >
      <div className="flex items-center gap-2">
        <svg
          className="w-4 h-4 text-cyber-cyan"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
        <span>阅读时间: {readingTime} 分钟</span>
      </div>

      <div className="w-px h-4 bg-gray-700" />

      <div className="flex items-center gap-2">
        <div className="w-4 h-4 rounded-full border-2 border-cyber-cyan overflow-hidden">
          <div
            className="h-full bg-cyber-cyan transition-all duration-300"
            style={{ width: \`\${progress}%\` }}
          />
        </div>
        <span>进度: {progress}%</span>
      </div>
    </div>
  );
}
