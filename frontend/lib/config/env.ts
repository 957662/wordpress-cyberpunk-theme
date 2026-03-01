/**
 * 环境变量配置
 * 运行时环境变量获取
 */

export const env = {
  // WordPress API
  wpApiUrl: process.env.NEXT_PUBLIC_WP_API_URL || '',
  wpUsername: process.env.NEXT_PUBLIC_WP_USERNAME || '',
  wpPassword: process.env.NEXT_PUBLIC_WP_PASSWORD || '',

  // Analytics
  gaMeasurementId: process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID || '',

  // Site
  siteUrl: process.env.NEXT_PUBLIC_SITE_URL || 'https://cyberpress.com',
  siteName: process.env.NEXT_PUBLIC_SITE_NAME || 'CyberPress',

  // Features
  enableComments: process.env.NEXT_PUBLIC_ENABLE_COMMENTS === 'true',
  enableSearch: process.env.NEXT_PUBLIC_ENABLE_SEARCH === 'true',
  enableNewsletter: process.env.NEXT_PUBLIC_ENABLE_NEWSLETTER === 'true',

  // API Keys
  cloudinaryCloudName: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || '',
  disqusShortname: process.env.NEXT_PUBLIC_DISQUS_SHORTNAME || '',

  // Social
  socialGithub: process.env.NEXT_PUBLIC_SOCIAL_GITHUB || '',
  socialTwitter: process.env.NEXT_PUBLIC_SOCIAL_TWITTER || '',
  socialLinkedin: process.env.NEXT_PUBLIC_SOCIAL_LINKEDIN || '',

  // Email
  contactEmail: process.env.NEXT_PUBLIC_CONTACT_EMAIL || 'contact@cyberpress.com',

  // Development
  isDevelopment: process.env.NODE_ENV === 'development',
  isProduction: process.env.NODE_ENV === 'production',
} as const;

export default env;
