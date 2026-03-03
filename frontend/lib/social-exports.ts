/**
 * Social Features Export File
 * 社交功能统一导出
 */

// ============================================================================
// Services
// ============================================================================

export { followService } from './services/followService';
export { notificationService } from './services/notification-service';
export { bookmarkService } from './services/bookmark-service';

// ============================================================================
// Hooks
// ============================================================================

export { useSocialFeed } from './hooks/useSocialFeed';
export { useBookmarks } from './hooks/useBookmarks';
export { useNotifications } from './hooks/useNotifications';

// ============================================================================
// Types
// ============================================================================

export type {
  FollowStats,
  UserFollow,
  FollowListResponse,
} from './services/followService';

export type {
  BookmarkItem,
  BookmarkFolder,
  BookmarkStats,
  BookmarksListResponse,
  CreateFolderDto,
  UpdateFolderDto,
} from './services/bookmark-service';

export type {
  NotificationsListResponse,
  NotificationPreferences,
  NotificationStats,
} from './services/notification-service';

export type {
  FeedItem,
  UseSocialFeedOptions,
  UseSocialFeedReturn,
} from './hooks/useSocialFeed';

export type {
  UseBookmarksOptions,
  UseBookmarksReturn,
} from './hooks/useBookmarks';

export type {
  UseNotificationsOptions,
  UseNotificationsReturn,
} from './hooks/useNotifications';

// ============================================================================
// Utilities
// ============================================================================

export {
  formatRelativeTime,
  formatNumber,
  getNotificationIcon,
  getNotificationColor,
  generateNotificationTitle,
  generateNotificationMessage,
  validateUsername,
  validateDisplayName,
  truncateText,
  isOwnContent,
  generateShareLink,
  copyToClipboard,
  downloadFile,
  debounce,
  throttle,
  generateRandomColor,
  isValidUrl,
  extractDomain,
  formatFileSize,
  isMobileDevice,
  getScrollPercentage,
} from './lib/social-utils';

// ============================================================================
// Constants
// ============================================================================

export {
  NOTIFICATION_TYPES,
  ACTIVITY_TYPES,
  FEED_TYPES,
  SOCIAL_STATS_LIMITS,
  PAGINATION_DEFAULTS,
  SOCIAL_ACTIONS,
  RATE_LIMITS,
  VALIDATION_RULES,
  NOTIFICATION_CATEGORIES,
  NOTIFICATION_TYPES_SETTINGS,
  DEFAULT_FOLDER_ICONS,
  DEFAULT_FOLDER_COLORS,
  TIME_FILTERS,
  SORT_OPTIONS,
  PRIVACY_SETTINGS,
  SOCIAL_ERROR_MESSAGES,
  SOCIAL_SUCCESS_MESSAGES,
  ANIMATION_DURATIONS,
  KEYBOARD_SHORTCUTS,
} from './constants/social';

// ============================================================================
// Type Re-exports (from social.types.ts)
// ============================================================================

export type {
  SocialActionType,
  SocialTargetType,
  FollowRelationship,
  FollowUser,
  FollowRequest,
  FollowResponse,
  Like,
  LikeStats,
  LikeResponse,
  Liker,
  Bookmark,
  BookmarkFolder as BookmarkFolderType,
  BookmarkStats as BookmarkStatsType,
  BookmarkResponse as BookmarkResponseType,
  Notification,
  NotificationType,
  NotificationData,
  NotificationPreferences as NotificationPreferencesType,
  NotificationStats as NotificationStatsType,
  Activity,
  ActivityType,
  ActivityFeed,
  UserSocialProfile,
  RelationshipType,
  UserRelationship,
  RelationshipStats,
  FeedType,
  FeedItem as FeedItemType,
  FeedResponse,
  SocialError,
  SocialErrorCode,
  SocialApiResponse,
  SocialApiError,
} from './types/social.types';
