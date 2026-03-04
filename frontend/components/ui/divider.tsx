'use client';

import { motion } from 'framer-motion';
import { cn } from '@/lib/utils/clsx';

export interface DividerProps {
  variant?: 'default' | 'neon' | 'cyber' | 'dashed' | 'dotted';
  glowColor?: 'cyan' | 'purple' | 'pink' | 'yellow';
  orientation?: 'horizontal' | 'vertical';
  size?: 'sm' | 'md' | 'lg';
  label?: string;
  className?: string;
}

export const Divider = ({
  variant = 'default',
  glowColor = 'cyan',
  orientation = 'horizontal',
  size = 'md',
  label,
  className,
}: DividerProps) => {
  const sizeStyles = {
    sm: orientation === 'horizontal' ? 'h-px' : 'w-px',
    md: orientation === 'horizontal' ? 'h-0.5' : 'w-0.5',
    lg: orientation === 'horizontal' ? 'h-1' : 'w-1',
  };

  const variantStyles = {
    default: `bg-cyber-border`,
    neon: `bg-cyber-${glowColor} shadow-[0_0_10px_var(--cyber-${glowColor})]`,
    cyber: `bg-gradient-to-r ${orientation === 'horizontal' ? 'from-cyber-cyan via-cyber-purple to-cyber-cyan' : 'from-cyber-cyan via-cyber-purple to-cyber-cyan'}`,
    dashed: `bg-transparent border-t-2 border-dashed border-cyber-${glowColor}`,
    dotted: `bg-transparent border-t-2 border-dotted border-cyber-${glowColor}`,
  };

  if (label) {
    return (
      <div className={cn('relative flex items-center', className)}>
        <div className={cn('flex-1', sizeStyles[md], variantStyles[variant])} />
        <span className={cn('px-4 text-sm text-gray-400 font-mono whitespace-nowrap')}>
          {label}
        </span>
        <div className={cn('flex-1', sizeStyles[md], variantStyles[variant])} />
      </div>
    );
  }

  return (
    <motion.div
      className={cn(
        'flex-shrink-0',
        sizeStyles[size],
        variantStyles[variant],
        className
      )}
      initial={{ opacity: 0, scaleX: orientation === 'horizontal' ? 0 : 1, scaleY: orientation === 'vertical' ? 0 : 1 }}
      animate={{ opacity: 1, scaleX: 1, scaleY: 1 }}
      transition={{ duration: 0.3 }}
    />
  );
};

export interface SpacerProps {
  size?: number | 'sm' | 'md' | 'lg' | 'xl';
  orientation?: 'horizontal' | 'vertical';
  className?: string;
}

const sizeMap = {
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
};

export const Spacer = ({ size = 'md', orientation = 'vertical', className }: SpacerProps) => {
  const pixelSize = typeof size === 'number' ? size : sizeMap[size];

  return (
    <div
      className={cn('flex-shrink-0', className)}
      style={{
        [orientation === 'vertical' ? 'height' : 'width']: `${pixelSize}px`,
      }}
    />
  );
};
