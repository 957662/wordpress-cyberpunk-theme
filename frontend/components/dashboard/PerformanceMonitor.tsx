'use client';

import React, { useState, useEffect } from 'react';
import { Activity, Cpu, HardDrive, Zap, AlertCircle, CheckCircle, TrendingUp, TrendingDown } from 'lucide-react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

// 性能指标类型
interface PerformanceMetrics {
  // 核心性能指标
  fcp: number; // First Contentful Paint
  lcp: number; // Largest Contentful Paint
  fid: number; // First Input Delay
  cls: number; // Cumulative Layout Shift
  ttfb: number; // Time to First Byte

  // 资源使用
  memory: {
    used: number;
    total: number;
    limit: number;
  };
  cpu: number;

  // 网络性能
  network: {
    downlink: number;
    effectiveType: string;
    rtt: number;
  };

  // 自定义指标
  renderTime: number;
  interactionTime: number;
  errorRate: number;
}

// 性能状态
type PerformanceStatus = 'excellent' | 'good' | 'fair' | 'poor';

// 获取性能状态
const getPerformanceStatus = (metrics: PerformanceMetrics): PerformanceStatus => {
  if (metrics.lcp < 1.2 && metrics.fid < 100 && metrics.cls < 0.1) return 'excellent';
  if (metrics.lcp < 2.5 && metrics.fid < 300 && metrics.cls < 0.25) return 'good';
  if (metrics.lcp < 4 && metrics.fid < 500 && metrics.cls < 0.5) return 'fair';
  return 'poor';
};

// 性能状态样式
const statusStyles = {
  excellent: {
    bg: 'bg-green-500/10',
    border: 'border-green-500/30',
    text: 'text-green-400',
    icon: CheckCircle,
    label: '优秀',
  },
  good: {
    bg: 'bg-blue-500/10',
    border: 'border-blue-500/30',
    text: 'text-blue-400',
    icon: CheckCircle,
    label: '良好',
  },
  fair: {
    bg: 'bg-yellow-500/10',
    border: 'border-yellow-500/30',
    text: 'text-yellow-400',
    icon: AlertCircle,
    label: '一般',
  },
  poor: {
    bg: 'bg-red-500/10',
    border: 'border-red-500/30',
    text: 'text-red-400',
    icon: AlertCircle,
    label: '较差',
  },
};

// 性能卡片组件
interface MetricCardProps {
  title: string;
  value: string | number;
  unit: string;
  icon: React.ElementType;
  status: 'good' | 'warning' | 'error';
  trend?: 'up' | 'down' | 'stable';
  tooltip?: string;
}

const MetricCard: React.FC<MetricCardProps> = ({
  title,
  value,
  unit,
  icon: Icon,
  status,
  trend,
  tooltip,
}) => {
  const statusColors = {
    good: 'text-green-400',
    warning: 'text-yellow-400',
    error: 'text-red-400',
  };

  const trendIcons = {
    up: <TrendingUp className="w-4 h-4 text-red-400" />,
    down: <TrendingDown className="w-4 h-4 text-green-400" />,
    stable: null,
  };

  return (
    <div className="relative group">
      <div className="p-4 rounded-lg border border-white/10 bg-gray-800/50 backdrop-blur-sm hover:border-cyan-500/30 transition-all">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <Icon className="w-5 h-5 text-cyan-400" />
            <span className="text-sm font-medium text-gray-300">{title}</span>
          </div>
          {trend && trendIcons[trend]}
        </div>
        <div className="flex items-baseline gap-1">
          <span className={cn('text-2xl font-bold', statusColors[status])}>
            {value}
          </span>
          <span className="text-sm text-gray-400">{unit}</span>
        </div>
      </div>

      {tooltip && (
        <div className="absolute bottom-full left-0 mb-2 px-3 py-2 bg-gray-900 border border-white/10 rounded-lg text-xs text-gray-300 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10">
          {tooltip}
        </div>
      )}
    </div>
  );
};

// 主组件
interface PerformanceMonitorProps {
  showDetails?: boolean;
  autoRefresh?: boolean;
  refreshInterval?: number;
  className?: string;
}

export const PerformanceMonitor: React.FC<PerformanceMonitorProps> = ({
  showDetails = true,
  autoRefresh = true,
  refreshInterval = 5000,
  className,
}) => {
  const [metrics, setMetrics] = useState<PerformanceMetrics>({
    fcp: 0,
    lcp: 0,
    fid: 0,
    cls: 0,
    ttfb: 0,
    memory: { used: 0, total: 0, limit: 0 },
    cpu: 0,
    network: { downlink: 0, effectiveType: '', rtt: 0 },
    renderTime: 0,
    interactionTime: 0,
    errorRate: 0,
  });

  const [status, setStatus] = useState<PerformanceStatus>('good');
  const [isVisible, setIsVisible] = useState(false);

  // 获取性能指标
  const fetchMetrics = () => {
    if (typeof window === 'undefined') return;

    // 获取 Navigation Timing
    const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
    const ttfb = navigation ? navigation.responseStart - navigation.requestStart : 0;

    // 获取 Paint Timing
    const paintEntries = performance.getEntriesByType('paint');
    const fcpEntry = paintEntries.find((entry) => entry.name === 'first-contentful-paint');
    const fcp = fcpEntry ? fcpEntry.startTime : 0;

    // 获取 LCP
    let lcp = 0;
    if ('PerformanceObserver' in window) {
      try {
        const lcpEntries = performance.getEntriesByName('largest-contentful-paint');
        if (lcpEntries.length > 0) {
          lcp = (lcpEntries[lcpEntries.length - 1] as any).startTime;
        }
      } catch (e) {
        console.error('Error getting LCP:', e);
      }
    }

    // 获取 CLS
    let cls = 0;
    if ('PerformanceObserver' in window) {
      try {
        const clsEntries = performance.getEntriesByName('cumulative-layout-shift');
        if (clsEntries.length > 0) {
          cls = (clsEntries[clsEntries.length - 1] as any).value || 0;
        }
      } catch (e) {
        console.error('Error getting CLS:', e);
      }
    }

    // 获取内存使用
    const memory = (performance as any).memory;
    const memoryData = memory
      ? {
          used: Math.round(memory.usedJSHeapSize / 1048576),
          total: Math.round(memory.totalJSHeapSize / 1048576),
          limit: Math.round(memory.jsHeapSizeLimit / 1048576),
        }
      : { used: 0, total: 0, limit: 0 };

    // 获取网络信息
    const network = (navigator as any).connection || {
      downlink: 0,
      effectiveType: 'unknown',
      rtt: 0,
    };

    setMetrics({
      fcp: Math.round(fcp),
      lcp: Math.round(lcp),
      fid: 0, // 需要用户交互才能获取
      cls: Math.round(cls * 1000) / 1000,
      ttfb: Math.round(ttfb),
      memory: memoryData,
      cpu: 0, // 浏览器 API 不支持
      network: {
        downlink: network.downlink,
        effectiveType: network.effectiveType,
        rtt: network.rtt,
      },
      renderTime: Math.round(performance.now()),
      interactionTime: 0,
      errorRate: 0,
    });
  };

  // 初始化和定时刷新
  useEffect(() => {
    fetchMetrics();

    if (autoRefresh) {
      const interval = setInterval(fetchMetrics, refreshInterval);
      return () => clearInterval(interval);
    }
  }, [autoRefresh, refreshInterval]);

  // 更新性能状态
  useEffect(() => {
    setStatus(getPerformanceStatus(metrics));
  }, [metrics]);

  // 性能得分计算
  const calculateScore = () => {
    const scores = {
      lcp: metrics.lcp < 1.2 ? 100 : metrics.lcp < 2.5 ? 80 : metrics.lcp < 4 ? 60 : 40,
      fcp: metrics.fcp < 1.8 ? 100 : metrics.fcp < 3 ? 80 : 60,
      cls: metrics.cls < 0.1 ? 100 : metrics.cls < 0.25 ? 80 : metrics.cls < 0.5 ? 60 : 40,
      ttfb: metrics.ttfb < 600 ? 100 : metrics.ttfb < 1500 ? 80 : 60,
    };

    return Math.round(
      (scores.lcp + scores.fcp + scores.cls + scores.ttfb) / 4
    );
  };

  const score = calculateScore();
  const statusStyle = statusStyles[status];

  return (
    <div className={cn('space-y-6', className)}>
      {/* 头部 */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Activity className="w-6 h-6 text-cyan-400" />
          <div>
            <h3 className="text-xl font-bold text-white">性能监控</h3>
            <p className="text-sm text-gray-400">实时性能指标</p>
          </div>
        </div>
        <button
          onClick={() => setIsVisible(!isVisible)}
          className="p-2 rounded-lg hover:bg-white/10 transition-colors"
        >
          <Activity className="w-5 h-5 text-gray-400" />
        </button>
      </div>

      {/* 总体评分 */}
      <div className={cn('p-6 rounded-xl border backdrop-blur-sm', statusStyle.bg, statusStyle.border)}>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-400 mb-1">性能评分</p>
            <div className="flex items-center gap-3">
              <span className="text-5xl font-bold text-white">{score}</span>
              <div className={cn('flex items-center gap-2 px-3 py-1 rounded-full', statusStyle.bg, statusStyle.border)}>
                <statusStyle.icon className={cn('w-5 h-5', statusStyle.text)} />
                <span className={cn('font-semibold', statusStyle.text)}>{statusStyle.label}</span>
              </div>
            </div>
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-400">更新时间</p>
            <p className="text-lg font-semibold text-white">
              {new Date().toLocaleTimeString('zh-CN')}
            </p>
          </div>
        </div>
      </div>

      {/* 核心指标 */}
      <div className="grid grid-cols-2 gap-4">
        <MetricCard
          title="LCP"
          value={metrics.lcp}
          unit="ms"
          icon={Zap}
          status={metrics.lcp < 2.5 ? 'good' : metrics.lcp < 4 ? 'warning' : 'error'}
          tooltip="Largest Contentful Paint - 最大内容绘制时间"
        />
        <MetricCard
          title="FCP"
          value={metrics.fcp}
          unit="ms"
          icon={Activity}
          status={metrics.fcp < 1.8 ? 'good' : metrics.fcp < 3 ? 'warning' : 'error'}
          tooltip="First Contentful Paint - 首次内容绘制时间"
        />
        <MetricCard
          title="CLS"
          value={metrics.cls}
          unit=""
          icon={Activity}
          status={metrics.cls < 0.1 ? 'good' : metrics.cls < 0.25 ? 'warning' : 'error'}
          tooltip="Cumulative Layout Shift - 累积布局偏移"
        />
        <MetricCard
          title="TTFB"
          value={metrics.ttfb}
          unit="ms"
          icon={Activity}
          status={metrics.ttfb < 600 ? 'good' : metrics.ttfb < 1500 ? 'warning' : 'error'}
          tooltip="Time to First Byte - 首字节时间"
        />
      </div>

      {/* 详细信息 */}
      {showDetails && isVisible && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          className="space-y-4"
        >
          {/* 资源使用 */}
          <div className="p-4 rounded-lg border border-white/10 bg-gray-800/50">
            <h4 className="text-sm font-semibold text-gray-300 mb-3 flex items-center gap-2">
              <HardDrive className="w-4 h-4" />
              资源使用
            </h4>
            <div className="space-y-3">
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-400">内存使用</span>
                  <span className="text-white">
                    {metrics.memory.used} MB / {metrics.memory.limit} MB
                  </span>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-2">
                  <div
                    className="bg-cyan-500 h-2 rounded-full transition-all"
                    style={{
                      width: `${(metrics.memory.used / metrics.memory.limit) * 100}%`,
                    }}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* 网络信息 */}
          <div className="p-4 rounded-lg border border-white/10 bg-gray-800/50">
            <h4 className="text-sm font-semibold text-gray-300 mb-3 flex items-center gap-2">
              <Activity className="w-4 h-4" />
              网络信息
            </h4>
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div>
                <span className="text-gray-400">网络类型</span>
                <p className="text-white font-medium capitalize">
                  {metrics.network.effectiveType || 'unknown'}
                </p>
              </div>
              <div>
                <span className="text-gray-400">下行速度</span>
                <p className="text-white font-medium">{metrics.network.downlink} Mbps</p>
              </div>
              <div>
                <span className="text-gray-400">往返时间</span>
                <p className="text-white font-medium">{metrics.network.rtt} ms</p>
              </div>
            </div>
          </div>

          {/* 性能建议 */}
          <div className="p-4 rounded-lg border border-white/10 bg-gray-800/50">
            <h4 className="text-sm font-semibold text-gray-300 mb-3 flex items-center gap-2">
              <AlertCircle className="w-4 h-4" />
              优化建议
            </h4>
            <ul className="space-y-2 text-sm text-gray-300">
              {status !== 'excellent' && (
                <>
                  {metrics.lcp > 2.5 && (
                    <li className="flex items-start gap-2">
                      <span className="text-yellow-400 mt-0.5">•</span>
                      <span>优化最大内容的加载时间，考虑预加载关键资源</span>
                    </li>
                  )}
                  {metrics.cls > 0.25 && (
                    <li className="flex items-start gap-2">
                      <span className="text-yellow-400 mt-0.5">•</span>
                      <span>减少布局偏移，为图片和媒体设置明确的尺寸</span>
                    </li>
                  )}
                  {metrics.ttfb > 600 && (
                    <li className="flex items-start gap-2">
                      <span className="text-yellow-400 mt-0.5">•</span>
                      <span>优化服务器响应时间，考虑使用 CDN</span>
                    </li>
                  )}
                </>
              )}
              {status === 'excellent' && (
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" />
                  <span>性能表现优秀，继续保持！</span>
                </li>
              )}
            </ul>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default PerformanceMonitor;
