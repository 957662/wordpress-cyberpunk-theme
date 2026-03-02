'use client';

import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

export interface AreaDataPoint {
  x: string | number;
  y: number;
}

export interface AreaChartProps {
  data: AreaDataPoint[];
  title?: string;
  description?: string;
  height?: number;
  showGrid?: boolean;
  showPoints?: boolean;
  showTooltip?: boolean;
  fill?: boolean;
  curve?: 'linear' | 'smooth' | 'step';
  animationDuration?: number;
  className?: string;
  colorScheme?: 'cyan' | 'purple' | 'pink' | 'green' | 'orange' | 'blue';
  strokeWidth?: number;
}

const colorSchemes = {
  cyan: {
    stroke: 'stroke-cyan-400',
    fill: 'fill-cyan-400',
    gradient: 'from-cyan-400/30 to-cyan-400/5',
    point: 'bg-cyan-400',
    text: 'text-cyan-400',
  },
  purple: {
    stroke: 'stroke-purple-400',
    fill: 'fill-purple-400',
    gradient: 'from-purple-400/30 to-purple-400/5',
    point: 'bg-purple-400',
    text: 'text-purple-400',
  },
  pink: {
    stroke: 'stroke-pink-400',
    fill: 'fill-pink-400',
    gradient: 'from-pink-400/30 to-pink-400/5',
    point: 'bg-pink-400',
    text: 'text-pink-400',
  },
  green: {
    stroke: 'stroke-green-400',
    fill: 'fill-green-400',
    gradient: 'from-green-400/30 to-green-400/5',
    point: 'bg-green-400',
    text: 'text-green-400',
  },
  orange: {
    stroke: 'stroke-orange-400',
    fill: 'fill-orange-400',
    gradient: 'from-orange-400/30 to-orange-400/5',
    point: 'bg-orange-400',
    text: 'text-orange-400',
  },
  blue: {
    stroke: 'stroke-blue-400',
    fill: 'fill-blue-400',
    gradient: 'from-blue-400/30 to-blue-400/5',
    point: 'bg-blue-400',
    text: 'text-blue-400',
  },
};

const AreaChart: React.FC<AreaChartProps> = ({
  data,
  title,
  description,
  height = 300,
  showGrid = true,
  showPoints = true,
  showTooltip = true,
  fill = true,
  curve = 'smooth',
  animationDuration = 0.8,
  className,
  colorScheme = 'cyan',
  strokeWidth = 2,
}) => {
  const colors = colorSchemes[colorScheme];
  const [hoveredPoint, setHoveredPoint] = React.useState<number | null>(null);

  const { maxY, points } = useMemo(() => {
    const maxY = Math.max(...data.map((d) => d.y), 1);
    const padding = height * 0.1;
    const chartHeight = height - padding * 2;
    const chartWidth = 100;
    const stepX = chartWidth / (data.length - 1);

    const points = data.map((d, i) => ({
      ...d,
      x: i * stepX,
      y: chartHeight - (d.y / maxY) * chartHeight + padding,
    }));

    return { maxY, points };
  }, [data, height]);

  const generatePath = () => {
    if (points.length === 0) return '';

    if (curve === 'linear') {
      return `M ${points.map((p) => `${p.x},${p.y}`).join(' L ')}`;
    }

    if (curve === 'step') {
      return points
        .map((p, i) => {
          if (i === 0) return `M ${p.x},${p.y}`;
          const prev = points[i - 1];
          const midX = (prev.x + p.x) / 2;
          return `L ${midX},${prev.y} L ${midX},${p.y} L ${p.x},${p.y}`;
        })
        .join(' ');
    }

    // Smooth curve using bezier
    const controlPoints = points.map((p, i) => {
      if (i === 0 || i === points.length - 1) return p;
      const prev = points[i - 1];
      const next = points[i + 1];
      return {
        ...p,
        cp1x: p.x - (next.x - prev.x) / 6,
        cp1y: p.y,
        cp2x: p.x + (next.x - prev.x) / 6,
        cp2y: p.y,
      };
    });

    let path = `M ${points[0].x},${points[0].y}`;

    for (let i = 1; i < points.length; i++) {
      const curr = controlPoints[i];
      const prev = controlPoints[i - 1];
      path += ` C ${prev.cp2x},${prev.cp2y} ${curr.cp1x},${curr.cp1y} ${curr.x},${curr.y}`;
    }

    return path;
  };

  const linePath = generatePath();
  const areaPath = fill ? `${linePath} L 100,${height} L 0,${height} Z` : '';

  return (
    <div className={cn('w-full', className)}>
      {(title || description) && (
        <div className="mb-6">
          {title && (
            <h3 className={cn('text-xl font-bold text-white mb-2', colors.text)}>
              {title}
            </h3>
          )}
          {description && (
            <p className="text-sm text-gray-400">{description}</p>
          )}
        </div>
      )}

      <div className="relative" style={{ height }}>
        {/* Grid */}
        {showGrid && (
          <div className="absolute inset-0">
            {[0, 25, 50, 75, 100].map((line, i) => (
              <div
                key={i}
                className="absolute w-full border-t border-gray-700/50"
                style={{ top: `${line}%` }}
              >
                <span className="absolute -top-3 -left-8 text-xs text-gray-500">
                  {Math.round(maxY * (1 - line / 100))}
                </span>
              </div>
            ))}
          </div>
        )}

        {/* SVG Chart */}
        <svg
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
          className="w-full h-full"
        >
          <defs>
            <linearGradient id={`gradient-${colorScheme}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="currentColor" stopOpacity="0.3" />
              <stop offset="100%" stopColor="currentColor" stopOpacity="0.05" />
            </linearGradient>
          </defs>

          {/* Area */}
          {fill && (
            <motion.path
              d={areaPath}
              className={colors.fill}
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: 1 }}
              transition={{ duration: animationDuration }}
              style={{ color: colorScheme === 'cyan' ? '#00f0ff' : undefined }}
            />
          )}

          {/* Line */}
          <motion.path
            d={linePath}
            fill="none"
            className={colors.stroke}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeLinejoin="round"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: animationDuration }}
          />

          {/* Points */}
          {showPoints &&
            points.map((point, i) => (
              <g key={i}>
                <circle
                  cx={point.x}
                  cy={point.y}
                  r="1"
                  className={colors.point}
                  onMouseEnter={() => setHoveredPoint(i)}
                  onMouseLeave={() => setHoveredPoint(null)}
                  style={{ cursor: 'pointer' }}
                />

                {/* Tooltip */}
                {showTooltip && hoveredPoint === i && (
                  <g>
                    <rect
                      x={point.x - 10}
                      y={point.y - 8}
                      width="20"
                      height="6"
                      fill="rgba(0, 0, 0, 0.8)"
                      rx="1"
                    />
                    <text
                      x={point.x}
                      y={point.y - 4}
                      textAnchor="middle"
                      className="fill-white text-xs"
                      fontSize="2"
                    >
                      {point.y}
                    </text>
                  </g>
                )}
              </g>
            ))}
        </svg>

        {/* X-axis labels */}
        <div className="absolute bottom-0 left-0 right-0 flex justify-between px-2">
          {points.map((point, i) => (
            <span
              key={i}
              className="text-xs text-gray-500 truncate"
              style={{ maxWidth: `${100 / points.length}%` }}
            >
              {point.x}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AreaChart;
