/**
 * Social API Module
 * Handles all social feature API calls (follow, like, bookmark, notifications)
 */

export interface FollowResponse {
  success: boolean;
  isFollowing: boolean;
  followersCount: number;
}

export interface LikeResponse {
  success: boolean;
  liked: boolean;
  likesCount: number;
}

export interface BookmarkResponse {
  success: boolean;
  bookmarked: boolean;
}

export interface Notification {
  id: string;
  type: 'follow' | 'like' | 'comment' | 'mention' | 'bookmark' | 'system';
  title: string;
  message: string;
  avatar?: string;
  link?: string;
  timestamp: string;
  read: boolean;
}

export interface NotificationsResponse {
  notifications: Notification[];
  unreadCount: number;
}

/**
 * Follow API
 */
export const followApi = {
  /**
   * Follow or unfollow a user
   */
  async toggleFollow(
    targetUserId: string,
    action: 'follow' | 'unfollow'
  ): Promise<FollowResponse> {
    const response = await fetch('/api/social/follow', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        targetUserId,
        action,
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to update follow status');
    }

    return response.json();
  },

  /**
   * Get followers list
   */
  async getFollowers(
    userId: string,
    page: number = 1,
    limit: number = 20
  ): Promise<{ users: any[]; hasMore: boolean }> {
    const response = await fetch(
      `/api/social/followers/${userId}?page=${page}&limit=${limit}`
    );

    if (!response.ok) {
      throw new Error('Failed to fetch followers');
    }

    return response.json();
  },

  /**
   * Get following list
   */
  async getFollowing(
    userId: string,
    page: number = 1,
    limit: number = 20
  ): Promise<{ users: any[]; hasMore: boolean }> {
    const response = await fetch(
      `/api/social/following/${userId}?page=${page}&limit=${limit}`
    );

    if (!response.ok) {
      throw new Error('Failed to fetch following');
    }

    return response.json();
  },

  /**
   * Get follow stats
   */
  async getFollowStats(userId: string): Promise<{
    followers: number;
    following: number;
    isFollowing: boolean;
  }> {
    const response = await fetch(`/api/social/follow-stats/${userId}`);

    if (!response.ok) {
      throw new Error('Failed to fetch follow stats');
    }

    return response.json();
  },
};

/**
 * Like API
 */
export const likeApi = {
  /**
   * Like or unlike an item
   */
  async toggleLike(
    itemId: string,
    itemType: 'post' | 'comment',
    action: 'like' | 'unlike'
  ): Promise<LikeResponse> {
    const response = await fetch('/api/social/like', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        item_id: itemId,
        item_type: itemType,
        action,
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to update like status');
    }

    return response.json();
  },

  /**
   * Get likes for an item
   */
  async getLikes(
    itemId: string,
    itemType: 'post' | 'comment'
  ): Promise<{ users: any[]; count: number }> {
    const response = await fetch(
      `/api/social/likes/${itemType}/${itemId}`
    );

    if (!response.ok) {
      throw new Error('Failed to fetch likes');
    }

    return response.json();
  },
};

/**
 * Bookmark API
 */
export const bookmarkApi = {
  /**
   * Bookmark or unbookmark an item
   */
  async toggleBookmark(
    itemId: string,
    itemType: 'post' | 'comment',
    action: 'bookmark' | 'unbookmark',
    folderId?: string
  ): Promise<BookmarkResponse> {
    const response = await fetch('/api/social/bookmark', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        item_id: itemId,
        item_type: itemType,
        action,
        folder_id: folderId,
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to update bookmark status');
    }

    return response.json();
  },

  /**
   * Get bookmark folders
   */
  async getFolders(): Promise<{ folders: any[] }> {
    const response = await fetch('/api/bookmarks/folders');

    if (!response.ok) {
      throw new Error('Failed to fetch folders');
    }

    return response.json();
  },

  /**
   * Create a new bookmark folder
   */
  async createFolder(
    name: string,
    icon?: string
  ): Promise<{ folder: any }> {
    const response = await fetch('/api/bookmarks/folders', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ name, icon }),
    });

    if (!response.ok) {
      throw new Error('Failed to create folder');
    }

    return response.json();
  },

  /**
   * Get bookmarks in a folder
   */
  async getBookmarks(
    folderId?: string,
    page: number = 1,
    limit: number = 20
  ): Promise<{ bookmarks: any[]; hasMore: boolean }> {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
    });

    if (folderId) {
      params.append('folder_id', folderId);
    }

    const response = await fetch(`/api/bookmarks?${params}`);

    if (!response.ok) {
      throw new Error('Failed to fetch bookmarks');
    }

    return response.json();
  },
};

/**
 * Notification API
 */
export const notificationApi = {
  /**
   * Get all notifications
   */
  async getNotifications(): Promise<NotificationsResponse> {
    const response = await fetch('/api/notifications');

    if (!response.ok) {
      throw new Error('Failed to fetch notifications');
    }

    return response.json();
  },

  /**
   * Mark a notification as read
   */
  async markAsRead(notificationId: string): Promise<void> {
    const response = await fetch(`/api/notifications/${notificationId}/read`, {
      method: 'PUT',
    });

    if (!response.ok) {
      throw new Error('Failed to mark as read');
    }
  },

  /**
   * Mark all notifications as read
   */
  async markAllAsRead(): Promise<void> {
    const response = await fetch('/api/notifications/read-all', {
      method: 'PUT',
    });

    if (!response.ok) {
      throw new Error('Failed to mark all as read');
    }
  },

  /**
   * Delete a notification
   */
  async deleteNotification(notificationId: string): Promise<void> {
    const response = await fetch(`/api/notifications/${notificationId}`, {
      method: 'DELETE',
    });

    if (!response.ok) {
      throw new Error('Failed to delete notification');
    }
  },

  /**
   * Clear all notifications
   */
  async clearAll(): Promise<void> {
    const response = await fetch('/api/notifications/clear', {
      method: 'DELETE',
    });

    if (!response.ok) {
      throw new Error('Failed to clear notifications');
    }
  },

  /**
   * Get notification settings
   */
  async getSettings(): Promise<any> {
    const response = await fetch('/api/notifications/settings');

    if (!response.ok) {
      throw new Error('Failed to fetch notification settings');
    }

    return response.json();
  },

  /**
   * Update notification settings
   */
  async updateSettings(settings: any): Promise<void> {
    const response = await fetch('/api/notifications/settings', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(settings),
    });

    if (!response.ok) {
      throw new Error('Failed to update notification settings');
    }
  },
};
