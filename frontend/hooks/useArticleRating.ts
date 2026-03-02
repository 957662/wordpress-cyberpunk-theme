import { useState, useEffect, useCallback } from 'react';

export interface ArticleRating {
  articleId: string;
  userRating?: number; // 1-5 星级
  userLiked?: boolean; // 点赞
  userDisliked?: boolean; // 点踩
  timestamp: string;
}

export interface RatingStats {
  average: number;
  total: number;
  distribution: {
    1: number;
    2: number;
    3: number;
    4: number;
    5: number;
  };
  likes: number;
  dislikes: number;
}

interface UseArticleRatingOptions {
  /**
   * 是否启用 localStorage 持久化
   * @default true
   */
  enablePersistence?: boolean;
  /**
   * API 端点（如果需要同步到服务器）
   */
  apiEndpoint?: string;
}

/**
 * 文章评分 Hook
 *
 * 管理文章的评分、点赞、点踩功能
 *
 * @example
 * ```tsx
 * const {
 *   userRating,
 *   stats,
 *   rate,
 *   like,
 *   dislike,
 *   isRated,
 *   isLiked
 * } = useArticleRating('post-123');
 *
 * return (
 *   <div>
 *     <button onClick={() => like()}>👍 {stats.likes}</button>
 *     <button onClick={() => rate(5)}>⭐ {stats.average}</button>
 *   </div>
 * );
 * ```
 */
export function useArticleRating(
  articleId: string,
  options: UseArticleRatingOptions = {}
) {
  const { enablePersistence = true, apiEndpoint } = options;

  const [userRating, setUserRating] = useState<number>(0);
  const [userLiked, setUserLiked] = useState<boolean>(false);
  const [userDisliked, setUserDisliked] = useState<boolean>(false);
  const [stats, setStats] = useState<RatingStats>({
    average: 0,
    total: 0,
    distribution: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 },
    likes: 0,
    dislikes: 0,
  });
  const [isLoading, setIsLoading] = useState(false);

  // 加载用户评分数据
  useEffect(() => {
    if (!enablePersistence) return;

    try {
      const key = `article-rating-${articleId}`;
      const saved = localStorage.getItem(key);

      if (saved) {
        const rating: ArticleRating = JSON.parse(saved);
        setUserRating(rating.userRating || 0);
        setUserLiked(rating.userLiked || false);
        setUserDisliked(rating.userDisliked || false);
      }
    } catch (error) {
      console.error('Failed to load rating:', error);
    }
  }, [articleId, enablePersistence]);

  // 保存评分到 localStorage
  const saveRating = useCallback(
    (rating: Partial<ArticleRating>) => {
      if (!enablePersistence) return;

      try {
        const key = `article-rating-${articleId}`;
        const data: ArticleRating = {
          articleId,
          userRating,
          userLiked,
          userDisliked,
          timestamp: new Date().toISOString(),
          ...rating,
        };

        localStorage.setItem(key, JSON.stringify(data));
      } catch (error) {
        console.error('Failed to save rating:', error);
      }
    },
    [articleId, userRating, userLiked, userDisliked, enablePersistence]
  );

  // 同步到服务器（如果有 API 端点）
  const syncToServer = useCallback(
    async (action: string, value?: any) => {
      if (!apiEndpoint) return;

      try {
        setIsLoading(true);
        const response = await fetch(apiEndpoint, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ articleId, action, value }),
        });

        if (response.ok) {
          const data = await response.json();
          if (data.stats) {
            setStats(data.stats);
          }
        }
      } catch (error) {
        console.error('Failed to sync rating:', error);
      } finally {
        setIsLoading(false);
      }
    },
    [articleId, apiEndpoint]
  );

  /**
   * 评分（1-5星）
   */
  const rate = useCallback(
    async (rating: number) => {
      if (rating < 1 || rating > 5) return;

      // 切换评分：如果点击相同星级则取消评分
      const newRating = userRating === rating ? 0 : rating;
      setUserRating(newRating);
      saveRating({ userRating: newRating || undefined });

      // 更新本地统计
      if (userRating > 0) {
        setStats((prev) => ({
          ...prev,
          distribution: {
            ...prev.distribution,
            [userRating]: prev.distribution[userRating as 1 | 2 | 3 | 4 | 5] - 1,
          },
          total: prev.total - 1,
        }));
      }

      if (newRating > 0) {
        setStats((prev) => ({
          ...prev,
          distribution: {
            ...prev.distribution,
            [newRating]: prev.distribution[newRating as 1 | 2 | 3 | 4 | 5] + 1,
          },
          total: prev.total + 1,
          average: calculateAverage({
            ...prev.distribution,
            [newRating]: prev.distribution[newRating as 1 | 2 | 3 | 4 | 5] + 1,
          }),
        }));
      }

      await syncToServer('rate', newRating);
    },
    [userRating, saveRating, syncToServer]
  );

  /**
   * 点赞
   */
  const like = useCallback(async () => {
    if (userLiked) {
      // 取消点赞
      setUserLiked(false);
      saveRating({ userLiked: undefined });
      setStats((prev) => ({
        ...prev,
        likes: prev.likes - 1,
      }));
    } else {
      // 点赞
      setUserLiked(true);
      setUserDisliked(false); // 取消点踩
      saveRating({ userLiked: true, userDisliked: undefined });
      setStats((prev) => ({
        ...prev,
        likes: prev.likes + 1,
        dislikes: userDisliked ? prev.dislikes - 1 : prev.dislikes,
      }));
    }

    await syncToServer('like', !userLiked);
  }, [userLiked, userDisliked, saveRating, syncToServer]);

  /**
   * 点踩
   */
  const dislike = useCallback(async () => {
    if (userDisliked) {
      // 取消点踩
      setUserDisliked(false);
      saveRating({ userDisliked: undefined });
      setStats((prev) => ({
        ...prev,
        dislikes: prev.dislikes - 1,
      }));
    } else {
      // 点踩
      setUserDisliked(true);
      setUserLiked(false); // 取消点赞
      saveRating({ userDisliked: true, userLiked: undefined });
      setStats((prev) => ({
        ...prev,
        dislikes: prev.dislikes + 1,
        likes: userLiked ? prev.likes - 1 : prev.likes,
      }));
    }

    await syncToServer('dislike', !userDisliked);
  }, [userDisliked, userLiked, saveRating, syncToServer]);

  /**
   * 重置所有评分
   */
  const reset = useCallback(async () => {
    setUserRating(0);
    setUserLiked(false);
    setUserDisliked(false);
    saveRating({
      userRating: undefined,
      userLiked: undefined,
      userDisliked: undefined,
    });
    await syncToServer('reset');
  }, [saveRating, syncToServer]);

  /**
   * 检查是否已评分
   */
  const isRated = useCallback(() => {
    return userRating > 0;
  }, [userRating]);

  /**
   * 检查是否已点赞
   */
  const isLiked = useCallback(() => {
    return userLiked;
  }, [userLiked]);

  /**
   * 检查是否已点踩
   */
  const isDisliked = useCallback(() => {
    return userDisliked;
  }, [userDisliked]);

  return {
    // 状态
    userRating,
    userLiked,
    userDisliked,
    stats,
    isLoading,

    // 方法
    rate,
    like,
    dislike,
    reset,
    isRated,
    isLiked,
    isDisliked,
  };
}

/**
 * 计算平均分
 */
function calculateAverage(distribution: RatingStats['distribution']): number {
  let sum = 0;
  let count = 0;

  for (let i = 1; i <= 5; i++) {
    sum += i * distribution[i as 1 | 2 | 3 | 4 | 5];
    count += distribution[i as 1 | 2 | 3 | 4 | 5];
  }

  return count > 0 ? Math.round((sum / count) * 10) / 10 : 0;
}
