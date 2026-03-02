/**
 * Hooks 导出索引
 */

export { useDebounce } from './useDebounce';
export { useThrottle } from './useThrottle';
export { useKeyboard, shortcuts } from './useKeyboard';
export { useClickOutside } from './useClickOutside';
export { useInView } from './useInView';
export { useCopyToClipboard } from './useCopyToClipboard';
export { useImageZoom } from './useImageZoom';
export {
  useBreakpoint,
  useMatchBreakpoint,
  useIsMobile,
  useIsTablet,
  useIsDesktop,
  breakpoints,
} from './useBreakpoint';
export { useForm } from './useForm';

// 重新导出现有 hooks
export { useScroll } from './useScroll';
export { useMediaQuery } from './useMediaQuery';
export { useIntersectionObserver } from './useIntersectionObserver';
export { useLocalStorage } from './useLocalStorage';

// 新创建的 hooks
export { useElementSize } from './useElementSize';
export type { UseElementSizeReturn } from './useElementSize';

export { useResizeObserver } from './useResizeObserver';
export type { UseResizeObserverReturn } from './useResizeObserver';

export { useMutationObserver } from './useMutationObserver';
export type { UseMutationObserverReturn } from './useMutationObserver';

export { useInfiniteScroll } from './useInfiniteScroll';
export type { UseInfiniteScrollReturn } from './useInfiniteScroll';

export { useVirtualList } from './useVirtualList';
export type { UseVirtualListReturn } from './useVirtualList';

export { useFullscreen } from './useFullscreen';
export type { UseFullscreenReturn, UseFullscreenOptions } from './useFullscreen';

export { useDownload } from './useDownload';
export type { UseDownloadReturn, UseDownloadOptions } from './useDownload';

export { useSpeech } from './useSpeech';
export type { UseSpeechReturn, UseSpeechOptions } from './useSpeech';

export { useNetworkStatus } from './useNetworkStatus';
export type { UseNetworkStatusReturn, NetworkConnection } from './useNetworkStatus';

export { useAsync } from './useAsync';
export type { UseAsyncReturn } from './useAsync';

export { useAnimationFrame } from './useAnimationFrame';
export type { UseAnimationFrameReturn } from './useAnimationFrame';

// 最新创建的 hooks
export { useWindowSize, useBreakpoint as useWindowBreakpoint } from './useWindowSize';
export type { WindowSize, Breakpoint as WindowBreakpoint, BreakpointResult } from './useWindowSize';

export { useOnlineStatus, useOnlineStatusWithRetry } from './useOnlineStatus';
export type { OnlineStatusWithRetry } from './useOnlineStatus';

export { useBattery, useBatteryWithWarning } from './useBattery';
export type { BatteryState, BatteryWithWarning } from './useBattery';

// 新创建的位置和活动检测 hooks
export { useGeolocation, useDistance, useGeolocationWatch } from './useGeolocation';
export type { GeolocationState, GeolocationError, GeolocationOptions } from './useGeolocation';

export { useIdle, useIdleTimeout, useIdleTimer, useActivityDetection } from './useIdle';
export type { IdleOptions } from './useIdle';

// 新创建的高级 hooks
export { useWebSocket, useWebSocketWithAutoReconnect } from './useWebSocket';
export type { UseWebSocketOptions, UseWebSocketReturn, WebSocketMessage } from './useWebSocket';

export { useServiceWorker, useServiceWorkerMessage } from './useServiceWorker';
export type { ServiceWorkerStatus, ServiceWorkerUpdateOptions, ServiceWorkerMessage as SWMessage } from './useServiceWorker';

export { useApi, useMutation, useInfiniteApi } from './useApi';
export type {
  ApiOptions,
  ApiState,
  UseApiReturn,
  UseMutationOptions,
  UseMutationState,
  UseMutationReturn,
  UseInfiniteApiOptions,
  UseInfiniteApiReturn,
} from './useApi';

// WordPress API Hooks
export * from './usePosts';
export * from './useCategories';
export * from './useTags';
export * from './useSearch';
