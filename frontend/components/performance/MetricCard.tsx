'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Activity, TrendingUp, TrendingDown, Zap } from 'lucide-react';

export interface Metric {
  id: string;
  name: string;
  value: number;
  unit: string;
  previousValue?: number;
  threshold?: {
    warning: number;
    critical: number;
  };
  status: 'good' | 'warning' | 'critical' | 'loading';
  history?: Array<{ timestamp: number; value: number }>;
}

export interface MetricCardProps {
  metric: Metric;
  colorScheme?: 'cyan' | 'purple' | 'pink' | 'green' | 'orange' | 'blue';
  showHistory?: boolean;
  historyPoints?: number;
  refreshInterval?: number;
  onRefresh?: () => void;
}

const colorSchemes = {
  cyan: {
    primary: 'text-cyan-400',
    bg: 'bg-cyan-500/10',
    border: 'border-cyan-500/30',
    glow: 'shadow-cyan-500/20',
    chart: 'fill-cyan-400/20 stroke-cyan-400',
  },
  purple: {
    primary: 'text-purple-400',
    bg: 'bg-purple-500/10',
    border: 'border-purple-500/30',
    glow: 'shadow-purple-500/20',
    chart: 'fill-purple-400/20 stroke-purple-400',
  },
  pink: {
    primary: 'text-pink-400',
    bg: 'bg-pink-500/10',
    border: 'border-pink-500/30',
    glow: 'shadow-pink-500/20',
    chart: 'fill-pink-400/20 stroke-pink-400',
  },
  green: {
    primary: 'text-green-400',
    bg: 'bg-green-500/10',
    border: 'border-green-500/30',
    glow: 'shadow-green-500/20',
    chart: 'fill-green-400/20 stroke-green-400',
  },
  orange: {
    primary: 'text-orange-400',
    bg: 'bg-orange-500/10',
    border: 'border-orange-500/30',
    glow: 'shadow-orange-500/20',
    chart: 'fill-orange-400/20 stroke-orange-400',
  },
  blue: {
    primary: 'text-blue-400',
    bg: 'bg-blue-500/10',
    border: 'border-blue-500/30',
    glow: 'shadow-blue-500/20',
    chart: 'fill-blue-400/20 stroke-blue-400',
  },
};

const statusColors = {
  good: 'text-green-400',
  warning: 'text-yellow-400',
  critical: 'text-red-400',
  loading: 'text-gray-400',
};

export function MetricCard({
  metric,
  colorScheme = 'cyan',
  showHistory = true,
  historyPoints = 20,
  refreshInterval,
  onRefresh,
}: MetricCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [lastRefresh, setLastRefresh] = useState<Date>(new Date());
  const colors = colorSchemes[colorScheme];

  // Auto-refresh
  useEffect(() => {
    if (refreshInterval && onRefresh) {
      const interval = setInterval(() => {
        onRefresh();
        setLastRefresh(new Date());
      }, refreshInterval);
      return () => clearInterval(interval);
    }
  }, [refreshInterval, onRefresh]);

  // Calculate trend
  const trend = metric.previousValue
    ? ((metric.value - metric.previousValue) / metric.previousValue) * 100
    : 0;

  const isTrendUp = trend > 0;
  const TrendIcon = isTrendUp ? TrendingUp : TrendingDown;

  // Determine status color
  const getStatusColor = () => {
    if (metric.status === 'loading') return statusColors.loading;
    if (metric.threshold) {
      if (metric.value >= metric.threshold.critical) return statusColors.critical;
      if (metric.value >= metric.threshold.warning) return statusColors.warning;
    }
    return statusColors.good;
  };

  // Generate sparkline path
  const generateSparkline = () => {
    if (!metric.history || metric.history.length < 2) return '';

    const data = metric.history.slice(-historyPoints);
    const max = Math.max(...data.map(d => d.value));
    const min = Math.min(...data.map(d => d.value));
    const range = max - min || 1;

    const width = 100;
    const height = 40;

    const points = data.map((d, i) => {
      const x = (i / (data.length - 1)) * width;
      const y = height - ((d.value - min) / range) * height;
      return `${x},${y}`;
    }).join(' ');

    return points;
  };

  const sparklinePath = generateSparkline();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.02, y: -2 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      className={`
        relative p-6 rounded-lg border-2 backdrop-blur-sm
        ${colors.bg} ${colors.border} ${colors.glow}
        transition-all duration-300
        ${isHovered ? 'shadow-lg' : ''}
      `}
      style={{
        boxShadow: isHovered ? `0 0 30px ${colors.glow.split('/')[1]}` : undefined,
      }}
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className={`p-2 rounded-lg ${colors.bg} ${colors.primary}`}>
            <Activity className="w-5 h-5" />
          </div>
          <div>
            <h3 className={`text-lg font-semibold ${colors.primary} text-glow`}>
              {metric.name}
            </h3>
            <p className="text-sm text-gray-400">
              {lastRefresh.toLocaleTimeString()}
            </p>
          </div>
        </div>

        {metric.status !== 'loading' && (
          <div className={`flex items-center gap-1 ${getStatusColor()}`}>
            <Zap className="w-4 h-4" />
            <span className="text-xs font-semibold uppercase">
              {metric.status}
            </span>
          </div>
        )}
      </div>

      {/* Main Value */}
      <div className="mb-4">
        {metric.status === 'loading' ? (
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin" />
            <span className="text-gray-400">Loading...</span>
          </div>
        ) : (
          <div className="flex items-end gap-3">
            <span className={`text-4xl font-bold ${colors.primary} text-glow`}>
              {metric.value.toLocaleString()}
            </span>
            <span className={`text-lg text-gray-400 mb-1`}>
              {metric.unit}
            </span>

            {metric.previousValue && (
              <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                className={`flex items-center gap-1 mb-2 ${
                  isTrendUp ? 'text-green-400' : 'text-red-400'
                }`}
              >
                <TrendIcon className="w-4 h-4" />
                <span className="text-sm font-semibold">
                  {Math.abs(trend).toFixed(1)}%
                </span>
              </motion.div>
            )}
          </div>
        )}
      </div>

      {/* History Chart */}
      {showHistory && sparklinePath && (
        <div className="relative h-12 w-full">
          <svg
            viewBox="0 0 100 40"
            className="w-full h-full"
            preserveAspectRatio="none"
          >
            <defs>
              <linearGradient id={`gradient-${metric.id}`} x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" className={colors.chart.split(' ')[0]} stopOpacity="0.3" />
                <stop offset="100%" className={colors.chart.split(' ')[0]} stopOpacity="0" />
              </linearGradient>
            </defs>

            {/* Area fill */}
            <motion.path
              d={`M0,40 L${sparklinePath.split(' ')[0]} L${sparklinePath.split(' ')[sparklinePath.split(' ').length - 1]} L100,40 Z`}
              fill={`url(#gradient-${metric.id})`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
            />

            {/* Line */}
            <motion.polyline
              points={sparklinePath}
              fill="none"
              className={colors.chart.split(' ')[1]}
              strokeWidth="2"
              strokeLinejoin="round"
              strokeLinecap="round"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 1, ease: 'easeInOut' }}
            />
          </svg>
        </div>
      )}

      {/* Threshold Indicator */}
      {metric.threshold && (
        <div className="mt-4 pt-4 border-t border-gray-700/50">
          <div className="flex justify-between items-center text-xs text-gray-400 mb-2">
            <span>Warning: {metric.threshold.warning}</span>
            <span>Critical: {metric.threshold.critical}</span>
          </div>
          <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
            <motion.div
              className={`h-full ${colors.primary.replace('text-', 'bg-')}`}
              initial={{ width: 0 }}
              animate={{
                width: `${Math.min(
                  (metric.value / metric.threshold.critical) * 100,
                  100
                )}%`,
              }}
              transition={{ duration: 0.5, ease: 'easeOut' }}
            />
          </div>
        </div>
      )}

      {/* Hover Glow Effect */}
      {isHovered && (
        <motion.div
          className={`absolute inset-0 rounded-lg ${colors.glow} pointer-events-none`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.5 }}
          exit={{ opacity: 0 }}
        />
      )}
    </motion.div>
  );
}

// Preset metrics factory
export function createMetric(
  id: string,
  name: string,
  value: number,
  unit: string,
  options?: Partial<Metric>
): Metric {
  return {
    id,
    name,
    value,
    unit,
    status: 'good',
    ...options,
  };
}
