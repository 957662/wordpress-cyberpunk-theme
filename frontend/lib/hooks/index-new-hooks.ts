/**
 * 新 Hooks 统一导出
 * 包含所有新创建的 Hooks
 */

// 新创建的 Hooks
export { useClipboard, useClipboardState } from './useClipboard';
export { useClickOutside, useClickOutsideOrEscape } from './useClickOutside';
export {
  useKeyboard,
  useEscape,
  useEnter,
  useHotkeys
} from './useKeyboard';
export {
  useMediaQuery,
  useBreakpoint,
  useDarkMode,
  useReducedMotion,
  usePrintMode,
  useOrientation,
  useDeviceType
} from './useMediaQuery';
export { useNetwork, useOnline } from './useNetwork';
export {
  useAsync,
  useAsyncFn,
  useFetch,
  useAsyncList
} from './useAsync';

// 重新导出所有现有 Hooks
export * from './useDebounce';
export * from './useThrottle';
export * from './useLocalStorage';
export * from './useIntersection';
