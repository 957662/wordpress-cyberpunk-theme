/**
 * WordPress Integration - Main Export
 *
 * 统一导出所有 WordPress 集成相关的模块
 */

// ============================================================================
// Core API Client
// ============================================================================
export {
  WordPressClient,
  initWordPressClient,
  getWordPressClient,
} from './wordpress-api';

export type {
  WPConfig,
  Post,
  Category,
  Tag,
  Comment,
  User,
  Media,
  PostsParams,
  TaxonomyParams,
} from './wordpress-api';

// ============================================================================
// React Hooks
// ============================================================================
export {
  usePosts,
  usePost,
  usePostBySlug,
  useFeaturedPosts,
  useLatestPosts,
  usePostsByCategory,
  usePostsByTag,
  useSearchPosts,
  useCategories,
  useCategory,
  useCategoriesWithCount,
  useTags,
  useTag,
  usePopularTags,
  useComments,
  useComment,
  useCreateComment,
  useUsers,
  useUser,
  useMedia,
  useMediaItem,
  useSearch,
  useWordPressClient,
} from './react-hooks';

// ============================================================================
// Configuration
// ============================================================================
export {
  initializeWordPress,
  getWordPressConfig as getWPConfig,
  DEFAULT_WP_CONFIG,
  WP_URL,
  WP_API_URL,
} from './wp-config';

// ============================================================================
// Data Adapters
// ============================================================================
export {
  adaptPost,
  adaptPosts,
  adaptPostWithRelated,
  adaptPostsWithRelated,
  adaptCategory,
  adaptCategories,
  adaptTag,
  adaptTags,
  adaptComment,
  adaptComments,
  adaptAuthor,
  adaptAuthors,
  calculateReadingTime,
  formatDate,
  formatRelativeTime,
  extractExcerpt,
  getFeaturedImageUrl,
  extractTaxonomyIds,
} from './data-adapter';

export type {
  BlogPost,
  BlogCategory,
  BlogTag,
  BlogComment,
  BlogAuthor,
} from './data-adapter';

// ============================================================================
// Services
// ============================================================================
export {
  PostService,
  CategoryService,
  TagService,
  CommentService,
  UserService,
} from '../../services/wordpress-service';

// ============================================================================
// Provider
// ============================================================================
export {
  WordPressProvider,
  useWordPress,
  withWordPress,
} from '../../providers/wordpress-provider';

// ============================================================================
// Default Export
// ============================================================================
export { default } from './wordpress-api';
