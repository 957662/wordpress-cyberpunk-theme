import React from 'react';
import { cn } from '@/lib/utils';

interface MiniChartProps {
  data: number[];
  type?: 'line' | 'bar';
  color?: string;
  height?: number;
  className?: string;
  showGradient?: boolean;
}

/**
 * MiniChart - 迷你图表组件
 * 用于显示小型趋势图
 */
export const MiniChart: React.FC<MiniChartProps> = ({
  data,
  type = 'line',
  color = '#06b6d4',
  height = 40,
  className,
  showGradient = true,
}) => {
  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;

  const points = data.map((value, index) => {
    const x = (index / (data.length - 1)) * 100;
    const y = 100 - ((value - min) / range) * 100;
    return `${x},${y}`;
  }).join(' ');

  if (type === 'bar') {
    const barWidth = 100 / data.length;

    return (
      <div
        className={cn('flex items-end space-x-1', className)}
        style={{ height: `${height}px` }}
      >
        {data.map((value, index) => {
          const height = ((value - min) / range) * 100;
          return (
            <div
              key={index}
              className="flex-1 rounded-sm transition-all hover:opacity-80"
              style={{
                height: `${height}%`,
                backgroundColor: color,
                opacity: 0.5 + (index / data.length) * 0.5,
              }}
            />
          );
        })}
      </div>
    );
  }

  return (
    <svg
      viewBox="0 0 100 100"
      preserveAspectRatio="none"
      className={cn('w-full', className)}
      style={{ height: `${height}px` }}
    >
      <defs>
        {showGradient && (
          <linearGradient id={`gradient-${color}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={color} stopOpacity="0.3" />
            <stop offset="100%" stopColor={color} stopOpacity="0" />
          </linearGradient>
        )}
      </defs>

      {showGradient && (
        <polygon
          points={`0,100 ${points} 100,100`}
          fill={`url(#gradient-${color})`}
        />
      )}

      <polyline
        points={points}
        fill="none"
        stroke={color}
        strokeWidth="2"
        vectorEffect="non-scaling-stroke"
      />
    </svg>
  );
};

export default MiniChart;
