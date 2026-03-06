/**
 * Performance monitoring hooks
 */

import { useState, useEffect, useRef, useCallback } from 'react';

export interface PerformanceMetrics {
  fcp: number; // First Contentful Paint
  lcp: number; // Largest Contentful Paint
  fid: number; // First Input Delay
  cls: number; // Cumulative Layout Shift
  ttfb: number; // Time to First Byte
}

/**
 * Use Web Vitals to monitor core performance metrics
 */
export function useWebVitals() {
  const [metrics, setMetrics] = useState<Partial<PerformanceMetrics>>({});
  const [isMeasured, setIsMeasured] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined' || !('PerformanceObserver' in window)) {
      return;
    }

    const measureWebVitals = () => {
      // FCP - First Contentful Paint
      try {
        const fcpEntries = performance.getEntriesByName('first-contentful-paint');
        if (fcpEntries.length > 0) {
          const fcp = fcpEntries[0] as PerformanceEntry;
          setMetrics(prev => ({ ...prev, fcp: Math.round(fcp.startTime) }));
        }
      } catch (e) {
        console.warn('FCP measurement failed:', e);
      }

      // LCP - Largest Contentful Paint
      try {
        const lcpObserver = new PerformanceObserver((list) => {
          const entries = list.getEntries();
          const lastEntry = entries[entries.length - 1];
          setMetrics(prev => ({ ...prev, lcp: Math.round(lastEntry.startTime) }));
        });

        lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] });

        return () => lcpObserver.disconnect();
      } catch (e) {
        console.warn('LCP measurement failed:', e);
      }

      // FID - First Input Delay
      try {
        const fidObserver = new PerformanceObserver((list) => {
          const entries = list.getEntries();
          entries.forEach((entry: any) => {
            setMetrics(prev => ({ ...prev, fid: Math.round(entry.processingStart - entry.startTime) }));
          });
        });

        fidObserver.observe({ entryTypes: ['first-input'] });

        return () => fidObserver.disconnect();
      } catch (e) {
        console.warn('FID measurement failed:', e);
      }

      // CLS - Cumulative Layout Shift
      try {
        let clsValue = 0;
        const clsObserver = new PerformanceObserver((list) => {
          list.getEntries().forEach((entry: any) => {
            if (!entry.hadRecentInput) {
              clsValue += entry.value;
              setMetrics(prev => ({ ...prev, cls: Math.round(clsValue * 1000) / 1000 }));
            }
          });
        });

        clsObserver.observe({ entryTypes: ['layout-shift'] });

        return () => clsObserver.disconnect();
      } catch (e) {
        console.warn('CLS measurement failed:', e);
      }

      // TTFB - Time to First Byte
      try {
        const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
        if (navigation) {
          const ttfb = navigation.responseStart - navigation.requestStart;
          setMetrics(prev => ({ ...prev, ttfb: Math.round(ttfb) }));
        }
      } catch (e) {
        console.warn('TTFB measurement failed:', e);
      }

      setIsMeasured(true);
    };

    measureWebVitals();
  }, []);

  return { metrics, isMeasured };
}

/**
 * Measure render time of a component
 */
export function useRenderTime(componentName: string) {
  const startTime = useRef<number>();
  const endTime = useRef<number>();
  const [renderTime, setRenderTime] = useState<number>(0);

  useEffect(() => {
    startTime.current = performance.now();

    return () => {
      endTime.current = performance.now();
      const time = endTime.current - startTime.current;
      setRenderTime(time);

      if (typeof window !== 'undefined' && (window as any).gtag) {
        (window as any).gtag('event', 'timing_complete', {
          name: componentName,
          value: Math.round(time),
          event_category: 'Render Time'
        });
      }
    };
  }, [componentName]);

  return renderTime;
}

/**
 * Monitor memory usage
 */
export function useMemoryMonitor() {
  const [memoryInfo, setMemoryInfo] = useState<{
    usedJSHeapSize: number;
    totalJSHeapSize: number;
    jsHeapSizeLimit: number;
  } | null>(null);

  useEffect(() => {
    if (typeof window === 'undefined' || !(performance as any).memory) {
      return;
    }

    const updateMemoryInfo = () => {
      const memory = (performance as any).memory;
      setMemoryInfo({
        usedJSHeapSize: Math.round(memory.usedJSHeapSize / 1048576), // Convert to MB
        totalJSHeapSize: Math.round(memory.totalJSHeapSize / 1048576),
        jsHeapSizeLimit: Math.round(memory.jsHeapSizeLimit / 1048576)
      });
    };

    updateMemoryInfo();
    const interval = setInterval(updateMemoryInfo, 5000);

    return () => clearInterval(interval);
  }, []);

  return memoryInfo;
}

/**
 * Monitor network status
 */
export function useNetworkStatus() {
  const [isOnline, setIsOnline] = useState(true);
  const [networkInfo, setNetworkInfo] useState<{
    type: string;
    effectiveType: string;
    downlink: number;
    rtt: number;
  } | null>(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const updateOnlineStatus = () => setIsOnline(navigator.onLine);

    const updateNetworkInfo = () => {
      const connection = (navigator as any).connection || (navigator as any).mozConnection || (navigator as any).webkitConnection;
      if (connection) {
        setNetworkInfo({
          type: connection.type || 'unknown',
          effectiveType: connection.effectiveType || 'unknown',
          downlink: connection.downlink || 0,
          rtt: connection.rtt || 0
        });
      }
    };

    window.addEventListener('online', updateOnlineStatus);
    window.addEventListener('offline', updateOnlineStatus);

    updateOnlineStatus();
    updateNetworkInfo();

    if ((navigator as any).connection) {
      (navigator as any).connection.addEventListener('change', updateNetworkInfo);
    }

    return () => {
      window.removeEventListener('online', updateOnlineStatus);
      window.removeEventListener('offline', updateOnlineStatus);

      if ((navigator as any).connection) {
        (navigator as any).connection.removeEventListener('change', updateNetworkInfo);
      }
    };
  }, []);

  return { isOnline, networkInfo };
}

/**
 * Track component mount time
 */
export function useMountTime() {
  const mountTime = useRef<number>();

  useEffect(() => {
    mountTime.current = performance.now();
  }, []);

  return mountTime.current;
}

/**
 * Performance decorator for expensive operations
 */
export function usePerformanceMonitor() {
  const measure = useCallback(async <T>(
    name: string,
    fn: () => Promise<T>
  ): Promise<T> => {
    const start = performance.now();

    try {
      const result = await fn();
      const duration = performance.now() - start;

      if (typeof window !== 'undefined' && (window as any).gtag) {
        (window as any).gtag('event', 'timing_complete', {
          name,
          value: Math.round(duration),
          event_category: 'Performance'
        });
      }

      console.log(`[Performance] ${name}: ${Math.round(duration)}ms`);

      return result;
    } catch (error) {
      const duration = performance.now() - start;
      console.error(`[Performance Error] ${name}: ${Math.round(duration)}ms`, error);
      throw error;
    }
  }, []);

  return { measure };
}
