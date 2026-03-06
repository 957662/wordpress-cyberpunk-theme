'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { motion } from 'framer-motion';
import { Activity, Zap, Clock, Monitor, X, RefreshCw } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface PerformanceMetrics {
  // 核心 Web 指标
  fcp?: number; // First Contentful Paint
  lcp?: number; // Largest Contentful Paint
  fid?: number; // First Input Delay
  cls?: number; // Cumulative Layout Shift
  ttfb?: number; // Time to First Byte

  // 自定义指标
  domContentLoaded?: number;
  loadComplete?: number;
  renderTime?: number;

  // 运行时指标
  fps?: number;
  memoryUsage?: number;
  jsHeapSize?: number;
}

export interface PerformanceMonitorProps {
  position?: 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left';
  refreshInterval?: number;
  showMetrics?: (keyof PerformanceMetrics)[];
  className?: string;
}

const formatValue = (value: number, unit: string): string => {
  return `${value.toFixed(2)}${unit}`;
};

const getMetricColor = (value: number, type: 'time' | 'score' | 'memory'): string => {
  if (type === 'time') {
    if (value < 1000) return 'text-cyber-green';
    if (value < 2500) return 'text-cyber-yellow';
    return 'text-cyber-pink';
  }
  if (type === 'score') {
    if (value >= 0.9) return 'text-cyber-green';
    if (value >= 0.7) return 'text-cyber-yellow';
    return 'text-cyber-pink';
  }
  if (type === 'memory') {
    const valueInMB = value / (1024 * 1024);
    if (valueInMB < 50) return 'text-cyber-green';
    if (valueInMB < 100) return 'text-cyber-yellow';
    return 'text-cyber-pink';
  }
  return 'text-cyber-cyan';
};

const getMetricRating = (value: number, type: 'time' | 'score' | 'memory'): 'good' | 'needs-improvement' | 'poor' => {
  if (type === 'time') {
    if (value < 1000) return 'good';
    if (value < 2500) return 'needs-improvement';
    return 'poor';
  }
  if (type === 'score') {
    if (value >= 0.9) return 'good';
    if (value >= 0.7) return 'needs-improvement';
    return 'poor';
  }
  if (type === 'memory') {
    const valueInMB = value / (1024 * 1024);
    if (valueInMB < 50) return 'good';
    if (valueInMB < 100) return 'needs-improvement';
    return 'poor';
  }
  return 'good';
};

export const PerformanceMonitor: React.FC<PerformanceMonitorProps> = ({
  position = 'bottom-right',
  refreshInterval = 1000,
  showMetrics,
  className,
}) => {
  const [metrics, setMetrics] = useState<PerformanceMetrics>({});
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const fpsIntervalRef = useRef<NodeJS.Timeout>();
  const lastTimeRef = useRef<number>(Date.now());
  const framesRef = useRef<number>(0);

  // 测量 FPS
  const measureFPS = useCallback(() => {
    const now = Date.now();
    framesRef.current++;

    if (now >= lastTimeRef.current + 1000) {
      const fps = Math.round((framesRef.current * 1000) / (now - lastTimeRef.current));
      setMetrics((prev) => ({ ...prev, fps }));
      framesRef.current = 0;
      lastTimeRef.current = now;
    }

    fpsIntervalRef.current = requestAnimationFrame(measureFPS);
  }, []);

  // 获取 Web Vitals
  const getWebVitals = useCallback(async () => {
    if (typeof window === 'undefined' || !window.performance) return;

    setIsLoading(true);

    // 等待一小段时间以确保数据可用
    await new Promise((resolve) => setTimeout(resolve, 100));

    const perfData = window.performance;
    const navigation = perfData.timing;
    const memory = (perfData as any).memory;

    const newMetrics: PerformanceMetrics = {};

    // 页面加载时序
    if (navigation) {
      newMetrics.domContentLoaded = navigation.domContentLoadedEventEnd - navigation.navigationStart;
      newMetrics.loadComplete = navigation.loadEventEnd - navigation.navigationStart;
      newMetrics.ttfb = navigation.responseStart - navigation.navigationStart;
    }

    // 内存使用
    if (memory) {
      newMetrics.memoryUsage = memory.usedJSHeapSize;
      newMetrics.jsHeapSize = memory.totalJSHeapSize;
    }

    // 获取 Paint Timing
    const paintEntries = perfData.getEntriesByType('paint') as PerformancePaintTiming[];
    const fcpEntry = paintEntries.find((entry) => entry.name === 'first-contentful-paint');
    if (fcpEntry) {
      newMetrics.fcp = fcpEntry.startTime;
    }

    // 获取 LCP
    if ('PerformanceObserver' in window) {
      try {
        const lcpEntries = await new Promise<PerformanceEntry[]>((resolve) => {
          const observer = new PerformanceObserver((list) => {
            resolve(list.getEntries());
            observer.disconnect();
          });
          observer.observe({ entryTypes: ['largest-contentful-paint'] });
        });
        if (lcpEntries.length > 0) {
          newMetrics.lcp = lcpEntries[lcpEntries.length - 1].startTime;
        }
      } catch (e) {
        console.warn('LCP measurement not supported:', e);
      }
    }

    // 计算 CLS
    try {
      const clsEntries = perfData.getEntriesByType('layout-shift') as any[];
      let clsValue = 0;
      clsEntries.forEach((entry) => {
        if (!entry.hadRecentInput) {
          clsValue += entry.value;
        }
      });
      newMetrics.cls = clsValue;
    } catch (e) {
      console.warn('CLS measurement not supported:', e);
    }

    // 计算渲染时间
    if (navigation && navigation.domComplete && navigation.domLoading) {
      newMetrics.renderTime = navigation.domComplete - navigation.domLoading;
    }

    setMetrics((prev) => ({ ...prev, ...newMetrics }));
    setIsLoading(false);
  }, []);

  // 初始加载和刷新
  useEffect(() => {
    getWebVitals();
    measureFPS();

    return () => {
      if (fpsIntervalRef.current) {
        cancelAnimationFrame(fpsIntervalRef.current);
      }
    };
  }, [getWebVitals, measureFPS]);

  // 定期刷新
  useEffect(() => {
    if (!isOpen) return;

    const interval = setInterval(() => {
      getWebVitals();
    }, refreshInterval);

    return () => clearInterval(interval);
  }, [isOpen, refreshInterval, getWebVitals]);

  // 渲染指标项
  const renderMetric = (
    label: string,
    value: number | undefined,
    unit: string,
    type: 'time' | 'score' | 'memory',
    icon: React.ReactNode
  ) => {
    if (value === undefined) return null;

    const color = getMetricColor(value, type);
    const rating = getMetricRating(value, type);

    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between p-3 bg-cyber-dark/50 rounded-lg border border-cyber-border"
      >
        <div className="flex items-center gap-2">
          <div className={cn('text-cyber-cyan', rating === 'good' ? 'opacity-50' : '')}>
            {icon}
          </div>
          <span className="text-sm text-gray-400">{label}</span>
        </div>
        <div className={cn('text-sm font-mono font-semibold', color)}>
          {formatValue(value, unit)}
        </div>
      </motion.div>
    );
  };

  const allMetrics: (keyof PerformanceMetrics)[] = showMetrics || [
    'fcp',
    'lcp',
    'fid',
    'cls',
    'ttfb',
    'domContentLoaded',
    'loadComplete',
    'renderTime',
    'fps',
    'memoryUsage',
  ];

  const positionClasses = {
    'bottom-right': 'bottom-4 right-4',
    'bottom-left': 'bottom-4 left-4',
    'top-right': 'top-4 right-4',
    'top-left': 'top-4 left-4',
  };

  return (
    <>
      {/* 触发按钮 */}
      <motion.button
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          'fixed z-50 p-3 rounded-full bg-cyber-dark border border-cyber-border shadow-lg',
          'hover:border-cyber-cyan transition-colors',
          positionClasses[position],
          !isOpen && className
        )}
        aria-label="性能监控"
      >
        <Activity className="w-5 h-5 text-cyber-cyan" />
      </motion.button>

      {/* 性能面板 */}
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          className={cn(
            'fixed z-50 w-80 max-h-[80vh] overflow-y-auto',
            'bg-cyber-dark/95 backdrop-blur-lg border border-cyber-border rounded-lg shadow-2xl',
            positionClasses[position],
            className
          )}
        >
          {/* 头部 */}
          <div className="sticky top-0 z-10 p-4 border-b border-cyber-border bg-cyber-dark/50 backdrop-blur-sm">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Monitor className="w-5 h-5 text-cyber-cyan" />
                <h3 className="font-semibold text-white">性能监控</h3>
              </div>
              <div className="flex items-center gap-2">
                <motion.button
                  whileHover={{ scale: 1.1, rotate: 180 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={getWebVitals}
                  disabled={isLoading}
                  className="p-1 text-gray-400 hover:text-cyber-cyan transition-colors disabled:opacity-50"
                  aria-label="刷新"
                >
                  <RefreshCw className={cn('w-4 h-4', isLoading && 'animate-spin')} />
                </motion.button>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-1 text-gray-400 hover:text-white transition-colors"
                  aria-label="关闭"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          {/* 指标列表 */}
          <div className="p-4 space-y-3">
            {/* 核心 Web 指标 */}
            <div className="space-y-2">
              <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                核心 Web 指标
              </h4>
              {renderMetric('FCP', metrics.fcp, 'ms', 'time', <Clock className="w-4 h-4" />)}
              {renderMetric('LCP', metrics.lcp, 'ms', 'time', <Clock className="w-4 h-4" />)}
              {renderMetric('CLS', metrics.cls, '', 'score', <Activity className="w-4 h-4" />)}
              {renderMetric('TTFB', metrics.ttfb, 'ms', 'time', <Zap className="w-4 h-4" />)}
            </div>

            {/* 页面加载 */}
            <div className="space-y-2">
              <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                页面加载
              </h4>
              {renderMetric('DOM Content', metrics.domContentLoaded, 'ms', 'time', <Clock className="w-4 h-4" />)}
              {renderMetric('Load Complete', metrics.loadComplete, 'ms', 'time', <Clock className="w-4 h-4" />)}
              {renderMetric('Render Time', metrics.renderTime, 'ms', 'time', <Activity className="w-4 h-4" />)}
            </div>

            {/* 运行时指标 */}
            <div className="space-y-2">
              <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                运行时
              </h4>
              {renderMetric('FPS', metrics.fps, '', 'score', <Activity className="w-4 h-4" />)}
              {renderMetric('Memory', metrics.memoryUsage, 'MB', 'memory', <Monitor className="w-4 h-4" />)}
            </div>
          </div>
        </motion.div>
      )}
    </>
  );
};

export default PerformanceMonitor;
