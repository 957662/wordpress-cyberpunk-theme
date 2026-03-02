/**
 * Analytics Service
 * 分析数据收集和上报服务
 * 支持 Google Analytics、自定义事件追踪
 */

import { PerformanceData } from '@/components/performance/PerformanceMonitor';

// ============================================
// 类型定义
// ============================================

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
  customDimensions?: Record<string, string>;
}

export interface UserProperties {
  userId?: string;
  userType?: 'visitor' | 'subscriber' | 'author' | 'admin';
  interests?: string[];
  newsletterSubscribed?: boolean;
}

export interface AnalyticsConfig {
  trackingId?: string;
  gtmId?: string;
  disabled?: boolean;
  debug?: boolean;
  customEndpoint?: string;
}

// ============================================
// Analytics Service Class
// ============================================

class AnalyticsService {
  private config: AnalyticsConfig;
  private isInitialized = false;
  private eventQueue: AnalyticsEvent[] = [];
  private pageViewQueue: PageView[] = [];

  constructor(config: AnalyticsConfig = {}) {
    this.config = {
      disabled: false,
      debug: false,
      ...config,
    };
  }

  // ============================================
  // 初始化
  // ============================================

  initialize(): void {
    if (this.isInitialized || this.config.disabled) {
      return;
    }

    // Google Analytics
    if (this.config.trackingId) {
      this.loadGoogleAnalytics();
    }

    // Google Tag Manager
    if (this.config.gtmId) {
      this.loadGTM();
    }

    this.isInitialized = true;

    if (this.config.debug) {
      console.log('[Analytics] Initialized', this.config);
    }

    // 发送队列中的事件
    this.flushEventQueue();
    this.flushPageViewQueue();
  }

  private loadGoogleAnalytics(): void {
    if (typeof window === 'undefined' || !this.config.trackingId) return;

    // Load gtag.js
    const script = document.createElement('script');
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtag/js?id=${this.config.trackingId}`;
    document.head.appendChild(script);

    // Initialize gtag
    script.onload = () => {
      (window as any).gtag('js', new Date());
      (window as any).gtag('config', this.config.trackingId);
    };
  }

  private loadGTM(): void {
    if (typeof window === 'undefined' || !this.config.gtmId) return;

    // Load GTM
    const script = document.createElement('script');
    script.innerHTML = `
      (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
      new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
      j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
      'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
      })(window,document,'script','dataLayer','${this.config.gtmId}');
    `;
    document.head.appendChild(script);
  }

  // ============================================
  // 页面追踪
  // ============================================

  pageView(pageView: PageView): void {
    if (!this.isInitialized) {
      this.pageViewQueue.push(pageView);
      return;
    }

    // Google Analytics
    if (typeof (window as any).gtag !== 'undefined') {
      (window as any).gtag('event', 'page_view', {
        page_path: pageView.path,
        page_title: pageView.title,
        page_location: window.location.href,
      });
    }

    // Custom endpoint
    if (this.config.customEndpoint) {
      this.sendToCustomEndpoint('/pageview', pageView);
    }

    if (this.config.debug) {
      console.log('[Analytics] Page View', pageView);
    }
  }

  // ============================================
  // 事件追踪
  // ============================================

  track(event: AnalyticsEvent): void {
    if (!this.isInitialized) {
      this.eventQueue.push(event);
      return;
    }

    // Google Analytics
    if (typeof (window as any).gtag !== 'undefined') {
      (window as any).gtag('event', event.action, {
        event_category: event.category,
        event_label: event.label,
        value: event.value,
        non_interaction: event.nonInteraction,
      });
    }

    // Custom endpoint
    if (this.config.customEndpoint) {
      this.sendToCustomEndpoint('/event', event);
    }

    if (this.config.debug) {
      console.log('[Analytics] Event', event);
    }
  }

  // ============================================
  // 预定义事件
  // ============================================

  trackSearch(query: string, resultsCount?: number): void {
    this.track({
      category: 'Search',
      action: 'search',
      label: query,
      value: resultsCount,
    });
  }

  trackComment(postId: string): void {
    this.track({
      category: 'Engagement',
      action: 'comment',
      label: postId,
    });
  }

  trackLike(postId: string): void {
    this.track({
      category: 'Engagement',
      action: 'like',
      label: postId,
    });
  }

  trackShare(postId: string, platform: string): void {
    this.track({
      category: 'Social',
      action: 'share',
      label: platform,
    });
  }

  trackNewsletterSignup(method: 'inline' | 'popup' | 'footer'): void {
    this.track({
      category: 'Conversion',
      action: 'newsletter_signup',
      label: method,
    });
  }

  trackDownload(resourceUrl: string, resourceType: string): void {
    this.track({
      category: 'Download',
      action: 'download',
      label: resourceType,
      nonInteraction: false,
    });
  }

  trackError(error: Error, context?: string): void {
    this.track({
      category: 'Error',
      action: error.name,
      label: context || error.message,
    });
  }

  // ============================================
  // 用户属性
  // ============================================

  setUser(properties: UserProperties): void {
    if (typeof (window as any).gtag !== 'undefined') {
      (window as any).gtag('set', 'user_properties', properties);
    }

    if (this.config.debug) {
      console.log('[Analytics] Set User', properties);
    }
  }

  setUserId(userId: string): void {
    if (typeof (window as any).gtag !== 'undefined') {
      (window as any).gtag('set', 'user_id', userId);
    }
  }

  // ============================================
  // 性能追踪
  // ============================================

  trackPerformance(data: PerformanceData): void {
    this.track({
      category: 'Performance',
      action: 'web_vitals',
      label: data.url,
      value: data.metrics.LCP || data.metrics.loadTime,
    });

    // Track individual metrics
    if (data.metrics.FCP) {
      this.track({
        category: 'Performance',
        action: 'fcp',
        value: Math.round(data.metrics.FCP),
      });
    }

    if (data.metrics.LCP) {
      this.track({
        category: 'Performance',
        action: 'lcp',
        value: Math.round(data.metrics.LCP),
      });
    }

    if (data.metrics.FID) {
      this.track({
        category: 'Performance',
        action: 'fid',
        value: Math.round(data.metrics.FID),
      });
    }

    if (data.metrics.CLS !== undefined) {
      this.track({
        category: 'Performance',
        action: 'cls',
        value: Math.round(data.metrics.CLS * 1000),
      });
    }
  }

  // ============================================
  // E-commerce 追踪
  // ============================================

  trackProductView(productId: string, productName: string, price?: number): void {
    this.track({
      category: 'Ecommerce',
      action: 'product_view',
      label: productName,
      value: price,
    });
  }

  trackAddToCart(productId: string, quantity: number, price: number): void {
    this.track({
      category: 'Ecommerce',
      action: 'add_to_cart',
      label: productId,
      value: price * quantity,
    });
  }

  trackPurchase(transactionId: string, revenue: number): void {
    this.track({
      category: 'Ecommerce',
      action: 'purchase',
      label: transactionId,
      value: revenue,
    });
  }

  // ============================================
  // 自定义维度
  // ============================================

  setCustomDimension(dimension: string, value: string): void {
    if (typeof (window as any).gtag !== 'undefined') {
      (window as any).gtag('set', dimension, value);
    }
  }

  // ============================================
  // 辅助方法
  // ============================================

  private flushEventQueue(): void {
    while (this.eventQueue.length > 0) {
      const event = this.eventQueue.shift();
      if (event) {
        this.track(event);
      }
    }
  }

  private flushPageViewQueue(): void {
    while (this.pageViewQueue.length > 0) {
      const pageView = this.pageViewQueue.shift();
      if (pageView) {
        this.pageView(pageView);
      }
    }
  }

  private async sendToCustomEndpoint(endpoint: string, data: any): Promise<void> {
    if (!this.config.customEndpoint) return;

    try {
      await fetch(`${this.config.customEndpoint}${endpoint}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
        keepalive: true,
      });
    } catch (error) {
      if (this.config.debug) {
        console.error('[Analytics] Failed to send to custom endpoint:', error);
      }
    }
  }

  // ============================================
  // 禁用/启用
  // ============================================

  disable(): void {
    this.config.disabled = true;
    if (typeof (window as any).gtag !== 'undefined') {
      (window as any).gtag('set', 'send_page_view', false);
    }
  }

  enable(): void {
    this.config.disabled = false;
    if (typeof (window as any).gtag !== 'undefined') {
      (window as any).gtag('set', 'send_page_view', true);
    }
  }
}

// ============================================
// 单例实例
// ============================================

let analyticsInstance: AnalyticsService | null = null;

export const initAnalytics = (config: AnalyticsConfig): AnalyticsService => {
  if (!analyticsInstance) {
    analyticsInstance = new AnalyticsService(config);
    analyticsInstance.initialize();
  }
  return analyticsInstance;
};

export const getAnalytics = (): AnalyticsService => {
  if (!analyticsInstance) {
    analyticsInstance = new AnalyticsService();
  }
  return analyticsInstance;
};

// ============================================
// 导出
// ============================================

export default AnalyticsService;
