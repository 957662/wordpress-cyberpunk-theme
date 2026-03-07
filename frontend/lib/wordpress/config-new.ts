/**
 * WordPress REST API Configuration
 *
 * Centralized configuration for WordPress API integration
 */

export interface WordPressConfig {
  baseUrl: string;
  apiVersion: string;
  timeout: number;
  cacheTimeout: number;
  authToken?: string;
  useCache: boolean;
  retryAttempts: number;
  retryDelay: number;
}

const config: WordPressConfig = {
  // WordPress site URL
  baseUrl: process.env.NEXT_PUBLIC_WORDPRESS_URL || 'https://your-site.com',

  // API version
  apiVersion: 'wp-json/wp/v2',

  // Request timeout (ms)
  timeout: 10000,

  // Cache duration (ms) - 5 minutes default
  cacheTimeout: 5 * 60 * 1000,

  // Optional authentication token for private endpoints
  authToken: process.env.WORDPRESS_AUTH_TOKEN,

  // Enable caching
  useCache: process.env.NODE_ENV === 'production',

  // Retry configuration
  retryAttempts: 3,
  retryDelay: 1000,
};

export default config;

/**
 * WordPress endpoint paths
 */
export const WP_ENDPOINTS = {
  posts: '/posts',
  pages: '/pages',
  categories: '/categories',
  tags: '/tags',
  users: '/users',
  media: '/media',
  comments: '/comments',
  search: '/search',
  taxonomies: '/taxonomies',
  types: '/types',
  statuses: '/statuses',
} as const;

/**
 * WordPress post statuses
 */
export const WP_POST_STATUSES = {
  PUBLISH: 'publish',
  DRAFT: 'draft',
  PENDING: 'pending',
  PRIVATE: 'private',
} as const;

/**
 * WordPress post types
 */
export const WP_POST_TYPES = {
  POST: 'post',
  PAGE: 'page',
  PORTFOLIO: 'portfolio',
  PROJECT: 'project',
} as const;

/**
 * WordPress context
 */
export const WP_CONTEXT = {
  VIEW: 'view',
  EMBED: 'embed',
  EDIT: 'edit',
} as const;

/**
 * Default query parameters
 */
export const DEFAULT_QUERY_PARAMS = {
  per_page: 10,
  page: 1,
  _embed: true,
  context: 'view',
} as const;
