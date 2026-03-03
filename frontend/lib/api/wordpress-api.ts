/**
 * WordPress API Client
 * WordPress REST API 客户端
 */

import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';

// WordPress API 配置
const WP_API_URL = process.env.NEXT_PUBLIC_WORDPRESS_API_URL || 'http://localhost:8080/wp-json';
const WP_API_USERNAME = process.env.WP_API_USERNAME || '';
const WP_API_PASSWORD = process.env.WP_API_PASSWORD || '';

// 创建 axios 实例
const createApiInstance = (): AxiosInstance => {
  const instance = axios.create({
    baseURL: WP_API_URL,
    timeout: 30000,
    headers: {
      'Content-Type': 'application/json',
    },
  });

  // 请求拦截器
  instance.interceptors.request.use(
    (config) => {
      // 添加认证头（如果有）
      if (WP_API_USERNAME && WP_API_PASSWORD) {
        const auth = Buffer.from(`${WP_API_USERNAME}:${WP_API_PASSWORD}`).toString('base64');
        config.headers.Authorization = `Basic ${auth}`;
      }

      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );

  // 响应拦截器
  instance.interceptors.response.use(
    (response: AxiosResponse) => {
      return response;
    },
    (error) => {
      // 统一错误处理
      if (error.response) {
        // 服务器返回错误状态码
        console.error('API Error:', error.response.status, error.response.data);
      } else if (error.request) {
        // 请求已发出但没有收到响应
        console.error('Network Error:', error.message);
      } else {
        // 其他错误
        console.error('Error:', error.message);
      }

      return Promise.reject(error);
    }
  );

  return instance;
};

// 导出 API 实例
export const wpApi = createApiInstance();

// WordPress API 端点
export const wpEndpoints = {
  // 文章
  posts: '/wp/v2/posts',
  post: (id: number) => `/wp/v2/posts/${id}`,

  // 页面
  pages: '/wp/v2/pages',
  page: (id: number) => `/wp/v2/pages/${id}`,

  // 分类
  categories: '/wp/v2/categories',
  category: (id: number) => `/wp/v2/categories/${id}`,

  // 标签
  tags: '/wp/v2/tags',
  tag: (id: number) => `/wp/v2/tags/${id}`,

  // 用户
  users: '/wp/v2/users',
  user: (id: number) => `/wp/v2/users/${id}`,

  // 评论
  comments: '/wp/v2/comments',
  comment: (id: number) => `/wp/v2/comments/${id}`,

  // 媒体
  media: '/wp/v2/media',
  mediaItem: (id: number) => `/wp/v2/media/${id}`,

  // 搜索
  search: '/wp/v2/search',

  // 分类法
  taxonomies: '/wp/v2/taxonomies',
  types: '/wp/v2/types',
};

// 辅助函数：构建查询参数
export const buildQueryParams = (params: Record<string, any>): string => {
  const query = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      if (Array.isArray(value)) {
        query.append(key, value.join(','));
      } else {
        query.append(key, String(value));
      }
    }
  });

  return query.toString();
};

// 导出默认实例
export default wpApi;
