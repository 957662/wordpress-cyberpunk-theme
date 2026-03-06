/**
 * 分析服务
 * 提供统一的接口用于各种分析工具
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
  location?: string;
}

export interface UserProperties {
  userId?: string;
  userEmail?: string;
  userName?: string;
  [key: string]: any;
}

class AnalyticsService {
  private isInitialized = false;
  private queue: Array<() => void> = [];

  /**
   * 初始化分析服务
   */
  initialize() {
    if (this.isInitialized || typeof window === 'undefined') {
      return;
    }

    this.isInitialized = true;

    // 处理队列中的事件
    while (this.queue.length > 0) {
      const fn = this.queue.shift();
      fn?.();
    }
  }

  /**
   * 跟踪页面浏览
   */
  trackPageView(pageView: PageView) {
    const track = () => {
      // Google Analytics
      if (window.gtag) {
        window.gtag('event', 'page_view', {
          page_path: pageView.page,
          page_title: pageView.title,
          page_location: pageView.location
        });
      }

      // Plausible
      if (window.plausible) {
        window.plausible('pageview', {
          props: {
            page: pageView.page,
            title: pageView.title
          }
        });
      }

      // Umami
      if ((window as any).umami) {
        (window as any).umami.track({
          url: pageView.page,
          title: pageView.title
        });
      }
    };

    if (this.isInitialized) {
      track();
    } else {
      this.queue.push(track);
    }
  }

  /**
   * 跟踪自定义事件
   */
  trackEvent(event: AnalyticsEvent) {
    const track = () => {
      // Google Analytics
      if (window.gtag) {
        window.gtag('event', event.action, {
          event_category: event.category,
          event_label: event.label,
          value: event.value,
          non_interaction: event.nonInteraction
        });
      }

      // Plausible
      if (window.plausible) {
        window.plausible(event.action, {
          props: {
            category: event.category,
            label: event.label,
            value: event.value
          }
        });
      }

      // Umami
      if ((window as any).umami) {
        (window as any).umami.trackEvent(event.action, {
          category: event.category,
          label: event.label,
          value: event.value
        });
      }
    };

    if (this.isInitialized) {
      track();
    } else {
      this.queue.push(track);
    }
  }

  /**
   * 设置用户属性
   */
  setUser(properties: UserProperties) {
    if (!this.isInitialized) return;

    // Google Analytics
    if (window.gtag && properties.userId) {
      window.gtag('config', process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID, {
        user_id: properties.userId
      });
      window.gtag('set', 'user_properties', properties);
    }

    // Plausible
    if (window.plausible) {
      window.plausible('identify', {
        props: properties
      });
    }

    // Umami
    if ((window as any).umami && properties.userId) {
      (window as any).umami.identify({
        userId: properties.userId,
        ...properties
      });
    }
  }

  /**
   * 跟踪异常
   */
  trackException(description: string, fatal = false) {
    if (!this.isInitialized) return;

    if (window.gtag) {
      window.gtag('event', 'exception', {
        description,
        fatal
      });
    }
  }

  /**
   * 跟踪社交互动
   */
  trackSocial(network: string, action: string, target: string) {
    this.trackEvent({
      category: 'social',
      action: `${network}_${action}`,
      label: target
    });
  }

  /**
   * 跟踪计时
   */
  trackTiming(category: string, variable: string, value: number, label?: string) {
    if (!this.isInitialized) return;

    if (window.gtag) {
      window.gtag('event', 'timing_complete', {
        name: variable,
        value,
        event_category: category,
        event_label: label
      });
    }
  }
}

// 单例实例
export const analytics = new AnalyticsService();

// TypeScript 类型声明
declare global {
  interface Window {
    gtag?: (...args: any[]) => void;
    plausible?: (eventName: string, options?: any) => void;
  }
}

export default analytics;
