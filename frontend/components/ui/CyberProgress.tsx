'use client';

import React from 'react';
import { motion } from 'framer-motion';

interface CyberProgressProps {
  value: number;
  max?: number;
  variant?: 'default' | 'success' | 'warning' | 'error';
  size?: 'sm' | 'md' | 'lg';
  showValue?: boolean;
  animated?: boolean;
  glow?: boolean;
  className?: string;
  label?: string;
}

/**
 * CyberProgress - 赛博朋克风格进度条
 * 带有发光效果和动画的进度指示器
 */
export const CyberProgress: React.FC<CyberProgressProps> = ({
  value,
  max = 100,
  variant = 'default',
  size = 'md',
  showValue = false,
  animated = true,
  glow = true,
  className = '',
  label
}) => {
  const percentage = Math.min(Math.max((value / max) * 100, 0), 100);

  const variants = {
    default: {
      bg: 'bg-cyber-dark',
      bar: 'bg-gradient-to-r from-cyber-primary to-cyber-secondary',
      glow: 'shadow-[0_0_20px_rgba(0,240,255,0.5)]',
      border: 'border-cyber-primary'
    },
    success: {
      bg: 'bg-cyber-dark',
      bar: 'bg-gradient-to-r from-green-500 to-green-400',
      glow: 'shadow-[0_0_20px_rgba(34,197,94,0.5)]',
      border: 'border-green-500'
    },
    warning: {
      bg: 'bg-cyber-dark',
      bar: 'bg-gradient-to-r from-cyber-warning to-yellow-400',
      glow: 'shadow-[0_0_20px_rgba(240,255,0,0.5)]',
      border: 'border-cyber-warning'
    },
    error: {
      bg: 'bg-cyber-dark',
      bar: 'bg-gradient-to-r from-cyber-accent to-red-500',
      glow: 'shadow-[0_0_20px_rgba(255,0,128,0.5)]',
      border: 'border-cyber-accent'
    }
  };

  const sizes = {
    sm: { height: 'h-1', text: 'text-xs' },
    md: { height: 'h-2', text: 'text-sm' },
    lg: { height: 'h-3', text: 'text-base' }
  };

  const currentVariant = variants[variant];
  const currentSize = sizes[size];

  return (
    <div className={`w-full ${className}`}>
      {/* 标签和值 */}
      {(label || showValue) && (
        <div className="flex justify-between items-center mb-2">
          {label && (
            <span className={`${currentSize.text} text-gray-400 font-medium`}>
              {label}
            </span>
          )}
          {showValue && (
            <span className={`${currentSize.text} text-cyber-primary font-mono font-bold`}>
              {Math.round(percentage)}%
            </span>
          )}
        </div>
      )}

      {/* 进度条容器 */}
      <div className={`
        relative w-full ${currentSize.height} rounded-full
        ${currentVariant.bg} border ${currentVariant.border}
        overflow-hidden backdrop-blur-sm
      `}>
        {/* 背景网格 */}
        <div className="absolute inset-0 opacity-10">
          <div className="w-full h-full" style={{
            backgroundImage: `
              linear-gradient(90deg, transparent 0%, transparent 50%, rgba(255,255,255,0.1) 50%, rgba(255,255,255,0.1) 100%)
            `,
            backgroundSize: '4px 100%'
          }} />
        </div>

        {/* 进度条 */}
        <motion.div
          initial={animated ? { width: 0 } : { width: `${percentage}%` }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: animated ? 0.8 : 0, ease: 'easeOut' }}
          className={`
            absolute top-0 left-0 h-full
            ${currentVariant.bar}
            ${glow ? currentVariant.glow : ''}
            rounded-full
          `}
        >
          {/* 光泽效果 */}
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-20"
            animate={{
              x: ['-100%', '200%']
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              ease: 'linear'
            }}
          />

          {/* 扫描线 */}
          <div className="absolute inset-0" style={{
            background: 'repeating-linear-gradient(90deg, transparent, transparent 2px, rgba(0,0,0,0.3) 2px, rgba(0,0,0,0.3) 4px)'
          }} />
        </motion.div>

        {/* 刻度线 */}
        {[0, 25, 50, 75, 100].map((tick) => (
          <div
            key={tick}
            className="absolute top-0 bottom-0 w-px bg-gray-600 opacity-30"
            style={{ left: `${tick}%` }}
          />
        ))}
      </div>

      {/* 装饰元素 */}
      <div className="flex justify-between mt-1">
        <div className="w-1 h-1 bg-cyber-primary opacity-50" />
        <div className="w-1 h-1 bg-cyber-primary opacity-50" />
      </div>
    </div>
  );
};

export default CyberProgress;
