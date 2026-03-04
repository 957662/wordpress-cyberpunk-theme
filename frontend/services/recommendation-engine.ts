/**
 * AI 内容推荐引擎
 * 基于用户行为、内容相似度和协同过滤的智能推荐系统
 * CyberPress Platform
 */

import { apiClient } from './api-client';

export interface RecommendationContext {
  userId?: string;
  sessionId?: string;
  currentPostId?: string;
  userTags?: string[];
  userCategories?: string[];
  readingHistory?: string[];
  behaviorData?: BehaviorData;
}

export interface BehaviorData {
  views: { postId: string; duration: number; timestamp: number }[];
  likes: string[];
  shares: string[];
  comments: { postId: string; length: number; timestamp: number }[];
  bookmarks: string[];
}

export interface RecommendationItem {
  postId: string;
  title: string;
  excerpt: string;
  category: string;
  tags: string[];
  author: {
    id: string;
    name: string;
    avatar?: string;
  };
  thumbnail?: string;
  score: number;
  reason: string;
  type: 'similar' | 'trending' | 'personalized' | 'collaborative';
}

export interface RecommendationResponse {
  recommendations: RecommendationItem[];
  metadata: {
    algorithm: string;
    timestamp: number;
    confidence: number;
  };
}

class RecommendationEngine {
  private readonly baseUrl = '/api/recommendations';
  private behaviorCache: Map<string, BehaviorData> = new Map();
  private maxCacheSize = 100;

  /**
   * 获取推荐内容
   */
  async getRecommendations(
    context: RecommendationContext,
    limit: number = 10
  ): Promise<RecommendationResponse> {
    const response = await apiClient.post(this.baseUrl, {
      context,
      limit,
    });
    return response.data;
  }

  /**
   * 获取相似文章
   */
  async getSimilarPosts(
    postId: string,
    limit: number = 6
  ): Promise<RecommendationItem[]> {
    const response = await apiClient.get(
      `${this.baseUrl}/similar/${postId}`,
      { params: { limit } }
    );
    return response.data;
  }

  /**
   * 获取热门文章
   */
  async getTrendingPosts(
    timeRange: 'day' | 'week' | 'month' = 'week',
    limit: number = 10
  ): Promise<RecommendationItem[]> {
    const response = await apiClient.get(`${this.baseUrl}/trending`, {
      params: { timeRange, limit },
    });
    return response.data;
  }

  /**
   * 获取个性化推荐
   */
  async getPersonalizedRecommendations(
    userId: string,
    limit: number = 10
  ): Promise<RecommendationResponse> {
    const response = await apiClient.get(`${this.baseUrl}/personalized/${userId}`, {
      params: { limit },
    });
    return response.data;
  }

  /**
   * 获取基于协同过滤的推荐
   */
  async getCollaborativeRecommendations(
    userId: string,
    limit: number = 10
  ): Promise<RecommendationItem[]> {
    const response = await apiClient.get(
      `${this.baseUrl}/collaborative/${userId}`,
      { params: { limit } }
    );
    return response.data;
  }

  /**
   * 记录用户行为
   */
  async trackBehavior(
    userId: string,
    action: 'view' | 'like' | 'share' | 'comment' | 'bookmark',
    postId: string,
    metadata?: Record<string, any>
  ): Promise<void> {
    await apiClient.post(`${this.baseUrl}/track`, {
      userId,
      action,
      postId,
      metadata,
    });

    // 更新本地缓存
    this.updateBehaviorCache(userId, action, postId, metadata);
  }

  /**
   * 批量记录行为
   */
  async trackBehaviors(
    events: Array<{
      userId: string;
      action: string;
      postId: string;
      metadata?: Record<string, any>;
      timestamp: number;
    }>
  ): Promise<void> {
    await apiClient.post(`${this.baseUrl}/track/batch`, { events });
  }

  /**
   * 获取用户兴趣画像
   */
  async getUserProfile(userId: string): Promise<{
    interests: { tag: string; score: number }[];
    categories: { category: string; score: number }[];
    authors: { authorId: string; score: number }[];
    updatedAt: number;
  }> {
    const response = await apiClient.get(`${this.baseUrl}/profile/${userId}`);
    return response.data;
  }

  /**
   * 更新用户兴趣偏好
   */
  async updateUserPreferences(
    userId: string,
    preferences: {
      preferredTags?: string[];
      preferredCategories?: string[];
      blockedTags?: string[];
      blockedCategories?: string[];
    }
  ): Promise<void> {
    await apiClient.put(`${this.baseUrl}/profile/${userId}`, preferences);
  }

  /**
   * 获取推荐原因
   */
  async getRecommendationReason(
    userId: string,
    postId: string
  ): Promise<{
    reason: string;
    factors: Array<{ factor: string; impact: number }>;
    confidence: number;
  }> {
    const response = await apiClient.get(`${this.baseUrl}/reason/${userId}/${postId}`);
    return response.data;
  }

  /**
   * 反馈推荐质量
   */
  async feedback(
    userId: string,
    postId: string,
    feedback: 'helpful' | 'not_helpful' | 'irrelevant'
  ): Promise<void> {
    await apiClient.post(`${this.baseUrl}/feedback`, {
      userId,
      postId,
      feedback,
    });
  }

  /**
   * 获取推荐统计
   */
  async getStats(userId: string): Promise<{
    totalRecommendations: number;
    clickThroughRate: number;
    engagementRate: number;
    topCategories: string[];
    topTags: string[];
  }> {
    const response = await apiClient.get(`${this.baseUrl}/stats/${userId}`);
    return response.data;
  }

  /**
   * 更新本地行为缓存
   */
  private updateBehaviorCache(
    userId: string,
    action: string,
    postId: string,
    metadata?: Record<string, any>
  ): void {
    let behavior = this.behaviorCache.get(userId);

    if (!behavior) {
      behavior = {
        views: [],
        likes: [],
        shares: [],
        comments: [],
        bookmarks: [],
      };
    }

    const timestamp = Date.now();

    switch (action) {
      case 'view':
        behavior.views.push({
          postId,
          duration: metadata?.duration || 0,
          timestamp,
        });
        break;
      case 'like':
        if (!behavior.likes.includes(postId)) {
          behavior.likes.push(postId);
        }
        break;
      case 'share':
        if (!behavior.shares.includes(postId)) {
          behavior.shares.push(postId);
        }
        break;
      case 'comment':
        behavior.comments.push({
          postId,
          length: metadata?.length || 0,
          timestamp,
        });
        break;
      case 'bookmark':
        if (!behavior.bookmarks.includes(postId)) {
          behavior.bookmarks.push(postId);
        }
        break;
    }

    // 限制缓存大小
    if (this.behaviorCache.size >= this.maxCacheSize) {
      const firstKey = this.behaviorCache.keys().next().value;
      this.behaviorCache.delete(firstKey);
    }

    this.behaviorCache.set(userId, behavior);
  }

  /**
   * 获取缓存的行为数据
   */
  getCachedBehavior(userId: string): BehaviorData | undefined {
    return this.behaviorCache.get(userId);
  }

  /**
   * 同步缓存的行为到服务器
   */
  async syncBehavior(userId: string): Promise<void> {
    const behavior = this.behaviorCache.get(userId);
    if (!behavior) return;

    const events: Array<{
      userId: string;
      action: string;
      postId: string;
      metadata?: Record<string, any>;
      timestamp: number;
    }> = [];

    // 转换视图行为
    behavior.views.forEach((view) => {
      events.push({
        userId,
        action: 'view',
        postId: view.postId,
        metadata: { duration: view.duration },
        timestamp: view.timestamp,
      });
    });

    // 转换点赞行为
    behavior.likes.forEach((postId) => {
      events.push({
        userId,
        action: 'like',
        postId,
        timestamp: Date.now(),
      });
    });

    // 转换分享行为
    behavior.shares.forEach((postId) => {
      events.push({
        userId,
        action: 'share',
        postId,
        timestamp: Date.now(),
      });
    });

    // 转换评论行为
    behavior.comments.forEach((comment) => {
      events.push({
        userId,
        action: 'comment',
        postId: comment.postId,
        metadata: { length: comment.length },
        timestamp: comment.timestamp,
      });
    });

    // 转换收藏行为
    behavior.bookmarks.forEach((postId) => {
      events.push({
        userId,
        action: 'bookmark',
        postId,
        timestamp: Date.now(),
      });
    });

    if (events.length > 0) {
      await this.trackBehaviors(events);
      this.behaviorCache.delete(userId);
    }
  }

  /**
   * 清除行为缓存
   */
  clearBehaviorCache(userId?: string): void {
    if (userId) {
      this.behaviorCache.delete(userId);
    } else {
      this.behaviorCache.clear();
    }
  }
}

export const recommendationEngine = new RecommendationEngine();
