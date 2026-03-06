/**
 * 博客相关配置
 */

export const BLOG_CONFIG = {
  // API 配置
  api: {
    baseUrl: process.env.NEXT_PUBLIC_WORDPRESS_API_URL || '',
    timeout: 10000,
    retries: 3,
  },

  // 分页配置
  pagination: {
    defaultPageSize: 10,
    pageSizeOptions: [5, 10, 20, 50],
    maxVisiblePages: 7,
  },

  // 文章配置
  article: {
    excerptLength: 150,
    titleMaxLength: 100,
    relatedPostsLimit: 4,
    latestPostsLimit: 5,
    popularPostsLimit: 5,
  },

  // 读取进度配置
  readingProgress: {
    enabled: true,
    updateInterval: 100, // 毫秒
    showPercentage: true,
  },

  // 评论配置
  comments: {
    enabled: true,
    maxDepth: 3,
    defaultPageSize: 10,
    allowAnonymous: false,
    moderationRequired: true,
  },

  // 搜索配置
  search: {
    debounceDelay: 500,
    minQueryLength: 2,
    maxResults: 10,
  },

  // 缓存配置
  cache: {
    enabled: true,
    ttl: 5 * 60 * 1000, // 5分钟
    maxSize: 100, // 最大缓存条目数
  },

  // 社交分享配置
  socialShare: {
    platforms: ['twitter', 'facebook', 'linkedin', 'weibo', 'wechat', 'email'],
    showCount: true,
  },

  // SEO 配置
  seo: {
    defaultTitle: 'CyberPress Blog',
    defaultDescription: '探索最新技术文章和见解',
    defaultImage: '/images/og-default.jpg',
    twitterCard: 'summary_large_image',
  },

  // 日期格式配置
  dateFormat: {
    full: 'YYYY年MM月DD日 HH:mm',
    date: 'YYYY年MM月DD日',
    month: 'YYYY年MM月',
    time: 'HH:mm',
  },

  // 懒加载配置
  lazyLoad: {
    enabled: true,
    threshold: 0.1,
    rootMargin: '50px',
  },
} as const;

// 分类配置
export const CATEGORY_CONFIG = {
  defaultPageSize: 20,
  showEmpty: false,
  showCount: true,
};

// 标签配置
export const TAG_CONFIG = {
  defaultPageSize: 50,
  showEmpty: false,
  showCount: true,
  minFontSize: 12,
  maxFontSize: 24,
};

// 作者配置
export const AUTHOR_CONFIG = {
  defaultPageSize: 10,
  showBio: true,
  showAvatar: true,
  showStats: true,
};

// 导出所有配置
export const CONFIG = {
  blog: BLOG_CONFIG,
  category: CATEGORY_CONFIG,
  tag: TAG_CONFIG,
  author: AUTHOR_CONFIG,
} as const;
