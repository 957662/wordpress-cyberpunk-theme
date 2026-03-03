'use client';

import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

export interface ChartDataPoint {
  label: string;
  value: number;
  color?: string;
}

export interface ActivityChartProps {
  data: ChartDataPoint[];
  type?: 'bar' | 'line' | 'area';
  color?: 'cyan' | 'purple' | 'pink' | 'green' | 'yellow' | 'gradient';
  showGrid?: boolean;
  showLabels?: boolean;
  showTooltip?: boolean;
  height?: number;
  className?: string;
  onDataPointClick?: (point: ChartDataPoint) => void;
}

const colorMap = {
  cyan: { primary: '#00f0ff', secondary: '#0099ff', gradient: ['rgba(0, 240, 255, 0.3)', 'rgba(0, 240, 255, 0)'] },
  purple: { primary: '#9d00ff', secondary: '#ff00ff', gradient: ['rgba(157, 0, 255, 0.3)', 'rgba(157, 0, 255, 0)'] },
  pink: { primary: '#ff0080', secondary: '#ff0040', gradient: ['rgba(255, 0, 128, 0.3)', 'rgba(255, 0, 128, 0)'] },
  green: { primary: '#00ff88', secondary: '#00cc66', gradient: ['rgba(0, 255, 136, 0.3)', 'rgba(0, 255, 136, 0)'] },
  yellow: { primary: '#ffff00', secondary: '#ffcc00', gradient: ['rgba(255, 255, 0, 0.3)', 'rgba(255, 255, 0, 0)'] },
  gradient: { primary: '#00f0ff', secondary: '#9d00ff', gradient: ['rgba(0, 240, 255, 0.3)', 'rgba(157, 0, 255, 0)'] }
};

export function ActivityChart({
  data,
  type = 'bar',
  color = 'cyan',
  showGrid = true,
  showLabels = true,
  showTooltip = true,
  height = 200,
  className,
  onDataPointClick
}: ActivityChartProps) {
  const colors = colorMap[color];
  const maxValue = useMemo(() => Math.max(...data.map(d => d.value)), [data]);

  const renderChart = () => {
    switch (type) {
      case 'bar':
        return (
          <div className="relative h-full flex items-end justify-between gap-2">
            {data.map((point, index) => {
              const heightPercent = (point.value / maxValue) * 100;
              const barColor = point.color || colors.primary;
              
              return (
                <motion.div
                  key={index}
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: `${heightPercent}%`, opacity: 1 }}
                  transition={{ delay: index * 0.05 }}
                  className="relative flex-1 group cursor-pointer"
                  onClick={() => onDataPointClick?.(point)}
                >
                  {/* 柱状图 */}
                  <div
                    className="absolute bottom-0 left-0 right-0 rounded-t-lg transition-all duration-300 group-hover:brightness-110"
                    style={{
                      height: `${heightPercent}%`,
                      background: `linear-gradient(to top, ${barColor}, ${barColor}80)`
                    }}
                  />
                  
                  {/* 标签 */}
                  {showLabels && (
                    <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-xs text-gray-400 whitespace-nowrap">
                      {point.label}
                    </div>
                  )}
                  
                  {/* Tooltip */}
                  {showTooltip && (
                    <div className="absolute -top-8 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                      <div className="px-2 py-1 bg-gray-800 text-white text-xs rounded whitespace-nowrap">
                        {point.value}
                      </div>
                    </div>
                  )}
                </motion.div>
              );
            })}
          </div>
        );

      case 'line':
        return (
          <div className="relative h-full">
            {/* 网格线 */}
            {showGrid && (
              <div className="absolute inset-0 flex flex-col justify-between pointer-events-none">
                {[0, 25, 50, 75, 100].map((percent) => (
                  <div key={percent} className="border-t border-gray-800 border-dashed" />
                ))}
              </div>
            )}
            
            {/* 折线 */}
            <svg className="absolute inset-0 w-full h-full" preserveAspectRatio="none">
              <defs>
                <linearGradient id={`gradient-${color}`} x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor={colors.primary} stopOpacity="0.3" />
                  <stop offset="100%" stopColor={colors.primary} stopOpacity="0" />
                </linearGradient>
              </defs>
              
              {/* 填充区域 */}
              <path
                d={`M 0 ${height} L 0 ${height - (data[0]?.value / maxValue) * height} ${data.map((point, i) => 
                  `L ${(i / (data.length - 1)) * 100}% ${height - (point.value / maxValue) * height}`
                ).join(' ')} L 100% ${height} Z`}
                fill={`url(#gradient-${color})`}
              />
              
              {/* 折线 */}
              <path
                d={`M 0 ${height - (data[0]?.value / maxValue) * height} ${data.map((point, i) => 
                  `L ${(i / (data.length - 1)) * 100}% ${height - (point.value / maxValue) * height}`
                ).join(' ')}`}
                stroke={colors.primary}
                strokeWidth="2"
                fill="none"
                className="drop-shadow-lg"
              />
              
              {/* 数据点 */}
              {data.map((point, i) => (
                <motion.circle
                  key={i}
                  cx={`${(i / (data.length - 1)) * 100}%`}
                  cy={height - (point.value / maxValue) * height}
                  r="4"
                  fill={colors.primary}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: i * 0.05 }}
                  className="cursor-pointer hover:r-6 transition-all"
                  onClick={() => onDataPointClick?.(point)}
                />
              ))}
            </svg>
            
            {/* X轴标签 */}
            {showLabels && (
              <div className="absolute -bottom-6 left-0 right-0 flex justify-between text-xs text-gray-400">
                {data.map((point, i) => (
                  <div key={i} className="flex-1 text-center">
                    {point.label}
                  </div>
                ))}
              </div>
            )}
          </div>
        );

      case 'area':
        return (
          <div className="relative h-full">
            <svg className="absolute inset-0 w-full h-full" preserveAspectRatio="none">
              <defs>
                <linearGradient id={`area-gradient-${color}`} x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor={colors.primary} stopOpacity="0.5" />
                  <stop offset="100%" stopColor={colors.primary} stopOpacity="0.1" />
                </linearGradient>
              </defs>
              
              {/* 填充区域 */}
              <path
                d={`M 0 ${height} L 0 ${height - (data[0]?.value / maxValue) * height} ${data.map((point, i) => 
                  `L ${(i / (data.length - 1)) * 100}% ${height - (point.value / maxValue) * height}`
                ).join(' ')} L 100% ${height} Z`}
                fill={`url(#area-gradient-${color})`}
                className="opacity-50"
              />
              
              {/* 边线 */}
              <path
                d={`M 0 ${height - (data[0]?.value / maxValue) * height} ${data.map((point, i) => 
                  `L ${(i / (data.length - 1)) * 100}% ${height - (point.value / maxValue) * height}`
                ).join(' ')}`}
                stroke={colors.primary}
                strokeWidth="2"
                fill="none"
              />
            </svg>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className={cn('relative', className)}>
      {/* 图表 */}
      <div style={{ height: `${height}px`, marginBottom: showLabels ? '24px' : '0' }}>
        {renderChart()}
      </div>
      
      {/* Y轴刻度 */}
      {showGrid && (
        <div className="absolute left-0 top-0 bottom-0 -ml-8 flex flex-col justify-between text-xs text-gray-500">
          <span>{maxValue}</span>
          <span>{Math.round(maxValue / 2)}</span>
          <span>0</span>
        </div>
      )}
    </div>
  );
}

// 迷你图表组件
export interface SparklineProps {
  data: number[];
  color?: 'cyan' | 'purple' | 'pink' | 'green';
  width?: number;
  height?: number;
  showArea?: boolean;
  className?: string;
}

export function Sparkline({
  data,
  color = 'cyan',
  width = 100,
  height = 30,
  showArea = true,
  className
}: SparklineProps) {
  const colors = colorMap[color];
  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = max - min || 1;

  const points = data.map((value, i) => ({
    x: (i / (data.length - 1)) * width,
    y: height - ((value - min) / range) * height
  }));

  const pathD = points.map((point, i) => 
    `${i === 0 ? 'M' : 'L'} ${point.x} ${point.y}`
  ).join(' ');

  const areaD = `${pathD} L ${width} ${height} L 0 ${height} Z`;

  return (
    <svg width={width} height={height} className={className}>
      <defs>
        <linearGradient id={`sparkline-gradient-${color}`} x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor={colors.primary} stopOpacity="0.3" />
          <stop offset="100%" stopColor={colors.primary} stopOpacity="0" />
        </linearGradient>
      </defs>
      
      {showArea && (
        <path
          d={areaD}
          fill={`url(#sparkline-gradient-${color})`}
        />
      )}
      
      <path
        d={pathD}
        stroke={colors.primary}
        strokeWidth="2"
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
