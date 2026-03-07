/**
 * New Components and Utilities Export Index
 * 新组件和工具导出索引
 *
 * @version 2.0.0
 * @date 2026-03-07
 */

// ============ Performance Monitoring ============
export {
  useCriticalPerformanceMonitor,
  useRenderTime,
  default as performanceMonitor
} from '../lib/performance/critical-performance-monitor';

// ============ API Client ============
export {
  createWordPressClient,
  default as WordPressAPIClient
} from '../lib/api/wordpress-api-client';
export type {
  WPPost,
  WPCategory,
  WPTag,
  WPAuthor,
  WPMedia,
  WPComment,
  WPParams,
  WPResponse
} from '../lib/api/wordpress-api-client';

// ============ Blog Components ============
export { BlogAdvancedList } from './blog/advanced/BlogAdvancedList';
export type { Post as BlogAdvancedPost } from './blog/advanced/BlogAdvancedList';

// ============ SEO Components ============
export {
  SEOMetadata,
  generateArticleStructuredData,
  generateWebsiteStructuredData,
  generateBreadcrumbStructuredData
} from './seo/SEOMetadata';
export type { SEOProps } from './seo/SEOMetadata';

// ============ Error Handling ============
export {
  AdvancedErrorBoundary,
  useErrorBoundary,
  withErrorBoundary
} from './errors/AdvancedErrorBoundary';

// ============ Image Components ============
export {
  AdvancedImage,
  ImageGallery
} from './images/AdvancedImage';
export type {
  AdvancedImageProps,
  ImageGalleryProps
} from './images/AdvancedImage';

// ============ Utility Functions ============
export {
  // String utilities
  truncateText,
  capitalize,
  toCamelCase,
  toSnakeCase,
  generateRandomString,
  highlightKeywords,

  // Number utilities
  formatNumber,
  formatFileSize,
  formatPercentage,
  randomInRange,
  animateNumber,

  // Date utilities
  formatRelativeTime,
  formatDate,
  getDateRange,

  // Array utilities
  uniqueArray,
  groupBy,
  sortBy,
  chunkArray,
  shuffleArray,

  // Object utilities
  deepClone,
  deepMerge,
  getNestedValue,

  // Validation utilities
  isValidEmail,
  isValidURL,
  isValidPhoneNumber,
  isValidIDCard,

  // Color utilities
  adjustColorBrightness,
  rgbToHex,
  hexToRgb,

  // Storage utilities
  storage,

  // Clipboard utilities
  copyToClipboard,

  // File utilities
  downloadFile,
  readFile
} from '../lib/utils/advanced-utils';

// ============ React Hooks ============
export {
  // State management
  useLocalStorage,
  useToggle,
  useCounter,
  useArray,

  // Side effects
  useDebounce,
  useThrottle,
  useAsync,
  useFetch,
  useInterval,
  useTimeout,

  // UI interactions
  useMediaQuery,
  useClickOutside,
  useKeyboard,
  useScroll,
  useOnScreen,

  // Measurements
  useMeasure,
  useWindowSize,

  // Browser APIs
  useCopyToClipboard,
  useGeolocation,
  useNetworkStatus,
  usePrevious
} from '../hooks/advanced/useAdvancedHooks';

/**
 * @example Quick import example
 *
 * ```tsx
 * // Import all new components and utilities
 * import {
 *   BlogAdvancedList,
 *   AdvancedImage,
 *   SEOMetadata,
 *   AdvancedErrorBoundary,
 *   useLocalStorage,
 *   formatRelativeTime
 * } from '@/components/NEW_EXPORTS_INDEX';
 *
 * // Import specific types
 * import type {
 *   BlogAdvancedPost,
 *   AdvancedImageProps,
 *   SEOProps
 * } from '@/components/NEW_EXPORTS_INDEX';
 * ```
 */
