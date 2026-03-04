'use client';

import { useState, useCallback } from 'react';

export function useArray<T>(initialValue: T[] = []) {
  const [array, setArray] = useState<T[]>(initialValue);

  const push = useCallback((element: T) => {
    setArray((prev) => [...prev, element]);
  }, []);

  const unshift = useCallback((element: T) => {
    setArray((prev) => [element, ...prev]);
  }, []);

  const pop = useCallback(() => {
    setArray((prev) => prev.slice(0, -1));
  }, []);

  const shift = useCallback(() => {
    setArray((prev) => prev.slice(1));
  }, []);

  const remove = useCallback((index: number) => {
    setArray((prev) => prev.filter((_, i) => i !== index));
  }, []);

  const filter = useCallback((callback: (item: T, index: number) => boolean) => {
    setArray((prev) => prev.filter(callback));
  }, []);

  const map = useCallback(<U>(callback: (item: T, index: number) => U): U[] => {
    return array.map(callback);
  }, [array]);

  const update = useCallback((index: number, element: T) => {
    setArray((prev) => [...prev.slice(0, index), element, ...prev.slice(index + 1)]);
  }, []);

  const clear = useCallback(() => {
    setArray([]);
  }, []);

  const reset = useCallback(() => {
    setArray(initialValue);
  }, [initialValue]);

  return {
    array,
    set: setArray,
    push,
    unshift,
    pop,
    shift,
    remove,
    filter,
    map,
    update,
    clear,
    reset,
  };
}

// Hook for managing array selection
export function useArraySelection<T>(initialArray: T[] = []) {
  const [array, setArray] = useState<T[]>(initialArray);
  const [selectedIndices, setSelectedIndices] = useState<Set<number>>(new Set());

  const toggle = useCallback((index: number) => {
    setSelectedIndices((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(index)) {
        newSet.delete(index);
      } else {
        newSet.add(index);
      }
      return newSet;
    });
  }, []);

  const selectAll = useCallback(() => {
    setSelectedIndices(new Set(array.map((_, i) => i)));
  }, [array]);

  const deselectAll = useCallback(() => {
    setSelectedIndices(new Set());
  }, []);

  const removeSelected = useCallback(() => {
    setArray((prev) => prev.filter((_, i) => !selectedIndices.has(i)));
    setSelectedIndices(new Set());
  }, [selectedIndices]);

  const getSelected = useCallback(() => {
    return array.filter((_, i) => selectedIndices.has(i));
  }, [array, selectedIndices]);

  const isSelected = useCallback((index: number) => {
    return selectedIndices.has(index);
  }, [selectedIndices]);

  return {
    array,
    setArray,
    selectedIndices,
    toggle,
    selectAll,
    deselectAll,
    removeSelected,
    getSelected,
    isSelected,
  };
}
