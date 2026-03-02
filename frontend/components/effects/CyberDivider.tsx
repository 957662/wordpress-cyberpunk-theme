'use client';

import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface CyberDividerProps {
  variant?: 'line' | 'dashed' | 'dots' | 'gradient' | 'scan';
  color?: 'cyan' | 'purple' | 'pink' | 'yellow';
  thickness?: number;
  className?: string;
  label?: string;
}

export function CyberDivider({
  variant = 'line',
  color = 'cyan',
  thickness = 1,
  className = '',
  label,
}: CyberDividerProps) {
  const colorMap = {
    cyan: 'border-cyber-cyan bg-cyber-cyan',
    purple: 'border-cyber-purple bg-cyber-purple',
    pink: 'border-cyber-pink bg-cyber-pink',
    yellow: 'border-cyber-yellow bg-cyber-yellow',
  };

  const colors = colorMap[color];

  if (variant === 'dashed') {
    return (
      <div className={cn('flex items-center gap-4 my-6', className)}>
        <div className={cn('flex-1 border-t border-dashed', colors)} style={{ borderWidth: thickness }} />
        {label && <span className={cn('text-sm font-mono', colors)}>{label}</span>}
        <div className={cn('flex-1 border-t border-dashed', colors)} style={{ borderWidth: thickness }} />
      </div>
    );
  }

  if (variant === 'dots') {
    return (
      <div className={cn('flex items-center justify-center gap-2 my-6', className)}>
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className={cn('w-1 h-1 rounded-full', colors)}
            animate={{
              scale: [1, 1.5, 1],
              opacity: [0.5, 1, 0.5],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              delay: i * 0.1,
            }}
          />
        ))}
      </div>
    );
  }

  if (variant === 'gradient') {
    const gradientColors = {
      cyan: 'from-cyber-cyan to-cyber-purple',
      purple: 'from-cyber-purple to-cyber-pink',
      pink: 'from-cyber-pink to-cyber-yellow',
      yellow: 'from-cyber-yellow to-cyber-cyan',
    };

    return (
      <div className={cn('flex items-center gap-4 my-6', className)}>
        <div
          className={cn('flex-1 h-px bg-gradient-to-r', gradientColors[color])}
          style={{ height: thickness }}
        />
        {label && (
          <span className={cn('text-sm font-mono px-4 py-1 rounded', colors, 'bg-cyber-card')}>
            {label}
          </span>
        )}
        <div
          className={cn('flex-1 h-px bg-gradient-to-l', gradientColors[color])}
          style={{ height: thickness }}
        />
      </div>
    );
  }

  if (variant === 'scan') {
    return (
      <div className={cn('relative my-6 overflow-hidden', className)}>
        {/* 扫描线背景 */}
        <div className="absolute inset-0 bg-[url('/patterns/scanlines.svg')] opacity-20" />
        {/* 扫描动画 */}
        <motion.div
          className={cn('h-px', colors)}
          animate={{
            y: ['-100%', '100%'],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: 'linear',
          }}
        />
      </div>
    );
  }

  // line variant (default)
  return (
    <div className={cn('flex items-center gap-4 my-6', className)}>
      <div className={cn('flex-1 border-t', colors)} style={{ borderWidth: thickness }} />
      {label && <span className={cn('text-sm font-mono', colors)}>{label}</span>}
      <div className={cn('flex-1 border-t', colors)} style={{ borderWidth: thickness }} />
    </div>
  );
}

export default CyberDivider;
