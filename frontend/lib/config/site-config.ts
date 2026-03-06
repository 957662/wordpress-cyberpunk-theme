/**
 * Site Configuration - 网站配置文件
 *
 * 集中管理网站的全局配置
 */

export const siteConfig = {
  /**
   * 网站基本信息
   */
  name: 'CyberPress Platform',
  description: '基于 FastAPI + Next.js 的赛博朋克风格博客平台',
  url: process.env.NEXT_PUBLIC_SITE_URL || 'https://cyberpress.dev',
  
  /**
   * 作者信息
   */
  author: {
    name: 'CyberPress Team',
    email: '2835879683@qq.com',
    url: 'https://cyberpress.dev',
  },

  /**
   * 社交链接
   */
  social: {
    github: 'https://github.com/957662/wordpress-cyberpunk-theme',
    twitter: '',
    email: 'mailto:2835879683@qq.com',
  },

  /**
   * SEO 配置
   */
  seo: {
    defaultTitle: 'CyberPress - 赛博朋克博客平台',
    titleTemplate: '%s | CyberPress',
    defaultDescription: '基于 FastAPI + Next.js 的赛博朋克风格博客平台',
    keywords: ['cyberpunk', 'blog', 'next.js', 'fastapi', '赛博朋克', '博客'],
    twitterCard: 'summary_large_image',
  },

  /**
   * 功能开关
   */
  features: {
    analytics: process.env.NEXT_PUBLIC_ENABLE_ANALYTICS === 'true',
    comments: process.env.NEXT_PUBLIC_ENABLE_COMMENTS !== 'false',
    search: process.env.NEXT_PUBLIC_ENABLE_SEARCH !== 'false',
    newsletter: process.env.NEXT_PUBLIC_ENABLE_NEWSLETTER === 'true',
    readingProgress: process.env.NEXT_PUBLIC_ENABLE_READING_PROGRESS !== 'false',
    darkMode: true,
    pwa: process.env.NEXT_PUBLIC_ENABLE_PWA === 'true',
  },

  /**
   * API 配置
   */
  api: {
    baseUrl: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000',
    timeout: 30000,
    retryAttempts: 3,
  },

  /**
   * 分页配置
   */
  pagination: {
    defaultPageSize: 10,
    maxPageSize: 100,
  },

  /**
   * 文章配置
   */
  blog: {
    postsPerPage: 10,
    relatedPostsCount: 4,
    recentPostsCount: 5,
    excerptLength: 160,
    readingSpeed: 200, // 每分钟阅读字数
  },

  /**
   * 评论配置
   */
  comments: {
    maxDepth: 3,
    defaultPageSize: 20,
    maxLength: 1000,
    minLength: 1,
  },

  /**
   * 上传配置
   */
  upload: {
    maxSize: 5 * 1024 * 1024, // 5MB
    allowedImageTypes: ['image/jpeg', 'image/png', 'image/gif', 'image/webp'],
    allowedDocumentTypes: ['application/pdf', 'application/msword'],
    maxImages: 10,
  },

  /**
   * 缓存配置
   */
  cache: {
    defaultTTL: 5 * 60 * 1000, // 5分钟
    postListTTL: 10 * 60 * 1000, // 10分钟
    postDetailTTL: 30 * 60 * 1000, // 30分钟
  },

  /**
   * 主题配置
   */
  theme: {
    defaultTheme: 'dark',
    themes: ['light', 'dark', 'cyber'],
  },

  /**
   * 国际化配置
   */
  i18n: {
    defaultLocale: 'zh-CN',
    locales: ['zh-CN', 'en-US'],
  },

  /**
   * 性能配置
   */
  performance: {
    lazyLoadImages: true,
    lazyLoadComponents: true,
    prefetchLinks: true,
    enableCompression: true,
  },

  /**
   * 安全配置
   */
  security: {
    enableCSP: true,
    enableCSRF: true,
    rateLimit: {
      windowMs: 15 * 60 * 1000, // 15分钟
      maxRequests: 100,
    },
  },

  /**
   * 调试配置
   */
  debug: {
    enabled: process.env.NODE_ENV === 'development',
    logLevel: process.env.LOG_LEVEL || 'info',
  },
} as const;

/**
 * 获取完整的页面标题
 */
export function getPageTitle(title?: string): string {
  if (!title) {
    return siteConfig.seo.defaultTitle;
  }

  return `${title} | ${siteConfig.name}`;
}

/**
 * 获取完整的 URL
 */
export function getFullUrl(path: string): string {
  return `${siteConfig.url}${path}`;
}

/**
 * 判断是否为生产环境
 */
export function isProduction(): boolean {
  return process.env.NODE_ENV === 'production';
}

/**
 * 判断是否为开发环境
 */
export function isDevelopment(): boolean {
  return process.env.NODE_ENV === 'development';
}

/**
 * 判断是否为测试环境
 */
export function isTest(): boolean {
  return process.env.NODE_ENV === 'test';
}

export default siteConfig;
