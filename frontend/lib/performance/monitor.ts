/**
 * 性能监控工具
 * 用于监控应用性能指标，包括页面加载时间、渲染时间、API响应时间等
 */

// 性能指标类型
export interface PerformanceMetrics {
  // 页面加载指标
  pageLoadTime: number;
  domContentLoaded: number;
  firstContentfulPaint?: number;
  largestContentfulPaint?: number;

  // 渲染指标
  firstRender: number;
  interactiveTime?: number;

  // 自定义指标
  apiResponseTime: Record<string, number>;
  componentRenderTime: Record<string, number>;
}

// 性能数据存储
class PerformanceMonitor {
  private metrics: PerformanceMetrics = {
    pageLoadTime: 0,
    domContentLoaded: 0,
    apiResponseTime: {},
    componentRenderTime: {},
  };

  private observers: PerformanceObserver[] = [];
  private isEnabled = false;

  /**
   * 启用性能监控
   */
  enable() {
    if (this.isEnabled || typeof window === 'undefined') return;

    this.isEnabled = true;
    this.measurePageLoad();
    this.observeWebVitals();
  }

  /**
   * 禁用性能监控
   */
  disable() {
    this.isEnabled = false;
    this.observers.forEach((observer) => observer.disconnect());
    this.observers = [];
  }

  /**
   * 测量页面加载时间
   */
  private measurePageLoad() {
    if (typeof performance === 'undefined' || !performance.getEntriesByType) return;

    window.addEventListener('load', () => {
      setTimeout(() => {
        const navigationEntries = performance.getEntriesByType('navigation') as PerformanceNavigationTiming[];

        if (navigationEntries.length > 0) {
          const navigation = navigationEntries[0];
          this.metrics.pageLoadTime = navigation.loadEventEnd - navigation.fetchStart;
          this.metrics.domContentLoaded = navigation.domContentLoadedEventEnd - navigation.fetchStart;
          this.metrics.firstRender = navigation.responseEnd - navigation.requestStart;
        }
      }, 0);
    });
  }

  /**
   * 观察 Web Vitals 指标
   */
  private observeWebVitals() {
    if (typeof PerformanceObserver === 'undefined') return;

    // 观察 LCP (Largest Contentful Paint)
    try {
      const lcpObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        const lastEntry = entries[entries.length - 1] as any;
        this.metrics.largestContentfulPaint = lastEntry.renderTime || lastEntry.loadTime;
      });
      lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] });
      this.observers.push(lcpObserver);
    } catch (e) {
      console.warn('LCP observation not supported');
    }

    // 观察 FCP (First Contentful Paint)
    try {
      const fcpObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        const fcpEntry = entries.find(
          (entry: any) => entry.name === 'first-contentful-paint'
        );
        if (fcpEntry) {
          this.metrics.firstContentfulPaint = fcpEntry.startTime;
        }
      });
      fcpObserver.observe({ entryTypes: ['paint'] });
      this.observers.push(fcpObserver);
    } catch (e) {
      console.warn('FCP observation not supported');
    }

    // 观察 TTI (Time to Interactive) - 通过 FID 估算
    try {
      const fidObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        if (entries.length > 0) {
          this.metrics.interactiveTime = (entries[0] as any).processingStart;
        }
      });
      fidObserver.observe({ entryTypes: ['first-input'] });
      this.observers.push(fidObserver);
    } catch (e) {
      console.warn('FID observation not supported');
    }
  }

  /**
   * 记录 API 响应时间
   */
  measureApiCall(endpoint: string, startTime: number) {
    const duration = Date.now() - startTime;
    this.metrics.apiResponseTime[endpoint] = duration;

    // 如果响应时间过长，发出警告
    if (duration > 3000) {
      console.warn(`[Performance] Slow API detected: ${endpoint} took ${duration}ms`);
    }

    return duration;
  }

  /**
   * 测量组件渲染时间
   */
  measureComponentRender(componentName: string) {
    const start = performance.now();

    return () => {
      const duration = performance.now() - start;
      this.metrics.componentRenderTime[componentName] = duration;

      if (duration > 100) {
        console.warn(`[Performance] Slow render detected: ${componentName} took ${duration.toFixed(2)}ms`);
      }
    };
  }

  /**
   * 获取所有性能指标
   */
  getMetrics(): PerformanceMetrics {
    return { ...this.metrics };
  }

  /**
   * 获取性能报告
   */
  getReport(): string {
    const metrics = this.getMetrics();

    return `
=== 性能报告 ===
页面加载时间: ${metrics.pageLoadTime.toFixed(2)}ms
DOM 内容加载: ${metrics.domContentLoaded.toFixed(2)}ms
首次内容绘制: ${metrics.firstContentfulPaint?.toFixed(2) || 'N/A'}ms
最大内容绘制: ${metrics.largestContentfulPaint?.toFixed(2) || 'N/A'}ms
可交互时间: ${metrics.interactiveTime?.toFixed(2) || 'N/A'}ms

API 响应时间:
${Object.entries(metrics.apiResponseTime)
  .map(([key, value]) => `  ${key}: ${value}ms`)
  .join('\n')}

组件渲染时间:
${Object.entries(metrics.componentRenderTime)
  .map(([key, value]) => `  ${key}: ${value.toFixed(2)}ms`)
  .join('\n')}
    `.trim();
  }

  /**
   * 上报性能数据到服务器
   */
  async reportToServer(endpoint: string) {
    if (!this.isEnabled) return;

    try {
      await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(this.getMetrics()),
      });
    } catch (error) {
      console.error('Failed to report performance metrics:', error);
    }
  }

  /**
   * 清空性能指标
   */
  reset() {
    this.metrics = {
      pageLoadTime: 0,
      domContentLoaded: 0,
      apiResponseTime: {},
      componentRenderTime: {},
    };
  }
}

// 导出单例
export const performanceMonitor = new PerformanceMonitor();

// 便捷的装饰器函数（用于 API 调用）
export function measurePerformance(endpoint: string) {
  return function (
    target: any,
    propertyKey: string,
    descriptor: PropertyDescriptor
  ) {
    const originalMethod = descriptor.value;

    descriptor.value = async function (...args: any[]) {
      const start = Date.now();
      try {
        const result = await originalMethod.apply(this, args);
        performanceMonitor.measureApiCall(endpoint, start);
        return result;
      } catch (error) {
        performanceMonitor.measureApiCall(endpoint, start);
        throw error;
      }
    };

    return descriptor;
  };
}

// React Hook 用于测量组件性能
export function usePerformanceMeasure(componentName: string) {
  React.useEffect(() => {
    if (typeof window === 'undefined') return;
    
    const endMeasure = performanceMonitor.measureComponentRender(componentName);

    return () => {
      endMeasure();
    };
  }, [componentName]);
}

// 性能指标阈值
export const PERFORMANCE_THRESHOLDS = {
  PAGE_LOAD_TIME: 3000, // 3秒
  DOM_CONTENT_LOADED: 1500, // 1.5秒
  FIRST_CONTENTFUL_PAINT: 1000, // 1秒
  LARGEST_CONTENTFUL_PAINT: 2500, // 2.5秒
  API_RESPONSE_TIME: 1000, // 1秒
  COMPONENT_RENDER_TIME: 100, // 100ms
} as const;

/**
 * 检查性能指标是否在可接受范围内
 */
export function checkPerformanceHealth(metrics: PerformanceMetrics): {
  isHealthy: boolean;
  issues: string[];
} {
  const issues: string[] = [];

  if (metrics.pageLoadTime > PERFORMANCE_THRESHOLDS.PAGE_LOAD_TIME) {
    issues.push(`页面加载时间过长: ${metrics.pageLoadTime}ms`);
  }

  if (metrics.domContentLoaded > PERFORMANCE_THRESHOLDS.DOM_CONTENT_LOADED) {
    issues.push(`DOM 加载时间过长: ${metrics.domContentLoaded}ms`);
  }

  if (
    metrics.firstContentfulPaint &&
    metrics.firstContentfulPaint > PERFORMANCE_THRESHOLDS.FIRST_CONTENTFUL_PAINT
  ) {
    issues.push(`首次内容绘制过慢: ${metrics.firstContentfulPaint}ms`);
  }

  if (
    metrics.largestContentfulPaint &&
    metrics.largestContentfulPaint > PERFORMANCE_THRESHOLDS.LARGEST_CONTENTFUL_PAINT
  ) {
    issues.push(`最大内容绘制过慢: ${metrics.largestContentfulPaint}ms`);
  }

  Object.entries(metrics.apiResponseTime).forEach(([endpoint, time]) => {
    if (time > PERFORMANCE_THRESHOLDS.API_RESPONSE_TIME) {
      issues.push(`API 响应慢 (${endpoint}): ${time}ms`);
    }
  });

  Object.entries(metrics.componentRenderTime).forEach(([component, time]) => {
    if (time > PERFORMANCE_THRESHOLDS.COMPONENT_RENDER_TIME) {
      issues.push(`组件渲染慢 (${component}): ${time.toFixed(2)}ms`);
    }
  });

  return {
    isHealthy: issues.length === 0,
    issues,
  };
}

/**
 * 性能监控 Hook (用于 React 组件)
 */
export function usePerformanceMonitoring() {
  React.useEffect(() => {
    performanceMonitor.enable();
    return () => performanceMonitor.disable();
  }, []);

  const getMetrics = React.useCallback(() => performanceMonitor.getMetrics(), []);
  const getReport = React.useCallback(() => performanceMonitor.getReport(), []);
  const reportToServer = React.useCallback(
    (endpoint: string) => performanceMonitor.reportToServer(endpoint),
    []
  );
  const reset = React.useCallback(() => performanceMonitor.reset(), []);

  return {
    getMetrics,
    getReport,
    reportToServer,
    reset,
    measureApiCall: performanceMonitor.measureApiCall.bind(performanceMonitor),
    measureComponentRender: performanceMonitor.measureComponentRender.bind(
      performanceMonitor
    ),
  };
}

// 导入 React (用于 Hooks)
import * as React from 'react';
