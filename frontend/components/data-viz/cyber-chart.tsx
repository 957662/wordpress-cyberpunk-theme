'use client';

import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

export interface CyberChartProps {
  data: number[];
  labels?: string[];
  className?: string;
  type?: 'line' | 'bar' | 'area';
  color?: 'cyan' | 'purple' | 'pink' | 'gradient';
  height?: number;
  showGrid?: boolean;
  showTooltip?: boolean;
  animate?: boolean;
}

export const CyberChart: React.FC<CyberChartProps> = ({
  data,
  labels = [],
  className,
  type = 'line',
  color = 'cyan',
  height = 300,
  showGrid = true,
  showTooltip = true,
  animate = true,
}) => {
  const colors = {
    cyan: {
      main: '#00f0ff',
      gradient: ['rgba(0, 240, 255, 0.8)', 'rgba(0, 240, 255, 0.1)'],
    },
    purple: {
      main: '#9d00ff',
      gradient: ['rgba(157, 0, 255, 0.8)', 'rgba(157, 0, 255, 0.1)'],
    },
    pink: {
      main: '#ff0080',
      gradient: ['rgba(255, 0, 128, 0.8)', 'rgba(255, 0, 128, 0.1)'],
    },
    gradient: {
      main: '#00f0ff',
      gradient: ['rgba(0, 240, 255, 0.8)', 'rgba(157, 0, 255, 0.5)', 'rgba(255, 0, 128, 0.1)'],
    },
  };

  const maxValue = Math.max(...data);
  const minValue = Math.min(...data);
  const range = maxValue - minValue || 1;

  const points = useMemo(() => {
    return data.map((value, index) => {
      const x = (index / (data.length - 1)) * 100;
      const y = ((value - minValue) / range) * 100;
      return { x, y, value };
    });
  }, [data, minValue, range]);

  const pathD = points
    .map((point, index) => {
      if (index === 0) return `M ${point.x} ${100 - point.y}`;
      return `L ${point.x} ${100 - point.y}`;
    })
    .join(' ');

  const areaPath = `${pathD} L 100 100 L 0 100 Z`;

  return (
    <div className={cn('relative w-full', className)} style={{ height }}>
      {/* 背景网格 */}
      {showGrid && (
        <svg className="absolute inset-0 h-full w-full" preserveAspectRatio="none">
          {[0, 25, 50, 75, 100].map((y) => (
            <line
              key={`grid-${y}`}
              x1="0"
              y1={`${y}%`}
              x2="100"
              y2={`${y}%`}
              stroke="rgba(255, 255, 255, 0.1)"
              strokeWidth="1"
              strokeDasharray="4 4"
            />
          ))}
          {data.map((_, index) => {
            const x = (index / (data.length - 1)) * 100;
            return (
              <line
                key={`grid-v-${index}`}
                x1={`${x}%`}
                y1="0"
                x2={`${x}%`}
                y2="100"
                stroke="rgba(255, 255, 255, 0.05)"
                strokeWidth="1"
              />
            );
          })}
        </svg>
      )}

      {/* 图表 */}
      <svg className="absolute inset-0 h-full w-full" preserveAspectRatio="none">
        <defs>
          <linearGradient id={`gradient-${color}`} x1="0%" y1="0%" x2="0%" y2="100%">
            {colors[color].gradient.map((stop, index) => (
              <stop
                key={index}
                offset={`${(index / (colors[color].gradient.length - 1)) * 100}%`}
                stopColor={stop}
              />
            ))}
          </linearGradient>
          <filter id={`glow-${color}`}>
            <feGaussianBlur stdDeviation="3" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* 区域填充 */}
        {(type === 'area' || type === 'line') && (
          <motion.path
            d={areaPath}
            fill={`url(#gradient-${color})`}
            initial={{ opacity: 0 }}
            animate={{ opacity: animate ? 1 : 0.5 }}
            transition={{ duration: 0.8 }}
          />
        )}

        {/* 线条 */}
        {(type === 'line' || type === 'area') && (
          <motion.path
            d={pathD}
            fill="none"
            stroke={colors[color].main}
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            filter={`url(#glow-${color})`}
            initial={{ pathLength: 0 }}
            animate={{ pathLength: animate ? 1 : 0.5 }}
            transition={{ duration: 1.5, ease: 'easeInOut' }}
          />
        )}

        {/* 柱状图 */}
        {type === 'bar' &&
          points.map((point, index) => (
            <motion.rect
              key={`bar-${index}`}
              x={`${point.x - 100 / data.length / 2}%`}
              y={`${100 - point.y}%`}
              width={`${100 / data.length - 1}%`}
              height={`${point.y}%`}
              fill={colors[color].main}
              filter={`url(#glow-${color})`}
              initial={{ height: 0, y: 100 }}
              animate={{ height: `${point.y}%`, y: `${100 - point.y}%` }}
              transition={{ duration: 0.5, delay: index * 0.05 }}
              rx="2"
            />
          ))}

        {/* 数据点 */}
        {(type === 'line' || type === 'area') &&
          points.map((point, index) => (
            <motion.circle
              key={`point-${index}`}
              cx={`${point.x}%`}
              cy={`${100 - point.y}%`}
              r="4"
              fill={colors[color].main}
              filter={`url(#glow-${color})`}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
              style={{ cursor: showTooltip ? 'pointer' : 'default' }}
            />
          ))}
      </svg>

      {/* X轴标签 */}
      {labels.length > 0 && (
        <div className="absolute bottom-0 left-0 right-0 flex justify-between px-2">
          {labels.map((label, index) => (
            <span
              key={`label-${index}`}
              className="text-xs text-cyber-cyan/70"
              style={{
                position: 'absolute',
                left: `${(index / (labels.length - 1)) * 100}%`,
                transform: 'translateX(-50%)',
              }}
            >
              {label}
            </span>
          ))}
        </div>
      )}

      {/* Y轴标签 */}
      <div className="absolute left-2 top-0 bottom-0 flex flex-col justify-between py-2">
        <span className="text-xs text-cyber-cyan/70">{maxValue.toFixed(1)}</span>
        <span className="text-xs text-cyber-cyan/70">{((maxValue + minValue) / 2).toFixed(1)}</span>
        <span className="text-xs text-cyber-cyan/70">{minValue.toFixed(1)}</span>
      </div>
    </div>
  );
};

export default CyberChart;
