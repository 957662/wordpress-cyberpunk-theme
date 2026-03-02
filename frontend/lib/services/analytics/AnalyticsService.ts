/**
 * 分析服务 - 用于追踪用户行为和应用指标
 */

export interface AnalyticsEvent {
  name: string;
  properties?: Record<string, any>;
  timestamp?: number;
  userId?: string;
  sessionId?: string;
}

export interface PageView {
  path: string;
  title: string;
  referrer?: string;
  duration?: number;
  timestamp: number;
}

export interface PerformanceMetrics {
  pageLoadTime: number;
  firstContentfulPaint?: number;
  largestContentfulPaint?: number;
  cumulativeLayoutShift?: number;
  firstInputDelay?: number;
  timeToInteractive?: number;
}

/**
 * 分析服务类
 */
class AnalyticsService {
  private static instance: AnalyticsService;
  private sessionId: string;
  private userId: string | null = null;
  private events: AnalyticsEvent[] = [];
  private pageViews: PageView[] = [];
  private isInitialized = false;
  private batchSize = 10;
  private flushInterval = 30000; // 30 seconds

  private constructor() {
    this.sessionId = this.generateSessionId();
    this.initializePerformanceObserver();
  }

  static getInstance(): AnalyticsService {
    if (!AnalyticsService.instance) {
      AnalyticsService.instance = new AnalyticsService();
    }
    return AnalyticsService.instance;
  }

  /**
   * 初始化分析服务
   */
  initialize(config: { userId?: string; apiKey?: string }) {
    if (this.isInitialized) return;

    this.userId = config.userId || null;
    this.isInitialized = true;

    // 设置定时刷新
    if (typeof window !== 'undefined') {
      setInterval(() => this.flush(), this.flushInterval);

      // 页面卸载时刷新
      window.addEventListener('beforeunload', () => this.flush());
    }

    // 追踪首次页面访问
    this.trackPageView({
      path: window.location.pathname,
      title: document.title,
      referrer: document.referrer,
    });
  }

  /**
   * 追踪事件
   */
  track(event: Omit<AnalyticsEvent, 'timestamp' | 'userId' | 'sessionId'>) {
    const analyticsEvent: AnalyticsEvent = {
      ...event,
      timestamp: Date.now(),
      userId: this.userId || undefined,
      sessionId: this.sessionId,
    };

    this.events.push(analyticsEvent);

    // 如果达到批量大小，则刷新
    if (this.events.length >= this.batchSize) {
      this.flush();
    }
  }

  /**
   * 追踪页面访问
   */
  trackPageView(pageView: Omit<PageView, 'timestamp'>) {
    const view: PageView = {
      ...pageView,
      timestamp: Date.now(),
    };

    this.pageViews.push(view);

    this.track({
      name: 'page_view',
      properties: {
        path: pageView.path,
        title: pageView.title,
        referrer: pageView.referrer,
      },
    });
  }

  /**
   * 追踪用户交互
   */
  trackInteraction(element: string, action: string, properties?: Record<string, any>) {
    this.track({
      name: 'user_interaction',
      properties: {
        element,
        action,
        ...properties,
      },
    });
  }

  /**
   * 追踪自定义事件
   */
  trackCustom(eventName: string, properties?: Record<string, any>) {
    this.track({
      name: eventName,
      properties,
    });
  }

  /**
   * 追踪错误
   */
  trackError(error: Error, context?: Record<string, any>) {
    this.track({
      name: 'error',
      properties: {
        message: error.message,
        stack: error.stack,
        ...context,
      },
    });
  }

  /**
   * 追踪性能指标
   */
  trackPerformance(metrics: PerformanceMetrics) {
    this.track({
      name: 'performance',
      properties: metrics,
    });
  }

  /**
   * 设置用户ID
   */
  setUserId(userId: string) {
    this.userId = userId;
  }

  /**
   * 清除用户ID
   */
  clearUserId() {
    this.userId = null;
  }

  /**
   * 刷新数据到服务器
   */
  private async flush() {
    if (this.events.length === 0 && this.pageViews.length === 0) {
      return;
    }

    const payload = {
      events: this.events,
      pageViews: this.pageViews,
      sessionId: this.sessionId,
      userId: this.userId,
      timestamp: Date.now(),
    };

    // 清空本地缓存
    this.events = [];
    this.pageViews = [];

    // 发送到服务器（这里需要根据实际API实现）
    try {
      if (typeof window !== 'undefined' && window.navigator.sendBeacon) {
        const blob = new Blob([JSON.stringify(payload)], { type: 'application/json' });
        window.navigator.sendBeacon('/api/analytics', blob);
      }
    } catch (error) {
      console.error('Failed to send analytics:', error);
      // 失败时重新加入队列
      this.events.push(...payload.events);
      this.pageViews.push(...payload.pageViews);
    }
  }

  /**
   * 生成会话ID
   */
  private generateSessionId(): string {
    return `session_${Date.now()}_${Math.random().toString(36).substring(2, 15)}`;
  }

  /**
   * 初始化性能观察器
   */
  private initializePerformanceObserver() {
    if (typeof window === 'undefined' || !('PerformanceObserver' in window)) {
      return;
    }

    try {
      const observer = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          if (entry.entryType === 'navigation') {
            const navEntry = entry as PerformanceNavigationTiming;
            this.trackPerformance({
              pageLoadTime: navEntry.loadEventEnd - navEntry.fetchStart,
              domContentLoaded: navEntry.domContentLoadedEventEnd - navEntry.fetchStart,
              firstPaint: navEntry.responseStart - navEntry.fetchStart,
            });
          } else if (entry.entryType === 'paint') {
            // Paint timing
          } else if (entry.entryType === 'largest-contentful-paint') {
            this.trackPerformance({
              largestContentfulPaint: entry.startTime,
            });
          } else if (entry.entryType === 'layout-shift') {
            const clsEntry = entry as any;
            if (!clsEntry.hadRecentInput) {
              this.trackPerformance({
                cumulativeLayoutShift: clsEntry.value,
              });
            }
          }
        }
      });

      observer.observe({
        entryTypes: ['navigation', 'paint', 'largest-contentful-paint', 'layout-shift'],
      });
    } catch (error) {
      console.error('Performance Observer error:', error);
    }
  }

  /**
   * 获取当前会话统计
   */
  getSessionStats() {
    return {
      sessionId: this.sessionId,
      eventCount: this.events.length,
      pageViewCount: this.pageViews.length,
      startTime: parseInt(this.sessionId.split('_')[1]),
    };
  }
}

// 导出单例实例
export const analytics = AnalyticsService.getInstance();

// 导出便捷Hook
export function useAnalytics() {
  return {
    track: analytics.track.bind(analytics),
    trackPageView: analytics.trackPageView.bind(analytics),
    trackInteraction: analytics.trackInteraction.bind(analytics),
    trackCustom: analytics.trackCustom.bind(analytics),
    trackError: analytics.trackError.bind(analytics),
    trackPerformance: analytics.trackPerformance.bind(analytics),
    setUserId: analytics.setUserId.bind(analytics),
    clearUserId: analytics.clearUserId.bind(analytics),
    getSessionStats: analytics.getSessionStats.bind(analytics),
  };
}
