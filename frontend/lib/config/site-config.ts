/**
 * 站点配置
 * 集中管理站点相关的配置信息
 */

export const siteConfig = {
  // 基本信息
  name: process.env.NEXT_PUBLIC_SITE_NAME || 'CyberPress Platform',
  description: process.env.NEXT_PUBLIC_SITE_DESCRIPTION || '赛博朋克风格的现代化博客平台',
  url: process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000',

  // 作者信息
  author: {
    name: 'AI Developer',
    email: 'contact@cyberpress.dev',
    url: 'https://cyberpress.dev',
  },

  // 社交媒体
  social: {
    github: process.env.NEXT_PUBLIC_GITHUB_URL,
    twitter: process.env.NEXT_PUBLIC_TWITTER_URL,
    discord: process.env.NEXT_PUBLIC_DISCORD_URL,
    linkedin: process.env.NEXT_PUBLIC_LINKEDIN_URL,
  },

  // 功能开关
  features: {
    comments: process.env.NEXT_PUBLIC_ENABLE_COMMENTS === 'true',
    ratings: process.env.NEXT_PUBLIC_ENABLE_RATINGS === 'true',
    bookmarks: process.env.NEXT_PUBLIC_ENABLE_BOOKMARKS === 'true',
    share: process.env.NEXT_PUBLIC_ENABLE_SHARE === 'true',
    newsletter: process.env.NEXT_PUBLIC_ENABLE_NEWSLETTER === 'true',
  },

  // SEO 配置
  seo: {
    defaultTitle: siteConfig.name,
    titleTemplate: '%s | ' + (process.env.NEXT_PUBLIC_SITE_NAME || 'CyberPress'),
    defaultDescription: siteConfig.description,
    defaultImage: '/og-image.jpg',
    twitterCard: 'summary_large_image',
  },

  // 分页配置
  pagination: {
    postsPerPage: 10,
    projectsPerPage: 12,
    commentsPerPage: 20,
  },

  // 日期格式
  dateFormat: {
    full: 'YYYY年MM月DD日 HH:mm',
    date: 'YYYY年MM月DD日',
    time: 'HH:mm',
    short: 'MM-DD',
  },
} as const;

export default siteConfig;
