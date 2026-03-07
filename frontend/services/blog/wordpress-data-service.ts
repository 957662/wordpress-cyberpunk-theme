/**
 * WordPress Data Service
 * 统一的 WordPress 数据获取服务
 * 解决数据格式不一致问题
 */

import { wpClient } from '@/lib/wordpress-client';
import type { BlogPost, Category, Tag, Author } from '@/types/models';

export interface WPPost {
  id: number;
  date: string;
  date_gmt: string;
  modified: string;
  modified_gmt: string;
  slug: string;
  status: string;
  type: string;
  link: string;
  title: {
    rendered: string;
  };
  content: {
    rendered: string;
    protected: boolean;
  };
  excerpt: {
    rendered: string;
    protected: boolean;
  };
  author: number;
  featured_media: number;
  comment_status: string;
  ping_status: string;
  sticky: boolean;
  template: string;
  format: string;
  meta: any[];
  categories: number[];
  tags: number[];
  _links: any;
  yoast_head?: string;
}

export interface WPCategory {
  id: number;
  count: number;
  description: string;
  link: string;
  name: string;
  slug: string;
  taxonomy: string;
  parent: number;
  meta: any[];
  _links: any;
}

export interface WPTag {
  id: number;
  count: number;
  description: string;
  link: string;
  name: string;
  slug: string;
  taxonomy: string;
  meta: any[];
  _links: any;
}

export interface WPAuthor {
  id: number;
  name: string;
  url: string;
  description: string;
  link: string;
  slug: string;
  avatar_urls: {
    24: string;
    48: string;
    96: string;
  };
  meta: any[];
  _links: any;
}

/**
 * WordPress 数据适配器
 * 将 WordPress API 响应转换为应用内部格式
 */
class WordPressDataService {
  /**
   * 转换文章数据
   */
  adaptPost(wpPost: WPPost): BlogPost {
    return {
      id: String(wpPost.id),
      title: wpPost.title.rendered,
      slug: wpPost.slug,
      content: wpPost.content.rendered,
      excerpt: wpPost.excerpt.rendered.replace(/<[^>]*>/g, '').substring(0, 200),
      author: {
        id: String(wpPost.author),
        name: '', // 需要从 author 端点获取
        avatar: '',
        bio: '',
      },
      category: [], // 需要从 categories 端点获取
      tags: [], // 需要从 tags 端点获取
      coverImage: '', // 需要从 media 端点获取
      publishedAt: wpPost.date,
      createdAt: wpPost.date,
      updatedAt: wpPost.modified,
      status: wpPost.status === 'publish' ? 'published' : 'draft',
      viewCount: 0,
      likeCount: 0,
      commentCount: 0,
      featured: wpPost.sticky,
      seoTitle: '',
      seoDescription: '',
      readingTime: this.calculateReadingTime(wpPost.content.rendered),
    };
  }

  /**
   * 转换分类数据
   */
  adaptCategory(wpCategory: WPCategory): Category {
    return {
      id: String(wpCategory.id),
      name: wpCategory.name,
      slug: wpCategory.slug,
      description: wpCategory.description,
      postCount: wpCategory.count,
      parentId: wpCategory.parent ? String(wpCategory.parent) : undefined,
    };
  }

  /**
   * 转换标签数据
   */
  adaptTag(wpTag: WPTag): Tag {
    return {
      id: String(wpTag.id),
      name: wpTag.name,
      slug: wpTag.slug,
      description: wpTag.description,
      postCount: wpTag.count,
    };
  }

  /**
   * 转换作者数据
   */
  adaptAuthor(wpAuthor: WPAuthor): Author {
    return {
      id: String(wpAuthor.id),
      name: wpAuthor.name,
      slug: wpAuthor.slug,
      avatar: wpAuthor.avatar_urls?.['96'] || '',
      bio: wpAuthor.description,
      website: wpAuthor.url,
    };
  }

  /**
   * 计算阅读时间
   */
  calculateReadingTime(content: string): number {
    const wordsPerMinute = 200;
    const text = content.replace(/<[^>]*>/g, '');
    const words = text.split(/\s+/).length;
    return Math.ceil(words / wordsPerMinute);
  }

  /**
   * 获取文章列表
   */
  async getPosts(params: {
    page?: number;
    per_page?: number;
    categories?: number[];
    tags?: number[];
    search?: string;
    order?: 'asc' | 'desc';
    orderby?: string;
    sticky?: boolean;
  } = {}): Promise<{
    posts: BlogPost[];
    total: number;
    totalPages: number;
  }> {
    try {
      const response = await wpClient.getPosts({
        page: params.page || 1,
        per_page: params.per_page || 10,
        categories: params.categories,
        tags: params.tags,
        search: params.search,
        order: params.order || 'desc',
        orderby: params.orderby || 'date',
        sticky: params.sticky,
      });

      const posts = response.map((post) => this.adaptPost(post));
      const total = parseInt(response.headers?.get('x-wp-total') || '0', 10);
      const totalPages = parseInt(response.headers?.get('x-wp-totalpages') || '0', 10);

      return { posts, total, totalPages };
    } catch (error) {
      console.error('Error fetching posts:', error);
      throw error;
    }
  }

  /**
   * 获取单篇文章
   */
  async getPost(id: string | number): Promise<BlogPost | null> {
    try {
      const response = await wpClient.getPost(id);
      return this.adaptPost(response);
    } catch (error) {
      console.error('Error fetching post:', error);
      return null;
    }
  }

  /**
   * 通过 slug 获取文章
   */
  async getPostBySlug(slug: string): Promise<BlogPost | null> {
    try {
      const response = await wpClient.getPostBySlug(slug);
      return response ? this.adaptPost(response) : null;
    } catch (error) {
      console.error('Error fetching post by slug:', error);
      return null;
    }
  }

  /**
   * 获取分类列表
   */
  async getCategories(params: {
    page?: number;
    per_page?: number;
    hide_empty?: boolean;
  } = {}): Promise<{
    categories: Category[];
    total: number;
  }> {
    try {
      const response = await wpClient.getCategories({
        page: params.page || 1,
        per_page: params.per_page || 100,
        hide_empty: params.hide_empty !== false,
      });

      const categories = response.map((cat) => this.adaptCategory(cat));
      const total = parseInt(response.headers?.get('x-wp-total') || '0', 10);

      return { categories, total };
    } catch (error) {
      console.error('Error fetching categories:', error);
      throw error;
    }
  }

  /**
   * 获取单个分类
   */
  async getCategory(id: string | number): Promise<Category | null> {
    try {
      const response = await wpClient.getCategory(id);
      return this.adaptCategory(response);
    } catch (error) {
      console.error('Error fetching category:', error);
      return null;
    }
  }

  /**
   * 获取标签列表
   */
  async getTags(params: {
    page?: number;
    per_page?: number;
    hide_empty?: boolean;
  } = {}): Promise<{
    tags: Tag[];
    total: number;
  }> {
    try {
      const response = await wpClient.getTags({
        page: params.page || 1,
        per_page: params.per_page || 100,
        hide_empty: params.hide_empty !== false,
      });

      const tags = response.map((tag) => this.adaptTag(tag));
      const total = parseInt(response.headers?.get('x-wp-total') || '0', 10);

      return { tags, total };
    } catch (error) {
      console.error('Error fetching tags:', error);
      throw error;
    }
  }

  /**
   * 获取作者列表
   */
  async getAuthors(params: {
    page?: number;
    per_page?: number;
  } = {}): Promise<{
    authors: Author[];
    total: number;
  }> {
    try {
      const response = await wpClient.getUsers({
        page: params.page || 1,
        per_page: params.per_page || 100,
      });

      const authors = response.map((author) => this.adaptAuthor(author));
      const total = parseInt(response.headers?.get('x-wp-total') || '0', 10);

      return { authors, total };
    } catch (error) {
      console.error('Error fetching authors:', error);
      throw error;
    }
  }

  /**
   * 搜索文章
   */
  async searchPosts(query: string, params: {
    page?: number;
    per_page?: number;
  } = {}): Promise<{
    posts: BlogPost[];
    total: number;
    totalPages: number;
  }> {
    return this.getPosts({
      ...params,
      search: query,
    });
  }
}

// 导出单例
export const wordpressDataService = new WordPressDataService();
export default wordpressDataService;
