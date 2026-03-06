/**
 * useClipboard Hook
 * 剪贴板 Hook - 用于复制/读取剪贴板
 */

import { useState, useCallback } from 'react';

export function useClipboard() {
  const [isCopied, setIsCopied] = useState(false);

  const copy = useCallback(async (text: string): Promise<boolean> => {
    try {
      await navigator.clipboard.writeText(text);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
      return true;
    } catch (error) {
      console.error('Failed to copy text:', error);
      setIsCopied(false);
      return false;
    }
  }, []);

  const read = useCallback(async (): Promise<string | null> => {
    try {
      const text = await navigator.clipboard.readText();
      return text;
    } catch (error) {
      console.error('Failed to read clipboard:', error);
      return null;
    }
  }, []);

  return { isCopied, copy, read };
}

// 使用示例:
// const { isCopied, copy, read } = useClipboard();
// await copy('Hello, World!');
