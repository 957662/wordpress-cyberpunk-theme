/**
 * WordPress API Configuration
 */

export const wordpressConfig = {
  // WordPress API base URL
  baseUrl: process.env.NEXT_PUBLIC_WORDPRESS_API_URL || 'https://your-site.com/wp-json',

  // API version
  apiVersion: 'wp/v2',

  // Default per page
  defaultPerPage: 10,

  // Request timeout (ms)
  timeout: 30000,

  // Cache settings
  cache: {
    enabled: true,
    defaultTTL: 5 * 60 * 1000, // 5 minutes
    postsTTL: 5 * 60 * 1000, // 5 minutes
    categoriesTTL: 15 * 60 * 1000, // 15 minutes
    tagsTTL: 15 * 60 * 1000, // 15 minutes
  },

  // Embed settings
  embed: ['wp:featuredmedia', 'wp:term', 'wp:author'],

  // Image sizes
  imageSizes: ['thumbnail', 'medium', 'large', 'full'],

  // Revalidation interval (seconds)
  revalidate: {
    posts: 300, // 5 minutes
    categories: 900, // 15 minutes
    tags: 900, // 15 minutes
    authors: 1800, // 30 minutes
  },
} as const;

export type WordPressConfig = typeof wordpressConfig;

export default wordpressConfig;
