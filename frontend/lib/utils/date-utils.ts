/**
 * Date Utilities
 * Common date formatting and manipulation functions
 */

import { format, formatDistanceToNow, parseISO, differenceInDays, differenceInHours, differenceInMinutes } from 'date-fns';
import { zhCN } from 'date-fns/locale';

/**
 * Format a date to a localized string
 */
export const formatDate = (
  date: string | Date,
  formatStr: string = 'yyyy-MM-dd'
): string => {
  try {
    const dateObj = typeof date === 'string' ? parseISO(date) : date;
    return format(dateObj, formatStr, { locale: zhCN });
  } catch (error) {
    console.error('Error formatting date:', error);
    return '';
  }
};

/**
 * Format date and time
 */
export const formatDateTime = (
  date: string | Date,
  formatStr: string = 'yyyy-MM-dd HH:mm:ss'
): string => {
  return formatDate(date, formatStr);
};

/**
 * Format time only
 */
export const formatTime = (
  date: string | Date,
  formatStr: string = 'HH:mm:ss'
): string => {
  return formatDate(date, formatStr);
};

/**
 * Get relative time string (e.g., "2 hours ago")
 */
export const getRelativeTime = (date: string | Date): string => {
  try {
    const dateObj = typeof date === 'string' ? parseISO(date) : date;
    return formatDistanceToNow(dateObj, { locale: zhCN, addSuffix: true });
  } catch (error) {
    console.error('Error getting relative time:', error);
    return '';
  }
};

/**
 * Check if a date is today
 */
export const isToday = (date: string | Date): boolean => {
  try {
    const dateObj = typeof date === 'string' ? parseISO(date) : date;
    const today = new Date();
    return (
      dateObj.getDate() === today.getDate() &&
      dateObj.getMonth() === today.getMonth() &&
      dateObj.getFullYear() === today.getFullYear()
    );
  } catch (error) {
    console.error('Error checking if date is today:', error);
    return false;
  }
};

/**
 * Check if a date is this week
 */
export const isThisWeek = (date: string | Date): boolean => {
  try {
    const dateObj = typeof date === 'string' ? parseISO(date) : date;
    const today = new Date();
    const diffDays = differenceInDays(dateObj, today);
    return diffDays >= 0 && diffDays <= 7;
  } catch (error) {
    console.error('Error checking if date is this week:', error);
    return false;
  }
};

/**
 * Calculate reading time for an article
 */
export const calculateReadingTime = (
  content: string,
  wordsPerMinute = 200
): number => {
  const words = content.trim().split(/\s+/).length;
  const minutes = Math.ceil(words / wordsPerMinute);
  return Math.max(1, minutes);
};

/**
 * Format a date range
 */
export const formatDateRange = (
  startDate: string | Date,
  endDate: string | Date,
  formatStr: string = 'yyyy-MM-dd'
): string => {
  try {
    const start = typeof startDate === 'string' ? parseISO(startDate) : startDate;
    const end = typeof endDate === 'string' ? parseISO(endDate) : endDate;
    
    return `${format(start, formatStr, { locale: zhCN })} - ${format(end, formatStr, { locale: zhCN })}`;
  } catch (error) {
    console.error('Error formatting date range:', error);
    return '';
  }
};

/**
 * Get short date format
 */
export const getShortDate = (date: string | Date): string => {
  return formatDate(date, 'MM/dd');
};

/**
 * Get long date format
 */
export const getLongDate = (date: string | Date): string => {
  return formatDate(date, 'yyyy年MM月dd日 EEEE');
};

/**
 * Get time ago in a custom format
 */
export const getTimeAgo = (date: string | Date): string => {
  try {
    const dateObj = typeof date === 'string' ? parseISO(date) : date;
    const now = new Date();
    
    const minutes = differenceInMinutes(now, dateObj);
    const hours = differenceInHours(now, dateObj);
    const days = differenceInDays(now, dateObj);

    if (minutes < 1) {
      return '刚刚';
    } else if (minutes < 60) {
      return `${minutes}分钟前`;
    } else if (hours < 24) {
      return `${hours}小时前`;
    } else if (days < 7) {
      return `${days}天前`;
    } else {
      return getRelativeTime(date);
    }
  } catch (error) {
    console.error('Error getting time ago:', error);
    return '';
  }
};

/**
 * Check if a date is in the past
 */
export const isPast = (date: string | Date): boolean => {
  try {
    const dateObj = typeof date === 'string' ? parseISO(date) : date;
    return dateObj < new Date();
  } catch (error) {
    console.error('Error checking if date is in past:', error);
    return false;
  }
};

/**
 * Check if a date is in the future
 */
export const isFuture = (date: string | Date): boolean => {
  try {
    const dateObj = typeof date === 'string' ? parseISO(date) : date;
    return dateObj > new Date();
  } catch (error) {
    console.error('Error checking if date is in future:', error);
    return false;
  }
};

/**
 * Add days to a date
 */
export const addDays = (date: string | Date, days: number): Date => {
  const dateObj = typeof date === 'string' ? parseISO(date) : date;
  const result = new Date(dateObj);
  result.setDate(result.getDate() + days);
  return result;
};

/**
 * Subtract days from a date
 */
export const subtractDays = (date: string | Date, days: number): Date => {
  return addDays(date, -days);
};

/**
 * Get start of day
 */
export const startOfDay = (date: string | Date): Date => {
  const dateObj = typeof date === 'string' ? parseISO(date) : date;
  const result = new Date(dateObj);
  result.setHours(0, 0, 0, 0);
  return result;
};

/**
 * Get end of day
 */
export const endOfDay = (date: string | Date): Date => {
  const dateObj = typeof date === 'string' ? parseISO(date) : date;
  const result = new Date(dateObj);
  result.setHours(23, 59, 59, 999);
  return result;
};
