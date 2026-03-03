/**
 * Social Features API Service
 * Handles follow, like, bookmark, and notification API calls
 */

import { ApiResponse } from '@/types/api.types';

// ============================================================================
// Types
// ============================================================================

export interface FollowStats {
  followersCount: number;
  followingCount: number;
  isFollowing: boolean;
}

export interface FollowUser {
  id: string;
  name: string;
  username: string;
  avatar?: string;
  bio?: string;
  followersCount: number;
  isFollowing: boolean;
}

export interface LikeResponse {
  liked: boolean;
  likesCount: number;
}

export interface BookmarkResponse {
  bookmarked: boolean;
  bookmarksCount: number;
}

export interface NotificationPreferences {
  emailFollows: boolean;
  emailLikes: boolean;
  emailComments: boolean;
  emailMentions: boolean;
  pushFollows: boolean;
  pushLikes: boolean;
  pushComments: boolean;
  pushMentions: boolean;
}

// ============================================================================
// Follow API
// ============================================================================

export const socialApi = {
  /**
   * Get user follow statistics
   */
  async getFollowStats(userId: string): Promise<ApiResponse<FollowStats>> {
    const response = await fetch(`/api/social/follows/${userId}/stats`);
    if (!response.ok) {
      throw new Error('Failed to fetch follow stats');
    }
    return response.json();
  },

  /**
   * Follow or unfollow a user
   */
  async toggleFollow(userId: string): Promise<ApiResponse<{ isFollowing: boolean }>> {
    const response = await fetch(`/api/social/follows/${userId}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    if (!response.ok) {
      throw new Error('Failed to toggle follow');
    }
    return response.json();
  },

  /**
   * Get user's followers list
   */
  async getFollowers(
    userId: string,
    page: number = 1,
    perPage: number = 20
  ): Promise<ApiResponse<{ users: FollowUser[]; total: number }>> {
    const response = await fetch(
      `/api/social/follows/${userId}/followers?page=${page}&perPage=${perPage}`
    );
    if (!response.ok) {
      throw new Error('Failed to fetch followers');
    }
    return response.json();
  },

  /**
   * Get users that the user is following
   */
  async getFollowing(
    userId: string,
    page: number = 1,
    perPage: number = 20
  ): Promise<ApiResponse<{ users: FollowUser[]; total: number }>> {
    const response = await fetch(
      `/api/social/follows/${userId}/following?page=${page}&perPage=${perPage}`
    );
    if (!response.ok) {
      throw new Error('Failed to fetch following');
    }
    return response.json();
  },

  /**
   * Check if current user follows target user
   */
  async checkFollowStatus(userId: string): Promise<ApiResponse<{ isFollowing: boolean }>> {
    const response = await fetch(`/api/social/follows/${userId}/status`);
    if (!response.ok) {
      throw new Error('Failed to check follow status');
    }
    return response.json();
  },
};

// ============================================================================
// Like API
// ============================================================================

export const likeApi = {
  /**
   * Like or unlike a post
   */
  async toggleLike(postId: string): Promise<ApiResponse<LikeResponse>> {
    const response = await fetch(`/api/social/likes/${postId}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    if (!response.ok) {
      throw new Error('Failed to toggle like');
    }
    return response.json();
  },

  /**
   * Like or unlike a comment
   */
  async toggleCommentLike(commentId: string): Promise<ApiResponse<LikeResponse>> {
    const response = await fetch(`/api/social/likes/comment/${commentId}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    if (!response.ok) {
      throw new Error('Failed to toggle comment like');
    }
    return response.json();
  },

  /**
   * Get users who liked a post
   */
  async getPostLikers(
    postId: string,
    page: number = 1,
    perPage: number = 20
  ): Promise<ApiResponse<{ users: FollowUser[]; total: number }>> {
    const response = await fetch(
      `/api/social/likes/${postId}/users?page=${page}&perPage=${perPage}`
    );
    if (!response.ok) {
      throw new Error('Failed to fetch post likers');
    }
    return response.json();
  },

  /**
   * Check if current user liked a post
   */
  async checkLikeStatus(postId: string): Promise<ApiResponse<{ liked: boolean }>> {
    const response = await fetch(`/api/social/likes/${postId}/status`);
    if (!response.ok) {
      throw new Error('Failed to check like status');
    }
    return response.json();
  },
};

// ============================================================================
// Bookmark API
// ============================================================================

export const bookmarkApi = {
  /**
   * Add or remove bookmark
   */
  async toggleBookmark(postId: string): Promise<ApiResponse<BookmarkResponse>> {
    const response = await fetch(`/api/social/bookmarks/${postId}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    if (!response.ok) {
      throw new Error('Failed to toggle bookmark');
    }
    return response.json();
  },

  /**
   * Get user's bookmarks
   */
  async getBookmarks(
    page: number = 1,
    perPage: number = 20,
    folder?: string
  ): Promise<ApiResponse<{ posts: any[]; total: number; folders: string[] }>> {
    const params = new URLSearchParams({
      page: page.toString(),
      perPage: perPage.toString(),
    });
    if (folder) {
      params.append('folder', folder);
    }
    const response = await fetch(`/api/social/bookmarks?${params}`);
    if (!response.ok) {
      throw new Error('Failed to fetch bookmarks');
    }
    return response.json();
  },

  /**
   * Check if post is bookmarked
   */
  async checkBookmarkStatus(postId: string): Promise<ApiResponse<{ bookmarked: boolean }>> {
    const response = await fetch(`/api/social/bookmarks/${postId}/status`);
    if (!response.ok) {
      throw new Error('Failed to check bookmark status');
    }
    return response.json();
  },

  /**
   * Create bookmark folder
   */
  async createFolder(name: string): Promise<ApiResponse<{ id: string; name: string }>> {
    const response = await fetch('/api/social/bookmarks/folders', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ name }),
    });
    if (!response.ok) {
      throw new Error('Failed to create folder');
    }
    return response.json();
  },

  /**
   * Delete bookmark folder
   */
  async deleteFolder(folderId: string): Promise<ApiResponse<{ success: boolean }>> {
    const response = await fetch(`/api/social/bookmarks/folders/${folderId}`, {
      method: 'DELETE',
    });
    if (!response.ok) {
      throw new Error('Failed to delete folder');
    }
    return response.json();
  },

  /**
   * Move bookmark to folder
   */
  async moveToFolder(
    postId: string,
    folderId: string
  ): Promise<ApiResponse<{ success: boolean }>> {
    const response = await fetch(`/api/social/bookmarks/${postId}/move`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ folderId }),
    });
    if (!response.ok) {
      throw new Error('Failed to move bookmark');
    }
    return response.json();
  },
};

// ============================================================================
// Notification API
// ============================================================================

export const notificationApi = {
  /**
   * Get user notifications
   */
  async getNotifications(params: {
    page?: number;
    perPage?: number;
    unreadOnly?: boolean;
    type?: string;
  }): Promise<
    ApiResponse<{
      notifications: any[];
      total: number;
      unreadCount: number;
    }>
  > {
    const searchParams = new URLSearchParams();
    if (params.page) searchParams.append('page', params.page.toString());
    if (params.perPage) searchParams.append('perPage', params.perPage.toString());
    if (params.unreadOnly) searchParams.append('unreadOnly', 'true');
    if (params.type) searchParams.append('type', params.type);

    const response = await fetch(`/api/social/notifications?${searchParams}`);
    if (!response.ok) {
      throw new Error('Failed to fetch notifications');
    }
    return response.json();
  },

  /**
   * Mark notification as read
   */
  async markAsRead(notificationId: string): Promise<ApiResponse<{ success: boolean }>> {
    const response = await fetch(`/api/social/notifications/${notificationId}/read`, {
      method: 'PUT',
    });
    if (!response.ok) {
      throw new Error('Failed to mark as read');
    }
    return response.json();
  },

  /**
   * Mark all notifications as read
   */
  async markAllAsRead(): Promise<ApiResponse<{ success: boolean; count: number }>> {
    const response = await fetch('/api/social/notifications/read-all', {
      method: 'PUT',
    });
    if (!response.ok) {
      throw new Error('Failed to mark all as read');
    }
    return response.json();
  },

  /**
   * Delete notification
   */
  async deleteNotification(notificationId: string): Promise<ApiResponse<{ success: boolean }>> {
    const response = await fetch(`/api/social/notifications/${notificationId}`, {
      method: 'DELETE',
    });
    if (!response.ok) {
      throw new Error('Failed to delete notification');
    }
    return response.json();
  },

  /**
   * Get notification preferences
   */
  async getPreferences(): Promise<ApiResponse<NotificationPreferences>> {
    const response = await fetch('/api/social/notifications/preferences');
    if (!response.ok) {
      throw new Error('Failed to fetch preferences');
    }
    return response.json();
  },

  /**
   * Update notification preferences
   */
  async updatePreferences(
    preferences: Partial<NotificationPreferences>
  ): Promise<ApiResponse<NotificationPreferences>> {
    const response = await fetch('/api/social/notifications/preferences', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(preferences),
    });
    if (!response.ok) {
      throw new Error('Failed to update preferences');
    }
    return response.json();
  },

  /**
   * Get unread count
   */
  async getUnreadCount(): Promise<ApiResponse<{ count: number }>> {
    const response = await fetch('/api/social/notifications/unread-count');
    if (!response.ok) {
      throw new Error('Failed to fetch unread count');
    }
    return response.json();
  },
};

// ============================================================================
// User Activity API
// ============================================================================

export const activityApi = {
  /**
   * Get user's recent activity
   */
  async getUserActivity(
    userId: string,
    page: number = 1,
    perPage: number = 20
  ): Promise<ApiResponse<{ activities: any[]; total: number }>> {
    const response = await fetch(
      `/api/social/activity/${userId}?page=${page}&perPage=${perPage}`
    );
    if (!response.ok) {
      throw new Error('Failed to fetch user activity');
    }
    return response.json();
  },

  /**
   * Get global activity feed
   */
  async getActivityFeed(
    page: number = 1,
    perPage: number = 20
  ): Promise<ApiResponse<{ activities: any[]; total: number }>> {
    const response = await fetch(
      `/api/social/activity/feed?page=${page}&perPage=${perPage}`
    );
    if (!response.ok) {
      throw new Error('Failed to fetch activity feed');
    }
    return response.json();
  },
};
