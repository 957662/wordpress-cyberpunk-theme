'use client';

/**
 * 视差滚动容器
 * 创建多层视差滚动效果
 */

import { useRef, useEffect, useState } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { cn } from '@/lib/utils';

export interface ParallaxLayer {
  children: React.ReactNode;
  speed?: number;
  className?: string;
}

export interface ParallaxContainerProps {
  children: React.ReactNode | React.ReactNode[];
  className?: string;
  height?: string;
}

export function ParallaxContainer({
  children,
  className,
  height = '100vh',
}: ParallaxContainerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [elementTop, setElementTop] = useState(0);

  useEffect(() => {
    const element = containerRef.current;
    if (!element) return;

    const updateTop = () => {
      setElementTop(element.offsetTop);
    };

    updateTop();
    window.addEventListener('resize', updateTop);
    return () => window.removeEventListener('resize', updateTop);
  }, []);

  const layers = Array.isArray(children) ? children : [children];

  return (
    <div ref={containerRef} className={cn('relative', className)} style={{ height }}>
      {layers.map((layer, index) => {
        if (typeof layer === 'object' && 'props' in layer) {
          const speed = (layer.props as any).speed || 0;
          return (
            <ParallaxLayerItem
              key={index}
              speed={speed}
              elementTop={elementTop}
              className={(layer.props as any).className}
            >
              {(layer.props as any).children}
            </ParallaxLayerItem>
          );
        }
        return <div key={index}>{layer}</div>;
      })}
    </div>
  );
}

interface ParallaxLayerItemProps {
  children: React.ReactNode;
  speed: number;
  elementTop: number;
  className?: string;
}

function ParallaxLayerItem({
  children,
  speed,
  elementTop,
  className,
}: ParallaxLayerItemProps) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollY } = useScroll();
  const y = useTransform(scrollY, [elementTop - window.innerHeight, elementTop + window.innerHeight], [0, speed * 200]);

  return (
    <motion.div ref={ref} style={{ y }} className={cn('absolute inset-0', className)}>
      {children}
    </motion.div>
  );
}

export function ParallaxLayer({ children, speed = 0, className }: ParallaxLayer) {
  return <>{children}</>;
}
