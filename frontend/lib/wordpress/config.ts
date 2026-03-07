/**
 * WordPress API Configuration
 *
 * Central configuration for WordPress REST API integration
 */

export interface WordPressConfig {
  apiUrl: string;
  baseUrl: string;
  timeout?: number;
  headers?: Record<string, string>;
}

// Default configuration from environment variables
const defaultConfig: WordPressConfig = {
  apiUrl: process.env.NEXT_PUBLIC_WORDPRESS_API_URL ||
          process.env.NEXT_PUBLIC_API_URL ||
          'http://localhost:8000/api/v1',
  baseUrl: process.env.NEXT_PUBLIC_WORDPRESS_URL ||
           process.env.NEXT_PUBLIC_BASE_URL ||
           'http://localhost:8000',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
};

// Export singleton config
export const wpConfig = defaultConfig;

// Helper to get full URL for API endpoints
export function getWPEndpoint(path: string): string {
  const baseUrl = wpConfig.apiUrl.replace(/\/$/, '');
  const endpoint = path.replace(/^\//, '');
  return `${baseUrl}/${endpoint}`;
}

// Helper to get full URL for frontend routes
export function getWPRoute(path: string): string {
  const baseUrl = wpConfig.baseUrl.replace(/\/$/, '');
  const route = path.replace(/^\//, '');
  return `${baseUrl}/${route}`;
}

// WordPress REST API endpoints
export const WPEndpoints = {
  // Posts
  posts: () => getWPEndpoint('posts'),
  post: (id: number | string) => getWPEndpoint(`posts/${id}`),

  // Categories
  categories: () => getWPEndpoint('categories'),
  category: (id: number | string) => getWPEndpoint(`categories/${id}`),

  // Tags
  tags: () => getWPEndpoint('tags'),
  tag: (id: number | string) => getWPEndpoint(`tags/${id}`),

  // Comments
  comments: () => getWPEndpoint('comments'),
  commentsByPost: (postId: number) => getWPEndpoint(`posts/${postId}/comments`),

  // Media
  media: () => getWPEndpoint('media'),
  mediaItem: (id: number) => getWPEndpoint(`media/${id}`),

  // Users
  users: () => getWPEndpoint('users'),
  user: (id: number) => getWPEndpoint(`users/${id}`),

  // Search
  search: () => getWPEndpoint('search'),
} as const;

// Query parameters builder
export function buildQueryParams(params: Record<string, any>): string {
  const searchParams = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      if (Array.isArray(value)) {
        value.forEach(v => searchParams.append(key, String(v)));
      } else {
        searchParams.set(key, String(value));
      }
    }
  });

  const queryString = searchParams.toString();
  return queryString ? `?${queryString}` : '';
}

// Common query parameter types
export interface PostQueryParams {
  page?: number;
  per_page?: number;
  search?: string;
  categories?: number[];
  tags?: number[];
  author?: number;
  orderby?: 'date' | 'relevance' | 'slug' | 'title';
  order?: 'asc' | 'desc';
  sticky?: boolean;
  status?: string;
  _embed?: boolean;
}

export interface CategoryQueryParams {
  page?: number;
  per_page?: number;
  search?: string;
  hide_empty?: boolean;
}

export interface TagQueryParams {
  page?: number;
  per_page?: number;
  search?: string;
  hide_empty?: boolean;
}
