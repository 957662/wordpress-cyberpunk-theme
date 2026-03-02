import { useState } from 'react';

/**
 * 复制到剪贴板 Hook
 * @returns [isCopied, copy] 状态和复制函数
 */
export function useCopyToClipboard(): [boolean, (text: string) => Promise<void>] {
  const [isCopied, setIsCopied] = useState(false);

  const copy = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setIsCopied(true);

      // 2秒后重置状态
      setTimeout(() => {
        setIsCopied(false);
      }, 2000);
    } catch (error) {
      console.error('复制失败:', error);
      setIsCopied(false);
    }
  };

  return [isCopied, copy];
}
