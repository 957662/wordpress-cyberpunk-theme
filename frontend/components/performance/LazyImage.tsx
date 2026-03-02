'use client';

/**
 * 懒加载图片组件
 * 支持占位符、加载状态、错误处理
 */

import { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import { cn } from '@/lib/utils';

interface LazyImageProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  className?: string;
  imageClassName?: string;
  priority?: boolean;
  fill?: boolean;
  quality?: number;
  onLoad?: () => void;
  onError?: () => void;
}

type LoadingState = 'idle' | 'loading' | 'loaded' | 'error';

export function LazyImage({
  src,
  alt,
  width,
  height,
  className,
  imageClassName,
  priority = false,
  fill = false,
  quality = 85,
  onLoad,
  onError,
}: LazyImageProps) {
  const [state, setState] = useState<LoadingState>(priority ? 'loading' : 'idle');
  const [isInView, setIsInView] = useState(priority);

  useEffect(() => {
    if (priority || isInView) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setIsInView(true);
          observer.disconnect();
        }
      },
      { rootMargin: '50px' }
    );

    const ref = document.current;
    if (ref) observer.observe(ref);
    return () => observer.disconnect();
  }, [priority, isInView]);

  const handleLoad = () => {
    setState('loaded');
    onLoad?.();
  };

  const handleError = () => {
    setState('error');
    onError?.();
  };

  useEffect(() => {
    if (isInView && state === 'idle') setState('loading');
  }, [isInView, state]);

  if (!isInView && state === 'idle') {
    return <div className={cn('bg-cyber-muted/20 animate-pulse', fill ? 'absolute inset-0' : 'relative', className)} style={{ width: fill ? undefined : width, height: fill ? undefined : height }} />;
  }

  return (
    <div className={cn('relative', className)}>
      <Image
        src={src}
        alt={alt}
        width={fill ? undefined : width}
        height={fill ? undefined : height}
        fill={fill}
        quality={quality}
        className={cn('transition-opacity duration-300', state === 'loaded' ? 'opacity-100' : 'opacity-0', imageClassName)}
        onLoad={handleLoad}
        onError={handleError}
      />
      {state === 'loading' && (
        <div className="absolute inset-0 flex items-center justify-center bg-cyber-dark/30">
          <div className="w-8 h-8 border-2 border-cyber-cyan border-t-transparent rounded-full animate-spin" />
        </div>
      )}
    </div>
  );
}

export default LazyImage;
