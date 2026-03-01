'use client';

import React from 'react';

interface DataPoint {
  label: string;
  value: number;
  color: string;
}

interface DonutChartProps {
  data: DataPoint[];
  size?: number;
  thickness?: number;
  showLegend?: boolean;
  showPercentage?: boolean;
  className?: string;
}

export function DonutChart({
  data,
  size = 200,
  thickness = 40,
  showLegend = true,
  showPercentage = true,
  className = '',
}: DonutChartProps) {
  const total = data.reduce((sum, point) => sum + point.value, 0);
  let currentAngle = -90;

  const segments = data.map((point) => {
    const percentage = (point.value / total) * 100;
    const angle = (percentage / 100) * 360;

    const startX =
      size / 2 + (size / 2 - thickness / 2) * Math.cos((currentAngle * Math.PI) / 180);
    const startY =
      size / 2 + (size / 2 - thickness / 2) * Math.sin((currentAngle * Math.PI) / 180);
    const endX =
      size / 2 + (size / 2 - thickness / 2) * Math.cos(((currentAngle + angle) * Math.PI) / 180);
    const endY =
      size / 2 + (size / 2 - thickness / 2) * Math.sin(((currentAngle + angle) * Math.PI) / 180);

    const largeArcFlag = angle > 180 ? 1 : 0;

    const path = `
      M ${size / 2} ${size / 2}
      L ${startX} ${startY}
      A ${size / 2 - thickness / 2} ${size / 2 - thickness / 2} 0 ${largeArcFlag} 1 ${endX} ${endY}
      Z
    `;

    currentAngle += angle;

    return { ...point, percentage, path };
  });

  return (
    <div className={`flex items-center gap-8 ${className}`}>
      <svg width={size} height={size} className="transform -rotate-90">
        {segments.map((segment, index) => (
          <path
            key={index}
            d={segment.path}
            fill={segment.color}
            stroke="#1a1a2e"
            strokeWidth="2"
            className="hover:opacity-80 transition-opacity cursor-pointer"
          >
            <title>
              {segment.label}: {segment.value} ({segment.percentage.toFixed(1)}%)
            </title>
          </path>
        ))}

        {/* Center circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={size / 2 - thickness}
          fill="#0a0a0f"
        />
      </svg>

      {showLegend && (
        <div className="space-y-2">
          {segments.map((segment, index) => (
            <div key={index} className="flex items-center gap-2">
              <div
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: segment.color }}
              />
              <span className="text-cyan-300 text-sm">{segment.label}</span>
              {showPercentage && (
                <span className="text-cyan-600 text-sm ml-auto">
                  {segment.percentage.toFixed(1)}%
                </span>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
