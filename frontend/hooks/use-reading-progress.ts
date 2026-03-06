/**
 * 阅读进度 Hook
 * 监听页面滚动并计算阅读进度
 */

'use client';

import { useState, useEffect } from 'react';

export function useReadingProgress() {
  const [progress, setProgress] = useState(0);
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight;
      const scrollTop = window.scrollY;
      const scrollableHeight = documentHeight - windowHeight;

      const scrollProgress = (scrollTop / scrollableHeight) * 100;
      setProgress(Math.min(100, Math.max(0, scrollProgress)));

      // 判断是否在阅读中
      setIsActive(scrollTop > 100);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll(); // 初始调用

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return { progress, isActive };
}
