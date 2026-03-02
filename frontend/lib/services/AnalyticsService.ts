/**
 * AnalyticsService
 * 分析服务 - 收集和分析用户行为数据
 */

export interface AnalyticsEvent {
  category: string;
  action: string;
  label?: string;
  value?: number;
  nonInteraction?: boolean;
}

export interface PageView {
  path: string;
  title: string;
  referrer?: string;
}

export interface UserProperties {
  userId?: string;
  email?: string;
  role?: string;
  customProperties?: Record<string, any>;
}

class AnalyticsService {
  private initialized: boolean = false;
  private queue: AnalyticsEvent[] = [];
  private readonly MAX_QUEUE_SIZE = 100;

  /**
   * 初始化分析服务
   */
  initialize(config?: { debug?: boolean; sampleRate?: number }): void {
    if (this.initialized) {
      console.warn('AnalyticsService already initialized');
      return;
    }

    // 这里可以集成第三方分析服务，如 Google Analytics
    // 目前使用简单的实现
    
    this.initialized = true;
    this.processQueue();

    if (config?.debug) {
      console.log('[Analytics] Service initialized');
    }
  }

  /**
   * 跟踪页面浏览
   */
  trackPageView(pageView: PageView): void {
    if (!this.initialized) {
      console.warn('[Analytics] Service not initialized');
      return;
    }

    const event: AnalyticsEvent = {
      category: 'pageview',
      action: 'view',
      label: pageView.path,
    };

    this.trackEvent(event);

    // 发送到分析服务器
    this.sendToServer({
      type: 'pageview',
      data: pageView,
      timestamp: Date.now(),
    });
  }

  /**
   * 跟踪自定义事件
   */
  trackEvent(event: AnalyticsEvent): void {
    if (!this.initialized) {
      this.queue.push(event);
      if (this.queue.length > this.MAX_QUEUE_SIZE) {
        this.queue.shift();
      }
      return;
    }

    // 发送到分析服务器
    this.sendToServer({
      type: 'event',
      data: event,
      timestamp: Date.now(),
    });
  }

  /**
   * 设置用户属性
   */
  setUserProperties(properties: UserProperties): void {
    if (!this.initialized) {
      console.warn('[Analytics] Service not initialized');
      return;
    }

    this.sendToServer({
      type: 'user',
      data: properties,
      timestamp: Date.now(),
    });
  }

  /**
   * 跟踪错误
   */
  trackError(error: Error, context?: Record<string, any>): void {
    this.trackEvent({
      category: 'error',
      action: error.name,
      label: error.message,
    });

    this.sendToServer({
      type: 'error',
      data: {
        name: error.name,
        message: error.message,
        stack: error.stack,
        context,
      },
      timestamp: Date.now(),
    });
  }

  /**
   * 跟踪性能指标
   */
  trackPerformance(metricName: string, value: number): void {
    this.trackEvent({
      category: 'performance',
      action: metricName,
      value,
    });
  }

  /**
   * 处理队列中的事件
   */
  private processQueue(): void {
    while (this.queue.length > 0) {
      const event = this.queue.shift();
      if (event) {
        this.trackEvent(event);
      }
    }
  }

  /**
   * 发送数据到服务器
   */
  private sendToServer(payload: any): void {
    // 这里实现实际的服务器调用
    // 可以使用 fetch 或其他 HTTP 客户端
    
    if (typeof window !== 'undefined' && process.env.NODE_ENV === 'development') {
      console.log('[Analytics]', payload);
    }

    // 示例实现：
    // fetch('/api/analytics', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify(payload),
    // }).catch((error) => {
    //   console.error('[Analytics] Failed to send data:', error);
    // });
  }
}

// 导出单例
export const analytics = new AnalyticsService();

// 便捷方法
export const trackPageView = (pageView: PageView) => analytics.trackPageView(pageView);
export const trackEvent = (event: AnalyticsEvent) => analytics.trackEvent(event);
export const trackError = (error: Error, context?: Record<string, any>) =>
  analytics.trackError(error, context);
export const trackPerformance = (metricName: string, value: number) =>
  analytics.trackPerformance(metricName, value);
