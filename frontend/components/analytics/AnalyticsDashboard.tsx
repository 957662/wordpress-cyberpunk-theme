'use client';

/**
 * AnalyticsDashboard - 数据分析仪表盘组件
 * 展示网站访问数据、用户行为、内容表现等
 */

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  TrendingUp,
  Users,
  Eye,
  Clock,
  ArrowUpRight,
  ArrowDownRight,
  Calendar,
  Filter,
  Download,
  RefreshCw,
} from 'lucide-react';
import { CyberButton } from '@/components/ui/CyberButton';
import { Card } from '@/components/ui/Card';
import { cn } from '@/lib/utils';

interface MetricCard {
  title: string;
  value: string | number;
  change: number;
  changeType: 'increase' | 'decrease';
  icon: React.ReactNode;
  color: 'cyan' | 'purple' | 'pink' | 'green' | 'yellow';
}

interface ChartData {
  labels: string[];
  datasets: {
    label: string;
    data: number[];
    color: string;
  }[];
}

export function AnalyticsDashboard() {
  const [timeRange, setTimeRange] = useState<'7d' | '30d' | '90d' | '1y'>('30d');
  const [isLoading, setIsLoading] = useState(false);
  const [metrics, setMetrics] = useState<MetricCard[]>([]);
  const [chartData, setChartData] = useState<ChartData | null>(null);

  useEffect(() => {
    loadAnalyticsData();
  }, [timeRange]);

  const loadAnalyticsData = async () => {
    setIsLoading(true);
    try {
      // 这里调用实际的API
      const response = await fetch(`/api/v1/analytics/dashboard?range=${timeRange}`);
      const data = await response.json();
      
      setMetrics(data.metrics);
      setChartData(data.chartData);
    } catch (error) {
      console.error('加载分析数据失败:', error);
      // 使用模拟数据
      setMetrics(generateMockMetrics());
      setChartData(generateMockChartData());
    } finally {
      setIsLoading(false);
    }
  };

  const generateMockMetrics = (): MetricCard[] => [
    {
      title: '总访问量',
      value: '125,432',
      change: 12.5,
      changeType: 'increase',
      icon: <Eye className="w-5 h-5" />,
      color: 'cyan',
    },
    {
      title: '独立访客',
      value: '45,678',
      change: 8.3,
      changeType: 'increase',
      icon: <Users className="w-5 h-5" />,
      color: 'purple',
    },
    {
      title: '平均停留时间',
      value: '4:32',
      change: -2.1,
      changeType: 'decrease',
      icon: <Clock className="w-5 h-5" />,
      color: 'pink',
    },
    {
      title: '跳出率',
      value: '42.3%',
      change: -5.8,
      changeType: 'increase',
      icon: <TrendingUp className="w-5 h-5" />,
      color: 'green',
    },
  ];

  const generateMockChartData = (): ChartData => ({
    labels: ['周一', '周二', '周三', '周四', '周五', '周六', '周日'],
    datasets: [
      {
        label: '页面浏览量',
        data: [1200, 1900, 3000, 5000, 2300, 3200, 4100],
        color: '#00f0ff',
      },
      {
        label: '独立访客',
        data: [800, 1200, 2000, 3200, 1500, 2100, 2800],
        color: '#9d00ff',
      },
    ],
  });

  const exportData = async () => {
    try {
      const response = await fetch(`/api/v1/analytics/export?range=${timeRange}`);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `analytics-${timeRange}-${Date.now()}.csv`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('导出失败:', error);
    }
  };

  const colorStyles = {
    cyan: 'bg-cyber-cyan/10 border-cyber-cyan/30 text-cyber-cyan',
    purple: 'bg-cyber-purple/10 border-cyber-purple/30 text-cyber-purple',
    pink: 'bg-cyber-pink/10 border-cyber-pink/30 text-cyber-pink',
    green: 'bg-cyber-green/10 border-cyber-green/30 text-cyber-green',
    yellow: 'bg-cyber-yellow/10 border-cyber-yellow/30 text-cyber-yellow',
  };

  return (
    <div className="space-y-6 p-6">
      {/* 头部 */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">数据分析仪表盘</h1>
          <p className="text-gray-400">实时监控您的网站表现</p>
        </div>
        
        <div className="flex items-center gap-3">
          {/* 时间范围选择器 */}
          <div className="flex items-center gap-2 bg-cyber-dark/50 rounded-lg p-1 border border-cyber-border">
            {(['7d', '30d', '90d', '1y'] as const).map((range) => (
              <button
                key={range}
                onClick={() => setTimeRange(range)}
                className={cn(
                  'px-4 py-2 rounded-md text-sm font-medium transition-all',
                  timeRange === range
                    ? 'bg-cyber-cyan text-cyber-dark'
                    : 'text-gray-400 hover:text-white'
                )}
              >
                {range === '7d' ? '7天' : range === '30d' ? '30天' : range === '90d' ? '90天' : '1年'}
              </button>
            ))}
          </div>

          <CyberButton
            variant="outline"
            size="sm"
            icon={<RefreshCw className="w-4 h-4" />}
            onClick={loadAnalyticsData}
            disabled={isLoading}
          >
            刷新
          </CyberButton>

          <CyberButton
            variant="outline"
            size="sm"
            icon={<Download className="w-4 h-4" />}
            onClick={exportData}
          >
            导出
          </CyberButton>
        </div>
      </div>

      {/* 指标卡片 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {metrics.map((metric, index) => (
          <motion.div
            key={metric.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className={cn(
              'cyber-card p-6 border-2',
              colorStyles[metric.color]
            )}>
              <div className="flex items-start justify-between mb-4">
                <div className={cn(
                  'p-3 rounded-lg',
                  colorStyles[metric.color]
                )}>
                  {metric.icon}
                </div>
                <div className={cn(
                  'flex items-center gap-1 text-sm font-medium',
                  metric.changeType === 'increase' ? 'text-cyber-green' : 'text-cyber-pink'
                )}>
                  {metric.changeType === 'increase' ? (
                    <ArrowUpRight className="w-4 h-4" />
                  ) : (
                    <ArrowDownRight className="w-4 h-4" />
                  )}
                  {Math.abs(metric.change)}%
                </div>
              </div>

              <div>
                <p className="text-gray-400 text-sm mb-1">{metric.title}</p>
                <p className="text-2xl font-bold text-white">{metric.value}</p>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* 图表区域 */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* 流量趋势图 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card className="cyber-card p-6">
            <h3 className="text-lg font-bold text-white mb-4">流量趋势</h3>
            <div className="h-[300px] flex items-center justify-center">
              {chartData ? (
                <div className="w-full h-full">
                  {/* 这里可以集成实际的图表库，如 recharts 或 chart.js */}
                  <div className="flex items-end justify-between h-full gap-2">
                    {chartData.labels.map((label, index) => (
                      <div key={label} className="flex-1 flex flex-col items-center gap-2">
                        <div className="w-full flex flex-col gap-1">
                          {chartData.datasets.map((dataset) => (
                            <motion.div
                              key={dataset.label}
                              initial={{ height: 0 }}
                              animate={{ height: `${(dataset.data[index] / 5000) * 100}%` }}
                              transition={{ duration: 0.5, delay: index * 0.05 }}
                              className="w-full rounded-t-sm"
                              style={{ backgroundColor: dataset.color }}
                            />
                          ))}
                        </div>
                        <span className="text-xs text-gray-500">{label}</span>
                      </div>
                    ))}
                  </div>
                  <div className="flex items-center justify-center gap-4 mt-4">
                    {chartData.datasets.map((dataset) => (
                      <div key={dataset.label} className="flex items-center gap-2">
                        <div
                          className="w-3 h-3 rounded-full"
                          style={{ backgroundColor: dataset.color }}
                        />
                        <span className="text-sm text-gray-400">{dataset.label}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="text-gray-500">加载中...</div>
              )}
            </div>
          </Card>
        </motion.div>

        {/* 热门内容 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <Card className="cyber-card p-6">
            <h3 className="text-lg font-bold text-white mb-4">热门内容</h3>
            <div className="space-y-3">
              {[
                { title: 'Next.js 14 完全指南', views: 12543, trend: 'up' },
                { title: '赛博朋克设计美学', views: 9821, trend: 'up' },
                { title: 'TypeScript 高级技巧', views: 7654, trend: 'down' },
                { title: 'React 性能优化', views: 6543, trend: 'up' },
                { title: 'Tailwind CSS 最佳实践', views: 5432, trend: 'stable' },
              ].map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.6 + index * 0.1 }}
                  className="flex items-center justify-between p-3 bg-cyber-dark/50 rounded-lg hover:bg-cyber-dark/70 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className={cn(
                      'w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold',
                      index < 3 ? 'bg-cyber-cyan/20 text-cyber-cyan' : 'bg-cyber-muted text-gray-400'
                    )}>
                      {index + 1}
                    </div>
                    <div>
                      <p className="text-white font-medium">{item.title}</p>
                      <p className="text-sm text-gray-500">{item.views.toLocaleString()} 次浏览</p>
                    </div>
                  </div>
                  <div>
                    {item.trend === 'up' && <ArrowUpRight className="w-5 h-5 text-cyber-green" />}
                    {item.trend === 'down' && <ArrowDownRight className="w-5 h-5 text-cyber-pink" />}
                    {item.trend === 'stable' && <div className="w-5 h-5 flex items-center justify-center text-gray-500">-</div>}
                  </div>
                </motion.div>
              ))}
            </div>
          </Card>
        </motion.div>
      </div>

      {/* 详细数据表格 */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
      >
        <Card className="cyber-card p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-white">详细数据</h3>
            <CyberButton variant="ghost" size="sm" icon={<Filter className="w-4 h-4" />}>
              筛选
            </CyberButton>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-cyber-border">
                  <th className="text-left p-3 text-gray-400 font-medium">日期</th>
                  <th className="text-left p-3 text-gray-400 font-medium">页面浏览量</th>
                  <th className="text-left p-3 text-gray-400 font-medium">独立访客</th>
                  <th className="text-left p-3 text-gray-400 font-medium">平均停留时间</th>
                  <th className="text-left p-3 text-gray-400 font-medium">跳出率</th>
                </tr>
              </thead>
              <tbody>
                {Array.from({ length: 7 }, (_, i) => (
                  <tr key={i} className="border-b border-cyber-border/50 hover:bg-cyber-cyan/5 transition-colors">
                    <td className="p-3 text-white">2024-03-{(8 - i).toString().padStart(2, '0')}</td>
                    <td className="p-3 text-cyber-cyan">{Math.floor(Math.random() * 5000 + 1000).toLocaleString()}</td>
                    <td className="p-3 text-cyber-purple">{Math.floor(Math.random() * 3000 + 500).toLocaleString()}</td>
                    <td className="p-3 text-white">{Math.floor(Math.random() * 300 + 120)}s</td>
                    <td className="p-3 text-cyber-pink">{(Math.random() * 30 + 30).toFixed(1)}%</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </motion.div>
    </div>
  );
}

export default AnalyticsDashboard;
