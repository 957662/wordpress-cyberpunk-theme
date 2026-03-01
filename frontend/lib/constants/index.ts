/**
 * 全局常量定义
 */

// 分页配置
export const PAGINATION = {
  defaultPageSize: 10,
  pageSizeOptions: [10, 20, 50, 100],
} as const;

// 日期格式
export const DATE_FORMATS = {
  full: 'yyyy年MM月dd日 HH:mm:ss',
  date: 'yyyy年MM月dd日',
  time: 'HH:mm:ss',
  month: 'yyyy年MM月',
  relative: 'relative',
} as const;

// 路由路径
export const ROUTES = {
  home: '/',
  blog: '/blog',
  blogPost: (slug: string) => `/blog/${slug}`,
  portfolio: '/portfolio',
  portfolioItem: (slug: string) => `/portfolio/${slug}`,
  about: '/about',
  contact: '/contact',
  search: '/search',
  admin: '/admin',
  adminPosts: '/admin/posts',
  adminPages: '/admin/pages',
  adminMedia: '/admin/media',
  adminSettings: '/admin/settings',
} as const;

// 文章状态
export const POST_STATUS = {
  publish: 'publish',
  draft: 'draft',
  pending: 'pending',
  future: 'future',
  private: 'private',
} as const;

// 文章格式
export const POST_FORMATS = {
  standard: 'standard',
  aside: 'aside',
  chat: 'chat',
  gallery: 'gallery',
  link: 'link',
  image: 'image',
  quote: 'quote',
  status: 'status',
  video: 'video',
  audio: 'audio',
} as const;

// 社交媒体链接
export const SOCIAL_LINKS = {
  github: 'https://github.com',
  twitter: 'https://twitter.com',
  linkedin: 'https://linkedin.com',
  youtube: 'https://youtube.com',
  instagram: 'https://instagram.com',
  facebook: 'https://facebook.com',
} as const;

// 动画持续时间
export const ANIMATION_DURATION = {
  fast: 150,
  normal: 300,
  slow: 500,
} as const;

// 断点
export const BREAKPOINTS = {
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  '2xl': 1536,
} as const;

// 最大文件大小
export const MAX_FILE_SIZE = {
  image: 5 * 1024 * 1024, // 5MB
  video: 100 * 1024 * 1024, // 100MB
  document: 10 * 1024 * 1024, // 10MB
} as const;

// 支持的图片格式
export const IMAGE_FORMATS = [
  'image/jpeg',
  'image/png',
  'image/gif',
  'image/webp',
  'image/svg+xml',
] as const;

// 支持的视频格式
export const VIDEO_FORMATS = [
  'video/mp4',
  'video/webm',
  'video/ogg',
] as const;

// 缓存时间（秒）
export const CACHE_TIME = {
  short: 60, // 1分钟
  medium: 300, // 5分钟
  long: 3600, // 1小时
  veryLong: 86400, // 1天
} as const;

// Toast 通知持续时间
export const TOAST_DURATION = {
  short: 2000,
  medium: 3000,
  long: 5000,
} as const;

// 正则表达式
export const REGEX = {
  email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  url: /^https?:\/\/.+/,
  slug: /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
  phone: /^1[3-9]\d{9}$/,
} as const;

// 排序选项
export const SORT_OPTIONS = {
  date: 'date',
  title: 'title',
  modified: 'modified',
  popularity: 'popularity',
  random: 'random',
} as const;

// 排序方向
export const SORT_DIRECTION = {
  asc: 'asc',
  desc: 'desc',
} as const;

// 默认元数据
export const DEFAULT_METADATA = {
  title: 'CyberPress - 赛博朋克主题平台',
  description: '一个基于 Next.js 和 WordPress 的赛博朋克主题平台',
  keywords: ['Next.js', 'WordPress', '赛博朋克', '博客'],
  image: '/og-image.jpg',
} as const;

// 错误消息
export const ERROR_MESSAGES = {
  network: '网络错误，请检查您的连接',
  server: '服务器错误，请稍后再试',
  unauthorized: '未授权，请先登录',
  notFound: '请求的资源不存在',
  validation: '表单验证失败',
  upload: '文件上传失败',
} as const;

// 成功消息
export const SUCCESS_MESSAGES = {
  save: '保存成功',
  delete: '删除成功',
  upload: '上传成功',
  submit: '提交成功',
  copy: '复制成功',
  subscribe: '订阅成功',
} as const;

export default {
  PAGINATION,
  DATE_FORMATS,
  ROUTES,
  POST_STATUS,
  POST_FORMATS,
  SOCIAL_LINKS,
  ANIMATION_DURATION,
  BREAKPOINTS,
  MAX_FILE_SIZE,
  IMAGE_FORMATS,
  VIDEO_FORMATS,
  CACHE_TIME,
  TOAST_DURATION,
  REGEX,
  SORT_OPTIONS,
  SORT_DIRECTION,
  DEFAULT_METADATA,
  ERROR_MESSAGES,
  SUCCESS_MESSAGES,
};
