/**
 * Performance Monitoring Utility
 * Tracks and reports web vitals and custom performance metrics
 */

import { Metric } from 'web-vitals';

export interface PerformanceReport {
  // Core Web Vitals
  LCP?: number; // Largest Contentful Paint (good: <2.5s)
  FID?: number; // First Input Delay (good: <100ms)
  CLS?: number; // Cumulative Layout Shift (good: <0.1)
  FCP?: number; // First Contentful Paint (good: <1.8s)
  TTFB?: number; // Time to First Byte (good: <800ms)

  // Custom metrics
  renderTime?: number;
  apiResponseTime?: number;
  pageLoadTime?: number;

  // Navigation timing
  domContentLoaded?: number;
  loadComplete?: number;

  // Resource timing
  resourceCount?: number;
  totalResourceSize?: number;

  // Memory (if available)
  usedMemory?: number;
  totalMemory?: number;
}

export class PerformanceMonitor {
  private metrics: Partial<PerformanceReport> = {};
  private observers: PerformanceObserver[] = [];
  private reportUrl: string;
  private isEnabled: boolean;

  constructor(reportUrl?: string, enabled = true) {
    this.reportUrl = reportUrl || '/api/analytics/performance';
    this.isEnabled = enabled;
  }

  /**
   * Initialize performance monitoring
   */
  async init(): Promise<void> {
    if (typeof window === 'undefined' || !this.isEnabled) {
      return;
    }

    try {
      // Import web-vitals dynamically
      const { getCLS, getFID, getFCP, getLCP, getTTFB } = await import('web-vitals');

      // Core Web Vitals
      getCLS((metric) => this.recordMetric('CLS', metric.value));
      getFID((metric) => this.recordMetric('FID', metric.value));
      getFCP((metric) => this.recordMetric('FCP', metric.value));
      getLCP((metric) => this.recordMetric('LCP', metric.value));
      getTTFB((metric) => this.recordMetric('TTFB', metric.value));

      // Navigation timing
      this.observeNavigationTiming();

      // Resource timing
      this.observeResourceTiming();

      // Memory (Chrome only)
      this.observeMemory();

      console.log('[Performance] Monitoring initialized');
    } catch (error) {
      console.error('[Performance] Initialization failed:', error);
    }
  }

  /**
   * Record a performance metric
   */
  recordMetric(name: keyof PerformanceReport, value: number): void {
    this.metrics[name] = value;

    // Log in development
    if (process.env.NODE_ENV === 'development') {
      console.log(`[Performance] ${name}:`, value, this.getRating(name, value));
    }
  }

  /**
   * Get performance rating
   */
  private getRating(name: keyof PerformanceReport, value: number): 'good' | 'needs-improvement' | 'poor' {
    const thresholds: Record<string, { good: number; poor: number }> = {
      LCP: { good: 2500, poor: 4000 },
      FID: { good: 100, poor: 300 },
      CLS: { good: 0.1, poor: 0.25 },
      FCP: { good: 1800, poor: 3000 },
      TTFB: { good: 800, poor: 1800 },
    };

    const threshold = thresholds[name as string];
    if (!threshold) return 'good';

    if (value <= threshold.good) return 'good';
    if (value <= threshold.poor) return 'needs-improvement';
    return 'poor';
  }

  /**
   * Observe navigation timing
   */
  private observeNavigationTiming(): void {
    if (typeof window === 'undefined' || !window.performance) return;

    window.addEventListener('load', () => {
      setTimeout(() => {
        const perfData = window.performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;

        if (perfData) {
          this.recordMetric('domContentLoaded', perfData.domContentLoadedEventEnd - perfData.domContentLoadedEventStart);
          this.recordMetric('loadComplete', perfData.loadEventEnd - perfData.loadEventStart);
          this.recordMetric('pageLoadTime', perfData.loadEventEnd - perfData.fetchStart);
        }
      }, 0);
    });
  }

  /**
   * Observe resource timing
   */
  private observeResourceTiming(): void {
    if (typeof window === 'undefined' || !window.PerformanceObserver) return;

    try {
      const observer = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        let totalSize = 0;

        entries.forEach((entry: any) => {
          if (entry.transferSize) {
            totalSize += entry.transferSize;
          }
        });

        this.metrics.resourceCount = entries.length;
        this.metrics.totalResourceSize = totalSize;
      });

      observer.observe({ entryTypes: ['resource'] });
      this.observers.push(observer);
    } catch (error) {
      console.error('[Performance] Resource observation failed:', error);
    }
  }

  /**
   * Observe memory usage (Chrome only)
   */
  private observeMemory(): void {
    if (typeof window === 'undefined' || !(performance as any).memory) return;

    const checkMemory = () => {
      const memory = (performance as any).memory;
      if (memory) {
        this.metrics.usedMemory = memory.usedJSHeapSize;
        this.metrics.totalMemory = memory.totalJSHeapSize;
      }
    };

    // Check memory periodically
    const interval = setInterval(checkMemory, 10000);

    // Cleanup on page unload
    window.addEventListener('unload', () => {
      clearInterval(interval);
    });
  }

  /**
   * Measure custom timing
   */
  measure(name: string, startMark: string, endMark: string): void {
    if (typeof window === 'undefined' || !window.performance) return;

    try {
      performance.measure(name, startMark, endMark);
      const measure = performance.getEntriesByName(name)[0];

      if (measure) {
        this.recordMetric(name as keyof PerformanceReport, measure.duration);
      }
    } catch (error) {
      console.error('[Performance] Measure failed:', error);
    }
  }

  /**
   * Mark a performance timestamp
   */
  mark(name: string): void {
    if (typeof window === 'undefined' || !window.performance) return;

    try {
      performance.mark(name);
    } catch (error) {
      console.error('[Performance] Mark failed:', error);
    }
  }

  /**
   * Get current metrics
   */
  getMetrics(): PerformanceReport {
    return { ...this.metrics };
  }

  /**
   * Get metrics summary
   */
  getSummary(): {
    score: number;
    issues: string[];
    recommendations: string[];
  } {
    const issues: string[] = [];
    const recommendations: string[] = [];
    let score = 100;

    // Check LCP
    if (this.metrics.LCP) {
      if (this.metrics.LCP > 4000) {
        issues.push('Largest Contentful Paint is too slow');
        recommendations.push('Optimize LCP by reducing server response time and optimizing images');
        score -= 20;
      } else if (this.metrics.LCP > 2500) {
        recommendations.push('Consider optimizing LCP further');
        score -= 10;
      }
    }

    // Check FID
    if (this.metrics.FID) {
      if (this.metrics.FID > 300) {
        issues.push('First Input Delay is too high');
        recommendations.push('Reduce JavaScript execution time and split long tasks');
        score -= 20;
      } else if (this.metrics.FID > 100) {
        recommendations.push('Consider reducing FID further');
        score -= 10;
      }
    }

    // Check CLS
    if (this.metrics.CLS) {
      if (this.metrics.CLS > 0.25) {
        issues.push('Cumulative Layout Shift is too high');
        recommendations.push('Reserve space for images and dynamic content');
        score -= 20;
      } else if (this.metrics.CLS > 0.1) {
        recommendations.push('Consider reducing layout shifts');
        score -= 10;
      }
    }

    return {
      score: Math.max(0, score),
      issues,
      recommendations,
    };
  }

  /**
   * Report metrics to server
   */
  async report(): Promise<void> {
    if (!this.reportUrl || typeof window === 'undefined') {
      return;
    }

    try {
      const response = await fetch(this.reportUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          metrics: this.metrics,
          summary: this.getSummary(),
          url: window.location.href,
          userAgent: navigator.userAgent,
          timestamp: Date.now(),
        }),
      });

      if (response.ok) {
        console.log('[Performance] Metrics reported successfully');
      }
    } catch (error) {
      console.error('[Performance] Reporting failed:', error);
    }
  }

  /**
   * Generate performance report
   */
  generateReport(): string {
    const metrics = this.getMetrics();
    const summary = this.getSummary();

    let report = '=== Performance Report ===\n\n';
    report += `Score: ${summary.score}/100\n\n`;

    report += 'Core Web Vitals:\n';
    if (metrics.LCP) report += `  LCP: ${metrics.LCP.toFixed(0)}ms\n`;
    if (metrics.FID) report += `  FID: ${metrics.FID.toFixed(0)}ms\n`;
    if (metrics.CLS) report += `  CLS: ${metrics.CLS.toFixed(3)}\n`;
    if (metrics.FCP) report += `  FCP: ${metrics.FCP.toFixed(0)}ms\n`;
    if (metrics.TTFB) report += `  TTFB: ${metrics.TTFB.toFixed(0)}ms\n`;

    report += '\nCustom Metrics:\n';
    if (metrics.pageLoadTime) report += `  Page Load: ${metrics.pageLoadTime.toFixed(0)}ms\n`;
    if (metrics.renderTime) report += `  Render Time: ${metrics.renderTime.toFixed(0)}ms\n`;
    if (metrics.apiResponseTime) report += `  API Response: ${metrics.apiResponseTime.toFixed(0)}ms\n`;

    if (summary.issues.length > 0) {
      report += '\nIssues:\n';
      summary.issues.forEach((issue) => {
        report += `  - ${issue}\n`;
      });
    }

    if (summary.recommendations.length > 0) {
      report += '\nRecommendations:\n';
      summary.recommendations.forEach((rec) => {
        report += `  - ${rec}\n`;
      });
    }

    return report;
  }

  /**
   * Cleanup and disconnect observers
   */
  destroy(): void {
    this.observers.forEach((observer) => observer.disconnect());
    this.observers = [];
    this.metrics = {};
  }
}

// Create singleton instance
let performanceMonitor: PerformanceMonitor | null = null;

export function getPerformanceMonitor(reportUrl?: string, enabled?: boolean): PerformanceMonitor {
  if (!performanceMonitor) {
    performanceMonitor = new PerformanceMonitor(reportUrl, enabled);
  }
  return performanceMonitor;
}

export default PerformanceMonitor;
