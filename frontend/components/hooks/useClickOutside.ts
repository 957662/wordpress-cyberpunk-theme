import { useEffect, RefObject } from 'react';

export function useClickOutside<T extends HTMLElement>(
  ref: RefObject<T>,
  callback: () => void,
  additionalRefs?: RefObject<HTMLElement>[]
): void {
  useEffect(() => {
    const handleClick = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        const clickedInAdditional = additionalRefs?.some(
          (additionalRef) =>
            additionalRef.current?.contains(event.target as Node)
        );

        if (!clickedInAdditional) {
          callback();
        }
      }
    };

    document.addEventListener('mousedown', handleClick);

    return () => {
      document.removeEventListener('mousedown', handleClick);
    };
  }, [ref, callback, additionalRefs]);
}
