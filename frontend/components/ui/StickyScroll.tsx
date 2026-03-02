'use client';

import { useEffect, useRef, useState } from 'react';

interface StickyScrollProps {
  children: React.ReactNode;
  offsetTop?: number;
  className?: string;
}

export default function StickyScroll({
  children,
  offsetTop = 0,
  className = '',
}: StickyScrollProps) {
  const [isSticky, setIsSticky] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      if (!ref.current) return;

      const rect = ref.current.getBoundingClientRect();
      const shouldBeSticky = rect.top <= offsetTop;
      setIsSticky(shouldBeSticky);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll(); // Initial check

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [offsetTop]);

  return (
    <div
      ref={ref}
      className={className}
      style={{
        position: isSticky ? 'sticky' : 'relative',
        top: isSticky ? offsetTop : 'auto',
        zIndex: isSticky ? 10 : 'auto',
      }}
    >
      {children}
    </div>
  );
}
