/**
 * ProgressRing - 环形进度条组件
 * 用于展示百分比、加载状态等
 */

'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

export interface ProgressRingProps {
  /**
   * 进度值 (0-100)
   */
  progress: number;
  /**
   * 大小
   */
  size?: number;
  /**
   * 描边宽度
   */
  strokeWidth?: number;
  /**
   * 颜色
   */
  color?: 'cyan' | 'purple' | 'pink' | 'green' | 'yellow' | 'gradient';
  /**
   * 是否显示百分比文字
   */
  showLabel?: boolean;
  /**
   * 自定义标签内容
   */
  label?: React.ReactNode;
  /**
   * 背景圆环颜色
   */
  trackColor?: string;
  /**
   * 是否动画
   */
  animated?: boolean;
  /**
   * 动画持续时间
   */
  animationDuration?: number;
  /**
   * 自定义样式
   */
  className?: string;
}

export const ProgressRing: React.FC<ProgressRingProps> = ({
  progress,
  size = 120,
  strokeWidth = 8,
  color = 'cyan',
  showLabel = true,
  label,
  trackColor = 'rgba(255, 255, 255, 0.1)',
  animated = true,
  animationDuration = 1,
  className,
}) => {
  const normalizedProgress = Math.min(100, Math.max(0, progress));
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - (normalizedProgress / 100) * circumference;

  const colorMap = {
    cyan: '#00f0ff',
    purple: '#9d00ff',
    pink: '#ff0080',
    green: '#00ff88',
    yellow: '#f0ff00',
    gradient: 'url(#gradient)',
  };

  const strokeColor = colorMap[color];

  return (
    <div
      className={cn('relative inline-flex items-center justify-center', className)}
      style={{ width: size, height: size }}
    >
      <svg width={size} height={size} className="transform -rotate-90">
        <defs>
          {color === 'gradient' && (
            <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#00f0ff" />
              <stop offset="50%" stopColor="#9d00ff" />
              <stop offset="100%" stopColor="#ff0080" />
            </linearGradient>
          )}
        </defs>

        {/* 背景圆环 */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={trackColor}
          strokeWidth={strokeWidth}
        />

        {/* 进度圆环 */}
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={strokeColor}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          initial={{ strokeDashoffset: animated ? circumference : offset }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: animationDuration, ease: 'easeOut' }}
          style={{
            strokeDasharray: circumference,
          }}
        />
      </svg>

      {/* 标签 */}
      {showLabel && (
        <div className="absolute inset-0 flex items-center justify-center">
          {label !== undefined ? (
            label
          ) : (
            <span className="text-2xl font-bold text-white">
              {Math.round(normalizedProgress)}%
            </span>
          )}
        </div>
      )}
    </div>
  );
};

/**
 * 多段环形进度条
 */
export interface MultiSegmentRingProps {
  segments: Array<{
    value: number;
    color: string;
    label?: string;
  }>;
  size?: number;
  strokeWidth?: number;
  showLabels?: boolean;
  className?: string;
}

export const MultiSegmentRing: React.FC<MultiSegmentRingProps> = ({
  segments,
  size = 120,
  strokeWidth = 8,
  showLabels = true,
  className,
}) => {
  const total = segments.reduce((sum, seg) => sum + seg.value, 0);
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;

  let currentOffset = 0;

  return (
    <div
      className={cn('relative inline-flex items-center justify-center', className)}
      style={{ width: size, height: size }}
    >
      <svg width={size} height={size} className="transform -rotate-90">
        {segments.map((segment, index) => {
          const segmentLength = (segment.value / total) * circumference;
          const offset = currentOffset;

          currentOffset += segmentLength;

          return (
            <circle
              key={index}
              cx={size / 2}
              cy={size / 2}
              r={radius}
              fill="none"
              stroke={segment.color}
              strokeWidth={strokeWidth}
              strokeLinecap="round"
              strokeDasharray={segmentLength}
              strokeDashoffset={-offset}
              className="transition-all duration-300"
            />
          );
        })}
      </svg>

      {/* 总计 */}
      {showLabels && (
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-2xl font-bold text-white">{total}</span>
          <span className="text-xs text-gray-400">总计</span>
        </div>
      )}
    </div>
  );
};

/**
 * 环形进度条组
 */
export interface ProgressRingGroupProps {
  rings: Array<{
    value: number;
    label: string;
    color?: 'cyan' | 'purple' | 'pink' | 'green';
  }>;
  size?: number;
  className?: string;
}

export const ProgressRingGroup: React.FC<ProgressRingGroupProps> = ({
  rings,
  size = 100,
  className,
}) => {
  return (
    <div className={cn('flex flex-wrap gap-4', className)}>
      {rings.map((ring, index) => (
        <div key={index} className="flex flex-col items-center gap-2">
          <ProgressRing
            progress={ring.value}
            size={size}
            color={ring.color}
            strokeWidth={6}
          />
          <span className="text-xs text-gray-400">{ring.label}</span>
        </div>
      ))}
    </div>
  );
};

/**
 * 仪表盘式进度条
 */
export interface GaugeProgressProps {
  value: number;
  min?: number;
  max?: number;
  size?: number;
  color?: 'cyan' | 'purple' | 'pink' | 'green' | 'gradient';
  showValue?: boolean;
  label?: string;
  className?: string;
}

export const GaugeProgress: React.FC<GaugeProgressProps> = ({
  value,
  min = 0,
  max = 100,
  size = 200,
  color = 'cyan',
  showValue = true,
  label,
  className,
}) => {
  const percentage = ((value - min) / (max - min)) * 100;
  const radius = size / 2 - 20;
  const circumference = radius * Math.PI; // 半圆
  const offset = circumference - (percentage / 100) * circumference;

  const colorMap = {
    cyan: '#00f0ff',
    purple: '#9d00ff',
    pink: '#ff0080',
    green: '#00ff88',
    gradient: 'url(#gauge-gradient)',
  };

  return (
    <div
      className={cn('relative inline-flex flex-col items-center', className)}
      style={{ width: size, height: size / 2 + 40 }}
    >
      <svg width={size} height={size / 2} className="overflow-visible">
        <defs>
          {color === 'gradient' && (
            <linearGradient id="gauge-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#00f0ff" />
              <stop offset="100%" stopColor="#ff0080" />
            </linearGradient>
          )}
        </defs>

        {/* 背景半圆 */}
        <path
          d={`M ${size / 2 - radius} ${size / 2} A ${radius} ${radius} 0 0 1 ${size / 2 + radius} ${size / 2}`}
          fill="none"
          stroke="rgba(255, 255, 255, 0.1)"
          strokeWidth={12}
          strokeLinecap="round"
        />

        {/* 进度半圆 */}
        <motion.path
          d={`M ${size / 2 - radius} ${size / 2} A ${radius} ${radius} 0 0 1 ${size / 2 + radius} ${size / 2}`}
          fill="none"
          stroke={colorMap[color]}
          strokeWidth={12}
          strokeLinecap="round"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 1, ease: 'easeOut' }}
        />
      </svg>

      {/* 数值 */}
      <div className="absolute bottom-0 flex flex-col items-center">
        {showValue && (
          <span className="text-3xl font-bold text-white">
            {Math.round(value)}
          </span>
        )}
        {label && (
          <span className="text-sm text-gray-400">{label}</span>
        )}
      </div>
    </div>
  );
};

export default ProgressRing;
