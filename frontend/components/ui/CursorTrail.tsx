'use client';

import { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';

interface TrailPoint {
  x: number;
  y: number;
  id: number;
}

export default function CursorTrail() {
  const trailRef = useRef<TrailPoint[]>([]);
  const idRef = useRef(0);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const trail: TrailPoint[] = [];
    const maxPoints = 20;

    const handleMouseMove = (e: MouseEvent) => {
      trail.push({
        x: e.clientX,
        y: e.clientY,
        id: idRef.current++,
      });

      if (trail.length > maxPoints) {
        trail.shift();
      }

      trailRef.current = [...trail];
    };

    window.addEventListener('mousemove', handleMouseMove);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-50">
      {trailRef.current.map((point, index) => {
        const scale = (index / trailRef.current.length) * 0.5 + 0.2;
        const opacity = index / trailRef.current.length;

        return (
          <motion.div
            key={point.id}
            className="absolute w-2 h-2 rounded-full"
            style={{
              left: point.x,
              top: point.y,
              background: `radial-gradient(circle, rgba(0, 240, 255, ${opacity}) 0%, transparent 70%)`,
            }}
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale, opacity }}
            exit={{ scale: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
          />
        );
      })}
    </div>
  );
}
