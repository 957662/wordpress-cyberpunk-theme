/**
 * 全局常量定义
 */

// ============ 路由常量 ============
export const ROUTES = {
  HOME: '/',
  BLOG: '/blog',
  BLOG_POST: (slug: string) => `/blog/${slug}`,
  PORTFOLIO: '/portfolio',
  PORTFOLIO_PROJECT: (slug: string) => `/portfolio/${slug}`,
  ABOUT: '/about',
  CONTACT: '/contact',
  SEARCH: '/search',
  TAGS: '/tags',
  TAG: (slug: string) => `/tags/${slug}`,
  CATEGORIES: '/categories',
  CATEGORY: (slug: string) => `/categories/${slug}`,
  
  // 认证
  LOGIN: '/auth/login',
  REGISTER: '/auth/register',
  FORGOT_PASSWORD: '/auth/forgot-password',
  RESET_PASSWORD: '/auth/reset-password',
  
  // 用户
  PROFILE: '/user/profile',
  SETTINGS: '/user/settings',
  BOOKMARKS: '/user/bookmarks',
  
  // 管理后台
  ADMIN: '/admin',
  ADMIN_POSTS: '/admin/posts',
  ADMIN_MEDIA: '/admin/media',
  ADMIN_COMMENTS: '/admin/comments',
  ADMIN_SETTINGS: '/admin/settings',
} as const;

// ============ API 路由常量 ============
export const API_ROUTES = {
  // 认证
  AUTH: {
    LOGIN: '/api/auth/login',
    REGISTER: '/api/auth/register',
    LOGOUT: '/api/auth/logout',
    REFRESH: '/api/auth/refresh',
    FORGOT_PASSWORD: '/api/auth/forgot-password',
    RESET_PASSWORD: '/api/auth/reset-password',
  },
  
  // 文章
  POSTS: {
    LIST: '/api/posts',
    DETAIL: (id: string | number) => `/api/posts/${id}`,
    CREATE: '/api/posts',
    UPDATE: (id: string | number) => `/api/posts/${id}`,
    DELETE: (id: string | number) => `/api/posts/${id}`,
    LIKE: (id: string | number) => `/api/posts/${id}/like`,
    BOOKMARK: (id: string | number) => `/api/posts/${id}/bookmark`,
  },
  
  // 评论
  COMMENTS: {
    LIST: (postId: string | number) => `/api/posts/${postId}/comments`,
    CREATE: '/api/comments',
    DELETE: (id: string | number) => `/api/comments/${id}`,
  },
  
  // 媒体
  MEDIA: {
    LIST: '/api/media',
    UPLOAD: '/api/media/upload',
    DELETE: (id: string | number) => `/api/media/${id}`,
  },
  
  // 搜索
  SEARCH: '/api/search',
} as const;

// ============ 主题常量 ============
export const THEME = {
  MODES: {
    LIGHT: 'light',
    DARK: 'dark',
    AUTO: 'auto',
  },
  
  COLORS: {
    PRIMARY: '#00f0ff',
    SECONDARY: '#9d00ff',
    ACCENT: '#ff0080',
    SUCCESS: '#00ff88',
    WARNING: '#f0ff00',
    ERROR: '#ff0055',
    INFO: '#00d9ff',
  },
  
  GRADIENTS: {
    CYBER: 'linear-gradient(135deg, #00f0ff 0%, #9d00ff 100%)',
    SUNSET: 'linear-gradient(135deg, #ff0080 0%, #7928ca 100%)',
    OCEAN: 'linear-gradient(135deg, #00f0ff 0%, #0066ff 100%)',
  },
} as const;

// ============ 动画常量 ============
export const ANIMATIONS = {
  DURATION: {
    FAST: 150,
    NORMAL: 300,
    SLOW: 500,
  },
  
  EASING: {
    LINEAR: 'linear',
    EASE: 'ease',
    EASE_IN: 'ease-in',
    EASE_OUT: 'ease-out',
    EASE_IN_OUT: 'ease-in-out',
  },
} as const;

// ============ 断点常量 ============
export const BREAKPOINTS = {
  SM: 640,
  MD: 768,
  LG: 1024,
  XL: 1280,
  '2XL': 1536,
} as const;

// ============ 布局常量 ============
export const LAYOUT = {
  CONTAINER: {
    SM: '640px',
    MD: '768px',
    LG: '1024px',
    XL: '1280px',
    '2XL': '1536px',
  },
  
  HEADER: {
    HEIGHT: '64px',
    HEIGHT_SCROLLING: '56px',
  },
  
  SIDEBAR: {
    WIDTH: '280px',
    WIDTH_COLLAPSED: '64px',
  },
} as const;

// ============ 时间常量 ============
export const TIME = {
  SECOND: 1000,
  MINUTE: 60 * 1000,
  HOUR: 60 * 60 * 1000,
  DAY: 24 * 60 * 60 * 1000,
  WEEK: 7 * 24 * 60 * 60 * 1000,
  MONTH: 30 * 24 * 60 * 60 * 1000,
  YEAR: 365 * 24 * 60 * 60 * 1000,
} as const;

// ============ 文件大小常量 ============
export const FILE_SIZE = {
  KB: 1024,
  MB: 1024 * 1024,
  GB: 1024 * 1024 * 1024,
} as const;

// ============ 正则表达式常量 ============
export const REGEX = {
  EMAIL: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  URL: /^https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)$/,
  PHONE: /^1[3-9]\d{9}$/,
  ID_CARD: /^[1-9]\d{5}(18|19|20)\d{2}((0[1-9])|(1[0-2]))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$/,
  SLUG: /^[a-z0-9-]+$/,
  USERNAME: /^[a-zA-Z0-9_]{3,20}$/,
} as const;

// ============ 错误消息常量 ============
export const ERROR_MESSAGES = {
  NETWORK_ERROR: '网络连接失败，请检查网络设置',
  SERVER_ERROR: '服务器错误，请稍后重试',
  UNAUTHORIZED: '未授权，请先登录',
  FORBIDDEN: '没有权限访问',
  NOT_FOUND: '请求的资源不存在',
  VALIDATION_ERROR: '数据验证失败',
  UNKNOWN_ERROR: '未知错误，请稍后重试',
} as const;

// ============ 成功消息常量 ============
export const SUCCESS_MESSAGES = {
  LOGIN_SUCCESS: '登录成功',
  REGISTER_SUCCESS: '注册成功',
  LOGOUT_SUCCESS: '退出成功',
  UPDATE_SUCCESS: '更新成功',
  DELETE_SUCCESS: '删除成功',
  SAVE_SUCCESS: '保存成功',
  SEND_SUCCESS: '发送成功',
} as const;

// ============ 本地存储键常量 ============
export const STORAGE_KEYS = {
  AUTH_TOKEN: 'cyberpress_token',
  REFRESH_TOKEN: 'cyberpress_refresh_token',
  USER_INFO: 'cyberpress_user',
  THEME: 'cyberpress_theme',
  BOOKMARKS: 'cyberpress_bookmarks',
  READING_HISTORY: 'cyberpress_reading_history',
  PREFERENCES: 'cyberpress_preferences',
} as const;

export default {
  ROUTES,
  API_ROUTES,
  THEME,
  ANIMATIONS,
  BREAKPOINTS,
  LAYOUT,
  TIME,
  FILE_SIZE,
  REGEX,
  ERROR_MESSAGES,
  SUCCESS_MESSAGES,
  STORAGE_KEYS,
};
