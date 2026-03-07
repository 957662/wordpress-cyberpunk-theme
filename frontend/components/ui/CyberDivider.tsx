'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

export interface CyberDividerProps {
  variant?: 'default' | 'neon' | 'hologram' | 'gradient';
  color?: 'cyan' | 'purple' | 'pink' | 'green';
  label?: string;
  size?: 'sm' | 'md' | 'lg';
  glow?: boolean;
}

const colorStyles = {
  cyan: {
    from: 'from-cyan-400',
    via: 'via-cyan-400',
    to: 'to-cyan-400',
    shadow: 'shadow-[0_0_10px_rgba(0,240,255,0.5)]',
  },
  purple: {
    from: 'from-purple-400',
    via: 'via-purple-400',
    to: 'to-purple-400',
    shadow: 'shadow-[0_0_10px_rgba(157,0,255,0.5)]',
  },
  pink: {
    from: 'from-pink-400',
    via: 'via-pink-400',
    to: 'to-pink-400',
    shadow: 'shadow-[0_0_10px_rgba(255,0,128,0.5)]',
  },
  green: {
    from: 'from-green-400',
    via: 'via-green-400',
    to: 'to-green-400',
    shadow: 'shadow-[0_0_10px_rgba(0,255,136,0.5)]',
  },
};

const sizeStyles = {
  sm: 'h-px',
  md: 'h-0.5',
  lg: 'h-1',
};

export const CyberDivider = React.forwardRef<HTMLDivElement, CyberDividerProps>(
  (
    {
      variant = 'default',
      color = 'cyan',
      label,
      size = 'md',
      glow = true,
    },
    ref
  ) => {
    const colors = colorStyles[color];

    const dividerContent = (
      <div className="relative flex items-center w-full">
        {/* Left line */}
        <div className={cn('flex-1', sizeStyles[size])}>
          <motion.div
            className={cn(
              'h-full bg-gradient-to-r',
              'from-transparent via-current to-current',
              color === 'cyan' && 'text-cyan-400',
              color === 'purple' && 'text-purple-400',
              color === 'pink' && 'text-pink-400',
              color === 'green' && 'text-green-400',
              glow && colors.shadow
            )}
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
            style={{ originX: 0 }}
          />
        </div>

        {/* Label */}
        {label && (
          <motion.span
            className={cn(
              'px-4 text-sm font-medium',
              color === 'cyan' && 'text-cyan-400',
              color === 'purple' && 'text-purple-400',
              color === 'pink' && 'text-pink-400',
              color === 'green' && 'text-green-400'
            )}
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.3, delay: 0.2 }}
          >
            {label}
          </motion.span>
        )}

        {/* Right line */}
        <div className={cn('flex-1', sizeStyles[size])}>
          <motion.div
            className={cn(
              'h-full bg-gradient-to-l',
              'from-transparent via-current to-current',
              color === 'cyan' && 'text-cyan-400',
              color === 'purple' && 'text-purple-400',
              color === 'pink' && 'text-pink-400',
              color === 'green' && 'text-green-400',
              glow && colors.shadow
            )}
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
            style={{ originX: 1 }}
          />
        </div>
      </div>
    );

    if (variant === 'hologram') {
      return (
        <div ref={ref} className="w-full py-4">
          <div className="relative">
            {/* Animated gradient line */}
            <motion.div
              className={cn(
                'h-px w-full',
                'bg-gradient-to-r',
                'from-transparent via-cyan-400 via-purple-400 via-pink-400 to-transparent'
              )}
              animate={{
                backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: 'linear',
              }}
              style={{
                backgroundSize: '200% 200%',
              }}
            />
            {/* Glow effect */}
            {glow && (
              <motion.div
                className="absolute inset-0 h-px blur-sm opacity-50"
                animate={{
                  backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: 'linear',
                }}
                style={{
                  background:
                    'linear-gradient(90deg, transparent, rgba(0,240,255,0.5), rgba(157,0,255,0.5), rgba(255,0,128,0.5), transparent)',
                  backgroundSize: '200% 200%',
                }}
              />
            )}
          </div>
        </div>
      );
    }

    if (variant === 'gradient') {
      return (
        <div ref={ref} className="w-full py-4">
          <motion.div
            className={cn(
              'h-px w-full',
              'bg-gradient-to-r from-transparent via-cyan-400 to-transparent',
              glow && 'shadow-[0_0_20px_rgba(0,240,255,0.5)]'
            )}
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
          />
        </div>
      );
    }

    return (
      <div ref={ref} className={cn('w-full py-4', label && 'py-6')}>
        {dividerContent}
      </div>
    );
  }
);

CyberDivider.displayName = 'CyberDivider';
