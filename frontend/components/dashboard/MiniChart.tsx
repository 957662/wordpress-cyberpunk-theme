/**
 * MiniChart - 迷你图表组件
 * 用于显示小型的趋势图和统计数据
 */

'use client';

import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

export interface MiniChartProps {
  data: number[];
  color?: 'cyan' | 'purple' | 'pink' | 'green' | 'yellow';
  className?: string;
  height?: number;
  showArea?: boolean;
  showDots?: boolean;
  smooth?: boolean;
}

const colorMap = {
  cyan: {
    stroke: '#00f0ff',
    fill: 'rgba(0, 240, 255, 0.1)',
    gradient: ['rgba(0, 240, 255, 0.3)', 'rgba(0, 240, 255, 0)'],
  },
  purple: {
    stroke: '#9d00ff',
    fill: 'rgba(157, 0, 255, 0.1)',
    gradient: ['rgba(157, 0, 255, 0.3)', 'rgba(157, 0, 255, 0)'],
  },
  pink: {
    stroke: '#ff0080',
    fill: 'rgba(255, 0, 128, 0.1)',
    gradient: ['rgba(255, 0, 128, 0.3)', 'rgba(255, 0, 128, 0)'],
  },
  green: {
    stroke: '#00ff88',
    fill: 'rgba(0, 255, 136, 0.1)',
    gradient: ['rgba(0, 255, 136, 0.3)', 'rgba(0, 255, 136, 0)'],
  },
  yellow: {
    stroke: '#f0ff00',
    fill: 'rgba(240, 255, 0, 0.1)',
    gradient: ['rgba(240, 255, 0, 0.3)', 'rgba(240, 255, 0, 0)'],
  },
};

export function MiniChart({
  data,
  color = 'cyan',
  className,
  height = 60,
  showArea = true,
  showDots = false,
  smooth = true,
}: MiniChartProps) {
  const colors = colorMap[color];

  // 计算路径
  const { path, areaPath, points } = useMemo(() => {
    if (data.length === 0) return { path: '', areaPath: '', points: [] };

    const width = 100; // viewBox width
    const chartHeight = 100; // viewBox height
    const max = Math.max(...data);
    const min = Math.min(...data);
    const range = max - min || 1;

    const stepX = width / (data.length - 1);

    let pathD = '';
    let areaD = '';
    const calculatedPoints: Array<{ x: number; y: number }> = [];

    data.forEach((value, index) => {
      const x = index * stepX;
      const normalizedY = ((value - min) / range) * chartHeight;
      const y = chartHeight - normalizedY;

      calculatedPoints.push({ x, y });

      if (index === 0) {
        pathD += `M ${x} ${y}`;
        areaD += `M ${x} ${chartHeight} L ${x} ${y}`;
      } else if (smooth) {
        // 简单的平滑曲线
        const prevPoint = calculatedPoints[index - 1];
        const cp1x = prevPoint.x + stepX / 2;
        const cp1y = prevPoint.y;
        const cp2x = x - stepX / 2;
        const cp2y = y;

        pathD += ` C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${x} ${y}`;
        areaD += ` C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${x} ${y}`;
      } else {
        pathD += ` L ${x} ${y}`;
        areaD += ` L ${x} ${y}`;
      }

      if (index === data.length - 1) {
        areaD += ` L ${x} ${chartHeight} Z`;
      }
    });

    return { path: pathD, areaPath: areaD, points: calculatedPoints };
  }, [data, smooth]);

  // 计算趋势
  const trend = useMemo(() => {
    if (data.length < 2) return 'neutral';
    const first = data[0];
    const last = data[data.length - 1];
    const change = ((last - first) / first) * 100;

    if (change > 5) return 'up';
    if (change < -5) return 'down';
    return 'neutral';
  }, [data]);

  const trendColors = {
    up: 'text-cyber-green',
    down: 'text-cyber-pink',
    neutral: 'text-gray-400',
  };

  return (
    <div className={cn('relative', className)}>
      <svg
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
        style={{ height: `${height}px` }}
        className="overflow-visible"
      >
        <defs>
          <linearGradient id={`gradient-${color}`} x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor={colors.gradient[0]} />
            <stop offset="100%" stopColor={colors.gradient[1]} />
          </linearGradient>
        </defs>

        {/* 区域填充 */}
        {showArea && areaPath && (
          <motion.path
            d={areaPath}
            fill={`url(#gradient-${color})`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          />
        )}

        {/* 线条 */}
        {path && (
          <motion.path
            d={path}
            stroke={colors.stroke}
            strokeWidth="2"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 1 }}
            transition={{ duration: 0.8, ease: 'easeInOut' }}
            style={{
              filter: `drop-shadow(0 0 4px ${colors.stroke})`,
            }}
          />
        )}

        {/* 数据点 */}
        {showDots &&
          points.map((point, index) => (
            <motion.circle
              key={index}
              cx={point.x}
              cy={point.y}
              r="1.5"
              fill={colors.stroke}
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{
                duration: 0.3,
                delay: index * 0.05,
              }}
              style={{
                filter: `drop-shadow(0 0 2px ${colors.stroke})`,
              }}
            />
          ))}
      </svg>

      {/* 趋势指示器 */}
      <div className="absolute top-0 right-0">
        <motion.div
          initial={{ opacity: 0, x: 10 }}
          animate={{ opacity: 1, x: 0 }}
          className={cn('text-xs font-mono', trendColors[trend])}
        >
          {trend === 'up' && '↑'}
          {trend === 'down' && '↓'}
          {trend === 'neutral' && '→'}
        </motion.div>
      </div>
    </div>
  );
}

// 迷你柱状图
export interface MiniBarChartProps {
  data: number[];
  color?: 'cyan' | 'purple' | 'pink' | 'green';
  className?: string;
  height?: number;
}

export function MiniBarChart({
  data,
  color = 'cyan',
  className,
  height = 60,
}: MiniBarChartProps) {
  const colors = colorMap[color];

  const { max, bars } = useMemo(() => {
    const maxValue = Math.max(...data);
    const barWidth = 100 / data.length;
    const gap = Math.max(1, barWidth * 0.2);

    return {
      max: maxValue,
      bars: data.map((value, index) => ({
        height: (value / maxValue) * 100,
        x: index * barWidth,
        width: barWidth - gap,
      })),
    };
  }, [data]);

  return (
    <div className={cn('relative', className)}>
      <svg
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
        style={{ height: `${height}px` }}
      >
        {bars.map((bar, index) => (
          <motion.rect
            key={index}
            x={bar.x}
            y={100 - bar.height}
            width={bar.width}
            height={bar.height}
            fill={colors.stroke}
            rx="1"
            initial={{ height: 0, y: 100 }}
            animate={{ height: bar.height, y: 100 - bar.height }}
            transition={{
              duration: 0.5,
              delay: index * 0.05,
              ease: 'easeOut',
            }}
            style={{
              filter: `drop-shadow(0 0 2px ${colors.stroke})`,
            }}
          />
        ))}
      </svg>
    </div>
  );
}

export default MiniChart;
