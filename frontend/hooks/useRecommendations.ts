/**
 * 推荐系统 Hook
 * CyberPress Platform
 */

import { useState, useEffect, useCallback } from 'react';
import { recommendationEngine, RecommendationItem, RecommendationContext } from '@/services/recommendation-engine';

export interface UseRecommendationsOptions {
  userId?: string;
  currentPostId?: string;
  limit?: number;
  enabled?: boolean;
  refreshOnMount?: boolean;
  trackBehavior?: boolean;
}

export function useRecommendations(options: UseRecommendationsOptions = {}) {
  const {
    userId,
    currentPostId,
    limit = 10,
    enabled = true,
    refreshOnMount = true,
    trackBehavior = true,
  } = options;

  const [recommendations, setRecommendations] = useState<RecommendationItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  // 获取推荐
  const fetchRecommendations = useCallback(async () => {
    if (!enabled) return;

    try {
      setLoading(true);
      setError(null);

      const context: RecommendationContext = {
        userId,
        currentPostId,
      };

      const response = await recommendationEngine.getRecommendations(context, limit);
      setRecommendations(response.recommendations);
    } catch (err) {
      setError(err as Error);
      console.error('获取推荐失败:', err);
    } finally {
      setLoading(false);
    }
  }, [enabled, userId, currentPostId, limit]);

  // 获取相似文章
  const fetchSimilarPosts = useCallback(
    async (postId: string, count: number = 6) => {
      try {
        setLoading(true);
        setError(null);

        const similarPosts = await recommendationEngine.getSimilarPosts(postId, count);
        setRecommendations(similarPosts);
        return similarPosts;
      } catch (err) {
        setError(err as Error);
        console.error('获取相似文章失败:', err);
        return [];
      } finally {
        setLoading(false);
      }
    },
    []
  );

  // 获取热门文章
  const fetchTrendingPosts = useCallback(
    async (timeRange: 'day' | 'week' | 'month' = 'week', count: number = 10) => {
      try {
        setLoading(true);
        setError(null);

        const trendingPosts = await recommendationEngine.getTrendingPosts(timeRange, count);
        setRecommendations(trendingPosts);
        return trendingPosts;
      } catch (err) {
        setError(err as Error);
        console.error('获取热门文章失败:', err);
        return [];
      } finally {
        setLoading(false);
      }
    },
    []
  );

  // 获取个性化推荐
  const fetchPersonalizedRecommendations = useCallback(
    async (uid: string, count: number = 10) => {
      try {
        setLoading(true);
        setError(null);

        const response = await recommendationEngine.getPersonalizedRecommendations(uid, count);
        setRecommendations(response.recommendations);
        return response.recommendations;
      } catch (err) {
        setError(err as Error);
        console.error('获取个性化推荐失败:', err);
        return [];
      } finally {
        setLoading(false);
      }
    },
    []
  );

  // 记录用户行为
  const trackBehavior = useCallback(
    async (
      action: 'view' | 'like' | 'share' | 'comment' | 'bookmark',
      postId: string,
      metadata?: Record<string, any>
    ) => {
      if (!trackBehavior || !userId) return;

      try {
        await recommendationEngine.trackBehavior(userId, action, postId, metadata);
      } catch (err) {
        console.error('记录行为失败:', err);
      }
    },
    [userId, trackBehavior]
  );

  // 反馈推荐质量
  const feedback = useCallback(
    async (postId: string, feedbackType: 'helpful' | 'not_helpful' | 'irrelevant') => {
      if (!userId) return;

      try {
        await recommendationEngine.feedback(userId, postId, feedbackType);
      } catch (err) {
        console.error('反馈失败:', err);
      }
    },
    [userId]
  );

  // 获取用户兴趣画像
  const getUserProfile = useCallback(async (uid: string) => {
    try {
      return await recommendationEngine.getUserProfile(uid);
    } catch (err) {
      console.error('获取用户画像失败:', err);
      return null;
    }
  }, []);

  // 更新用户偏好
  const updateUserPreferences = useCallback(
    async (uid: string, preferences: {
      preferredTags?: string[];
      preferredCategories?: string[];
      blockedTags?: string[];
      blockedCategories?: string[];
    }) => {
      try {
        await recommendationEngine.updateUserPreferences(uid, preferences);
      } catch (err) {
        console.error('更新用户偏好失败:', err);
      }
    },
    []
  );

  // 初始化
  useEffect(() => {
    if (refreshOnMount && enabled) {
      fetchRecommendations();
    }
  }, [refreshOnMount, enabled, fetchRecommendations]);

  return {
    recommendations,
    loading,
    error,
    fetchRecommendations,
    fetchSimilarPosts,
    fetchTrendingPosts,
    fetchPersonalizedRecommendations,
    trackBehavior,
    feedback,
    getUserProfile,
    updateUserPreferences,
  };
}

export default useRecommendations;
