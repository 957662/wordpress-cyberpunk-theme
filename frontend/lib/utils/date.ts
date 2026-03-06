/**
 * Date Utilities
 *
 * Helper functions for date formatting and manipulation.
 */

/**
 * Format date to readable string
 */
export function formatDate(date: string | Date): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date;

  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(dateObj);
}

/**
 * Format date to short string (MM/DD/YYYY)
 */
export function formatDateShort(date: string | Date): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date;

  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  }).format(dateObj);
}

/**
 * Format date to relative time (e.g., "2 hours ago")
 */
export function formatRelativeTime(date: string | Date): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - dateObj.getTime()) / 1000);

  const intervals = {
    year: 31536000,
    month: 2592000,
    week: 604800,
    day: 86400,
    hour: 3600,
    minute: 60,
    second: 1,
  };

  for (const [unit, seconds] of Object.entries(intervals)) {
    const interval = Math.floor(diffInSeconds / seconds);
    if (interval >= 1) {
      return `${interval} ${unit}${interval > 1 ? 's' : ''} ago`;
    }
  }

  return 'just now';
}

/**
 * Calculate reading time for content
 */
export function calculateReadingTime(content: string, wordsPerMinute = 200): number {
  const words = content.trim().split(/\s+/).length;
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
 * Check if date is within last N days
 */
export function isWithinDays(date: string | Date, days: number): boolean {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  const now = new Date();
  const diffInDays = Math.floor((now.getTime() - dateObj.getTime()) / (1000 * 60 * 60 * 24));

  return diffInDays <= days && diffInDays >= 0;
}

/**
 * Format date range
 */
export function formatDateRange(startDate: string | Date, endDate: string | Date): string {
  const start = typeof startDate === 'string' ? new Date(startDate) : startDate;
  const end = typeof endDate === 'string' ? new Date(endDate) : endDate;

  const options: Intl.DateTimeFormatOptions = {
    month: 'short',
    day: 'numeric',
  };

  const startFormatted = new Intl.DateTimeFormat('en-US', options).format(start);
  const endFormatted = new Intl.DateTimeFormat('en-US', options).format(end);

  if (start.getMonth() === end.getMonth() && start.getFullYear() === end.getFullYear()) {
    return `${startFormatted} - ${end.getDate()}, ${end.getFullYear()}`;
  }

  return `${startFormatted} - ${endFormatted}`;
}

/**
 * Get current date in ISO format
 */
export function getCurrentDateISO(): string {
  return new Date().toISOString();
}

/**
 * Parse ISO date string
 */
export function parseISODate(dateString: string): Date {
  return new Date(dateString);
}
