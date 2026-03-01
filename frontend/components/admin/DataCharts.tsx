'use client';

import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

/**
 * DataCharts - 数据可视化图表组件库
 * 用于管理后台展示统计数据和趋势
 */

export interface ChartDataPoint {
  label: string;
  value: number;
  color?: string;
}

export interface TimeSeriesData {
  date: string;
  value: number;
  label?: string;
}

// ==================== 柱状图组件 ====================

export interface BarChartProps {
  data: ChartDataPoint[];
  title?: string;
  height?: number;
  showValues?: boolean;
  color?: string;
  className?: string;
  orientation?: 'vertical' | 'horizontal';
  animated?: boolean;
  maxValue?: number;
}

export const BarChart: React.FC<BarChartProps> = ({
  data,
  title,
  height = 200,
  showValues = true,
  color = '#00f0ff',
  className,
  orientation = 'vertical',
  animated = true,
  maxValue,
}) => {
  const maxVal = maxValue || Math.max(...data.map(d => d.value));

  return (
    <div className={cn('w-full', className)}>
      {title && (
        <h3 className="text-lg font-semibold text-cyan-400 mb-4">{title}</h3>
      )}
      <div
        className={cn(
          'flex gap-2',
          orientation === 'vertical' ? 'items-end' : 'flex-col'
        )}
        style={{ height: orientation === 'vertical' ? `${height}px` : 'auto' }}
      >
        {data.map((item, index) => {
          const percentage = (item.value / maxVal) * 100;
          const itemColor = item.color || color;

          return (
            <motion.div
              key={item.label}
              className={cn(
                'relative flex-shrink-0 rounded',
                orientation === 'vertical' ? 'w-full' : 'w-full'
              )}
              style={{
                background: `linear-gradient(to top, ${itemColor}40, ${itemColor}20)`,
                border: `1px solid ${itemColor}60`,
                ...(orientation === 'vertical'
                  ? { height: `${percentage}%` }
                  : { width: `${percentage}%`, minHeight: '24px' }),
              }}
              initial={animated ? { height: 0, width: 0 } : {}}
              animate={
                orientation === 'vertical'
                  ? { height: `${percentage}%` }
                  : { width: `${percentage}%` }
              }
              transition={{
                duration: 0.6,
                delay: index * 0.05,
                ease: 'easeOut',
              }}
            >
              {showValues && (
                <span
                  className={cn(
                    'absolute text-xs font-medium',
                    orientation === 'vertical'
                      ? '-top-5 left-1/2 -translate-x-1/2'
                      : 'right-2 top-1/2 -translate-y-1/2'
                  )}
                  style={{ color: itemColor }}
                >
                  {item.value}
                </span>
              )}
              <span
                className={cn(
                  'absolute text-xs text-gray-400',
                  orientation === 'vertical'
                    ? '-bottom-5 left-1/2 -translate-x-1/2 whitespace-nowrap'
                    : 'left-2 top-1/2 -translate-y-1/2'
                )}
              >
                {item.label}
              </span>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};

// ==================== 折线图组件 ====================

export interface LineChartProps {
  data: TimeSeriesData[];
  title?: string;
  height?: number;
  color?: string;
  showDots?: boolean;
  showArea?: boolean;
  className?: string;
  animated?: boolean;
}

export const LineChart: React.FC<LineChartProps> = ({
  data,
  title,
  height = 200,
  color = '#00f0ff',
  showDots = true,
  showArea = true,
  className,
  animated = true,
}) => {
  const maxValue = Math.max(...data.map(d => d.value));
  const minValue = Math.min(...data.map(d => d.value));
  const range = maxValue - minValue || 1;

  // Generate SVG path
  const pathData = useMemo(() => {
    const points = data.map((point, index) => {
      const x = (index / (data.length - 1)) * 100;
      const y = 100 - ((point.value - minValue) / range) * 100;
      return `${x},${y}`;
    });

    return `M ${points.join(' L ')}`;
  }, [data, minValue, range]);

  const areaPath = useMemo(() => {
    return `${pathData} L 100,100 L 0,100 Z`;
  }, [pathData]);

  return (
    <div className={cn('w-full', className)}>
      {title && (
        <h3 className="text-lg font-semibold text-cyan-400 mb-4">{title}</h3>
      )}
      <div style={{ height: `${height}px` }} className="relative">
        <svg
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
          className="w-full h-full overflow-visible"
        >
          <defs>
            <linearGradient id={`gradient-${color}`} x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor={color} stopOpacity="0.3" />
              <stop offset="100%" stopColor={color} stopOpacity="0" />
            </linearGradient>
          </defs>

          {/* Area fill */}
          {showArea && (
            <motion.path
              d={areaPath}
              fill={`url(#gradient-${color})`}
              initial={animated ? { opacity: 0 } : {}}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8 }}
            />
          )}

          {/* Line */}
          <motion.path
            d={pathData}
            fill="none"
            stroke={color}
            strokeWidth="0.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            initial={animated ? { pathLength: 0 } : {}}
            animate={{ pathLength: 1 }}
            transition={{ duration: 1, ease: 'easeInOut' }}
          />

          {/* Dots */}
          {showDots &&
            data.map((point, index) => {
              const x = (index / (data.length - 1)) * 100;
              const y = 100 - ((point.value - minValue) / range) * 100;

              return (
                <motion.circle
                  key={point.date}
                  cx={x}
                  cy={y}
                  r="1.5"
                  fill={color}
                  initial={animated ? { scale: 0 } : {}}
                  animate={{ scale: 1 }}
                  transition={{ delay: index * 0.05, duration: 0.3 }}
                  style={{ transformBox: 'fill-box', transformOrigin: 'center' }}
                />
              );
            })}
        </svg>

        {/* X-axis labels */}
        <div className="absolute -bottom-6 left-0 right-0 flex justify-between text-xs text-gray-500">
          {data.map((point, index) => (
            <span
              key={point.date}
              className={cn(
                index % Math.ceil(data.length / 6) === 0 ? 'block' : 'hidden'
              )}
            >
              {point.label || new Date(point.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};

// ==================== 饼图组件 ====================

export interface PieChartProps {
  data: ChartDataPoint[];
  title?: string;
  size?: number;
  showLabels?: boolean;
  showLegend?: boolean;
  className?: string;
  animated?: boolean;
}

export const PieChart: React.FC<PieChartProps> = ({
  data,
  title,
  size = 200,
  showLabels = true,
  showLegend = true,
  className,
  animated = true,
}) => {
  const total = data.reduce((sum, item) => sum + item.value, 0);
  let currentAngle = -90;

  const slices = data.map((item) => {
    const percentage = (item.value / total) * 100;
    const angle = (item.value / total) * 360;
    const startAngle = currentAngle;
    const endAngle = currentAngle + angle;

    // Calculate SVG path for pie slice
    const x1 = 50 + 50 * Math.cos((startAngle * Math.PI) / 180);
    const y1 = 50 + 50 * Math.sin((startAngle * Math.PI) / 180);
    const x2 = 50 + 50 * Math.cos((endAngle * Math.PI) / 180);
    const y2 = 50 + 50 * Math.sin((endAngle * Math.PI) / 180);

    const largeArcFlag = angle > 180 ? 1 : 0;
    const pathData = `M 50,50 L ${x1},${y1} A 50,50 0 ${largeArcFlag},1 ${x2},${y2} Z`;

    currentAngle = endAngle;

    return {
      ...item,
      percentage,
      pathData,
    };
  });

  return (
    <div className={cn('flex flex-col items-center', className)}>
      {title && (
        <h3 className="text-lg font-semibold text-cyan-400 mb-4">{title}</h3>
      )}
      <div className="flex flex-col sm:flex-row items-center gap-6">
        {/* Pie Chart */}
        <div style={{ width: size, height: size }}>
          <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
            {slices.map((slice, index) => (
              <g key={slice.label}>
                <motion.path
                  d={slice.pathData}
                  fill={slice.color || `hsl(${(index * 360) / data.length}, 70%, 50%)`}
                  stroke="#0a0a0f"
                  strokeWidth="0.5"
                  initial={animated ? { scale: 0 } : {}}
                  animate={{ scale: 1 }}
                  transition={{ delay: index * 0.1, duration: 0.5 }}
                  style={{ transformBox: 'fill-box', transformOrigin: 'center' }}
                  className="hover:opacity-80 transition-opacity cursor-pointer"
                />
              </g>
            ))}
          </svg>
        </div>

        {/* Legend */}
        {showLegend && (
          <div className="flex flex-col gap-2">
            {slices.map((slice) => (
              <div key={slice.label} className="flex items-center gap-2">
                <div
                  className="w-3 h-3 rounded"
                  style={{ backgroundColor: slice.color }}
                />
                <span className="text-sm text-gray-300">{slice.label}</span>
                <span className="text-sm text-gray-500">
                  {slice.percentage.toFixed(1)}%
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

// ==================== 统计卡片组件 ====================

export interface StatCardProps {
  title: string;
  value: string | number;
  change?: number;
  changeType?: 'increase' | 'decrease';
  icon?: React.ReactNode;
  color?: 'cyan' | 'pink' | 'purple' | 'yellow' | 'green';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  onClick?: () => void;
}

const colorStyles = {
  cyan: {
    bg: 'from-cyan-500/10 to-cyan-500/5',
    border: 'border-cyan-500/30',
    text: 'text-cyan-400',
    glow: 'shadow-cyan-500/10',
  },
  pink: {
    bg: 'from-pink-500/10 to-pink-500/5',
    border: 'border-pink-500/30',
    text: 'text-pink-400',
    glow: 'shadow-pink-500/10',
  },
  purple: {
    bg: 'from-purple-500/10 to-purple-500/5',
    border: 'border-purple-500/30',
    text: 'text-purple-400',
    glow: 'shadow-purple-500/10',
  },
  yellow: {
    bg: 'from-yellow-500/10 to-yellow-500/5',
    border: 'border-yellow-500/30',
    text: 'text-yellow-400',
    glow: 'shadow-yellow-500/10',
  },
  green: {
    bg: 'from-green-500/10 to-green-500/5',
    border: 'border-green-500/30',
    text: 'text-green-400',
    glow: 'shadow-green-500/10',
  },
};

const sizeStyles = {
  sm: 'p-4',
  md: 'p-6',
  lg: 'p-8',
};

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  change,
  changeType = 'increase',
  icon,
  color = 'cyan',
  size = 'md',
  className,
  onClick,
}) => {
  const styles = colorStyles[color];

  return (
    <motion.div
      className={cn(
        'relative rounded-lg border backdrop-blur-md overflow-hidden',
        'bg-gradient-to-br',
        styles.bg,
        styles.border,
        styles.glow,
        sizeStyles[size],
        onClick && 'cursor-pointer hover:scale-[1.02] transition-transform',
        className
      )}
      whileHover={onClick ? { scale: 1.02 } : {}}
      onClick={onClick}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm text-gray-400 mb-1">{title}</p>
          <p className={cn('text-2xl font-bold', styles.text)}>{value}</p>
          {change !== undefined && (
            <div
              className={cn(
                'flex items-center gap-1 text-sm mt-2',
                changeType === 'increase' ? 'text-green-400' : 'text-red-400'
              )}
            >
              <span>{changeType === 'increase' ? '↑' : '↓'}</span>
              <span>{Math.abs(change)}%</span>
            </div>
          )}
        </div>
        {icon && (
          <div className={cn('text-3xl opacity-50', styles.text)}>{icon}</div>
        )}
      </div>

      {/* Decorative corner */}
      <div
        className={cn(
          'absolute top-2 right-2 w-8 h-8 border-t-2 border-r-2 opacity-20',
          styles.border
        )}
      />
    </motion.div>
  );
};

// ==================== 统计卡片网格组件 ====================

export interface StatsGridProps {
  stats: StatCardProps[];
  columns?: 2 | 3 | 4;
  className?: string;
}

export const StatsGrid: React.FC<StatsGridProps> = ({
  stats,
  columns = 4,
  className,
}) => {
  const gridCols = {
    2: 'grid-cols-1 md:grid-cols-2',
    3: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
    4: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4',
  };

  return (
    <div className={cn('grid gap-4', gridCols[columns], className)}>
      {stats.map((stat, index) => (
        <motion.div
          key={stat.title}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
        >
          <StatCard {...stat} />
        </motion.div>
      ))}
    </div>
  );
};

// ==================== 仪表板概览组件 ====================

export interface DashboardOverviewProps {
  stats: StatCardProps[];
  chartData?: TimeSeriesData[];
  title?: string;
  className?: string;
}

export const DashboardOverview: React.FC<DashboardOverviewProps> = ({
  stats,
  chartData,
  title = 'Dashboard Overview',
  className,
}) => {
  return (
    <div className={cn('space-y-6', className)}>
      <div>
        <h2 className="text-2xl font-bold text-white mb-2">{title}</h2>
        <p className="text-gray-400">Overview of your site performance</p>
      </div>

      <StatsGrid stats={stats} columns={4} />

      {chartData && chartData.length > 0 && (
        <div className="bg-gray-900/50 rounded-lg border border-cyan-500/20 p-6">
          <LineChart
            data={chartData}
            title="Visits Over Time"
            height={250}
            showArea
          />
        </div>
      )}
    </div>
  );
};

export default DataCharts;
