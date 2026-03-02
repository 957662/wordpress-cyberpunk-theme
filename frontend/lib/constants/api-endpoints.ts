/**
 * API 端点常量
 * 集中管理所有 API 路径
 */

export const API_ENDPOINTS = {
  // WordPress REST API 基础路径
  BASE: '/wp-json',

  // 认证
  AUTH: {
    LOGIN: '/wp-json/jwt-auth/v1/token',
    REGISTER: '/wp-json/wp/v2/users/register',
    REFRESH: '/wp-json/jwt-auth/v1/token/refresh',
    VALIDATE: '/wp-json/jwt-auth/v1/token/validate',
    RESET_PASSWORD: '/wp-json/wp/v2/users/lost-password'
  },

  // 文章
  POSTS: {
    LIST: '/wp-json/wp/v2/posts',
    DETAIL: (id: number) => `/wp-json/wp/v2/posts/${id}`,
    CREATE: '/wp-json/wp/v2/posts',
    UPDATE: (id: number) => `/wp-json/wp/v2/posts/${id}`,
    DELETE: (id: number) => `/wp-json/wp/v2/posts/${id}`,
    SEARCH: '/wp-json/wp/v2/posts/search'
  },

  // 页面
  PAGES: {
    LIST: '/wp-json/wp/v2/pages',
    DETAIL: (id: number) => `/wp-json/wp/v2/pages/${id}`
  },

  // 分类
  CATEGORIES: {
    LIST: '/wp-json/wp/v2/categories',
    DETAIL: (id: number) => `/wp-json/wp/v2/categories/${id}`,
    TREE: '/wp-json/custom/categories/tree'
  },

  // 标签
  TAGS: {
    LIST: '/wp-json/wp/v2/tags',
    DETAIL: (id: number) => `/wp-json/wp/v2/tags/${id}`
  },

  // 媒体
  MEDIA: {
    LIST: '/wp-json/wp/v2/media',
    DETAIL: (id: number) => `/wp-json/wp/v2/media/${id}`,
    UPLOAD: '/wp-json/wp/v2/media',
    DELETE: (id: number) => `/wp-json/wp/v2/media/${id}`,
    UPDATE: (id: number) => `/wp-json/wp/v2/media/${id}`
  },

  // 用户
  USERS: {
    LIST: '/wp-json/wp/v2/users',
    DETAIL: (id: number) => `/wp-json/wp/v2/users/${id}`,
    ME: '/wp-json/wp/v2/users/me',
    UPDATE: (id: number) => `/wp-json/wp/v2/users/${id}`
  },

  // 评论
  COMMENTS: {
    LIST: '/wp-json/wp/v2/comments',
    DETAIL: (id: number) => `/wp-json/wp/v2/comments/${id}`,
    CREATE: '/wp-json/wp/v2/comments',
    DELETE: (id: number) => `/wp-json/wp/v2/comments/${id}`,
    BY_POST: (postId: number) => `/wp-json/wp/v2/comments?post=${postId}`
  },

  // 搜索
  SEARCH: {
    GENERAL: '/wp-json/wp/v2/search',
    POSTS: '/wp-json/custom/search/posts',
    ADVANCED: '/wp-json/custom/search/advanced'
  },

  // 自定义端点
  CUSTOM: {
    STATS: '/wp-json/custom/stats',
    SETTINGS: '/wp-json/custom/settings',
    ANALYTICS: '/wp-json/custom/analytics',
    NOTIFICATIONS: '/wp-json/custom/notifications'
  }
} as const;

// API 配置
export const API_CONFIG = {
  TIMEOUT: 30000, // 30秒
  RETRY_ATTEMPTS: 3,
  RETRY_DELAY: 1000,
  CACHE_DURATION: {
    DEFAULT: 300, // 5分钟
    POSTS: 600, // 10分钟
    MEDIA: 3600, // 1小时
    STATIC: 86400 // 24小时
  }
} as const;

// 查询参数默认值
export const QUERY_DEFAULTS = {
  PER_PAGE: 10,
  PAGE: 1,
  ORDER: 'desc',
  ORDERBY: 'date',
  CONTEXT: 'view',
  EMBED: true
} as const;

// 错误码
export const ERROR_CODES = {
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  SERVER_ERROR: 500,
  NETWORK_ERROR: 0,
  TIMEOUT: 'ETIMEDOUT'
} as const;
