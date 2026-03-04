'use client';

import React, { useState, useRef, useEffect } from 'react';
import { cn } from '@/lib/utils';
import {
  getOptimizedImageUrl,
  generateSrcSet,
  generateSizes,
  preloadImage,
  type ImageOptimizationOptions,
} from '@/lib/image-optimizer';

interface OptimizedImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src: string;
  alt: string;
  widths?: number[];
  sizes?: Record<string, string>;
  options?: ImageOptimizationOptions;
  className?: string;
  placeholder?: string;
  preload?: boolean;
  onLoad?: () => void;
  onError?: () => void;
}

export function OptimizedImage({
  src,
  alt,
  widths = [320, 640, 960, 1280, 1920],
  sizes = {
    '640px': '100vw',
    '1024px': '50vw',
    '1280px': '33vw',
  },
  options = {},
  className,
  placeholder,
  preload = false,
  onLoad,
  onError,
  ...props
}: OptimizedImageProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isError, setIsError] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);

  const optimizedSrc = getOptimizedImageUrl(src, options);
  const srcSet = generateSrcSet(src, widths, options.format);
  const sizesAttr = generateSizes(sizes);

  useEffect(() => {
    if (preload && optimizedSrc) {
      preloadImage(optimizedSrc)
        .then(() => {
          setIsLoaded(true);
          onLoad?.();
        })
        .catch(() => {
          setIsError(true);
          onError?.();
        });
    }
  }, [preload, optimizedSrc, onLoad, onError]);

  const handleLoad = () => {
    setIsLoaded(true);
    onLoad?.();
  };

  const handleError = () => {
    setIsError(true);
    onError?.();
  };

  return (
    <img
      ref={imgRef}
      src={optimizedSrc}
      srcSet={srcSet}
      sizes={sizesAttr}
      alt={alt}
      className={cn(
        'transition-opacity duration-300',
        isLoaded ? 'opacity-100' : 'opacity-0',
        className
      )}
      onLoad={handleLoad}
      onError={handleError}
      {...props}
    />
  );
}

// 赛博朋克风格优化图片组件
export function CyberOptimizedImage({
  src,
  alt,
  className,
  ...props
}: OptimizedImageProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isError, setIsError] = useState(false);

  const optimizedSrc = getOptimizedImageUrl(src, {
    quality: 85,
    format: 'webp',
    ...props.options,
  });

  return (
    <div className={cn('relative overflow-hidden group', className)}>
      {/* 占位符 */}
      {!isLoaded && !isError && (
        <div className="absolute inset-0 bg-cyber-dark animate-pulse">
          <div className="absolute inset-0 bg-gradient-to-br from-cyber-cyan/10 to-cyber-purple/10" />
        </div>
      )}

      {/* 错误状态 */}
      {isError && (
        <div className="absolute inset-0 flex items-center justify-center bg-cyber-dark/50">
          <div className="text-center">
            <svg
              className="w-12 h-12 mx-auto mb-2 text-cyber-pink"
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
            <p className="text-cyber-pink text-sm">图片加载失败</p>
          </div>
        </div>
      )}

      {/* 图片 */}
      <img
        src={optimizedSrc}
        alt={alt}
        className={cn(
          'w-full h-full object-cover transition-all duration-500',
          isLoaded ? 'opacity-100' : 'opacity-0',
          'group-hover:scale-105 group-hover:shadow-2xl',
          'group-hover:shadow-cyber-cyan/20'
        )}
        onLoad={() => setIsLoaded(true)}
        onError={() => setIsError(true)}
        {...props}
      />

      {/* 赛博朋克效果叠加层 */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-t from-cyber-dark/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        <div className="absolute inset-0 bg-[url(/images/scanlines.png)] opacity-5 mix-blend-overlay" />
      </div>

      {/* 加载指示器 */}
      {!isLoaded && !isError && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="relative">
            <div className="w-16 h-16 border-4 border-cyber-cyan/30 rounded-full" />
            <div className="absolute top-0 left-0 w-16 h-16 border-4 border-transparent border-t-cyber-cyan rounded-full animate-spin" />
          </div>
        </div>
      )}
    </div>
  );
}
