// ============================================
// CyberPress Platform - 新功能导出索引
// ============================================
// 版本: 1.0.0
// 描述: 导出所有新创建的功能模块
// ============================================

// ============================================
// Newsletter Components
// ============================================
export { NewsletterSubscription } from '../newsletter/NewsletterSubscription';

// ============================================
// Toast Components
// ============================================
export {
  ToastProvider,
  useToast,
  useToastHelpers,
  type Toast,
  type ToastType,
} from '../toast/ToastContainer';

// ============================================
// SEO Components
// ============================================
export { SEOMeta, ArticleSEOMeta } from '../seo/SEOMeta';

// ============================================
// Code Components
// ============================================
export {
  CodeShare,
  CodeSnippetCollection,
} from '../code/CodeShare';

// ============================================
// Charts Components
// ============================================
export {
  AnalyticsLineChart,
  AnalyticsBarChart,
  AnalyticsPieChart,
  StatCard,
  MOCK_CHART_DATA,
} from '../charts/AnalyticsChart';

// ============================================
// Modal Components
// ============================================
export {
  ModalProvider,
  useModal,
  showAlert,
  showConfirm,
  showPrompt,
  useCustomModal,
  type ModalOptions,
  type ModalSize,
} from '../modal/ModalSystem';

// ============================================
// Validation Library
// ============================================
export {
  FormValidator,
  ValidationRules,
  CommonSchemas,
  useForm,
  getFieldError,
  hasFieldError,
  type ValidationSchema,
  type ValidationRule,
  type UseFormReturn,
} from '../../lib/validation/form-validator';

// ============================================
// API Client
// ============================================
export {
  ApiClient,
  apiClient,
  authApi,
  userApi,
  postApi,
  commentApi,
  categoryApi,
  tagApi,
  searchApi,
  notificationApi,
  type ApiRequestConfig,
  type ApiResponse,
  type ApiError,
} from '../../lib/api/api-client';

// ============================================
// Enhanced Utils
// ============================================
export {
  cyberUtilsEnhanced,
  // Performance
  debounceEnhanced,
  throttleEnhanced,
  throttleRAF,
  // Cache
  createCache,
  // Async
  retry,
  asyncPool,
  batch,
  // DOM
  waitForElement,
  isInViewport,
  scrollToElement,
  toggleFullScreen,
  // Type Guards
  isNullOrUndefined,
  isEmptyObject,
  isEmptyArray,
  isEmpty,
  // Events
  stopPropagation,
  preventDefault,
  stopEvent,
  // Styles
  cn,
  conditionalClass,
  // Numbers
  formatPercent,
  formatCurrency,
  simplifyNumber,
  // URLs
  buildQueryString,
  parseQueryString,
  updateURLParams,
} from '../../lib/utils/cyber-utils-enhanced';
