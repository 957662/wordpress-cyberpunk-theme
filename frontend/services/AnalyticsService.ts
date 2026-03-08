/**
 * CyberPress Analytics Service
 * 数据分析服务
 */

interface AnalyticsEvent {
  category: string;
  action: string;
  label?: string;
  value?: number;
  properties?: Record<string, any>;
}

interface PageView {
  path: string;
  title: string;
  referrer?: string;
  properties?: Record<string, any>;
}

interface UserMetrics {
  sessionId: string;
  userId?: string;
  timestamp: number;
  deviceInfo: DeviceInfo;
}

interface DeviceInfo {
  userAgent: string;
  screen: {
    width: number;
    height: number;
  };
  viewport: {
    width: number;
    height: number;
  };
  language: string;
  platform: string;
}

class AnalyticsService {
  private sessionId: string;
  private userId?: string;
  private isInitialized: boolean = false;
  private queue: AnalyticsEvent[] = [];
  private flushInterval: number = 5000; // 5秒
  private maxQueueSize: number = 10;
  private flushTimer?: NodeJS.Timeout;

  constructor() {
    this.sessionId = this.generateSessionId();
  }

  /**
   * 初始化分析服务
   */
  initialize(config: { userId?: string; autoFlush?: boolean }): void {
    if (this.isInitialized) return;

    this.userId = config.userId;
    this.isInitialized = true;

    // 自动刷新队列
    if (config.autoFlush !== false) {
      this.startAutoFlush();
    }

    // 页面卸载时发送剩余事件
    if (typeof window !== 'undefined') {
      window.addEventListener('beforeunload', () => {
        this.flush();
      });
    }

    // 页面可见性变化时刷新
    if (typeof document !== 'undefined') {
      document.addEventListener('visibilitychange', () => {
        if (document.hidden) {
          this.flush();
        }
      });
    }

    console.log('[Analytics] Initialized', {
      sessionId: this.sessionId,
      userId: this.userId,
    });
  }

  /**
   * 生成会话 ID
   */
  private generateSessionId(): string {
    return `session_${Date.now()}_${Math.random().toString(36).substring(2, 15)}`;
  }

  /**
   * 获取设备信息
   */
  private getDeviceInfo(): DeviceInfo {
    if (typeof window === 'undefined') {
      return {
        userAgent: '',
        screen: { width: 0, height: 0 },
        viewport: { width: 0, height: 0 },
        language: '',
        platform: '',
      };
    }

    return {
      userAgent: navigator.userAgent,
      screen: {
        width: window.screen.width,
        height: window.screen.height,
      },
      viewport: {
        width: window.innerWidth,
        height: window.innerHeight,
      },
      language: navigator.language,
      platform: navigator.platform,
    };
  }

  /**
   * 获取用户指标
   */
  private getUserMetrics(): UserMetrics {
    return {
      sessionId: this.sessionId,
      userId: this.userId,
      timestamp: Date.now(),
      deviceInfo: this.getDeviceInfo(),
    };
  }

  /**
   * 开始自动刷新队列
   */
  private startAutoFlush(): void {
    this.flushTimer = setInterval(() => {
      this.flush();
    }, this.flushInterval) as unknown as NodeJS.Timeout;
  }

  /**
   * 停止自动刷新
   */
  private stopAutoFlush(): void {
    if (this.flushTimer) {
      clearInterval(this.flushTimer);
      this.flushTimer = undefined;
    }
  }

  /**
   * 追踪事件
   */
  track(event: AnalyticsEvent): void {
    if (!this.isInitialized) {
      console.warn('[Analytics] Service not initialized');
      return;
    }

    const enrichedEvent: AnalyticsEvent = {
      ...event,
      properties: {
        ...event.properties,
        ...this.getUserMetrics(),
      },
    };

    this.queue.push(enrichedEvent);

    // 如果队列达到最大大小，立即刷新
    if (this.queue.length >= this.maxQueueSize) {
      this.flush();
    }

    console.log('[Analytics] Event tracked', enrichedEvent);
  }

  /**
   * 追踪页面浏览
   */
  trackPageView(pageView: PageView): void {
    this.track({
      category: 'page_view',
      action: 'view',
      label: pageView.path,
      properties: {
        ...pageView,
      },
    });

    // 更新页面标题
    if (typeof document !== 'undefined') {
      document.title = pageView.title;
    }
  }

  /**
   * 追踪用户行为
   */
  trackUserAction(category: string, action: string, label?: string, value?: number): void {
    this.track({
      category,
      action,
      label,
      value,
    });
  }

  /**
   * 追踪点击事件
   */
  trackClick(element: string, label?: string): void {
    this.trackUserAction('click', element, label);
  }

  /**
   * 追踪表单提交
   */
  trackFormSubmit(formName: string, success: boolean): void {
    this.trackUserAction('form_submit', formName, success ? 'success' : 'failed');
  }

  /**
   * 追踪搜索
   */
  trackSearch(query: string, resultsCount: number): void {
    this.track({
      category: 'search',
      action: 'query',
      label: query,
      value: resultsCount,
      properties: {
        queryLength: query.length,
        resultsCount,
      },
    });
  }

  /**
   * 追踪内容浏览
   */
  trackContentView(contentType: string, contentId: string, title?: string): void {
    this.track({
      category: 'content',
      action: 'view',
      label: contentId,
      properties: {
        contentType,
        title,
      },
    });
  }

  /**
   * 追踪下载
   */
  trackDownload(fileName: string, fileSize?: number): void {
    this.track({
      category: 'download',
      action: 'file',
      label: fileName,
      value: fileSize,
      properties: {
        fileSize,
        fileExtension: fileName.split('.').pop(),
      },
    });
  }

  /**
   * 追踪分享
   */
  trackShare(platform: string, contentType: string, contentId: string): void {
    this.track({
      category: 'social',
      action: 'share',
      label: platform,
      properties: {
        contentType,
        contentId,
      },
    });
  }

  /**
   * 追踪错误
   */
  trackError(error: Error, context?: Record<string, any>): void {
    this.track({
      category: 'error',
      action: error.name,
      label: error.message,
      properties: {
        ...context,
        stack: error.stack,
      },
    });
  }

  /**
   * 追踪性能指标
   */
  trackPerformance(metricName: string, value: number, unit: string = 'ms'): void {
    this.track({
      category: 'performance',
      action: metricName,
      value,
      properties: {
        unit,
      },
    });
  }

  /**
   * 刷新队列（发送事件）
   */
  private async flush(): Promise<void> {
    if (this.queue.length === 0) return;

    const events = [...this.queue];
    this.queue = [];

    try {
      // 这里应该调用实际的 API 发送事件
      // 例如: await fetch('/api/analytics/events', { method: 'POST', body: JSON.stringify(events) });

      console.log('[Analytics] Flushing events', events.length);

      // 模拟 API 调用
      await this.sendEvents(events);
    } catch (error) {
      console.error('[Analytics] Failed to flush events', error);
      // 如果发送失败，将事件重新加入队列
      this.queue.unshift(...events);
    }
  }

  /**
   * 发送事件到服务器
   */
  private async sendEvents(events: AnalyticsEvent[]): Promise<void> {
    // 实际实现中，这里应该调用你的分析 API
    // 这里只是一个示例实现
    if (typeof window === 'undefined') return;

    // 示例：发送到 Google Analytics
    if ((window as any).gtag) {
      events.forEach((event) => {
        (window as any).gtag('event', event.action, {
          event_category: event.category,
          event_label: event.label,
          value: event.value,
        });
      });
    }

    // 或者发送到你的自定义分析端点
    // await fetch('/api/analytics', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify(events),
    // });
  }

  /**
   * 设置用户 ID
   */
  setUserId(userId: string): void {
    this.userId = userId;
    console.log('[Analytics] User ID set', userId);
  }

  /**
   * 清除用户 ID
   */
  clearUserId(): void {
    this.userId = undefined;
    console.log('[Analytics] User ID cleared');
  }

  /**
   * 销毁服务
   */
  destroy(): void {
    this.stopAutoFlush();
    this.flush();
    this.isInitialized = false;
    console.log('[Analytics] Service destroyed');
  }
}

// 创建单例实例
const analyticsService = new AnalyticsService();

// 初始化
if (typeof window !== 'undefined') {
  analyticsService.initialize({
    autoFlush: true,
  });
}

export default analyticsService;

/**
 * React Hook: useAnalytics
 */
export function useAnalytics() {
  return {
    track: (event: AnalyticsEvent) => analyticsService.track(event),
    trackPageView: (pageView: PageView) => analyticsService.trackPageView(pageView),
    trackUserAction: (category: string, action: string, label?: string, value?: number) =>
      analyticsService.trackUserAction(category, action, label, value),
    trackClick: (element: string, label?: string) => analyticsService.trackClick(element, label),
    trackFormSubmit: (formName: string, success: boolean) =>
      analyticsService.trackFormSubmit(formName, success),
    trackSearch: (query: string, resultsCount: number) =>
      analyticsService.trackSearch(query, resultsCount),
    trackContentView: (contentType: string, contentId: string, title?: string) =>
      analyticsService.trackContentView(contentType, contentId, title),
    trackDownload: (fileName: string, fileSize?: number) =>
      analyticsService.trackDownload(fileName, fileSize),
    trackShare: (platform: string, contentType: string, contentId: string) =>
      analyticsService.trackShare(platform, contentType, contentId),
    trackError: (error: Error, context?: Record<string, any>) =>
      analyticsService.trackError(error, context),
    trackPerformance: (metricName: string, value: number, unit?: string) =>
      analyticsService.trackPerformance(metricName, value, unit),
    setUserId: (userId: string) => analyticsService.setUserId(userId),
    clearUserId: () => analyticsService.clearUserId(),
  };
}

/**
 * 高阶组件：withPageTracking
 */
export function withPageTracking<P extends object>(
  WrappedComponent: React.ComponentType<P>,
  pageTitle?: string
) {
  return (props: P) => {
    useEffect(() => {
      if (typeof window !== 'undefined') {
        analyticsService.trackPageView({
          path: window.location.pathname,
          title: pageTitle || document.title,
          referrer: document.referrer,
        });
      }
    }, []);

    return <WrappedComponent {...props} />;
  };
}
