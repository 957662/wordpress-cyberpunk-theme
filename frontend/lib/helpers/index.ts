/**
 * Helper Functions Index
 * 辅助函数统一导出
 */

// SEO Helpers
export {
  generateMetadata,
  generateStructuredData,
  generateBreadcrumbSchema,
  slugify,
  calculateReadingTime,
  createExcerpt,
} from './seo-helper';

// Format Helpers
export {
  formatDate,
  formatRelativeTime,
  formatNumber,
  formatFileSize,
  formatCurrency,
  formatPercentage,
  truncateText,
  highlightKeywords,
  capitalize,
  camelToKebab,
  kebabToCamel,
  randomColor,
  getContrastColor,
} from './format-helper';

// Re-export from utils
export {
  cn,
  formatDate as formatDateUtil,
  formatRelativeTime as formatRelativeTimeUtil,
  formatNumber as formatNumberUtil,
  truncateText as truncateTextUtil,
  generateId,
  deepClone,
  debounce,
  throttle,
  sleep,
} from '../utils';
