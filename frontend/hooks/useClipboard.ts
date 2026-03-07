'use client';

import { useState, useCallback, useEffect } from 'react';

/**
 * Clipboard Hook
 * 用于复制文本到剪贴板
 */
export function useClipboard(text: string, options: {
  onSuccess?: () => void;
  onError?: (error: Error) => void;
  timeout?: number;
} = {}) {
  const { onSuccess, onError, timeout = 2000 } = options;
  const [hasCopied, setHasCopied] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const copy = useCallback(async () => {
    try {
      if (navigator.clipboard) {
        await navigator.clipboard.writeText(text);
      } else {
        // 降级方案
        const textArea = document.createElement('textarea');
        textArea.value = text;
        textArea.style.position = 'fixed';
        textArea.style.left = '-999999px';
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        try {
          document.execCommand('copy');
        } catch (err) {
          throw new Error('Copy failed');
        }
        document.body.removeChild(textArea);
      }

      setHasCopied(true);
      setError(null);
      onSuccess?.();

      // 重置状态
      setTimeout(() => {
        setHasCopied(false);
      }, timeout);
    } catch (err) {
      const error = err as Error;
      setError(error);
      onError?.(error);
    }
  }, [text, timeout, onSuccess, onError]);

  return { hasCopied, error, copy };
}

/**
 * Clipboard State Hook
 * 返回完整的剪贴板状态
 */
export function useClipboardState() {
  const [content, setContent] = useState('');
  const [hasCopied, setHasCopied] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const copy = useCallback(async (text: string) => {
    try {
      if (navigator.clipboard) {
        await navigator.clipboard.writeText(text);
      } else {
        const textArea = document.createElement('textarea');
        textArea.value = text;
        textArea.style.position = 'fixed';
        textArea.style.left = '-999999px';
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
      }

      setContent(text);
      setHasCopied(true);
      setError(null);

      setTimeout(() => {
        setHasCopied(false);
      }, 2000);
    } catch (err) {
      const error = err as Error;
      setError(error);
    }
  }, []);

  const paste = useCallback(async () => {
    try {
      if (navigator.clipboard) {
        const text = await navigator.clipboard.readText();
        setContent(text);
        setError(null);
        return text;
      }
    } catch (err) {
      const error = err as Error;
      setError(error);
    }
  }, []);

  return { content, hasCopied, error, copy, paste };
}
