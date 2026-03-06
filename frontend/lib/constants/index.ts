/**
 * CyberPress Platform - 常量定义
 */

export const APP_NAME = 'CyberPress';
export const APP_VERSION = '1.0.0';

export const ROUTES = {
  HOME: '/',
  BLOG: '/blog',
  BLOG_POST: (slug: string) => `/blog/${slug}`,
  PORTFOLIO: '/portfolio',
  ABOUT: '/about',
  CONTACT: '/contact',
  SEARCH: '/search',
  LOGIN: '/auth/login',
  REGISTER: '/auth/register',
  ADMIN: '/admin',
} as const;

export const PAGINATION = {
  DEFAULT_PAGE: 1,
  POSTS_PER_PAGE: 12,
  PORTFOLIOS_PER_PAGE: 9,
  COMMENTS_PER_PAGE: 10,
} as const;

export const CACHE_TIMES = {
  SHORT: 300,
  MEDIUM: 600,
  LONG: 3600,
} as const;

export const STORAGE_KEYS = {
  AUTH_TOKEN: 'auth_token',
  THEME: 'theme',
  BOOKMARKS: 'bookmarks',
} as const;
