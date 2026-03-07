'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface PerformanceMetrics {
  fps: number;
  memory: number;
  timing: {
    domContentLoaded: number;
    loadComplete: number;
    firstPaint: number;
    firstContentfulPaint: number;
  };
  network: {
    downlink: number;
    rtt: number;
    saveData: boolean;
  };
}

interface PerformanceMonitorProps {
  position?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left';
  showFPS?: boolean;
  showMemory?: boolean;
  showTiming?: boolean;
  showNetwork?: boolean;
  updateInterval?: number;
  className?: string;
}

export function PerformanceMonitor({
  position = 'bottom-right',
  showFPS = true,
  showMemory = true,
  showTiming = true,
  showNetwork = true,
  updateInterval = 1000,
  className = '',
}: PerformanceMonitorProps) {
  const [metrics, setMetrics] = useState<PerformanceMetrics>({
    fps: 0,
    memory: 0,
    timing: {
      domContentLoaded: 0,
      loadComplete: 0,
      firstPaint: 0,
      firstContentfulPaint: 0,
    },
    network: {
      downlink: 0,
      rtt: 0,
      saveData: false,
    },
  });
  const [isExpanded, setIsExpanded] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    let frameCount = 0;
    let lastTime = performance.now();
    let animationId: number;

    const calculateFPS = () => {
      frameCount++;
      const currentTime = performance.now();
      const deltaTime = currentTime - lastTime;

      if (deltaTime >= 1000) {
        const fps = Math.round((frameCount * 1000) / deltaTime);
        setMetrics((prev) => ({ ...prev, fps }));
        frameCount = 0;
        lastTime = currentTime;
      }

      animationId = requestAnimationFrame(calculateFPS);
    };

    animationId = requestAnimationFrame(calculateFPS);

    // Get timing metrics
    if (typeof window !== 'undefined' && window.performance) {
      const perfData = window.performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
      const paintEntries = window.performance.getEntriesByType('paint');

      const firstPaint = paintEntries.find((entry) => entry.name === 'first-paint')?.startTime || 0;
      const firstContentfulPaint = paintEntries.find((entry) => entry.name === 'first-contentful-paint')?.startTime || 0;

      setMetrics((prev) => ({
        ...prev,
        timing: {
          domContentLoaded: perfData?.domContentLoadedEventEnd - perfData?.domContentLoadedEventStart || 0,
          loadComplete: perfData?.loadEventEnd - perfData?.loadEventStart || 0,
          firstPaint,
          firstContentfulPaint,
        },
      }));
    }

    // Get network information
    if (typeof window !== 'undefined' && 'connection' in navigator) {
      const conn = (navigator as any).connection;
      setMetrics((prev) => ({
        ...prev,
        network: {
          downlink: conn?.downlink || 0,
          rtt: conn?.rtt || 0,
          saveData: conn?.saveData || false,
        },
      }));

      // Listen for network changes
      conn?.addEventListener('change', () => {
        setMetrics((prev) => ({
          ...prev,
          network: {
            downlink: conn?.downlink || 0,
            rtt: conn?.rtt || 0,
            saveData: conn?.saveData || false,
          },
        }));
      });
    }

    // Get memory information (Chrome only)
    const updateMemory = () => {
      if (typeof window !== 'undefined' && 'memory' in performance) {
        const memory = (performance as any).memory;
        const usedMB = Math.round(memory.usedJSHeapSize / 1048576);
        setMetrics((prev) => ({ ...prev, memory: usedMB }));
      }
    };

    const memoryInterval = setInterval(updateMemory, updateInterval);

    return () => {
      cancelAnimationFrame(animationId);
      clearInterval(memoryInterval);
    };
  }, [updateInterval]);

  const positionClasses = {
    'top-right': 'top-4 right-4',
    'top-left': 'top-4 left-4',
    'bottom-right': 'bottom-4 right-4',
    'bottom-left': 'bottom-4 left-4',
  };

  const getFPSColor = (fps: number) => {
    if (fps >= 50) return 'text-green-400';
    if (fps >= 30) return 'text-yellow-400';
    return 'text-red-400';
  };

  const getMemoryColor = (memory: number) => {
    if (memory < 100) return 'text-green-400';
    if (memory < 200) return 'text-yellow-400';
    return 'text-red-400';
  };

  return (
    <motion.div
      className={`fixed ${positionClasses[position]} z-50 ${className}`}
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
    >
      {/* Toggle Button */}
      <motion.button
        onClick={() => setIsVisible(!isVisible)}
        className="relative px-4 py-2 bg-cyber-dark/80 backdrop-blur-md border border-cyber-cyan/30 rounded-lg hover:border-cyber-cyan/60 transition-all duration-300"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <div className="flex items-center gap-2">
          <motion.div
            className="w-2 h-2 rounded-full"
            style={{
              backgroundColor: metrics.fps >= 50 ? '#00ff88' : metrics.fps >= 30 ? '#f0ff00' : '#ff0080',
              boxShadow: `0 0 10px ${metrics.fps >= 50 ? '#00ff88' : metrics.fps >= 30 ? '#f0ff00' : '#ff0080'}`,
            }}
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.7, 1, 0.7],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          />
          <span className="text-sm font-medium text-cyber-cyan">性能监控</span>
        </div>
      </motion.button>

      {/* Expanded Panel */}
      <AnimatePresence>
        {isVisible && (
          <motion.div
            className="absolute mt-2 w-80 bg-cyber-dark/90 backdrop-blur-md border border-cyber-cyan/30 rounded-lg overflow-hidden"
            style={{
              [position === 'top-right' || position === 'top-left' ? 'top' : 'bottom']: '100%',
              right: position === 'top-right' || position === 'bottom-right' ? 0 : 'auto',
              left: position === 'top-left' || position === 'bottom-left' ? 0 : 'auto',
            }}
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
          >
            {/* Header */}
            <div className="px-4 py-3 bg-cyber-cyan/10 border-b border-cyber-cyan/20">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-semibold text-cyber-cyan">性能指标</h3>
                <button
                  onClick={() => setIsExpanded(!isExpanded)}
                  className="text-cyber-cyan hover:text-cyber-purple transition-colors"
                >
                  {isExpanded ? '收起' : '展开'}
                </button>
              </div>
            </div>

            {/* Content */}
            <div className="p-4 space-y-4">
              {/* FPS */}
              {showFPS && (
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-400">FPS</span>
                  <span className={`text-lg font-bold ${getFPSColor(metrics.fps)}`}>
                    {metrics.fps}
                  </span>
                </div>
              )}

              {/* Memory */}
              {showMemory && (
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-400">内存使用</span>
                  <span className={`text-lg font-bold ${getMemoryColor(metrics.memory)}`}>
                    {metrics.memory} MB
                  </span>
                </div>
              )}

              {/* Expanded Details */}
              <AnimatePresence>
                {isExpanded && (
                  <motion.div
                    className="space-y-3 pt-3 border-t border-cyber-cyan/20"
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                  >
                    {/* Timing Metrics */}
                    {showTiming && (
                      <div className="space-y-2">
                        <h4 className="text-xs font-semibold text-cyber-purple">页面加载时间</h4>
                        <div className="space-y-1">
                          <div className="flex items-center justify-between text-xs">
                            <span className="text-gray-400">DOM Content Loaded</span>
                            <span className="text-cyber-cyan">
                              {metrics.timing.domContentLoaded.toFixed(2)} ms
                            </span>
                          </div>
                          <div className="flex items-center justify-between text-xs">
                            <span className="text-gray-400">Load Complete</span>
                            <span className="text-cyber-cyan">
                              {metrics.timing.loadComplete.toFixed(2)} ms
                            </span>
                          </div>
                          <div className="flex items-center justify-between text-xs">
                            <span className="text-gray-400">First Paint</span>
                            <span className="text-cyber-cyan">
                              {metrics.timing.firstPaint.toFixed(2)} ms
                            </span>
                          </div>
                          <div className="flex items-center justify-between text-xs">
                            <span className="text-gray-400">First Contentful Paint</span>
                            <span className="text-cyber-cyan">
                              {metrics.timing.firstContentfulPaint.toFixed(2)} ms
                            </span>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Network Metrics */}
                    {showNetwork && (
                      <div className="space-y-2">
                        <h4 className="text-xs font-semibold text-cyber-purple">网络信息</h4>
                        <div className="space-y-1">
                          <div className="flex items-center justify-between text-xs">
                            <span className="text-gray-400">Downlink</span>
                            <span className="text-cyber-cyan">{metrics.network.downlink} Mbps</span>
                          </div>
                          <div className="flex items-center justify-between text-xs">
                            <span className="text-gray-400">RTT</span>
                            <span className="text-cyber-cyan">{metrics.network.rtt} ms</span>
                          </div>
                          <div className="flex items-center justify-between text-xs">
                            <span className="text-gray-400">Save Data</span>
                            <span className={metrics.network.saveData ? 'text-red-400' : 'text-green-400'}>
                              {metrics.network.saveData ? 'On' : 'Off'}
                            </span>
                          </div>
                        </div>
                      </div>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export default PerformanceMonitor;
