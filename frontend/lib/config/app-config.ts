/**
 * 应用配置
 * 集中管理应用的所有配置项
 */

export const appConfig = {
  // 应用基本信息
  app: {
    name: 'CyberPress',
    description: '赛博朋克风格的博客平台',
    url: process.env.NEXT_PUBLIC_APP_URL || 'https://cyberpress.com',
    version: process.env.NEXT_PUBLIC_APP_VERSION || '1.0.0',
  },

  // SEO 配置
  seo: {
    defaultTitle: 'CyberPress - 赛博朋克博客平台',
    titleTemplate: '%s | CyberPress',
    description: '基于 Next.js 14 和 WordPress 的现代化博客平台',
    keywords: ['Next.js', 'WordPress', '博客', '赛博朋克', '技术'],
    twitterCard: 'summary_large_image',
    siteName: 'CyberPress',
  },

  // API 配置
  api: {
    baseUrl: process.env.NEXT_PUBLIC_API_URL || '/api',
    wordpressUrl: process.env.NEXT_PUBLIC_WORDPRESS_URL || '',
    timeout: 10000,
    retries: 3,
  },

  // 分页配置
  pagination: {
    postsPerPage: 12,
    commentsPerPage: 10,
  },

  // 图片配置
  images: {
    quality: 80,
    formats: ['image/avif', 'image/webp'],
    sizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    placeholder: 'blur',
    domains: [
      'images.unsplash.com',
      'api.dicebear.com',
      process.env.NEXT_PUBLIC_WORDPRESS_URL || '',
    ].filter(Boolean) as string[],
  },

  // 缓存配置
  cache: {
    defaultTTL: 5 * 60 * 1000, // 5分钟
    longTTL: 60 * 60 * 1000, // 1小时
    shortTTL: 60 * 1000, // 1分钟
  },

  // 性能配置
  performance: {
    enableAnalytics: process.env.NEXT_PUBLIC_ENABLE_ANALYTICS === 'true',
    enablePerformanceMonitoring: process.env.NODE_ENV === 'development',
    enableServiceWorker: process.env.NEXT_PUBLIC_ENABLE_PWA === 'true',
  },

  // 功能开关
  features: {
    enableComments: true,
    enableSearch: true,
    enableTags: true,
    enableCategories: true,
    enableBookmarks: true,
    enableSharing: true,
    enableDarkMode: true,
    enableNotifications: true,
    enableNewsletter: true,
  },

  // 社交媒体配置
  social: {
    github: process.env.NEXT_PUBLIC_GITHUB_URL || '',
    twitter: process.env.NEXT_PUBLIC_TWITTER_URL || '',
    linkedin: process.env.NEXT_PUBLIC_LINKEDIN_URL || '',
    email: process.env.NEXT_PUBLIC_EMAIL || '',
  },

  // 联系信息
  contact: {
    email: 'contact@cyberpress.com',
    support: 'support@cyberpress.com',
    business: 'business@cyberpress.com',
  },

  // 分析配置
  analytics: {
    googleAnalyticsId: process.env.NEXT_PUBLIC_GA_ID || '',
    plausibleDomain: process.env.NEXT_PUBLIC_PLAUSIBLE_DOMAIN || '',
  },

  // 认证配置
  auth: {
    sessionTimeout: 7 * 24 * 60 * 60 * 1000, // 7天
    refreshTokenThreshold: 5 * 60 * 1000, // 5分钟
  },

  // 上传配置
  upload: {
    maxFileSize: 10 * 1024 * 1024, // 10MB
    allowedImageTypes: ['image/jpeg', 'image/png', 'image/webp', 'image/gif'],
    allowedFileTypes: ['application/pdf', 'text/plain', 'application/json'],
  },

  // 通知配置
  notifications: {
    defaultDuration: 3000,
    errorDuration: 5000,
    successDuration: 3000,
  },

  // 主题配置
  theme: {
    defaultTheme: 'dark',
    enableThemeSwitcher: true,
  },

  // 调试配置
  debug: {
    enableDebugMode: process.env.NODE_ENV === 'development',
    enableVerboseLogging: process.env.NODE_ENV === 'development',
    logRequests: process.env.NODE_ENV === 'development',
  },

  // CDN 配置
  cdn: {
    enabled: process.env.NEXT_PUBLIC_CDN_ENABLED === 'true',
    url: process.env.NEXT_PUBLIC_CDN_URL || '',
  },

  // 安全配置
  security: {
    enableCSRF: true,
    enableCSP: true,
    allowedOrigins: [
      process.env.NEXT_PUBLIC_APP_URL || '',
      process.env.NEXT_PUBLIC_WORDPRESS_URL || '',
    ].filter(Boolean),
  },

  // 地图配置（如果需要）
  maps: {
    defaultCenter: {
      lat: 39.9042,
      lng: 116.4074,
    },
    defaultZoom: 13,
  },

  // 广告配置（如果需要）
  ads: {
    enabled: process.env.NEXT_PUBLIC_ADS_ENABLED === 'true',
    adSenseId: process.env.NEXT_PUBLIC_ADSENSE_ID || '',
  },

  // 时区配置
  timezone: 'Asia/Shanghai',
  locale: 'zh-CN',

  // 日期格式
  dateFormat: {
    full: 'yyyy年MM月dd日 HH:mm:ss',
    date: 'yyyy年MM月dd日',
    time: 'HH:mm:ss',
    month: 'yyyy年MM月',
  },
} as const;

export type AppConfig = typeof appConfig;

/**
 * 获取配置值
 */
export function getConfig<K extends keyof AppConfig>(key: K): AppConfig[K] {
  return appConfig[key];
}

/**
 * 检查功能是否启用
 */
export function isFeatureEnabled(feature: keyof AppConfig['features']): boolean {
  return appConfig.features[feature] === true;
}

/**
 * 获取 API URL
 */
export function getApiUrl(path: string = ''): string {
  const baseUrl = appConfig.api.baseUrl.replace(/\/$/, '');
  return `${baseUrl}${path}`;
}

/**
 * 获取 WordPress URL
 */
export function getWordpressUrl(path: string = ''): string {
  const baseUrl = appConfig.api.wordpressUrl.replace(/\/$/, '');
  return `${baseUrl}${path}`;
}

/**
 * 检查是否为开发环境
 */
export function isDevelopment(): boolean {
  return process.env.NODE_ENV === 'development';
}

/**
 * 检查是否为生产环境
 */
export function isProduction(): boolean {
  return process.env.NODE_ENV === 'production';
}

/**
 * 检查是否为测试环境
 */
export function isTest(): boolean {
  return process.env.NODE_ENV === 'test';
}
