/**
 * useSocialFeatures Hook
 * Custom hook for managing social features state and actions
 */

import { useState, useEffect, useCallback } from 'react';
import {
  socialApi,
  likeApi,
  bookmarkApi,
  notificationApi,
} from '@/lib/api/social';

// ============================================================================
// Types
// ============================================================================

export interface SocialState {
  // Follow state
  isFollowing: boolean;
  followersCount: number;
  followingCount: number;

  // Like state
  isLiked: boolean;
  likesCount: number;

  // Bookmark state
  isBookmarked: boolean;
  bookmarksCount: number;

  // Notification state
  unreadCount: number;
}

export interface SocialActions {
  // Follow actions
  toggleFollow: () => Promise<void>;

  // Like actions
  toggleLike: () => Promise<void>;

  // Bookmark actions
  toggleBookmark: () => Promise<void>;

  // Notification actions
  markAsRead: (notificationId: string) => Promise<void>;
  markAllAsRead: () => Promise<void>;
  refreshUnreadCount: () => Promise<void>;
}

// ============================================================================
// Hook
// ============================================================================

export const useSocialFeatures = (
  userId: string,
  postId?: string,
  commentId?: string
) => {
  const [state, setState] = useState<SocialState>({
    isFollowing: false,
    followersCount: 0,
    followingCount: 0,
    isLiked: false,
    likesCount: 0,
    isBookmarked: false,
    bookmarksCount: 0,
    unreadCount: 0,
  });

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch follow status
  const fetchFollowStatus = useCallback(async () => {
    try {
      const response = await socialApi.checkFollowStatus(userId);
      if (response.success && response.data) {
        setState((prev) => ({
          ...prev,
          isFollowing: response.data!.isFollowing,
        }));
      }
    } catch (err) {
      console.error('Failed to fetch follow status:', err);
    }
  }, [userId]);

  // Fetch follow stats
  const fetchFollowStats = useCallback(async () => {
    try {
      const response = await socialApi.getFollowStats(userId);
      if (response.success && response.data) {
        setState((prev) => ({
          ...prev,
          followersCount: response.data!.followersCount,
          followingCount: response.data!.followingCount,
        }));
      }
    } catch (err) {
      console.error('Failed to fetch follow stats:', err);
    }
  }, [userId]);

  // Fetch like status
  const fetchLikeStatus = useCallback(async () => {
    if (!postId) return;

    try {
      const response = await likeApi.checkLikeStatus(postId);
      if (response.success && response.data) {
        setState((prev) => ({
          ...prev,
          isLiked: response.data!.liked,
        }));
      }
    } catch (err) {
      console.error('Failed to fetch like status:', err);
    }
  }, [postId]);

  // Fetch bookmark status
  const fetchBookmarkStatus = useCallback(async () => {
    if (!postId) return;

    try {
      const response = await bookmarkApi.checkBookmarkStatus(postId);
      if (response.success && response.data) {
        setState((prev) => ({
          ...prev,
          isBookmarked: response.data!.bookmarked,
        }));
      }
    } catch (err) {
      console.error('Failed to fetch bookmark status:', err);
    }
  }, [postId]);

  // Fetch unread notification count
  const fetchUnreadCount = useCallback(async () => {
    try {
      const response = await notificationApi.getUnreadCount();
      if (response.success && response.data) {
        setState((prev) => ({
          ...prev,
          unreadCount: response.data!.count,
        }));
      }
    } catch (err) {
      console.error('Failed to fetch unread count:', err);
    }
  }, []);

  // Toggle follow
  const toggleFollow = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await socialApi.toggleFollow(userId);
      if (response.success && response.data) {
        const newFollowingState = response.data!.isFollowing;
        setState((prev) => ({
          ...prev,
          isFollowing: newFollowingState,
          followersCount: prev.followersCount + (newFollowingState ? 1 : -1),
        }));
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to toggle follow');
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [userId]);

  // Toggle like
  const toggleLike = useCallback(async () => {
    if (!postId) return;

    setIsLoading(true);
    setError(null);

    try {
      const response = await likeApi.toggleLike(postId);
      if (response.success && response.data) {
        const newLikedState = response.data!.liked;
        setState((prev) => ({
          ...prev,
          isLiked: newLikedState,
          likesCount: prev.likesCount + (newLikedState ? 1 : -1),
        }));
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to toggle like');
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [postId]);

  // Toggle bookmark
  const toggleBookmark = useCallback(async () => {
    if (!postId) return;

    setIsLoading(true);
    setError(null);

    try {
      const response = await bookmarkApi.toggleBookmark(postId);
      if (response.success && response.data) {
        const newBookmarkedState = response.data!.bookmarked;
        setState((prev) => ({
          ...prev,
          isBookmarked: newBookmarkedState,
          bookmarksCount: prev.bookmarksCount + (newBookmarkedState ? 1 : -1),
        }));
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to toggle bookmark');
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [postId]);

  // Mark notification as read
  const markAsRead = useCallback(async (notificationId: string) => {
    try {
      const response = await notificationApi.markAsRead(notificationId);
      if (response.success) {
        setState((prev) => ({
          ...prev,
          unreadCount: Math.max(0, prev.unreadCount - 1),
        }));
      }
    } catch (err) {
      console.error('Failed to mark as read:', err);
    }
  }, []);

  // Mark all notifications as read
  const markAllAsRead = useCallback(async () => {
    try {
      const response = await notificationApi.markAllAsRead();
      if (response.success && response.data) {
        setState((prev) => ({
          ...prev,
          unreadCount: 0,
        }));
      }
    } catch (err) {
      console.error('Failed to mark all as read:', err);
    }
  }, []);

  // Refresh unread count
  const refreshUnreadCount = useCallback(async () => {
    await fetchUnreadCount();
  }, [fetchUnreadCount]);

  // Initial fetch
  useEffect(() => {
    const init = async () => {
      setIsLoading(true);

      await Promise.all([
        fetchFollowStatus(),
        fetchFollowStats(),
        postId && fetchLikeStatus(),
        postId && fetchBookmarkStatus(),
        fetchUnreadCount(),
      ]);

      setIsLoading(false);
    };

    init();
  }, [
    fetchFollowStatus,
    fetchFollowStats,
    fetchLikeStatus,
    fetchBookmarkStatus,
    fetchUnreadCount,
    postId,
  ]);

  const actions: SocialActions = {
    toggleFollow,
    toggleLike,
    toggleBookmark,
    markAsRead,
    markAllAsRead,
    refreshUnreadCount,
  };

  return {
    state,
    actions,
    isLoading,
    error,
  };
};

// ============================================================================
// Specialized Hooks
// ============================================================================

/**
 * Hook for managing follow functionality
 */
export const useFollow = (userId: string) => {
  const [isFollowing, setIsFollowing] = useState(false);
  const [followersCount, setFollowersCount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  const toggleFollow = async () => {
    setIsLoading(true);
    try {
      const response = await socialApi.toggleFollow(userId);
      if (response.success && response.data) {
        setIsFollowing(response.data.isFollowing);
        setFollowersCount((prev) => prev + (response.data!.isFollowing ? 1 : -1));
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const init = async () => {
      const [statusRes, statsRes] = await Promise.all([
        socialApi.checkFollowStatus(userId),
        socialApi.getFollowStats(userId),
      ]);

      if (statusRes.success && statusRes.data) {
        setIsFollowing(statusRes.data.isFollowing);
      }

      if (statsRes.success && statsRes.data) {
        setFollowersCount(statsRes.data.followersCount);
      }
    };

    init();
  }, [userId]);

  return {
    isFollowing,
    followersCount,
    toggleFollow,
    isLoading,
  };
};

/**
 * Hook for managing like functionality
 */
export const useLike = (postId: string) => {
  const [isLiked, setIsLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  const toggleLike = async () => {
    setIsLoading(true);
    try {
      const response = await likeApi.toggleLike(postId);
      if (response.success && response.data) {
        setIsLiked(response.data.liked);
        setLikesCount(response.data.likesCount);
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const init = async () => {
      const response = await likeApi.checkLikeStatus(postId);
      if (response.success && response.data) {
        setIsLiked(response.data.liked);
      }
    };

    init();
  }, [postId]);

  return {
    isLiked,
    likesCount,
    toggleLike,
    isLoading,
  };
};

/**
 * Hook for managing bookmark functionality
 */
export const useBookmark = (postId: string) => {
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [bookmarksCount, setBookmarksCount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  const toggleBookmark = async () => {
    setIsLoading(true);
    try {
      const response = await bookmarkApi.toggleBookmark(postId);
      if (response.success && response.data) {
        setIsBookmarked(response.data.bookmarked);
        setBookmarksCount(response.data.bookmarksCount);
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const init = async () => {
      const response = await bookmarkApi.checkBookmarkStatus(postId);
      if (response.success && response.data) {
        setIsBookmarked(response.data.bookmarked);
      }
    };

    init();
  }, [postId]);

  return {
    isBookmarked,
    bookmarksCount,
    toggleBookmark,
    isLoading,
  };
};

/**
 * Hook for managing notifications
 */
export const useNotifications = () => {
  const [unreadCount, setUnreadCount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  const refreshUnreadCount = async () => {
    setIsLoading(true);
    try {
      const response = await notificationApi.getUnreadCount();
      if (response.success && response.data) {
        setUnreadCount(response.data.count);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const markAsRead = async (notificationId: string) => {
    const response = await notificationApi.markAsRead(notificationId);
    if (response.success) {
      setUnreadCount((prev) => Math.max(0, prev - 1));
    }
  };

  const markAllAsRead = async () => {
    const response = await notificationApi.markAllAsRead();
    if (response.success) {
      setUnreadCount(0);
    }
  };

  useEffect(() => {
    refreshUnreadCount();
  }, []);

  return {
    unreadCount,
    markAsRead,
    markAllAsRead,
    refreshUnreadCount,
    isLoading,
  };
};
