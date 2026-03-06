'use client';

import React, { useState, useEffect, RefObject } from 'react';
import { cn } from '@/lib/utils';

interface StickyContainerProps {
  children: [React.ReactNode, React.ReactNode];
  offset?: number;
  bottomBoundary?: string | Element;
  className?: string;
  stickyClassName?: string;
}

/**
 * StickyContainer - 粘性容器组件
 * 实现粘性布局效果
 */
export const StickyContainer: React.FC<StickyContainerProps> = ({
  children,
  offset = 0,
  bottomBoundary,
  className,
  stickyClassName,
}) => {
  const [isSticky, setIsSticky] = useState(false);
  const [height, setHeight] = useState(0);
  const containerRef = React.useRef<HTMLDivElement>(null);
  const stickyRef = React.useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    const sticky = stickyRef.current;

    if (!container || !sticky) return;

    const handleScroll = () => {
      const containerRect = container.getBoundingClientRect();
      const stickyRect = sticky.getBoundingClientRect();

      const shouldStick = stickyRect.top <= offset;

      setIsSticky(shouldStick);

      if (shouldStick) {
        setHeight(stickyRect.height);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    return () => window.removeEventListener('scroll', handleScroll);
  }, [offset]);

  return (
    <div ref={containerRef} className={cn('relative', className)}>
      <div style={{ height: isSticky ? height : 'auto' }}>
        <div
          ref={stickyRef}
          className={cn(
            'transition-all',
            isSticky && stickyClassName
          )}
          style={
            isSticky
              ? {
                  position: 'fixed',
                  top: offset,
                  width: '100%',
                  maxWidth: containerRef.current?.offsetWidth,
                }
              : undefined
          }
        >
          {children[0]}
        </div>
      </div>

      <div>{children[1]}</div>
    </div>
  );
};

export default StickyContainer;
