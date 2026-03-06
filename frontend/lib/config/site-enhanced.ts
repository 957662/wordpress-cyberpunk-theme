/**
 * 站点配置
 * 包含站点的基本信息、导航、社交链接等
 */

export const siteConfig = {
  // 站点基本信息
  name: 'CyberPress',
  title: 'CyberPress - 赛博朋克风格博客平台',
  description: '一个基于 WordPress + Next.js 的赛博朋克风格博客平台，探索前沿技术与设计美学',
  url: process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000',
  locale: 'zh-CN',

  // SEO 配置
  seo: {
    robots: 'index, follow',
    googleSiteVerificationId: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION,
  },

  // 作者信息
  author: {
    name: 'CyberPress Team',
    email: 'contact@cyberpress.com',
    twitter: '@cyberpress',
    github: 'cyberpress',
  },

  // 社交链接
  social: {
    github: 'https://github.com/yourusername',
    twitter: 'https://twitter.com/yourusername',
    linkedin: 'https://linkedin.com/in/yourusername',
    youtube: 'https://youtube.com/@yourusername',
    rss: '/rss.xml',
  },

  // 导航菜单
  nav: [
    { title: '首页', href: '/' },
    { title: '博客', href: '/blog' },
    { title: '作品集', href: '/portfolio' },
    { title: '关于', href: '/about' },
    { title: '联系', href: '/contact' },
  ],

  // 底部链接
  footer: {
    main: [
      { title: '首页', href: '/' },
      { title: '博客', href: '/blog' },
      { title: '作品集', href: '/portfolio' },
      { title: '关于', href: '/about' },
    ],
    secondary: [
      { title: '隐私政策', href: '/privacy' },
      { title: '服务条款', href: '/terms' },
      { title: 'RSS 订阅', href: '/rss' },
    ],
  },

  // WordPress API 配置
  wordpress: {
    apiUrl: process.env.NEXT_PUBLIC_WORDPRESS_API_URL || 'http://localhost:8080/wp-json',
    username: process.env.NEXT_PUBLIC_WORDPRESS_API_USERNAME || '',
    password: process.env.NEXT_PUBLIC_WORDPRESS_API_PASSWORD || '',
  },

  // 功能开关
  features: {
    comments: true,
    analytics: process.env.NEXT_PUBLIC_ANALYTICS_ID !== undefined,
    search: true,
    newsletter: true,
    darkMode: true,
    themeSwitch: true,
  },

  // 分页配置
  pagination: {
    postsPerPage: 10,
    postsPerHomePage: 6,
    relatedPostsCount: 4,
  },

  // 图片配置
  images: {
    domains: ['localhost', 'picsum.photos', 'images.unsplash.com'],
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  },
};

export default siteConfig;
