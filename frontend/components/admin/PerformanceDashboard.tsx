/**
 * 性能监控仪表板组件
 * 显示 Web Vitals 和性能指标
 */

'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Card, Badge } from '@/components/ui';
import { performanceMonitor } from '@/services/performance-monitor';
import type { WebVitals, NavigationTiming } from '@/services/performance-monitor';
import {
  Activity,
  Zap,
  Clock,
  AlertCircle,
  CheckCircle,
  TrendingUp,
} from '@/components/icons';

export function PerformanceDashboard() {
  const [metrics, setMetrics] = useState<WebVitals | null>(null);
  const [navigationTiming, setNavigationTiming] =
    useState<NavigationTiming | null>(null);
  const [averageStats, setAverageStats] = useState<any>(null);

  useEffect(() => {
    // 开始监控
    performanceMonitor.startMonitoring();

    // 获取当前指标
    const updateMetrics = () => {
      setMetrics(performanceMonitor.getMetrics());
      setNavigationTiming(performanceMonitor.getNavigationTiming());
      setAverageStats(performanceMonitor.getPerformanceReport());
    };

    updateMetrics();

    // 定期更新
    const interval = setInterval(updateMetrics, 5000);

    return () => {
      clearInterval(interval);
      performanceMonitor.stopMonitoring();
    };
  }, []);

  const getRatingColor = (rating?: 'good' | 'needs-improvement' | 'poor') => {
    switch (rating) {
      case 'good':
        return 'text-cyber-green bg-cyber-green/10';
      case 'needs-improvement':
        return 'text-yellow-500 bg-yellow-500/10';
      case 'poor':
        return 'text-red-500 bg-red-500/10';
      default:
        return 'text-gray-500 bg-gray-500/10';
    }
  };

  const getRatingIcon = (rating?: 'good' | 'needs-improvement' | 'poor') => {
    switch (rating) {
      case 'good':
        return CheckCircle;
      case 'needs-improvement':
        return AlertCircle;
      case 'poor':
        return AlertCircle;
      default:
        return Activity;
    }
  };

  return (
    <div className="space-y-6">
      {/* Web Vitals */}
      <Card variant="glass" className="p-6">
        <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
          <Activity className="w-5 h-5 text-cyber-cyan" />
          Web Vitals
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {metrics && (
            <>
              <MetricCard
                label="FCP"
                name="First Contentful Paint"
                value={metrics.FCP?.value}
                rating={metrics.FCP?.rating}
                unit="ms"
                getRatingColor={getRatingColor}
                getRatingIcon={getRatingIcon}
              />

              <MetricCard
                label="LCP"
                name="Largest Contentful Paint"
                value={metrics.LCP?.value}
                rating={metrics.LCP?.rating}
                unit="ms"
                getRatingColor={getRatingColor}
                getRatingIcon={getRatingIcon}
              />

              <MetricCard
                label="FID"
                name="First Input Delay"
                value={metrics.FID?.value}
                rating={metrics.FID?.rating}
                unit="ms"
                getRatingColor={getRatingColor}
                getRatingIcon={getRatingIcon}
              />

              <MetricCard
                label="CLS"
                name="Cumulative Layout Shift"
                value={metrics.CLS?.value}
                rating={metrics.CLS?.rating}
                unit=""
                getRatingColor={getRatingColor}
                getRatingIcon={getRatingIcon}
              />

              <MetricCard
                label="TTFB"
                name="Time to First Byte"
                value={metrics.TTFB?.value}
                rating={metrics.TTFB?.rating}
                unit="ms"
                getRatingColor={getRatingColor}
                getRatingIcon={getRatingIcon}
              />
            </>
          )}
        </div>
      </Card>

      {/* Navigation Timing */}
      {navigationTiming && (
        <Card variant="glass" className="p-6">
          <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
            <Clock className="w-5 h-5 text-cyber-purple" />
            导航时序
          </h3>

          <div className="space-y-3">
            <TimingBar label="DNS 查询" value={navigationTiming.dns} />
            <TimingBar label="TCP 连接" value={navigationTiming.tcp} />
            <TimingBar label="请求发送" value={navigationTiming.request} />
            <TimingBar label="响应等待" value={navigationTiming.response} />
            <TimingBar label="DOM 处理" value={navigationTiming.processing} />
            <TimingBar label="加载完成" value={navigationTiming.load} />
            <TimingBar
              label="总耗时"
              value={navigationTiming.total}
              highlight
            />
          </div>
        </Card>
      )}

      {/* 平均统计 */}
      {averageStats && (
        <Card variant="glass" className="p-6">
          <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-cyber-green" />
            性能评级
          </h3>

          <div className="grid grid-cols-3 gap-4">
            <div className="text-center">
              <div className="text-3xl font-bold text-cyber-green mb-1">
                {averageStats.rating.good}
              </div>
              <div className="text-xs text-gray-400">优秀</div>
            </div>

            <div className="text-center">
              <div className="text-3xl font-bold text-yellow-500 mb-1">
                {averageStats.rating.needsImprovement}
              </div>
              <div className="text-xs text-gray-400">需改进</div>
            </div>

            <div className="text-center">
              <div className="text-3xl font-bold text-red-500 mb-1">
                {averageStats.rating.poor}
              </div>
              <div className="text-xs text-gray-400">较差</div>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
}

interface MetricCardProps {
  label: string;
  name: string;
  value?: number;
  rating?: 'good' | 'needs-improvement' | 'poor';
  unit: string;
  getRatingColor: (rating?: 'good' | 'needs-improvement' | 'poor') => string;
  getRatingIcon: (rating?: 'good' | 'needs-improvement' | 'poor') => any;
}

function MetricCard({
  label,
  name,
  value,
  rating,
  unit,
  getRatingColor,
  getRatingIcon,
}: MetricCardProps) {
  const Icon = getRatingIcon(rating);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className={`relative p-4 rounded-lg border ${getRatingColor(rating)}`}
    >
      <div className="flex items-start justify-between mb-2">
        <div>
          <div className="text-xs text-gray-400 mb-1">{label}</div>
          <div className="text-xs text-gray-500">{name}</div>
        </div>
        <Icon className="w-4 h-4" />
      </div>

      <div className="text-2xl font-bold">
        {value !== undefined ? `${Math.round(value)}${unit}` : '-'}
      </div>

      {rating && (
        <Badge variant="outline" className="mt-2 text-xs">
          {rating === 'good' && '优秀'}
          {rating === 'needs-improvement' && '需改进'}
          {rating === 'poor' && '较差'}
        </Badge>
      )}
    </motion.div>
  );
}

interface TimingBarProps {
  label: string;
  value: number;
  highlight?: boolean;
}

function TimingBar({ label, value, highlight }: TimingBarProps) {
  const maxDuration = 5000; // 5秒作为最大值
  const percentage = Math.min((value / maxDuration) * 100, 100);

  return (
    <div className="space-y-1">
      <div className="flex items-center justify-between text-sm">
        <span className="text-gray-400">{label}</span>
        <span className={highlight ? 'font-bold text-cyber-cyan' : 'text-gray-300'}>
          {Math.round(value)}ms
        </span>
      </div>

      <div className="h-2 bg-cyber-dark rounded-full overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 0.5 }}
          className={`h-full rounded-full ${
            highlight
              ? 'bg-gradient-to-r from-cyber-cyan to-cyber-purple'
              : 'bg-cyber-muted'
          }`}
        />
      </div>
    </div>
  );
}
