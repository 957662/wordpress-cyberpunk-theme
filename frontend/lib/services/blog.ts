/**
 * CyberPress Platform - 统一博客服务层
 * 提供博客相关的所有 API 调用
 */

import type {
  Post,
  Comment,
  Category,
  Tag,
  Author,
  SearchResultItem,
  APIResponse,
  PostFilters,
  PaginationMeta,
  CommentFormData,
} from '@/types/blog';
import { wordpressService } from './wordpress-service';
import { cache } from '../cache';

/**
 * 博客服务类
 */
class BlogService {
  private cacheEnabled = true;
  private cacheTimeout = 5 * 60 * 1000; // 5 minutes

  /**
   * 获取文章列表
   */
  async getPosts(filters?: PostFilters): Promise<APIResponse<Post[]>> {
    const cacheKey = `posts-${JSON.stringify(filters)}`;

    if (this.cacheEnabled) {
      const cached = cache.get(cacheKey);
      if (cached) return cached;
    }

    try {
      const response = await wordpressService.getPosts(filters);
      const result: APIResponse<Post[]> = {
        data: response.data,
        meta: response.meta,
      };

      if (this.cacheEnabled) {
        cache.set(cacheKey, result, this.cacheTimeout);
      }

      return result;
    } catch (error) {
      console.error('获取文章列表失败:', error);
      throw error;
    }
  }

  /**
   * 获取单篇文章
   */
  async getPost(slug: string): Promise<Post> {
    const cacheKey = `post-${slug}`;

    if (this.cacheEnabled) {
      const cached = cache.get(cacheKey);
      if (cached) return cached;
    }

    try {
      const post = await wordpressService.getPost(slug);

      if (this.cacheEnabled) {
        cache.set(cacheKey, post, this.cacheTimeout);
      }

      return post;
    } catch (error) {
      console.error('获取文章失败:', error);
      throw error;
    }
  }

  /**
   * 获取文章 by ID
   */
  async getPostById(id: string): Promise<Post> {
    const cacheKey = `post-id-${id}`;

    if (this.cacheEnabled) {
      const cached = cache.get(cacheKey);
      if (cached) return cached;
    }

    try {
      const post = await wordpressService.getPostById(id);

      if (this.cacheEnabled) {
        cache.set(cacheKey, post, this.cacheTimeout);
      }

      return post;
    } catch (error) {
      console.error('获取文章失败:', error);
      throw error;
    }
  }

  /**
   * 获取特色文章
   */
  async getFeaturedPosts(limit: number = 5): Promise<Post[]> {
    const cacheKey = `featured-posts-${limit}`;

    if (this.cacheEnabled) {
      const cached = cache.get(cacheKey);
      if (cached) return cached;
    }

    try {
      const posts = await wordpressService.getFeaturedPosts(limit);

      if (this.cacheEnabled) {
        cache.set(cacheKey, posts, this.cacheTimeout);
      }

      return posts;
    } catch (error) {
      console.error('获取特色文章失败:', error);
      throw error;
    }
  }

  /**
   * 获取置顶文章
   */
  async getStickyPosts(limit: number = 5): Promise<Post[]> {
    const cacheKey = `sticky-posts-${limit}`;

    if (this.cacheEnabled) {
      const cached = cache.get(cacheKey);
      if (cached) return cached;
    }

    try {
      const posts = await wordpressService.getStickyPosts(limit);

      if (this.cacheEnabled) {
        cache.set(cacheKey, posts, this.cacheTimeout);
      }

      return posts;
    } catch (error) {
      console.error('获取置顶文章失败:', error);
      throw error;
    }
  }

  /**
   * 获取相关文章
   */
  async getRelatedPosts(postId: string, limit: number = 4): Promise<Post[]> {
    const cacheKey = `related-posts-${postId}-${limit}`;

    if (this.cacheEnabled) {
      const cached = cache.get(cacheKey);
      if (cached) return cached;
    }

    try {
      const posts = await wordpressService.getRelatedPosts(postId, limit);

      if (this.cacheEnabled) {
        cache.set(cacheKey, posts, this.cacheTimeout);
      }

      return posts;
    } catch (error) {
      console.error('获取相关文章失败:', error);
      throw error;
    }
  }

  /**
   * 获取热门文章
   */
  async getTrendingPosts(limit: number = 5): Promise<Post[]> {
    const cacheKey = `trending-posts-${limit}`;

    if (this.cacheEnabled) {
      const cached = cache.get(cacheKey);
      if (cached) return cached;
    }

    try {
      const posts = await wordpressService.getTrendingPosts(limit);

      if (this.cacheEnabled) {
        cache.set(cacheKey, posts, this.cacheTimeout);
      }

      return posts;
    } catch (error) {
      console.error('获取热门文章失败:', error);
      throw error;
    }
  }

  /**
   * 获取最新文章
   */
  async getLatestPosts(limit: number = 10): Promise<Post[]> {
    const cacheKey = `latest-posts-${limit}`;

    if (this.cacheEnabled) {
      const cached = cache.get(cacheKey);
      if (cached) return cached;
    }

    try {
      const posts = await wordpressService.getLatestPosts(limit);

      if (this.cacheEnabled) {
        cache.set(cacheKey, posts, this.cacheTimeout);
      }

      return posts;
    } catch (error) {
      console.error('获取最新文章失败:', error);
      throw error;
    }
  }

  /**
   * 搜索文章
   */
  async searchPosts(
    query: string,
    filters?: Omit<PostFilters, 'search'>
  ): Promise<APIResponse<SearchResultItem[]>> {
    try {
      const response = await wordpressService.searchPosts(query, filters);
      return {
        data: response.data,
        meta: response.meta,
      };
    } catch (error) {
      console.error('搜索文章失败:', error);
      throw error;
    }
  }

  /**
   * 获取分类列表
   */
  async getCategories(): Promise<Category[]> {
    const cacheKey = 'categories';

    if (this.cacheEnabled) {
      const cached = cache.get(cacheKey);
      if (cached) return cached;
    }

    try {
      const categories = await wordpressService.getCategories();

      if (this.cacheEnabled) {
        cache.set(cacheKey, categories, this.cacheTimeout * 2); // Cache longer
      }

      return categories;
    } catch (error) {
      console.error('获取分类列表失败:', error);
      throw error;
    }
  }

  /**
   * 获取单个分类
   */
  async getCategory(slug: string): Promise<Category> {
    const cacheKey = `category-${slug}`;

    if (this.cacheEnabled) {
      const cached = cache.get(cacheKey);
      if (cached) return cached;
    }

    try {
      const category = await wordpressService.getCategory(slug);

      if (this.cacheEnabled) {
        cache.set(cacheKey, category, this.cacheTimeout * 2);
      }

      return category;
    } catch (error) {
      console.error('获取分类失败:', error);
      throw error;
    }
  }

  /**
   * 获取标签列表
   */
  async getTags(): Promise<Tag[]> {
    const cacheKey = 'tags';

    if (this.cacheEnabled) {
      const cached = cache.get(cacheKey);
      if (cached) return cached;
    }

    try {
      const tags = await wordpressService.getTags();

      if (this.cacheEnabled) {
        cache.set(cacheKey, tags, this.cacheTimeout * 2);
      }

      return tags;
    } catch (error) {
      console.error('获取标签列表失败:', error);
      throw error;
    }
  }

  /**
   * 获取单个标签
   */
  async getTag(slug: string): Promise<Tag> {
    const cacheKey = `tag-${slug}`;

    if (this.cacheEnabled) {
      const cached = cache.get(cacheKey);
      if (cached) return cached;
    }

    try {
      const tag = await wordpressService.getTag(slug);

      if (this.cacheEnabled) {
        cache.set(cacheKey, tag, this.cacheTimeout * 2);
      }

      return tag;
    } catch (error) {
      console.error('获取标签失败:', error);
      throw error;
    }
  }

  /**
   * 获取作者列表
   */
  async getAuthors(): Promise<Author[]> {
    const cacheKey = 'authors';

    if (this.cacheEnabled) {
      const cached = cache.get(cacheKey);
      if (cached) return cached;
    }

    try {
      const authors = await wordpressService.getAuthors();

      if (this.cacheEnabled) {
        cache.set(cacheKey, authors, this.cacheTimeout * 2);
      }

      return authors;
    } catch (error) {
      console.error('获取作者列表失败:', error);
      throw error;
    }
  }

  /**
   * 获取单个作者
   */
  async getAuthor(slug: string): Promise<Author> {
    const cacheKey = `author-${slug}`;

    if (this.cacheEnabled) {
      const cached = cache.get(cacheKey);
      if (cached) return cached;
    }

    try {
      const author = await wordpressService.getAuthor(slug);

      if (this.cacheEnabled) {
        cache.set(cacheKey, author, this.cacheTimeout * 2);
      }

      return author;
    } catch (error) {
      console.error('获取作者失败:', error);
      throw error;
    }
  }

  /**
   * 获取文章评论
   */
  async getComments(postId: string): Promise<Comment[]> {
    const cacheKey = `comments-${postId}`;

    if (this.cacheEnabled) {
      const cached = cache.get(cacheKey);
      if (cached) return cached;
    }

    try {
      const comments = await wordpressService.getComments(postId);

      if (this.cacheEnabled) {
        cache.set(cacheKey, comments, this.cacheTimeout / 2); // Cache shorter
      }

      return comments;
    } catch (error) {
      console.error('获取评论失败:', error);
      throw error;
    }
  }

  /**
   * 提交评论
   */
  async submitComment(postId: string, data: CommentFormData): Promise<Comment> {
    try {
      const comment = await wordpressService.submitComment(postId, data);

      // Clear cache for this post's comments
      cache.delete(`comments-${postId}`);

      return comment;
    } catch (error) {
      console.error('提交评论失败:', error);
      throw error;
    }
  }

  /**
   * 点赞文章
   */
  async likePost(postId: string): Promise<void> {
    try {
      await wordpressService.likePost(postId);

      // Clear relevant caches
      cache.delete(`post-${postId}`);
      cache.delete(`post-id-${postId}`);
    } catch (error) {
      console.error('点赞文章失败:', error);
      throw error;
    }
  }

  /**
   * 收藏文章
   */
  async bookmarkPost(postId: string, folderId?: string): Promise<void> {
    try {
      await wordpressService.bookmarkPost(postId, folderId);
    } catch (error) {
      console.error('收藏文章失败:', error);
      throw error;
    }
  }

  /**
   * 取消收藏
   */
  async unbookmarkPost(postId: string): Promise<void> {
    try {
      await wordpressService.unbookmarkPost(postId);
    } catch (error) {
      console.error('取消收藏失败:', error);
      throw error;
    }
  }

  /**
   * 关注作者
   */
  async followAuthor(authorId: string): Promise<void> {
    try {
      await wordpressService.followAuthor(authorId);

      // Clear author cache
      cache.delete(`author-${authorId}`);
    } catch (error) {
      console.error('关注作者失败:', error);
      throw error;
    }
  }

  /**
   * 取消关注作者
   */
  async unfollowAuthor(authorId: string): Promise<void> {
    try {
      await wordpressService.unfollowAuthor(authorId);

      // Clear author cache
      cache.delete(`author-${authorId}`);
    } catch (error) {
      console.error('取消关注失败:', error);
      throw error;
    }
  }

  /**
   * 记录文章浏览
   */
  async recordView(postId: string): Promise<void> {
    try {
      await wordpressService.recordView(postId);
    } catch (error) {
      console.error('记录浏览失败:', error);
      // Don't throw error for view tracking
    }
  }

  /**
   * 获取阅读历史
   */
  async getReadingHistory(limit: number = 10): Promise<Post[]> {
    try {
      return await wordpressService.getReadingHistory(limit);
    } catch (error) {
      console.error('获取阅读历史失败:', error);
      throw error;
    }
  }

  /**
   * 更新阅读进度
   */
  async updateReadingProgress(postId: string, progress: number): Promise<void> {
    try {
      await wordpressService.updateReadingProgress(postId, progress);
    } catch (error) {
      console.error('更新阅读进度失败:', error);
      throw error;
    }
  }

  /**
   * 清除缓存
   */
  clearCache(pattern?: string): void {
    if (pattern) {
      cache.clearByPattern(pattern);
    } else {
      cache.clear();
    }
  }

  /**
   * 启用/禁用缓存
   */
  setCacheEnabled(enabled: boolean): void {
    this.cacheEnabled = enabled;
  }

  /**
   * 设置缓存超时时间
   */
  setCacheTimeout(timeout: number): void {
    this.cacheTimeout = timeout;
  }
}

// 创建单例实例
export const blogService = new BlogService();

// 导出类型
export type { BlogService };
