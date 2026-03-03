/**
 * StatusIndicator - 状态指示器组件
 * 用于显示各种状态的视觉指示器，带有赛博朋克风格动画效果
 */

'use client';

import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { LucideIcon } from 'lucide-react';

export type StatusType = 'online' | 'offline' | 'busy' | 'away' | 'error' | 'warning' | 'success' | 'loading' | 'unknown';

export interface StatusIndicatorProps {
  /** 状态类型 */
  status: StatusType;
  /** 状态文本 */
  label?: string;
  /** 大小 */
  size?: 'sm' | 'md' | 'lg';
  /** 是否显示动画 */
  animated?: boolean;
  /** 自定义图标 */
  icon?: LucideIcon;
  /** 是否显示脉冲效果 */
  pulse?: boolean;
  /** 自定义颜色 */
  customColor?: string;
  /** 布局方向 */
  layout?: 'horizontal' | 'vertical';
  /** 自定义类名 */
  className?: string;
}

const statusConfig: Record<StatusType, { color: string; bgColor: string; label: string }> = {
  online: { color: '#00ff88', bgColor: 'bg-green-500/20', label: '在线' },
  offline: { color: '#6b7280', bgColor: 'bg-gray-500/20', label: '离线' },
  busy: { color: '#ef4444', bgColor: 'bg-red-500/20', label: '忙碌' },
  away: { color: '#f59e0b', bgColor: 'bg-amber-500/20', label: '离开' },
  error: { color: '#ff0080', bgColor: 'bg-pink-500/20', label: '错误' },
  warning: { color: '#f0ff00', bgColor: 'bg-yellow-500/20', label: '警告' },
  success: { color: '#00f0ff', bgColor: 'bg-cyan-500/20', label: '成功' },
  loading: { color: '#9d00ff', bgColor: 'bg-purple-500/20', label: '加载中' },
  unknown: { color: '#6b7280', bgColor: 'bg-gray-500/20', label: '未知' },
};

const sizeStyles = {
  sm: { dot: 'w-2 h-2', text: 'text-xs', gap: 'gap-1.5' },
  md: { dot: 'w-3 h-3', text: 'text-sm', gap: 'gap-2' },
  lg: { dot: 'w-4 h-4', text: 'text-base', gap: 'gap-2.5' },
};

export function StatusIndicator({
  status,
  label,
  size = 'md',
  animated = true,
  icon: Icon,
  pulse = true,
  customColor,
  layout = 'horizontal',
  className,
}: StatusIndicatorProps) {
  const config = statusConfig[status];
  const color = customColor || config.color;
  const displayLabel = label || config.label;
  const styles = sizeStyles[size];

  const isAnimated = animated && (status === 'loading' || status === 'online' || status === 'success');

  return (
    <div
      className={cn(
        'flex items-center',
        layout === 'vertical' ? 'flex-col gap-1' : styles.gap,
        className
      )}
    >
      {/* 状态指示点 */}
      <div className="relative flex-shrink-0">
        <motion.div
          className={cn(
            'rounded-full border-2',
            styles.dot,
            Icon && 'flex items-center justify-center'
          )}
          style={{
            backgroundColor: color,
            borderColor: color,
            boxShadow: `0 0 10px ${color}40`,
          }}
          animate={
            isAnimated
              ? {
                  scale: [1, 1.1, 1],
                  opacity: [0.8, 1, 0.8],
                }
              : {}
          }
          transition={
            isAnimated
              ? {
                  duration: 2,
                  repeat: Infinity,
                  ease: 'easeInOut',
                }
              : {}
          }
        >
          {Icon && (
            <Icon className={cn('text-white', size === 'sm' ? 'w-1.5 h-1.5' : size === 'md' ? 'w-2 h-2' : 'w-2.5 h-2.5')} />
          )}
        </motion.div>

        {/* 脉冲效果 */}
        {pulse && isAnimated && (
          <motion.div
            className={cn('absolute inset-0 rounded-full', styles.dot)}
            style={{
              backgroundColor: color,
            }}
            animate={{
              scale: [1, 1.5, 1.8],
              opacity: [0.6, 0.3, 0],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: 'easeOut',
            }}
          />
        )}

        {/* 加载旋转效果 */}
        {status === 'loading' && (
          <motion.div
            className={cn('absolute inset-0 rounded-full border-2 border-t-transparent', styles.dot)}
            style={{
              borderColor: `${color}40`,
              borderTopColor: color,
            }}
            animate={{
              rotate: 360,
            }}
            transition={{
              duration: 1,
              repeat: Infinity,
              ease: 'linear',
            }}
          />
        )}
      </div>

      {/* 状态标签 */}
      {displayLabel && (
        <span
          className={cn(
            'font-medium',
            styles.text,
            'transition-colors duration-200'
          )}
          style={{ color }}
        >
          {displayLabel}
        </span>
      )}
    </div>
  );
}

// 预设组件
export function OnlineStatus(props: Omit<StatusIndicatorProps, 'status'>) {
  return <StatusIndicator {...props} status="online" />;
}

export function OfflineStatus(props: Omit<StatusIndicatorProps, 'status'>) {
  return <StatusIndicator {...props} status="offline" />;
}

export function BusyStatus(props: Omit<StatusIndicatorProps, 'status'>) {
  return <StatusIndicator {...props} status="busy" />;
}

export function LoadingStatus(props: Omit<StatusIndicatorProps, 'status'>) {
  return <StatusIndicator {...props} status="loading" />;
}

export function ErrorStatus(props: Omit<StatusIndicatorProps, 'status'>) {
  return <StatusIndicator {...props} status="error" />;
}

export function SuccessStatus(props: Omit<StatusIndicatorProps, 'status'>) {
  return <StatusIndicator {...props} status="success" />;
}

export function WarningStatus(props: Omit<StatusIndicatorProps, 'status'>) {
  return <StatusIndicator {...props} status="warning" />;
}
