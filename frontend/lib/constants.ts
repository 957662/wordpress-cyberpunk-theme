/**
 * 常量定义
 * 集中管理应用中的常量
 */

/**
 * API 相关常量
 */
export const API = {
  BASE_URL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000',
  VERSION: '/api/v1',
  TIMEOUT: 30000,
} as const;

/**
 * 本地存储键名
 */
export const STORAGE_KEYS = {
  ACCESS_TOKEN: 'access_token',
  REFRESH_TOKEN: 'refresh_token',
  USER: 'user',
  THEME: 'theme',
  LANGUAGE: 'language',
  SIDEBAR_COLLAPSED: 'sidebar_collapsed',
} as const;

/**
 * 赛博朋克颜色主题
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
 * 分页常量
 */
export const PAGINATION = {
  DEFAULT_PAGE: 1,
  DEFAULT_PAGE_SIZE: 10,
  PAGE_SIZES: [10, 20, 50, 100],
} as const;

/**
 * 动画持续时间
 */
export const ANIMATION_DURATION = {
  FAST: 150,
  NORMAL: 300,
  SLOW: 500,
} as const;

/**
 * 断点
 */
export const BREAKPOINTS = {
  SM: 640,
  MD: 768,
  LG: 1024,
  XL: 1280,
  '2XL': 1536,
} as const;

/**
 * 正则表达式
 */
export const REGEX = {
  EMAIL: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  URL: /^https?:\/\/[\w\-.]+(:\d+)?(\/[\w\-._~:/?#[\]@!$&'()*+,;=%]*)?$/,
  PHONE: /^1[3-9]\d{9}$/,
  USERNAME: /^[a-zA-Z0-9_]{3,20}$/,
  PASSWORD: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d@$!%*?&]{8,}$/,
} as const;

/**
 * 错误消息
 */
export const ERROR_MESSAGES = {
  NETWORK_ERROR: '网络错误，请检查您的连接',
  UNAUTHORIZED: '未授权，请先登录',
  FORBIDDEN: '没有权限访问此资源',
  NOT_FOUND: '请求的资源不存在',
  SERVER_ERROR: '服务器错误，请稍后再试',
  VALIDATION_ERROR: '输入数据验证失败',
} as const;

/**
 * 成功消息
 */
export const SUCCESS_MESSAGES = {
  CREATED: '创建成功',
  UPDATED: '更新成功',
  DELETED: '删除成功',
  SAVED: '保存成功',
  COPIED: '已复制到剪贴板',
} as const;

/**
 * 日期格式
 */
export const DATE_FORMATS = {
  FULL: 'yyyy年MM月dd日 HH:mm:ss',
  DATE: 'yyyy年MM月dd日',
  TIME: 'HH:mm:ss',
  MONTH: 'yyyy年MM月',
  YEAR: 'yyyy年',
} as const;

/**
 * 文件大小限制
 */
export const FILE_LIMITS = {
  AVATAR_MAX_SIZE: 5 * 1024 * 1024, // 5MB
  IMAGE_MAX_SIZE: 10 * 1024 * 1024, // 10MB
  VIDEO_MAX_SIZE: 100 * 1024 * 1024, // 100MB
} as const;

/**
 * 支持的文件类型
 */
export const FILE_TYPES = {
  IMAGES: ['image/jpeg', 'image/png', 'image/gif', 'image/webp'],
  VIDEOS: ['video/mp4', 'video/webm', 'video/ogg'],
  DOCUMENTS: ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'],
} as const;

/**
 * 阅读时间计算
 */
export const READING_TIME = {
  WORDS_PER_MINUTE: 200, // 平均阅读速度
  MINUTES_PER_IMAGE: 0.5, // 每张图片增加的阅读时间
} as const;

/**
 * 社交链接
 */
export const SOCIAL_LINKS = {
  GITHUB: 'https://github.com/957662/wordpress-cyberpunk-theme',
  EMAIL: 'mailto:2835879683@qq.com',
} as const;

/**
 * 路由路径
 */
export const ROUTES = {
  HOME: '/',
  BLOG: '/blog',
  BLOG_SLUG: (slug: string) => `/blog/${slug}`,
  ABOUT: '/about',
  CONTACT: '/contact',
  LOGIN: '/auth/login',
  REGISTER: '/auth/register',
  DASHBOARD: '/dashboard',
  PROFILE: '/profile',
  SETTINGS: '/settings',
} as const;
