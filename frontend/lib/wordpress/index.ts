/**
 * WordPress 集成模块
 * 统一导出所有 WordPress 相关功能
 */

export { WordPressClient, wpClient } from './client';
export type {
  WPConfig,
  WPArticle,
  WPCategory,
  WPTag,
  WPMedia,
} from './client';

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
