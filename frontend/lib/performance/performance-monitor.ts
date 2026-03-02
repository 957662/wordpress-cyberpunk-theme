/**
 * 性能监控工具
 * 用于监控和分析应用性能指标
 */

export interface PerformanceMetrics {
  // 导航计时
  domContentLoaded: number;
  loadComplete: number;
  firstPaint: number;
  firstContentfulPaint: number;

  // 资源计时
  totalResources: number;
  cachedResources: number;
  totalTransferSize: number;

  // 自定义指标
  pageLoadTime: number;
  domReadyTime: number;
  networkLatency: number;

  // Core Web Vitals
  LCP?: number; // Largest Contentful Paint
  FID?: number; // First Input Delay
  CLS?: number; // Cumulative Layout Shift
}

export interface PerformanceEntry {
  name: string;
  value: number;
  timestamp: number;
}

class PerformanceMonitor {
  private metrics: PerformanceMetrics;
  private entries: PerformanceEntry[] = [];
  private observers: PerformanceObserver[] = [];

  constructor() {
    this.metrics = this.initializeMetrics();
    this.setupObservers();
  }

  private initializeMetrics(): PerformanceMetrics {
    return {
      domContentLoaded: 0,
      loadComplete: 0,
      firstPaint: 0,
      firstContentfulPaint: 0,
      totalResources: 0,
      cachedResources: 0,
      totalTransferSize: 0,
      pageLoadTime: 0,
      domReadyTime: 0,
      networkLatency: 0,
    };
  }

  /**
   * 设置性能观察器
   */
  private setupObservers(): void {
    if (typeof window === 'undefined') return;

    // 观察 Core Web Vitals
    try {
      // LCP - 最大内容绘制
      const lcpObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        const lastEntry = entries[entries.length - 1] as any;
        this.metrics.LCP = lastEntry?.startTime || 0;
        this.recordEntry('LCP', this.metrics.LCP);
      });
      lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] });
      this.observers.push(lcpObserver);

      // FID - 首次输入延迟
      const fidObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        entries.forEach((entry: any) => {
          this.metrics.FID = entry.processingStart - entry.startTime;
          this.recordEntry('FID', this.metrics.FID);
        });
      });
      fidObserver.observe({ entryTypes: ['first-input'] });
      this.observers.push(fidObserver);

      // CLS - 累积布局偏移
      let clsValue = 0;
      const clsObserver = new PerformanceObserver((list) => {
        list.getEntries().forEach((entry: any) => {
          if (!entry.hadRecentInput) {
            clsValue += entry.value;
            this.metrics.CLS = clsValue;
            this.recordEntry('CLS', clsValue);
          }
        });
      });
      clsObserver.observe({ entryTypes: ['layout-shift'] });
      this.observers.push(clsObserver);
    } catch (error) {
      console.warn('Performance Observer setup failed:', error);
    }
  }

  /**
   * 记录性能指标
   */
  private recordEntry(name: string, value: number): void {
    this.entries.push({
      name,
      value,
      timestamp: Date.now(),
    });
  }

  /**
   * 测量页面加载性能
   */
  measurePageLoad(): PerformanceMetrics {
    if (typeof window === 'undefined' || !window.performance) {
      return this.metrics;
    }

    const timing = window.performance.timing;
    const navigation = window.performance.getEntriesByType('navigation')[0] as any;

    if (navigation) {
      // Navigation Timing API Level 2
      this.metrics.domContentLoaded = navigation.domContentLoadedEventEnd - navigation.startTime;
      this.metrics.loadComplete = navigation.loadEventEnd - navigation.startTime;
      this.metrics.networkLatency = navigation.responseStart - navigation.startTime;
      this.metrics.domReadyTime = navigation.domContentLoadedEventEnd - navigation.domContentLoadedEventStart;
      this.metrics.pageLoadTime = navigation.loadEventEnd - navigation.startTime;
    } else if (timing) {
      // Navigation Timing API Level 1 (Legacy)
      this.metrics.domContentLoaded = timing.domContentLoadedEventEnd - timing.navigationStart;
      this.metrics.loadComplete = timing.loadEventEnd - timing.navigationStart;
      this.metrics.networkLatency = timing.responseStart - timing.navigationStart;
      this.metrics.domReadyTime = timing.domComplete - timing.domLoading;
      this.metrics.pageLoadTime = timing.loadEventEnd - timing.navigationStart;
    }

    // Paint Timing
    const paintEntries = window.performance.getEntriesByType('paint');
    paintEntries.forEach((entry: any) => {
      if (entry.name === 'first-paint') {
        this.metrics.firstPaint = entry.startTime;
        this.recordEntry('First Paint', entry.startTime);
      }
      if (entry.name === 'first-contentful-paint') {
        this.metrics.firstContentfulPaint = entry.startTime;
        this.recordEntry('First Contentful Paint', entry.startTime);
      }
    });

    return this.metrics;
  }

  /**
   * 测量资源加载
   */
  measureResources(): {
    total: number;
    cached: number;
    totalSize: number;
    resources: Array<{
      name: string;
      duration: number;
      size: number;
      cached: boolean;
    }>;
  } {
    if (typeof window === 'undefined') return { total: 0, cached: 0, totalSize: 0, resources: [] };

    const resources = window.performance.getEntriesByType('resource') as any[];
    const total = resources.length;
    let cached = 0;
    let totalSize = 0;

    const resourceDetails = resources.map((resource) => {
      const isCached = resource.transferSize === 0 && resource.decodedBodySize > 0;
      if (isCached) cached++;

      totalSize += resource.transferSize || 0;

      return {
        name: resource.name,
        duration: resource.duration,
        size: resource.transferSize || 0,
        cached: isCached,
      };
    });

    this.metrics.totalResources = total;
    this.metrics.cachedResources = cached;
    this.metrics.totalTransferSize = totalSize;

    return { total, cached, totalSize, resources: resourceDetails };
  }

  /**
   * 获取内存使用情况
   */
  getMemoryUsage(): {
    usedJSHeapSize: number;
    totalJSHeapSize: number;
    jsHeapSizeLimit: number;
  } | null {
    if (typeof window === 'undefined' || !(performance as any).memory) {
      return null;
    }

    const memory = (performance as any).memory;
    return {
      usedJSHeapSize: memory.usedJSHeapSize,
      totalJSHeapSize: memory.totalJSHeapSize,
      jsHeapSizeLimit: memory.jsHeapSizeLimit,
    };
  }

  /**
   * 获取网络信息
   */
  getNetworkInfo(): {
    effectiveType?: string;
    downlink?: number;
    rtt?: number;
    saveData?: boolean;
  } | null {
    if (typeof window === 'undefined' || !(navigator as any).connection) {
      return null;
    }

    const connection = (navigator as any).connection;
    return {
      effectiveType: connection.effectiveType,
      downlink: connection.downlink,
      rtt: connection.rtt,
      saveData: connection.saveData,
    };
  }

  /**
   * 测量函数执行时间
   */
  async measureFunction<T>(
    name: string,
    fn: () => T | Promise<T>
  ): Promise<{ result: T; duration: number }> {
    const start = performance.now();
    const result = await fn();
    const duration = performance.now() - start;

    this.recordEntry(name, duration);
    return { result, duration };
  }

  /**
   * 标记性能时间点
   */
  mark(name: string): void {
    if (typeof window === 'undefined') return;
    performance.mark(name);
  }

  /**
   * 测量两个标记之间的时间
   */
  measure(name: string, startMark: string, endMark: string): number {
    if (typeof window === 'undefined') return 0;

    try {
      performance.measure(name, startMark, endMark);
      const measure = performance.getEntriesByName(name)[0];
      return measure ? measure.duration : 0;
    } catch (error) {
      console.warn('Performance measure failed:', error);
      return 0;
    }
  }

  /**
   * 获取所有记录的性能条目
   */
  getEntries(): PerformanceEntry[] {
    return [...this.entries];
  }

  /**
   * 清除性能数据
   */
  clear(): void {
    this.metrics = this.initializeMetrics();
    this.entries = [];

    if (typeof window !== 'undefined') {
      performance.clearMarks();
      performance.clearMeasures();
    }
  }

  /**
   * 断开所有观察器
   */
  disconnect(): void {
    this.observers.forEach((observer) => observer.disconnect());
    this.observers = [];
  }

  /**
   * 生成性能报告
   */
  generateReport(): {
    metrics: PerformanceMetrics;
    entries: PerformanceEntry[];
    memory: ReturnType<typeof this.getMemoryUsage>;
    network: ReturnType<typeof this.getNetworkInfo>;
    timestamp: number;
  } {
    return {
      metrics: this.measurePageLoad(),
      entries: this.getEntries(),
      memory: this.getMemoryUsage(),
      network: this.getNetworkInfo(),
      timestamp: Date.now(),
    };
  }

  /**
   * 格式化性能报告为可读文本
   */
  formatReport(): string {
    const report = this.generateReport();
    const metrics = report.metrics;

    const lines = [
      '📊 Performance Report',
      '─'.repeat(50),
      `📅 Timestamp: ${new Date(report.timestamp).toISOString()}`,
      '',
      '⏱️  Page Load Times:',
      `  • Page Load: ${metrics.pageLoadTime.toFixed(0)}ms`,
      `  • DOM Ready: ${metrics.domReadyTime.toFixed(0)}ms`,
      `  • DOM Content Loaded: ${metrics.domContentLoaded.toFixed(0)}ms`,
      `  • First Paint: ${metrics.firstPaint.toFixed(0)}ms`,
      `  • First Contentful Paint: ${metrics.firstContentfulPaint.toFixed(0)}ms`,
      '',
      '🌐 Network:',
      `  • Latency: ${metrics.networkLatency.toFixed(0)}ms`,
      `  • Resources: ${metrics.totalResources} (${metrics.cachedResources} cached)`,
      `  • Transfer Size: ${(metrics.totalTransferSize / 1024).toFixed(2)} KB`,
      '',
      '✨ Core Web Vitals:',
      `  • LCP: ${metrics.LCP ? `${metrics.LCP.toFixed(0)}ms` : 'N/A'} ${metrics.LCP && metrics.LCP < 2500 ? '✅' : metrics.LCP && metrics.LCP < 4000 ? '⚠️' : '❌'}`,
      `  • FID: ${metrics.FID ? `${metrics.FID.toFixed(0)}ms` : 'N/A'} ${metrics.FID && metrics.FID < 100 ? '✅' : metrics.FID && metrics.FID < 300 ? '⚠️' : '❌'}`,
      `  • CLS: ${metrics.CLS ? metrics.CLS.toFixed(3) : 'N/A'} ${metrics.CLS !== undefined && metrics.CLS < 0.1 ? '✅' : metrics.CLS !== undefined && metrics.CLS < 0.25 ? '⚠️' : '❌'}`,
    ];

    if (report.memory) {
      lines.push('', '💾 Memory:', `  • Used: ${(report.memory.usedJSHeapSize / 1048576).toFixed(2)} MB`, `  • Total: ${(report.memory.totalJSHeapSize / 1048576).toFixed(2)} MB`, `  • Limit: ${(report.memory.jsHeapSizeLimit / 1048576).toFixed(2)} MB`);
    }

    if (report.network) {
      lines.push('', '📡 Connection:', `  • Type: ${report.network.effectiveType || 'Unknown'}`, `  • Downlink: ${report.network.downlink || 'Unknown'} Mbps`, `  • RTT: ${report.network.rtt || 'Unknown'} ms`);
    }

    lines.push('', '─'.repeat(50));

    return lines.join('\n');
  }
}

// 创建单例实例
let monitorInstance: PerformanceMonitor | null = null;

export function getPerformanceMonitor(): PerformanceMonitor {
  if (!monitorInstance) {
    monitorInstance = new PerformanceMonitor();
  }
  return monitorInstance;
}

export default PerformanceMonitor;
