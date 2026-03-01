'use client';

import React from 'react';

// 简单的图表组件占位符

export interface ChartDataPoint {
  label: string;
  value: number;
}

export interface TimeSeriesData {
  date: string;
  value: number;
}

export interface BarChartProps {
  data: ChartDataPoint[];
  className?: string;
}

export interface LineChartProps {
  data: TimeSeriesData[];
  className?: string;
}

export interface PieChartProps {
  data: ChartDataPoint[];
  className?: string;
}

export interface StatCardProps {
  title: string;
  value: string | number;
  change?: number;
  className?: string;
}

export interface StatsGridProps {
  stats: StatCardProps[];
  className?: string;
}

export interface DashboardOverviewProps {
  className?: string;
}

export const BarChart: React.FC<BarChartProps> = ({ data, className = '' }) => {
  const maxValue = Math.max(...data.map(d => d.value));
  
  return (
    <div className={`p-4 ${className}`}>
      <div className="space-y-2">
        {data.map((item, index) => (
          <div key={index} className="flex items-center gap-2">
            <span className="w-20 text-sm text-gray-400">{item.label}</span>
            <div className="flex-1 h-4 bg-cyber-muted rounded overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-cyber-cyan to-cyber-purple"
                style={{ width: `${(item.value / maxValue) * 100}%` }}
              />
            </div>
            <span className="text-sm text-cyber-cyan">{item.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export const LineChart: React.FC<LineChartProps> = ({ data, className = '' }) => {
  return (
    <div className={`p-4 ${className}`}>
      <div className="text-gray-400 text-sm">
        {data.length} data points
      </div>
    </div>
  );
};

export const PieChart: React.FC<PieChartProps> = ({ data, className = '' }) => {
  const total = data.reduce((sum, d) => sum + d.value, 0);
  
  return (
    <div className={`p-4 ${className}`}>
      <div className="space-y-2">
        {data.map((item, index) => (
          <div key={index} className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-cyber-cyan" />
            <span className="text-sm text-gray-400">{item.label}</span>
            <span className="text-sm text-cyber-cyan">
              {((item.value / total) * 100).toFixed(1)}%
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export const StatCard: React.FC<StatCardProps> = ({ 
  title, 
  value, 
  change, 
  className = '' 
}) => {
  return (
    <div className={`p-4 bg-cyber-muted rounded-lg ${className}`}>
      <div className="text-sm text-gray-400 mb-1">{title}</div>
      <div className="text-2xl font-bold text-white">{value}</div>
      {change !== undefined && (
        <div className={`text-sm ${change >= 0 ? 'text-green-400' : 'text-red-400'}`}>
          {change >= 0 ? '+' : ''}{change}%
        </div>
      )}
    </div>
  );
};

export const StatsGrid: React.FC<StatsGridProps> = ({ stats, className = '' }) => {
  return (
    <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 ${className}`}>
      {stats.map((stat, index) => (
        <StatCard key={index} {...stat} />
      ))}
    </div>
  );
};

export const DashboardOverview: React.FC<DashboardOverviewProps> = ({ className = '' }) => {
  return (
    <div className={`space-y-6 ${className}`}>
      <h2 className="text-xl font-bold text-white">Dashboard Overview</h2>
      <StatsGrid stats={[
        { title: 'Total Views', value: '12,345', change: 12.5 },
        { title: 'Unique Visitors', value: '3,456', change: 8.2 },
        { title: 'Avg. Session', value: '4m 32s', change: -2.1 },
        { title: 'Bounce Rate', value: '42.3%', change: 3.4 },
      ]} />
    </div>
  );
};
