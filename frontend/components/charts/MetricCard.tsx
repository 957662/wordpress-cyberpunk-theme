import React from 'react';
import { cn } from '@/lib/utils';
import { Activity, Users, Eye, Heart, MessageCircle, Share2 } from 'lucide-react';

export type MetricType = 'views' | 'likes' | 'comments' | 'shares' | 'users' | 'custom';

interface MetricCardProps {
  type: MetricType;
  label: string;
  value: number | string;
  previousValue?: number;
  period?: string;
  icon?: React.ReactNode;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  onClick?: () => void;
  className?: string;
}

const defaultIcons = {
  views: Eye,
  likes: Heart,
  comments: MessageCircle,
  shares: Share2,
  users: Users,
  custom: Activity,
};

const defaultColors = {
  views: 'text-blue-500 bg-blue-500/10',
  likes: 'text-red-500 bg-red-500/10',
  comments: 'text-green-500 bg-green-500/10',
  shares: 'text-purple-500 bg-purple-500/10',
  users: 'text-cyan-500 bg-cyan-500/10',
  custom: 'text-gray-500 bg-gray-500/10',
};

/**
 * MetricCard - 指标卡片组件
 * 用于显示各种统计数据
 */
export const MetricCard: React.FC<MetricCardProps> = ({
  type,
  label,
  value,
  previousValue,
  period = 'vs last month',
  icon: customIcon,
  trend,
  onClick,
  className,
}) => {
  const DefaultIcon = defaultIcons[type];
  const colors = defaultColors[type];

  const icon = customIcon || <DefaultIcon className="w-5 h-5" />;

  const calculatedTrend = trend || (previousValue !== undefined
    ? {
        value: Math.round(((Number(value) - previousValue) / previousValue) * 100),
        isPositive: Number(value) > previousValue,
      }
    : undefined
  );

  return (
    <div
      onClick={onClick}
      className={cn(
        'relative bg-gray-900/50 border border-gray-800 rounded-lg p-6',
        'hover:border-gray-700 transition-colors cursor-pointer',
        onClick && 'hover:shadow-lg hover:shadow-cyan-500/10',
        className
      )}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm text-gray-500 mb-1">{label}</p>
          <p className="text-3xl font-bold text-white">{value}</p>

          {calculatedTrend && (
            <div className="flex items-center mt-2 space-x-2">
              <span className={cn(
                'text-sm font-medium',
                calculatedTrend.isPositive ? 'text-green-500' : 'text-red-500'
              )}>
                {calculatedTrend.isPositive ? '+' : '-'}{Math.abs(calculatedTrend.value)}%
              </span>
              <span className="text-sm text-gray-500">{period}</span>
            </div>
          )}
        </div>

        <div className={cn('p-3 rounded-lg', colors)}>
          {icon}
        </div>
      </div>
    </div>
  );
};

export default MetricCard;
