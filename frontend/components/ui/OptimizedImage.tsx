'use client';

import React, { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import { cn } from '@/lib/utils';

export interface OptimizedImageProps extends React.ComponentProps<typeof Image> {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  fill?: boolean;
  className?: string;
  containerClassName?: string;
  placeholder?: 'blur' | 'empty' | 'custom';
  blurDataURL?: string;
  loading?: 'lazy' | 'eager';
  priority?: boolean;
  quality?: number;
  sizes?: string;
  onLoad?: () => void;
  onError?: () => void;
  showSkeleton?: boolean;
  skeletonClassName?: string;
  enableZoom?: boolean;
  zoomOnClick?: boolean;
}

export const OptimizedImage: React.FC<OptimizedImageProps> = ({
  src,
  alt,
  width,
  height,
  fill = false,
  className,
  containerClassName,
  placeholder = 'empty',
  blurDataURL,
  loading = 'lazy',
  priority = false,
  quality = 75,
  sizes,
  onLoad,
  onError,
  showSkeleton = true,
  skeletonClassName,
  enableZoom = false,
  zoomOnClick = false,
  ...props
}) => {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [isZoomed, setIsZoomed] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    setIsLoading(true);
    setHasError(false);
  }, [src]);

  const handleLoad = () => {
    setIsLoading(false);
    onLoad?.();
  };

  const handleError = () => {
    setIsLoading(false);
    setHasError(true);
    onError?.();
  };

  const handleClick = () => {
    if (zoomOnClick) {
      setIsZoomed(!isZoomed);
    }
  };

  // 错误状态
  if (hasError) {
    return (
      <div
        className={cn(
          'flex items-center justify-center bg-cyber-muted/20',
          'border border-cyber-border',
          className || containerClassName
        )}
        style={{ width, height }}
      >
        <div className="text-center p-4">
          <svg
            className="w-12 h-12 mx-auto text-gray-600 mb-2"
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
          <p className="text-sm text-gray-500">图片加载失败</p>
        </div>
      </div>
    );
  }

  // 加载骨架屏
  if (isLoading && showSkeleton) {
    return (
      <div className={cn('relative', containerClassName)}>
        <div
          className={cn(
            'animate-pulse bg-cyber-muted/20',
            skeletonClassName || className
          )}
          style={{ width, height }}
        />
        <Image
          ref={imgRef as any}
          src={src}
          alt={alt}
          width={width}
          height={height}
          fill={fill}
          quality={quality}
          priority={priority}
          sizes={sizes}
          className={cn(
            'transition-opacity duration-300',
            isLoading ? 'opacity-0' : 'opacity-100',
            isZoomed && 'cursor-zoom-out scale-150',
            !isZoomed && enableZoom && 'cursor-zoom-in',
            className
          )}
          onLoad={handleLoad}
          onError={handleError}
          onClick={handleClick}
          placeholder={blurDataURL ? 'blur' : placeholder}
          blurDataURL={blurDataURL}
          {...props}
        />
      </div>
    );
  }

  return (
    <div className={cn('relative overflow-hidden', containerClassName)}>
      <Image
        ref={imgRef as any}
        src={src}
        alt={alt}
        width={width}
        height={height}
        fill={fill}
        quality={quality}
        loading={loading}
        priority={priority}
        sizes={sizes}
        className={cn(
          'transition-all duration-300',
          isZoomed && 'fixed inset-0 z-50 w-full h-full object-contain bg-black/90',
          !isZoomed && enableZoom && 'cursor-zoom-in',
          className
        )}
        onLoad={handleLoad}
        onError={handleError}
        onClick={handleClick}
        placeholder={blurDataURL ? 'blur' : placeholder}
        blurDataURL={blurDataURL}
        {...props}
      />
    </div>
  );
};

export default OptimizedImage;
