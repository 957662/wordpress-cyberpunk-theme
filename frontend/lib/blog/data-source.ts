/**
 * Blog Data Source - Unified data access layer
 * 统一的博客数据访问层
 */

import { wpService } from '../services/wordpress-service';
import { adaptWordPressPost, adaptWordPressPosts } from './adapters';
import type { BlogPost, BlogCategory, BlogTag, BlogComment } from '@/types/models/blog';

export interface BlogDataSource {
  getPosts(params?: {
    page?: number;
    perPage?: number;
    category?: number;
    tag?: number;
    search?: string;
  }): Promise<{ posts: BlogPost[]; total: number; totalPages: number }>;

  getPost(id: number | string): Promise<BlogPost>;

  getCategories(): Promise<BlogCategory[]>;

  getCategory(id: number): Promise<BlogCategory>;

  getTags(): Promise<BlogTag[]>;

  getTag(id: number): Promise<BlogTag>;

  getComments(postId: number): Promise<BlogComment[]>;

  createComment(
    postId: number,
    content: string,
    author: { name: string; email: string; url?: string },
    parentId?: number
  ): Promise<BlogComment>;
}

/**
 * WordPress Data Source Implementation
 */
export class WordPressDataSource implements BlogDataSource {
  async getPosts(params?: {
    page?: number;
    perPage?: number;
    category?: number;
    tag?: number;
    search?: string;
  }): Promise<{ posts: BlogPost[]; total: number; totalPages: number }> {
    const response = await wpService.getPosts({
      page: params?.page || 1,
      perPage: params?.perPage || 10,
      categories: params?.category ? [params.category] : undefined,
      tags: params?.tag ? [params.tag] : undefined,
      search: params?.search,
    });

    return {
      posts: adaptWordPressPosts(response.posts),
      total: response.total,
      totalPages: response.totalPages,
    };
  }

  async getPost(id: number | string): Promise<BlogPost> {
    const post = await wpService.getPost(id);
    return adaptWordPressPost(post);
  }

  async getCategories(): Promise<BlogCategory[]> {
    const categories = await wpService.getCategories({ hideEmpty: true });

    return categories.map(cat => ({
      id: cat.id,
      name: cat.name,
      slug: cat.slug,
      description: cat.description,
      count: cat.count,
      parent: cat.parent,
      link: cat.link,
    }));
  }

  async getCategory(id: number): Promise<BlogCategory> {
    const cat = await wpService.getCategory(id);

    return {
      id: cat.id,
      name: cat.name,
      slug: cat.slug,
      description: cat.description,
      count: cat.count,
      parent: cat.parent,
      link: cat.link,
    };
  }

  async getTags(): Promise<BlogTag[]> {
    const tags = await wpService.getTags({ hideEmpty: true });

    return tags.map(tag => ({
      id: tag.id,
      name: tag.name,
      slug: tag.slug,
      description: tag.description,
      count: tag.count,
      link: tag.link,
    }));
  }

  async getTag(id: number): Promise<BlogTag> {
    const tag = await wpService.getTag(id);

    return {
      id: tag.id,
      name: tag.name,
      slug: tag.slug,
      description: tag.description,
      count: tag.count,
      link: tag.link,
    };
  }

  async getComments(postId: number): Promise<BlogComment[]> {
    const response = await wpService.getComments({ post: postId });

    return response.comments.map(comment => ({
      id: comment.id,
      author: {
        name: comment.author_name,
        url: comment.author_url,
      },
      date: comment.date,
      content: comment.content.rendered,
      parentId: comment.parent,
    }));
  }

  async createComment(
    postId: number,
    content: string,
    author: { name: string; email: string; url?: string },
    parentId?: number
  ): Promise<BlogComment> {
    const comment = await wpService.createComment(postId, content, author, parentId);

    return {
      id: comment.id,
      author: {
        name: comment.author_name,
        url: comment.author_url,
      },
      date: comment.date,
      content: comment.content.rendered,
      parentId: comment.parent,
    };
  }
}

/**
 * Mock Data Source (for development/testing)
 */
export class MockDataSource implements BlogDataSource {
  private posts: BlogPost[] = [
    {
      id: '1',
      title: '欢迎使用 CyberPress',
      excerpt: '这是一个功能完整的赛博朋克风格博客平台',
      content: '<p>CyberPress Platform 是一个现代化的博客平台...</p>',
      author: {
        id: 1,
        name: 'Admin',
        avatar: '/avatars/admin.jpg',
      },
      date: '2026-03-07',
      category: {
        id: 1,
        name: '公告',
        slug: 'announcement',
      },
      tags: [
        { id: 1, name: '欢迎', slug: 'welcome' },
        { id: 2, name: '介绍', slug: 'introduction' },
      ],
      featuredImage: '/images/featured-1.jpg',
      views: 1234,
      likes: 56,
      readingTime: 5,
    },
    // Add more mock posts as needed...
  ];

  async getPosts(): Promise<{ posts: BlogPost[]; total: number; totalPages: number }> {
    return {
      posts: this.posts,
      total: this.posts.length,
      totalPages: 1,
    };
  }

  async getPost(id: string | number): Promise<BlogPost> {
    const post = this.posts.find(p => p.id === String(id));
    if (!post) {
      throw new Error('Post not found');
    }
    return post;
  }

  async getCategories(): Promise<BlogCategory[]> {
    return [
      { id: 1, name: '公告', slug: 'announcement', count: 1, link: '#' },
      { id: 2, name: '技术', slug: 'tech', count: 5, link: '#' },
      { id: 3, name: '生活', slug: 'life', count: 3, link: '#' },
    ];
  }

  async getCategory(id: number): Promise<BlogCategory> {
    const categories = await this.getCategories();
    const category = categories.find(c => c.id === id);
    if (!category) throw new Error('Category not found');
    return category;
  }

  async getTags(): Promise<BlogTag[]> {
    return [
      { id: 1, name: '欢迎', slug: 'welcome', count: 1, link: '#' },
      { id: 2, name: '介绍', slug: 'introduction', count: 1, link: '#' },
      { id: 3, name: 'React', slug: 'react', count: 5, link: '#' },
    ];
  }

  async getTag(id: number): Promise<BlogTag> {
    const tags = await this.getTags();
    const tag = tags.find(t => t.id === id);
    if (!tag) throw new Error('Tag not found');
    return tag;
  }

  async getComments(): Promise<BlogComment[]> {
    return [];
  }

  async createComment(): Promise<BlogComment> {
    throw new Error('Not implemented in mock data source');
  }
}

// Export default data source instance
export const blogDataSource: BlogDataSource = process.env.NEXT_PUBLIC_USE_MOCK_DATA === 'true'
  ? new MockDataSource()
  : new WordPressDataSource();

// Export types
export type { BlogDataSource };
