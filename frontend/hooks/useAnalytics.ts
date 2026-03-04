/**
 * 分析数据 Hook
 * CyberPress Platform
 */

import { useState, useEffect, useCallback } from 'react';
import { analyticsService } from '@/services/analytics-service';

export interface AnalyticsData {
  pageViews: number;
  uniqueVisitors: number;
  bounceRate: number;
  avgSessionDuration: number;
  topPages: Array<{ path: string; views: number }>;
  trafficSources: Array<{ source: string; count: number; percentage: number }>;
  deviceBreakdown: Array<{ device: string; count: number; percentage: number }>;
  geographicData: Array<{ country: string; count: number; percentage: number }>;
}

export interface AnalyticsOptions {
  startDate?: Date;
  endDate?: Date;
  interval?: 'hour' | 'day' | 'week' | 'month';
  refreshInterval?: number;
}

export function useAnalytics(options: AnalyticsOptions = {}) {
  const {
    startDate = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // 默认7天
    endDate = new Date(),
    interval = 'day',
    refreshInterval = 60000, // 默认60秒刷新
  } = options;

  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  // 获取分析数据
  const fetchAnalytics = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await analyticsService.getAnalytics({
        startDate: startDate.toISOString(),
        endDate: endDate.toISOString(),
        interval,
      });

      setData(response);
      setLastUpdated(new Date());
    } catch (err) {
      setError(err as Error);
      console.error('获取分析数据失败:', err);
    } finally {
      setLoading(false);
    }
  }, [startDate, endDate, interval]);

  // 获取实时访客数据
  const [realtimeVisitors, setRealtimeVisitors] = useState<number>(0);

  const fetchRealtimeVisitors = useCallback(async () => {
    try {
      const count = await analyticsService.getRealtimeVisitors();
      setRealtimeVisitors(count);
    } catch (err) {
      console.error('获取实时访客数据失败:', err);
    }
  }, []);

  // 追踪页面访问
  const trackPageView = useCallback(
    async (path: string, title: string) => {
      try {
        await analyticsService.trackPageView({
          path,
          title,
          timestamp: new Date().toISOString(),
        });
      } catch (err) {
        console.error('追踪页面访问失败:', err);
      }
    },
    []
  );

  // 追踪自定义事件
  const trackEvent = useCallback(
    async (eventName: string, properties?: Record<string, any>) => {
      try {
        await analyticsService.trackEvent({
          name: eventName,
          properties,
          timestamp: new Date().toISOString(),
        });
      } catch (err) {
        console.error('追踪事件失败:', err);
      }
    },
    []
  );

  // 初始加载
  useEffect(() => {
    fetchAnalytics();
    fetchRealtimeVisitors();
  }, [fetchAnalytics, fetchRealtimeVisitors]);

  // 定时刷新
  useEffect(() => {
    if (refreshInterval > 0) {
      const intervalId = setInterval(() => {
        fetchAnalytics();
        fetchRealtimeVisitors();
      }, refreshInterval);

      return () => clearInterval(intervalId);
    }
  }, [fetchAnalytics, fetchRealtimeVisitors, refreshInterval]);

  // 手动刷新
  const refresh = useCallback(() => {
    fetchAnalytics();
    fetchRealtimeVisitors();
  }, [fetchAnalytics, fetchRealtimeVisitors]);

  return {
    data,
    loading,
    error,
    realtimeVisitors,
    lastUpdated,
    refresh,
    trackPageView,
    trackEvent,
  };
}

export default useAnalytics;
