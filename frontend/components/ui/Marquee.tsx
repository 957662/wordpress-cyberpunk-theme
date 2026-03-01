'use client';

import React, { useEffect, useRef, ReactNode } from 'react';

interface MarqueeProps {
  children: ReactNode;
  speed?: number;
  direction?: 'left' | 'right' | 'up' | 'down';
  pauseOnHover?: boolean;
  className?: string;
}

export function Marquee({
  children,
  speed = 50,
  direction = 'left',
  pauseOnHover = true,
  className = '',
}: MarqueeProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    const content = contentRef.current;
    if (!container || !content) return;

    const animate = () => {
      const containerRect = container.getBoundingClientRect();
      const contentRect = content.getBoundingClientRect();

      let currentTranslate = 0;

      switch (direction) {
        case 'left':
          currentTranslate = parseFloat(
            content.style.transform.replace('translateX(', '') || '0'
          );
          if (Math.abs(currentTranslate) >= contentRect.width) {
            currentTranslate = containerRect.width;
          }
          content.style.transform = `translateX(${currentTranslate - 1}px)`;
          break;
        case 'right':
          currentTranslate = parseFloat(
            content.style.transform.replace('translateX(', '') || '0'
          );
          if (currentTranslate >= containerRect.width) {
            currentTranslate = -contentRect.width;
          }
          content.style.transform = `translateX(${currentTranslate + 1}px)`;
          break;
      }
    };

    const interval = setInterval(animate, speed);

    if (pauseOnHover) {
      container.addEventListener('mouseenter', () => clearInterval(interval));
      container.addEventListener('mouseleave', () => {
        setInterval(animate, speed);
      });
    }

    return () => clearInterval(interval);
  }, [speed, direction, pauseOnHover]);

  return (
    <div
      ref={containerRef}
      className={`overflow-hidden whitespace-nowrap ${className}`}
    >
      <div ref={contentRef} className="inline-block" style={{ transform: 'translateX(0)' }}>
        {children}
      </div>
    </div>
  );
}
