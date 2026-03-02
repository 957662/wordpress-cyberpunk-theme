/**
 * 性能监控和优化工具
 */

export interface PerformanceMetrics {
  name: string;
  duration: number;
  timestamp: number;
  metadata?: Record<string, unknown>;
}

class PerformanceMonitor {
  private metrics: PerformanceMetrics[] = [];
  private marks: Map<string, number> = new Map();

  /**
   * 开始计时
   */
  start(name: string): void {
    this.marks.set(name, performance.now());
  }

  /**
   * 结束计时并记录
   */
  end(name: string, metadata?: Record<string, unknown>): number {
    const startTime = this.marks.get(name);
    if (!startTime) {
      console.warn(`Performance mark "${name}" not found`);
      return 0;
    }

    const duration = performance.now() - startTime;
    const metric: PerformanceMetrics = {
      name,
      duration,
      timestamp: Date.now(),
      metadata,
    };

    this.metrics.push(metric);
    this.marks.delete(name);

    if (process.env.NODE_ENV === 'development') {
      console.log(`[Performance] ${name}: ${duration.toFixed(2)}ms`);
    }

    return duration;
  }

  /**
   * 测量函数执行时间
   */
  async measure<T>(
    name: string,
    fn: () => Promise<T>,
    metadata?: Record<string, unknown>
  ): Promise<T> {
    this.start(name);
    try {
      return await fn();
    } finally {
      this.end(name, metadata);
    }
  }

  /**
   * 测量同步函数执行时间
   */
  measureSync<T>(
    name: string,
    fn: () => T,
    metadata?: Record<string, unknown>
  ): T {
    this.start(name);
    try {
      return fn();
    } finally {
      this.end(name, metadata);
    }
  }

  /**
   * 获取所有指标
   */
  getMetrics(): PerformanceMetrics[] {
    return [...this.metrics];
  }

  /**
   * 按名称获取指标
   */
  getMetricsByName(name: string): PerformanceMetrics[] {
    return this.metrics.filter(m => m.name === name);
  }

  /**
   * 获取平均执行时间
   */
  getAverageDuration(name: string): number {
    const metrics = this.getMetricsByName(name);
    if (metrics.length === 0) return 0;

    const sum = metrics.reduce((acc, m) => acc + m.duration, 0);
    return sum / metrics.length;
  }

  /**
   * 清除指标
   */
  clear(): void {
    this.metrics = [];
    this.marks.clear();
  }
}

// 单例实例
export const performanceMonitor = new PerformanceMonitor();

/**
 * Web Vitals 监控
 */
export function observeWebVitals(): void {
  if (typeof window === 'undefined') return;

  // 监控 LCP (Largest Contentful Paint)
  observeLCP();

  // 监控 FID (First Input Delay)
  observeFID();

  // 监控 CLS (Cumulative Layout Shift)
  observeCLS();

  // 监控 FCP (First Contentful Paint)
  observeFCP();

  // 监控 TTFB (Time to First Byte)
  observeTTFB();
}

function observeLCP(): void {
  if (!('PerformanceObserver' in window)) return;

  try {
    const observer = new PerformanceObserver((list) => {
      const entries = list.getEntries();
      const lastEntry = entries[entries.length - 1] as any;
      console.log('[Web Vitals] LCP:', lastEntry.renderTime || lastEntry.loadTime);
    });
    observer.observe({ entryTypes: ['largest-contentful-paint'] });
  } catch {
    // 忽略不支持的情况
  }
}

function observeFID(): void {
  if (!('PerformanceObserver' in window)) return;

  try {
    const observer = new PerformanceObserver((list) => {
      const entries = list.getEntries();
      entries.forEach((entry: any) => {
        console.log('[Web Vitals] FID:', entry.processingStart - entry.startTime);
      });
    });
    observer.observe({ entryTypes: ['first-input'] });
  } catch {
    // 忽略不支持的情况
  }
}

function observeCLS(): void {
  if (!('PerformanceObserver' in window)) return;

  try {
    let clsValue = 0;
    const observer = new PerformanceObserver((list) => {
      list.getEntries().forEach((entry: any) => {
        if (!entry.hadRecentInput) {
          clsValue += entry.value;
          console.log('[Web Vitals] CLS:', clsValue);
        }
      });
    });
    observer.observe({ entryTypes: ['layout-shift'] });
  } catch {
    // 忽略不支持的情况
  }
}

function observeFCP(): void {
  if (!('PerformanceObserver' in window)) return;

  try {
    const observer = new PerformanceObserver((list) => {
      const entries = list.getEntries();
      entries.forEach((entry: any) => {
        console.log('[Web Vitals] FCP:', entry.startTime);
      });
    });
    observer.observe({ entryTypes: ['paint'] });
  } catch {
    // 忽略不支持的情况
  }
}

function observeTTFB(): void {
  if (typeof window === 'undefined' || !window.performance) return;

  window.addEventListener('load', () => {
    const perfData = performance.getEntriesByType('navigation')[0] as any;
    if (perfData) {
      const ttfb = perfData.responseStart - perfData.requestStart;
      console.log('[Web Vitals] TTFB:', ttfb);
    }
  });
}

/**
 * 资源加载优化
 */
export class ResourceOptimizer {
  private imageCache: Set<string> = new Set();

  /**
   * 懒加载图片
   */
  lazyLoadImages(): void {
    if (!('IntersectionObserver' in window)) return;

    const imageObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const img = entry.target as HTMLImageElement;
            if (img.dataset.src) {
              img.src = img.dataset.src;
              img.removeAttribute('data-src');
              imageObserver.unobserve(img);
            }
          }
        });
      },
      { rootMargin: '50px' }
    );

    document.querySelectorAll('img[data-src]').forEach((img) => {
      imageObserver.observe(img);
    });
  }

  /**
   * 预加载关键资源
   */
  preloadResources(urls: string[]): void {
    urls.forEach((url) => {
      if (this.imageCache.has(url)) return;

      const link = document.createElement('link');
      link.rel = 'preload';
      link.href = url;
      link.as = url.endsWith('.css') ? 'style' : 'script';
      document.head.appendChild(link);
      this.imageCache.add(url);
    });
  }

  /**
   * 预连接到外部域名
   */
  preconnectDomains(domains: string[]): void {
    domains.forEach((domain) => {
      const link = document.createElement('link');
      link.rel = 'preconnect';
      link.href = domain;
      document.head.appendChild(link);
    });
  }
}

export const resourceOptimizer = new ResourceOptimizer();

/**
 * 内存使用监控
 */
export function getMemoryUsage(): {
  used: number;
  total: number;
  limit: number;
} | null {
  if (
    typeof performance === 'undefined' ||
    !(performance as any).memory
  ) {
    return null;
  }

  const memory = (performance as any).memory;
  return {
    used: memory.usedJSHeapSize,
    total: memory.totalJSHeapSize,
    limit: memory.jsHeapSizeLimit,
  };
}

/**
 * 节流函数（用于性能优化）
 */
export function throttle<T extends (...args: unknown[]) => unknown>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout | null = null;
  let previous = 0;

  return function (this: unknown, ...args: Parameters<T>) {
    const now = Date.now();
    const remaining = wait - (now - previous);

    if (remaining <= 0 || remaining > wait) {
      if (timeout) {
        clearTimeout(timeout);
        timeout = null;
      }
      previous = now;
      func.apply(this, args);
    } else if (!timeout) {
      timeout = setTimeout(() => {
        previous = Date.now();
        timeout = null;
        func.apply(this, args);
      }, remaining);
    }
  };
}

/**
 * 防抖函数（用于性能优化）
 */
export function debounce<T extends (...args: unknown[]) => unknown>(
  func: T,
  wait: number,
  immediate = false
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout | null = null;

  return function (this: unknown, ...args: Parameters<T>) {
    const callNow = immediate && !timeout;

    if (timeout) {
      clearTimeout(timeout);
    }

    timeout = setTimeout(() => {
      timeout = null;
      if (!immediate) {
        func.apply(this, args);
      }
    }, wait);

    if (callNow) {
      func.apply(this, args);
    }
  };
}

/**
 * 批处理更新
 */
export class BatchProcessor<T> {
  private items: T[] = [];
  private timer: NodeJS.Timeout | null = null;

  constructor(
    private processFn: (items: T[]) => void,
    private delay: number = 100,
    private batchSize: number = 10
  ) {}

  add(item: T): void {
    this.items.push(item);

    if (this.items.length >= this.batchSize) {
      this.flush();
    } else {
      this.schedule();
    }
  }

  private schedule(): void {
    if (this.timer) return;

    this.timer = setTimeout(() => {
      this.flush();
    }, this.delay);
  }

  private flush(): void {
    if (this.timer) {
      clearTimeout(this.timer);
      this.timer = null;
    }

    if (this.items.length > 0) {
      this.processFn([...this.items]);
      this.items = [];
    }
  }

  flushNow(): void {
    this.flush();
  }
}
