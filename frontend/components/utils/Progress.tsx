'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

export interface ProgressProps {
  value: number;
  max?: number;
  label?: string;
  showPercentage?: boolean;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'default' | 'success' | 'warning' | 'error' | 'cyber' | 'neon';
  animated?: boolean;
  striped?: boolean;
  className?: string;
}

/**
 * ProgressBar - 进度条组件
 *
 * @example
 * ```tsx
 * <ProgressBar value={75} label="Loading..." />
 * <ProgressBar value={45} variant="cyber" animated striped />
 * ```
 */
export const ProgressBar: React.FC<ProgressProps> = ({
  value,
  max = 100,
  label,
  showPercentage = true,
  size = 'md',
  variant = 'default',
  animated = false,
  striped = false,
  className = '',
}) => {
  const percentage = Math.min(Math.max((value / max) * 100, 0), 100);

  const sizes = {
    sm: 'h-1',
    md: 'h-2',
    lg: 'h-3',
  };

  const variants = {
    default: 'bg-gray-700',
    success: 'bg-green-600',
    warning: 'bg-yellow-600',
    error: 'bg-red-600',
    cyber: 'bg-gradient-to-r from-cyber-cyan via-cyber-purple to-cyber-pink',
    neon: 'bg-cyber-cyan shadow-[0_0_10px_rgba(0,240,255,0.5)]',
  };

  const currentVariant = variants[variant];

  return (
    <div className={`w-full ${className}`}>
      {(label || showPercentage) && (
        <div className="flex justify-between items-center mb-1">
          {label && <span className="text-sm text-gray-400">{label}</span>}
          {showPercentage && (
            <span className="text-sm text-gray-400">{Math.round(percentage)}%</span>
          )}
        </div>
      )}
      <div className={`w-full ${sizes[size]} bg-gray-900 rounded-full overflow-hidden`}>
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
          className={`h-full ${currentVariant} ${striped ? 'bg-[length:1rem_1rem] bg-[linear-gradient(45deg,rgba(255,255,255,0.15)_25%,transparent_25%,transparent_50%,rgba(255,255,255,0.15)_50%,rgba(255,255,255,0.15)_75%,transparent_75%,transparent)]' : ''} ${animated ? 'animate-[striped_1s_linear_infinite]' : ''} rounded-full`}
        />
      </div>
    </div>
  );
};

/**
 * CircularProgress - 圆形进度条
 */
export const CircularProgress: React.FC<{
  value: number;
  max?: number;
  size?: number;
  strokeWidth?: number;
  label?: string;
  showPercentage?: boolean;
  variant?: 'default' | 'success' | 'warning' | 'error' | 'cyber';
  className?: string;
}> = ({
  value,
  max = 100,
  size = 120,
  strokeWidth = 8,
  label,
  showPercentage = true,
  variant = 'default',
  className = '',
}) => {
  const percentage = Math.min(Math.max((value / max) * 100, 0), 100);
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - (percentage / 100) * circumference;

  const colors = {
    default: '#4b5563',
    success: '#22c55e',
    warning: '#eab308',
    error: '#ef4444',
    cyber: '#00f0ff',
  };

  const color = colors[variant];

  return (
    <div className={`relative inline-flex items-center justify-center ${className}`}>
      <svg width={size} height={size} className="transform -rotate-90">
        {/* Background circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="#1f2937"
          strokeWidth={strokeWidth}
          fill="transparent"
        />
        {/* Progress circle */}
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={color}
          strokeWidth={strokeWidth}
          fill="transparent"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
          strokeLinecap="round"
        />
      </svg>
      <div className="absolute flex flex-col items-center">
        {label && <span className="text-xs text-gray-500 mb-1">{label}</span>}
        {showPercentage && (
          <span className="text-2xl font-bold text-gray-300">
            {Math.round(percentage)}%
          </span>
        )}
      </div>
    </div>
  );
};

/**
 * ProgressSteps - 步骤进度条
 */
export const ProgressSteps: React.FC<{
  steps: Array<{ label: string; status: 'complete' | 'current' | 'pending' }>;
  className?: string;
}> = ({ steps, className = '' }) => {
  return (
    <div className={`flex items-center justify-between ${className}`}>
      {steps.map((step, index) => (
        <React.Fragment key={index}>
          {/* Step */}
          <div className="flex flex-col items-center">
            <div
              className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm border-2 ${
                step.status === 'complete'
                  ? 'bg-cyber-cyan border-cyber-cyan text-black'
                  : step.status === 'current'
                  ? 'bg-cyber-purple border-cyber-purple text-white'
                  : 'bg-gray-800 border-gray-700 text-gray-500'
              }`}
            >
              {step.status === 'complete' ? '✓' : index + 1}
            </div>
            <span
              className={`mt-2 text-sm ${
                step.status === 'pending' ? 'text-gray-600' : 'text-gray-300'
              }`}
            >
              {step.label}
            </span>
          </div>

          {/* Line */}
          {index < steps.length - 1 && (
            <div
              className={`flex-1 h-0.5 mx-4 ${
                step.status === 'complete' ? 'bg-cyber-cyan' : 'bg-gray-700'
              }`}
            />
          )}
        </React.Fragment>
      ))}
    </div>
  );
};

/**
 * StatCard - 统计卡片
 */
export const StatCard: React.FC<{
  title: string;
  value: string | number;
  change?: number;
  changeType?: 'increase' | 'decrease' | 'neutral';
  icon?: React.ReactNode;
  trend?: 'up' | 'down' | 'neutral';
  className?: string;
}> = ({
  title,
  value,
  change,
  changeType = 'neutral',
  icon,
  trend = 'neutral',
  className = '',
}) => {
  const getTrendIcon = () => {
    switch (trend) {
      case 'up':
        return <TrendingUp className="w-4 h-4 text-green-400" />;
      case 'down':
        return <TrendingDown className="w-4 h-4 text-red-400" />;
      default:
        return <Minus className="w-4 h-4 text-gray-400" />;
    }
  };

  const getChangeColor = () => {
    switch (changeType) {
      case 'increase':
        return 'text-green-400';
      case 'decrease':
        return 'text-red-400';
      default:
        return 'text-gray-400';
    }
  };

  return (
    <motion.div
      whileHover={{ y: -2 }}
      className={`p-6 rounded-xl border border-gray-800 bg-[#0a0a0f] ${className}`}
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-gray-500 mb-1">{title}</p>
          <p className="text-2xl font-bold text-gray-100">{value}</p>
          {change !== undefined && (
            <div className={`flex items-center gap-1 mt-2 text-sm ${getChangeColor()}`}>
              {getTrendIcon()}
              <span>{change > 0 ? '+' : ''}{change}%</span>
              <span className="text-gray-600 ml-1">vs last month</span>
            </div>
          )}
        </div>
        {icon && (
          <div className="p-3 rounded-lg bg-cyber-purple/10 text-cyber-purple">
            {icon}
          </div>
        )}
      </div>
    </motion.div>
  );
};

/**
 * ProgressRing - 进度环（带动画）
 */
export const ProgressRing: React.FC<{
  progress: number;
  size?: number;
  strokeWidth?: number;
  children?: React.ReactNode;
  className?: string;
}> = ({ progress, size = 60, strokeWidth = 4, children, className = '' }) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - (progress / 100) * circumference;

  return (
    <div className={`relative ${className}`}>
      <svg width={size} height={size} className="transform -rotate-90">
        <circle
          stroke="#1f2937"
          strokeWidth={strokeWidth}
          fill="transparent"
          r={radius}
          cx={size / 2}
          cy={size / 2}
        />
        <motion.circle
          stroke="url(#gradient)"
          strokeWidth={strokeWidth}
          fill="transparent"
          r={radius}
          cx={size / 2}
          cy={size / 2}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 0.5 }}
        />
        <defs>
          <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#00f0ff" />
            <stop offset="100%" stopColor="#9d00ff" />
          </linearGradient>
        </defs>
      </svg>
      {children && (
        <div className="absolute inset-0 flex items-center justify-center">
          {children}
        </div>
      )}
    </div>
  );
};

export default ProgressBar;
