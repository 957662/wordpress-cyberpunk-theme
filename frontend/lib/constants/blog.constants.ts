/**
 * Blog Constants
 * 博客相关的常量定义
 */

/**
 * 文章状态
 */
export const PostStatus = {
  PUBLISH: 'publish',
  DRAFT: 'draft',
  PENDING: 'pending',
  FUTURE: 'future',
  PRIVATE: 'private',
} as const;

export type PostStatus = typeof PostStatus[keyof typeof PostStatus];

/**
 * 文章格式
 */
export const PostFormat = {
  STANDARD: 'standard',
  ASIDE: 'aside',
  GALLERY: 'gallery',
  LINK: 'link',
  IMAGE: 'image',
  QUOTE: 'quote',
  STATUS: 'status',
  VIDEO: 'video',
  AUDIO: 'audio',
  CHAT: 'chat',
} as const;

export type PostFormat = typeof PostFormat[keyof typeof PostFormat];

/**
 * 文章排序选项
 */
export const PostOrderBy = {
  DATE: 'date',
  TITLE: 'title',
  MODIFIED: 'modified',
  RELEVANCE: 'relevance',
  ID: 'id',
  AUTHOR: 'author',
  COMMENT_COUNT: 'comment_count',
} as const;

export type PostOrderBy = typeof PostOrderBy[keyof typeof PostOrderBy];

/**
 * 排序方向
 */
export const Order = {
  ASC: 'asc',
  DESC: 'desc',
} as const;

export type Order = typeof Order[keyof typeof Order];

/**
 * 分类颜色预设
 */
export const CategoryColors = [
  'from-cyber-cyan to-blue-500',
  'from-cyber-purple to-pink-500',
  'from-cyber-pink to-red-500',
  'from-green-400 to-emerald-500',
  'from-yellow-400 to-orange-500',
  'from-indigo-400 to-purple-500',
  'from-teal-400 to-cyan-500',
  'from-rose-400 to-pink-500',
] as const;

/**
 * 文章列表布局
 */
export const BlogLayout = {
  GRID: 'grid',
  LIST: 'list',
  MAGAZINE: 'magazine',
} as const;

export type BlogLayout = typeof BlogLayout[keyof typeof BlogLayout];

/**
 * 文章卡片变体
 */
export const CardVariant = {
  DEFAULT: 'default',
  COMPACT: 'compact',
  FEATURED: 'featured',
} as const;

export type CardVariant = typeof CardVariant[keyof typeof CardVariant];

/**
 * 每页数量选项
 */
export const PerPageOptions = [6, 10, 12, 20, 50] as const;

/**
 * 默认分页数量
 */
export const DEFAULT_PER_PAGE = 10;

/**
 * 最大分页数量
 */
export const MAX_PER_PAGE = 100;

/**
 * 阅读时间计算
 */
export const WORDS_PER_MINUTE = 200;
export const WORDS_PER_MINUTE_CN = 400; // 中文阅读速度

/**
 * 文章摘要长度
 */
export const EXCERPT_LENGTH = 200;

/**
 * 搜索配置
 */
export const SEARCH_MIN_CHARS = 2;
export const SEARCH_DEBOUNCE_MS = 300;
export const SEARCH_MAX_RESULTS = 50;

/**
 * 缓存时间（毫秒）
 */
export const CACHE_TIME = {
  SHORT: 2 * 60 * 1000, // 2分钟
  MEDIUM: 5 * 60 * 1000, // 5分钟
  LONG: 10 * 60 * 1000, // 10分钟
  VERY_LONG: 30 * 60 * 1000, // 30分钟
  HOUR: 60 * 60 * 1000, // 1小时
} as const;

/**
 * 过期时间（毫秒）
 */
export const STALE_TIME = {
  SHORT: 1 * 60 * 1000, // 1分钟
  MEDIUM: 5 * 60 * 1000, // 5分钟
  LONG: 15 * 60 * 1000, // 15分钟
  VERY_LONG: 30 * 60 * 1000, // 30分钟
} as const;

/**
 * 评论状态
 */
export const CommentStatus = {
  APPROVED: 'approved',
  HOLD: 'hold',
  SPAM: 'spam',
  TRASH: 'trash',
} as const;

export type CommentStatus = typeof CommentStatus[keyof typeof CommentStatus];

/**
 * 用户角色
 */
export const UserRole = {
  ADMINISTRATOR: 'administrator',
  EDITOR: 'editor',
  AUTHOR: 'author',
  CONTRIBUTOR: 'contributor',
  SUBSCRIBER: 'subscriber',
} as const;

export type UserRole = typeof UserRole[keyof typeof UserRole];

/**
 * 社交分享平台
 */
export const SocialPlatforms = {
  TWITTER: 'twitter',
  FACEBOOK: 'facebook',
  LINKEDIN: 'linkedin',
  WHATSAPP: 'whatsapp',
  TELEGRAM: 'telegram',
  WEIBO: 'weibo',
  WECHAT: 'wechat',
  QZONE: 'qzone',
  EMAIL: 'email',
} as const;

export type SocialPlatform = typeof SocialPlatforms[keyof typeof SocialPlatforms];

/**
 * 分享 URL 模板
 */
export const ShareUrlTemplates = {
  [SocialPlatforms.TWITTER]: (url: string, title: string) =>
    `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`,
  [SocialPlatforms.FACEBOOK]: (url: string) =>
    `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
  [SocialPlatforms.LINKEDIN]: (url: string, title: string) =>
    `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}&title=${encodeURIComponent(title)}`,
  [SocialPlatforms.WHATSAPP]: (url: string, title: string) =>
    `https://api.whatsapp.com/send?text=${encodeURIComponent(title)} ${encodeURIComponent(url)}`,
  [SocialPlatforms.TELEGRAM]: (url: string, title: string) =>
    `https://t.me/share/url?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`,
  [SocialPlatforms.WEIBO]: (url: string, title: string) =>
    `https://service.weibo.com/share/share.php?url=${encodeURIComponent(url)}&title=${encodeURIComponent(title)}`,
  [SocialPlatforms.EMAIL]: (url: string, title: string) =>
    `mailto:?subject=${encodeURIComponent(title)}&body=${encodeURIComponent(url)}`,
};

/**
 * 动画配置
 */
export const AnimationDuration = {
  FAST: 0.2,
  NORMAL: 0.4,
  SLOW: 0.6,
} as const;

export const AnimationEasing = {
  EASE: 'ease',
  EASE_IN: 'easeIn',
  EASE_OUT: 'easeOut',
  EASE_IN_OUT: 'easeInOut',
} as const;

/**
 * 响应式断点
 */
export const Breakpoints = {
  SM: 640,
  MD: 768,
  LG: 1024,
  XL: 1280,
  '2XL': 1536,
} as const;

/**
 * 网格列数配置
 */
export const GridColumns = {
  MOBILE: 1,
  TABLET: 2,
  DESKTOP: 3,
  WIDE: 4,
} as const;

/**
 * 导出所有常量
 */
export const BlogConstants = {
  PostStatus,
  PostFormat,
  PostOrderBy,
  Order,
  CategoryColors,
  BlogLayout,
  CardVariant,
  PerPageOptions,
  DEFAULT_PER_PAGE,
  MAX_PER_PAGE,
  WORDS_PER_MINUTE,
  WORDS_PER_MINUTE_CN,
  EXCERPT_LENGTH,
  SEARCH_MIN_CHARS,
  SEARCH_DEBOUNCE_MS,
  SEARCH_MAX_RESULTS,
  CACHE_TIME,
  STALE_TIME,
  CommentStatus,
  UserRole,
  SocialPlatforms,
  ShareUrlTemplates,
  AnimationDuration,
  AnimationEasing,
  Breakpoints,
  GridColumns,
};
