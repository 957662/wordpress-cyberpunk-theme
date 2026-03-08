/**
 * Cyber Helpers - 赛博朋克风格专用工具函数
 * 提供赛博朋克主题常用的辅助函数
 */

import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * 合并 Tailwind CSS 类名（赛博朋克主题专用）
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * 获取赛博朋克颜色样式
 */
export function getCyberColor(color: 'cyan' | 'purple' | 'pink' | 'green' | 'yellow') {
  const colors = {
    cyan: {
      primary: '#00f0ff',
      bg: 'bg-cyber-cyan',
      text: 'text-cyber-cyan',
      border: 'border-cyber-cyan',
      bgLight: 'bg-cyber-cyan/10',
      bgMedium: 'bg-cyber-cyan/20',
      glow: 'shadow-[0_0_20px_rgba(0,240,255,0.5)]',
      gradient: 'from-cyber-cyan to-cyber-purple',
    },
    purple: {
      primary: '#9d00ff',
      bg: 'bg-cyber-purple',
      text: 'text-cyber-purple',
      border: 'border-cyber-purple',
      bgLight: 'bg-cyber-purple/10',
      bgMedium: 'bg-cyber-purple/20',
      glow: 'shadow-[0_0_20px_rgba(157,0,255,0.5)]',
      gradient: 'from-cyber-purple to-cyber-pink',
    },
    pink: {
      primary: '#ff0080',
      bg: 'bg-cyber-pink',
      text: 'text-cyber-pink',
      border: 'border-cyber-pink',
      bgLight: 'bg-cyber-pink/10',
      bgMedium: 'bg-cyber-pink/20',
      glow: 'shadow-[0_0_20px_rgba(255,0,128,0.5)]',
      gradient: 'from-cyber-pink to-cyber-purple',
    },
    green: {
      primary: '#00ff88',
      bg: 'bg-cyber-green',
      text: 'text-cyber-green',
      border: 'border-cyber-green',
      bgLight: 'bg-cyber-green/10',
      bgMedium: 'bg-cyber-green/20',
      glow: 'shadow-[0_0_20px_rgba(0,255,136,0.5)]',
      gradient: 'from-cyber-green to-cyber-cyan',
    },
    yellow: {
      primary: '#f0ff00',
      bg: 'bg-cyber-yellow',
      text: 'text-cyber-yellow',
      border: 'border-cyber-yellow',
      bgLight: 'bg-cyber-yellow/10',
      bgMedium: 'bg-cyber-yellow/20',
      glow: 'shadow-[0_0_20px_rgba(240,255,0,0.5)]',
      gradient: 'from-cyber-yellow to-cyber-green',
    },
  };

  return colors[color];
}

/**
 * 生成赛博朋克风格随机颜色
 */
export function getRandomCyberColor(): 'cyan' | 'purple' | 'pink' | 'green' | 'yellow' {
  const colors: Array<'cyan' | 'purple' | 'pink' | 'green' | 'yellow'> = ['cyan', 'purple', 'pink', 'green', 'yellow'];
  return colors[Math.floor(Math.random() * colors.length)];
}

/**
 * 格式化文件大小为赛博朋克风格
 */
export function formatCyberFileSize(bytes: number): string {
  const units = ['B', 'KB', 'MB', 'GB', 'TB'];
  const size = Math.floor(Math.log(bytes) / Math.log(1024));
  const formatted = (bytes / Math.pow(1024, size)).toFixed(2);
  return `${formatted} ${units[size]}`;
}

/**
 * 格式化数字为赛博朋克风格（带千分位）
 */
export function formatCyberNumber(num: number): string {
  return new Intl.NumberFormat('zh-CN').format(num);
}

/**
 * 生成赛博朋克风格的进度条颜色
 */
export function getProgressColor(percentage: number): 'cyan' | 'purple' | 'pink' | 'green' | 'yellow' {
  if (percentage >= 100) return 'green';
  if (percentage >= 75) return 'cyan';
  if (percentage >= 50) return 'purple';
  if (percentage >= 25) return 'yellow';
  return 'pink';
}

/**
 * 生成赛博朋克风格的文本效果类名
 */
export function getCyberTextEffect(effect: 'glow' | 'neon' | 'hologram' | 'glitch'): string {
  const effects = {
    glow: 'drop-shadow-[0_0_10px_rgba(0,240,255,0.8)]',
    neon: 'text-shadow-[0_0_10px_#00f0ff,0_0_20px_#00f0ff,0_0_30px_#00f0ff]',
    hologram: 'opacity-80 mix-blend-screen',
    glitch: 'animate-glitch',
  };

  return effects[effect];
}

/**
 * 计算阅读时间（赛博朋克风格）
 */
export function calculateReadingTime(content: string): string {
  const wordsPerMinute = 200;
  const words = content.trim().split(/\s+/).length;
  const minutes = Math.ceil(words / wordsPerMinute);

  if (minutes < 1) return '< 1 分钟';
  if (minutes < 60) return `${minutes} 分钟`;

  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;
  return remainingMinutes > 0 ? `${hours} 小时 ${remainingMinutes} 分钟` : `${hours} 小时`;
}

/**
 * 生成赛博朋克风格的日期格式
 */
export function formatCyberDate(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  const now = new Date();
  const diff = now.getTime() - d.getTime();
  const seconds = Math.floor(diff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (seconds < 60) return '刚刚';
  if (minutes < 60) return `${minutes} 分钟前`;
  if (hours < 24) return `${hours} 小时前`;
  if (days < 7) return `${days} 天前`;

  return d.toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

/**
 * 生成赛博朋克风格的唯一ID
 */
export function generateCyberId(prefix: string = 'cyber'): string {
  const timestamp = Date.now().toString(36);
  const random = Math.random().toString(36).substring(2, 8);
  return `${prefix}_${timestamp}_${random}`.toUpperCase();
}

/**
 * 验证赛博朋克主题颜色
 */
export function isValidCyberColor(color: string): color is 'cyan' | 'purple' | 'pink' | 'green' | 'yellow' {
  return ['cyan', 'purple', 'pink', 'green', 'yellow'].includes(color);
}

/**
 * 获取赛博朋克风格的卡片阴影
 */
export function getCyberShadow(intensity: 'light' | 'medium' | 'heavy' = 'medium', color: 'cyan' | 'purple' | 'pink' | 'green' | 'yellow' = 'cyan'): string {
  const shadows = {
    light: `0 0 10px rgba(${getCyberColorRGB(color)}, 0.3)`,
    medium: `0 0 20px rgba(${getCyberColorRGB(color)}, 0.5)`,
    heavy: `0 0 30px rgba(${getCyberColorRGB(color)}, 0.7)`,
  };

  return shadows[intensity];
}

/**
 * 获取赛博朋克颜色的RGB值
 */
function getCyberColorRGB(color: 'cyan' | 'purple' | 'pink' | 'green' | 'yellow'): string {
  const rgbMap = {
    cyan: '0, 240, 255',
    purple: '157, 0, 255',
    pink: '255, 0, 128',
    green: '0, 255, 136',
    yellow: '240, 255, 0',
  };

  return rgbMap[color];
}

/**
 * 创建赛博朋克风格的渐变背景
 */
export function createCyberGradient(colors: Array<'cyan' | 'purple' | 'pink' | 'green' | 'yellow'>, direction: string = 'to right'): string {
  const hexColors = colors.map(c => getCyberColor(c).primary);
  return `linear-gradient(${direction}, ${hexColors.join(', ')})`;
}

/**
 * 检查是否为赛博朋克主题的暗色模式
 */
export function isCyberDarkMode(): boolean {
  if (typeof window === 'undefined') return true;
  return document.documentElement.classList.contains('dark');
}

/**
 * 获取赛博朋克风格的动画类名
 */
export function getCyberAnimation(animation: 'pulse' | 'spin' | 'ping' | 'bounce' | 'glow'): string {
  const animations = {
    pulse: 'animate-pulse',
    spin: 'animate-spin',
    ping: 'animate-ping',
    bounce: 'animate-bounce',
    glow: 'animate-cyber-glow',
  };

  return animations[animation];
}

/**
 * 格式化赛博朋克风格的货币
 */
export function formatCyberCurrency(amount: number, currency: string = 'CNY'): string {
  return new Intl.NumberFormat('zh-CN', {
    style: 'currency',
    currency,
    minimumFractionDigits: 2,
  }).format(amount);
}

/**
 * 生成赛博朋克风格的URL slug
 */
export function generateCyberSlug(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[\s\W-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

/**
 * 截断文本为赛博朋克风格
 */
export function truncateCyberText(text: string, maxLength: number, suffix: string = '...'): string {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength - suffix.length) + suffix;
}

/**
 * 高亮搜索词（赛博朋克风格）- 返回带标记的字符串
 */
export function highlightCyberSearchTerm(text: string, searchTerm: string): string {
  if (!searchTerm) return text;

  const regex = new RegExp(`(${searchTerm})`, 'gi');
  return text.replace(regex, '<mark class="bg-cyber-cyan/30 text-cyber-cyan px-1 rounded">$1</mark>');
}

/**
 * 导出所有工具函数
 */
export default {
  cn,
  getCyberColor,
  getRandomCyberColor,
  formatCyberFileSize,
  formatCyberNumber,
  getProgressColor,
  getCyberTextEffect,
  calculateReadingTime,
  formatCyberDate,
  generateCyberId,
  isValidCyberColor,
  getCyberShadow,
  createCyberGradient,
  isCyberDarkMode,
  getCyberAnimation,
  formatCyberCurrency,
  generateCyberSlug,
  truncateCyberText,
  highlightCyberSearchTerm,
};
