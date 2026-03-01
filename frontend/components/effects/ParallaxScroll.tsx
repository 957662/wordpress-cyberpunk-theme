/**
 * ParallaxScroll - 滚动视差效果
 * 基于滚动位置的视差动画组件
 */

'use client';

import { useEffect, useRef, useState } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { cn } from '@/lib/utils';

export interface ParallaxScrollProps {
  children: React.ReactNode;
  className?: string;
  speed?: number; // -1 到 1，负数反向移动
  offset?: number; // 视差偏移量 (px)
  disabled?: boolean; // 禁用视差效果（移动端）
}

export function ParallaxScroll({
  children,
  className,
  speed = 0.5,
  offset = 0,
  disabled = false,
}: ParallaxScrollProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [isMobile, setIsMobile] = useState(false);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  });

  const y = useTransform(scrollYProgress, [0, 1], [0, offset * speed]);
  const opacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0, 1, 1, 0]);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  if (disabled || isMobile) {
    return <div className={className}>{children}</div>;
  }

  return (
    <div ref={ref} className={cn('relative', className)}>
      <motion.div style={{ y, opacity }}>
        {children}
      </motion.div>
    </div>
  );
}

// 多层视差组件
export interface ParallaxLayerProps {
  children: React.ReactNode;
  speed: number;
  className?: string;
}

export function ParallaxLayer({ children, speed, className }: ParallaxLayerProps) {
  return (
    <ParallaxScroll speed={speed} className={className}>
      {children}
    </ParallaxScroll>
  );
}

// 视差容器
export interface ParallaxContainerProps {
  children: React.ReactNode;
  className?: string;
}

export function ParallaxContainer({ children, className }: ParallaxContainerProps) {
  return (
    <div className={cn('relative overflow-hidden', className)}>
      {children}
    </div>
  );
}
