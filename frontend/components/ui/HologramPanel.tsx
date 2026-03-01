/**
 * HologramPanel Component
 * 全息投影面板组件
 */

'use client';

import React from 'react';
import { motion, HTMLMotionProps } from 'framer-motion';
import { cn } from '@/lib/utils';

/**
 * 全息颜色
 */
export type HologramColor = 'cyan' | 'purple' | 'green' | 'blue';

/**
 * HologramPanel 属性
 */
export interface HologramPanelProps extends HTMLMotionProps<'div'> {
  color?: HologramColor;
  intensity?: 'low' | 'medium' | 'high';
  scanline?: boolean;
  flicker?: boolean;
  children: React.ReactNode;
  className?: string;
}

/**
 * 颜色配置
 */
const colorConfig: Record<HologramColor, { primary: string; glow: string; shadow: string }> = {
  cyan: {
    primary: 'rgba(0, 240, 255, 0.1)',
    glow: 'rgba(0, 240, 255, 0.5)',
    shadow: '0 0 20px rgba(0, 240, 255, 0.3)',
  },
  purple: {
    primary: 'rgba(157, 0, 255, 0.1)',
    glow: 'rgba(157, 0, 255, 0.5)',
    shadow: '0 0 20px rgba(157, 0, 255, 0.3)',
  },
  green: {
    primary: 'rgba(0, 255, 136, 0.1)',
    glow: 'rgba(0, 255, 136, 0.5)',
    shadow: '0 0 20px rgba(0, 255, 136, 0.3)',
  },
  blue: {
    primary: 'rgba(59, 130, 246, 0.1)',
    glow: 'rgba(59, 130, 246, 0.5)',
    shadow: '0 0 20px rgba(59, 130, 246, 0.3)',
  },
};

/**
 * HologramPanel 组件
 */
export function HologramPanel({
  color = 'cyan',
  intensity = 'medium',
  scanline = true,
  flicker = true,
  children,
  className,
  ...props
}: HologramPanelProps) {
  const config = colorConfig[color];

  const intensityConfig = {
    low: { opacity: 0.6, flickerIntensity: 0.05 },
    medium: { opacity: 0.8, flickerIntensity: 0.1 },
    high: { opacity: 1, flickerIntensity: 0.15 },
  };

  const intensitySettings = intensityConfig[intensity];

  return (
    <motion.div
      className={cn(
        'relative',
        'rounded-lg',
        'border',
        'backdrop-blur-sm',
        'overflow-hidden',
        className
      )}
      style={{
        borderColor: config.glow,
        backgroundColor: config.primary,
        boxShadow: config.shadow,
      }}
      animate={
        flicker
          ? {
              opacity: [
                intensitySettings.opacity,
                intensitySettings.opacity - intensitySettings.flickerIntensity,
                intensitySettings.opacity,
              ],
            }
          : {}
      }
      transition={{
        duration: 0.1,
        repeat: Infinity,
        repeatDelay: Math.random() * 2,
      }}
      {...props}
    >
      {/* 全息网格背景 */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: `
            linear-gradient(${config.glow} 1px, transparent 1px),
            linear-gradient(90deg, ${config.glow} 1px, transparent 1px)
          `,
          backgroundSize: '20px 20px',
          opacity: 0.3,
        }}
      />

      {/* 扫描线效果 */}
      {scanline && (
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <motion.div
            className="absolute inset-x-0 h-px"
            style={{
              background: `linear-gradient(to bottom, transparent, ${config.glow}, transparent)`,
            }}
            animate={{
              y: ['-100%', '100%'],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: 'linear',
            }}
          />
        </div>
      )}

      {/* 边缘发光 */}
      <div
        className="absolute inset-0 pointer-events-none rounded-lg"
        style={{
          boxShadow: `inset 0 0 20px ${config.glow}`,
          opacity: 0.5,
        }}
      />

      {/* 内容 */}
      <div className="relative z-10 p-6">{children}</div>

      {/* 装饰角 */}
      <div className="absolute top-2 left-2 w-4 h-4 border-t-2 border-l-2 pointer-events-none" style={{ borderColor: config.glow }} />
      <div className="absolute top-2 right-2 w-4 h-4 border-t-2 border-r-2 pointer-events-none" style={{ borderColor: config.glow }} />
      <div className="absolute bottom-2 left-2 w-4 h-4 border-b-2 border-l-2 pointer-events-none" style={{ borderColor: config.glow }} />
      <div className="absolute bottom-2 right-2 w-4 h-4 border-b-2 border-r-2 pointer-events-none" style={{ borderColor: config.glow }} />
    </motion.div>
  );
}

/**
 * HologramCard 组件
 */
export interface HologramCardProps {
  title?: string;
  subtitle?: string;
  icon?: React.ReactNode;
  color?: HologramColor;
  children: React.ReactNode;
  className?: string;
}

export function HologramCard({
  title,
  subtitle,
  icon,
  color = 'cyan',
  children,
  className,
}: HologramCardProps) {
  return (
    <HologramPanel color={color} className={className}>
      {(title || subtitle || icon) && (
        <div className="flex items-start gap-4 mb-4">
          {icon && (
            <div className="flex-shrink-0 p-3 rounded-lg bg-cyber-dark/50">
              {icon}
            </div>
          )}
          <div className="flex-1 min-w-0">
            {title && (
              <h3 className="text-lg font-bold text-white mb-1">{title}</h3>
            )}
            {subtitle && (
              <p className="text-sm text-gray-400">{subtitle}</p>
            )}
          </div>
        </div>
      )}
      {children}
    </HologramPanel>
  );
}

/**
 * HologramStat 组件 - 全息统计卡片
 */
export interface HologramStatProps {
  label: string;
  value: string | number;
  icon?: React.ReactNode;
  color?: HologramColor;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  className?: string;
}

export function HologramStat({
  label,
  value,
  icon,
  color = 'cyan',
  trend,
  className,
}: HologramStatProps) {
  return (
    <HologramPanel color={color} className={className}>
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <p className="text-sm text-gray-400 mb-1">{label}</p>
          <p className="text-3xl font-bold text-white">{value}</p>
          {trend && (
            <div className="flex items-center gap-1 mt-2">
              <span
                className={cn(
                  'text-sm font-medium',
                  trend.isPositive ? 'text-green-400' : 'text-red-400'
                )}
              >
                {trend.isPositive ? '+' : '-'}{Math.abs(trend.value)}%
              </span>
            </div>
          )}
        </div>
        {icon && (
          <div className="flex-shrink-0 p-4 rounded-lg bg-cyber-dark/50">
            {icon}
          </div>
        )}
      </div>
    </HologramPanel>
  );
}
