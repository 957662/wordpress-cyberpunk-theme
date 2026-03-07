/**
 * Card Component
 *
 * A versatile card component with cyberpunk styling
 */

'use client';

import React from 'react';
import { motion, HTMLMotionProps } from 'framer-motion';
import { cn } from '@/lib/utils';

export interface CardProps extends HTMLMotionProps<'div'> {
  variant?: 'default' | 'glass' | 'neon' | 'bordered';
  padding?: 'none' | 'sm' | 'md' | 'lg';
  hover?: boolean;
  glow?: boolean;
}

const variantStyles = {
  default: 'bg-cyber-card border border-cyber-border',
  glass: 'bg-white/5 backdrop-blur-lg border border-white/10',
  neon: 'bg-transparent border-2 border-cyber-cyan shadow-neon',
  bordered: 'bg-transparent border border-cyber-cyan/30',
};

const paddingStyles = {
  none: '',
  sm: 'p-4',
  md: 'p-6',
  lg: 'p-8',
};

export function Card({
  variant = 'default',
  padding = 'md',
  hover = true,
  glow = false,
  className,
  children,
  ...props
}: CardProps) {
  return (
    <motion.div
      className={cn(
        'cyber-card rounded-lg',
        variantStyles[variant],
        paddingStyles[padding],
        glow && 'shadow-neon',
        className
      )}
      whileHover={hover ? { y: -5, transition: { duration: 0.2 } } : {}}
      {...props}
    >
      {children}
    </motion.div>
  );
}

export interface CardHeaderProps {
  className?: string;
  children: React.ReactNode;
}

export function CardHeader({ className, children }: CardHeaderProps) {
  return (
    <div className={cn('mb-4', className)}>
      {children}
    </div>
  );
}

export interface CardTitleProps {
  className?: string;
  children: React.ReactNode;
}

export function CardTitle({ className, children }: CardTitleProps) {
  return (
    <h3 className={cn('text-xl font-bold text-white', className)}>
      {children}
    </h3>
  );
}

export interface CardContentProps {
  className?: string;
  children: React.ReactNode;
}

export function CardContent({ className, children }: CardContentProps) {
  return (
    <div className={cn('text-gray-300', className)}>
      {children}
    </div>
  );
}

export interface CardFooterProps {
  className?: string;
  children: React.ReactNode;
}

export function CardFooter({ className, children }: CardFooterProps) {
  return (
    <div className={cn('mt-4 pt-4 border-t border-cyber-border', className)}>
      {children}
    </div>
  );
}
