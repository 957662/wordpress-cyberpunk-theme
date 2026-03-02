/**
 * 常量定义
 */

// 分页配置
export const PAGINATION = {
  DEFAULT_PAGE: 1,
  DEFAULT_PER_PAGE: 10,
  MAX_PER_PAGE: 100,
} as const;

// 动画配置
export const ANIMATION = {
  DEFAULT_DURATION: 0.3,
  FAST_DURATION: 0.15,
  SLOW_DURATION: 0.5,
  DEFAULT_EASE: 'easeInOut' as const,
} as const;

// 断点配置
export const BREAKPOINTS = {
  SM: 640,
  MD: 768,
  LG: 1024,
  XL: 1280,
  '2XL': 1536,
} as const;

// Z-index 层级
export const Z_INDEX = {
  DROPDOWN: 1000,
  STICKY: 1020,
  FIXED: 1030,
  MODAL_BACKDROP: 1040,
  MODAL: 1050,
  POPOVER: 1060,
  TOOLTIP: 1070,
} as const;

// 过渡延迟
export const TRANSITION_DELAYS = {
  FAST: 100,
  NORMAL: 200,
  SLOW: 300,
} as const;

// 日期格式
export const DATE_FORMATS = {
  FULL: 'YYYY年MM月DD日 HH:mm',
  DATE: 'YYYY年MM月DD日',
  MONTH: 'YYYY年MM月',
  TIME: 'HH:mm',
} as const;

// 文件大小限制
export const FILE_LIMITS = {
  MAX_IMAGE_SIZE: 5 * 1024 * 1024, // 5MB
  MAX_FILE_SIZE: 10 * 1024 * 1024, // 10MB
  ALLOWED_IMAGE_TYPES: ['image/jpeg', 'image/png', 'image/webp', 'image/gif'],
  ALLOWED_FILE_TYPES: ['.pdf', '.doc', '.docx', '.txt'],
} as const;

// API 配置
export const API_CONFIG = {
  TIMEOUT: 30000,
  RETRY_COUNT: 3,
  RETRY_DELAY: 1000,
} as const;

// 正则表达式
export const REGEX = {
  EMAIL: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  URL: /^https?:\/\/[\w\-.]+(:\d+)?(\/[\w\-./?%&=]*)?$/,
  PHONE: /^1[3-9]\d{9}$/,
  PASSWORD: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/,
} as const;
