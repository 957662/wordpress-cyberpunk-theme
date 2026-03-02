'use client';

/**
 * Line Chart Component
 * 折线图组件 - 支持多条线、渐变填充、交互提示
 */

import { useState, useCallback, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';

// 类型定义
interface DataPoint {
  x: number | string;
  y: number;
  label?: string;
}

interface LineConfig {
  data: DataPoint[];
  color: string;
  label?: string;
  fill?: boolean;
  gradient?: boolean;
  strokeWidth?: number;
}

interface LineChartProps {
  lines: LineConfig[];
  width?: number;
  height?: number;
  showGrid?: boolean;
  showTooltip?: boolean;
  showLegend?: boolean;
  showXAxis?: boolean;
  showYAxis?: boolean;
  xLabels?: string[];
  yRange?: [number, number];
  theme?: 'dark' | 'light';
  className?: string;
  onPointClick?: (lineIndex: number, pointIndex: number, point: DataPoint) => void;
}

export function LineChart({
  lines,
  width = 800,
  height = 400,
  showGrid = true,
  showTooltip = true,
  showLegend = true,
  showXAxis = true,
  showYAxis = true,
  xLabels,
  yRange,
  theme = 'dark',
  className = '',
  onPointClick,
}: LineChartProps) {
  const [tooltip, setTooltip] = useState<{
    x: number;
    y: number;
    content: React.ReactNode;
  } | null>(null);

  const svgRef = useRef<SVGSVGElement>(null);

  // 计算数据范围
  const calculateRange = useCallback(() => {
    const allYValues = lines.flatMap(line => line.data.map(p => p.y));
    const minY = yRange?.[0] ?? Math.min(...allYValues);
    const maxY = yRange?.[1] ?? Math.max(...allYValues);

    return {
      minX: 0,
      maxX: lines[0]?.data.length ? lines[0].data.length - 1 : 0,
      minY,
      maxY,
    };
  }, [lines, yRange]);

  const { minX, maxX, minY, maxY } = calculateRange();

  // 坐标转换
  const scales = useCallback((value: number, min: number, max: number, size: number) => {
    return ((value - min) / (max - min)) * size;
  }, []);

  const getX = useCallback((x: number) => {
    const padding = 60;
    const chartWidth = width - padding * 2;
    return padding + scales(Number(x), minX, maxX, chartWidth);
  }, [width, minX, maxX, scales]);

  const getY = useCallback((y: number) => {
    const padding = 40;
    const chartHeight = height - padding * 2;
    return height - padding - scales(y, minY, maxY, chartHeight);
  }, [height, minY, maxY, scales]);

  // 生成路径
  const generatePath = useCallback((data: DataPoint[]) => {
    if (data.length === 0) return '';

    let path = `M ${getX(Number(data[0].x))} ${getY(data[0].y)}`;

    for (let i = 1; i < data.length; i++) {
      const x = getX(Number(data[i].x));
      const y = getY(data[i].y);

      // 使用贝塞尔曲线平滑连接
      const prevX = getX(Number(data[i - 1].x));
      const prevY = getY(data[i - 1].y);
      const cp1x = prevX + (x - prevX) / 2;
      const cp1y = prevY;
      const cp2x = prevX + (x - prevX) / 2;
      const cp2y = y;

      path += ` C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${x} ${y}`;
    }

    return path;
  }, [getX, getY]);

  // 生成填充区域
  const generateAreaPath = useCallback((data: DataPoint[], linePath: string) => {
    if (data.length === 0) return '';

    const firstX = getX(Number(data[0].x));
    const lastX = getX(Number(data[data.length - 1].x));
    const bottomY = getY(minY);

    return `${linePath} L ${lastX} ${bottomY} L ${firstX} ${bottomY} Z`;
  }, [getX, getY, minY]);

  // 处理点悬停
  const handlePointHover = useCallback((point: DataPoint, line: LineConfig, lineIndex: number, pointIndex: number, e: React.MouseEvent) => {
    if (!showTooltip) return;

    const rect = svgRef.current?.getBoundingClientRect();
    if (!rect) return;

    setTooltip({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
      content: (
        <div className="p-2 rounded bg-gray-900/95 border border-gray-700 text-white">
          <div className="font-medium">{point.label || `Point ${pointIndex + 1}`}</div>
          <div className="text-sm text-gray-400">
            {line.label && <span>{line.label}: </span>}
            <span className="text-cyan-400">{point.y}</span>
          </div>
        </div>
      ),
    });
  }, [showTooltip]);

  const handlePointLeave = useCallback(() => {
    setTooltip(null);
  }, []);

  // 生成X轴标签
  const renderXAxis = () => {
    if (!showXAxis) return null;

    const labels = xLabels || lines[0]?.data.map((p, i) => p.label || String(i + 1)) || [];

    return (
      <g className="x-axis">
        {labels.map((label, i) => (
          <text
            key={i}
            x={getX(i)}
            y={height - 15}
            textAnchor="middle"
            className="text-xs fill-gray-500"
          >
            {label}
          </text>
        ))}
      </g>
    );
  };

  // 生成Y轴标签
  const renderYAxis = () => {
    if (!showYAxis) return null;

    const ticks = 5;
    const tickValues = Array.from({ length: ticks }, (_, i) =>
      minY + (maxY - minY) * (i / (ticks - 1))
    );

    return (
      <g className="y-axis">
        {tickValues.map((value, i) => (
          <text
            key={i}
            x={40}
            y={getY(value) + 4}
            textAnchor="end"
            className="text-xs fill-gray-500"
          >
            {value.toFixed(0)}
          </text>
        ))}
      </g>
    );
  };

  // 生成网格线
  const renderGrid = () => {
    if (!showGrid) return null;

    const horizontalLines = 5;
    const gridLines = [];

    // 水平线
    for (let i = 0; i < horizontalLines; i++) {
      const y = getY(minY + (maxY - minY) * (i / (horizontalLines - 1)));
      gridLines.push(
        <line
          key={`h-${i}`}
          x1={60}
          y1={y}
          x2={width - 60}
          y2={y}
          stroke="currentColor"
          className="stroke-gray-700/30"
          strokeWidth={1}
        />
      );
    }

    return <g>{gridLines}</g>;
  };

  // 生成图例
  const renderLegend = () => {
    if (!showLegend) return null;

    return (
      <g transform={`translate(${width - 150}, 20)`}>
        {lines.map((line, i) => (
          <g key={i} transform={`translate(0, ${i * 20})`}>
            <line
              x1={0}
              y1={0}
              x2={30}
              y2={0}
              stroke={line.color}
              strokeWidth={line.strokeWidth || 2}
            />
            {line.fill && (
              <circle cx={15} cy={0} r={4} fill={line.color} opacity={0.3} />
            )}
            <text
              x={40}
              y={4}
              className="text-xs fill-gray-400"
            >
              {line.label || `Line ${i + 1}`}
            </text>
          </g>
        ))}
      </g>
    );
  };

  return (
    <div className={`relative ${className}`}>
      <svg
        ref={svgRef}
        width={width}
        height={height}
        className={`${theme === 'dark' ? 'bg-gray-900' : 'bg-white'}`}
      >
        {/* 网格 */}
        {renderGrid()}

        {/* 坐标轴 */}
        {renderXAxis()}
        {renderYAxis()}

        {/* 数据线 */}
        {lines.map((line, lineIndex) => {
          const path = generatePath(line.data);

          return (
            <g key={lineIndex}>
              {/* 填充区域 */}
              {line.fill && line.gradient && (
                <defs>
                  <linearGradient id={`gradient-${lineIndex}`} x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor={line.color} stopOpacity={0.4} />
                    <stop offset="100%" stopColor={line.color} stopOpacity={0} />
                  </linearGradient>
                </defs>
              )}

              {line.fill && (
                <motion.path
                  d={generateAreaPath(line.data, path)}
                  fill={line.gradient ? `url(#gradient-${lineIndex})` : line.color}
                  opacity={0.3}
                  initial={{ pathLength: 0, opacity: 0 }}
                  animate={{ pathLength: 1, opacity: 0.3 }}
                  transition={{ duration: 1, ease: 'easeInOut' }}
                />
              )}

              {/* 线条 */}
              <motion.path
                d={path}
                fill="none"
                stroke={line.color}
                strokeWidth={line.strokeWidth || 2}
                strokeLinecap="round"
                strokeLinejoin="round"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 1.5, ease: 'easeInOut' }}
              />

              {/* 数据点 */}
              {line.data.map((point, pointIndex) => {
                const cx = getX(Number(point.x));
                const cy = getY(point.y);

                return (
                  <motion.circle
                    key={pointIndex}
                    cx={cx}
                    cy={cy}
                    r={4}
                    fill={line.color}
                    className="cursor-pointer hover:r-6 transition-all"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: pointIndex * 0.05 }}
                    onMouseEnter={(e) => handlePointHover(point, line, lineIndex, pointIndex, e)}
                    onMouseLeave={handlePointLeave}
                    onClick={() => onPointClick?.(lineIndex, pointIndex, point)}
                  />
                );
              })}
            </g>
          );
        })}

        {/* 图例 */}
        {renderLegend()}
      </svg>

      {/* Tooltip */}
      {tooltip && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          className="absolute pointer-events-none z-10"
          style={{
            left: tooltip.x,
            top: tooltip.y,
            transform: 'translate(-50%, -120%)',
          }}
        >
          {tooltip.content}
        </motion.div>
      )}
    </div>
  );
}

export default LineChart;
