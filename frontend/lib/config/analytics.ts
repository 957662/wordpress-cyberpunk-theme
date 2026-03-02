/**
 * 分析工具配置
 * Google Analytics, 百度统计等
 */

export const analyticsConfig = {
  // Google Analytics 4
  googleAnalytics: {
    enabled: !!process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID,
    measurementId: process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID || '',
    consentMode: {
      analyticsStorage: 'granted' as const,
      adStorage: 'granted' as const,
      adUserData: 'granted' as const,
      adPersonalization: 'granted' as const,
    },
  },

  // 百度统计
  baiduAnalytics: {
    enabled: !!process.env.NEXT_PUBLIC_BAIDU_ANALYTICS_ID,
    id: process.env.NEXT_PUBLIC_BAIDU_ANALYTICS_ID || '',
  },

  // 腾讯分析
  tencentAnalytics: {
    enabled: !!process.env.NEXT_PUBLIC_TENCENT_ANALYTICS_ID,
    id: process.env.NEXT_PUBLIC_TENCENT_ANALYTICS_ID || '',
  },

  // 自定义事件追踪
  customEvents: {
    // 页面访问
    pageView: (page: string, title: string) => ({
      event: 'page_view',
      page,
      title,
      timestamp: Date.now(),
    }),

    // 文章阅读
    articleView: (articleId: string, title: string, category: string) => ({
      event: 'article_view',
      articleId,
      title,
      category,
      timestamp: Date.now(),
    }),

    // 搜索
    search: (query: string, results: number) => ({
      event: 'search',
      query,
      results,
      timestamp: Date.now(),
    }),

    // 评论
    comment: (articleId: string, commentId: string) => ({
      event: 'comment',
      articleId,
      commentId,
      timestamp: Date.now(),
    }),

    // 分享
    share: (content: string, platform: string) => ({
      event: 'share',
      content,
      platform,
      timestamp: Date.now(),
    }),

    // 下载
    download: (file: string, type: string) => ({
      event: 'download',
      file,
      type,
      timestamp: Date.now(),
    }),

    // CTA 点击
    ctaClick: (ctaName: string, location: string) => ({
      event: 'cta_click',
      ctaName,
      location,
      timestamp: Date.now(),
    }),

    // 表单提交
    formSubmit: (formName: string, success: boolean) => ({
      event: 'form_submit',
      formName,
      success,
      timestamp: Date.now(),
    }),

    // 错误
    error: (error: string, context: string) => ({
      event: 'error',
      error,
      context,
      timestamp: Date.now(),
    }),
  },

  // 性能监控
  performance: {
    enabled: true,
    metrics: [
      'FCP', // First Contentful Paint
      'LCP', // Largest Contentful Paint
      'FID', // First Input Delay
      'CLS', // Cumulative Layout Shift
      'TTFB', // Time to First Byte
      'TTI', // Time to Interactive
    ],
  },

  // 用户行为追踪
  behaviorTracking: {
    scrollDepth: true, // 滚动深度
    clickTracking: true, // 点击追踪
    formTracking: true, // 表单追踪
    videoTracking: true, // 视频追踪
  },
};

// 分析工具类
export class Analytics {
  static event(name: string, params?: Record<string, any>) {
    if (typeof window === 'undefined') return;

    // Google Analytics 4
    if (window.gtag) {
      window.gtag('event', name, params);
    }

    // 百度统计
    if (window._hmt) {
      window._hmt.push(['_trackEvent', name, JSON.stringify(params)]);
    }
  }

  static pageView(page: string, title: string) {
    if (typeof window === 'undefined') return;

    // Google Analytics 4
    if (window.gtag) {
      window.gtag('event', 'page_view', {
        page_title: title,
        page_location: page,
      });
    }

    // 百度统计
    if (window._hmt) {
      window._hmt.push(['_trackPageview', page]);
    }
  }

  static trackError(error: Error, context?: string) {
    this.event('error', {
      error_message: error.message,
      error_stack: error.stack,
      context,
    });
  }

  static trackPerformance(metricName: string, value: number) {
    this.event('performance_metric', {
      metric_name: metricName,
      value,
    });
  }
}

// 扩展 Window 接口
declare global {
  interface Window {
    gtag?: (...args: any[]) => void;
    _hmt?: any[];
  }
}
