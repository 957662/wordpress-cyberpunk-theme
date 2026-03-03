/**
 * CyberProgressBar - 赛博朋克风格进度条组件
 */
'use client';

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

interface CyberProgressBarProps {
  /** 进度值 (0-100) */
  value: number;
  /** 最大值 */
  max?: number;
  /** 高度 */
  size?: 'sm' | 'md' | 'lg';
  /** 是否显示百分比文本 */
  showLabel?: boolean;
  /** 自定义标签 */
  label?: string;
  /** 变体 */
  variant?: 'default' | 'neon' | 'hologram' | 'glitch' | 'success' | 'warning' | 'error';
  /** 是否有条纹动画 */
  striped?: boolean;
  /** 是否有动画 */
  animated?: boolean;
  /** 自定义样式 */
  className?: string;
  /** 颜色 */
  color?: string;
  /** 背景色 */
  backgroundColor?: string;
}

const sizeClasses = {
  sm: 'h-1',
  md: 'h-2',
  lg: 'h-3',
};

const variantClasses = {
  default: 'bg-gradient-to-r from-cyber-cyan to-blue-500',
  neon: 'bg-cyber-cyan shadow-[0_0_10px_rgba(0,240,255,0.5)]',
  hologram: 'bg-gradient-to-r from-cyber-purple to-pink-500 shadow-[0_0_10px_rgba(157,0,255,0.5)]',
  glitch: 'bg-laser-pink shadow-[0_0_10px_rgba(255,0,128,0.5)]',
  success: 'bg-green-500 shadow-[0_0_10px_rgba(34,197,94,0.5)]',
  warning: 'bg-yellow-500 shadow-[0_0_10px_rgba(234,179,8,0.5)]',
  error: 'bg-red-500 shadow-[0_0_10px_rgba(239,68,68,0.5)]',
};

/**
 * 赛博朋克风格进度条
 *
 * @example
 * ```tsx
 * <CyberProgressBar value={60} />
 * <CyberProgressBar value={80} variant="neon" size="lg" showLabel />
 * <CyberProgressBar value={45} variant="hologram" striped animated />
 * ```
 */
export const CyberProgressBar: React.FC<CyberProgressBarProps> = ({
  value,
  max = 100,
  size = 'md',
  showLabel = false,
  label,
  variant = 'default',
  striped = false,
  animated = false,
  className = '',
  color,
  backgroundColor = 'bg-cyber-dark/30',
}) => {
  const [displayValue, setDisplayValue] = useState(0);

  // 动画效果
  useEffect(() => {
    const duration = 500;
    const startTime = Date.now();
    const startValue = displayValue;

    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);

      // 使用 easeOutQuart 缓动函数
      const easeProgress = 1 - Math.pow(1 - progress, 4);

      setDisplayValue(startValue + (value - startValue) * easeProgress);

      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };

    animate();
  }, [value]);

  const percentage = Math.min(Math.max((displayValue / max) * 100, 0), 100);

  return (
    <div className={`w-full ${className}`}>
      <div className="flex items-center justify-between mb-1">
        {label && (
          <span className="text-sm text-cyber-cyan font-medium">{label}</span>
        )}
        {showLabel && (
          <span className="text-sm text-cyber-cyan font-mono">
            {Math.round(percentage)}%
          </span>
        )}
      </div>

      <div
        className={`
          relative w-full overflow-hidden rounded-full
          border border-cyber-cyan/20
          ${sizeClasses[size]}
          ${backgroundColor}
        `}
      >
        {/* 进度条 */}
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
          className={`
            h-full relative overflow-hidden
            ${color || variantClasses[variant]}
            ${striped ? 'bg-[length:20px_20px] bg-[linear-gradient(45deg,rgba(255,255,255,0.15)_25%,transparent_25%,transparent_50%,rgba(255,255,255,0.15)_50%,rgba(255,255,255,0.15)_75%,transparent_75%,transparent)]' : ''}
            ${animated ? 'animate-progress-stripes' : ''}
          `}
        >
          {/* 发光效果 */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent" />
        </motion.div>

        {/* 扫描线效果 */}
        {variant === 'default' || variant === 'neon' ? (
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-cyber-cyan/10 to-transparent animate-scan" />
          </div>
        ) : null}
      </div>
    </div>
  );
};

/**
 * 圆形进度条
 */
interface CyberCircularProgressProps {
  /** 进度值 (0-100) */
  value: number;
  /** 大小 */
  size?: number;
  /** 描边宽度 */
  strokeWidth?: number;
  /** 是否显示百分比 */
  showLabel?: boolean;
  /** 变体 */
  variant?: 'default' | 'neon' | 'hologram';
  /** 自定义样式 */
  className?: string;
}

export const CyberCircularProgress: React.FC<CyberCircularProgressProps> = ({
  value,
  size = 120,
  strokeWidth = 8,
  showLabel = true,
  variant = 'default',
  className = '',
}) => {
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    const duration = 500;
    const startTime = Date.now();
    const startValue = displayValue;

    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const easeProgress = 1 - Math.pow(1 - progress, 4);

      setDisplayValue(startValue + (value - startValue) * easeProgress);

      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };

    animate();
  }, [value]);

  const normalizedValue = Math.min(Math.max(displayValue, 0), 100);
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (normalizedValue / 100) * circumference;

  const colors = {
    default: {
      stroke: '#00f0ff',
      glow: 'rgba(0, 240, 255, 0.5)',
    },
    neon: {
      stroke: '#00f0ff',
      glow: 'rgba(0, 240, 255, 0.8)',
    },
    hologram: {
      stroke: '#9d00ff',
      glow: 'rgba(157, 0, 255, 0.8)',
    },
  };

  const { stroke, glow } = colors[variant];

  return (
    <div className={`relative inline-flex items-center justify-center ${className}`}>
      <svg width={size} height={size} className="transform -rotate-90">
        {/* 背景圆 */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="currentColor"
          strokeWidth={strokeWidth}
          fill="none"
          className="text-cyber-dark/30"
        />

        {/* 进度圆 */}
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={stroke}
          strokeWidth={strokeWidth}
          fill="none"
          strokeLinecap="round"
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
          style={{
            strokeDasharray: circumference,
            filter: `drop-shadow(0 0 8px ${glow})`,
          }}
        />
      </svg>

      {/* 中心文字 */}
      {showLabel && (
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-2xl font-bold font-mono" style={{ color: stroke }}>
            {Math.round(normalizedValue)}%
          </span>
        </div>
      )}
    </div>
  );
};

/**
 * 步骤进度条
 */
interface CyberStepProgressProps {
  /** 当前步骤 (从0开始) */
  currentStep: number;
  /** 步骤列表 */
  steps: string[];
  /** 变体 */
  variant?: 'default' | 'neon';
  /** 自定义样式 */
  className?: string;
}

export const CyberStepProgress: React.FC<CyberStepProgressProps> = ({
  currentStep,
  steps,
  variant = 'default',
  className = '',
}) => {
  const colors = variant === 'neon' ? {
    active: 'text-cyber-cyan border-cyber-cyan',
    completed: 'bg-cyber-cyan border-cyber-cyan',
    pending: 'text-gray-500 border-gray-700',
  } : {
    active: 'text-cyber-cyan border-cyber-cyan',
    completed: 'bg-cyber-cyan border-cyber-cyan',
    pending: 'text-gray-500 border-gray-700',
  };

  return (
    <div className={`w-full ${className}`}>
      <div className="flex items-center justify-between">
        {steps.map((step, index) => {
          const isCompleted = index < currentStep;
          const isCurrent = index === currentStep;
          const isPending = index > currentStep;

          return (
            <React.Fragment key={index}>
              {/* 步骤圆圈 */}
              <div className="flex flex-col items-center">
                <div
                  className={`
                    w-10 h-10 rounded-full border-2 flex items-center justify-center
                    font-bold transition-all duration-300
                    ${isCompleted ? colors.completed : ''}
                    ${isCurrent ? colors.active + ' bg-cyber-cyan/10' : ''}
                    ${isPending ? colors.pending : ''}
                  `}
                >
                  {isCompleted ? (
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  ) : (
                    <span>{index + 1}</span>
                  )}
                </div>
                <span className={`mt-2 text-sm font-medium ${isCurrent || isCompleted ? 'text-cyber-cyan' : 'text-gray-500'}`}>
                  {step}
                </span>
              </div>

              {/* 连接线 */}
              {index < steps.length - 1 && (
                <div
                  className={`
                    flex-1 h-0.5 mx-4 transition-all duration-300
                    ${isCompleted ? 'bg-cyber-cyan' : 'bg-gray-700'}
                  `}
                />
              )}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
};

export default CyberProgressBar;
