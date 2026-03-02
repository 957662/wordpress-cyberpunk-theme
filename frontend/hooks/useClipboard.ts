import { useState, useCallback } from 'react';

export function useClipboard(text: string, delay: number = 2000) {
  const [hasCopied, setHasCopied] = useState(false);

  const onCopy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(text);
      setHasCopied(true);

      setTimeout(() => {
        setHasCopied(false);
      }, delay);
    } catch (error) {
      console.error('Failed to copy text:', error);
    }
  }, [text, delay]);

  return { hasCopied, onCopy };
}

export default useClipboard;
