/**
 * Card 组件 - 基础卡片容器
 */

'use client';

import { motion, HTMLMotionProps } from 'framer-motion';
import { cn } from '@/lib/utils';

export interface CardProps extends HTMLMotionProps<'div'> {
  variant?: 'default' | 'outlined' | 'elevated' | 'glass';
  padding?: 'none' | 'sm' | 'md' | 'lg';
  hover?: boolean;
  children: React.ReactNode;
}

export function Card({
  variant = 'default',
  padding = 'md',
  hover = false,
  className,
  children,
  ...props
}: CardProps) {
  const variants = {
    default: 'bg-cyber-dark/50 border border-cyber-border/50',
    outlined: 'bg-transparent border-2 border-cyber-cyan/30',
    elevated: 'bg-cyber-dark/80 border border-cyber-cyan/20 shadow-neon-cyan',
    glass: 'bg-cyber-dark/30 backdrop-blur-lg border border-white/10',
  };

  const paddings = {
    none: 'p-0',
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8',
  };

  return (
    <motion.div
      whileHover={hover ? { y: -4, transition: { duration: 0.2 } } : undefined}
      className={cn(
        'rounded-xl transition-all duration-300',
        variants[variant],
        paddings[padding],
        className
      )}
      {...props}
    >
      {children}
    </motion.div>
  );
}

Card.Header = function CardHeader({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return <div className={cn('mb-4', className)}>{children}</div>;
};

Card.Title = function CardTitle({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <h3 className={cn('font-display font-semibold text-xl text-gray-100', className)}>
      {children}
    </h3>
  );
};

Card.Description = function CardDescription({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return <p className={cn('text-sm text-gray-400 mt-1', className)}>{children}</p>;
};

Card.Content = function CardContent({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return <div className={cn('', className)}>{children}</div>;
};

Card.Footer = function CardFooter({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return <div className={cn('mt-4 pt-4 border-t border-cyber-border/50', className)}>{children}</div>;
};

// 命名导出，支持单独导入
export const CardHeader = Card.Header;
export const CardTitle = Card.Title;
export const CardDescription = Card.Description;
export const CardContent = Card.Content;
export const CardFooter = Card.Footer;
