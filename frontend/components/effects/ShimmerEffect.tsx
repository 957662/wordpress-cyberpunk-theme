'use client';

import React, { useRef, useState, useEffect } from 'react';

interface ShimmerEffectProps {
  children: React.ReactNode;
  className?: string;
  shimmerColor?: string;
  speed?: number;
}

export function ShimmerEffect({
  children,
  className = '',
  shimmerColor = 'rgba(0, 240, 255, 0.3)',
  speed = 2,
}: ShimmerEffectProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [mousePosition, setMousePosition] = useState({ x: -1000, y: -1000 });

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      setMousePosition({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      });
    };

    const handleMouseLeave = () => {
      setMousePosition({ x: -1000, y: -1000 });
    };

    container.addEventListener('mousemove', handleMouseMove);
    container.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      container.removeEventListener('mousemove', handleMouseMove);
      container.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className={`relative overflow-hidden ${className}`}
      style={{ cursor: 'default' }}
    >
      {children}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background: `radial-gradient(
            circle 150px at ${mousePosition.x}px ${mousePosition.y}px,
            ${shimmerColor},
            transparent 100%
          )`,
          transition: 'background 0.1s ease-out',
        }}
      />
    </div>
  );
}
