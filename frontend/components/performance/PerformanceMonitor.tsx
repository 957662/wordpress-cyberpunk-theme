'use client';

import { useEffect, useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { Activity, Zap, Clock, Database } from 'lucide-react';

interface PerformanceMetrics {
  fcp: number; // First Contentful Paint
  lcp: number; // Largest Contentful Paint
  fid: number; // First Input Delay
  cls: number; // Cumulative Layout Shift
  ttfb: number; // Time to First Byte
  loadTime: number; // Page Load Time
}

export function PerformanceMonitor() {
  const [metrics, setMetrics] = useState<PerformanceMetrics>({
    fcp: 0,
    lcp: 0,
    fid: 0,
    cls: 0,
    ttfb: 0,
    loadTime: 0,
  });
  const [isVisible, setIsVisible] = useState(false);
  const [isEnabled, setIsEnabled] = useState(false);
  const hasMeasured = useRef(false);

  useEffect(() => {
    // 检查是否启用性能监控
    const enabled = localStorage.getItem('performance-monitor-enabled') === 'true';
    setIsEnabled(enabled);

    if (!enabled || hasMeasured.current) {
      return;
    }

    hasMeasured.current = true;

    // 测量页面加载时间
    const measureLoadTime = () => {
      const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
      if (navigation) {
        setMetrics((prev) => ({
          ...prev,
          loadTime: navigation.loadEventEnd - navigation.fetchStart,
          ttfb: navigation.responseStart - navigation.fetchStart,
        }));
      }
    };

    // 测量 Web Vitals
    const measureWebVitals = () => {
      // First Contentful Paint (FCP)
      const fcpEntry = performance.getEntriesByName('first-contentful-paint')[0] as PerformanceEntry;
      if (fcpEntry) {
        setMetrics((prev) => ({ ...prev, fcp: fcpEntry.startTime }));
      }

      // Largest Contentful Paint (LCP)
      if ('PerformanceObserver' in window) {
        try {
          const lcpObserver = new PerformanceObserver((list) => {
            const entries = list.getEntries();
            const lastEntry = entries[entries.length - 1];
            setMetrics((prev) => ({ ...prev, lcp: lastEntry.startTime }));
          });
          lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] });
        } catch (e) {
          console.error('[Performance] LCP observer error:', e);
        }

        // First Input Delay (FID)
        try {
          const fidObserver = new PerformanceObserver((list) => {
            const entries = list.getEntries();
            entries.forEach((entry: any) => {
              setMetrics((prev) => ({ ...prev, fid: entry.processingStart - entry.startTime }));
            });
          });
          fidObserver.observe({ entryTypes: ['first-input'] });
        } catch (e) {
          console.error('[Performance] FID observer error:', e);
        }

        // Cumulative Layout Shift (CLS)
        try {
          let clsValue = 0;
          const clsObserver = new PerformanceObserver((list) => {
            const entries = list.getEntries();
            entries.forEach((entry: any) => {
              if (!entry.hadRecentInput) {
                clsValue += entry.value;
                setMetrics((prev) => ({ ...prev, cls: clsValue }));
              }
            });
          });
          clsObserver.observe({ entryTypes: ['layout-shift'] });
        } catch (e) {
          console.error('[Performance] CLS observer error:', e);
        }
      }
    };

    // 等待页面加载完成
    if (document.readyState === 'complete') {
      measureLoadTime();
      measureWebVitals();
    } else {
      window.addEventListener('load', () => {
        measureLoadTime();
        measureWebVitals();
      });
    }
  }, [isEnabled]);

  useEffect(() => {
    // 监听键盘快捷键 (Ctrl+Shift+P)
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.shiftKey && e.key === 'P') {
        e.preventDefault();
        setIsVisible((prev) => !prev);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const toggleEnabled = () => {
    const newState = !isEnabled;
    setIsEnabled(newState);
    localStorage.setItem('performance-monitor-enabled', String(newState));
    
    // 如果启用，重新测量
    if (newState) {
      hasMeasured.current = false;
      window.location.reload();
    }
  };

  const getMetricColor = (metric: keyof PerformanceMetrics, value: number) => {
    if (value === 0) return 'text-gray-400';

    switch (metric) {
      case 'fcp':
        return value < 1800 ? 'text-cyber-green' : value < 3000 ? 'text-cyber-yellow' : 'text-cyber-pink';
      case 'lcp':
        return value < 2500 ? 'text-cyber-green' : value < 4000 ? 'text-cyber-yellow' : 'text-cyber-pink';
      case 'fid':
        return value < 100 ? 'text-cyber-green' : value < 300 ? 'text-cyber-yellow' : 'text-cyber-pink';
      case 'cls':
        return value < 0.1 ? 'text-cyber-green' : value < 0.25 ? 'text-cyber-yellow' : 'text-cyber-pink';
      case 'ttfb':
        return value < 800 ? 'text-cyber-green' : value < 1800 ? 'text-cyber-yellow' : 'text-cyber-pink';
      case 'loadTime':
        return value < 3000 ? 'text-cyber-green' : value < 5000 ? 'text-cyber-yellow' : 'text-cyber-pink';
      default:
        return 'text-gray-400';
    }
  };

  const getMetricLabel = (metric: keyof PerformanceMetrics) => {
    const labels = {
      fcp: '首次内容绘制',
      lcp: '最大内容绘制',
      fid: '首次输入延迟',
      cls: '累积布局偏移',
      ttfb: '首字节时间',
      loadTime: '页面加载时间',
    };
    return labels[metric];
  };

  const formatValue = (value: number) => {
    if (value === 0) return '--';
    if (metricKeys.includes('cls') && value < 1) return value.toFixed(3);
    return `${Math.round(value)}ms`;
  };

  const metricKeys: (keyof PerformanceMetrics)[] = ['fcp', 'lcp', 'fid', 'cls', 'ttfb', 'loadTime'];

  if (!isEnabled) {
    return (
      <button
        onClick={toggleEnabled}
        className="fixed bottom-4 right-4 z-50 p-2 bg-cyber-card border border-cyber-border rounded-lg hover:border-cyber-cyan/50 transition-colors"
        title="启用性能监控 (Ctrl+Shift+P)"
      >
        <Activity className="w-5 h-5 text-gray-400" />
      </button>
    );
  }

  return (
    <>
      {/* 切换按钮 */}
      <button
        onClick={() => setIsVisible(!isVisible)}
        className="fixed bottom-4 right-4 z-50 p-2 bg-cyber-card border border-cyber-border rounded-lg hover:border-cyber-cyan/50 transition-colors"
        title="切换性能监控面板 (Ctrl+Shift+P)"
      >
        <Activity className="w-5 h-5 text-cyber-cyan" />
      </button>

      {/* 性能监控面板 */}
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          className="fixed top-20 right-4 z-50 w-80"
        >
          <div className="bg-cyber-card/95 backdrop-blur border border-cyber-cyan/30 rounded-lg p-4 shadow-lg shadow-cyber-cyan/20">
            {/* 标题栏 */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Activity className="w-5 h-5 text-cyber-cyan" />
                <h3 className="text-lg font-bold text-white">性能监控</h3>
              </div>
              <button
                onClick={toggleEnabled}
                className="text-xs text-gray-400 hover:text-white transition-colors"
              >
                禁用
              </button>
            </div>

            {/* 性能指标 */}
            <div className="space-y-3">
              {metricKeys.map((key) => (
                <div key={key} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {key === 'fcp' && <Clock className="w-4 h-4 text-gray-400" />}
                    {key === 'lcp' && <Zap className="w-4 h-4 text-gray-400" />}
                    {key === 'fid' && <Activity className="w-4 h-4 text-gray-400" />}
                    {key === 'cls' && <Database className="w-4 h-4 text-gray-400" />}
                    <span className="text-sm text-gray-300">{getMetricLabel(key)}</span>
                  </div>
                  <span className={`text-sm font-mono font-bold ${getMetricColor(key, metrics[key])}`}>
                    {formatValue(metrics[key])}
                  </span>
                </div>
              ))}
            </div>

            {/* 性能评分 */}
            <div className="mt-4 pt-4 border-t border-cyber-border">
              <div className="text-center">
                <div className="text-sm text-gray-400 mb-1">性能评分</div>
                <div className="text-3xl font-bold text-cyber-cyan">
                  {Math.max(0, Math.min(100, 100 - (metrics.cls * 100) - (metrics.loadTime / 100)))}
                </div>
                <div className="text-xs text-gray-500 mt-1">
                  按 Ctrl+Shift+P 切换面板
                </div>
              </div>
            </div>

            {/* 操作按钮 */}
            <div className="mt-4 flex gap-2">
              <button
                onClick={() => window.location.reload()}
                className="flex-1 px-3 py-2 bg-cyber-cyan/10 border border-cyber-cyan/30 text-cyber-cyan rounded-lg hover:bg-cyber-cyan/20 transition-colors text-sm"
              >
                重新测试
              </button>
              <button
                onClick={() => {
                  const data = JSON.stringify(metrics, null, 2);
                  navigator.clipboard.writeText(data);
                }}
                className="flex-1 px-3 py-2 bg-cyber-purple/10 border border-cyber-purple/30 text-cyber-purple rounded-lg hover:bg-cyber-purple/20 transition-colors text-sm"
              >
                复制数据
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </>
  );
}
