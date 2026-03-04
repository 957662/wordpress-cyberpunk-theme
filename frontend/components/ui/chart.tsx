'use client';

import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

// ==========================================
// Types and Interfaces
// ==========================================

export type ChartType = 'line' | 'bar' | 'pie' | 'area';

export interface ChartData {
  label: string;
  value: number;
  color?: string;
}

export interface ChartProps {
  type: ChartType;
  data: ChartData[];
  title?: string;
  description?: string;
  height?: number;
  showLegend?: boolean;
  showLabels?: boolean;
  className?: string;
}

// ==========================================
// Helper Components
// ==========================================

interface ChartLegendProps {
  data: ChartData[];
}

const ChartLegend: React.FC<ChartLegendProps> = ({ data }) => {
  return (
    <div className="flex flex-wrap gap-4 mt-4 justify-center">
      {data.map((item, index) => (
        <div key={index} className="flex items-center gap-2">
          <div
            className="w-3 h-3 rounded-sm"
            style={{ backgroundColor: item.color || '#00f0ff' }}
          />
          <span className="text-sm text-cyber-cyan/80">{item.label}</span>
        </div>
      ))}
    </div>
  );
};

// ==========================================
// Line Chart Component
// ==========================================

interface LineChartProps {
  data: ChartData[];
  height: number;
  showLabels: boolean;
}

const LineChart: React.FC<LineChartProps> = ({ data, height, showLabels }) => {
  const maxValue = Math.max(...data.map((d) => d.value));
  const points = useMemo(() => {
    const width = 100;
    const step = width / (data.length - 1);

    return data
      .map((point, index) => {
        const x = index * step;
        const y = 100 - (point.value / maxValue) * 100;
        return `${x},${y}`;
      })
      .join(' ');
  }, [data, maxValue]);

  const areaPoints = `0,100 ${points} 100,100`;

  return (
    <svg viewBox="0 0 100 100" className="w-full" style={{ height }}>
      {/* Grid lines */}
      {[0, 0.25, 0.5, 0.75, 1].map((ratio) => (
        <line
          key={ratio}
          x1="0"
          y1={ratio * 100}
          x2="100"
          y2={ratio * 100}
          stroke="rgba(42, 42, 74, 0.5)"
          strokeWidth="0.2"
        />
      ))}

      {/* Area fill */}
      <polygon
        points={areaPoints}
        fill="rgba(0, 240, 255, 0.1)"
        className="transition-opacity duration-300"
      />

      {/* Line */}
      <motion.polyline
        points={points}
        fill="none"
        stroke="#00f0ff"
        strokeWidth="1"
        strokeLinecap="round"
        strokeLinejoin="round"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 1, ease: 'easeInOut' }}
        style={{
          filter: 'drop-shadow(0 0 6px rgba(0, 240, 255, 0.5))',
        }}
      />

      {/* Data points */}
      {data.map((point, index) => {
        const x = (index / (data.length - 1)) * 100;
        const y = 100 - (point.value / maxValue) * 100;

        return (
          <g key={index}>
            <circle
              cx={x}
              cy={y}
              r="2"
              fill="#0a0a0f"
              stroke={point.color || '#00f0ff'}
              strokeWidth="1"
              className="hover:r-3 transition-all duration-200"
            />
            {showLabels && (
              <text
                x={x}
                y={y - 4}
                textAnchor="middle"
                fontSize="3"
                fill="#00f0ff"
                className="pointer-events-none"
              >
                {point.value}
              </text>
            )}
          </g>
        );
      })}
    </svg>
  );
};

// ==========================================
// Bar Chart Component
// ==========================================

interface BarChartProps {
  data: ChartData[];
  height: number;
  showLabels: boolean;
}

const BarChart: React.FC<BarChartProps> = ({ data, height, showLabels }) => {
  const maxValue = Math.max(...data.map((d) => d.value));
  const barWidth = 80 / data.length;

  return (
    <svg viewBox="0 0 100 100" className="w-full" style={{ height }}>
      {/* Grid lines */}
      {[0, 0.25, 0.5, 0.75, 1].map((ratio) => (
        <line
          key={ratio}
          x1="0"
          y1={ratio * 100}
          x2="100"
          y2={ratio * 100}
          stroke="rgba(42, 42, 74, 0.5)"
          strokeWidth="0.2"
        />
      ))}

      {/* Bars */}
      {data.map((item, index) => {
        const barHeight = (item.value / maxValue) * 90;
        const x = 10 + index * (barWidth + 2);
        const y = 95 - barHeight;

        return (
          <g key={index}>
            <motion.rect
              x={x}
              y={y}
              width={barWidth}
              height={barHeight}
              fill={item.color || '#00f0ff'}
              initial={{ height: 0, y: 95 }}
              animate={{ height: barHeight, y }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="hover:opacity-80 transition-opacity"
              style={{
                filter: 'drop-shadow(0 0 4px rgba(0, 240, 255, 0.3))',
              }}
            />
            {showLabels && (
              <text
                x={x + barWidth / 2}
                y={y - 2}
                textAnchor="middle"
                fontSize="3"
                fill="#00f0ff"
                className="pointer-events-none"
              >
                {item.value}
              </text>
            )}
          </g>
        );
      })}
    </svg>
  );
};

// ==========================================
// Pie Chart Component
// ==========================================

interface PieChartProps {
  data: ChartData[];
  height: number;
  showLabels: boolean;
}

const PieChart: React.FC<PieChartProps> = ({ data, height, showLabels }) => {
  const total = data.reduce((sum, item) => sum + item.value, 0);

  const slices = useMemo(() => {
    let currentAngle = 0;

    return data.map((item) => {
      const percentage = item.value / total;
      const angle = percentage * 360;

      const startAngle = currentAngle;
      const endAngle = currentAngle + angle;
      currentAngle = endAngle;

      // Convert to radians
      const startRad = (startAngle - 90) * (Math.PI / 180);
      const endRad = (endAngle - 90) * (Math.PI / 180);

      // Calculate coordinates
      const x1 = 50 + 40 * Math.cos(startRad);
      const y1 = 50 + 40 * Math.sin(startRad);
      const x2 = 50 + 40 * Math.cos(endRad);
      const y2 = 50 + 40 * Math.sin(endRad);

      const largeArcFlag = angle > 180 ? 1 : 0;

      return {
        ...item,
        percentage,
        path: `M 50 50 L ${x1} ${y1} A 40 40 0 ${largeArcFlag} 1 ${x2} ${y2} Z`,
        labelX: 50 + 25 * Math.cos((startRad + endRad) / 2),
        labelY: 50 + 25 * Math.sin((startRad + endRad) / 2),
      };
    });
  }, [data, total]);

  return (
    <svg viewBox="0 0 100 100" className="w-full" style={{ height }}>
      {slices.map((slice, index) => (
        <g key={index}>
          <motion.path
            d={slice.path}
            fill={slice.color || '#00f0ff'}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
            transformOrigin="50 50"
            className="hover:opacity-80 transition-opacity cursor-pointer"
            style={{
              filter: 'drop-shadow(0 0 4px rgba(0, 240, 255, 0.3))',
            }}
          />
          {showLabels && slice.percentage > 0.05 && (
            <text
              x={slice.labelX}
              y={slice.labelY}
              textAnchor="middle"
              dominantBaseline="middle"
              fontSize="4"
              fill="#0a0a0f"
              className="pointer-events-none font-semibold"
            >
              {`${(slice.percentage * 100).toFixed(0)}%`}
            </text>
          )}
        </g>
      ))}
    </svg>
  );
};

// ==========================================
// Area Chart Component
// ==========================================

interface AreaChartProps {
  data: ChartData[];
  height: number;
  showLabels: boolean;
}

const AreaChart: React.FC<AreaChartProps> = ({ data, height, showLabels }) => {
  const maxValue = Math.max(...data.map((d) => d.value));
  const points = useMemo(() => {
    const width = 100;
    const step = width / (data.length - 1);

    return data
      .map((point, index) => {
        const x = index * step;
        const y = 100 - (point.value / maxValue) * 100;
        return `${x},${y}`;
      })
      .join(' ');
  }, [data, maxValue]);

  const areaPoints = `0,100 ${points} 100,100`;

  return (
    <svg viewBox="0 0 100 100" className="w-full" style={{ height }}>
      {/* Grid lines */}
      {[0, 0.25, 0.5, 0.75, 1].map((ratio) => (
        <line
          key={ratio}
          x1="0"
          y1={ratio * 100}
          x2="100"
          y2={ratio * 100}
          stroke="rgba(42, 42, 74, 0.5)"
          strokeWidth="0.2"
        />
      ))}

      {/* Area fill with gradient */}
      <defs>
        <linearGradient id="areaGradient" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#00f0ff" stopOpacity="0.3" />
          <stop offset="100%" stopColor="#00f0ff" stopOpacity="0.05" />
        </linearGradient>
      </defs>

      <polygon
        points={areaPoints}
        fill="url(#areaGradient)"
        className="transition-opacity duration-300"
      />

      {/* Line */}
      <motion.polyline
        points={points}
        fill="none"
        stroke="#00f0ff"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 1, ease: 'easeInOut' }}
        style={{
          filter: 'drop-shadow(0 0 8px rgba(0, 240, 255, 0.6))',
        }}
      />

      {/* Data points */}
      {data.map((point, index) => {
        const x = (index / (data.length - 1)) * 100;
        const y = 100 - (point.value / maxValue) * 100;

        return (
          <g key={index}>
            <circle
              cx={x}
              cy={y}
              r="2.5"
              fill="#00f0ff"
              className="hover:r-4 transition-all duration-200"
              style={{
                filter: 'drop-shadow(0 0 6px rgba(0, 240, 255, 0.8))',
              }}
            />
            {showLabels && (
              <text
                x={x}
                y={y - 5}
                textAnchor="middle"
                fontSize="3"
                fill="#00f0ff"
                className="pointer-events-none font-semibold"
              >
                {point.value}
              </text>
            )}
          </g>
        );
      })}
    </svg>
  );
};

// ==========================================
// Main Chart Component
// ==========================================

export function Chart({
  type,
  data,
  title,
  description,
  height = 200,
  showLegend = true,
  showLabels = true,
  className,
}: ChartProps) {
  const renderChart = () => {
    switch (type) {
      case 'line':
        return <LineChart data={data} height={height} showLabels={showLabels} />;
      case 'bar':
        return <BarChart data={data} height={height} showLabels={showLabels} />;
      case 'pie':
        return <PieChart data={data} height={height} showLabels={showLabels} />;
      case 'area':
        return <AreaChart data={data} height={height} showLabels={showLabels} />;
      default:
        return null;
    }
  };

  return (
    <div className={cn('w-full', className)}>
      {/* Header */}
      {(title || description) && (
        <div className="mb-4 text-center">
          {title && (
            <h3 className="text-lg font-semibold text-cyber-cyan mb-1">{title}</h3>
          )}
          {description && (
            <p className="text-sm text-cyber-muted">{description}</p>
          )}
        </div>
      )}

      {/* Chart */}
      <div className="relative bg-cyber-card/30 rounded-lg border border-cyber-border/50 p-4">
        {renderChart()}
      </div>

      {/* Legend */}
      {showLegend && <ChartLegend data={data} />}
    </div>
  );
}

// ==========================================
// Export Default
// ==========================================

export default Chart;
