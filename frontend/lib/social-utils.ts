/**
 * Social Utils
 * 社交功能相关的工具函数
 */

import type {
  NotificationType,
  ActivityType,
  FeedType,
  SocialActionType,
} from '@/types/social.types';

/**
 * 格式化相对时间
 */
export function formatRelativeTime(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (diffInSeconds < 60) {
    return '刚刚';
  }

  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60) {
    return `${diffInMinutes}分钟前`;
  }

  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) {
    return `${diffInHours}小时前`;
  }

  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays < 7) {
    return `${diffInDays}天前`;
  }

  const diffInWeeks = Math.floor(diffInDays / 7);
  if (diffInWeeks < 4) {
    return `${diffInWeeks}周前`;
  }

  const diffInMonths = Math.floor(diffInDays / 30);
  if (diffInMonths < 12) {
    return `${diffInMonths}个月前`;
  }

  const diffInYears = Math.floor(diffInDays / 365);
  return `${diffInYears}年前`;
}

/**
 * 格式化数字（如：1000 -> 1k）
 */
export function formatNumber(num: number): string {
  if (num < 1000) {
    return num.toString();
  }

  if (num < 1000000) {
    return `${(num / 1000).toFixed(1)}k`;
  }

  if (num < 1000000000) {
    return `${(num / 1000000).toFixed(1)}M`;
  }

  return `${(num / 1000000000).toFixed(1)}B`;
}

/**
 * 获取通知类型对应的图标
 */
export function getNotificationIcon(type: NotificationType): string {
  const iconMap: Record<NotificationType, string> = {
    follow: '👥',
    like: '❤️',
    comment: '💬',
    mention: '@️',
    reply: '↩️',
    bookmark: '🔖',
    system: '⚙️',
    update: '🔄',
  };

  return iconMap[type] || '📢';
}

/**
 * 获取通知类型对应的颜色
 */
export function getNotificationColor(type: NotificationType): string {
  const colorMap: Record<NotificationType, string> = {
    follow: 'purple',
    like: 'rose',
    comment: 'cyan',
    mention: 'blue',
    reply: 'green',
    bookmark: 'amber',
    system: 'slate',
    update: 'indigo',
  };

  return colorMap[type] || 'slate';
}

/**
 * 生成通知标题
 */
export function generateNotificationTitle(
  type: NotificationType,
  actorName?: string
): string {
  const titleMap: Record<NotificationType, string> = {
    follow: '新粉丝',
    like: '收到点赞',
    comment: '新评论',
    mention: '被提及',
    reply: '收到回复',
    bookmark: '文章被收藏',
    system: '系统通知',
    update: '内容更新',
  };

  const baseTitle = titleMap[type] || '通知';
  return actorName ? `${actorName} - ${baseTitle}` : baseTitle;
}

/**
 * 生成通知消息
 */
export function generateNotificationMessage(
  type: NotificationType,
  actorName: string,
  targetTitle?: string
): string {
  const templates: Record<NotificationType, string> = {
    follow: `${actorName} 开始关注你了`,
    like: `${actorName} 赞了你的${targetTitle ? `文章「${targetTitle}」` : '内容'}`,
    comment: `${actorName} 评论了你的文章`,
    mention: `${actorName} 在评论中提到了你`,
    reply: `${actorName} 回复了你的评论`,
    bookmark: `${actorName} 收藏了你的文章`,
    system: `系统通知`,
    update: `你关注的内容有更新`,
  };

  return templates[type] || '新通知';
}

/**
 * 验证用户名
 */
export function validateUsername(username: string): {
  valid: boolean;
  error?: string;
} {
  if (!username || username.length === 0) {
    return { valid: false, error: '用户名不能为空' };
  }

  if (username.length < 3) {
    return { valid: false, error: '用户名至少需要3个字符' };
  }

  if (username.length > 20) {
    return { valid: false, error: '用户名最多20个字符' };
  }

  const usernameRegex = /^[a-zA-Z0-9_-]+$/;
  if (!usernameRegex.test(username)) {
    return { valid: false, error: '用户名只能包含字母、数字、下划线和连字符' };
  }

  return { valid: true };
}

/**
 * 验证显示名称
 */
export function validateDisplayName(displayName: string): {
  valid: boolean;
  error?: string;
} {
  if (!displayName || displayName.length === 0) {
    return { valid: false, error: '显示名称不能为空' };
  }

  if (displayName.length > 50) {
    return { valid: false, error: '显示名称最多50个字符' };
  }

  return { valid: true };
}

/**
 * 截断文本
 */
export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) {
    return text;
  }

  return text.slice(0, maxLength) + '...';
}

/**
 * 检查是否为自己的内容
 */
export function isOwnContent(userId: string, currentUserId?: string): boolean {
  return !!currentUserId && userId === currentUserId;
}

/**
 * 生成分享链接
 */
export function generateShareLink(
  type: 'post' | 'comment' | 'user',
  id: string,
  baseUrl?: string
): string {
  const base = baseUrl || window.location.origin;
  return `${base}/${type}/${id}`;
}

/**
 * 复制到剪贴板
 */
export async function copyToClipboard(text: string): Promise<boolean> {
  try {
    if (navigator.clipboard) {
      await navigator.clipboard.writeText(text);
      return true;
    } else {
      // Fallback for older browsers
      const textArea = document.createElement('textarea');
      textArea.value = text;
      textArea.style.position = 'fixed';
      textArea.style.left = '-999999px';
      document.body.appendChild(textArea);
      textArea.select();
      try {
        document.execCommand('copy');
        textArea.remove();
        return true;
      } catch (error) {
        textArea.remove();
        return false;
      }
    }
  } catch (error) {
    console.error('Failed to copy to clipboard:', error);
    return false;
  }
}

/**
 * 下载文件
 */
export function downloadFile(data: Blob, filename: string): void {
  const url = window.URL.createObjectURL(data);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  window.URL.revokeObjectURL(url);
}

/**
 * 防抖函数
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

    if (timeout) {
      clearTimeout(timeout);
    }
    timeout = setTimeout(later, wait);
  };
}

/**
 * 节流函数
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
 * 生成随机颜色
 */
export function generateRandomColor(): string {
  const colors = [
    '#ef4444', // red
    '#f97316', // orange
    '#f59e0b', // amber
    '#eab308', // yellow
    '#84cc16', // lime
    '#22c55e', // green
    '#10b981', // emerald
    '#14b8a6', // teal
    '#06b6d4', // cyan
    '#0ea5e9', // sky
    '#3b82f6', // blue
    '#6366f1', // indigo
    '#8b5cf6', // violet
    '#a855f7', // purple
    '#d946ef', // fuchsia
    '#ec4899', // pink
    '#f43f5e', // rose
  ];

  return colors[Math.floor(Math.random() * colors.length)];
}

/**
 * 验证 URL
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
 * 从 URL 中提取域名
 */
export function extractDomain(url: string): string {
  try {
    const urlObj = new URL(url);
    return urlObj.hostname;
  } catch {
    return '';
  }
}

/**
 * 格式化文件大小
 */
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes';

  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
}

/**
 * 检查是否为移动设备
 */
export function isMobileDevice(): boolean {
  if (typeof window === 'undefined') return false;
  return window.innerWidth < 768;
}

/**
 * 获取滚动百分比
 */
export function getScrollPercentage(): number {
  if (typeof window === 'undefined') return 0;

  const scrollTop = window.scrollY || document.documentElement.scrollTop;
  const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;

  return scrollHeight > 0 ? (scrollTop / scrollHeight) * 100 : 0;
}
