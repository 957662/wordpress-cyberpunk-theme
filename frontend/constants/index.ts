// 站点常量
export const SITE_NAME = 'CyberPress';
export const SITE_DESCRIPTION = '基于 WordPress + Next.js 的赛博朋克风格博客平台';

// API 常量
export const API_BASE_URL = process.env.NEXT_PUBLIC_WORDPRESS_API_URL || '/api';
export const API_TIMEOUT = 10000;

// 分页常量
export const POSTS_PER_PAGE = 10;
export const RELATED_POSTS_COUNT = 4;
export const MAX_PAGES = 10;

// 路由常量
export const ROUTES = {
  HOME: '/',
  BLOG: '/blog',
  BLOG_SLUG: (slug: string) => `/blog/${slug}`,
  PORTFOLIO: '/portfolio',
  ABOUT: '/about',
  CONTACT: '/contact',
  SEARCH: '/search',
  CATEGORY: (slug: string) => `/category/${slug}`,
  TAG: (slug: string) => `/tag/${slug}`,
  AUTHOR: (id: number) => `/author/${id}`,
} as const;

// 社交链接
export const SOCIAL_LINKS = [
  {
    name: 'GitHub',
    href: 'https://github.com/your-username',
    icon: 'Github',
  },
  {
    name: 'Twitter',
    href: 'https://twitter.com/your-username',
    icon: 'Twitter',
  },
  {
    name: 'LinkedIn',
    href: 'https://linkedin.com/in/your-username',
    icon: 'Linkedin',
  },
  {
    name: 'Email',
    href: 'mailto:contact@cyberpress.com',
    icon: 'Mail',
  },
] as const;

// 导航菜单
export const NAV_ITEMS = [
  { name: '首页', href: ROUTES.HOME, icon: 'Home' },
  { name: '博客', href: ROUTES.BLOG, icon: 'BookOpen' },
  { name: '作品集', href: ROUTES.PORTFOLIO, icon: 'Briefcase' },
  { name: '关于', href: ROUTES.ABOUT, icon: 'User' },
] as const;

// 页脚链接
export const FOOTER_LINKS = {
  product: [
    { name: '博客', href: ROUTES.BLOG },
    { name: '作品集', href: ROUTES.PORTFOLIO },
    { name: '关于', href: ROUTES.ABOUT },
  ],
  resources: [
    { name: '文档', href: '/docs' },
    { name: 'API', href: '/api' },
    { name: '支持', href: '/support' },
  ],
  legal: [
    { name: '隐私政策', href: '/privacy' },
    { name: '服务条款', href: '/terms' },
    { name: 'Cookie', href: '/cookies' },
  ],
} as const;

// 日期格式
export const DATE_FORMATS = {
  FULL: 'YYYY年MM月DD日',
  SHORT: 'MM/DD',
  RELATIVE: 'relative',
  ISO: 'YYYY-MM-DD',
} as const;

// 动画配置
export const ANIMATIONS = {
  FADE_IN: {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 },
    transition: { duration: 0.3 },
  },
  SLIDE_UP: {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 },
    transition: { duration: 0.3 },
  },
  SCALE_IN: {
    initial: { opacity: 0, scale: 0.9 },
    animate: { opacity: 1, scale: 1 },
    exit: { opacity: 0, scale: 0.9 },
    transition: { duration: 0.2 },
  },
} as const;

// 颜色主题
export const COLORS = {
  cyan: '#00f0ff',
  purple: '#9d00ff',
  pink: '#ff0080',
  yellow: '#f0ff00',
  dark: '#0a0a0f',
  darker: '#050508',
} as const;

// 断点
export const BREAKPOINTS = {
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  '2xl': 1536,
} as const;

// Z-index 层级
export const Z_INDEX = {
  dropdown: 1000,
  sticky: 1020,
  fixed: 1030,
  modalBackdrop: 1040,
  modal: 1050,
  popover: 1060,
  tooltip: 1070,
} as const;

// 本地存储键
export const STORAGE_KEYS = {
  THEME: 'cyberpress-theme',
  LANGUAGE: 'cyberpress-language',
  SEARCH_HISTORY: 'cyberpress-search-history',
  FAVORITES: 'cyberpress-favorites',
} as const;

// 文件大小限制
export const FILE_LIMITS = {
  AVATAR_MAX_SIZE: 5 * 1024 * 1024, // 5MB
  IMAGE_MAX_SIZE: 10 * 1024 * 1024, // 10MB
} as const;

// 正则表达式
export const PATTERNS = {
  EMAIL: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  URL: /^https?:\/\/[\w\-.]+(:\d+)?(\/[\w\-._~:/?#[\]@!$&'()*+,;=]*)?$/,
  SLUG: /^[a-z0-9-]+$/,
} as const;

// 默认配置
export const DEFAULT_CONFIG = {
  postsPerPage: POSTS_PER_PAGE,
  excerptLength: 150,
  relatedPostsCount: RELATED_POSTS_COUNT,
  enableComments: true,
  enableSearch: true,
} as const;
