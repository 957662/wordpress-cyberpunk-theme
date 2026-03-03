/**
 * Services - 服务层导出
 * 统一导出所有服务模块
 */

export { AnalyticsService, useAnalytics } from './analytics';
export type {
  AnalyticsEvent,
  PageViewData,
  EventTrackingData,
  StatsData,
  TimeSeriesData,
  PopularPagesData,
  UseAnalyticsOptions,
} from './analytics';

// API Client
export { apiClient } from './api-client';
export type { ApiRequestOptions, ApiResponse } from './api-client';

// Cache
export { cache } from './cache';
export type { CacheOptions, CacheData } from './cache';

// Image service
export { imageService } from './image';
export type {
  ImageOptimizeOptions,
  ImagePlaceholderOptions,
  ImageUploadOptions,
} from './image';
