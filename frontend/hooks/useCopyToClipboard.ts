/**
 * useCopyToClipboard Hook
 * 复制文本到剪贴板
 */

import { useState, useCallback } from 'react';

interface CopyToClipboardOptions {
  /**
   * 复制成功后的延迟时间 (ms)
   * @default 2000
   */
  successDuration?: number;
}

interface CopyToClipboardReturn {
  /**
   * 是否复制成功
   */
  isCopied: boolean;

  /**
   * 复制函数
   */
  copy: (text: string) => Promise<boolean>;

  /**
   * 错误信息
   */
  error: Error | null;
}

export function useCopyToClipboard(
  options: CopyToClipboardOptions = {}
): CopyToClipboardReturn {
  const { successDuration = 2000 } = options;
  const [isCopied, setIsCopied] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const copy = useCallback(async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setIsCopied(true);
      setError(null);

      // 自动重置状态
      setTimeout(() => {
        setIsCopied(false);
      }, successDuration);

      return true;
    } catch (err) {
      const error = err as Error;
      setError(error);
      setIsCopied(false);
      return false;
    }
  }, [successDuration]);

  return { isCopied, copy, error };
}
