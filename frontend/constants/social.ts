/**
 * Social Feature Constants
 * 社交功能相关的常量定义
 */

import type { NotificationType, ActivityType } from '@/types/social.types';

// ============================================================================
// Notification Types
// ============================================================================

export const NOTIFICATION_TYPES: Record<NotificationType, { label: string; icon: string; color: string }> = {
  follow: {
    label: '新粉丝',
    icon: '👥',
    color: 'purple',
  },
  like: {
    label: '点赞',
    icon: '❤️',
    color: 'rose',
  },
  comment: {
    label: '评论',
    icon: '💬',
    color: 'cyan',
  },
  mention: {
    label: '提及',
    icon: '@️',
    color: 'blue',
  },
  reply: {
    label: '回复',
    icon: '↩️',
    color: 'green',
  },
  bookmark: {
    label: '收藏',
    icon: '🔖',
    color: 'amber',
  },
  system: {
    label: '系统',
    icon: '⚙️',
    color: 'slate',
  },
  update: {
    label: '更新',
    icon: '🔄',
    color: 'indigo',
  },
};

// ============================================================================
// Activity Types
// ============================================================================

export const ACTIVITY_TYPES: Record<ActivityType, { label: string; icon: string; color: string }> = {
  post_created: {
    label: '发布文章',
    icon: '📝',
    color: 'cyan',
  },
  post_updated: {
    label: '更新文章',
    icon: '✏️',
    color: 'blue',
  },
  post_deleted: {
    label: '删除文章',
    icon: '🗑️',
    color: 'red',
  },
  comment_created: {
    label: '发表评论',
    icon: '💬',
    color: 'green',
  },
  comment_liked: {
    label: '赞了评论',
    icon: '❤️',
    color: 'pink',
  },
  follow: {
    label: '关注用户',
    icon: '👥',
    color: 'purple',
  },
  like: {
    label: '点赞内容',
    icon: '❤️',
    color: 'rose',
  },
  bookmark: {
    label: '收藏内容',
    icon: '🔖',
    color: 'amber',
  },
};

// ============================================================================
// Feed Types
// ============================================================================

export const FEED_TYPES = {
  following: {
    label: '关注',
    description: '你关注的人的最新动态',
    icon: '👥',
  },
  trending: {
    label: '热门',
    description: '当前最受欢迎的内容',
    icon: '🔥',
  },
  'for-you': {
    label: '推荐',
    description: '根据你的兴趣推荐的内容',
    icon: '✨',
  },
} as const;

// ============================================================================
// Social Stats
// ============================================================================

export const SOCIAL_STATS_LIMITS = {
  MAX_FOLLOWERS: 10000,
  MAX_FOLLOWING: 5000,
  MAX_BOOKMARKS: 5000,
  MAX_NOTIFICATIONS: 1000,
};

// ============================================================================
// Pagination
// ============================================================================

export const PAGINATION_DEFAULTS = {
  PAGE: 1,
  PAGE_SIZE: 20,
  MAX_PAGE_SIZE: 100,
};

// ============================================================================
// Social Actions
// ============================================================================

export const SOCIAL_ACTIONS = {
  FOLLOW: 'follow',
  UNFOLLOW: 'unfollow',
  LIKE: 'like',
  UNLIKE: 'unlike',
  BOOKMARK: 'bookmark',
  UNBOOKMARK: 'unbookmark',
} as const;

// ============================================================================
// Rate Limiting
// ============================================================================

export const RATE_LIMITS = {
  FOLLOW: {
    MAX_PER_HOUR: 50,
    MAX_PER_DAY: 200,
  },
  LIKE: {
    MAX_PER_HOUR: 100,
    MAX_PER_DAY: 500,
  },
  COMMENT: {
    MAX_PER_HOUR: 30,
    MAX_PER_DAY: 100,
  },
  BOOKMARK: {
    MAX_PER_HOUR: 50,
    MAX_PER_DAY: 200,
  },
} as const;

// ============================================================================
// Validation Rules
// ============================================================================

export const VALIDATION_RULES = {
  USERNAME: {
    MIN_LENGTH: 3,
    MAX_LENGTH: 20,
    PATTERN: /^[a-zA-Z0-9_-]+$/,
  },
  DISPLAY_NAME: {
    MIN_LENGTH: 1,
    MAX_LENGTH: 50,
  },
  BIO: {
    MAX_LENGTH: 500,
  },
  LOCATION: {
    MAX_LENGTH: 100,
  },
  WEBSITE: {
    MAX_LENGTH: 200,
    PATTERN: /^https?:\/\/.+/,
  },
  FOLDER_NAME: {
    MIN_LENGTH: 1,
    MAX_LENGTH: 50,
  },
} as const;

// ============================================================================
// Notification Settings
// ============================================================================

export const NOTIFICATION_CATEGORIES = {
  email: {
    label: '邮件通知',
    icon: '📧',
    description: '通过邮件接收通知',
  },
  push: {
    label: '推送通知',
    icon: '🔔',
    description: '接收浏览器推送通知',
  },
  inApp: {
    label: '应用内通知',
    icon: '📱',
    description: '在应用内显示通知',
  },
} as const;

export const NOTIFICATION_TYPES_SETTINGS = [
  {
    key: 'follows',
    label: '关注',
    description: '当有人关注你时',
    icon: '👥',
  },
  {
    key: 'likes',
    label: '点赞',
    description: '当有人赞你的内容时',
    icon: '❤️',
  },
  {
    key: 'comments',
    label: '评论',
    description: '当有人评论你的内容时',
    icon: '💬',
  },
  {
    key: 'mentions',
    label: '提及',
    description: '当有人在评论中提到你时',
    icon: '@️',
  },
  {
    key: 'replies',
    label: '回复',
    description: '当有人回复你的评论时',
    icon: '↩️',
  },
  {
    key: 'bookmarks',
    label: '收藏',
    description: '当有人收藏你的内容时',
    icon: '🔖',
  },
  {
    key: 'system',
    label: '系统',
    description: '系统相关的通知',
    icon: '⚙️',
  },
] as const;

// ============================================================================
// Bookmark Folders
// ============================================================================

export const DEFAULT_FOLDER_ICONS = [
  '📁',
  '📚',
  '🔖',
  '⭐',
  '💼',
  '🎯',
  '📌',
  '🔥',
  '💡',
  '🚀',
];

export const DEFAULT_FOLDER_COLORS = [
  '#6366f1', // indigo
  '#8b5cf6', // violet
  '#a855f7', // purple
  '#d946ef', // fuchsia
  '#ec4899', // pink
  '#f43f5e', // rose
  '#ef4444', // red
  '#f97316', // orange
  '#f59e0b', // amber
  '#eab308', // yellow
  '#84cc16', // lime
  '#22c55e', // green
  '#10b981', // emerald
  '#14b8a6', // teal
  '#06b6d4', // cyan
  '#0ea5e9', // sky
  '#3b82f6', // blue
];

// ============================================================================
// Time Filters
// ============================================================================

export const TIME_FILTERS = {
  all: {
    label: '全部时间',
    value: 'all',
  },
  today: {
    label: '今天',
    value: 'today',
  },
  week: {
    label: '本周',
    value: 'week',
  },
  month: {
    label: '本月',
    value: 'month',
  },
  year: {
    label: '今年',
    value: 'year',
  },
} as const;

// ============================================================================
// Sort Options
// ============================================================================

export const SORT_OPTIONS = {
  recent: {
    label: '最新',
    value: 'recent',
    description: '按时间倒序',
  },
  popular: {
    label: '最受欢迎',
    value: 'popular',
    description: '按点赞数排序',
  },
  trending: {
    label: '热门趋势',
    value: 'trending',
    description: '按近期热度排序',
  },
  oldest: {
    label: '最早',
    value: 'oldest',
    description: '按时间正序',
  },
} as const;

// ============================================================================
// Privacy Settings
// ============================================================================

export const PRIVACY_SETTINGS = {
  PROFILE_VISIBILITY: {
    public: '所有人可见',
    followers: '仅粉丝可见',
    private: '仅自己可见',
  },
  FOLLOW_PREFERENCE: {
    anyone: '任何人都可以关注',
    approval: '需要批准才能关注',
  },
  ACTIVITY_VISIBILITY: {
    public: '公开显示活动',
    private: '隐藏活动',
  },
} as const;

// ============================================================================
// Error Messages
// ============================================================================

export const SOCIAL_ERROR_MESSAGES = {
  ALREADY_FOLLOWING: '你已经关注了该用户',
  NOT_FOLLOWING: '你还没有关注该用户',
  CANNOT_FOLLOW_SELF: '不能关注自己',
  USER_BLOCKED: '该用户已被屏蔽',
  USER_NOT_FOUND: '用户不存在',
  ALREADY_LIKED: '你已经赞过了',
  NOT_LIKED: '你还没有赞',
  ALREADY_BOOKMARKED: '已经收藏过了',
  NOT_BOOKMARKED: '还没有收藏',
  RATE_LIMIT_EXCEEDED: '操作过于频繁，请稍后再试',
  PERMISSION_DENIED: '没有权限执行此操作',
} as const;

// ============================================================================
// Success Messages
// ============================================================================

export const SOCIAL_SUCCESS_MESSAGES = {
  FOLLOW_ADDED: '关注成功',
  FOLLOW_REMOVED: '已取消关注',
  LIKE_ADDED: '点赞成功',
  LIKE_REMOVED: '已取消点赞',
  BOOKMARK_ADDED: '收藏成功',
  BOOKMARK_REMOVED: '已取消收藏',
  NOTIFICATION_READ: '已标记为已读',
  NOTIFICATION_DELETED: '通知已删除',
  PREFERENCES_UPDATED: '设置已更新',
  FOLDER_CREATED: '收藏夹创建成功',
  FOLDER_UPDATED: '收藏夹更新成功',
  FOLDER_DELETED: '收藏夹删除成功',
} as const;

// ============================================================================
// Animation Durations
// ============================================================================

export const ANIMATION_DURATIONS = {
  FAST: 150,
  NORMAL: 200,
  SLOW: 300,
  EXTRA_SLOW: 500,
} as const;

// ============================================================================
// Keyboard Shortcuts
// ============================================================================

export const KEYBOARD_SHORTCUTS = {
  TOGGLE_NOTIFICATIONS: 'Alt+N',
  TOGGLE_BOOKMARKS: 'Alt+B',
  NEW_POST: 'Alt+P',
  SEARCH: 'Alt+S',
  GO_HOME: 'Alt+H',
  GO_PROFILE: 'Alt+U',
} as const;
