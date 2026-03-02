/**
 * PWA 配置文件
 * 用于配置 Progressive Web App 功能
 */

import { Config } from 'next-pwa';

export const pwaConfig: Config = {
  dest: 'public',
  register: true,
  skipWaiting: true,
  disable: process.env.NODE_ENV === 'development',
  sw: 'service-worker.js',
  scope: '/',
};

/**
 * Web App Manifest 配置
 */
export const manifest = {
  name: 'CyberPress Platform',
  short_name: 'CyberPress',
  description: '赛博朋克风格的现代博客平台',
  start_url: '/',
  display: 'standalone',
  background_color: '#000000',
  theme_color: '#00ffff',
  orientation: 'portrait-primary',
  icons: [
    {
      src: '/icons/icon-72x72.png',
      sizes: '72x72',
      type: 'image/png',
      purpose: 'maskable any',
    },
    {
      src: '/icons/icon-96x96.png',
      sizes: '96x96',
      type: 'image/png',
      purpose: 'maskable any',
    },
    {
      src: '/icons/icon-128x128.png',
      sizes: '128x128',
      type: 'image/png',
      purpose: 'maskable any',
    },
    {
      src: '/icons/icon-144x144.png',
      sizes: '144x144',
      type: 'image/png',
      purpose: 'maskable any',
    },
    {
      src: '/icons/icon-152x152.png',
      sizes: '152x152',
      type: 'image/png',
      purpose: 'maskable any',
    },
    {
      src: '/icons/icon-192x192.png',
      sizes: '192x192',
      type: 'image/png',
      purpose: 'maskable any',
    },
    {
      src: '/icons/icon-384x384.png',
      sizes: '384x384',
      type: 'image/png',
      purpose: 'maskable any',
    },
    {
      src: '/icons/icon-512x512.png',
      sizes: '512x512',
      type: 'image/png',
      purpose: 'maskable any',
    },
  ],
  categories: ['blog', 'news', 'technology'],
  screenshots: [
    {
      src: '/screenshots/desktop-wide.png',
      sizes: '1280x720',
      type: 'image/png',
      form_factor: 'wide',
    },
    {
      src: '/screenshots/mobile-narrow.png',
      sizes: '750x1334',
      type: 'image/png',
      form_factor: 'narrow',
    },
  ],
  shortcuts: [
    {
      name: 'Latest Posts',
      short_name: 'Posts',
      description: 'View the latest blog posts',
      url: '/blog',
      icons: [{ src: '/icons/blog.png', sizes: '96x96', type: 'image/png' }],
    },
    {
      name: 'Portfolio',
      short_name: 'Work',
      description: 'View my portfolio',
      url: '/portfolio',
      icons: [{ src: '/icons/portfolio.png', sizes: '96x96', type: 'image/png' }],
    },
    {
      name: 'About',
      short_name: 'Info',
      description: 'About me',
      url: '/about',
      icons: [{ src: '/icons/about.png', sizes: '96x96', type: 'image/png' }],
    },
  ],
  related_applications: [],
  prefer_related_applications: false,
};

/**
 * Service Worker 缓存策略
 */
export const cacheStrategies = {
  // 网络优先，失败则使用缓存
  networkFirst: [
    /^https:\/\/api\./,
    /^\/api\//,
  ],

  // 缓存优先，失败则使用网络
  cacheFirst: [
    /\.(?:png|jpg|jpeg|svg|gif|webp|avif)$/,
    /\.(?:woff|woff2|ttf|otf)$/,
  ],

  // 仅使用网络
  networkOnly: [
    /^\/api\/auth/,
    /^\/api\/admin/,
  ],

  // 仅使用缓存
  cacheOnly: [],

  // 网络和缓存都使用，网络优先
  staleWhileRevalidate: [
    /\.css$/,
    /\.js$/,
  ],
};

/**
 * 预缓存资源列表
 */
export const precacheEntries = [
  '/',
  '/offline',
  '/manifest.json',
  '/icons/icon-192x192.png',
  '/icons/icon-512x512.png',
];

/**
 * 运行时缓存配置
 */
export const runtimeCaching = [
  {
    urlPattern: /^https:\/\/fonts\.(?:googleapis|gstatic)\.com\/.*/i,
    handler: 'CacheFirst',
    options: {
      cacheName: 'google-fonts',
      expiration: {
        maxEntries: 4,
        maxAgeSeconds: 365 * 24 * 60 * 60, // 1 year
      },
      cacheableResponse: {
        statuses: [0, 200],
      },
    },
  },
  {
    urlPattern: /\.(?:png|jpg|jpeg|svg|gif|webp|avif)$/i,
    handler: 'CacheFirst',
    options: {
      cacheName: 'images',
      expiration: {
        maxEntries: 60,
        maxAgeSeconds: 30 * 24 * 60 * 60, // 30 days
      },
    },
  },
  {
    urlPattern: /\.(?:css|js)$/i,
    handler: 'StaleWhileRevalidate',
    options: {
      cacheName: 'static-resources',
      expiration: {
        maxEntries: 60,
        maxAgeSeconds: 7 * 24 * 60 * 60, // 7 days
      },
    },
  },
  {
    urlPattern: /^\/api\/.*/i,
    handler: 'NetworkFirst',
    options: {
      cacheName: 'api-cache',
      networkTimeoutSeconds: 10,
      expiration: {
        maxEntries: 50,
        maxAgeSeconds: 5 * 60, // 5 minutes
      },
      cacheableResponse: {
        statuses: [0, 200],
      },
    },
  },
];

export default {
  pwa: pwaConfig,
  manifest,
  cacheStrategies,
  precacheEntries,
  runtimeCaching,
};
