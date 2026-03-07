/**
 * Utility Functions - Unified Export
 *
 * This file exports all utility functions and ensures backwards compatibility
 */

// Export cn function
export { cn } from './cn';

// Re-export from index for backwards compatibility
export * from './index';

// Backwards compatibility exports
export { cn as classname } from './cn';
export { cn as classNames } from './cn';

// Export commonly used utilities
export { formatDate, formatDateShort, formatRelativeTime } from './date';
export { clsx, type ClassValue } from 'clsx';
export { twMerge } from 'tailwind-merge';
