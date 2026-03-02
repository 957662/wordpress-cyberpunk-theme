/**
 * 站点配置文件
 */

export const siteConfig = {
  // 基本信息
  name: 'CyberPress',
  title: 'CyberPress - 赛博朋克博客平台',
  description: '基于 WordPress + Next.js 的赛博朋克风格博客平台',
  url: process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000',

  // 作者信息
  author: {
    name: 'CyberPress Team',
    url: 'https://github.com/cyberpress',
  },

  // 社交媒体链接
  social: {
    github: process.env.NEXT_PUBLIC_SOCIAL_GITHUB || 'https://github.com/cyberpress',
    twitter: process.env.NEXT_PUBLIC_SOCIAL_TWITTER || 'https://twitter.com/cyberpress',
    linkedin: process.env.NEXT_PUBLIC_SOCIAL_LINKEDIN || '',
  },

  // 功能开关
  features: {
    comments: process.env.NEXT_PUBLIC_ENABLE_COMMENTS === 'true',
    search: process.env.NEXT_PUBLIC_ENABLE_SEARCH === 'true',
    newsletter: process.env.NEXT_PUBLIC_ENABLE_NEWSLETTER === 'true',
  },

  // 导航菜单
  navigation: [
    { name: '首页', href: '/' },
    { name: '博客', href: '/blog' },
    { name: '作品集', href: '/portfolio' },
    { name: '关于', href: '/about' },
  ],

  // 主题配置
  theme: {
    defaultTheme: 'dark',
    themes: ['dark', 'neon'] as const,
  },
} as const;

export type SiteConfig = typeof siteConfig;
