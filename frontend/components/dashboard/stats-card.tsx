/**
 * Stats Card - 数据统计卡片组件
 * 展示关键指标的赛博朋克风格统计卡片
 */

"use client";

import React, { useEffect, useRef, useState } from 'react';
import { motion, useInView, useAnimation } from 'framer-motion';
import { LucideIcon, TrendingUp, TrendingDown, Minus } from 'lucide-react';

// ============================================
// 类型定义
// ============================================

export interface StatsCardProps {
  /** 标题 */
  title: string;
  /** 当前值 */
  value: number | string;
  /** 趋势百分比 */
  trend?: {
    value: number;
    period?: string;
  };
  /** 图标 */
  icon?: LucideIcon;
  /** 加载状态 */
  loading?: boolean;
  /** 颜色主题 */
  color?: 'cyan' | 'purple' | 'pink' | 'green' | 'yellow';
  /** 尺寸 */
  size?: 'sm' | 'md' | 'lg';
  /** 是否显示动画 */
  animated?: boolean;
  /** 点击事件 */
  onClick?: () => void;
  /** 自定义类名 */
  className?: string;
}

// ============================================
// 颜色主题配置
// ============================================

const colorThemes = {
  cyan: {
    primary: '#00f0ff',
    secondary: 'rgba(0, 240, 255, 0.1)',
    glow: '0 0 20px rgba(0, 240, 255, 0.3)',
  },
  purple: {
    primary: '#9d00ff',
    secondary: 'rgba(157, 0, 255, 0.1)',
    glow: '0 0 20px rgba(157, 0, 255, 0.3)',
  },
  pink: {
    primary: '#ff0080',
    secondary: 'rgba(255, 0, 128, 0.1)',
    glow: '0 0 20px rgba(255, 0, 128, 0.3)',
  },
  green: {
    primary: '#00ff88',
    secondary: 'rgba(0, 255, 136, 0.1)',
    glow: '0 0 20px rgba(0, 255, 136, 0.3)',
  },
  yellow: {
    primary: '#f0ff00',
    secondary: 'rgba(240, 255, 0, 0.1)',
    glow: '0 0 20px rgba(240, 255, 0, 0.3)',
  },
};

// ============================================
// 尺寸配置
// ============================================

const sizeConfig = {
  sm: {
    padding: 'p-4',
    icon: 'w-8 h-8',
    title: 'text-sm',
    value: 'text-2xl',
  },
  md: {
    padding: 'p-6',
    icon: 'w-10 h-10',
    title: 'text-base',
    value: 'text-3xl',
  },
  lg: {
    padding: 'p-8',
    icon: 'w-12 h-12',
    title: 'text-lg',
    value: 'text-4xl',
  },
};

// ============================================
// 数字动画组件
// ============================================

interface AnimatedValueProps {
  value: number;
  duration?: number;
  className?: string;
}

function AnimatedValue({ value, duration = 1000, className }: AnimatedValueProps) {
  const [displayValue, setDisplayValue] = useState(0);
  const startTimeRef = useRef<number>();
  const animationFrameRef = useRef<number>();

  useEffect(() => {
    const animate = (currentTime: number) => {
      if (!startTimeRef.current) {
        startTimeRef.current = currentTime;
      }

      const elapsed = currentTime - startTimeRef.current;
      const progress = Math.min(elapsed / duration, 1);

      // Easing function (easeOutExpo)
      const eased = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);

      setDisplayValue(Math.floor(value * eased));

      if (progress < 1) {
        animationFrameRef.current = requestAnimationFrame(animate);
      }
    };

    animationFrameRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [value, duration]);

  return <span className={className}>{displayValue.toLocaleString()}</span>;
}

// ============================================
// 趋势指示器组件
// ============================================

interface TrendIndicatorProps {
  value: number;
  period?: string;
}

function TrendIndicator({ value, period = 'vs last period' }: TrendIndicatorProps) {
  const isPositive = value > 0;
  const isNeutral = value === 0;

  const Icon = isPositive ? TrendingUp : isNeutral ? Minus : TrendingDown;
  const colorClass = isPositive ? 'text-green-400' : isNeutral ? 'text-gray-400' : 'text-red-400';
  const bgColorClass = isPositive
    ? 'bg-green-400/10'
    : isNeutral
    ? 'bg-gray-400/10'
    : 'bg-red-400/10';

  return (
    <div className={`flex items-center gap-1.5 ${colorClass}`}>
      <span className={`inline-flex items-center justify-center rounded-full p-1 ${bgColorClass}`}>
        <Icon className="w-3 h-3" />
      </span>
      <span className="text-sm font-medium">
        {isPositive ? '+' : ''}
        {Math.abs(value)}%
      </span>
      {period && <span className="text-xs opacity-60">{period}</span>}
    </div>
  );
}

// ============================================
// Stats Card 组件
// ============================================

export function StatsCard({
  title,
  value,
  trend,
  icon: Icon,
  loading = false,
  color = 'cyan',
  size = 'md',
  animated = true,
  onClick,
  className = '',
}: StatsCardProps) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });
  const controls = useAnimation();
  const theme = colorThemes[color];
  const sizeStyles = sizeConfig[size];

  useEffect(() => {
    if (isInView && animated) {
      controls.start('visible');
    }
  }, [isInView, animated, controls]);

  const containerVariants = {
    hidden: {
      opacity: 0,
      y: 20,
      scale: 0.95,
    },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 0.4,
        ease: [0.25, 0.46, 0.45, 0.94],
      },
    },
  };

  const shimmerVariants = {
    hidden: { x: '-100%' },
    visible: {
      x: '100%',
      transition: {
        duration: 1.5,
        repeat: Infinity,
        repeatDelay: 1,
        ease: 'linear',
      },
    },
  };

  return (
    <motion.div
      ref={ref}
      variants={containerVariants}
      initial={animated ? 'hidden' : 'visible'}
      animate={controls}
      whileHover={onClick ? { scale: 1.02 } : {}}
      whileTap={onClick ? { scale: 0.98 } : {}}
      onClick={onClick}
      className={`
        relative overflow-hidden rounded-xl border border-white/10
        bg-gradient-to-br from-white/5 to-white/[0.02]
        backdrop-blur-sm
        ${sizeStyles.padding}
        ${onClick ? 'cursor-pointer' : ''}
        ${className}
      `}
      style={{
        boxShadow: theme.glow,
      }}
    >
      {/* 扫描线效果 */}
      <div
        className="absolute inset-0 pointer-events-none opacity-30"
        style={{
          background: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0, 0, 0, 0.1) 2px, rgba(0, 0, 0, 0.1) 4px)',
        }}
      />

      {/* 发光边框 */}
      <div
        className="absolute inset-0 rounded-xl pointer-events-none"
        style={{
          border: `1px solid ${theme.primary}20`,
        }}
      />

      {/* 加载状态 */}
      {loading ? (
        <div className="space-y-3">
          {/* 标题骨架 */}
          <div className="h-4 w-24 bg-white/10 rounded animate-pulse" />

          {/* 值骨架 */}
          <div className="h-8 w-32 bg-white/10 rounded animate-pulse" />

          {/* 图标骨架 */}
          <div className="absolute top-6 right-6 w-10 h-10 bg-white/10 rounded-lg animate-pulse" />
        </div>
      ) : (
        <div className="relative z-10">
          {/* 头部：图标和标题 */}
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1">
              <p
                className={`${sizeStyles.title} text-gray-400 font-medium mb-1`}
                style={{
                  color: `${theme.primary}80`,
                }}
              >
                {title}
              </p>

              {/* 值 */}
              <div className={`${sizeStyles.value} font-bold text-white`}>
                {typeof value === 'number' && animated ? (
                  <AnimatedValue value={value} className="text-white" />
                ) : (
                  <>{value}</>
                )}
              </div>
            </div>

            {/* 图标 */}
            {Icon && (
              <div
                className={`${sizeStyles.icon} rounded-lg flex items-center justify-center`}
                style={{
                  backgroundColor: theme.secondary,
                  color: theme.primary,
                }}
              >
                <Icon className="w-full h-full p-2" />
              </div>
            )}
          </div>

          {/* 趋势 */}
          {trend && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <TrendIndicator value={trend.value} period={trend.period} />
            </motion.div>
          )}

          {/* 装饰性发光点 */}
          <div
            className="absolute -top-10 -right-10 w-20 h-20 rounded-full blur-2xl opacity-30"
            style={{
              backgroundColor: theme.primary,
            }}
          />
        </div>
      )}

      {/* 角落装饰 */}
      <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 rounded-tr-lg" style={{ borderColor: theme.primary }} />
      <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 rounded-bl-lg" style={{ borderColor: theme.primary }} />
    </motion.div>
  );
}

// ============================================
// Stats Grid 组件（用于展示多个卡片）
// ============================================

export interface StatsGridProps {
  children: React.ReactNode;
  columns?: 1 | 2 | 3 | 4;
  gap?: number;
}

export function StatsGrid({ children, columns = 4, gap = 4 }: StatsGridProps) {
  const gridCols = {
    1: 'grid-cols-1',
    2: 'grid-cols-1 md:grid-cols-2',
    3: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
    4: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4',
  };

  return (
    <div className={`grid ${gridCols[columns]} gap-${gap}`}>
      {children}
    </div>
  );
}

// ============================================
// 使用示例
// ============================================

export function StatsCardDemo() {
  return (
    <div className="p-8 space-y-8 bg-gray-900 min-h-screen">
      <h2 className="text-2xl font-bold text-white mb-6">统计卡片示例</h2>

      <StatsGrid>
        <StatsCard
          title="总访问量"
          value={125430}
          trend={{ value: 12.5, period: 'vs 上月' }}
          icon={TrendingUp}
          color="cyan"
          animated
        />
        <StatsCard
          title="文章总数"
          value={842}
          trend={{ value: 8.2, period: 'vs 上月' }}
          icon={TrendingUp}
          color="purple"
          animated
        />
        <StatsCard
          title="评论数"
          value={3204}
          trend={{ value: -2.4, period: 'vs 上月' }}
          icon={TrendingDown}
          color="pink"
          animated
        />
        <StatsCard
          title="点赞数"
          value={15678}
          trend={{ value: 0, period: 'vs 上月' }}
          icon={Minus}
          color="green"
          animated
        />
      </StatsGrid>

      {/* 不同尺寸 */}
      <div className="mt-12">
        <h3 className="text-xl font-bold text-white mb-4">不同尺寸</h3>
        <div className="flex gap-4 items-end">
          <StatsCard title="小尺寸" value={1234} size="sm" color="cyan" />
          <StatsCard title="中等尺寸" value={5678} size="md" color="purple" />
          <StatsCard title="大尺寸" value={9012} size="lg" color="pink" />
        </div>
      </div>

      {/* 加载状态 */}
      <div className="mt-12">
        <h3 className="text-xl font-bold text-white mb-4">加载状态</h3>
        <StatsCard title="加载中" value={0} loading color="green" />
      </div>
    </div>
  );
}

export default StatsCard;
