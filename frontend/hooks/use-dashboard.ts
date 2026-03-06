/**
 * useDashboard Hook
 * 仪表板相关的自定义 Hook
 */
'use client';

import { useState, useEffect, useCallback } from 'react';
import { api } from '@/lib/api-client';

export interface QuickStat {
  label: string;
  value: number | string;
  change: string;
  type: string;
}

export interface Activity {
  id: string;
  type: string;
  message: string;
  time: string;
  user?: {
    name: string;
    avatar?: string;
  };
}

export interface DashboardData {
  stats: QuickStat[];
  activities: Activity[];
  summary: {
    total_posts: number;
    total_users: number;
    total_views: number;
    total_comments: number;
    popular_posts: Array<{ id: number; title: string; views: number }>;
    active_users: Array<{ name: string; posts: number }>;
  };
}

export function useDashboard() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchDashboard = useCallback(async () => {
    setLoading(true);
    setError(null);

    const response = await api.dashboard.getData();

    if (response.error) {
      setError(response.error);
    } else if (response.data) {
      setData(response.data as DashboardData);
    }

    setLoading(false);
  }, []);

  useEffect(() => {
    fetchDashboard();
  }, [fetchDashboard]);

  return { data, loading, error, refetch: fetchDashboard };
}

export function useQuickStats() {
  const [stats, setStats] = useState<{
    posts: { total: number; change: string };
    users: { total: number; change: string };
    views: { total: number; change: string };
    comments: { total: number; change: string };
  } | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchStats() {
      setLoading(true);
      const response = await api.dashboard.getStats();

      if (response.error) {
        setError(response.error);
      } else if (response.data) {
        setStats(response.data as any);
      }

      setLoading(false);
    }

    fetchStats();
  }, []);

  return { stats, loading, error };
}

export function useRecentActivities(limit: number = 10) {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchActivities() {
      setLoading(true);
      const response = await api.dashboard.getActivities({ limit });

      if (response.error) {
        setError(response.error);
      } else if (response.data) {
        setActivities((response.data as any).activities);
      }

      setLoading(false);
    }

    fetchActivities();
  }, [limit]);

  return { activities, loading, error };
}
