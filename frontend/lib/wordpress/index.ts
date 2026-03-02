/**
 * WordPress 模块导出索引
 * 统一导出所有 WordPress 相关的函数、类型和组件
 */

// API 客户端
export {
  WordPressClient,
  initWordPressClient,
  getWordPressClient,
} from './api-client';

export type {
  Post,
  Category,
  Tag,
  Comment,
  Media,
  User,
  WPConfig,
  WPResponse,
} from './api-client';

// React Hooks
export {
  usePosts,
  usePost,
  usePostBySlug,
  useRelatedPosts,
  useCategories,
  useCategory,
  useTags,
  useTag,
  usePopularTags,
  useComments,
  useSubmitComment,
  useFeaturedImage,
  useUploadMedia,
  useUser,
  useCurrentUser,
  useSearch,
  useSearchSuggestions,
  usePagination,
  useCacheManager,
} from './hooks';
