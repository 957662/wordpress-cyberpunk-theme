'use client';

import React, { useState, useEffect } from 'react';

interface TrailCursorProps {
  color?: string;
  size?: number;
  trailLength?: number;
  className?: string;
}

export function TrailCursor({
  color = '#00f0ff',
  size = 8,
  trailLength = 10,
  className = '',
}: TrailCursorProps) {
  const [positions, setPositions] = useState<Array<{ x: number; y: number }>>([]);

  useEffect(() => {
    let animationFrame: number;
    const positions: Array<{ x: number; y: number }> = [];

    const handleMouseMove = (e: MouseEvent) => {
      positions.push({ x: e.clientX, y: e.clientY });
      if (positions.length > trailLength) {
        positions.shift();
      }
    };

    document.addEventListener('mousemove', handleMouseMove);

    const animate = () => {
      setPositions([...positions]);
      animationFrame = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      cancelAnimationFrame(animationFrame);
    };
  }, [trailLength]);

  return (
    <div className={`fixed inset-0 pointer-events-none z-50 ${className}`}>
      {positions.map((pos, index) => {
        const opacity = (index + 1) / positions.length;
        const scale = ((index + 1) / positions.length) * size;
        return (
          <div
            key={index}
            className="fixed rounded-full"
            style={{
              left: pos.x,
              top: pos.y,
              width: `${scale}px`,
              height: `${scale}px`,
              marginLeft: `-${scale / 2}px`,
              marginTop: `-${scale / 2}px`,
              backgroundColor: color,
              opacity: opacity * 0.5,
              transition: 'all 0.1s ease-out',
            }}
          />
        );
      })}
    </div>
  );
}
