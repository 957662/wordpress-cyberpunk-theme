'use client';

import { useState, useCallback } from 'react';

/**
 * Hook: 复制到剪贴板
 */
export function useClipboard() {
  const [isCopied, setIsCopied] = useState(false);

  const copy = useCallback(async (text: string): Promise<boolean> => {
    try {
      await navigator.clipboard.writeText(text);
      setIsCopied(true);

      // 2秒后重置状态
      setTimeout(() => {
        setIsCopied(false);
      }, 2000);

      return true;
    } catch (err) {
      console.error('Failed to copy text:', err);

      // 降级方案
      try {
        const textArea = document.createElement('textarea');
        textArea.value = text;
        textArea.style.position = 'fixed';
        textArea.style.left = '-999999px';
        document.body.appendChild(textArea);
        textArea.select();
        const successful = document.execCommand('copy');
        textArea.remove();

        if (successful) {
          setIsCopied(true);
          setTimeout(() => {
            setIsCopied(false);
          }, 2000);
        }

        return successful;
      } catch (fallbackErr) {
        console.error('Fallback copy failed:', fallbackErr);
        return false;
      }
    }
  }, []);

  return { isCopied, copy };
}

/**
 * Hook: 从剪贴板读取
 */
export function useClipboardRead() {
  const [text, setText] = useState('');
  const [error, setError] = useState<Error | null>(null);

  const read = useCallback(async (): Promise<string | null> => {
    try {
      const clipboardText = await navigator.clipboard.readText();
      setText(clipboardText);
      setError(null);
      return clipboardText;
    } catch (err) {
      const error = err as Error;
      setError(error);
      return null;
    }
  }, []);

  return { text, error, read };
}
