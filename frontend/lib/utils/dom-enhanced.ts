/**
 * Enhanced DOM Utilities
 * 增强的 DOM 操作工具函数
 */

/**
 * 复制文本到剪贴板
 */
export async function copyToClipboard(text: string): Promise<boolean> {
  try {
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(text);
      return true;
    } else {
      // 兼容性方案
      const textArea = document.createElement('textarea');
      textArea.value = text;
      textArea.style.position = 'fixed';
      textArea.style.left = '-999999px';
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();
      
      try {
        document.execCommand('copy');
        textArea.remove();
        return true;
      } catch (error) {
        console.error('Failed to copy:', error);
        textArea.remove();
        return false;
      }
    }
  } catch (error) {
    console.error('Failed to copy:', error);
    return false;
  }
}

/**
 * 从剪贴板读取文本
 */
export async function readFromClipboard(): Promise<string> {
  try {
    if (navigator.clipboard && window.isSecureContext) {
      return await navigator.clipboard.readText();
    }
    return '';
  } catch (error) {
    console.error('Failed to read from clipboard:', error);
    return '';
  }
}

/**
 * 下载文件
 */
export function downloadFile(data: string | Blob, filename: string, mimeType?: string): void {
  const blob = data instanceof Blob ? data : new Blob([data], { type: mimeType });
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  window.URL.revokeObjectURL(url);
}

/**
 * 下载图片
 */
export async function downloadImage(url: string, filename?: string): Promise<void> {
  try {
    const response = await fetch(url);
    const blob = await response.blob();
    const contentType = response.headers.get('content-type');
    const extension = contentType?.split('/')[1] || 'png';
    const name = filename || `image-${Date.now()}.${extension}`;
    
    downloadFile(blob, name);
  } catch (error) {
    console.error('Failed to download image:', error);
  }
}

/**
 * 元素是否在视口中
 */
export function isInViewport(element: HTMLElement): boolean {
  const rect = element.getBoundingClientRect();
  
  return (
    rect.top >= 0 &&
    rect.left >= 0 &&
    rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
    rect.right <= (window.innerWidth || document.documentElement.clientWidth)
  );
}

/**
 * 元素是否部分在视口中
 */
export function isPartiallyInViewport(element: HTMLElement, threshold = 0): boolean {
  const rect = element.getBoundingClientRect();
  const windowHeight = window.innerHeight || document.documentElement.clientHeight;
  const windowWidth = window.innerWidth || document.documentElement.clientWidth;

  const vertInView = (rect.top <= windowHeight) && ((rect.top + rect.height) >= 0);
  const horInView = (rect.left <= windowWidth) && ((rect.left + rect.width) >= 0);

  return vertInView && horInView;
}

/**
 * 平滑滚动到元素
 */
export function scrollToElement(
  element: HTMLElement,
  offset = 0,
  behavior: ScrollBehavior = 'smooth'
): void {
  const elementPosition = element.getBoundingClientRect().top + window.pageYOffset;
  const offsetPosition = elementPosition - offset;

  window.scrollTo({
    top: offsetPosition,
    behavior,
  });
}

/**
 * 平滑滚动到顶部
 */
export function scrollToTop(behavior: ScrollBehavior = 'smooth'): void {
  window.scrollTo({
    top: 0,
    behavior,
  });
}

/**
 * 平滑滚动到底部
 */
export function scrollToBottom(behavior: ScrollBehavior = 'smooth'): void {
  window.scrollTo({
    top: document.body.scrollHeight,
    behavior,
  });
}

/**
 * 获取元素的滚动位置
 */
export function getScrollPosition(): { x: number; y: number } {
  return {
    x: window.pageXOffset || document.documentElement.scrollLeft,
    y: window.pageYOffset || document.documentElement.scrollTop,
  };
}

/**
 * 设置元素的滚动位置
 */
export function setScrollPosition(x: number, y: number): void {
  window.scrollTo(x, y);
}

/**
 * 获取元素的中心点
 */
export function getElementCenter(element: HTMLElement): { x: number; y: number } {
  const rect = element.getBoundingClientRect();
  return {
    x: rect.left + rect.width / 2,
    y: rect.top + rect.height / 2,
  };
}

/**
 * 元素全屏
 */
export async function requestFullscreen(element: HTMLElement): Promise<void> {
  try {
    if (element.requestFullscreen) {
      await element.requestFullscreen();
    } else if ((element as any).webkitRequestFullscreen) {
      await (element as any).webkitRequestFullscreen();
    } else if ((element as any).mozRequestFullScreen) {
      await (element as any).mozRequestFullScreen();
    } else if ((element as any).msRequestFullscreen) {
      await (element as any).msRequestFullscreen();
    }
  } catch (error) {
    console.error('Failed to request fullscreen:', error);
  }
}

/**
 * 退出全屏
 */
export async function exitFullscreen(): Promise<void> {
  try {
    if (document.exitFullscreen) {
      await document.exitFullscreen();
    } else if ((document as any).webkitExitFullscreen) {
      await (document as any).webkitExitFullscreen();
    } else if ((document as any).mozCancelFullScreen) {
      await (document as any).mozCancelFullScreen();
    } else if ((document as any).msExitFullscreen) {
      await (document as any).msExitFullscreen();
    }
  } catch (error) {
    console.error('Failed to exit fullscreen:', error);
  }
}

/**
 * 检查是否全屏
 */
export function isFullscreen(): boolean {
  return !!(
    document.fullscreenElement ||
    (document as any).webkitFullscreenElement ||
    (document as any).mozFullScreenElement ||
    (document as any).msFullscreenElement
  );
}

/**
 * 打印页面
 */
export function printPage(): void {
  window.print();
}

/**
 * 打印指定元素
 */
export function printElement(elementId: string): void {
  const element = document.getElementById(elementId);
  if (!element) return;

  const printWindow = window.open('', '', 'height=600,width=800');
  if (!printWindow) return;

  printWindow.document.write('<html><head><title>Print</title>');
  printWindow.document.write('</head><body>');
  printWindow.document.write(element.innerHTML);
  printWindow.document.write('</body></html>');
  printWindow.document.close();
  printWindow.focus();
  printWindow.print();
  printWindow.close();
}

/**
 * 获取选中的文本
 */
export function getSelectedText(): string {
  const selection = window.getSelection();
  return selection?.toString() || '';
}

/**
 * 清除选中的文本
 */
export function clearSelection(): void {
  const selection = window.getSelection();
  selection?.removeAllRanges();
}

/**
 * 选择元素的文本
 */
export function selectElementText(element: HTMLElement): void {
  const range = document.createRange();
  range.selectNodeContents(element);
  const selection = window.getSelection();
  selection?.removeAllRanges();
  selection?.addRange(range);
}

/**
 * 获取元素的样式
 */
export function getComputedStyle(element: HTMLElement, property: string): string {
  return window.getComputedStyle(element).getPropertyValue(property);
}

/**
 * 设置元素的样式
 */
export function setElementStyle(
  element: HTMLElement,
  styles: Record<string, string>
): void {
  Object.entries(styles).forEach(([property, value]) => {
    (element.style as any)[property] = value;
  });
}

/**
 * 添加事件监听器
 */
export function addEventListener<K extends keyof WindowEventMap>(
  target: Window | Document | HTMLElement,
  type: K,
  listener: (this: typeof target, ev: WindowEventMap[K]) => any,
  options?: boolean | AddEventListenerOptions
): () => void {
  target.addEventListener(type, listener, options);
  return () => target.removeEventListener(type, listener, options);
}

/**
 * 防抖
 */
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout | null = null;

  return function executedFunction(...args: Parameters<T>) {
    const later = () => {
      timeout = null;
      func(...args);
    };

    if (timeout) {
      clearTimeout(timeout);
    }
    timeout = setTimeout(later, wait);
  };
}

/**
 * 节流
 */
export function throttle<T extends (...args: any[]) => any>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle: boolean;

  return function executedFunction(...args: Parameters<T>) {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
}

/**
 * 检测设备类型
 */
export function getDeviceType(): 'mobile' | 'tablet' | 'desktop' {
  const width = window.innerWidth;

  if (width < 768) return 'mobile';
  if (width < 1024) return 'tablet';
  return 'desktop';
}

/**
 * 检测是否触摸设备
 */
export function isTouchDevice(): boolean {
  return (
    'ontouchstart' in window ||
    navigator.maxTouchPoints > 0 ||
    (navigator as any).msMaxTouchPoints > 0
  );
}

/**
 * 检测是否移动设备
 */
export function isMobileDevice(): boolean {
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
    navigator.userAgent
  );
}

/**
 * 获取浏览器信息
 */
export function getBrowserInfo(): {
  name: string;
  version: string;
} {
  const ua = navigator.userAgent;
  let name = 'Unknown';
  let version = 'Unknown';

  if (/Chrome/.test(ua) && !/Edge|OPR\//.test(ua)) {
    name = 'Chrome';
    version = ua.match(/Chrome\/(\d+)/)?.[1] || '';
  } else if (/Safari/.test(ua) && !/Chrome/.test(ua)) {
    name = 'Safari';
    version = ua.match(/Version\/(\d+)/)?.[1] || '';
  } else if (/Firefox/.test(ua)) {
    name = 'Firefox';
    version = ua.match(/Firefox\/(\d+)/)?.[1] || '';
  } else if (/Edge/.test(ua)) {
    name = 'Edge';
    version = ua.match(/Edge\/(\d+)/)?.[1] || '';
  } else if (/MSIE|Trident/.test(ua)) {
    name = 'Internet Explorer';
    version = ua.match(/(?:MSIE |rv:)(\d+)/)?.[1] || '';
  }

  return { name, version };
}

/**
 * 获取操作系统信息
 */
export function getOSInfo(): string {
  const ua = navigator.userAgent;

  if (/Windows/.test(ua)) return 'Windows';
  if (/Mac/.test(ua)) return 'macOS';
  if (/Linux/.test(ua)) return 'Linux';
  if (/Android/.test(ua)) return 'Android';
  if (/iOS|iPhone|iPad|iPod/.test(ua)) return 'iOS';

  return 'Unknown';
}

export default {
  copyToClipboard,
  readFromClipboard,
  downloadFile,
  downloadImage,
  isInViewport,
  isPartiallyInViewport,
  scrollToElement,
  scrollToTop,
  scrollToBottom,
  getScrollPosition,
  setScrollPosition,
  getElementCenter,
  requestFullscreen,
  exitFullscreen,
  isFullscreen,
  printPage,
  printElement,
  getSelectedText,
  clearSelection,
  selectElementText,
  getComputedStyle,
  setElementStyle,
  addEventListener,
  debounce,
  throttle,
  getDeviceType,
  isTouchDevice,
  isMobileDevice,
  getBrowserInfo,
  getOSInfo,
};
