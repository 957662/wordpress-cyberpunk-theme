/**
 * Date Utilities
 *
 * Helper functions for date formatting and manipulation
 */

import { format, formatDistanceToNow, differenceInDays } from 'date-fns';
import { zhCN } from 'date-fns/locale';

/**
 * Format date to readable string
 */
export function formatDate(date: string | Date, formatStr: string = 'PPP'): string {
  try {
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    return format(dateObj, formatStr, { locale: zhCN });
  } catch (error) {
    console.error('Error formatting date:', error);
    return String(date);
  }
}

/**
 * Format date relative to now (e.g., "2 hours ago")
 */
export function formatRelativeTime(date: string | Date): string {
  try {
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    return formatDistanceToNow(dateObj, { addSuffix: true, locale: zhCN });
  } catch (error) {
    console.error('Error formatting relative time:', error);
    return String(date);
  }
}

/**
 * Format date in a smart way (relative if recent, absolute if old)
 */
export function formatSmartDate(date: string | Date): string {
  try {
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    const now = new Date();
    const daysDiff = differenceInDays(now, dateObj);

    // Use relative time for dates within 7 days
    if (daysDiff < 7) {
      return formatRelativeTime(dateObj);
    }

    // Use absolute format for older dates
    return formatDate(dateObj, 'yyyy-MM-dd');
  } catch (error) {
    console.error('Error formatting smart date:', error);
    return String(date);
  }
}

/**
 * Calculate reading time for content
 */
export function calculateReadingTime(content: string, wordsPerMinute: number = 200): number {
  // Remove HTML tags and count words
  const text = content.replace(/<[^>]*>/g, '');
  const words = text.trim().split(/\s+/).length;
  const minutes = Math.ceil(words / wordsPerMinute);
  return Math.max(1, minutes);
}

/**
 * Check if date is today
 */
export function isToday(date: string | Date): boolean {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  const today = new Date();
  return (
    dateObj.getDate() === today.getDate() &&
    dateObj.getMonth() === today.getMonth() &&
    dateObj.getFullYear() === today.getFullYear()
  );
}

/**
 * Check if date is yesterday
 */
export function isYesterday(date: string | Date): boolean {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  return (
    dateObj.getDate() === yesterday.getDate() &&
    dateObj.getMonth() === yesterday.getMonth() &&
    dateObj.getFullYear() === yesterday.getFullYear()
  );
}

/**
 * Format date as "Today", "Yesterday", or date string
 */
export function formatFriendlyDate(date: string | Date): string {
  if (isToday(date)) return '今天';
  if (isYesterday(date)) return '昨天';
  return formatDate(date, 'yyyy-MM-dd');
}
