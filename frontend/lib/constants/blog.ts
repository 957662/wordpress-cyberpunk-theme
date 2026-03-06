/**
 * 博客相关的常量配置
 */

/**
 * 分页配置
 */
export const PAGINATION = {
  DEFAULT_PAGE: 1,
  DEFAULT_PER_PAGE: 10,
  MAX_PER_PAGE: 100,
  PER_PAGE_OPTIONS: [10, 20, 30, 50],
} as const;

/**
 * 文章状态
 */
export const POST_STATUS = {
  DRAFT: 'draft',
  PUBLISH: 'publish',
  PENDING: 'pending',
  PRIVATE: 'private',
} as const;

export type PostStatus = typeof POST_STATUS[keyof typeof POST_STATUS];

/**
 * 评论状态
 */
export const COMMENT_STATUS = {
  APPROVED: 'approved',
  PENDING: 'pending',
  SPAM: 'spam',
  TRASH: 'trash',
} as const;

export type CommentStatus = typeof COMMENT_STATUS[keyof typeof COMMENT_STATUS];

/**
 * 排序选项
 */
export const SORT_OPTIONS = {
  DATE_DESC: 'date',
  DATE_ASC: 'date_asc',
  VIEWS: 'views',
  LIKES: 'likes',
  COMMENTS: 'comments',
  TITLE: 'title',
} as const;

export type SortOption = typeof SORT_OPTIONS[keyof typeof SORT_OPTIONS];

/**
 * 阅读时间配置
 */
export const READING_TIME = {
  WORDS_PER_MINUTE: 200,
  WORDS_PER_MINUTE_CN: 400, // 中文阅读速度
} as const;

/**
 * 搜索配置
 */
export const SEARCH = {
  MIN_QUERY_LENGTH: 2,
  DEBOUNCE_MS: 300,
  MAX_RESULTS: 50,
} as const;

/**
 * 社交分享平台
 */
export const SOCIAL_PLATFORMS = {
  TWITTER: 'twitter',
  FACEBOOK: 'facebook',
  LINKEDIN: 'linkedin',
  WEIBO: 'weibo',
  WECHAT: 'wechat',
  QQ: 'qq',
} as const;

export type SocialPlatform = typeof SOCIAL_PLATFORMS[keyof typeof SOCIAL_PLATFORMS];

/**
 * 文章操作类型
 */
export const POST_ACTIONS = {
  LIKE: 'like',
  BOOKMARK: 'bookmark',
  SHARE: 'share',
  COMMENT: 'comment',
} as const;

export type PostAction = typeof POST_ACTIONS[keyof typeof POST_ACTIONS];

/**
 * 通知类型
 */
export const NOTIFICATION_TYPES = {
  COMMENT: 'comment',
  LIKE: 'like',
  FOLLOW: 'follow',
  MENTION: 'mention',
  SYSTEM: 'system',
} as const;

export type NotificationType = typeof NOTIFICATION_TYPES[keyof typeof NOTIFICATION_TYPES];

/**
 * 用户角色
 */
export const USER_ROLES = {
  ADMIN: 'admin',
  EDITOR: 'editor',
  AUTHOR: 'author',
  SUBSCRIBER: 'subscriber',
} as const;

export type UserRole = typeof USER_ROLES[keyof typeof USER_ROLES];

/**
 * 文章元数据
 */
export const POST_META = {
  MIN_TITLE_LENGTH: 5,
  MAX_TITLE_LENGTH: 200,
  MIN_EXCERPT_LENGTH: 50,
  MAX_EXCERPT_LENGTH: 500,
  MIN_CONTENT_LENGTH: 50,
  MAX_CONTENT_LENGTH: 100000,
} as const;

/**
 * 评论限制
 */
export const COMMENT_LIMITS = {
  MIN_LENGTH: 5,
  MAX_LENGTH: 1000,
  MAX_DEPTH: 3,
} as const;

/**
 * 缓存配置
 */
export const CACHE_CONFIG = {
  POSTS: 5 * 60 * 1000, // 5分钟
  POST: 10 * 60 * 1000, // 10分钟
  CATEGORIES: 30 * 60 * 1000, // 30分钟
  TAGS: 30 * 60 * 1000, // 30分钟
  COMMENTS: 1 * 60 * 1000, // 1分钟
  USER_STATS: 5 * 60 * 1000, // 5分钟
} as const;

/**
 * 动画配置
 */
export const ANIMATION_CONFIG = {
  DURATION: {
    FAST: 0.15,
    NORMAL: 0.3,
    SLOW: 0.5,
  },
  EASING: {
    DEFAULT: [0.4, 0, 0.2, 1],
    IN: [0, 0, 0.2, 1],
    OUT: [0.4, 0, 1, 1],
    IN_OUT: [0.4, 0, 0.2, 1],
  },
} as const;

/**
 * 赛博朋克主题颜色
 */
export const CYBER_COLORS = {
  DARK: '#0a0a0f',
  CYAN: '#00f0ff',
  PURPLE: '#9d00ff',
  PINK: '#ff0080',
  GREEN: '#00ff88',
  YELLOW: '#f0ff00',
  MUTED: '#1a1a2e',
} as const;

/**
 * 响应式断点
 */
export const BREAKPOINTS = {
  SM: 640,
  MD: 768,
  LG: 1024,
  XL: 1280,
  '2XL': 1536,
} as const;

/**
 * 布局配置
 */
export const LAYOUT = {
  HEADER_HEIGHT: 64,
  SIDEBAR_WIDTH: 250,
  CONTENT_MAX_WIDTH: 1200,
  CONTAINER_PADDING: 16,
} as const;

/**
 * API 端点
 */
export const API_ENDPOINTS = {
  POSTS: '/api/posts',
  POST: (id: string | number) => `/api/posts/${id}`,
  CATEGORIES: '/api/categories',
  TAGS: '/api/tags',
  COMMENTS: '/api/comments',
  LIKES: '/api/likes',
  BOOKMARKS: '/api/bookmarks',
  FOLLOWS: '/api/follows',
  SEARCH: '/api/search',
} as const;

/**
 * 错误消息
 */
export const ERROR_MESSAGES = {
  NETWORK_ERROR: '网络连接失败，请检查您的网络设置',
  SERVER_ERROR: '服务器错误，请稍后再试',
  NOT_FOUND: '请求的资源不存在',
  UNAUTHORIZED: '未授权，请先登录',
  FORBIDDEN: '没有权限访问此资源',
  VALIDATION_ERROR: '输入数据验证失败',
  UNKNOWN_ERROR: '未知错误，请稍后再试',
} as const;

/**
 * 成功消息
 */
export const SUCCESS_MESSAGES = {
  COMMENT_ADDED: '评论发表成功',
  COMMENT_DELETED: '评论已删除',
  BOOKMARK_ADDED: '已添加到收藏',
  BOOKMARK_REMOVED: '已取消收藏',
  POST_LIKED: '已点赞',
  POST_UNLIKED: '已取消点赞',
  USER_FOLLOWED: '已关注',
  USER_UNFOLLOWED: '已取消关注',
  SETTINGS_SAVED: '设置已保存',
} as const;
