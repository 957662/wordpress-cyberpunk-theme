/**
 * WordPress 配置文件
 */

export const wordpressConfig = {
  // API 基础 URL
  baseURL: process.env.NEXT_PUBLIC_WORDPRESS_API_URL || 'https://your-site.com/wp-json',
  
  // 超时时间（毫秒）
  timeout: 10000,
  
  // 认证（如果需要）
  auth: process.env.WORDPRESS_CREDENTIALS ? {
    username: process.env.WORDPRESS_USERNAME || '',
    password: process.env.WORDPRESS_PASSWORD || '',
  } : undefined,
  
  // 每页显示数量
  postsPerPage: 12,
  
  // 特色图片来源
  featuredImage: {
    fallback: '/images/placeholder.jpg',
    sizes: {
      thumbnail: 150,
      medium: 300,
      large: 1024,
      full: 2048,
    },
  },
  
  // 缓存配置
  cache: {
    enabled: true,
    defaultTTL: 5 * 60 * 1000, // 5 分钟
  },
};

export default wordpressConfig;
