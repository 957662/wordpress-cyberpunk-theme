/**
 * 分析仪表盘网格组件
 * CyberPress Platform
 */

'use client';

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import DataVisualizationCard from './DataVisualizationCard';

interface MetricData {
  title: string;
  value: string | number;
  change?: number;
  changeType?: 'increase' | 'decrease' | 'neutral';
  chartData?: Array<{ timestamp: number; value: number }>;
  chartColor?: string;
  icon?: React.ReactNode;
  description?: string;
}

interface AnalyticsGridProps {
  metrics: MetricData[];
  layout?: 'grid' | 'list';
  columns?: 2 | 3 | 4;
  loading?: boolean;
  className?: string;
}

export const AnalyticsGrid: React.FC<AnalyticsGridProps> = ({
  metrics,
  layout = 'grid',
  columns = 3,
  loading = false,
  className = '',
}) => {
  const [chartDataMap, setChartDataMap] = useState<Map<number, Array<{ timestamp: number; value: number }>>>(new Map());

  useEffect(() => {
    // 生成模拟数据
    const newDataMap = new Map<number, Array<{ timestamp: number; value: number }>>();

    metrics.forEach((metric, index) => {
      const data: Array<{ timestamp: number; value: number }> = [];
      const now = Date.now();

      for (let i = 11; i >= 0; i--) {
        const timestamp = now - i * 60 * 60 * 1000; // 过去12小时
        const baseValue = typeof metric.value === 'number' ? metric.value : 50;
        const randomValue = baseValue + (Math.random() - 0.5) * 20;
        data.push({
          timestamp,
          value: Math.max(0, randomValue),
        });
      }

      newDataMap.set(index, data);
    });

    setChartDataMap(newDataMap);
  }, [metrics]);

  const getGridColumns = () => {
    switch (columns) {
      case 2:
        return 'grid-cols-1 md:grid-cols-2';
      case 3:
        return 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3';
      case 4:
        return 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4';
      default:
        return 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3';
    }
  };

  if (loading) {
    return (
      <div className={`grid ${getGridColumns()} gap-6 ${className}`}>
        {[...Array(columns)].map((_, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-cyber-dark/50 backdrop-blur-sm border border-cyber-cyan/20 rounded-lg p-6"
          >
            <div className="animate-pulse">
              <div className="h-4 bg-cyber-cyan/20 rounded w-1/3 mb-4"></div>
              <div className="h-8 bg-cyber-cyan/20 rounded w-1/2 mb-2"></div>
              <div className="h-20 bg-cyber-cyan/20 rounded"></div>
            </div>
          </motion.div>
        ))}
      </div>
    );
  }

  if (layout === 'list') {
    return (
      <div className={`space-y-4 ${className}`}>
        {metrics.map((metric, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <DataVisualizationCard
              {...metric}
              chartData={chartDataMap.get(index) || metric.chartData}
              className="w-full"
            />
          </motion.div>
        ))}
      </div>
    );
  }

  return (
    <div className={`grid ${getGridColumns()} gap-6 ${className}`}>
      {metrics.map((metric, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.05 }}
        >
          <DataVisualizationCard
            {...metric}
            chartData={chartDataMap.get(index) || metric.chartData}
          />
        </motion.div>
      ))}
    </div>
  );
};

export default AnalyticsGrid;
