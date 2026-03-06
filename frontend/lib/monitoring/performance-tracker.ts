/**
 * 性能监控工具
 * 用于监控和分析应用性能
 */

// =====================================================
// 性能指标类型
// =====================================================

export interface PerformanceMetrics {
  // Web Vitals
  FCP?: number; // First Contentful Paint
  LCP?: number; // Largest Contentful Paint
  FID?: number; // First Input Delay
  CLS?: number; // Cumulative Layout Shift
  TTFB?: number; // Time to First Byte

  // 自定义指标
  pageLoadTime?: number;
  domContentLoaded?: number;
  firstRender?: number;

  // 资源加载
  resourceTiming?: PerformanceResourceTiming[];

  // 导航计时
  navigationTiming?: PerformanceNavigationTiming;

  // 时间戳
  timestamp: number;
}

export interface PerformanceEntry {
  name: string;
  value: number;
  timestamp: number;
  metadata?: Record<string, any>;
}

// =====================================================
// 性能追踪器类
// =====================================================

class PerformanceTracker {
  private metrics: PerformanceMetrics;
  private entries: PerformanceEntry[] = [];
  private observers: PerformanceObserver[] = [];
  private isInitialized = false;

  constructor() {
    this.metrics = {
      timestamp: Date.now(),
    };
  }

  /**
   * 初始化性能监控
   */
  init() {
    if (this.isInitialized || typeof window === 'undefined') return;

    this.isInitialized = true;

    // 监控 Web Vitals
    this.observeFCP();
    this.observeLCP();
    this.observeFID();
    this.observeCLS();

    // 监控页面加载
    this.observePageLoad();

    // 监控长任务
    this.observeLongTasks();

    // 监控内存使用
    this.startMemoryMonitoring();
  }

  /**
   * 观察 First Contentful Paint
   */
  private observeFCP() {
    if (!('PerformanceObserver' in window)) return;

    try {
      const observer = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        const fcpEntry = entries.find(
          (entry) => entry.name === 'first-contentful-paint'
        );

        if (fcpEntry) {
          this.metrics.FCP = fcpEntry.startTime;
          this.addEntry('FCP', fcpEntry.startTime);
        }
      });

      observer.observe({ entryTypes: ['paint'] });
      this.observers.push(observer);
    } catch (e) {
      console.warn('Failed to observe FCP:', e);
    }
  }

  /**
   * 观察 Largest Contentful Paint
   */
  private observeLCP() {
    if (!('PerformanceObserver' in window)) return;

    try {
      const observer = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        const lastEntry = entries[entries.length - 1] as any;

        if (lastEntry) {
          this.metrics.LCP = lastEntry.startTime;
          this.addEntry('LCP', lastEntry.startTime, {
            element: lastEntry.element?.tagName,
            url: lastEntry.url,
          });
        }
      });

      observer.observe({ entryTypes: ['largest-contentful-paint'] });
      this.observers.push(observer);
    } catch (e) {
      console.warn('Failed to observe LCP:', e);
    }
  }

  /**
   * 观察 First Input Delay
   */
  private observeFID() {
    if (!('PerformanceObserver' in window)) return;

    try {
      const observer = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        const fidEntry = entries[0] as any;

        if (fidEntry) {
          this.metrics.FID = fidEntry.processingStart - fidEntry.startTime;
          this.addEntry('FID', this.metrics.FID, {
            eventType: fidEntry.name,
          });
        }
      });

      observer.observe({ entryTypes: ['first-input'] });
      this.observers.push(observer);
    } catch (e) {
      console.warn('Failed to observe FID:', e);
    }
  }

  /**
   * 观察 Cumulative Layout Shift
   */
  private observeCLS() {
    if (!('PerformanceObserver' in window)) return;

    let clsValue = 0;

    try {
      const observer = new PerformanceObserver((list) => {
        for (const entry of list.getEntries() as any[]) {
          if (!entry.hadRecentInput) {
            clsValue += entry.value;
            this.metrics.CLS = clsValue;
            this.addEntry('CLS', clsValue, {
              sources: entry.sources?.length,
            });
          }
        }
      });

      observer.observe({ entryTypes: ['layout-shift'] });
      this.observers.push(observer);
    } catch (e) {
      console.warn('Failed to observe CLS:', e);
    }
  }

  /**
   * 观察页面加载
   */
  private observePageLoad() {
    if (typeof window === 'undefined') return;

    window.addEventListener('load', () => {
      setTimeout(() => {
        const timing = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;

        if (timing) {
          this.metrics.navigationTiming = timing;
          this.metrics.pageLoadTime = timing.loadEventEnd - timing.navigationStart;
          this.metrics.domContentLoaded = timing.domContentLoadedEventEnd - timing.navigationStart;
          this.metrics.TTFB = timing.responseStart - timing.navigationStart;

          this.addEntry('pageLoadTime', this.metrics.pageLoadTime);
          this.addEntry('domContentLoaded', this.metrics.domContentLoaded);
          this.addEntry('TTFB', this.metrics.TTFB);
        }
      }, 0);
    });
  }

  /**
   * 观察长任务
   */
  private observeLongTasks() {
    if (!('PerformanceObserver' in window)) return;

    try {
      const observer = new PerformanceObserver((list) => {
        for (const entry of list.getEntries() as any[]) {
          this.addEntry('longTask', entry.duration, {
            name: entry.name,
            startTime: entry.startTime,
          });
        }
      });

      observer.observe({ entryTypes: ['longtask'] });
      this.observers.push(observer);
    } catch (e) {
      console.warn('Failed to observe long tasks:', e);
    }
  }

  /**
   * 开始监控内存使用
   */
  private startMemoryMonitoring() {
    if (typeof window === 'undefined') return;

    const checkMemory = () => {
      const memory = (performance as any).memory;

      if (memory) {
        this.addEntry('memory', memory.usedJSHeapSize, {
          total: memory.totalJSHeapSize,
          limit: memory.jsHeapSizeLimit,
          usedPercentage: (memory.usedJSHeapSize / memory.jsHeapSizeLimit) * 100,
        });
      }
    };

    // 每5秒检查一次
    setInterval(checkMemory, 5000);
    checkMemory();
  }

  /**
   * 添加性能记录
   */
  addEntry(name: string, value: number, metadata?: Record<string, any>) {
    this.entries.push({
      name,
      value,
      timestamp: Date.now(),
      metadata,
    });
  }

  /**
   * 测量函数执行时间
   */
  async measure<T>(
    name: string,
    fn: () => Promise<T> | T
  ): Promise<T> {
    const startTime = performance.now();

    try {
      const result = await fn();
      const duration = performance.now() - startTime;

      this.addEntry(name, duration);

      return result;
    } catch (error) {
      const duration = performance.now() - startTime;

      this.addEntry(`${name}_error`, duration, {
        error: error instanceof Error ? error.message : 'Unknown error',
      });

      throw error;
    }
  }

  /**
   * 获取所有指标
   */
  getMetrics(): PerformanceMetrics {
    return { ...this.metrics };
  }

  /**
   * 获取所有记录
   */
  getEntries(): PerformanceEntry[] {
    return [...this.entries];
  }

  /**
   * 获取特定名称的记录
   */
  getEntriesByName(name: string): PerformanceEntry[] {
    return this.entries.filter(entry => entry.name === name);
  }

  /**
   * 生成性能报告
   */
  generateReport(): string {
    const report = {
      metrics: this.metrics,
      entries: this.entries,
      userAgent: typeof window !== 'undefined' ? navigator.userAgent : 'Unknown',
      timestamp: new Date().toISOString(),
    };

    return JSON.stringify(report, null, 2);
  }

  /**
   * 获取性能评分
   */
  getScore(): {
    overall: number;
    details: Record<string, { score: number; rating: string }>;
  } {
    const details: Record<string, { score: number; rating: string }> = {};

    // FCP 评分
    if (this.metrics.FCP !== undefined) {
      const fcp = this.metrics.FCP;
      let score = 0;
      let rating = 'Poor';

      if (fcp <= 1800) {
        score = 100;
        rating = 'Good';
      } else if (fcp <= 3000) {
        score = 50 + ((3000 - fcp) / 1200) * 50;
        rating = 'Needs Improvement';
      } else {
        score = Math.max(0, 50 - ((fcp - 3000) / 1000) * 50);
        rating = 'Poor';
      }

      details.FCP = { score, rating };
    }

    // LCP 评分
    if (this.metrics.LCP !== undefined) {
      const lcp = this.metrics.LCP;
      let score = 0;
      let rating = 'Poor';

      if (lcp <= 2500) {
        score = 100;
        rating = 'Good';
      } else if (lcp <= 4000) {
        score = 50 + ((4000 - lcp) / 1500) * 50;
        rating = 'Needs Improvement';
      } else {
        score = Math.max(0, 50 - ((lcp - 4000) / 1000) * 50);
        rating = 'Poor';
      }

      details.LCP = { score, rating };
    }

    // FID 评分
    if (this.metrics.FID !== undefined) {
      const fid = this.metrics.FID;
      let score = 0;
      let rating = 'Poor';

      if (fid <= 100) {
        score = 100;
        rating = 'Good';
      } else if (fid <= 300) {
        score = 50 + ((300 - fid) / 200) * 50;
        rating = 'Needs Improvement';
      } else {
        score = Math.max(0, 50 - ((fid - 300) / 100) * 50);
        rating = 'Poor';
      }

      details.FID = { score, rating };
    }

    // CLS 评分
    if (this.metrics.CLS !== undefined) {
      const cls = this.metrics.CLS;
      let score = 0;
      let rating = 'Poor';

      if (cls <= 0.1) {
        score = 100;
        rating = 'Good';
      } else if (cls <= 0.25) {
        score = 50 + ((0.25 - cls) / 0.15) * 50;
        rating = 'Needs Improvement';
      } else {
        score = Math.max(0, 50 - ((cls - 0.25) / 0.1) * 50);
        rating = 'Poor';
      }

      details.CLS = { score, rating };
    }

    // 计算总分
    const scores = Object.values(details).map(d => d.score);
    const overall = scores.length > 0
      ? scores.reduce((sum, score) => sum + score, 0) / scores.length
      : 0;

    return {
      overall: Math.round(overall),
      details,
    };
  }

  /**
   * 清除所有数据
   */
  clear() {
    this.metrics = {
      timestamp: Date.now(),
    };
    this.entries = [];
  }

  /**
   * 销毁所有观察者
   */
  destroy() {
    this.observers.forEach(observer => observer.disconnect());
    this.observers = [];
    this.isInitialized = false;
  }
}

// =====================================================
// 导出单例
// =====================================================

export const performanceTracker = new PerformanceTracker();

// =====================================================
// 便捷函数
// =====================================================

/**
 * 初始化性能监控
 */
export function initPerformanceTracking() {
  performanceTracker.init();
}

/**
 * 测量函数执行时间
 */
export async function measurePerformance<T>(
  name: string,
  fn: () => Promise<T> | T
): Promise<T> {
  return performanceTracker.measure(name, fn);
}

/**
 * 获取性能指标
 */
export function getPerformanceMetrics(): PerformanceMetrics {
  return performanceTracker.getMetrics();
}

/**
 * 获取性能评分
 */
export function getPerformanceScore() {
  return performanceTracker.getScore();
}

/**
 * 生成性能报告
 */
export function generatePerformanceReport(): string {
  return performanceTracker.generateReport();
}

// =====================================================
// 默认导出
// =====================================================

export default performanceTracker;
