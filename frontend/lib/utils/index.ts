/**
 * Utility Functions Index
 * 统一导出所有工具函数
 */

// Classname utility
export { cn } from './cn';

// Date utilities
export {
  formatDate,
  formatDateShort,
  formatRelativeTime,
  calculateReadingTime,
  isToday,
  isWithinDays,
  formatDateRange,
  getCurrentDateISO,
  parseISODate,
  getStartOfDay,
  getEndOfDay,
  addDays,
  addMonths,
  addYears,
  getDaysDiff,
  isLeapYear,
  getDaysInMonth,
  getWeekday,
} from './date';

// Format utilities
export {
  formatFullDate,
  formatNumber,
  formatFileSize,
  formatReadingTime,
  truncateText,
  stripHtmlTags,
  escapeHtml,
  generateSlug,
  highlightSearchTerm,
  formatPercentage,
  formatCurrency,
} from './format';

// Validation utilities
export {
  isValidEmail,
  isValidUrl,
  isValidPhoneNumber,
  isValidUsername,
  isValidPassword,
  isValidSlug,
  isValidIP,
  isValidHexColor,
  isValidIDCard,
  isValidBankCard,
  isValidPostalCode,
  isValidQQ,
  isValidWechat,
  isValidFileSize,
  isValidFileType,
  isValidLength,
  isInRange,
  isEmpty,
  hasRequiredFields,
} from './validation';

// Storage utilities
export { storage, sessionStorage, cookie, indexedDB } from './storage';

// Re-export commonly used utilities from external packages
export { clsx, type ClassValue } from 'clsx';
export { twMerge } from 'tailwind-merge';
