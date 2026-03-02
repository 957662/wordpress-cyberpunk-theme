'use client';

import React from 'react';
import { motion, useSpring, useTransform } from 'framer-motion';
import { cn } from '@/lib/utils/cn';

export interface NeonProgressBarProps {
  /**
   * 进度值 (0-100)
   */
  value: number;

  /**
   * 最大值
   */
  max?: number;

  /**
   * 是否显示百分比
   */
  showPercentage?: boolean;

  /**
   * 是否显示数值
   */
  showValue?: boolean;

  /**
   * 进度条高度
   */
  height?: 'sm' | 'md' | 'lg';

  /**
   * 主题颜色
   */
  color?: 'cyan' | 'purple' | 'pink' | 'green' | 'yellow';

  /**
   * 是否显示发光效果
   */
  glow?: boolean;

  /**
   * 是否显示条纹动画
   */
  striped?: boolean;

  /**
   * 是否显示标签
   */
  label?: string;

  /**
   * 自定义类名
   */
  className?: string;
}

const colorStyles = {
  cyan: {
    bg: 'bg-cyber-cyan',
    text: 'text-cyber-cyan',
    border: 'border-cyber-cyan',
    shadow: 'shadow-glow-cyan',
  },
  purple: {
    bg: 'bg-cyber-purple',
    text: 'text-cyber-purple',
    border: 'border-cyber-purple',
    shadow: 'shadow-glow-purple',
  },
  pink: {
    bg: 'bg-cyber-pink',
    text: 'text-cyber-pink',
    border: 'border-cyber-pink',
    shadow: 'shadow-glow-pink',
  },
  green: {
    bg: 'bg-cyber-green',
    text: 'text-cyber-green',
    border: 'border-cyber-green',
    shadow: 'shadow-[0_0_10px_#00ff88]',
  },
  yellow: {
    bg: 'bg-cyber-yellow',
    text: 'text-cyber-yellow',
    border: 'border-cyber-yellow',
    shadow: 'shadow-neon-yellow',
  },
};

const heightStyles = {
  sm: 'h-2',
  md: 'h-4',
  lg: 'h-6',
};

/**
 * NeonProgressBar - 赛博朋克风格进度条组件
 *
 * @example
 * ```tsx
 * <NeonProgressBar value={75} color="cyan" />
 * <NeonProgressBar value={50} label="加载中..." showPercentage striped />
 * <NeonProgressBar value={90} color="purple" glow height="lg" />
 * ```
 */
export const NeonProgressBar: React.FC<NeonProgressBarProps> = ({
  value,
  max = 100,
  showPercentage = false,
  showValue = false,
  height = 'md',
  color = 'cyan',
  glow = false,
  striped = false,
  label,
  className = '',
}) => {
  const styles = colorStyles[color];
  const percentage = Math.min(Math.max((value / max) * 100, 0), 100);

  const spring = useSpring(percentage, {
    stiffness: 100,
    damping: 30,
    mass: 1,
  });

  const width = useTransform(spring, (latest) => `${latest}%`);

  return (
    <div className={cn('w-full', className)}>
      {/* 标签和百分比 */}
      {(label || showPercentage || showValue) && (
        <div className="flex justify-between items-center mb-2">
          {label && (
            <span className={cn('font-mono text-sm font-medium', styles.text)}>
              {label}
            </span>
          )}
          <div className="flex items-center gap-2">
            {showValue && (
              <span className={cn('font-mono text-sm', styles.text)}>
                {value}
                {max !== 100 && ` / ${max}`}
              </span>
            )}
            {showPercentage && (
              <span className={cn('font-mono text-sm font-bold', styles.text)}>
                {Math.round(percentage)}%
              </span>
            )}
          </div>
        </div>
      )}

      {/* 进度条容器 */}
      <div
        className={cn(
          'relative w-full rounded-full overflow-hidden',
          'bg-cyber-darker border-2',
          styles.border,
          heightStyles[height],
          glow && styles.shadow
        )}
      >
        {/* 进度填充 */}
        <motion.div
          style={{ width }}
          className={cn(
            'absolute inset-y-0 left-0',
            styles.bg,
            'rounded-full',
            'relative',
            'overflow-hidden'
          )}
        >
          {/* 条纹动画 */}
          {striped && (
            <motion.div
              className="absolute inset-0"
              animate={{
                x: ['-100%', '100%'],
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                ease: 'linear',
              }}
              style={{
                background: `linear-gradient(90deg, transparent 0%, rgba(255, 255, 255, 0.2) 50%, transparent 100%)`,
                backgroundSize: '200% 100%',
              }}
            />
          )}
        </motion.div>

        {/* 发光边框 */}
        {glow && (
          <motion.div
            style={{ width }}
            className={cn(
              'absolute inset-0 rounded-full',
              'pointer-events-none'
            )}
          >
            <div
              className={cn(
                'absolute inset-0 rounded-full blur-sm',
                color === 'cyan' && 'bg-cyber-cyan/30',
                color === 'purple' && 'bg-cyber-purple/30',
                color === 'pink' && 'bg-cyber-pink/30',
                color === 'green' && 'bg-cyber-green/30',
                color === 'yellow' && 'bg-cyber-yellow/30'
              )}
            />
          </motion.div>
        )}

        {/* 扫描线效果 */}
        <motion.div
          className="absolute inset-0 pointer-events-none"
          animate={{
            y: ['-100%', '100%'],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: 'linear',
          }}
        >
          <div
            className={cn(
              'w-full h-1/4 blur-sm',
              color === 'cyan' && 'bg-cyber-cyan/20',
              color === 'purple' && 'bg-cyber-purple/20',
              color === 'pink' && 'bg-cyber-pink/20',
              color === 'green' && 'bg-cyber-green/20',
              color === 'yellow' && 'bg-cyber-yellow/20'
            )}
          />
        </motion.div>

        {/* 网格背景 */}
        <div className="absolute inset-0 opacity-20 pointer-events-none">
          <div
            className="w-full h-full"
            style={{
              backgroundImage: `
                linear-gradient(${color === 'cyan' ? 'rgba(0, 240, 255, 0.3)' : color === 'purple' ? 'rgba(157, 0, 255, 0.3)' : color === 'pink' ? 'rgba(255, 0, 128, 0.3)' : color === 'green' ? 'rgba(0, 255, 136, 0.3)' : 'rgba(240, 255, 0, 0.3)'} 1px, transparent 1px),
                linear-gradient(90deg, ${color === 'cyan' ? 'rgba(0, 240, 255, 0.3)' : color === 'purple' ? 'rgba(157, 0, 255, 0.3)' : color === 'pink' ? 'rgba(255, 0, 128, 0.3)' : color === 'green' ? 'rgba(0, 255, 136, 0.3)' : 'rgba(240, 255, 0, 0.3)'} 1px, transparent 1px)
              `,
              backgroundSize: '10px 10px',
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default NeonProgressBar;
