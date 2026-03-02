/**
 * API Constants
 * WordPress REST API endpoints and configurations
 */

export const API_ENDPOINTS = {
  // Posts
  POSTS: '/wp/v2/posts',
  POST: (id: number) => `/wp/v2/posts/${id}`,

  // Pages
  PAGES: '/wp/v2/pages',
  PAGE: (id: number) => `/wp/v2/pages/${id}`,

  // Categories
  CATEGORIES: '/wp/v2/categories',
  CATEGORY: (id: number) => `/wp/v2/categories/${id}`,

  // Tags
  TAGS: '/wp/v2/tags',
  TAG: (id: number) => `/wp/v2/tags/${id}`,

  // Media
  MEDIA: '/wp/v2/media',
  MEDIA_ITEM: (id: number) => `/wp/v2/media/${id}`,

  // Comments
  COMMENTS: '/wp/v2/comments',
  COMMENT: (id: number) => `/wp/v2/comments/${id}`,

  // Users
  USERS: '/wp/v2/users',
  USER: (id: number) => `/wp/v2/users/${id}`,
  USER_ME: '/wp/v2/users/me',

  // Taxonomies
  TAXONOMIES: '/wp/v2/taxonomies',

  // Search
  SEARCH: '/wp/v2/search',

  // Custom Post Types
  PORTFOLIO: '/wp/v2/portfolio',
  PORTFOLIO_ITEM: (id: number) => `/wp/v2/portfolio/${id}`,

  // Authentication (custom endpoints)
  AUTH_LOGIN: '/cyberpress/v1/auth/login',
  AUTH_REGISTER: '/cyberpress/v1/auth/register',
  AUTH_REFRESH: '/cyberpress/v1/auth/refresh',
  AUTH_VERIFY: '/cyberpress/v1/auth/verify',
  AUTH_FORGOT_PASSWORD: '/cyberpress/v1/auth/forgot-password',
  AUTH_RESET_PASSWORD: '/cyberpress/v1/auth/reset-password',

  // Settings
  SETTINGS: '/cyberpress/v1/settings',

  // Analytics
  ANALYTICS: '/cyberpress/v1/analytics',
  ANALYTICS_POSTS: '/cyberpress/v1/analytics/posts',
  ANALYTICS_EVENTS: '/cyberpress/v1/analytics/events',
} as const;

export const API_PARAMS = {
  // Embed
  EMBED: '_embed',

  // Pagination
  PER_PAGE: 'per_page',
  PAGE: 'page',

  // Ordering
  ORDERBY: 'orderby',
  ORDER: 'order',

  // Filtering
  SEARCH: 'search',
  SLUG: 'slug',
  CATEGORIES: 'categories',
  TAGS: 'tags',
  AUTHOR: 'author',
  STATUS: 'status',
  EXCLUDE: 'exclude',
  INCLUDE: 'include',

  // Fields
  FIELDS: '_fields',

  // Context
  CONTEXT: 'context',
} as const;

export const API_DEFAULTS = {
  PER_PAGE: 10,
  PAGE: 1,
  ORDERBY: 'date',
  ORDER: 'desc',
  STATUS: 'publish',
  CONTEXT: 'view',
} as const;

export const QUERY_KEYS = {
  // Posts
  POSTS: 'posts',
  POST: 'post',
  POST_SEARCH: 'post-search',
  RELATED_POSTS: 'related-posts',

  // Pages
  PAGES: 'pages',
  PAGE: 'page',

  // Categories
  CATEGORIES: 'categories',
  CATEGORY: 'category',
  CATEGORY_TREE: 'category-tree',

  // Tags
  TAGS: 'tags',
  TAG: 'tag',
  POPULAR_TAGS: 'popular-tags',

  // Media
  MEDIA: 'media',
  MEDIA_SEARCH: 'media-search',

  // Comments
  COMMENTS: 'comments',
  COMMENT: 'comment',

  // Users
  USERS: 'users',
  USER: 'user',
  USER_ME: 'user-me',

  // Portfolio
  PORTFOLIO: 'portfolio',
  PORTFOLIO_ITEM: 'portfolio-item',

  // Auth
  AUTH: 'auth',
  AUTH_USER: 'auth-user',
  AUTH_TOKEN: 'auth-token',

  // Search
  SEARCH: 'search',
  SEARCH_SUGGESTIONS: 'search-suggestions',

  // Analytics
  ANALYTICS: 'analytics',
  ANALYTICS_STATS: 'analytics-stats',
} as const;

// Cache TTL (in milliseconds)
export const CACHE_TTL = {
  SHORT: 2 * 60 * 1000,      // 2 minutes
  MEDIUM: 5 * 60 * 1000,     // 5 minutes
  LONG: 15 * 60 * 1000,      // 15 minutes
  VERY_LONG: 60 * 60 * 1000, // 1 hour
} as const;

// Stale time (in milliseconds)
export const STALE_TIME = {
  SHORT: 1 * 60 * 1000,      // 1 minute
  MEDIUM: 5 * 60 * 1000,     // 5 minutes
  LONG: 15 * 60 * 1000,      // 15 minutes
  VERY_LONG: 30 * 60 * 1000, // 30 minutes
} as const;

// HTTP Methods
export const HTTP_METHODS = {
  GET: 'GET',
  POST: 'POST',
  PUT: 'PUT',
  PATCH: 'PATCH',
  DELETE: 'DELETE',
} as const;

// Content Types
export const CONTENT_TYPES = {
  JSON: 'application/json',
  FORM_DATA: 'multipart/form-data',
  FORM_URLENCODED: 'application/x-www-form-urlencoded',
} as const;

// Response statuses
export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  NO_CONTENT: 204,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  UNPROCESSABLE_ENTITY: 422,
  TOO_MANY_REQUESTS: 429,
  INTERNAL_SERVER_ERROR: 500,
  BAD_GATEWAY: 502,
  SERVICE_UNAVAILABLE: 503,
} as const;

// Error messages
export const ERROR_MESSAGES = {
  NETWORK_ERROR: 'Network error. Please check your connection.',
  UNAUTHORIZED: 'Authentication required. Please log in.',
  FORBIDDEN: 'You do not have permission to access this resource.',
  NOT_FOUND: 'The requested resource was not found.',
  SERVER_ERROR: 'Server error. Please try again later.',
  VALIDATION_ERROR: 'Invalid input. Please check your data.',
  RATE_LIMIT_EXCEEDED: 'Too many requests. Please try again later.',
  UNKNOWN_ERROR: 'An unknown error occurred.',
} as const;

export const POST_STATUS = {
  PUBLISH: 'publish',
  DRAFT: 'draft',
  PENDING: 'pending',
  PRIVATE: 'private',
  TRASH: 'trash',
  AUTO_DRAFT: 'auto-draft',
  INHERIT: 'inherit',
} as const;

export const POST_ORDERBY = {
  DATE: 'date',
  TITLE: 'title',
  SLUG: 'slug',
  MODIFIED: 'modified',
  AUTHOR: 'author',
  RELEVANCE: 'relevance',
  ID: 'id',
  RAND: 'rand',
} as const;

export const MEDIA_TYPES = {
  IMAGE: 'image',
  FILE: 'file',
  VIDEO: 'video',
} as const;

export const COMMENT_STATUS = {
  APPROVED: 'approved',
  PENDING: 'pending',
  SPAM: 'spam',
  TRASH: 'trash',
} as const;
