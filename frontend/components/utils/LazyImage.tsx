'use client';

import React, { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';

export interface LazyImageProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  fill?: boolean;
  className?: string;
  containerClassName?: string;
  placeholder?: 'blur' | 'empty' | 'skeleton';
  blurDataURL?: string;
  threshold?: number;
  fadeIn?: boolean;
  objectFit?: 'cover' | 'contain' | 'fill' | 'none' | 'scale-down';
  onLoad?: () => void;
  onError?: () => void;
  priority?: boolean;
  quality?: number;
}

export const LazyImage: React.FC<LazyImageProps> = ({
  src,
  alt,
  width,
  height,
  fill = false,
  className,
  containerClassName,
  placeholder = 'skeleton',
  blurDataURL,
  threshold = 0.1,
  fadeIn = true,
  objectFit = 'cover',
  onLoad,
  onError,
  priority = false,
  quality = 75,
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isError, setIsError] = useState(false);
  const [isInView, setIsInView] = useState(priority);
  const imgRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (priority) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          observer.disconnect();
        }
      },
      { threshold }
    );

    const currentRef = imgRef.current;
    if (currentRef) {
      observer.observe(currentRef);
    }

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
      }
    };
  }, [threshold, priority]);

  const handleLoad = () => {
    setIsLoaded(true);
    onLoad?.();
  };

  const handleError = () => {
    setIsError(true);
    onError?.();
  };

  const renderPlaceholder = () => {
    switch (placeholder) {
      case 'blur':
        return (
          <div
            className={cn(
              'absolute inset-0 bg-gradient-to-br from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-800 animate-pulse',
              className
            )}
            style={{ filter: 'blur(20px)' }}
          />
        );
      case 'empty':
        return null;
      case 'skeleton':
      default:
        return (
          <div className="absolute inset-0 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 dark:from-gray-700 dark:via-gray-600 dark:to-gray-700 animate-shimmer">
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full animate-shimmer-slide" />
          </div>
        );
    }
  };

  const renderError = () => (
    <div className={cn(
      'absolute inset-0 flex items-center justify-center bg-gray-100 dark:bg-gray-800',
      className
    )}>
      <div className="text-center p-4">
        <svg
          className="w-12 h-12 mx-auto mb-2 text-gray-400"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
          />
        </svg>
        <p className="text-sm text-gray-500 dark:text-gray-400">加载失败</p>
      </div>
    </div>
  );

  return (
    <div
      ref={imgRef}
      className={cn(
        'relative overflow-hidden',
        fill && 'absolute inset-0',
        containerClassName
      )}
      style={fill ? undefined : { width, height }}
    >
      <AnimatePresence mode="wait">
        {!isLoaded && !isError && isInView && (
          <motion.div
            key="placeholder"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: fadeIn ? 0.3 : 0 }}
            className="absolute inset-0"
          >
            {renderPlaceholder()}
          </motion.div>
        )}

        {isError && (
          <motion.div
            key="error"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="absolute inset-0"
          >
            {renderError()}
          </motion.div>
        )}

        {isInView && !isError && (
          <motion.div
            key="image"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: fadeIn ? 0.5 : 0 }}
            className="absolute inset-0"
          >
            <Image
              src={src}
              alt={alt}
              fill={fill}
              width={fill ? undefined : width}
              height={fill ? undefined : height}
              className={cn(
                'transition-transform duration-300',
                isLoaded && 'hover:scale-105',
                className
              )}
              style={{ objectFit }}
              onLoad={handleLoad}
              onError={handleError}
              priority={priority}
              quality={quality}
              placeholder={blurDataURL ? 'blur' : undefined}
              blurDataURL={blurDataURL}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default LazyImage;
