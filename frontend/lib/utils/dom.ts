/**
 * DOM 操作工具函数
 */

/**
 * 获取元素
 */
export function getElement<T extends HTMLElement = HTMLElement>(
  selector: string
): T | null {
  return document.querySelector<T>(selector);
}

/**
 * 获取所有元素
 */
export function getAllElements<T extends HTMLElement = HTMLElement>(
  selector: string
): NodeListOf<T> {
  return document.querySelectorAll<T>(selector);
}

/**
 * 创建元素
 */
export function createElement<K extends keyof HTMLElementTagNameMap>(
  tag: K,
  attributes?: Record<string, string>,
  children?: (string | Node)[]
): HTMLElementTagNameMap[K] {
  const element = document.createElement(tag);

  if (attributes) {
    Object.entries(attributes).forEach(([key, value]) => {
      if (key === 'className') {
        element.className = value;
      } else if (key === 'innerHTML') {
        element.innerHTML = value;
      } else if (key in element) {
        (element as any)[key] = value;
      } else {
        element.setAttribute(key, value);
      }
    });
  }

  if (children) {
    children.forEach((child) => {
      if (typeof child === 'string') {
        element.appendChild(document.createTextNode(child));
      } else {
        element.appendChild(child);
      }
    });
  }

  return element;
}

/**
 * 添加类名
 */
export function addClass(element: HTMLElement, ...classes: string[]): void {
  element.classList.add(...classes);
}

/**
 * 移除类名
 */
export function removeClass(element: HTMLElement, ...classes: string[]): void {
  element.classList.remove(...classes);
}

/**
 * 切换类名
 */
export function toggleClass(
  element: HTMLElement,
  className: string,
  force?: boolean
): boolean {
  return element.classList.toggle(className, force);
}

/**
 * 检查类名
 */
export function hasClass(element: HTMLElement, className: string): boolean {
  return element.classList.contains(className);
}

/**
 * 获取元素位置
 */
export function getPosition(element: HTMLElement): { x: number; y: number } {
  return {
    x: element.offsetLeft,
    y: element.offsetTop
  };
}

/**
 * 获取元素尺寸
 */
export function getSize(element: HTMLElement): { width: number; height: number } {
  return {
    width: element.offsetWidth,
    height: element.offsetHeight
  };
}

/**
 * 获取元素边界
 */
export function getBounds(element: HTMLElement): DOMRect {
  return element.getBoundingClientRect();
}

/**
 * 获取滚动位置
 */
export function getScrollPosition(): { x: number; y: number } {
  return {
    x: window.pageXOffset || document.documentElement.scrollLeft,
    y: window.pageYOffset || document.documentElement.scrollTop
  };
}

/**
 * 设置滚动位置
 */
export function setScrollPosition(x: number, y: number): void {
  window.scrollTo(x, y);
}

/**
 * 平滑滚动到元素
 */
export function scrollToElement(
  element: HTMLElement,
  options: ScrollIntoViewOptions = { behavior: 'smooth' }
): void {
  element.scrollIntoView(options);
}

/**
 * 平滑滚动到顶部
 */
export function scrollToTop(smooth: boolean = true): void {
  window.scrollTo({
    top: 0,
    behavior: smooth ? 'smooth' : 'auto'
  });
}

/**
 * 平滑滚动到底部
 */
export function scrollToBottom(smooth: boolean = true): void {
  window.scrollTo({
    top: document.documentElement.scrollHeight,
    behavior: smooth ? 'smooth' : 'auto'
  });
}

/**
 * 获取视口尺寸
 */
export function getViewportSize(): { width: number; height: number } {
  return {
    width: window.innerWidth,
    height: window.innerHeight
  };
}

/**
 * 检查元素是否在视口中
 */
export function isInViewport(element: HTMLElement): boolean {
  const rect = element.getBoundingClientRect();
  const viewport = getViewportSize();

  return (
    rect.top >= 0 &&
    rect.left >= 0 &&
    rect.bottom <= viewport.height &&
    rect.right <= viewport.width
  );
}

/**
 * 检查元素是否部分在视口中
 */
export function isPartiallyInViewport(
  element: HTMLElement,
  threshold: number = 0
): boolean {
  const rect = element.getBoundingClientRect();
  const viewport = getViewportSize();

  const isVisible =
    rect.top < viewport.height - threshold &&
    rect.bottom > threshold &&
    rect.left < viewport.width - threshold &&
    rect.right > threshold;

  return isVisible;
}

/**
 * 添加事件监听
 */
export function addEventListener<K extends keyof HTMLElementEventMap>(
  element: HTMLElement,
  event: K,
  handler: (event: HTMLElementEventMap[K]) => void,
  options?: AddEventListenerOptions
): () => void {
  element.addEventListener(event, handler, options);

  // 返回清理函数
  return () => {
    element.removeEventListener(event, handler, options);
  };
}

/**
 * 添加窗口事件监听
 */
export function addWindowEventListener<K extends keyof WindowEventMap>(
  event: K,
  handler: (event: WindowEventMap[K]) => void,
  options?: AddEventListenerOptions
): () => void {
  window.addEventListener(event, handler, options);

  return () => {
    window.removeEventListener(event, handler, options);
  };
}

/**
 * 添加文档事件监听
 */
export function addDocumentEventListener<K extends keyof DocumentEventMap>(
  event: K,
  handler: (event: DocumentEventMap[K]) => void,
  options?: AddEventListenerOptions
): () => void {
  document.addEventListener(event, handler, options);

  return () => {
    document.removeEventListener(event, handler, options);
  };
}

/**
 * 触发自定义事件
 */
export function dispatchCustomEvent(
  element: HTMLElement | Document | Window,
  eventName: string,
  detail?: any
): void {
  const event = new CustomEvent(eventName, { detail });
  element.dispatchEvent(event);
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
      const textarea = document.createElement('textarea');
      textarea.value = text;
      textarea.style.position = 'fixed';
      textarea.style.opacity = '0';
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
      return true;
    }
  } catch (error) {
    console.error('Copy to clipboard failed:', error);
    return false;
  }
}

/**
 * 从剪贴板读取
 */
export async function readFromClipboard(): Promise<string> {
  try {
    if (navigator.clipboard) {
      return await navigator.clipboard.readText();
    } else {
      throw new Error('Clipboard API not available');
    }
  } catch (error) {
    console.error('Read from clipboard failed:', error);
    return '';
  }
}

/**
 * 下载文件
 */
export function downloadFile(blob: Blob, filename: string): void {
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/**
 * 下载图片
 */
export async function downloadImage(url: string, filename: string): Promise<void> {
  try {
    const response = await fetch(url);
    const blob = await response.blob();
    downloadFile(blob, filename);
  } catch (error) {
    console.error('Download image failed:', error);
  }
}

/**
 * 获取选中的文本
 */
export function getSelectedText(): string {
  return window.getSelection()?.toString() || '';
}

/**
 * 清除选中的文本
 */
export function clearSelection(): void {
  window.getSelection()?.removeAllRanges();
}

/**
 * 全选文本
 */
export function selectAll(element: HTMLElement): void {
  const range = document.createRange();
  range.selectNodeContents(element);
  const selection = window.getSelection();
  selection?.removeAllRanges();
  selection?.addRange(range);
}

/**
 * 获取元素的计算样式
 */
export function getComputedStyle(
  element: HTMLElement,
  property: string
): string {
  return window.getComputedStyle(element).getPropertyValue(property);
}

/**
 * 设置元素样式
 */
export function setStyle(
  element: HTMLElement,
  styles: Partial<CSSStyleDeclaration>
): void {
  Object.entries(styles).forEach(([property, value]) => {
    if (value !== undefined) {
      (element.style as any)[property] = value;
    }
  });
}

/**
 * 显示元素
 */
export function showElement(element: HTMLElement, display: string = 'block'): void {
  element.style.display = display;
}

/**
 * 隐藏元素
 */
export function hideElement(element: HTMLElement): void {
  element.style.display = 'none';
}

/**
 * 切换元素显示
 */
export function toggleElement(element: HTMLElement, display: string = 'block'): void {
  if (element.style.display === 'none') {
    showElement(element, display);
  } else {
    hideElement(element);
  }
}

/**
 * 移除元素
 */
export function removeElement(element: HTMLElement): void {
  element.remove();
}

/**
 * 清空元素内容
 */
export function emptyElement(element: HTMLElement): void {
  element.innerHTML = '';
}

/**
 * 插入元素
 */
export function insertAfter(
  newNode: HTMLElement,
  referenceNode: HTMLElement
): void {
  referenceNode.parentNode?.insertBefore(newNode, referenceNode.nextSibling);
}

/**
 * 插入元素之前
 */
export function insertBefore(
  newNode: HTMLElement,
  referenceNode: HTMLElement
): void {
  referenceNode.parentNode?.insertBefore(newNode, referenceNode);
}

/**
 * 获取焦点元素
 */
export function getActiveElement(): HTMLElement | null {
  return document.activeElement as HTMLElement;
}

/**
 * 设置焦点
 */
export function focusElement(element: HTMLElement): void {
  element.focus();
}

/**
 * 失去焦点
 */
export function blurElement(element: HTMLElement): void {
  element.blur();
}

/**
 * 检查元素是否有焦点
 */
export function hasFocus(element: HTMLElement): boolean {
  return document.activeElement === element;
}

/**
 * 获取元素数据属性
 */
export function getDataAttribute(element: HTMLElement, key: string): string | null {
  return element.getAttribute(`data-${key}`);
}

/**
 * 设置元素数据属性
 */
export function setDataAttribute(
  element: HTMLElement,
  key: string,
  value: string
): void {
  element.setAttribute(`data-${key}`, value);
}

/**
 * 移除元素数据属性
 */
export function removeDataAttribute(element: HTMLElement, key: string): void {
  element.removeAttribute(`data-${key}`);
}

/**
 * 防止事件冒泡
 */
export function stopPropagation(event: Event): void {
  event.stopPropagation();
}

/**
 * 阻止默认行为
 */
export function preventDefault(event: Event): void {
  event.preventDefault();
}

/**
 * 同时阻止冒泡和默认行为
 */
export function stopEvent(event: Event): void {
  event.stopPropagation();
  event.preventDefault();
}

/**
 * 检查是否是触摸设备
 */
export function isTouchDevice(): boolean {
  return 'ontouchstart' in window || navigator.maxTouchPoints > 0;
}

/**
 * 检查是否是移动设备
 */
export function isMobileDevice(): boolean {
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
    navigator.userAgent
  );
}

/**
 * 检查是否支持某个 CSS 属性
 */
export function supportsCSSProperty(property: string): boolean {
  return property in document.documentElement.style;
}

/**
 * 检查是否支持某个功能
 */
export function supportsFeature(feature: string): boolean {
  switch (feature) {
    case 'intersection-observer':
      return 'IntersectionObserver' in window;
    case 'mutation-observer':
      return 'MutationObserver' in window;
    case 'resize-observer':
      return 'ResizeObserver' in window;
    case 'clipboard':
      return 'clipboard' in navigator;
    case 'fullscreen':
      return 'fullscreenEnabled' in document;
    case 'webp':
      // 简化检查
      return document.createElement('canvas').toDataURL('image/webp').indexOf('data:image/webp') === 0;
    default:
      return false;
  }
}

/**
 * 请求全屏
 */
export async function requestFullscreen(element: HTMLElement = document.documentElement): Promise<void> {
  try {
    if (element.requestFullscreen) {
      await element.requestFullscreen();
    }
  } catch (error) {
    console.error('Fullscreen request failed:', error);
  }
}

/**
 * 退出全屏
 */
export async function exitFullscreen(): Promise<void> {
  try {
    if (document.exitFullscreen) {
      await document.exitFullscreen();
    }
  } catch (error) {
    console.error('Fullscreen exit failed:', error);
  }
}

/**
 * 检查是否全屏
 */
export function isFullscreen(): boolean {
  return !!document.fullscreenElement;
}

/**
 * 打印页面
 */
export function printPage(): void {
  window.print();
}

/**
 * 刷新页面
 */
export function reloadPage(force: boolean = false): void {
  window.location.reload(force);
}

/**
 * 跳转到 URL
 */
export function navigateTo(url: string): void {
  window.location.href = url;
}

/**
 * 在新标签页打开 URL
 */
export function openInNewTab(url: string): void {
  window.open(url, '_blank', 'noopener,noreferrer');
}
