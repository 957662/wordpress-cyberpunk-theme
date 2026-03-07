/**
 * WordPress Library Index
 *
 * Central export point for all WordPress-related utilities
 */

// Client
export { WordPressClient, wordpressClient } from './wordpress-client';
export { default as wordpressClient } from './wordpress-client';
export type {
  WPPost,
  WPCategory,
  WPTag,
  WPUser,
  WPMedia,
  WPComment,
  WPSearchResult,
  WPPostParams,
  WPCategoryParams,
  WPTagParams,
  WPUserParams,
  WPMediaParams,
  WPApiCollectionResponse,
  WPApiResponse,
} from '@/types/wordpress';

// Adapters
export {
  adaptWpPost,
  adaptWpPosts,
  adaptWpCategory,
  adaptWpCategories,
  adaptWpTag,
  adaptWpTags,
  adaptWpUser,
  adaptWpUsers,
  adaptWpMedia,
  adaptWpMediaList,
  adaptPost,
  adaptPosts,
  isWpPost,
  extractPlainText,
  truncateText,
  formatDate,
  calculateReadingTime,
  getFeaturedImageUrl,
} from './adapters';
export type {
  AdaptedPost,
  AdaptedCategory,
  AdaptedTag,
  AdaptedUser,
  AdaptedMedia,
} from './adapters';

// Helpers
export {
  cleanHtml,
  createExcerpt,
  formatTitle,
  getPostUrl,
  getCategoryUrl,
  getTagUrl,
  getAuthorUrl,
  getResponsiveSizes,
  getSrcSet,
  generateArticleSchema,
  generateBlogSchema,
  generateMetaDescription,
  generateOpenGraph,
  generateTwitterCard,
  isValidPost,
  filterValidPosts,
  deduplicatePosts,
  sortPostsByDate,
  sortPostsByTitle,
  sortPostsByComments,
  paginateItems,
  getTotalPages,
  getPaginationInfo,
  highlightSearchTerm,
  escapeRegex,
} from './helpers';

// Config
export { default as wordpressConfig } from './config';
export type { WordPressConfig } from './config';
