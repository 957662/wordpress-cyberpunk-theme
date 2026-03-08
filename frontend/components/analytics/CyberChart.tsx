'use client';

/**
 * Cyber Chart Component
 * 赛博朋克风格的数据可视化组件
 * 使用 Recharts 库
 */

import { useMemo } from 'react';
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { cn } from '@/lib/utils';

export interface ChartData {
  name: string;
  value: number;
  [key: string]: any;
}

interface CyberChartProps {
  data: ChartData[];
  type: 'line' | 'area' | 'bar' | 'pie';
  dataKey?: string;
  xAxisKey?: string;
  color?: string;
  colors?: string[];
  title?: string;
  subtitle?: string;
  height?: number;
  showGrid?: boolean;
  showTooltip?: boolean;
  showLegend?: boolean;
  curve?: 'monotone' | 'linear' | 'step' | 'stepBefore' | 'stepAfter';
  className?: string;
  animation?: boolean;
}

const defaultColors = [
  '#00f0ff', // cyber-cyan
  '#9d00ff', // cyber-purple
  '#ff0080', // cyber-pink
  '#00ff88', // cyber-green
  '#f0ff00', // cyber-yellow
  '#ff6b00', // cyber-orange
];

export function CyberChart({
  data,
  type,
  dataKey = 'value',
  xAxisKey = 'name',
  color = '#00f0ff',
  colors = defaultColors,
  title,
  subtitle,
  height = 300,
  showGrid = true,
  showTooltip = true,
  showLegend = true,
  curve = 'monotone',
  className,
  animation = true,
}: CyberChartProps) {
  const chartColors = useMemo(() => colors, [colors]);

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (!active || !payload || !payload.length) return null;

    return (
      <div className="cyber-card p-3 border border-cyber-border bg-cyber-dark/95 backdrop-blur-sm">
        <p className="text-sm text-gray-400 mb-1">{label}</p>
        {payload.map((entry: any, index: number) => (
          <p key={index} className="text-sm" style={{ color: entry.color }}>
            {entry.name}: {entry.value}
          </p>
        ))}
      </div>
    );
  };

  const renderChart = () => {
    const commonProps = {
      data,
      height,
    };

    const axisProps = {
      stroke: 'rgba(255, 255, 255, 0.1)',
      style: { fontSize: '12px', fill: '#9ca3af' },
    };

    const gridProps = {
      stroke: 'rgba(255, 255, 255, 0.05)',
      strokeDasharray: '3 3',
    };

    switch (type) {
      case 'line':
        return (
          <LineChart {...commonProps}>
            {showGrid && <CartesianGrid {...gridProps} />}
            <XAxis dataKey={xAxisKey} {...axisProps} />
            <YAxis {...axisProps} />
            {showTooltip && <Tooltip content={<CustomTooltip />} />}
            {showLegend && <Legend />}
            <Line
              type={curve}
              dataKey={dataKey}
              stroke={color}
              strokeWidth={2}
              dot={{ fill: color, r: 4 }}
              activeDot={{ r: 6, stroke: color, strokeWidth: 2 }}
              animationDuration={1000}
              animationBegin={0}
              isAnimationActive={animation}
            />
          </LineChart>
        );

      case 'area':
        return (
          <AreaChart {...commonProps}>
            {showGrid && <CartesianGrid {...gridProps} />}
            <XAxis dataKey={xAxisKey} {...axisProps} />
            <YAxis {...axisProps} />
            {showTooltip && <Tooltip content={<CustomTooltip />} />}
            {showLegend && <Legend />}
            <defs>
              <linearGradient id={`gradient-${color}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={color} stopOpacity={0.3} />
                <stop offset="95%" stopColor={color} stopOpacity={0} />
              </linearGradient>
            </defs>
            <Area
              type={curve}
              dataKey={dataKey}
              stroke={color}
              strokeWidth={2}
              fill={`url(#gradient-${color})`}
              animationDuration={1000}
              animationBegin={0}
              isAnimationActive={animation}
            />
          </AreaChart>
        );

      case 'bar':
        return (
          <BarChart {...commonProps}>
            {showGrid && <CartesianGrid {...gridProps} />}
            <XAxis dataKey={xAxisKey} {...axisProps} />
            <YAxis {...axisProps} />
            {showTooltip && <Tooltip content={<CustomTooltip />} />}
            {showLegend && <Legend />}
            <Bar
              dataKey={dataKey}
              fill={color}
              radius={[4, 4, 0, 0]}
              animationDuration={1000}
              animationBegin={0}
              isAnimationActive={animation}
            />
          </BarChart>
        );

      case 'pie':
        return (
          <PieChart {...commonProps}>
            {showTooltip && <Tooltip content={<CustomTooltip />} />}
            {showLegend && <Legend />}
            <Pie
              data={data}
              dataKey={dataKey}
              nameKey={xAxisKey}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={100}
              paddingAngle={2}
              animationDuration={1000}
              animationBegin={0}
              isAnimationActive={animation}
              label={({ name, percent }: any) => `${name} ${(percent * 100).toFixed(0)}%`}
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={chartColors[index % chartColors.length]} />
              ))}
            </Pie>
          </PieChart>
        );

      default:
        return null;
    }
  };

  return (
    <div className={cn('cyber-card p-6', className)}>
      {(title || subtitle) && (
        <div className="mb-4">
          {title && <h3 className="text-lg font-semibold text-white">{title}</h3>}
          {subtitle && <p className="text-sm text-gray-400 mt-1">{subtitle}</p>}
        </div>
      )}
      <ResponsiveContainer width="100%" height={height}>
        {renderChart()}
      </ResponsiveContainer>
    </div>
  );
}

export default CyberChart;
