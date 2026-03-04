/**
 * Social API Service
 * 社交功能API服务
 */

import { api } from '@/lib/api-client';
import type {
  User,
  Post,
  Comment,
  Notification,
  Follow,
  Like,
  Bookmark,
  PaginatedResponse,
  ApiResponse,
} from '@/types';

export class SocialApiService {
  private baseUrl = '/api/v1';

  // ==================== 关注相关 ====================

  /**
   * 关注用户
   */
  async followUser(userId: string): Promise<ApiResponse<Follow>> {
    return api.post(`${this.baseUrl}/social/follow`, { target_user_id: userId });
  }

  /**
   * 取消关注
   */
  async unfollowUser(userId: string): Promise<ApiResponse<void>> {
    return api.delete(`${this.baseUrl}/social/follow/${userId}`);
  }

  /**
   * 检查是否关注
   */
  async isFollowing(userId: string): Promise<ApiResponse<boolean>> {
    return api.get(`${this.baseUrl}/social/follow/check/${userId}`);
  }

  /**
   * 获取粉丝列表
   */
  async getFollowers(
    userId: string,
    params?: { page?: number; per_page?: number }
  ): Promise<ApiResponse<PaginatedResponse<User>>> {
    return api.get(`${this.baseUrl}/social/follow/${userId}/followers`, { params });
  }

  /**
   * 获取关注列表
   */
  async getFollowing(
    userId: string,
    params?: { page?: number; per_page?: number }
  ): Promise<ApiResponse<PaginatedResponse<User>>> {
    return api.get(`${this.baseUrl}/social/follow/${userId}/following`, { params });
  }

  // ==================== 点赞相关 ====================

  /**
   * 点赞文章
   */
  async likePost(postId: string): Promise<ApiResponse<Like>> {
    return api.post(`${this.baseUrl}/social/like/post/${postId}`);
  }

  /**
   * 取消点赞文章
   */
  async unlikePost(postId: string): Promise<ApiResponse<void>> {
    return api.delete(`${this.baseUrl}/social/like/post/${postId}`);
  }

  /**
   * 检查是否点赞文章
   */
  async hasLikedPost(postId: string): Promise<ApiResponse<boolean>> {
    return api.get(`${this.baseUrl}/social/like/post/${postId}/check`);
  }

  /**
   * 点赞评论
   */
  async likeComment(commentId: string): Promise<ApiResponse<Like>> {
    return api.post(`${this.baseUrl}/social/like/comment/${commentId}`);
  }

  /**
   * 取消点赞评论
   */
  async unlikeComment(commentId: string): Promise<ApiResponse<void>> {
    return api.delete(`${this.baseUrl}/social/like/comment/${commentId}`);
  }

  /**
   * 获取文章点赞列表
   */
  async getPostLikes(
    postId: string,
    params?: { page?: number; per_page?: number }
  ): Promise<ApiResponse<PaginatedResponse<User>>> {
    return api.get(`${this.baseUrl}/social/like/post/${postId}/users`, { params });
  }

  // ==================== 收藏相关 ====================

  /**
   * 收藏文章
   */
  async bookmarkPost(
    postId: string,
    data?: { folder?: string; notes?: string }
  ): Promise<ApiResponse<Bookmark>> {
    return api.post(`${this.baseUrl}/social/bookmark`, {
      post_id: postId,
      ...data,
    });
  }

  /**
   * 取消收藏
   */
  async unbookmarkPost(postId: string): Promise<ApiResponse<void>> {
    return api.delete(`${this.baseUrl}/social/bookmark/${postId}`);
  }

  /**
   * 检查是否收藏
   */
  async hasBookmarkedPost(postId: string): Promise<ApiResponse<boolean>> {
    return api.get(`${this.baseUrl}/social/bookmark/check/${postId}`);
  }

  /**
   * 获取收藏列表
   */
  async getBookmarks(params?: {
    page?: number;
    per_page?: number;
    folder?: string;
  }): Promise<ApiResponse<PaginatedResponse<Post>>> {
    return api.get(`${this.baseUrl}/social/bookmark`, { params });
  }

  /**
   * 更新收藏
   */
  async updateBookmark(
    bookmarkId: string,
    data: { folder?: string; notes?: string }
  ): Promise<ApiResponse<Bookmark>> {
    return api.patch(`${this.baseUrl}/social/bookmark/${bookmarkId}`, data);
  }

  // ==================== 通知相关 ====================

  /**
   * 获取通知列表
   */
  async getNotifications(params?: {
    page?: number;
    per_page?: number;
    unread_only?: boolean;
    type?: string;
  }): Promise<ApiResponse<PaginatedResponse<Notification>>> {
    return api.get(`${this.baseUrl}/notifications`, { params });
  }

  /**
   * 获取未读数量
   */
  async getUnreadCount(): Promise<ApiResponse<{ count: number }>> {
    return api.get(`${this.baseUrl}/notifications/unread-count`);
  }

  /**
   * 标记为已读
   */
  async markAsRead(notificationId: string): Promise<ApiResponse<void>> {
    return api.patch(`${this.baseUrl}/notifications/${notificationId}/read`);
  }

  /**
   * 标记所有为已读
   */
  async markAllAsRead(): Promise<ApiResponse<void>> {
    return api.post(`${this.baseUrl}/notifications/read-all`);
  }

  /**
   * 删除通知
   */
  async deleteNotification(notificationId: string): Promise<ApiResponse<void>> {
    return api.delete(`${this.baseUrl}/notifications/${notificationId}`);
  }

  /**
   * 清空所有通知
   */
  async clearAllNotifications(): Promise<ApiResponse<void>> {
    return api.delete(`${this.baseUrl}/notifications`);
  }

  // ==================== 活动流 ====================

  /**
   * 获取动态流
   */
  async getActivityFeed(params?: {
    page?: number;
    per_page?: number;
    type?: 'following' | 'global' | 'trending';
  }): Promise<ApiResponse<PaginatedResponse<any>>> {
    return api.get(`${this.baseUrl}/social/activity`, { params });
  }

  /**
   * 获取用户动态
   */
  async getUserActivity(
    userId: string,
    params?: { page?: number; per_page?: number }
  ): Promise<ApiResponse<PaginatedResponse<any>>> {
    return api.get(`${this.baseUrl}/social/activity/user/${userId}`, { params });
  }

  // ==================== 推荐相关 ====================

  /**
   * 获取推荐用户
   */
  async getSuggestedUsers(limit?: number): Promise<ApiResponse<User[]>> {
    return api.get(`${this.baseUrl}/social/suggestions/users`, {
      params: { limit },
    });
  }

  /**
   * 获取推荐文章
   */
  async getSuggestedPosts(limit?: number): Promise<ApiResponse<Post[]>> {
    return api.get(`${this.baseUrl}/social/suggestions/posts`, {
      params: { limit },
    });
  }

  /**
   * 获取推荐标签
   */
  async getTrendingTags(limit?: number): Promise<ApiResponse<any[]>> {
    return api.get(`${this.baseUrl}/social/suggestions/tags`, {
      params: { limit },
    });
  }
}

// 导出单例
export const socialApiService = new SocialApiService();

// 导出便捷函数
export const socialApi = {
  // 关注
  followUser: (userId: string) => socialApiService.followUser(userId),
  unfollowUser: (userId: string) => socialApiService.unfollowUser(userId),
  isFollowing: (userId: string) => socialApiService.isFollowing(userId),
  getFollowers: (userId: string, params?: any) =>
    socialApiService.getFollowers(userId, params),
  getFollowing: (userId: string, params?: any) =>
    socialApiService.getFollowing(userId, params),

  // 点赞
  likePost: (postId: string) => socialApiService.likePost(postId),
  unlikePost: (postId: string) => socialApiService.unlikePost(postId),
  hasLikedPost: (postId: string) => socialApiService.hasLikedPost(postId),
  likeComment: (commentId: string) => socialApiService.likeComment(commentId),
  unlikeComment: (commentId: string) => socialApiService.unlikeComment(commentId),
  getPostLikes: (postId: string, params?: any) =>
    socialApiService.getPostLikes(postId, params),

  // 收藏
  bookmarkPost: (postId: string, data?: any) =>
    socialApiService.bookmarkPost(postId, data),
  unbookmarkPost: (postId: string) =>
    socialApiService.unbookmarkPost(postId),
  hasBookmarkedPost: (postId: string) =>
    socialApiService.hasBookmarkedPost(postId),
  getBookmarks: (params?: any) => socialApiService.getBookmarks(params),
  updateBookmark: (bookmarkId: string, data: any) =>
    socialApiService.updateBookmark(bookmarkId, data),

  // 通知
  getNotifications: (params?: any) =>
    socialApiService.getNotifications(params),
  getUnreadCount: () => socialApiService.getUnreadCount(),
  markAsRead: (notificationId: string) =>
    socialApiService.markAsRead(notificationId),
  markAllAsRead: () => socialApiService.markAllAsRead(),
  deleteNotification: (notificationId: string) =>
    socialApiService.deleteNotification(notificationId),
  clearAllNotifications: () => socialApiService.clearAllNotifications(),

  // 活动
  getActivityFeed: (params?: any) =>
    socialApiService.getActivityFeed(params),
  getUserActivity: (userId: string, params?: any) =>
    socialApiService.getUserActivity(userId, params),

  // 推荐
  getSuggestedUsers: (limit?: number) =>
    socialApiService.getSuggestedUsers(limit),
  getSuggestedPosts: (limit?: number) =>
    socialApiService.getSuggestedPosts(limit),
  getTrendingTags: (limit?: number) =>
    socialApiService.getTrendingTags(limit),
};

export default socialApiService;
