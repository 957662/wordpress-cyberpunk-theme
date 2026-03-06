/**
 * Blog Integration Service
 * 统一的博客服务集成层
 * 整合 API 调用、数据转换和缓存
 */

import { blogService } from './blog.service';
import { wpPostToBlogCardData, postToBlogCardData, type BlogCardData, type BlogFilters } from '@/types/blog';
import type { PaginatedResponse } from '@/lib/api/client';

class BlogIntegrationService {
  private cache: Map<string, { data: any; timestamp: number }> = new Map();
  private readonly CACHE_TTL = 5 * 60 * 1000; // 5 minutes

  /**
   * 获取博客列表（统一接口）
   */
  async getBlogPosts(filters?: BlogFilters): Promise<{
    posts: BlogCardData[];
    pagination: {
      currentPage: number;
      totalPages: number;
      totalItems: number;
      perPage: number;
    };
  }> {
    const cacheKey = `blog-posts-${JSON.stringify(filters)}`;
    const cached = this.getFromCache(cacheKey);
    
    if (cached) {
      return cached;
    }

    try {
      // 调用基础 blog service
      const response = await blogService.getPosts(filters);
      
      // 转换数据格式
      const posts = response.data.map(postToBlogCardData);
      
      const result = {
        posts,
        pagination: {
          currentPage: response.meta.current_page,
          totalPages: response.meta.last_page,
          totalItems: response.meta.total,
          perPage: response.meta.per_page,
        },
      };

      this.setCache(cacheKey, result);
      return result;
    } catch (error) {
      console.error('Error fetching blog posts:', error);
      throw error;
    }
  }

  /**
   * 获取单篇文章
   */
  async getBlogPost(slugOrId: string | number): Promise<BlogCardData> {
    const cacheKey = `blog-post-${slugOrId}`;
    const cached = this.getFromCache(cacheKey);
    
    if (cached) {
      return cached;
    }

    try {
      const post = await blogService.getPost(slugOrId);
      const result = postToBlogCardData(post);
      
      this.setCache(cacheKey, result);
      return result;
    } catch (error) {
      console.error('Error fetching blog post:', error);
      throw error;
    }
  }

  /**
   * 搜索文章
   */
  async searchBlogPosts(query: string, page: number = 1, perPage: number = 10): Promise<{
    posts: BlogCardData[];
    totalResults: number;
    currentPage: number;
    totalPages: number;
  }> {
    const cacheKey = `blog-search-${query}-${page}-${perPage}`;
    const cached = this.getFromCache(cacheKey);
    
    if (cached) {
      return cached;
    }

    try {
      const response = await blogService.searchPosts(query, page, perPage);
      const posts = response.data.map(postToBlogCardData);
      
      const result = {
        posts,
        totalResults: response.meta.total,
        currentPage: response.meta.current_page,
        totalPages: response.meta.last_page,
      };

      this.setCache(cacheKey, result);
      return result;
    } catch (error) {
      console.error('Error searching blog posts:', error);
      throw error;
    }
  }

  /**
   * 获取相关文章
   */
  async getRelatedPosts(postId: string | number, limit: number = 4): Promise<BlogCardData[]> {
    const cacheKey = `blog-related-${postId}-${limit}`;
    const cached = this.getFromCache(cacheKey);
    
    if (cached) {
      return cached;
    }

    try {
      const posts = await blogService.getRelatedPosts(postId, limit);
      const result = posts.map(postToBlogCardData);
      
      this.setCache(cacheKey, result);
      return result;
    } catch (error) {
      console.error('Error fetching related posts:', error);
      return [];
    }
  }

  /**
   * 点赞文章
   */
  async likePost(postId: string | number): Promise<void> {
    try {
      await blogService.likePost(postId);
      this.clearPostCache(postId);
    } catch (error) {
      console.error('Error liking post:', error);
      throw error;
    }
  }

  /**
   * 取消点赞
   */
  async unlikePost(postId: string | number): Promise<void> {
    try {
      await blogService.unlikePost(postId);
      this.clearPostCache(postId);
    } catch (error) {
      console.error('Error unliking post:', error);
      throw error;
    }
  }

  /**
   * 收藏文章
   */
  async bookmarkPost(postId: string | number): Promise<void> {
    try {
      await blogService.bookmarkPost(postId);
    } catch (error) {
      console.error('Error bookmarking post:', error);
      throw error;
    }
  }

  /**
   * 取消收藏
   */
  async removeBookmark(postId: string | number): Promise<void> {
    try {
      await blogService.removeBookmark(postId);
    } catch (error) {
      console.error('Error removing bookmark:', error);
      throw error;
    }
  }

  /**
   * 创建文章
   */
  async createBlogPost(data: any): Promise<BlogCardData> {
    try {
      const post = await blogService.createPost(data);
      this.clearAllCache();
      return postToBlogCardData(post);
    } catch (error) {
      console.error('Error creating blog post:', error);
      throw error;
    }
  }

  /**
   * 更新文章
   */
  async updateBlogPost(data: any): Promise<BlogCardData> {
    try {
      const post = await blogService.updatePost(data);
      this.clearPostCache(data.id);
      return postToBlogCardData(post);
    } catch (error) {
      console.error('Error updating blog post:', error);
      throw error;
    }
  }

  /**
   * 删除文章
   */
  async deleteBlogPost(postId: string | number): Promise<void> {
    try {
      await blogService.deletePost(postId);
      this.clearPostCache(postId);
    } catch (error) {
      console.error('Error deleting blog post:', error);
      throw error;
    }
  }

  // Cache management methods

  private getFromCache(key: string): any | null {
    const cached = this.cache.get(key);
    if (!cached) return null;

    const now = Date.now();
    if (now - cached.timestamp > this.CACHE_TTL) {
      this.cache.delete(key);
      return null;
    }

    return cached.data;
  }

  private setCache(key: string, data: any): void {
    this.cache.set(key, {
      data,
      timestamp: Date.now(),
    });
  }

  private clearPostCache(postId: string | number): void {
    const keysToDelete: string[] = [];
    
    for (const key of this.cache.keys()) {
      if (key.includes(`blog-post-${postId}`) || 
          key.includes(`blog-posts-`) ||
          key.includes(`blog-search-`)) {
        keysToDelete.push(key);
      }
    }

    keysToDelete.forEach(key => this.cache.delete(key));
  }

  private clearAllCache(): void {
    this.cache.clear();
  }

  /**
   * 手动清除缓存
   */
  clearCache(): void {
    this.clearAllCache();
  }
}

// Export singleton instance
export const blogIntegrationService = new BlogIntegrationService();
export default blogIntegrationService;
