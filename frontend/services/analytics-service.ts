/**
 * CyberPress Platform - 数据分析服务
 * 页面访问统计、用户行为追踪、性能监控
 */

// ============================================================================
// 类型定义
// ============================================================================

export interface PageViewEvent {
  path: string;
  title: string;
  referrer: string;
  userAgent: string;
  timestamp: number;
  userId?: string;
  sessionId: string;
}

export interface ClickEvent {
  element: string;
  text?: string;
  href?: string;
  path: string;
  timestamp: number;
  userId?: string;
  sessionId: string;
}

export interface PerformanceEvent {
  path: string;
  loadTime: number;
  domContentLoaded: number;
  firstPaint: number;
  firstContentfulPaint: number;
  timestamp: number;
  userId?: string;
  sessionId: string;
}

export interface AnalyticsConfig {
  apiEndpoint?: string;
  batchSize?: number;
  flushInterval?: number;
  enablePageView?: boolean;
  enableClickTracking?: boolean;
  enablePerformanceTracking?: boolean;
  sampleRate?: number; // 0-1，采样率
}

// ============================================================================
// 会话管理
// ============================================================================

class SessionManager {
  private static instance: SessionManager;
  private sessionId: string;
  private startTime: number;

  private constructor() {
    this.sessionId = this.generateSessionId();
    this.startTime = Date.now();
  }

  static getInstance(): SessionManager {
    if (!SessionManager.instance) {
      SessionManager.instance = new SessionManager();
    }
    return SessionManager.instance;
  }

  private generateSessionId(): string {
    return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  getSessionId(): string {
    return this.sessionId;
  }

  getDuration(): number {
    return Date.now() - this.startTime;
  }

  reset(): void {
    this.sessionId = this.generateSessionId();
    this.startTime = Date.now();
  }
}

// ============================================================================
// 事件队列
// ============================================================================

class EventQueue {
  private queue: any[] = [];
  private maxSize: number;
  private flushTimer?: NodeJS.Timeout;

  constructor(maxSize = 50, flushInterval = 30000) {
    this.maxSize = maxSize;

    // 定时刷新
    if (typeof window !== 'undefined') {
      this.flushTimer = setInterval(() => {
        this.flush();
      }, flushInterval);
    }
  }

  add(event: any): void {
    this.queue.push(event);

    // 达到最大大小时刷新
    if (this.queue.length >= this.maxSize) {
      this.flush();
    }
  }

  async flush(): Promise<void> {
    if (this.queue.length === 0) return;

    const events = [...this.queue];
    this.queue = [];

    try {
      // 发送到分析服务器
      await fetch('/api/analytics/events', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ events }),
      });

      console.log(`[Analytics] Sent ${events.length} events`);
    } catch (error) {
      console.error('[Analytics] Failed to send events:', error);

      // 失败时重新加入队列
      this.queue.unshift(...events);

      // 保存到 localStorage 作为备份
      this.saveToLocalStorage();
    }
  }

  private saveToLocalStorage(): void {
    try {
      const existing = localStorage.getItem('cp_analytics_queue') || '[]';
      const events = JSON.parse(existing);
      events.push(...this.queue);
      localStorage.setItem('cp_analytics_queue', JSON.stringify(events.slice(-100))); // 只保留最近100个
      this.queue = [];
    } catch (error) {
      console.error('[Analytics] Failed to save to localStorage:', error);
    }
  }

  private loadFromLocalStorage(): void {
    try {
      const existing = localStorage.getItem('cp_analytics_queue');
      if (existing) {
        const events = JSON.parse(existing);
        this.queue.unshift(...events);
        localStorage.removeItem('cp_analytics_queue');
      }
    } catch (error) {
      console.error('[Analytics] Failed to load from localStorage:', error);
    }
  }

  destroy(): void {
    if (this.flushTimer) {
      clearInterval(this.flushTimer);
    }
    this.flush();
  }
}

// ============================================================================
// 性能监控
// ============================================================================

class PerformanceMonitor {
  private metrics: Partial<PerformanceEvent> = {};

  collect(): PerformanceEvent | null {
    if (typeof window === 'undefined' || !window.performance) {
      return null;
    }

    const perfData = window.performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;

    if (!perfData) return null;

    const paintEntries = window.performance.getEntriesByType('paint');
    const firstPaint = paintEntries.find((e) => e.name === 'first-paint')?.startTime || 0;
    const firstContentfulPaint =
      paintEntries.find((e) => e.name === 'first-contentful-paint')?.startTime || 0;

    return {
      path: window.location.pathname,
      loadTime: perfData.loadEventEnd - perfData.fetchStart,
      domContentLoaded: perfData.domContentLoadedEventEnd - perfData.fetchStart,
      firstPaint,
      firstContentfulPaint,
      timestamp: Date.now(),
      sessionId: SessionManager.getInstance().getSessionId(),
    };
  }
}

// ============================================================================
// 分析服务主类
// ============================================================================

export class AnalyticsService {
  private static instance: AnalyticsService;
  private config: AnalyticsConfig;
  private eventQueue: EventQueue;
  private sessionManager: SessionManager;
  private performanceMonitor: PerformanceMonitor;
  private isInitialized = false;
  private userId?: string;

  private constructor(config: AnalyticsConfig = {}) {
    this.config = {
      apiEndpoint: '/api/analytics',
      batchSize: 50,
      flushInterval: 30000,
      enablePageView: true,
      enableClickTracking: true,
      enablePerformanceTracking: true,
      sampleRate: 1,
      ...config,
    };

    this.sessionManager = SessionManager.getInstance();
    this.performanceMonitor = new PerformanceMonitor();
    this.eventQueue = new EventQueue(
      this.config.batchSize!,
      this.config.flushInterval
    );
  }

  static getInstance(config?: AnalyticsConfig): AnalyticsService {
    if (!AnalyticsService.instance) {
      AnalyticsService.instance = new AnalyticsService(config);
    }
    return AnalyticsService.instance;
  }

  /**
   * 初始化分析服务
   */
  init(userId?: string): void {
    if (this.isInitialized) return;

    // 检查采样率
    if (Math.random() > (this.config.sampleRate || 1)) {
      console.log('[Analytics] Sampled out');
      return;
    }

    this.userId = userId;

    // 页面加载时的事件
    if (this.config.enablePageView) {
      this.trackPageView();
    }

    // 性能监控
    if (this.config.enablePerformanceTracking) {
      this.trackPerformance();
    }

    // 点击追踪
    if (this.config.enableClickTracking) {
      this.setupClickTracking();
    }

    // 页面卸载时刷新队列
    if (typeof window !== 'undefined') {
      window.addEventListener('beforeunload', () => {
        this.eventQueue.flush();
      });

      // 可见性变化
      document.addEventListener('visibilitychange', () => {
        if (document.visibilityState === 'hidden') {
          this.eventQueue.flush();
        }
      });
    }

    this.isInitialized = true;
    console.log('[Analytics] Initialized');
  }

  /**
   * 追踪页面浏览
   */
  trackPageView(): void {
    if (typeof window === 'undefined') return;

    const event: PageViewEvent = {
      path: window.location.pathname,
      title: document.title,
      referrer: document.referrer,
      userAgent: navigator.userAgent,
      timestamp: Date.now(),
      userId: this.userId,
      sessionId: this.sessionManager.getSessionId(),
    };

    this.eventQueue.add({ type: 'pageview', data: event });
  }

  /**
   * 追踪点击事件
   */
  trackClick(element: HTMLElement, event: MouseEvent): void {
    const clickEvent: ClickEvent = {
      element: element.tagName.toLowerCase(),
      text: element.textContent?.substring(0, 100),
      href: element instanceof HTMLAnchorElement ? element.href : undefined,
      path: window.location.pathname,
      timestamp: Date.now(),
      userId: this.userId,
      sessionId: this.sessionManager.getSessionId(),
    };

    this.eventQueue.add({ type: 'click', data: clickEvent });
  }

  /**
   * 追踪性能
   */
  trackPerformance(): void {
    // 延迟收集，等待页面完全加载
    if (typeof window !== 'undefined') {
      window.addEventListener('load', () => {
        setTimeout(() => {
          const metrics = this.performanceMonitor.collect();
          if (metrics) {
            this.eventQueue.add({ type: 'performance', data: metrics });
          }
        }, 0);
      });
    }
  }

  /**
   * 追踪自定义事件
   */
  trackEvent(eventName: string, properties?: Record<string, any>): void {
    this.eventQueue.add({
      type: 'custom',
      data: {
        eventName,
        properties,
        timestamp: Date.now(),
        userId: this.userId,
        sessionId: this.sessionManager.getSessionId(),
      },
    });
  }

  /**
   * 设置用户 ID
   */
  setUserId(userId: string): void {
    this.userId = userId;
  }

  /**
   * 设置用户属性
   */
  setUserProperties(properties: Record<string, any>): void {
    this.eventQueue.add({
      type: 'user_properties',
      data: {
        properties,
        timestamp: Date.now(),
        userId: this.userId,
        sessionId: this.sessionManager.getSessionId(),
      },
    });
  }

  /**
   * 设置点击追踪
   */
  private setupClickTracking(): void {
    if (typeof document === 'undefined') return;

    document.addEventListener('click', (e) => {
      const target = e.target as HTMLElement;
      if (target) {
        this.trackClick(target, e);
      }
    }, true);
  }

  /**
   * 刷新队列
   */
  flush(): Promise<void> {
    return this.eventQueue.flush();
  }

  /**
   * 销毁
   */
  destroy(): void {
    this.eventQueue.destroy();
    this.isInitialized = false;
  }
}

// ============================================================================
// 默认实例
// ============================================================================

export const analytics = AnalyticsService.getInstance();

// ============================================================================
// React Hook
// ============================================================================

export function useAnalytics(userId?: string) {
  if (typeof window !== 'undefined') {
    analytics.init(userId);
  }

  return {
    trackPageView: () => analytics.trackPageView(),
    trackEvent: (name: string, props?: Record<string, any>) =>
      analytics.trackEvent(name, props),
    setUserId: (id: string) => analytics.setUserId(id),
    setUserProperties: (props: Record<string, any>) =>
      analytics.setUserProperties(props),
    flush: () => analytics.flush(),
  };
}

// ============================================================================
// 导出
// ============================================================================

export default AnalyticsService;
