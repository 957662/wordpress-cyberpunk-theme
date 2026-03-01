/**
 * 分析服务
 * Google Analytics 和其他分析工具集成
 */

interface AnalyticsEvent {
  category: string;
  action: string;
  label?: string;
  value?: number;
  nonInteraction?: boolean;
}

interface PageViewOptions {
  title?: string;
  location?: string;
  path?: string;
}

/**
 * Google Analytics 4 事件追踪
 */
export class Analytics {
  private isInitialized = false;
  private measurementId: string;

  constructor(measurementId: string) {
    this.measurementId = measurementId;
  }

  /**
   * 初始化 GA4
   */
  init() {
    if (this.isInitialized || typeof window === 'undefined') return;

    // 加载 gtag.js
    const script = document.createElement('script');
    script.src = `https://www.googletagmanager.com/gtag/js?id=${this.measurementId}`;
    script.async = true;
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
  pageView(options: PageViewOptions = {}) {
    if (!this.isInitialized || typeof window === 'undefined') return;

    (window as any).gtag('event', 'page_view', {
      page_title: options.title || document.title,
      page_location: options.location || window.location.href,
      page_path: options.path || window.location.pathname,
    });
  }

  /**
   * 追踪事件
   */
  event(event: AnalyticsEvent) {
    if (!this.isInitialized || typeof window === 'undefined') return;

    (window as any).gtag('event', event.action, {
      event_category: event.category,
      event_label: event.label,
      value: event.value,
      non_interaction: event.nonInteraction,
    });
  }

  /**
   * 追踪自定义事件
   */
  customEvent(eventName: string, parameters?: Record<string, any>) {
    if (!this.isInitialized || typeof window === 'undefined') return;

    (window as any).gtag('event', eventName, parameters);
  }

  /**
   * 设置用户 ID
   */
  setUserId(userId: string) {
    if (!this.isInitialized || typeof window === 'undefined') return;

    (window as any).gtag('config', this.measurementId, {
      user_id: userId,
    });
  }

  /**
   * 设置用户属性
   */
  setUserProperty(property: string, value: string) {
    if (!this.isInitialized || typeof window === 'undefined') return;

    (window as any).gtag('config', this.measurementId, {
      [property]: value,
    });
  }

  /**
   * 禁用分析追踪
   */
  disable() {
    if (typeof window === 'undefined') return;

    (window as any).gtag('config', this.measurementId, {
      send_page_view: false,
    });
  }
}

// 创建默认实例
let analyticsInstance: Analytics | null = null;

export function initAnalytics(measurementId: string) {
  if (!analyticsInstance) {
    analyticsInstance = new Analytics(measurementId);
    analyticsInstance.init();
  }
  return analyticsInstance;
}

export function getAnalytics(): Analytics {
  if (!analyticsInstance) {
    throw new Error('Analytics not initialized. Call initAnalytics first.');
  }
  return analyticsInstance;
}

// 便捷函数
export const trackPageView = (options?: PageViewOptions) => {
  getAnalytics().pageView(options);
};

export const trackEvent = (event: AnalyticsEvent) => {
  getAnalytics().event(event);
};

export const trackCustomEvent = (eventName: string, parameters?: Record<string, any>) => {
  getAnalytics().customEvent(eventName, parameters);
};

// 预定义的事件类型
export const events = {
  // 搜索事件
  search: (query: string) => ({
    category: 'Search',
    action: 'search',
    label: query,
  }),

  // 文章事件
  articleView: (title: string) => ({
    category: 'Article',
    action: 'view',
    label: title,
  }),

  articleShare: (title: string, platform: string) => ({
    category: 'Article',
    action: 'share',
    label: `${title} - ${platform}`,
  }),

  articleLike: (title: string) => ({
    category: 'Article',
    action: 'like',
    label: title,
  }),

  // 导航事件
  navClick: (destination: string) => ({
    category: 'Navigation',
    action: 'click',
    label: destination,
  }),

  // 下载事件
  download: (filename: string) => ({
    category: 'Download',
    action: 'download',
    label: filename,
  }),

  // 外部链接
  externalLink: (url: string) => ({
    category: 'Outbound',
    action: 'click',
    label: url,
  }),

  // 表单提交
  formSubmit: (formName: string) => ({
    category: 'Form',
    action: 'submit',
    label: formName,
  }),

  // 订阅
  newsletterSubscribe: () => ({
    category: 'Newsletter',
    action: 'subscribe',
  }),

  // 社交媒体
  socialClick: (platform: string) => ({
    category: 'Social',
    action: 'click',
    label: platform,
  }),
};

export default Analytics;
