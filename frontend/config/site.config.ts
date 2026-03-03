/**
 * Site Configuration
 * Centralized site configuration
 */

export const siteConfig = {
  // Basic Info
  name: 'CyberPress',
  title: 'CyberPress - Next-Generation Blog Platform',
  description: 'A powerful, modern blogging platform built with cutting-edge technology',
  tagline: 'Share your ideas with the world in style',

  // URLs
  url: process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000',
  wpApiUrl: process.env.NEXT_PUBLIC_WP_API_URL || '',
  wpUrl: process.env.NEXT_PUBLIC_WP_URL || '',

  // Authors
  author: {
    name: 'AI Development Team',
    email: 'contact@cyberpress.dev',
    url: 'https://cyberpress.dev'
  },

  // Social
  social: {
    twitter: 'https://twitter.com/cyberpress',
    github: 'https://github.com/cyberpress-platform',
    linkedin: 'https://linkedin.com/company/cyberpress',
    youtube: 'https://youtube.com/@cyberpress'
  },

  // Features
  features: {
    comments: process.env.NEXT_PUBLIC_FEATURE_COMMENTS === 'true',
    newsletter: process.env.NEXT_PUBLIC_FEATURE_NEWSLETTER === 'true',
    search: process.env.NEXT_PUBLIC_FEATURE_SEARCH === 'true',
    pwa: process.env.NEXT_PUBLIC_FEATURE_PWA === 'true',
    analytics: process.env.NEXT_PUBLIC_FEATURE_ANALYTICS === 'true'
  },

  // SEO
  seo: {
    defaultTitle: 'CyberPress',
    defaultDescription: 'A powerful, modern blogging platform',
    defaultImage: '/images/og-image.png',
    twitterCard: 'summary_large_image',
    robots: {
      index: true,
      follow: true
    }
  },

  // Pagination
  pagination: {
    postsPerPage: 10,
    commentsPerPage: 20
  },

  // Upload
  upload: {
    maxSize: 5 * 1024 * 1024, // 5MB
    allowedTypes: ['image/jpeg', 'image/png', 'image/webp', 'image/gif'],
    maxDimensions: {
      width: 3840,
      height: 2160
    }
  },

  // Comments
  comments: {
    maxDepth: 3,
    minLength: 10,
    maxLength: 5000,
    autoModeration: true
  },

  // Analytics
  analytics: {
    gaId: process.env.NEXT_PUBLIC_GA_ID,
    gtmId: process.env.NEXT_PUBLIC_GTM_ID,
    plausibleDomain: process.env.NEXT_PUBLIC_PLAUSIBLE_DOMAIN,
    plausibleUrl: process.env.NEXT_PUBLIC_PLAUSIBLE_URL
  },

  // Theme
  theme: {
    defaultTheme: 'dark',
    enableThemeSwitcher: true
  }
} as const;

export type SiteConfig = typeof siteConfig;
