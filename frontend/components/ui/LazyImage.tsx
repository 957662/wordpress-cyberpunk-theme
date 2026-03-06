'use client';

/**
 * LazyImage - 懒加载图片组件
 * 使用 Intersection Observer 实现图片懒加载，提升性能
 */

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useIntersectionObserver } from '@/hooks/useIntersectionObserver';
import { cn } from '@/lib/utils';

interface LazyImageProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  className?: string;
  containerClassName?: string;
  placeholder?: string;
  blurDataURL?: string;
  onLoad?: () => void;
  onError?: () => void;
  loading?: 'lazy' | 'eager';
  quality?: number;
}

export const LazyImage: React.FC<LazyImageProps> = ({
  src,
  alt,
  width,
  height,
  className,
  containerClassName,
  placeholder = '/images/placeholder.png',
  blurDataURL,
  onLoad,
  onError,
  loading = 'lazy',
  quality = 75,
}) => {
  const [imageSrc, setImageSrc] = useState<string | undefined>(undefined);
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);

  const { ref, isIntersecting } = useIntersectionObserver({
    triggerOnce: true,
    threshold: 0.01,
  });

  // 当图片进入视口时，加载图片
  React.useEffect(() => {
    if (isIntersecting && !imageSrc && !hasError) {
      // 创建图片对象预加载
      const img = new Image();

      img.onload = () => {
        setImageSrc(src);
        setIsLoaded(true);
        onLoad?.();
      };

      img.onerror = () => {
        setHasError(true);
        setImageSrc(placeholder);
        onError?.();
      };

      // 添加查询参数优化图片质量
      const optimizedSrc = `${src}${src.includes('?') ? '&' : '?'}q=${quality}`;
      img.src = optimizedSrc;
    }
  }, [isIntersecting, src, quality, placeholder, onLoad, onError, imageSrc, hasError]);

  return (
    <div
      ref={ref as React.RefObject<HTMLDivElement>}
      className={cn('relative overflow-hidden bg-gray-900', containerClassName)}
      style={{ width, height }}
    >
      {/* 骨架屏/模糊占位 */}
      {!isLoaded && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="absolute inset-0 bg-gradient-to-br from-gray-800 to-gray-900 animate-pulse"
          style={{
            backgroundImage: blurDataURL ? `url(${blurDataURL})` : undefined,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            filter: blurDataURL ? 'blur(20px)' : undefined,
          }}
        />
      )}

      {/* 实际图片 */}
      {imageSrc && (
        <motion.img
          initial={{ opacity: 0 }}
          animate={{ opacity: isLoaded ? 1 : 0 }}
          transition={{ duration: 0.5 }}
          src={imageSrc}
          alt={alt}
          width={width}
          height={height}
          className={cn('w-full h-full object-cover', className)}
          loading={loading}
          onLoad={() => setIsLoaded(true)}
        />
      )}

      {/* 加载指示器 */}
      {!imageSrc && isIntersecting && !hasError && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-8 h-8 border-2 border-cyan-500 border-t-transparent rounded-full animate-spin" />
        </div>
      )}

      {/* 错误状态 */}
      {hasError && (
        <div className="absolute inset-0 flex flex-col items-center justify-center text-gray-500">
          <svg
            className="w-12 h-12 mb-2"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
            />
          </svg>
          <span className="text-sm">图片加载失败</span>
        </div>
      )}
    </div>
  );
};

export default LazyImage;
