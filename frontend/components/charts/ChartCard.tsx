'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell,
} from 'recharts';
import { cn } from '@/lib/utils';

export type ChartType = 'bar' | 'line' | 'pie' | 'area';

export interface ChartData {
  name: string;
  value: number;
  [key: string]: string | number;
}

export interface ChartCardProps {
  title: string;
  type: ChartType;
  data: ChartData[];
  color?: 'cyan' | 'purple' | 'pink' | 'green' | 'yellow';
  size?: 'sm' | 'md' | 'lg';
  showLegend?: boolean;
  showGrid?: boolean;
  className?: string;
}

const colorPalette = {
  cyan: ['#00f0ff', '#00c0cc', '#009099', '#006066', '#003033'],
  purple: ['#9d00ff', '#7d00cc', '#5d0099', '#3d0066', '#1d0033'],
  pink: ['#ff0080', '#cc0066', '#99004d', '#660033', '#33001a'],
  green: ['#00ff88', '#00cc6a', '#00994d', '#006633', '#003319'],
  yellow: ['#f0ff00', '#c0cc00', '#909900', '#606600', '#303300'],
};

const sizeClasses = {
  sm: 'h-64',
  md: 'h-80',
  lg: 'h-96',
};

export const ChartCard: React.FC<ChartCardProps> = ({
  title,
  type,
  data,
  color = 'cyan',
  size = 'md',
  showLegend = true,
  showGrid = true,
  className,
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const colors = colorPalette[color];

  const renderChart = () => {
    const commonProps = {
      data,
      margin: { top: 5, right: 30, left: 20, bottom: 5 },
    };

    switch (type) {
      case 'bar':
        return (
          <BarChart {...commonProps}>
            {showGrid && <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" />}
            <XAxis dataKey="name" stroke="#888888" />
            <YAxis stroke="#888888" />
            <Tooltip
              contentStyle={{
                backgroundColor: '#1a1a2e',
                border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: '8px',
              }}
            />
            {showLegend && <Legend />}
            <Bar dataKey="value" radius={[8, 8, 0, 0]}>
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
              ))}
            </Bar>
          </BarChart>
        );

      case 'line':
        return (
          <LineChart {...commonProps}>
            {showGrid && <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" />}
            <XAxis dataKey="name" stroke="#888888" />
            <YAxis stroke="#888888" />
            <Tooltip
              contentStyle={{
                backgroundColor: '#1a1a2e',
                border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: '8px',
              }}
            />
            {showLegend && <Legend />}
            <Line
              type="monotone"
              dataKey="value"
              stroke={colors[0]}
              strokeWidth={3}
              dot={{ fill: colors[0], r: 6 }}
              activeDot={{ r: 8 }}
            />
          </LineChart>
        );

      case 'area':
        return (
          <AreaChart {...commonProps}>
            {showGrid && <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" />}
            <XAxis dataKey="name" stroke="#888888" />
            <YAxis stroke="#888888" />
            <Tooltip
              contentStyle={{
                backgroundColor: '#1a1a2e',
                border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: '8px',
              }}
            />
            {showLegend && <Legend />}
            <Area
              type="monotone"
              dataKey="value"
              stroke={colors[0]}
              fill={colors[0]}
              fillOpacity={0.6}
            />
          </AreaChart>
        );

      case 'pie':
        return (
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
              outerRadius={100}
              fill="#8884d8"
              dataKey="value"
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{
                backgroundColor: '#1a1a2e',
                border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: '8px',
              }}
            />
          </PieChart>
        );

      default:
        return null;
    }
  };

  return (
    <motion.div
      className={cn(
        'relative bg-gray-800/50 backdrop-blur-sm rounded-xl border border-white/10',
        'overflow-hidden transition-all duration-300',
        'hover:shadow-xl',
        isHovered && 'scale-[1.02]',
        className
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Header */}
      <div className="p-6 border-b border-white/10">
        <h3 className="text-lg font-semibold text-white">{title}</h3>
      </div>

      {/* Chart */}
      <div className={cn('p-6', sizeClasses[size])}>
        <ResponsiveContainer width="100%" height="100%">
          {renderChart()}
        </ResponsiveContainer>
      </div>

      {/* Hover Effect */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 to-purple-500/5 opacity-0 pointer-events-none"
        animate={{ opacity: isHovered ? 1 : 0 }}
        transition={{ duration: 0.3 }}
      />

      {/* Corner Accents */}
      <motion.div
        className="absolute top-0 left-0 w-2 h-2 border-l-2 border-t-2 border-cyan-400"
        animate={{ opacity: isHovered ? 1 : 0.3 }}
      />
      <motion.div
        className="absolute bottom-0 right-0 w-2 h-2 border-r-2 border-b-2 border-purple-400"
        animate={{ opacity: isHovered ? 1 : 0.3 }}
      />
    </motion.div>
  );
};

export default ChartCard;
