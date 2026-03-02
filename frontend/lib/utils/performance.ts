/**
 * 性能监控工具
 */

interface PerformanceMetric {
  name: string;
  value: number;
  timestamp: number;
}

interface PageLoadMetrics {
  dns: number;
  tcp: number;
  request: number;
  response: number;
  domProcessing: number;
  domComplete: number;
  loadComplete: number;
}

/**
 * 性能监控类
 */
class PerformanceMonitor {
  private metrics: PerformanceMetric[] = [];
  private observers: PerformanceObserver[] = [];

  /**
   * 初始化性能监控
   */
  init() {
    if (typeof window === 'undefined' || !window.PerformanceObserver) {
      return;
    }

    // 监控长任务
    this.observeLongTasks();

    // 监控布局偏移
    this.observeLayoutShift();

    // 监控 largest contentful paint
    this.observeLCP();

    // 监控首次输入延迟
    this.observeFID();

    // 记录页面加载指标
    this.recordPageLoadMetrics();
  }

  /**
   * 监控长任务
   */
  private observeLongTasks() {
    try {
      const observer = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          this.recordMetric('longTask', entry.duration);
        }
      });
      observer.observe({ entryTypes: ['longtask'] });
      this.observers.push(observer);
    } catch (e) {
      console.warn('Long task monitoring not supported');
    }
  }

  /**
   * 监控布局偏移
   */
  private observeLayoutShift() {
    try {
      let clsValue = 0;
      const observer = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          if (!(entry as any).hadRecentInput) {
            clsValue += (entry as any).value;
            this.recordMetric('CLS', clsValue);
          }
        }
      });
      observer.observe({ entryTypes: ['layout-shift'] });
      this.observers.push(observer);
    } catch (e) {
      console.warn('Layout shift monitoring not supported');
    }
  }

  /**
   * 监控最大内容绘制
   */
  private observeLCP() {
    try {
      const observer = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        const lastEntry = entries[entries.length - 1];
        this.recordMetric('LCP', lastEntry.startTime);
      });
      observer.observe({ entryTypes: ['largest-contentful-paint'] });
      this.observers.push(observer);
    } catch (e) {
      console.warn('LCP monitoring not supported');
    }
  }

  /**
   * 监控首次输入延迟
   */
  private observeFID() {
    try {
      const observer = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          this.recordMetric('FID', (entry as any).processingStart - entry.startTime);
        }
      });
      observer.observe({ entryTypes: ['first-input'] });
      this.observers.push(observer);
    } catch (e) {
      console.warn('FID monitoring not supported');
    }
  }

  /**
   * 记录页面加载指标
   */
  private recordPageLoadMetrics() {
    window.addEventListener('load', () => {
      setTimeout(() => {
        const timing = performance.timing;
        const metrics: PageLoadMetrics = {
          dns: timing.domainLookupEnd - timing.domainLookupStart,
          tcp: timing.connectEnd - timing.connectStart,
          request: timing.responseStart - timing.requestStart,
          response: timing.responseEnd - timing.responseStart,
          domProcessing: timing.domComplete - timing.domLoading,
          domComplete: timing.domContentLoadedEventEnd - timing.navigationStart,
          loadComplete: timing.loadEventEnd - timing.navigationStart,
        };

        Object.entries(metrics).forEach(([name, value]) => {
          this.recordMetric(name, value);
        });
      }, 0);
    });
  }

  /**
   * 记录自定义指标
   */
  recordMetric(name: string, value: number) {
    const metric: PerformanceMetric = {
      name,
      value,
      timestamp: Date.now(),
    };
    this.metrics.push(metric);

    // 发送到分析服务
    this.sendToAnalytics(metric);
  }

  /**
   * 获取所有指标
   */
  getMetrics(): PerformanceMetric[] {
    return [...this.metrics];
  }

  /**
   * 获取特定指标
   */
  getMetric(name: string): PerformanceMetric | undefined {
    return this.metrics.find(m => m.name === name);
  }

  /**
   * 计算平均指标值
   */
  getAverageMetric(name: string): number {
    const filtered = this.metrics.filter(m => m.name === name);
    if (filtered.length === 0) return 0;

    const sum = filtered.reduce((acc, m) => acc + m.value, 0);
    return sum / filtered.length;
  }

  /**
   * 清除所有指标
   */
  clear() {
    this.metrics = [];
  }

  /**
   * 发送到分析服务
   */
  private sendToAnalytics(metric: PerformanceMetric) {
    // 这里可以集成到分析服务
    if (process.env.NODE_ENV === 'development') {
      console.log('Performance metric:', metric);
    }
  }

  /**
   * 断开所有观察者
   */
  disconnect() {
    this.observers.forEach(observer => observer.disconnect());
    this.observers = [];
  }

  /**
   * 获取性能报告
   */
  getReport(): string {
    const report: string[] = ['性能报告：'];

    const metricGroups = this.groupMetricsByName();
    Object.entries(metricGroups).forEach(([name, metrics]) => {
      const avg = metrics.reduce((acc, m) => acc + m.value, 0) / metrics.length;
      const min = Math.min(...metrics.map(m => m.value));
      const max = Math.max(...metrics.map(m => m.value));

      report.push(`\n${name}:`);
      report.push(`  平均: ${avg.toFixed(2)}ms`);
      report.push(`  最小: ${min.toFixed(2)}ms`);
      report.push(`  最大: ${max.toFixed(2)}ms`);
      report.push(`  次数: ${metrics.length}`);
    });

    return report.join('\n');
  }

  private groupMetricsByName(): Record<string, PerformanceMetric[]> {
    const grouped: Record<string, PerformanceMetric[]> = {};

    this.metrics.forEach(metric => {
      if (!grouped[metric.name]) {
        grouped[metric.name] = [];
      }
      grouped[metric.name].push(metric);
    });

    return grouped;
  }
}

// 导出单例
export const performanceMonitor = new PerformanceMonitor();

// 导出便捷函数
export function measurePerformance(name: string, fn: () => void | Promise<void>) {
  const start = performance.now();

  const end = () => {
    const duration = performance.now() - start;
    performanceMonitor.recordMetric(name, duration);
  };

  const result = fn();

  if (result instanceof Promise) {
    return result.finally(end);
  } else {
    end();
    return result;
  }
}

export function usePerformanceMonitor() {
  if (typeof window !== 'undefined') {
    performanceMonitor.init();
  }

  return performanceMonitor;
}
