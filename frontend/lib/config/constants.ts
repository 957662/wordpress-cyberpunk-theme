/**
 * Constants - 应用常量配置
 */

// ==================== 站点配置 ====================

export const SITE_NAME = 'CyberPress';
export const SITE_DESCRIPTION = '赛博朋克风格的现代化博客平台';
export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://cyberpress.com';

// ==================== API 配置 ====================

export const API_URL = process.env.NEXT_PUBLIC_API_URL || '/api';
export const API_TIMEOUT = 30000; // 30秒
export const API_VERSION = 'v1';

// ==================== 分页配置 ====================

export const DEFAULT_PAGE_SIZE = 10;
export const MAX_PAGE_SIZE = 100;

// ==================== 日期格式 ====================

export const DATE_FORMAT = 'yyyy-MM-dd';
export const DATE_TIME_FORMAT = 'yyyy-MM-dd HH:mm:ss';
export const FRIENDLY_DATE_FORMAT = 'yyyy年MM月dd日';

// ==================== 文件上传限制 ====================

export const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
export const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
export const ALLOWED_VIDEO_TYPES = ['video/mp4', 'video/webm'];

// ==================== 内容限制 ====================

export const MAX_TITLE_LENGTH = 200;
export const MAX_EXCERPT_LENGTH = 500;
export const MAX_CONTENT_LENGTH = 50000;
export const MAX_COMMENT_LENGTH = 1000;

// ==================== 赛博朋克主题色 ====================

export const CYBER_COLORS = {
  neonCyan: '#00f0ff',
  cyberPurple: '#9d00ff',
  laserPink: '#ff0080',
  voltageYellow: '#f0ff00',
  deepBlack: '#0a0a0f',
  darkGray: '#1a1a2e',
  lightGray: '#4a4a5e',
} as const;

// ==================== 动画配置 ====================

export const ANIMATION_DURATION = {
  fast: 0.2,
  normal: 0.3,
  slow: 0.5,
} as const;

export const ANIMATION_STIFFNESS = 300;
export const ANIMATION_DAMPING = 30;

// ==================== 断点 ====================

export const BREAKPOINTS = {
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  '2xl': 1536,
} as const;

// ==================== 路由 ====================

export const ROUTES = {
  HOME: '/',
  BLOG: '/blog',
  BLOG_POST: (slug: string) => `/blog/${slug}`,
  PORTFOLIO: '/portfolio',
  PORTFOLIO_PROJECT: (slug: string) => `/portfolio/${slug}`,
  ABOUT: '/about',
  CONTACT: '/contact',
  LOGIN: '/login',
  REGISTER: '/register',
  DASHBOARD: '/dashboard',
  SEARCH: '/search',
} as const;

// ==================== 社交链接 ====================

export const SOCIAL_LINKS = {
  github: 'https://github.com',
  twitter: 'https://twitter.com',
  linkedin: 'https://linkedin.com',
  email: 'mailto:hello@cyberpress.com',
} as const;

// ==================== 缓存配置 ====================

export const CACHE_KEYS = {
  USER: 'user',
  POSTS: 'posts',
  POST: (id: number) => `post-${id}`,
  CATEGORIES: 'categories',
  TAGS: 'tags',
  PORTFOLIO: 'portfolio',
} as const;

export const CACHE_TTL = {
  SHORT: 5 * 60 * 1000, // 5分钟
  MEDIUM: 15 * 60 * 1000, // 15分钟
  LONG: 60 * 60 * 1000, // 1小时
  VERY_LONG: 24 * 60 * 60 * 1000, // 24小时
} as const;

// ==================== 正则表达式 ====================

export const REGEX = {
  EMAIL: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  USERNAME: /^[a-zA-Z0-9_]{3,20}$/,
  URL: /^https?:\/\/.+/,
  SLUG: /^[a-z0-9-]+$/,
} as const;

// ==================== 错误消息 ====================

export const ERROR_MESSAGES = {
  NETWORK_ERROR: '网络错误，请检查您的连接',
  SERVER_ERROR: '服务器错误，请稍后重试',
  UNAUTHORIZED: '未授权，请先登录',
  FORBIDDEN: '您没有权限执行此操作',
  NOT_FOUND: '请求的资源不存在',
  VALIDATION_ERROR: '输入的数据格式不正确',
  UNKNOWN_ERROR: '发生未知错误',
} as const;

// ==================== 成功消息 ====================

export const SUCCESS_MESSAGES = {
  LOGIN: '登录成功',
  LOGOUT: '已退出登录',
  REGISTER: '注册成功',
  UPDATE_PROFILE: '个人信息已更新',
  CREATE_POST: '文章已创建',
  UPDATE_POST: '文章已更新',
  DELETE_POST: '文章已删除',
  CREATE_COMMENT: '评论已发布',
  DELETE_COMMENT: '评论已删除',
} as const;

// ==================== Toast 配置 ====================

export const TOAST_CONFIG = {
  duration: 3000,
  position: 'top-center' as const,
  style: {
    background: '#1a1a2e',
    color: '#fff',
    border: '1px solid #00f0ff',
    borderRadius: '8px',
    padding: '12px 24px',
  },
} as const;

// ==================== 性能配置 ====================

export const PERFORMANCE = {
  DEBOUNCE_DELAY: 300,
  THROTTLE_DELAY: 200,
  INTERSECTION_THRESHOLD: 0.1,
  VIRTUAL_SCROLL_OVERSCAN: 5,
} as const;

// ==================== SEO 配置 ====================

export const SEO = {
  DEFAULT_TITLE: SITE_NAME,
  DEFAULT_DESCRIPTION: SITE_DESCRIPTION,
  DEFAULT_IMAGE: '/og-image.png',
  TWITTER_CARD: 'summary_large_image',
} as const;

// ==================== 功能开关 ====================

export const FEATURES = {
  COMMENTS: true,
  SEARCH: true,
  NEWSLETTER: true,
  ANALYTICS: process.env.NEXT_PUBLIC_ANALYTICS_ENABLED === 'true',
  DARK_MODE: true,
} as const;
