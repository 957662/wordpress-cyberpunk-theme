/**
 * 图片懒加载工具
 */

'use client';

import { useEffect, useRef, useState } from 'react';

interface LazyLoadOptions {
  threshold?: number;
  rootMargin?: string;
  triggerOnce?: boolean;
}

export function useLazyLoad(
  options: LazyLoadOptions = {}
): [React.RefObject<HTMLImageElement>, boolean] {
  const { threshold = 0.1, rootMargin = '50px', triggerOnce = true } = options;
  const [isLoaded, setIsLoaded] = useState(false);
  const [isInView, setIsInView] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    const element = imgRef.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          if (triggerOnce) {
            observer.disconnect();
          }
        }
      },
      { threshold, rootMargin }
    );

    observer.observe(element);

    return () => {
      observer.disconnect();
    };
  }, [threshold, rootMargin, triggerOnce]);

  useEffect(() => {
    if (isInView && !isLoaded) {
      if (imgRef.current && imgRef.current.dataset.src) {
        const img = new Image();
        img.onload = () => {
          setIsLoaded(true);
        };
        img.src = imgRef.current.dataset.src;
      }
    }
  }, [isInView, isLoaded]);

  useEffect(() => {
    if (isLoaded && imgRef.current && imgRef.current.dataset.src) {
      imgRef.current.src = imgRef.current.dataset.src;
      imgRef.current.removeAttribute('data-src');
    }
  }, [isLoaded]);

  return [imgRef, isLoaded];
}

/**
 * 懒加载图片组件
 */
export interface LazyImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src: string;
  alt: string;
  placeholder?: string;
  className?: string;
}

export function LazyImage({
  src,
  alt,
  placeholder = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 300"%3E%3Crect fill="%231a1a2e" width="400" height="300"/%3E%3C/svg%3E',
  className,
  ...props
}: LazyImageProps) {
  const [imgRef, isLoaded] = useLazyLoad();
  const [hasError, setHasError] = useState(false);

  const handleError = () => {
    setHasError(true);
  };

  return (
    <img
      ref={imgRef}
      data-src={src}
      src={isLoaded ? src : placeholder}
      alt={alt}
      className={className}
      onError={handleError}
      loading="lazy"
      {...props}
    />
  );
}
