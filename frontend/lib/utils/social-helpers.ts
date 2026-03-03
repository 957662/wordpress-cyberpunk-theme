/**
 * 社交功能辅助函数
 * Social Features Utility Functions
 */

/**
 * 格式化数字 (1000 -> 1K, 1000000 -> 1M)
 */
export function formatNumber(num: number): string {
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1).replace(/\.0$/, '') + 'M';
  }
  if (num >= 1000) {
    return (num / 1000).toFixed(1).replace(/\.0$/, '') + 'K';
  }
  return num.toString();
}

/**
 * 格式化相对时间
 */
export function formatRelativeTime(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (seconds < 60) return '刚刚';
  if (seconds < 3600) return `${Math.floor(seconds / 60)}分钟前`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}小时前`;
  if (seconds < 604800) return `${Math.floor(seconds / 86400)}天前`;
  if (seconds < 2592000) return `${Math.floor(seconds / 604800)}周前`;
  if (seconds < 31536000) return `${Math.floor(seconds / 2592000)}个月前`;

  return `${Math.floor(seconds / 31536000)}年前`;
}

/**
 * 格式化完整日期
 */
export function formatDate(dateString: string, locale = 'zh-CN'): string {
  const date = new Date(dateString);
  return date.toLocaleDateString(locale, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

/**
 * 格式化完整日期时间
 */
export function formatDateTime(dateString: string, locale = 'zh-CN'): string {
  const date = new Date(dateString);
  return date.toLocaleString(locale, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

/**
 * 生成用户资料 URL
 */
export function getUserProfileUrl(username: string): string {
  return `/user/${username}`;
}

/**
 * 生成文章 URL
 */
export function getPostUrl(slug: string): string {
  return `/blog/${slug}`;
}

/**
 * 从文本中提取提及 (@username)
 */
export function extractMentions(text: string): string[] {
  const mentionRegex = /@(\w+)/g;
  const mentions = text.match(mentionRegex);
  return mentions ? mentions.map(m => m.substring(1)) : [];
}

/**
 * 从文本中提取标签 (#tag)
 */
export function extractHashtags(text: string): string[] {
  const hashtagRegex = /#(\w+)/g;
  const hashtags = text.match(hashtagRegex);
  return hashtags ? hashtags.map(h => h.substring(1)) : [];
}

/**
 * 将文本中的提及和标签转换为链接
 */
export function linkifyText(text: string): string {
  // 转换 @mentions
  let linked = text.replace(/@(\w+)/g, '<a href="/user/$1" class="text-cyber-cyan hover:underline">@$1</a>');

  // 转换 #hashtags
  linked = linked.replace(/#(\w+)/g, '<a href="/tags/$1" class="text-cyber-purple hover:underline">#$1</a>');

  // 转换 URLs
  linked = linked.replace(
    /(https?:\/\/[^\s]+)/g,
    '<a href="$1" class="text-cyber-cyan hover:underline" target="_blank" rel="noopener noreferrer">$1</a>'
  );

  return linked;
}

/**
 * 验证用户名格式
 */
export function isValidUsername(username: string): boolean {
  const usernameRegex = /^[a-zA-Z0-9_]{3,30}$/;
  return usernameRegex.test(username);
}

/**
 * 验证 URL 格式
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
 * 截断文本并添加省略号
 */
export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength).trim() + '...';
}

/**
 * 生成随机颜色 (用于头像背景)
 */
export function generateRandomColor(username: string): string {
  const colors = [
    'from-cyber-purple/20 to-cyber-cyan/20',
    'from-cyber-pink/20 to-cyber-purple/20',
    'from-cyber-cyan/20 to-cyber-green/20',
    'from-cyber-yellow/20 to-cyber-pink/20',
    'from-cyber-green/20 to-cyber-cyan/20',
  ];
  const hash = username.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  return colors[hash % colors.length];
}

/**
 * 获取用户头像 URL (带默认值)
 */
export function getUserAvatarUrl(avatarUrl?: string, username?: string): string {
  if (avatarUrl) return avatarUrl;

  // 使用 UI Avatars 生成默认头像
  const encodedUsername = encodeURIComponent(username || 'User');
  return `https://ui-avatars.com/api/?name=${encodedUsername}&background=random&color=fff&size=200`;
}

/**
 * 检查是否为当前用户
 */
export function isCurrentUser(currentUserId: string | undefined, targetUserId: string): boolean {
  return currentUserId === targetUserId;
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

    if (timeout) clearTimeout(timeout);
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
 * 复制文本到剪贴板
 */
export async function copyToClipboard(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch (error) {
    console.error('Failed to copy to clipboard:', error);
    return false;
  }
}

/**
 * 下载文件
 */
export function downloadFile(data: string, filename: string, type = 'text/plain') {
  const blob = new Blob([data], { type });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/**
 * 滚动到元素
 */
export function scrollToElement(elementId: string, offset = 80) {
  const element = document.getElementById(elementId);
  if (element) {
    const top = element.offsetTop - offset;
    window.scrollTo({ top, behavior: 'smooth' });
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

  return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
}

/**
 * 生成分享 URL
 */
export function generateShareUrl(
  platform: 'twitter' | 'facebook' | 'linkedin' | 'email',
  url: string,
  title?: string,
  description?: string
): string {
  const encodedUrl = encodeURIComponent(url);
  const encodedTitle = encodeURIComponent(title || '');
  const encodedDescription = encodeURIComponent(description || '');

  switch (platform) {
    case 'twitter':
      return `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`;

    case 'facebook':
      return `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`;

    case 'linkedin':
      return `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}&title=${encodedTitle}`;

    case 'email':
      return `mailto:?subject=${encodedTitle}&body=${encodedDescription}%0A%0A${encodedUrl}`;

    default:
      return url;
  }
}
