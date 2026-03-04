'use client';

/**
 * Performance Monitor Component - Real-time performance tracking
 * Monitors and displays key performance metrics including:
 * - Page load times
 * - API response times
 * - Memory usage
 * - Frame rate
 * - Network requests
 */

import { useState, useEffect, useRef, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Activity, Zap, Clock, Database, Network, TrendingUp } from 'lucide-react';

// Types
interface PerformanceMetrics {
  // Navigation metrics
  pageLoadTime: number;
  domContentLoaded: number;
  firstContentfulPaint: number;

  // Resource metrics
  apiResponseTime: number;
  apiRequestCount: number;

  // Runtime metrics
  memoryUsage: number;
  memoryLimit: number;
  fps: number;

  // Network metrics
  totalRequests: number;
  totalTransferSize: number;

  // Custom metrics
  customMetrics: Record<string, number>;
}

interface PerformanceMonitorProps {
  sampleRate?: number; // Milliseconds between samples
  showDetails?: boolean;
  onMetricsUpdate?: (metrics: PerformanceMetrics) => void;
  alertThresholds?: {
    apiResponseTime?: number;
    memoryUsage?: number;
    fps?: number;
  };
}

export function PerformanceMonitor({
  sampleRate = 1000,
  showDetails = false,
  onMetricsUpdate,
  alertThresholds = {
    apiResponseTime: 1000,
    memoryUsage: 80,
    fps: 30,
  },
}: PerformanceMonitorProps) {
  const [metrics, setMetrics] = useState<PerformanceMetrics>({
    pageLoadTime: 0,
    domContentLoaded: 0,
    firstContentfulPaint: 0,
    apiResponseTime: 0,
    apiRequestCount: 0,
    memoryUsage: 0,
    memoryLimit: 0,
    fps: 0,
    totalRequests: 0,
    totalTransferSize: 0,
    customMetrics: {},
  });
  const [isVisible, setIsVisible] = useState(false);
  const [alerts, setAlerts] = useState<string[]>([]);

  const intervalRef = useRef<NodeJS.Timeout>();
  const frameTimeRef = useRef<number[]>([]);
  const lastFrameTimeRef = useRef<number>(performance.now());

  // Measure FPS
  const measureFPS = useCallback(() => {
    const currentTime = performance.now();
    const deltaTime = currentTime - lastFrameTimeRef.current;
    lastFrameTimeRef.current = currentTime;

    const fps = 1000 / deltaTime;

    // Keep last 60 frame times for smooth average
    frameTimeRef.current.push(fps);
    if (frameTimeRef.current.length > 60) {
      frameTimeRef.current.shift();
    }

    return Math.round(
      frameTimeRef.current.reduce((a, b) => a + b, 0) / frameTimeRef.current.length
    );
  }, []);

  // Get navigation timing
  const getNavigationTiming = useCallback(() => {
    if (typeof window === 'undefined' || !window.performance) {
      return { pageLoadTime: 0, domContentLoaded: 0, firstContentfulPaint: 0 };
    }

    const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
    const paint = performance.getEntriesByType('paint');

    const fcp = paint.find((entry) => entry.name === 'first-contentful-paint');

    return {
      pageLoadTime: navigation?.loadEventEnd - navigation?.startTime || 0,
      domContentLoaded: navigation?.domContentLoadedEventEnd - navigation?.startTime || 0,
      firstContentfulPaint: fcp?.startTime || 0,
    };
  }, []);

  // Get resource timing
  const getResourceTiming = useCallback(() => {
    if (typeof window === 'undefined' || !window.performance) {
      return { totalRequests: 0, totalTransferSize: 0 };
    }

    const resources = performance.getEntriesByType('resource') as PerformanceResourceTiming[];

    return {
      totalRequests: resources.length,
      totalTransferSize: resources.reduce((acc, resource) => {
        return acc + (resource.transferSize || 0);
      }, 0),
    };
  }, []);

  // Get memory info
  const getMemoryInfo = useCallback(() => {
    if (typeof window === 'undefined' || !(performance as any).memory) {
      return { memoryUsage: 0, memoryLimit: 0 };
    }

    const memory = (performance as any).memory;
    const used = memory.usedJSHeapSize || 0;
    const total = memory.totalJSHeapSize || 0;
    const limit = memory.jsHeapSizeLimit || 0;

    return {
      memoryUsage: Math.round((used / limit) * 100),
      memoryLimit: Math.round((total / limit) * 100),
    };
  }, []);

  // Collect all metrics
  const collectMetrics = useCallback(() => {
    const navigationTiming = getNavigationTiming();
    const resourceTiming = getResourceTiming();
    const memoryInfo = getMemoryInfo();
    const fps = measureFPS();

    const newMetrics: PerformanceMetrics = {
      ...navigationTiming,
      ...resourceTiming,
      ...memoryInfo,
      fps,
      apiResponseTime: metrics.apiResponseTime,
      apiRequestCount: metrics.apiRequestCount,
      customMetrics: metrics.customMetrics,
    };

    setMetrics(newMetrics);
    onMetricsUpdate?.(newMetrics);

    // Check alerts
    const newAlerts: string[] = [];
    if (alertThresholds.apiResponseTime && newMetrics.apiResponseTime > alertThresholds.apiResponseTime) {
      newAlerts.push('Slow API response detected');
    }
    if (alertThresholds.memoryUsage && newMetrics.memoryUsage > alertThresholds.memoryUsage) {
      newAlerts.push('High memory usage');
    }
    if (alertThresholds.fps && newMetrics.fps < alertThresholds.fps) {
      newAlerts.push('Low frame rate');
    }
    setAlerts(newAlerts);

    return newMetrics;
  }, [
    getNavigationTiming,
    getResourceTiming,
    getMemoryInfo,
    measureFPS,
    metrics.apiResponseTime,
    metrics.apiRequestCount,
    metrics.customMetrics,
    onMetricsUpdate,
    alertThresholds,
  ]);

  // Start monitoring
  useEffect(() => {
    if (!isVisible) return;

    // Initial collection
    collectMetrics();

    // Set up interval
    intervalRef.current = setInterval(() => {
      requestAnimationFrame(() => {
        collectMetrics();
      });
    }, sampleRate);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isVisible, sampleRate, collectMetrics]);

  // Track API calls
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const originalFetch = window.fetch;
    window.fetch = async (...args) => {
      const start = performance.now();
      const response = await originalFetch(...args);
      const end = performance.now();

      setMetrics((prev) => ({
        ...prev,
        apiResponseTime: Math.round(end - start),
        apiRequestCount: prev.apiRequestCount + 1,
      }));

      return response;
    };

    return () => {
      window.fetch = originalFetch;
    };
  }, []);

  // Format bytes
  const formatBytes = (bytes: number) => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
  };

  // Format time
  const formatTime = (ms: number) => {
    if (ms < 1000) return `${ms}ms`;
    return `${(ms / 1000).toFixed(2)}s`;
  };

  return (
    <>
      {/* Toggle button */}
      <motion.button
        onClick={() => setIsVisible(!isVisible)}
        className={`fixed bottom-4 left-4 z-50 p-3 rounded-full shadow-lg transition-colors ${
          alerts.length > 0
            ? 'bg-red-500/20 border border-red-500 text-red-500'
            : 'bg-cyber-cyan/20 border border-cyber-cyan/30 text-cyber-cyan hover:bg-cyber-cyan/30'
        }`}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
      >
        <Activity className="w-5 h-5" />
        {alerts.length > 0 && (
          <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center">
            <span className="text-xs font-bold text-white">{alerts.length}</span>
          </span>
        )}
      </motion.button>

      {/* Monitor panel */}
      <AnimatePresence>
        {isVisible && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="fixed bottom-16 left-4 w-80 bg-[#0a0a0f] border border-cyber-cyan/30 rounded-lg shadow-2xl z-50 overflow-hidden"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-cyber-cyan/20 bg-[#16162a]">
              <div className="flex items-center gap-2">
                <Activity className="w-5 h-5 text-cyber-cyan" />
                <h3 className="text-white font-semibold">Performance Monitor</h3>
              </div>
              <button
                onClick={() => setIsVisible(false)}
                className="text-gray-400 hover:text-white transition-colors"
              >
                ✕
              </button>
            </div>

            {/* Alerts */}
            {alerts.length > 0 && (
              <div className="px-4 py-3 bg-red-500/10 border-b border-red-500/20">
                {alerts.map((alert, i) => (
                  <div key={i} className="flex items-center gap-2 text-red-500 text-sm">
                    <Zap className="w-4 h-4" />
                    {alert}
                  </div>
                ))}
              </div>
            )}

            {/* Metrics */}
            <div className="p-4 space-y-4">
              {/* FPS */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-cyber-cyan" />
                  <span className="text-sm text-gray-400">Frame Rate</span>
                </div>
                <span className={`text-sm font-semibold ${
                  metrics.fps < alertThresholds.fps ? 'text-red-500' : 'text-green-500'
                }`}>
                  {metrics.fps} FPS
                </span>
              </div>

              {/* Memory */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <Database className="w-4 h-4 text-cyber-cyan" />
                    <span className="text-sm text-gray-400">Memory</span>
                  </div>
                  <span className={`text-sm font-semibold ${
                    metrics.memoryUsage > alertThresholds.memoryUsage ? 'text-red-500' : 'text-cyber-cyan'
                  }`}>
                    {metrics.memoryUsage}%
                  </span>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-2">
                  <motion.div
                    className={`h-2 rounded-full ${
                      metrics.memoryUsage > alertThresholds.memoryUsage ? 'bg-red-500' : 'bg-cyber-cyan'
                    }`}
                    initial={{ width: 0 }}
                    animate={{ width: `${metrics.memoryUsage}%` }}
                    transition={{ duration: 0.3 }}
                  />
                </div>
              </div>

              {/* Page Load */}
              {showDetails && (
                <>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-cyber-cyan" />
                      <span className="text-sm text-gray-400">Page Load</span>
                    </div>
                    <span className="text-sm font-semibold text-cyber-cyan">
                      {formatTime(metrics.pageLoadTime)}
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Network className="w-4 h-4 text-cyber-cyan" />
                      <span className="text-sm text-gray-400">Requests</span>
                    </div>
                    <span className="text-sm font-semibold text-cyber-cyan">
                      {metrics.totalRequests} ({formatBytes(metrics.totalTransferSize)})
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Zap className="w-4 h-4 text-cyber-cyan" />
                      <span className="text-sm text-gray-400">API Response</span>
                    </div>
                    <span className={`text-sm font-semibold ${
                      metrics.apiResponseTime > alertThresholds.apiResponseTime ? 'text-red-500' : 'text-cyber-cyan'
                    }`}>
                      {formatTime(metrics.apiResponseTime)}
                    </span>
                  </div>
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
