'use client';

/**
 * Timeline Component
 * 时间线组件 - 用于显示时间线事件
 */

import { ReactNode } from 'react';
import { cn } from '@/lib/utils';

export interface TimelineItem {
  /** 时间 */
  time: string;
  /** 标题 */
  title: string;
  /** 描述 */
  description?: string;
  /** 图标 */
  icon?: ReactNode;
  /** 状态 */
  status?: 'default' | 'success' | 'warning' | 'error';
}

export interface TimelineProps {
  /** 时间线数据 */
  items: TimelineItem[];
  /** 自定义类名 */
  className?: string;
  /** 样式变体 */
  variant?: 'default' | 'neon' | 'cyber';
  /** 布局方向 */
  direction?: 'vertical' | 'horizontal';
}

export function Timeline({
  items,
  className,
  variant = 'default',
  direction = 'vertical',
}: TimelineProps) {
  const statusColors = {
    default: 'bg-gray-500',
    success: 'bg-green-500',
    warning: 'bg-yellow-500',
    error: 'bg-red-500',
  };

  const variantClasses = {
    default: 'border-gray-700',
    neon: 'border-cyan-500/30',
    cyber: 'border-green-500/30',
  };

  const isHorizontal = direction === 'horizontal';

  return (
    <div
      className={cn(
        'timeline',
        isHorizontal ? 'flex overflow-x-auto' : 'flex flex-col',
        className
      )}
    >
      {items.map((item, index) => (
        <div
          key={index}
          className={cn(
            'timeline-item relative',
            !isHorizontal && 'pb-8 last:pb-0',
            isHorizontal && 'flex-shrink-0 pr-8 last:pr-0'
          )}
        >
          {/* 时间线节点 */}
          <div className="flex gap-4">
            {/* 时间点 */}
            <div className="flex flex-col items-center">
              <div
                className={cn(
                  'w-4 h-4 rounded-full border-2',
                  variantClasses[variant],
                  statusColors[item.status || 'default']
                )}
              />
              {/* 连接线 */}
              {index < items.length - 1 && (
                <div
                  className={cn(
                    'w-0.5 flex-1 mt-2',
                    variantClasses[variant],
                    isHorizontal && 'hidden'
                  )}
                />
              )}
            </div>

            {/* 内容 */}
            <div className="flex-1 pb-2">
              {/* 时间 */}
              <div className="text-xs opacity-70 mb-1">{item.time}</div>

              {/* 标题 */}
              <div className="font-semibold mb-1">{item.title}</div>

              {/* 描述 */}
              {item.description && (
                <div className="text-sm opacity-80">{item.description}</div>
              )}

              {/* 图标 */}
              {item.icon && (
                <div className="mt-2">{item.icon}</div>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
