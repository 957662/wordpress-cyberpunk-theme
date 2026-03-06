'use client';

/**
 * useOnClickOutside Hook
 * Detect clicks outside of a specified element
 */

import { useEffect, RefObject } from 'react';

interface UseOnClickOutsideProps {
  ref: RefObject<HTMLElement> | RefObject<HTMLElement>[];
  handler: (event: MouseEvent | TouchEvent) => void;
  enabled?: boolean;
}

export function useOnClickOutside({
  ref,
  handler,
  enabled = true,
}: UseOnClickOutsideProps) {
  useEffect(() => {
    if (!enabled) return;

    const listener = (event: MouseEvent | TouchEvent) => {
      const refs = Array.isArray(ref) ? ref : [ref];

      // Do nothing if clicking ref's element or descendent elements
      const isClickInside = refs.some((r) => {
        if (!r.current) return false;
        return r.current.contains(event.target as Node);
      });

      if (!isClickInside) {
        handler(event);
      }
    };

    document.addEventListener('mousedown', listener);
    document.addEventListener('touchstart', listener);

    return () => {
      document.removeEventListener('mousedown', listener);
      document.removeEventListener('touchstart', listener);
    };
  }, [ref, handler, enabled]);
}
