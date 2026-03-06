'use client';

import { useEffect, useRef, useState, useCallback } from 'react';

/**
 * 性能指标接口
 */
export interface PerformanceMetrics {
  /**
   * 页面加载时间（毫秒）
   */
  pageLoadTime: number;
  /**
   * 首次内容绘制（FCP）
   */
  firstContentfulPaint: number;
  /**
   * 最大内容绘制（LCP）
   */
  largestContentfulPaint: number;
  /**
   * 首次输入延迟（FID）
   */
  firstInputDelay: number;
  /**
   * 累积布局偏移（CLS）
   */
  cumulativeLayoutShift: number;
  /**
   * 首次字节时间（TTFB）
   */
  timeToFirstByte: number;
  /**
   * DOM内容加载完成时间
   */
  domContentLoaded: number;
}

/**
 * 性能监控 Hook
 *
 * 功能特性：
 * - 监控 Web Vitals 核心指标
 * - 自定义性能追踪
 * - 错误监控
 * - 资源加载监控
 *
 * @example
 * ```tsx
 * function MyComponent() {
 *   const { metrics, isTracking, startTracking, stopTracking } = usePerformance();
 *
 *   return (
 *     <div>
 *       <p>LCP: {metrics.largestContentfulPaint}ms</p>
 *       <button onClick={startTracking}>开始追踪</button>
 *     </div>
 *   );
 * }
 * ```
 */
export function usePerformance() {
  const [metrics, setMetrics] = useState<PerformanceMetrics>({
    pageLoadTime: 0,
    firstContentfulPaint: 0,
    largestContentfulPaint: 0,
    firstInputDelay: 0,
    cumulativeLayoutShift: 0,
    timeToFirstByte: 0,
    domContentLoaded: 0,
  });
  const [isTracking, setIsTracking] = useState(false);
  const observerRef = useRef<PerformanceObserver | null>(null);
  const navigationStartRef = useRef<number>(0);

  // 计算 TTFB
  const calculateTTFB = useCallback(() => {
    if (typeof performance === 'undefined' || !performance.timing) return 0;

    const timing = performance.timing;
    return timing.responseStart - timing.navigationStart;
  }, []);

  // 计算页面加载时间
  const calculatePageLoadTime = useCallback(() => {
    if (typeof performance === 'undefined' || !performance.timing) return 0;

    const timing = performance.timing;
    return timing.loadEventEnd - timing.navigationStart;
  }, []);

  // 计算 DOM 内容加载时间
  const calculateDOMContentLoaded = useCallback(() => {
    if (typeof performance === 'undefined' || !performance.timing) return 0;

    const timing = performance.timing;
    return timing.domContentLoadedEventEnd - timing.navigationStart;
  }, []);

  // 观察 FCP
  const observeFCP = useCallback(() => {
    try {
      const observer = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        const fcpEntry = entries.find(
          (entry) => entry.name === 'first-contentful-paint'
        );

        if (fcpEntry) {
          setMetrics((prev) => ({
            ...prev,
            firstContentfulPaint: fcpEntry.startTime,
          }));
        }
      });

      observer.observe({ entryTypes: ['paint'] });
      observerRef.current = observer;
    } catch (e) {
      console.warn('FCP 观察失败:', e);
    }
  }, []);

  // 观察 LCP
  const observeLCP = useCallback(() => {
    try {
      const observer = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        const lcpEntry = entries[entries.length - 1];

        if (lcpEntry) {
          setMetrics((prev) => ({
            ...prev,
            largestContentfulPaint: lcpEntry.startTime,
          }));
        }
      });

      observer.observe({ entryTypes: ['largest-contentful-paint'] });
      return observer;
    } catch (e) {
      console.warn('LCP 观察失败:', e);
      return null;
    }
  }, []);

  // 观察 FID
  const observeFID = useCallback(() => {
    try {
      const observer = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        const fidEntry = entries[0];

        if (fidEntry && 'processingStart' in fidEntry) {
          const fid = (fidEntry as any).processingStart - fidEntry.startTime;
          setMetrics((prev) => ({
            ...prev,
            firstInputDelay: fid,
          }));
        }
      });

      observer.observe({ entryTypes: ['first-input'] });
      return observer;
    } catch (e) {
      console.warn('FID 观察失败:', e);
      return null;
    }
  }, []);

  // 观察 CLS
  const observeCLS = useCallback(() => {
    try {
      let clsValue = 0;
      const observer = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          if (!(entry as any).hadRecentInput) {
            clsValue += (entry as any).value;
            setMetrics((prev) => ({
              ...prev,
              cumulativeLayoutShift: clsValue,
            }));
          }
        }
      });

      observer.observe({ entryTypes: ['layout-shift'] });
      return observer;
    } catch (e) {
      console.warn('CLS 观察失败:', e);
      return null;
    }
  }, []);

  // 开始追踪
  const startTracking = useCallback(() => {
    if (isTracking) return;

    navigationStartRef.current = Date.now();
    setIsTracking(true);

    // 立即计算同步指标
    setMetrics((prev) => ({
      ...prev,
      timeToFirstByte: calculateTTFB(),
      pageLoadTime: calculatePageLoadTime(),
      domContentLoaded: calculateDOMContentLoaded(),
    }));

    // 开始观察异步指标
    observeFCP();
    observeLCP();
    observeFID();
    observeCLS();
  }, [
    isTracking,
    calculateTTFB,
    calculatePageLoadTime,
    calculateDOMContentLoaded,
    observeFCP,
    observeLCP,
    observeFID,
    observeCLS,
  ]);

  // 停止追踪
  const stopTracking = useCallback(() => {
    setIsTracking(false);

    if (observerRef.current) {
      observerRef.current.disconnect();
      observerRef.current = null;
    }
  }, []);

  // 自动开始追踪（可选）
  useEffect(() => {
    // 页面加载完成后自动开始追踪
    if (typeof window !== 'undefined' && document.readyState === 'complete') {
      startTracking();
    } else {
      const handleLoad = () => startTracking();
      window.addEventListener('load', handleLoad);
      return () => window.removeEventListener('load', handleLoad);
    }
  }, [startTracking]);

  return {
    metrics,
    isTracking,
    startTracking,
    stopTracking,
  };
}

/**
 * 资源加载监控 Hook
 */
export function useResourceMonitoring() {
  const [resources, setResources] = useState<PerformanceResourceTiming[]>([]);

  useEffect(() => {
    if (typeof performance === 'undefined' || !performance.getEntriesByType) {
      return;
    }

    const getResources = () => {
      const entries = performance.getEntriesByType('resource') as PerformanceResourceTiming[];
      setResources(entries);
    };

    // 定期更新资源列表
    const interval = setInterval(getResources, 5000);

    // 初始加载
    getResources();

    return () => clearInterval(interval);
  }, []);

  // 获取慢速资源
  const getSlowResources = useCallback((threshold = 1000) => {
    return resources.filter((resource) => resource.duration > threshold);
  }, [resources]);

  // 获取总资源大小
  const getTotalTransferSize = useCallback(() => {
    return resources.reduce((total, resource) => {
      return total + (resource.transferSize || 0);
    }, 0);
  }, [resources]);

  return {
    resources,
    getSlowResources,
    getTotalTransferSize,
  };
}

/**
 * 内存监控 Hook
 */
export function useMemoryMonitoring() {
  const [memoryInfo, setMemoryInfo] = useState<{
    usedJSHeapSize: number;
    totalJSHeapSize: number;
    jsHeapSizeLimit: number;
  } | null>(null);

  useEffect(() => {
    if (typeof performance === 'undefined' || !(performance as any).memory) {
      return;
    }

    const updateMemory = () => {
      const memory = (performance as any).memory;
      setMemoryInfo({
        usedJSHeapSize: memory.usedJSHeapSize,
        totalJSHeapSize: memory.totalJSHeapSize,
        jsHeapSizeLimit: memory.jsHeapSizeLimit,
      });
    };

    const interval = setInterval(updateMemory, 2000);
    updateMemory();

    return () => clearInterval(interval);
  }, []);

  return memoryInfo;
}

/**
 * 性能评分
 * 根据指标计算性能评分（0-100）
 */
export function calculatePerformanceScore(metrics: PerformanceMetrics): number {
  const scores = {
    fcp: metrics.firstContentfulPaint <= 1800 ? 100 : Math.max(0, 100 - (metrics.firstContentfulPaint - 1800) / 10),
    lcp: metrics.largestContentfulPaint <= 2500 ? 100 : Math.max(0, 100 - (metrics.largestContentfulPaint - 2500) / 10),
    fid: metrics.firstInputDelay <= 100 ? 100 : Math.max(0, 100 - (metrics.firstInputDelay - 100) / 5),
    cls: metrics.cumulativeLayoutShift <= 0.1 ? 100 : Math.max(0, 100 - metrics.cumulativeLayoutShift * 500),
    ttfb: metrics.timeToFirstByte <= 600 ? 100 : Math.max(0, 100 - (metrics.timeToFirstByte - 600) / 10),
  };

  return Math.round((scores.fcp * 0.25 + scores.lcp * 0.25 + scores.fid * 0.2 + scores.cls * 0.2 + scores.ttfb * 0.1));
}

/**
 * 性监控面板组件数据 Hook
 */
export function usePerformanceDashboard() {
  const { metrics } = usePerformance();
  const { resources, getSlowResources, getTotalTransferSize } = useResourceMonitoring();
  const memoryInfo = useMemoryMonitoring();

  const score = calculatePerformanceScore(metrics);
  const slowResources = getSlowResources(1000);
  const totalTransferSize = getTotalTransferSize();

  return {
    metrics,
    score,
    resources,
    slowResources,
    totalTransferSize,
    memoryInfo,
  };
}
