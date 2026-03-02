/**
 * 推荐服务
 * 提供个性化内容推荐功能
 */

import { blogService } from './blog.service';
import { cacheService } from './cache-service';

interface RecommendationConfig {
  maxResults: number;
  minSimilarity: number;
  excludeCurrent: boolean;
}

interface RecommendationScore {
  postId: string;
  score: number;
  reasons: string[];
}

interface RelatedPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  thumbnail?: string;
  category?: string;
  tags?: string[];
  publishedAt: string;
  similarityScore: number;
}

/**
 * 推荐服务类
 */
class RecommendationService {
  private readonly CACHE_PREFIX = 'recommendation_';
  private readonly CACHE_TTL = 30 * 60 * 1000; // 30分钟

  /**
   * 基于标签的推荐
   */
  async getByTags(
    postId: string,
    tags: string[],
    config: Partial<RecommendationConfig> = {}
  ): Promise<RelatedPost[]> {
    const finalConfig: RecommendationConfig = {
      maxResults: 6,
      minSimilarity: 0.2,
      excludeCurrent: true,
      ...config,
    };

    // 检查缓存
    const cacheKey = `${this.CACHE_PREFIX}tags_${postId}_${JSON.stringify(tags)}`;
    const cached = await cacheService.get<RelatedPost[]>(cacheKey);
    if (cached) return cached;

    try {
      // 获取所有带有这些标签的文章
      const allPosts = await blogService.getPosts({
        perPage: 100,
        tags: tags.join(','),
      });

      // 计算相似度并排序
      const scored = allPosts
        .filter((post) => post.id !== postId || !finalConfig.excludeCurrent)
        .map((post) => {
          const postTags = post.tags || [];
          const commonTags = tags.filter((tag) => postTags.includes(tag));
          const similarityScore = commonTags.length / Math.max(tags.length, 1);

          return {
            id: post.id,
            title: post.title.rendered,
            slug: post.slug,
            excerpt: post.excerpt?.rendered || '',
            thumbnail: post.featured_media,
            category: post.categories?.[0]?.name,
            tags: postTags,
            publishedAt: post.date,
            similarityScore,
          };
        })
        .filter((item) => item.similarityScore >= finalConfig.minSimilarity)
        .sort((a, b) => b.similarityScore - a.similarityScore)
        .slice(0, finalConfig.maxResults);

      // 缓存结果
      await cacheService.set(cacheKey, scored, this.CACHE_TTL);

      return scored;
    } catch (error) {
      console.error('Failed to get recommendations by tags:', error);
      return [];
    }
  }

  /**
   * 基于分类的推荐
   */
  async getByCategory(
    postId: string,
    categoryIds: number[],
    config: Partial<RecommendationConfig> = {}
  ): Promise<RelatedPost[]> {
    const finalConfig: RecommendationConfig = {
      maxResults: 6,
      minSimilarity: 0,
      excludeCurrent: true,
      ...config,
    };

    const cacheKey = `${this.CACHE_PREFIX}category_${postId}_${categoryIds.join('_')}`;
    const cached = await cacheService.get<RelatedPost[]>(cacheKey);
    if (cached) return cached;

    try {
      // 获取同分类的文章
      const allPosts = await blogService.getPosts({
        perPage: 100,
        categories: categoryIds.join(','),
      });

      const scored = allPosts
        .filter((post) => post.id !== postId || !finalConfig.excludeCurrent)
        .map((post) => {
          const postCategories = post.categories?.map((c) => c.id) || [];
          const commonCategories = categoryIds.filter((id) =>
            postCategories.includes(id)
          );
          const similarityScore = commonCategories.length / Math.max(categoryIds.length, 1);

          return {
            id: post.id,
            title: post.title.rendered,
            slug: post.slug,
            excerpt: post.excerpt?.rendered || '',
            thumbnail: post.featured_media,
            category: post.categories?.[0]?.name,
            tags: post.tags?.map((t) => t.name),
            publishedAt: post.date,
            similarityScore,
          };
        })
        .sort((a, b) => b.similarityScore - a.similarityScore)
        .slice(0, finalConfig.maxResults);

      await cacheService.set(cacheKey, scored, this.CACHE_TTL);

      return scored;
    } catch (error) {
      console.error('Failed to get recommendations by category:', error);
      return [];
    }
  }

  /**
   * 综合推荐（标签 + 分类 + 随机）
   */
  async getRecommendations(
    postId: string,
    options: {
      tags?: string[];
      categoryIds?: number[];
      authorId?: number;
      includeRandom?: boolean;
    } = {},
    config: Partial<RecommendationConfig> = {}
  ): Promise<RelatedPost[]> {
    const finalConfig: RecommendationConfig = {
      maxResults: 6,
      minSimilarity: 0.1,
      excludeCurrent: true,
      ...config,
    };

    const cacheKey = `${this.CACHE_PREFIX}mixed_${postId}`;
    const cached = await cacheService.get<RelatedPost[]>(cacheKey);
    if (cached) return cached;

    try {
      const recommendations: Map<string, RelatedPost> = new Map();

      // 1. 基于标签的推荐（权重：0.5）
      if (options.tags && options.tags.length > 0) {
        const tagRecs = await this.getByTags(postId, options.tags, {
          maxResults: finalConfig.maxResults * 2,
          ...config,
        });

        tagRecs.forEach((rec) => {
          const key = rec.id;
          const existing = recommendations.get(key);
          const score = rec.similarityScore * 0.5;

          if (!existing || existing.similarityScore < score) {
            recommendations.set(key, {
              ...rec,
              similarityScore: score,
            });
          }
        });
      }

      // 2. 基于分类的推荐（权重：0.3）
      if (options.categoryIds && options.categoryIds.length > 0) {
        const catRecs = await this.getByCategory(postId, options.categoryIds, {
          maxResults: finalConfig.maxResults * 2,
          ...config,
        });

        catRecs.forEach((rec) => {
          const key = rec.id;
          const existing = recommendations.get(key);
          const score = rec.similarityScore * 0.3;

          if (!existing) {
            recommendations.set(key, {
              ...rec,
              similarityScore: score,
            });
          }
        });
      }

      // 3. 基于作者的推荐（权重：0.2）
      if (options.authorId) {
        try {
          const authorPosts = await blogService.getPosts({
            perPage: finalConfig.maxResults,
            author: options.authorId,
          });

          authorPosts
            .filter((post) => post.id !== postId || !finalConfig.excludeCurrent)
            .forEach((post) => {
              const key = post.id;
              if (!recommendations.has(key)) {
                recommendations.set(key, {
                  id: post.id,
                  title: post.title.rendered,
                  slug: post.slug,
                  excerpt: post.excerpt?.rendered || '',
                  thumbnail: post.featured_media,
                  category: post.categories?.[0]?.name,
                  tags: post.tags?.map((t) => t.name),
                  publishedAt: post.date,
                  similarityScore: 0.2,
                });
              }
            });
        } catch (error) {
          console.error('Failed to get author posts:', error);
        }
      }

      // 4. 添加随机推荐（如果需要）
      if (options.includeRandom && recommendations.size < finalConfig.maxResults) {
        try {
          const randomPosts = await blogService.getPosts({
            perPage: finalConfig.maxResults,
            orderBy: 'random',
          });

          randomPosts
            .filter((post) => post.id !== postId || !finalConfig.excludeCurrent)
            .slice(0, finalConfig.maxResults - recommendations.size)
            .forEach((post) => {
              const key = post.id;
              if (!recommendations.has(key)) {
                recommendations.set(key, {
                  id: post.id,
                  title: post.title.rendered,
                  slug: post.slug,
                  excerpt: post.excerpt?.rendered || '',
                  thumbnail: post.featured_media,
                  category: post.categories?.[0]?.name,
                  tags: post.tags?.map((t) => t.name),
                  publishedAt: post.date,
                  similarityScore: 0.1,
                });
              }
            });
        } catch (error) {
          console.error('Failed to get random posts:', error);
        }
      }

      // 排序并限制数量
      const sorted = Array.from(recommendations.values())
        .sort((a, b) => b.similarityScore - a.similarityScore)
        .slice(0, finalConfig.maxResults);

      await cacheService.set(cacheKey, sorted, this.CACHE_TTL);

      return sorted;
    } catch (error) {
      console.error('Failed to get recommendations:', error);
      return [];
    }
  }

  /**
   * 获取热门文章（基于浏览量或点赞数）
   */
  async getTrendingPosts(
    days = 7,
    limit = 6
  ): Promise<RelatedPost[]> {
    const cacheKey = `${this.CACHE_PREFIX}trending_${days}_${limit}`;
    const cached = await cacheService.get<RelatedPost[]>(cacheKey);
    if (cached) return cached;

    try {
      // 这里应该调用实际的热门文章 API
      // 暂时使用最新文章代替
      const posts = await blogService.getPosts({
        perPage: limit,
        orderBy: 'date',
        order: 'desc',
      });

      const trending = posts.map((post) => ({
        id: post.id,
        title: post.title.rendered,
        slug: post.slug,
        excerpt: post.excerpt?.rendered || '',
        thumbnail: post.featured_media,
        category: post.categories?.[0]?.name,
        tags: post.tags?.map((t) => t.name),
        publishedAt: post.date,
        similarityScore: 1, // 热门文章默认相似度为 1
      }));

      await cacheService.set(cacheKey, trending, this.CACHE_TTL);

      return trending;
    } catch (error) {
      console.error('Failed to get trending posts:', error);
      return [];
    }
  }

  /**
   * 清除推荐缓存
   */
  async clearCache(postId?: string): Promise<void> {
    if (postId) {
      await cacheService.remove(`${this.CACHE_PREFIX}tags_${postId}_`);
      await cacheService.remove(`${this.CACHE_PREFIX}category_${postId}_`);
      await cacheService.remove(`${this.CACHE_PREFIX}mixed_${postId}`);
    } else {
      // 清除所有推荐缓存
      await cacheService.clearByPrefix(this.CACHE_PREFIX);
    }
  }
}

// 导出单例实例
export const recommendationService = new RecommendationService();
