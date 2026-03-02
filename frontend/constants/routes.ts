/**
 * Routes Constants
 * 应用路由常量定义
 */

export const ROUTES = {
  // 公共路由
  HOME: '/',
  ABOUT: '/about',
  BLOG: '/blog',
  BLOG_POST: (slug: string) => `/blog/${slug}`,
  CONTACT: '/contact',

  // 认证路由
  LOGIN: '/auth/login',
  REGISTER: '/auth/register',
  FORGOT_PASSWORD: '/auth/forgot-password',
  RESET_PASSWORD: '/auth/reset-password',

  // 仪表板路由
  DASHBOARD: '/dashboard',
  DASHBOARD_POSTS: '/dashboard/posts',
  DASHBOARD_POSTS_CREATE: '/dashboard/posts/create',
  DASHBOARD_POSTS_EDIT: (id: string | number) => `/dashboard/posts/${id}/edit`,
  DASHBOARD_USERS: '/dashboard/users',
  DASHBOARD_COMMENTS: '/dashboard/comments',
  DASHBOARD_MEDIA: '/dashboard/media',
  DASHBOARD_SETTINGS: '/dashboard/settings',
  DASHBOARD_ANALYTICS: '/dashboard/analytics',

  // 示例/演示路由
  EXAMPLES: '/examples',
  EXAMPLES_COMPONENTS: '/examples/components',
  EXAMPLES_HOOKS: '/examples/hooks',
  EXAMPLES_UTILITIES: '/examples/utilities',
} as const;

/**
 * 外部链接
 */
export const EXTERNAL_LINKS = {
  GITHUB: 'https://github.com/cyberpress',
  TWITTER: 'https://twitter.com/cyberpress',
  DISCORD: 'https://discord.gg/cyberpress',
  DOCUMENTATION: 'https://docs.cyberpress.com',
} as const;

/**
 * API 端点
 */
export const API_ENDPOINTS = {
  // WordPress API
  WP_POSTS: '/wp/v2/posts',
  WP_PAGES: '/wp/v2/pages',
  WP_CATEGORIES: '/wp/v2/categories',
  WP_TAGS: '/wp/v2/tags',
  WP_MEDIA: '/wp/v2/media',
  WP_USERS: '/wp/v2/users',
  WP_COMMENTS: '/wp/v2/comments',

  // 自定义 API
  AUTH_LOGIN: '/api/auth/login',
  AUTH_LOGOUT: '/api/auth/logout',
  AUTH_REGISTER: '/api/auth/register',
  AUTH_REFRESH: '/api/auth/refresh',

  SEARCH: '/api/search',
  NEWSLETTER: '/api/newsletter',
  CONTACT: '/api/contact',
} as const;
