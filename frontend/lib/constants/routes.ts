/**
 * 路由常量定义
 */

// 公开路由
export const PUBLIC_ROUTES = {
  HOME: '/',
  ABOUT: '/about',
  BLOG: '/blog',
  BLOG_POST: (slug: string) => `/blog/${slug}`,
  PORTFOLIO: '/portfolio',
  PROJECT: (slug: string) => `/portfolio/${slug}`,
  CONTACT: '/contact',
  SEARCH: '/search',
} as const;

// 认证路由
export const AUTH_ROUTES = {
  LOGIN: '/login',
  REGISTER: '/register',
  FORGOT_PASSWORD: '/forgot-password',
  RESET_PASSWORD: '/reset-password',
} as const;

// 管理后台路由
export const ADMIN_ROUTES = {
  DASHBOARD: '/admin',
  POSTS: '/admin/posts',
  POST_EDIT: (id: string | number) => `/admin/posts/${id}`,
  POST_NEW: '/admin/posts/new',
  PROJECTS: '/admin/projects',
  PROJECT_EDIT: (id: string | number) => `/admin/projects/${id}`,
  PROJECT_NEW: '/admin/projects/new',
  MEDIA: '/admin/media',
  COMMENTS: '/admin/comments',
  SETTINGS: '/admin/settings',
  USERS: '/admin/users',
  ANALYTICS: '/admin/analytics',
} as const;

// API 路由
export const API_ROUTES = {
  // WordPress REST API
  WP_BASE: '/wp-json/wp/v2',
  POSTS: '/wp-json/wp/v2/posts',
  PAGES: '/wp-json/wp/v2/pages',
  CATEGORIES: '/wp-json/wp/v2/categories',
  TAGS: '/wp-json/wp/v2/tags',
  MEDIA: '/wp-json/wp/v2/media',
  COMMENTS: '/wp-json/wp/v2/comments',

  // 自定义 API
  API_BASE: '/api',
  AUTH: '/api/auth',
  SEARCH: '/api/search',
  CONTACT: '/api/contact',
  NEWSLETTER: '/api/newsletter',
} as const;

// 重定向路由
export const REDIRECT_ROUTES = {
  AFTER_LOGIN: ADMIN_ROUTES.DASHBOARD,
  AFTER_LOGOUT: PUBLIC_ROUTES.HOME,
  AFTER_REGISTER: PUBLIC_ROUTES.HOME,
} as const;

// 路由守卫配置
export const ROUTE_GUARDS = {
  PUBLIC: ['/', '/about', '/blog', '/portfolio', '/contact', '/search'],
  AUTH_ONLY: ['/admin'],
  GUEST_ONLY: ['/login', '/register'],
} as const;

export default {
  PUBLIC_ROUTES,
  AUTH_ROUTES,
  ADMIN_ROUTES,
  API_ROUTES,
  REDIRECT_ROUTES,
  ROUTE_GUARDS,
};
