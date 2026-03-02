'use client';

import { motion } from 'framer-motion';
import { ReactNode, useRef, useEffect, useState } from 'react';

interface HoloProjectionProps {
  children: ReactNode;
  intensity?: number;
  className?: string;
}

export default function HoloProjection({
  children,
  intensity = 1,
  className = '',
}: HoloProjectionProps) {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!ref.current) return;
      const rect = ref.current.getBoundingClientRect();
      setMousePos({
        x: (e.clientX - rect.left) / rect.width - 0.5,
        y: (e.clientY - rect.top) / rect.height - 0.5,
      });
    };

    const element = ref.current;
    element?.addEventListener('mousemove', handleMouseMove);
    return () => element?.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <div
      ref={ref}
      className={`relative ${className}`}
      style={{
        perspective: '1000px',
      }}
    >
      <motion.div
        className="relative"
        style={{
          rotateX: mousePos.y * -10 * intensity,
          rotateY: mousePos.x * 10 * intensity,
          transformStyle: 'preserve-3d',
        }}
        animate={{
          boxShadow: [
            `0 0 ${20 * intensity}px rgba(0, 240, 255, 0.3)`,
            `0 0 ${30 * intensity}px rgba(157, 0, 255, 0.3)`,
            `0 0 ${20 * intensity}px rgba(0, 240, 255, 0.3)`,
          ],
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      >
        {/* 全息扫描线 */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-lg">
          <motion.div
            className="w-full h-0.5 bg-gradient-to-r from-transparent via-cyber-cyan to-transparent"
            animate={{
              y: ['-100%', '200%'],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: 'linear',
            }}
          />
        </div>

        {/* 内容 */}
        <div className="relative bg-cyber-darker/80 backdrop-blur-sm rounded-lg border border-cyber-cyan/30">
          {children}
        </div>

        {/* 底部反射 */}
        <motion.div
          className="absolute inset-0 pointer-events-none rounded-lg"
          style={{
            background: 'linear-gradient(to top, rgba(0, 240, 255, 0.1), transparent)',
            transform: 'translateZ(-1px) scale(1.02)',
          }}
        />
      </motion.div>
    </div>
  );
}
