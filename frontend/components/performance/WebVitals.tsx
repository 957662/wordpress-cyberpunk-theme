'use client';

import { useEffect, useState } from 'react';

interface Metric {
  id: string;
  name: string;
  value: number;
  rating: 'good' | 'needs-improvement' | 'poor';
}

/**
 * WebVitals 组件 - 监控 Core Web Vitals
 *
 * 监控指标：
 * - FCP (First Contentful Paint)
 * - LCP (Largest Contentful Paint)
 * - FID (First Input Delay)
 * - CLS (Cumulative Layout Shift)
 * - TTFB (Time to First Byte)
 */
export function WebVitals({ 
  onMetric,
  reportToAnalytics = true 
}: { 
  onMetric?: (metric: Metric) => void;
  reportToAnalytics?: boolean;
}) {
  const [metrics, setMetrics] = useState<Metric[]>([]);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // 只在开发环境显示
    if (process.env.NODE_ENV === 'development') {
      setIsVisible(true);
    }

    // 动态导入 web-vitals
    import('web-vitals').then(({ onCLS, onFID, onFCP, onLCP, onTTFB }) => {
      const logMetric = (metric: any) => {
        const metricData: Metric = {
          id: metric.id,
          name: metric.name,
          value: metric.value,
          rating: metric.rating,
        };

        setMetrics((prev) => {
          const exists = prev.findIndex((m) => m.name === metric.name);
          if (exists >= 0) {
            const updated = [...prev];
            updated[exists] = metricData;
            return updated;
          }
          return [...prev, metricData];
        });

        if (onMetric) {
          onMetric(metricData);
        }

        // 报告到分析服务
        if (reportToAnalytics) {
          reportToAnalyticsService(metricData);
        }

        console.log('[Web Vitals]', metric.name, metric.value, metric.rating);
      };

      // 注册所有指标
      onCLS(logMetric);
      onFID(logMetric);
      onFCP(logMetric);
      onLCP(logMetric);
      onTTFB(logMetric);
    });
  }, [onMetric, reportToAnalytics]);

  const reportToAnalyticsService = (metric: Metric) => {
    // 发送到 Google Analytics
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('event', metric.name, {
        event_category: 'Web Vitals',
        event_label: metric.id,
        value: Math.round(metric.name === 'CLS' ? metric.value * 1000 : metric.value),
        non_interaction: true,
      });
    }

    // 发送到自定义分析端点
    if (typeof window !== 'undefined' && navigator.sendBeacon) {
      const data = JSON.stringify({
        metric: metric.name,
        value: metric.value,
        rating: metric.rating,
        url: window.location.href,
        userAgent: navigator.userAgent,
      });

      navigator.sendBeacon('/api/analytics/web-vitals', data);
    }
  };

  const getRatingColor = (rating: string) => {
    switch (rating) {
      case 'good':
        return 'text-green-500';
      case 'needs-improvement':
        return 'text-yellow-500';
      case 'poor':
        return 'text-red-500';
      default:
        return 'text-gray-500';
    }
  };

  const getRatingIcon = (rating: string) => {
    switch (rating) {
      case 'good':
        return '✓';
      case 'needs-improvement':
        return '⚠';
      case 'poor':
        return '✗';
      default:
        return '?';
    }
  };

  if (!isVisible || metrics.length === 0) {
    return null;
  }

  return (
    <div className="fixed top-20 right-4 z-50 bg-cyber-dark/90 backdrop-blur-sm rounded-lg shadow-2xl p-4 border border-cyber-cyan/30">
      <h3 className="text-cyber-cyan font-bold mb-3 text-sm uppercase tracking-wider">
        Web Vitals
      </h3>
      <div className="space-y-2">
        {metrics.map((metric) => (
          <div key={metric.id} className="flex items-center justify-between text-xs">
            <span className="text-gray-300 font-mono">{metric.name}</span>
            <div className="flex items-center gap-2">
              <span className="text-white font-mono">
                {metric.name === 'CLS' 
                  ? metric.value.toFixed(3)
                  : Math.round(metric.value)
                }
              </span>
              <span className={getRatingColor(metric.rating)}>
                {getRatingIcon(metric.rating)}
              </span>
            </div>
          </div>
        ))}
      </div>
      <div className="mt-3 pt-3 border-t border-cyber-cyan/20">
        <button
          onClick={() => setMetrics([])}
          className="text-xs text-cyber-cyan hover:text-cyber-purple transition-colors"
        >
          Clear
        </button>
      </div>
    </div>
  );
}

/**
 * PerformanceMonitor 组件 - 详细的性能监控
 */
export function PerformanceMonitor() {
  const [perfData, setPerfData] = useState<any>(null);

  useEffect(() => {
    if (typeof window === 'undefined' || !window.performance) {
      return;
    }

    const collectPerformanceData = () => {
      const perfData = window.performance.getEntriesByType('navigation')[0] as any;
      const paintEntries = window.performance.getEntriesByType('paint');

      setPerfData({
        // 导航时序
        dns: perfData?.domainLookupEnd - perfData?.domainLookupStart,
        tcp: perfData?.connectEnd - perfData?.connectStart,
        ttfb: perfData?.responseStart - perfData?.requestStart,
        download: perfData?.responseEnd - perfData?.responseStart,
        domLoad: perfData?.domContentLoadedEventEnd - perfData?.domContentLoadedEventStart,
        load: perfData?.loadEventEnd - perfData?.loadEventStart,
        total: perfData?.loadEventEnd - perfData?.fetchStart,
        
        // 绘制时序
        fcp: paintEntries.find((e: any) => e.name === 'first-contentful-paint')?.startTime,
        fp: paintEntries.find((e: any) => e.name === 'first-paint')?.startTime,
      });
    };

    // 页面加载完成后收集数据
    if (document.readyState === 'complete') {
      collectPerformanceData();
    } else {
      window.addEventListener('load', collectPerformanceData);
      return () => window.removeEventListener('load', collectPerformanceData);
    }
  }, []);

  if (!perfData || process.env.NODE_ENV !== 'development') {
    return null;
  }

  return (
    <div className="fixed bottom-4 left-4 z-50 bg-cyber-dark/90 backdrop-blur-sm rounded-lg shadow-2xl p-4 border border-cyber-purple/30 text-xs">
      <h3 className="text-cyber-purple font-bold mb-2 uppercase tracking-wider">
        Performance
      </h3>
      <div className="grid grid-cols-2 gap-x-4 gap-y-1 font-mono">
        <span className="text-gray-400">DNS:</span>
        <span className="text-white">{perfData.dns?.toFixed(0)}ms</span>
        
        <span className="text-gray-400">TCP:</span>
        <span className="text-white">{perfData.tcp?.toFixed(0)}ms</span>
        
        <span className="text-gray-400">TTFB:</span>
        <span className="text-white">{perfData.ttfb?.toFixed(0)}ms</span>
        
        <span className="text-gray-400">Download:</span>
        <span className="text-white">{perfData.download?.toFixed(0)}ms</span>
        
        <span className="text-gray-400">FCP:</span>
        <span className="text-cyber-cyan">{perfData.fcp?.toFixed(0)}ms</span>
        
        <span className="text-gray-400">Total:</span>
        <span className="text-cyber-green">{perfData.total?.toFixed(0)}ms</span>
      </div>
    </div>
  );
}

/**
 * ErrorBoundary 组件 - 错误追踪
 */
export class ErrorBoundary extends React.Component<
  { children: React.ReactNode; onError?: (error: Error, errorInfo: any) => void },
  { hasError: boolean; error: Error | null }
> {
  constructor(props: any) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: any) {
    console.error('[Error Boundary]', error, errorInfo);

    // 报告错误
    if (this.props.onError) {
      this.props.onError(error, errorInfo);
    }

    // 发送到错误追踪服务
    if (typeof window !== 'undefined') {
      const errorData = {
        message: error.message,
        stack: error.stack,
        componentStack: errorInfo.componentStack,
        url: window.location.href,
        userAgent: navigator.userAgent,
      };

      fetch('/api/analytics/error', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(errorData),
      }).catch((err) => console.error('[Error Boundary] Failed to report error:', err));
    }
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-cyber-dark flex items-center justify-center p-4">
          <div className="max-w-md w-full bg-cyber-muted rounded-lg p-6 border border-cyber-pink/50">
            <h1 className="text-2xl font-bold text-cyber-pink mb-4">Oops!</h1>
            <p className="text-gray-300 mb-4">
              Something went wrong. The error has been logged and we'll look into it.
            </p>
            <button
              onClick={() => window.location.reload()}
              className="bg-cyber-cyan text-cyber-dark px-4 py-2 rounded-lg font-semibold hover:bg-cyber-cyan/90 transition-colors"
            >
              Reload Page
            </button>
            {process.env.NODE_ENV === 'development' && this.state.error && (
              <details className="mt-4">
                <summary className="cursor-pointer text-cyber-purple">
                  Error Details
                </summary>
                <pre className="mt-2 text-xs text-red-400 overflow-auto">
                  {this.state.error.stack}
                </pre>
              </details>
            )}
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default WebVitals;
