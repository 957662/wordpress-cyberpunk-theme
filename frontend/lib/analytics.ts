/**
 * 性能监控和分析
 * 用于收集应用性能数据
 */

interface PerformanceMetrics {
  // Web Vitals
  FCP?: number; // First Contentful Paint
  LCP?: number; // Largest Contentful Paint
  FID?: number; // First Input Delay
  CLS?: number; // Cumulative Layout Shift
  TTFB?: number; // Time to First Byte
  
  // 自定义指标
  pageLoadTime?: number;
  domContentLoaded?: number;
  
  // 页面信息
  page: string;
  timestamp: number;
}

/**
 * 上报性能数据到分析平台
 */
function reportMetrics(metrics: PerformanceMetrics) {
  // 发送到分析 API
  if (typeof window !== 'undefined' && process.env.NODE_ENV === 'production') {
    fetch('/api/analytics/performance', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(metrics),
    }).catch(console.error);
  }
}

/**
 * 测量 Web Vitals
 */
export function measureWebVitals() {
  if (typeof window === 'undefined') return;

  // 动态导入 web-vitals
  import('web-vitals').then(({ getCLS, getFID, getFCP, getLCP, getTTFB }) => {
    const metrics: PerformanceMetrics = {
      page: window.location.pathname,
      timestamp: Date.now(),
    };

    getCLS((score) => {
      metrics.CLS = score;
      reportMetrics(metrics);
    });

    getFID((score) => {
      metrics.FID = score;
      reportMetrics(metrics);
    });

    getFCP((score) => {
      metrics.FCP = score;
      reportMetrics(metrics);
    });

    getLCP((score) => {
      metrics.LCP = score;
      reportMetrics(metrics);
    });

    getTTFB((score) => {
      metrics.TTFB = score;
      reportMetrics(metrics);
    });
  });
}

/**
 * 测量页面加载时间
 */
export function measurePageLoad() {
  if (typeof window === 'undefined') return;

  window.addEventListener('load', () => {
    setTimeout(() => {
      const perfData = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
      
      if (perfData) {
        const metrics: PerformanceMetrics = {
          pageLoadTime: perfData.loadEventEnd - perfData.fetchStart,
          domContentLoaded: perfData.domContentLoadedEventEnd - perfData.fetchStart,
          TTFB: perfData.responseStart - perfData.fetchStart,
          page: window.location.pathname,
          timestamp: Date.now(),
        };
        
        reportMetrics(metrics);
      }
    }, 0);
  });
}

/**
 * 追踪自定义事件
 */
export function trackEvent(eventName: string, properties?: Record<string, any>) {
  if (typeof window === 'undefined') return;

  if (process.env.NODE_ENV === 'production') {
    // 发送到分析平台
    fetch('/api/analytics/event', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        event: eventName,
        properties,
        timestamp: Date.now(),
        page: window.location.pathname,
      }),
    }).catch(console.error);
  }
}

/**
 * 追踪页面浏览
 */
export function trackPageView(path: string) {
  trackEvent('page_view', {
    path,
    referrer: document.referrer,
    title: document.title,
  });
}

/**
 * 追踪错误
 */
export function trackError(error: Error, context?: Record<string, any>) {
  trackEvent('error', {
    message: error.message,
    stack: error.stack,
    context,
  });
}

/**
 * 初始化性能监控
 */
export function initPerformanceMonitoring() {
  if (typeof window === 'undefined') return;

  // 监听错误
  window.addEventListener('error', (event) => {
    trackError(event.error, {
      filename: event.filename,
      lineno: event.lineno,
      colno: event.colno,
    });
  });

  // 监听未处理的 Promise 拒绝
  window.addEventListener('unhandledrejection', (event) => {
    trackError(new Error(event.reason), {
      type: 'unhandledrejection',
    });
  });

  // 测量页面性能
  measureWebVitals();
  measurePageLoad();
}

/**
 * 性能计时器
 */
export class PerformanceTimer {
  private startTime: number;
  private label: string;

  constructor(label: string) {
    this.label = label;
    this.startTime = performance.now();
  }

  end() {
    const duration = performance.now() - this.startTime;
    trackEvent('performance_timer', {
      label: this.label,
      duration,
    });
    return duration;
  }
}

/**
 * 创建性能计时器
 */
export function createTimer(label: string) {
  return new PerformanceTimer(label);
}
