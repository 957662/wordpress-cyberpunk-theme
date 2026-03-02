'use client';

import React, { useState } from 'react';
import { PerformanceMonitor, createPerformanceMetrics } from '@/components/performance';
import { MetricCard, createMetric } from '@/components/performance';
import { Activity, Zap, TrendingUp } from 'lucide-react';
import { motion } from 'framer-motion';

export default function PerformanceExamplePage() {
  const [refreshKey, setRefreshKey] = useState(0);
  const [customMetrics, setCustomMetrics] = useState([
    createMetric('cpu', 'CPU Usage', 45, '%', {
      threshold: { warning: 70, critical: 90 },
      status: 'good',
    }),
    createMetric('memory', 'Memory Usage', 62, '%', {
      threshold: { warning: 75, critical: 90 },
      status: 'good',
      previousValue: 58,
    }),
    createMetric('requests', 'API Requests', 1234, '/min', {
      threshold: { warning: 2000, critical: 5000 },
      status: 'good',
      previousValue: 1180,
    }),
    createMetric('errors', 'Error Rate', 0.5, '%', {
      threshold: { warning: 1, critical: 5 },
      status: 'good',
      previousValue: 0.3,
    }),
  ]);

  const handleRefresh = async () => {
    setRefreshKey((prev) => prev + 1);
    const metrics = await createPerformanceMetrics();

    setCustomMetrics((prev) =>
      prev.map((metric) => {
        const newMetric = metrics.find((m) => m.id === metric.id);
        if (newMetric) {
          return {
            ...metric,
            value: metric.id === 'cpu' ? Math.round(Math.random() * 100) :
                   metric.id === 'memory' ? Math.round(Math.random() * 100) :
                   metric.id === 'requests' ? Math.round(Math.random() * 5000) :
                   metric.id === 'errors' ? Math.round(Math.random() * 10 * 10) / 10 :
                   metric.value,
            previousValue: metric.value,
          };
        }
        return metric;
      })
    );
  };

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-gray-100">
      {/* Performance Monitor */}
      <PerformanceMonitor
        key={refreshKey}
        colorScheme="cyan"
        autoRefresh
        refreshInterval={5000}
        position="top-right"
        defaultExpanded={false}
      />

      {/* Header */}
      <div className="border-b border-cyan-500/20 bg-[#0a0a0f]/80 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <h1 className="text-4xl font-bold text-glow-cyan mb-2">
            Performance Monitoring Demo
          </h1>
          <p className="text-gray-400">
            Real-time performance metrics and monitoring
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-12">
        {/* Actions */}
        <div className="mb-8 flex gap-4">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleRefresh}
            className="px-6 py-3 rounded-lg bg-cyan-500/20 border border-cyan-500/30 text-cyan-400 font-semibold hover:bg-cyan-500/30 transition-colors"
          >
            <Activity className="w-5 h-5 inline mr-2" />
            Refresh Metrics
          </motion.button>
        </div>

        {/* System Metrics */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-glow-cyan mb-6">System Metrics</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {customMetrics.map((metric) => (
              <MetricCard
                key={metric.id}
                metric={metric}
                colorScheme="cyan"
                showHistory
                onRefresh={handleRefresh}
              />
            ))}
          </div>
        </section>

        {/* Different Color Schemes */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-glow-cyan mb-6">Color Schemes</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {['cyan', 'purple', 'pink', 'green', 'orange', 'blue'].map((scheme) => (
              <MetricCard
                key={scheme}
                metric={createMetric(
                  scheme,
                  `${scheme.charAt(0).toUpperCase() + scheme.slice(1)} Metric`,
                  Math.round(Math.random() * 100),
                  '%',
                  {
                    threshold: { warning: 70, critical: 90 },
                    status: Math.random() > 0.5 ? 'good' : 'warning',
                  }
                )}
                colorScheme={scheme as any}
                showHistory={false}
              />
            ))}
          </div>
        </section>

        {/* Grid Layout */}
        <section>
          <h2 className="text-2xl font-bold text-glow-cyan mb-6">Dashboard Grid</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <MetricCard
              metric={createMetric('uptime', 'Uptime', 99.9, '%', {
                status: 'good',
                previousValue: 99.8,
              })}
              colorScheme="green"
              showHistory={false}
            />
            <MetricCard
              metric={createMetric('response', 'Response Time', 120, 'ms', {
                threshold: { warning: 300, critical: 500 },
                status: 'good',
                previousValue: 115,
              })}
              colorScheme="cyan"
              showHistory={false}
            />
            <MetricCard
              metric={createMetric('throughput', 'Throughput', 5.2, 'GB/s', {
                status: 'good',
                previousValue: 5.0,
              })}
              colorScheme="purple"
              showHistory={false}
            />
            <MetricCard
              metric={createMetric('concurrent', 'Concurrent Users', 1234, '', {
                status: 'good',
                previousValue: 1198,
              })}
              colorScheme="pink"
              showHistory={false}
            />
          </div>
        </section>
      </div>
    </div>
  );
}
