/**
 * WordPress Analytics
 * 分析和数据统计服务
 */

interface PageViewEvent {
  path: string;
  title: string;
  referrer?: string;
  userId?: string;
  sessionId: string;
}

interface EventData {
  category: string;
  action: string;
  label?: string;
  value?: number;
}

class Analytics {
  private sessionId: string;
  private userId: string | null = null;
  private queue: Array<{
    type: 'pageview' | 'event';
    data: PageViewEvent | EventData;
    timestamp: number;
  }> = [];
  private isInitialized = false;

  constructor() {
    this.sessionId = this.generateSessionId();
  }

  private generateSessionId(): string {
    return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  init(userId?: string) {
    if (this.isInitialized) return;

    this.userId = userId || null;
    this.isInitialized = true;

    // 页面加载时发送初始页面浏览
    if (typeof window !== 'undefined') {
      this.trackPageView(window.location.pathname, document.title);

      // 监听路由变化
      this.setupRouteTracking();
    }

    // 定期发送队列中的事件
    setInterval(() => this.flushQueue(), 30000); // 每30秒
  }

  private setupRouteTracking() {
    // 监听 popstate 事件（浏览器后退/前进）
    window.addEventListener('popstate', () => {
      this.trackPageView(window.location.pathname, document.title);
    });

    // 拦截 pushState 和 replaceState
    const originalPushState = history.pushState;
    const originalReplaceState = history.replaceState;

    history.pushState = (...args) => {
      originalPushState.apply(history, args);
      this.trackPageView(window.location.pathname, document.title);
    };

    history.replaceState = (...args) => {
      originalReplaceState.apply(history, args);
      this.trackPageView(window.location.pathname, document.title);
    };
  }

  trackPageView(path: string, title: string, referrer?: string) {
    const event: PageViewEvent = {
      path,
      title,
      referrer,
      sessionId: this.sessionId,
      ...(this.userId && { userId: this.userId }),
    };

    this.queue.push({
      type: 'pageview',
      data: event,
      timestamp: Date.now(),
    });

    // 立即发送页面浏览事件
    this.flushQueue();
  }

  trackEvent(category: string, action: string, label?: string, value?: number) {
    const event: EventData = {
      category,
      action,
      label,
      value,
    };

    this.queue.push({
      type: 'event',
      data: event,
      timestamp: Date.now(),
    });
  }

  private async flushQueue() {
    if (this.queue.length === 0) return;

    const eventsToSend = [...this.queue];
    this.queue = [];

    try {
      await fetch('/api/analytics', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          events: eventsToSend,
          sessionId: this.sessionId,
          userId: this.userId,
        }),
      });
    } catch (error) {
      console.error('Failed to send analytics events:', error);
      // 失败时将事件放回队列
      this.queue.unshift(...eventsToSend);
    }
  }

  // 设置用户ID
  setUserId(userId: string) {
    this.userId = userId;
  }

  // 清除用户ID
  clearUserId() {
    this.userId = null;
  }
}

// 导出单例
export const analytics = new Analytics();

// React Hook
export function useAnalytics() {
  return {
    trackPageView: analytics.trackPageView.bind(analytics),
    trackEvent: analytics.trackEvent.bind(analytics),
    setUserId: analytics.setUserId.bind(analytics),
    clearUserId: analytics.clearUserId.bind(analytics),
  };
}
