import React from 'react';
import { cn } from '@/lib/utils';
import {
  TrendingUp,
  TrendingDown,
  Minus,
  ArrowUpRight,
  ArrowDownRight,
} from 'lucide-react';

export type TrendDirection = 'up' | 'down' | 'neutral';

interface StatCardProps {
  title: string;
  value: string | number;
  change?: number;
  changeLabel?: string;
  trend?: TrendDirection;
  icon?: React.ReactNode;
  className?: string;
  size?: 'default' | 'compact';
}

const trendIcons = {
  up: ArrowUpRight,
  down: ArrowDownRight,
  neutral: Minus,
};

const trendColors = {
  up: 'text-green-500',
  down: 'text-red-500',
  neutral: 'text-gray-500',
};

const bgColors = {
  up: 'bg-green-500/10',
  down: 'bg-red-500/10',
  neutral: 'bg-gray-500/10',
};

/**
 * StatCard - 统计卡片组件
 * 用于显示关键指标和趋势
 */
export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  change,
  changeLabel,
  trend,
  icon,
  className,
  size = 'default',
}) => {
  const calculatedTrend = trend || (change !== undefined
    ? (change > 0 ? 'up' : change < 0 ? 'down' : 'neutral')
    : 'neutral'
  );

  const TrendIcon = trendIcons[calculatedTrend];
  const trendColor = trendColors[calculatedTrend];
  const bgColor = bgColors[calculatedTrend];

  const isCompact = size === 'compact';

  return (
    <div className={cn(
      'bg-gray-900/50 border border-gray-800 rounded-lg p-6',
      isCompact && 'p-4',
      className
    )}>
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <p className={cn(
            'text-sm font-medium',
            isCompact ? 'text-gray-400' : 'text-gray-500'
          )}>
            {title}
          </p>

          <p className={cn(
            'font-bold mt-1',
            isCompact ? 'text-2xl' : 'text-3xl'
          )}>
            {value}
          </p>

          {change !== undefined && (
            <div className="flex items-center mt-2 space-x-2">
              <div className={cn(
                'flex items-center px-2 py-1 rounded',
                bgColor
              )}>
                <TrendIcon className={cn('w-3 h-3', trendColor)} />
                <span className={cn(
                  'text-sm font-medium ml-1',
                  trendColor
                )}>
                  {Math.abs(change)}%
                </span>
              </div>

              {changeLabel && (
                <span className="text-sm text-gray-500">
                  {changeLabel}
                </span>
              )}
            </div>
          )}
        </div>

        {icon && (
          <div className="ml-4">
            <div className="w-12 h-12 rounded-lg bg-cyan-500/10 flex items-center justify-center text-cyan-500">
              {icon}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default StatCard;
