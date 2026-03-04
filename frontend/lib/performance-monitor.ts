/**
 * 性能监控工具库
 * 监控 Web Vitals 和自定义性能指标
 */

export interface PerformanceMetrics {
  // Core Web Vitals
  FCP?: number; // First Contentful Paint
  LCP?: number; // Largest Contentful Paint
  FID?: number; // First Input Delay
  CLS?: number; // Cumulative Layout Shift
  TTFB?: number; // Time to First Byte

  // Custom metrics
  domContentLoaded?: number;
  loadComplete?: number;
  firstRender?: number;
  interactive?: number;
}

export interface PerformanceEntry {
  name: string;
  value: number;
  rating: 'good' | 'needs-improvement' | 'poor';
  timestamp: number;
}

class PerformanceMonitor {
  private metrics: PerformanceMetrics = {};
  private observers: Array<() => void> = [];
  private isMonitoring = false;

  /**
   * 开始监控性能
   */
  startMonitoring() {
    if (typeof window === 'undefined' || this.isMonitoring) return;

    this.isMonitoring = true;

    // 监控 Core Web Vitals
    this.observeFCP();
    this.observeLCP();
    this.observeFID();
    this.observeCLS();
    this.observeTTFB();

    // 监控自定义指标
    this.observeDOMContentLoaded();
    this.observeLoadComplete();
  }

  /**
   * 停止监控
   */
  stopMonitoring() {
    this.isMonitoring = false;
    this.observers.forEach((cleanup) => cleanup());
    this.observers = [];
  }

  /**
   * 获取所有指标
   */
  getMetrics(): PerformanceMetrics {
    return { ...this.metrics };
  }

  /**
   * 获取性能报告
   */
  getReport(): PerformanceEntry[] {
    const entries: PerformanceEntry[] = [];

    const addEntry = (
      name: string,
      value: number | undefined,
      thresholds: { good: number; poor: number }
    ) => {
      if (value === undefined) return;

      let rating: 'good' | 'needs-improvement' | 'poor';
      if (value <= thresholds.good) rating = 'good';
      else if (value <= thresholds.poor) rating = 'needs-improvement';
      else rating = 'poor';

      entries.push({
        name,
        value: Math.round(value),
        rating,
        timestamp: Date.now(),
      });
    }

    // Core Web Vitals thresholds
    addEntry('FCP', this.metrics.FCP, { good: 1800, poor: 3000 });
    addEntry('LCP', this.metrics.LCP, { good: 2500, poor: 4000 });
    addEntry('FID', this.metrics.FID, { good: 100, poor: 300 });
    addEntry('CLS', this.metrics.CLS, { good: 0.1, poor: 0.25 });
    addEntry('TTFB', this.metrics.TTFB, { good: 800, poor: 1800 });

    // Custom metrics
    if (this.metrics.domContentLoaded) {
      entries.push({
        name: 'DOM Content Loaded',
        value: Math.round(this.metrics.domContentLoaded),
        rating: this.metrics.domContentLoaded < 2000 ? 'good' : 'needs-improvement',
        timestamp: Date.now(),
      });
    }

    if (this.metrics.loadComplete) {
      entries.push({
        name: 'Load Complete',
        value: Math.round(this.metrics.loadComplete),
        rating: this.metrics.loadComplete < 3000 ? 'good' : 'needs-improvement',
        timestamp: Date.now(),
      });
    }

    return entries;
  }

  /**
   * 打印性能报告到控制台
   */
  printReport() {
    const report = this.getReport();
    console.group('🚀 Performance Report');
    report.forEach((entry) => {
      const emoji = entry.rating === 'good' ? '✅' : entry.rating === 'needs-improvement' ? '⚠️' : '❌';
      console.log(`${emoji} ${entry.name}: ${entry.value}ms (${entry.rating})`);
    });
    console.groupEnd();
  }

  /**
   * 监控 First Contentful Paint
   */
  private observeFCP() {
    if (!('PerformanceObserver' in window)) return;

    const observer = new PerformanceObserver((list) => {
      const entries = list.getEntries();
      const lastEntry = entries[entries.length - 1] as any;
      this.metrics.FCP = lastEntry.renderTime || lastEntry.loadTime;
    });

    try {
      observer.observe({ entryTypes: ['paint'] });
      this.observers.push(() => observer.disconnect());
    } catch (e) {
      console.warn('FCP observation not supported');
    }
  }

  /**
   * 监控 Largest Contentful Paint
   */
  private observeLCP() {
    if (!('PerformanceObserver' in window)) return;

    const observer = new PerformanceObserver((list) => {
      const entries = list.getEntries();
      const lastEntry = entries[entries.length - 1] as any;
      this.metrics.LCP = lastEntry.renderTime || lastEntry.loadTime;
    });

    try {
      observer.observe({ entryTypes: ['largest-contentful-paint'] });
      this.observers.push(() => observer.disconnect());
    } catch (e) {
      console.warn('LCP observation not supported');
    }
  }

  /**
   * 监控 First Input Delay
   */
  private observeFID() {
    if (!('PerformanceObserver' in window)) return;

    const observer = new PerformanceObserver((list) => {
      const entries = list.getEntries();
      const firstEntry = entries[0] as any;
      this.metrics.FID = firstEntry.processingStart - firstEntry.startTime;
    });

    try {
      observer.observe({ entryTypes: ['first-input'] });
      this.observers.push(() => observer.disconnect());
    } catch (e) {
      console.warn('FID observation not supported');
    }
  }

  /**
   * 监控 Cumulative Layout Shift
   */
  private observeCLS() {
    if (!('PerformanceObserver' in window)) return;

    let clsValue = 0;
    let sessionValue = 0;
    let sessionEntries: any[] = [];

    const observer = new PerformanceObserver((list) => {
      for (const entry of list.getEntries() as any[]) {
        if (!entry.hadRecentInput) {
          const firstSessionEntry = sessionEntries[0];
          const lastSessionEntry = sessionEntries[sessionEntries.length - 1];

          if (
            sessionValue &&
            entry.startTime - lastSessionEntry.startTime < 1000 &&
            entry.startTime - firstSessionEntry.startTime < 5000
          ) {
            sessionValue += entry.value;
            sessionEntries.push(entry);
          } else {
            sessionValue = entry.value;
            sessionEntries = [entry];
          }

          if (sessionValue > clsValue) {
            clsValue = sessionValue;
            this.metrics.CLS = clsValue;
          }
        }
      }
    });

    try {
      observer.observe({ entryTypes: ['layout-shift'] });
      this.observers.push(() => observer.disconnect());
    } catch (e) {
      console.warn('CLS observation not supported');
    }
  }

  /**
   * 监控 Time to First Byte
   */
  private observeTTFB() {
    if (typeof window === 'undefined') return;

    const navigationTiming = performance.getEntriesByType('navigation')[0] as any;
    if (navigationTiming) {
      this.metrics.TTFB = navigationTiming.responseStart - navigationTiming.requestStart;
    }
  }

  /**
   * 监控 DOM Content Loaded
   */
  private observeDOMContentLoaded() {
    if (typeof window === 'undefined') return;

    const navigationTiming = performance.getEntriesByType('navigation')[0] as any;
    if (navigationTiming) {
      this.metrics.domContentLoaded =
        navigationTiming.domContentLoadedEventEnd - navigationTiming.fetchStart;
    }
  }

  /**
   * 监控 Load Complete
   */
  private observeLoadComplete() {
    if (typeof window === 'undefined') return;

    const navigationTiming = performance.getEntriesByType('navigation')[0] as any;
    if (navigationTiming) {
      this.metrics.loadComplete =
        navigationTiming.loadEventEnd - navigationTiming.fetchStart;
    }
  }

  /**
   * 测量自定义指标
   */
  measure(name: string, startMark: string, endMark: string) {
    if (typeof window === 'undefined' || !performance.measure) return;

    try {
      performance.measure(name, startMark, endMark);
      const measure = performance.getEntriesByName(name)[0] as any;
      return measure.duration;
    } catch (e) {
      console.warn(`Failed to measure ${name}:`, e);
      return 0;
    }
  }

  /**
   * 创建性能标记
   */
  mark(name: string) {
    if (typeof window === 'undefined' || !performance.mark) return;

    try {
      performance.mark(name);
    } catch (e) {
      console.warn(`Failed to create mark ${name}:`, e);
    }
  }

  /**
   * 获取资源计时
   */
  getResourceTiming(): Array<{
    name: string;
    duration: number;
    size: number;
  }> {
    if (typeof window === 'undefined') return [];

    const resources = performance.getEntriesByType('resource') as any[];
    return resources.map((resource) => ({
      name: resource.name,
      duration: resource.duration,
      size: resource.transferSize || 0,
    }));
  }

  /**
   * 获取慢速资源
   */
  getSlowResources(threshold: number = 1000): Array<{
    name: string;
    duration: number;
    size: number;
  }> {
    return this.getResourceTiming()
      .filter((resource) => resource.duration > threshold)
      .sort((a, b) => b.duration - a.duration);
  }
}

// 导出单例
export const performanceMonitor = new PerformanceMonitor();

// 导出便捷函数
export const startPerformanceMonitoring = () => performanceMonitor.startMonitoring();
export const stopPerformanceMonitoring = () => performanceMonitor.stopMonitoring();
export const getPerformanceMetrics = () => performanceMonitor.getMetrics();
export const getPerformanceReport = () => performanceMonitor.getReport();
export const printPerformanceReport = () => performanceMonitor.printReport();
