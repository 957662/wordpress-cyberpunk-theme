/**
 * 赛博朋克进度条组件
 * 带有发光效果和动画的进度条
 */

'use client';

import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';

export interface CyberProgressProps {
  value: number;
  max?: number;
  color?: 'cyan' | 'purple' | 'pink' | 'yellow' | 'green';
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
  showPercentage?: boolean;
  animated?: boolean;
  glowing?: boolean;
  className?: string;
  label?: string;
}

const colorMap = {
  cyan: {
    bg: 'bg-cyber-cyan',
    border: 'border-cyber-cyan',
    text: 'text-cyber-cyan',
    shadow: 'shadow-neon-cyan',
    glow: 'rgba(0, 240, 255, 0.5)',
  },
  purple: {
    bg: 'bg-cyber-purple',
    border: 'border-cyber-purple',
    text: 'text-cyber-purple',
    shadow: 'shadow-neon-purple',
    glow: 'rgba(157, 0, 255, 0.5)',
  },
  pink: {
    bg: 'bg-cyber-pink',
    border: 'border-cyber-pink',
    text: 'text-cyber-pink',
    shadow: 'shadow-neon-pink',
    glow: 'rgba(255, 0, 128, 0.5)',
  },
  yellow: {
    bg: 'bg-cyber-yellow',
    border: 'border-cyber-yellow',
    text: 'text-cyber-yellow',
    shadow: 'shadow-neon-yellow',
    glow: 'rgba(240, 255, 0, 0.5)',
  },
  green: {
    bg: 'bg-cyber-green',
    border: 'border-cyber-green',
    text: 'text-cyber-green',
    shadow: '0 0 10px rgba(0, 255, 136, 0.5)',
    glow: 'rgba(0, 255, 136, 0.5)',
  },
};

const sizeMap = {
  sm: { height: 'h-2', text: 'text-xs' },
  md: { height: 'h-3', text: 'text-sm' },
  lg: { height: 'h-4', text: 'text-base' },
};

export function CyberProgress({
  value,
  max = 100,
  color = 'cyan',
  size = 'md',
  showLabel = false,
  showPercentage = true,
  animated = true,
  glowing = true,
  className,
  label,
}: CyberProgressProps) {
  const [displayValue, setDisplayValue] = useState(0);
  const colors = colorMap[color];
  const { height, text } = sizeMap[size];

  const percentage = Math.min((value / max) * 100, 100);

  useEffect(() => {
    if (!animated) {
      setDisplayValue(percentage);
      return;
    }

    const duration = 1000;
    const steps = 60;
    const increment = percentage / steps;
    const stepDuration = duration / steps;

    let current = 0;
    const timer = setInterval(() => {
      current += increment;
      if (current >= percentage) {
        setDisplayValue(percentage);
        clearInterval(timer);
      } else {
        setDisplayValue(current);
      }
    }, stepDuration);

    return () => clearInterval(timer);
  }, [percentage, animated]);

  return (
    <div className={cn('w-full', className)}>
      {/* 标签和百分比 */}
      {(showLabel || showPercentage) && (
        <div className="flex justify-between items-center mb-2">
          {label && (
            <span className={cn('font-medium text-white', text)}>
              {label}
            </span>
          )}
          {showPercentage && (
            <span className={cn('font-mono', colors.text, text)}>
              {Math.round(displayValue)}%
            </span>
          )}
        </div>
      )}

      {/* 进度条容器 */}
      <div
        className={cn(
          'relative w-full overflow-hidden rounded-full bg-cyber-muted border border-cyber-border',
          height
        )}
      >
        {/* 背景网格 */}
        <div
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage: `
              linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.1) 50%, transparent 100%)
            `,
            backgroundSize: '20px 100%',
          }}
        />

        {/* 进度条 */}
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${displayValue}%` }}
          transition={{ duration: animated ? 1 : 0, ease: 'easeOut' }}
          className={cn(
            'h-full relative overflow-hidden',
            colors.bg,
            glowing && colors.shadow
          )}
        >
          {/* 发光效果 */}
          {glowing && (
            <motion.div
              className="absolute inset-0"
              animate={{
                backgroundPosition: ['0% 0%', '200% 0%'],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: 'linear',
              }}
              style={{
                background: `linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent)`,
                backgroundSize: '200% 100%',
              }}
            />
          )}

          {/* 扫描线 */}
          <motion.div
            className="absolute inset-y-0 w-1"
            animate={{
              left: ['0%', '100%'],
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              ease: 'linear',
            }}
            style={{
              background: colors.glow,
              boxShadow: `0 0 10px ${colors.glow}`,
            }}
          />
        </motion.div>

        {/* 刻度 */}
        <div className="absolute inset-0 flex">
          {[0, 25, 50, 75, 100].map((tick) => (
            <div
              key={tick}
              className="flex-1 border-r border-cyber-border/30"
              style={{ opacity: tick / 100 < displayValue / 100 ? 0.5 : 0.2 }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

export default CyberProgress;
