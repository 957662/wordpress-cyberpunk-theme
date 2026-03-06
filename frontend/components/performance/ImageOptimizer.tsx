'use client';

import { useState, useCallback, useRef, useEffect } from 'react';
import Image, { ImageProps } from 'next/image';
import { motion } from 'framer-motion';
import { Loader2 } from 'lucide-react';

interface ImageOptimizerProps extends Omit<ImageProps, 'onLoad' | 'onError'> {
  /**
   * 占位符背景色
   */
  placeholderColor?: string;
  /**
   * 是否显示加载动画
   */
  showLoader?: boolean;
  /**
   * 模糊占位符
   */
  blurPlaceholder?: boolean;
  /**
   * 渐入动画持续时间（秒）
   */
  fadeInDuration?: number;
  /**
   * 错误时显示的备用图片
   */
  fallbackSrc?: string;
  /**
   * 加载成功回调
   */
  onLoad?: () => void;
  /**
   * 加载失败回调
   */
  onError?: () => void;
}

/**
 * 图片优化组件
 *
 * 功能特性：
 * - Next.js Image 优化
 * - 懒加载
 * - 渐入动画
 * - 占位符支持
 * - 错误处理
 * - 性能监控
 *
 * @example
 * ```tsx
 * <ImageOptimizer
 *   src="/images/post.jpg"
 *   alt="文章图片"
 *   width={800}
 *   height={600}
 *   showLoader={true}
 *   blurPlaceholder={true}
 *   onLoad={() => console.log('加载完成')}
 * />
 * ```
 */
export function ImageOptimizer({
  placeholderColor = '#1a1a2e',
  showLoader = true,
  blurPlaceholder = false,
  fadeInDuration = 0.3,
  fallbackSrc = '/images/placeholder.png',
  onLoad,
  onError,
  className = '',
  ...props
}: ImageOptimizerProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [isInView, setIsInView] = useState(false);
  const imgRef = useRef<HTMLDivElement>(null);

  // 懒加载 - 使用 Intersection Observer
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          observer.disconnect();
        }
      },
      {
        rootMargin: '50px', // 提前50px开始加载
      }
    );

    if (imgRef.current) {
      observer.observe(imgRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const handleLoad = useCallback(() => {
    setIsLoading(false);
    setHasError(false);
    onLoad?.();
  }, [onLoad]);

  const handleError = useCallback(() => {
    setIsLoading(false);
    setHasError(true);
    onError?.();
  }, [onError]);

  return (
    <div
      ref={imgRef}
      className={`relative overflow-hidden ${className}`}
      style={{
        backgroundColor: placeholderColor,
        minHeight: props.height || 200,
      }}
    >
      {isInView ? (
        <>
          {/* 加载动画 */}
          {isLoading && showLoader && (
            <motion.div
              initial={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: fadeInDuration }}
              className="absolute inset-0 flex items-center justify-center z-10"
              style={{ backgroundColor: placeholderColor }}
            >
              <Loader2 className="w-8 h-8 text-cyber-cyan animate-spin" />
            </motion.div>
          )}

          {/* 图片 */}
          {!hasError ? (
            <motion.div
              initial={{ opacity: blurPlaceholder ? 0.5 : 0 }}
              animate={{ opacity: 1 }}
              transition={{
                duration: fadeInDuration,
                ease: 'easeOut',
              }}
              className="relative w-full h-full"
            >
              <Image
                {...props}
                src={props.src}
                alt={props.alt}
                onLoad={handleLoad}
                onError={handleError}
                className={`transition-transform duration-300 hover:scale-105 ${
                  blurPlaceholder && isLoading ? 'blur-md' : ''
                }`}
              />
            </motion.div>
          ) : (
            // 错误占位图
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="absolute inset-0 flex items-center justify-center bg-cyber-darker"
            >
              <div className="text-center">
                <p className="text-gray-500 mb-2">图片加载失败</p>
                {fallbackSrc && (
                  <Image
                    src={fallbackSrc}
                    alt="占位图"
                    width={200}
                    height={150}
                    className="opacity-50"
                  />
                )}
              </div>
            </motion.div>
          )}
        </>
      ) : (
        // 尚未进入视口 - 显示占位符
        <div
          className="absolute inset-0 bg-gradient-to-br from-cyber-muted to-cyber-darker"
          style={{
            minHeight: props.height || 200,
          }}
        />
      )}
    </div>
  );
}

/**
 * 图片懒加载包装器
 * 用于批量图片的懒加载
 */
export function LazyImageGrid({
  images,
  className = '',
}: {
  images: Array<{
    src: string;
    alt: string;
    width: number;
    height: number;
  }>;
  className?: string;
}) {
  return (
    <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 ${className}`}>
      {images.map((image, index) => (
        <motion.div
          key={image.src}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
        >
          <ImageOptimizer
            {...image}
            showLoader={true}
            blurPlaceholder={true}
            className="rounded-lg"
          />
        </motion.div>
      ))}
    </div>
  );
}

/**
 * 响应式图片组件
 * 根据屏幕尺寸自动选择最优图片
 */
export function ResponsiveImage({
  src,
  alt,
  className = '',
}: {
  src: string;
  alt: string;
  className?: string;
}) {
  return (
    <div className={`relative w-full ${className}`}>
      <ImageOptimizer
        src={src}
        alt={alt}
        fill
        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        style={{ objectFit: 'cover' }}
        showLoader={true}
        blurPlaceholder={true}
      />
    </div>
  );
}

/**
 * 头像优化组件
 */
export function AvatarOptimizer({
  src,
  alt,
  size = 40,
  className = '',
}: {
  src: string;
  alt: string;
  size?: number;
  className?: string;
}) {
  return (
    <div
      className={`relative rounded-full overflow-hidden ${className}`}
      style={{ width: size, height: size }}
    >
      <ImageOptimizer
        src={src}
        alt={alt}
        fill
        sizes={`${size}px`}
        style={{ objectFit: 'cover' }}
        showLoader={true}
        placeholderColor="transparent"
      />
    </div>
  );
}

/**
 * 文章封面图组件
 */
export function ArticleCoverImage({
  src,
  alt,
  priority = false,
  className = '',
}: {
  src: string;
  alt: string;
  priority?: boolean;
  className?: string;
}) {
  return (
    <div className={`relative w-full aspect-video ${className}`}>
      <ImageOptimizer
        src={src}
        alt={alt}
        fill
        sizes="(max-width: 768px) 100vw, 1200px"
        style={{ objectFit: 'cover' }}
        priority={priority}
        showLoader={true}
        blurPlaceholder={true}
        fadeInDuration={0.5}
      />
    </div>
  );
}

export default ImageOptimizer;
