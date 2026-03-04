/**
 * Clipboard Utility
 * 剪贴板工具函数
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
      // 降级方案
      const textArea = document.createElement('textarea');
      textArea.value = text;
      textArea.style.position = 'fixed';
      textArea.style.left = '-999999px';
      textArea.style.top = '-999999px';
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();
      const successful = document.execCommand('copy');
      textArea.remove();
      return successful;
    }
  } catch (error) {
    console.error('Failed to copy text:', error);
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
    } else {
      // 降级方案
      const textArea = document.createElement('textarea');
      textArea.style.position = 'fixed';
      textArea.style.left = '-999999px';
      textArea.style.top = '-999999px';
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();
      document.execCommand('paste');
      const text = textArea.value;
      textArea.remove();
      return text;
    }
  } catch (error) {
    console.error('Failed to read from clipboard:', error);
    return '';
  }
}

/**
 * 剪贴板 Hook
 */
export function useClipboard() {
  const [isCopied, setIsCopied] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const copy = async (text: string): Promise<boolean> => {
    try {
      const success = await copyToClipboard(text);
      setIsCopied(success);
      setError(null);

      if (success) {
        setTimeout(() => {
          setIsCopied(false);
        }, 2000);
      }

      return success;
    } catch (err) {
      setError(err as Error);
      return false;
    }
  };

  return { isCopied, error, copy };
}

import { useState } from 'react';
