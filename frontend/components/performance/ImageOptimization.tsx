'use client';

import React, { useState, useRef, useEffect } from 'react';
import Image, { ImageProps } from 'next/image';

interface ImageOptimizationProps extends Omit<ImageProps, 'onLoad' | 'onError'> {
  lowQualityUrl?: string;
  blurDataURL?: string;
  onLoadCallback?: () => void;
  onErrorCallback?: () => void;
  fallback?: React.ReactNode;
  showSkeleton?: boolean;
}

export default function ImageOptimization({
  lowQualityUrl,
  blurDataURL,
  onLoadCallback,
  onErrorCallback,
  fallback,
  showSkeleton = true,
  className = '',
  ...props
}: ImageOptimizationProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);

  const handleLoad = () => {
    setIsLoaded(true);
    onLoadCallback?.();
  };

  const handleError = () => {
    setHasError(true);
    onErrorCallback?.();
  };

  // Intersection Observer for lazy loading
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && imgRef.current) {
            const img = imgRef.current as any;
            if (img.loading === 'lazy') {
              img.loading = 'eager';
            }
          }
        });
      },
      { rootMargin: '50px' }
    );

    if (imgRef.current) {
      observer.observe(imgRef.current);
    }

    return () => observer.disconnect();
  }, []);

  if (hasError && fallback) {
    return <>{fallback}</>;
  }

  return (
    <div className={`relative overflow-hidden ${className}`}>
      {/* Skeleton */}
      {showSkeleton && !isLoaded && (
        <div className="absolute inset-0 bg-gradient-to-r from-gray-800 via-gray-700 to-gray-800 animate-pulse" />
      )}

      {/* Image */}
      <Image
        ref={imgRef}
        {...props}
        className={`transition-opacity duration-300 ${
          isLoaded ? 'opacity-100' : 'opacity-0'
        } ${props.className || ''}`}
        onLoad={handleLoad}
        onError={handleError}
        placeholder={blurDataURL ? 'blur' : 'empty'}
        blurDataURL={blurDataURL}
        loading="lazy"
      />
    </div>
  );
}

// Progressive Image Loader
export function ProgressiveImage({
  src,
  alt,
  width,
  height,
  className = '',
}: {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  className?: string;
}) {
  const [currentSrc, setCurrentSrc] = useState<string>('');
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    // Load low quality first
    const lowQualityImg = new Image();
    lowQualityImg.src = `${src}?w=10&blur=10`;

    lowQualityImg.onload = () => {
      setCurrentSrc(lowQualityImg.src);
    };

    // Then load high quality
    const highQualityImg = new Image();
    highQualityImg.src = src;

    highQualityImg.onload = () => {
      setCurrentSrc(src);
      setIsLoaded(true);
    };
  }, [src]);

  return (
    <div className={`relative ${className}`} style={{ width, height }}>
      <img
        src={currentSrc}
        alt={alt}
        className={`w-full h-full object-cover transition-all duration-500 ${
          isLoaded ? 'filter-none' : 'filter blur-xl'
        }`}
        width={width}
        height={height}
      />
      {!isLoaded && (
        <div className="absolute inset-0 bg-gradient-to-r from-cyber-cyan/20 to-cyber-purple/20 animate-pulse" />
      )}
    </div>
  );
}
