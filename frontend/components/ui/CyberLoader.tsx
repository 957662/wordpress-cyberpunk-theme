'use client';

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export interface CyberLoaderProps {
  /**
   * 加载器类型
   */
  variant?: 'spinner' | 'dots' | 'bars' | 'pulse' | 'matrix';

  /**
   * 尺寸
   */
  size?: 'sm' | 'md' | 'lg' | 'xl';

  /**
   * 颜色
   */
  color?: 'cyan' | 'purple' | 'pink' | 'green' | 'yellow';

  /**
   * 是否显示文字
   */
  showText?: boolean;

  /**
   * 自定义文字
   */
  text?: string;

  /**
   * 进度值 (0-100)
   */
  progress?: number;

  /**
   * 是否显示进度百分比
   */
  showProgress?: boolean;

  /**
   * 全屏模式
   */
  fullscreen?: boolean;

  /**
   * 自定义类名
   */
  className?: string;
}

const colorMap = {
  cyan: {
    primary: '#00f0ff',
    secondary: '#00a0aa',
    glow: 'rgba(0, 240, 255, 0.5)',
  },
  purple: {
    primary: '#9d00ff',
    secondary: '#6a00aa',
    glow: 'rgba(157, 0, 255, 0.5)',
  },
  pink: {
    primary: '#ff0080',
    secondary: '#aa0055',
    glow: 'rgba(255, 0, 128, 0.5)',
  },
  green: {
    primary: '#00ff41',
    secondary: '#00aa2b',
    glow: 'rgba(0, 255, 65, 0.5)',
  },
  yellow: {
    primary: '#f0ff00',
    secondary: '#a0aa00',
    glow: 'rgba(240, 255, 0, 0.5)',
  },
};

const sizeMap = {
  sm: { width: 24, height: 24, strokeWidth: 2 },
  md: { width: 48, height: 48, strokeWidth: 3 },
  lg: { width: 64, height: 64, strokeWidth: 4 },
  xl: { width: 96, height: 96, strokeWidth: 5 },
};

/**
 * CyberLoader - 赛博朋克风格加载器组件
 *
 * 提供多种赛博朋克风格的加载动画效果
 *
 * @example
 * ```tsx
 * <CyberLoader variant="spinner" color="cyan" size="lg" />
 * <CyberLoader variant="bars" showText text="加载中..." />
 * <CyberLoader variant="matrix" progress={75} showProgress />
 * ```
 */
export const CyberLoader: React.FC<CyberLoaderProps> = ({
  variant = 'spinner',
  size = 'md',
  color = 'cyan',
  showText = false,
  text = '加载中...',
  progress,
  showProgress = false,
  fullscreen = false,
  className = '',
}) => {
  const colors = colorMap[color];
  const dimensions = sizeMap[size];
  const [dots, setDots] = useState(0);

  useEffect(() => {
    if (showText && variant === 'dots') {
      const interval = setInterval(() => {
        setDots((prev) => (prev + 1) % 4);
      }, 500);
      return () => clearInterval(interval);
    }
  }, [showText, variant]);

  const containerClass = fullscreen
    ? 'fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm'
    : 'flex flex-col items-center justify-center';

  const renderSpinner = () => (
    <div className="relative">
      {/* 外圈 */}
      <motion.svg
        width={dimensions.width}
        height={dimensions.height}
        viewBox="0 0 100 100"
        className="transform -rotate-90"
      >
        <circle
          cx="50"
          cy="50"
          r="45"
          fill="none"
          stroke={colors.secondary}
          strokeWidth={dimensions.strokeWidth}
          opacity={0.3}
        />
        <motion.circle
          cx="50"
          cy="50"
          r="45"
          fill="none"
          stroke={colors.primary}
          strokeWidth={dimensions.strokeWidth}
          strokeLinecap="round"
          strokeDasharray="283"
          initial={{ strokeDashoffset: 283 }}
          animate={{ strokeDashoffset: 70 }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            ease: 'linear',
          }}
          style={{
            filter: `drop-shadow(0 0 8px ${colors.glow})`,
          }}
        />
      </motion.svg>

      {/* 内圈 */}
      <motion.div
        className="absolute inset-0 flex items-center justify-center"
        animate={{ rotate: 360 }}
        transition={{
          duration: 1,
          repeat: Infinity,
          ease: 'linear',
        }}
      >
        <div
          className="rounded-full"
          style={{
            width: dimensions.width * 0.4,
            height: dimensions.height * 0.4,
            background: `radial-gradient(circle, ${colors.glow}, transparent)`,
          }}
        />
      </motion.div>
    </div>
  );

  const renderDots = () => (
    <div className="flex items-center gap-2">
      {[0, 1, 2].map((i) => (
        <motion.div
          key={i}
          className="rounded-full"
          style={{
            width: dimensions.width * 0.3,
            height: dimensions.height * 0.3,
            backgroundColor: colors.primary,
            boxShadow: `0 0 10px ${colors.glow}`,
          }}
          animate={{
            scale: [1, 1.5, 1],
            opacity: [1, 0.5, 1],
          }}
          transition={{
            duration: 0.8,
            repeat: Infinity,
            delay: i * 0.2,
            ease: 'easeInOut',
          }}
        />
      ))}
    </div>
  );

  const renderBars = () => (
    <div className="flex items-center gap-1.5">
      {[0, 1, 2, 3, 4].map((i) => (
        <motion.div
          key={i}
          className="rounded-sm"
          style={{
            width: dimensions.width * 0.15,
            height: dimensions.height,
            backgroundColor: colors.primary,
            boxShadow: `0 0 8px ${colors.glow}`,
          }}
          animate={{
            scaleY: [0.3, 1, 0.3],
          }}
          transition={{
            duration: 0.8,
            repeat: Infinity,
            delay: i * 0.1,
            ease: 'easeInOut',
          }}
        />
      ))}
    </div>
  );

  const renderPulse = () => (
    <div className="relative">
      {[0, 1, 2].map((i) => (
        <motion.div
          key={i}
          className="absolute inset-0 rounded-full"
          style={{
            background: `radial-gradient(circle, ${colors.glow}, transparent)`,
            border: `1px solid ${colors.primary}`,
          }}
          animate={{
            scale: [0.8, 1.2, 0.8],
            opacity: [0.8, 0, 0.8],
          }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            delay: i * 0.5,
            ease: 'easeInOut',
          }}
        />
      ))}
      <div
        className="relative rounded-full"
        style={{
          width: dimensions.width * 0.5,
          height: dimensions.height * 0.5,
          backgroundColor: colors.primary,
          boxShadow: `0 0 20px ${colors.glow}`,
        }}
      />
    </div>
  );

  const renderMatrix = () => (
    <div
      className="relative overflow-hidden rounded"
      style={{
        width: dimensions.width * 2,
        height: dimensions.height * 1.5,
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        border: `1px solid ${colors.primary}`,
        boxShadow: `0 0 10px ${colors.glow}`,
      }}
    >
      {/* Matrix 字符 */}
      <div className="absolute inset-0 overflow-hidden">
        {Array.from({ length: 20 }).map((_, i) => (
          <motion.div
            key={i}
            className="absolute font-mono text-xs"
            style={{
              left: `${i * 5}%`,
              color: colors.primary,
              textShadow: `0 0 5px ${colors.glow}`,
            }}
            animate={{
              y: ['-100%', '100%'],
            }}
            transition={{
              duration: 2 + Math.random(),
              repeat: Infinity,
              delay: Math.random() * 2,
              ease: 'linear',
            }}
          >
            {String.fromCharCode(0x30A0 + Math.random() * 96)}
          </motion.div>
        ))}
      </div>

      {/* 进度条 */}
      {progress !== undefined && (
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-black/50">
          <motion.div
            className="h-full"
            style={{
              backgroundColor: colors.primary,
              boxShadow: `0 0 10px ${colors.glow}`,
            }}
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.3 }}
          />
        </div>
      )}
    </div>
  );

  const renderLoader = () => {
    switch (variant) {
      case 'spinner':
        return renderSpinner();
      case 'dots':
        return renderDots();
      case 'bars':
        return renderBars();
      case 'pulse':
        return renderPulse();
      case 'matrix':
        return renderMatrix();
      default:
        return renderSpinner();
    }
  };

  return (
    <div className={`${containerClass} ${className}`}>
      {renderLoader()}

      {/* 加载文字 */}
      {showText && variant !== 'matrix' && (
        <motion.p
          className="mt-4 font-mono text-sm"
          style={{
            color: colors.primary,
            textShadow: `0 0 10px ${colors.glow}`,
          }}
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        >
          {text}
          {'.'.repeat(dots)}
        </motion.p>
      )}

      {/* 进度显示 */}
      {showProgress && progress !== undefined && (
        <div className="mt-4 text-center">
          <p
            className="font-mono text-lg font-bold"
            style={{
              color: colors.primary,
              textShadow: `0 0 10px ${colors.glow}`,
            }}
          >
            {Math.round(progress)}%
          </p>
          <div className="mt-2 w-48 h-2 bg-black/50 rounded-full overflow-hidden">
            <motion.div
              className="h-full"
              style={{
                backgroundColor: colors.primary,
                boxShadow: `0 0 10px ${colors.glow}`,
              }}
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>
        </div>
      )}

      {/* Matrix 加载文字 */}
      {variant === 'matrix' && showText && (
        <motion.p
          className="mt-4 font-mono text-sm"
          style={{
            color: colors.primary,
            textShadow: `0 0 10px ${colors.glow}`,
          }}
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        >
          {'['}{' '.repeat(dots)}{text}{' '.repeat(3 - dots)}{']'}
        </motion.p>
      )}
    </div>
  );
};

export default CyberLoader;
