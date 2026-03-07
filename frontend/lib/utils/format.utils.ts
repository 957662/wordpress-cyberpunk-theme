/**
 * Format Utilities
 * Common formatting functions for dates, numbers, and more
 */

import { format, formatDistanceToNow, differenceInDays, differenceInHours, differenceInMinutes } from 'date-fns';

// ============================================================================
// Date Formatting
// ============================================================================

/**
 * Format date to readable string
 */
export const formatDate = (date: string | Date, formatStr: string = 'MMM d, yyyy'): string => {
  try {
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    return format(dateObj, formatStr);
  } catch (error) {
    console.error('Error formatting date:', error);
    return String(date);
  }
};

/**
 * Format date with time
 */
export const formatDateTime = (date: string | Date): string => {
  return formatDate(date, 'MMM d, yyyy • h:mm a');
};

/**
 * Format date to relative time (e.g., "2 hours ago")
 */
export const formatRelativeTime = (date: string | Date): string => {
  try {
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    return formatDistanceToNow(dateObj, { addSuffix: true });
  } catch (error) {
    console.error('Error formatting relative time:', error);
    return String(date);
  }
};

/**
 * Format date to short form (e.g., "Jan 15, 2024")
 */
export const formatShortDate = (date: string | Date): string => {
  return formatDate(date, 'MMM d, yyyy');
};

/**
 * Format date to long form (e.g., "January 15, 2024")
 */
export const formatLongDate = (date: string | Date): string => {
  return formatDate(date, 'MMMM d, yyyy');
};

/**
 * Format date to ISO string
 */
export const formatISODate = (date: string | Date): string => {
  try {
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    return dateObj.toISOString();
  } catch (error) {
    console.error('Error formatting ISO date:', error);
    return '';
  }
};

/**
 * Smart relative time formatter
 * Returns precise time for recent events, date for older events
 */
export const formatSmartDate = (date: string | Date): string => {
  try {
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    const now = new Date();
    const daysDiff = differenceInDays(now, dateObj);

    // Less than 1 day: show relative time
    if (daysDiff === 0) {
      const hoursDiff = differenceInHours(now, dateObj);
      if (hoursDiff === 0) {
        const minutesDiff = differenceInMinutes(now, dateObj);
        if (minutesDiff < 1) return 'just now';
        return `${minutesDiff} minute${minutesDiff !== 1 ? 's' : ''} ago`;
      }
      return `${hoursDiff} hour${hoursDiff !== 1 ? 's' : ''} ago`;
    }

    // Less than 7 days: show days ago
    if (daysDiff < 7) {
      return `${daysDiff} day${daysDiff !== 1 ? 's' : ''} ago`;
    }

    // More than 7 days: show actual date
    return formatDate(date, 'MMM d, yyyy');
  } catch (error) {
    console.error('Error formatting smart date:', error);
    return String(date);
  }
};

// ============================================================================
// Number Formatting
// ============================================================================

/**
 * Format number with commas
 */
export const formatNumber = (num: number): string => {
  return new Intl.NumberFormat('en-US').format(num);
};

/**
 * Format number with decimal places
 */
export const formatDecimal = (num: number, decimals: number = 2): string => {
  return num.toFixed(decimals);
};

/**
 * Format number with compact notation (e.g., 1.2K, 1.5M)
 */
export const formatCompactNumber = (num: number): string => {
  return new Intl.NumberFormat('en-US', {
    notation: 'compact',
    compactDisplay: 'short',
  }).format(num);
};

/**
 * Format number as ordinal (e.g., 1st, 2nd, 3rd)
 */
export const formatOrdinal = (num: number): string => {
  const suffixes = ['th', 'st', 'nd', 'rd'];
  const value = num % 100;
  const suffix = suffixes[(value - 20) % 10] || suffixes[value] || suffixes[0];
  return `${num}${suffix}`;
};

/**
 * Format percentage
 */
export const formatPercentage = (value: number, decimals: number = 1): string => {
  return `${value.toFixed(decimals)}%`;
};

// ============================================================================
// Currency Formatting
// ============================================================================

/**
 * Format currency
 */
export const formatCurrency = (
  amount: number,
  currency: string = 'USD',
  locale: string = 'en-US'
): string => {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
  }).format(amount);
};

/**
 * Format crypto currency
 */
export const formatCryptoCurrency = (amount: number, symbol: string = '₿'): string => {
  return `${symbol} ${formatNumber(amount)}`;
};

// ============================================================================
// File Size Formatting
// ============================================================================

/**
 * Format file size in human-readable format
 */
export const formatFileSize = (bytes: number): string => {
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  if (bytes === 0) return '0 Bytes';

  const i = Math.floor(Math.log(bytes) / Math.log(1024));
  return `${Math.round(bytes / Math.pow(1024, i) * 100) / 100} ${sizes[i]}`;
};

/**
 * Format bytes to appropriate unit
 */
export const formatBytes = (bytes: number, decimals: number = 2): string => {
  if (bytes === 0) return '0 Bytes';

  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB'];

  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`;
};

// ============================================================================
// String Formatting
// ============================================================================

/**
 * Capitalize first letter
 */
export const capitalize = (str: string): string => {
  return str.charAt(0).toUpperCase() + str.slice(1);
};

/**
 * Capitalize all words
 */
export const capitalizeWords = (str: string): string => {
  return str.replace(/\b\w/g, (char) => char.toUpperCase());
};

/**
 * Convert to title case
 */
export const toTitleCase = (str: string): string => {
  return str
    .toLowerCase()
    .split(' ')
    .map((word) => capitalize(word))
    .join(' ');
};

/**
 * Truncate text with ellipsis
 */
export const truncate = (str: string, maxLength: number, suffix: string = '...'): string => {
  if (str.length <= maxLength) return str;
  return str.substring(0, maxLength - suffix.length) + suffix;
};

/**
 * Slugify string
 */
export const slugify = (str: string): string => {
  return str
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
};

/**
 * Remove special characters
 */
export const removeSpecialChars = (str: string): string => {
  return str.replace(/[^\w\s]/gi, '');
};

/**
 * Generate initials from name
 */
export const getInitials = (name: string, maxLength: number = 2): string => {
  return name
    .split(' ')
    .map((word) => word.charAt(0).toUpperCase())
    .join('')
    .substring(0, maxLength);
};

// ============================================================================
// Phone Formatting
// ============================================================================

/**
 * Format phone number
 */
export const formatPhoneNumber = (phone: string): string => {
  const cleaned = phone.replace(/\D/g, '');
  const match = cleaned.match(/^(\d{1})(\d{3})(\d{3})(\d{4})$/);

  if (match) {
    return `(${match[2]}) ${match[3]}-${match[4]}`;
  }

  return phone;
};

// ============================================================================
// Duration Formatting
// ============================================================================

/**
 * Format duration in seconds to readable format
 */
export const formatDuration = (seconds: number): string => {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = Math.floor(seconds % 60);

  const parts = [];
  if (hours > 0) parts.push(`${hours}h`);
  if (minutes > 0) parts.push(`${minutes}m`);
  if (secs > 0 || parts.length === 0) parts.push(`${secs}s`);

  return parts.join(' ');
};

/**
 * Format reading time
 */
export const formatReadingTime = (minutes: number): string => {
  if (minutes < 1) return 'Less than 1 min read';
  if (minutes === 1) return '1 min read';
  return `${minutes} min read`;
};

// ============================================================================
// Array/List Formatting
// ============================================================================

/**
 * Format array as comma-separated list
 */
export const formatList = (items: string[], conjunction: string = 'and'): string => {
  if (items.length === 0) return '';
  if (items.length === 1) return items[0];
  if (items.length === 2) return items.join(` ${conjunction} `);

  return `${items.slice(0, -1).join(', ')} ${conjunction} ${items[items.length - 1]}`;
};

/**
 * Format array with count limit
 */
export const formatLimitedList = (items: string[], limit: number = 3): string => {
  if (items.length <= limit) return formatList(items);

  return `${items.slice(0, limit).join(', ')} +${items.length - limit} more`;
};

// ============================================================================
// Export All
// ============================================================================

export const formatUtils = {
  date: {
    format: formatDate,
    dateTime: formatDateTime,
    relative: formatRelativeTime,
    short: formatShortDate,
    long: formatLongDate,
    iso: formatISODate,
    smart: formatSmartDate,
  },
  number: {
    format: formatNumber,
    decimal: formatDecimal,
    compact: formatCompactNumber,
    ordinal: formatOrdinal,
    percentage: formatPercentage,
  },
  currency: {
    format: formatCurrency,
    crypto: formatCryptoCurrency,
  },
  file: {
    size: formatFileSize,
    bytes: formatBytes,
  },
  string: {
    capitalize,
    capitalizeWords,
    titleCase: toTitleCase,
    truncate,
    slugify,
    removeSpecialChars,
    getInitials,
  },
  phone: {
    format: formatPhoneNumber,
  },
  duration: {
    format: formatDuration,
    readingTime: formatReadingTime,
  },
  list: {
    format: formatList,
    limited: formatLimitedList,
  },
};
