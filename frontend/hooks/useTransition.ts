import { useState, useCallback, startTransition } from 'react';

/**
 * 过渡 Hook
 */
export function useTransition() {
  const [isPending, setIsPending] = useState(false);

  const transition = useCallback(
    async (callback: () => void | Promise<void>) => {
      setIsPending(true);

      try {
        await startTransition(async () => {
          await callback();
        });
      } finally {
        setIsPending(false);
      }
    },
    []
  );

  return [isPending, transition] as const;
}
