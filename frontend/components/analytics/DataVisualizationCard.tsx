/**
 * 数据可视化卡片组件
 * CyberPress Platform
 */

'use client';

import React from 'react';
import { motion } from 'framer-motion';
import RealTimeChart from './RealTimeChart';

interface DataVisualizationCardProps {
  title: string;
  value: string | number;
  change?: number;
  changeType?: 'increase' | 'decrease' | 'neutral';
  chartData?: Array<{ timestamp: number; value: number }>;
  chartColor?: string;
  icon?: React.ReactNode;
  description?: string;
  footer?: React.ReactNode;
  className?: string;
}

export const DataVisualizationCard: React.FC<DataVisualizationCardProps> = ({
  title,
  value,
  change,
  changeType = 'neutral',
  chartData,
  chartColor = '#00f0ff',
  icon,
  description,
  footer,
  className = '',
}) => {
  const getChangeColor = () => {
    switch (changeType) {
      case 'increase':
        return 'text-cyber-green';
      case 'decrease':
        return 'text-cyber-pink';
      default:
        return 'text-gray-400';
    }
  };

  const getChangeIcon = () => {
    switch (changeType) {
      case 'increase':
        return '↑';
      case 'decrease':
        return '↓';
      default:
        return '→';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`bg-cyber-dark/50 backdrop-blur-sm border border-cyber-cyan/20 rounded-lg p-6 ${className}`}
    >
      {/* 头部 */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            {icon && (
              <div className="w-10 h-10 rounded-lg bg-cyber-cyan/10 flex items-center justify-center text-cyber-cyan">
                {icon}
              </div>
            )}
            <h3 className="text-lg font-semibold text-white">{title}</h3>
          </div>
          {description && (
            <p className="text-sm text-gray-400">{description}</p>
          )}
        </div>
      </div>

      {/* 数值和变化 */}
      <div className="mb-4">
        <div className="flex items-baseline gap-3">
          <span className="text-3xl font-bold text-white">{value}</span>
          {change !== undefined && (
            <motion.span
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              className={`text-sm font-medium ${getChangeColor()}`}
            >
              {getChangeIcon()} {Math.abs(change)}%
            </motion.span>
          )}
        </div>
      </div>

      {/* 图表 */}
      {chartData && chartData.length > 0 && (
        <div className="mb-4">
          <RealTimeChart
            data={chartData}
            maxDataPoints={12}
            height={120}
            color={chartColor}
            showGrid={false}
            showTooltip={true}
          />
        </div>
      )}

      {/* 底部 */}
      {footer && (
        <div className="pt-4 border-t border-cyber-cyan/10">
          {footer}
        </div>
      )}
    </motion.div>
  );
};

export default DataVisualizationCard;
