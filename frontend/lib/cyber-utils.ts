/**
 * CyberPress Platform - 实用工具库
 * 赛博朋克风格的工具函数和辅助方法
 */

/**
 * 格式化数字为赛博朋克风格
 * @param num - 要格式化的数字
 * @param decimals - 小数位数
 */
export function formatCyberNumber(num: number, decimals: number = 2): string {
  if (num >= 1000000) {
    return `${(num / 1000000).toFixed(decimals)}M`;
  }
  if (num >= 1000) {
    return `${(num / 1000).toFixed(decimals)}K`;
  }
  return num.toFixed(decimals);
}

/**
 * 生成赛博朋克风格的唯一ID
 * @param prefix - ID前缀
 */
export function generateCyberId(prefix: string = 'cyber'): string {
  const timestamp = Date.now().toString(36);
  const random = Math.random().toString(36).substring(2, 8);
  return `${prefix}_${timestamp}_${random}`;
}

/**
 * 格式化时间为相对时间（赛博朋克风格）
 * @param date - 日期对象或时间戳
 */
export function formatCyberTime(date: Date | number | string): string {
  const now = Date.now();
  const time = new Date(date).getTime();
  const diff = now - time;

  const seconds = Math.floor(diff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (seconds < 60) return `${seconds}s ago`;
  if (minutes < 60) return `${minutes}m ago`;
  if (hours < 24) return `${hours}h ago`;
  if (days < 7) return `${days}d ago`;

  const formatDate = new Date(time);
  return formatDate.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

/**
 * 创建赛博朋克风格的渐变
 * @param colors - 颜色数组
 * @param angle - 渐变角度
 */
export function createCyberGradient(
  colors: string[],
  angle: number = 135
): string {
  return `linear-gradient(${angle}deg, ${colors.join(', ')})`;
}

/**
 * 生成赛博朋克风格的随机颜色
 * @param variant - 颜色变体
 */
export function getCyberColor(variant: 'cyan' | 'purple' | 'pink' | 'yellow' | 'green'): string {
  const colors = {
    cyan: '#00f0ff',
    purple: '#9d00ff',
    pink: '#ff0080',
    yellow: '#f0ff00',
    green: '#00ff88',
  };
  return colors[variant];
}

/**
 * 创建赛博朋克风格的文本辉光效果
 * @param color - 辉光颜色
 * @param intensity - 辉光强度 (0-1)
 */
export function createCyberGlow(color: string, intensity: number = 0.5): string {
  return `0 0 ${20 * intensity}px ${color}, 0 0 ${40 * intensity}px ${color}`;
}

/**
 * 防抖函数
 * @param func - 要防抖的函数
 * @param wait - 等待时间（毫秒）
 */
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout | null = null;

  return function executedFunction(...args: Parameters<T>) {
    const later = () => {
      timeout = null;
      func(...args);
    };

    if (timeout) clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

/**
 * 节流函数
 * @param func - 要节流的函数
 * @param limit - 限制时间（毫秒）
 */
export function throttle<T extends (...args: any[]) => any>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle: boolean;

  return function executedFunction(...args: Parameters<T>) {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
}

/**
 * 深度克隆对象
 * @param obj - 要克隆的对象
 */
export function deepClone<T>(obj: T): T {
  if (obj === null || typeof obj !== 'object') return obj;
  if (obj instanceof Date) return new Date(obj.getTime()) as T;
  if (obj instanceof Array) return obj.map(item => deepClone(item)) as T;
  if (obj instanceof Object) {
    const clonedObj = {} as T;
    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        clonedObj[key] = deepClone(obj[key]);
      }
    }
    return clonedObj;
  }
  return obj;
}

/**
 * 格式化文件大小为赛博朋克风格
 * @param bytes - 字节数
 */
export function formatCyberFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
}

/**
 * 截断文本为赛博朋克风格
 * @param text - 要截断的文本
 * @param maxLength - 最大长度
 */
export function truncateCyberText(text: string, maxLength: number = 50): string {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
}

/**
 * 验证邮箱地址
 * @param email - 邮箱地址
 */
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * 验证URL
 * @param url - URL地址
 */
export function isValidUrl(url: string): boolean {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}

/**
 * 生成赛博朋克风格的随机字符串
 * @param length - 字符串长度
 */
export function generateCyberString(length: number = 10): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

/**
 * 计算两个颜色之间的插值
 * @param color1 - 起始颜色
 * @param color2 - 结束颜色
 * @param factor - 插值因子 (0-1)
 */
export function interpolateColor(
  color1: string,
  color2: string,
  factor: number
): string {
  const hex2rgb = (hex: string) => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result
      ? {
          r: parseInt(result[1], 16),
          g: parseInt(result[2], 16),
          b: parseInt(result[3], 16),
        }
      : { r: 0, g: 0, b: 0 };
  };

  const rgb1 = hex2rgb(color1);
  const rgb2 = hex2rgb(color2);

  const r = Math.round(rgb1.r + factor * (rgb2.r - rgb1.r));
  const g = Math.round(rgb1.g + factor * (rgb2.g - rgb1.g));
  const b = Math.round(rgb1.b + factor * (rgb2.b - rgb1.b));

  return `rgb(${r}, ${g}, ${b})`;
}

/**
 * 创建赛博朋克风格的动画缓动函数
 * @param type - 缓动类型
 */
export function getEasing(type: 'ease-in' | 'ease-out' | 'ease-in-out' | 'linear'): string {
  const easings = {
    'ease-in': 'cubic-bezier(0.4, 0, 1, 1)',
    'ease-out': 'cubic-bezier(0, 0, 0.2, 1)',
    'ease-in-out': 'cubic-bezier(0.4, 0, 0.2, 1)',
    linear: 'linear',
  };
  return easings[type];
}

/**
 * 格式化货币为赛博朋克风格
 * @param amount - 金额
 * @param currency - 货币符号
 */
export function formatCyberCurrency(amount: number, currency: string = '$'): string {
  return `${currency}${amount.toFixed(2)}`;
}

/**
 * 计算百分比
 * @param value - 当前值
 * @param total - 总值
 */
export function calculatePercentage(value: number, total: number): number {
  if (total === 0) return 0;
  return Math.round((value / total) * 100);
}

/**
 * 创建赛博朋克风格的阴影
 * @param color - 阴影颜色
 * @param blur - 模糊半径
 * @param spread - 扩散半径
 */
export function createCyberShadow(
  color: string = '#00f0ff',
  blur: number = 20,
  spread: number = 0
): string {
  return `0 0 ${blur}px ${spread}px ${color}`;
}

/**
 * 检查是否为暗色模式
 */
export function isDarkMode(): boolean {
  if (typeof window !== 'undefined') {
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  }
  return true; // 默认返回暗色模式（赛博朋克风格）
}

/**
 * 获取随机赛博朋克主题色
 */
export function getRandomCyberColor(): string {
  const colors = ['#00f0ff', '#9d00ff', '#ff0080', '#f0ff00', '#00ff88'];
  return colors[Math.floor(Math.random() * colors.length)];
}

/**
 * 格式化持续时间为赛博朋克风格
 * @param seconds - 秒数
 */
export function formatCyberDuration(seconds: number): string {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = Math.floor(seconds % 60);

  if (hours > 0) {
    return `${hours}h ${minutes}m ${secs}s`;
  }
  if (minutes > 0) {
    return `${minutes}m ${secs}s`;
  }
  return `${secs}s`;
}
