/**
 * 防抖 Hook
 * 延迟执行函数，适用于搜索、自动保存等场景
 */

'use client';

import { useEffect, useState } from 'react';

export function useDebounce<T>(value: T, delay: number = 500): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}

// 使用示例:
// const [searchTerm, setSearchTerm] = useState('');
// const debouncedSearchTerm = useDebounce(searchTerm, 500);
//
// useEffect(() => {
//   // 使用 debouncedSearchTerm 执行搜索
//   performSearch(debouncedSearchTerm);
// }, [debouncedSearchTerm]);
