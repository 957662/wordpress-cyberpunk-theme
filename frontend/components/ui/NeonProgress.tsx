'use client';

import React, { useRef, useEffect, useState } from 'react';
import { motion } from 'framer-motion';

export interface NeonProgressProps {
  /**
   * 进度值 (0-100)
   */
  value: number;

  /**
   * 最大值
   */
  max?: number;

  /**
   * 霓虹颜色
   */
  color?: 'cyan' | 'purple' | 'pink' | 'green' | 'yellow' | 'blue';

  /**
   * 尺寸
   */
  size?: 'sm' | 'md' | 'lg';

  /**
   * 进度条类型
   */
  variant?: 'linear' | 'circular' | 'segmented';

  /**
   * 是否显示百分比
   */
  showPercentage?: boolean;

  /**
   * 是否显示标签
   */
  label?: string;

  /**
   * 是否动画
   */
  animated?: boolean;

  /**
   * 动画持续时间（秒）
   */
  animationDuration?: number;

  /**
   * 是否显示光晕效果
   */
  glow?: boolean;

  /**
   * 自定义类名
   */
  className?: string;

  /**
   * 进度变化回调
   */
  onChange?: (value: number) => void;
}

const colorMap = {
  cyan: {
    primary: '#00f0ff',
    secondary: '#00a0aa',
    glow: 'rgba(0, 240, 255, 0.6)',
  },
  purple: {
    primary: '#9d00ff',
    secondary: '#6a00aa',
    glow: 'rgba(157, 0, 255, 0.6)',
  },
  pink: {
    primary: '#ff0080',
    secondary: '#aa0055',
    glow: 'rgba(255, 0, 128, 0.6)',
  },
  green: {
    primary: '#00ff41',
    secondary: '#00aa2b',
    glow: 'rgba(0, 255, 65, 0.6)',
  },
  yellow: {
    primary: '#f0ff00',
    secondary: '#a0aa00',
    glow: 'rgba(240, 255, 0, 0.6)',
  },
  blue: {
    primary: '#0066ff',
    secondary: '#0044aa',
    glow: 'rgba(0, 102, 255, 0.6)',
  },
};

const sizeMap = {
  sm: { height: 4, strokeWidth: 6 },
  md: { height: 8, strokeWidth: 10 },
  lg: { height: 12, strokeWidth: 14 },
};

/**
 * NeonProgress - 霓虹灯效进度条组件
 *
 * 提供多种风格的霓虹灯效进度条
 *
 * @example
 * ```tsx
 * <NeonProgress value={75} color="cyan" size="md" />
 * <NeonProgress value={50} variant="circular" showPercentage />
 * <NeonProgress value={90} variant="segmented" label="下载中" />
 * ```
 */
export const NeonProgress: React.FC<NeonProgressProps> = ({
  value,
  max = 100,
  color = 'cyan',
  size = 'md',
  variant = 'linear',
  showPercentage = false,
  label,
  animated = true,
  animationDuration = 1,
  glow = true,
  className = '',
  onChange,
}) => {
  const colors = colorMap[color];
  const dimensions = sizeMap[size];
  const [displayValue, setDisplayValue] = useState(0);
  const previousValue = useRef(value);

  useEffect(() => {
    if (animated) {
      const animationDurationMs = animationDuration * 1000;
      const startTime = Date.now();
      const startValue = previousValue.current;

      const animate = () => {
        const elapsed = Date.now() - startTime;
        const progress = Math.min(elapsed / animationDurationMs, 1);

        // 使用缓动函数
        const easeProgress = 1 - Math.pow(1 - progress, 3);
        setDisplayValue(startValue + (value - startValue) * easeProgress);

        if (progress < 1) {
          requestAnimationFrame(animate);
        } else {
          previousValue.current = value;
        }
      };

      animate();
    } else {
      setDisplayValue(value);
    }
  }, [value, animated, animationDuration]);

  useEffect(() => {
    onChange?.(displayValue);
  }, [displayValue, onChange]);

  const percentage = Math.min((displayValue / max) * 100, 100);

  const renderLinear = () => (
    <div className="w-full">
      {/* 标签和百分比 */}
      {(label || showPercentage) && (
        <div className="flex justify-between items-center mb-2">
          {label && (
            <span
              className="font-mono text-sm font-medium"
              style={{ color: colors.primary }}
            >
              {label}
            </span>
          )}
          {showPercentage && (
            <span
              className="font-mono text-sm font-bold"
              style={{ color: colors.primary }}
            >
              {Math.round(percentage)}%
            </span>
          )}
        </div>
      )}

      {/* 进度条容器 */}
      <div
        className="relative overflow-hidden rounded-full bg-black/40 border"
        style={{
          height: dimensions.height,
          borderColor: colors.secondary,
          boxShadow: glow ? `0 0 10px ${colors.glow}` : undefined,
        }}
      >
        {/* 扫描线效果 */}
        <div
          className="absolute inset-0 opacity-20 pointer-events-none"
          style={{
            background: `repeating-linear-gradient(
              0deg,
              transparent,
              transparent 2px,
              ${colors.primary} 2px,
              ${colors.primary} 4px
            )`,
          }}
        />

        {/* 进度条 */}
        <motion.div
          className="h-full relative"
          style={{
            backgroundColor: colors.primary,
            boxShadow: `0 0 ${glow ? 20 : 10}px ${colors.glow}`,
          }}
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: animated ? animationDuration : 0 }}
        >
          {/* 光效移动 */}
          <motion.div
            className="absolute inset-0"
            style={{
              background: `linear-gradient(
                90deg,
                transparent,
                rgba(255, 255, 255, 0.4),
                transparent
              )`,
            }}
            animate={{
              x: ['-100%', '100%'],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: 'linear',
            }}
          />
        </motion.div>

        {/* 刻度标记 */}
        <div className="absolute inset-0 flex">
          {[0, 25, 50, 75, 100].map((tick) => (
            <div
              key={tick}
              className="flex-1 border-r"
              style={{
                borderColor: `${colors.secondary}40`,
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );

  const renderCircular = () => {
    const radius = 50;
    const circumference = 2 * Math.PI * radius;
    const strokeDashoffset = circumference - (percentage / 100) * circumference;

    return (
      <div className="flex flex-col items-center">
        <div className="relative" style={{ width: 140, height: 140 }}>
          {/* 背景圆 */}
          <svg className="transform -rotate-90" viewBox="0 0 120 120">
            <circle
              cx="60"
              cy="60"
              r={radius}
              fill="none"
              stroke="rgba(0, 0, 0, 0.4)"
              strokeWidth={dimensions.strokeWidth}
              className="drop-shadow-lg"
            />

            {/* 进度圆 */}
            <motion.circle
              cx="60"
              cy="60"
              r={radius}
              fill="none"
              stroke={colors.primary}
              strokeWidth={dimensions.strokeWidth}
              strokeLinecap="round"
              strokeDasharray={circumference}
              initial={{ strokeDashoffset: circumference }}
              animate={{ strokeDashoffset }}
              transition={{ duration: animated ? animationDuration : 0 }}
              style={{
                filter: `drop-shadow(0 0 ${glow ? 10 : 5}px ${colors.glow})`,
              }}
            />
          </svg>

          {/* 中心内容 */}
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            {label && (
              <span
                className="font-mono text-xs mb-1"
                style={{ color: colors.secondary }}
              >
                {label}
              </span>
            )}
            <span
              className="font-mono text-2xl font-bold"
              style={{ color: colors.primary }}
            >
              {showPercentage ? `${Math.round(percentage)}%` : Math.round(displayValue)}
            </span>
          </div>
        </div>
      </div>
    );
  };

  const renderSegmented = () => {
    const segmentCount = 10;
    const activeSegments = Math.round((percentage / 100) * segmentCount);

    return (
      <div className="w-full">
        {/* 标签和百分比 */}
        {(label || showPercentage) && (
          <div className="flex justify-between items-center mb-3">
            {label && (
              <span
                className="font-mono text-sm font-medium"
                style={{ color: colors.primary }}
              >
                {label}
              </span>
            )}
            {showPercentage && (
              <span
                className="font-mono text-sm font-bold"
                style={{ color: colors.primary }}
              >
                {Math.round(percentage)}%
              </span>
            )}
          </div>
        )}

        {/* 分段进度条 */}
        <div className="flex gap-2">
          {Array.from({ length: segmentCount }).map((_, index) => (
            <motion.div
              key={index}
              className="flex-1 h-2 rounded-sm relative overflow-hidden"
              style={{
                backgroundColor: index < activeSegments ? colors.primary : 'rgba(0, 0, 0, 0.4)',
                border: `1px solid ${colors.secondary}`,
                boxShadow:
                  index < activeSegments && glow ? `0 0 8px ${colors.glow}` : undefined,
              }}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{
                opacity: index < activeSegments ? 1 : 0.3,
                scale: 1,
              }}
              transition={{
                duration: 0.3,
                delay: index * 0.05,
              }}
            >
              {/* 扫描线效果 */}
              {index < activeSegments && (
                <div
                  className="absolute inset-0 opacity-20"
                  style={{
                    background: `repeating-linear-gradient(
                      0deg,
                      transparent,
                      transparent 2px,
                      ${colors.primary} 2px,
                      ${colors.primary} 4px
                    )`,
                  }}
                />
              )}
            </motion.div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className={className}>
      {variant === 'linear' && renderLinear()}
      {variant === 'circular' && renderCircular()}
      {variant === 'segmented' && renderSegmented()}
    </div>
  );
};

export default NeonProgress;
