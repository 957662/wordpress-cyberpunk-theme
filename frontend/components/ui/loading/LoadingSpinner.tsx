/**
 * Loading Spinner Component
 * Multiple loading animation variants with cyberpunk styling
 */

'use client';

import React from 'react';
import { clsx } from 'clsx';
import { motion } from 'framer-motion';

// ============================================================================
// Types
// ============================================================================

export interface LoadingSpinnerProps {
  /** Size of the spinner */
  size?: 'sm' | 'md' | 'lg' | 'xl';
  /** Color variant */
  variant?: 'cyan' | 'purple' | 'pink' | 'green';
  /** Whether to show fullscreen backdrop */
  fullscreen?: boolean;
  /** Custom className */
  className?: string;
  /** Custom text to display below spinner */
  text?: string;
  /** Whether to show skeleton loader instead */
  skeleton?: boolean;
}

// ============================================================================
// Size Mappings
// ============================================================================

const sizeClasses = {
  sm: 'w-4 h-4 border-2',
  md: 'w-8 h-8 border-3',
  lg: 'w-12 h-12 border-4',
  xl: 'w-16 h-16 border-4',
};

const textSizeClasses = {
  sm: 'text-xs',
  md: 'text-sm',
  lg: 'text-base',
  xl: 'text-lg',
};

// ============================================================================
// Color Variants
// ============================================================================

const colorClasses = {
  cyan: 'border-cyber-cyan border-t-transparent',
  purple: 'border-cyber-purple border-t-transparent',
  pink: 'border-cyber-pink border-t-transparent',
  green: 'border-cyber-green border-t-transparent',
};

const glowClasses = {
  cyan: 'shadow-[0_0_20px_rgba(0,240,255,0.5)]',
  purple: 'shadow-[0_0_20px_rgba(157,0,255,0.5)]',
  pink: 'shadow-[0_0_20px_rgba(255,0,128,0.5)]',
  green: 'shadow-[0_0_20px_rgba(0,255,136,0.5)]',
};

// ============================================================================
// Spinner Component
// ============================================================================

const Spinner: React.FC<{ size: LoadingSpinnerProps['size']; variant: LoadingSpinnerProps['variant'] }> = ({ size, variant }) => (
  <div className="relative">
    {/* Outer ring */}
    <motion.div
      className={clsx('rounded-full border-solid', sizeClasses[size], colorClasses[variant], glowClasses[variant])}
      animate={{ rotate: 360 }}
      transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
    />
    {/* Inner ring - rotates opposite direction */}
    <motion.div
      className={clsx('absolute top-0 left-0 rounded-full border-solid', sizeClasses[size], colorClasses[variant])}
      style={{ opacity: 0.5 }}
      animate={{ rotate: -360 }}
      transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}
    />
  </div>
);

// ============================================================================
// Main Component
// ============================================================================

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  size = 'md',
  variant = 'cyan',
  fullscreen = false,
  className,
  text,
  skeleton = false,
}) => {
  const content = (
    <div className={clsx('flex flex-col items-center justify-center gap-4', className)}>
      {!skeleton ? (
        <>
          <Spinner size={size} variant={variant} />
          {text && (
            <motion.p
              className={clsx('text-white/80 font-medium', textSizeClasses[size])}
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            >
              {text}
            </motion.p>
          )}
        </>
      ) : (
        <SkeletonLoader size={size} />
      )}
    </div>
  );

  if (fullscreen) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-cyber-dark/90 backdrop-blur-sm">
        {content}
      </div>
    );
  }

  return content;
};

// ============================================================================
// Skeleton Loader Component
// ============================================================================

const SkeletonLoader: React.FC<{ size: LoadingSpinnerProps['size'] }> = ({ size }) => {
  const height = {
    sm: 'h-4',
    md: 'h-6',
    lg: 'h-8',
    xl: 'h-10',
  };

  return (
    <div className="flex flex-col gap-3 w-full max-w-md">
      {/* Title skeleton */}
      <motion.div
        className={clsx('bg-gradient-to-r from-cyber-cyan/20 to-cyber-purple/20 rounded', height[size], 'w-3/4')}
        animate={{
          backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: 'linear',
        }}
        style={{
          backgroundSize: '200% 200%',
        }}
      />
      {/* Content skeleton lines */}
      {[...Array(3)].map((_, i) => (
        <motion.div
          key={i}
          className={clsx('bg-gradient-to-r from-cyber-cyan/10 to-cyber-purple/10 rounded', height.sm)}
          style={{ width: `${100 - i * 20}%` }}
          animate={{
            backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: 'linear',
            delay: i * 0.1,
          }}
          style={{
            backgroundSize: '200% 200%',
          }}
        />
      ))}
    </div>
  );
};

// ============================================================================
// Dot Loader Component
// ============================================================================

export const DotLoader: React.FC<{ size?: LoadingSpinnerProps['size']; variant?: LoadingSpinnerProps['variant'] }> = ({
  size = 'md',
  variant = 'cyan',
}) => {
  const dotSize = {
    sm: 'w-2 h-2',
    md: 'w-3 h-3',
    lg: 'w-4 h-4',
    xl: 'w-5 h-5',
  };

  const colors = {
    cyan: 'bg-cyber-cyan',
    purple: 'bg-cyber-purple',
    pink: 'bg-cyber-pink',
    green: 'bg-cyber-green',
  };

  return (
    <div className="flex items-center gap-2">
      {[...Array(3)].map((_, i) => (
        <motion.div
          key={i}
          className={clsx('rounded-full', dotSize[size], colors[variant])}
          animate={{
            scale: [1, 1.5, 1],
            opacity: [0.5, 1, 0.5],
          }}
          transition={{
            duration: 0.8,
            repeat: Infinity,
            delay: i * 0.15,
            ease: 'easeInOut',
          }}
        />
      ))}
    </div>
  );
};

// ============================================================================
// Bar Loader Component
// ============================================================================

export const BarLoader: React.FC<{ variant?: LoadingSpinnerProps['variant']; width?: string }> = ({
  variant = 'cyan',
  width = '100%',
}) => {
  const colors = {
    cyan: 'from-cyber-cyan/20 to-cyber-cyan',
    purple: 'from-cyber-purple/20 to-cyber-purple',
    pink: 'from-cyber-pink/20 to-cyber-pink',
    green: 'from-cyber-green/20 to-cyber-green',
  };

  return (
    <div className={clsx('h-1 rounded-full bg-white/10 overflow-hidden', width)}>
      <motion.div
        className={clsx('h-full bg-gradient-to-r', colors[variant])}
        animate={{
          x: ['-100%', '100%'],
        }}
        transition={{
          duration: 1.5,
          repeat: Infinity,
          ease: 'linear',
        }}
      />
    </div>
  );
};

// ============================================================================
// Pulse Loader Component
// ============================================================================

export const PulseLoader: React.FC<{ size?: LoadingSpinnerProps['size']; variant?: LoadingSpinnerProps['variant'] }> = ({
  size = 'md',
  variant = 'cyan',
}) => {
  const dotSize = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8',
    xl: 'w-10 h-10',
  };

  const colors = {
    cyan: 'bg-cyber-cyan shadow-cyber-cyan',
    purple: 'bg-cyber-purple shadow-cyber-purple',
    pink: 'bg-cyber-pink shadow-cyber-pink',
    green: 'bg-cyber-green shadow-cyber-green',
  };

  return (
    <div className="relative flex items-center justify-center">
      {[...Array(3)].map((_, i) => (
        <motion.div
          key={i}
          className={clsx('absolute rounded-full', dotSize[size], colors[variant], 'shadow-lg')}
          animate={{
            scale: [0, 1.5, 0],
            opacity: [0.8, 0, 0],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            delay: i * 0.4,
            ease: 'easeOut',
          }}
        />
      ))}
    </div>
  );
};

// ============================================================================
// Default Export
// ============================================================================

export default LoadingSpinner;
