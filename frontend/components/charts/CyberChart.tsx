'use client';

/**
 * CyberChart - 赛博朋克风格图表组件
 * 基于 SVG 的轻量级图表库，支持折线图、柱状图、饼图
 */

import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

// ============================================================================
// 类型定义
// ============================================================================

export type ChartType = 'line' | 'bar' | 'area' | 'pie';

export interface ChartData {
  label: string;
  value: number;
  color?: string;
}

export interface CyberChartProps {
  type: ChartType;
  data: ChartData[];
  width?: number;
  height?: number;
  className?: string;
  showGrid?: boolean;
  showLabels?: boolean;
  showTooltip?: boolean;
  animationDuration?: number;
  colors?: string[];
  maxValue?: number;
}

// ============================================================================
// 默认颜色配置
// ============================================================================

const defaultColors = [
  '#00f0ff', // cyan
  '#9d00ff', // purple
  '#ff0080', // pink
  '#00ff88', // green
  '#f0ff00', // yellow
];

// ============================================================================
// 工具函数
// ============================================================================

function getMaxValue(data: ChartData[], maxValue?: number): number {
  if (maxValue !== undefined) return maxValue;
  return Math.max(...data.map((d) => d.value));
}

function generatePath(
  data: ChartData[],
  width: number,
  height: number,
  maxValue: number,
  padding = 20
): string {
  const chartWidth = width - padding * 2;
  const chartHeight = height - padding * 2;
  const stepX = chartWidth / (data.length - 1 || 1);

  let path = `M ${padding} ${height - padding - (data[0].value / maxValue) * chartHeight}`;

  data.forEach((point, index) => {
    const x = padding + index * stepX;
    const y = height - padding - (point.value / maxValue) * chartHeight;
    path += ` L ${x} ${y}`;
  });

  return path;
}

function generateAreaPath(
  data: ChartData[],
  width: number,
  height: number,
  maxValue: number,
  padding = 20
): string {
  const linePath = generatePath(data, width, height, maxValue, padding);
  const chartWidth = width - padding * 2;

  return `${linePath} L ${padding + chartWidth} ${height - padding} L ${padding} ${height - padding} Z`;
}

// ============================================================================
// 折线图组件
// ============================================================================

function LineChart({
  data,
  width = 600,
  height = 300,
  maxValue,
  showGrid = true,
  showLabels = true,
  colors = defaultColors,
  animationDuration = 1,
}: CyberChartProps) {
  const padding = 40;
  const chartWidth = width - padding * 2;
  const chartHeight = height - padding * 2;
  const maxVal = getMaxValue(data, maxValue);

  const path = useMemo(
    () => generatePath(data, width, height, maxVal, padding),
    [data, width, height, maxVal, padding]
  );

  return (
    <svg width={width} height={height} className="overflow-visible">
      {/* 网格线 */}
      {showGrid &&
        Array.from({ length: 5 }).map((_, index) => {
          const y = padding + (index * chartHeight) / 4;
          return (
            <line
              key={index}
              x1={padding}
              y1={y}
              x2={width - padding}
              y2={y}
              stroke="rgba(0, 240, 255, 0.1)"
              strokeWidth="1"
            />
          );
        })}

      {/* 数据线 */}
      <motion.path
        d={path}
        fill="none"
        stroke={colors[0]}
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: animationDuration }}
        style={{
          filter: 'drop-shadow(0 0 8px rgba(0, 240, 255, 0.5))',
        }}
      />

      {/* 数据点 */}
      {data.map((point, index) => {
        const x = padding + (index * chartWidth) / (data.length - 1 || 1);
        const y = height - padding - (point.value / maxVal) * chartHeight;

        return (
          <g key={index}>
            <motion.circle
              cx={x}
              cy={y}
              r="6"
              fill={colors[0]}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: index * 0.1, duration: 0.3 }}
              style={{
                filter: 'drop-shadow(0 0 10px rgba(0, 240, 255, 0.8))',
              }}
            />
            {showLabels && (
              <motion.text
                x={x}
                y={y - 15}
                textAnchor="middle"
                fill="#ffffff"
                fontSize="12"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: index * 0.1 + 0.3 }}
              >
                {point.value}
              </motion.text>
            )}
          </g>
        );
      })}

      {/* X轴标签 */}
      {showLabels &&
        data.map((point, index) => {
          const x = padding + (index * chartWidth) / (data.length - 1 || 1);
          return (
            <text
              key={index}
              x={x}
              y={height - 10}
              textAnchor="middle"
              fill="#888888"
              fontSize="11"
            >
              {point.label}
            </text>
          );
        })}
    </svg>
  );
}

// ============================================================================
// 面积图组件
// ============================================================================

function AreaChart({
  data,
  width = 600,
  height = 300,
  maxValue,
  showGrid = true,
  showLabels = true,
  colors = defaultColors,
  animationDuration = 1,
}: CyberChartProps) {
  const padding = 40;
  const maxVal = getMaxValue(data, maxValue);

  const linePath = useMemo(
    () => generatePath(data, width, height, maxVal, padding),
    [data, width, height, maxVal, padding]
  );

  const areaPath = useMemo(
    () => generateAreaPath(data, width, height, maxVal, padding),
    [data, width, height, maxVal, padding]
  );

  return (
    <svg width={width} height={height} className="overflow-visible">
      {/* 网格线 */}
      {showGrid &&
        Array.from({ length: 5 }).map((_, index) => {
          const y = padding + (index * (height - padding * 2)) / 4;
          return (
            <line
              key={index}
              x1={padding}
              y1={y}
              x2={width - padding}
              y2={y}
              stroke="rgba(0, 240, 255, 0.1)"
              strokeWidth="1"
            />
          );
        })}

      {/* 区域填充 */}
      <motion.path
        d={areaPath}
        fill={colors[0]}
        fillOpacity="0.2"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: animationDuration }}
      />

      {/* 数据线 */}
      <motion.path
        d={linePath}
        fill="none"
        stroke={colors[0]}
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: animationDuration }}
        style={{
          filter: 'drop-shadow(0 0 8px rgba(0, 240, 255, 0.5))',
        }}
      />

      {/* 数据点 */}
      {data.map((point, index) => {
        const x = padding + (index * (width - padding * 2)) / (data.length - 1 || 1);
        const y = height - padding - (point.value / maxVal) * (height - padding * 2);

        return (
          <g key={index}>
            <motion.circle
              cx={x}
              cy={y}
              r="6"
              fill={colors[0]}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: index * 0.1, duration: 0.3 }}
              style={{
                filter: 'drop-shadow(0 0 10px rgba(0, 240, 255, 0.8))',
              }}
            />
          </g>
        );
      })}
    </svg>
  );
}

// ============================================================================
// 柱状图组件
// ============================================================================

function BarChart({
  data,
  width = 600,
  height = 300,
  maxValue,
  showGrid = true,
  showLabels = true,
  colors = defaultColors,
  animationDuration = 1,
}: CyberChartProps) {
  const padding = 40;
  const chartWidth = width - padding * 2;
  const chartHeight = height - padding * 2;
  const maxVal = getMaxValue(data, maxValue);
  const barWidth = (chartWidth / data.length) * 0.8;
  const barGap = (chartWidth / data.length) * 0.2;

  return (
    <svg width={width} height={height} className="overflow-visible">
      {/* 网格线 */}
      {showGrid &&
        Array.from({ length: 5 }).map((_, index) => {
          const y = padding + (index * chartHeight) / 4;
          return (
            <line
              key={index}
              x1={padding}
              y1={y}
              x2={width - padding}
              y2={y}
              stroke="rgba(0, 240, 255, 0.1)"
              strokeWidth="1"
            />
          );
        })}

      {/* 柱子 */}
      {data.map((point, index) => {
        const barHeight = (point.value / maxVal) * chartHeight;
        const x = padding + index * (barWidth + barGap);
        const y = height - padding - barHeight;
        const color = point.color || colors[index % colors.length];

        return (
          <g key={index}>
            <motion.rect
              x={x}
              y={y}
              width={barWidth}
              height={barHeight}
              fill={color}
              initial={{ height: 0, y: height - padding }}
              animate={{ height: barHeight, y }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
              style={{
                filter: 'drop-shadow(0 0 10px rgba(0, 240, 255, 0.5))',
              }}
              rx="4"
            />
            {showLabels && (
              <motion.text
                x={x + barWidth / 2}
                y={y - 10}
                textAnchor="middle"
                fill="#ffffff"
                fontSize="12"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: index * 0.1 + 0.3 }}
              >
                {point.value}
              </motion.text>
            )}
            <text
              x={x + barWidth / 2}
              y={height - 15}
              textAnchor="middle"
              fill="#888888"
              fontSize="11"
            >
              {point.label}
            </text>
          </g>
        );
      })}
    </svg>
  );
}

// ============================================================================
// 饼图组件
// ============================================================================

function PieChart({
  data,
  width = 400,
  height = 400,
  showLabels = true,
  colors = defaultColors,
  animationDuration = 1,
}: CyberChartProps) {
  const radius = Math.min(width, height) / 2 - 40;
  const centerX = width / 2;
  const centerY = height / 2;
  const total = data.reduce((sum, point) => sum + point.value, 0);

  let currentAngle = -90;

  const slices = data.map((point, index) => {
    const sliceAngle = (point.value / total) * 360;
    const startAngle = currentAngle;
    const endAngle = currentAngle + sliceAngle;
    currentAngle = endAngle;

    // 计算路径
    const startAngleRad = (startAngle * Math.PI) / 180;
    const endAngleRad = (endAngle * Math.PI) / 180;

    const x1 = centerX + radius * Math.cos(startAngleRad);
    const y1 = centerY + radius * Math.sin(startAngleRad);
    const x2 = centerX + radius * Math.cos(endAngleRad);
    const y2 = centerY + radius * Math.sin(endAngleRad);

    const largeArcFlag = sliceAngle > 180 ? 1 : 0;

    const path = `M ${centerX} ${centerY} L ${x1} ${y1} A ${radius} ${radius} 0 ${largeArcFlag} 1 ${x2} ${y2} Z`;

    // 计算标签位置
    const labelAngle = (startAngle + endAngle) / 2;
    const labelAngleRad = (labelAngle * Math.PI) / 180;
    const labelRadius = radius * 0.7;
    const labelX = centerX + labelRadius * Math.cos(labelAngleRad);
    const labelY = centerY + labelRadius * Math.sin(labelAngleRad);

    return {
      path,
      color: point.color || colors[index % colors.length],
      value: point.value,
      label: point.label,
      labelX,
      labelY,
      percentage: ((point.value / total) * 100).toFixed(1),
    };
  });

  return (
    <svg width={width} height={height} className="overflow-visible">
      <g>
        {slices.map((slice, index) => (
          <g key={index}>
            <motion.path
              d={slice.path}
              fill={slice.color}
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
              style={{
                transformOrigin: `${centerX}px ${centerY}px`,
                filter: 'drop-shadow(0 0 8px rgba(0, 0, 0, 0.3))',
              }}
              whileHover={{ scale: 1.05 }}
            />
            {showLabels && slice.percentage !== '0.0' && (
              <motion.text
                x={slice.labelX}
                y={slice.labelY}
                textAnchor="middle"
                fill="#ffffff"
                fontSize="12"
                fontWeight="bold"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: index * 0.1 + 0.3 }}
              >
                {slice.percentage}%
              </motion.text>
            )}
          </g>
        ))}
      </g>
    </svg>
  );
}

// ============================================================================
// 主组件
// ============================================================================

export function CyberChart(props: CyberChartProps) {
  const { type, className } = props;

  return (
    <div
      className={cn('cyber-chart', className)}
      style={{
        background: 'rgba(10, 10, 15, 0.8)',
        border: '1px solid rgba(0, 240, 255, 0.3)',
        borderRadius: '12px',
        padding: '20px',
      }}
    >
      {type === 'line' && <LineChart {...props} />}
      {type === 'area' && <AreaChart {...props} />}
      {type === 'bar' && <BarChart {...props} />}
      {type === 'pie' && <PieChart {...props} />}
    </div>
  );
}

// ============================================================================
// 便捷组件
// ============================================================================

export function CyberLineChart(props: Omit<CyberChartProps, 'type'>) {
  return <CyberChart {...props} type="line" />;
}

export function CyberAreaChart(props: Omit<CyberChartProps, 'type'>) {
  return <CyberChart {...props} type="area" />;
}

export function CyberBarChart(props: Omit<CyberChartProps, 'type'>) {
  return <CyberChart {...props} type="bar" />;
}

export function CyberPieChart(props: Omit<CyberChartProps, 'type'>) {
  return <CyberChart {...props} type="pie" />;
}

// ============================================================================
// 导出
// ============================================================================

export default CyberChart;
