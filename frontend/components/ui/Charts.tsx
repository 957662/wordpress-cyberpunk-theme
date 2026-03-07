'use client';

import React, { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

/**
 * Charts - 赛博朋克风格数据可视化组件
 *
 * 提供多种图表类型：
 * - Bar: 柱状图
 * - Line: 折线图
 * - Pie: 饼图
 * - Area: 面积图
 * - Progress: 进度条
 */

export type ChartType = 'bar' | 'line' | 'pie' | 'area' | 'progress';

export interface ChartData {
  label: string;
  value: number;
  color?: string;
}

export interface BaseChartProps {
  /** 图表数据 */
  data: ChartData[];
  /** 宽度 */
  width?: number | string;
  /** 高度 */
  height?: number | string;
  /** 自定义类名 */
  className?: string;
  /** 标题 */
  title?: string;
  /** 是否显示动画 */
  animated?: boolean;
  /** 动画延迟（毫秒） */
  animationDelay?: number;
}

/**
 * BarChart - 柱状图组件
 */
export interface BarChartProps extends BaseChartProps {
  /** 柱子宽度 */
  barWidth?: number;
  /** 柱子间距 */
  gap?: number;
  /** 是否水平显示 */
  horizontal?: boolean;
  /** 最大值（用于计算比例） */
  maxValue?: number;
}

export const BarChart: React.FC<BarChartProps> = ({
  data,
  width = '100%',
  height = 300,
  barWidth = 40,
  gap = 10,
  horizontal = false,
  maxValue,
  className,
  title,
  animated = true,
  animationDelay = 0,
}) => {
  const max = maxValue || Math.max(...data.map((d) => d.value));

  return (
    <div
      className={cn('cyber-chart p-4', className)}
      style={{ width, height }}
    >
      {title && (
        <h3 className="text-lg font-bold text-cyber-cyan mb-4">{title}</h3>
      )}
      <div
        className={cn(
          'flex',
          horizontal ? 'flex-col gap-2' : 'flex-row items-end justify-around gap-2'
        )}
      >
        {data.map((item, index) => {
          const percentage = (item.value / max) * 100;
          const color = item.color || 'cyan';
          const colorClass = {
            cyan: 'bg-cyber-cyan',
            purple: 'bg-cyber-purple',
            pink: 'bg-cyber-pink',
            green: 'bg-cyber-green',
            yellow: 'bg-cyber-yellow',
          }[color] || 'bg-cyber-cyan';

          return (
            <motion.div
              key={item.label}
              className={cn(
                'relative flex flex-col items-center',
                !horizontal && 'items-end'
              )}
              initial={animated ? { opacity: 0, scale: 0.8 } : false}
              animate={{ opacity: 1, scale: 1 }}
              transition={{
                delay: animationDelay + index * 0.1,
                duration: 0.5,
              }}
            >
              <div
                className={cn(
                  'relative group',
                  horizontal ? 'w-full' : ''
                )}
                style={
                  horizontal
                    ? { height: barWidth }
                    : { width: barWidth }
                }
              >
                <motion.div
                  className={cn(
                    'rounded-md',
                    colorClass,
                    'shadow-lg shadow-current/30',
                    'group-hover:shadow-lg group-hover:shadow-current/50',
                    'transition-shadow duration-300'
                  )}
                  initial={animated ? { [horizontal ? 'width' : 'height']: 0 } : false}
                  animate={{
                    [horizontal ? 'width' : 'height']: horizontal
                      ? `${percentage}%`
                      : `${percentage}%`,
                  }}
                  transition={{
                    delay: animationDelay + index * 0.1,
                    duration: 0.8,
                    ease: 'easeOut',
                  }}
                  style={
                    horizontal
                      ? { height: '100%' }
                      : { height: `${percentage}%` }
                  }
                />
                {/* Tooltip */}
                <div className="absolute -top-8 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity bg-cyber-dark border border-cyber-cyan text-cyber-cyan px-2 py-1 rounded text-xs whitespace-nowrap pointer-events-none">
                  {item.label}: {item.value}
                </div>
              </div>
              <span className="text-xs text-cyber-muted mt-2">{item.label}</span>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};

/**
 * LineChart - 折线图组件
 */
export interface LineChartProps extends BaseChartProps {
  /** 线条颜色 */
  lineColor?: string;
  /** 是否填充区域 */
  filled?: boolean;
  /** 数据点大小 */
  dotSize?: number;
}

export const LineChart: React.FC<LineChartProps> = ({
  data,
  width = '100%',
  height = 300,
  lineColor = 'cyan',
  filled = false,
  dotSize = 6,
  className,
  title,
  animated = true,
  animationDelay = 0,
}) => {
  const svgRef = useRef<SVGSVGElement>(null);
  const max = Math.max(...data.map((d) => d.value));

  const points = data.map((d, i) => ({
    x: (i / (data.length - 1)) * 100,
    y: 100 - (d.value / max) * 100,
  }));

  const pathD = points
    .map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`)
    .join(' ');

  const areaD = `${pathD} L 100 100 L 0 100 Z`;

  const colorMap = {
    cyan: '#00f0ff',
    purple: '#9d00ff',
    pink: '#ff0080',
    green: '#00ff88',
    yellow: '#f0ff00',
  };

  const color = colorMap[lineColor as keyof typeof colorMap] || lineColor;

  return (
    <div
      className={cn('cyber-chart p-4 relative', className)}
      style={{ width, height }}
    >
      {title && (
        <h3 className="text-lg font-bold text-cyber-cyan mb-4">{title}</h3>
      )}
      <svg
        ref={svgRef}
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
        className="w-full h-full"
      >
        {filled && (
          <motion.path
            d={areaD}
            fill={color}
            fillOpacity="0.2"
            initial={animated ? { opacity: 0 } : false}
            animate={{ opacity: 1 }}
            transition={{ delay: animationDelay, duration: 0.5 }}
          />
        )}
        <motion.path
          d={pathD}
          fill="none"
          stroke={color}
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          initial={animated ? { pathLength: 0 } : false}
          animate={{ pathLength: 1 }}
          transition={{
            delay: animationDelay,
            duration: 1,
            ease: 'easeInOut',
          }}
        />
        {points.map((p, i) => (
          <motion.circle
            key={i}
            cx={p.x}
            cy={p.y}
            r={dotSize / 10}
            fill={color}
            initial={animated ? { scale: 0 } : false}
            animate={{ scale: 1 }}
            transition={{
              delay: animationDelay + i * 0.1,
              duration: 0.3,
            }}
            className="hover:r-3 transition-all duration-300"
          />
        ))}
      </svg>
      {/* X轴标签 */}
      <div className="flex justify-between mt-2 text-xs text-cyber-muted">
        {data.map((d, i) => (
          <span key={i}>{d.label}</span>
        ))}
      </div>
    </div>
  );
};

/**
 * PieChart - 饼图组件
 */
export interface PieChartProps extends BaseChartProps {
  /** 内圆半径（用于制作环形图） */
  innerRadius?: number;
  /** 是否显示百分比 */
  showPercentage?: boolean;
}

export const PieChart: React.FC<PieChartProps> = ({
  data,
  width = '100%',
  height = 300,
  innerRadius = 0,
  showPercentage = true,
  className,
  title,
  animated = true,
  animationDelay = 0,
}) => {
  const total = data.reduce((sum, d) => sum + d.value, 0);
  let currentAngle = 0;

  const colorMap: Record<string, string> = {
    cyan: '#00f0ff',
    purple: '#9d00ff',
    pink: '#ff0080',
    green: '#00ff88',
    yellow: '#f0ff00',
  };

  const slices = data.map((item) => {
    const percentage = item.value / total;
    const angle = percentage * 360;
    const startAngle = currentAngle;
    const endAngle = currentAngle + angle;

    currentAngle += angle;

    // 计算路径
    const start = polarToCartesian(50, 50, 45, startAngle);
    const end = polarToCartesian(50, 50, 45, endAngle);
    const largeArcFlag = angle > 180 ? 1 : 0;

    const pathData = [
      `M 50 50`,
      `L ${start.x} ${start.y}`,
      `A 45 45 0 ${largeArcFlag} 1 ${end.x} ${end.y}`,
      'Z',
    ].join(' ');

    return {
      ...item,
      percentage,
      path: pathData,
      color: item.color ? colorMap[item.color] || item.color : colorMap.cyan,
    };
  });

  return (
    <div
      className={cn('cyber-chart p-4', className)}
      style={{ width, height }}
    >
      {title && (
        <h3 className="text-lg font-bold text-cyber-cyan mb-4">{title}</h3>
      )}
      <svg viewBox="0 0 100 100" className="w-full h-full">
        {slices.map((slice, i) => (
          <g key={i}>
            <motion.path
              d={slice.path}
              fill={slice.color}
              initial={animated ? { scale: 0, opacity: 0 } : false}
              animate={{ scale: 1, opacity: 1 }}
              transition={{
                delay: animationDelay + i * 0.1,
                duration: 0.5,
              }}
              transformOrigin="50 50"
              className="hover:opacity-80 transition-opacity cursor-pointer"
            />
            {showPercentage && slice.percentage > 0.05 && (
              <motion.text
                x={50 + 25 * Math.cos(((currentAngle - (slice.percentage * 360) / 2) * Math.PI) / 180)}
                y={50 + 25 * Math.sin(((currentAngle - (slice.percentage * 360) / 2) * Math.PI) / 180)}
                textAnchor="middle"
                dominantBaseline="middle"
                className="fill-white text-xs font-medium"
                initial={animated ? { opacity: 0 } : false}
                animate={{ opacity: 1 }}
                transition={{
                  delay: animationDelay + 0.5,
                  duration: 0.3,
                }}
              >
                {`${(slice.percentage * 100).toFixed(0)}%`}
              </motion.text>
            )}
          </g>
        ))}
        {innerRadius > 0 && (
          <circle cx="50" cy="50" r={innerRadius} fill="#0a0a0f" />
        )}
      </svg>
      {/* Legend */}
      <div className="flex flex-wrap gap-4 mt-4 justify-center">
        {data.map((item, i) => (
          <div key={i} className="flex items-center gap-2">
            <div
              className="w-3 h-3 rounded"
              style={{ backgroundColor: slices[i].color }}
            />
            <span className="text-xs text-cyber-muted">{item.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

/**
 * ProgressChart - 进度条图表
 */
export interface ProgressChartProps extends BaseChartProps {
  /** 进度条高度 */
  barHeight?: number;
  /** 是否显示数值 */
  showValue?: boolean;
}

export const ProgressChart: React.FC<ProgressChartProps> = ({
  data,
  width = '100%',
  barHeight = 24,
  showValue = true,
  className,
  title,
  animated = true,
  animationDelay = 0,
}) => {
  const max = Math.max(...data.map((d) => d.value));

  const colorMap: Record<string, string> = {
    cyan: '#00f0ff',
    purple: '#9d00ff',
    pink: '#ff0080',
    green: '#00ff88',
    yellow: '#f0ff00',
  };

  return (
    <div className={cn('cyber-chart p-4', className)} style={{ width }}>
      {title && (
        <h3 className="text-lg font-bold text-cyber-cyan mb-4">{title}</h3>
      )}
      <div className="space-y-3">
        {data.map((item, index) => {
          const percentage = (item.value / max) * 100;
          const color = item.color
            ? colorMap[item.color] || item.color
            : colorMap.cyan;

          return (
            <div key={index} className="space-y-1">
              <div className="flex justify-between text-sm">
                <span className="text-cyber-muted">{item.label}</span>
                {showValue && (
                  <span className="text-cyber-cyan">{item.value}</span>
                )}
              </div>
              <div
                className="relative bg-cyber-muted/20 rounded-full overflow-hidden"
                style={{ height: barHeight }}
              >
                <motion.div
                  className="h-full rounded-full"
                  style={{ backgroundColor: color }}
                  initial={animated ? { width: 0 } : false}
                  animate={{ width: `${percentage}%` }}
                  transition={{
                    delay: animationDelay + index * 0.1,
                    duration: 0.8,
                    ease: 'easeOut',
                  }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

// Helper function
function polarToCartesian(
  centerX: number,
  centerY: number,
  radius: number,
  angleInDegrees: number
) {
  const angleInRadians = ((angleInDegrees - 90) * Math.PI) / 180.0;

  return {
    x: centerX + radius * Math.cos(angleInRadians),
    y: centerY + radius * Math.sin(angleInRadians),
  };
}

/**
 * Chart - 统一图表组件
 */
export interface ChartProps extends BaseChartProps {
  /** 图表类型 */
  type: ChartType;
  /** 其他图表属性 */
  [key: string]: any;
}

export const Chart: React.FC<ChartProps> = ({ type, ...props }) => {
  const chartComponents = {
    bar: BarChart,
    line: LineChart,
    pie: PieChart,
    progress: ProgressChart,
  };

  const ChartComponent = chartComponents[type];

  if (!ChartComponent) {
    return (
      <div className="text-cyber-pink">Unknown chart type: {type}</div>
    );
  }

  return <ChartComponent {...props} />;
};

export default Chart;
