'use client';

/**
 * Data Chart Component
 * 数据可视化图表组件，支持多种图表类型和交互
 */

import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown, BarChart3, PieChart, LineChart } from 'lucide-react';
import { cn } from '@/lib/utils';

// Types
export type ChartType = 'line' | 'bar' | 'pie' | 'area' | 'scatter' | 'radar';

export interface ChartData {
  label: string;
  value: number;
  color?: string;
}

export interface ChartSeries {
  name: string;
  data: ChartData[];
  color?: string;
}

interface DataChartProps {
  /**
   * 图表类型
   */
  type: ChartType;
  /**
   * 数据
   */
  data: ChartData[] | ChartSeries[];
  /**
   * 标题
   */
  title?: string;
  /**
   * 宽度
   */
  width?: number | string;
  /**
   * 高度
   */
  height?: number | string;
  /**
   * 是否显示图例
   */
  showLegend?: boolean;
  /**
   * 是否显示工具提示
   */
  showTooltip?: boolean;
  /**
   * 是否显示数据标签
   */
  showLabels?: boolean;
  /**
   * 动画延迟
   */
  animationDelay?: number;
  /**
   * 自定义样式
   */
  className?: string;
  /**
   * 颜色主题
   */
  colorScheme?: 'cyan' | 'purple' | 'green' | 'orange' | 'rainbow';
}

// 颜色主题
const COLOR_SCHEMES = {
  cyan: ['#00f0ff', '#00a8cc', '#006080', '#003040', '#001820'],
  purple: ['#9d00ff', '#7700cc', '#550099', '#330066', '#110033'],
  green: ['#00ff88', '#00cc66', '#009944', '#006622', '#003311'],
  orange: ['#ff8800', '#cc6600', '#994400', '#662200', '#331100'],
  rainbow: ['#ff0080', '#00f0ff', '#f0ff00', '#9d00ff', '#00ff88'],
};

// 线性图表
const LineChartComponent: React.FC<{
  data: ChartData[];
  colorScheme: keyof typeof COLOR_SCHEMES;
  height: number | string;
}> = ({ data, colorScheme, height }) => {
  const maxValue = Math.max(...data.map(d => d.value));
  const colors = COLOR_SCHEMES[colorScheme];

  // 生成 SVG 路径
  const pathD = data
    .map((point, i) => {
      const x = (i / (data.length - 1)) * 100;
      const y = 100 - (point.value / maxValue) * 80;
      return `${i === 0 ? 'M' : 'L'} ${x},${y}`;
    })
    .join(' ');

  // 生成填充区域
  const areaD = `${pathD} L 100,100 L 0,100 Z`;

  return (
    <svg viewBox="0 0 100 100" preserveAspectRatio="none" style={{ height }}>
      {/* 渐变定义 */}
      <defs>
        <linearGradient id="lineGradient" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor={colors[0]} stopOpacity="0.3" />
          <stop offset="100%" stopColor={colors[0]} stopOpacity="0" />
        </linearGradient>
      </defs>

      {/* 填充区域 */}
      <path
        d={areaD}
        fill="url(#lineGradient)"
        className="opacity-50"
      />

      {/* 线条 */}
      <motion.path
        d={pathD}
        fill="none"
        stroke={colors[0]}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 1.5, ease: 'easeInOut' }}
      />

      {/* 数据点 */}
      {data.map((point, i) => {
        const x = (i / (data.length - 1)) * 100;
        const y = 100 - (point.value / maxValue) * 80;
        return (
          <motion.circle
            key={i}
            cx={x}
            cy={y}
            r="3"
            fill={colors[0]}
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: i * 0.1, duration: 0.3 }}
            className="cursor-pointer hover:r-4 transition-all"
          />
        );
      })}
    </svg>
  );
};

// 柱状图
const BarChartComponent: React.FC<{
  data: ChartData[];
  colorScheme: keyof typeof COLOR_SCHEMES;
  height: number | string;
}> = ({ data, colorScheme, height }) => {
  const maxValue = Math.max(...data.map(d => d.value));
  const colors = COLOR_SCHEMES[colorScheme];

  return (
    <div className="flex items-end justify-between gap-2" style={{ height }}>
      {data.map((item, i) => {
        const barHeight = (item.value / maxValue) * 100;
        return (
          <motion.div
            key={i}
            className="flex-1 flex flex-col items-center gap-2 group"
            initial={{ height: 0 }}
            animate={{ height: '100%' }}
            transition={{ delay: i * 0.1, duration: 0.5 }}
          >
            <motion.div
              className="w-full rounded-t-lg relative group-hover:opacity-80 transition-opacity"
              style={{
                height: `${barHeight}%`,
                background: `linear-gradient(to top, ${colors[0]}, ${colors[1]})`,
              }}
              initial={{ height: 0 }}
              animate={{ height: `${barHeight}%` }}
              transition={{ delay: i * 0.1, duration: 0.5 }}
            >
              {/* 工具提示 */}
              <div className="absolute -top-8 left-1/2 -translate-x-1/2 px-2 py-1 bg-black/80 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                {item.value}
              </div>
            </motion.div>
            <span className="text-xs text-gray-400 truncate w-full text-center">
              {item.label}
            </span>
          </motion.div>
        );
      })}
    </div>
  );
};

// 饼图
const PieChartComponent: React.FC<{
  data: ChartData[];
  colorScheme: keyof typeof COLOR_SCHEMES;
  height: number | string;
}> = ({ data, colorScheme, height }) => {
  const total = data.reduce((sum, item) => sum + item.value, 0);
  const colors = COLOR_SCHEMES[colorScheme];

  // 计算每个扇形的路径
  let currentAngle = 0;
  const slices = data.map((item, i) => {
    const percentage = item.value / total;
    const angle = percentage * 360;
    const startAngle = currentAngle;
    const endAngle = currentAngle + angle;

    // 转换为弧度
    const startRad = (startAngle - 90) * (Math.PI / 180);
    const endRad = (endAngle - 90) * (Math.PI / 180);

    // 计算坐标
    const x1 = 50 + 50 * Math.cos(startRad);
    const y1 = 50 + 50 * Math.sin(startRad);
    const x2 = 50 + 50 * Math.cos(endRad);
    const y2 = 50 + 50 * Math.sin(endRad);

    // SVG 路径
    const largeArcFlag = angle > 180 ? 1 : 0;
    const pathData = `M 50 50 L ${x1} ${y1} A 50 50 0 ${largeArcFlag} 1 ${x2} ${y2} Z`;

    currentAngle += angle;

    return {
      path: pathData,
      color: item.color || colors[i % colors.length],
      percentage,
      label: item.label,
      value: item.value,
    };
  });

  return (
    <div className="flex items-center gap-6" style={{ height }}>
      <svg viewBox="0 0 100 100" className="w-32 h-32 flex-shrink-0">
        {slices.map((slice, i) => (
          <motion.path
            key={i}
            d={slice.path}
            fill={slice.color}
            stroke="rgba(0,0,0,0.5)"
            strokeWidth="0.5"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: i * 0.1, duration: 0.3 }}
            className="hover:opacity-80 transition-opacity cursor-pointer"
          >
            <title>{slice.label}: {slice.value} ({(slice.percentage * 100).toFixed(1)}%)</title>
          </motion.path>
        ))}
      </svg>

      {/* 图例 */}
      <div className="flex-1 space-y-2">
        {slices.map((slice, i) => (
          <div key={i} className="flex items-center gap-2">
            <div
              className="w-3 h-3 rounded-full flex-shrink-0"
              style={{ backgroundColor: slice.color }}
            />
            <span className="text-sm text-gray-400">{slice.label}</span>
            <span className="text-sm text-white ml-auto">
              {(slice.percentage * 100).toFixed(1)}%
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

// 统计卡片
const StatsCard: React.FC<{
  title: string;
  value: number | string;
  change?: number;
  icon?: React.ReactNode;
  color?: string;
}> = ({ title, value, change, icon, color = '#00f0ff' }) => {
  const isPositive = change && change > 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-black/50 backdrop-blur-xl rounded-2xl border border-white/10 p-6 relative overflow-hidden"
    >
      {/* 发光效果 */}
      <div
        className="absolute top-0 right-0 w-32 h-32 opacity-10"
        style={{
          background: `radial-gradient(circle at top right, ${color}, transparent)`,
        }}
      />

      <div className="relative">
        <div className="flex items-start justify-between mb-4">
          <div className="p-2 rounded-lg" style={{ backgroundColor: `${color}20` }}>
            {icon || <TrendingUp className="w-5 h-5" style={{ color }} />}
          </div>
          {change !== undefined && (
            <div className={cn(
              'flex items-center gap-1 text-sm',
              isPositive ? 'text-green-400' : 'text-red-400'
            )}>
              {isPositive ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
              <span>{Math.abs(change)}%</span>
            </div>
          )}
        </div>

        <h3 className="text-gray-400 text-sm mb-1">{title}</h3>
        <p className="text-3xl font-bold text-white">{value}</p>
      </div>
    </motion.div>
  );
};

export const DataChart: React.FC<DataChartProps> = ({
  type,
  data,
  title,
  width = '100%',
  height = 300,
  showLegend = true,
  showTooltip = true,
  showLabels = true,
  animationDelay = 0,
  className,
  colorScheme = 'cyan',
}) => {
  const chartData = useMemo(() => {
    if (Array.isArray(data) && data.length > 0) {
      if ('name' in data[0]) {
        return data as ChartSeries[];
      }
      return [{ name: 'Series 1', data: data as ChartData[] }];
    }
    return [];
  }, [data]);

  const renderChart = () => {
    const seriesData = chartData[0]?.data || [];

    switch (type) {
      case 'line':
        return (
          <LineChartComponent
            data={seriesData}
            colorScheme={colorScheme}
            height={height}
          />
        );

      case 'bar':
        return (
          <BarChartComponent
            data={seriesData}
            colorScheme={colorScheme}
            height={height}
          />
        );

      case 'pie':
        return (
          <PieChartComponent
            data={seriesData}
            colorScheme={colorScheme}
            height={height}
          />
        );

      default:
        return <div className="text-gray-500">暂不支持该图表类型</div>;
    }
  };

  return (
    <div
      className={cn('bg-black/50 backdrop-blur-xl rounded-2xl border border-white/10 p-6', className)}
      style={{ width }}
    >
      {title && (
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-white">{title}</h3>
          <div className="flex gap-2">
            <button className="p-2 hover:bg-white/10 rounded-lg transition-colors">
              <BarChart3 className="w-4 h-4 text-gray-400" />
            </button>
            <button className="p-2 hover:bg-white/10 rounded-lg transition-colors">
              <LineChart className="w-4 h-4 text-gray-400" />
            </button>
            <button className="p-2 hover:bg-white/10 rounded-lg transition-colors">
              <PieChart className="w-4 h-4 text-gray-400" />
            </button>
          </div>
        </div>
      )}

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: animationDelay }}
      >
        {renderChart()}
      </motion.div>
    </div>
  );
};

// 导出统计卡片
export const StatsGrid: React.FC<{
  stats: Array<{
    title: string;
    value: number | string;
    change?: number;
    icon?: React.ReactNode;
    color?: string;
  }>;
  className?: string;
}> = ({ stats, className }) => {
  return (
    <div className={cn('grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4', className)}>
      {stats.map((stat, i) => (
        <StatsCard key={i} {...stat} />
      ))}
    </div>
  );
};

export default DataChart;
