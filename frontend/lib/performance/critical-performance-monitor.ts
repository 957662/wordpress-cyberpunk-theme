/**
 * Critical Performance Monitor
 * 高级性能监控工具 - 用于实时监控和优化应用性能
 *
 * @author AI Development Team
 * @version 1.0.0
 */

import { useEffect, useRef, useCallback } from 'react';

interface PerformanceMetrics {
  // Core Web Vitals
  FCP?: number; // First Contentful Paint
  LCP?: number; // Largest Contentful Paint
  FID?: number; // First Input Delay
  CLS?: number; // Cumulative Layout Shift
  TTFB?: number; // Time to First Byte

  // Custom Metrics
  renderTime?: number;
  interactionTime?: number;
  apiResponseTime?: number;

  // Resource Metrics
  memoryUsage?: number;
  bundleSize?: number;
}

interface PerformanceEntry {
  name: string;
  value: number;
  timestamp: number;
  rating: 'good' | 'needs-improvement' | 'poor';
}

class CriticalPerformanceMonitor {
  private metrics: PerformanceMetrics = {};
  private observers: Map<string, PerformanceObserver> = new Map();
  private callbacks: Set<(metrics: PerformanceEntry) => void> = new Set();
  private isInitialized = false;

  /**
   * 初始化性能监控
   */
  init() {
    if (this.isInitialized || typeof window === 'undefined') return;

    this.observeFCP();
    this.observeLCP();
    this.observeFID();
    this.observeCLS();
    this.observeTTFB();
    this.observeResources();

    this.isInitialized = true;
  }

  /**
   * 观察 First Contentful Paint
   */
  private observeFCP() {
    try {
      const observer = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        const fcpEntry = entries.find(
          (entry) => entry.name === 'first-contentful-paint'
        );
        if (fcpEntry) {
          this.metrics.FCP = fcpEntry.startTime;
          this.emitMetric({
            name: 'FCP',
            value: fcpEntry.startTime,
            timestamp: Date.now(),
            rating: this.rateFCP(fcpEntry.startTime),
          });
        }
      });
      observer.observe({ entryTypes: ['paint'] });
      this.observers.set('FCP', observer);
    } catch (e) {
      console.warn('FCP observation not supported');
    }
  }

  /**
   * 观察 Largest Contentful Paint
   */
  private observeLCP() {
    try {
      const observer = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        const lastEntry = entries[entries.length - 1] as any;
        this.metrics.LCP = lastEntry.startTime;
        this.emitMetric({
          name: 'LCP',
          value: lastEntry.startTime,
          timestamp: Date.now(),
          rating: this.rateLCP(lastEntry.startTime),
        });
      });
      observer.observe({ entryTypes: ['largest-contentful-paint'] });
      this.observers.set('LCP', observer);
    } catch (e) {
      console.warn('LCP observation not supported');
    }
  }

  /**
   * 观察 First Input Delay
   */
  private observeFID() {
    try {
      const observer = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        const fidEntry = entries[0] as any;
        this.metrics.FID = fidEntry.processingStart - fidEntry.startTime;
        this.emitMetric({
          name: 'FID',
          value: this.metrics.FID,
          timestamp: Date.now(),
          rating: this.rateFID(this.metrics.FID),
        });
      });
      observer.observe({ entryTypes: ['first-input'] });
      this.observers.set('FID', observer);
    } catch (e) {
      console.warn('FID observation not supported');
    }
  }

  /**
   * 观察 Cumulative Layout Shift
   */
  private observeCLS() {
    try {
      let clsValue = 0;
      const observer = new PerformanceObserver((list) => {
        for (const entry of list.getEntries() as any[]) {
          if (!entry.hadRecentInput) {
            clsValue += entry.value;
          }
        }
        this.metrics.CLS = clsValue;
        this.emitMetric({
          name: 'CLS',
          value: clsValue,
          timestamp: Date.now(),
          rating: this.rateCLS(clsValue),
        });
      });
      observer.observe({ entryTypes: ['layout-shift'] });
      this.observers.set('CLS', observer);
    } catch (e) {
      console.warn('CLS observation not supported');
    }
  }

  /**
   * 观察 Time to First Byte
   */
  private observeTTFB() {
    if (typeof window === 'undefined' || !window.performance) return;

    const navigation = performance.getEntriesByType('navigation')[0] as any;
    if (navigation) {
      this.metrics.TTFB = navigation.responseStart - navigation.requestStart;
      this.emitMetric({
        name: 'TTFB',
        value: this.metrics.TTFB,
        timestamp: Date.now(),
        rating: this.rateTTFB(this.metrics.TTFB),
      });
    }
  }

  /**
   * 观察资源加载
   */
  private observeResources() {
    try {
      const observer = new PerformanceObserver((list) => {
        for (const entry of list.getEntries() as any[]) {
          if (entry.duration > 1000) {
            // 慢资源告警
            console.warn('Slow resource detected:', {
              name: entry.name,
              duration: entry.duration,
              size: entry.transferSize,
            });
          }
        }
      });
      observer.observe({ entryTypes: ['resource'] });
      this.observers.set('resources', observer);
    } catch (e) {
      console.warn('Resource observation not supported');
    }
  }

  /**
   * 评分 FCP
   */
  private rateFCP(value: number): 'good' | 'needs-improvement' | 'poor' {
    if (value <= 1.8) return 'good';
    if (value <= 3) return 'needs-improvement';
    return 'poor';
  }

  /**
   * 评分 LCP
   */
  private rateLCP(value: number): 'good' | 'needs-improvement' | 'poor' {
    if (value <= 2.5) return 'good';
    if (value <= 4) return 'needs-improvement';
    return 'poor';
  }

  /**
   * 评分 FID
   */
  private rateFID(value: number): 'good' | 'needs-improvement' | 'poor' {
    if (value <= 100) return 'good';
    if (value <= 300) return 'needs-improvement';
    return 'poor';
  }

  /**
   * 评分 CLS
   */
  private rateCLS(value: number): 'good' | 'needs-improvement' | 'poor' {
    if (value <= 0.1) return 'good';
    if (value <= 0.25) return 'needs-improvement';
    return 'poor';
  }

  /**
   * 评分 TTFB
   */
  private rateTTFB(value: number): 'good' | 'needs-improvement' | 'poor' {
    if (value <= 800) return 'good';
    if (value <= 1800) return 'needs-improvement';
    return 'poor';
  }

  /**
   * 发出指标
   */
  private emitMetric(entry: PerformanceEntry) {
    this.callbacks.forEach((callback) => callback(entry));
  }

  /**
   * 订阅性能指标
   */
  subscribe(callback: (metrics: PerformanceEntry) => void) {
    this.callbacks.add(callback);
    return () => this.callbacks.delete(callback);
  }

  /**
   * 获取所有指标
   */
  getMetrics(): PerformanceMetrics {
    return { ...this.metrics };
  }

  /**
   * 获取性能评分
   */
  getScore(): number {
    const metrics = this.metrics;
    if (!metrics.LCP || !metrics.FID || !metrics.CLS) return 0;

    let score = 0;
    let count = 0;

    if (metrics.LCP) {
      score += this.rateToScore(this.rateLCP(metrics.LCP));
      count++;
    }
    if (metrics.FID) {
      score += this.rateToScore(this.rateFID(metrics.FID));
      count++;
    }
    if (metrics.CLS) {
      score += this.rateToScore(this.rateCLS(metrics.CLS));
      count++;
    }

    return count > 0 ? Math.round((score / count) * 100) : 0;
  }

  /**
   * 评级转分数
   */
  private rateToScore(rating: 'good' | 'needs-improvement' | 'poor'): number {
    switch (rating) {
      case 'good':
        return 1;
      case 'needs-improvement':
        return 0.5;
      case 'poor':
        return 0.25;
    }
  }

  /**
   * 测量渲染时间
   */
  measureRender(name: string, fn: () => void) {
    const start = performance.now();
    fn();
    const end = performance.now();

    this.metrics.renderTime = end - start;
    this.emitMetric({
      name: `Render: ${name}`,
      value: end - start,
      timestamp: Date.now(),
      rating: end - start < 16 ? 'good' : 'needs-improvement',
    });
  }

  /**
   * 测量 API 响应时间
   */
  measureAPI(name: string, responseTime: number) {
    this.metrics.apiResponseTime = responseTime;
    this.emitMetric({
      name: `API: ${name}`,
      value: responseTime,
      timestamp: Date.now(),
      rating: responseTime < 500 ? 'good' : responseTime < 1000 ? 'needs-improvement' : 'poor',
    });
  }

  /**
   * 销毁监控
   */
  destroy() {
    this.observers.forEach((observer) => observer.disconnect());
    this.observers.clear();
    this.callbacks.clear();
    this.isInitialized = false;
  }

  /**
   * 获取性能报告
   */
  getReport(): string {
    const metrics = this.metrics;
    const score = this.getScore();

    return `
Performance Report
==================
Overall Score: ${score}/100

Core Web Vitals:
- FCP: ${metrics.FCP?.toFixed(0)}ms ${this.metrics.FCP ? this.rateFCP(metrics.FCP) : 'N/A'}
- LCP: ${metrics.LCP?.toFixed(0)}ms ${this.metrics.LCP ? this.rateLCP(metrics.LCP) : 'N/A'}
- FID: ${metrics.FID?.toFixed(0)}ms ${this.metrics.FID ? this.rateFID(metrics.FID) : 'N/A'}
- CLS: ${metrics.CLS?.toFixed(3)} ${this.metrics.CLS ? this.rateCLS(metrics.CLS) : 'N/A'}
- TTFB: ${metrics.TTFB?.toFixed(0)}ms ${this.metrics.TTFB ? this.rateTTFB(metrics.TTFB) : 'N/A'}

Custom Metrics:
- Render Time: ${metrics.renderTime?.toFixed(2)}ms
- API Response: ${metrics.apiResponseTime?.toFixed(0)}ms
    `.trim();
  }
}

// 单例实例
const monitor = new CriticalPerformanceMonitor();

/**
 * React Hook - 使用性能监控
 */
export function useCriticalPerformanceMonitor() {
  useEffect(() => {
    monitor.init();
    return () => monitor.destroy();
  }, []);

  return {
    subscribe: monitor.subscribe.bind(monitor),
    getMetrics: monitor.getMetrics.bind(monitor),
    getScore: monitor.getScore.bind(monitor),
    getReport: monitor.getReport.bind(monitor),
    measureRender: monitor.measureRender.bind(monitor),
    measureAPI: monitor.measureAPI.bind(monitor),
  };
}

/**
 * React Hook - 测量组件渲染时间
 */
export function useRenderTime(componentName: string) {
  const renderCount = useRef(0);
  const renderTimes = useRef<number[]>([]);

  useEffect(() => {
    renderCount.current += 1;
  });

  useCallback(() => {
    const start = performance.now();
    return () => {
      const end = performance.now();
      const duration = end - start;
      renderTimes.current.push(duration);

      if (duration > 16) {
        console.warn(`Slow render detected in ${componentName}:`, {
          duration: `${duration.toFixed(2)}ms`,
          renderCount: renderCount.current,
          average: `${(renderTimes.current.reduce((a, b) => a + b, 0) / renderTimes.current.length).toFixed(2)}ms`,
        });
      }
    };
  }, [componentName]);

  return {
    renderCount: renderCount.current,
    averageRenderTime:
      renderTimes.current.length > 0
        ? renderTimes.current.reduce((a, b) => a + b, 0) / renderTimes.current.length
        : 0,
  };
}

export default monitor;
