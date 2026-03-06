/**
 * WordPress 客户端初始化
 * 在应用启动时初始化 WordPress 客户端
 */

'use client';

import { createWPClient } from './client';
import { wordpressConfig } from '@/config/wordpress';

let initialized = false;

export function initializeWordPress() {
  if (initialized) {
    return;
  }

  try {
    createWPClient({
      baseURL: wordpressConfig.baseURL,
      timeout: wordpressConfig.timeout,
      auth: wordpressConfig.auth,
    });
    
    initialized = true;
    console.log('WordPress client initialized successfully');
  } catch (error) {
    console.error('Failed to initialize WordPress client:', error);
  }
}

export function isWordPressInitialized(): boolean {
  return initialized;
}
