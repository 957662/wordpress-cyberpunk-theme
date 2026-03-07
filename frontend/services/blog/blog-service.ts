/**
 * Blog Service Layer
 * 博客服务层 - 统一的博客数据访问接口
 */

import type {
  BlogPost,
  BlogCategory,
  BlogTag,
  BlogComment,
} from '@/types/models/blog';
import { wordpressService } from '../wordpress-service';
import { MemoryCache } from '@/lib/utils/optimization';

// 创建缓存实例
const cache = new MemoryCache(5 * 60 * 1000); // 5 分钟缓存

export interface GetPostsParams {
  page?: number;
  perPage?: number;
  category?: number;
  tag?: number;
  search?: string;
  orderBy?: 'date' | 'title' | 'modified';
  order?: 'asc' | 'desc';
  exclude?: number[];
}

export interface GetPostsResult {
  posts: BlogPost[];
  total: number;
  totalPages: number;
}

/**
 * BlogService - 博客服务类
 */
export class BlogService {
  /**
   * 获取文章列表
   */
  static async getPosts(
    params: GetPostsParams = {}
  ): Promise<GetPostsResult> {
    const cacheKey = `posts-${JSON.stringify(params)}`;

    // 检查缓存
    const cached = cache.get(cacheKey);
    if (cached) {
      return cached as GetPostsResult;
    }

    try {
      const result = await wordpressService.getPosts(params);

      // 缓存结果
      cache.set(cacheKey, result);

      return result;
    } catch (error) {
      console.error('Failed to get posts:', error);
      throw new Error('获取文章列表失败');
    }
  }

  /**
   * 获取单篇文章
   */
  static async getPost(id: number): Promise<BlogPost> {
    const cacheKey = `post-${id}`;

    // 检查缓存
    const cached = cache.get(cacheKey);
    if (cached) {
      return cached as BlogPost;
    }

    try {
      const post = await wordpressService.getPost(id);

      // 缓存结果
      cache.set(cacheKey, post);

      return post;
    } catch (error) {
      console.error('Failed to get post:', error);
      throw new Error('获取文章失败');
    }
  }

  /**
   * 根据 slug 获取文章
   */
  static async getPostBySlug(slug: string): Promise<BlogPost | null> {
    const cacheKey = `post-slug-${slug}`;

    // 检查缓存
    const cached = cache.get(cacheKey);
    if (cached) {
      return cached as BlogPost;
    }

    try {
      const post = await wordpressService.getPostBySlug(slug);

      if (post) {
        // 缓存结果
        cache.set(cacheKey, post);
      }

      return post;
    } catch (error) {
      console.error('Failed to get post by slug:', error);
      throw new Error('获取文章失败');
    }
  }

  /**
   * 获取分类列表
   */
  static async getCategories(): Promise<BlogCategory[]> {
    const cacheKey = 'categories';

    // 检查缓存
    const cached = cache.get(cacheKey);
    if (cached) {
      return cached as BlogCategory[];
    }

    try {
      const categories = await wordpressService.getCategories();

      // 缓存结果
      cache.set(cacheKey, categories);

      return categories;
    } catch (error) {
      console.error('Failed to get categories:', error);
      throw new Error('获取分类失败');
    }
  }

  /**
   * 获取单个分类
   */
  static async getCategory(id: number): Promise<BlogCategory | null> {
    const cacheKey = `category-${id}`;

    // 检查缓存
    const cached = cache.get(cacheKey);
    if (cached) {
      return cached as BlogCategory;
    }

    try {
      const category = await wordpressService.getCategory(id);

      if (category) {
        // 缓存结果
        cache.set(cacheKey, category);
      }

      return category;
    } catch (error) {
      console.error('Failed to get category:', error);
      throw new Error('获取分类失败');
    }
  }

  /**
   * 获取标签列表
   */
  static async getTags(): Promise<BlogTag[]> {
    const cacheKey = 'tags';

    // 检查缓存
    const cached = cache.get(cacheKey);
    if (cached) {
      return cached as BlogTag[];
    }

    try {
      const tags = await wordpressService.getTags();

      // 缓存结果
      cache.set(cacheKey, tags);

      return tags;
    } catch (error) {
      console.error('Failed to get tags:', error);
      throw new Error('获取标签失败');
    }
  }

  /**
   * 获取单个标签
   */
  static async getTag(id: number): Promise<BlogTag | null> {
    const cacheKey = `tag-${id}`;

    // 检查缓存
    const cached = cache.get(cacheKey);
    if (cached) {
      return cached as BlogTag;
    }

    try {
      const tag = await wordpressService.getTag(id);

      if (tag) {
        // 缓存结果
        cache.set(cacheKey, tag);
      }

      return tag;
    } catch (error) {
      console.error('Failed to get tag:', error);
      throw new Error('获取标签失败');
    }
  }

  /**
   * 获取文章评论
   */
  static async getComments(postId: number): Promise<BlogComment[]> {
    const cacheKey = `comments-${postId}`;

    // 检查缓存
    const cached = cache.get(cacheKey);
    if (cached) {
      return cached as BlogComment[];
    }

    try {
      const comments = await wordpressService.getComments(postId);

      // 缓存结果
      cache.set(cacheKey, comments);

      return comments;
    } catch (error) {
      console.error('Failed to get comments:', error);
      throw new Error('获取评论失败');
    }
  }

  /**
   * 提交评论
   */
  static async createComment(
    postId: number,
    content: string,
    author: {
      name: string;
      email: string;
      url?: string;
    }
  ): Promise<BlogComment> {
    try {
      const comment = await wordpressService.createComment({
        post: postId,
        content,
        author_name: author.name,
        author_email: author.email,
        author_url: author.url,
      });

      // 清除该文章的评论缓存
      cache.delete(`comments-${postId}`);

      return comment;
    } catch (error) {
      console.error('Failed to create comment:', error);
      throw new Error('提交评论失败');
    }
  }

  /**
   * 搜索文章
   */
  static async searchPosts(query: string): Promise<BlogPost[]> {
    const cacheKey = `search-${query}`;

    // 检查缓存
    const cached = cache.get(cacheKey);
    if (cached) {
      return cached as BlogPost[];
    }

    try {
      const results = await wordpressService.searchPosts(query);

      // 缓存结果（较短时间）
      cache.set(cacheKey, results, 2 * 60 * 1000);

      return results;
    } catch (error) {
      console.error('Failed to search posts:', error);
      throw new Error('搜索失败');
    }
  }

  /**
   * 获取热门文章
   */
  static async getPopularPosts(limit: number = 5): Promise<BlogPost[]> {
    const cacheKey = `popular-${limit}`;

    // 检查缓存
    const cached = cache.get(cacheKey);
    if (cached) {
      return cached as BlogPost[];
    }

    try {
      // 这里可以根据实际的热门算法实现
      // 目前使用最新文章代替
      const result = await wordpressService.getPosts({
        per_page: limit,
        orderby: 'date',
        order: 'desc',
      });

      cache.set(cacheKey, result.posts);

      return result.posts;
    } catch (error) {
      console.error('Failed to get popular posts:', error);
      throw new Error('获取热门文章失败');
    }
  }

  /**
   * 获取相关文章
   */
  static async getRelatedPosts(
    postId: number,
    limit: number = 3
  ): Promise<BlogPost[]> {
    const cacheKey = `related-${postId}-${limit}`;

    // 检查缓存
    const cached = cache.get(cacheKey);
    if (cached) {
      return cached as BlogPost[];
    }

    try {
      // 获取当前文章
      const post = await this.getPost(postId);

      // 根据分类和标签获取相关文章
      const params: GetPostsParams = {
        per_page: limit + 1, // +1 因为可能包含当前文章
        exclude: [postId],
      };

      if (post.categories && post.categories.length > 0) {
        params.category = post.categories[0].id;
      }

      const result = await wordpressService.getPosts(params);
      const relatedPosts = result.posts.slice(0, limit);

      cache.set(cacheKey, relatedPosts);

      return relatedPosts;
    } catch (error) {
      console.error('Failed to get related posts:', error);
      return [];
    }
  }

  /**
   * 清除所有缓存
   */
  static clearCache(): void {
    cache.clear();
  }

  /**
   * 清除特定缓存
   */
  static clearCachePattern(pattern: string): void {
    // 这里可以实现模式匹配清除
    // 简化版：清除所有缓存
    cache.clear();
  }
}

export default BlogService;
