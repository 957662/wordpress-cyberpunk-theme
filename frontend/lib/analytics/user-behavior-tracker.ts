/**
 * 用户行为追踪系统
 * CyberPress Platform
 *
 * 自动追踪和记录用户在网站上的行为,用于数据分析和用户体验优化
 */

export interface BehaviorEvent {
  id: string;
  type: BehaviorEventType;
  category: string;
  action: string;
  label?: string;
  value?: number;
  timestamp: number;
  page: string;
  userId?: string;
  sessionId: string;
  metadata?: Record<string, any>;
}

export type BehaviorEventType =
  | 'page_view'
  | 'click'
  | 'scroll'
  | 'form_submit'
  | 'search'
  | 'download'
  | 'share'
  | 'comment'
  | 'like'
  | 'bookmark'
  | 'error'
  | 'custom';

export interface BehaviorOptions {
  autoTrack?: boolean;
  trackClicks?: boolean;
  trackScroll?: boolean;
  trackForms?: boolean;
  trackErrors?: boolean;
  sampleRate?: number;
  batchSize?: number;
  flushInterval?: number;
  endpoint?: string;
}

class UserBehaviorTracker {
  private events: BehaviorEvent[] = [];
  private sessionId: string;
  private options: Required<BehaviorOptions>;
  private isInitialized: boolean = false;
  private flushTimer?: NodeJS.Timeout;

  constructor(options: BehaviorOptions = {}) {
    this.sessionId = this.generateSessionId();
    this.options = {
      autoTrack: true,
      trackClicks: true,
      trackScroll: true,
      trackForms: true,
      trackErrors: true,
      sampleRate: 1,
      batchSize: 10,
      flushInterval: 30000,
      endpoint: '/api/analytics/events',
      ...options,
    };
  }

  /**
   * 初始化追踪器
   */
  init() {
    if (this.isInitialized) return;

    if (this.options.autoTrack) {
      this.setupAutoTracking();
    }

    this.startFlushTimer();
    this.isInitialized = true;

    // 追踪会话开始
    this.track('page_view', 'session', 'start', undefined, undefined, {
      referrer: document.referrer,
      userAgent: navigator.userAgent,
      screen: `${screen.width}x${screen.height}`,
    });
  }

  /**
   * 追踪事件
   */
  track(
    action: string,
    category: string = 'general',
    label?: string,
    value?: number,
    type: BehaviorEventType = 'custom',
    metadata?: Record<string, any>
  ) {
    // 采样
    if (Math.random() > this.options.sampleRate) {
      return;
    }

    const event: BehaviorEvent = {
      id: this.generateEventId(),
      type,
      category,
      action,
      label,
      value,
      timestamp: Date.now(),
      page: window.location.pathname,
      sessionId: this.sessionId,
      metadata,
    };

    this.events.push(event);

    // 批量发送
    if (this.events.length >= this.options.batchSize) {
      this.flush();
    }
  }

  /**
   * 追踪页面浏览
   */
  trackPageView(page?: string, title?: string) {
    this.track('page_view', 'navigation', page || window.location.pathname, undefined, 'page_view', {
      title: title || document.title,
      url: window.location.href,
    });
  }

  /**
   * 追踪点击事件
   */
  trackClick(element: HTMLElement, label?: string) {
    const selector = this.getSelector(element);
    this.track('click', 'interaction', label || selector, undefined, 'click', {
      selector,
      text: element.textContent?.trim().substring(0, 50),
      tagName: element.tagName,
    });
  }

  /**
   * 追踪滚动事件
   */
  trackScroll(depth: number) {
    this.track('scroll', 'engagement', `${depth}%`, depth, 'scroll', {
      scrollDepth: depth,
      scrollHeight: document.documentElement.scrollHeight,
      viewportHeight: window.innerHeight,
    });
  }

  /**
   * 追踪表单提交
   */
  trackFormSubmit(formId: string, formData: Record<string, any>) {
    this.track('form_submit', 'form', formId, undefined, 'form_submit', {
      formData: this.sanitizeFormData(formData),
    });
  }

  /**
   * 追踪搜索
   */
  trackSearch(query: string, resultsCount?: number) {
    this.track('search', 'search', query, resultsCount, 'search', {
      query,
      resultsCount,
    });
  }

  /**
   * 追踪下载
   */
  trackDownload(url: string, filename?: string) {
    this.track('download', 'content', filename || url, undefined, 'download', {
      url,
      filename,
    });
  }

  /**
   * 追踪分享
   */
  trackShare(platform: string, url?: string) {
    this.track('share', 'social', platform, undefined, 'share', {
      platform,
      url: url || window.location.href,
    });
  }

  /**
   * 追踪评论
   */
  trackComment(contentId: string, commentLength: number) {
    this.track('comment', 'engagement', contentId, commentLength, 'comment', {
      contentId,
      commentLength,
    });
  }

  /**
   * 追踪点赞
   */
  trackLike(contentId: string) {
    this.track('like', 'engagement', contentId, undefined, 'like', {
      contentId,
    });
  }

  /**
   * 追踪收藏
   */
  trackBookmark(contentId: string) {
    this.track('bookmark', 'engagement', contentId, undefined, 'bookmark', {
      contentId,
    });
  }

  /**
   * 追踪错误
   */
  trackError(error: Error, context?: Record<string, any>) {
    this.track('error', 'system', error.name, undefined, 'error', {
      message: error.message,
      stack: error.stack,
      ...context,
    });
  }

  /**
   * 设置自动追踪
   */
  private setupAutoTracking() {
    // 追踪点击
    if (this.options.trackClicks) {
      document.addEventListener('click', (e) => {
        const target = e.target as HTMLElement;
        if (target.tagName === 'A' || target.tagName === 'BUTTON' || target.onclick) {
          this.trackClick(target);
        }
      }, true);
    }

    // 追踪滚动
    if (this.options.trackScroll) {
      let maxScrollDepth = 0;
      const scrollDepths = [25, 50, 75, 90, 100];

      window.addEventListener('scroll', () => {
        const scrollDepth = Math.round(
          (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100
        );

        if (scrollDepth > maxScrollDepth) {
          maxScrollDepth = scrollDepth;

          scrollDepths.forEach((depth) => {
            if (scrollDepth >= depth && !this.hasTrackedScroll(depth)) {
              this.trackScroll(depth);
              this.markScrollAsTracked(depth);
            }
          });
        }
      });
    }

    // 追踪表单提交
    if (this.options.trackForms) {
      document.addEventListener('submit', (e) => {
        const form = e.target as HTMLFormElement;
        const formData = new FormData(form);
        const data: Record<string, any> = {};
        formData.forEach((value, key) => {
          data[key] = value;
        });

        this.trackFormSubmit(form.id || form.name || 'unknown', data);
      }, true);
    }

    // 追踪错误
    if (this.options.trackErrors) {
      window.addEventListener('error', (e) => {
        this.trackError(new Error(e.message), {
          filename: e.filename,
          lineno: e.lineno,
          colno: e.colno,
        });
      });

      window.addEventListener('unhandledrejection', (e) => {
        this.trackError(new Error(String(e.reason)), {
          type: 'unhandledrejection',
        });
      });
    }
  }

  /**
   * 发送事件到服务器
   */
  private async flush() {
    if (this.events.length === 0) return;

    const eventsToSend = [...this.events];
    this.events = [];

    try {
      await fetch(this.options.endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ events: eventsToSend }),
      });
    } catch (error) {
      console.error('Failed to send analytics events:', error);
      // 失败时重新加入队列
      this.events.unshift(...eventsToSend);
    }
  }

  /**
   * 启动定时发送
   */
  private startFlushTimer() {
    this.flushTimer = setInterval(() => {
      this.flush();
    }, this.options.flushInterval);
  }

  /**
   * 停止定时发送
   */
  private stopFlushTimer() {
    if (this.flushTimer) {
      clearInterval(this.flushTimer);
      this.flushTimer = undefined;
    }
  }

  /**
   * 生成会话ID
   */
  private generateSessionId(): string {
    return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * 生成事件ID
   */
  private generateEventId(): string {
    return `event_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * 获取元素选择器
   */
  private getSelector(element: HTMLElement): string {
    if (element.id) {
      return `#${element.id}`;
    }

    if (element.className) {
      const classes = element.className.split(' ').filter((c) => c).join('.');
      if (classes) {
        return `${element.tagName.toLowerCase()}.${classes}`;
      }
    }

    return element.tagName.toLowerCase();
  }

  /**
   * 清理表单数据
   */
  private sanitizeFormData(formData: Record<string, any>): Record<string, any> {
    const sanitized = { ...formData };
    const sensitiveKeys = ['password', 'token', 'secret', 'credit', 'ssn'];

    Object.keys(sanitized).forEach((key) => {
      if (sensitiveKeys.some((sensitive) => key.toLowerCase().includes(sensitive))) {
        sanitized[key] = '[REDACTED]';
      }
    });

    return sanitized;
  }

  /**
   * 检查是否已追踪滚动深度
   */
  private hasTrackedScroll(depth: number): boolean {
    const key = `scroll_tracked_${depth}`;
    return sessionStorage.getItem(key) === 'true';
  }

  /**
   * 标记滚动深度已追踪
   */
  private markScrollAsTracked(depth: number): void {
    const key = `scroll_tracked_${depth}`;
    sessionStorage.setItem(key, 'true');
  }

  /**
   * 销毁追踪器
   */
  destroy() {
    this.stopFlushTimer();
    this.flush();
    this.isInitialized = false;
  }
}

// 创建全局实例
let globalTracker: UserBehaviorTracker | null = null;

/**
 * 获取全局追踪器实例
 */
export function getBehaviorTracker(options?: BehaviorOptions): UserBehaviorTracker {
  if (!globalTracker) {
    globalTracker = new UserBehaviorTracker(options);
  }
  return globalTracker;
}

/**
 * 初始化行为追踪
 */
export function initBehaviorTracking(options?: BehaviorOptions): UserBehaviorTracker {
  const tracker = getBehaviorTracker(options);
  tracker.init();
  return tracker;
}

export default UserBehaviorTracker;
