'use client';

/**
 * Performance Report Component
 * Displays performance metrics and Web Vitals
 */

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { getPerformanceMonitor, PerformanceReport } from '@/lib/performance/PerformanceMonitor';
import { Activity, Clock, Zap, AlertCircle, CheckCircle, XCircle } from 'lucide-react';

interface PerformanceReportProps {
  showDetails?: boolean;
  autoRefresh?: boolean;
  refreshInterval?: number;
  onReportGenerated?: (report: string) => void;
}

export function PerformanceReportComponent({
  showDetails = false,
  autoRefresh = false,
  refreshInterval = 10000,
  onReportGenerated,
}: PerformanceReportProps) {
  const [metrics, setMetrics] = useState<PerformanceReport>({});
  const [summary, setSummary] = useState<{
    score: number;
    issues: string[];
    recommendations: string[];
  }>({ score: 100, issues: [], recommendations: [] });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const monitor = getPerformanceMonitor();

    const updateMetrics = () => {
      const currentMetrics = monitor.getMetrics();
      const currentSummary = monitor.getSummary();
      setMetrics(currentMetrics);
      setSummary(currentSummary);
      setIsLoading(false);
    };

    // Initial update
    updateMetrics();

    // Set up auto-refresh
    let interval: NodeJS.Timeout;
    if (autoRefresh) {
      interval = setInterval(updateMetrics, refreshInterval);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [autoRefresh, refreshInterval]);

  const getMetricStatus = (name: keyof PerformanceReport, value?: number): 'good' | 'warning' | 'poor' => {
    if (value === undefined) return 'good';

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
    if (value <= threshold.poor) return 'warning';
    return 'poor';
  };

  const getStatusColor = (status: 'good' | 'warning' | 'poor') => {
    switch (status) {
      case 'good':
        return 'text-cyber-green';
      case 'warning':
        return 'text-cyber-yellow';
      case 'poor':
        return 'text-cyber-pink';
    }
  };

  const getStatusIcon = (status: 'good' | 'warning' | 'poor') => {
    switch (status) {
      case 'good':
        return <CheckCircle className="w-4 h-4" />;
      case 'warning':
        return <AlertCircle className="w-4 h-4" />;
      case 'poor':
        return <XCircle className="w-4 h-4" />;
    }
  };

  const handleGenerateReport = () => {
    const monitor = getPerformanceMonitor();
    const report = monitor.generateReport();
    onReportGenerated?.(report);
  };

  const handleRefresh = () => {
    const monitor = getPerformanceMonitor();
    setMetrics(monitor.getMetrics());
    setSummary(monitor.getSummary());
  };

  if (isLoading) {
    return (
      <Card className="p-6">
        <div className="flex items-center justify-center h-48">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-cyber-cyan" />
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Activity className="w-6 h-6 text-cyber-cyan" />
          <h3 className="text-xl font-bold text-white">Performance Report</h3>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" onClick={handleRefresh}>
            <Clock className="w-4 h-4 mr-2" />
            Refresh
          </Button>
          <Button variant="neon" size="sm" onClick={handleGenerateReport}>
            <Zap className="w-4 h-4 mr-2" />
            Generate Report
          </Button>
        </div>
      </div>

      {/* Score */}
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="text-center py-6"
      >
        <div className={`text-6xl font-bold ${
          summary.score >= 90 ? 'text-cyber-green' :
          summary.score >= 70 ? 'text-cyber-yellow' :
          'text-cyber-pink'
        }`}>
          {summary.score}
        </div>
        <div className="text-sm text-cyber-gray-400 mt-2">Performance Score</div>
      </motion.div>

      {/* Core Web Vitals */}
      <div>
        <h4 className="text-lg font-semibold text-white mb-4">Core Web Vitals</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* LCP */}
          {metrics.LCP !== undefined && (
            <MetricCard
              label="Largest Contentful Paint"
              value={`${metrics.LCP.toFixed(0)}ms`}
              status={getMetricStatus('LCP', metrics.LCP)}
              description="Time to load largest content"
            />
          )}

          {/* FID */}
          {metrics.FID !== undefined && (
            <MetricCard
              label="First Input Delay"
              value={`${metrics.FID.toFixed(0)}ms`}
              status={getMetricStatus('FID', metrics.FID)}
              description="Time to respond to first interaction"
            />
          )}

          {/* CLS */}
          {metrics.CLS !== undefined && (
            <MetricCard
              label="Cumulative Layout Shift"
              value={metrics.CLS.toFixed(3)}
              status={getMetricStatus('CLS', metrics.CLS)}
              description="Visual stability score"
            />
          )}

          {/* FCP */}
          {metrics.FCP !== undefined && (
            <MetricCard
              label="First Contentful Paint"
              value={`${metrics.FCP.toFixed(0)}ms`}
              status={getMetricStatus('FCP', metrics.FCP)}
              description="Time to render first content"
            />
          )}

          {/* TTFB */}
          {metrics.TTFB !== undefined && (
            <MetricCard
              label="Time to First Byte"
              value={`${metrics.TTFB.toFixed(0)}ms`}
              status={getMetricStatus('TTFB', metrics.TTFB)}
              description="Server response time"
            />
          )}
        </div>
      </div>

      {/* Custom Metrics */}
      {showDetails && (
        <div>
          <h4 className="text-lg font-semibold text-white mb-4">Custom Metrics</h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {metrics.pageLoadTime !== undefined && (
              <MetricCard
                label="Page Load Time"
                value={`${metrics.pageLoadTime.toFixed(0)}ms`}
                status="good"
                description="Total page load duration"
              />
            )}
            {metrics.renderTime !== undefined && (
              <MetricCard
                label="Render Time"
                value={`${metrics.renderTime.toFixed(0)}ms`}
                status="good"
                description="Time to render page"
              />
            )}
            {metrics.apiResponseTime !== undefined && (
              <MetricCard
                label="API Response Time"
                value={`${metrics.apiResponseTime.toFixed(0)}ms`}
                status="good"
                description="Average API response"
              />
            )}
          </div>
        </div>
      )}

      {/* Issues and Recommendations */}
      {(summary.issues.length > 0 || summary.recommendations.length > 0) && (
        <div className="space-y-4">
          {summary.issues.length > 0 && (
            <div>
              <h4 className="text-lg font-semibold text-cyber-pink mb-3">Issues Found</h4>
              <ul className="space-y-2">
                {summary.issues.map((issue, index) => (
                  <li key={index} className="flex items-start gap-2 text-cyber-gray-300">
                    <AlertCircle className="w-4 h-4 text-cyber-pink mt-1 flex-shrink-0" />
                    <span>{issue}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {summary.recommendations.length > 0 && (
            <div>
              <h4 className="text-lg font-semibold text-cyber-yellow mb-3">Recommendations</h4>
              <ul className="space-y-2">
                {summary.recommendations.map((rec, index) => (
                  <li key={index} className="flex items-start gap-2 text-cyber-gray-300">
                    <Zap className="w-4 h-4 text-cyber-cyan mt-1 flex-shrink-0" />
                    <span>{rec}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </Card>
  );
}

interface MetricCardProps {
  label: string;
  value: string;
  status: 'good' | 'warning' | 'poor';
  description: string;
}

function MetricCard({ label, value, status, description }: MetricCardProps) {
  const getStatusColor = (s: 'good' | 'warning' | 'poor') => {
    switch (s) {
      case 'good':
        return 'border-cyber-green/50 bg-cyber-green/5';
      case 'warning':
        return 'border-cyber-yellow/50 bg-cyber-yellow/5';
      case 'poor':
        return 'border-cyber-pink/50 bg-cyber-pink/5';
    }
  };

  const getStatusTextColor = (s: 'good' | 'warning' | 'poor') => {
    switch (s) {
      case 'good':
        return 'text-cyber-green';
      case 'warning':
        return 'text-cyber-yellow';
      case 'poor':
        return 'text-cyber-pink';
    }
  };

  return (
    <div className={`p-4 rounded-lg border-2 ${getStatusColor(status)}`}>
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm text-cyber-gray-400">{label}</span>
        <span className={`text-2xl font-bold ${getStatusTextColor(status)}`}>{value}</span>
      </div>
      <p className="text-xs text-cyber-gray-500">{description}</p>
    </div>
  );
}

export default PerformanceReportComponent;
