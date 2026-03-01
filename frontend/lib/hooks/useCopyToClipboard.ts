/**
 * useCopyToClipboard Hook
 *
 * 复制到剪贴板 Hook
 */

import { useState, useCallback } from 'react';

/**
 * 复制状态
 */
export interface CopyState {
  value: string | null;
  error: Error | null;
  copied: boolean;
}

/**
 * 复制到剪贴板 Hook
 * @returns 复制状态和复制函数
 */
export function useCopyToClipboard(): [CopyState, (text: string) => Promise<boolean>] {
  const [state, setState] = useState<CopyState>({
    value: null,
    error: null,
    copied: false,
  });

  const copyToClipboard = useCallback(async (text: string): Promise<boolean> => {
    try {
      // 检查是否支持 Clipboard API
      if (!navigator?.clipboard) {
        throw new Error('Clipboard API not supported');
      }

      // 复制到剪贴板
      await navigator.clipboard.writeText(text);

      setState({
        value: text,
        error: null,
        copied: true,
      });

      // 2秒后重置 copied 状态
      setTimeout(() => {
        setState((prev) => ({ ...prev, copied: false }));
      }, 2000);

      return true;
    } catch (error) {
      setState({
        value: null,
        error: error as Error,
        copied: false,
      });
      return false;
    }
  }, []);

  return [state, copyToClipboard];
}

/**
 * 降级方案 - 使用 execCommand 复制（兼容旧浏览器）
 * @param text - 要复制的文本
 * @returns 是否成功
 */
export function fallbackCopyToClipboard(text: string): boolean {
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
  } catch (err) {
    document.body.removeChild(textArea);
    return false;
  }
}
