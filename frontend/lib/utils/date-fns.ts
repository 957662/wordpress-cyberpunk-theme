/**
 * Date utilities for CyberPress Platform
 * Enhanced date formatting and manipulation utilities
 */

/**
 * Format date to relative time string (e.g., "2 hours ago", "3 days ago")
 */
export function formatRelativeTime(date: Date | string | number): string {
  const now = new Date();
  const target = new Date(date);
  const diffInSeconds = Math.floor((now.getTime() - target.getTime()) / 1000);

  if (diffInSeconds < 60) {
    return 'just now';
  }

  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60) {
    return `${diffInMinutes} minute${diffInMinutes > 1 ? 's' : ''} ago`;
  }

  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) {
    return `${diffInHours} hour${diffInHours > 1 ? 's' : ''} ago`;
  }

  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays < 7) {
    return `${diffInDays} day${diffInDays > 1 ? 's' : ''} ago`;
  }

  const diffInWeeks = Math.floor(diffInDays / 7);
  if (diffInWeeks < 4) {
    return `${diffInWeeks} week${diffInWeeks > 1 ? 's' : ''} ago`;
  }

  const diffInMonths = Math.floor(diffInDays / 30);
  if (diffInMonths < 12) {
    return `${diffInMonths} month${diffInMonths > 1 ? 's' : ''} ago`;
  }

  const diffInYears = Math.floor(diffInDays / 365);
  return `${diffInYears} year${diffInYears > 1 ? 's' : ''} ago`;
}

/**
 * Format date to locale string with custom options
 */
export function formatDateTime(
  date: Date | string | number,
  options?: Intl.DateTimeFormatOptions
): string {
  const target = new Date(date);
  const defaultOptions: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  };

  return target.toLocaleDateString('en-US', { ...defaultOptions, ...options });
}

/**
 * Format date to short string (e.g., "Jan 15, 2024")
 */
export function formatShortDate(date: Date | string | number): string {
  const target = new Date(date);
  return target.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

/**
 * Format date to long string (e.g., "January 15, 2024 at 2:30 PM")
 */
export function formatLongDate(date: Date | string | number): string {
  const target = new Date(date);
  return target.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  });
}

/**
 * Get time ago in seconds, minutes, hours, or days
 */
export function getTimeAgo(date: Date | string | number): {
  value: number;
  unit: 'second' | 'minute' | 'hour' | 'day';
} {
  const now = new Date();
  const target = new Date(date);
  const diffInSeconds = Math.floor((now.getTime() - target.getTime()) / 1000);

  if (diffInSeconds < 60) {
    return { value: diffInSeconds, unit: 'second' };
  }

  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60) {
    return { value: diffInMinutes, unit: 'minute' };
  }

  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) {
    return { value: diffInHours, unit: 'hour' };
  }

  const diffInDays = Math.floor(diffInHours / 24);
  return { value: diffInDays, unit: 'day' };
}

/**
 * Check if date is today
 */
export function isToday(date: Date | string | number): boolean {
  const target = new Date(date);
  const today = new Date();

  return (
    target.getDate() === today.getDate() &&
    target.getMonth() === today.getMonth() &&
    target.getFullYear() === today.getFullYear()
  );
}

/**
 * Check if date is yesterday
 */
export function isYesterday(date: Date | string | number): boolean {
  const target = new Date(date);
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);

  return (
    target.getDate() === yesterday.getDate() &&
    target.getMonth() === yesterday.getMonth() &&
    target.getFullYear() === yesterday.getFullYear()
  );
}

/**
 * Check if date is this week
 */
export function isThisWeek(date: Date | string | number): boolean {
  const target = new Date(date);
  const today = new Date();
  const startOfWeek = new Date(today);
  startOfWeek.setDate(today.getDate() - today.getDay());

  const endOfWeek = new Date(startOfWeek);
  endOfWeek.setDate(startOfWeek.getDate() + 6);

  return target >= startOfWeek && target <= endOfWeek;
}

/**
 * Check if date is this year
 */
export function isThisYear(date: Date | string | number): boolean {
  const target = new Date(date);
  const today = new Date();

  return target.getFullYear() === today.getFullYear();
}

/**
 * Add days to date
 */
export function addDays(date: Date | string | number, days: number): Date {
  const target = new Date(date);
  target.setDate(target.getDate() + days);
  return target;
}

/**
 * Subtract days from date
 */
export function subtractDays(date: Date | string | number, days: number): Date {
  return addDays(date, -days);
}

/**
 * Get start of day
 */
export function startOfDay(date: Date | string | number): Date {
  const target = new Date(date);
  target.setHours(0, 0, 0, 0);
  return target;
}

/**
 * Get end of day
 */
export function endOfDay(date: Date | string | number): Date {
  const target = new Date(date);
  target.setHours(23, 59, 59, 999);
  return target;
}

/**
 * Get difference in days between two dates
 */
export function differenceInDays(
  dateLeft: Date | string | number,
  dateRight: Date | string | number
): number {
  const left = new Date(dateLeft);
  const right = new Date(dateRight);
  const diffInMs = left.getTime() - right.getTime();
  return Math.floor(diffInMs / (1000 * 60 * 60 * 24));
}

/**
 * Format duration in seconds to human readable string
 */
export function formatDuration(seconds: number): string {
  if (seconds < 60) {
    return `${seconds}s`;
  }

  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) {
    return `${minutes}m`;
  }

  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;
  if (hours < 24) {
    return remainingMinutes > 0 ? `${hours}h ${remainingMinutes}m` : `${hours}h`;
  }

  const days = Math.floor(hours / 24);
  const remainingHours = hours % 24;
  if (remainingHours > 0) {
    return `${days}d ${remainingHours}h`;
  }
  return `${days}d`;
}

/**
 * Parse ISO string to Date object safely
 */
export function parseISO(dateString: string): Date | null {
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) {
      return null;
    }
    return date;
  } catch {
    return null;
  }
}

/**
 * Convert Date to ISO string safely
 */
export function toISOString(date: Date | string | number): string | null {
  try {
    const target = new Date(date);
    if (isNaN(target.getTime())) {
      return null;
    }
    return target.toISOString();
  } catch {
    return null;
  }
}

/**
 * Get calendar date format (e.g., "Today at 2:30 PM", "Yesterday at 2:30 PM", "Jan 15 at 2:30 PM")
 */
export function formatCalendarDate(date: Date | string | number): string {
  const target = new Date(date);

  if (isToday(target)) {
    return `Today at ${target.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
    })}`;
  }

  if (isYesterday(target)) {
    return `Yesterday at ${target.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
    })}`;
  }

  return target.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  });
}
