// DOM 操作工具函数

/**
 * 添加 class
 */
export function addClass(element: HTMLElement, className: string): void {
  element.classList.add(className);
}

/**
 * 移除 class
 */
export function removeClass(element: HTMLElement, className: string): void {
  element.classList.remove(className);
}

/**
 * 切换 class
 */
export function toggleClass(element: HTMLElement, className: string): boolean {
  return element.classList.toggle(className);
}

/**
 * 检查是否有 class
 */
export function hasClass(element: HTMLElement, className: string): boolean {
  return element.classList.contains(className);
}

/**
 * 获取元素
 */
export function $(selector: string): HTMLElement | null {
  return document.querySelector(selector);
}

/**
 * 获取所有元素
 */
export function $$(selector: string): HTMLElement[] {
  return Array.from(document.querySelectorAll(selector));
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

  if (options?.className) element.className = options.className;
  if (options?.id) element.id = options.id;
  if (options?.innerHTML) element.innerHTML = options.innerHTML;
  if (options?.textContent) element.textContent = options.textContent;
  if (options?.attributes) {
    Object.entries(options.attributes).forEach(([key, value]) => {
      element.setAttribute(key, value);
    });
  }

  return element;
}

/**
 * 滚动到元素
 */
export function scrollToElement(
  element: HTMLElement,
  options?: ScrollIntoOptions
): void {
  element.scrollIntoView(options || { behavior: 'smooth', block: 'start' });
}

/**
 * 滚动到顶部
 */
export function scrollToTop(smooth: boolean = true): void {
  window.scrollTo({
    top: 0,
    behavior: smooth ? 'smooth' : 'auto',
  });
}

/**
 * 获取元素位置
 */
export function getElementPosition(element: HTMLElement): { x: number; y: number } {
  const rect = element.getBoundingClientRect();
  return {
    x: rect.left + window.scrollX,
    y: rect.top + window.scrollY,
  };
}

/**
 * 获取元素尺寸
 */
export function getElementSize(element: HTMLElement): { width: number; height: number } {
  const rect = element.getBoundingClientRect();
  return {
    width: rect.width,
    height: rect.height,
  };
}

/**
 * 检查元素是否在视口内
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
 * 添加事件监听器
 */
export function on<K extends keyof HTMLElementEventMap>(
  element: HTMLElement,
  event: K,
  handler: (event: HTMLElementEventMap[K]) => void,
  options?: AddEventListenerOptions
): () => void {
  element.addEventListener(event, handler, options);
  return () => element.removeEventListener(event, handler, options);
}

/**
 * 添加委托事件监听器
 */
export function delegate<K extends keyof HTMLElementEventMap>(
  parent: HTMLElement,
  selector: string,
  event: K,
  handler: (event: HTMLElementEventMap[K], target: HTMLElement) => void
): () => void {
  const wrappedHandler = (e: Event) => {
    const target = (e.target as HTMLElement).closest(selector);
    if (target && parent.contains(target)) {
      handler(e as HTMLElementEventMap[K], target as HTMLElement);
    }
  };

  parent.addEventListener(event, wrappedHandler);
  return () => parent.removeEventListener(event, wrappedHandler);
}

/**
 * 复制到剪贴板
 */
export async function copyToClipboard(text: string): Promise<boolean> {
  if (typeof navigator === 'undefined' || !navigator.clipboard) {
    // 后备方案
    const textArea = document.createElement('textarea');
    textArea.value = text;
    textArea.style.position = 'fixed';
    textArea.style.opacity = '0';
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    try {
      document.execCommand('copy');
      document.body.removeChild(textArea);
      return true;
    } catch (err) {
      document.body.removeChild(textArea);
      return false;
    }
  }

  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch (err) {
    console.error('Failed to copy to clipboard:', err);
    return false;
  }
}

/**
 * 从剪贴板读取
 */
export async function readFromClipboard(): Promise<string | null> {
  if (typeof navigator === 'undefined' || !navigator.clipboard) {
    return null;
  }

  try {
    return await navigator.clipboard.readText();
  } catch (err) {
    console.error('Failed to read from clipboard:', err);
    return null;
  }
}

/**
 * 下载文件
 */
export function downloadFile(content: string, filename: string, mimeType: string = 'text/plain'): void {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const link = createElement('a', {
    attributes: { href: url, download: filename },
  });
  link.click();
  URL.revokeObjectURL(url);
}

/**
 * 下载图片
 */
export async function downloadImage(url: string, filename: string): Promise<void> {
  try {
    const response = await fetch(url);
    const blob = await response.blob();
    const blobUrl = URL.createObjectURL(blob);
    const link = createElement('a', {
      attributes: { href: blobUrl, download: filename },
    });
    link.click();
    URL.revokeObjectURL(blobUrl);
  } catch (error) {
    console.error('Failed to download image:', error);
  }
}

/**
 * 获取选中的文本
 */
export function getSelectionText(): string {
  if (typeof window === 'undefined') return '';
  return window.getSelection()?.toString() || '';
}

/**
 * 清除选择
 */
export function clearSelection(): void {
  if (typeof window === 'undefined') return;
  window.getSelection()?.removeAllRanges();
}

/**
 * 全屏切换
 */
export function toggleFullscreen(element?: HTMLElement): Promise<void> | null {
  if (!document.fullscreenElement) {
    return (element || document.documentElement).requestFullscreen();
  } else {
    return document.exitFullscreen();
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
 * 重新加载页面
 */
export function reloadPage(force: boolean = false): void {
  window.location.reload(force);
}

/**
 * 导航到 URL
 */
export function navigateTo(url: string): void {
  window.location.href = url;
}

/**
 * 在新标签页打开
 */
export function openInNewTab(url: string): void {
  window.open(url, '_blank', 'noopener,noreferrer');
}
