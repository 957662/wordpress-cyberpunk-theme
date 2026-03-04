/**
 * CyberPress Platform - Analytics & Tracking
 * 分析和追踪工具库
 */

interface AnalyticsEvent {
  category: string;
  action: string;
  label?: string;
  value?: number;
  nonInteraction?: boolean;
}

interface PageViewData {
  page: string;
  title: string;
  location?: string;
  referrer?: string;
}

interface UserProperties {
  userId?: string;
  userName?: string;
  userEmail?: string;
  userRole?: string;
  customProperties?: Record<string, any>;
}

/**
 * Google Analytics 4 追踪
 */
export class GA4Tracker {
  private measurementId: string;
  private isInitialized: boolean = false;

  constructor(measurementId: string) {
    this.measurementId = measurementId;
  }

  /**
   * 初始化 GA4
   */
  init() {
    if (typeof window === 'undefined' || this.isInitialized) return;

    // 加载 gtag.js
    const script = document.createElement('script');
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtag/js?id=${this.measurementId}`;
    document.head.appendChild(script);

    // 初始化 gtag
    const configScript = document.createElement('script');
    configScript.innerHTML = `
      window.dataLayer = window.dataLayer || [];
      function gtag(){dataLayer.push(arguments);}
      gtag('js', new Date());
      gtag('config', '${this.measurementId}');
    `;
    document.head.appendChild(configScript);

    this.isInitialized = true;
  }

  /**
   * 追踪页面浏览
   */
  trackPageView(data: PageViewData) {
    if (typeof window === 'undefined' || !this.isInitialized) return;

    (window as any).gtag('event', 'page_view', {
      page_title: data.title,
      page_location: data.location || window.location.href,
      page_path: data.page,
    });
  }

  /**
   * 追踪事件
   */
  trackEvent(event: AnalyticsEvent) {
    if (typeof window === 'undefined' || !this.isInitialized) return;

    (window as any).gtag('event', event.action, {
      event_category: event.category,
      event_label: event.label,
      value: event.value,
      non_interaction: event.nonInteraction || false,
    });
  }

  /**
   * 追踪用户属性
   */
  setUserProperties(properties: UserProperties) {
    if (typeof window === 'undefined' || !this.isInitialized) return;

    (window as any).gtag('config', this.measurementId, {
      user_id: properties.userId,
      custom_map: properties.customProperties,
    });
  }

  /**
   * 追踪异常
   */
  trackException(description: string, fatal = false) {
    if (typeof window === 'undefined' || !this.isInitialized) return;

    (window as any).gtag('event', 'exception', {
      description,
      fatal,
    });
  }

  /**
   * 追踪社交互动
   */
  trackSocial(network: string, action: string, target: string) {
    if (typeof window === 'undefined' || !this.isInitialized) return;

    (window as any).gtag('event', 'social', {
      social_network: network,
      social_action: action,
      social_target: target,
    });
  }

  /**
   * 追踪计时
   */
  trackTiming(category: string, variable: string, value: number, label?: string) {
    if (typeof window === 'undefined' || !this.isInitialized) return;

    (window as any).gtag('event', 'timing_complete', {
      name: variable,
      value,
      event_category: category,
      event_label: label,
    });
  }
}

/**
 * Plausible Analytics 追踪
 */
export class PlausibleTracker {
  private domain: string;
  private isInitialized: boolean = false;

  constructor(domain: string) {
    this.domain = domain;
  }

  /**
   * 初始化 Plausible
   */
  init() {
    if (typeof window === 'undefined' || this.isInitialized) return;

    const script = document.createElement('script');
    script.async = true;
    script.defer = true;
    script.dataset.domain = this.domain;
    script.src = 'https://plausible.io/js/script.js';
    document.head.appendChild(script);

    this.isInitialized = true;
  }

  /**
   * 追踪页面浏览
   */
  trackPageView(data: PageViewData) {
    if (typeof window === 'undefined' || !this.isInitialized) return;

    (window as any).plausible('pageview', {
      props: {
        path: data.page,
        title: data.title,
      },
    });
  }

  /**
   * 追踪事件
   */
  trackEvent(event: AnalyticsEvent) {
    if (typeof window === 'undefined' || !this.isInitialized) return;

    (window as any).plausible(event.action, {
      props: {
        category: event.category,
        label: event.label,
        value: event.value,
      },
    });
  }

  /**
   * 追踪自定义事件
   */
  trackCustomEvent(name: string, props?: Record<string, any>) {
    if (typeof window === 'undefined' || !this.isInitialized) return;

    (window as any).plausible(name, { props });
  }
}

/**
 * 自定义分析追踪器
 */
export class CustomTracker {
  private endpoint: string;
  private queue: AnalyticsEvent[] = [];
  private isBatching: boolean = false;
  private batchSize: number = 10;
  private batchTimeout: number = 5000; // 5秒

  constructor(endpoint: string) {
    this.endpoint = endpoint;
  }

  /**
   * 追踪事件
   */
  trackEvent(event: AnalyticsEvent) {
    this.queue.push({
      ...event,
      timestamp: new Date().toISOString(),
      url: typeof window !== 'undefined' ? window.location.href : '',
      userAgent: typeof window !== 'undefined' ? window.navigator.userAgent : '',
    } as any);

    if (this.queue.length >= this.batchSize) {
      this.flush();
    } else if (!this.isBatching) {
      this.isBatching = true;
      setTimeout(() => this.flush(), this.batchTimeout);
    }
  }

  /**
   * 追踪页面浏览
   */
  trackPageView(data: PageViewData) {
    this.trackEvent({
      category: 'pageview',
      action: 'view',
      label: data.page,
    });
  }

  /**
   * 发送队列数据到服务器
   */
  private async flush() {
    if (this.queue.length === 0) return;

    const events = [...this.queue];
    this.queue = [];
    this.isBatching = false;

    try {
      await fetch(this.endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ events }),
        keepalive: true,
      });
    } catch (error) {
      console.error('Failed to send analytics events:', error);
      // 失败时重新加入队列
      this.queue.unshift(...events);
    }
  }

  /**
   * 设置批量大小
   */
  setBatchSize(size: number) {
    this.batchSize = size;
  }

  /**
   * 设置批量超时
   */
  setBatchTimeout(timeout: number) {
    this.batchTimeout = timeout;
  }
}

/**
 * 统一的分析管理器
 */
export class AnalyticsManager {
  private trackers: Map<string, GA4Tracker | PlausibleTracker | CustomTracker> =
    new Map();

  /**
   * 添加 GA4 追踪器
   */
  addGA4(measurementId: string) {
    const tracker = new GA4Tracker(measurementId);
    tracker.init();
    this.trackers.set('ga4', tracker);
  }

  /**
   * 添加 Plausible 追踪器
   */
  addPlausible(domain: string) {
    const tracker = new PlausibleTracker(domain);
    tracker.init();
    this.trackers.set('plausible', tracker);
  }

  /**
   * * 添加自定义追踪器
   */
  addCustom(endpoint: string) {
    const tracker = new CustomTracker(endpoint);
    this.trackers.set('custom', tracker);
  }

  /**
   * 追踪页面浏览
   */
  trackPageView(data: PageViewData) {
    this.trackers.forEach((tracker) => {
      if ('trackPageView' in tracker) {
        tracker.trackPageView(data);
      }
    });
  }

  /**
   * 追踪事件
   */
  trackEvent(event: AnalyticsEvent) {
    this.trackers.forEach((tracker) => {
      if ('trackEvent' in tracker) {
        tracker.trackEvent(event);
      }
    });
  }

  /**
   * 追踪社交分享
   */
  trackSocialShare(network: string, target: string) {
    this.trackEvent({
      category: 'social',
      action: 'share',
      label: network,
    });

    this.trackers.forEach((tracker) => {
      if ('trackSocial' in tracker) {
        tracker.trackSocial(network, 'share', target);
      }
    });
  }

  /**
   * 追踪搜索
   */
  trackSearch(query: string, resultsCount?: number) {
    this.trackEvent({
      category: 'search',
      action: 'query',
      label: query,
      value: resultsCount,
    });
  }

  /**
   * 追踪表单提交
   */
  trackFormSubmit(formName: string, success: boolean) {
    this.trackEvent({
      category: 'form',
      action: success ? 'submit_success' : 'submit_error',
      label: formName,
    });
  }

  /**
   * 追踪下载
   */
  trackDownload(url: string, fileName: string) {
    this.trackEvent({
      category: 'download',
      action: 'click',
      label: fileName,
    });
  }

  /**
   * 追踪视频播放
   */
  trackVideoPlay(videoTitle: string, currentTime: number) {
    this.trackEvent({
      category: 'video',
      action: 'play',
      label: videoTitle,
      value: Math.floor(currentTime),
    });
  }

  /**
   * 追踪内容互动
   */
  trackContentEngagement(contentType: string, contentId: string, action: string) {
    this.trackEvent({
      category: 'engagement',
      action,
      label: `${contentType}:${contentId}`,
    });
  }

  /**
   * 追踪错误
   */
  trackError(message: string, fatal = false) {
    this.trackers.forEach((tracker) => {
      if ('trackException' in tracker) {
        tracker.trackException(message, fatal);
      }
    });

    this.trackEvent({
      category: 'error',
      action: fatal ? 'fatal_error' : 'error',
      label: message,
    });
  }
}

/**
 * 创建全局分析实例
 */
let analyticsInstance: AnalyticsManager | null = null;

export function initAnalytics(config: {
  ga4?: string;
  plausible?: string;
  customEndpoint?: string;
}) {
  if (analyticsInstance) return analyticsInstance;

  analyticsInstance = new AnalyticsManager();

  if (config.ga4) {
    analyticsInstance.addGA4(config.ga4);
  }

  if (config.plausible) {
    analyticsInstance.addPlausible(config.plausible);
  }

  if (config.customEndpoint) {
    analyticsInstance.addCustom(config.customEndpoint);
  }

  return analyticsInstance;
}

export function getAnalytics(): AnalyticsManager | null {
  return analyticsInstance;
}

/**
 * React Hook for Analytics
 */
export function useAnalytics() {
  const analytics = getAnalytics();

  return {
    trackPageView: (data: PageViewData) => analytics?.trackPageView(data),
    trackEvent: (event: AnalyticsEvent) => analytics?.trackEvent(event),
    trackSocialShare: (network: string, target: string) =>
      analytics?.trackSocialShare(network, target),
    trackSearch: (query: string, resultsCount?: number) =>
      analytics?.trackSearch(query, resultsCount),
    trackFormSubmit: (formName: string, success: boolean) =>
      analytics?.trackFormSubmit(formName, success),
    trackDownload: (url: string, fileName: string) =>
      analytics?.trackDownload(url, fileName),
    trackVideoPlay: (videoTitle: string, currentTime: number) =>
      analytics?.trackVideoPlay(videoTitle, currentTime),
    trackContentEngagement: (contentType: string, contentId: string, action: string) =>
      analytics?.trackContentEngagement(contentType, contentId, action),
    trackError: (message: string, fatal?: boolean) =>
      analytics?.trackError(message, fatal),
  };
}
