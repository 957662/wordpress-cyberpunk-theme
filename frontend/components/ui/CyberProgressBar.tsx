/**
 * CyberProgressBar - 赛博朋克进度条组件
 * 带有霓虹发光效果和动画的进度条
 */

'use client';

import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

export interface CyberProgressBarProps {
  progress: number; // 0-100
  className?: string;
  color?: string; // 进度条颜色
  glowColor?: string; // 发光颜色
  size?: 'sm' | 'md' | 'lg';
  animated?: boolean; // 是否显示动画
  showPercentage?: boolean; // 是否显示百分比
  striped?: boolean; // 条纹效果
  label?: string; // 标签
}

export function CyberProgressBar({
  progress,
  className,
  color = '#00f0ff',
  glowColor = '#00f0ff',
  size = 'md',
  animated = true,
  showPercentage = false,
  striped = true,
  label,
}: CyberProgressBarProps) {
  const clampedProgress = Math.min(100, Math.max(0, progress));

  const sizeClasses = {
    sm: 'h-2',
    md: 'h-4',
    lg: 'h-6',
  };

  return (
    <div className={cn('w-full', className)}>
      {/* 标签和百分比 */}
      {(label || showPercentage) && (
        <div className="flex justify-between items-center mb-2">
          {label && (
            <span className="text-sm font-mono text-cyber-cyan">{label}</span>
          )}
          {showPercentage && (
            <span className="text-sm font-mono text-cyber-cyan">
              {Math.round(clampedProgress)}%
            </span>
          )}
        </div>
      )}

      {/* 进度条容器 */}
      <div
        className={cn(
          'relative overflow-hidden rounded-full',
          'bg-cyber-dark/80',
          'border border-cyber-cyan/30',
          'shadow-inner',
          sizeClasses[size]
        )}
      >
        {/* 进度条 */}
        <motion.div
          className={cn(
            'h-full',
            'relative',
            'rounded-full',
            striped && 'striped'
          )}
          initial={{ width: 0 }}
          animate={{ width: `${clampedProgress}%` }}
          transition={{ duration: animated ? 0.8 : 0, ease: 'easeOut' }}
          style={{
            backgroundColor: color,
            boxShadow: `0 0 10px ${glowColor}, 0 0 20px ${glowColor}`,
          }}
        >
          {/* 闪光动画 */}
          {animated && (
            <motion.div
              className="absolute inset-0"
              initial={{ x: '-100%' }}
              animate={{ x: '100%' }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                repeatDelay: 1,
              }}
              style={{
                background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent)',
              }}
            />
          )}

          {/* 条纹效果 */}
          {striped && (
            <div
              className="absolute inset-0"
              style={{
                background: 'repeating-linear-gradient(45deg, transparent, transparent 10px, rgba(0,0,0,0.1) 10px, rgba(0,0,0,0.1) 20px)',
              }}
            />
          )}

          {/* 条纹动画 */}
          {animated && striped && (
            <motion.div
              className="absolute inset-0"
              animate={{ x: [0, 20] }}
              transition={{
                duration: 1,
                repeat: Infinity,
                ease: 'linear',
              }}
              style={{
                background: 'repeating-linear-gradient(45deg, transparent, transparent 10px, rgba(0,0,0,0.1) 10px, rgba(0,0,0,0.1) 20px)',
              }}
            />
          )}
        </motion.div>

        {/* 网格线 */}
        <div
          className="absolute inset-0 pointer-events-none rounded-full"
          style={{
            backgroundImage: `
              linear-gradient(to right, rgba(0, 240, 255, 0.1) 1px, transparent 1px),
              linear-gradient(to bottom, rgba(0, 240, 255, 0.1) 1px, transparent 1px)
            `,
            backgroundSize: '10px 100%',
          }}
        />
      </div>

      <style jsx>{`
        .striped {
          position: relative;
        }

        .striped::after {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: repeating-linear-gradient(
            45deg,
            transparent,
            transparent 10px,
            rgba(0, 0, 0, 0.1) 10px,
            rgba(0, 0, 0, 0.1) 20px
          );
        }
      `}</style>
    </div>
  );
}

export default CyberProgressBar;
