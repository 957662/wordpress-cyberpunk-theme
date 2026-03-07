'use client';

import React, { useState, useRef, useCallback } from 'react';
import Image from 'next/image';
import { cn } from '@/lib/utils';

export interface OptimizedImageProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  fill?: boolean;
  className?: string;
  priority?: boolean;
  quality?: number;
  placeholder?: 'blur' | 'empty';
  blurDataURL?: string;
  sizes?: string;
  onLoad?: () => void;
  onError?: () => void;
  style?: React.CSSProperties;
}

/**
 * OptimizedImage - 优化的图片组件
 * 支持懒加载、模糊占位符、错误处理
 */
export function OptimizedImage({
  src,
  alt,
  width,
  height,
  fill = false,
  className,
  priority = false,
  quality = 75,
  placeholder = 'empty',
  blurDataURL,
  sizes,
  onLoad,
  onError,
  style,
  ...props
}: OptimizedImageProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const imgRef = useRef<HTMLDivElement>(null);

  const handleLoad = useCallback(() => {
    setIsLoading(false);
    onLoad?.();
  }, [onLoad]);

  const handleError = useCallback(() => {
    setIsLoading(false);
    setHasError(true);
    onError?.();
  }, [onError]);

  // 如果出错，显示占位符
  if (hasError) {
    return (
      <div
        className={cn(
          'bg-gray-200 dark:bg-gray-800 flex items-center justify-center',
          className
        )}
        style={style}
        {...props}
      >
        <svg
          className="w-12 h-12 text-gray-400"
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
      </div>
    );
  }

  return (
    <div ref={imgRef} className={cn('relative overflow-hidden', className)} style={style}>
      {/* 加载占位符 */}
      {isLoading && placeholder === 'blur' && (
        <div className="absolute inset-0 bg-gray-200 dark:bg-gray-800 animate-pulse" />
      )}

      {/* 图片 */}
      <Image
        src={src}
        alt={alt}
        width={fill ? undefined : width}
        height={fill ? undefined : height}
        fill={fill}
        priority={priority}
        quality={quality}
        placeholder={placeholder}
        blurDataURL={blurDataURL}
        sizes={sizes}
        onLoad={handleLoad}
        onError={handleError}
        className={cn(
          'transition-opacity duration-300',
          isLoading ? 'opacity-0' : 'opacity-100'
        )}
        {...props}
      />
    </div>
  );
}

/**
 * LazyImage - 懒加载图片组件
 */
export function LazyImage(props: OptimizedImageProps) {
  return <OptimizedImage {...props} priority={false} />;
}

/**
 * ProgressiveImage - 渐进式图片加载组件
 */
export function ProgressiveImage({
  src,
  alt,
  className,
  ...props
}: OptimizedImageProps) {
  const [imgSrc, setImgSrc] = useState(
    props.blurDataURL || 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7'
  );

  return (
    <OptimizedImage
      {...props}
      src={imgSrc}
      alt={alt}
      className={className}
      placeholder="blur"
      blurDataURL={imgSrc}
      onLoad={() => {
        if (imgSrc !== src) {
          setImgSrc(src);
        }
      }}
    />
  );
}

/**
 * Avatar - 头像组件
 */
export interface AvatarProps {
  src?: string;
  alt: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  fallback?: string;
}

export function Avatar({
  src,
  alt,
  size = 'md',
  className,
  fallback,
}: AvatarProps) {
  const [hasError, setHasError] = useState(!src);

  const sizes = {
    sm: 32,
    md: 48,
    lg: 64,
    xl: 96,
  };

  const sizeValue = sizes[size];

  if (hasError || !src) {
    return (
      <div
        className={cn(
          'rounded-full bg-gradient-to-br from-cyan-500 to-purple-500 flex items-center justify-center text-white font-semibold',
          className
        )}
        style={{ width: sizeValue, height: sizeValue }}
      >
        {fallback || alt.charAt(0).toUpperCase()}
      </div>
    );
  }

  return (
    <OptimizedImage
      src={src}
      alt={alt}
      width={sizeValue}
      height={sizeValue}
      className={cn('rounded-full', className)}
      onError={() => setHasError(true)}
    />
  );
}

/**
 * ImageGallery - 图片画廊组件
 */
export interface ImageGalleryProps {
  images: Array<{
    src: string;
    alt: string;
    width?: number;
    height?: number;
  }>;
  className?: string;
  columns?: 2 | 3 | 4;
  gap?: number;
}

export function ImageGallery({
  images,
  className,
  columns = 3,
  gap = 4,
}: ImageGalleryProps) {
  const gridColumns = {
    2: 'grid-cols-2',
    3: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3',
    4: 'grid-cols-2 lg:grid-cols-4',
  };

  return (
    <div className={cn('grid', gridColumns[columns], `gap-${gap}`, className)}>
      {images.map((image, index) => (
        <div key={index} className="relative aspect-square overflow-hidden rounded-lg">
          <OptimizedImage
            {...image}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="object-cover hover:scale-105 transition-transform duration-300"
          />
        </div>
      ))}
    </div>
  );
}

export default OptimizedImage;
