/**
 * API 配置
 */

/**
 * API 基础 URL
 */
export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1';

/**
 * CDN 基础 URL
 */
export const CDN_BASE_URL = process.env.NEXT_PUBLIC_CDN_URL || '';

/**
 * 网站 URL
 */
export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';

/**
 * API 端点
 */
export const API_ENDPOINTS = {
  // 认证
  auth: {
    login: '/auth/login',
    register: '/auth/register',
    logout: '/auth/logout',
    refresh: '/auth/refresh',
    me: '/auth/me',
    passwordReset: '/auth/password-reset',
    passwordResetConfirm: '/auth/password-reset/confirm',
    updatePassword: '/auth/password',
  },

  // 文章
  posts: {
    list: '/posts',
    bySlug: (slug: string) => `/posts/slug/${slug}`,
    detail: (id: string) => `/posts/${id}`,
    create: '/posts',
    update: (id: string) => `/posts/${id}`,
    delete: (id: string) => `/posts/${id}`,
    like: (id: string) => `/posts/${id}/like`,
    view: (id: string) => `/posts/${id}/view`,
    related: (id: string) => `/posts/${id}/related`,
    trending: '/posts/trending',
    stats: (id: string) => `/posts/${id}/stats`,
  },

  // 分类
  categories: {
    list: '/categories',
    detail: (id: string) => `/categories/${id}`,
    create: '/categories',
    update: (id: string) => `/categories/${id}`,
    delete: (id: string) => `/categories/${id}`,
  },

  // 标签
  tags: {
    list: '/tags',
    detail: (id: string) => `/tags/${id}`,
    create: '/tags',
    update: (id: string) => `/tags/${id}`,
    delete: (id: string) => `/tags/${id}`,
  },

  // 评论
  comments: {
    list: (postId: string) => `/posts/${postId}/comments`,
    detail: (id: string) => `/comments/${id}`,
    create: (postId: string) => `/posts/${postId}/comments`,
    update: (id: string) => `/comments/${id}`,
    delete: (id: string) => `/comments/${id}`,
    like: (id: string) => `/comments/${id}/like`,
    dislike: (id: string) => `/comments/${id}/dislike`,
    report: (id: string) => `/comments/${id}/report`,
    replies: (id: string) => `/comments/${id}/replies`,
  },

  // 作品集
  projects: {
    list: '/projects',
    detail: (id: string) => `/projects/${id}`,
    create: '/projects',
    update: (id: string) => `/projects/${id}`,
    delete: (id: string) => `/projects/${id}`,
  },

  // 用户
  users: {
    me: '/users/me',
    profile: (id: string) => `/users/${id}`,
    update: '/users/me',
    follow: (id: string) => `/users/${id}/follow`,
    unfollow: (id: string) => `/users/${id}/unfollow`,
    followers: (id: string) => `/users/${id}/followers`,
    following: (id: string) => `/users/${id}/following`,
  },

  // 搜索
  search: {
    posts: '/search/posts',
    global: '/search',
  },

  // 订阅
  newsletter: {
    subscribe: '/newsletter/subscribe',
    unsubscribe: '/newsletter/unsubscribe',
  },

  // 媒体
  media: {
    upload: '/media/upload',
    delete: (id: string) => `/media/${id}`,
  },

  // 分析
  analytics: {
    pageview: '/analytics/pageview',
    event: '/analytics/event',
    siteStats: '/analytics/site-stats',
    postStats: (id: string) => `/analytics/posts/${id}`,
    popular: '/analytics/popular',
    online: '/analytics/online',
  },

  // 健康
  health: {
    check: '/health',
    ping: '/ping',
  },
} as const;

/**
 * 默认分页配置
 */
export const DEFAULT_PAGINATION = {
  page: 1,
  pageSize: 10,
  pageSizeOptions: [10, 20, 50, 100],
};

/**
 * 默认排序配置
 */
export const DEFAULT_SORT = {
  sortBy: 'date',
  sortOrder: 'desc' as const,
};

/**
 * 请求超时配置（毫秒）
 */
export const REQUEST_TIMEOUT = {
  default: 30000,
  upload: 120000,
  download: 60000,
};

/**
 * 重试配置
 */
export const RETRY_CONFIG = {
  maxRetries: 3,
  retryDelay: 1000,
  retryableStatusCodes: [408, 429, 500, 502, 503, 504],
};

/**
 * 缓存配置
 */
export const CACHE_CONFIG = {
  defaultTTL: 5 * 60 * 1000, // 5 分钟
  shortTTL: 1 * 60 * 1000, // 1 分钟
  longTTL: 60 * 60 * 1000, // 1 小时
  staleTTL: 10 * 60 * 1000, // 10 分钟
};

/**
 * 上传配置
 */
export const UPLOAD_CONFIG = {
  maxSize: 10 * 1024 * 1024, // 10MB
  allowedTypes: [
    'image/jpeg',
    'image/png',
    'image/gif',
    'image/webp',
    'image/svg+xml',
  ],
  chunkSize: 5 * 1024 * 1024, // 5MB
  maxRetries: 3,
};

/**
 * 节流配置
 */
export const THROTTLE_CONFIG = {
  search: 300,
  scroll: 100,
  resize: 200,
  input: 500,
};

/**
 * 防抖配置
 */
export const DEBOUNCE_CONFIG = {
  search: 300,
  save: 1000,
  resize: 200,
  scroll: 100,
};

/**
 * WebSocket 配置
 */
export const WEBSOCKET_CONFIG = {
  url: process.env.NEXT_PUBLIC_WS_URL || 'ws://localhost:8000/ws',
  reconnectInterval: 5000,
  maxReconnectAttempts: 10,
  heartbeatInterval: 30000,
};

/**
 * 分析配置
 */
export const ANALYTICS_CONFIG = {
  batchSize: 10,
  flushInterval: 30000,
  enableSessionTracking: true,
  enablePageViewTracking: true,
  sessionTimeout: 30 * 60 * 1000, // 30 分钟
};

/**
 * 性能配置
 */
export const PERFORMANCE_CONFIG = {
  enablePrefetch: true,
  enablePreload: true,
  enableImageOptimization: true,
  enableServiceWorker: true,
  lazyLoadThreshold: 100,
};

/**
 * 功能开关
 */
export const FEATURE_FLAGS = {
  comments: true,
  registration: true,
  newsletter: true,
  search: true,
  analytics: true,
  socialShare: true,
  bookmarks: true,
  readingHistory: true,
  darkMode: true,
  pwa: true,
};

/**
 * 社交媒体链接
 */
export const SOCIAL_LINKS = {
  twitter: process.env.NEXT_PUBLIC_TWITTER || '',
  github: process.env.NEXT_PUBLIC_GITHUB || '',
  linkedin: process.env.NEXT_PUBLIC_LINKEDIN || '',
  facebook: process.env.NEXT_PUBLIC_FACEBOOK || '',
  instagram: process.env.NEXT_PUBLIC_INSTAGRAM || '',
  youtube: process.env.NEXT_PUBLIC_YOUTUBE || '',
};
