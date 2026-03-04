// 性能优化工具函数

/**
 * 防抖函数 - 延迟执行函数
 */
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout | null = null;

  return function executedFunction(...args: Parameters<T>) {
    const later = () => {
      timeout = null;
      func(...args);
    };

    if (timeout) {
      clearTimeout(timeout);
    }
    timeout = setTimeout(later, wait);
  };
}

/**
 * 节流函数 - 限制函数执行频率
 */
export function throttle<T extends (...args: any[]) => any>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle: boolean = false;

  return function executedFunction(...args: Parameters<T>) {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
}

/**
 * 请求空闲回调执行任务
 */
export function runWhenIdle(callback: () => void, timeout?: number): void {
  if ('requestIdleCallback' in window) {
    (window as any).requestIdleCallback(callback, { timeout });
  } else {
    // 降级处理
    setTimeout(callback, 1);
  }
}

/**
 * 批量更新 DOM
 */
export function batchUpdates(updates: (() => void)[]): void {
  if ('scheduler' in window) {
    // 使用 React Scheduler
    (window as any).scheduler.scheduleWork(() => {
      updates.forEach((update) => update());
    });
  } else {
    updates.forEach((update) => update());
  }
}

/**
 * 预加载图片
 */
export function preloadImage(src: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve();
    img.onerror = reject;
    img.src = src;
  });
}

/**
 * 批量预加载图片
 */
export async function preloadImages(srcs: string[]): Promise<void[]> {
  return Promise.all(srcs.map((src) => preloadImage(src)));
}

/**
 * 获取 Web Vitals 指标
 */
export function getWebVitals() {
  return {
    // First Contentful Paint
    getFCP: () => {
      const entry = performance.getEntriesByName('first-contentful-paint')[0];
      return entry ? entry.startTime : 0;
    },

    // Largest Contentful Paint
    getLCP: () => {
      const entries = performance.getEntriesByType('largest-contentful-paint');
      return entries.length > 0 ? entries[entries.length - 1].startTime : 0;
    },

    // First Input Delay
    getFID: () => {
      const entries = performance.getEntriesByType('first-input');
      return entries.length > 0 ? (entries[0] as any).processingStart - entries[0].startTime : 0;
    },

    // Cumulative Layout Shift
    getCLS: () => {
      let clsValue = 0;
      const entries = performance.getEntriesByType('layout-shift');
      entries.forEach((entry: any) => {
        if (!entry.hadRecentInput) {
          clsValue += entry.value;
        }
      });
      return clsValue;
    },

    // Time to First Byte
    getTTFB: () => {
      const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
      return navigation ? navigation.responseStart - navigation.requestStart : 0;
    },
  };
}

/**
 * 测量函数执行时间
 */
export function measurePerformance<T extends (...args: any[]) => any>(
  func: T,
  label: string
): T {
  return ((...args: any[]) => {
    const start = performance.now();
    const result = func(...args);
    const end = performance.now();

    console.log(`[Performance] ${label}: ${end - start}ms`);

    return result;
  }) as T;
}

/**
 * 内存使用情况
 */
export function getMemoryUsage() {
  if ('memory' in performance) {
    const memory = (performance as any).memory;
    return {
      usedJSHeapSize: memory.usedJSHeapSize,
      totalJSHeapSize: memory.totalJSHeapSize,
      jsHeapSizeLimit: memory.jsHeapSizeLimit,
    };
  }
  return null;
}

/**
 * 监控长任务
 */
export function observeLongTasks(callback: (entries: PerformanceEntry[]) => void): () => void {
  if ('PerformanceObserver' in window) {
    try {
      const observer = new PerformanceObserver((list) => {
        callback(list.getEntries());
      });
      observer.observe({ entryTypes: ['longtask'] });

      return () => observer.disconnect();
    } catch (e) {
      console.error('[Performance] Long task observer error:', e);
    }
  }

  return () => {};
}

/**
 * 获取网络信息
 */
export function getNetworkInfo() {
  if ('connection' in navigator) {
    const connection = (navigator as any).connection;
    return {
      effectiveType: connection.effectiveType,
      downlink: connection.downlink,
      rtt: connection.rtt,
      saveData: connection.saveData,
    };
  }
  return null;
}

/**
 * 懒加载图片
 */
export function lazyLoadImage(imgElement: HTMLImageElement, src: string): void {
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            imgElement.src = src;
            observer.unobserve(imgElement);
          }
        });
      },
      { rootMargin: '50px' }
    );

    observer.observe(imgElement);
  } else {
    // 降级处理
    imgElement.src = src;
  }
}

/**
 * 虚拟滚动计算
 */
export function calculateVisibleRange(
  scrollTop: number,
  containerHeight: number,
  itemHeight: number,
  totalItems: number,
  overscan: number = 3
) {
  const startIndex = Math.max(0, Math.floor(scrollTop / itemHeight) - overscan);
  const endIndex = Math.min(
    totalItems - 1,
    Math.ceil((scrollTop + containerHeight) / itemHeight) + overscan
  );

  return { startIndex, endIndex };
}

/**
 * 格式化字节大小
 */
export function formatBytes(bytes: number, decimals: number = 2): string {
  if (bytes === 0) return '0 Bytes';

  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];

  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
}

/**
 * 格式化持续时间
 */
export function formatDuration(ms: number): string {
  const seconds = Math.floor(ms / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);

  if (hours > 0) {
    return `${hours}h ${minutes % 60}m`;
  } else if (minutes > 0) {
    return `${minutes}m ${seconds % 60}s`;
  } else {
    return `${seconds}s`;
  }
}

/**
 * 创建性能标记
 */
export function markPerformance(name: string): void {
  if (performance.mark) {
    performance.mark(name);
  }
}

/**
 * 测量性能标记之间的时间
 */
export function measurePerformanceMark(name: string, startMark: string, endMark: string): number {
  if (performance.measure) {
    try {
      performance.measure(name, startMark, endMark);
      const measure = performance.getEntriesByName(name)[0];
      return measure ? measure.duration : 0;
    } catch (e) {
      console.error('[Performance] Measure error:', e);
    }
  }
  return 0;
}

/**
 * 清理性能标记
 */
export function clearPerformanceMarks(names?: string[]): void {
  if (performance.clearMarks) {
    performance.clearMarks(names);
  }
  if (performance.clearMeasures) {
    performance.clearMeasures(names);
  }
}
