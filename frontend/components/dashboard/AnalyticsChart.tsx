'use client';

import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

interface DataPoint {
  label: string;
  value: number;
  timestamp?: string;
}

interface AnalyticsChartProps {
  data: DataPoint[];
  title?: string;
  subtitle?: string;
  height?: number;
  showArea?: boolean;
  color?: 'cyan' | 'purple' | 'pink' | 'green';
  showStats?: boolean;
}

/**
 * 赛博朋克风格的数据分析图表
 */
export function AnalyticsChart({
  data,
  title,
  subtitle,
  height = 300,
  showArea = true,
  color = 'cyan',
  showStats = true,
}: AnalyticsChartProps) {
  const colorClasses = {
    cyan: {
      primary: 'bg-cyber-cyan',
      text: 'text-cyber-cyan',
      glow: 'shadow-cyber-cyan/50',
      gradient: 'from-cyber-cyan/20 to-transparent',
    },
    purple: {
      primary: 'bg-cyber-purple',
      text: 'text-cyber-purple',
      glow: 'shadow-cyber-purple/50',
      gradient: 'from-cyber-purple/20 to-transparent',
    },
    pink: {
      primary: 'bg-cyber-pink',
      text: 'text-cyber-pink',
      glow: 'shadow-cyber-pink/50',
      gradient: 'from-cyber-pink/20 to-transparent',
    },
    green: {
      primary: 'bg-green-500',
      text: 'text-green-500',
      glow: 'shadow-green-500/50',
      gradient: 'from-green-500/20 to-transparent',
    },
  };

  const colors = colorClasses[color];

  // 计算统计信息
  const stats = useMemo(() => {
    if (data.length < 2) return null;

    const values = data.map(d => d.value);
    const current = values[values.length - 1];
    const previous = values[values.length - 2];
    const min = Math.min(...values);
    const max = Math.max(...values);
    const avg = values.reduce((a, b) => a + b, 0) / values.length;

    const change = previous !== 0 ? ((current - previous) / previous) * 100 : 0;
    const trend = change > 0 ? 'up' : change < 0 ? 'down' : 'stable';

    return { current, previous, min, max, avg, change, trend };
  }, [data]);

  // 生成 SVG 路径
  const chartPath = useMemo(() => {
    if (data.length === 0) return '';

    const width = 100;
    const chartHeight = 100;
    const values = data.map(d => d.value);
    const min = Math.min(...values);
    const max = Math.max(...values);
    const range = max - min || 1;

    const points = data.map((point, index) => {
      const x = (index / (data.length - 1)) * width;
      const y = chartHeight - ((point.value - min) / range) * chartHeight;
      return `${x},${y}`;
    });

    return `M ${points.join(' L ')}`;
  }, [data]);

  const areaPath = useMemo(() => {
    if (!showArea) return '';
    return `${chartPath} L 100,100 L 0,100 Z`;
  }, [chartPath, showArea]);

  return (
    <div className="cyber-card p-6">
      {/* Header */}
      {(title || subtitle) && (
        <div className="mb-6">
          {title && (
            <h3 className="text-xl font-display font-bold text-white mb-1">
              {title}
            </h3>
          )}
          {subtitle && (
            <p className="text-gray-400 text-sm">{subtitle}</p>
          )}
        </div>
      )}

      {/* Stats */}
      {showStats && stats && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-cyber-darker/50 rounded-lg p-3 border border-cyber-border">
            <div className="text-xs text-gray-500 mb-1">当前值</div>
            <div className={`text-lg font-mono font-bold ${colors.text}`}>
              {stats.current.toLocaleString()}
            </div>
          </div>

          <div className="bg-cyber-darker/50 rounded-lg p-3 border border-cyber-border">
            <div className="text-xs text-gray-500 mb-1">平均值</div>
            <div className="text-lg font-mono font-bold text-white">
              {stats.avg.toFixed(1)}
            </div>
          </div>

          <div className="bg-cyber-darker/50 rounded-lg p-3 border border-cyber-border">
            <div className="text-xs text-gray-500 mb-1">最大值</div>
            <div className="text-lg font-mono font-bold text-white">
              {stats.max.toLocaleString()}
            </div>
          </div>

          <div className="bg-cyber-darker/50 rounded-lg p-3 border border-cyber-border">
            <div className="text-xs text-gray-500 mb-1">变化率</div>
            <div className="flex items-center gap-1">
              {stats.trend === 'up' && <TrendingUp className={`w-4 h-4 ${colors.text}`} />}
              {stats.trend === 'down' && <TrendingDown className="w-4 h-4 text-red-500" />}
              {stats.trend === 'stable' && <Minus className="w-4 h-4 text-gray-500" />}
              <span
                className={`text-lg font-mono font-bold ${
                  stats.trend === 'up' ? colors.text : stats.trend === 'down' ? 'text-red-500' : 'text-gray-500'
                }`}
              >
                {Math.abs(stats.change).toFixed(1)}%
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Chart */}
      <div
        className="relative"
        style={{ height: `${height}px` }}
      >
        <svg
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
          className="w-full h-full"
        >
          <defs>
            <linearGradient id={`gradient-${color}`} x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor={`var(--cyber-${color})`} stopOpacity="0.3" />
              <stop offset="100%" stopColor={`var(--cyber-${color})`} stopOpacity="0" />
            </linearGradient>
          </defs>

          {/* Area */}
          {showArea && areaPath && (
            <motion.path
              d={areaPath}
              fill={`url(#gradient-${color})`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
            />
          )}

          {/* Line */}
          {chartPath && (
            <motion.path
              d={chartPath}
              fill="none"
              stroke={`var(--cyber-${color})`}
              strokeWidth="0.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 1, ease: 'easeInOut' }}
              style={{ filter: `drop-shadow(0 0 8px var(--cyber-${color}))` }}
            />
          )}

          {/* Points */}
          {data.map((point, index) => {
            const values = data.map(d => d.value);
            const min = Math.min(...values);
            const max = Math.max(...values);
            const range = max - min || 1;

            const x = (index / (data.length - 1)) * 100;
            const y = 100 - ((point.value - min) / range) * 100;

            return (
              <motion.circle
                key={index}
                cx={x}
                cy={y}
                r="1.5"
                fill={`var(--cyber-${color})`}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: index * 0.05 }}
                className="cursor-pointer"
              />
            );
          })}
        </svg>

        {/* Grid Lines */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-0 right-0 h-px bg-cyber-border/30" />
          <div className="absolute top-1/4 left-0 right-0 h-px bg-cyber-border/20" />
          <div className="absolute top-2/4 left-0 right-0 h-px bg-cyber-border/20" />
          <div className="absolute top-3/4 left-0 right-0 h-px bg-cyber-border/20" />
          <div className="absolute bottom-0 left-0 right-0 h-px bg-cyber-border/30" />
        </div>
      </div>

      {/* Labels */}
      <div className="flex justify-between mt-4 text-xs text-gray-500 font-mono">
        {data.map((point, index) => (
          <div key={index} className="text-center flex-1">
            <div>{point.label}</div>
            {point.timestamp && (
              <div className="mt-1 opacity-70">{point.timestamp}</div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

/**
 * 迷你图表组件
 */
export function MiniChart({
  data,
  color = 'cyan',
  size = 60,
}: {
  data: number[];
  color?: 'cyan' | 'purple' | 'pink' | 'green';
  size?: number;
}) {
  const chartPath = useMemo(() => {
    if (data.length === 0) return '';

    const values = data;
    const min = Math.min(...values);
    const max = Math.max(...values);
    const range = max - min || 1;

    const points = values.map((value, index) => {
      const x = (index / (data.length - 1)) * 100;
      const y = 100 - ((value - min) / range) * 100;
      return `${x},${y}`;
    });

    return `M ${points.join(' L ')}`;
  }, [data]);

  return (
    <svg
      viewBox="0 0 100 100"
      preserveAspectRatio="none"
      className="w-full h-full"
      style={{ height: size }}
    >
      <path
        d={chartPath}
        fill="none"
        stroke={`var(--cyber-${color})`}
        strokeWidth="1"
        strokeLinecap="round"
        strokeLinejoin="round"
        style={{ filter: `drop-shadow(0 0 4px var(--cyber-${color}))` }}
      />
    </svg>
  );
}
