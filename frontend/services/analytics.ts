/**
 * Analytics Service
 * 数据分析服务 - 用于追踪用户行为和页面数据
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
  userId?: string;
  sessionId?: string;
}

export interface UserProperties {
  userId?: string;
  email?: string;
  name?: string;
  customProperties?: Record<string, unknown>;
}

/**
 * Analytics Service Class
 */
class AnalyticsService {
  private initialized: boolean = false;
  private queue: AnalyticsEvent[] = [];
  private sessionId: string;

  constructor() {
    this.sessionId = this.generateSessionId();
  }

  private generateSessionId(): string {
    return `${Date.now()}-${Math.random().toString(36).substring(2, 15)}`;
  }

  /**
   * Initialize analytics
   */
  init(config?: { debug?: boolean; batchSize?: number }): void {
    if (typeof window === 'undefined') return;

    this.initialized = true;

    // Process queued events
    this.processQueue();

    if (config?.debug) {
      console.log('[Analytics] Initialized', { sessionId: this.sessionId });
    }
  }

  /**
   * Track page view
   */
  trackPageView(pageView: PageView): void {
    if (!this.initialized) {
      console.warn('[Analytics] Not initialized');
      return;
    }

    const event: AnalyticsEvent = {
      category: 'page_view',
      action: 'view',
      label: pageView.path,
    };

    this.trackEvent(event);

    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('event', 'page_view', {
        page_path: pageView.path,
        page_title: pageView.title,
      });
    }
  }

  /**
   * Track custom event
   */
  trackEvent(event: AnalyticsEvent): void {
    if (!this.initialized) {
      this.queue.push(event);
      return;
    }

    this.sendEvent(event);
  }

  /**
   * Track user interaction
   */
  trackInteraction(action: string, label?: string, value?: number): void {
    this.trackEvent({
      category: 'interaction',
      action,
      label,
      value,
    });
  }

  /**
   * Track error
   */
  trackError(error: Error, context?: Record<string, unknown>): void {
    this.trackEvent({
      category: 'error',
      action: error.name,
      label: error.message,
      nonInteraction: true,
    });

    if (typeof window !== 'undefined' && (window as any).Sentry) {
      (window as any).Sentry.captureException(error, { extra: context });
    }
  }

  /**
   * Set user properties
   */
  setUser(properties: UserProperties): void {
    if (!this.initialized) return;

    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('set', 'user_properties', {
        user_id: properties.userId,
        ...properties.customProperties,
      });
    }
  }

  /**
   * Send event to analytics platform
   */
  private sendEvent(event: AnalyticsEvent): void {
    // Send to Google Analytics
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('event', event.action, {
        event_category: event.category,
        event_label: event.label,
        value: event.value,
        non_interaction: event.nonInteraction,
      });
    }

    // Send to custom endpoint (optional)
    this.sendToCustomEndpoint(event);
  }

  /**
   * Send event to custom analytics endpoint
   */
  private async sendToCustomEndpoint(event: AnalyticsEvent): Promise<void> {
    try {
      // Implement custom endpoint logic here
      // await fetch('/api/analytics', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ ...event, sessionId: this.sessionId }),
      // });
    } catch (error) {
      console.error('[Analytics] Failed to send event:', error);
    }
  }

  /**
   * Process queued events
   */
  private processQueue(): void {
    while (this.queue.length > 0) {
      const event = this.queue.shift();
      if (event) {
        this.sendEvent(event);
      }
    }
  }

  /**
   * Reset session
   */
  resetSession(): void {
    this.sessionId = this.generateSessionId();
  }

  /**
   * Get current session ID
   */
  getSessionId(): string {
    return this.sessionId;
  }
}

// Create singleton instance
export const analytics = new AnalyticsService();

/**
 * React Hook for Analytics
 */
export function useAnalytics() {
  return {
    trackPageView: analytics.trackPageView.bind(analytics),
    trackEvent: analytics.trackEvent.bind(analytics),
    trackInteraction: analytics.trackInteraction.bind(analytics),
    trackError: analytics.trackError.bind(analytics),
    setUser: analytics.setUser.bind(analytics),
    resetSession: analytics.resetSession.bind(analytics),
    getSessionId: analytics.getSessionId.bind(analytics),
  };
}

/**
 * Higher-order component for page view tracking
 */
export function withPageViewTracking<P extends object>(
  WrappedComponent: React.ComponentType<P>,
  getPageViewData: (props: P) => { path: string; title: string }
) {
  return (props: P) => {
    const pageViewData = getPageViewData(props);

    React.useEffect(() => {
      analytics.trackPageView({
        path: pageViewData.path,
        title: pageViewData.title,
      });
    }, [pageViewData.path, pageViewData.title]);

    return <WrappedComponent {...props} />;
  };
}

/**
 * Event types for common analytics events
 */
export const AnalyticsEvents = {
  // Page events
  PAGE_VIEW: 'page_view',
  PAGE_SCROLL: 'page_scroll',
  PAGE_DWELL_TIME: 'page_dwell_time',

  // User interaction events
  CLICK: 'click',
  HOVER: 'hover',
  FOCUS: 'focus',
  BLUR: 'blur',
  SUBMIT: 'submit',

  // Content events
  CONTENT_VIEW: 'content_view',
  CONTENT_SHARE: 'content_share',
  CONTENT_LIKE: 'content_like',
  CONTENT_BOOKMARK: 'content_bookmark',

  // Search events
  SEARCH: 'search',
  SEARCH_FILTER: 'search_filter',
  SEARCH_SORT: 'search_sort',

  // E-commerce events
  ADD_TO_CART: 'add_to_cart',
  REMOVE_FROM_CART: 'remove_from_cart',
  BEGIN_CHECKOUT: 'begin_checkout',
  PURCHASE: 'purchase',

  // Form events
  FORM_START: 'form_start',
  FORM_SUBMIT: 'form_submit',
  FORM_ABANDON: 'form_abandon',

  // Error events
  JAVASCRIPT_ERROR: 'javascript_error',
  API_ERROR: 'api_error',
  NETWORK_ERROR: 'network_error',
};

/**
 * Event categories
 */
export const AnalyticsCategories = {
  PAGE: 'page',
  INTERACTION: 'interaction',
  CONTENT: 'content',
  SEARCH: 'search',
  ECOMMERCE: 'ecommerce',
  FORM: 'form',
  ERROR: 'error',
  PERFORMANCE: 'performance',
};

export default analytics;
