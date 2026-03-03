/**
 * API Services Index
 * API 服务统一导出
 */

// Cache Service
export { cache } from '../cache';
export type { CacheOptions, CacheData } from '../cache';

// WordPress Service
export { wordpressService } from './wordpress.service';
export type { WordPressPost, WordPressCategory, WordPressTag } from './wordpress.service';

// Notification Service
export { notificationService } from './notification.service';
export type { Notification, NotificationPreferences, NotificationStats } from './notification.service';

// User Service
export { userService } from './user.service';
export type { User, UserProfile, UserStats, UpdateProfileData } from './user.service';

// Search Service
export { searchService } from './search.service';
export type { SearchResult, SearchFilters, SearchSuggestions, SearchHistoryItem, SearchAnalytics } from './search.service';
