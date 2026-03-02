/**
 * 性能监控服务
 * 监控应用性能指标和用户体验
 */

interface PerformanceMetric {
  name: string;
  value: number;
  rating: 'good' | 'needs-improvement' | 'poor';
  timestamp: number;
}

interface WebVitals {
  FCP?: PerformanceMetric; // First Contentful Paint
  LCP?: PerformanceMetric; // Largest Contentful Paint
  FID?: PerformanceMetric; // First Input Delay
  CLS?: PerformanceMetric; // Cumulative Layout Shift
  TTFB?: PerformanceMetric; // Time to First Byte
}

interface NavigationTiming {
  dns: number;
  tcp: number;
  request: number;
  response: number;
  processing: number;
  load: number;
  total: number;
}

interface ResourceTiming {
  name: string;
  type: string;
  duration: number;
  size: number;
  cached: boolean;
}

interface PageLoadInfo {
  url: string;
  timestamp: number;
  webVitals: WebVitals;
  navigationTiming: NavigationTiming;
  resources: ResourceTiming[];
  userAgent: string;
}

/**
 * 性能监控服务类
 */
class PerformanceMonitor {
  private metrics: WebVitals = {};
  private navigationTiming: NavigationTiming | null = null;
  private resourceTimings: ResourceTiming[] = [];
  private isRecording = false;

  /**
   * 开始监控
   */
  startMonitoring(): void {
    if (this.isRecording) return;

    this.isRecording = true;

    // 监听 Web Vitals
    this.observeWebVitals();

    // 监听资源加载
    this.observeResources();

    // 监听页面卸载
    if (typeof window !== 'undefined') {
      window.addEventListener('beforeunload', () => {
        this.saveMetrics();
      });
    }
  }

  /**
   * 停止监控
   */
  stopMonitoring(): void {
    this.isRecording = false;
  }

  /**
   * 观察 Web Vitals
   */
  private observeWebVitals(): void {
    if (typeof window === 'undefined') return;

    // FCP - First Contentful Paint
    this.observePerformanceEntry('paint', (entries) => {
      entries.forEach((entry) => {
        if (entry.name === 'first-contentful-paint') {
          this.metrics.FCP = this.createMetric(
            'FCP',
            entry.startTime,
            this.rateFCP(entry.startTime)
          );
        }
      });
    });

    // LCP - Largest Contentful Paint
    if ('PerformanceObserver' in window) {
      try {
        const observer = new PerformanceObserver((list) => {
          const entries = list.getEntries();
          const lastEntry = entries[entries.length - 1] as any;
          this.metrics.LCP = this.createMetric(
            'LCP',
            lastEntry.startTime,
            this.rateLCP(lastEntry.startTime)
          );
        });
        observer.observe({ entryTypes: ['largest-contentful-paint'] });
      } catch (e) {
        console.warn('LCP observation not supported');
      }
    }

    // FID - First Input Delay
    if ('PerformanceObserver' in window) {
      try {
        const observer = new PerformanceObserver((list) => {
          const entries = list.getEntries() as any[];
          entries.forEach((entry) => {
            if (!this.metrics.FID) {
              this.metrics.FID = this.createMetric(
                'FID',
                entry.processingStart - entry.startTime,
                this.rateFID(entry.processingStart - entry.startTime)
              );
            }
          });
        });
        observer.observe({ entryTypes: ['first-input'] });
      } catch (e) {
        console.warn('FID observation not supported');
      }
    }

    // CLS - Cumulative Layout Shift
    if ('PerformanceObserver' in window) {
      try {
        let clsValue = 0;
        const observer = new PerformanceObserver((list) => {
          const entries = list.getEntries() as any[];
          entries.forEach((entry) => {
            if (!entry.hadRecentInput) {
              clsValue += entry.value;
              this.metrics.CLS = this.createMetric(
                'CLS',
                clsValue,
                this.rateCLS(clsValue)
              );
            }
          });
        });
        observer.observe({ entryTypes: ['layout-shift'] });
      } catch (e) {
        console.warn('CLS observation not supported');
      }
    }

    // TTFB - Time to First Byte
    this.calculateTTFB();
  }

  /**
   * 观察资源加载
   */
  private observeResources(): void {
    if (typeof window === 'undefined') return;

    if ('PerformanceObserver' in window) {
      try {
        const observer = new PerformanceObserver((list) => {
          const entries = list.getEntries() as PerformanceResourceTiming[];
          entries.forEach((entry) => {
            this.resourceTimings.push({
              name: entry.name,
              type: this.getResourceType(entry.name),
              duration: entry.duration,
              size: entry.transferSize,
              cached: entry.transferSize === 0,
            });
          });
        });
        observer.observe({ entryTypes: ['resource'] });
      } catch (e) {
        console.warn('Resource observation not supported');
      }
    }

    // 计算导航时序
    this.calculateNavigationTiming();
  }

  /**
   * 观察性能条目
   */
  private observePerformanceEntry(
    type: string,
    callback: (entries: PerformanceEntryList) => void
  ): void {
    if (typeof window === 'undefined') return;

    if ('PerformanceObserver' in window) {
      try {
        const observer = new PerformanceObserver(callback);
        observer.observe({ entryTypes: [type] });
      } catch (e) {
        // Fallback for older browsers
        if (window.performance && window.performance.getEntriesByType) {
          const entries = window.performance.getEntriesByType(type);
          if (entries.length > 0) {
            callback(entries);
          }
        }
      }
    }
  }

  /**
   * 计算 TTFB
   */
  private calculateTTFB(): void {
    if (typeof window === 'undefined') return;

    const navigation = performance.getEntriesByType('navigation')[0] as any;
    if (navigation) {
      const ttfb = navigation.responseStart - navigation.requestStart;
      this.metrics.TTFB = this.createMetric(
        'TTFB',
        ttfb,
        this.rateTTFB(ttfb)
      );
    }
  }

  /**
   * 计算导航时序
   */
  private calculateNavigationTiming(): void {
    if (typeof window === 'undefined') return;

    const navigation = performance.getEntriesByType('navigation')[0] as any;
    if (!navigation) return;

    this.navigationTiming = {
      dns: navigation.domainLookupEnd - navigation.domainLookupStart,
      tcp: navigation.connectEnd - navigation.connectStart,
      request: navigation.requestStart - navigation.connectEnd,
      response: navigation.responseStart - navigation.requestStart,
      processing: navigation.domComplete - navigation.responseEnd,
      load: navigation.loadEventEnd - navigation.loadEventStart,
      total: navigation.loadEventEnd - navigation.fetchStart,
    };
  }

  /**
   * 创建性能指标
   */
  private createMetric(
    name: string,
    value: number,
    rating: 'good' | 'needs-improvement' | 'poor'
  ): PerformanceMetric {
    return {
      name,
      value: Math.round(value * 100) / 100,
      rating,
      timestamp: Date.now(),
    };
  }

  /**
   * 评级 FCP
   */
  private rateFCP(value: number): 'good' | 'needs-improvement' | 'poor' {
    if (value <= 1800) return 'good';
    if (value <= 3000) return 'needs-improvement';
    return 'poor';
  }

  /**
   * 评级 LCP
   */
  private rateLCP(value: number): 'good' | 'needs-improvement' | 'poor' {
    if (value <= 2500) return 'good';
    if (value <= 4000) return 'needs-improvement';
    return 'poor';
  }

  /**
   * 评级 FID
   */
  private rateFID(value: number): 'good' | 'needs-improvement' | 'poor' {
    if (value <= 100) return 'good';
    if (value <= 300) return 'needs-improvement';
    return 'poor';
  }

  /**
   * 评级 CLS
   */
  private rateCLS(value: number): 'good' | 'needs-improvement' | 'poor' {
    if (value <= 0.1) return 'good';
    if (value <= 0.25) return 'needs-improvement';
    return 'poor';
  }

  /**
   * 评级 TTFB
   */
  private rateTTFB(value: number): 'good' | 'needs-improvement' | 'poor' {
    if (value <= 800) return 'good';
    if (value <= 1800) return 'needs-improvement';
    return 'poor';
  }

  /**
   * 获取资源类型
   */
  private getResourceType(url: string): string {
    const extension = url.split('.').pop()?.toLowerCase();

    if (url.match(/\.(jpg|jpeg|png|gif|webp|svg)$/i)) return 'image';
    if (url.match(/\.(css)$/i)) return 'stylesheet';
    if (url.match(/\.(js)$/i)) return 'script';
    if (url.match(/\.(woff|woff2|ttf|otf)$/i)) return 'font';
    if (url.includes('/api/')) return 'api';

    return 'other';
  }

  /**
   * 获取当前指标
   */
  getMetrics(): WebVitals {
    return { ...this.metrics };
  }

  /**
   * 获取导航时序
   */
  getNavigationTiming(): NavigationTiming | null {
    return this.navigationTiming;
  }

  /**
   * 获取资源时序
   */
  getResourceTimings(): ResourceTiming[] {
    return [...this.resourceTimings];
  }

  /**
   * 获取完整的页面加载信息
   */
  getPageLoadInfo(): PageLoadInfo | null {
    if (typeof window === 'undefined') return null;

    return {
      url: window.location.href,
      timestamp: Date.now(),
      webVitals: this.getMetrics(),
      navigationTiming: this.getNavigationTiming()!,
      resources: this.getResourceTimings(),
      userAgent: navigator.userAgent,
    };
  }

  /**
   * 保存指标
   */
  private saveMetrics(): void {
    const info = this.getPageLoadInfo();
    if (!info) return;

    try {
      // 保存到本地存储（用于分析）
      const history = JSON.parse(
        localStorage.getItem('cyberpress_performance_history') || '[]'
      );
      history.push(info);

      // 只保留最近 100 条记录
      if (history.length > 100) {
        history.shift();
      }

      localStorage.setItem('cyberpress_performance_history', JSON.stringify(history));

      // 发送到分析服务器
      this.sendToAnalytics(info);
    } catch (error) {
      console.error('Failed to save performance metrics:', error);
    }
  }

  /**
   * 发送到分析服务器
   */
  private sendToAnalytics(info: PageLoadInfo): void {
    if (typeof window === 'undefined') return;

    // 使用 sendBeacon 确保数据能够发送
    if (navigator.sendBeacon) {
      const data = new Blob([JSON.stringify(info)], {
        type: 'application/json',
      });
      navigator.sendBeacon('/api/analytics/performance', data);
    }
  }

  /**
   * 获取性能历史
   */
  getPerformanceHistory(): PageLoadInfo[] {
    if (typeof window === 'undefined') return [];

    try {
      const history = JSON.parse(
        localStorage.getItem('cyberpress_performance_history') || '[]'
      );
      return history;
    } catch {
      return [];
    }
  }

  /**
   * 清除性能历史
   */
  clearPerformanceHistory(): void {
    if (typeof window === 'undefined') return;

    localStorage.removeItem('cyberpress_performance_history');
  }

  /**
   * 获取性能报告
   */
  getPerformanceReport(): {
    average: {
      fcp: number;
      lcp: number;
      fid: number;
      cls: number;
      ttfb: number;
    };
    rating: {
      good: number;
      needsImprovement: number;
      poor: number;
    };
  } | null {
    const history = this.getPerformanceHistory();
    if (history.length === 0) return null;

    const total = history.length;
    let good = 0;
    let needsImprovement = 0;
    let poor = 0;

    let fcpSum = 0;
    let lcpSum = 0;
    let fidSum = 0;
    let clsSum = 0;
    let ttfbSum = 0;

    history.forEach((info) => {
      const vitals = info.webVitals;

      if (vitals.FCP) {
        fcpSum += vitals.FCP.value;
        if (vitals.FCP.rating === 'good') good++;
        else if (vitals.FCP.rating === 'needs-improvement') needsImprovement++;
        else poor++;
      }

      if (vitals.LCP) lcpSum += vitals.LCP.value;
      if (vitals.FID) fidSum += vitals.FID.value;
      if (vitals.CLS) clsSum += vitals.CLS.value;
      if (vitals.TTFB) ttfbSum += vitals.TTFB.value;
    });

    return {
      average: {
        fcp: Math.round(fcpSum / total),
        lcp: Math.round(lcpSum / total),
        fid: Math.round(fidSum / total),
        cls: Math.round((clsSum / total) * 1000) / 1000,
        ttfb: Math.round(ttfbSum / total),
      },
      rating: {
        good,
        needsImprovement,
        poor,
      },
    };
  }
}

// 导出单例实例
export const performanceMonitor = new PerformanceMonitor();
