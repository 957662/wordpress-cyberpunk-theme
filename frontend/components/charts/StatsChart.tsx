'use client';

import React, { useMemo } from 'react';
import { motion } from 'framer-motion';

interface ChartData {
  label: string;
  value: number;
  color?: string;
}

interface StatsChartProps {
  data: ChartData[];
  type?: 'bar' | 'line' | 'pie' | 'area';
  title?: string;
  showLegend?: boolean;
  showValues?: boolean;
  height?: number;
  className?: string;
  color?: string;
}

export function StatsChart({
  data,
  type = 'bar',
  title,
  showLegend = true,
  showValues = true,
  height = 300,
  className = '',
  color = '#00f0ff'
}: StatsChartProps) {
  const maxValue = useMemo(() => Math.max(...data.map(d => d.value)), [data]);
  const chartHeight = height - 60; // 留出标签空间

  // 柱状图
  if (type === 'bar') {
    return (
      <div className={\`bg-gray-900/50 border border-gray-800 rounded-lg p-6 \${className}\`}>
        {title && (
          <h3 className="text-lg font-semibold text-white mb-4">{title}</h3>
        )}

        <div style={{ height: \`\${chartHeight}px\` }} className="flex items-end justify-around gap-2">
          {data.map((item, index) => {
            const barHeight = (item.value / maxValue) * chartHeight;
            const barColor = item.color || color;

            return (
              <motion.div
                key={item.label}
                initial={{ height: 0 }}
                animate={{ height: barHeight }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="flex flex-col items-center flex-1 max-w-16"
              >
                <div className="relative w-full flex-1 flex items-end">
                  <motion.div
                    initial={{ scaleY: 0 }}
                    animate={{ scaleY: 1 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    className="w-full bg-gradient-to-t from-cyan-500/20 to-cyan-500 rounded-t-lg relative"
                    style={{ backgroundColor: barColor }}
                  >
                    {showValues && (
                      <span className="absolute -top-6 left-1/2 -translate-x-1/2 text-xs text-white font-medium">
                        {item.value}
                      </span>
                    )}
                  </motion.div>
                </div>
                <span className="text-xs text-gray-400 mt-2 text-center truncate w-full">
                  {item.label}
                </span>
              </motion.div>
            );
          })}
        </div>

        {showLegend && (
          <div className="flex flex-wrap gap-4 mt-4 pt-4 border-t border-gray-800">
            {data.map((item) => (
              <div key={item.label} className="flex items-center gap-2">
                <div
                  className="w-3 h-3 rounded"
                  style={{ backgroundColor: item.color || color }}
                />
                <span className="text-sm text-gray-400">{item.label}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }

  // 饼图
  if (type === 'pie') {
    const total = data.reduce((sum, item) => sum + item.value, 0);
    let currentAngle = 0;

    const segments = data.map((item) => {
      const percentage = (item.value / total) * 100;
      const angle = (item.value / total) * 360;
      const segment = {
        ...item,
        percentage,
        angle,
        startAngle: currentAngle,
        endAngle: currentAngle + angle
      };
      currentAngle += angle;
      return segment;
    });

    return (
      <div className={\`bg-gray-900/50 border border-gray-800 rounded-lg p-6 \${className}\`}>
        {title && (
          <h3 className="text-lg font-semibold text-white mb-4">{title}</h3>
        )}

        <div className="flex items-center justify-center">
          <svg width="200" height="200" viewBox="-1 -1 2 2" style={{ transform: 'rotate(-90deg)' }}>
            {segments.map((segment, index) => {
              const x1 = Math.cos(segment.startAngle * Math.PI / 180);
              const y1 = Math.sin(segment.startAngle * Math.PI / 180);
              const x2 = Math.cos(segment.endAngle * Math.PI / 180);
              const y2 = Math.sin(segment.endAngle * Math.PI / 180);
              const largeArc = segment.angle > 180 ? 1 : 0;

              return (
                <motion.path
                  key={segment.label}
                  d={\`M 0 0 L \${x1} \${y1} A 1 1 0 \${largeArc} 1 \${x2} \${y2} Z\`}
                  fill={segment.color || color}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                  className="hover:opacity-80 transition-opacity cursor-pointer"
                >
                  <title>
                    {segment.label}: {segment.value} ({segment.percentage.toFixed(1)}%)
                  </title>
                </motion.path>
              );
            })}
          </svg>
        </div>

        {showLegend && (
          <div className="flex flex-wrap gap-4 mt-4 justify-center">
            {segments.map((segment) => (
              <div key={segment.label} className="flex items-center gap-2">
                <div
                  className="w-3 h-3 rounded"
                  style={{ backgroundColor: segment.color || color }}
                />
                <span className="text-sm text-gray-400">
                  {segment.label} ({segment.percentage.toFixed(1)}%)
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }

  // 折线图
  if (type === 'line') {
    const points = data.map((item, index) => {
      const x = (index / (data.length - 1)) * 100;
      const y = 100 - (item.value / maxValue) * 100;
      return \`\${x},\${y}\`;
    }).join(' ');

    const areaPoints = \`0,100 \${points} 100,100\`;

    return (
      <div className={\`bg-gray-900/50 border border-gray-800 rounded-lg p-6 \${className}\`}>
        {title && (
          <h3 className="text-lg font-semibold text-white mb-4">{title}</h3>
        )}

        <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="w-full h-full">
          <defs>
            <linearGradient id="gradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor={color} stopOpacity="0.3" />
              <stop offset="100%" stopColor={color} stopOpacity="0" />
            </linearGradient>
          </defs>

          {/* 区域 */}
          <polygon
            points={areaPoints}
            fill="url(#gradient)"
            className="animate-pulse"
          />

          {/* 线条 */}
          <motion.polyline
            points={points}
            fill="none"
            stroke={color}
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 1 }}
            style={{
              strokeDasharray: '1 0',
              vectorEffect: 'non-scaling-stroke'
            }}
          />

          {/* 数据点 */}
          {data.map((item, index) => {
            const x = (index / (data.length - 1)) * 100;
            const y = 100 - (item.value / maxValue) * 100;

            return (
              <motion.circle
                key={item.label}
                cx={x}
                cy={y}
                r="3"
                fill={color}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
              >
                <title>{item.label}: {item.value}</title>
              </motion.circle>
            );
          })}
        </svg>

        {/* X 轴标签 */}
        <div className="flex justify-around mt-2">
          {data.map((item) => (
            <span key={item.label} className="text-xs text-gray-400">
              {item.label}
            </span>
          ))}
        </div>
      </div>
    );
  }

  return null;
}

// 统计卡片
interface StatCardProps {
  title: string;
  value: number | string;
  icon?: React.ReactNode;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  color?: string;
  className?: string;
}

export function StatCard({
  title,
  value,
  icon,
  trend,
  color = '#00f0ff',
  className = ''
}: StatCardProps) {
  return (
    <motion.div
      whileHover={{ scale: 1.02, y: -2 }}
      className={\`bg-gray-900/50 border border-gray-800 rounded-lg p-6 relative overflow-hidden group \${className}\`}
    >
      {/* 背景装饰 */}
      <div
        className="absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity"
        style={{ backgroundColor: color }}
      />

      <div className="relative">
        <div className="flex items-start justify-between mb-4">
          <div>
            <p className="text-sm text-gray-400 mb-1">{title}</p>
            <motion.p
              key={value}
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="text-3xl font-bold text-white"
            >
              {value}
            </motion.p>
          </div>

          {icon && (
            <div className="p-2 rounded-lg" style={{ backgroundColor: \`\${color}20\` }}>
              <div className="text-xl" style={{ color }}>
                {icon}
              </div>
            </div>
          )}
        </div>

        {trend && (
          <div className={\`flex items-center gap-1 text-sm \${trend.isPositive ? 'text-green-400' : 'text-red-400'}\`}>
            <span>{trend.isPositive ? '↑' : '↓'}</span>
            <span>{trend.value}%</span>
            <span className="text-gray-500">vs 上月</span>
          </div>
        )}
      </div>
    </motion.div>
  );
}

// 多统计卡片网格
interface StatsGridProps {
  stats: StatCardProps[];
  columns?: 2 | 3 | 4;
  className?: string;
}

export function StatsGrid({ stats, columns = 4, className = '' }: StatsGridProps) {
  const gridCols = {
    2: 'grid-cols-1 md:grid-cols-2',
    3: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
    4: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4'
  };

  return (
    <div className={\`grid \${gridCols[columns]} gap-4 \${className}\`}>
      {stats.map((stat, index) => (
        <motion.div
          key={stat.title}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
        >
          <StatCard {...stat} />
        </motion.div>
      ))}
    </div>
  );
}

export default StatsChart;
