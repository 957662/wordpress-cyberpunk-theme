'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

export interface CyberTextProps extends React.HTMLAttributes<HTMLParagraphElement> {
  variant?: 'default' | 'glow' | 'gradient' | 'hologram' | 'neon';
  color?: 'cyan' | 'purple' | 'pink' | 'green' | 'yellow';
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl';
  weight?: 'normal' | 'medium' | 'semibold' | 'bold';
  children: React.ReactNode;
  glow?: boolean;
}

const colorStyles = {
  cyan: {
    text: 'text-cyan-400',
    shadow: 'text-shadow-cyan',
    from: 'from-cyan-400',
    to: 'to-blue-500',
    glow: 'rgba(0, 240, 255, 0.8)',
  },
  purple: {
    text: 'text-purple-400',
    shadow: 'text-shadow-purple',
    from: 'from-purple-400',
    to: 'to-pink-500',
    glow: 'rgba(157, 0, 255, 0.8)',
  },
  pink: {
    text: 'text-pink-400',
    shadow: 'text-shadow-pink',
    from: 'from-pink-400',
    to: 'to-red-500',
    glow: 'rgba(255, 0, 128, 0.8)',
  },
  green: {
    text: 'text-green-400',
    shadow: 'text-shadow-green',
    from: 'from-green-400',
    to: 'to-emerald-500',
    glow: 'rgba(0, 255, 136, 0.8)',
  },
  yellow: {
    text: 'text-yellow-400',
    shadow: 'text-shadow-yellow',
    from: 'from-yellow-400',
    to: 'to-orange-500',
    glow: 'rgba(240, 255, 0, 0.8)',
  },
};

const sizeStyles = {
  xs: 'text-xs',
  sm: 'text-sm',
  md: 'text-base',
  lg: 'text-lg',
  xl: 'text-xl',
  '2xl': 'text-2xl',
  '3xl': 'text-3xl',
  '4xl': 'text-4xl',
};

const weightStyles = {
  normal: 'font-normal',
  medium: 'font-medium',
  semibold: 'font-semibold',
  bold: 'font-bold',
};

export const CyberText = React.forwardRef<HTMLParagraphElement, CyberTextProps>(
  (
    {
      className,
      variant = 'default',
      color = 'cyan',
      size = 'md',
      weight = 'normal',
      glow = false,
      children,
      ...props
    },
    ref
  ) => {
    const colors = colorStyles[color];

    const variants = {
      default: cn(colors.text, weightStyles[weight]),
      glow: cn(
        colors.text,
        weightStyles[weight],
        glow && 'drop-shadow-[0_0_10px_currentColor]'
      ),
      gradient: cn(
        'bg-clip-text text-transparent bg-gradient-to-r',
        colors.from,
        colors.to,
        weightStyles[weight]
      ),
      hologram: cn(
        'bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400',
        weightStyles[weight],
        'animate-shimmer'
      ),
      neon: cn(
        colors.text,
        weightStyles[weight],
        'drop-shadow-[0_0_5px_currentColor] drop-shadow-[0_0_10px_currentColor]'
      ),
    };

    const content = children;

    return (
      <motion.p
        ref={ref}
        className={cn(
          variants[variant],
          sizeStyles[size],
          className
        )}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        {...props}
      >
        {content}
      </motion.p>
    );
  }
);

CyberText.displayName = 'CyberText';

// CyberHeading component for headings
export interface CyberHeadingProps extends React.HTMLAttributes<HTMLHeadingElement> {
  level?: 1 | 2 | 3 | 4 | 5 | 6;
  variant?: 'default' | 'glow' | 'gradient' | 'hologram' | 'neon';
  color?: 'cyan' | 'purple' | 'pink' | 'green' | 'yellow';
  children: React.ReactNode;
  glow?: boolean;
}

export const CyberHeading = React.forwardRef<HTMLHeadingElement, CyberHeadingProps>(
  (
    {
      className,
      level = 2,
      variant = 'glow',
      color = 'cyan',
      glow = true,
      children,
      ...props
    },
    ref
  ) => {
    const colors = colorStyles[color];

    const variants = {
      default: cn(colors.text, 'font-bold'),
      glow: cn(
        colors.text,
        'font-bold',
        glow && 'drop-shadow-[0_0_15px_currentColor]'
      ),
      gradient: cn(
        'bg-clip-text text-transparent bg-gradient-to-r',
        colors.from,
        colors.to,
        'font-bold'
      ),
      hologram: cn(
        'bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400',
        'font-bold',
        'animate-shimmer'
      ),
      neon: cn(
        colors.text,
        'font-bold',
        'drop-shadow-[0_0_10px_currentColor] drop-shadow-[0_0_20px_currentColor]'
      ),
    };

    const sizeClasses = {
      1: 'text-4xl md:text-6xl',
      2: 'text-3xl md:text-5xl',
      3: 'text-2xl md:text-4xl',
      4: 'text-xl md:text-3xl',
      5: 'text-lg md:text-2xl',
      6: 'text-base md:text-xl',
    };

    const HeadingTag = `h${level}` as keyof JSX.IntrinsicElements;

    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <motion.h1
          ref={ref as any}
          className={cn(
            variants[variant],
            sizeClasses[level],
            className
          )}
          whileHover={{ scale: 1.02 }}
          transition={{ type: 'spring', stiffness: 400 }}
          {...props}
        >
          {children}
        </motion.h1>
      </motion.div>
    );
  }
);

CyberHeading.displayName = 'CyberHeading';
