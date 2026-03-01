/**
 * 网站配置
 */

import type { SiteConfig } from '@/types';

export const siteConfig: SiteConfig = {
  name: 'CyberPress',
  description: '基于 WordPress + Next.js 的赛博朋克风格博客平台',
  url: 'https://cyberpress.dev',
  ogImage: '/images/og-image.png',
  links: {
    github: 'https://github.com/cyberpress',
    twitter: 'https://twitter.com/cyberpress',
    email: 'hello@cyberpress.dev',
  },
  navigation: [
    { name: '首页', href: '/' },
    { name: '博客', href: '/blog' },
    { name: '作品集', href: '/portfolio' },
    { name: '关于', href: '/about' },
  ],
  footer: {
    copyright: `© ${new Date().getFullYear()} CyberPress. All rights reserved.`,
    links: [
      { name: '隐私政策', href: '/privacy' },
      { name: '使用条款', href: '/terms' },
      { name: 'RSS', href: '/rss.xml' },
    ],
  },
};

// SEO 配置
export const seoConfig = {
  defaultTitle: siteConfig.name,
  titleTemplate: '%s | CyberPress',
  defaultDescription: siteConfig.description,
  defaultKeywords: [
    'cyberpunk',
    'blog',
    'wordpress',
    'next.js',
    'react',
    'typescript',
    '赛博朋克',
    '技术博客',
  ],
  twitter: {
    handle: '@cyberpress',
    site: '@cyberpress',
    cardType: 'summary_large_image' as const,
  },
};

// 分页配置
export const paginationConfig = {
  defaultPageSize: 10,
  pageSizeOptions: [10, 20, 50, 100],
};

// 日期格式
export const dateFormat = {
  full: 'yyyy年MM月dd日 HH:mm',
  date: 'yyyy年MM月dd日',
  month: 'yyyy年MM月',
  time: 'HH:mm',
  relative: true,
};

// 动画配置
export const animationConfig = {
  duration: {
    fast: 0.15,
    normal: 0.3,
    slow: 0.5,
  },
  easing: {
    ease: [0.25, 0.1, 0.25, 1],
    easeIn: [0.42, 0, 1, 1],
    easeOut: [0, 0, 0.58, 1],
    easeInOut: [0.42, 0, 0.58, 1],
  },
};

// API 配置
export const apiConfig = {
  baseUrl: process.env.NEXT_PUBLIC_WP_API_URL || 'http://localhost:8080/wp-json',
  timeout: 30000,
  retries: 3,
};

// 图片配置
export const imageConfig = {
  formats: ['image/avif', 'image/webp'],
  sizes: {
    thumbnail: 150,
    medium: 300,
    large: 1024,
    full: 2048,
  },
  quality: 85,
};

// 缓存配置
export const cacheConfig = {
  // React Query 默认缓存时间（秒）
  staleTime: 60,
  gcTime: 300, // 5分钟
  // 重新聚焦时是否重新获取
  refetchOnWindowFocus: true,
  // 重新连接时是否重新获取
  refetchOnReconnect: true,
};
