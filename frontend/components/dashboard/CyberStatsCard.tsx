/**
 * CyberStatsCard - 赛博朋克风格统计卡片
 * 用于显示各种统计数据，带有霓虹发光效果和动画
 */

'use client';

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface CyberStatsCardProps {
  title: string;
  value: string | number;
  icon?: LucideIcon;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  description?: string;
  color?: 'cyan' | 'purple' | 'pink' | 'green' | 'yellow';
  size?: 'sm' | 'md' | 'lg';
  animated?: boolean;
  delay?: number;
  glow?: boolean;
  className?: string;
}

const colorConfig = {
  cyan: {
    primary: 'from-cyan-500 to-blue-500',
    glow: 'shadow-cyan-500/50',
    text: 'text-cyan-400',
    bg: 'bg-cyan-500/10',
    border: 'border-cyan-500/30',
  },
  purple: {
    primary: 'from-purple-500 to-pink-500',
    glow: 'shadow-purple-500/50',
    text: 'text-purple-400',
    bg: 'bg-purple-500/10',
    border: 'border-purple-500/30',
  },
  pink: {
    primary: 'from-pink-500 to-rose-500',
    glow: 'shadow-pink-500/50',
    text: 'text-pink-400',
    bg: 'bg-pink-500/10',
    border: 'border-pink-500/30',
  },
  green: {
    primary: 'from-green-500 to-emerald-500',
    glow: 'shadow-green-500/50',
    text: 'text-green-400',
    bg: 'bg-green-500/10',
    border: 'border-green-500/30',
  },
  yellow: {
    primary: 'from-yellow-500 to-orange-500',
    glow: 'shadow-yellow-500/50',
    text: 'text-yellow-400',
    bg: 'bg-yellow-500/10',
    border: 'border-yellow-500/30',
  },
};

const sizeConfig = {
  sm: {
    padding: 'p-4',
    iconSize: 16,
    titleSize: 'text-sm',
    valueSize: 'text-2xl',
  },
  md: {
    padding: 'p-6',
    iconSize: 20,
    titleSize: 'text-base',
    valueSize: 'text-3xl',
  },
  lg: {
    padding: 'p-8',
    iconSize: 24,
    titleSize: 'text-lg',
    valueSize: 'text-4xl',
  },
};

export function CyberStatsCard({
  title,
  value,
  icon: Icon,
  trend,
  description,
  color = 'cyan',
  size = 'md',
  animated = true,
  delay = 0,
  glow = true,
  className,
}: CyberStatsCardProps) {
  const [displayValue, setDisplayValue] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const config = colorConfig[color];
  const sizeStyles = sizeConfig[size];

  // 数字动画效果
  useEffect(() => {
    if (animated && typeof value === 'number') {
      setIsVisible(true);
      const duration = 1000;
      const steps = 60;
      const stepValue = value / steps;
      let currentStep = 0;

      const timer = setInterval(() => {
        currentStep++;
        if (currentStep <= steps) {
          setDisplayValue(Math.floor(stepValue * currentStep));
        } else {
          setDisplayValue(value);
          clearInterval(timer);
        }
      }, duration / steps);

      return () => clearInterval(timer);
    } else {
      setDisplayValue(0);
    }
  }, [value, animated]);

  const formatValue = (val: string | number) => {
    if (typeof val === 'number') {
      return animated ? displayValue.toLocaleString() : val.toLocaleString();
    }
    return val;
  };

  const cardVariants = {
    hidden: {
      opacity: 0,
      y: 20,
      scale: 0.95,
    },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 0.5,
        delay,
        ease: [0.4, 0, 0.2, 1],
      },
    },
  };

  return (
    <motion.div
      variants={cardVariants}
      initial="hidden"
      animate={isVisible ? 'visible' : 'hidden'}
      whileHover={{ scale: 1.02, y: -2 }}
      className={cn(
        'relative overflow-hidden rounded-lg border',
        'bg-gradient-to-br from-gray-900/50 to-gray-800/50',
        'backdrop-blur-sm transition-all duration-300',
        config.border,
        glow && `shadow-lg ${config.glow}`,
        sizeStyles.padding,
        className
      )}
    >
      {/* 背景装饰 */}
      <div className={cn(
        'absolute inset-0 bg-gradient-to-br opacity-10',
        config.primary
      )} />

      {/* 扫描线效果 */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: 'linear-gradient(0deg, transparent 24%, rgba(255, 255, 255, .05) 25%, rgba(255, 255, 255, .05) 26%, transparent 27%, transparent 74%, rgba(255, 255, 255, .05) 75%, rgba(255, 255, 255, .05) 76%, transparent 77%, transparent)',
          backgroundSize: '100% 4px'
        }} />
      </div>

      {/* 内容 */}
      <div className="relative">
        {/* 头部 */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <p className={cn(
              'font-medium text-gray-400 mb-1',
              sizeStyles.titleSize
            )}>
              {title}
            </p>

            {/* 数值 */}
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: delay + 0.2 }}
              className={cn(
                'font-bold bg-gradient-to-r bg-clip-text text-transparent',
                config.primary,
                sizeStyles.valueSize
              )}
            >
              {formatValue(value)}
            </motion.div>
          </div>

          {/* 图标 */}
          {Icon && (
            <motion.div
              initial={{ rotate: -180, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              transition={{ delay: delay + 0.3, type: 'spring' }}
              className={cn(
                'p-3 rounded-lg',
                config.bg,
                'border',
                config.border
              )}
            >
              <Icon
                size={sizeStyles.iconSize}
                className={cn(config.text)}
              />
            </motion.div>
          )}
        </div>

        {/* 趋势和描述 */}
        <div className="space-y-2">
          {trend && (
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: delay + 0.4 }}
              className={cn(
                'flex items-center gap-1 text-sm font-medium',
                trend.isPositive ? 'text-green-400' : 'text-red-400'
              )}
            >
              <span className="text-lg">
                {trend.isPositive ? '↑' : '↓'}
              </span>
              <span>{Math.abs(trend.value)}%</span>
              <span className="text-gray-500 font-normal ml-1">
                vs 上期
              </span>
            </motion.div>
          )}

          {description && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: delay + 0.5 }}
              className="text-sm text-gray-500"
            >
              {description}
            </motion.p>
          )}
        </div>
      </div>

      {/* 霓虹边框效果 */}
      <div className={cn(
        'absolute inset-0 rounded-lg',
        'bg-gradient-to-r opacity-20 hover:opacity-40 transition-opacity',
        config.primary
      )}
        style={{
          padding: '1px',
          mask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
          maskComposite: 'exclude',
          WebkitMaskComposite: 'xor',
        }}
      />
    </motion.div>
  );
}

export default CyberStatsCard;
