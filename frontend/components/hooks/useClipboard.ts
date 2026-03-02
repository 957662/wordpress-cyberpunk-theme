/**
 * 剪贴板 Hook
 * 复制文本到剪贴板
 */

import { useState, useCallback } from 'react';

export function useClipboard(timeout: number = 2000) {
  const [isCopied, setIsCopied] = useState(false);

  const copy = useCallback(async (text: string) => {
    if (!navigator?.clipboard) {
      console.warn('Clipboard not supported');
      return false;
    }

    try {
      await navigator.clipboard.writeText(text);
      setIsCopied(true);

      setTimeout(() => {
        setIsCopied(false);
      }, timeout);

      return true;
    } catch (error) {
      console.error('Failed to copy:', error);
      setIsCopied(false);
      return false;
    }
  }, [timeout]);

  return { isCopied, copy };
}

// 读取剪贴板 Hook
export function useClipboardRead() {
  const [data, setData] = useState<string>('');
  const [error, setError] = useState<Error | null>(null);

  const read = useCallback(async () => {
    if (!navigator?.clipboard) {
      setError(new Error('Clipboard not supported'));
      return '';
    }

    try {
      const text = await navigator.clipboard.readText();
      setData(text);
      setError(null);
      return text;
    } catch (err) {
      const error = err as Error;
      setError(error);
      return '';
    }
  }, []);

  return { data, error, read };
}
