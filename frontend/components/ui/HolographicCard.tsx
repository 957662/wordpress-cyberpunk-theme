'use client';

import { useState, useRef } from 'react';
import { motion, useMotionValue, useTransform, animate } from 'framer-motion';

interface HolographicCardProps {
  children: React.ReactNode;
  className?: string;
  intensity?: number;
}

export default function HolographicCard({
  children,
  className = '',
  intensity = 1,
}: HolographicCardProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);

  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const rotateX = useTransform(y, [-0.5, 0.5], [10 * intensity, -10 * intensity]);
  const rotateY = useTransform(x, [-0.5, 0.5], [-10 * intensity, 10 * intensity]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!ref.current) return;

    const rect = ref.current.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;

    const centerX = rect.left + width / 2;
    const centerY = rect.top + height / 2;

    mouseX.set(e.clientX - centerX);
    mouseY.set(e.clientY - centerY);

    const normalizedX = (e.clientX - rect.left) / width - 0.5;
    const normalizedY = (e.clientY - rect.top) / height - 0.5;

    x.set(normalizedX);
    y.set(normalizedY);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    animate(x, 0);
    animate(y, 0);
  };

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
      style={{
        rotateX,
        rotateY,
        transformStyle: 'preserve-3d',
      }}
      className={`relative ${className}`}
    >
      {/* 全息光效 */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-br from-cyber-cyan/20 via-transparent to-cyber-purple/20 rounded-xl pointer-events-none"
        animate={{
          opacity: isHovered ? [0.3, 0.6, 0.3] : 0,
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />

      {/* 扫描线效果 */}
      {isHovered && (
        <motion.div
          className="absolute inset-0 pointer-events-none rounded-xl overflow-hidden"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="w-full h-0.5 bg-gradient-to-r from-transparent via-cyber-cyan to-transparent"
            animate={{
              y: ['-100%', '200%'],
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              ease: 'linear',
            }}
          />
        </motion.div>
      )}

      {/* 主内容 */}
      <motion.div
        className="relative h-full bg-cyber-darker/80 backdrop-blur-sm rounded-xl border border-cyber-cyan/30 overflow-hidden"
        animate={{
          borderColor: isHovered
            ? ['rgba(0, 240, 255, 0.3)', 'rgba(157, 0, 255, 0.3)', 'rgba(0, 240, 255, 0.3)']
            : 'rgba(0, 240, 255, 0.3)',
          boxShadow: isHovered
            ? '0 0 30px rgba(0, 240, 255, 0.3), inset 0 0 30px rgba(0, 240, 255, 0.05)'
            : 'none',
        }}
        transition={{
          duration: 3,
          repeat: isHovered ? Infinity : 0,
          ease: 'easeInOut',
        }}
        style={{
          transform: 'translateZ(20px)',
        }}
      >
        {children}
      </motion.div>

      {/* 底部反光 */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-t from-cyber-cyan/10 to-transparent rounded-xl pointer-events-none"
        style={{
          transform: 'translateZ(25px)',
          opacity: useTransform(y, [-0.5, 0.5], [0.3, 0]),
        }}
      />
    </motion.div>
  );
}
