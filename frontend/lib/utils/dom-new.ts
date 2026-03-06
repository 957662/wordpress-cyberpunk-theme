/**
 * DOM工具函数
 */

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
export function toggleClass(element: HTMLElement, className: string): void {
  element.classList.toggle(className);
}

/**
 * 检查是否包含类名
 */
export function hasClass(element: HTMLElement, className: string): boolean {
  return element.classList.contains(className);
}

/**
 * 获取元素相对于文档的位置
 */
export function getElementOffset(element: HTMLElement): {
  top: number;
  left: number;
} {
  const rect = element.getBoundingClientRect();
  return {
    top: rect.top + window.pageYOffset,
    left: rect.left + window.pageXOffset,
  };
}

/**
 * 平滑滚动到元素
 */
export function scrollToElement(
  element: HTMLElement,
  offset: number = 0,
  behavior: ScrollBehavior = 'smooth'
): void {
  const elementTop = getElementOffset(element).top - offset;
  window.scrollTo({
    top: elementTop,
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
      textArea.select();
      try {
        document.execCommand('copy');
        return true;
      } catch {
        return false;
      } finally {
        document.body.removeChild(textArea);
      }
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
export function downloadFile(data: Blob | string, filename: string): void {
  const blob = data instanceof Blob ? data : new Blob([data]);
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
 * 打印页面
 */
export function printPage(): void {
  window.print();
}

/**
 * 全屏切换
 */
export function toggleFullScreen(): Promise<boolean> {
  if (!document.fullscreenElement) {
    return document.documentElement.requestFullscreen().then(() => true);
  } else {
    return document.exitFullscreen().then(() => false);
  }
}

/**
 * 检查是否全屏
 */
export function isFullScreen(): boolean {
  return !!document.fullscreenElement;
}

/**
 * 获取选中文本
 */
export function getSelectionText(): string {
  const selection = window.getSelection();
  return selection ? selection.toString() : '';
}

/**
 * 清除选中
 */
export function clearSelection(): void {
  const selection = window.getSelection();
  if (selection) {
    selection.removeAllRanges();
  }
}

/**
 * 检查元素是否在视口中
 */
export function isElementInViewport(element: HTMLElement): boolean {
  const rect = element.getBoundingClientRect();
  return (
    rect.top >= 0 &&
    rect.left >= 0 &&
    rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
    rect.right <= (window.innerWidth || document.documentElement.clientWidth)
  );
}

/**
 * 获取元素中心点
 */
export function getElementCenter(element: HTMLElement): {
  x: number;
  y: number;
} {
  const rect = element.getBoundingClientRect();
  return {
    x: rect.left + rect.width / 2,
    y: rect.top + rect.height / 2,
  };
}

/**
 * 触发事件
 */
export function triggerEvent(element: HTMLElement, eventName: string): void {
  const event = new Event(eventName, { bubbles: true });
  element.dispatchEvent(event);
}

/**
 * 防止默认行为
 */
export function preventDefault(event: Event): void {
  event.preventDefault();
}

/**
 * 停止事件冒泡
 */
export function stopPropagation(event: Event): void {
  event.stopPropagation();
}
