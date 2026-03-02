'use client';

/**
 * Web Vitals 性能监控组件
 * 监控 Core Web Vitals 指标: LCP, FID, CLS, FCP, TTFB
 */

import { useEffect, useState } from 'react';
import { useReportWebVitals } from '@/components/performance/web-vitals';

interface Metric {
  id: string;
  name: string;
  value: number;
  rating: 'good' | 'needs-improvement' | 'poor';
  timestamp: number;
}

interface WebVitalsProps {
  /**
   * 是否在开发模式下显示指标
   * @default false
   */
  showInDev?: boolean;

  /**
   * 自定义上报函数
   */
  onReport?: (metric: Metric) => void;

  /**
   * 上报到分析服务的 URL
   */
  analyticsEndpoint?: string;
}

/**
 * Web Vitals 阈值配置
 */
const THRESHOLDS = {
  LCP: { good: 2500, poor: 4000 }, // Largest Contentful Paint (ms)
  FID: { good: 100, poor: 300 }, // First Input Delay (ms)
  CLS: { good: 0.1, poor: 0.25 }, // Cumulative Layout Shift
  FCP: { good: 1800, poor: 3000 }, // First Contentful Paint (ms)
  TTFB: { good: 800, poor: 1800 }, // Time to First Byte (ms)
};

/**
 * 评估指标等级
 */
function getRating(name: string, value: number): 'good' | 'needs-improvement' | 'poor' {
  const threshold = THRESHOLDS[name as keyof typeof THRESHOLDS];
  if (!threshold) return 'good';

  if (value <= threshold.good) return 'good';
  if (value <= threshold.poor) return 'needs-improvement';
  return 'poor';
}

/**
 * 格式化指标值
 */
function formatValue(name: string, value: number): string {
  switch (name) {
    case 'CLS':
      return value.toFixed(3);
    case 'LCP':
    case 'FCP':
    case 'TTFB':
      return `${Math.round(value)}ms`;
    case 'FID':
      return `${Math.round(value)}ms`;
    default:
      return value.toString();
  }
}

/**
 * Web Vitals 监控组件
 */
export function WebVitals({
  showInDev = false,
  onReport,
  analyticsEndpoint,
}: WebVitalsProps) {
  const [metrics, setMetrics] = useState<Metric[]>([]);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // 只在开发模式下或明确要求时显示
    if (showInDev && process.env.NODE_ENV === 'development') {
      setIsVisible(true);
    }
  }, [showInDev]);

  // 处理新的指标
  const handleMetric = (metric: any) => {
    const rating = getRating(metric.name, metric.value);
    const formattedMetric: Metric = {
      id: metric.id || `${metric.name}-${Date.now()}`,
      name: metric.name,
      value: metric.value,
      rating,
      timestamp: Date.now(),
    };

    setMetrics((prev) => {
      const exists = prev.findIndex((m) => m.name === metric.name);
      if (exists >= 0) {
        const updated = [...prev];
        updated[exists] = formattedMetric;
        return updated;
      }
      return [...prev, formattedMetric];
    });

    // 调用自定义上报函数
    if (onReport) {
      onReport(formattedMetric);
    }

    // 上报到分析服务
    if (analyticsEndpoint) {
      fetch(analyticsEndpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formattedMetric),
        keepalive: true,
      }).catch((err) => console.error('Failed to report metric:', err));
    }

    // 在控制台输出
    if (process.env.NODE_ENV === 'development') {
      console.log(`[Web Vitals] ${metric.name}:`, formatValue(metric.name, metric.value), `(${rating})`);
    }
  };

  // 使用自定义 Hook 监控 Web Vitals
  useReportWebVitals(handleMetric);

  // 不在开发模式时不渲染任何内容
  if (!isVisible) {
    return null;
  }

  return (
    <div className="fixed bottom-4 right-4 z-50 bg-cyber-dark/95 backdrop-blur-sm border border-cyber-cyan/30 rounded-lg p-4 shadow-neon-cyan max-w-sm">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-cyber-cyan font-bold text-sm flex items-center gap-2">
          <span className="w-2 h-2 bg-cyber-cyan rounded-full animate-pulse" />
          Web Vitals
        </h3>
        <button
          onClick={() => setIsVisible(false)}
          className="text-cyber-muted hover:text-cyber-cyan transition-colors"
          aria-label="关闭"
        >
          ✕
        </button>
      </div>

      <div className="space-y-2">
        {metrics.length === 0 ? (
          <p className="text-cyber-muted text-xs">正在收集性能指标...</p>
        ) : (
          metrics.map((metric) => (
            <div key={metric.id} className="flex items-center justify-between text-xs">
              <span className="text-cyber-muted font-mono">{metric.name}</span>
              <div className="flex items-center gap-2">
                <span className="text-white font-mono">{formatValue(metric.name, metric.value)}</span>
                <span
                  className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                    metric.rating === 'good'
                      ? 'bg-green-500/20 text-green-400'
                      : metric.rating === 'needs-improvement'
                      ? 'bg-yellow-500/20 text-yellow-400'
                      : 'bg-red-500/20 text-red-400'
                  }`}
                >
                  {metric.rating === 'good' ? '良好' : metric.rating === 'needs-improvement' ? '需改进' : '较差'}
                </span>
              </div>
            </div>
          ))
        )}
      </div>

      <div className="mt-3 pt-3 border-t border-cyber-cyan/20">
        <p className="text-[10px] text-cyber-muted">
          LCP: 加载性能 | FID: 交互性 | CLS: 视觉稳定性
        </p>
      </div>
    </div>
  );
}

/**
 * Web Vitals Hook
 * 使用 web-vitals 库收集性能指标
 */
export function useReportWebVitals(onReport: (metric: any) => void) {
  useEffect(() => {
    if (typeof window === 'undefined') return;

    let isLoaded = false;

    // 动态导入 web-vitals
    import('web-vitals').then((webVitals) => {
      if (isLoaded) return;
      isLoaded = true;

      // 监控所有核心指标
      webVitals.onLCP(onReport);
      webVitals.onFID(onReport);
      webVitals.onCLS(onReport);
      webVitals.onFCP(onReport);
      webVitals.onTTFB(onReport);
    });
  }, [onReport]);
}

/**
 * 评分徽章组件
 */
export function MetricBadge({ rating }: { rating: 'good' | 'needs-improvement' | 'poor' }) {
  const colors = {
    good: 'bg-green-500/20 text-green-400 border-green-500/30',
    'needs-improvement': 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
    poor: 'bg-red-500/20 text-red-400 border-red-500/30',
  };

  const labels = {
    good: '良好',
    'needs-improvement': '需改进',
    poor: '较差',
  };

  return (
    <span className={`px-2 py-1 rounded text-xs font-bold border ${colors[rating]}`}>
      {labels[rating]}
    </span>
  );
}

/**
 * 性能评分汇总
 */
export function PerformanceScore({ metrics }: { metrics: Metric[] }) {
  const calculateScore = () => {
    if (metrics.length === 0) return 0;

    const goodCount = metrics.filter((m) => m.rating === 'good').length;
    const totalCount = metrics.length;

    return Math.round((goodCount / totalCount) * 100);
  };

  const score = calculateScore();
  const getScoreColor = () => {
    if (score >= 90) return 'text-green-400';
    if (score >= 50) return 'text-yellow-400';
    return 'text-red-400';
  };

  return (
    <div className="flex items-center gap-2">
      <div className={`text-2xl font-bold ${getScoreColor()}`}>{score}</div>
      <div className="text-xs text-cyber-muted">性能评分</div>
    </div>
  );
}

export default WebVitals;
