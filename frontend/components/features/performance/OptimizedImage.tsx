'use client';

import React, { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface OptimizedImageProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  className?: string;
  priority?: boolean;
  fill?: boolean;
  sizes?: string;
  quality?: number;
  placeholder?: 'blur' | 'empty';
  blurDataURL?: string;
  onLoad?: () => void;
  onError?: () => void;
}

export function OptimizedImage({
  src,
  alt,
  width,
  height,
  className,
  priority = false,
  fill = false,
  sizes,
  quality = 75,
  placeholder = 'empty',
  blurDataURL,
  onLoad,
  onError,
}: OptimizedImageProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const imgRef = useRef<HTMLDivElement>(null);

  const handleLoad = () => {
    setIsLoading(false);
    onLoad?.();
  };

  const handleError = () => {
    setIsLoading(false);
    setHasError(true);
    onError?.();
  };

  return (
    <div
      ref={imgRef}
      className={cn('relative overflow-hidden', className)}
      style={fill ? undefined : { width, height }}
    >
      {/* Loading State */}
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-cyber-dark/50">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
          >
            <Loader2 className="w-8 h-8 text-cyber-cyan" />
          </motion.div>
        </div>
      )}

      {/* Error State */}
      {hasError && (
        <div className="absolute inset-0 flex items-center justify-center bg-cyber-dark/50">
          <div className="text-center text-gray-400">
            <p>图片加载失败</p>
            <p className="text-xs mt-1">{alt}</p>
          </div>
        </div>
      )}

      {/* Image */}
      <Image
        src={src}
        alt={alt}
        width={fill ? undefined : width}
        height={fill ? undefined : height}
        fill={fill}
        sizes={sizes}
        quality={quality}
        priority={priority}
        placeholder={placeholder}
        blurDataURL={blurDataURL}
        onLoad={handleLoad}
        onError={handleError}
        className={cn(
          'transition-opacity duration-300',
          isLoading ? 'opacity-0' : 'opacity-100'
        )}
      />
    </div>
  );
}

// Lazy loaded image component
interface LazyImageProps extends Omit<OptimizedImageProps, 'priority'> {
  threshold?: number;
  rootMargin?: string;
  triggerOnce?: boolean;
}

export function LazyImage({
  threshold = 0.1,
  rootMargin = '50px',
  triggerOnce = true,
  ...props
}: LazyImageProps) {
  const [isVisible, setIsVisible] = useState(false);
  const imgRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const element = imgRef.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          if (triggerOnce) {
            observer.disconnect();
          }
        }
      },
      { threshold, rootMargin }
    );

    observer.observe(element);

    return () => observer.disconnect();
  }, [threshold, rootMargin, triggerOnce]);

  return (
    <div ref={imgRef} className={cn('relative', props.className)}>
      {isVisible ? (
        <OptimizedImage {...props} />
      ) : (
        <div
          className="bg-cyber-dark/50 animate-pulse"
          style={{ width: props.width, height: props.height }}
        />
      )}
    </div>
  );
}

// Avatar with optimized loading
interface OptimizedAvatarProps {
  src?: string;
  alt: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  fallback?: string;
}

export function OptimizedAvatar({
  src,
  alt,
  size = 'md',
  className,
  fallback,
}: OptimizedAvatarProps) {
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
          'rounded-full bg-gradient-to-br from-cyber-cyan to-cyber-purple flex items-center justify-center text-white font-bold',
          className
        )}
        style={{ width: sizeValue, height: sizeValue }}
      >
        {fallback || alt.charAt(0).toUpperCase()}
      </div>
    );
  }

  return (
    <div className={cn('rounded-full overflow-hidden', className)}>
      <OptimizedImage
        src={src}
        alt={alt}
        width={sizeValue}
        height={sizeValue}
        onError={() => setHasError(true)}
        className="rounded-full"
      />
    </div>
  );
}

// Image gallery with lazy loading
interface ImageGalleryProps {
  images: Array<{
    src: string;
    alt: string;
    width?: number;
    height?: number;
  }>;
  columns?: number;
  gap?: number;
  className?: string;
}

export function ImageGallery({
  images,
  columns = 3,
  gap = 4,
  className,
}: ImageGalleryProps) {
  return (
    <div
      className={cn('grid', className)}
      style={{
        gridTemplateColumns: `repeat(${columns}, 1fr)`,
        gap: `${gap * 4}px`,
      }}
    >
      {images.map((image, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
          className="relative aspect-square overflow-hidden rounded-lg"
        >
          <LazyImage
            src={image.src}
            alt={image.alt}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-cover"
          />
        </motion.div>
      ))}
    </div>
  );
}

export default OptimizedImage;
