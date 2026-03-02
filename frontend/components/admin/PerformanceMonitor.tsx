'use client';

import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import {
  Activity,
  Cpu,
  HardDrive,
  Memory,
  Zap,
  AlertTriangle,
  CheckCircle,
  XCircle,
  RefreshCw,
  TrendingUp,
  TrendingDown,
} from 'lucide-react';

interface PerformanceMetric {
  name: string;
  value: number;
  unit: string;
  status: 'good' | 'warning' | 'critical';
  trend?: 'up' | 'down' | 'stable';
  threshold?: {
    warning: number;
    critical: number;
  };
}

interface SystemHealth {
  status: 'healthy' | 'warning' | 'critical';
  score: number;
  uptime: string;
  lastCheck: string;
}

interface PerformanceData {
  system: SystemHealth;
  metrics: {
    cpu: PerformanceMetric;
    memory: PerformanceMetric;
    disk: PerformanceMetric;
    responseTime: PerformanceMetric;
    requests: PerformanceMetric;
    errors: PerformanceMetric;
  };
  trends: {
    labels: string[];
    responseTime: number[];
    requests: number[];
  };
}

const getStatusColor = (status: PerformanceMetric['status']) => {
  switch (status) {
    case 'good':
      return 'text-cyber-green';
    case 'warning':
      return 'text-cyber-yellow';
    case 'critical':
      return 'text-cyber-pink';
  }
};

const getStatusBg = (status: PerformanceMetric['status']) => {
  switch (status) {
    case 'good':
      return 'bg-cyber-green/20';
    case 'warning':
      return 'bg-cyber-yellow/20';
    case 'critical':
      return 'bg-cyber-pink/20';
  }
};

const getStatusIcon = (status: PerformanceMetric['status']) => {
  switch (status) {
    case 'good':
      return CheckCircle;
    case 'warning':
      return AlertTriangle;
    case 'critical':
      return XCircle;
  }
};

export function PerformanceMonitor() {
  const [data, setData] = useState<PerformanceData | null>(null);
  const [loading, setLoading] = useState(true);
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [refreshInterval, setRefreshInterval] = useState(5000);

  const fetchPerformanceData = async () => {
    try {
      const response = await fetch('/api/admin/performance');
      const result = await response.json();
      setData(result);
    } catch (error) {
      console.error('Failed to fetch performance data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPerformanceData();

    if (autoRefresh) {
      const interval = setInterval(fetchPerformanceData, refreshInterval);
      return () => clearInterval(interval);
    }
  }, [autoRefresh, refreshInterval]);

  if (loading) {
    return (
      <div className="cyber-card p-8 rounded-lg">
        <div className="flex items-center justify-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-cyber-cyan"></div>
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="cyber-card p-8 rounded-lg">
        <p className="text-center text-gray-500">无法加载性能数据</p>
      </div>
    );
  }

  const metrics = [
    {
      key: 'cpu',
      label: 'CPU 使用率',
      value: data.metrics.cpu,
      icon: Cpu,
    },
    {
      key: 'memory',
      label: '内存使用',
      value: data.metrics.memory,
      icon: Memory,
    },
    {
      key: 'disk',
      label: '磁盘使用',
      value: data.metrics.disk,
      icon: HardDrive,
    },
    {
      key: 'responseTime',
      label: '响应时间',
      value: data.metrics.responseTime,
      icon: Zap,
    },
    {
      key: 'requests',
      label: '请求数',
      value: data.metrics.requests,
      icon: Activity,
    },
    {
      key: 'errors',
      label: '错误率',
      value: data.metrics.errors,
      icon: AlertTriangle,
    },
  ];

  return (
    <div className="space-y-6">
      {/* 系统健康概览 */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="cyber-card p-6 rounded-lg"
      >
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <div className={`p-3 rounded-lg ${getStatusBg(data.system.status)}`}>
              <Activity className={`w-8 h-8 ${getStatusColor(data.system.status)}`} />
            </div>
            <div>
              <h3 className="text-xl font-bold text-white">系统健康状态</h3>
              <p className={`text-sm ${getStatusColor(data.system.status)}`}>
                {data.system.status === 'healthy' ? '运行良好' : data.system.status === 'warning' ? '需要关注' : '严重问题'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="text-right">
              <p className="text-3xl font-bold text-cyber-cyan">{data.system.score}</p>
              <p className="text-xs text-gray-500">健康分数</p>
            </div>
            <button
              onClick={fetchPerformanceData}
              className="p-2 rounded-lg bg-cyber-muted hover:bg-cyber-muted/80 transition-all"
              title="刷新"
            >
              <RefreshCw className="w-5 h-5 text-gray-400" />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
          <div className="flex items-center gap-2 text-gray-400">
            <Activity className="w-4 h-4" />
            <span>运行时间: {data.system.uptime}</span>
          </div>
          <div className="flex items-center gap-2 text-gray-400">
            <CheckCircle className="w-4 h-4" />
            <span>最后检查: {data.system.lastCheck}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-gray-400">自动刷新:</span>
            <button
              onClick={() => setAutoRefresh(!autoRefresh)}
              className={`px-3 py-1 rounded text-xs transition-all ${
                autoRefresh
                  ? 'bg-cyber-green text-cyber-dark'
                  : 'bg-cyber-muted text-gray-400'
              }`}
            >
              {autoRefresh ? '开启' : '关闭'}
            </button>
          </div>
        </div>
      </motion.div>

      {/* 性能指标 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {metrics.map((metric, index) => {
          const Icon = metric.value.trend === 'up' ? TrendingUp : metric.value.trend === 'down' ? TrendingDown : Activity;
          return (
            <motion.div
              key={metric.key}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="cyber-card p-6 rounded-lg relative overflow-hidden"
            >
              {/* 背景光效 */}
              <div className={`absolute top-0 right-0 w-24 h-24 ${
                metric.value.status === 'good' ? 'bg-cyber-green' :
                metric.value.status === 'warning' ? 'bg-cyber-yellow' :
                'bg-cyber-pink'
              }/10 rounded-full blur-2xl`} />

              <div className="relative">
                <div className="flex items-start justify-between mb-4">
                  <div className={`p-3 rounded-lg ${getStatusBg(metric.value.status)}`}>
                    <metric.icon className={`w-6 h-6 ${getStatusColor(metric.value.status)}`} />
                  </div>
                  <div className="flex items-center gap-2">
                    {metric.value.trend && (
                      <div className={`flex items-center gap-1 text-xs ${
                        metric.value.trend === 'up' ? 'text-cyber-pink' :
                        metric.value.trend === 'down' ? 'text-cyber-green' :
                        'text-gray-500'
                      }`}>
                        <Icon className="w-3 h-3" />
                        <span>{metric.value.trend === 'up' ? '上升' : metric.value.trend === 'down' ? '下降' : '稳定'}</span>
                      </div>
                    )}
                    <getStatusIcon(metric.value.status) className={`w-5 h-5 ${getStatusColor(metric.value.status)}`} />
                  </div>
                </div>

                <h4 className="text-sm text-gray-400 mb-2">{metric.label}</h4>

                <div className="flex items-baseline gap-2 mb-3">
                  <span className={`text-3xl font-bold ${getStatusColor(metric.value.status)}`}>
                    {metric.value.value}
                  </span>
                  <span className="text-sm text-gray-500">{metric.value.unit}</span>
                </div>

                {/* 进度条 */}
                {metric.value.threshold && (
                  <div className="space-y-2">
                    <div className="w-full bg-cyber-dark rounded-full h-2">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${Math.min((metric.value.value / metric.value.threshold.critical) * 100, 100)}%` }}
                        transition={{ duration: 0.5 }}
                        className={`h-2 rounded-full ${
                          metric.value.status === 'good' ? 'bg-cyber-green' :
                          metric.value.status === 'warning' ? 'bg-cyber-yellow' :
                          'bg-cyber-pink'
                        }`}
                      />
                    </div>
                    <div className="flex justify-between text-xs text-gray-600">
                      <span>0</span>
                      <span>警告: {metric.value.threshold.warning}</span>
                      <span>严重: {metric.value.threshold.critical}</span>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* 性能趋势图表 */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="cyber-card p-6 rounded-lg"
      >
        <h3 className="text-lg font-bold text-white mb-6">性能趋势</h3>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* 响应时间趋势 */}
          <div>
            <h4 className="text-sm text-gray-400 mb-4">响应时间</h4>
            <div className="h-48 flex items-end gap-1">
              {data.trends.responseTime.map((value, index) => (
                <motion.div
                  key={index}
                  initial={{ height: 0 }}
                  animate={{ height: `${(value / Math.max(...data.trends.responseTime)) * 100}%` }}
                  transition={{ delay: index * 0.02 }}
                  className="flex-1 bg-cyber-cyan/50 hover:bg-cyber-cyan transition-all rounded-t"
                  title={`${value}ms`}
                />
              ))}
            </div>
            <div className="flex justify-between mt-2 text-xs text-gray-600">
              {data.trends.labels.slice(-6).map((label, index) => (
                <span key={index}>{label}</span>
              ))}
            </div>
          </div>

          {/* 请求量趋势 */}
          <div>
            <h4 className="text-sm text-gray-400 mb-4">请求量</h4>
            <div className="h-48 flex items-end gap-1">
              {data.trends.requests.map((value, index) => (
                <motion.div
                  key={index}
                  initial={{ height: 0 }}
                  animate={{ height: `${(value / Math.max(...data.trends.requests)) * 100}%` }}
                  transition={{ delay: index * 0.02 }}
                  className="flex-1 bg-cyber-purple/50 hover:bg-cyber-purple transition-all rounded-t"
                  title={`${value} 请求`}
                />
              ))}
            </div>
            <div className="flex justify-between mt-2 text-xs text-gray-600">
              {data.trends.labels.slice(-6).map((label, index) => (
                <span key={index}>{label}</span>
              ))}
            </div>
          </div>
        </div>
      </motion.div>

      {/* 优化建议 */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="cyber-card p-6 rounded-lg"
      >
        <h3 className="text-lg font-bold text-white mb-4">优化建议</h3>

        <div className="space-y-3">
          {data.system.status === 'critical' && (
            <div className="flex items-start gap-3 p-4 rounded-lg bg-cyber-pink/20 border border-cyber-pink/50">
              <AlertTriangle className="w-5 h-5 text-cyber-pink flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-white font-medium">系统处于严重状态</p>
                <p className="text-sm text-gray-400 mt-1">建议立即检查各项指标并采取紧急措施</p>
              </div>
            </div>
          )}

          {data.metrics.cpu.status !== 'good' && (
            <div className="flex items-start gap-3 p-4 rounded-lg bg-cyber-yellow/20 border border-cyber-yellow/50">
              <AlertTriangle className="w-5 h-5 text-cyber-yellow flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-white font-medium">CPU 使用率过高</p>
                <p className="text-sm text-gray-400 mt-1">建议检查运行中的进程或考虑升级服务器配置</p>
              </div>
            </div>
          )}

          {data.metrics.memory.status !== 'good' && (
            <div className="flex items-start gap-3 p-4 rounded-lg bg-cyber-yellow/20 border border-cyber-yellow/50">
              <AlertTriangle className="w-5 h-5 text-cyber-yellow flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-white font-medium">内存使用率过高</p>
                <p className="text-sm text-gray-400 mt-1">建议清理缓存或增加服务器内存</p>
              </div>
            </div>
          )}

          {data.metrics.responseTime.status !== 'good' && (
            <div className="flex items-start gap-3 p-4 rounded-lg bg-cyber-yellow/20 border border-cyber-yellow/50">
              <Zap className="w-5 h-5 text-cyber-yellow flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-white font-medium">响应时间较慢</p>
                <p className="text-sm text-gray-400 mt-1">建议优化数据库查询或启用缓存</p>
              </div>
            </div>
          )}

          {data.system.status === 'healthy' && (
            <div className="flex items-start gap-3 p-4 rounded-lg bg-cyber-green/20 border border-cyber-green/50">
              <CheckCircle className="w-5 h-5 text-cyber-green flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-white font-medium">系统运行良好</p>
                <p className="text-sm text-gray-400 mt-1">所有指标都在正常范围内，继续保持</p>
              </div>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
}
