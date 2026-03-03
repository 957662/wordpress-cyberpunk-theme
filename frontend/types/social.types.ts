/**
 * Social Features Type Definitions
 * Complete types for social interactions
 */

// ============================================================================
// Base Types
// ============================================================================

export type SocialActionType = 'follow' | 'unfollow' | 'like' | 'unlike' | 'bookmark' | 'unbookmark';

export type SocialTargetType = 'user' | 'post' | 'comment';

// ============================================================================
// Follow Types
// ============================================================================

export interface FollowRelationship {
  id: string;
  followerId: string;
  followingId: string;
  createdAt: string;
}

export interface FollowStats {
  followersCount: number;
  followingCount: number;
  isFollowing: boolean;
}

export interface FollowUser {
  id: string;
  username: string;
  displayName: string;
  avatar?: string;
  bio?: string;
  verified?: boolean;
  followersCount: number;
  isFollowing: boolean;
  followedAt?: string;
}

export interface FollowRequest {
  userId: string;
}

export interface FollowResponse {
  success: boolean;
  isFollowing: boolean;
  followersCount: number;
}

// ============================================================================
// Like Types
// ============================================================================

export interface Like {
  id: string;
  userId: string;
  targetId: string;
  targetType: 'post' | 'comment';
  createdAt: string;
}

export interface LikeStats {
  likesCount: number;
  isLiked: boolean;
}

export interface LikeResponse {
  success: boolean;
  liked: boolean;
  likesCount: number;
}

export interface Liker {
  id: string;
  username: string;
  displayName: string;
  avatar?: string;
  likedAt: string;
}

// ============================================================================
// Bookmark Types
// ============================================================================

export interface Bookmark {
  id: string;
  userId: string;
  targetId: string;
  targetType: 'post' | 'comment';
  folderId?: string;
  createdAt: string;
}

export interface BookmarkFolder {
  id: string;
  name: string;
  icon?: string;
  color?: string;
  userId: string;
  _count?: {
    bookmarks: number;
  };
  createdAt: string;
  updatedAt: string;
}

export interface BookmarkStats {
  bookmarksCount: number;
  isBookmarked: boolean;
}

export interface BookmarkResponse {
  success: boolean;
  bookmarked: boolean;
  bookmarksCount: number;
}

export interface BookmarkItem {
  id: string;
  targetType: 'post' | 'comment';
  targetId: string;
  createdAt: string;
  folder?: {
    id: string;
    name: string;
  };
  post?: {
    id: string;
    title: string;
    excerpt: string;
    thumbnail?: string;
    author: {
      id: string;
      username: string;
      displayName: string;
      avatar?: string;
    };
    publishedAt: string;
  };
  comment?: {
    id: string;
    content: string;
    author: {
      id: string;
      username: string;
      displayName: string;
      avatar?: string;
    };
    createdAt: string;
  };
}

// ============================================================================
// Notification Types
// ============================================================================

export type NotificationType =
  | 'follow'
  | 'like'
  | 'comment'
  | 'mention'
  | 'reply'
  | 'bookmark'
  | 'system'
  | 'update';

export interface Notification {
  id: string;
  userId: string;
  type: NotificationType;
  title: string;
  message: string;
  data?: NotificationData;
  read: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface NotificationData {
  actorId?: string;
  actorName?: string;
  actorAvatar?: string;
  targetId?: string;
  targetType?: 'post' | 'comment' | 'user';
  targetTitle?: string;
  targetUrl?: string;
  comment?: string;
  folder?: string;
}

export interface NotificationPreferences {
  // Email notifications
  emailFollows: boolean;
  emailLikes: boolean;
  emailComments: boolean;
  emailMentions: boolean;
  emailReplies: boolean;
  emailBookmarks: boolean;
  emailSystem: boolean;

  // Push notifications
  pushFollows: boolean;
  pushLikes: boolean;
  pushComments: boolean;
  pushMentions: boolean;
  pushReplies: boolean;
  pushBookmarks: boolean;
  pushSystem: boolean;

  // In-app notifications
  inAppFollows: boolean;
  inAppLikes: boolean;
  inAppComments: boolean;
  inAppMentions: boolean;
  inAppReplies: boolean;
  inAppBookmarks: boolean;
  inAppSystem: boolean;
}

export interface NotificationStats {
  total: number;
  unread: number;
  read: number;
}

// ============================================================================
// Activity Types
// ============================================================================

export type ActivityType =
  | 'post_created'
  | 'post_updated'
  | 'post_deleted'
  | 'comment_created'
  | 'comment_liked'
  | 'follow'
  | 'like'
  | 'bookmark';

export interface Activity {
  id: string;
  userId: string;
  type: ActivityType;
  actor: {
    id: string;
    username: string;
    displayName: string;
    avatar?: string;
  };
  target?: {
    id: string;
    type: 'post' | 'comment' | 'user';
    title?: string;
    excerpt?: string;
  };
  metadata?: Record<string, any>;
  createdAt: string;
}

export interface ActivityFeed {
  activities: Activity[];
  total: number;
  page: number;
  perPage: number;
  hasMore: boolean;
}

// ============================================================================
// User Profile Extensions
// ============================================================================

export interface UserSocialProfile {
  id: string;
  username: string;
  displayName: string;
  avatar?: string;
  bio?: string;
  location?: string;
  website?: string;
  verified?: boolean;

  // Social stats
  followersCount: number;
  followingCount: number;
  postsCount: number;
  totalLikes?: number;
  totalViews?: number;

  // Social status
  isFollowing?: boolean;
  isBlocked?: boolean;
  isMuted?: boolean;

  // Timestamps
  joinedAt: string;
  lastActiveAt?: string;
}

// ============================================================================
// Relationship Types
// ============================================================================

export type RelationshipType = 'following' | 'followers' | 'blocking' | 'muting';

export interface UserRelationship {
  userId: string;
  type: RelationshipType;
  createdAt: string;
}

export interface RelationshipStats {
  following: number;
  followers: number;
  blocking: number;
  muting: number;
}

// ============================================================================
// Feed Types
// ============================================================================

export type FeedType = 'global' | 'following' | 'personal';

export interface FeedItem {
  id: string;
  type: 'post' | 'comment' | 'like' | 'follow' | 'bookmark';
  actor: {
    id: string;
    username: string;
    displayName: string;
    avatar?: string;
  };
  target?: {
    id: string;
    type: 'post' | 'comment' | 'user';
    title?: string;
    excerpt?: string;
  };
  createdAt: string;
}

export interface FeedResponse {
  items: FeedItem[];
  total: number;
  page: number;
  perPage: number;
  hasMore: boolean;
}

// ============================================================================
// Error Types
// ============================================================================

export interface SocialError {
  code: string;
  message: string;
  type: 'follow_error' | 'like_error' | 'bookmark_error' | 'notification_error';
  details?: Record<string, any>;
}

export type SocialErrorCode =
  | 'ALREADY_FOLLOWING'
  | 'NOT_FOLLOWING'
  | 'CANNOT_FOLLOW_SELF'
  | 'USER_BLOCKED'
  | 'USER_NOT_FOUND'
  | 'ALREADY_LIKED'
  | 'NOT_LIKED'
  | 'ALREADY_BOOKMARKED'
  | 'NOT_BOOKMARKED'
  | 'RATE_LIMIT_EXCEEDED'
  | 'PERMISSION_DENIED';

// ============================================================================
// Request/Response Wrappers
// ============================================================================

export interface SocialApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: SocialError;
  message?: string;
}

export interface SocialApiError {
  success: false;
  error: SocialError;
  message: string;
}
