/**
 * Performance Helper Functions
 * Utilities for performance optimization
 */

/**
 * Throttle function - limits the rate at which a function can fire
 */
export function throttle<T extends (...args: any[]) => any>(
  func: T,
  delay: number
): (...args: Parameters<T>) => void {
  let lastCall = 0;
  let timeoutId: NodeJS.Timeout | null = null;

  return function (this: any, ...args: Parameters<T>) {
    const now = Date.now();
    const remaining = delay - (now - lastCall);

    if (remaining <= 0) {
      if (timeoutId) {
        clearTimeout(timeoutId);
        timeoutId = null;
      }
      lastCall = now;
      func.apply(this, args);
    } else if (!timeoutId) {
      timeoutId = setTimeout(() => {
        lastCall = Date.now();
        timeoutId = null;
        func.apply(this, args);
      }, remaining);
    }
  };
}

/**
 * Debounce function - delays function execution until after wait time has elapsed
 */
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  delay: number
): (...args: Parameters<T>) => void {
  let timeoutId: NodeJS.Timeout | null = null;

  return function (this: any, ...args: Parameters<T>) {
    if (timeoutId) {
      clearTimeout(timeoutId);
    }

    timeoutId = setTimeout(() => {
      func.apply(this, args);
    }, delay);
  };
}

/**
 * Request animation frame throttle
 */
export function rafThrottle<T extends (...args: any[]) => any>(func: T): (...args: Parameters<T>) => void {
  let rafId: number | null = null;

  return function (this: any, ...args: Parameters<T>) {
    if (rafId !== null) {
      cancelAnimationFrame(rafId);
    }

    rafId = requestAnimationFrame(() => {
      func.apply(this, args);
      rafId = null;
    });
  };
}

/**
 * Performance measurement utility
 */
export class PerformanceMeasure {
  private marks: Map<string, number> = new Map();

  mark(name: string): void {
    this.marks.set(name, performance.now());
  }

  measure(name: string, startMark: string, endMark?: string): number {
    const start = this.marks.get(startMark);
    if (!start) {
      console.warn(`Mark "${startMark}" not found`);
      return 0;
    }

    const end = endMark ? this.marks.get(endMark) : performance.now();
    if (!end) {
      console.warn(`Mark "${endMark}" not found`);
      return 0;
    }

    const duration = end - start;
    console.log(`[Performance] ${name}: ${duration.toFixed(2)}ms`);
    return duration;
  }

  clear(): void {
    this.marks.clear();
  }
}

/**
 * Format bytes to human readable format
 */
export function formatBytes(bytes: number, decimals = 2): string {
  if (bytes === 0) return '0 Bytes';

  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];

  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
}

/**
 * Format duration to human readable format
 */
export function formatDuration(ms: number): string {
  const seconds = Math.floor(ms / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);

  if (hours > 0) {
    return `${hours}h ${minutes % 60}m ${seconds % 60}s`;
  } else if (minutes > 0) {
    return `${minutes}m ${seconds % 60}s`;
  } else {
    return `${seconds}s`;
  }
}

/**
 * Lazy load images with Intersection Observer
 */
export function lazyLoadImages(selector: string = 'img[data-src]') {
  if (typeof window === 'undefined' || !('IntersectionObserver' in window)) {
    return;
  }

  const imageObserver = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const img = entry.target as HTMLImageElement;
          const src = img.getAttribute('data-src');

          if (src) {
            img.src = src;
            img.removeAttribute('data-src');
            observer.unobserve(img);
          }
        }
      });
    },
    {
      rootMargin: '50px 0px',
      threshold: 0.01,
    }
  );

  const images = document.querySelectorAll(selector);
  images.forEach((img) => imageObserver.observe(img));

  return imageObserver;
}

/**
 * Preload critical resources
 */
export function preloadResources(urls: string[], as: 'script' | 'style' | 'image' | 'font') {
  urls.forEach((url) => {
    const link = document.createElement('link');
    link.rel = 'preload';
    link.href = url;
    link.as = as;
    document.head.appendChild(link);
  });
}

/**
 * Defer non-critical CSS
 */
export function deferCSS(href: string) {
  const link = document.createElement('link');
  link.rel = 'preload';
  link.as = 'style';
  link.href = href;
  link.onload = function () {
    (this as any).rel = 'stylesheet';
  };
  document.head.appendChild(link);
}

/**
 * Measure Web Vitals
 */
export function measureWebVitals() {
  if (typeof window === 'undefined') return;

  // Largest Contentful Paint
  if ('PerformanceObserver' in window) {
    try {
      const lcpObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        const lastEntry = entries[entries.length - 1] as any;
        console.log(`[Web Vitals] LCP: ${Math.round(lastEntry.renderTime || lastEntry.loadTime)}ms`);
      });
      lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] });

      // First Input Delay
      const fidObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        entries.forEach((entry: any) => {
          console.log(`[Web Vitals] FID: ${Math.round(entry.processingStart - entry.startTime)}ms`);
        });
      });
      fidObserver.observe({ entryTypes: ['first-input'] });

      // Cumulative Layout Shift
      let clsValue = 0;
      const clsObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        entries.forEach((entry: any) => {
          if (!entry.hadRecentInput) {
            clsValue += entry.value;
            console.log(`[Web Vitals] CLS: ${clsValue.toFixed(3)}`);
          }
        });
      });
      clsObserver.observe({ entryTypes: ['layout-shift'] });
    } catch (e) {
      console.warn('Web Vitals measurement failed:', e);
    }
  }
}
