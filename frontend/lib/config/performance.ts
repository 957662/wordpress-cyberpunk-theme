/**
 * 性能监控和优化配置
 * Performance Monitoring and Optimization Configuration
 */

import { ReportHandler } from 'web-vitals';

export interface PerformanceConfig {
  enabled: boolean;
  sampleRate: number;
  reportWebVitals: boolean;
  enableAnalytics: boolean;
  enablePerformanceObserver: boolean;
  enableResourceTiming: boolean;
  enableUserTiming: boolean;
  thresholds: {
    FCP?: number; // First Contentful Paint (ms)
    LCP?: number; // Largest Contentful Paint (ms)
    FID?: number; // First Input Delay (ms)
    CLS?: number; // Cumulative Layout Shift
    TTI?: number; // Time to Interactive (ms)
    TBT?: number; // Total Blocking Time (ms)
  };
}

/**
 * Default performance configuration
 */
export const defaultPerformanceConfig: PerformanceConfig = {
  enabled: process.env.NODE_ENV === 'production',
  sampleRate: 0.1, // Sample 10% of users
  reportWebVitals: true,
  enableAnalytics: true,
  enablePerformanceObserver: true,
  enableResourceTiming: true,
  enableUserTiming: true,
  thresholds: {
    FCP: 1800,
    LCP: 2500,
    FID: 100,
    CLS: 0.1,
    TTI: 3800,
    TBT: 300,
  },
};

/**
 * Report Web Vitals to analytics
 */
export function reportWebVitals(onPerfEntry?: ReportHandler): void {
  if (onPerfEntry && onPerfEntry instanceof Function) {
    import('web-vitals').then(({ getCLS, getFID, getFCP, getLCP, getTTFB }) => {
      getCLS(onPerfEntry);
      getFID(onPerfEntry);
      getFCP(onPerfEntry);
      getLCP(onPerfEntry);
      getTTFB(onPerfEntry);
    });
  }
}

/**
 * Check if performance metric is good
 */
export function isGoodPerformanceMetric(
  metric: string,
  value: number,
  config: PerformanceConfig = defaultPerformanceConfig
): boolean {
  const threshold = config.thresholds[metric as keyof typeof config.thresholds];
  if (!threshold) return true;

  // For CLS, lower is better
  if (metric === 'CLS') {
    return value <= threshold;
  }

  // For other metrics, higher is better
  return value <= threshold;
}

/**
 * Get performance rating
 */
export function getPerformanceRating(
  metric: string,
  value: number
): 'good' | 'needs-improvement' | 'poor' {
  const ratings: Record<string, { good: number; poor: number }> = {
    FCP: { good: 1800, poor: 3000 },
    LCP: { good: 2500, poor: 4000 },
    FID: { good: 100, poor: 300 },
    CLS: { good: 0.1, poor: 0.25 },
    TTFB: { good: 800, poor: 1800 },
  };

  const rating = ratings[metric];
  if (!rating) return 'good';

  if (metric === 'CLS') {
    if (value <= rating.good) return 'good';
    if (value <= rating.poor) return 'needs-improvement';
    return 'poor';
  } else {
    if (value <= rating.good) return 'good';
    if (value <= rating.poor) return 'needs-improvement';
    return 'poor';
  }
}

/**
 * Monitor page load performance
 */
export class PerformanceMonitor {
  private config: PerformanceConfig;
  private metrics: Map<string, number> = new Map();

  constructor(config: Partial<PerformanceConfig> = {}) {
    this.config = { ...defaultPerformanceConfig, ...config };
    if (typeof window !== 'undefined' && this.config.enabled) {
      this.initialize();
    }
  }

  private initialize(): void {
    if (this.config.enablePerformanceObserver) {
      this.observePerformance();
    }

    if (this.config.enableResourceTiming) {
      this.observeResources();
    }

    if (this.config.enableUserTiming) {
      this.observeUserTiming();
    }
  }

  private observePerformance(): void {
    if (!('PerformanceObserver' in window)) return;

    const observer = new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        this.metrics.set(entry.name, entry.startTime);
      }
    });

    try {
      observer.observe({ entryTypes: ['measure', 'navigation'] });
    } catch (e) {
      // Ignore if not supported
    }
  }

  private observeResources(): void {
    if (!('PerformanceObserver' in window)) return;

    const observer = new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        if (entry.entryType === 'resource') {
          const resourceEntry = entry as PerformanceResourceTiming;
          this.metrics.set(
            `resource-${resourceEntry.name}`,
            resourceEntry.duration
          );
        }
      }
    });

    try {
      observer.observe({ entryTypes: ['resource'] });
    } catch (e) {
      // Ignore if not supported
    }
  }

  private observeUserTiming(): void {
    if (!('PerformanceObserver' in window)) return;

    const observer = new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        if (entry.entryType === 'measure') {
          this.metrics.set(`measure-${entry.name}`, entry.duration);
        }
      }
    });

    try {
      observer.observe({ entryTypes: ['measure'] });
    } catch (e) {
      // Ignore if not supported
    }
  }

  /**
   * Get all collected metrics
   */
  getMetrics(): Record<string, number> {
    return Object.fromEntries(this.metrics);
  }

  /**
   * Get specific metric
   */
  getMetric(name: string): number | undefined {
    return this.metrics.get(name);
  }

  /**
   * Mark a performance measurement
   */
  mark(name: string): void {
    if (typeof performance !== 'undefined') {
      performance.mark(name);
    }
  }

  /**
   * Measure performance between two marks
   */
  measure(name: string, startMark: string, endMark: string): void {
    if (typeof performance !== 'undefined') {
      try {
        performance.measure(name, startMark, endMark);
        const measure = performance.getEntriesByName(name, 'measure')[0];
        if (measure) {
          this.metrics.set(name, measure.duration);
        }
      } catch (e) {
        console.error('Error measuring performance:', e);
      }
    }
  }

  /**
   * Clear all metrics
   */
  clearMetrics(): void {
    this.metrics.clear();
  }

  /**
   * Get performance summary
   */
  getSummary(): {
    totalMetrics: number;
    avgMetricValue: number;
    slowestMetric: { name: string; value: number };
    fastestMetric: { name: string; value: number };
  } {
    const values = Array.from(this.metrics.values());

    if (values.length === 0) {
      return {
        totalMetrics: 0,
        avgMetricValue: 0,
        slowestMetric: { name: 'N/A', value: 0 },
        fastestMetric: { name: 'N/A', value: 0 },
      };
    }

    const entries = Array.from(this.metrics.entries());
    const sorted = entries.sort((a, b) => b[1] - a[1]);

    return {
      totalMetrics: this.metrics.size,
      avgMetricValue: values.reduce((a, b) => a + b, 0) / values.length,
      slowestMetric: { name: sorted[0][0], value: sorted[0][1] },
      fastestMetric: {
        name: sorted[sorted.length - 1][0],
        value: sorted[sorted.length - 1][1],
      },
    };
  }
}

/**
 * Lazy load components with performance tracking
 */
export function lazyLoadWithTracking<T>(
  importFunc: () => Promise<{ default: T }>,
  componentName: string
) {
  return async (): Promise<{ default: T }> => {
    const monitor = new PerformanceMonitor();
    monitor.mark(`${componentName}-load-start`);

    try {
      const module = await importFunc();
      monitor.mark(`${componentName}-load-end`);
      monitor.measure(
        `${componentName}-load-time`,
        `${componentName}-load-start`,
        `${componentName}-load-end`
      );

      const loadTime = monitor.getMetric(`${componentName}-load-time`);
      if (loadTime && loadTime > 3000) {
        console.warn(
          `[Performance] ${componentName} took ${loadTime.toFixed(2)}ms to load`
        );
      }

      return module;
    } catch (error) {
      console.error(`[Performance] Failed to load ${componentName}:`, error);
      throw error;
    }
  };
}

/**
 * Debounce function with performance consideration
 */
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number,
  immediate = false
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout | null = null;

  return function executedFunction(...args: Parameters<T>) {
    const later = () => {
      timeout = null;
      if (!immediate) func(...args);
    };

    const callNow = immediate && !timeout;
    if (timeout) clearTimeout(timeout);
    timeout = setTimeout(later, wait);

    if (callNow) func(...args);
  };
}

/**
 * Throttle function with performance consideration
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
 * Request animation frame throttle
 */
export function rafThrottle<T extends (...args: any[]) => any>(
  callback: T
): (...args: Parameters<T>) => void {
  let requestId: number | null = null;

  return (...args: Parameters<T>) => {
    if (requestId === null) {
      requestId = requestAnimationFrame(() => {
        callback(...args);
        requestId = null;
      });
    }
  };
}

// Export singleton instance
export const performanceMonitor = new PerformanceMonitor();
