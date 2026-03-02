'use client';

import { useEffect, useState, useRef } from 'react';
import { Activity, Zap, Clock, Database } from 'lucide-react';

interface PerformanceMetrics {
  // Web Vitals
  FCP?: number; // First Contentful Paint
  LCP?: number; // Largest Contentful Paint
  FID?: number; // First Input Delay
  CLS?: number; // Cumulative Layout Shift
  TTFB?: number; // Time to First Byte

  // Custom Metrics
  domContentLoaded?: number;
  loadComplete?: number;
  renderTime?: number;
}

interface PerformanceMonitorProps {
  /**
   * 是否显示性能指标面板
   */
  showPanel?: boolean;

  /**
   * 采样率 (0-1)
   */
  sampleRate?: number;

  /**
   * 上报端点
   */
  reportEndpoint?: string;

  /**
   * 阈值配置
   */
  thresholds?: {
    FCP?: number;
    LCP?: number;
    FID?: number;
    CLS?: number;
    TTFB?: number;
  };
}

export function PerformanceMonitor({
  showPanel = false,
  sampleRate = 1,
  reportEndpoint,
  thresholds = {
    FCP: 1800,
    LCP: 2500,
    FID: 100,
    CLS: 0.1,
    TTFB: 600,
  },
}: PerformanceMonitorProps) {
  const [metrics, setMetrics] = useState<PerformanceMetrics>({});
  const [isVisible, setIsVisible] = useState(showPanel);
  const reportedMetrics = useRef<Set<string>>(new Set());

  useEffect(() => {
    // 检查采样率
    if (Math.random() > sampleRate) return;

    // 测量 Core Web Vitals
    const measureWebVitals = async () => {
      // 动态导入 web-vitals 库
      try {
        const { getFCP, getLCP, getFID, getCLS, getTTFB } = await import('web-vitals');

        getFCP((metric) => {
          const value = metric.value;
          setMetrics((prev) => ({ ...prev, FCP: value }));
          reportMetric('FCP', value, thresholds.FCP);
        });

        getLCP((metric) => {
          const value = metric.value;
          setMetrics((prev) => ({ ...prev, LCP: value }));
          reportMetric('LCP', value, thresholds.LCP);
        });

        getFID((metric) => {
          const value = metric.value;
          setMetrics((prev) => ({ ...prev, FID: value }));
          reportMetric('FID', value, thresholds.FID);
        });

        getCLS((metric) => {
          const value = metric.value;
          setMetrics((prev) => ({ ...prev, CLS: value }));
          reportMetric('CLS', value, thresholds.CLS);
        });

        getTTFB((metric) => {
          const value = metric.value;
          setMetrics((prev) => ({ ...prev, TTFB: value }));
          reportMetric('TTFB', value, thresholds.TTFB);
        });
      } catch (error) {
        console.warn('Failed to load web-vitals:', error);
      }
    };

    // 测量自定义指标
    const measureCustomMetrics = () => {
      if (typeof window === 'undefined' || !window.performance) return;

      const perfData = window.performance.timing;
      const navigationStart = perfData.navigationStart;

      const domContentLoaded = perfData.domContentLoadedEventEnd - navigationStart;
      const loadComplete = perfData.loadEventEnd - navigationStart;
      const renderTime = perfData.domComplete - perfData.domLoading;

      setMetrics((prev) => ({
        ...prev,
        domContentLoaded,
        loadComplete,
        renderTime,
      }));
    };

    measureWebVitals();

    // 等待页面加载完成后测量自定义指标
    if (document.readyState === 'complete') {
      measureCustomMetrics();
    } else {
      window.addEventListener('load', measureCustomMetrics);
      return () => window.removeEventListener('load', measureCustomMetrics);
    }
  }, [sampleRate, thresholds, reportEndpoint]);

  const reportMetric = (name: string, value: number, threshold?: number) => {
    if (!reportEndpoint) return;

    const key = `${name}-${value}`;
    if (reportedMetrics.current.has(key)) return;

    reportedMetrics.current.add(key);

    const rating = threshold ? (value <= threshold ? 'good' : 'poor') : 'unknown';

    fetch(reportEndpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name,
        value,
        rating,
        timestamp: Date.now(),
        url: window.location.href,
        userAgent: navigator.userAgent,
      }),
      keepalive: true,
    }).catch(console.error);
  };

  const getRatingColor = (value: number | undefined, threshold?: number) => {
    if (!value) return 'text-gray-500';
    if (!threshold) return 'text-gray-400';
    return value <= threshold ? 'text-green-400' : 'text-red-400';
  };

  const formatValue = (value: number | undefined, unit = 'ms') => {
    if (value === undefined) return '-';
    if (unit === 'ms') return `${Math.round(value)}ms`;
    return `${value.toFixed(2)}${unit}`;
  };

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-4 right-4 bg-cyber-dark/95 border border-cyber-cyan/30 rounded-lg p-4 shadow-xl z-50 backdrop-blur-sm">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Activity className="text-cyber-cyan" size={20} />
          <h3 className="text-sm font-semibold text-white">性能监控</h3>
        </div>
        <button
          onClick={() => setIsVisible(false)}
          className="text-gray-400 hover:text-white transition-colors"
        >
          ×
        </button>
      </div>

      <div className="space-y-2 text-xs">
        <div className="flex items-center justify-between gap-4">
          <span className="text-gray-400 flex items-center gap-1">
            <Zap size={14} />
            FCP
          </span>
          <span className={getRatingColor(metrics.FCP, thresholds.FCP)}>
            {formatValue(metrics.FCP)}
          </span>
        </div>

        <div className="flex items-center justify-between gap-4">
          <span className="text-gray-400 flex items-center gap-1">
            <Clock size={14} />
            LCP
          </span>
          <span className={getRatingColor(metrics.LCP, thresholds.LCP)}>
            {formatValue(metrics.LCP)}
          </span>
        </div>

        <div className="flex items-center justify-between gap-4">
          <span className="text-gray-400">FID</span>
          <span className={getRatingColor(metrics.FID, thresholds.FID)}>
            {formatValue(metrics.FID)}
          </span>
        </div>

        <div className="flex items-center justify-between gap-4">
          <span className="text-gray-400">CLS</span>
          <span className={getRatingColor(metrics.CLS, thresholds.CLS)}>
            {formatValue(metrics.CLS, '')}
          </span>
        </div>

        <div className="flex items-center justify-between gap-4">
          <span className="text-gray-400 flex items-center gap-1">
            <Database size={14} />
            TTFB
          </span>
          <span className={getRatingColor(metrics.TTFB, thresholds.TTFB)}>
            {formatValue(metrics.TTFB)}
          </span>
        </div>

        {metrics.domContentLoaded && (
          <div className="flex items-center justify-between gap-4 border-t border-gray-700 pt-2 mt-2">
            <span className="text-gray-400">DOM Ready</span>
            <span className="text-gray-300">{formatValue(metrics.domContentLoaded)}</span>
          </div>
        )}

        {metrics.loadComplete && (
          <div className="flex items-center justify-between gap-4">
            <span className="text-gray-400">Load Time</span>
            <span className="text-gray-300">{formatValue(metrics.loadComplete)}</span>
          </div>
        )}
      </div>
    </div>
  );
}

/**
 * 性能监控触发器按钮
 */
export function PerformanceTrigger() {
  const [isVisible, setIsVisible] = useState(false);

  return (
    <>
      <button
        onClick={() => setIsVisible(true)}
        className="fixed bottom-4 right-4 bg-cyber-cyan/10 border border-cyber-cyan/30 rounded-full p-2 hover:bg-cyber-cyan/20 transition-colors z-40"
        title="显示性能监控"
      >
        <Activity className="text-cyber-cyan" size={20} />
      </button>
      {isVisible && <PerformanceMonitor showPanel />}
    </>
  );
}

/**
 * 使用性能指标的 Hook
 */
export function usePerformanceMetrics() {
  const [metrics, setMetrics] = useState<PerformanceMetrics>({});

  useEffect(() => {
    // 只在客户端执行
    if (typeof window === 'undefined') return;

    const updateMetrics = () => {
      if ('performance' in window) {
        const perfData = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;

        setMetrics({
          domContentLoaded: perfData.domContentLoadedEventEnd - perfData.fetchStart,
          loadComplete: perfData.loadEventEnd - perfData.fetchStart,
          renderTime: perfData.domComplete - perfData.domInteractive,
        });
      }
    };

    if (document.readyState === 'complete') {
      updateMetrics();
    } else {
      window.addEventListener('load', updateMetrics);
      return () => window.removeEventListener('load', updateMetrics);
    }
  }, []);

  return metrics;
}

export default PerformanceMonitor;
