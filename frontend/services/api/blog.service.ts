/**
 * Blog API Service
 * 博客相关的 API 服务
 */

import { wordpressAPI } from '../wordpress-api';
import type {
  WPPost,
  WPCategory,
  WPTag,
  WPUser,
  WPMedia,
} from '@/types/wordpress';
import {
  adaptWPPostToBlogPost,
  adaptWPPostList,
  adaptWPCategory,
  adaptWPTag,
  adaptWPAuthor,
  adaptToArticleCardPropsList,
} from '@/lib/adapters/blog-adapter';
import type { BlogPost, Category, Tag, Author } from '@/lib/adapters/blog-adapter';

/**
 * 博客服务类
 */
export class BlogService {
  /**
   * 获取文章列表
   */
  async getPosts(params?: {
    page?: number;
    per_page?: number;
    categories?: number[];
    tags?: number[];
    search?: string;
    author?: number;
    orderby?: 'date' | 'title' | 'modified' | 'relevance';
    order?: 'asc' | 'desc';
  }): Promise<{ posts: BlogPost[]; total: number; totalPages: number }> {
    try {
      const response = await wordpressAPI.getPosts(params);
      const total = parseInt(response.headers['x-wp-total'] || '0', 10);
      const totalPages = parseInt(response.headers['x-wp-totalpages'] || '0', 10);

      // 获取关联数据
      const authorIds = [...new Set(response.data.map(post => post.author))];
      const categoryIds = [...new Set(response.data.flatMap(post => post.categories || []))];
      const tagIds = [...new Set(response.data.flatMap(post => post.tags || []))];
      const mediaIds = [...new Set(response.data.map(post => post.featured_media).filter(Boolean))];

      const [authors, categories, tags, media] = await Promise.all([
        this.fetchAuthors(authorIds),
        this.fetchCategories(categoryIds),
        this.fetchTags(tagIds),
        this.fetchMedia(mediaIds),
      ]);

      const posts = adaptWPPostList(
        response.data,
        authors,
        categories,
        tags,
        media
      );

      return { posts, total, totalPages };
    } catch (error) {
      console.error('Error fetching posts:', error);
      throw error;
    }
  }

  /**
   * 根据 slug 获取文章
   */
  async getPostBySlug(slug: string): Promise<BlogPost | null> {
    try {
      const response = await wordpressAPI.getPosts({ slug });
      if (response.data.length === 0) {
        return null;
      }

      const post = response.data[0];
      const [author, categories, tags, featuredMedia] = await Promise.all([
        this.fetchAuthors([post.author]),
        this.fetchCategories(post.categories || []),
        this.fetchTags(post.tags || []),
        this.fetchMedia(post.featured_media ? [post.featured_media] : []),
      ]);

      return adaptWPPostToBlogPost(
        post,
        author?.get(post.author),
        categories?.get(post.id) || [],
        tags?.get(post.id) || [],
        featuredMedia?.get(post.featured_media)
      );
    } catch (error) {
      console.error('Error fetching post by slug:', error);
      throw error;
    }
  }

  /**
   * 根据 ID 获取文章
   */
  async getPostById(id: number): Promise<BlogPost | null> {
    try {
      const response = await wordpressAPI.getPost(id);
      const post = response.data;

      const [author, categories, tags, featuredMedia] = await Promise.all([
        this.fetchAuthors([post.author]),
        this.fetchCategories(post.categories || []),
        this.fetchTags(post.tags || []),
        this.fetchMedia(post.featured_media ? [post.featured_media] : []),
      ]);

      return adaptWPPostToBlogPost(
        post,
        author?.get(post.author),
        categories?.get(post.id) || [],
        tags?.get(post.id) || [],
        featuredMedia?.get(post.featured_media)
      );
    } catch (error) {
      console.error('Error fetching post by ID:', error);
      throw error;
    }
  }

  /**
   * 获取精选文章
   */
  async getFeaturedPosts(limit: number = 5): Promise<BlogPost[]> {
    try {
      const response = await wordpressAPI.getPosts({
        sticky: true,
        per_page: limit,
      });
      return this.adaptPostsWithoutRelations(response.data);
    } catch (error) {
      console.error('Error fetching featured posts:', error);
      return [];
    }
  }

  /**
   * 获取最新文章
   */
  async getRecentPosts(limit: number = 10): Promise<BlogPost[]> {
    try {
      const response = await wordpressAPI.getPosts({
        per_page: limit,
        orderby: 'date',
        order: 'desc',
      });
      return this.adaptPostsWithoutRelations(response.data);
    } catch (error) {
      console.error('Error fetching recent posts:', error);
      return [];
    }
  }

  /**
   * 获取相关文章
   */
  async getRelatedPosts(
    postId: number,
    categoryIds: number[],
    limit: number = 4
  ): Promise<BlogPost[]> {
    try {
      const response = await wordpressAPI.getPosts({
        categories: categoryIds,
        per_page: limit,
        exclude: [postId],
      });
      return this.adaptPostsWithoutRelations(response.data);
    } catch (error) {
      console.error('Error fetching related posts:', error);
      return [];
    }
  }

  /**
   * 搜索文章
   */
  async searchPosts(query: string, params?: {
    page?: number;
    per_page?: number;
  }): Promise<{ posts: BlogPost[]; total: number; totalPages: number }> {
    try {
      const response = await wordpressAPI.getPosts({
        search: query,
        ...params,
      });
      const total = parseInt(response.headers['x-wp-total'] || '0', 10);
      const totalPages = parseInt(response.headers['x-wp-totalpages'] || '0', 10);

      const posts = this.adaptPostsWithoutRelations(response.data);

      return { posts, total, totalPages };
    } catch (error) {
      console.error('Error searching posts:', error);
      throw error;
    }
  }

  /**
   * 获取分类列表
   */
  async getCategories(params?: {
    page?: number;
    per_page?: number;
    hide_empty?: boolean;
  }): Promise<{ categories: Category[]; total: number }> {
    try {
      const response = await wordpressAPI.getCategories(params);
      const total = parseInt(response.headers['x-wp-total'] || '0', 10);

      const categories = response.data.map(adaptWPCategory);

      return { categories, total };
    } catch (error) {
      console.error('Error fetching categories:', error);
      throw error;
    }
  }

  /**
   * 根据 slug 获取分类
   */
  async getCategoryBySlug(slug: string): Promise<Category | null> {
    try {
      const response = await wordpressAPI.getCategories({ slug });
      if (response.data.length === 0) {
        return null;
      }
      return adaptWPCategory(response.data[0]);
    } catch (error) {
      console.error('Error fetching category by slug:', error);
      return null;
    }
  }

  /**
   * 获取标签列表
   */
  async getTags(params?: {
    page?: number;
    per_page?: number;
    hide_empty?: boolean;
  }): Promise<{ tags: Tag[]; total: number }> {
    try {
      const response = await wordpressAPI.getTags(params);
      const total = parseInt(response.headers['x-wp-total'] || '0', 10);

      const tags = response.data.map(adaptWPTag);

      return { tags, total };
    } catch (error) {
      console.error('Error fetching tags:', error);
      throw error;
    }
  }

  /**
   * 根据 slug 获取标签
   */
  async getTagBySlug(slug: string): Promise<Tag | null> {
    try {
      const response = await wordpressAPI.getTags({ slug });
      if (response.data.length === 0) {
        return null;
      }
      return adaptWPTag(response.data[0]);
    } catch (error) {
      console.error('Error fetching tag by slug:', error);
      return null;
    }
  }

  /**
   * 获取作者列表
   */
  async getAuthors(params?: {
    page?: number;
    per_page?: number;
  }): Promise<{ authors: Author[]; total: number }> {
    try {
      const response = await wordpressAPI.getUsers(params);
      const total = parseInt(response.headers['x-wp-total'] || '0', 10);

      const authors = response.data.map(adaptWPAuthor);

      return { authors, total };
    } catch (error) {
      console.error('Error fetching authors:', error);
      throw error;
    }
  }

  /**
   * 根据 slug 获取作者
   */
  async getAuthorBySlug(slug: string): Promise<Author | null> {
    try {
      const response = await wordpressAPI.getUsers({ slug });
      if (response.data.length === 0) {
        return null;
      }
      return adaptWPAuthor(response.data[0]);
    } catch (error) {
      console.error('Error fetching author by slug:', error);
      return null;
    }
  }

  /**
   * 获取作者的文章
   */
  async getPostsByAuthor(authorId: number, params?: {
    page?: number;
    per_page?: number;
  }): Promise<{ posts: BlogPost[]; total: number }> {
    try {
      const response = await wordpressAPI.getPosts({
        author: authorId,
        ...params,
      });
      const total = parseInt(response.headers['x-wp-total'] || '0', 10);

      const posts = this.adaptPostsWithoutRelations(response.data);

      return { posts, total };
    } catch (error) {
      console.error('Error fetching posts by author:', error);
      throw error;
    }
  }

  /**
   * 获取分类的文章
   */
  async getPostsByCategory(categoryId: number, params?: {
    page?: number;
    per_page?: number;
  }): Promise<{ posts: BlogPost[]; total: number }> {
    try {
      const response = await wordpressAPI.getPosts({
        categories: [categoryId],
        ...params,
      });
      const total = parseInt(response.headers['x-wp-total'] || '0', 10);

      const posts = this.adaptPostsWithoutRelations(response.data);

      return { posts, total };
    } catch (error) {
      console.error('Error fetching posts by category:', error);
      throw error;
    }
  }

  /**
   * 获取标签的文章
   */
  async getPostsByTag(tagId: number, params?: {
    page?: number;
    per_page?: number;
  }): Promise<{ posts: BlogPost[]; total: number }> {
    try {
      const response = await wordpressAPI.getPosts({
        tags: [tagId],
        ...params,
      });
      const total = parseInt(response.headers['x-wp-total'] || '0', 10);

      const posts = this.adaptPostsWithoutRelations(response.data);

      return { posts, total };
    } catch (error) {
      console.error('Error fetching posts by tag:', error);
      throw error;
    }
  }

  /**
   * 辅助方法：批量获取作者
   */
  private async fetchAuthors(ids: number[]): Promise<Map<number, WPUser> | undefined> {
    if (ids.length === 0) return undefined;
    try {
      const response = await wordpressAPI.getUsers({ include: ids });
      return new Map(response.data.map(user => [user.id, user]));
    } catch (error) {
      console.error('Error fetching authors:', error);
      return undefined;
    }
  }

  /**
   * 辅助方法：批量获取分类
   */
  private async fetchCategories(ids: number[]): Promise<Map<number, WPCategory[]> | undefined> {
    if (ids.length === 0) return undefined;
    try {
      const response = await wordpressAPI.getCategories({ include: ids });
      const categoryMap = new Map<number, WPCategory[]>();
      response.data.forEach(cat => {
        if (!categoryMap.has(0)) categoryMap.set(0, []);
        categoryMap.get(0)!.push(cat);
      });
      return categoryMap;
    } catch (error) {
      console.error('Error fetching categories:', error);
      return undefined;
    }
  }

  /**
   * 辅助方法：批量获取标签
   */
  private async fetchTags(ids: number[]): Promise<Map<number, WPTag[]> | undefined> {
    if (ids.length === 0) return undefined;
    try {
      const response = await wordpressAPI.getTags({ include: ids });
      const tagMap = new Map<number, WPTag[]>();
      response.data.forEach(tag => {
        if (!tagMap.has(0)) tagMap.set(0, []);
        tagMap.get(0)!.push(tag);
      });
      return tagMap;
    } catch (error) {
      console.error('Error fetching tags:', error);
      return undefined;
    }
  }

  /**
   * 辅助方法：批量获取媒体
   */
  private async fetchMedia(ids: number[]): Promise<Map<number, WPMedia> | undefined> {
    if (ids.length === 0) return undefined;
    try {
      const response = await wordpressAPI.getMedia({ include: ids });
      return new Map(response.data.map(media => [media.id, media]));
    } catch (error) {
      console.error('Error fetching media:', error);
      return undefined;
    }
  }

  /**
   * 简单转换，不获取关联数据
   */
  private adaptPostsWithoutRelations(posts: WPPost[]): BlogPost[] {
    return posts.map(post =>
      adaptWPPostToBlogPost(post)
    );
  }
}

// 导出单例
export const blogService = new BlogService();
