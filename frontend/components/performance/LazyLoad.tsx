'use client';

import React, { useRef, useState, useEffect } from 'react';

interface LazyLoadProps {
  children: React.ReactNode;
  threshold?: number;
  rootMargin?: string;
  fallback?: React.ReactNode;
  className?: string;
  onLoad?: () => void;
}

export default function LazyLoad({
  children,
  threshold = 0.1,
  rootMargin = '50px',
  fallback,
  className = '',
  onLoad,
}: LazyLoadProps) {
  const [isInView, setIsInView] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const elementRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !isLoaded) {
            setIsInView(true);
            setIsLoaded(true);
            onLoad?.();
          }
        });
      },
      {
        threshold,
        rootMargin,
      }
    );

    const currentElement = elementRef.current;
    if (currentElement) {
      observer.observe(currentElement);
    }

    return () => {
      if (currentElement) {
        observer.unobserve(currentElement);
      }
    };
  }, [threshold, rootMargin, isLoaded, onLoad]);

  return (
    <div ref={elementRef} className={className}>
      {isInView ? children : fallback}
    </div>
  );
}

// Lazy Load Image
interface LazyLoadImageProps {
  src: string;
  alt: string;
  className?: string;
  placeholder?: React.ReactNode;
  onLoad?: () => void;
}

export function LazyLoadImage({
  src,
  alt,
  className = '',
  placeholder,
  onLoad,
}: LazyLoadImageProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [currentSrc, setCurrentSrc] = useState<string>('');

  useEffect(() => {
    const img = new Image();
    img.src = src;

    img.onload = () => {
      setCurrentSrc(src);
      setIsLoaded(true);
      onLoad?.();
    };
  }, [src, onLoad]);

  return (
    <LazyLoad
      fallback={
        placeholder || (
          <div className="bg-gradient-to-r from-gray-800 to-gray-700 animate-pulse rounded-lg" />
        )
      }
    >
      <img
        src={currentSrc}
        alt={alt}
        className={`transition-opacity duration-300 ${
          isLoaded ? 'opacity-100' : 'opacity-0'
        } ${className}`}
        loading="lazy"
      />
    </LazyLoad>
  );
}
