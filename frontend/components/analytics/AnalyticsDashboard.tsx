/**
 * 数据可视化仪表板
 * 支持多种图表类型、实时数据更新、自定义布局
 */

'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  TrendingUp,
  TrendingDown,
  Users,
  Eye,
  MousePointer,
  Clock,
  BarChart3,
  PieChart,
  LineChart,
  Activity,
  Download,
  RefreshCw,
  Settings,
  Maximize2,
  Calendar,
  Filter,
  X,
} from 'lucide-react';
import { cn } from '@/lib/utils';

export type ChartType = 'line' | 'bar' | 'pie' | 'area' | 'scatter' | 'heatmap';
export type TimeRange = '1h' | '24h' | '7d' | '30d' | '90d' | '1y';
export type MetricType = 'views' | 'users' | 'sessions' | 'bounce-rate' | 'avg-duration';

export interface DataPoint {
  timestamp: number;
  value: number;
  label?: string;
  metadata?: Record<string, any>;
}

export interface MetricCard {
  id: string;
  title: string;
  value: number | string;
  change: number;
  changeType: 'increase' | 'decrease' | 'neutral';
  icon: React.ReactNode;
  unit?: string;
  trend?: DataPoint[];
}

export interface ChartWidget {
  id: string;
  title: string;
  type: ChartType;
  data: DataPoint[];
  height?: number;
  loading?: boolean;
  error?: string;
  config?: {
    showLegend?: boolean;
    showTooltip?: boolean;
    showGrid?: boolean;
    colors?: string[];
  };
}

export interface DashboardConfig {
  timeRange: TimeRange;
  autoRefresh: boolean;
  refreshInterval: number;
  layout: 'grid' | 'list' | 'custom';
  showMetrics: boolean;
  showCharts: boolean;
}

export interface AnalyticsDashboardProps {
  metrics?: MetricCard[];
  charts?: ChartWidget[];
  config?: Partial<DashboardConfig>;
  onTimeRangeChange?: (range: TimeRange) => void;
  onRefresh?: () => void;
  onExport?: (format: 'csv' | 'json' | 'pdf') => void;
  onMetricClick?: (metricId: string) => void;
  onChartClick?: (chartId: string) => void;
  className?: string;
}

export function AnalyticsDashboard({
  metrics = [],
  charts = [],
  config: userConfig = {},
  onTimeRangeChange,
  onRefresh,
  onExport,
  onMetricClick,
  onChartClick,
  className,
}: AnalyticsDashboardProps) {
  const [config, setConfig] = useState<DashboardConfig>({
    timeRange: '7d',
    autoRefresh: true,
    refreshInterval: 30000,
    layout: 'grid',
    showMetrics: true,
    showCharts: true,
    ...userConfig,
  });

  const [isRefreshing, setIsRefreshing] = useState(false);
  const [fullscreenChart, setFullscreenChart] = useState<string | null>(null);
  const [selectedFilters, setSelectedFilters] = useState<string[]>([]);

  // 自动刷新
  useEffect(() => {
    if (!config.autoRefresh) return;

    const timer = setInterval(() => {
      handleRefresh();
    }, config.refreshInterval);

    return () => clearInterval(timer);
  }, [config.autoRefresh, config.refreshInterval]);

  // 刷新数据
  const handleRefresh = async () => {
    if (isRefreshing) return;

    setIsRefreshing(true);

    try {
      if (onRefresh) {
        await onRefresh();
      }
    } catch (error) {
      console.error('Failed to refresh dashboard:', error);
    } finally {
      setTimeout(() => setIsRefreshing(false), 1000);
    }
  };

  // 更改时间范围
  const handleTimeRangeChange = (range: TimeRange) => {
    setConfig(prev => ({ ...prev, timeRange: range }));
    if (onTimeRangeChange) {
      onTimeRangeChange(range);
    }
  };

  // 格式化数字
  const formatNumber = (num: number): string => {
    if (num >= 1000000) {
      return `${(num / 1000000).toFixed(1)}M`;
    }
    if (num >= 1000) {
      return `${(num / 1000).toFixed(1)}K`;
    }
    return num.toString();
  };

  // 计算指标卡片
  const computedMetrics = useMemo(() => {
    if (metrics.length > 0) return metrics;

    // 默认示例数据
    return [
      {
        id: 'views',
        title: 'Total Views',
        value: formatNumber(125430),
        change: 12.5,
        changeType: 'increase',
        icon: <Eye className="text-cyber-cyan" />,
        unit: 'views',
      },
      {
        id: 'users',
        title: 'Active Users',
        value: formatNumber(8432),
        change: 8.3,
        changeType: 'increase',
        icon: <Users className="text-cyber-purple" />,
        unit: 'users',
      },
      {
        id: 'sessions',
        title: 'Sessions',
        value: formatNumber(15432),
        change: -2.1,
        changeType: 'decrease',
        icon: <Activity className="text-cyber-pink" />,
        unit: 'sessions',
      },
      {
        id: 'duration',
        title: 'Avg. Duration',
        value: '4:32',
        change: 5.7,
        changeType: 'increase',
        icon: <Clock className="text-cyber-green" />,
        unit: 'minutes',
      },
    ];
  }, [metrics]);

  // 计算图表
  const computedCharts = useMemo(() => {
    if (charts.length > 0) return charts;

    // 默认示例数据
    const generateData = (count: number, min: number, max: number): DataPoint[] => {
      return Array.from({ length: count }, (_, i) => ({
        timestamp: Date.now() - (count - i) * 3600000,
        value: Math.floor(Math.random() * (max - min + 1)) + min,
        label: new Date(Date.now() - (count - i) * 3600000).toLocaleDateString(),
      }));
    };

    return [
      {
        id: 'traffic',
        title: 'Traffic Overview',
        type: 'line',
        data: generateData(24, 1000, 5000),
        height: 300,
      },
      {
        id: 'sources',
        title: 'Traffic Sources',
        type: 'pie',
        data: [
          { timestamp: 1, value: 45, label: 'Direct' },
          { timestamp: 2, value: 30, label: 'Organic' },
          { timestamp: 3, value: 15, label: 'Referral' },
          { timestamp: 4, value: 10, label: 'Social' },
        ],
        height: 300,
      },
      {
        id: 'devices',
        title: 'Device Usage',
        type: 'bar',
        data: [
          { timestamp: 1, value: 65, label: 'Desktop' },
          { timestamp: 2, value: 25, label: 'Mobile' },
          { timestamp: 3, value: 10, label: 'Tablet' },
        ],
        height: 300,
      },
    ];
  }, [charts]);

  // 渲染指标卡片
  const renderMetricCard = (metric: MetricCard) => (
    <motion.div
      key={metric.id}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.02 }}
      onClick={() => onMetricClick?.(metric.id)}
      className={cn(
        'relative p-6 bg-cyber-dark border border-cyber-cyan/30 rounded-lg',
        'hover:border-cyber-cyan/50 hover:shadow-lg hover:shadow-cyber-cyan/20',
        'cursor-pointer transition-all duration-300'
      )}
    >
      <div className="flex items-start justify-between mb-4">
        <div className="p-3 bg-cyber-cyan/20 rounded-lg">
          {metric.icon}
        </div>
        <div
          className={cn(
            'flex items-center gap-1 text-sm font-medium',
            metric.changeType === 'increase' && 'text-green-500',
            metric.changeType === 'decrease' && 'text-red-500',
            metric.changeType === 'neutral' && 'text-gray-500'
          )}
        >
          {metric.changeType === 'increase' && <TrendingUp size={16} />}
          {metric.changeType === 'decrease' && <TrendingDown size={16} />}
          {Math.abs(metric.change)}%
        </div>
      </div>

      <div>
        <p className="text-gray-400 text-sm mb-1">{metric.title}</p>
        <p className="text-3xl font-bold text-white">
          {typeof metric.value === 'number' ? formatNumber(metric.value) : metric.value}
        </p>
        {metric.unit && (
          <p className="text-xs text-gray-500 mt-1">{metric.unit}</p>
        )}
      </div>

      {/* 迷你趋势图 */}
      {metric.trend && metric.trend.length > 0 && (
        <div className="absolute bottom-0 left-0 right-0 h-12 opacity-30">
          <svg viewBox="0 0 100 20" className="w-full h-full">
            <polyline
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              points={metric.trend.map((point, i) => {
                const x = (i / (metric.trend!.length - 1)) * 100;
                const y = 20 - (point.value / Math.max(...metric.trend!.map(p => p.value))) * 20;
                return `${x},${y}`;
              }).join(' ')}
            />
          </svg>
        </div>
      )}
    </motion.div>
  );

  // 渲染图表组件
  const renderChart = (chart: ChartWidget) => {
    const isFullscreen = fullscreenChart === chart.id;

    return (
      <motion.div
        key={chart.id}
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className={cn(
          'bg-cyber-dark border border-cyber-purple/30 rounded-lg overflow-hidden',
          isFullscreen && 'fixed inset-4 z-50 rounded-xl',
          'hover:border-cyber-purple/50 transition-all duration-300'
        )}
      >
        {/* 图表头部 */}
        <div className="flex items-center justify-between p-4 border-b border-cyber-purple/30">
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            {chart.type === 'line' && <LineChart size={20} className="text-cyber-purple" />}
            {chart.type === 'bar' && <BarChart3 size={20} className="text-cyber-purple" />}
            {chart.type === 'pie' && <PieChart size={20} className="text-cyber-purple" />}
            {chart.title}
          </h3>

          <div className="flex items-center gap-2">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => setFullscreenChart(isFullscreen ? null : chart.id)}
              className="p-2 hover:bg-cyber-purple/20 rounded-lg transition-colors"
              title={isFullscreen ? 'Exit Fullscreen' : 'Fullscreen'}
            >
              {isFullscreen ? <X size={18} /> : <Maximize2 size={18} />}
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => onChartClick?.(chart.id)}
              className="p-2 hover:bg-cyber-purple/20 rounded-lg transition-colors"
              title="View Details"
            >
              <Settings size={18} />
            </motion.button>
          </div>
        </div>

        {/* 图表内容 */}
        <div className="p-4" style={{ height: isFullscreen ? 'calc(100% - 80px)' : chart.height || 300 }}>
          {chart.loading ? (
            <div className="flex items-center justify-center h-full">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                className="w-12 h-12 border-4 border-cyber-purple border-t-transparent rounded-full"
              />
            </div>
          ) : chart.error ? (
            <div className="flex items-center justify-center h-full text-red-500">
              <p>{chart.error}</p>
            </div>
          ) : (
            <SimpleChart type={chart.type} data={chart.data} />
          )}
        </div>
      </motion.div>
    );
  };

  return (
    <div className={cn('p-6 bg-cyber-dark min-h-screen', className)}>
      {/* 头部控制栏 */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Analytics Dashboard</h1>
          <p className="text-gray-400">Monitor your performance and insights</p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {/* 时间范围选择 */}
          <div className="flex items-center gap-2 bg-cyber-muted rounded-lg p-1">
            {(['1h', '24h', '7d', '30d', '90d', '1y'] as TimeRange[]).map(range => (
              <button
                key={range}
                onClick={() => handleTimeRangeChange(range)}
                className={cn(
                  'px-4 py-2 text-sm font-medium rounded-md transition-all',
                  config.timeRange === range
                    ? 'bg-cyber-cyan text-cyber-dark'
                    : 'text-gray-400 hover:text-white hover:bg-cyber-cyan/10'
                )}
              >
                {range}
              </button>
            ))}
          </div>

          {/* 自动刷新开关 */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setConfig(prev => ({ ...prev, autoRefresh: !prev.autoRefresh }))}
            className={cn(
              'px-4 py-2 text-sm font-medium rounded-lg flex items-center gap-2',
              config.autoRefresh
                ? 'bg-green-500/20 text-green-500 border border-green-500/50'
                : 'bg-cyber-muted text-gray-400 border border-gray-700'
            )}
          >
            <Activity size={16} className={config.autoRefresh ? 'animate-pulse' : ''} />
            Auto
          </motion.button>

          {/* 刷新按钮 */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="p-2 bg-cyber-cyan/20 border border-cyber-cyan/50 rounded-lg text-cyber-cyan hover:bg-cyber-cyan/30 disabled:opacity-50"
          >
            <RefreshCw size={20} className={isRefreshing ? 'animate-spin' : ''} />
          </motion.button>

          {/* 导出按钮 */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => onExport?.('csv')}
            className="px-4 py-2 bg-cyber-purple text-white rounded-lg font-medium hover:bg-cyber-purple/80 flex items-center gap-2"
          >
            <Download size={18} />
            Export
          </motion.button>
        </div>
      </div>

      {/* 指标卡片网格 */}
      {config.showMetrics && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {computedMetrics.map(renderMetricCard)}
        </div>
      )}

      {/* 图表网格 */}
      {config.showCharts && (
        <div className={cn(
          'grid gap-6',
          computedCharts.length === 1 && 'grid-cols-1',
          computedCharts.length === 2 && 'grid-cols-1 lg:grid-cols-2',
          computedCharts.length >= 3 && 'grid-cols-1 lg:grid-cols-2 xl:grid-cols-3'
        )}>
          {computedCharts.map(renderChart)}
        </div>
      )}

      {/* 空状态 */}
      {!config.showMetrics && !config.showCharts && (
        <div className="flex flex-col items-center justify-center h-96 text-gray-400">
          <BarChart3 size={64} className="mb-4 opacity-50" />
          <p className="text-lg">No data to display</p>
          <p className="text-sm mt-2">Select metrics or charts to visualize</p>
        </div>
      )}
    </div>
  );
}

// 简单的图表组件
function SimpleChart({ type, data }: { type: ChartType; data: DataPoint[] }) {
  const colors = ['#00f0ff', '#9d00ff', '#ff0080', '#00ff88', '#f0ff00'];

  if (type === 'line' || type === 'area') {
    const max = Math.max(...data.map(d => d.value));
    const points = data.map((point, i) => {
      const x = (i / (data.length - 1)) * 100;
      const y = 100 - (point.value / max) * 100;
      return `${x},${y}`;
    }).join(' ');

    return (
      <svg viewBox="0 0 100 100" className="w-full h-full">
        <defs>
          <linearGradient id="gradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#9d00ff" stopOpacity="0.3" />
            <stop offset="100%" stopColor="#9d00ff" stopOpacity="0" />
          </linearGradient>
        </defs>
        {type === 'area' && (
          <polygon
            points={`0,100 ${points} 100,100`}
            fill="url(#gradient)"
          />
        )}
        <polyline
          fill="none"
          stroke="#9d00ff"
          strokeWidth="2"
          points={points}
        />
        {data.map((point, i) => {
          const x = (i / (data.length - 1)) * 100;
          const y = 100 - (point.value / max) * 100;
          return (
            <circle
              key={i}
              cx={x}
              cy={y}
              r="3"
              fill="#00f0ff"
              className="hover:r-5 transition-all cursor-pointer"
            >
              <title>{point.label}: {point.value}</title>
            </circle>
          );
        })}
      </svg>
    );
  }

  if (type === 'bar') {
    const max = Math.max(...data.map(d => d.value));
    return (
      <div className="flex items-end justify-around h-full gap-2">
        {data.map((point, i) => (
          <motion.div
            key={i}
            initial={{ height: 0 }}
            animate={{ height: `${(point.value / max) * 100}%` }}
            transition={{ duration: 0.5, delay: i * 0.1 }}
            className="flex-1 bg-gradient-to-t from-cyber-purple to-cyber-cyan rounded-t-lg relative group"
          >
            <div className="absolute -top-8 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity bg-cyber-dark px-2 py-1 rounded text-xs">
              {point.value}
            </div>
            <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 text-xs text-gray-400 whitespace-nowrap">
              {point.label}
            </div>
          </motion.div>
        ))}
      </div>
    );
  }

  if (type === 'pie') {
    const total = data.reduce((sum, point) => sum + point.value, 0);
    let currentAngle = 0;

    return (
      <svg viewBox="0 0 100 100" className="w-full h-full max-w-[300px] mx-auto">
        {data.map((point, i) => {
          const angle = (point.value / total) * 360;
          const startAngle = currentAngle;
          const endAngle = currentAngle + angle;
          currentAngle += angle;

          const x1 = 50 + 40 * Math.cos((startAngle * Math.PI) / 180);
          const y1 = 50 + 40 * Math.sin((startAngle * Math.PI) / 180);
          const x2 = 50 + 40 * Math.cos((endAngle * Math.PI) / 180);
          const y2 = 50 + 40 * Math.sin((endAngle * Math.PI) / 180);

          const largeArcFlag = angle > 180 ? 1 : 0;

          return (
            <g key={i}>
              <path
                d={`M 50 50 L ${x1} ${y1} A 40 40 0 ${largeArcFlag} 1 ${x2} ${y2} Z`}
                fill={colors[i % colors.length]}
                className="hover:opacity-80 transition-opacity cursor-pointer"
              >
                <title>{point.label}: {point.value}%</title>
              </path>
            </g>
          );
        })}
      </svg>
    );
  }

  return <div className="flex items-center justify-center h-full text-gray-400">Unsupported chart type</div>;
}

export default AnalyticsDashboard;
