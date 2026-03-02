'use client';

import React, { useState, useRef, useEffect, ReactNode } from 'react';
import { motion } from 'framer-motion';

/**
 * LazyLoad 组件属性
 */
interface LazyLoadProps {
  children: ReactNode;
  /** 触发加载的偏移量（像素） */
  offset?: number;
  /** 加载中的占位内容 */
  placeholder?: ReactNode;
  /** 加载失败时的内容 */
  fallback?: ReactNode;
  /** 自定义根元素 */
  root?: Element | null;
  /** 根边距 */
  rootMargin?: string;
  /** 触发阈值 */
  threshold?: number;
  /** 加载时的动画 */
  animation?: boolean;
  /** 延迟加载（毫秒） */
  delay?: number;
  /** 只加载一次 */
  once?: boolean;
  /** 回调函数 */
  onLoad?: () => void;
  /** 类名 */
  className?: string;
}

/**
 * LazyLoad 组件
 * 用于懒加载图片、组件等资源
 */
export const LazyLoad: React.FC<LazyLoadProps> = ({
  children,
  offset = 100,
  placeholder = <div className="animate-pulse bg-gray-800 rounded" />,
  fallback = null,
  root = null,
  rootMargin = `${offset}px`,
  threshold = 0.01,
  animation = true,
  delay = 0,
  once = true,
  onLoad,
  className = '',
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);
  const elementRef = useRef<HTMLDivElement>(null);
  const hasLoaded = useRef(false);

  useEffect(() => {
    const element = elementRef.current;
    if (!element || hasLoaded.current && once) return;

    // 创建 Intersection Observer
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasLoaded.current) {
          hasLoaded.current = true;

          // 延迟加载
          setTimeout(() => {
            setIsVisible(true);

            if (delay === 0) {
              setIsLoaded(true);
              onLoad?.();
            }
          }, delay);

          if (once) {
            observer.disconnect();
          }
        } else if (!once && !entry.isIntersecting) {
          // 如果不是只加载一次，离开视口时重置
          setIsVisible(false);
          setIsLoaded(false);
        }
      },
      {
        root,
        rootMargin,
        threshold,
      }
    );

    observer.observe(element);

    return () => {
      observer.disconnect();
    };
  }, [root, rootMargin, threshold, once, delay, onLoad]);

  // 处理延迟加载后的状态
  useEffect(() => {
    if (isVisible && delay > 0) {
      const timer = setTimeout(() => {
        setIsLoaded(true);
        onLoad?.();
      }, delay);

      return () => clearTimeout(timer);
    }
  }, [isVisible, delay, onLoad]);

  // 错误处理
  const handleError = () => {
    setHasError(true);
  };

  if (hasError && fallback) {
    return <>{fallback}</>;
  }

  return (
    <div ref={elementRef} className={className} onError={handleError}>
      {isVisible ? (
        animation ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            {children}
          </motion.div>
        ) : (
          <>{children}</>
        )
      ) : (
        <>{placeholder}</>
      )}
    </div>
  );
};

/**
 * LazyImage 组件
 * 专门用于图片懒加载
 */
interface LazyImageProps extends Omit<React.ImgHTMLAttributes<HTMLImageElement>, 'onLoad'> {
  src: string;
  alt: string;
  offset?: number;
  placeholder?: ReactNode;
  fallback?: ReactNode;
  blurHash?: string;
  onLoad?: () => void;
  onError?: () => void;
  className?: string;
}

export const LazyImage: React.FC<LazyImageProps> = ({
  src,
  alt,
  offset = 100,
  placeholder = <div className="animate-pulse bg-gray-800 rounded" />,
  fallback = null,
  blurHash,
  onLoad,
  onError,
  className = '',
  ...imgProps
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);

  const handleLoad = () => {
    setIsLoaded(true);
    onLoad?.();
  };

  const handleError = () => {
    setHasError(true);
    onError?.();
  };

  if (hasError && fallback) {
    return <>{fallback}</>;
  }

  return (
    <LazyLoad offset={offset} placeholder={placeholder} className={className}>
      <img
        src={src}
        alt={alt}
        onLoad={handleLoad}
        onError={handleError}
        className={`transition-opacity duration-300 ${
          isLoaded ? 'opacity-100' : 'opacity-0'
        } ${className}`}
        {...imgProps}
      />
    </LazyLoad>
  );
};

/**
 * LazyComponent 组件
 * 用于懒加载 React 组件
 */
interface LazyComponentProps {
  /** 异步导入的组件 */
  component: React.LazyExoticComponent<React.ComponentType<any>>;
  /** 组件属性 */
  componentProps?: Record<string, any>;
  offset?: number;
  placeholder?: ReactNode;
  fallback?: ReactNode;
  className?: string;
}

export const LazyComponent: React.FC<LazyComponentProps> = ({
  component: Component,
  componentProps = {},
  offset = 100,
  placeholder,
  fallback,
  className = '',
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);

  const handleLoad = () => {
    setIsLoaded(true);
  };

  const handleError = () => {
    setHasError(true);
  };

  if (hasError && fallback) {
    return <>{fallback}</>;
  }

  return (
    <LazyLoad
      offset={offset}
      placeholder={placeholder}
      onLoad={handleLoad}
      className={className}
    >
      <React.Suspense fallback={placeholder || <div>Loading...</div>}>
        <Component {...componentProps} />
      </React.Suspense>
    </LazyLoad>
  );
};

export default LazyLoad;
