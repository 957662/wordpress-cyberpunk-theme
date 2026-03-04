/**
 * 增强型分析服务
 * 提供页面追踪、用户行为分析等功能
 */

export interface PageViewOptions {
  title?: string;
  location?: string;
  referrer?: string;
  customDimensions?: Record<string, string>;
}

export interface EventOptions {
  category: string;
  action: string;
  label?: string;
  value?: number;
  nonInteraction?: boolean;
  customMetrics?: Record<string, number>;
}

export interface TimingOptions {
  category: string;
  variable: string;
  value: number;
  label?: string;
}

export interface SocialOptions {
  network: string;
  action: string;
  target: string;
}

class AnalyticsService {
  private isInitialized = false;
  private queue: Array<() => void> = [];
  private userId?: string;
  private sessionId?: string;

  /**
   * 初始化分析服务
   */
  initialize(trackingId: string, options?: { userId?: string; debug?: boolean }) {
    if (typeof window === 'undefined') return;

    this.isInitialized = true;
    this.userId = options?.userId;
    this.generateSessionId();

    // 处理队列中的事件
    this.queue.forEach((fn) => fn());
    this.queue = [];

    if (options?.debug) {
      console.log('[Analytics] Initialized', { trackingId, userId: this.userId });
    }
  }

  /**
   * 生成会话 ID
   */
  private generateSessionId() {
    this.sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * 追踪页面浏览
   */
  trackPageView(options: PageViewOptions = {}) {
    this.enqueue(() => {
      const pageView = {
        hitType: 'pageview',
        page: options.location || window.location.pathname,
        title: options.title || document.title,
        referrer: options.referrer || document.referrer,
        userId: this.userId,
        sessionId: this.sessionId,
        timestamp: Date.now(),
        customDimensions: options.customDimensions || {},
      };

      this.send('pageview', pageView);
      console.log('[Analytics] Page view tracked', pageView);
    });
  }

  /**
   * 追踪事件
   */
  trackEvent(options: EventOptions) {
    this.enqueue(() => {
      const event = {
        hitType: 'event',
        eventCategory: options.category,
        eventAction: options.action,
        eventLabel: options.label,
        eventValue: options.value,
        nonInteraction: options.nonInteraction || false,
        userId: this.userId,
        sessionId: this.sessionId,
        timestamp: Date.now(),
        customMetrics: options.customMetrics || {},
      };

      this.send('event', event);
      console.log('[Analytics] Event tracked', event);
    });
  }

  /**
   * 追踪用户计时
   */
  trackTiming(options: TimingOptions) {
    this.enqueue(() => {
      const timing = {
        hitType: 'timing',
        timingCategory: options.category,
        timingVar: options.variable,
        timingValue: options.value,
        timingLabel: options.label,
        userId: this.userId,
        sessionId: this.sessionId,
        timestamp: Date.now(),
      };

      this.send('timing', timing);
      console.log('[Analytics] Timing tracked', timing);
    });
  }

  /**
   * 追踪社交互动
   */
  trackSocial(options: SocialOptions) {
    this.enqueue(() => {
      const social = {
        hitType: 'social',
        socialNetwork: options.network,
        socialAction: options.action,
        socialTarget: options.target,
        userId: this.userId,
        sessionId: this.sessionId,
        timestamp: Date.now(),
      };

      this.send('social', social);
      console.log('[Analytics] Social tracked', social);
    });
  }

  /**
   * 追踪异常
   */
  trackException(description: string, fatal = false) {
    this.enqueue(() => {
      const exception = {
        hitType: 'exception',
        exDescription: description,
        exFatal: fatal,
        userId: this.userId,
        sessionId: this.sessionId,
        timestamp: Date.now(),
        page: window.location.pathname,
      };

      this.send('exception', exception);
      console.log('[Analytics] Exception tracked', exception);
    });
  }

  /**
   * 设置用户 ID
   */
  setUserId(userId: string) {
    this.userId = userId;
    console.log('[Analytics] User ID set', userId);
  }

  /**
   * 设置自定义维度
   */
  setCustomDimension(dimension: string, value: string) {
    this.enqueue(() => {
      console.log('[Analytics] Custom dimension set', { dimension, value });
    });
  }

  /**
   * 设置自定义指标
   */
  setCustomMetric(metric: string, value: number) {
    this.enqueue(() => {
      console.log('[Analytics] Custom metric set', { metric, value });
    });
  }

  /**
   * 发送数据到分析服务器
   */
  private send(type: string, data: any) {
    // 这里可以集成 Google Analytics, Plausible, Umami 等
    // 目前只是打印到控制台
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('event', type, data);
    }

    // 也可以发送到自己的分析 API
    // fetch('/api/analytics', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify({ type, data }),
    // }).catch(console.error);
  }

  /**
   * 将操作加入队列
   */
  private enqueue(fn: () => void) {
    if (this.isInitialized) {
      fn();
    } else {
      this.queue.push(fn);
    }
  }

  /**
   * 追踪滚动深度
   */
  trackScrollDepth(thresholds: number[] = [25, 50, 75, 90, 100]) {
    if (typeof window === 'undefined') return;

    let maxDepth = 0;
    const thresholdsReached = new Set<number>();

    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const depth = Math.round((scrollTop / docHeight) * 100);

      if (depth > maxDepth) {
        maxDepth = depth;

        thresholds.forEach((threshold) => {
          if (depth >= threshold && !thresholdsReached.has(threshold)) {
            thresholdsReached.add(threshold);
            this.trackEvent({
              category: 'Scroll',
              action: 'Depth',
              label: `${threshold}%`,
              value: threshold,
            });
          }
        });
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }

  /**
   * 追踪页面停留时间
   */
  trackTimeOnPage() {
    if (typeof window === 'undefined') return;

    const startTime = Date.now();

    return () => {
      const duration = Date.now() - startTime;
      const durationInSeconds = Math.round(duration / 1000);

      this.trackTiming({
        category: 'Page',
        variable: 'Time on Page',
        value: durationInSeconds,
        label: window.location.pathname,
      });
    };
  }

  /**
   * 追踪链接点击
   */
  trackLinkClick(selector: string = 'a[href]') {
    if (typeof window === 'undefined') return;

    const handleClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const link = target.closest('a');

      if (link && link.href) {
        this.trackEvent({
          category: 'Link',
          action: 'Click',
          label: link.href,
        });
      }
    };

    document.addEventListener('click', handleClick);
    return () => document.removeEventListener('click', handleClick);
  }

  /**
   * 追踪表单提交
   */
  trackFormSubmit(formIdOrSelector: string) {
    if (typeof window === 'undefined') return;

    const form = document.querySelector(formIdOrSelector);
    if (!form) return;

    const handleSubmit = () => {
      this.trackEvent({
        category: 'Form',
        action: 'Submit',
        label: formIdOrSelector,
      });
    };

    form.addEventListener('submit', handleSubmit);
    return () => form.removeEventListener('submit', handleSubmit);
  }

  /**
   * 追踪视频播放
   */
  trackVideo(videoIdOrSelector: string) {
    if (typeof window === 'undefined') return;

    const video = document.querySelector(videoIdOrSelector) as HTMLVideoElement;
    if (!video) return;

    const handlePlay = () => {
      this.trackEvent({
        category: 'Video',
        action: 'Play',
        label: videoIdOrSelector,
      });
    };

    const handlePause = () => {
      this.trackEvent({
        category: 'Video',
        action: 'Pause',
        label: videoIdOrSelector,
        value: Math.round(video.currentTime),
      });
    };

    const handleEnded = () => {
      this.trackEvent({
        category: 'Video',
        action: 'Complete',
        label: videoIdOrSelector,
        value: Math.round(video.duration),
      });
    };

    video.addEventListener('play', handlePlay);
    video.addEventListener('pause', handlePause);
    video.addEventListener('ended', handleEnded);

    return () => {
      video.removeEventListener('play', handlePlay);
      video.removeEventListener('pause', handlePause);
      video.removeEventListener('ended', handleEnded);
    };
  }
}

// 导出单例
export const analytics = new AnalyticsService();

// 导出便捷方法
export const trackPageView = (options?: PageViewOptions) => analytics.trackPageView(options);
export const trackEvent = (options: EventOptions) => analytics.trackEvent(options);
export const trackTiming = (options: TimingOptions) => analytics.trackTiming(options);
export const trackSocial = (options: SocialOptions) => analytics.trackSocial(options);
export const trackException = (description: string, fatal?: boolean) =>
  analytics.trackException(description, fatal);
