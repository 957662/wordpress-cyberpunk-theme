/**
 * Analytics Service
 * Handles tracking and analytics for the application
 */

export interface AnalyticsEvent {
  category: string;
  action: string;
  label?: string;
  value?: number;
  nonInteraction?: boolean;
}

export interface PageView {
  page: string;
  title: string;
  referrer?: string;
}

export interface UserProperties {
  userId?: string;
  userEmail?: string;
  userName?: string;
  [key: string]: any;
}

class AnalyticsService {
  private isInitialized = false;
  private queue: AnalyticsEvent[] = [];
  private userId: string | null = null;

  /**
   * Initialize analytics
   */
  async init(trackingId?: string): Promise<void> {
    if (this.isInitialized) return;

    try {
      // Initialize Google Analytics if tracking ID provided
      if (trackingId && typeof window !== 'undefined') {
        // Load GA script
        await this.loadGoogleAnalytics(trackingId);
      }

      this.isInitialized = true;
      this.processQueue();

      console.log('[Analytics] Initialized');
    } catch (error) {
      console.error('[Analytics] Initialization failed:', error);
    }
  }

  /**
   * Load Google Analytics script
   */
  private async loadGoogleAnalytics(trackingId: string): Promise<void> {
    if (typeof window === 'undefined' || !(window as any).gtag) {
      // Create script tag
      const script = document.createElement('script');
      script.async = true;
      script.src = `https://www.googletagmanager.com/gtag/js?id=${trackingId}`;
      document.head.appendChild(script);

      // Initialize gtag
      script.onload = () => {
        (window as any).gtag('js', new Date());
        (window as any).gtag('config', trackingId);
      };
    }
  }

  /**
   * Track page view
   */
  trackPageView(pageView: PageView): void {
    if (!this.isInitialized) {
      console.warn('[Analytics] Not initialized, queueing page view');
      return;
    }

    try {
      // Track with Google Analytics
      if (typeof window !== 'undefined' && (window as any).gtag) {
        (window as any).gtag('event', 'page_view', {
          page_title: pageView.title,
          page_location: pageView.page,
          page_referrer: pageView.referrer,
        });
      }

      // Track with custom analytics
      this.trackEvent({
        category: 'Page View',
        action: 'view',
        label: pageView.page,
        nonInteraction: true,
      });

      console.log('[Analytics] Page view tracked:', pageView);
    } catch (error) {
      console.error('[Analytics] Page view tracking failed:', error);
    }
  }

  /**
   * Track custom event
   */
  trackEvent(event: AnalyticsEvent): void {
    if (!this.isInitialized) {
      this.queue.push(event);
      return;
    }

    try {
      // Track with Google Analytics
      if (typeof window !== 'undefined' && (window as any).gtag) {
        (window as any).gtag('event', event.action, {
          event_category: event.category,
          event_label: event.label,
          value: event.value,
          non_interaction: event.nonInteraction,
        });
      }

      // Track with custom analytics endpoint
      this.sendToBackend(event);

      console.log('[Analytics] Event tracked:', event);
    } catch (error) {
      console.error('[Analytics] Event tracking failed:', error);
    }
  }

  /**
   * Track user engagement
   */
  trackEngagement(action: string, label?: string): void {
    this.trackEvent({
      category: 'Engagement',
      action,
      label,
    });
  }

  /**
   * Track errors
   */
  trackError(error: Error, context?: Record<string, any>): void {
    this.trackEvent({
      category: 'Error',
      action: error.name,
      label: error.message,
    });

    // Send error details to backend
    if (typeof window !== 'undefined') {
      fetch('/api/analytics/error', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: error.name,
          message: error.message,
          stack: error.stack,
          context,
          url: window.location.href,
          userAgent: navigator.userAgent,
          timestamp: new Date().toISOString(),
        }),
      }).catch((err) => console.error('Error tracking failed:', err));
    }
  }

  /**
   * Track performance metrics
   */
  trackPerformance(metrics: Record<string, number>): void {
    Object.entries(metrics).forEach(([name, value]) => {
      this.trackEvent({
        category: 'Performance',
        action: name,
        value: value,
        nonInteraction: true,
      });
    });
  }

  /**
   * Set user properties
   */
  setUser(properties: UserProperties): void {
    this.userId = properties.userId || null;

    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('config', properties.userId || 'anonymous', {
        user_id: properties.userId,
        user_properties: properties,
      });
    }

    console.log('[Analytics] User set:', properties);
  }

  /**
   * Track conversion
   */
  trackConversion(conversionId: string, value?: number, currency?: string): void {
    this.trackEvent({
      category: 'Conversion',
      action: 'complete',
      label: conversionId,
      value,
    });

    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('event', 'conversion', {
        send_to: conversionId,
        value,
        currency,
      });
    }
  }

  /**
   * Track social interaction
   */
  trackSocial(network: string, action: string, target: string): void {
    this.trackEvent({
      category: 'Social',
      action: `${network} - ${action}`,
      label: target,
    });
  }

  /**
   * Track timing
   */
  trackTiming(category: string, variable: string, value: number, label?: string): void {
    this.trackEvent({
      category,
      action: variable,
      label,
      value,
      nonInteraction: true,
    });
  }

  /**
   * Track exception
   */
  trackException(description: string, isFatal = false): void {
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('event', 'exception', {
        description,
        fatal: isFatal,
      });
    }

    this.trackEvent({
      category: 'Exception',
      action: isFatal ? 'fatal' : 'non-fatal',
      label: description,
    });
  }

  /**
   * Process queued events
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
   * Send event to backend
   */
  private async sendToBackend(event: AnalyticsEvent): Promise<void> {
    try {
      await fetch('/api/analytics/event', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...event,
          userId: this.userId,
          url: typeof window !== 'undefined' ? window.location.href : '',
          timestamp: new Date().toISOString(),
        }),
      });
    } catch (error) {
      console.error('[Analytics] Backend tracking failed:', error);
    }
  }

  /**
   * Reset analytics (logout)
   */
  reset(): void {
    this.userId = null;

    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('config', 'anonymous', {
        user_id: null,
      });
    }
  }

  /**
   * Disable analytics
   */
  disable(): void {
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('config', 'anonymous', {
        send_page_view: false,
      });
    }

    this.isInitialized = false;
  }
}

// Create singleton instance
const analyticsService = new AnalyticsService();

export default analyticsService;
