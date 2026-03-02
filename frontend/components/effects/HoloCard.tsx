/**
 * HoloCard - 全息卡片效果组件
 *
 * 创建 3D 全息投影效果，鼠标移动时卡片跟随倾斜
 */

'use client';

import { motion, useMotionValue, useTransform } from 'framer-motion';
import { useRef, useState } from 'react';
import { cn } from '@/lib/utils';

export interface HoloCardProps {
  children: React.ReactNode;
  /** 最大旋转角度 */
  maxRotation?: number;
  /** 是否启用 3D 效果 */
  enabled?: boolean;
  /** 额外的类名 */
  className?: string;
  /** 全息强度 */
  intensity?: 'low' | 'medium' | 'high';
  /** 是否发光 */
  glow?: boolean;
  /** 发光颜色 */
  glowColor?: 'cyan' | 'purple' | 'pink' | 'yellow';
}

const glowColorMap = {
  cyan: '0 0 30px rgba(0, 240, 255, 0.3)',
  purple: '0 0 30px rgba(157, 0, 255, 0.3)',
  pink: '0 0 30px rgba(255, 0, 128, 0.3)',
  yellow: '0 0 30px rgba(240, 255, 0, 0.3)',
};

const intensityMap = {
  low: { perspective: 1000, scale: 1.02 },
  medium: { perspective: 800, scale: 1.05 },
  high: { perspective: 600, scale: 1.08 },
};

export function HoloCard({
  children,
  maxRotation = 15,
  enabled = true,
  className,
  intensity = 'medium',
  glow = true,
  glowColor = 'cyan',
}: HoloCardProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const rotateX = useTransform(mouseY, [-0.5, 0.5], [maxRotation, -maxRotation]);
  const rotateY = useTransform(mouseX, [-0.5, 0.5], [-maxRotation, maxRotation]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!enabled || !ref.current) return;

    const rect = ref.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    mouseX.set((e.clientX - centerX) / rect.width);
    mouseY.set((e.clientY - centerY) / rect.height);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    mouseX.set(0);
    mouseY.set(0);
  };

  const intensityValues = intensityMap[intensity];

  return (
    <motion.div
      ref={ref}
      className={cn('relative', className)}
      style={{
        perspective: intensityValues.perspective,
      }}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
    >
      <motion.div
        style={{
          rotateX: enabled ? rotateX : 0,
          rotateY: enabled ? rotateY : 0,
          transformStyle: 'preserve-3d',
          boxShadow: glow && isHovered ? glowColorMap[glowColor] : 'none',
        }}
        animate={{
          scale: isHovered ? intensityValues.scale : 1,
        }}
        transition={{
          type: 'spring',
          stiffness: 300,
          damping: 20,
        }}
        className="relative"
      >
        {/* 全息扫描线效果 */}
        {isHovered && enabled && (
          <motion.div
            className="absolute inset-0 pointer-events-none rounded-lg overflow-hidden"
            style={{
              background: 'linear-gradient(transparent 50%, rgba(0, 240, 255, 0.03) 50%)',
              backgroundSize: '100% 4px',
            }}
            animate={{
              opacity: [0.3, 0.6, 0.3],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          />
        )}

        {/* 内容 */}
        <div style={{ transform: 'translateZ(20px)' }}>{children}</div>

        {/* 全息辉光层 */}
        {isHovered && enabled && (
          <motion.div
            className="absolute inset-0 pointer-events-none rounded-lg"
            style={{
              background: 'radial-gradient(circle at center, rgba(0, 240, 255, 0.1) 0%, transparent 70%)',
            }}
            animate={{
              opacity: [0, 0.5, 0],
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          />
        )}
      </motion.div>
    </motion.div>
  );
}

/**
 * HoloCardTilt - 带倾斜感应的全息卡片
 */
export interface HoloCardTiltProps extends HoloCardProps {
  /** 初始倾斜角度 */
  initialTilt?: { x: number; y: number };
}

export function HoloCardTilt({
  children,
  initialTilt = { x: 0, y: 0 },
  ...cardProps
}: HoloCardTiltProps) {
  return (
    <HoloCard {...cardProps}>
      <motion.div
        initial={{ rotateX: initialTilt.x, rotateY: initialTilt.y }}
        whileHover={{
          rotateX: 0,
          rotateY: 0,
        }}
        transition={{ type: 'spring', stiffness: 300, damping: 20 }}
      >
        {children}
      </motion.div>
    </HoloCard>
  );
}

/**
 * HoloCardContent - 全息卡片内容容器
 */
export interface HoloCardContentProps {
  children: React.ReactNode;
  /** 层级深度 */
  depth?: number;
  className?: string;
}

export function HoloCardContent({ children, depth = 0, className }: HoloCardContentProps) {
  return (
    <div
      className={className)}
      style={{
        transform: `translateZ(${20 + depth * 10}px)`,
      }}
    >
      {children}
    </div>
  );
}
