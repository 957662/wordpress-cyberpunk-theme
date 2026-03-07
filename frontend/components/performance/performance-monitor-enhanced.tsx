'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Activity,
  Zap,
  Clock,
  Database,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Gauge,
  Timer,
  TrendingUp,
  TrendingDown,
  Minimize2,
  Maximize2,
  RefreshCw,
} from 'lucide-react';
import { cn } from '@/lib/utils';

// 性能指标接口
export interface PerformanceMetrics {
  // 核心Web指标
  fcp?: number; // First Contentful Paint
  lcp?: number; // Largest Contentful Paint
  fid?: number; // First Input Delay
  cls?: number; // Cumulative Layout Shift
  ttfb?: number; // Time to First Byte

  // 自定义指标
  pageLoadTime?: number;
  domContentLoaded?: number;
  firstRender?: number;
  apiResponseTime?: number;

  // 资源指标
  memoryUsage?: number;
  jsHeapSize?: number;

  // 网络指标
  totalRequests?: number;
  totalTransferSize?: number;
  slowRequests?: number;
}

// 性能等级
type PerformanceLevel = 'excellent' | 'good' | 'fair' | 'poor';

// 性能评分
export interface PerformanceScore {
  level: PerformanceLevel;
  score: number; // 0-100
  color: string;
  message: string;
}

export interface PerformanceMonitorProps {
  enabled?: boolean;
  updateInterval?: number; // 更新间隔(ms)
  showPanel?: boolean;
  onMetricsUpdate?: (metrics: PerformanceMetrics) => void;
  onAlert?: (alert: PerformanceAlert) => void;
  className?: string;
}

// 性能告警
export interface PerformanceAlert {
  type: 'warning' | 'error';
  metric: string;
  value: number;
  threshold: number;
  message: string;
  timestamp: number;
}

export function PerformanceMonitor({
  enabled = true,
  updateInterval = 5000,
  showPanel = false,
  onMetricsUpdate,
  onAlert,
  className,
}: PerformanceMonitorProps) {
  const [metrics, setMetrics] = useState<PerformanceMetrics>({});
  const [score, setScore] = useState<PerformanceScore>({
    level: 'excellent',
    score: 100,
    color: '#00ff88',
    message: '性能优秀',
  });
  const [alerts, setAlerts] = useState<PerformanceAlert[]>([]);
  const [isExpanded, setIsExpanded] = useState(showPanel);
  const [isMonitoring, setIsMonitoring] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // 获取Web Vitals
  const getWebVitals = useCallback((): PerformanceMetrics => {
    const vitals: PerformanceMetrics = {};

    try {
      // 获取性能条目
      const perfData = performance.getEntries();

      // First Contentful Paint (FCP)
      const fcpEntry = perfData.find(
        (entry): entry is PerformancePaintTiming =>
          entry.name === 'first-contentful-paint'
      );
      if (fcpEntry) {
        vitals.fcp = Math.round(fcpEntry.startTime);
      }

      // Largest Contentful Paint (LCP)
      const lcpEntries = perfData.filter(
        (entry): entry is any => entry.entryType === 'largest-contentful-paint'
      );
      if (lcpEntries.length > 0) {
        vitals.lcp = Math.round(lcpEntries[lcpEntries.length - 1].startTime);
      }

      // First Input Delay (FID)
      const fidEntries = perfData.filter(
        (entry): entry is any => entry.entryType === 'first-input'
      );
      if (fidEntries.length > 0) {
        vitals.fid = Math.round(fidEntries[0].processingStart - fidEntries[0].startTime);
      }

      // Cumulative Layout Shift (CLS)
      let clsValue = 0;
      const clsEntries = perfData.filter(
        (entry): entry is any => entry.entryType === 'layout-shift' && !(entry as any).hadRecentInput
      );
      clsEntries.forEach((entry) => {
        clsValue += (entry as any).value;
      });
      vitals.cls = Math.round(clsValue * 1000) / 1000;

      // Time to First Byte (TTFB)
      const navigationEntry = perfData.find(
        (entry): entry is PerformanceNavigationTiming => entry.entryType === 'navigation'
      );
      if (navigationEntry) {
        vitals.ttfb = Math.round(navigationEntry.responseStart - navigationEntry.requestStart);
        vitals.pageLoadTime = Math.round(navigationEntry.loadEventEnd - navigationEntry.fetchStart);
        vitals.domContentLoaded = Math.round(navigationEntry.domContentLoadedEventEnd - navigationEntry.fetchStart);
      }
    } catch (error) {
      console.error('Failed to get web vitals:', error);
    }

    return vitals;
  }, []);

  // 获取资源指标
  const getResourceMetrics = useCallback((): PerformanceMetrics => {
    const resourceMetrics: PerformanceMetrics = {};

    try {
      const resources = performance.getEntriesByType('resource') as PerformanceResourceTiming[];

      resourceMetrics.totalRequests = resources.length;
      resourceMetrics.totalTransferSize = resources.reduce((total, resource) => {
        return total + (resource.transferSize || 0);
      }, 0);

      // 慢请求 (超过1秒)
      const slowRequests = resources.filter(
        resource => resource.duration > 1000
      );
      resourceMetrics.slowRequests = slowRequests.length;
    } catch (error) {
      console.error('Failed to get resource metrics:', error);
    }

    return resourceMetrics;
  }, []);

  // 获取内存指标
  const getMemoryMetrics = useCallback((): PerformanceMetrics => {
    const memoryMetrics: PerformanceMetrics = {};

    try {
      // @ts-ignore - Chrome specific API
      if (performance.memory) {
        // @ts-ignore
        memoryMetrics.memoryUsage = Math.round(performance.memory.usedJSHeapSize / 1024 / 1024);
        // @ts-ignore
        memoryMetrics.jsHeapSize = Math.round(performance.memory.totalJSHeapSize / 1024 / 1024);
      }
    } catch (error) {
      console.error('Failed to get memory metrics:', error);
    }

    return memoryMetrics;
  }, []);

  // 计算性能评分
  const calculateScore = useCallback((metrics: PerformanceMetrics): PerformanceScore => {
    let score = 100;
    let issues: string[] = [];

    // 评分规则 (基于Google的Core Web Vitals)
    if (metrics.fcp && metrics.fcp > 3000) {
      score -= 20;
      issues.push('首次内容绘制较慢');
    }
    if (metrics.lcp && metrics.lcp > 4000) {
      score -= 30;
      issues.push('最大内容绘制较慢');
    }
    if (metrics.fid && metrics.fid > 300) {
      score -= 20;
      issues.push('首次输入延迟较高');
    }
    if (metrics.cls && metrics.cls > 0.25) {
      score -= 30;
      issues.push('累积布局偏移较大');
    }

    // 确定等级
    let level: PerformanceLevel;
    let color: string;
    let message: string;

    if (score >= 90) {
      level = 'excellent';
      color = '#00ff88';
      message = '性能优秀';
    } else if (score >= 70) {
      level = 'good';
      color = '#00f0ff';
      message = '性能良好';
    } else if (score >= 50) {
      level = 'fair';
      color = '#f0ff00';
      message = '性能一般';
    } else {
      level = 'poor';
      color = '#ff0080';
      message = '性能较差';
    }

    if (issues.length > 0) {
      message += `: ${issues.join(', ')}`;
    }

    return { level, score: Math.max(0, score), color, message };
  }, []);

  // 检查告警条件
  const checkAlerts = useCallback((metrics: PerformanceMetrics) => {
    const newAlerts: PerformanceAlert[] = [];

    if (metrics.fcp && metrics.fcp > 3000) {
      newAlerts.push({
        type: 'warning',
        metric: 'FCP',
        value: metrics.fcp,
        threshold: 3000,
        message: `首次内容绘制过慢 (${metrics.fcp}ms)`,
        timestamp: Date.now(),
      });
    }

    if (metrics.lcp && metrics.lcp > 4000) {
      newAlerts.push({
        type: 'error',
        metric: 'LCP',
        value: metrics.lcp,
        threshold: 4000,
        message: `最大内容绘制过慢 (${metrics.lcp}ms)`,
        timestamp: Date.now(),
      });
    }

    if (metrics.cls && metrics.cls > 0.25) {
      newAlerts.push({
        type: 'error',
        metric: 'CLS',
        value: metrics.cls,
        threshold: 0.25,
        message: `累积布局偏移过大 (${metrics.cls})`,
        timestamp: Date.now(),
      });
    }

    if (newAlerts.length > 0) {
      setAlerts(prev => [...newAlerts, ...prev].slice(0, 10)); // 只保留最近10条
      newAlerts.forEach(alert => onAlert?.(alert));
    }
  }, [onAlert]);

  // 更新指标
  const updateMetrics = useCallback(() => {
    if (!enabled || !isMonitoring) return;

    const webVitals = getWebVitals();
    const resourceMetrics = getResourceMetrics();
    const memoryMetrics = getMemoryMetrics();

    const newMetrics: PerformanceMetrics = {
      ...webVitals,
      ...resourceMetrics,
      ...memoryMetrics,
    };

    setMetrics(newMetrics);
    onMetricsUpdate?.(newMetrics);

    // 计算评分
    const newScore = calculateScore(newMetrics);
    setScore(newScore);

    // 检查告警
    checkAlerts(newMetrics);
  }, [enabled, isMonitoring, getWebVitals, getResourceMetrics, getMemoryMetrics, calculateScore, checkAlerts, onMetricsUpdate]);

  // 开始监控
  const startMonitoring = useCallback(() => {
    setIsMonitoring(true);

    // 立即执行一次
    updateMetrics();

    // 设置定时更新
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    intervalRef.current = setInterval(updateMetrics, updateInterval);
  }, [updateMetrics, updateInterval]);

  // 停止监控
  const stopMonitoring = useCallback(() => {
    setIsMonitoring(false);

    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  // 组件挂载时自动开始监控
  useEffect(() => {
    if (enabled) {
      startMonitoring();
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [enabled, startMonitoring]);

  // 格式化数字
  const formatNumber = (num?: number): string => {
    if (num === undefined) return '-';
    return num.toLocaleString();
  };

  // 格式化字节
  const formatBytes = (bytes?: number): string => {
    if (bytes === undefined) return '-';
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(2)} KB`;
    return `${(bytes / 1024 / 1024).toFixed(2)} MB`;
  };

  return (
    <div className={cn("relative", className)}>
      {/* 触发按钮 */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsExpanded(!isExpanded)}
        className={cn(
          "fixed bottom-6 right-6 z-50 w-12 h-12 rounded-full",
          "bg-gradient-to-r from-cyber-cyan to-cyber-purple",
          "text-white shadow-lg shadow-cyber-cyan/20",
          "flex items-center justify-center",
          "transition-all duration-300"
        )}
        style={{
          boxShadow: `0 0 20px ${score.color}40`,
        }}
      >
        {isMonitoring ? (
          <Activity className="w-6 h-6 animate-pulse" />
        ) : (
          <Gauge className="w-6 h-6" />
        )}
      </motion.button>

      {/* 监控面板 */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="fixed bottom-24 right-6 z-50 w-80 max-h-[80vh] overflow-auto rounded-2xl bg-cyber-dark border border-cyber-cyan/20 shadow-2xl"
          >
            {/* 头部 */}
            <div className="sticky top-0 z-10 p-4 border-b border-cyber-cyan/20 bg-cyber-dark/95 backdrop-blur-sm">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-lg font-bold text-white">性能监控</h3>
                <div className="flex items-center gap-2">
                  <button
                    onClick={isMonitoring ? stopMonitoring : startMonitoring}
                    className={cn(
                      "p-2 rounded-lg transition-colors",
                      isMonitoring ? "bg-cyber-pink/20 text-cyber-pink" : "bg-cyber-green/20 text-cyber-green"
                    )}
                  >
                    {isMonitoring ? (
                      <XCircle className="w-4 h-4" />
                    ) : (
                      <CheckCircle className="w-4 h-4" />
                    )}
                  </button>
                  <button
                    onClick={updateMetrics}
                    className="p-2 rounded-lg bg-cyber-cyan/20 text-cyber-cyan hover:bg-cyber-cyan/30 transition-colors"
                  >
                    <RefreshCw className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* 性能评分 */}
              <div className="flex items-center gap-3 p-3 rounded-lg bg-cyber-muted/30">
                <div
                  className="w-16 h-16 rounded-full flex items-center justify-center text-2xl font-bold"
                  style={{
                    background: `conic-gradient(${score.color} ${score.score}%, transparent ${score.score}%)`,
                  }}
                >
                  <div className="w-14 h-14 rounded-full bg-cyber-dark flex items-center justify-center">
                    {score.score}
                  </div>
                </div>
                <div className="flex-1">
                  <p className="font-medium text-white">{score.message}</p>
                  <p className="text-sm text-gray-400">
                    {isMonitoring ? '监控中' : '已停止'}
                  </p>
                </div>
              </div>
            </div>

            {/* 性能指标 */}
            <div className="p-4 space-y-4">
              {/* Core Web Vitals */}
              <div>
                <h4 className="text-sm font-medium text-gray-400 mb-2">Core Web Vitals</h4>
                <div className="space-y-2">
                  <MetricRow
                    label="FCP"
                    value={metrics.fcp}
                    unit="ms"
                    threshold={3000}
                    icon={<Clock className="w-4 h-4" />}
                  />
                  <MetricRow
                    label="LCP"
                    value={metrics.lcp}
                    unit="ms"
                    threshold={4000}
                    icon={<Zap className="w-4 h-4" />}
                  />
                  <MetricRow
                    label="FID"
                    value={metrics.fid}
                    unit="ms"
                    threshold={300}
                    icon={<Activity className="w-4 h-4" />}
                  />
                  <MetricRow
                    label="CLS"
                    value={metrics.cls}
                    threshold={0.25}
                    icon={<Gauge className="w-4 h-4" />}
                  />
                </div>
              </div>

              {/* 资源指标 */}
              <div>
                <h4 className="text-sm font-medium text-gray-400 mb-2">资源</h4>
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-400">请求数</span>
                    <span className="text-white font-medium">{formatNumber(metrics.totalRequests)}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-400">传输大小</span>
                    <span className="text-white font-medium">{formatBytes(metrics.totalTransferSize)}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-400">内存使用</span>
                    <span className="text-white font-medium">{formatNumber(metrics.memoryUsage)} MB</span>
                  </div>
                </div>
              </div>

              {/* 告警 */}
              {alerts.length > 0 && (
                <div>
                  <h4 className="text-sm font-medium text-gray-400 mb-2">最近告警</h4>
                  <div className="space-y-2 max-h-40 overflow-auto">
                    {alerts.slice(0, 5).map((alert, index) => (
                      <div
                        key={index}
                        className={cn(
                          "flex items-start gap-2 p-2 rounded-lg text-xs",
                          alert.type === 'error' ? "bg-cyber-pink/20" : "bg-cyber-yellow/20"
                        )}
                      >
                        <AlertTriangle className={cn(
                          "w-4 h-4 flex-shrink-0 mt-0.5",
                          alert.type === 'error' ? "text-cyber-pink" : "text-cyber-yellow"
                        )} />
                        <p className="text-gray-300">{alert.message}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// 指标行组件
interface MetricRowProps {
  label: string;
  value?: number;
  unit?: string;
  threshold?: number;
  icon?: React.ReactNode;
}

function MetricRow({ label, value, unit, threshold, icon }: MetricRowProps) {
  if (value === undefined) {
    return (
      <div className="flex items-center justify-between text-sm">
        <div className="flex items-center gap-2 text-gray-500">
          {icon}
          <span>{label}</span>
        </div>
        <span>-</span>
      </div>
    );
  }

  let statusColor = 'text-cyber-green';
  if (threshold && value > threshold) {
    statusColor = 'text-cyber-pink';
  } else if (threshold && value > threshold * 0.8) {
    statusColor = 'text-cyber-yellow';
  }

  return (
    <div className="flex items-center justify-between text-sm">
      <div className="flex items-center gap-2 text-gray-400">
        {icon}
        <span>{label}</span>
      </div>
      <div className={cn("font-medium", statusColor)}>
        {value.toLocaleString()}{unit}
      </div>
    </div>
  );
}

export default PerformanceMonitor;
