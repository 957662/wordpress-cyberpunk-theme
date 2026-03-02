/**
 * 性能监控演示页面
 * 展示如何使用性能监控工具
 */

'use client';

import React, { useEffect, useState } from 'react';
import { getPerformanceMonitor } from '@/lib/performance/performance-monitor';

export default function PerformanceDemoPage() {
  const [metrics, setMetrics] = useState<any>(null);
  const [report, setReport] = useState<string>('');
  const monitor = getPerformanceMonitor();

  useEffect(() => {
    // 等待页面加载完成
    if (typeof window !== 'undefined' && document.readyState === 'complete') {
      loadMetrics();
    } else {
      window.addEventListener('load', loadMetrics);
      return () => window.removeEventListener('load', loadMetrics);
    }
  }, []);

  const loadMetrics = () => {
    // 等待一下确保所有指标都收集完毕
    setTimeout(() => {
      const perfMetrics = monitor.measurePageLoad();
      setMetrics(perfMetrics);
      setReport(monitor.formatReport());
    }, 1000);
  };

  const handleRefresh = () => {
    monitor.clear();
    loadMetrics();
    window.location.reload();
  };

  const handleDownloadReport = () => {
    monitor.downloadLogs();
  };

  if (!metrics) {
    return (
      <div className="min-h-screen bg-black text-cyan-500 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-cyan-500 mx-auto mb-4"></div>
          <p>Collecting performance metrics...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-cyan-500 p-8">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-4 text-cyan-400">
            ⚡ Performance Monitor Demo
          </h1>
          <p className="text-gray-400">
            实时监控和分析应用性能指标
          </p>
        </div>

        {/* 操作按钮 */}
        <div className="mb-8 flex gap-4">
          <button
            onClick={handleRefresh}
            className="px-6 py-2 bg-cyan-600 hover:bg-cyan-700 rounded-lg transition-colors"
          >
            🔄 Refresh Metrics
          </button>
          <button
            onClick={handleDownloadReport}
            className="px-6 py-2 bg-purple-600 hover:bg-purple-700 rounded-lg transition-colors"
          >
            📥 Download Report
          </button>
        </div>

        {/* 性能报告 */}
        <div className="bg-gray-900 rounded-lg p-6 mb-8 border border-cyan-500/30">
          <h2 className="text-2xl font-bold mb-4 text-cyan-400">
            📊 Performance Report
          </h2>
          <pre className="text-sm text-gray-300 whitespace-pre-wrap font-mono">
            {report}
          </pre>
        </div>

        {/* Core Web Vitals */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <div className="bg-gray-900 rounded-lg p-6 border border-cyan-500/30">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-lg font-bold">LCP</h3>
              <span className="text-2xl">⚡</span>
            </div>
            <p className="text-3xl font-bold mb-2">
              {metrics.LCP ? `${metrics.LCP.toFixed(0)}ms` : 'N/A'}
            </p>
            <p className="text-sm text-gray-400">Largest Contentful Paint</p>
            {metrics.LCP && (
              <p className={`text-sm mt-2 ${
                metrics.LCP < 2500 ? 'text-green-500' :
                metrics.LCP < 4000 ? 'text-yellow-500' :
                'text-red-500'
              }`}>
                {metrics.LCP < 2500 ? '✅ Good' :
                 metrics.LCP < 4000 ? '⚠️ Needs Improvement' :
                 '❌ Poor'}
              </p>
            )}
          </div>

          <div className="bg-gray-900 rounded-lg p-6 border border-purple-500/30">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-lg font-bold">FID</h3>
              <span className="text-2xl">🎯</span>
            </div>
            <p className="text-3xl font-bold mb-2">
              {metrics.FID ? `${metrics.FID.toFixed(0)}ms` : 'N/A'}
            </p>
            <p className="text-sm text-gray-400">First Input Delay</p>
            {metrics.FID && (
              <p className={`text-sm mt-2 ${
                metrics.FID < 100 ? 'text-green-500' :
                metrics.FID < 300 ? 'text-yellow-500' :
                'text-red-500'
              }`}>
                {metrics.FID < 100 ? '✅ Good' :
                 metrics.FID < 300 ? '⚠️ Needs Improvement' :
                 '❌ Poor'}
              </p>
            )}
          </div>

          <div className="bg-gray-900 rounded-lg p-6 border border-pink-500/30">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-lg font-bold">CLS</h3>
              <span className="text-2xl">📐</span>
            </div>
            <p className="text-3xl font-bold mb-2">
              {metrics.CLS !== undefined ? metrics.CLS.toFixed(3) : 'N/A'}
            </p>
            <p className="text-sm text-gray-400">Cumulative Layout Shift</p>
            {metrics.CLS !== undefined && (
              <p className={`text-sm mt-2 ${
                metrics.CLS < 0.1 ? 'text-green-500' :
                metrics.CLS < 0.25 ? 'text-yellow-500' :
                'text-red-500'
              }`}>
                {metrics.CLS < 0.1 ? '✅ Good' :
                 metrics.CLS < 0.25 ? '⚠️ Needs Improvement' :
                 '❌ Poor'}
              </p>
            )}
          </div>
        </div>

        {/* 页面加载时间 */}
        <div className="bg-gray-900 rounded-lg p-6 mb-8 border border-cyan-500/30">
          <h2 className="text-2xl font-bold mb-4 text-cyan-400">
            ⏱️ Page Load Times
          </h2>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="bg-black/50 rounded-lg p-4">
              <p className="text-gray-400 text-sm">Page Load Time</p>
              <p className="text-2xl font-bold text-cyan-400">
                {metrics.pageLoadTime.toFixed(0)}ms
              </p>
            </div>
            <div className="bg-black/50 rounded-lg p-4">
              <p className="text-gray-400 text-sm">DOM Ready Time</p>
              <p className="text-2xl font-bold text-purple-400">
                {metrics.domReadyTime.toFixed(0)}ms
              </p>
            </div>
            <div className="bg-black/50 rounded-lg p-4">
              <p className="text-gray-400 text-sm">First Paint</p>
              <p className="text-2xl font-bold text-pink-400">
                {metrics.firstPaint.toFixed(0)}ms
              </p>
            </div>
            <div className="bg-black/50 rounded-lg p-4">
              <p className="text-gray-400 text-sm">First Contentful Paint</p>
              <p className="text-2xl font-bold text-green-400">
                {metrics.firstContentfulPaint.toFixed(0)}ms
              </p>
            </div>
            <div className="bg-black/50 rounded-lg p-4">
              <p className="text-gray-400 text-sm">Network Latency</p>
              <p className="text-2xl font-bold text-yellow-400">
                {metrics.networkLatency.toFixed(0)}ms
              </p>
            </div>
            <div className="bg-black/50 rounded-lg p-4">
              <p className="text-gray-400 text-sm">DOM Content Loaded</p>
              <p className="text-2xl font-bold text-blue-400">
                {metrics.domContentLoaded.toFixed(0)}ms
              </p>
            </div>
          </div>
        </div>

        {/* 资源加载 */}
        <div className="bg-gray-900 rounded-lg p-6 border border-cyan-500/30">
          <h2 className="text-2xl font-bold mb-4 text-cyan-400">
            🌐 Network & Resources
          </h2>
          <div className="grid md:grid-cols-3 gap-4">
            <div className="bg-black/50 rounded-lg p-4">
              <p className="text-gray-400 text-sm">Total Resources</p>
              <p className="text-2xl font-bold text-cyan-400">
                {metrics.totalResources}
              </p>
            </div>
            <div className="bg-black/50 rounded-lg p-4">
              <p className="text-gray-400 text-sm">Cached Resources</p>
              <p className="text-2xl font-bold text-green-400">
                {metrics.cachedResources}
              </p>
            </div>
            <div className="bg-black/50 rounded-lg p-4">
              <p className="text-gray-400 text-sm">Transfer Size</p>
              <p className="text-2xl font-bold text-purple-400">
                {(metrics.totalTransferSize / 1024).toFixed(2)} KB
              </p>
            </div>
          </div>
        </div>

        {/* 使用说明 */}
        <div className="mt-8 bg-gray-900 rounded-lg p-6 border border-gray-700">
          <h2 className="text-2xl font-bold mb-4 text-cyan-400">
            💡 Usage Guide
          </h2>
          <div className="space-y-4 text-gray-300">
            <div>
              <h3 className="font-bold text-cyan-400 mb-2">基本使用</h3>
              <pre className="bg-black/50 p-4 rounded text-sm overflow-x-auto">
{`import { getPerformanceMonitor } from '@/lib/performance/performance-monitor';

const monitor = getPerformanceMonitor();

// 测量页面加载
const metrics = monitor.measurePageLoad();

// 获取格式化报告
const report = monitor.formatReport();

// 测量函数执行时间
const { result, duration } = await monitor.measureFunction(
  'myFunction',
  () => myExpensiveOperation()
);`}
              </pre>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
