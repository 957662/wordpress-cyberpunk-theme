/**
 * 完整网站配置文件
 * @description CyberPress Platform 全局配置（完整版）
 * @version 1.0.0
 */

// =====================================================
// 环境变量类型定义
// =====================================================

interface SiteConfig {
  // 基本信息
  name: string;
  description: string;
  url: string;
  logo: string;
  icon: string;

  // 作者信息
  author: {
    name: string;
    email: string;
    url: string;
  };

  // SEO 配置
  seo: {
    title: string;
    description: string;
    keywords: string[];
    image: string;
    twitterCard: 'summary' | 'summary_large_image';
  };

  // 分页配置
  pagination: {
    postsPerPage: number;
    portfolioPerPage: number;
    commentsPerPage: number;
  };

  // 功能开关
  features: {
    comments: boolean;
    registrations: boolean;
    socialSharing: boolean;
    newsletter: boolean;
    search: boolean;
    bookmarks: boolean;
    likes: boolean;
    readingProgress: boolean;
  };

  // 社交媒体链接
  social: {
    twitter?: string;
    github?: string;
    linkedin?: string;
    youtube?: string;
    discord?: string;
  };

  // API 配置
  api: {
    baseURL: string;
    timeout: number;
    retryAttempts: number;
  };

  // 认证配置
  auth: {
    sessionTimeout: number;
    refreshTokenThreshold: number;
  };

  // 日期格式
  dateFormat: {
    full: string;
    short: string;
    time: string;
  };

  // 主题颜色（赛博朋克风格）
  colors: {
    primary: string;
    secondary: string;
    accent: string;
    background: string;
    foreground: string;
  };
}

// =====================================================
// 默认配置
// =====================================================

export const siteConfig: SiteConfig = {
  // 基本信息
  name: process.env.NEXT_PUBLIC_SITE_NAME || 'CyberPress',
  description: process.env.NEXT_PUBLIC_SITE_DESCRIPTION || 'A Cyberpunk Style Blog Platform',
  url: process.env.NEXT_PUBLIC_SITE_URL || 'https://cyberpress.com',
  logo: '/images/logo.png',
  icon: '/favicon.ico',

  // 作者信息
  author: {
    name: process.env.NEXT_PUBLIC_AUTHOR_NAME || 'CyberPress Team',
    email: process.env.NEXT_PUBLIC_AUTHOR_EMAIL || 'team@cyberpress.com',
    url: process.env.NEXT_PUBLIC_AUTHOR_URL || 'https://cyberpress.com',
  },

  // SEO 配置
  seo: {
    title: process.env.NEXT_PUBLIC_SITE_NAME || 'CyberPress',
    description: process.env.NEXT_PUBLIC_SITE_DESCRIPTION || 'A Cyberpunk Style Blog Platform',
    keywords: [
      'cyberpunk',
      'blog',
      'technology',
      'development',
      'design',
      'javascript',
      'typescript',
      'nextjs',
      'react',
    ],
    image: '/images/og-image.png',
    twitterCard: 'summary_large_image',
  },

  // 分页配置
  pagination: {
    postsPerPage: parseInt(process.env.NEXT_PUBLIC_POSTS_PER_PAGE || '10'),
    portfolioPerPage: parseInt(process.env.NEXT_PUBLIC_PORTFOLIO_PER_PAGE || '12'),
    commentsPerPage: parseInt(process.env.NEXT_PUBLIC_COMMENTS_PER_PAGE || '10'),
  },

  // 功能开关
  features: {
    comments: process.env.NEXT_PUBLIC_FEATURE_COMMENTS === 'true',
    registrations: process.env.NEXT_PUBLIC_FEATURE_REGISTRATIONS === 'true',
    socialSharing: process.env.NEXT_PUBLIC_FEATURE_SOCIAL_SHARING === 'true',
    newsletter: process.env.NEXT_PUBLIC_FEATURE_NEWSLETTER === 'true',
    search: process.env.NEXT_PUBLIC_FEATURE_SEARCH === 'true',
    bookmarks: process.env.NEXT_PUBLIC_FEATURE_BOOKMARKS === 'true',
    likes: process.env.NEXT_PUBLIC_FEATURE_LIKES === 'true',
    readingProgress: process.env.NEXT_PUBLIC_FEATURE_READING_PROGRESS === 'true',
  },

  // 社交媒体链接
  social: {
    twitter: process.env.NEXT_PUBLIC_SOCIAL_TWITTER,
    github: process.env.NEXT_PUBLIC_SOCIAL_GITHUB,
    linkedin: process.env.NEXT_PUBLIC_SOCIAL_LINKEDIN,
    youtube: process.env.NEXT_PUBLIC_SOCIAL_YOUTUBE,
    discord: process.env.NEXT_PUBLIC_SOCIAL_DISCORD,
  },

  // API 配置
  api: {
    baseURL: process.env.NEXT_PUBLIC_API_URL || '/api',
    timeout: parseInt(process.env.NEXT_PUBLIC_API_TIMEOUT || '10000'),
    retryAttempts: parseInt(process.env.NEXT_PUBLIC_API_RETRY_ATTEMPTS || '3'),
  },

  // 认证配置
  auth: {
    sessionTimeout: parseInt(process.env.NEXT_PUBLIC_AUTH_SESSION_TIMEOUT || '3600'), // 1 hour
    refreshTokenThreshold: parseInt(process.env.NEXT_PUBLIC_AUTH_REFRESH_THRESHOLD || '300'), // 5 minutes
  },

  // 日期格式
  dateFormat: {
    full: 'MMMM d, yyyy',
    short: 'MMM d, yyyy',
    time: 'h:mm a',
  },

  // 主题颜色（赛博朋克风格）
  colors: {
    primary: '#00f0ff', // 霓虹青
    secondary: '#9d00ff', // 赛博紫
    accent: '#ff0080', // 激光粉
    background: '#0a0a0f', // 深空黑
    foreground: '#ffffff', // 纯白
  },
};

// =====================================================
// WordPress 配置
// =====================================================

export const wordpressConfig = {
  url: process.env.NEXT_PUBLIC_WORDPRESS_URL || '',
  apiVersion: 'wp/v2',
  timeout: 10000,
};

// =====================================================
// 图片配置
// =====================================================

export const imageConfig = {
  domains: [
    process.env.NEXT_PUBLIC_WORDPRESS_URL,
    'cyberpress.com',
    'localhost',
  ].filter(Boolean) as string[],
  formats: ['image/avif', 'image/webp'],
  deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
  imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
};

// =====================================================
// 性能配置
// =====================================================

export const performanceConfig = {
  // 预加载
  preload: {
    fonts: true,
    images: true,
  },

  // 懒加载
  lazyLoad: {
    images: true,
    components: true,
  },

  // 缓存策略
  cache: {
    staticAssets: 'public, max-age=31536000, immutable',
    apiResponses: 'public, max-age=60, s-maxage=300',
    pages: 'public, max-age=180, s-maxage=600',
  },

  // 代码分割
  codeSplitting: {
    enabled: true,
    chunks: 'dynamic',
  },
};

// =====================================================
// 分析配置
// =====================================================

export const analyticsConfig = {
  googleAnalyticsId: process.env.NEXT_PUBLIC_GA_ID,
  googleTagManagerId: process.env.NEXT_PUBLIC_GTM_ID,

  // Plausible Analytics (隐私友好)
  plausibleDomain: process.env.NEXT_PUBLIC_PLAUSIBLE_DOMAIN,
  plausibleScriptUrl: process.env.NEXT_PUBLIC_PLAUSIBLE_SCRIPT_URL,

  // Umami (开源分析)
  umamiWebsiteId: process.env.NEXT_PUBLIC_UMAMI_WEBSITE_ID,
  umamiSrc: process.env.NEXT_PUBLIC_UMAMI_SRC,

  // PostHog (产品分析)
  postHogKey: process.env.NEXT_PUBLIC_POSTHOG_KEY,
  postHogHost: process.env.NEXT_PUBLIC_POSTHOG_HOST,
};

// =====================================================
// 错误监控配置
// =====================================================

export const errorTrackingConfig = {
  // Sentry
  sentryDsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  sentryEnvironment: process.env.NEXT_PUBLIC_SENTRY_ENVIRONMENT || 'production',
  sentryTracesSampleRate: parseFloat(process.env.NEXT_PUBLIC_SENTRY_TRACES_SAMPLE_RATE || '0.1'),

  // LogRocket
  logRocketId: process.env.NEXT_PUBLIC_LOGROCKET_ID,

  // 是否启用错误跟踪
  enabled: process.env.NODE_ENV === 'production',
};

// =====================================================
// PWA 配置
// =====================================================

export const pwaConfig = {
  enabled: process.env.NEXT_PUBLIC_PWA_ENABLED === 'true',
  scope: '/',
  display: 'standalone',
  orientation: 'portrait',
  backgroundColor: '#0a0a0f',
  themeColor: '#00f0ff',
  startUrl: '/',
};

// =====================================================
// 评论配置
// =====================================================

export const commentsConfig = {
  // 本地评论系统
  enabled: siteConfig.features.comments,
  requireApproval: process.env.NEXT_PUBLIC_COMMENTS_REQUIRE_APPROVAL === 'true',
  allowGuestComments: process.env.NEXT_PUBLIC_COMMENTS_ALLOW_GUEST === 'true',
  maxDepth: parseInt(process.env.NEXT_PUBLIC_COMMENTS_MAX_DEPTH || '3'),

  // Disqus
  disqusShortname: process.env.NEXT_PUBLIC_DISQUS_SHORTNAME,

  // Utterances (GitHub 评论)
  utterancesRepo: process.env.NEXT_PUBLIC_UTTERANCES_REPO,
  utterancesTheme: 'github-dark',
  utterancesIssueTerm: 'pathname',

  // Giscus (基于 GitHub Discussions)
  giscusRepo: process.env.NEXT_PUBLIC_GISCUS_REPO,
  giscusRepoId: process.env.NEXT_PUBLIC_GISCUS_REPO_ID,
  giscusCategory: process.env.NEXT_PUBLIC_GISCUS_CATEGORY,
  giscusCategoryId: process.env.NEXT_PUBLIC_GISCUS_CATEGORY_ID,
  giscusMapping: 'pathname',
  giscusTheme: 'dark',
};

// =====================================================
// 邮件配置
// =====================================================

export const mailConfig = {
  // Contact Form
  contactEmail: process.env.NEXT_PUBLIC_CONTACT_EMAIL || 'contact@cyberpress.com',

  // Newsletter
  newsletterEmail: process.env.NEXT_PUBLIC_NEWSLETTER_EMAIL || 'newsletter@cyberpress.com',

  // SMTP (用于后端)
  smtp: {
    host: process.env.SMTP_HOST,
    port: parseInt(process.env.SMTP_PORT || '587'),
    secure: process.env.SMTP_SECURE === 'true',
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  },

  // Resend
  resendApiKey: process.env.RESEND_API_KEY,

  // SendGrid
  sendGridApiKey: process.env.SENDGRID_API_KEY,

  // Mailgun
  mailgunApiKey: process.env.MAILGUN_API_KEY,
  mailgunDomain: process.env.MAILGUN_DOMAIN,
};

// =====================================================
// 存储配置
// =====================================================

export const storageConfig = {
  // 本地存储
  localStorage: {
    prefix: 'cyberpress_',
    user: 'user_data',
    preferences: 'user_preferences',
    theme: 'theme',
  },

  // Session 存储
  sessionStorage: {
    prefix: 'cyberpress_session_',
    formData: 'form_data',
  },

  // Cookie 配置
  cookies: {
    session: 'cyberpress_session',
    consent: 'cyberpress_consent',
    theme: 'cyberpress_theme',
    maxAge: 60 * 60 * 24 * 365, // 1 year
  },

  // S3 兼容存储
  s3: {
    region: process.env.NEXT_PUBLIC_S3_REGION || 'us-east-1',
    bucket: process.env.NEXT_PUBLIC_S3_BUCKET || 'cyberpress',
    endpoint: process.env.NEXT_PUBLIC_S3_ENDPOINT,
    accessKeyId: process.env.S3_ACCESS_KEY_ID,
    secretAccessKey: process.env.S3_SECRET_ACCESS_KEY,
  },

  // Cloudflare R2
  r2: {
    accountId: process.env.R2_ACCOUNT_ID,
    bucket: process.env.R2_BUCKET,
    accessKeyId: process.env.R2_ACCESS_KEY_ID,
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY,
  },
};

// =====================================================
// i18n 配置
// =====================================================

export const i18nConfig = {
  defaultLocale: 'en',
  locales: ['en', 'zh', 'ja', 'ko', 'es', 'fr', 'de'],
  localeDetection: true,
};

// =====================================================
// 安全配置
// =====================================================

export const securityConfig = {
  // CSP (Content Security Policy)
  csp: {
    'default-src': ["'self'"],
    'script-src': ["'self'", "'unsafe-inline'", "'unsafe-eval'", 'https://www.google-analytics.com'],
    'style-src': ["'self'", "'unsafe-inline'"],
    'img-src': ["'self'", 'data:', 'https:', 'blob:'],
    'font-src': ["'self'", 'data:'],
    'connect-src': ["'self'", 'https://api.cyberpress.com'],
    'media-src': ["'self'", 'https:'],
    'object-src': ["'none'"],
    'base-uri': ["'self'"],
    'form-action': ["'self'"],
    'frame-ancestors': ["'none'"],
    'upgrade-insecure-requests': [],
  },

  // CORS
  cors: {
    origins: process.env.CORS_ORIGINS?.split(',') || ['https://cyberpress.com'],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  },

  // Rate Limiting
  rateLimit: {
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // limit each IP to 100 requests per windowMs
  },
};

// =====================================================
// 导出所有配置
// =====================================================

export default {
  site: siteConfig,
  wordpress: wordpressConfig,
  image: imageConfig,
  performance: performanceConfig,
  analytics: analyticsConfig,
  errorTracking: errorTrackingConfig,
  pwa: pwaConfig,
  comments: commentsConfig,
  mail: mailConfig,
  storage: storageConfig,
  i18n: i18nConfig,
  security: securityConfig,
};
