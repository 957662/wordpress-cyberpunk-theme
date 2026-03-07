/**
 * WordPress Integration Configuration
 * WordPress 集成配置文件
 */

import { WordpressConfig } from '@/types/wordpress';

/**
 * WordPress API 配置
 */
export const wordpressConfig: WordpressConfig = {
  // WordPress 站点 URL
  baseUrl: process.env.NEXT_PUBLIC_WORDPRESS_URL || 'https://demo.wp-api.org',

  // API 版本
  apiVersion: 'wp-json/wp/v2',

  // 请求超时时间（毫秒）
  timeout: 30000,

  // 缓存配置
  cacheTimeout: 5 * 60 * 1000, // 5分钟

  // 是否启用调试模式
  debug: process.env.NODE_ENV === 'development',

  // 默认查询参数
  defaultParams: {
    per_page: 10,
    page: 1,
    _embed: true, // 包含关联数据
  },

  // 重试配置
  retry: {
    attempts: 3,
    delay: 1000,
  },

  // 认证配置（如果需要）
  auth: {
    enabled: false,
    username: process.env.WORDPRESS_USERNAME,
    password: process.env.WORDPRESS_PASSWORD,
  },
};

/**
 * 内容类型映射
 */
export const contentTypes = {
  post: 'post',
  page: 'page',
  attachment: 'attachment',
  revision: 'revision',
  nav_menu_item: 'nav_menu_item',
};

/**
 * 文章状态映射
 */
export const postStatus = {
  publish: 'publish',
  draft: 'draft',
  pending: 'pending',
  private: 'private',
  future: 'future',
  trash: 'trash',
  autoDraft: 'auto-draft',
  inherit: 'inherit',
};

/**
 * 排序选项
 */
export const orderByOptions = {
  date: 'date',
  relevance: 'relevance',
  id: 'id',
  title: 'title',
  slug: 'slug',
  modified: 'modified',
  author: 'author',
};

/**
 * 图片尺寸配置
 */
export const imageSizes = {
  thumbnail: 'thumbnail',
  medium: 'medium',
  medium_large: 'medium_large',
  large: 'large',
  full: 'full',
};

/**
 * SEO 配置
 */
export const seoConfig = {
  // 默认 Meta 描述
  defaultDescription: 'CyberPress Platform - A modern blog platform built with Next.js and FastAPI',

  // 默认 Open Graph 图片
  defaultOgImage: '/images/og-default.jpg',

  // 站点名称
  siteName: 'CyberPress Platform',

  // Twitter 卡片类型
  twitterCardType: 'summary_large_image',

  // 是否启用结构化数据
  enableStructuredData: true,
};

/**
 * 缓存策略配置
 */
export const cacheStrategy = {
  // 文章缓存时间（秒）
  post: 300, // 5分钟

  // 分类缓存时间（秒）
  category: 900, // 15分钟

  // 标签缓存时间（秒）
  tag: 900, // 15分钟

  // 作者缓存时间（秒）
  author: 1800, // 30分钟

  // 媒体缓存时间（秒）
  media: 3600, // 1小时

  // 搜索结果缓存时间（秒）
  search: 120, // 2分钟
};

/**
 * API 端点配置
 */
export const apiEndpoints = {
  // WordPress 代理端点（通过后端）
  proxy: '/api/v1/wordpress',

  // 直接 WordPress 端点（如果允许 CORS）
  direct: wordpressConfig.baseUrl,

  // 本地缓存端点
  cache: '/api/cache',
};

/**
 * 错误处理配置
 */
export const errorHandling = {
  // 是否显示详细错误信息
  showDetails: process.env.NODE_ENV === 'development',

  // 错误重试次数
  retryAttempts: 3,

  // 重试延迟（毫秒）
  retryDelay: 1000,

  // 超时错误消息
  timeoutMessage: '请求超时，请稍后重试',

  // 网络错误消息
  networkErrorMessage: '网络连接失败，请检查您的网络',

  // 服务器错误消息
  serverErrorMessage: '服务器错误，请稍后重试',
};

/**
 * 性能优化配置
 */
export const performanceConfig = {
  // 是否启用预取
  enablePrefetch: true,

  // 预取延迟（毫秒）
  prefetchDelay: 200,

  // 是否启用懒加载
  enableLazyLoad: true,

  // 图片懒加载阈值（像素）
  imageLazyThreshold: 200,

  // 是否启用代码分割
  enableCodeSplitting: true,

  // 批量请求大小
  batchSize: 10,
};

/**
 * 调试配置
 */
export const debugConfig = {
  // 是否启用请求日志
  logRequests: process.env.NODE_ENV === 'development',

  // 是否启用响应日志
  logResponses: process.env.NODE_ENV === 'development',

  // 是否启用性能监控
  logPerformance: process.env.NODE_ENV === 'development',

  // 日志级别
  logLevel: process.env.NODE_ENV === 'development' ? 'debug' : 'error',
};

/**
 * 导出所有配置
 */
export const config = {
  wordpress: wordpressConfig,
  contentTypes,
  postStatus,
  orderByOptions,
  imageSizes,
  seo: seoConfig,
  cache: cacheStrategy,
  api: apiEndpoints,
  errors: errorHandling,
  performance: performanceConfig,
  debug: debugConfig,
};

export default config;
