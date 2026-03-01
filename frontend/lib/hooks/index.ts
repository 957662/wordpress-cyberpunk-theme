/**
 * Custom Hooks Index
 * 自定义 Hooks 统一导出
 */

// 基础 Hooks
export { useDebounce, useDebouncedCallback } from './useDebounce';
export { useThrottle, useThrottledValue } from './useThrottle';
export { useClickOutside, useEscapeKey, useClickOutsideOrEscape } from './useClickOutside';
export { useCopyToClipboard, fallbackCopyToClipboard } from './useCopyToClipboard';
export { useImageOptimization, usePreloadImages, useLazyLoadImage } from './useImageOptimization';
export { useForm, type UseFormReturn, type FormState, type FieldConfig, type ValidationRule } from './useForm';

// 重新导出已有 hooks
export { useScroll } from '../hooks/useScroll';
export { useMediaQuery } from '../hooks/useMediaQuery';
export { useIntersectionObserver } from '../hooks/useIntersectionObserver';
export { useLocalStorage } from '../hooks/useLocalStorage';

// 新增 Hooks
export { useInView } from './useInView';
export { useKeyboard, useKeyPress, useEscape, useEnter } from './useKeyboard';
