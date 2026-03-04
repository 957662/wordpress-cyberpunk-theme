import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';

export interface StatsCardProps {
  title: string;
  value: string | number;
  change?: number;
  icon?: React.ReactNode;
  trend?: 'up' | 'down' | 'neutral';
  className?: string;
}

export function StatsCard({
  title,
  value,
  change,
  icon,
  trend = 'neutral',
  className,
}: StatsCardProps) {
  const trendColors = {
    up: 'text-green-600',
    down: 'text-red-600',
    neutral: 'text-gray-600',
  };

  return (
    <Card className={cn('transition-all hover:shadow-lg', className)}>
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
              {title}
            </p>
            <p className="mt-2 text-3xl font-bold text-gray-900 dark:text-white">
              {value}
            </p>
            {change !== undefined && (
              <p
                className={cn(
                  'mt-2 flex items-center text-sm',
                  trendColors[trend]
                )}
              >
                {trend === 'up' && '↑'}
                {trend === 'down' && '↓'}
                {Math.abs(change)}% from last month
              </p>
            )}
          </div>
          {icon && (
            <div className="ml-4 flex h-12 w-12 items-center justify-center rounded-lg bg-gray-100 dark:bg-gray-800">
              {icon}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
