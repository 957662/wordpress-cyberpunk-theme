/**
 * WordPress Configuration
 *
 * Central configuration for WordPress API integration
 */

export interface WordPressConfig {
  baseUrl: string;
  apiVersion: string;
  timeout: number;
  enableCache: boolean;
  cacheTimeout: number;
  enableEmbed: boolean;
}

const config: WordPressConfig = {
  // WordPress site URL
  baseUrl: process.env.NEXT_PUBLIC_WORDPRESS_URL || 'https://your-site.com',
  
  // API version
  apiVersion: process.env.NEXT_PUBLIC_WORDPRESS_API_VERSION || 'wp/v2',
  
  // Request timeout (ms)
  timeout: parseInt(process.env.NEXT_PUBLIC_WORDPRESS_TIMEOUT || '10000'),
  
  // Enable caching
  enableCache: process.env.NEXT_PUBLIC_WORDPRESS_ENABLE_CACHE !== 'false',
  
  // Cache timeout (ms)
  cacheTimeout: parseInt(process.env.NEXT_PUBLIC_WORDPRESS_CACHE_TIMEOUT || '300000'),
  
  // Enable embedding related data
  enableEmbed: process.env.NEXT_PUBLIC_WORDPRESS_ENABLE_EMBED !== 'false',
};

export default config;

// Export individual config values for convenience
export const {
  baseUrl,
  apiVersion,
  timeout,
  enableCache,
  cacheTimeout,
  enableEmbed,
} = config;
