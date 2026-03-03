/**
 * API Services Index
 * 导出所有API服务
 */

export { WordPressService, default } from './wordpress.service';
export type {
  WPPost,
  WPAuthor,
  WPCategory,
  WPTag,
  WPMedia,
  WPComment,
  WPUser,
  WPQueryParams,
  WPApiResponse,
} from './wordpress.service';

export { cacheService, CacheService } from './cache.service';
