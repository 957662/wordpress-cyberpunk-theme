'use client';

import React, { HTMLAttributes } from 'react';
import { cn } from '@/lib/utils';
import { useImageLazyWithSrc } from '@/hooks/useImageLazy';

interface LazyImageProps extends HTMLAttributes<HTMLImageElement> {
  src: string;
  alt: string;
  placeholder?: string;
  width?: number | string;
  height?: number | string;
  className?: string;
  loadingClassName?: string;
  errorClassName?: string;
  threshold?: number;
  rootMargin?: string;
}

export function LazyImage({
  src,
  alt,
  placeholder = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="1" height="1"%3E%3C/svg%3E',
  width,
  height,
  className,
  loadingClassName = 'animate-pulse bg-gray-200 dark:bg-gray-800',
  errorClassName = 'bg-gray-300 dark:bg-gray-700',
  threshold = 0.1,
  rootMargin = '50px',
  ...props
}: LazyImageProps) {
  const { ref, isLoaded, isError, imgSrc } = useImageLazyWithSrc(
    src,
    placeholder,
    { threshold, rootMargin }
  );

  return (
    <img
      ref={ref}
      src={imgSrc || placeholder}
      alt={alt}
      width={width}
      height={height}
      className={cn(
        'transition-opacity duration-300',
        isLoaded ? 'opacity-100' : 'opacity-0',
        !isLoaded && !isError && loadingClassName,
        isError && errorClassName,
        className
      )}
      {...props}
    />
  );
}

// 赛博朋克风格懒加载图片组件
export function CyberLazyImage({
  src,
  alt,
  placeholder,
  width,
  height,
  className,
  ...props
}: LazyImageProps) {
  const { ref, isLoaded, isError, imgSrc } = useImageLazyWithSrc(src, placeholder);

  return (
    <div
      className={cn(
        'relative overflow-hidden',
        'before:absolute before:inset-0 before:bg-gradient-to-br before:from-cyber-cyan/20 before:to-cyber-purple/20',
        'after:absolute after:inset-0 after:bg-[url(/images/scanlines.png)] after:opacity-10',
        className
      )}
      style={{ width, height }}
    >
      {!isLoaded && !isError && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-8 h-8 border-2 border-cyber-cyan border-t-transparent rounded-full animate-spin" />
        </div>
      )}
      {isError && (
        <div className="absolute inset-0 flex items-center justify-center bg-cyber-dark/50">
          <svg
            className="w-8 h-8 text-cyber-pink"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </div>
      )}
      <img
        ref={ref}
        src={imgSrc}
        alt={alt}
        width={width}
        height={height}
        className={cn(
          'w-full h-full object-cover transition-all duration-500',
          isLoaded ? 'opacity-100 scale-100' : 'opacity-0 scale-105',
          'hover:scale-105 hover:shadow-lg hover:shadow-cyber-cyan/20'
        )}
        {...props}
      />
    </div>
  );
}
