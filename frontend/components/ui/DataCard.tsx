/**
 * DataCard - 数据卡片组件
 * 赛博朋克风格的数据展示卡片，支持多种布局和动画效果
 */

'use client';

import { motion, HTMLMotionProps } from 'framer-motion';
import { cn } from '@/lib/utils';
import { LucideIcon } from 'lucide-react';

export interface DataCardProps extends HTMLMotionProps<'div'> {
  /** 卡片标题 */
  title?: string;
  /** 主要数值或内容 */
  value?: string | number;
  /** 副标题或描述 */
  subtitle?: string;
  /** 趋势值（正数为增长，负数为下降） */
  trend?: {
    value: number;
    label?: string;
  };
  /** 图标 */
  icon?: LucideIcon;
  /** 卡片变体 */
  variant?: 'default' | 'neon' | 'glass' | 'hologram';
  /** 颜色主题 */
  color?: 'cyan' | 'purple' | 'pink' | 'green' | 'yellow';
  /** 大小 */
  size?: 'sm' | 'md' | 'lg';
  /** 是否显示边框动画 */
  borderAnimation?: boolean;
  /** 是否显示发光效果 */
  glow?: boolean;
  /** 是否可点击 */
  clickable?: boolean;
  /** 底部操作按钮 */
  actions?: React.ReactNode;
  /** 加载状态 */
  loading?: boolean;
}

const colorStyles = {
  cyan: {
    border: 'border-cyber-cyan/50',
    bg: 'bg-cyber-cyan/5',
    text: 'text-cyber-cyan',
    shadow: 'shadow-neon-cyan',
  },
  purple: {
    border: 'border-cyber-purple/50',
    bg: 'bg-cyber-purple/5',
    text: 'text-cyber-purple',
    shadow: 'shadow-neon-purple',
  },
  pink: {
    border: 'border-cyber-pink/50',
    bg: 'bg-cyber-pink/5',
    text: 'text-cyber-pink',
    shadow: 'shadow-neon-pink',
  },
  green: {
    border: 'border-green-500/50',
    bg: 'bg-green-500/5',
    text: 'text-green-400',
    shadow: 'shadow-green-500/50',
  },
  yellow: {
    border: 'border-cyber-yellow/50',
    bg: 'bg-cyber-yellow/5',
    text: 'text-cyber-yellow',
    shadow: 'shadow-yellow-500/50',
  },
};

const sizeStyles = {
  sm: {
    container: 'p-4',
    title: 'text-sm',
    value: 'text-2xl',
    subtitle: 'text-xs',
    icon: 'w-8 h-8',
  },
  md: {
    container: 'p-6',
    title: 'text-base',
    value: 'text-3xl',
    subtitle: 'text-sm',
    icon: 'w-12 h-12',
  },
  lg: {
    container: 'p-8',
    title: 'text-lg',
    value: 'text-4xl',
    subtitle: 'text-base',
    icon: 'w-16 h-16',
  },
};

export function DataCard({
  title,
  value,
  subtitle,
  trend,
  icon: Icon,
  variant = 'default',
  color = 'cyan',
  size = 'md',
  borderAnimation = true,
  glow = true,
  clickable = false,
  actions,
  loading = false,
  className,
  children,
  ...props
}: DataCardProps) {
  const colors = colorStyles[color];
  const sizes = sizeStyles[size];

  const getVariantStyles = () => {
    switch (variant) {
      case 'neon':
        return cn(
          'bg-cyber-dark',
          colors.border,
          'border-2',
          glow && colors.shadow,
          'shadow-lg'
        );
      case 'glass':
        return cn(
          'backdrop-blur-md',
          'bg-white/5',
          'border border-white/10',
          'shadow-xl'
        );
      case 'hologram':
        return cn(
          'bg-gradient-to-br',
          `from-${color}-500/10 to-${color}-500/5`,
          colors.border,
          'border',
          'relative overflow-hidden'
        );
      default:
        return cn(
          colors.bg,
          'border border-white/10',
          'bg-opacity-50'
        );
    }
  };

  return (
    <motion.div
      className={cn(
        'relative rounded-lg overflow-hidden',
        'transition-all duration-300',
        sizes.container,
        getVariantStyles(),
        clickable && 'cursor-pointer hover:scale-[1.02]',
        className
      )}
      whileHover={clickable ? { scale: 1.02 } : {}}
      whileTap={clickable ? { scale: 0.98 } : {}}
      {...props}
    >
      {/* 边框动画 */}
      {borderAnimation && variant === 'neon' && (
        <motion.div
          className={cn('absolute inset-0 rounded-lg', colors.border, 'border-2 opacity-50')}
          animate={{
            opacity: [0.3, 0.6, 0.3],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
      )}

      {/* 全息效果背景 */}
      {variant === 'hologram' && (
        <motion.div
          className={cn('absolute inset-0 opacity-20', colors.bg)}
          animate={{
            opacity: [0.1, 0.2, 0.1],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
      )}

      {/* 内容 */}
      <div className="relative z-10">
        {/* 头部 */}
        {(title || Icon) && (
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1">
              {title && (
                <h3 className={cn('font-display font-medium text-gray-400', sizes.title)}>
                  {title}
                </h3>
              )}
            </div>
            {Icon && (
              <div
                className={cn(
                  'flex items-center justify-center rounded-lg',
                  colors.bg,
                  colors.text,
                  sizes.icon
                )}
              >
                <Icon className={sizes.icon} />
              </div>
            )}
          </div>
        )}

        {/* 主要内容 */}
        {loading ? (
          <div className="space-y-3">
            <motion.div
              className={cn('h-8 rounded bg-gray-700/50', colors.text)}
              animate={{ opacity: [0.5, 0.8, 0.5] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            />
            <motion.div
              className="h-4 w-2/3 rounded bg-gray-700/30"
              animate={{ opacity: [0.3, 0.6, 0.3] }}
              transition={{ duration: 1.5, repeat: Infinity, delay: 0.2 }}
            />
          </div>
        ) : (
          <>
            {value !== undefined && (
              <div className={cn('font-display font-bold', colors.text, sizes.value)}>
                {value}
              </div>
            )}

            {/* 趋势和副标题 */}
            <div className="flex items-center gap-3 mt-2">
              {trend && (
                <div
                  className={cn(
                    'flex items-center gap-1 text-sm font-medium',
                    trend.value >= 0 ? 'text-green-400' : 'text-red-400'
                  )}
                >
                  <span>
                    {trend.value >= 0 ? '↑' : '↓'}
                    {Math.abs(trend.value)}%
                  </span>
                  {trend.label && <span className="text-gray-400">{trend.label}</span>}
                </div>
              )}
              {subtitle && (
                <p className={cn('text-gray-400', sizes.subtitle)}>{subtitle}</p>
              )}
            </div>

            {/* 自定义子内容 */}
            {children}
          </>
        )}

        {/* 操作按钮 */}
        {actions && (
          <div className="flex items-center justify-end gap-2 mt-4 pt-4 border-t border-white/10">
            {actions}
          </div>
        )}
      </div>

      {/* 装饰角标 */}
      {variant === 'neon' && (
        <>
          <div className={cn('absolute top-0 right-0 w-8 h-8', colors.text)} style={{ clipPath: 'polygon(100% 0, 100% 100%, 0 0)' }} />
          <div className={cn('absolute bottom-0 left-0 w-8 h-8', colors.text)} style={{ clipPath: 'polygon(0 100%, 100% 100%, 0 0)' }} />
        </>
      )}
    </motion.div>
  );
}

// 预设组件
export function StatCard(props: DataCardProps) {
  return <DataCard {...props} variant="neon" />;
}

export function MetricCard(props: DataCardProps) {
  return <DataCard {...props} variant="glass" />;
}

export function InfoCard(props: DataCardProps) {
  return <DataCard {...props} variant="default" borderAnimation={false} glow={false} />;
}
