/**
 * 性能监控 Hook
 * 监控和报告 Web Vitals
 */

import { useEffect, useState } from 'react';

interface Metric {
  id: string;
  name: string;
  value: number;
  rating: 'good' | 'needs-improvement' | 'poor';
  timestamp: number;
}

interface PerformanceMetrics {
  FCP?: Metric;
  LCP?: Metric;
  FID?: Metric;
  CLS?: Metric;
  TTFB?: Metric;
}

/**
 * 使用性能指标
 */
export function usePerformanceMetrics() {
  const [metrics, setMetrics] = useState<PerformanceMetrics>({});
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    // 检测 Web Vitals 支持并开始监控
    const observeMetrics = async () => {
      try {
        // 动态导入 web-vitals 库
        const { getCLS, getFID, getFCP, getLCP, getTTFB } = await import(
          'web-vitals'
        );

        // FCP - First Contentful Paint
        getFCP((metric) => {
          if (isMounted) {
            setMetrics((prev) => ({
              ...prev,
              FCP: {
                id: metric.id,
                name: metric.name,
                value: metric.value,
                rating: metric.rating as 'good' | 'needs-improvement' | 'poor',
                timestamp: Date.now(),
              },
            }));
          }
        });

        // LCP - Largest Contentful Paint
        getLCP((metric) => {
          if (isMounted) {
            setMetrics((prev) => ({
              ...prev,
              LCP: {
                id: metric.id,
                name: metric.name,
                value: metric.value,
                rating: metric.rating as 'good' | 'needs-improvement' | 'poor',
                timestamp: Date.now(),
              },
            }));
          }
        });

        // FID - First Input Delay
        getFID((metric) => {
          if (isMounted) {
            setMetrics((prev) => ({
              ...prev,
              FID: {
                id: metric.id,
                name: metric.name,
                value: metric.value,
                rating: metric.rating as 'good' | 'needs-improvement' | 'poor',
                timestamp: Date.now(),
              },
            }));
          }
        });

        // CLS - Cumulative Layout Shift
        getCLS((metric) => {
          if (isMounted) {
            setMetrics((prev) => ({
              ...prev,
              CLS: {
                id: metric.id,
                name: metric.name,
                value: metric.value,
                rating: metric.rating as 'good' | 'needs-improvement' | 'poor',
                timestamp: Date.now(),
              },
            }));
          }
        });

        // TTFB - Time to First Byte
        getTTFB((metric) => {
          if (isMounted) {
            setMetrics((prev) => ({
              ...prev,
              TTFB: {
                id: metric.id,
                name: metric.name,
                value: metric.value,
                rating: metric.rating as 'good' | 'needs-improvement' | 'poor',
                timestamp: Date.now(),
              },
            }));
          }
        });

        setIsLoading(false);
      } catch (error) {
        console.error('Failed to load web-vitals:', error);
        setIsLoading(false);
      }
    };

    observeMetrics();

    return () => {
      isMounted = false;
    };
  }, []);

  return { metrics, isLoading };
}

/**
 * 使用性能评分
 */
export function usePerformanceScore() {
  const { metrics } = usePerformanceMetrics();

  const score = useState(() => {
    const ratings = Object.values(metrics).map((m) => m?.rating);
    const good = ratings.filter((r) => r === 'good').length;
    const needsImprovement = ratings.filter((r) => r === 'needs-improvement').length;
    const poor = ratings.filter((r) => r === 'poor').length;

    const total = good + needsImprovement + poor;
    if (total === 0) return null;

    const percentage = (good / total) * 100;

    return {
      percentage: Math.round(percentage),
      grade: percentage >= 90 ? 'A' : percentage >= 70 ? 'B' : percentage >= 50 ? 'C' : 'D',
      good,
      needsImprovement,
      poor,
    };
  });

  return score;
}
