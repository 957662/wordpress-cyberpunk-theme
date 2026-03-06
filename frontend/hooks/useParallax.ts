import { useEffect, useState } from 'react';

/**
 * 视差滚动 Hook
 * @param offset 偏移量
 */
export function useParallax(offset: number = 0): number {
  const [y, setY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      setY(scrollY * offset);
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll();

    return () => window.removeEventListener('scroll', handleScroll);
  }, [offset]);

  return y;
}
