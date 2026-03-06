'use client';

import { motion } from 'framer-motion';
import { LucideIcon } from 'lucide-react';
import { MiniChart } from './AnalyticsChart';

interface StatCardProps {
  title: string;
  value: string | number;
  change?: number;
  changeType?: 'increase' | 'decrease' | 'neutral';
  icon?: LucideIcon;
  color?: 'cyan' | 'purple' | 'pink' | 'green' | 'orange';
  sparkline?: number[];
  trend?: 'up' | 'down' | 'stable';
  size?: 'default' | 'compact';
}

/**
 * 赛博朋克风格的数据卡片
 */
export function StatCard({
  title,
  value,
  change,
  changeType = 'neutral',
  icon: Icon,
  color = 'cyan',
  sparkline,
  trend,
  size = 'default',
}: StatCardProps) {
  const colorClasses = {
    cyan: 'bg-cyber-cyan/10 border-cyber-cyan/30 text-cyber-cyan',
    purple: 'bg-cyber-purple/10 border-cyber-purple/30 text-cyber-purple',
    pink: 'bg-cyber-pink/10 border-cyber-pink/30 text-cyber-pink',
    green: 'bg-green-500/10 border-green-500/30 text-green-500',
    orange: 'bg-orange-500/10 border-orange-500/30 text-orange-500',
  };

  const getChangeIcon = () => {
    if (changeType === 'increase') return '↑';
    if (changeType === 'decrease') return '↓';
    return '→';
  };

  const getChangeColor = () => {
    if (changeType === 'increase') return 'text-green-500';
    if (changeType === 'decrease') return 'text-red-500';
    return 'text-gray-500';
  };

  const getTrendColor = () => {
    if (trend === 'up') return 'text-green-500';
    if (trend === 'down') return 'text-red-500';
    return 'text-gray-500';
  };

  if (size === 'compact') {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className={`cyber-card p-4 ${colorClasses[color]}`}
      >
        <div className="flex items-center justify-between gap-4">
          <div className="flex-1 min-w-0">
            <div className="text-xs text-gray-500 mb-1">{title}</div>
            <div className="text-xl font-mono font-bold text-white truncate">
              {value}
            </div>
            {change !== undefined && (
              <div className={`text-xs mt-1 ${getChangeColor()}`}>
                {getChangeIcon()} {Math.abs(change)}%
              </div>
            )}
          </div>

          {Icon && (
            <div className={`p-2 rounded-lg ${colorClasses[color]}`}>
              <Icon className="w-5 h-5" />
            </div>
          )}
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="cyber-card p-6 group"
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <div className="text-xs text-gray-500 mb-1">{title}</div>
          <div className="text-3xl font-mono font-bold text-white">
            {value}
          </div>
        </div>

        {Icon && (
          <motion.div
            whileHover={{ scale: 1.1, rotate: 5 }}
            className={`p-3 rounded-xl ${colorClasses[color]}`}
          >
            <Icon className="w-6 h-6" />
          </motion.div>
        )}
      </div>

      {/* Change Indicator */}
      {(change !== undefined || trend) && (
        <div className="flex items-center gap-3 mb-4">
          {change !== undefined && (
            <div className={`flex items-center gap-1 text-sm font-medium ${getChangeColor()}`}>
              <span>{getChangeIcon()}</span>
              <span>{Math.abs(change)}%</span>
              <span className="text-gray-500 text-xs">vs 上月</span>
            </div>
          )}

          {trend && (
            <div className={`text-sm ${getTrendColor()}`}>
              {trend === 'up' && '↗ 上升'}
              {trend === 'down' && '↘ 下降'}
              {trend === 'stable' && '→ 稳定'}
            </div>
          )}
        </div>
      )}

      {/* Sparkline */}
      {sparkline && sparkline.length > 0 && (
        <div className="h-12">
          <MiniChart data={sparkline} color={color} />
        </div>
      )}
    </motion.div>
  );
}

/**
 * 数据网格组件
 */
export function StatGrid({
  children,
  columns = 4,
}: {
  children: React.ReactNode;
  columns?: 2 | 3 | 4;
}) {
  const gridCols = {
    2: 'grid-cols-1 md:grid-cols-2',
    3: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
    4: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4',
  };

  return (
    <div className={`grid gap-4 ${gridCols[columns]}`}>
      {children}
    </div>
  );
}

/**
 * 进度卡片组件
 */
export function ProgressCard({
  title,
  value,
  max,
  unit,
  color = 'cyan',
  showPercentage = true,
}: {
  title: string;
  value: number;
  max: number;
  unit?: string;
  color?: 'cyan' | 'purple' | 'pink' | 'green';
  showPercentage?: boolean;
}) {
  const percentage = Math.min(100, Math.max(0, (value / max) * 100));

  const colorClasses = {
    cyan: 'bg-cyber-cyan',
    purple: 'bg-cyber-purple',
    pink: 'bg-cyber-pink',
    green: 'bg-green-500',
  };

  return (
    <div className="cyber-card p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="text-sm text-gray-500">{title}</div>
        {showPercentage && (
          <div className="text-sm font-mono font-bold text-white">
            {percentage.toFixed(0)}%
          </div>
        )}
      </div>

      <div className="flex items-end gap-3 mb-3">
        <div className="text-3xl font-mono font-bold text-white">
          {value.toLocaleString()}
        </div>
        {unit && (
          <div className="text-gray-500 text-sm mb-1">
            / {max.toLocaleString()} {unit}
          </div>
        )}
      </div>

      {/* Progress Bar */}
      <div className="h-2 bg-cyber-darker rounded-full overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 1, ease: 'easeOut' }}
          className={`h-full ${colorClasses[color]}`}
          style={{ boxShadow: `0 0 10px currentColor` }}
        />
      </div>
    </div>
  );
}
