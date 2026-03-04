/**
 * 常量定义
 */

// 分页配置
export const PAGINATION = {
  DEFAULT_PAGE: 1,
  DEFAULT_PAGE_SIZE: 10,
  PAGE_SIZE_OPTIONS: [10, 20, 50, 100],
} as const;

// 路由路径
export const ROUTES = {
  HOME: '/',
  LOGIN: '/auth/login',
  REGISTER: '/auth/register',
  FORGOT_PASSWORD: '/auth/forgot-password',
  RESET_PASSWORD: '/auth/reset-password',
  PROFILE: '/profile',
  SETTINGS: '/settings',
  NOTIFICATIONS: '/notifications',
  MESSAGES: '/messages',
  SEARCH: '/search',
  BLOG: '/blog',
  BLOG_POST: (slug: string) => `/blog/${slug}`,
  CATEGORY: (slug: string) => `/categories/${slug}`,
  TAG: (slug: string) => `/tags/${slug}`,
  AUTHOR: (id: string) => `/authors/${id}`,
  ADMIN: '/admin',
  ADMIN_DASHBOARD: '/admin/dashboard',
  ADMIN_POSTS: '/admin/posts',
  ADMIN_COMMENTS: '/admin/comments',
  ADMIN_USERS: '/admin/users',
  ADMIN_MEDIA: '/admin/media',
  ADMIN_SETTINGS: '/admin/settings',
} as const;

// API 端点
export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
    LOGOUT: '/auth/logout',
    ME: '/auth/me',
    REFRESH: '/auth/refresh',
  },
  POSTS: {
    LIST: '/posts',
    DETAIL: (id: string) => `/posts/${id}`,
    CREATE: '/posts',
    UPDATE: (id: string) => `/posts/${id}`,
    DELETE: (id: string) => `/posts/${id}`,
  },
  COMMENTS: {
    LIST: '/comments',
    CREATE: '/comments',
    DELETE: (id: string) => `/comments/${id}`,
  },
  USERS: {
    LIST: '/users',
    DETAIL: (id: string) => `/users/${id}`,
    FOLLOW: (id: string) => `/users/${id}/follow`,
    UNFOLLOW: (id: string) => `/users/${id}/unfollow`,
  },
} as const;

// 本地存储键名
export const STORAGE_KEYS = {
  AUTH_TOKEN: 'auth_token',
  REFRESH_TOKEN: 'refresh_token',
  USER: 'user',
  THEME: 'theme',
  LANGUAGE: 'language',
  SIDEBAR_COLLAPSED: 'sidebar_collapsed',
  RECENT_SEARCHES: 'recent_searches',
  BOOKMARKS: 'bookmarks',
} as const;

// 主题配置
export const THEMES = {
  LIGHT: 'light',
  DARK: 'dark',
  CYBER: 'cyber',
} as const;

// 语言配置
export const LANGUAGES = {
  'zh-CN': '简体中文',
  'en-US': 'English',
  'ja-JP': '日本語',
} as const;

// 用户角色
export const USER_ROLES = {
  ADMIN: 'admin',
  EDITOR: 'editor',
  AUTHOR: 'author',
  USER: 'user',
  GUEST: 'guest',
} as const;

// 内容状态
export const CONTENT_STATUS = {
  DRAFT: 'draft',
  PUBLISHED: 'published',
  ARCHIVED: 'archived',
  DELETED: 'deleted',
} as const;

// 文件大小限制（字节）
export const FILE_SIZE_LIMITS = {
  AVATAR: 5 * 1024 * 1024, // 5MB
  IMAGE: 10 * 1024 * 1024, // 10MB
  VIDEO: 100 * 1024 * 1024, // 100MB
  DOCUMENT: 20 * 1024 * 1024, // 20MB
} as const;

// 允许的文件类型
export const ALLOWED_FILE_TYPES = {
  IMAGES: ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/svg+xml'],
  VIDEOS: ['video/mp4', 'video/webm', 'video/ogg'],
  DOCUMENTS: [
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/vnd.ms-excel',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  ],
} as const;

// 日期格式
export const DATE_FORMATS = {
  FULL: 'YYYY-MM-DD HH:mm:ss',
  DATE: 'YYYY-MM-DD',
  TIME: 'HH:mm:ss',
  MONTH: 'YYYY-MM',
  YEAR: 'YYYY',
} as const;

// 正则表达式
export const REGEX_PATTERNS = {
  EMAIL: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
  URL: /^https?:\/\/.+/,
  USERNAME: /^[a-zA-Z0-9_-]{3,20}$/,
  PASSWORD: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/,
  PHONE: /^1[3-9]\d{9}$/,
  ID_CARD: /^[1-9]\d{5}(18|19|20)\d{2}(0[1-9]|1[0-2])(0[1-9]|[12]\d|3[01])\d{3}[\dXx]$/,
} as const;

// 动画持续时间（毫秒）
export const ANIMATION_DURATION = {
  FAST: 150,
  NORMAL: 300,
  SLOW: 500,
} as const;

// 防抖延迟（毫秒）
export const DEBOUNCE_DELAYS = {
  FAST: 300,
  NORMAL: 500,
  SLOW: 1000,
} as const;

// Toast 持续时间（毫秒）
export const TOAST_DURATION = {
  SHORT: 2000,
  NORMAL: 3000,
  LONG: 5000,
} as const;
