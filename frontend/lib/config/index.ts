/**
 * 应用配置
 *
 * 集中管理所有配置项，包括环境变量、API 端点、功能开关等
 */

// 站点信息
export const siteConfig = {
  name: 'CyberPress',
  title: 'CyberPress - 赛博朋克博客平台',
  description: '基于 WordPress + Next.js 的现代化赛博朋克风格博客平台',
  url: process.env.NEXT_PUBLIC_SITE_URL || 'https://cyberpress.dev',
  author: 'CyberPress Team',
  keywords: ['blog', 'cyberpunk', 'technology', 'wordpress', 'nextjs'],
  locale: 'zh_CN',
  ogImage: '/og-image.svg',
};

// API 配置
export const apiConfig = {
  baseURL: process.env.NEXT_PUBLIC_API_URL || '/api',
  wordpressURL: process.env.WORDPRESS_API_URL || 'https://api.cyberpress.dev/wp-json',
  timeout: 30000,
  retries: 3,
  retryDelay: 1000,
};

// 认证配置
export const authConfig = {
  tokenKey: 'auth_token',
  refreshTokenKey: 'refresh_token',
  userKey: 'user_data',
  tokenExpiry: 60 * 60 * 24 * 7, // 7 days
};

// 功能开关
export const featureFlags = {
  // 启用搜索
  search: process.env.NEXT_PUBLIC_FEATURE_SEARCH === 'true' ?? true,

  // 启用评论
  comments: process.env.NEXT_PUBLIC_FEATURE_COMMENTS === 'true' ?? true,

  // 启用分享
  sharing: process.env.NEXT_PUBLIC_FEATURE_SHARING === 'true' ?? true,

  // 启用RSS
  rss: process.env.NEXT_PUBLIC_FEATURE_RSS === 'true' ?? true,

  // 启用 PWA
  pwa: process.env.NEXT_PUBLIC_FEATURE_PWA === 'true' ?? true,

  // 启用统计
  analytics: process.env.NEXT_PUBLIC_FEATURE_ANALYTICS === 'true' ?? false,

  // 启用通知
  notifications: process.env.NEXT_PUBLIC_FEATURE_NOTIFICATIONS === 'true' ?? true,

  // 启用深色模式
  darkMode: process.env.NEXT_PUBLIC_FEATURE_DARK_MODE === 'true' ?? true,

  // 启用赛博朋克模式
  cyberMode: process.env.NEXT_PUBLIC_FEATURE_CYBER_MODE === 'true' ?? true,
};

// 分页配置
export const paginationConfig = {
  defaultPageSize: 10,
  pageSizeOptions: [5, 10, 20, 50, 100],
  maxPageSize: 100,
};

// 缓存配置
export const cacheConfig = {
  // 默认缓存时间（秒）
  defaultTTL: 3600,

  // 文章列表缓存时间
  postsListTTL: 300,

  // 文章详情缓存时间
  postDetailTTL: 3600,

  // 分类缓存时间
  categoriesTTL: 1800,

  // 标签缓存时间
  tagsTTL: 1800,

  // 启用本地缓存
  enableLocalCache: true,
};

// 图片配置
export const imageConfig = {
  // 默认图片质量
  defaultQuality: 90,

  // 懒加载阈值（0-1）
  lazyThreshold: 0.1,

  // 占位图颜色
  placeholderColor: '#1a1a2e',

  // 最大宽度
  maxWidth: 1920,

  // 最大高度
  maxHeight: 1080,

  // 启用 WebP
  enableWebP: true,

  // 启用 AVIF
  enableAVIF: false,
};

// 性能配置
export const performanceConfig = {
  // 启用预加载
  enablePreload: true,

  // 启用预连接
  enablePreconnect: true,

  // 启用 DNS 预取
  enableDNSPrefetch: true,

  // 启用资源提示
  enableResourceHints: true,

  // 最大并发请求数
  maxConcurrentRequests: 4,

  // 启用代码分割
  enableCodeSplitting: true,

  // 启用压缩
  enableCompression: true,
};

// SEO 配置
export const seoConfig = {
  // 默认标题模板
  titleTemplate: '%s | CyberPress',

  // 默认描述
  defaultDescription: siteConfig.description,

  // 默认图片
  defaultImage: siteConfig.ogImage,

  // Twitter 卡片类型
  twitterCardType: 'summary_large_image',

  // 启用结构化数据
  enableStructuredData: true,

  // 启用面包屑
  enableBreadcrumbs: true,

  // 启用 sitemap
  enableSitemap: true,

  // 启用 robots.txt
  enableRobots: true,
};

// 社交媒体配置
export const socialConfig = {
  twitter: {
    handle: process.env.NEXT_PUBLIC_TWITTER_HANDLE || '@cyberpress',
    cardType: 'summary_large_image',
  },
  github: {
    url: process.env.NEXT_PUBLIC_GITHUB_URL || 'https://github.com/cyberpress',
  },
  discord: {
    url: process.env.NEXT_PUBLIC_DISCORD_URL || '',
  },
  youtube: {
    url: process.env.NEXT_PUBLIC_YOUTUBE_URL || '',
  },
};

// 分析配置
export const analyticsConfig = {
  // Google Analytics ID
  googleAnalyticsId: process.env.NEXT_PUBLIC_GA_ID || '',

  // 百度统计 ID
  baiduAnalyticsId: process.env.NEXT_PUBLIC_BAIDU_ID || '',

  // 谷歌标签管理器 ID
  gtmId: process.env.NEXT_PUBLIC_GTM_ID || '',

  // 启用页面浏览跟踪
  trackPageViews: true,

  // 启用事件跟踪
  trackEvents: true,
};

// 错误监控配置
export const errorTrackingConfig = {
  // Sentry DSN
  sentryDsn: process.env.NEXT_PUBLIC_SENTRY_DSN || '',

  // 启用错误监控
  enabled: process.env.NEXT_PUBLIC_ERROR_TRACKING === 'true' ?? false,

  // 环境名称
  environment: process.env.NODE_ENV || 'development',

  // 采样率（0-1）
  tracesSampleRate: 0.2,
};

// PWA 配置
export const pwaConfig = {
  // 启用 PWA
  enabled: featureFlags.pwa,

  // Service Worker 文件名
  swFilename: '/sw.js',

  // Manifest 文件名
  manifestFilename: '/manifest.json',

  // 启用更新提示
  enableUpdatePrompt: true,

  // 启用离线页面
  enableOfflinePage: true,
};

// 主题配置
export const themeConfig = {
  // 默认主题
  defaultTheme: 'cyber' as 'light' | 'dark' | 'cyber',

  // 启用主题切换
  enableThemeSwitch: true,

  // 主题颜色
  colors: {
    light: {
      primary: '#0066cc',
      background: '#ffffff',
      foreground: '#000000',
    },
    dark: {
      primary: '#00f0ff',
      background: '#0a0a0f',
      foreground: '#ffffff',
    },
    cyber: {
      primary: '#00f0ff',
      secondary: '#9d00ff',
      accent: '#ff0080',
      background: '#0a0a0f',
      foreground: '#ffffff',
    },
  },
};

// 日期配置
export const dateConfig = {
  // 日期格式
  format: 'YYYY-MM-DD HH:mm:ss',

  // 时区
  timezone: 'Asia/Shanghai',

  // 语言
  locale: 'zh-CN',
};

// 评论配置
export const commentsConfig = {
  // 启用评论
  enabled: featureFlags.comments,

  // 评论类型（builtin, disqus, utterances）
  type: 'builtin',

  // Disqus shortname
  disqusShortname: process.env.NEXT_PUBLIC_DISQUS_SHORTNAME || '',

  // Utterances 配置
  utterances: {
    repo: process.env.NEXT_PUBLIC_UTTERANCES_REPO || '',
    theme: 'github-dark',
  },
};

// 导出所有配置
export const config = {
  site: siteConfig,
  api: apiConfig,
  auth: authConfig,
  features: featureFlags,
  pagination: paginationConfig,
  cache: cacheConfig,
  image: imageConfig,
  performance: performanceConfig,
  seo: seoConfig,
  social: socialConfig,
  analytics: analyticsConfig,
  errorTracking: errorTrackingConfig,
  pwa: pwaConfig,
  theme: themeConfig,
  date: dateConfig,
  comments: commentsConfig,
};

export default config;
