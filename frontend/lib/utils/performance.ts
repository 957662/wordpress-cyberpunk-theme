/**
 * 性能优化工具函数
 */

/**
 * 防抖函数
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

    if (timeout) clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

/**
 * 节流函数
 */
export function throttle<T extends (...args: any[]) => any>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle: boolean;

  return function executedFunction(...args: Parameters<T>) {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
}

/**
 * 请求动画帧节流
 */
export function rafThrottle<T extends (...args: any[]) => any>(callback: T): T {
  let requestPending: boolean = false;

  return ((...args: Parameters<T>) => {
    if (requestPending) return;

    requestPending = true;
    requestAnimationFrame(() => {
      callback(...args);
      requestPending = false;
    });
  }) as T;
}

/**
 * 延迟执行
 */
export function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * 批量处理
 */
export async function batchProcess<T, R>(
  items: T[],
  processor: (item: T) => Promise<R>,
  batchSize: number = 10
): Promise<R[]> {
  const results: R[] = [];

  for (let i = 0; i < items.length; i += batchSize) {
    const batch = items.slice(i, i + batchSize);
    const batchResults = await Promise.all(batch.map(processor));
    results.push(...batchResults);

    // 让出控制权,避免阻塞
    await delay(0);
  }

  return results;
}

/**
 * 缓存函数结果
 */
export function memoize<T extends (...args: any[]) => any>(
  func: T,
  keyGenerator?: (...args: Parameters<T>) => string
): T {
  const cache = new Map<string, ReturnType<T>>();

  return ((...args: Parameters<T>) => {
    const key = keyGenerator ? keyGenerator(...args) : JSON.stringify(args);

    if (cache.has(key)) {
      return cache.get(key);
    }

    const result = func(...args);
    cache.set(key, result);
    return result;
  }) as T;
}

/**
 * 测量函数执行时间
 */
export function measureTime<T extends (...args: any[]) => any>(
  func: T,
  label?: string
): T {
  return ((...args: Parameters<T>) => {
    const start = performance.now();
    const result = func(...args);
    const end = performance.now();

    console.log(\`\${label || func.name} took \${(end - start).toFixed(2)}ms\`);
    return result;
  }) as T;
}

/**
 * 异步测量执行时间
 */
export async function measureTimeAsync<T>(
  func: () => Promise<T>,
  label?: string
): Promise<T> {
  const start = performance.now();
  const result = await func();
  const end = performance.now();

  console.log(\`\${label || 'Async operation'} took \${(end - start).toFixed(2)}ms\`);
  return result;
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
    return \`\${hours}h \${minutes % 60}m\`;
  } else if (minutes > 0) {
    return \`\${minutes}m \${seconds % 60}s\`;
  } else {
    return \`\${seconds}s\`;
  }
}

/**
 * 获取性能指标
 */
export function getPerformanceMetrics() {
  if (typeof window === 'undefined') return null;

  const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
  const paint = performance.getEntriesByType('paint');

  return {
    // 导航时间
    domContentLoaded: navigation?.domContentLoadedEventEnd - navigation?.domContentLoadedEventStart,
    loadComplete: navigation?.loadEventEnd - navigation?.loadEventStart,
    // 页面加载时间
    pageLoadTime: navigation?.loadEventEnd - navigation?.fetchStart,
    // DNS 查询时间
    dnsTime: navigation?.domainLookupEnd - navigation?.domainLookupStart,
    // TCP 连接时间
    tcpTime: navigation?.connectEnd - navigation?.connectStart,
    // 请求响应时间
    requestTime: navigation?.responseEnd - navigation?.requestStart,
    // 渲染时间
    renderTime: navigation?.domComplete - navigation?.domInteractive,
    // 首次绘制
    firstPaint: paint.find((p) => p.name === 'first-paint')?.startTime,
    firstContentfulPaint: paint.find((p) => p.name === 'first-contentful-paint')?.startTime,
  };
}

/**
 * 清理资源
 */
export function cleanupResources() {
  if (typeof window === 'undefined') return;

  // 清理 Performance entries
  if ('clearResourceTimings' in performance) {
    performance.clearResourceTimings();
  }

  // 强制垃圾回收 (开发环境)
  if (process.env.NODE_ENV === 'development' && (global as any).gc) {
    (global as any).gc();
  }
}
