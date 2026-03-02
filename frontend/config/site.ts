/**
 * 站点配置
 * 集中管理站点的基本信息和设置
 */

export const siteConfig = {
  // 基本信息
  name: 'CyberPress',
  title: 'CyberPress - 赛博朋克博客平台',
  description: '基于 WordPress + Next.js 的赛博朋克风格博客平台',
  tagline: '探索技术、设计与创意的无限可能',

  // URL
  url: process.env.NEXT_PUBLIC_SITE_URL || 'https://cyberpress.dev',
  domain: process.env.NEXT_PUBLIC_DOMAIN || 'cyberpress.dev',

  // 作者
  author: {
    name: 'CyberPress Team',
    email: 'contact@cyberpress.dev',
    url: 'https://cyberpress.dev',
  },

  // 社交链接
  social: {
    github: 'https://github.com/cyberpress',
    twitter: 'https://twitter.com/cyberpress',
    linkedin: 'https://linkedin.com/in/cyberpress',
    youtube: 'https://youtube.com/@cyberpress',
  },

  // Open Graph
  openGraph: {
    type: 'website',
    locale: 'zh_CN',
    url: 'https://cyberpress.dev',
    siteName: 'CyberPress',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'CyberPress',
      },
    ],
  },

  // Twitter
  twitter: {
    handle: '@cyberpress',
    site: '@cyberpress',
    cardType: 'summary_large_image',
  },

  // SEO
  seo: {
    keywords: [
      'cyberpunk',
      'blog',
      'wordpress',
      'next.js',
      '赛博朋克',
      '技术博客',
      '前端开发',
      'TypeScript',
    ].join(', '),
  },

  // 导航
  nav: [
    {
      title: '首页',
      href: '/',
    },
    {
      title: '博客',
      href: '/blog',
    },
    {
      title: '作品集',
      href: '/portfolio',
    },
    {
      title: '关于',
      href: '/about',
    },
    {
      title: '联系',
      href: '/contact',
    },
  ],

  // 页脚链接
  footerLinks: [
    {
      title: '平台',
      links: [
        { title: '首页', href: '/' },
        { title: '关于我们', href: '/about' },
        { title: '联系方式', href: '/contact' },
      ],
    },
    {
      title: '资源',
      links: [
        { title: '博客', href: '/blog' },
        { title: '作品集', href: '/portfolio' },
        { title: '文档', href: '/docs' },
      ],
    },
    {
      title: '法律',
      links: [
        { title: '隐私政策', href: '/privacy' },
        { title: '服务条款', href: '/terms' },
        { title: 'Cookie政策', href: '/cookies' },
      ],
    },
  ],

  // 分页
  pagination: {
    postsPerPage: 10,
    projectsPerPage: 12,
  },

  // 功能开关
  features: {
    comments: true,
    search: true,
    darkMode: true,
    analytics: true,
    newsletter: true,
  },
} as const;

export type SiteConfig = typeof siteConfig;
