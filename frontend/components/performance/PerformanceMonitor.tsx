'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Activity, Zap, Clock, Database } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface PerformanceMetrics {
  fps: number;
  memory?: MemoryInfo;
  timing: PerformanceTiming;
  navigation: PerformanceNavigation;
  resources: PerformanceResourceTiming[];
  fcp: number;
  lcp: number;
  fid: number;
  cls: number;
  ttfb: number;
}

export interface PerformanceMonitorProps {
  showFPS?: boolean;
  showMemory?: boolean;
  showTiming?: boolean;
  showResources?: boolean;
  showCoreWebVitals?: boolean;
  position?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
  updateInterval?: number;
  className?: string;
  onMetricsUpdate?: (metrics: PerformanceMetrics) => void;
}

export const PerformanceMonitor: React.FC<PerformanceMonitorProps> = ({
  showFPS = true,
  showMemory = true,
  showTiming = false,
  showResources = false,
  showCoreWebVitals = true,
  position = 'top-right',
  updateInterval = 1000,
  className,
  onMetricsUpdate,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [metrics, setMetrics] = useState<PerformanceMetrics | null>(null);
  const [fps, setFps] = useState(0);
  const frameCount = useRef(0);
  const lastTime = useRef(Date.now());

  useEffect(() => {
    let animationFrameId: number;
    let intervalId: NodeJS.Timeout;

    // Calculate FPS
    const calculateFPS = () => {
      frameCount.current++;
      const currentTime = Date.now();
      const elapsed = currentTime - lastTime.current;

      if (elapsed >= 1000) {
        setFps(Math.round((frameCount.current * 1000) / elapsed));
        frameCount.current = 0;
        lastTime.current = currentTime;
      }

      animationFrameId = requestAnimationFrame(calculateFPS);
    };

    // Collect metrics
    const collectMetrics = () => {
      if (typeof window === 'undefined' || !window.performance) return;

      const perf = window.performance;
      const timing = perf.timing as unknown as PerformanceTiming;
      const navigation = perf.navigation as unknown as PerformanceNavigation;
      const memory = (performance as any).memory;

      // Get Core Web Vitals
      const fcp = getFirstContentfulPaint();
      const lcp = getLargestContentfulPaint();
      const fid = getFirstInputDelay();
      const cls = getCumulativeLayoutShift();
      const ttfb = timing.responseStart - timing.fetchStart;

      const newMetrics: PerformanceMetrics = {
        fps,
        memory,
        timing,
        navigation,
        resources: perf.getEntriesByType('resource') as PerformanceResourceTiming[],
        fcp,
        lcp,
        fid,
        cls,
        ttfb,
      };

      setMetrics(newMetrics);
      onMetricsUpdate?.(newMetrics);
    };

    animationFrameId = requestAnimationFrame(calculateFPS);
    intervalId = setInterval(collectMetrics, updateInterval);

    return () => {
      cancelAnimationFrame(animationFrameId);
      clearInterval(intervalId);
    };
  }, [fps, updateInterval, onMetricsUpdate]);

  // Core Web Vitals helpers
  const getFirstContentfulPaint = () => {
    const entry = performance.getEntriesByName('first-contentful-paint')[0] as PerformanceEntry;
    return entry ? Math.round(entry.startTime) : 0;
  };

  const getLargestContentfulPaint = () => {
    const entries = performance.getEntriesByType('largest-contentful-paint');
    const lastEntry = entries[entries.length - 1];
    return lastEntry ? Math.round(lastEntry.startTime) : 0;
  };

  const getFirstInputDelay = () => {
    // This would need to be measured during user interaction
    // Returning a placeholder value
    return 0;
  };

  const getCumulativeLayoutShift = () => {
    let clsValue = 0;
    const entries = performance.getEntriesByType('layout-shift');
    entries.forEach((entry) => {
      if (!(entry as any).hadRecentInput) {
        clsValue += (entry as any).value;
      }
    });
    return Math.round(clsValue * 1000) / 1000;
  };

  const formatBytes = (bytes: number) => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const formatTime = (ms: number) => {
    if (ms < 1000) return `${Math.round(ms)}ms`;
    return `${(ms / 1000).toFixed(2)}s`;
  };

  const getScoreColor = (score: number, good: number, needsImprovement: number) => {
    if (score <= good) return 'text-green-500';
    if (score <= needsImprovement) return 'text-yellow-500';
    return 'text-red-500';
  };

  const positionClasses = {
    'top-left': 'top-4 left-4',
    'top-right': 'top-4 right-4',
    'bottom-left': 'bottom-4 left-4',
    'bottom-right': 'bottom-4 right-4',
  };

  return (
    <>
      {/* Toggle Button */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          'fixed z-50 p-3 bg-gray-900/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-lg shadow-lg border border-gray-700',
          positionClasses[position],
          className
        )}
      >
        <Activity className={cn(
          'w-5 h-5 transition-colors',
          fps >= 50 ? 'text-green-500' : fps >= 30 ? 'text-yellow-500' : 'text-red-500'
        )} />
      </motion.button>

      {/* Panel */}
      <AnimatePresence>
        {isOpen && metrics && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -10 }}
            transition={{ duration: 0.2 }}
            className={cn(
              'fixed z-50 w-80 max-h-[80vh] overflow-y-auto bg-gray-900/95 dark:bg-gray-800/95 backdrop-blur-sm rounded-lg shadow-xl border border-gray-700 p-4',
              positionClasses[position]
            )}
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-white">性能监控</h3>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1 hover:bg-gray-700 rounded transition-colors"
              >
                ✕
              </button>
            </div>

            {/* FPS */}
            {showFPS && (
              <div className="mb-4 p-3 bg-gray-800 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-400">帧率 (FPS)</span>
                  <Zap className={cn(
                    'w-4 h-4',
                    fps >= 50 ? 'text-green-500' : fps >= 30 ? 'text-yellow-500' : 'text-red-500'
                  )} />
                </div>
                <div className="text-2xl font-bold text-white">{fps}</div>
              </div>
            )}

            {/* Memory */}
            {showMemory && metrics.memory && (
              <div className="mb-4 p-3 bg-gray-800 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-400">内存使用</span>
                  <Database className="w-4 h-4 text-purple-500" />
                </div>
                <div className="text-sm text-white">
                  {formatBytes(metrics.memory.usedJSHeapSize)} / {formatBytes(metrics.memory.jsHeapSizeLimit)}
                </div>
                <div className="mt-2 h-2 bg-gray-700 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-purple-500 to-pink-500 transition-all duration-500"
                    style={{
                      width: `${(metrics.memory.usedJSHeapSize / metrics.memory.jsHeapSizeLimit) * 100}%`,
                    }}
                  />
                </div>
              </div>
            )}

            {/* Core Web Vitals */}
            {showCoreWebVitals && (
              <div className="mb-4 p-3 bg-gray-800 rounded-lg">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm text-gray-400">核心 Web 指标</span>
                  <Clock className="w-4 h-4 text-cyber-cyan" />
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-gray-400">FCP</span>
                    <span className={cn('text-sm font-medium', getScoreColor(metrics.fcp, 1800, 3000))}>
                      {formatTime(metrics.fcp)}
                    </span>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-xs text-gray-400">LCP</span>
                    <span className={cn('text-sm font-medium', getScoreColor(metrics.lcp, 2500, 4000))}>
                      {formatTime(metrics.lcp)}
                    </span>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-xs text-gray-400">FID</span>
                    <span className={cn('text-sm font-medium', getScoreColor(metrics.fid, 100, 300))}>
                      {formatTime(metrics.fid)}
                    </span>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-xs text-gray-400">CLS</span>
                    <span className={cn('text-sm font-medium', getScoreColor(metrics.cls, 0.1, 0.25))}>
                      {metrics.cls.toFixed(3)}
                    </span>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-xs text-gray-400">TTFB</span>
                    <span className={cn('text-sm font-medium', getScoreColor(metrics.ttfb, 800, 1800))}>
                      {formatTime(metrics.ttfb)}
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* Timing */}
            {showTiming && (
              <div className="mb-4 p-3 bg-gray-800 rounded-lg">
                <span className="text-sm text-gray-400">页面加载时间</span>
                <div className="mt-2 text-sm text-white">
                  DOM 加载: {formatTime(metrics.timing.domContentLoadedEventEnd - metrics.timing.navigationStart)}
                </div>
                <div className="text-sm text-white">
                  完全加载: {formatTime(metrics.timing.loadEventEnd - metrics.timing.navigationStart)}
                </div>
              </div>
            )}

            {/* Resources */}
            {showResources && (
              <div className="mb-4 p-3 bg-gray-800 rounded-lg">
                <span className="text-sm text-gray-400">资源数量</span>
                <div className="mt-2 text-2xl font-bold text-white">
                  {metrics.resources.length}
                </div>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default PerformanceMonitor;
