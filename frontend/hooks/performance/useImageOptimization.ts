'use client';

import { useState, useEffect, RefObject } from 'react';

interface UseImageOptimizationOptions {
  threshold?: number;
  rootMargin?: string;
  enabled?: boolean;
  placeholder?: string;
}

interface UseImageOptimizationReturn {
  isLoaded: boolean;
  isError: boolean;
  imgRef: RefObject<HTMLImageElement>;
  src: string;
}

/**
 * Hook for optimizing image loading with lazy loading and placeholder support
 */
export function useImageOptimization(
  originalSrc: string,
  options: UseImageOptimizationOptions = {}
): UseImageOptimizationReturn {
  const {
    threshold = 0.1,
    rootMargin = '50px',
    enabled = true,
    placeholder = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 300"%3E%3Crect width="400" height="300" fill="%231a1a2e"/%3E%3C/svg%3E',
  } = options;

  const [isLoaded, setIsLoaded] = useState(false);
  const [isError, setIsError] = useState(false);
  const [src, setSrc] = useState(placeholder);
  const [imgRef, setImgRef] = useState<HTMLImageElement | null>(null);

  useEffect(() => {
    if (!enabled || !imgRef) return;

    // Check if browser supports IntersectionObserver
    if (!('IntersectionObserver' in window)) {
      // Fallback: load image immediately
      setSrc(originalSrc);
      return;
    }

    // Create IntersectionObserver
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            // Load the actual image
            const img = new Image();
            img.src = originalSrc;

            img.onload = () => {
              setSrc(originalSrc);
              setIsLoaded(true);
            };

            img.onerror = () => {
              setIsError(true);
            };

            // Stop observing once loaded
            observer.disconnect();
          }
        });
      },
      {
        threshold,
        rootMargin,
      }
    );

    observer.observe(imgRef);

    return () => {
      observer.disconnect();
    };
  }, [imgRef, originalSrc, threshold, rootMargin, enabled, placeholder]);

  return {
    isLoaded,
    isError,
    imgRef: { current: imgRef } as RefObject<HTMLImageElement>,
    src,
  };
}

/**
 * Hook for generating responsive image sizes
 */
export function useResponsiveImage(src: string, sizes: number[] = [640, 750, 828, 1080, 1200]) {
  const [srcSet, setSrcSet] = useState<string>('');

  useEffect(() => {
    if (typeof src !== 'string' || !src.includes('http')) {
      return;
    }

    // Generate srcset for different sizes
    // This assumes you have an image service that can resize images
    // For demo purposes, we'll just return the original src
    const sizesString = sizes
      .map((size) => `${src}?w=${size} ${size}w`)
      .join(', ');

    setSrcSet(sizesString);
  }, [src, sizes]);

  return { srcSet };
}

/**
 * Hook for preloading images
 */
export function useImagePreload(images: string[], priority: boolean = false) {
  const [loadedImages, setLoadedImages] = useState<Set<string>>(new Set());

  useEffect(() => {
    if (!priority) return;

    // Preload all images
    images.forEach((src) => {
      if (loadedImages.has(src)) return;

      const img = new Image();
      img.src = src;

      img.onload = () => {
        setLoadedImages((prev) => new Set(prev).add(src));
      };
    });
  }, [images, priority, loadedImages]);

  return {
    isLoaded: (src: string) => loadedImages.has(src),
    progress: (loadedImages.size / images.length) * 100,
  };
}
