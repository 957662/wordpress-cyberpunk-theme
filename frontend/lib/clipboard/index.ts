/**
 * 剪贴板工具库
 * 提供剪贴板读写功能
 */

/**
 * 写入文本到剪贴板
 */
export async function copyToClipboard(text: string): Promise<boolean> {
  if (typeof navigator === 'undefined' || !navigator.clipboard) {
    // 降级方案
    return fallbackCopyToClipboard(text);
  }

  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch (error) {
    console.error('Failed to copy to clipboard:', error);
    return fallbackCopyToClipboard(text);
  }
}

/**
 * 从剪贴板读取文本
 */
export async function readFromClipboard(): Promise<string> {
  if (typeof navigator === 'undefined' || !navigator.clipboard) {
    throw new Error('Clipboard API not available');
  }

  try {
    return await navigator.clipboard.readText();
  } catch (error) {
    console.error('Failed to read from clipboard:', error);
    throw error;
  }
}

/**
 * 降级方案：使用 document.execCommand
 */
function fallbackCopyToClipboard(text: string): boolean {
  const textArea = document.createElement('textarea');
  textArea.value = text;

  // 避免滚动到底部
  textArea.style.top = '0';
  textArea.style.left = '0';
  textArea.style.position = 'fixed';

  document.body.appendChild(textArea);
  textArea.focus();
  textArea.select();

  try {
    const successful = document.execCommand('copy');
    document.body.removeChild(textArea);
    return successful;
  } catch (error) {
    console.error('Fallback: Failed to copy to clipboard', error);
    document.body.removeChild(textArea);
    return false;
  }
}

/**
 * 复制 HTML 到剪贴板
 */
export async function copyHTMLToClipboard(html: string): Promise<boolean> {
  if (typeof navigator === 'undefined' || !navigator.clipboard) {
    return false;
  }

  try {
    const blob = new Blob([html], { type: 'text/html' });
    const clipboardItem = new ClipboardItem({ 'text/html': blob });
    await navigator.clipboard.write([clipboardItem]);
    return true;
  } catch (error) {
    console.error('Failed to copy HTML to clipboard:', error);
    return false;
  }
}

/**
 * 复制图片到剪贴板
 */
export async function copyImageToClipboard(blob: Blob): Promise<boolean> {
  if (typeof navigator === 'undefined' || !navigator.clipboard) {
    return false;
  }

  try {
    const clipboardItem = new ClipboardItem({ [blob.type]: blob });
    await navigator.clipboard.write([clipboardItem]);
    return true;
  } catch (error) {
    console.error('Failed to copy image to clipboard:', error);
    return false;
  }
}

/**
 * 检查剪贴板 API 是否可用
 */
export function isClipboardAvailable(): boolean {
  return typeof navigator !== 'undefined' && !!navigator.clipboard;
}

/**
 * 检查剪贴板读取权限
 */
export async function checkClipboardReadPermission(): Promise<boolean> {
  if (!isClipboardAvailable()) return false;

  try {
    const permission = await navigator.permissions.query({ name: 'clipboard-read' as PermissionName });
    return permission.state === 'granted';
  } catch {
    return false;
  }
}

/**
 * 检查剪贴板写入权限
 */
export async function checkClipboardWritePermission(): Promise<boolean> {
  if (!isClipboardAvailable()) return false;

  try {
    const permission = await navigator.permissions.query({ name: 'clipboard-write' as PermissionName });
    return permission.state === 'granted';
  } catch {
    return false;
  }
}

/**
 * 请求剪贴板读取权限
 */
export async function requestClipboardReadPermission(): Promise<boolean> {
  if (!isClipboardAvailable()) return false;

  try {
    await navigator.clipboard.readText();
    return true;
  } catch {
    return false;
  }
}
