/**
 * 仪表盘统计卡片组件
 * 展示关键指标和数据趋势
 */

'use client';

import { motion } from 'framer-motion';
import { ArrowUp, ArrowDown, TrendingUp, TrendingDown } from 'lucide-react';
import { cn } from '@/lib/utils';

interface StatCardProps {
  title: string;
  value: string | number;
  change?: number;
  changeType?: 'increase' | 'decrease' | 'neutral';
  icon?: React.ReactNode;
  description?: string;
  className?: string;
  delay?: number;
}

export function StatCard({
  title,
  value,
  change,
  changeType = 'neutral',
  icon,
  description,
  className,
  delay = 0,
}: StatCardProps) {
  const isPositive = changeType === 'increase';
  const isNegative = changeType === 'decrease';

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay }}
      className={cn(
        'p-6 bg-gray-900/50 border border-gray-800 rounded-lg',
        'hover:border-cyan-500/50 transition-all duration-300',
        className
      )}
    >
      <div className="flex items-start justify-between mb-4">
        <div className="p-3 bg-cyan-500/10 rounded-lg text-cyan-400">
          {icon}
        </div>
        {change !== undefined && (
          <div
            className={cn(
              'flex items-center gap-1 px-2 py-1 rounded text-xs font-medium',
              isPositive
                ? 'bg-green-500/20 text-green-400'
                : isNegative
                ? 'bg-red-500/20 text-red-400'
                : 'bg-gray-500/20 text-gray-400'
            )}
          >
            {isPositive ? (
              <ArrowUp className="w-3 h-3" />
            ) : isNegative ? (
              <ArrowDown className="w-3 h-3" />
            ) : null}
            <span>{Math.abs(change)}%</span>
          </div>
        )}
      </div>

      <div>
        <h3 className="text-gray-400 text-sm mb-1">{title}</h3>
        <p className="text-3xl font-bold text-white mb-1">{value}</p>
        {description && (
          <p className="text-xs text-gray-500">{description}</p>
        )}
      </div>
    </motion.div>
  );
}

interface StatsGridProps {
  stats: StatCardProps[];
  columns?: 2 | 3 | 4;
  className?: string;
}

export function StatsGrid({ stats, columns = 4, className }: StatsGridProps) {
  return (
    <div
      className={cn(
        'grid gap-4',
        columns === 2 && 'grid-cols-1 md:grid-cols-2',
        columns === 3 && 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
        columns === 4 && 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4',
        className
      )}
    >
      {stats.map((stat, index) => (
        <StatCard key={index} {...stat} delay={index * 0.1} />
      ))}
    </div>
  );
}

/**
 * 图表容器组件
 */
interface ChartContainerProps {
  title: string;
  description?: string;
  children: React.ReactNode;
  actions?: React.ReactNode;
  className?: string;
}

export function ChartContainer({
  title,
  description,
  children,
  actions,
  className,
}: ChartContainerProps) {
  return (
    <div
      className={cn(
        'p-6 bg-gray-900/50 border border-gray-800 rounded-lg',
        className
      )}
    >
      <div className="flex items-start justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-white mb-1">{title}</h3>
          {description && (
            <p className="text-sm text-gray-400">{description}</p>
          )}
        </div>
        {actions && <div>{actions}</div>}
      </div>

      {children}
    </div>
  );
}

/**
 * 活动列表组件
 */
interface Activity {
  id: string;
  type: 'comment' | 'like' | 'follow' | 'post' | 'system';
  title: string;
  description: string;
  timestamp: string;
  avatar?: string;
}

interface ActivityFeedProps {
  activities: Activity[];
  maxItems?: number;
  className?: string;
}

export function ActivityFeed({
  activities,
  maxItems = 5,
  className,
}: ActivityFeedProps) {
  const displayedActivities = activities.slice(0, maxItems);

  const getIcon = (type: Activity['type']) => {
    switch (type) {
      case 'comment':
        return '💬';
      case 'like':
        return '❤️';
      case 'follow':
        return '👤';
      case 'post':
        return '📝';
      case 'system':
        return '⚙️';
      default:
        return '📌';
    }
  };

  return (
    <div className={cn('space-y-3', className)}>
      {displayedActivities.map((activity) => (
        <motion.div
          key={activity.id}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className={cn(
            'flex items-start gap-3 p-3',
            'bg-gray-900/30 border border-gray-800 rounded-lg',
            'hover:border-gray-700 transition-colors'
          )}
        >
          <div className="text-2xl">{getIcon(activity.type)}</div>

          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-white truncate">
              {activity.title}
            </p>
            <p className="text-xs text-gray-400 truncate">
              {activity.description}
            </p>
            <p className="text-xs text-gray-500 mt-1">{activity.timestamp}</p>
          </div>
        </motion.div>
      ))}
    </div>
  );
}

/**
 * 快速操作按钮组件
 */
interface QuickAction {
  id: string;
  label: string;
  icon: React.ReactNode;
  onClick: () => void;
  variant?: 'default' | 'primary' | 'danger';
}

interface QuickActionsProps {
  actions: QuickAction[];
  className?: string;
}

export function QuickActions({ actions, className }: QuickActionsProps) {
  return (
    <div
      className={cn(
        'grid grid-cols-2 gap-3',
        className
      )}
    >
      {actions.map((action) => (
        <motion.button
          key={action.id}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={action.onClick}
          className={cn(
            'flex items-center gap-2 p-3 rounded-lg transition-all duration-200',
            'text-sm font-medium',
            action.variant === 'primary' &&
              'bg-gradient-to-r from-cyan-500 to-purple-500 text-white',
            action.variant === 'danger' &&
              'bg-red-500/20 text-red-400 hover:bg-red-500/30',
            !action.variant || action.variant === 'default'
              ? 'bg-gray-800 text-gray-300 hover:bg-gray-700'
          )}
        >
          {action.icon}
          <span>{action.label}</span>
        </motion.button>
      ))}
    </div>
  );
}
