'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { CountUp } from '../ui/CountUp';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

export interface StatItem {
  /**
   * 标签
   */
  label: string;

  /**
   * 数值
   */
  value: number;

  /**
   * 前缀（如：$）
   */
  prefix?: string;

  /**
   * 后缀（如：%）
   */
  suffix?: string;

  /**
   * 小数位数
   */
  decimals?: number;

  /**
   * 趋势（与上期相比）
   */
  trend?: {
    value: number;
    period?: string;
  };

  /**
   * 图标
   */
  icon?: React.ReactNode;

  /**
   * 颜色主题
   */
  color?: 'cyan' | 'purple' | 'pink' | 'green' | 'yellow' | 'blue';

  /**
   * 描述文本
   */
  description?: string;
}

export interface StatsWidgetProps {
  /**
   * 统计数据
   */
  stats: StatItem[];

  /**
   * 布局方向
   */
  direction?: 'row' | 'column';

  /**
   * 是否显示趋势图标
   */
  showTrendIcon?: boolean;

  /**
   * 是否显示边框
   */
  bordered?: boolean;

  /**
   * 是否显示发光效果
   */
  glow?: boolean;

  /**
   * 卡片背景样式
   */
  variant?: 'default' | 'glass' | 'neon' | 'hologram';

  /**
   * 自定义类名
   */
  className?: string;
}

const colorMap = {
  cyan: {
    primary: '#00f0ff',
    secondary: '#00a0aa',
    glow: 'rgba(0, 240, 255, 0.3)',
  },
  purple: {
    primary: '#9d00ff',
    secondary: '#6a00aa',
    glow: 'rgba(157, 0, 255, 0.3)',
  },
  pink: {
    primary: '#ff0080',
    secondary: '#aa0055',
    glow: 'rgba(255, 0, 128, 0.3)',
  },
  green: {
    primary: '#00ff41',
    secondary: '#00aa2b',
    glow: 'rgba(0, 255, 65, 0.3)',
  },
  yellow: {
    primary: '#f0ff00',
    secondary: '#a0aa00',
    glow: 'rgba(240, 255, 0, 0.3)',
  },
  blue: {
    primary: '#0066ff',
    secondary: '#0044aa',
    glow: 'rgba(0, 102, 255, 0.3)',
  },
};

/**
 * StatsWidget - 统计数据小部件
 *
 * 展示关键指标和统计数据
 *
 * @example
 * ```tsx
 * <StatsWidget
 *   stats={[
 *     {
 *       label: '总访问量',
 *       value: 125643,
 *       trend: { value: 12.5, period: '较上周' },
 *       color: 'cyan',
 *     },
 *     {
 *       label: '新增用户',
 *       value: 1234,
 *       trend: { value: -5.2, period: '较上月' },
 *       color: 'purple',
 *     },
 *   ]}
 *   variant="neon"
 *   glow
 * />
 * ```
 */
export const StatsWidget: React.FC<StatsWidgetProps> = ({
  stats,
  direction = 'row',
  showTrendIcon = true,
  bordered = true,
  glow = false,
  variant = 'default',
  className = '',
}) => {
  const renderTrend = (trend: StatItem['trend']) => {
    if (!trend) return null;

    const isPositive = trend.value > 0;
    const isNegative = trend.value < 0;
    const isNeutral = trend.value === 0;

    const Icon = isPositive ? TrendingUp : isNegative ? TrendingDown : Minus;
    const color = isPositive ? 'text-green-400' : isNegative ? 'text-red-400' : 'text-gray-400';

    return (
      <div className={`flex items-center gap-1 text-xs font-mono ${color}`}>
        {showTrendIcon && <Icon size={12} />}
        <span>{Math.abs(trend.value)}%</span>
        {trend.period && <span className="opacity-70">{trend.period}</span>}
      </div>
    );
  };

  const renderStatCard = (stat: StatItem, index: number) => {
    const colors = stat.color ? colorMap[stat.color] : colorMap.cyan;

    const getCardStyle = () => {
      const baseStyle = 'relative rounded-lg p-4 backdrop-blur-sm';

      switch (variant) {
        case 'glass':
          return `${baseStyle} bg-white/5 border border-white/10`;

        case 'neon':
          return `${baseStyle} bg-black/40 border-2`;
        case 'hologram':
          return `${baseStyle} bg-black/60 border border-opacity-50`;
        default:
          return `${baseStyle} bg-black/20`;
      }
    };

    return (
      <motion.div
        key={stat.label}
        className={getCardStyle()}
        style={
          variant === 'neon' || variant === 'hologram'
            ? {
                borderColor: colors.primary,
                boxShadow: glow ? `0 0 20px ${colors.glow}` : undefined,
              }
            : undefined
        }
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: index * 0.1 }}
        whileHover={{ scale: 1.02 }}
      >
        {/* 扫描线效果 (hologram) */}
        {variant === 'hologram' && (
          <div
            className="absolute inset-0 rounded-lg opacity-20 pointer-events-none"
            style={{
              background: `repeating-linear-gradient(
                0deg,
                transparent,
                transparent 2px,
                ${colors.primary} 2px,
                ${colors.primary} 4px
              )`,
            }}
          />
        )}

        {/* 全息网格效果 (hologram) */}
        {variant === 'hologram' && (
          <div
            className="absolute inset-0 rounded-lg opacity-30 pointer-events-none"
            style={{
              backgroundImage: `
                linear-gradient(${colors.primary}20 1px, transparent 1px),
                linear-gradient(90deg, ${colors.primary}20 1px, transparent 1px)
              `,
              backgroundSize: '8px 8px',
            }}
          />
        )}

        <div className="relative">
          {/* 图标 */}
          {stat.icon && (
            <div
              className="mb-3"
              style={{ color: colors.primary, filter: `drop-shadow(0 0 8px ${colors.glow})` }}
            >
              {stat.icon}
            </div>
          )}

          {/* 标签 */}
          <p className="text-sm font-medium text-gray-400 mb-1">{stat.label}</p>

          {/* 数值 */}
          <div className="flex items-baseline gap-1 mb-2">
            {stat.prefix && (
              <span className="text-lg font-mono" style={{ color: colors.secondary }}>
                {stat.prefix}
              </span>
            )}
            <CountUp
              end={stat.value}
              decimals={stat.decimals ?? 0}
              duration={2}
              className="text-2xl font-bold font-mono"
              style={{ color: colors.primary, textShadow: glow ? `0 0 10px ${colors.glow}` : undefined }}
            />
            {stat.suffix && (
              <span className="text-lg font-mono" style={{ color: colors.secondary }}>
                {stat.suffix}
              </span>
            )}
          </div>

          {/* 趋势 */}
          {renderTrend(stat.trend)}

          {/* 描述 */}
          {stat.description && (
            <p className="text-xs text-gray-500 mt-2">{stat.description}</p>
          )}
        </div>
      </motion.div>
    );
  };

  return (
    <div
      className={`grid gap-4 ${className}`}
      style={{
        gridTemplateColumns: direction === 'row' ? 'repeat(auto-fit, minmax(200px, 1fr))' : '1fr',
      }}
    >
      {stats.map((stat, index) => renderStatCard(stat, index))}
    </div>
  );
};

export default StatsWidget;
