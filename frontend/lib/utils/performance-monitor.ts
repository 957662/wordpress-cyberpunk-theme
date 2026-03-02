/**
 * 性能监控工具
 * 提供全面的性能监控和测量功能
 */

export interface PerformanceMetrics {
  // 导航指标
  domContentLoaded: number;
  loadComplete: number;
  firstPaint: number;
  firstContentfulPaint: number;

  // Web Vitals
  LCP: number; // Largest Contentful Paint
  FID: number; // First Input Delay
  CLS: number; // Cumulative Layout Shift
  FCP: number; // First Contentful Paint
  TTFB: number; // Time to First Byte

  // 资源指标
  resourceCount: number;
  totalTransferSize: number;
  totalDecodeTime: number;

  // 自定义指标
  pageRenderTime: number;
  apiResponseTime: number;
}

export interface PerformanceEntry {
  name: string;
  value: number;
  timestamp: number;
  rating: 'good' | 'needs-improvement' | 'poor';
}

/**
 * 性能监控器类
 */
export class PerformanceMonitor {
  private metrics: PerformanceMetrics;
  private entries: PerformanceEntry[] = [];
  private observer?: PerformanceObserver;

  constructor() {
    this.metrics = this.initializeMetrics();
    this.setupObservers();
  }

  /**
   * 初始化指标
   */
  private initializeMetrics(): PerformanceMetrics {
    return {
      domContentLoaded: 0,
      loadComplete: 0,
      firstPaint: 0,
      firstContentfulPaint: 0,
      LCP: 0,
      FID: 0,
      CLS: 0,
      FCP: 0,
      TTFB: 0,
      resourceCount: 0,
      totalTransferSize: 0,
      totalDecodeTime: 0,
      pageRenderTime: 0,
      apiResponseTime: 0,
    };
  }

  /**
   * 设置性能观察器
   */
  private setupObservers() {
    if (typeof window === 'undefined') return;

    // 监听 Paint Timing
    try {
      const paintObserver = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          if (entry.name === 'first-paint') {
            this.metrics.firstPaint = entry.startTime;
          } else if (entry.name === 'first-contentful-paint') {
            this.metrics.firstContentfulPaint = entry.startTime;
            this.metrics.FCP = entry.startTime;
          }
        }
      });
      paintObserver.observe({ entryTypes: ['paint'] });
    } catch (e) {
      console.warn('Paint timing not supported');
    }

    // 监听 Largest Contentful Paint
    try {
      const lcpObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        const lastEntry = entries[entries.length - 1];
        this.metrics.LCP = lastEntry.startTime;
      });
      lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] });
    } catch (e) {
      console.warn('LCP not supported');
    }

    // 监听 First Input Delay
    try {
      const fidObserver = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          this.metrics.FID = entry.processingStart - entry.startTime;
        }
      });
      fidObserver.observe({ entryTypes: ['first-input'] });
    } catch (e) {
      console.warn('FID not supported');
    }

    // 监听 Layout Shift
    try {
      let clsValue = 0;
      const clsObserver = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          if (!(entry as any).hadRecentInput) {
            clsValue += (entry as any).value;
            this.metrics.CLS = clsValue;
          }
        }
      });
      clsObserver.observe({ entryTypes: ['layout-shift'] });
    } catch (e) {
      console.warn('CLS not supported');
    }

    // 监听资源加载
    try {
      const resourceObserver = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          const resource = entry as PerformanceResourceTiming;
          this.metrics.resourceCount++;
          this.metrics.totalTransferSize += resource.transferSize || 0;
          this.metrics.totalDecodeTime +=
            resource.responseEnd - resource.responseStart;
        }
      });
      resourceObserver.observe({ entryTypes: ['resource'] });
    } catch (e) {
      console.warn('Resource timing not supported');
    }
  }

  /**
   * 测量页面加载时间
   */
  measurePageLoad() {
    if (typeof window === 'undefined' || !window.performance) return;

    const timing = window.performance.timing;

    this.metrics.domContentLoaded =
      timing.domContentLoadedEventEnd - timing.navigationStart;
    this.metrics.loadComplete = timing.loadEventEnd - timing.navigationStart;
    this.metrics.TTFB = timing.responseStart - timing.navigationStart;
    this.metrics.pageRenderTime =
      timing.domComplete - timing.domLoading;
  }

  /**
   * 获取当前指标
   */
  getMetrics(): PerformanceMetrics {
    return { ...this.metrics };
  }

  /**
   * 评估指标等级
   */
  private rateMetric(
    name: string,
    value: number
  ): 'good' | 'needs-improvement' | 'poor' {
    const thresholds: Record<string, { good: number; poor: number }> = {
      LCP: { good: 2500, poor: 4000 },
      FID: { good: 100, poor: 300 },
      CLS: { good: 0.1, poor: 0.25 },
      FCP: { good: 1800, poor: 3000 },
      TTFB: { good: 800, poor: 1800 },
    };

    const threshold = thresholds[name];
    if (!threshold) return 'good';

    if (value <= threshold.good) return 'good';
    if (value <= threshold.poor) return 'needs-improvement';
    return 'poor';
  }

  /**
   * 获取格式化的指标报告
   */
  getReport(): PerformanceEntry[] {
    const metrics = this.getMetrics();
    const report: PerformanceEntry[] = [];

    const metricNames: (keyof PerformanceMetrics)[] = [
      'LCP',
      'FID',
      'CLS',
      'FCP',
      'TTFB',
      'domContentLoaded',
      'loadComplete',
    ];

    metricNames.forEach((name) => {
      const value = metrics[name];
      if (value > 0) {
        report.push({
          name,
          value,
          timestamp: Date.now(),
          rating: this.rateMetric(name, value),
        });
      }
    });

    return report;
  }

  /**
   * 测量函数执行时间
   */
  async measureFunction<T>(
    name: string,
    fn: () => Promise<T>
  ): Promise<T> {
    const start = performance.now();
    try {
      return await fn();
    } finally {
      const duration = performance.now() - start;
      this.entries.push({
        name,
        value: duration,
        timestamp: Date.now(),
        rating: 'good',
      });
    }
  }

  /**
   * 测量同步函数执行时间
   */
  measureSyncFunction<T>(name: string, fn: () => T): T {
    const start = performance.now();
    try {
      return fn();
    } finally {
      const duration = performance.now() - start;
      this.entries.push({
        name,
        value: duration,
        timestamp: Date.now(),
        rating: 'good',
      });
    }
  }

  /**
   * 标记性能点
   */
  mark(name: string) {
    if (typeof window !== 'undefined' && window.performance) {
      window.performance.mark(name);
    }
  }

  /**
   * 测量两个标记之间的时间
   */
  measure(name: string, startMark: string, endMark?: string) {
    if (typeof window !== 'undefined' && window.performance) {
      try {
        window.performance.measure(name, startMark, endMark);
        const measure = window.performance.getEntriesByName(name)[0];
        if (measure) {
          this.entries.push({
            name,
            value: measure.duration,
            timestamp: Date.now(),
            rating: 'good',
          });
        }
      } catch (e) {
        console.warn(`Failed to measure ${name}:`, e);
      }
    }
  }

  /**
   * 获取资源使用情况
   */
  getResourceTiming() {
    if (typeof window === 'undefined' || !window.performance) {
      return [];
    }

    return window.performance.getEntriesByType('resource') as PerformanceResourceTiming[];
  }

  /**
   * 分析资源加载情况
   */
  analyzeResources() {
    const resources = this.getResourceTiming();
    const analysis = {
      total: resources.length,
      byType: {} as Record<string, number>,
      slowResources: [] as Array<{ name: string; duration: number }>,
      totalSize: 0,
    };

    resources.forEach((resource) => {
      // 按类型分类
      const type = resource.initiatorType || 'other';
      analysis.byType[type] = (analysis.byType[type] || 0) + 1;

      // 计算总大小
      analysis.totalSize += resource.transferSize || 0;

      // 找出慢速资源
      const duration = resource.responseEnd - resource.startTime;
      if (duration > 1000) {
        analysis.slowResources.push({
          name: resource.name,
          duration,
        });
      }
    });

    return analysis;
  }

  /**
   * 获取内存使用情况
   */
  getMemoryUsage() {
    if (
      typeof window === 'undefined' ||
      !(performance as any).memory ||
      process.env.NODE_ENV !== 'development'
    ) {
      return null;
    }

    const memory = (performance as any).memory;
    return {
      usedJSHeapSize: memory.usedJSHeapSize,
      totalJSHeapSize: memory.totalJSHeapSize,
      jsHeapSizeLimit: memory.jsHeapSizeLimit,
      usagePercentage: (memory.usedJSHeapSize / memory.jsHeapSizeLimit) * 100,
    };
  }

  /**
   * 清除性能数据
   */
  clear() {
    if (typeof window !== 'undefined' && window.performance) {
      window.performance.clearMarks();
      window.performance.clearMeasures();
    }
    this.entries = [];
    this.metrics = this.initializeMetrics();
  }

  /**
   * 导出性能数据
   */
  export() {
    return {
      metrics: this.getMetrics(),
      entries: this.entries,
      resourceAnalysis: this.analyzeResources(),
      memoryUsage: this.getMemoryUsage(),
      timestamp: Date.now(),
      userAgent: typeof window !== 'undefined' ? window.navigator.userAgent : 'unknown',
    };
  }
}

/**
 * 创建全局性能监控器实例
 */
let globalMonitor: PerformanceMonitor | null = null;

export function getPerformanceMonitor(): PerformanceMonitor {
  if (!globalMonitor) {
    globalMonitor = new PerformanceMonitor();
  }
  return globalMonitor;
}

/**
 * 页面加载完成后自动测量
 */
export function setupPageLoadMonitoring() {
  if (typeof window === 'undefined') return;

  const monitor = getPerformanceMonitor();

  if (document.readyState === 'complete') {
    monitor.measurePageLoad();
  } else {
    window.addEventListener('load', () => {
      monitor.measurePageLoad();
    });
  }
}

/**
 * React Hook for performance monitoring
 */
export function usePerformanceMonitoring() {
  const [metrics, setMetrics] = React.useState<PerformanceMetrics | null>(null);

  React.useEffect(() => {
    const monitor = getPerformanceMonitor();

    // 定期更新指标
    const interval = setInterval(() => {
      setMetrics(monitor.getMetrics());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return {
    metrics,
    monitor: getPerformanceMonitor(),
  };
}

import React from 'react';
