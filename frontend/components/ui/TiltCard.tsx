'use client';

/**
 * Tilt Card Component
 * 3D倾斜卡片 - 支持鼠标悬停3D倾斜效果的卡片组件
 */

import { useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

export interface TiltCardProps {
  /**
   * 子元素
   */
  children: React.ReactNode;

  /**
   * 最大倾斜角度
   * @default 10
   */
  maxTilt?: number;

  /**
   * 透视距离
   * @default 1000
   */
  perspective?: number;

  /**
   * 缩放比例
   * @default 1.05
   */
  scale?: number;

  /**
   * 自定义类名
   */
  className?: string;

  /**
   * 是否启用发光效果
   * @default false
   */
  enableGlare?: boolean;

  /**
   * 发光颜色
   * @default "rgba(255, 255, 255, 0.3)"
   */
  glareColor?: string;
}

export const TiltCard = ({
  children,
  maxTilt = 10,
  perspective = 1000,
  scale = 1.05,
  className,
  enableGlare = false,
  glareColor = 'rgba(255, 255, 255, 0.3)',
}: TiltCardProps) => {
  const ref = useRef<HTMLDivElement>(null);
  const [transform, setTransform] = useState('');
  const [glarePosition, setGlarePosition] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!ref.current) return;

    const rect = ref.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rotateX = ((y - centerY) / centerY) * -maxTilt;
    const rotateY = ((x - centerX) / centerX) * maxTilt;

    setTransform(
      `perspective(${perspective}px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(${scale}, ${scale}, ${scale})`
    );

    if (enableGlare) {
      const glareX = (x / rect.width) * 100;
      const glareY = (y / rect.height) * 100;
      setGlarePosition({ x: glareX, y: glareY });
    }
  };

  const handleMouseLeave = () => {
    setTransform('perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)');
  };

  return (
    <motion.div
      ref={ref}
      className={cn('relative overflow-hidden', className)}
      style={{ transformStyle: 'preserve-3d' }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      animate={{ transform }}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
    >
      {children}

      {enableGlare && (
        <motion.div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: `radial-gradient(circle at ${glarePosition.x}% ${glarePosition.y}%, ${glareColor}, transparent 60%)`,
          }}
        />
      )}
    </motion.div>
  );
};

export default TiltCard;
