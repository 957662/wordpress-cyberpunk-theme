/**
 * CyberPress Platform - 博客配置
 */

/**
 * API 配置
 */
export const API_CONFIG = {
  // 基础 URL
  baseURL: process.env.NEXT_PUBLIC_API_URL || '/api',
  wpURL: process.env.NEXT_PUBLIC_WP_API_URL || 'https://your-wordpress-site.com/wp-json',

  // 超时设置
  timeout: 30000,

  // 重试配置
  retry: {
    maxAttempts: 3,
    delay: 1000,
    backoff: 2,
  },

  // 缓存配置
  cache: {
    enabled: true,
    defaultTimeout: 5 * 60 * 1000, // 5 minutes
    shortTimeout: 1 * 60 * 1000, // 1 minute
    longTimeout: 60 * 60 * 1000, // 1 hour
  },
};

/**
 * 分页配置
 */
export const PAGINATION_CONFIG = {
  defaultPageSize: 10,
  pageSizeOptions: [5, 10, 20, 50],
  maxPageSize: 100,
};

/**
 * 搜索配置
 */
export const SEARCH_CONFIG = {
  minLength: 2,
  debounceTime: 300,
  maxResults: 20,
  highlightEnabled: true,
};

/**
 * 评论配置
 */
export const COMMENT_CONFIG = {
  maxDepth: 3,
  maxLength: 1000,
  allowNested: true,
  autoApprove: false,
  requireEmail: true,
};

/**
 * 阅读配置
 */
export const READING_CONFIG = {
  wordsPerMinute: 200,
  autoSaveProgress: true,
  progressSaveInterval: 5000, // 5 seconds
  enableHistory: true,
};

/**
 * 社交配置
 */
export const SOCIAL_CONFIG = {
  platforms: {
    twitter: {
      name: 'Twitter',
      icon: 'twitter',
      color: '#1DA1F2',
      shareUrl: 'https://twitter.com/intent/tweet',
    },
    facebook: {
      name: 'Facebook',
      icon: 'facebook',
      color: '#4267B2',
      shareUrl: 'https://www.facebook.com/sharer/sharer.php',
    },
    linkedin: {
      name: 'LinkedIn',
      icon: 'linkedin',
      color: '#0077B5',
      shareUrl: 'https://www.linkedin.com/shareArticle',
    },
    weibo: {
      name: 'Weibo',
      icon: 'weibo',
      color: '#E6162D',
      shareUrl: 'https://service.weibo.com/share/share.php',
    },
    wechat: {
      name: 'WeChat',
      icon: 'wechat',
      color: '#07C160',
      shareUrl: '', // WeChat uses QR code
    },
  },
};

/**
 * SEO 配置
 */
export const SEO_CONFIG = {
  defaultTitle: 'CyberPress Platform - 赛博朋克风格博客',
  defaultDescription: '一个现代化的赛博朋克风格博客平台',
  defaultImage: '/images/og-default.jpg',
  siteName: 'CyberPress Platform',
  twitterCard: 'summary_large_image',
};

/**
 * 分析配置
 */
export const ANALYTICS_CONFIG = {
  enabled: process.env.NEXT_PUBLIC_ANALYTICS_ENABLED === 'true',
  gaId: process.env.NEXT_PUBLIC_GA_ID,
  baiduId: process.env.NEXT_PUBLIC_BAIDU_ID,
  trackViews: true,
  trackClicks: true,
  trackScroll: true,
};

/**
 * 性能配置
 */
export const PERFORMANCE_CONFIG = {
  lazyLoadImages: true,
  lazyLoadThreshold: 100,
  preloadImages: true,
  prefetchLinks: true,
  enableServiceWorker: true,
};

/**
 * 主题配置
 */
export const THEME_CONFIG = {
  defaultTheme: 'dark',
  themes: ['light', 'dark', 'cyber'],
  customColors: {
    primary: '#00f0ff',
    secondary: '#9d00ff',
    accent: '#ff0080',
  },
};

/**
 * 导出所有配置
 */
export const CONFIG = {
  api: API_CONFIG,
  pagination: PAGINATION_CONFIG,
  search: SEARCH_CONFIG,
  comment: COMMENT_CONFIG,
  reading: READING_CONFIG,
  social: SOCIAL_CONFIG,
  seo: SEO_CONFIG,
  analytics: ANALYTICS_CONFIG,
  performance: PERFORMANCE_CONFIG,
  theme: THEME_CONFIG,
};
