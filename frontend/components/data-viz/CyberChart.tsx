/**
 * 赛博朋克风格图表组件
 */

'use client';

import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

export interface CyberChartProps {
  data: number[];
  labels?: string[];
  color?: 'cyan' | 'purple' | 'pink' | 'yellow' | 'green';
  height?: number;
  showGrid?: boolean;
  showTooltip?: boolean;
  className?: string;
}

export function CyberChart({
  data,
  labels,
  color = 'cyan',
  height = 200,
  showGrid = true,
  showTooltip = true,
  className,
}: CyberChartProps) {
  const colors = {
    cyan: '#00f0ff',
    purple: '#9d00ff',
    pink: '#ff0080',
    yellow: '#f0ff00',
    green: '#00ff88',
  };

  const gridColors = {
    cyan: 'rgba(0, 240, 255, 0.1)',
    purple: 'rgba(157, 0, 255, 0.1)',
    pink: 'rgba(255, 0, 128, 0.1)',
    yellow: 'rgba(240, 255, 0, 0.1)',
    green: 'rgba(0, 255, 136, 0.1)',
  };

  const maxValue = Math.max(...data);
  const minValue = Math.min(...data);
  const range = maxValue - minValue;

  return (
    <div className={cn('relative w-full', className)} style={{ height }}>
      {/* 网格线 */}
      {showGrid && (
        <svg className="absolute inset-0 w-full h-full" preserveAspectRatio="none">
          {[0, 25, 50, 75, 100].map((percent) => (
            <line
              key={percent}
              x1="0"
              y1={`${percent}%`}
              x2="100%"
              y2={`${percent}%`}
              stroke={gridColors[color]}
              strokeWidth="1"
              strokeDasharray="4 4"
            />
          ))}
        </svg>
      )}

      {/* 数据柱状图 */}
      <svg className="absolute inset-0 w-full h-full" preserveAspectRatio="none">
        {data.map((value, index) => {
          const x = (index / (data.length - 1)) * 100;
          const normalizedValue = range > 0 ? (value - minValue) / range : 0.5;
          const barHeight = normalizedValue * 80 + 10;
          const y = 100 - barHeight;

          return (
            <g key={index}>
              {/* 柱状 */}
              <motion.rect
                x={`${x - 100 / data.length / 2}%`}
                y={y}
                width={`${100 / data.length - 1}%`}
                height={barHeight}
                fill={colors[color]}
                opacity={0.6}
                initial={{ height: 0, y: 100 }}
                animate={{ height: barHeight, y }}
                transition={{ duration: 0.6, delay: index * 0.05 }}
              />

              {/* 顶部高亮 */}
              <motion.rect
                x={`${x - 100 / data.length / 2}%`}
                y={y}
                width={`${100 / data.length - 1}%`}
                height="2"
                fill={colors[color]}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3, delay: index * 0.05 + 0.3 }}
              />
            </g>
          );
        })}
      </svg>

      {/* 标签 */}
      {labels && (
        <div className="absolute bottom-0 left-0 right-0 flex justify-between px-2">
          {labels.map((label, index) => (
            <span
              key={index}
              className="text-xs text-gray-400 truncate"
              style={{ maxWidth: `${100 / labels.length}%` }}
            >
              {label}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}

export interface CyberLineChartProps {
  data: number[];
  labels?: string[];
  color?: 'cyan' | 'purple' | 'pink' | 'yellow' | 'green';
  height?: number;
  fill?: boolean;
  showPoints?: boolean;
  className?: string;
}

export function CyberLineChart({
  data,
  labels,
  color = 'cyan',
  height = 200,
  fill = true,
  showPoints = true,
  className,
}: CyberLineChartProps) {
  const colors = {
    cyan: '#00f0ff',
    purple: '#9d00ff',
    pink: '#ff0080',
    yellow: '#f0ff00',
    green: '#00ff88',
  };

  const fillColors = {
    cyan: 'rgba(0, 240, 255, 0.2)',
    purple: 'rgba(157, 0, 255, 0.2)',
    pink: 'rgba(255, 0, 128, 0.2)',
    yellow: 'rgba(240, 255, 0, 0.2)',
    green: 'rgba(0, 255, 136, 0.2)',
  };

  const maxValue = Math.max(...data);
  const minValue = Math.min(...data);
  const range = maxValue - minValue || 1;

  const points = data.map((value, index) => {
    const x = (index / (data.length - 1)) * 100;
    const normalizedValue = (value - minValue) / range;
    const y = 100 - normalizedValue * 80 - 10;
    return `${x},${y}`;
  }).join(' ');

  const fillPoints = `0,100 ${points} 100,100`;

  return (
    <div className={cn('relative w-full', className)} style={{ height }}>
      <svg className="absolute inset-0 w-full h-full" preserveAspectRatio="none">
        <defs>
          <linearGradient id={`gradient-${color}`} x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor={colors[color]} stopOpacity="0.3" />
            <stop offset="100%" stopColor={colors[color]} stopOpacity="0" />
          </linearGradient>
        </defs>

        {/* 填充区域 */}
        {fill && (
          <motion.polygon
            points={fillPoints}
            fill={`url(#gradient-${color})`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
          />
        )}

        {/* 线条 */}
        <motion.polyline
          points={points}
          fill="none"
          stroke={colors[color]}
          strokeWidth="2"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 1, ease: 'easeInOut' }}
          style={{ strokeDasharray: '1000', strokeDashoffset: '0' }}
        />

        {/* 数据点 */}
        {showPoints &&
          data.map((value, index) => {
            const x = (index / (data.length - 1)) * 100;
            const normalizedValue = (value - minValue) / range;
            const y = 100 - normalizedValue * 80 - 10;

            return (
              <motion.circle
                key={index}
                cx={`${x}%`}
                cy={`${y}%`}
                r="3"
                fill={colors[color]}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.3, delay: index * 0.05 + 0.5 }}
              />
            );
          })}
      </svg>

      {/* 标签 */}
      {labels && (
        <div className="absolute bottom-0 left-0 right-0 flex justify-between px-2">
          {labels.map((label, index) => (
            <span
              key={index}
              className="text-xs text-gray-400 truncate"
              style={{ maxWidth: `${100 / labels.length}%` }}
            >
              {label}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}

export interface CyberPieChartProps {
  data: { label: string; value: number; color?: string }[];
  size?: number;
  showLabels?: boolean;
  showPercentage?: boolean;
  className?: string;
}

export function CyberPieChart({
  data,
  size = 200,
  showLabels = true,
  showPercentage = true,
  className,
}: CyberPieChartProps) {
  const defaultColors = ['#00f0ff', '#9d00ff', '#ff0080', '#f0ff00', '#00ff88'];
  const total = data.reduce((sum, item) => sum + item.value, 0);

  let cumulativePercent = 0;

  const slices = data.map((item, index) => {
    const percent = item.value / total;
    const startPercent = cumulativePercent;
    cumulativePercent += percent;
    const endPercent = cumulativePercent;

    const startX = Math.cos(2 * Math.PI * startPercent - Math.PI / 2);
    const startY = Math.sin(2 * Math.PI * startPercent - Math.PI / 2);
    const endX = Math.cos(2 * Math.PI * endPercent - Math.PI / 2);
    const endY = Math.sin(2 * Math.PI * endPercent - Math.PI / 2);

    const largeArc = percent > 0.5 ? 1 : 0;

    return {
      ...item,
      color: item.color || defaultColors[index % defaultColors.length],
      percent,
      path: `M 0 0 L ${startX} ${startY} A 1 1 0 ${largeArc} 1 ${endX} ${endY} Z`,
    };
  });

  return (
    <div className={cn('relative inline-block', className)}>
      <svg width={size} height={size} viewBox="-1.2 -1.2 2.4 2.4" className="transform -rotate-90">
        {slices.map((slice, index) => (
          <motion.path
            key={index}
            d={slice.path}
            fill={slice.color}
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 0.8 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            whileHover={{ scale: 1.05, opacity: 1 }}
            className="cursor-pointer"
            style={{ transformOrigin: 'center' }}
          />
        ))}
      </svg>

      {/* 图例 */}
      {showLabels && (
        <div className="mt-4 space-y-2">
          {slices.map((slice, index) => (
            <div key={index} className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-2">
                <div
                  className="w-3 h-3 rounded"
                  style={{ backgroundColor: slice.color }}
                />
                <span className="text-gray-300">{slice.label}</span>
              </div>
              {showPercentage && (
                <span className="text-gray-400">
                  {(slice.percent * 100).toFixed(1)}%
                </span>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
