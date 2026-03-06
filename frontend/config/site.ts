/**
 * CyberPress Platform - Site Configuration
 */

export const siteConfig = {
  name: 'CyberPress',
  title: 'CyberPress Platform',
  description: 'A cyberpunk-style blog platform powered by Next.js 14 and FastAPI',
  tagline: 'The Future of Blogging',
  url: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
  domain: process.env.NEXT_PUBLIC_APP_DOMAIN || 'localhost',
  author: {
    name: 'AI Development Team',
    email: '2835879683@qq.com',
  },
  features: {
    comments: true,
    bookmarks: true,
    newsletter: true,
    search: true,
    darkMode: true,
  },
  pagination: {
    postsPerPage: 12,
    portfoliosPerPage: 9,
    commentsPerPage: 10,
  },
} as const;

export type SiteConfig = typeof siteConfig;
