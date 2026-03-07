/**
 * DOM 工具函数库
 */

/**
 * 获取元素
 */
export function getElement<T extends HTMLElement>(selector: string): T | null {
  return document.querySelector<T>(selector);
}

/**
 * 获取多个元素
 */
export function getElements<T extends HTMLElement>(selector: string): NodeListOf<T> {
  return document.querySelectorAll<T>(selector);
}

/**
 * 创建元素
 */
export function createElement<K extends keyof HTMLElementTagNameMap>(
  tagName: K,
  options?: {
    className?: string;
    id?: string;
    innerHTML?: string;
    textContent?: string;
    attributes?: Record<string, string>;
  }
): HTMLElementTagNameMap[K] {
  const element = document.createElement(tagName);

  if (options?.className) {
    element.className = options.className;
  }

  if (options?.id) {
    element.id = options.id;
  }

  if (options?.innerHTML) {
    element.innerHTML = options.innerHTML;
  }

  if (options?.textContent) {
    element.textContent = options.textContent;
  }

  if (options?.attributes) {
    Object.entries(options.attributes).forEach(([key, value]) => {
      element.setAttribute(key, value);
    });
  }

  return element;
}

/**
 * 添加类名
 */
export function addClass(element: HTMLElement, className: string): void {
  element.classList.add(className);
}

/**
 * 移除类名
 */
export function removeClass(element: HTMLElement, className: string): void {
  element.classList.remove(className);
}

/**
 * 切换类名
 */
export function toggleClass(element: HTMLElement, className: string): boolean {
  return element.classList.toggle(className);
}

/**
 * 检查是否有类名
 */
export function hasClass(element: HTMLElement, className: string): boolean {
  return element.classList.contains(className);
}

/**
 * 获取元素的绝对位置
 */
export function getPosition(element: HTMLElement): { top: number; left: number } {
  const rect = element.getBoundingClientRect();
  return {
    top: rect.top + window.scrollY,
    left: rect.left + window.scrollX,
  };
}

/**
 * 获取元素尺寸
 */
export function getSize(element: HTMLElement): { width: number; height: number } {
  const rect = element.getBoundingClientRect();
  return {
    width: rect.width,
    height: rect.height,
  };
}

/**
 * 滚动到元素
 */
export function scrollToElement(
  element: HTMLElement,
  options: ScrollIntoViewOptions = { behavior: 'smooth' }
): void {
  element.scrollIntoView(options);
}

/**
 * 滚动到指定位置
 */
export function scrollTo(
  x: number,
  y: number,
  options: ScrollBehavior = 'smooth'
): void {
  window.scrollTo({
    left: x,
    top: y,
    behavior: options,
  });
}

/**
 * 滚动到顶部
 */
export function scrollToTop(options: ScrollBehavior = 'smooth'): void {
  scrollTo(0, 0, options);
}

/**
 * 滚动到底部
 */
export function scrollToBottom(options: ScrollBehavior = 'smooth'): void {
  scrollTo(0, document.body.scrollHeight, options);
}

/**
 * 获取滚动位置
 */
export function getScrollPosition(): { x: number; y: number } {
  return {
    x: window.scrollX || window.pageXOffset,
    y: window.scrollY || window.pageYOffset,
  };
}

/**
 * 获取窗口尺寸
 */
export function getWindowSize(): { width: number; height: number } {
  return {
    width: window.innerWidth,
    height: window.innerHeight,
  };
}

/**
 * 获取视口尺寸
 */
export function getViewportSize(): { width: number; height: number } {
  return {
    width: document.documentElement.clientWidth,
    height: document.documentElement.clientHeight,
  };
}

/**
 * 检查元素是否在视口中
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
 * 检查元素是否部分在视口中
 */
export function isPartiallyInViewport(element: HTMLElement): boolean {
  const rect = element.getBoundingClientRect();
  return (
    rect.top < (window.innerHeight || document.documentElement.clientHeight) &&
    rect.bottom > 0 &&
    rect.right > 0 &&
    rect.left < (window.innerWidth || document.documentElement.clientWidth)
  );
}

/**
 * 复制文本到剪贴板
 */
export async function copyToClipboard(text: string): Promise<boolean> {
  try {
    if (navigator.clipboard) {
      await navigator.clipboard.writeText(text);
      return true;
    } else {
      // 降级方案
      const textArea = document.createElement('textarea');
      textArea.value = text;
      textArea.style.position = 'fixed';
      textArea.style.left = '-999999px';
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();
      const successful = document.execCommand('copy');
      document.body.removeChild(textArea);
      return successful;
    }
  } catch {
    return false;
  }
}

/**
 * 从剪贴板读取文本
 */
export async function readFromClipboard(): Promise<string> {
  try {
    if (navigator.clipboard) {
      return await navigator.clipboard.readText();
    }
    return '';
  } catch {
    return '';
  }
}

/**
 * 下载文件
 */
export function downloadFile(blob: Blob, filename: string): void {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

/**
 * 下载文本为文件
 */
export function downloadText(text: string, filename: string, mimeType: string = 'text/plain'): void {
  const blob = new Blob([text], { type: mimeType });
  downloadFile(blob, filename);
}

/**
 * 打印页面
 */
export function print(): void {
  window.print();
}

/**
 * 全屏
 */
export function requestFullscreen(element: HTMLElement = document.documentElement): Promise<void> {
  return element.requestFullscreen();
}

/**
 * 退出全屏
 */
export function exitFullscreen(): Promise<void> {
  return document.exitFullscreen();
}

/**
 * 检查是否全屏
 */
export function isFullscreen(): boolean {
  return document.fullscreenElement !== null;
}

/**
 * 添加事件监听
 */
export function addEventListener<K extends keyof HTMLElementEventMap>(
  element: HTMLElement,
  type: K,
  listener: (this: HTMLElement, ev: HTMLElementEventMap[K]) => any,
  options?: boolean | AddEventListenerOptions
): void {
  element.addEventListener(type, listener, options);
}

/**
 * 移除事件监听
 */
export function removeEventListener<K extends keyof HTMLElementEventMap>(
  element: HTMLElement,
  type: K,
  listener: (this: HTMLElement, ev: HTMLElementEventMap[K]) => any,
  options?: boolean | EventListenerOptions
): void {
  element.removeEventListener(type, listener, options);
}

/**
 * 获取选中的文本
 */
export function getSelectionText(): string {
  const selection = window.getSelection();
  return selection ? selection.toString() : '';
}

/**
 * 获取设备像素比
 */
export function getDevicePixelRatio(): number {
  return window.devicePixelRatio || 1;
}

/**
 * 获取触摸支持
 */
export function isTouchDevice(): boolean {
  return 'ontouchstart' in window || navigator.maxTouchPoints > 0;
}

/**
 * 获取移动设备
 */
export function isMobile(): boolean {
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
}
