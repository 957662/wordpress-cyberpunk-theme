/**
 * PWA 配置
 * Progressive Web App 设置
 */

export const pwaConfig = {
  name: 'CyberPress',
  shortName: 'CyberPress',
  description: '基于 WordPress + Next.js 的赛博朋克风格博客平台',
  themeColor: '#00f0ff',
  backgroundColor: '#0a0a0f',
  display: 'standalone' as const,
  orientation: 'portrait-primary' as const,
  scope: '/',
  startUrl: '/',

  // 图标配置
  icons: [
    {
      src: '/icons/icon-72x72.png',
      sizes: '72x72',
      type: 'image/png',
      purpose: 'any' as const,
    },
    {
      src: '/icons/icon-96x96.png',
      sizes: '96x96',
      type: 'image/png',
      purpose: 'any' as const,
    },
    {
      src: '/icons/icon-128x128.png',
      sizes: '128x128',
      type: 'image/png',
      purpose: 'any' as const,
    },
    {
      src: '/icons/icon-144x144.png',
      sizes: '144x144',
      type: 'image/png',
      purpose: 'any' as const,
    },
    {
      src: '/icons/icon-152x152.png',
      sizes: '152x152',
      type: 'image/png',
      purpose: 'any' as const,
    },
    {
      src: '/icons/icon-192x192.png',
      sizes: '192x192',
      type: 'image/png',
      purpose: 'any' as const,
    },
    {
      src: '/icons/icon-384x384.png',
      sizes: '384x384',
      type: 'image/png',
      purpose: 'any' as const,
    },
    {
      src: '/icons/icon-512x512.png',
      sizes: '512x512',
      type: 'image/png',
      purpose: 'any' as const,
    },
    {
      src: '/icons/maskable-icon-512x512.png',
      sizes: '512x512',
      type: 'image/png',
      purpose: 'maskable' as const,
    },
  ],

  // 快捷方式
  shortcuts: [
    {
      name: '浏览博客',
      shortName: '博客',
      description: '查看最新的博客文章',
      url: '/blog',
      icons: [{ src: '/icons/shortcut-blog.png', sizes: '96x96', type: 'image/png' }],
    },
    {
      name: '作品集',
      shortName: '作品',
      description: '浏览作品集',
      url: '/portfolio',
      icons: [{ src: '/icons/shortcut-portfolio.png', sizes: '96x96', type: 'image/png' }],
    },
    {
      name: '关于',
      shortName: '关于',
      description: '了解更多关于我们',
      url: '/about',
      icons: [{ src: '/icons/shortcut-about.png', sizes: '96x96', type: 'image/png' }],
    },
  ],

  // 截图
  screenshots: [
    {
      src: '/screenshots/desktop-home.png',
      sizes: '1280x720',
      type: 'image/png',
      form_factor: 'wide' as const,
    },
    {
      src: '/screenshots/mobile-home.png',
      sizes: '750x1334',
      type: 'image/png',
      form_factor: 'narrow' as const,
    },
  ],

  // 分类
  categories: ['blog', 'technology', 'cyberpunk'],

  // 语言
  lang: 'zh-CN',
  dir: 'ltr' as const,
};

// Service Worker 缓存配置
export const cacheConfig = {
  // 静态资源缓存
  staticAssets: {
    patterns: [
      '/',
      '/offline',
      '/manifest.json',
      '/icons/*',
      '/images/*',
    ],
    strategy: 'cache-first' as const,
  },

  // API 缓存
  api: {
    patterns: ['/api/*'],
    strategy: 'network-first' as const,
    maxAge: 5 * 60 * 1000, // 5分钟
  },

  // 图片缓存
  images: {
    patterns: ['*://*.{png,jpg,jpeg,svg,webp,gif}'],
    strategy: 'cache-first' as const,
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7天
    maxEntries: 100,
  },

  // 字体缓存
  fonts: {
    patterns: ['*://*.{woff,woff2,ttf,eot}'],
    strategy: 'cache-first' as const,
    maxAge: 365 * 24 * 60 * 60 * 1000, // 1年
  },
};

// 推送通知配置
export const pushConfig = {
  enabled: true,
  vapidPublicKey: process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY || '',
  serverUrl: process.env.NEXT_PUBLIC_PUSH_SERVER_URL || '',
};

// 离线页面
export const offlineConfig = {
  url: '/offline',
  title: '离线模式',
  message: '您当前处于离线状态，请检查网络连接',
};
