/**
 * WordPress Configuration
 *
 * WordPress API 配置和初始化
 */

import { initWordPressClient, WPConfig } from './wordpress-api';

// 从环境变量获取配置
const getWordPressConfig = (): WPConfig => {
  // 如果有环境变量，使用环境变量
  if (typeof window !== 'undefined') {
    // 浏览器环境
    return {
      baseUrl: process.env.NEXT_PUBLIC_WORDPRESS_URL || 'https://your-wordpress-site.com',
      apiPath: process.env.NEXT_PUBLIC_WORDPRESS_API_PATH || '/wp-json/wp/v2',
      timeout: 10000,
    };
  } else {
    // 服务器环境
    return {
      baseUrl: process.env.WORDPRESS_URL || 'https://your-wordpress-site.com',
      apiPath: process.env.WORDPRESS_API_PATH || '/wp-json/wp/v2',
      timeout: 10000,
    };
  }
};

// 初始化 WordPress 客户端
let wpConfig: WPConfig;

export const initializeWordPress = () => {
  wpConfig = getWordPressConfig();
  return initWordPressClient(wpConfig);
};

// 导出配置获取函数
export const getWordPressConfig = () => {
  if (!wpConfig) {
    return initializeWordPress();
  }
  return wpConfig;
};

// 默认配置（用于开发）
export const DEFAULT_WP_CONFIG: WPConfig = {
  baseUrl: 'https://your-wordpress-site.com',
  apiPath: '/wp-json/wp/v2',
  timeout: 10000,
};

// 导出 WordPress URL 常量
export const WP_URL = process.env.NEXT_PUBLIC_WORDPRESS_URL || '';
export const WP_API_URL = WP_URL ? `${WP_URL}/wp-json/wp/v2` : '';

export default initializeWordPress;
