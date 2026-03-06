/**
 * Bookmarks Hook
 *
 * Hook for managing user bookmarks
 */

'use client';

import { useState, useEffect, useCallback } from 'react';
import { apiClient } from '../lib/api-client';

export interface BookmarkItem {
  id: number;
  post_id: number;
  notes?: string;
  tags?: string[];
  is_public: boolean;
  created_at: string;
  post?: {
    id: number;
    title: string;
    slug: string;
    excerpt?: string;
    featured_image?: string;
    author?: {
      username: string;
      avatar_url?: string;
    };
  };
}

export interface UseBookmarksResult {
  bookmarks: BookmarkItem[];
  isLoading: boolean;
  isError: boolean;
  error?: Error;
  addBookmark: (postId: number, notes?: string) => Promise<void>;
  removeBookmark: (postId: number) => Promise<void>;
  updateBookmark: (postId: number, data: { notes?: string; tags?: string[]; is_public?: boolean }) => Promise<void>;
  isBookmarked: (postId: number) => boolean;
  refetch: () => void;
}

export function useBookmarks() {
  const [bookmarks, setBookmarks] = useState<BookmarkItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const [error, setError] = useState<Error | undefined>();

  const fetchBookmarks = useCallback(async () => {
    setIsLoading(true);
    setIsError(false);
    setError(undefined);

    try {
      const response = await apiClient.get('/bookmarks');
      setBookmarks(response.data);
    } catch (err) {
      setIsError(true);
      setError(err instanceof Error ? err : new Error('Failed to fetch bookmarks'));
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchBookmarks();
  }, [fetchBookmarks]);

  const addBookmark = useCallback(async (postId: number, notes?: string) => {
    try {
      await apiClient.post('/bookmarks', { post_id: postId, notes });
      await fetchBookmarks();
    } catch (err) {
      console.error('Failed to add bookmark:', err);
      throw err;
    }
  }, [fetchBookmarks]);

  const removeBookmark = useCallback(async (postId: number) => {
    try {
      await apiClient.delete(`/bookmarks/${postId}`);
      await fetchBookmarks();
    } catch (err) {
      console.error('Failed to remove bookmark:', err);
      throw err;
    }
  }, [fetchBookmarks]);

  const updateBookmark = useCallback(async (
    postId: number,
    data: { notes?: string; tags?: string[]; is_public?: boolean },
  ) => {
    try {
      await apiClient.patch(`/bookmarks/${postId}`, data);
      await fetchBookmarks();
    } catch (err) {
      console.error('Failed to update bookmark:', err);
      throw err;
    }
  }, [fetchBookmarks]);

  const isBookmarked = useCallback((postId: number) => {
    return bookmarks.some((bookmark) => bookmark.post_id === postId);
  }, [bookmarks]);

  return {
    bookmarks,
    isLoading,
    isError,
    error,
    addBookmark,
    removeBookmark,
    updateBookmark,
    isBookmarked,
    refetch: fetchBookmarks,
  };
}

/**
 * Simple hook to check if a single post is bookmarked
 */
export function useIsBookmarked(postId: number | null | undefined): boolean {
  const { bookmarks } = useBookmarks();

  if (!postId) {
    return false;
  }

  return bookmarks.some((bookmark) => bookmark.post_id === postId);
}
