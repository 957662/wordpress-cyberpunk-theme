/**
 * 滚动指示器组件
 */

'use client';

import { motion, useScroll, useSpring } from 'framer-motion';
import { cn } from '@/lib/utils';

export interface ScrollIndicatorProps {
  color?: 'cyan' | 'purple' | 'pink' | 'yellow' | 'green';
  position?: 'top' | 'bottom';
  thickness?: number;
  showPercentage?: boolean;
  className?: string;
}

export function ScrollIndicator({
  color = 'cyan',
  position = 'top',
  thickness = 3,
  showPercentage = false,
  className,
}: ScrollIndicatorProps) {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  });

  const percentage = Math.round(scrollYProgress.get() * 100);

  const positionStyles = {
    top: 'top-0 left-0 right-0',
    bottom: 'bottom-0 left-0 right-0',
  };

  return (
    <div className="fixed left-0 right-0 z-50 pointer-events-none">
      {/* 进度条 */}
      <motion.div
        className={cn(
          'origin-left',
          positionStyles[position],
          `h-${thickness}`,
          `bg-cyber-${color}`,
          color === 'cyan' && 'shadow-neon-cyan',
          color === 'purple' && 'shadow-neon-purple',
          color === 'pink' && 'shadow-neon-pink',
          color === 'yellow' && 'shadow-neon-yellow',
          className
        )}
        style={{
          scaleX,
          height: `${thickness}px`,
        }}
      />

      {/* 百分比显示 */}
      {showPercentage && (
        <motion.div
          className={cn(
            'fixed right-4 font-mono text-sm font-bold',
            `text-cyber-${color}`,
            position === 'top' ? 'top-4' : 'bottom-4'
          )}
          initial={{ opacity: 0 }}
          animate={{ opacity: scrollYProgress.get() > 0.1 ? 1 : 0 }}
        >
          {percentage}%
        </motion.div>
      )}
    </div>
  );
}

/**
 * 圆形滚动指示器
 */
export interface CircularScrollIndicatorProps {
  size?: number;
  thickness?: number;
  color?: 'cyan' | 'purple' | 'pink' | 'yellow';
  className?: string;
}

export function CircularScrollIndicator({
  size = 60,
  thickness = 4,
  color = 'cyan',
  className,
}: CircularScrollIndicatorProps) {
  const { scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
  });

  const circumference = 2 * Math.PI * ((size - thickness) / 2);
  const strokeDashoffset = circumference - (progress.get() * circumference) / 100;

  return (
    <motion.div
      className={cn('fixed bottom-8 right-8 z-50', className)}
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      transition={{ delay: 0.5 }}
    >
      <svg width={size} height={size} className="transform -rotate-90">
        {/* 背景圆 */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={(size - thickness) / 2}
          fill="none"
          stroke="rgba(26, 26, 46, 0.5)"
          strokeWidth={thickness}
        />

        {/* 进度圆 */}
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={(size - thickness) / 2}
          fill="none"
          className={`stroke-cyber-${color}`}
          strokeWidth={thickness}
          strokeLinecap="round"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset }}
          transition={{ duration: 0.5 }}
        />

        {/* 百分比文本 */}
        <text
          x="50%"
          y="50%"
          textAnchor="middle"
          dy=".3em"
          className={`text-xs font-mono font-bold fill-cyber-${color}`}
          style={{ fontSize: `${size / 5}px` }}
        >
          <animate
            attributeName="opacity"
            values={progress.get() > 0.1 ? '1' : '0'}
            dur="0.3s"
            fill="freeze"
          />
          {Math.round(progress.get() * 100)}%
        </text>
      </svg>
    </motion.div>
  );
}
