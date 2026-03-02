'use client';

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Image as ImageIcon, Loader2, AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface LazyImageProps {
  src: string;
  alt: string;
  width?: number | string;
  height?: number | string;
  className?: string;
  containerClassName?: string;
  placeholder?: string;
  fallback?: string;
  threshold?: number;
  fadeInDuration?: number;
  showLoader?: boolean;
  onLoad?: () => void;
  onError?: () => void;
  style?: React.CSSProperties;
}

export const LazyImage: React.FC<LazyImageProps> = ({
  src,
  alt,
  width,
  height,
  className,
  containerClassName,
  placeholder,
  fallback = '/images/placeholder.png',
  threshold = 0.1,
  fadeInDuration = 0.3,
  showLoader = true,
  onLoad,
  onError,
  style,
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isError, setIsError] = useState(false);
  const [isInView, setIsInView] = useState(false);
  const [currentSrc, setCurrentSrc] = useState(placeholder || src);

  const imgRef = useRef<HTMLImageElement>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);

  // 设置 Intersection Observer
  useEffect(() => {
    const imgElement = imgRef.current;

    if (!imgElement) return;

    observerRef.current = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          observerRef.current?.disconnect();
        }
      },
      { threshold }
    );

    observerRef.current.observe(imgElement);

    return () => {
      observerRef.current?.disconnect();
    };
  }, [threshold]);

  // 加载图片
  useEffect(() => {
    if (!isInView) return;

    const img = new Image();

    img.onload = () => {
      setIsLoaded(true);
      setIsError(false);
      setCurrentSrc(src);
      onLoad?.();
    };

    img.onerror = () => {
      setIsError(true);
      setIsLoaded(false);
      setCurrentSrc(fallback);
      onError?.();
    };

    img.src = src;
  }, [isInView, src, fallback, onLoad, onError]);

  return (
    <div
      className={cn('relative overflow-hidden', containerClassName)}
      style={{ width, height }}
    >
      {/* 占位符 */}
      {placeholder && !isLoaded && (
        <div
          className={cn(
            'absolute inset-0 bg-gray-800 flex items-center justify-center',
            className
          )}
          style={{ width, height }}
        >
          <img
            ref={imgRef}
            src={placeholder}
            alt=""
            className="w-full h-full object-cover opacity-20 blur-sm"
          />
        </div>
      )}

      {/* 加载指示器 */}
      {showLoader && isInView && !isLoaded && !isError && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-800/50">
          <Loader2 className="w-8 h-8 text-cyan-400 animate-spin" />
        </div>
      )}

      {/* 错误状态 */}
      <AnimatePresence>
        {isError && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 flex flex-col items-center justify-center bg-gray-800/50 text-gray-400"
          >
            <AlertCircle className="w-8 h-8 mb-2 text-red-400" />
            <span className="text-sm">图片加载失败</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 实际图片 */}
      <AnimatePresence>
        {(isInView || placeholder) && (
          <motion.img
            initial={{ opacity: 0 }}
            animate={{ opacity: isLoaded ? 1 : 0 }}
            transition={{ duration: fadeInDuration }}
            ref={imgRef}
            src={currentSrc}
            alt={alt}
            className={cn('w-full h-full object-cover', className)}
            style={style}
          />
        )}
      </AnimatePresence>

      {/* 图片图标指示器 */}
      {!isInView && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-800/30">
          <ImageIcon className="w-12 h-12 text-gray-600" />
        </div>
      )}
    </div>
  );
};

// 带有背景模糊效果的图片组件
export interface BlurImageProps extends Omit<LazyImageProps, 'placeholder'> {
  blurAmount?: number;
}

export const BlurImage: React.FC<BlurImageProps> = ({
  src,
  alt,
  blurAmount = 20,
  className,
  ...props
}) => {
  const [isLoaded, setIsLoaded] = useState(false);

  return (
    <div className={cn('relative overflow-hidden', className)}>
      {/* 模糊预览 */}
      <img
        src={src}
        alt=""
        className={cn(
          'absolute inset-0 w-full h-full object-cover transition-all duration-500',
          isLoaded ? 'opacity-0' : 'opacity-100'
        )}
        style={{ filter: `blur(${blurAmount}px)` }}
      />

      {/* 实际图片 */}
      <motion.img
        initial={{ opacity: 0 }}
        animate={{ opacity: isLoaded ? 1 : 0 }}
        transition={{ duration: 0.5 }}
        src={src}
        alt={alt}
        className="relative w-full h-full object-cover"
        onLoad={() => setIsLoaded(true)}
        {...props}
      />
    </div>
  );
};

// 渐进式图片加载组件
export interface ProgressiveImageProps {
  src: string;
  preview?: string; // 低质量预览图
  alt: string;
  className?: string;
}

export const ProgressiveImage: React.FC<ProgressiveImageProps> = ({
  src,
  preview,
  alt,
  className,
}) => {
  const [imgSrc, setImgSrc] = useState(preview || src);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const img = new Image();
    img.src = src;

    img.onload = () => {
      setImgSrc(src);
      setIsLoaded(true);
    };
  }, [src]);

  return (
    <motion.div
      className={cn('relative overflow-hidden', className)}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <img
        src={imgSrc}
        alt={alt}
        className={cn(
          'w-full h-full object-cover transition-all duration-500',
          !isLoaded && 'filter blur-xl scale-110'
        )}
      />
    </motion.div>
  );
};

export default LazyImage;
