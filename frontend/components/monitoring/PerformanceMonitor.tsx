'use client';

/**
 * Performance Monitor Component
 * 性能监控组件
 * 监控页面加载、渲染等性能指标
 */

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Activity,
  Clock,
  Zap,
  Monitor,
  X,
  ChevronUp,
  ChevronDown,
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface PerformanceMetrics {
  // Navigation Timing
  domContentLoaded: number;
  loadComplete: number;
  firstPaint: number;
  firstContentfulPaint: number;

  // Resource Timing
  totalResources: number;
  totalTransferSize: number;
  slowResources: number;

  // Rendering
  fps: number;
  longTasks: number;

  // Memory
  memoryUsed: number;
  memoryTotal: number;
}

interface PerformanceMonitorProps {
  showFPS?: boolean;
  showMemory?: boolean;
  showNetwork?: boolean;
  position?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
  refreshInterval?: number;
  className?: string;
}

export function PerformanceMonitor({
  showFPS = true,
  showMemory = true,
  showNetwork = true,
  position = 'bottom-right',
  refreshInterval = 1000,
  className,
}: PerformanceMonitorProps) {
  const [metrics, setMetrics] = useState<PerformanceMetrics>({
    domContentLoaded: 0,
    loadComplete: 0,
    firstPaint: 0,
    firstContentfulPaint: 0,
    totalResources: 0,
    totalTransferSize: 0,
    slowResources: 0,
    fps: 0,
    longTasks: 0,
    memoryUsed: 0,
    memoryTotal: 0,
  });
  const [isExpanded, setIsExpanded] = useState(false);
  const [isVisible, setIsVisible] = useState(true);

  // Calculate FPS
  useEffect(() => {
    if (!showFPS) return;

    let frameCount = 0;
    let lastTime = performance.now();

    const measureFPS = () => {
      frameCount++;
      const currentTime = performance.now();
      const delta = currentTime - lastTime;

      if (delta >= 1000) {
        const fps = Math.round((frameCount * 1000) / delta);
        setMetrics((prev) => ({ ...prev, fps }));
        frameCount = 0;
        lastTime = currentTime;
      }

      requestAnimationFrame(measureFPS);
    };

    const rafId = requestAnimationFrame(measureFPS);
    return () => cancelAnimationFrame(rafId);
  }, [showFPS]);

  // Calculate memory usage
  useEffect(() => {
    if (!showMemory || typeof window === 'undefined') return;

    const measureMemory = () => {
      if ('memory' in performance) {
        const memory = (performance as any).memory;
        setMetrics((prev) => ({
          ...prev,
          memoryUsed: Math.round(memory.usedJSHeapSize / 1048576),
          memoryTotal: Math.round(memory.jsHeapSizeLimit / 1048576),
        }));
      }
    };

    measureMemory();
    const interval = setInterval(measureMemory, refreshInterval);
    return () => clearInterval(interval);
  }, [showMemory, refreshInterval]);

  // Calculate navigation timing
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const measureNavigation = () => {
      const perfData = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;

      if (perfData) {
        setMetrics((prev) => ({
          ...prev,
          domContentLoaded: Math.round(perfData.domContentLoadedEventEnd - perfData.domContentLoadedEventStart),
          loadComplete: Math.round(perfData.loadEventEnd - perfData.fetchStart),
        }));
      }

      // Paint timing
      const paintEntries = performance.getEntriesByType('paint');
      paintEntries.forEach((entry) => {
        if (entry.name === 'first-paint') {
          setMetrics((prev) => ({ ...prev, firstPaint: Math.round(entry.startTime) }));
        }
        if (entry.name === 'first-contentful-paint') {
          setMetrics((prev) => ({ ...prev, firstContentfulPaint: Math.round(entry.startTime) }));
        }
      });
    };

    // Wait for page load
    if (document.readyState === 'complete') {
      measureNavigation();
    } else {
      window.addEventListener('load', measureNavigation);
      return () => window.removeEventListener('load', measureNavigation);
    }
  }, []);

  // Calculate resource timing
  useEffect(() => {
    if (!showNetwork || typeof window === 'undefined') return;

    const measureResources = () => {
      const resources = performance.getEntriesByType('resource') as PerformanceResourceTiming[];
      const slowThreshold = 1000; // 1 second

      let totalSize = 0;
      let slowCount = 0;

      resources.forEach((resource) => {
        // @ts-ignore - transferSize is available in modern browsers
        totalSize += resource.transferSize || 0;
        if (resource.duration > slowThreshold) {
          slowCount++;
        }
      });

      setMetrics((prev) => ({
        ...prev,
        totalResources: resources.length,
        totalTransferSize: Math.round(totalSize / 1024), // KB
        slowResources: slowCount,
      }));
    };

    measureResources();
    const interval = setInterval(measureResources, refreshInterval * 5);
    return () => clearInterval(interval);
  }, [showNetwork, refreshInterval]);

  const positionClasses = {
    'top-left': 'top-4 left-4',
    'top-right': 'top-4 right-4',
    'bottom-left': 'bottom-4 left-4',
    'bottom-right': 'bottom-4 right-4',
  };

  if (!isVisible) return null;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className={cn(
        'fixed z-50 cyber-card border border-cyber-border/50 bg-cyber-dark/95 backdrop-blur-sm',
        positionClasses[position],
        isExpanded ? 'w-80' : 'w-auto',
        className
      )}
    >
      {/* Header */}
      <div className="flex items-center justify-between p-3 border-b border-cyber-border">
        <div className="flex items-center gap-2">
          <Activity className="w-4 h-4 text-cyber-cyan animate-pulse" />
          <span className="text-sm font-semibold text-white">性能监控</span>
        </div>
        <div className="flex items-center gap-1">
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="p-1 text-gray-400 hover:text-white transition-colors"
          >
            {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
          <button
            onClick={() => setIsVisible(false)}
            className="p-1 text-gray-400 hover:text-red-400 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <div className="p-3 space-y-3">
              {/* FPS */}
              {showFPS && (
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Zap className="w-4 h-4 text-cyber-yellow" />
                    <span className="text-sm text-gray-400">FPS</span>
                  </div>
                  <span
                    className={cn(
                      'text-sm font-bold',
                      metrics.fps >= 50 ? 'text-green-400' : metrics.fps >= 30 ? 'text-yellow-400' : 'text-red-400'
                    )}
                  >
                    {metrics.fps}
                  </span>
                </div>
              )}

              {/* Memory */}
              {showMemory && metrics.memoryTotal > 0 && (
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Monitor className="w-4 h-4 text-cyber-purple" />
                    <span className="text-sm text-gray-400">内存</span>
                  </div>
                  <span className="text-sm font-bold text-white">
                    {metrics.memoryUsed}MB / {metrics.memoryTotal}MB
                  </span>
                </div>
              )}

              {/* Navigation Timing */}
              {metrics.loadComplete > 0 && (
                <div className="space-y-2 pt-2 border-t border-cyber-border">
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-cyber-cyan" />
                    <span className="text-xs text-gray-400">页面加载时间</span>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div>
                      <span className="text-gray-500">DOM:</span>
                      <span className="text-white ml-1">{metrics.domContentLoaded}ms</span>
                    </div>
                    <div>
                      <span className="text-gray-500">加载:</span>
                      <span className="text-white ml-1">{metrics.loadComplete}ms</span>
                    </div>
                    {metrics.firstPaint > 0 && (
                      <>
                        <div>
                          <span className="text-gray-500">FP:</span>
                          <span className="text-white ml-1">{metrics.firstPaint}ms</span>
                        </div>
                        <div>
                          <span className="text-gray-500">FCP:</span>
                          <span className="text-white ml-1">{metrics.firstContentfulPaint}ms</span>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              )}

              {/* Network */}
              {showNetwork && metrics.totalResources > 0 && (
                <div className="space-y-2 pt-2 border-t border-cyber-border">
                  <div className="flex items-center gap-2">
                    <Activity className="w-4 h-4 text-cyber-green" />
                    <span className="text-xs text-gray-400">资源</span>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div>
                      <span className="text-gray-500">数量:</span>
                      <span className="text-white ml-1">{metrics.totalResources}</span>
                    </div>
                    <div>
                      <span className="text-gray-500">大小:</span>
                      <span className="text-white ml-1">{metrics.totalTransferSize}KB</span>
                    </div>
                    {metrics.slowResources > 0 && (
                      <div className="col-span-2">
                        <span className="text-gray-500">慢资源:</span>
                        <span className="text-yellow-400 ml-1">{metrics.slowResources}</span>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export default PerformanceMonitor;
