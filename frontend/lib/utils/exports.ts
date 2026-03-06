/**
 * 工具函数统一导出
 * 解决导入路径不一致问题
 */

// 从各个子模块导入
export { cn } from './cn';
export { cn as classname } from './cn';
export { cn as classnames } from './cn';

// 日期工具
export {
  formatDate,
  formatDateTime,
  formatTime,
  formatDistanceToNow,
  isToday,
  isThisWeek,
  getShortDate,
} from './date-utils';

// 字符串工具
export {
  truncate,
  truncateText,
  capitalize,
  slugify,
  highlightText,
  extractText,
} from './string-utils';

// 数字工具
export {
  formatNumber,
  formatFileSize,
  formatCurrency,
  clamp,
  round,
} from './number-utils';

// 数组工具
export {
  chunk,
  shuffle,
  unique,
  groupBy,
  sortBy,
  filter,
} from './array-utils';

// 对象工具
export {
  deepClone,
  deepMerge,
  isEmpty,
  isObject,
  get,
  set,
  omit,
  pick,
} from './object-utils';

// URL工具
export {
  buildUrl,
  parseUrl,
  buildQueryString,
  parseQueryString,
} from './url-utils';

// 验证工具
export {
  isValidEmail,
  isValidUrl,
  isValidPhone,
  isNumber,
  isString,
} from './validation-utils';

// 防抖节流
export { debounce, throttle } from './debounce';

// 性能工具
export {
  measurePerformance,
  startMeasure,
  endMeasure,
} from './performance-utils';

// 存储工具
export {
  storage,
  cookies,
  sessionStorage,
  localStorage,
} from './storage-utils';

// 默认导出
export default {
  cn,
  classname: cn,
  classnames: cn,
  // 日期
  formatDate,
  formatDateTime,
  formatTime,
  formatDistanceToNow,
  isToday,
  isThisWeek,
  getShortDate,
  // 字符串
  truncate,
  truncateText,
  capitalize,
  slugify,
  highlightText,
  extractText,
  // 数字
  formatNumber,
  formatFileSize,
  formatCurrency,
  clamp,
  round,
  // 数组
  chunk,
  shuffle,
  unique,
  groupBy,
  sortBy,
  filter,
  // 对象
  deepClone,
  deepMerge,
  isEmpty,
  isObject,
  get,
  set,
  omit,
  pick,
  // URL
  buildUrl,
  parseUrl,
  buildQueryString,
  parseQueryString,
  // 验证
  isValidEmail,
  isValidUrl,
  isValidPhone,
  isNumber,
  isString,
  // 性能
  debounce,
  throttle,
  measurePerformance,
  startMeasure,
  endMeasure,
  // 存储
  storage,
  cookies,
  sessionStorage,
  localStorage,
};
