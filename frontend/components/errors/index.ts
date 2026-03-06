/**
 * 错误处理组件统一导出
 */

export { ErrorBoundary, ErrorFallback, useErrorHandler as useErrorBoundary } from './ErrorBoundary';
export {
  ErrorHandler,
  withErrorHandling,
  useErrorHandler,
  useErrorHandler as useAppErrorHandler,
  showErrorToast,
  identifyError,
  ErrorType,
} from './ErrorHandler';
export type { AppError } from './ErrorHandler';
