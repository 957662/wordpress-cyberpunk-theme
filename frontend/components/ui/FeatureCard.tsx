'use client';

/**
 * FeatureCard - 功能特性卡片组件
 * 赛博朋克风格的功能展示卡片
 */

import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { LucideIcon, ArrowRight } from 'lucide-react';

export interface FeatureCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
  variant?: 'cyan' | 'purple' | 'pink' | 'green' | 'yellow';
  size?: 'sm' | 'md' | 'lg';
  interactive?: boolean;
  onClick?: () => void;
  badge?: string;
  highlighted?: boolean;
  className?: string;
  children?: React.ReactNode;
}

const variantStyles = {
  cyan: {
    bg: 'from-cyber-cyan/5 to-transparent',
    border: 'border-cyber-cyan/20',
    icon: 'text-cyber-cyan',
    iconBg: 'bg-cyber-cyan/10',
    hover: 'hover:border-cyber-cyan/40 hover:shadow-neon-cyan',
  },
  purple: {
    bg: 'from-cyber-purple/5 to-transparent',
    border: 'border-cyber-purple/20',
    icon: 'text-cyber-purple',
    iconBg: 'bg-cyber-purple/10',
    hover: 'hover:border-cyber-purple/40 hover:shadow-neon-purple',
  },
  pink: {
    bg: 'from-cyber-pink/5 to-transparent',
    border: 'border-cyber-pink/20',
    icon: 'text-cyber-pink',
    iconBg: 'bg-cyber-pink/10',
    hover: 'hover:border-cyber-pink/40 hover:shadow-neon-pink',
  },
  green: {
    bg: 'from-cyber-green/5 to-transparent',
    border: 'border-cyber-green/20',
    icon: 'text-cyber-green',
    iconBg: 'bg-cyber-green/10',
    hover: 'hover:border-cyber-green/40',
  },
  yellow: {
    bg: 'from-cyber-yellow/5 to-transparent',
    border: 'border-cyber-yellow/20',
    icon: 'text-cyber-yellow',
    iconBg: 'bg-cyber-yellow/10',
    hover: 'hover:border-cyber-yellow/40',
  },
};

const sizeStyles = {
  sm: 'p-4 gap-3',
  md: 'p-6 gap-4',
  lg: 'p-8 gap-6',
};

const iconSizes = {
  sm: 'w-8 h-8',
  md: 'w-12 h-12',
  lg: 'w-16 h-16',
};

export function FeatureCard({
  icon: Icon,
  title,
  description,
  variant = 'cyan',
  size = 'md',
  interactive = true,
  onClick,
  badge,
  highlighted = false,
  className,
  children,
}: FeatureCardProps) {
  const styles = variantStyles[variant];
  const sizeClass = sizeStyles[size];
  const iconSize = iconSizes[size];

  const CardWrapper = interactive ? motion.div : 'div';
  const cardProps = interactive ? {
    whileHover: { scale: 1.02, y: -4 },
    whileTap: { scale: 0.98 },
    onClick,
    className: cn('cursor-pointer', highlighted && 'ring-2 ring-cyber-cyan/50'),
  } : {};

  return (
    <CardWrapper
      {...cardProps}
      className={cn(
        'relative overflow-hidden rounded-2xl border bg-gradient-to-br backdrop-blur-sm transition-all duration-300',
        styles.bg,
        styles.border,
        styles.hover,
        sizeClass,
        className
      )}
    >
      {/* 背景网格 */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0 bg-cyber-grid" />
      </div>

      {/* 扫描线效果 */}
      {highlighted && (
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute inset-0 animate-scan bg-gradient-to-b from-transparent via-cyber-cyan/10 to-transparent" />
        </div>
      )}

      {/* 徽章 */}
      {badge && (
        <div className="absolute top-4 right-4 z-10">
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-cyber-cyan/10 text-cyber-cyan border border-cyber-cyan/20">
            {badge}
          </span>
        </div>
      )}

      {/* 内容 */}
      <div className="relative z-10 flex flex-col h-full">
        {/* 图标 */}
        <div className={cn('flex items-center justify-center rounded-xl', styles.iconBg, iconSize)}>
          <Icon className={cn('flex-shrink-0', styles.icon, iconSize)} />
        </div>

        {/* 标题和描述 */}
        <div className="flex-1">
          <h3 className="text-lg font-bold font-display text-white mb-2">{title}</h3>
          <p className="text-sm text-gray-400 leading-relaxed">{description}</p>
        </div>

        {/* 额外内容 */}
        {children && (
          <div className="mt-4 pt-4 border-t border-cyber-border/50">
            {children}
          </div>
        )}

        {/* 箭头指示器 */}
        {interactive && (
          <div className={cn('flex items-center gap-1 text-sm font-medium mt-4', styles.icon)}>
            <span>Learn more</span>
            <ArrowRight className="w-4 h-4" />
          </div>
        )}
      </div>

      {/* 底部发光线 */}
      <div className={cn('absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-current to-transparent opacity-50', styles.icon)} />

      {/* 高亮发光效果 */}
      {highlighted && (
        <motion.div
          className="absolute inset-0 rounded-2xl bg-cyber-cyan/10 blur-xl -z-10"
          animate={{ opacity: [0.3, 0.6, 0.3] }}
          transition={{ duration: 2, repeat: Infinity }}
        />
      )}
    </CardWrapper>
  );
}

/**
 * FeatureGrid - 功能网格布局
 */
export interface FeatureGridProps {
  children: React.ReactNode;
  columns?: 1 | 2 | 3 | 4;
  gap?: number;
  className?: string;
}

export function FeatureGrid({
  children,
  columns = 3,
  gap = 6,
  className,
}: FeatureGridProps) {
  const gridCols = {
    1: 'grid-cols-1',
    2: 'grid-cols-1 md:grid-cols-2',
    3: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
    4: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4',
  };

  return (
    <div className={cn('grid', gridCols[columns], `gap-${gap}`, className)}>
      {children}
    </div>
  );
}
