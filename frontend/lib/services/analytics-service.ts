/**
 * 分析服务
 * 提供用户行为分析和数据统计功能
 */

export interface AnalyticsEvent {
  /** 事件名称 */
  name: string;
  /** 事件属性 */
  properties?: Record<string, unknown>;
  /** 用户ID */
  userId?: string;
  /** 会话ID */
  sessionId?: string;
  /** 时间戳 */
  timestamp?: number;
  /** 页面URL */
  page?: string;
  /** 页面标题 */
  title?: string;
}

export interface PageView {
  /** 页面URL */
  page: string;
  /** 页面标题 */
  title: string;
  /** 来源页面 */
  referrer?: string;
  /** 时间戳 */
  timestamp: number;
  /** 在页面停留时间（毫秒） */
  duration?: number;
}

export interface PerformanceMetrics {
  /** 页面加载时间 */
  pageLoadTime?: number;
  /** DNS 查询时间 */
  dnsTime?: number;
  /** TCP 连接时间 */
  tcpTime?: number;
  /** 请求响应时间 */
  requestTime?: number;
  /** DOM 解析时间 */
  domParseTime?: number;
  /** 首次内容绘制时间 */
  firstPaint?: number;
  /** 首次有意义绘制时间 */
  firstContentfulPaint?: number;
  /** 最大内容绘制时间 */
  largestContentfulPaint?: number;
  /** 首次输入延迟 */
  firstInputDelay?: number;
  /** 累积布局偏移 */
  cumulativeLayoutShift?: number;
  /** 首次字节时间 (TTFB) */
  timeToFirstByte?: number;
}

class AnalyticsService {
  private events: AnalyticsEvent[] = [];
  private pageViews: PageView[] = [];
  private sessionId: string;
  private userId: string | null = null;
  private currentPageView: PageView | null = null;
  private isInitialized = false;

  constructor() {
    this.sessionId = this.generateSessionId();
  }

  /**
   * 初始化分析服务
   */
  initialize(config?: {
    userId?: string;
    autoTrackPageViews?: boolean;
    autoTrackPerformance?: boolean;
  }): void {
    if (this.isInitialized) return;

    this.userId = config?.userId || null;

    if (config?.autoTrackPageViews !== false) {
      this.trackPageViews();
    }

    if (config?.autoTrackPerformance !== false) {
      this.trackPerformance();
    }

    this.isInitialized = true;
  }

  /**
   * 生成会话ID
   */
  private generateSessionId(): string {
    return `session-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * 追踪事件
   */
  track(event: string | AnalyticsEvent, properties?: Record<string, unknown>): void {
    const analyticsEvent: AnalyticsEvent = typeof event === 'string'
      ? {
          name: event,
          properties,
          timestamp: Date.now(),
          page: typeof window !== 'undefined' ? window.location.pathname : undefined,
          title: typeof window !== 'undefined' ? document.title : undefined,
        }
      : {
          ...event,
          timestamp: event.timestamp || Date.now(),
        };

    analyticsEvent.sessionId = this.sessionId;
    if (this.userId) {
      analyticsEvent.userId = this.userId;
    }

    this.events.push(analyticsEvent);

    // 发送到分析平台（这里可以集成第三方服务）
    this.sendToAnalytics(analyticsEvent);
  }

  /**
   * 追踪页面浏览
   */
  trackPageView(page?: string, title?: string): void {
    const pageView: PageView = {
      page: page || (typeof window !== 'undefined' ? window.location.pathname : ''),
      title: title || (typeof window !== 'undefined' ? document.title : ''),
      referrer: typeof window !== 'undefined' ? document.referrer : undefined,
      timestamp: Date.now(),
    };

    // 结束上一个页面浏览
    if (this.currentPageView) {
      this.currentPageView.duration = Date.now() - this.currentPageView.timestamp;
    }

    this.currentPageView = pageView;
    this.pageViews.push(pageView);

    this.track('page_view', {
      page: pageView.page,
      title: pageView.title,
      referrer: pageView.referrer,
    });
  }

  /**
   * 自动追踪页面浏览
   */
  private trackPageViews(): void {
    if (typeof window === 'undefined') return;

    // 初始页面浏览
    this.trackPageView();

    // 监听路由变化（需要配合路由库）
    // 这里需要根据使用的路由库进行适配
  }

  /**
   * 追踪性能指标
   */
  private trackPerformance(): void {
    if (typeof window === 'undefined') return;

    // 等待页面加载完成
    if (document.readyState === 'complete') {
      this.collectPerformanceMetrics();
    } else {
      window.addEventListener('load', () => {
        setTimeout(() => this.collectPerformanceMetrics(), 0);
      });
    }

    // 使用 PerformanceObserver 追踪 Web Vitals
    if ('PerformanceObserver' in window) {
      try {
        const observer = new PerformanceObserver((list) => {
          for (const entry of list.getEntries()) {
            if (entry.entryType === 'largest-contentful-paint') {
              this.track('performance', {
                metric: 'largestContentfulPaint',
                value: (entry as any).startTime,
              });
            } else if (entry.entryType === 'first-input') {
              this.track('performance', {
                metric: 'firstInputDelay',
                value: (entry as any).processingStart - (entry as any).startTime,
              });
            } else if (entry.entryType === 'layout-shift' && !(entry as any).hadInput) {
              this.track('performance', {
                metric: 'cumulativeLayoutShift',
                value: (entry as any).value,
              });
            }
          }
        });

        observer.observe({
          entryTypes: ['largest-contentful-paint', 'first-input', 'layout-shift'],
        });
      } catch (e) {
        console.warn('PerformanceObserver not fully supported:', e);
      }
    }
  }

  /**
   * 收集性能指标
   */
  private collectPerformanceMetrics(): void {
    if (!window.performance || !window.performance.timing) {
      return;
    }

    const timing = window.performance.timing;
    const navigation = window.performance.navigation;

    const metrics: PerformanceMetrics = {
      pageLoadTime: timing.loadEventEnd - timing.navigationStart,
      dnsTime: timing.domainLookupEnd - timing.domainLookupStart,
      tcpTime: timing.connectEnd - timing.connectStart,
      requestTime: timing.responseEnd - timing.requestStart,
      domParseTime: timing.domComplete - timing.domLoading,
      firstPaint: this.getMetric('first-paint'),
      firstContentfulPaint: this.getMetric('first-contentful-paint'),
      timeToFirstByte: timing.responseStart - timing.navigationStart,
    };

    this.track('performance', metrics);
  }

  /**
   * 获取特定指标
   */
  private getMetric(name: string): number | undefined {
    const entries = performance.getEntriesByName(name);
    if (entries.length > 0) {
      return entries[0].startTime;
    }
    return undefined;
  }

  /**
   * 追踪用户行为
   */
  trackUserAction(action: string, details?: Record<string, unknown>): void {
    this.track('user_action', {
      action,
      ...details,
    });
  }

  /**
   * 追踪点击事件
   */
  trackClick(element: string, details?: Record<string, unknown>): void {
    this.trackUserAction('click', {
      element,
      ...details,
    });
  }

  /**
   * 追踪表单提交
   */
  trackFormSubmit(formId: string, details?: Record<string, unknown>): void {
    this.track('form_submit', {
      formId,
      ...details,
    });
  }

  /**
   * 追踪错误
   */
  trackError(error: Error | string, context?: Record<string, unknown>): void {
    this.track('error', {
      error: typeof error === 'string' ? error : error.message,
      stack: typeof error === 'string' ? undefined : error.stack,
      ...context,
    });
  }

  /**
   * 设置用户ID
   */
  setUserId(userId: string): void {
    this.userId = userId;
  }

  /**
   * 设置用户属性
   */
  setUserProperties(properties: Record<string, unknown>): void {
    this.track('user_properties_set', properties);
  }

  /**
   * 发送数据到分析平台
   */
  private sendToAnalytics(event: AnalyticsEvent): void {
    // 这里可以集成第三方分析服务
    // 例如：Google Analytics, Mixpanel, Amplitude 等

    // 示例：发送到自定义端点
    if (typeof window !== 'undefined' && typeof fetch !== 'undefined') {
      fetch('/api/analytics', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(event),
      }).catch(err => {
        console.warn('Failed to send analytics:', err);
      });
    }
  }

  /**
   * 获取所有事件
   */
  getEvents(): AnalyticsEvent[] {
    return [...this.events];
  }

  /**
   * 获取所有页面浏览
   */
  getPageViews(): PageView[] {
    return [...this.pageViews];
  }

  /**
   * 获取事件统计
   */
  getEventStats(): {
    totalEvents: number;
    eventsByName: Record<string, number>;
    uniquePages: number;
  } {
    const eventsByName: Record<string, number> = {};
    const uniquePages = new Set<string>();

    this.events.forEach(event => {
      eventsByName[event.name] = (eventsByName[event.name] || 0) + 1;
      if (event.page) {
        uniquePages.add(event.page);
      }
    });

    return {
      totalEvents: this.events.length,
      eventsByName,
      uniquePages: uniquePages.size,
    };
  }

  /**
   * 清除所有数据
   */
  clear(): void {
    this.events = [];
    this.pageViews = [];
    this.currentPageView = null;
  }

  /**
   * 导出数据
   */
  export(): {
    events: AnalyticsEvent[];
    pageViews: PageView[];
    sessionId: string;
    userId: string | null;
  } {
    return {
      events: [...this.events],
      pageViews: [...this.pageViews],
      sessionId: this.sessionId,
      userId: this.userId,
    };
  }
}

// 创建单例
const analyticsService = new AnalyticsService();

// 导出单例和类
export { AnalyticsService };
export default analyticsService;
