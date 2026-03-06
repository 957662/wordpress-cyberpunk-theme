/**
 * Custom hooks for social features
 */

import { useState, useEffect, useCallback, useTransition } from 'react';
import { followApi, likeApi, bookmarkApi, notificationApi } from '@/lib/social-api';
import type {
  SocialUser,
  Notification,
  BookmarkFolder,
  Bookmark,
  FollowStats,
  LikeStats,
  BookmarkStats,
} from '@/types/social';

/**
 * Hook for follow functionality
 */
export function useFollow(targetUserId: string) {
  const [stats, setStats] = useState<FollowStats>({
    followers: 0,
    following: 0,
    isFollowing: false,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    fetchStats();
  }, [targetUserId]);

  const fetchStats = async () => {
    try {
      setIsLoading(true);
      const data = await followApi.getFollowStats(targetUserId);
      setStats(data);
    } catch (error) {
      console.error('Error fetching follow stats:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleFollow = async (action: 'follow' | 'unfollow') => {
    try {
      setIsLoading(true);
      const data = await followApi.toggleFollow(targetUserId, action);

      startTransition(() => {
        setStats({
          followers: data.followersCount,
          following: stats.following,
          isFollowing: data.isFollowing,
        });
      });

      return data;
    } catch (error) {
      console.error('Error toggling follow:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const follow = () => toggleFollow('follow');
  const unfollow = () => toggleFollow('unfollow');

  return {
    stats,
    isLoading: isLoading || isPending,
    follow,
    unfollow,
    refresh: fetchStats,
  };
}

/**
 * Hook for like functionality
 */
export function useLike(itemId: string, itemType: 'post' | 'comment') {
  const [stats, setStats] = useState<LikeStats>({
    count: 0,
    liked: false,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    // Fetch initial like status if needed
    // This could be passed as props or fetched from API
  }, [itemId, itemType]);

  const toggleLike = async (action: 'like' | 'unlike') => {
    try {
      setIsLoading(true);
      const data = await likeApi.toggleLike(itemId, itemType, action);

      startTransition(() => {
        setStats({
          count: data.likesCount,
          liked: data.liked,
        });
      });

      return data;
    } catch (error) {
      console.error('Error toggling like:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const like = () => toggleLike('like');
  const unlike = () => toggleLike('unlike');

  return {
    stats,
    isLoading: isLoading || isPending,
    like,
    unlike,
    setStats,
  };
}

/**
 * Hook for bookmark functionality
 */
export function useBookmark(itemId: string, itemType: 'post' | 'comment') {
  const [stats, setStats] = useState<BookmarkStats>({
    count: 0,
    bookmarked: false,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [isPending, startTransition] = useTransition();

  const toggleBookmark = async (
    action: 'bookmark' | 'unbookmark',
    folderId?: string
  ) => {
    try {
      setIsLoading(true);
      const data = await bookmarkApi.toggleBookmark(
        itemId,
        itemType,
        action,
        folderId
      );

      startTransition(() => {
        setStats((prev) => ({
          ...prev,
          bookmarked: data.bookmarked,
        }));
      });

      return data;
    } catch (error) {
      console.error('Error toggling bookmark:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const bookmark = (folderId?: string) => toggleBookmark('bookmark', folderId);
  const unbookmark = () => toggleBookmark('unbookmark');

  return {
    stats,
    isLoading: isLoading || isPending,
    bookmark,
    unbookmark,
    setStats,
  };
}

/**
 * Hook for notifications
 */
export function useNotifications() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  const fetchNotifications = async () => {
    try {
      setIsLoading(true);
      const data = await notificationApi.getNotifications();
      setNotifications(data.notifications);
      setUnreadCount(data.unreadCount);
    } catch (error) {
      console.error('Error fetching notifications:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const markAsRead = async (notificationId: string) => {
    try {
      await notificationApi.markAsRead(notificationId);
      setNotifications((prev) =>
        prev.map((n) => (n.id === notificationId ? { ...n, read: true } : n))
      );
      setUnreadCount((prev) => Math.max(0, prev - 1));
    } catch (error) {
      console.error('Error marking as read:', error);
      throw error;
    }
  };

  const markAllAsRead = async () => {
    try {
      await notificationApi.markAllAsRead();
      setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
      setUnreadCount(0);
    } catch (error) {
      console.error('Error marking all as read:', error);
      throw error;
    }
  };

  const deleteNotification = async (notificationId: string) => {
    try {
      await notificationApi.deleteNotification(notificationId);
      setNotifications((prev) => {
        const notification = prev.find((n) => n.id === notificationId);
        const newCount = notification && !notification.read ? unreadCount - 1 : unreadCount;
        setUnreadCount(Math.max(0, newCount));
        return prev.filter((n) => n.id !== notificationId);
      });
    } catch (error) {
      console.error('Error deleting notification:', error);
      throw error;
    }
  };

  const clearAll = async () => {
    try {
      await notificationApi.clearAll();
      setNotifications([]);
      setUnreadCount(0);
    } catch (error) {
      console.error('Error clearing notifications:', error);
      throw error;
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  return {
    notifications,
    unreadCount,
    isLoading,
    fetchNotifications,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    clearAll,
  };
}

/**
 * Hook for bookmark folders
 */
export function useBookmarkFolders() {
  const [folders, setFolders] = useState<BookmarkFolder[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchFolders = async () => {
    try {
      setIsLoading(true);
      const data = await bookmarkApi.getFolders();
      setFolders(data.folders);
    } catch (error) {
      console.error('Error fetching folders:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const createFolder = async (name: string, icon?: string) => {
    try {
      const data = await bookmarkApi.createFolder(name, icon);
      setFolders((prev) => [...prev, data.folder]);
      return data.folder;
    } catch (error) {
      console.error('Error creating folder:', error);
      throw error;
    }
  };

  useEffect(() => {
    fetchFolders();
  }, []);

  return {
    folders,
    isLoading,
    fetchFolders,
    createFolder,
  };
}

/**
 * Hook for followers/following lists
 */
export function useFollowList(
  userId: string,
  type: 'followers' | 'following'
) {
  const [users, setUsers] = useState<SocialUser[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(1);

  const fetchUsers = async (pageNum: number = page) => {
    try {
      setIsLoading(true);
      const data =
        type === 'followers'
          ? await followApi.getFollowers(userId, pageNum)
          : await followApi.getFollowing(userId, pageNum);

      if (pageNum === 1) {
        setUsers(data.users);
      } else {
        setUsers((prev) => [...prev, ...data.users]);
      }

      setHasMore(data.hasMore);
      setPage(pageNum);
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const loadMore = () => {
    if (!isLoading && hasMore) {
      fetchUsers(page + 1);
    }
  };

  const refresh = () => {
    setUsers([]);
    setPage(1);
    fetchUsers(1);
  };

  useEffect(() => {
    fetchUsers(1);
  }, [userId, type]);

  return {
    users,
    isLoading,
    hasMore,
    loadMore,
    refresh,
  };
}
