/**
 * 性能监控工具
 * 监控 Core Web Vitals 和自定义性能指标
 */

export interface PerformanceMetrics {
  // Core Web Vitals
  FCP?: number; // First Contentful Paint
  LCP?: number; // Largest Contentful Paint
  FID?: number; // First Input Delay
  CLS?: number; // Cumulative Layout Shift
  TTFB?: number; // Time to First Byte
  
  // Custom Metrics
  TTI?: number; // Time to Interactive
  loadTime?: number; // Page Load Time
  domReady?: number; // DOM Ready Time
  resourceCount?: number; // Resource Count
  memoryUsage?: number; // Memory Usage (MB)
  
  // Network Metrics
  navigationTiming?: NavigationTiming;
  resourceTiming?: PerformanceResourceTiming[];
}

class PerformanceMonitor {
  private metrics: PerformanceMetrics = {};
  private observers: PerformanceObserver[] = [];
  private isSupported = typeof window !== 'undefined' && 'performance' in window;

  /**
   * 初始化性能监控
   */
  init(): void {
    if (!this.isSupported) {
      console.warn('Performance API not supported');
      return;
    }

    this.measureFCP();
    this.measureLCP();
    this.measureFID();
    this.measureCLS();
    this.measureTTFB();
    this.measureLoadTime();
    this.measureResources();
  }

  /**
   * 测量首次内容绘制 (FCP)
   */
  private measureFCP(): void {
    try {
      const observer = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        const fcpEntry = entries.find(
          (entry) => entry.name === 'first-contentful-paint'
        );

        if (fcpEntry) {
          this.metrics.FCP = Math.round(fcpEntry.startTime);
          this.reportMetric('FCP', this.metrics.FCP);
        }
      });

      observer.observe({ type: 'paint', buffered: true });
      this.observers.push(observer);
    } catch (e) {
      console.warn('FCP measurement not supported');
    }
  }

  /**
   * 测量最大内容绘制 (LCP)
   */
  private measureLCP(): void {
    try {
      const observer = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        const lastEntry = entries[entries.length - 1] as any;
        
        this.metrics.LCP = Math.round(lastEntry.startTime);
        this.reportMetric('LCP', this.metrics.LCP);
      });

      observer.observe({ type: 'largest-contentful-paint', buffered: true });
      this.observers.push(observer);
    } catch (e) {
      console.warn('LCP measurement not supported');
    }
  }

  /**
   * 测量首次输入延迟 (FID)
   */
  private measureFID(): void {
    try {
      const observer = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        const firstEntry = entries[0] as any;
        
        this.metrics.FID = Math.round(firstEntry.processingStart - firstEntry.startTime);
        this.reportMetric('FID', this.metrics.FID);
      });

      observer.observe({ type: 'first-input', buffered: true });
      this.observers.push(observer);
    } catch (e) {
      console.warn('FID measurement not supported');
    }
  }

  /**
   * 测量累积布局偏移 (CLS)
   */
  private measureCLS(): void {
    try {
      let clsValue = 0;
      const observer = new PerformanceObserver((list) => {
        for (const entry of list.getEntries() as any[]) {
          if (!entry.hadRecentInput) {
            clsValue += entry.value;
          }
        }
        
        this.metrics.CLS = Math.round(clsValue * 1000) / 1000;
        this.reportMetric('CLS', this.metrics.CLS);
      });

      observer.observe({ type: 'layout-shift', buffered: true });
      this.observers.push(observer);
    } catch (e) {
      console.warn('CLS measurement not supported');
    }
  }

  /**
   * 测量首字节时间 (TTFB)
   */
  private measureTTFB(): void {
    if (!this.isSupported) return;

    const navigation = performance.getEntriesByType('navigation')[0] as any;
    
    if (navigation) {
      this.metrics.TTFB = Math.round(navigation.responseStart - navigation.requestStart);
      this.metrics.navigationTiming = navigation;
      this.reportMetric('TTFB', this.metrics.TTFB);
    }
  }

  /**
   * 测量页面加载时间
   */
  private measureLoadTime(): void {
    if (!this.isSupported) return;

    window.addEventListener('load', () => {
      setTimeout(() => {
        const navigation = performance.getEntriesByType('navigation')[0] as any;
        
        if (navigation) {
          this.metrics.loadTime = Math.round(navigation.loadEventEnd - navigation.fetchStart);
          this.metrics.domReady = Math.round(navigation.domContentLoadedEventEnd - navigation.fetchStart);
          
          this.reportMetric('loadTime', this.metrics.loadTime);
          this.reportMetric('domReady', this.metrics.domReady);
        }
      }, 0);
    });
  }

  /**
   * 测量资源加载
   */
  private measureResources(): void {
    if (!this.isSupported) return;

    window.addEventListener('load', () => {
      const resources = performance.getEntriesByType('resource') as PerformanceResourceTiming[];
      this.metrics.resourceCount = resources.length;
      this.metrics.resourceTiming = resources;
      
      this.reportMetric('resourceCount', this.metrics.resourceCount);
    });
  }

  /**
   * 测量内存使用
   */
  measureMemory(): number | undefined {
    if (!this.isSupported) return undefined;

    const memory = (performance as any).memory;
    if (memory) {
      this.metrics.memoryUsage = Math.round(memory.usedJSHeapSize / 1048576);
      return this.metrics.memoryUsage;
    }
    
    return undefined;
  }

  /**
   * 计算可交互时间 (TTI)
   */
  calculateTTI(): number | undefined {
    if (!this.isSupported) return undefined;

    const navigation = performance.getEntriesByType('navigation')[0] as any;
    
    if (navigation && navigation.domInteractive) {
      this.metrics.TTI = Math.round(navigation.domInteractive - navigation.fetchStart);
      return this.metrics.TTI;
    }
    
    return undefined;
  }

  /**
   * 获取所有性能指标
   */
  getMetrics(): PerformanceMetrics {
    // 补充计算型指标
    if (!this.metrics.TTI) {
      this.calculateTTI();
    }
    if (!this.metrics.memoryUsage) {
      this.measureMemory();
    }
    
    return { ...this.metrics };
  }

  /**
   * 评估性能等级
   */
  getPerformanceGrade(): 'excellent' | 'good' | 'needs-improvement' | 'poor' {
    const metrics = this.getMetrics();
    let score = 0;
    let total = 0;

    // LCP 评分 (优秀: <2.5s, 良好: <4s)
    if (metrics.LCP) {
      total++;
      if (metrics.LCP < 2500) score++;
      else if (metrics.LCP < 4000) score += 0.5;
    }

    // FID 评分 (优秀: <100ms, 良好: <300ms)
    if (metrics.FID) {
      total++;
      if (metrics.FID < 100) score++;
      else if (metrics.FID < 300) score += 0.5;
    }

    // CLS 评分 (优秀: <0.1, 良好: <0.25)
    if (metrics.CLS !== undefined) {
      total++;
      if (metrics.CLS < 0.1) score++;
      else if (metrics.CLS < 0.25) score += 0.5;
    }

    // FCP 评分 (优秀: <1.8s, 良好: <3s)
    if (metrics.FCP) {
      total++;
      if (metrics.FCP < 1800) score++;
      else if (metrics.FCP < 3000) score += 0.5;
    }

    // TTFB 评分 (优秀: <600ms, 良好: <1s)
    if (metrics.TTFB) {
      total++;
      if (metrics.TTFB < 600) score++;
      else if (metrics.TTFB < 1000) score += 0.5;
    }

    const ratio = total > 0 ? score / total : 0;

    if (ratio >= 0.8) return 'excellent';
    if (ratio >= 0.6) return 'good';
    if (ratio >= 0.4) return 'needs-improvement';
    return 'poor';
  }

  /**
   * 获取性能建议
   */
  getRecommendations(): string[] {
    const recommendations: string[] = [];
    const metrics = this.getMetrics();

    if (metrics.LCP && metrics.LCP > 2500) {
      recommendations.push('优化最大内容绘制时间：考虑懒加载图片、优化关键CSS');
    }

    if (metrics.FID && metrics.FID > 100) {
      recommendations.push('减少首次输入延迟：拆分长任务、优化JavaScript执行');
    }

    if (metrics.CLS !== undefined && metrics.CLS > 0.1) {
      recommendations.push('减少累积布局偏移：为图片和视频预留空间、避免插入内容');
    }

    if (metrics.FCP && metrics.FCP > 1800) {
      recommendations.push('加快首次内容绘制：减少渲染阻塞资源、优化服务器响应');
    }

    if (metrics.TTFB && metrics.TTFB > 600) {
      recommendations.push('优化首字节时间：使用CDN、优化服务器性能、启用缓存');
    }

    if (metrics.memoryUsage && metrics.memoryUsage > 100) {
      recommendations.push('减少内存使用：检查内存泄漏、优化数据结构');
    }

    if (metrics.loadTime && metrics.loadTime > 3000) {
      recommendations.push('优化页面加载时间：压缩资源、使用HTTP缓存、减少请求数');
    }

    return recommendations;
  }

  /**
   * 上报指标
   */
  private reportMetric(name: string, value: number): void {
    // 这里可以集成分析工具
    if (process.env.NODE_ENV === 'development') {
      console.log(`[Performance] ${name}: ${value}ms`);
    }
    
    // 触发自定义事件
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('performance-metric', {
        detail: { name, value }
      }));
    }
  }

  /**
   * 清理观察器
   */
  destroy(): void {
    this.observers.forEach(observer => observer.disconnect());
    this.observers = [];
  }

  /**
   * 导出性能报告
   */
  exportReport(): string {
    const metrics = this.getMetrics();
    const grade = this.getPerformanceGrade();
    const recommendations = this.getRecommendations();

    return JSON.stringify({
      timestamp: new Date().toISOString(),
      grade,
      metrics,
      recommendations,
    }, null, 2);
  }
}

// 创建单例
let monitor: PerformanceMonitor | null = null;

export function getPerformanceMonitor(): PerformanceMonitor {
  if (!monitor) {
    monitor = new PerformanceMonitor();
  }
  return monitor;
}

/**
 * 初始化性能监控
 */
export function initPerformanceMonitoring(): PerformanceMonitor {
  const perfMonitor = getPerformanceMonitor();
  perfMonitor.init();
  return perfMonitor;
}

/**
 * 获取 Core Web Vitals
 */
export async function getCoreWebVitals(): Promise<{
  LCP?: number;
  FID?: number;
  CLS?: number;
  FCP?: number;
  TTFB?: number;
}> {
  const monitor = getPerformanceMonitor();
  const metrics = monitor.getMetrics();
  
  return {
    LCP: metrics.LCP,
    FID: metrics.FID,
    CLS: metrics.CLS,
    FCP: metrics.FCP,
    TTFB: metrics.TTFB,
  };
}
