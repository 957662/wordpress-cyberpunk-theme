/**
 * Application Constants
 *
 * Shared constants used across the application
 */

/**
 * App routes
 */
export const ROUTES = {
  HOME: '/',
  BLOG: '/blog',
  BLOG_POST: (slug: string) => `/blog/${slug}`,
  CATEGORIES: '/categories',
  CATEGORY: (slug: string) => `/categories/${slug}`,
  TAGS: '/tags',
  TAG: (slug: string) => `/tags/${slug}`,
  AUTHOR: (id: string) => `/authors/${id}`,
  ABOUT: '/about',
  CONTACT: '/contact',
  SEARCH: '/search',
  AUTH: {
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
    FORGOT_PASSWORD: '/auth/forgot-password',
    RESET_PASSWORD: '/auth/reset-password',
  },
  DASHBOARD: '/dashboard',
  PROFILE: '/profile',
  SETTINGS: '/settings',
} as const;

/**
 * API endpoints
 */
export const API_ENDPOINTS = {
  BLOG: {
    LIST: '/blog/posts',
    GET: (id: string) => `/blog/posts/${id}`,
    CREATE: '/blog/posts',
    UPDATE: (id: string) => `/blog/posts/${id}`,
    DELETE: (id: string) => `/blog/posts/${id}`,
    LIKE: (id: string) => `/blog/posts/${id}/like`,
    BOOKMARK: (id: string) => `/blog/posts/${id}/bookmark`,
    VIEW: (id: string) => `/blog/posts/${id}/view`,
    RELATED: (id: string) => `/blog/posts/${id}/related`,
    FEATURED: '/blog/posts/featured',
  },
  AUTH: {
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
    LOGOUT: '/auth/logout',
    REFRESH: '/auth/refresh',
    FORGOT_PASSWORD: '/auth/forgot-password',
    RESET_PASSWORD: '/auth/reset-password',
  },
  USER: {
    PROFILE: '/user/profile',
    SETTINGS: '/user/settings',
    NOTIFICATIONS: '/user/notifications',
  },
} as const;

/**
 * LocalStorage keys
 */
export const STORAGE_KEYS = {
  AUTH_TOKEN: 'auth_token',
  REFRESH_TOKEN: 'refresh_token',
  USER_PREFERENCES: 'user_preferences',
  THEME: 'theme',
  BOOKMARKS: 'bookmarks',
  READING_HISTORY: 'reading_history',
  SEARCH_HISTORY: 'search_history',
} as const;

/**
 * Theme modes
 */
export const THEMES = {
  LIGHT: 'light',
  DARK: 'dark',
  SYSTEM: 'system',
} as const;

/**
 * Date formats
 */
export const DATE_FORMATS = {
  FULL: 'YYYY年MM月DD日 HH:mm',
  DATE: 'YYYY年MM月DD日',
  TIME: 'HH:mm',
  SHORT: 'YYYY-MM-DD',
  RELATIVE: 'relative',
} as const;

/**
 * Post statuses
 */
export const POST_STATUS = {
  DRAFT: 'draft',
  PUBLISHED: 'published',
  ARCHIVED: 'archived',
} as const;

/**
 * User roles
 */
export const USER_ROLES = {
  ADMIN: 'admin',
  EDITOR: 'editor',
  AUTHOR: 'author',
  SUBSCRIBER: 'subscriber',
} as const;

/**
 * Pagination
 */
export const PAGINATION = {
  DEFAULT_PAGE_SIZE: 10,
  PAGE_SIZE_OPTIONS: [10, 20, 50, 100],
  SIBLING_COUNT: 1,
} as const;

/**
 * Media breakpoints (px)
 */
export const BREAKPOINTS = {
  SM: 640,
  MD: 768,
  LG: 1024,
  XL: 1280,
  '2XL': 1536,
} as const;

/**
 * Animation durations (ms)
 */
export const ANIMATION_DURATION = {
  FAST: 150,
  NORMAL: 300,
  SLOW: 500,
} as const;

/**
 * Debounce delays (ms)
 */
export const DEBOUNCE_DELAY = {
  INPUT: 300,
  SEARCH: 500,
  RESIZE: 200,
  SCROLL: 100,
} as const;

/**
 * File size limits (bytes)
 */
export const FILE_SIZE_LIMITS = {
  AVATAR: 2 * 1024 * 1024, // 2MB
  IMAGE: 5 * 1024 * 1024, // 5MB
  VIDEO: 100 * 1024 * 1024, // 100MB
  DOCUMENT: 10 * 1024 * 1024, // 10MB
} as const;

/**
 * Image formats
 */
export const IMAGE_FORMATS = {
  WEBP: 'image/webp',
  JPEG: 'image/jpeg',
  PNG: 'image/png',
  GIF: 'image/gif',
  SVG: 'image/svg+xml',
} as const;

/**
 * Validation rules
 */
export const VALIDATION = {
  USERNAME: {
    MIN: 3,
    MAX: 20,
    PATTERN: /^[a-zA-Z0-9_-]+$/,
  },
  PASSWORD: {
    MIN: 8,
    MAX: 128,
  },
  EMAIL: {
    PATTERN: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  },
  SLUG: {
    PATTERN: /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
  },
} as const;

/**
 * Sort options
 */
export const SORT_OPTIONS = {
  LATEST: 'latest',
  OLDEST: 'oldest',
  POPULAR: 'popular',
  TRENDING: 'trending',
} as const;

/**
 * Toast durations (ms)
 */
export const TOAST_DURATION = {
  SHORT: 3000,
  NORMAL: 5000,
  LONG: 10000,
} as const;

/**
 * Export all constants
 */
export default {
  ROUTES,
  API_ENDPOINTS,
  STORAGE_KEYS,
  THEMES,
  DATE_FORMATS,
  POST_STATUS,
  USER_ROLES,
  PAGINATION,
  BREAKPOINTS,
  ANIMATION_DURATION,
  DEBOUNCE_DELAY,
  FILE_SIZE_LIMITS,
  IMAGE_FORMATS,
  VALIDATION,
  SORT_OPTIONS,
  TOAST_DURATION,
};
