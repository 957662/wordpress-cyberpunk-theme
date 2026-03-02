/**
 * Performance Monitoring Utilities
 * 性能监控工具函数
 */

import { type PerformanceEntry } from 'perf_hooks';

// 性能指标接口
interface PerformanceMetrics {
  // 导航指标
  domContentLoaded: number;
  loadComplete: number;
  firstPaint: number;
  firstContentfulPaint: number;

  // 资源指标
  resourceCount: number;
  totalTransferSize: number;
  totalDecodedBodySize: number;

  // 渲染指标
  renderTime: number;
  scriptTime: number;
  layoutTime: number;
  paintTime: number;

  // 内存指标
  memoryUsed: number;
  memoryTotal: number;
  memoryLimit: number;
}

// 性能标记接口
interface PerformanceMark {
  name: string;
  startTime: number;
  duration: number;
}

// 创建性能标记
export function markPerformance(name: string): void {
  if (typeof performance !== 'undefined' && performance.mark) {
    try {
      performance.mark(name);
    } catch (e) {
      console.warn('Performance mark error:', e);
    }
  }
}

// 测量两个标记之间的时间
export function measurePerformance(name: string, startMark: string, endMark: string): number {
  if (typeof performance !== 'undefined' && performance.measure) {
    try {
      performance.measure(name, startMark, endMark);
      const entries = performance.getEntriesByName(name, 'measure');
      if (entries.length > 0) {
        return entries[0].duration;
      }
    } catch (e) {
      console.warn('Performance measure error:', e);
    }
  }
  return 0;
}

// 获取所有性能指标
export function getPerformanceMetrics(): PerformanceMetrics | null {
  if (typeof window === 'undefined' || !window.performance) {
    return null;
  }

  const perfData = window.performance;
  const navigation = perfData.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
  const paint = perfData.getEntriesByType('paint');
  const resources = perfData.getEntriesByType('resource') as PerformanceResourceTiming[];

  const metrics: PerformanceMetrics = {
    domContentLoaded: 0,
    loadComplete: 0,
    firstPaint: 0,
    firstContentfulPaint: 0,
    resourceCount: 0,
    totalTransferSize: 0,
    totalDecodedBodySize: 0,
    renderTime: 0,
    scriptTime: 0,
    layoutTime: 0,
    paintTime: 0,
    memoryUsed: 0,
    memoryTotal: 0,
    memoryLimit: 0,
  };

  // 导航指标
  if (navigation) {
    metrics.domContentLoaded = navigation.domContentLoadedEventEnd - navigation.fetchStart;
    metrics.loadComplete = navigation.loadEventEnd - navigation.fetchStart;
  }

  // 绘制指标
  if (paint) {
    const fp = paint.find((entry) => entry.name === 'first-paint');
    const fcp = paint.find((entry) => entry.name === 'first-contentful-paint');

    if (fp) metrics.firstPaint = fp.startTime;
    if (fcp) metrics.firstContentfulPaint = fcp.startTime;
  }

  // 资源指标
  if (resources) {
    metrics.resourceCount = resources.length;

    resources.forEach((resource) => {
      if (resource.transferSize) {
        metrics.totalTransferSize += resource.transferSize;
      }
      if (resource.decodedBodySize) {
        metrics.totalDecodedBodySize += resource.decodedBodySize;
      }

      // 脚本时间
      if (resource.initiatorType === 'script') {
        metrics.scriptTime += resource.duration;
      }
    });
  }

  // 内存指标
  if ((performance as any).memory) {
    const memory = (performance as any).memory;
    metrics.memoryUsed = memory.usedJSHeapSize;
    metrics.memoryTotal = memory.totalJSHeapSize;
    metrics.memoryLimit = memory.jsHeapSizeLimit;
  }

  return metrics;
}

// 获取 Web Vitals
export function getWebVitals() {
  if (typeof window === 'undefined' || !window.performance) {
    return null;
  }

  const vitals: {
    LCP?: number; // Largest Contentful Paint
    FID?: number; // First Input Delay
    CLS?: number; // Cumulative Layout Shift
    FCP?: number; // First Contentful Paint
    TTFB?: number; // Time to First Byte
  } = {};

  // LCP - 需要使用 PerformanceObserver
  try {
    if ('PerformanceObserver' in window) {
      const observer = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        const lastEntry = entries[entries.length - 1];
        vitals.LCP = lastEntry.startTime;
      });

      observer.observe({ entryTypes: ['largest-contentful-paint'] });
    }
  } catch (e) {
    console.warn('LCP measurement error:', e);
  }

  // FID
  try {
    if ('PerformanceObserver' in window) {
      const observer = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        entries.forEach((entry: any) => {
          vitals.FID = entry.processingStart - entry.startTime;
        });
      });

      observer.observe({ entryTypes: ['first-input'] });
    }
  } catch (e) {
    console.warn('FID measurement error:', e);
  }

  // CLS
  try {
    if ('PerformanceObserver' in window) {
      let clsValue = 0;
      const observer = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        entries.forEach((entry: any) => {
          if (!entry.hadRecentInput) {
            clsValue += entry.value;
            vitals.CLS = clsValue;
          }
        });
      });

      observer.observe({ entryTypes: ['layout-shift'] });
    }
  } catch (e) {
    console.warn('CLS measurement error:', e);
  }

  // FCP
  const paintEntries = performance.getEntriesByType('paint');
  const fcpEntry = paintEntries.find((entry: any) => entry.name === 'first-contentful-paint');
  if (fcpEntry) {
    vitals.FCP = fcpEntry.startTime;
  }

  // TTFB
  const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
  if (navigation) {
    vitals.TTFB = navigation.responseStart - navigation.requestStart;
  }

  return vitals;
}

// 监控长任务
export function observeLongTasks(callback: (tasks: PerformanceEntry[]) => void): (() => void) | null {
  if (typeof window === 'undefined' || !('PerformanceObserver' in window)) {
    return null;
  }

  try {
    const observer = new PerformanceObserver((list) => {
      const entries = list.getEntries();
      callback(entries);
    });

    observer.observe({ entryTypes: ['longtask'] });

    return () => observer.disconnect();
  } catch (e) {
    console.warn('Long task observation error:', e);
    return null;
  }
}

// 计算页面加载时间
export function getPageLoadTime(): number {
  if (typeof window === 'undefined' || !window.performance) {
    return 0;
  }

  const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
  if (navigation) {
    return navigation.loadEventEnd - navigation.fetchStart;
  }

  return 0;
}

// 计算DNS查询时间
export function getDNSTime(): number {
  if (typeof window === 'undefined' || !window.performance) {
    return 0;
  }

  const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
  if (navigation) {
    return navigation.domainLookupEnd - navigation.domainLookupStart;
  }

  return 0;
}

// 计算TCP连接时间
export function getTCPTime(): number {
  if (typeof window === 'undefined' || !window.performance) {
    return 0;
  }

  const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
  if (navigation) {
    return navigation.connectEnd - navigation.connectStart;
  }

  return 0;
}

// 计算请求响应时间
export function getRequestTime(): number {
  if (typeof window === 'undefined' || !window.performance) {
    return 0;
  }

  const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
  if (navigation) {
    return navigation.responseEnd - navigation.requestStart;
  }

  return 0;
}

// 计算DOM处理时间
export function getDOMProcessingTime(): number {
  if (typeof window === 'undefined' || !window.performance) {
    return 0;
  }

  const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
  if (navigation) {
    return navigation.domComplete - navigation.domInteractive;
  }

  return 0;
}

// 格式化字节大小
export function formatBytes(bytes: number): string {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${(bytes / Math.pow(k, i)).toFixed(2)} ${sizes[i]}`;
}

// 格式化时间
export function formatTime(ms: number): string {
  if (ms < 1000) {
    return `${ms.toFixed(0)}ms`;
  }
  return `${(ms / 1000).toFixed(2)}s`;
}

// 生成性能报告
export function generatePerformanceReport(): string {
  const metrics = getPerformanceMetrics();
  if (!metrics) {
    return 'Performance metrics not available';
  }

  const vitals = getWebVitals();

  return `
=== Performance Report ===
Navigation Metrics:
  - DOM Content Loaded: ${formatTime(metrics.domContentLoaded)}
  - Load Complete: ${formatTime(metrics.loadComplete)}
  - First Paint: ${formatTime(metrics.firstPaint)}
  - First Contentful Paint: ${formatTime(metrics.firstContentfulPaint)}

Resource Metrics:
  - Total Resources: ${metrics.resourceCount}
  - Total Transfer Size: ${formatBytes(metrics.totalTransferSize)}
  - Total Decoded Size: ${formatBytes(metrics.totalDecodedBodySize)}

Timing Metrics:
  - DNS Lookup: ${formatTime(getDNSTime())}
  - TCP Connection: ${formatTime(getTCPTime())}
  - Request Time: ${formatTime(getRequestTime())}
  - DOM Processing: ${formatTime(getDOMProcessingTime())}

Memory Metrics:
  - Used: ${formatBytes(metrics.memoryUsed)}
  - Total: ${formatBytes(metrics.memoryTotal)}
  - Limit: ${formatBytes(metrics.memoryLimit)}

Web Vitals:
  - LCP: ${vitals?.LCP ? formatTime(vitals.LCP) : 'N/A'}
  - FID: ${vitals?.FID ? formatTime(vitals.FID) : 'N/A'}
  - CLS: ${vitals?.CLS ? vitals.CLS.toFixed(3) : 'N/A'}
  - FCP: ${vitals?.FCP ? formatTime(vitals.FCP) : 'N/A'}
  - TTFB: ${vitals?.TTFB ? formatTime(vitals.TTFB) : 'N/A'}
  `.trim();
}

// 导出
export default {
  markPerformance,
  measurePerformance,
  getPerformanceMetrics,
  getWebVitals,
  observeLongTasks,
  getPageLoadTime,
  getDNSTime,
  getTCPTime,
  getRequestTime,
  getDOMProcessingTime,
  formatBytes,
  formatTime,
  generatePerformanceReport,
};
