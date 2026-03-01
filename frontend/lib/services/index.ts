/**
 * Services 统一导出
 */

export { wordpressService, default as wordpressService } from './wordpress';
export { cacheService, CACHE_TTL, default as cacheService } from './cache';
export { notificationService, notify, default as notificationService } from './notification';
export { default as analytics } from './analytics';
export { default as auth } from './auth';
export { default as seo } from './seo';

export { apiService, ApiService, ApiError, default as apiService } from './api';
export { storageService, StorageService, default as storageService } from './storage';

// 新创建的服务
export { notificationService, NotificationService } from './notification-service';
export type { Notification, NotificationOptions, NotificationType } from './notification-service';

export { analyticsService, AnalyticsService } from './analytics-service';
export type {
  AnalyticsEvent,
  PageView,
  PerformanceMetrics,
} from './analytics-service';

// 重新导出 search service
export { searchService, SearchService, useSearch } from './search-service';
export type { SearchDocument, SearchResult, SearchOptions, SearchFilters } from './search-service';
