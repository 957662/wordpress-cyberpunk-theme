'use client';

/**
 * ScannerLine Component
 * 赛博朋克风格的扫描线效果
 */

import { motion } from 'framer-motion';
import { cn } from '@/lib/utils/cn';

export interface ScannerLineProps {
  /** 扫描线颜色 */
  color?: string;
  /** 扫描线高度 */
  height?: number;
  /** 扫描速度（秒） */
  duration?: number;
  /** 是否显示网格背景 */
  showGrid?: boolean;
  /** 自定义类名 */
  className?: string;
  /** 扫描方向 */
  direction?: 'up' | 'down';
}

export function ScannerLine({
  color = '#00f0ff',
  height = 2,
  duration = 3,
  showGrid = true,
  className,
  direction = 'down',
}: ScannerLineProps) {
  const scanAnimation = {
    top: direction === 'down' ? ['0%', '100%'] : ['100%', '0%'],
  };

  return (
    <div
      className={cn('relative overflow-hidden', className)}
      style={{
        background: showGrid
          ? `linear-gradient(rgba(0, 240, 255, 0.03) 1px, transparent 1px),
             linear-gradient(90deg, rgba(0, 240, 255, 0.03) 1px, transparent 1px)`
          : 'transparent',
        backgroundSize: showGrid ? '20px 20px' : 'auto',
      }}
    >
      {/* 扫描线 */}
      <motion.div
        className="absolute left-0 right-0 z-10"
        style={{
          height: `${height}px`,
          background: `linear-gradient(to bottom,
            transparent,
            ${color}40,
            ${color},
            ${color}40,
            transparent)`,
          boxShadow: `0 0 ${height * 4}px ${color}`,
        }}
        animate={scanAnimation}
        transition={{
          duration,
          repeat: Infinity,
          ease: 'linear',
        }}
      />

      {/* 扫描线后的光晕 */}
      <motion.div
        className="absolute left-0 right-0 z-0"
        style={{
          height: '20px',
          background: `radial-gradient(ellipse at center, ${color}20 0%, transparent 70%)`,
        }}
        animate={scanAnimation}
        transition={{
          duration,
          repeat: Infinity,
          ease: 'linear',
        }}
      />
    </div>
  );
}

export default ScannerLine;
