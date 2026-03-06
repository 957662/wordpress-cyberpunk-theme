/**
 * useAnalytics Hook
 * 数据分析相关的自定义 Hook
 */
'use client';

import { useState, useEffect, useCallback } from 'react';
import { api } from '@/lib/api-client';

export interface AnalyticsData {
  views: number;
  visitors: number;
  likes: number;
  comments: number;
  shares: number;
  engagement: number;
}

export interface ChartDataPoint {
  label: string;
  value: number;
}

export interface AnalyticsOverview {
  period: string;
  data: AnalyticsData;
  chart_data: ChartDataPoint[];
}

export function useAnalytics(period: 'day' | 'week' | 'month' = 'week') {
  const [data, setData] = useState<AnalyticsOverview | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAnalytics = useCallback(async () => {
    setLoading(true);
    setError(null);

    const response = await api.analytics.getOverview({ period });

    if (response.error) {
      setError(response.error);
    } else if (response.data) {
      setData(response.data as AnalyticsOverview);
    }

    setLoading(false);
  }, [period]);

  useEffect(() => {
    fetchAnalytics();
  }, [fetchAnalytics]);

  return { data, loading, error, refetch: fetchAnalytics };
}

export function usePostAnalytics(postId: number) {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      const response = await api.analytics.getPostAnalytics(postId);

      if (response.error) {
        setError(response.error);
      } else if (response.data) {
        setData(response.data);
      }

      setLoading(false);
    }

    if (postId) {
      fetchData();
    }
  }, [postId]);

  return { data, loading, error };
}

export function useTrends(metric: string = 'views', days: number = 30) {
  const [data, setData] = useState<{ date: string; value: number }[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchTrends() {
      setLoading(true);
      const response = await api.analytics.getTrends({ metric, days });

      if (response.error) {
        setError(response.error);
      } else if (response.data) {
        setData((response.data as any).data);
      }

      setLoading(false);
    }

    fetchTrends();
  }, [metric, days]);

  return { data, loading, error };
}
