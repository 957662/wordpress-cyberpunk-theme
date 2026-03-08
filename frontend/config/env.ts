/**
 * Environment Configuration
 * 环境配置
 */

export const env = {
  // API 配置
  apiUrl: process.env.NEXT_PUBLIC_API_URL || '/api',
  wordpressUrl: process.env.NEXT_PUBLIC_WORDPRESS_URL,

  // 分析工具
  analyticsId: process.env.NEXT_PUBLIC_GA_ID,
  gtmId: process.env.NEXT_PUBLIC_GTM_ID,

  // 认证
  authUrl: process.env.NEXT_PUBLIC_AUTH_URL,
  authSecret: process.env.AUTH_SECRET,

  // 数据库
  databaseUrl: process.env.DATABASE_URL,

  // 其他
  nodeEnv: process.env.NODE_ENV,
  isDevelopment: process.env.NODE_ENV === 'development',
  isProduction: process.env.NODE_ENV === 'production',
};

export default env;
