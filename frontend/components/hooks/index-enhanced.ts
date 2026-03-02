/**
 * Hooks Index - Enhanced
 * 导出所有自定义 Hooks
 */

// 基础 Hooks
export { useClickOutside } from './useClickOutside';
export { useClipboard } from './useClipboard';
export { useDebounce } from './useDebounce';
export { useIntersection } from './useIntersection';
export { useLocalStorage } from './useLocalStorage';
export { useMediaQuery } from './useMediaQuery';
export { useCopyToClipboard } from './useCopyToClipboard';
export { useIntersectionObserver } from './useIntersectionObserver';
export { useKeyboardShortcut } from './useKeyboardShortcut';
export { useThrottle } from './useThrottle';

// 新增 Hooks
export { useForm } from './useForm';
export { useAsync, useFetch, useMutation } from './useAsync';
export {
  useScroll,
  useScrollTo,
  useInfiniteScroll,
} from './useScroll';
export {
  useBreakpoint,
  useContainerQuery,
  useResponsiveValue,
  useMatchMedia,
} from './useBreakpoint';

// 类型导出
export type { FormField, FormValidators, FormOptions, UseFormReturn } from './useForm';
export type { AsyncState, UseAsyncOptions, UseFetchOptions, MutationOptions } from './useAsync';
export type { ScrollPosition, ScrollState, UseScrollOptions } from './useScroll';
export type { Breakpoints, BreakpointValues } from './useBreakpoint';
