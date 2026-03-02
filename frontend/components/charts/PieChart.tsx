'use client';

import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

export interface PieData {
  label: string;
  value: number;
  color?: string;
}

export interface PieChartProps {
  data: PieData[];
  title?: string;
  description?: string;
  size?: number;
  showLabels?: boolean;
  showValues?: boolean;
  showLegend?: boolean;
  animationDuration?: number;
  className?: string;
  innerRadius?: number;
  hoverEffect?: boolean;
}

const defaultColors = [
  '#00f0ff', // cyan
  '#9d00ff', // purple
  '#ff0080', // pink
  '#f0ff00', // yellow
  '#00ff88', // green
  '#ff6b00', // orange
  '#0088ff', // blue
  '#ff0088', // magenta
];

const PieChart: React.FC<PieChartProps> = ({
  data,
  title,
  description,
  size = 300,
  showLabels = true,
  showValues = true,
  showLegend = true,
  animationDuration = 0.8,
  className,
  innerRadius = 0,
  hoverEffect = true,
}) => {
  const total = useMemo(() => {
    return data.reduce((sum, item) => sum + item.value, 0);
  }, [data]);

  const segments = useMemo(() => {
    let currentAngle = -90;
    return data.map((item, index) => {
      const percentage = (item.value / total) * 100;
      const angle = (item.value / total) * 360;
      const startAngle = currentAngle;
      const endAngle = currentAngle + angle;
      currentAngle = endAngle;

      return {
        ...item,
        percentage,
        angle,
        startAngle,
        endAngle,
        color: item.color || defaultColors[index % defaultColors.length],
      };
    });
  }, [data, total]);

  const getCoordinates = (angle: number, radius: number) => {
    const radian = (angle * Math.PI) / 180;
    return {
      x: 50 + radius * Math.cos(radian),
      y: 50 + radius * Math.sin(radian),
    };
  };

  const getPath = (segment: any) => {
    const radius = innerRadius > 0 ? 50 : 50;
    const inner = innerRadius > 0 ? (innerRadius / 100) * 50 : 0;

    const start = getCoordinates(segment.startAngle, radius);
    const end = getCoordinates(segment.endAngle, radius);
    const startInner = getCoordinates(segment.startAngle, inner);
    const endInner = getCoordinates(segment.endAngle, inner);

    if (innerRadius > 0) {
      // Donut chart
      return `
        M ${start.x} ${start.y}
        A ${radius} ${radius} 0 ${segment.angle > 180 ? 1 : 0} 1 ${end.x} ${end.y}
        L ${endInner.x} ${endInner.y}
        A ${inner} ${inner} 0 ${segment.angle > 180 ? 1 : 0} 0 ${startInner.x} ${startInner.y}
        Z
      `;
    }

    // Pie chart
    return `
      M 50 50
      L ${start.x} ${start.y}
      A ${radius} ${radius} 0 ${segment.angle > 180 ? 1 : 0} 1 ${end.x} ${end.y}
      Z
    `;
  };

  return (
    <div className={cn('flex items-center gap-8', className)}>
      <div className="flex-shrink-0">
        {(title || description) && (
          <div className="mb-6">
            {title && (
              <h3 className="text-xl font-bold text-white mb-2">{title}</h3>
            )}
            {description && (
              <p className="text-sm text-gray-400">{description}</p>
            )}
          </div>
        )}

        <div style={{ width: size, height: size }} className="relative">
          <svg viewBox="0 0 100 100" className="w-full h-full">
            {segments.map((segment, index) => (
              <motion.g
                key={index}
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{
                  duration: animationDuration,
                  delay: index * 0.1,
                  ease: [0.25, 0.4, 0.25, 1],
                }}
              >
                <motion.path
                  d={getPath(segment)}
                  fill={segment.color}
                  className={cn(
                    'transition-opacity',
                    hoverEffect && 'hover:opacity-80 cursor-pointer'
                  )}
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: animationDuration, delay: index * 0.1 }}
                />
              </motion.g>
            ))}

            {/* Center text for donut chart */}
            {innerRadius > 0 && (
              <text
                x="50"
                y="50"
                textAnchor="middle"
                dominantBaseline="middle"
                className="fill-white text-lg font-bold"
              >
                {total}
              </text>
            )}
          </svg>

          {/* Labels overlay */}
          {showLabels && (
            <div className="absolute inset-0">
              {segments.map((segment, index) => {
                const labelAngle = (segment.startAngle + segment.endAngle) / 2;
                const labelRadius = 65;
                const coords = getCoordinates(labelAngle, labelRadius);

                return (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: animationDuration + index * 0.1 }}
                    className="absolute text-xs"
                    style={{
                      left: `${coords.x}%`,
                      top: `${coords.y}%`,
                      transform: 'translate(-50%, -50%)',
                    }}
                  >
                    <div className="bg-gray-900/90 px-2 py-1 rounded whitespace-nowrap">
                      {segment.label}
                      {showValues && (
                        <span className="ml-1 font-semibold">
                          {segment.percentage.toFixed(1)}%
                        </span>
                      )}
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Legend */}
      {showLegend && (
        <div className="flex flex-col gap-3">
          {segments.map((segment, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: animationDuration + index * 0.1 }}
              className="flex items-center gap-3"
            >
              <div
                className="w-4 h-4 rounded-sm flex-shrink-0"
                style={{ backgroundColor: segment.color }}
              />
              <div className="flex flex-col">
                <span className="text-sm text-white">{segment.label}</span>
                <span className="text-xs text-gray-400">
                  {segment.value} ({segment.percentage.toFixed(1)}%)
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

export default PieChart;
