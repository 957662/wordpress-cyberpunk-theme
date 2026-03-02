'use client';

import React, { useState, useRef, useEffect } from 'react';
import { motion, useInView } from 'framer-motion';

interface LazyImageProps {
  src: string;
  alt: string;
  width?: number | string;
  height?: number | string;
  className?: string;
  placeholder?: string;
  blurDataURL?: string;
  loading?: 'lazy' | 'eager';
  fetchPriority?: 'high' | 'low' | 'auto';
  onClick?: () => void;
  style?: React.CSSProperties;
}

export const LazyImage: React.FC<LazyImageProps> = ({
  src,
  alt,
  width = '100%',
  height = 'auto',
  className = '',
  placeholder = '/images/placeholder.png',
  blurDataURL,
  loading = 'lazy',
  fetchPriority = 'auto',
  onClick,
  style,
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isError, setIsError] = useState(false);
  const [currentSrc, setCurrentSrc] = useState(placeholder);
  const ref = useRef<HTMLImageElement>(null);
  const isInView = useInView(ref, {
    amount: 0.1,
    once: true,
  });

  useEffect(() => {
    if (isInView && !isLoaded && !isError) {
      const img = new Image();
      img.src = src;

      img.onload = () => {
        setCurrentSrc(src);
        setIsLoaded(true);
      };

      img.onerror = () => {
        setIsError(true);
      };
    }
  }, [isInView, isLoaded, isError, src]);

  const handleError = () => {
    setIsError(true);
    setCurrentSrc(placeholder);
  };

  return (
    <motion.div
      ref={ref}
      className={`relative overflow-hidden ${className}`}
      style={{ width, height, ...style }}
      initial={{ opacity: 0 }}
      animate={{ opacity: isLoaded ? 1 : 0.5 }}
      transition={{ duration: 0.3 }}
      onClick={onClick}
    >
      {/* Blur placeholder */}
      {!isLoaded && (
        <div
          className="absolute inset-0 bg-gradient-to-br from-cyan-500/20 to-purple-500/20 animate-pulse"
          style={{
            backgroundImage: blurDataURL ? `url(${blurDataURL})` : undefined,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            filter: blurDataURL ? 'blur(20px)' : undefined,
          }}
        />
      )}

      {/* Actual image */}
      <img
        src={currentSrc}
        alt={alt}
        width={width}
        height={height}
        loading={loading}
        fetchPriority={fetchPriority}
        onError={handleError}
        className={`w-full h-full object-cover transition-opacity duration-300 ${
          isLoaded ? 'opacity-100' : 'opacity-0'
        }`}
      />

      {/* Loading indicator */}
      {!isLoaded && !isError && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-12 h-12 border-4 border-cyan-400 border-t-transparent rounded-full animate-spin" />
        </div>
      )}

      {/* Error indicator */}
      {isError && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-900/80">
          <div className="text-center">
            <p className="text-cyan-400 text-sm">图片加载失败</p>
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default LazyImage;
