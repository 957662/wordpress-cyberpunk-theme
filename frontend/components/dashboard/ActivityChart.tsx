/**
 * ActivityChart - 活动图表组件
 * 显示用户活动数据的可视化图表
 */

'use client';

import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

export interface ActivityData {
  date: string;
  value: number;
  label?: string;
}

interface ActivityChartProps {
  data: ActivityData[];
  color?: 'cyan' | 'purple' | 'pink' | 'green' | 'yellow';
  height?: number;
  showArea?: boolean;
  showDots?: boolean;
  showGrid?: boolean;
  showTooltip?: boolean;
  smooth?: boolean;
  className?: string;
}

const colorStyles = {
  cyan: {
    primary: '#00f0ff',
    secondary: 'rgba(0, 240, 255, 0.1)',
    gradient: 'rgba(0, 240, 255, 0.3)',
  },
  purple: {
    primary: '#9d00ff',
    secondary: 'rgba(157, 0, 255, 0.1)',
    gradient: 'rgba(157, 0, 255, 0.3)',
  },
  pink: {
    primary: '#ff0080',
    secondary: 'rgba(255, 0, 128, 0.1)',
    gradient: 'rgba(255, 0, 128, 0.3)',
  },
  green: {
    primary: '#00ff88',
    secondary: 'rgba(0, 255, 136, 0.1)',
    gradient: 'rgba(0, 255, 136, 0.3)',
  },
  yellow: {
    primary: '#f0ff00',
    secondary: 'rgba(240, 255, 0, 0.1)',
    gradient: 'rgba(240, 255, 0, 0.3)',
  },
};

export function ActivityChart({
  data,
  color = 'cyan',
  height = 200,
  showArea = true,
  showDots = true,
  showGrid = true,
  showTooltip = true,
  smooth = true,
  className,
}: ActivityChartProps) {
  const styles = colorStyles[color];

  // 计算图表参数
  const { points, areaPath, linePath, maxValue, minValue } = useMemo(() => {
    if (!data || data.length === 0) {
      return { points: [], areaPath: '', linePath: '', maxValue: 0, minValue: 0 };
    }

    const padding = { top: 20, right: 20, bottom: 30, left: 40 };
    const chartWidth = 800 - padding.left - padding.right;
    const chartHeight = height - padding.top - padding.bottom;

    const values = data.map((d) => d.value);
    const maxVal = Math.max(...values);
    const minVal = Math.min(...values);
    const range = maxVal - minVal || 1;

    // 生成点坐标
    const points = data.map((d, i) => {
      const x = padding.left + (i / (data.length - 1)) * chartWidth;
      const y = padding.top + chartHeight - ((d.value - minVal) / range) * chartHeight;
      return { x, y, value: d.value, date: d.date, label: d.label };
    });

    // 生成平滑曲线路径
    let linePath = '';
    if (smooth && points.length > 1) {
      linePath = points.reduce((path, point, i) => {
        if (i === 0) {
          return `M ${point.x} ${point.y}`;
        }

        const prev = points[i - 1];
        const cp1x = prev.x + (point.x - prev.x) / 3;
        const cp1y = prev.y;
        const cp2x = point.x - (point.x - prev.x) / 3;
        const cp2y = point.y;

        return `${path} C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${point.x} ${point.y}`;
      }, '');
    } else {
      linePath = points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ');
    }

    // 生成区域路径
    const areaPath = `${linePath} L ${points[points.length - 1].x} ${height - padding.bottom} L ${points[0].x} ${height - padding.bottom} Z`;

    return {
      points,
      areaPath,
      linePath,
      maxValue: maxVal,
      minValue: minVal,
    };
  }, [data, height, smooth]);

  // 生成网格线
  const gridLines = useMemo(() => {
    if (!showGrid) return [];

    const lines = [];
    const horizontalLines = 5;

    for (let i = 0; i <= horizontalLines; i++) {
      const y = 20 + (i / horizontalLines) * (height - 50);
      lines.push(
        <line
          key={`grid-${i}`}
          x1="40"
          y1={y}
          x2="780"
          y2={y}
          stroke="rgba(255, 255, 255, 0.05)"
          strokeWidth="1"
        />
      );
    }

    return lines;
  }, [height, showGrid]);

  if (!data || data.length === 0) {
    return (
      <div
        className={cn(
          'flex items-center justify-center bg-cyber-card rounded-lg border border-cyber-border',
          className
        )}
        style={{ height }}
      >
        <p className="text-gray-500 text-sm">暂无数据</p>
      </div>
    );
  }

  return (
    <div className={cn('relative', className)}>
      <svg
        width="100%"
        height={height}
        viewBox="0 0 800 200"
        className="overflow-visible"
      >
        <defs>
          <linearGradient id={`gradient-${color}`} x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor={styles.primary} stopOpacity="0.3" />
            <stop offset="100%" stopColor={styles.primary} stopOpacity="0" />
          </linearGradient>
          <filter id={`glow-${color}`}>
            <feGaussianBlur stdDeviation="3" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* 网格 */}
        {gridLines}

        {/* 区域填充 */}
        {showArea && (
          <motion.path
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 1 }}
            transition={{ duration: 0.8, ease: 'easeInOut' }}
            d={areaPath}
            fill={`url(#gradient-${color})`}
            className="opacity-50"
          />
        )}

        {/* 线条 */}
        <motion.path
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 0.8, ease: 'easeInOut', delay: 0.2 }}
          d={linePath}
          fill="none"
          stroke={styles.primary}
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          filter={`url(#glow-${color})`}
          className="drop-shadow-lg"
        />

        {/* 数据点 */}
        {showDots &&
          points.map((point, index) => (
            <g key={`point-${index}`}>
              <motion.circle
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.3, delay: 0.5 + index * 0.05 }}
                cx={point.x}
                cy={point.y}
                r="4"
                fill={styles.primary}
                className="cursor-pointer hover:r-6 transition-all"
              >
                {showTooltip && (
                  <title>
                    {point.label || point.date}: {point.value}
                  </title>
                )}
              </motion.circle>
            </g>
          ))}

        {/* X轴标签 */}
        {points.map((point, index) => {
          // 只显示部分标签以避免重叠
          const showLabel = index === 0 || index === points.length - 1 || index % Math.ceil(points.length / 6) === 0;

          if (!showLabel) return null;

          return (
            <text
              key={`label-${index}`}
              x={point.x}
              y={height - 8}
              textAnchor="middle"
              className="text-xs fill-gray-500"
            >
              {point.label || new Date(point.date).toLocaleDateString('zh-CN', { month: 'short', day: 'numeric' })}
            </text>
          );
        })}
      </svg>

      {/* Y轴标签 */}
      <div className="absolute left-0 top-0 bottom-8 flex flex-col justify-between text-xs text-gray-500 py-5">
        <span>{maxValue}</span>
        <span>{Math.round((maxValue + minValue) / 2)}</span>
        <span>{minValue}</span>
      </div>
    </div>
  );
}

export default ActivityChart;
