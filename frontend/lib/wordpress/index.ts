/**
 * WordPress 集成模块
 * 统一导出所有 WordPress 相关功能
 */

// Core Client
export { WordPressClient, wpClient } from './client';
export type {
  WPConfig,
  WPArticle,
  WPCategory,
  WPTag,
  WPMedia,
} from './client';

// Integration Layer
export {
  WordPressIntegration,
  createWordPressClient,
  createClientFromEnv,
  getWordPressClient,
} from './wordpress-integration';
export type {
  WordPressConfig,
  WordPressSearchParams,
} from './wordpress-integration';

// React Hooks
export {
  usePosts,
  usePost,
  usePostBySlug,
  useCategories,
  useTags,
  useSearch,
  usePrefetchPost,
  useInvalidatePosts,
} from './hooks';

// Server-Side Client
export {
  getServerWordPressClient,
  getServerPosts,
  getServerPost,
  getServerPostBySlug,
  getServerCategories,
  getServerTags,
  getServerSearch,
  generatePostStaticParams,
  generateCategoryStaticParams,
  generateTagStaticParams,
} from './server-client';

// Data Adapters
export {
  adaptWPPostToBlogPost,
  adaptWPPostsToBlogPosts,
  adaptWPCategory,
  adaptWPCategories,
  adaptWPTag,
  adaptWPTags,
  truncateExcerpt,
  extractFirstImage,
  calculateWordCount,
  calculateReadingTime,
} from './adapter';

// Advanced Data Adapters
export {
  adaptWordPressPost,
  adaptWordPressPosts,
  adaptToWordPressPost,
  validateWordPressPost,
  filterValidPosts,
  adaptWPAuthor,
  adaptWPTerm,
  adaptWPMedia,
  extractFeaturedImage,
  extractCategories,
  extractTags,
  extractAuthor,
} from './data-adapters';
export type {
  AuthorInfo,
  TermInfo,
  MediaInfo,
} from './data-adapters';

// Utility Functions
export {
  WordPressUrlUtils,
  WordPressContentUtils,
  WordPressImageUtils,
  WordPressSEOUtils,
  WordPressCacheUtils,
  WordPressValidationUtils,
  WordPressErrorUtils,
  WordPressPerformanceUtils,
} from './utils';
