/**
 * Hooks 导出
 * 统一导出所有自定义 Hooks
 */

// 交叉观察器
export {
  useIntersectionObserver,
  useOnScreen,
  useLazyLoad,
  useViewportState,
  useInfiniteScroll,
  useViewportEvent
} from './useIntersectionObserver';

// 媒体查询
export {
  useMediaQuery,
  useIsMobile,
  useIsTablet,
  useIsDesktop,
  useOrientation,
  useDarkMode,
  useReduceMotion,
  useHighContrast,
  useViewportSize,
  useBreakpoint,
  usePrint,
  useDevicePixelRatio
} from './useMediaQuery';

// 剪贴板
export {
  useClipboard,
  useClipboardRead
} from './useClipboard';

// 本地存储
export {
  useLocalStorage,
  useSessionStorage
} from './useLocalStorage';

// 防抖节流
export {
  useDebounce,
  useThrottle,
  useDebouncedValue
} from './useDebounce';

// 键盘
export {
  useKeyboard,
  useShortcut,
  useKeyPress
} from './useKeyboard';
