/**
 * NeonButton Component
 * 霓虹发光按钮组件
 */

'use client';

import { motion, HTMLMotionProps } from 'framer-motion';
import { cn } from '@/lib/utils';
import { forwardRef, ReactNode } from 'react';

export interface NeonButtonProps extends HTMLMotionProps<'button'> {
  variant?: 'cyan' | 'purple' | 'pink' | 'yellow' | 'green';
  size?: 'sm' | 'md' | 'lg';
  glow?: boolean;
  children: ReactNode;
}

const colorClasses = {
  cyan: {
    bg: 'bg-cyber-cyan/10 hover:bg-cyber-cyan/20',
    border: 'border-cyber-cyan/30 hover:border-cyber-cyan/60',
    text: 'text-cyber-cyan',
    glow: 'shadow-neon-cyan',
  },
  purple: {
    bg: 'bg-cyber-purple/10 hover:bg-cyber-purple/20',
    border: 'border-cyber-purple/30 hover:border-cyber-purple/60',
    text: 'text-cyber-purple',
    glow: 'shadow-neon-purple',
  },
  pink: {
    bg: 'bg-cyber-pink/10 hover:bg-cyber-pink/20',
    border: 'border-cyber-pink/30 hover:border-cyber-pink/60',
    text: 'text-cyber-pink',
    glow: 'shadow-neon-pink',
  },
  yellow: {
    bg: 'bg-cyber-yellow/10 hover:bg-cyber-yellow/20',
    border: 'border-cyber-yellow/30 hover:border-cyber-yellow/60',
    text: 'text-cyber-yellow',
    glow: 'shadow-neon-yellow',
  },
  green: {
    bg: 'bg-cyber-green/10 hover:bg-cyber-green/20',
    border: 'border-cyber-green/30 hover:border-cyber-green/60',
    text: 'text-cyber-green',
    glow: 'shadow-[0_0_5px_#00ff88,0_0_20px_#00ff88]',
  },
};

const sizeClasses = {
  sm: 'px-3 py-1.5 text-sm',
  md: 'px-4 py-2 text-base',
  lg: 'px-6 py-3 text-lg',
};

export const NeonButton = forwardRef<HTMLButtonElement, NeonButtonProps>(
  ({ variant = 'cyan', size = 'md', glow = true, children, className, disabled, ...props }, ref) => {
    const colors = colorClasses[variant];
    const sizeClass = sizeClasses[size];

    return (
      <motion.button
        ref={ref}
        disabled={disabled}
        className={cn(
          'relative overflow-hidden rounded-lg border font-medium transition-all duration-300',
          'disabled:opacity-50 disabled:cursor-not-allowed',
          colors.bg,
          colors.border,
          colors.text,
          sizeClass,
          glow && colors.glow,
          className
        )}
        whileHover={{ scale: disabled ? 1 : 1.02 }}
        whileTap={{ scale: disabled ? 1 : 0.98 }}
        {...props}
      >
        {/* 发光效果 */}
        {glow && !disabled && (
          <motion.div
            className="absolute inset-0 rounded-lg"
            initial={{ opacity: 0.5 }}
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
            style={{
              background: `radial-gradient(circle at var(--mouse-x, 50%) var(--mouse-y, 50%), rgba(255,255,255,0.1), transparent 50%)`,
            }}
            onMouseMove={(e) => {
              const rect = e.currentTarget.getBoundingClientRect();
              const x = ((e.clientX - rect.left) / rect.width) * 100;
              const y = ((e.clientY - rect.top) / rect.height) * 100;
              e.currentTarget.style.setProperty('--mouse-x', `${x}%`);
              e.currentTarget.style.setProperty('--mouse-y', `${y}%`);
            }}
          />
        )}

        <span className="relative z-10">{children}</span>
      </motion.button>
    );
  }
);

NeonButton.displayName = 'NeonButton';

export default NeonButton;
