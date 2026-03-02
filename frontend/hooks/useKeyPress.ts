/**
 * useKeyPress Hook
 *
 * Detect keyboard key presses with support for combinations.
 */

import { useState, useEffect } from 'react';

export interface KeyPressOptions {
  targetKey?: string | string[];
  ctrlKey?: boolean;
  shiftKey?: boolean;
  altKey?: boolean;
  metaKey?: boolean;
  onKeyDown?: (event: KeyboardEvent) => void;
  onKeyUp?: (event: KeyboardEvent) => void;
}

export function useKeyPress(options: KeyPressOptions = {}): boolean {
  const {
    targetKey,
    ctrlKey = false,
    shiftKey = false,
    altKey = false,
    metaKey = false,
    onKeyDown,
    onKeyUp,
  } = options;

  const [keyPressed, setKeyPressed] = useState(false);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Check if modifier keys match
      if (
        (ctrlKey && !event.ctrlKey) ||
        (shiftKey && !event.shiftKey) ||
        (altKey && !event.altKey) ||
        (metaKey && !event.metaKey)
      ) {
        return;
      }

      // Check if modifier keys are NOT pressed when not required
      if (
        (!ctrlKey && event.ctrlKey) ||
        (!shiftKey && event.shiftKey) ||
        (!altKey && event.altKey) ||
        (!metaKey && event.metaKey)
      ) {
        return;
      }

      // Check if target key matches
      if (targetKey) {
        const keys = Array.isArray(targetKey) ? targetKey : [targetKey];
        const keyMatches = keys.some(
          (key) => key.toLowerCase() === event.key.toLowerCase()
        );

        if (keyMatches) {
          setKeyPressed(true);
          onKeyDown?.(event);
        }
      } else {
        setKeyPressed(true);
        onKeyDown?.(event);
      }
    };

    const handleKeyUp = (event: KeyboardEvent) => {
      if (targetKey) {
        const keys = Array.isArray(targetKey) ? targetKey : [targetKey];
        const keyMatches = keys.some(
          (key) => key.toLowerCase() === event.key.toLowerCase()
        );

        if (keyMatches) {
          setKeyPressed(false);
          onKeyUp?.(event);
        }
      } else {
        setKeyPressed(false);
        onKeyUp?.(event);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [targetKey, ctrlKey, shiftKey, altKey, metaKey, onKeyDown, onKeyUp]);

  return keyPressed;
}

// Shortcut hook for common combinations
export function useKeyboardShortcut(
  keys: string[],
  callback: () => void,
  options: { ctrl?: boolean; shift?: boolean; alt?: boolean; meta?: boolean } = {}
) {
  const { ctrl = false, shift = false, alt = false, meta = false } = options;

  useKeyPress({
    targetKey: keys,
    ctrlKey: ctrl,
    shiftKey: shift,
    altKey: alt,
    metaKey: meta,
    onKeyDown: (e) => {
      e.preventDefault();
      callback();
    },
  });
}
