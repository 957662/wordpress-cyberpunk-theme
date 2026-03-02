/**
 * Performance Utilities
 * 性能优化工具函数
 */

/**
 * 防抖函数
 */
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout | null = null;

  return function executedFunction(...args: Parameters<T>) {
    const later = () => {
      timeout = null;
      func(...args);
    };

    if (timeout) clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

/**
 * 节流函数
 */
export function throttle<T extends (...args: any[]) => any>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle: boolean;

  return function executedFunction(...args: Parameters<T>) {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
}

/**
 * 请求空闲回调
 */
export function requestIdleCallback(
  callback: IdleRequestCallback,
  options?: IdleRequestOptions
): number {
  if (typeof window !== 'undefined' && 'requestIdleCallback' in window) {
    return window.requestIdleCallback(callback, options);
  }

  // Fallback for browsers that don't support requestIdleCallback
  return window.setTimeout(() => {
    const start = Date.now();
    callback({
      didTimeout: false,
      timeRemaining: () => Math.max(0, 50 - (Date.now() - start)),
    });
  }, 1);
}

/**
 * 取消空闲回调
 */
export function cancelIdleCallback(handle: number): void {
  if (typeof window !== 'undefined' && 'cancelIdleCallback' in window) {
    window.cancelIdleCallback(handle);
  } else {
    window.clearTimeout(handle);
  }
}

/**
 * 批量更新 DOM
 */
export function batchUpdates(updates: Array<() => void>, batchSize = 5) {
  let index = 0;

  function processBatch() {
    const end = Math.min(index + batchSize, updates.length);

    for (let i = index; i < end; i++) {
      updates[i]();
    }

    index = end;

    if (index < updates.length) {
      requestIdleCallback(processBatch);
    }
  }

  processBatch();
}

/**
 * 懒加载组件
 */
export function lazyLoad<T>(
  importFn: () => Promise<{ default: T }>,
  fallback?: React.ComponentType
): React.LazyExoticComponent<T> {
  return React.lazy(() => importFn().catch((error) => {
    console.error('Component load failed:', error);
    // Return a default error component
    return Promise.resolve({
      default: (() => (
        <div className="p-4 bg-red-100 dark:bg-red-900/20 text-red-700 dark:text-red-400 rounded">
          组件加载失败，请刷新页面重试
        </div>
      )) as unknown as T,
    });
  }));
}

/**
 * 代码分割
 */
export function codeSplit<T>(
  importFn: () => Promise<{ default: T }>
): () => Promise<{ default: T }> {
  return importFn;
}

/**
 * 预加载资源
 */
export function preloadResource(href: string, as: 'script' | 'style' | 'image' | 'font') {
  if (typeof document === 'undefined') return;

  const link = document.createElement('link');
  link.rel = 'preload';
  link.href = href;
  link.as = as;

  if (as === 'font') {
    link.crossOrigin = 'anonymous';
  }

  document.head.appendChild(link);
}

/**
 * 预连接到域名
 */
export function preconnectTo(href: string) {
  if (typeof document === 'undefined') return;

  const link = document.createElement('link');
  link.rel = 'preconnect';
  link.href = href;

  document.head.appendChild(link);
}

/**
 * DNS 预解析
 */
export function dnsPrefetch(href: string) {
  if (typeof document === 'undefined') return;

  const link = document.createElement('link');
  link.rel = 'dns-prefetch';
  link.href = href;

  document.head.appendChild(link);
}

/**
 * 测量性能
 */
export function measurePerformance(name: string, fn: () => void) {
  if (typeof window === 'undefined' || !window.performance) {
    return fn();
  }

  const startMark = `${name}-start`;
  const endMark = `${name}-end`;
  const measureName = `${name}-measure`;

  performance.mark(startMark);
  fn();
  performance.mark(endMark);
  performance.measure(measureName, startMark, endMark);

  const measure = performance.getEntriesByName(measureName)[0];
  const duration = measure ? measure.duration : 0;

  // Cleanup marks
  performance.clearMarks(startMark);
  performance.clearMarks(endMark);
  performance.clearMeasures(measureName);

  return duration;
}

/**
 * 获取性能指标
 */
export function getPerformanceMetrics() {
  if (typeof window === 'undefined' || !window.performance) {
    return null;
  }

  const timing = performance.timing as unknown as PerformanceTiming;
  const navigation = performance.navigation as unknown as PerformanceNavigation;

  return {
    // Page load timing
    domContentLoaded: timing.domContentLoadedEventEnd - timing.navigationStart,
    loadComplete: timing.loadEventEnd - timing.navigationStart,
    domReady: timing.domComplete - timing.responseEnd,

    // Network timing
    dns: timing.domainLookupEnd - timing.domainLookupStart,
    tcp: timing.connectEnd - timing.connectStart,
    ttfb: timing.responseStart - timing.fetchStart,
    download: timing.responseEnd - timing.responseStart,

    // Navigation type
    navigationType: navigation.type,
    redirectCount: navigation.redirectCount,

    // Memory (if available)
    memory: (performance as any).memory,
  };
}

/**
 * 获取 Core Web Vitals
 */
export function getCoreWebVitals() {
  if (typeof window === 'undefined' || !window.performance) {
    return null;
  }

  // FCP (First Contentful Paint)
  const fcpEntry = performance.getEntriesByName('first-contentful-paint')[0] as PerformanceEntry;
  const fcp = fcpEntry ? Math.round(fcpEntry.startTime) : 0;

  // LCP (Largest Contentful Paint)
  const lcpEntries = performance.getEntriesByType('largest-contentful-paint');
  const lcp = lcpEntries.length > 0
    ? Math.round(lcpEntries[lcpEntries.length - 1].startTime)
    : 0;

  // CLS (Cumulative Layout Shift)
  let clsValue = 0;
  const clsEntries = performance.getEntriesByType('layout-shift');
  clsEntries.forEach((entry) => {
    if (!(entry as any).hadRecentInput) {
      clsValue += (entry as any).value;
    }
  });
  const cls = Math.round(clsValue * 1000) / 1000;

  return {
    fcp,
    lcp,
    cls,
  };
}

/**
 * 资源预加载提示
 */
export function getResourceHints() {
  const hints = {
    dns: [] as string[],
    preconnect: [] as string[],
    preload: [] as string[],
    prefetch: [] as string[],
  };

  if (typeof document === 'undefined') return hints;

  const links = document.querySelectorAll('link[rel]');
  links.forEach((link) => {
    const rel = link.getAttribute('rel');
    const href = link.getAttribute('href');

    if (href) {
      if (rel === 'dns-prefetch') hints.dns.push(href);
      if (rel === 'preconnect') hints.preconnect.push(href);
      if (rel === 'preload') hints.preload.push(href);
      if (rel === 'prefetch') hints.prefetch.push(href);
    }
  });

  return hints;
}

/**
 * 分析资源加载时间
 */
export function analyzeResourceTiming() {
  if (typeof window === 'undefined' || !window.performance) {
    return null;
  }

  const resources = performance.getEntriesByType('resource') as PerformanceResourceTiming[];

  return resources.map((resource) => ({
    name: resource.name,
    duration: resource.duration,
    size: resource.transferSize,
    type: resource.initiatorType,

    // Timing breakdown
    dns: resource.domainLookupEnd - resource.domainLookupStart,
    tcp: resource.connectEnd - resource.connectStart,
    request: resource.responseStart - resource.requestStart,
    response: resource.responseEnd - resource.responseStart,
    total: resource.responseEnd - resource.startTime,
  }));
}

/**
 * 清理性能缓存
 */
export function clearPerformanceCache() {
  if (typeof window === 'undefined' || !window.performance) return;

  // Clear all performance marks
  performance.clearMarks();

  // Clear all performance measures
  performance.clearMeasures();

  // Clear all performance resources
  performance.clearResourceTimings();
}

/**
 * 性能监控装饰器
 */
export function observePerformance(
  callback: (metrics: ReturnType<typeof getPerformanceMetrics>) => void,
  interval = 5000
) {
  if (typeof window === 'undefined') return;

  const intervalId = setInterval(() => {
    const metrics = getPerformanceMetrics();
    if (metrics) {
      callback(metrics);
    }
  }, interval);

  return () => clearInterval(intervalId);
}
