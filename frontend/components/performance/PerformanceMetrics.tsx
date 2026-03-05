'use client';

/**
 * 性能指标监控组件
 * CyberPress Platform
 *
 * 实时监控页面性能指标,包括FCP、LCP、CLS等Web Vitals
 */

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

interface MetricData {
  name: string;
  value: number;
  threshold: {
    good: number;
    needsImprovement: number;
  };
  unit: string;
  status: 'good' | 'needs-improvement' | 'poor';
}

interface PerformanceMetricsProps {
  showDetails?: boolean;
  refreshInterval?: number;
  position?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
}

const getMetricStatus = (
  value: number,
  good: number,
  needsImprovement: number
): 'good' | 'needs-improvement' | 'poor' => {
  if (value <= good) return 'good';
  if (value <= needsImprovement) return 'needs-improvement';
  return 'poor';
};

const getStatusColor = (status: string): string => {
  switch (status) {
    case 'good':
      return 'text-cyber-green';
    case 'needs-improvement':
      return 'text-cyber-yellow';
    case 'poor':
      return 'text-cyber-pink';
    default:
      return 'text-cyber-cyan';
  }
};

const getStatusBgColor = (status: string): string => {
  switch (status) {
    case 'good':
      return 'bg-cyber-green/20';
    case 'needs-improvement':
      return 'bg-cyber-yellow/20';
    case 'poor':
      return 'bg-cyber-pink/20';
    default:
      return 'bg-cyber-cyan/20';
  }
};

export function PerformanceMetrics({
  showDetails = false,
  refreshInterval = 5000,
  position = 'bottom-right',
}: PerformanceMetricsProps) {
  const [metrics, setMetrics] = useState<MetricData[]>([]);
  const [isVisible, setIsVisible] = useState(false);
  const [score, setScore] = useState<number>(0);

  const getPositionClasses = () => {
    switch (position) {
      case 'top-left':
        return 'top-4 left-4';
      case 'top-right':
        return 'top-4 right-4';
      case 'bottom-left':
        return 'bottom-4 left-4';
      case 'bottom-right':
        return 'bottom-4 right-4';
      default:
        return 'bottom-4 right-4';
    }
  };

  useEffect(() => {
    // 检测 Web Vitals
    if (typeof window !== 'undefined' && 'PerformanceObserver' in window) {
      // FCP - First Contentful Paint
      try {
        const fcpObserver = new PerformanceObserver((list) => {
          for (const entry of list.getEntries()) {
            if (entry.name === 'first-contentful-paint') {
              const value = entry.startTime;
              updateMetric('FCP', value, 1800, 3000, 'ms');
              break;
            }
          }
        });
        fcpObserver.observe({ entryTypes: ['paint'] });
      } catch (e) {
        console.warn('FCP observation not supported');
      }

      // LCP - Largest Contentful Paint
      try {
        let lcpValue = 0;
        const lcpObserver = new PerformanceObserver((list) => {
          const entries = list.getEntries();
          const lastEntry = entries[entries.length - 1];
          lcpValue = lastEntry.startTime;
          updateMetric('LCP', lcpValue, 2500, 4000, 'ms');
        });
        lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] });
      } catch (e) {
        console.warn('LCP observation not supported');
      }

      // CLS - Cumulative Layout Shift
      try {
        let clsValue = 0;
        const clsObserver = new PerformanceObserver((list) => {
          for (const entry of list.getEntries()) {
            if (!entry.hadRecentInput) {
              clsValue += (entry as any).value;
            }
          }
          updateMetric('CLS', clsValue, 0.1, 0.25, '');
        });
        clsObserver.observe({ entryTypes: ['layout-shift'] });
      } catch (e) {
        console.warn('CLS observation not supported');
      }

      // FID - First Input Delay
      try {
        const fidObserver = new PerformanceObserver((list) => {
          for (const entry of list.getEntries()) {
            updateMetric('FID', (entry as any).processingStart - entry.startTime, 100, 300, 'ms');
            break;
          }
        });
        fidObserver.observe({ entryTypes: ['first-input'] });
      } catch (e) {
        console.warn('FID observation not supported');
      }

      // TTFB - Time to First Byte
      const navigationEntry = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
      if (navigationEntry) {
        const ttfb = navigationEntry.responseStart - navigationEntry.requestStart;
        updateMetric('TTFB', ttfb, 800, 1800, 'ms');
      }
    }

    // 计算性能分数
    const calculateScore = () => {
      if (metrics.length === 0) return 0;

      let totalScore = 0;
      metrics.forEach((metric) => {
        switch (metric.status) {
          case 'good':
            totalScore += 100;
            break;
          case 'needs-improvement':
            totalScore += 50;
            break;
          case 'poor':
            totalScore += 0;
            break;
        }
      });

      return Math.round(totalScore / metrics.length);
    };

    setScore(calculateScore());

    // 刷新数据
    const interval = setInterval(() => {
      // 重新计算分数
      setScore(calculateScore());
    }, refreshInterval);

    return () => clearInterval(interval);
  }, [metrics, refreshInterval]);

  const updateMetric = (
    name: string,
    value: number,
    good: number,
    needsImprovement: number,
    unit: string
  ) => {
    const status = getMetricStatus(value, good, needsImprovement);

    setMetrics((prev) => {
      const existing = prev.find((m) => m.name === name);
      if (existing) {
        return prev.map((m) =>
          m.name === name
            ? { ...m, value, status }
            : m
        );
      }
      return [
        ...prev,
        {
          name,
          value,
          threshold: { good, needsImprovement },
          unit,
          status,
        },
      ];
    });
  };

  if (metrics.length === 0) {
    return null;
  }

  return (
    <>
      {/* 切换按钮 */}
      <motion.button
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        className={`fixed ${getPositionClasses()} z-50 p-2 rounded-lg bg-cyber-dark/80 backdrop-blur-sm border border-cyber-cyan/30 hover:border-cyber-cyan/60 transition-all`}
        onClick={() => setIsVisible(!isVisible)}
        title="性能指标"
      >
        <div className="flex items-center gap-2">
          <div className={`text-lg font-bold ${getStatusColor(
            score >= 80 ? 'good' : score >= 50 ? 'needs-improvement' : 'poor'
          )}`}>
            {score}
          </div>
          <svg
            className="w-5 h-5 text-cyber-cyan"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
            />
          </svg>
        </div>
      </motion.button>

      {/* 详细信息面板 */}
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          className={`fixed ${getPositionClasses()} z-50 mt-12 p-4 rounded-lg bg-cyber-dark/95 backdrop-blur-md border border-cyber-cyan/30 shadow-lg shadow-cyber-cyan/10`}
          style={{ minWidth: '280px' }}
        >
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-lg font-bold text-cyber-cyan">性能指标</h3>
            <button
              onClick={() => setIsVisible(false)}
              className="text-gray-400 hover:text-white transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* 总体分数 */}
          <div className="mb-4 p-3 rounded-lg bg-cyber-muted/50 border border-cyber-cyan/20">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-400">性能分数</span>
              <span className={`text-2xl font-bold ${getStatusColor(
                score >= 80 ? 'good' : score >= 50 ? 'needs-improvement' : 'poor'
              )}`}>
                {score}
              </span>
            </div>
            <div className="mt-2 h-2 bg-gray-700 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${score}%` }}
                transition={{ duration: 0.5 }}
                className={`h-full ${
                  score >= 80
                    ? 'bg-cyber-green'
                    : score >= 50
                    ? 'bg-cyber-yellow'
                    : 'bg-cyber-pink'
                }`}
              />
            </div>
          </div>

          {/* 详细指标 */}
          <div className="space-y-2">
            {metrics.map((metric) => (
              <div
                key={metric.name}
                className={`p-2 rounded ${getStatusBgColor(metric.status)} border border-${
                  metric.status === 'good'
                    ? 'cyber-green'
                    : metric.status === 'needs-improvement'
                    ? 'cyber-yellow'
                    : 'cyber-pink'
                }/20`}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-xs text-gray-400">{metric.name}</div>
                    <div className={`text-sm font-bold ${getStatusColor(metric.status)}`}>
                      {metric.value.toFixed(metric.name === 'CLS' ? 3 : 0)}
                      {metric.unit}
                    </div>
                  </div>
                  <div className={`text-xs px-2 py-1 rounded ${getStatusBgColor(
                    metric.status
                  )} ${getStatusColor(metric.status)}`}>
                    {metric.status === 'good' ? '优秀' : metric.status === 'needs-improvement' ? '需改进' : '较差'}
                  </div>
                </div>
                {showDetails && (
                  <div className="mt-1 text-xs text-gray-500">
                    阈值: ≤{metric.threshold.good}{metric.unit} (优秀) / ≤{metric.threshold.needsImprovement}{metric.unit} (需改进)
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* 提示信息 */}
          <div className="mt-3 text-xs text-gray-500">
            * 基于 Web Vitals 标准
          </div>
        </motion.div>
      )}
    </>
  );
}

export default PerformanceMetrics;
