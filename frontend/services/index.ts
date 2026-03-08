/**
 * 服务层导出
 * 统一导出所有服务
 */

// ============ WordPress Services ============
export {
  WordPressClient,
  getWordPressClient,
  wpQueryKeys,
  usePosts,
  usePost,
  usePostBySlug,
  useFeaturedPosts,
  useRecentPosts,
  useCategories,
  useCategory,
  useCategoryPosts,
  useTags,
  useTag,
  useTagPosts,
  useComments,
  usePostComments,
  useMedia,
  useMediaItem,
  useUsers,
  useUser,
  useSearch,
  useCreatePost,
  useUpdatePost,
  useDeletePost,
  useCreateComment,
  useUploadMedia,
  prefetchPost,
  prefetchPostsByCategory,
  useWordPressLoading,
} from './wordpress';

export type {
  WordPressPost,
  WordPressCategory,
  WordPressTag,
  WordPressComment,
  WordPressMedia,
  WordPressUser,
  WordPressErrorResponse,
  WordPressPostsQueryParams,
  WordPressCategoriesQueryParams,
  WordPressTagsQueryParams,
  WordPressCommentsQueryParams,
  LocalizedPost,
  LocalizedCategory,
  LocalizedTag,
  LocalizedComment,
  WordPressPagination,
  WordPressPostsResponse,
  WordPressSearchResult,
  WordPressSearchResponse,
  CreatePostData,
  UpdatePostData,
  CreateCommentData,
  WordPressError,
  WordPressConfig,
} from './wordpress';

// ============ Analytics Service ============
export {
  initAnalytics,
  getAnalytics,
} from './analytics/analytics-service';

export type {
  PageViewEvent,
  EventTracking,
  UserEngagement,
  AnalyticsStats,
  AnalyticsConfig,
} from './analytics/analytics-service';

// ============ AI Analyzer Service ============
export {
  initAIAnalyzer,
  getAIAnalyzer,
} from './ai/ai-analyzer-service';

export type {
  AnalysisResult,
  ContentQuality,
  RelatedContent,
  SEOAnalysis,
  TextGenerationOptions,
} from './ai/ai-analyzer-service';

// ============ Realtime Notification Service ============
export {
  getNotificationService,
} from './realtime/realtime-notification-service';

export type {
  Notification,
  NotificationPreferences,
  NotificationStats,
} from './realtime/realtime-notification-service';

// ============ Cache Service ============
export {
  cache,
  getCached,
  setCached,
  deleteCached,
  clearCache,
  getCacheService,
} from './cache/cache-service';

export type {
  CacheEntry,
  CacheOptions,
  CacheStats,
} from './cache/cache-service';

// ============ Legacy Services ============
export { apiService, APIService } from './api.service';
export { blogService, BlogService } from './blog.service';
