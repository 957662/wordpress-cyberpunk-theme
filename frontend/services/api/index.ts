/**
 * API 服务统一导出
 */

export { blogService } from './blog-service';
export { socialService } from './social-service';
export { categoriesApi } from './categories';
export { tagsApi } from './tags';
export { postsApi } from './posts';
export { apiClient, ApiClient, ApiError, handleApiError } from './client';

export type {
  BlogSearchParams,
  BlogListResponse,
} from './blog-service';

export type {
  ToggleLikeResponse,
  ToggleBookmarkResponse,
  ToggleFollowResponse,
} from './social-service';

export type {
  Category,
  CategoryListResponse,
  CategoryCreate,
  CategoryUpdate,
} from './categories';

export type {
  Tag,
  TagListResponse,
  TagCreate,
  TagUpdate,
} from './tags';

export type {
  Post,
  PostListResponse,
  PostCreate,
  PostUpdate,
} from './posts';

// 便捷的统一导出
export const api = {
  blog: blogService,
  social: socialService,
  categories: categoriesApi,
  tags: tagsApi,
  posts: postsApi,
};
