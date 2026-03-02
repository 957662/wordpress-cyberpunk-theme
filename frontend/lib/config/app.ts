/**
 * 应用配置
 * 集中管理所有应用级别的配置
 */

import { siteConfig } from './site';

/**
 * 应用信息
 */
export const appConfig = {
  name: 'CyberPress',
  version: '1.0.0',
  description: '赛博朋克风格的博客平台',
  author: 'AI Development Team',
  repository: 'https://github.com/ai-dev-team/cyberpress-platform',
  homepage: 'https://cyberpress.dev',
} as const;

/**
 * API 配置
 */
export const apiConfig = {
  baseURL: process.env.NEXT_PUBLIC_API_URL || '/api',
  timeout: 30000,
  retries: 3,
  endpoints: {
    posts: '/posts',
    categories: '/categories',
    tags: '/tags',
    comments: '/comments',
    media: '/media',
    users: '/users',
    auth: {
      login: '/auth/login',
      logout: '/auth/logout',
      register: '/auth/register',
      refresh: '/auth/refresh',
      forgot: '/auth/forgot-password',
      reset: '/auth/reset-password',
    },
  },
} as const;

/**
 * 缓存配置
 */
export const cacheConfig = {
  defaultTTL: 5 * 60 * 1000, // 5分钟
  maxSize: 100, // 最大缓存条目数
  persistKeys: ['user', 'settings'], // 需要持久化的键
  prefixes: {
    api: 'api_',
    user: 'user_',
    post: 'post_',
  },
} as const;

/**
 * 分页配置
 */
export const paginationConfig = {
  defaultPageSize: 10,
  pageSizeOptions: [5, 10, 20, 50, 100],
  maxPageSize: 100,
} as const;

/**
 * 文件上传配置
 */
export const uploadConfig = {
  maxSize: 10 * 1024 * 1024, // 10MB
  allowedTypes: ['image/jpeg', 'image/png', 'image/gif', 'image/webp'],
  maxImageWidth: 4096,
  maxImageHeight: 4096,
  quality: 0.9,
} as const;

/**
 * 编辑器配置
 */
export const editorConfig = {
  maxLength: 10000,
  minLength: 10,
  allowedTags: [
    'p', 'br', 'strong', 'em', 'u', 's',
    'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
    'ul', 'ol', 'li',
    'a', 'img', 'code', 'pre',
    'blockquote', 'hr',
  ],
  placeholder: '开始写作...',
  autosave: {
    enabled: true,
    interval: 30000, // 30秒
  },
} as const;

/**
 * 搜索配置
 */
export const searchConfig = {
  minLength: 2,
  debounceMs: 300,
  maxResults: 20,
  highlightLength: 200,
} as const;

/**
 * 通知配置
 */
export const notificationConfig = {
  defaultDuration: 4000,
  maxCount: 5,
  position: 'top-right' as const,
  enableSound: false,
} as const;

/**
 * 性能监控配置
 */
export const performanceConfig = {
  enabled: process.env.NODE_ENV === 'production',
  sampleRate: 0.1, // 10%采样率
  thresholds: {
    fcp: 2000, // First Contentful Paint
    lcp: 2500, // Largest Contentful Paint
    fid: 100, // First Input Delay
    cls: 0.1, // Cumulative Layout Shift
    ttfb: 600, // Time to First Byte
  },
} as const;

/**
 * 分析配置
 */
export const analyticsConfig = {
  enabled: process.env.NEXT_PUBLIC_ANALYTICS_ENABLED === 'true',
  trackingId: process.env.NEXT_PUBLIC_ANALYTICS_ID,
  batchSize: 10,
  flushInterval: 30000, // 30秒
  debug: process.env.NODE_ENV === 'development',
} as const;

/**
 * 主题配置
 */
export const themeConfig = {
  defaultTheme: 'dark' as const,
  storageKey: 'cyberpress-theme',
  themes: ['dark', 'light'] as const,
} as const;

/**
 * 安全配置
 */
export const securityConfig = {
  csrf: {
    enabled: true,
    tokenName: 'csrf-token',
  },
  rateLimit: {
    enabled: true,
    maxRequests: 100,
    windowMs: 60000, // 1分钟
  },
  cors: {
    origins: process.env.NEXT_PUBLIC_CORS_ORIGINS?.split(',') || ['http://localhost:3000'],
    credentials: true,
  },
} as const;

/**
 * SEO 配置
 */
export const seoConfig = {
  defaultTitle: siteConfig.name,
  defaultDescription: siteConfig.description,
  defaultImage: '/og-image.png',
  twitterCard: 'summary_large_image',
  openGraph: {
    type: 'website',
    locale: 'zh_CN',
    siteName: siteConfig.name,
  },
} as const;

/**
 * PWA 配置
 */
export const pwaConfig = {
  enabled: true,
  manifest: {
    name: siteConfig.name,
    shortName: 'CyberPress',
    description: siteConfig.description,
    startUrl: '/',
    display: 'standalone',
    background_color: '#0a0a0f',
    theme_color: '#00f0ff',
    icons: [
      {
        src: '/icon-192.png',
        sizes: '192x192',
        type: 'image/png',
      },
      {
        src: '/icon-512.png',
        sizes: '512x512',
        type: 'image/png',
      },
    ],
  },
} as const;

/**
 * 功能开关
 */
export const featureFlags = {
  comments: true,
  search: true,
  analytics: analyticsConfig.enabled,
  pwa: pwaConfig.enabled,
  editor: true,
  notifications: true,
  darkMode: true,
} as const;

/**
 * 环境信息
 */
export const env = {
  isDevelopment: process.env.NODE_ENV === 'development',
  isProduction: process.env.NODE_ENV === 'production',
  isTest: process.env.NODE_ENV === 'test',
  isBrowser: typeof window !== 'undefined',
  isServer: typeof window === 'undefined',
} as const;

/**
 * 导出所有配置
 */
export const config = {
  app: appConfig,
  site: siteConfig,
  api: apiConfig,
  cache: cacheConfig,
  pagination: paginationConfig,
  upload: uploadConfig,
  editor: editorConfig,
  search: searchConfig,
  notification: notificationConfig,
  performance: performanceConfig,
  analytics: analyticsConfig,
  theme: themeConfig,
  security: securityConfig,
  seo: seoConfig,
  pwa: pwaConfig,
  featureFlags,
  env,
} as const;

/**
 * 获取当前环境
 */
export function getEnv(): 'development' | 'production' | 'test' {
  if (env.isProduction) return 'production';
  if (env.isTest) return 'test';
  return 'development';
}

/**
 * 是否启用功能
 */
export function isFeatureEnabled(feature: keyof typeof featureFlags): boolean {
  return featureFlags[feature];
}
