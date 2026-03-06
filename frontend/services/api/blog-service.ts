/**
 * 博客服务 - 封装所有博客相关的 API 调用
 */

import { Post, PostMeta, Category, Tag } from '@/types';

export interface BlogSearchParams {
  page?: number;
  perPage?: number;
  category?: string;
  tag?: string;
  search?: string;
  author?: string;
  orderBy?: 'date' | 'title' | 'modified';
  order?: 'asc' | 'desc';
  status?: string;
}

export interface BlogListResponse {
  posts: Post[];
  meta: PostMeta;
}

class BlogService {
  private baseUrl: string;

  constructor() {
    this.baseUrl = process.env.NEXT_PUBLIC_API_URL || '/api';
  }

  /**
   * 获取文章列表
   */
  async getPosts(params: BlogSearchParams = {}): Promise<BlogListResponse> {
    const {
      page = 1,
      perPage = 10,
      category,
      tag,
      search,
      author,
      orderBy = 'date',
      order = 'desc',
      status = 'publish',
    } = params;

    const queryParams = new URLSearchParams({
      page: page.toString(),
      per_page: perPage.toString(),
      _embed: 'true',
      orderBy,
      order,
      status,
    });

    if (category) queryParams.append('categories', category);
    if (tag) queryParams.append('tags', tag);
    if (search) queryParams.append('search', search);
    if (author) queryParams.append('author', author);

    const response = await fetch(`${this.baseUrl}/posts?${queryParams}`);

    if (!response.ok) {
      throw new Error(`获取文章失败: ${response.statusText}`);
    }

    const posts = await response.json();
    const total = parseInt(response.headers.get('X-WP-Total') || '0', 10);
    const totalPages = parseInt(response.headers.get('X-WP-TotalPages') || '0', 10);

    return {
      posts: this.transformPosts(posts),
      meta: {
        total,
        page,
        perPage,
        totalPages,
      },
    };
  }

  /**
   * 获取单篇文章
   */
  async getPost(slug: string): Promise<Post> {
    const response = await fetch(
      `${this.baseUrl}/posts?slug=${slug}&_embed=true`
    );

    if (!response.ok) {
      throw new Error(`获取文章失败: ${response.statusText}`);
    }

    const posts = await response.json();
    if (!posts || posts.length === 0) {
      throw new Error('文章不存在');
    }

    return this.transformPost(posts[0]);
  }

  /**
   * 获取分类列表
   */
  async getCategories(): Promise<Category[]> {
    const response = await fetch(`${this.baseUrl}/categories?per_page=100`);

    if (!response.ok) {
      throw new Error(`获取分类失败: ${response.statusText}`);
    }

    return await response.json();
  }

  /**
   * 获取标签列表
   */
  async getTags(): Promise<Tag[]> {
    const response = await fetch(`${this.baseUrl}/tags?per_page=100`);

    if (!response.ok) {
      throw new Error(`获取标签失败: ${response.statusText}`);
    }

    return await response.json();
  }

  /**
   * 搜索文章
   */
  async searchPosts(query: string, params: Omit<BlogSearchParams, 'search'> = {}): Promise<BlogListResponse> {
    return this.getPosts({ ...params, search: query });
  }

  /**
   * 获取相关文章
   */
  async getRelatedPosts(postId: string | number, limit: number = 4): Promise<Post[]> {
    const response = await fetch(
      `${this.baseUrl}/posts?exclude=${postId}&per_page=${limit}&_embed=true`
    );

    if (!response.ok) {
      throw new Error(`获取相关文章失败: ${response.statusText}`);
    }

    const posts = await response.json();
    return this.transformPosts(posts);
  }

  /**
   * 获取热门文章（基于浏览量）
   */
  async getPopularPosts(limit: number = 5): Promise<Post[]> {
    const response = await fetch(
      `${this.baseUrl}/posts?per_page=${limit}&orderby=view_count&_embed=true`
    );

    if (!response.ok) {
      throw new Error(`获取热门文章失败: ${response.statusText}`);
    }

    const posts = await response.json();
    return this.transformPosts(posts);
  }

  /**
   * 获取特色文章
   */
  async getFeaturedPosts(limit: number = 3): Promise<Post[]> {
    const response = await fetch(
      `${this.baseUrl}/posts?sticky=true&per_page=${limit}&_embed=true`
    );

    if (!response.ok) {
      throw new Error(`获取特色文章失败: ${response.statusText}`);
    }

    const posts = await response.json();
    return this.transformPosts(posts);
  }

  /**
   * 转换 WordPress 文章数据为标准格式
   */
  private transformPost(wpPost: any): Post {
    const featuredMedia = wpPost._embedded?.['wp:featuredmedia']?.[0];
    const author = wpPost._embedded?.author?.[0];
    const categories = wpPost._embedded?.['wp:term']?.[0] || [];
    const tags = wpPost._embedded?.['wp:term']?.[1] || [];

    return {
      id: wpPost.id,
      title: wpPost.title.rendered,
      excerpt: wpPost.excerpt.rendered,
      content: wpPost.content.rendered,
      slug: wpPost.slug,
      coverImage: featuredMedia?.source_url,
      author: {
        id: author?.id,
        name: author?.name || 'Admin',
        avatar: author?.avatar_urls?.['96'],
      },
      category: categories[0]?.name,
      categories: categories.map((c: any) => c.id),
      tags: tags.map((t: any) => t.name),
      createdAt: wpPost.date,
      updatedAt: wpPost.modified,
      status: wpPost.status,
      featured: wpPost.sticky,
      sticky: wpPost.sticky,
    };
  }

  /**
   * 批量转换文章
   */
  private transformPosts(wpPosts: any[]): Post[] {
    return wpPosts.map(wpPost => this.transformPost(wpPost));
  }
}

// 导出单例
export const blogService = new BlogService();
export default blogService;
