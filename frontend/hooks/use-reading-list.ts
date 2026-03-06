/**
 * Reading List Hook
 *
 * Hook for managing user reading list
 */

'use client';

import { useState, useEffect, useCallback } from 'react';
import { apiClient } from '../lib/api-client';

export interface ReadingListItem {
  id: number;
  post_id: number;
  progress: number;
  completed: boolean;
  notes?: string;
  created_at: string;
  updated_at: string;
  post?: {
    id: number;
    title: string;
    slug: string;
    excerpt?: string;
    featured_image?: string;
  };
}

export interface UseReadingListResult {
  items: ReadingListItem[];
  isLoading: boolean;
  isError: boolean;
  error?: Error;
  addItem: (postId: number) => Promise<void>;
  removeItem: (postId: number) => Promise<void>;
  updateProgress: (postId: number, progress: number) => Promise<void>;
  markCompleted: (postId: number) => Promise<void>;
  refetch: () => void;
  stats: {
    total: number;
    completed: number;
    inProgress: number;
    completionRate: number;
  };
}

export function useReadingList() {
  const [items, setItems] = useState<ReadingListItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const [error, setError] = useState<Error | undefined>();

  const fetchItems = useCallback(async () => {
    setIsLoading(true);
    setIsError(false);
    setError(undefined);

    try {
      const response = await apiClient.get('/reading-list');
      setItems(response.data);
    } catch (err) {
      setIsError(true);
      setError(err instanceof Error ? err : new Error('Failed to fetch reading list'));
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchItems();
  }, [fetchItems]);

  const addItem = useCallback(async (postId: number) => {
    try {
      await apiClient.post('/reading-list', { post_id: postId });
      await fetchItems();
    } catch (err) {
      console.error('Failed to add to reading list:', err);
      throw err;
    }
  }, [fetchItems]);

  const removeItem = useCallback(async (postId: number) => {
    try {
      await apiClient.delete(`/reading-list/${postId}`);
      await fetchItems();
    } catch (err) {
      console.error('Failed to remove from reading list:', err);
      throw err;
    }
  }, [fetchItems]);

  const updateProgress = useCallback(async (postId: number, progress: number) => {
    try {
      await apiClient.patch(`/reading-list/${postId}`, { progress });
      await fetchItems();
    } catch (err) {
      console.error('Failed to update progress:', err);
      throw err;
    }
  }, [fetchItems]);

  const markCompleted = useCallback(async (postId: number) => {
    try {
      await apiClient.patch(`/reading-list/${postId}`, {
        progress: 100,
        completed: true,
      });
      await fetchItems();
    } catch (err) {
      console.error('Failed to mark as completed:', err);
      throw err;
    }
  }, [fetchItems]);

  // Calculate stats
  const stats = {
    total: items.length,
    completed: items.filter((item) => item.completed).length,
    inProgress: items.filter((item) => !item.completed && item.progress > 0).length,
    completionRate: items.length > 0
      ? (items.filter((item) => item.completed).length / items.length) * 100
      : 0,
  };

  return {
    items,
    isLoading,
    isError,
    error,
    addItem,
    removeItem,
    updateProgress,
    markCompleted,
    refetch: fetchItems,
    stats,
  };
}
