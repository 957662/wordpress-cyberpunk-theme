/**
 * API Service
 * 统一的API调用服务
 */

import { WordPressClient } from '@/lib/wordpress/api';

// API配置
const API_CONFIG = {
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000',
  wordpressURL: process.env.NEXT_PUBLIC_WORDPRESS_URL || 'http://localhost:8080',
};

// 创建WordPress客户端
const wpClient = new WordPressClient({
  baseUrl: API_CONFIG.wordpressURL,
  timeout: 10000,
});

/**
 * 文章API
 */
export const postsAPI = {
  async getPosts(params?: any) {
    return await wpClient.getPosts(params);
  },
  async getPost(id: number | string) {
    return await wpClient.getPost(id);
  },
  async getPostBySlug(slug: string) {
    return await wpClient.getPostBySlug(slug);
  },
  async getFeaturedPosts(limit: number = 5) {
    return await wpClient.getPosts({ per_page: limit, orderby: 'date', order: 'desc' });
  },
  async getRecentPosts(limit: number = 10) {
    return await wpClient.getPosts({ per_page: limit, orderby: 'date', order: 'desc' });
  },
};

/**
 * 分类API
 */
export const categoriesAPI = {
  async getCategories(params?: any) {
    return await wpClient.getCategories(params);
  },
  async getCategory(id: number) {
    return await wpClient.client.get(`/categories/${id}`);
  },
};

/**
 * 标签API
 */
export const tagsAPI = {
  async getTags(params?: any) {
    return await wpClient.getTags(params);
  },
  async getTag(id: number) {
    return await wpClient.client.get(`/tags/${id}`);
  },
};

/**
 * 搜索API
 */
export const searchAPI = {
  async search(query: string, subtype: 'post' | 'page' | 'any' = 'any') {
    return await wpClient.search({ search: query, subtype, per_page: 20 });
  },
};

// 导出所有API
export const api = {
  posts: postsAPI,
  categories: categoriesAPI,
  tags: tagsAPI,
  search: searchAPI,
};

export default api;
