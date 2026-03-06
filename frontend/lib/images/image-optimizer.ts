/**
 * Image Optimizer - 图片优化工具
 * 支持懒加载、响应式图片、WebP转换、图片压缩
 */

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { cn } from '@/lib/utils';

export interface ImageOptions {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  quality?: number;
  priority?: boolean;
  fill?: boolean;
  placeholder?: 'blur' | 'empty';
  blurDataURL?: string;
  className?: string;
}

/**
 * 生成模糊占位符
 */
export function generateBlurPlaceholder(
  width: number = 400,
  height: number = 300,
  color: string = '#0a0a0f'
): string {
  if (typeof window === 'undefined') return '';

  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;

  const ctx = canvas.getContext('2d');
  if (!ctx) return '';

  // 填充背景色
  ctx.fillStyle = color;
  ctx.fillRect(0, 0, width, height);

  // 添加随机噪声
  for (let i = 0; i < 100; i++) {
    const x = Math.random() * width;
    const y = Math.random() * height;
    const r = Math.random() * 2;
    ctx.fillStyle = `rgba(255, 255, 255, ${Math.random() * 0.1})`;
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.fill();
  }

  return canvas.toDataURL('image/jpeg', 0.1);
}

/**
 * 图片压缩
 */
export async function compressImage(
  file: File,
  quality: number = 0.8,
  maxWidth: number = 1920
): Promise<string> {
  return new Promise((resolve, reject) => {
    const img = new Image();

    img.onload = () => {
      const canvas = document.createElement('canvas');
      let width = img.width;
      let height = img.height;

      // 计算缩放比例
      if (width > maxWidth) {
        height = (maxWidth / width) * height;
        width = maxWidth;
      }

      canvas.width = width;
      canvas.height = height;

      const ctx = canvas.getContext('2d');
      if (!ctx) {
        reject(new Error('Failed to get canvas context'));
        return;
      }

      ctx.drawImage(img, 0, 0, width, height);

      // 转换为WebP
      canvas.toBlob(
        (blob) => {
          if (!blob) {
            reject(new Error('Failed to compress image'));
            return;
          }

          const reader = new FileReader();
          reader.onloadend = () => resolve(reader.result as string);
          reader.onerror = reject;
          reader.readAsDataURL(blob);
        },
        'image/webp',
        quality
      );
    };

    img.onerror = reject;
    img.src = URL.createObjectURL(file);
  });
}

/**
 * 检查WebP支持
 */
export async function checkWebPSupport(): Promise<boolean> {
  if (typeof window === 'undefined') return false;

  return new Promise((resolve) => {
    const webP = new Image();
    webP.onload = webP.onerror = () => {
      resolve(webP.height === 2);
    };
    webP.src = 'data:image/webp;base64,UklGRjoAAABXRUJQVlA4IC4AAACyAgCdASoCAAIALmk0mk0iIiIiIgBoSygABc6WWgAA/veff/0PP8bA//LwYAAA';
  });
}

/**
 * 生成响应式图片srcset
 */
export function generateSrcSet(
  baseUrl: string,
  sizes: number[],
  format: 'webp' | 'jpeg' | 'png' = 'webp'
): string {
  return sizes
    .map((size) => {
      const url = new URL(baseUrl, typeof window !== 'undefined' ? window.location.origin : '');
      url.searchParams.set('w', size.toString());
      url.searchParams.set('f', format);
      return `${url.toString()} ${size}w`;
    })
    .join(', ');
}

/**
 * 懒加载图片Hook
 */
export function useLazyImage(src: string, options?: { threshold?: number; rootMargin?: string }) {
  const [imageSrc, setImageSrc] = useState('');
  const [isLoaded, setIsLoaded] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setImageSrc(src);
            setIsLoaded(true);
            observer.disconnect();
          }
        });
      },
      {
        threshold: options?.threshold || 0.1,
        rootMargin: options?.rootMargin || '50px',
      }
    );

    if (imgRef.current) {
      observer.observe(imgRef.current);
    }

    return () => observer.disconnect();
  }, [src, options]);

  return { imgRef, imageSrc, isLoaded };
}

/**
 * 优化的图片组件
 */
export function OptimizedImage({
  src,
  alt,
  width,
  height,
  quality = 75,
  priority = false,
  fill = false,
  placeholder = 'blur',
  blurDataURL,
  className,
}: ImageOptions) {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  // 生成默认模糊占位符
  const defaultBlurData = blurDataURL || generateBlurPlaceholder(
    width || 400,
    height || 300
  );

  if (hasError) {
    return (
      <div
        className={cn('bg-cyber-muted flex items-center justify-center', className)}
        style={{ width, height }}
      >
        <span className="text-muted-foreground text-sm">图片加载失败</span>
      </div>
    );
  }

  return (
    <div className={cn('relative overflow-hidden', className)}>
      <Image
        src={src}
        alt={alt}
        width={fill ? undefined : width}
        height={fill ? undefined : height}
        fill={fill}
        priority={priority}
        quality={quality}
        placeholder={placeholder === 'blur' ? 'blur' : 'empty'}
        blurDataURL={placeholder === 'blur' ? defaultBlurData : undefined}
        className={cn(
          'transition-all duration-300',
          isLoading && 'scale-105 blur-sm',
          !isLoading && 'scale-100 blur-0'
        )}
        onLoad={() => setIsLoading(false)}
        onError={() => {
          setIsLoading(false);
          setHasError(true);
        }}
      />

      {isLoading && placeholder === 'blur' && (
        <div className="absolute inset-0 bg-cyber-muted/50 animate-pulse" />
      )}
    </div>
  );
}

/**
 * 响应式图片组件
 */
interface ResponsiveImageProps {
  src: string;
  alt: string;
  sizes?: string;
  className?: string;
  priority?: boolean;
}

export function ResponsiveImage({
  src,
  alt,
  sizes = '(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw',
  className,
  priority = false,
}: ResponsiveImageProps) {
  return (
    <OptimizedImage
      src={src}
      alt={alt}
      fill
      sizes={sizes}
      className={className}
      priority={priority}
    />
  );
}

/**
 * 图片画廊组件
 */
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
  gap = 16,
  className,
}: ImageGalleryProps) {
  return (
    <div
      className={cn('grid gap-4', className)}
      style={{
        gridTemplateColumns: `repeat(${columns}, 1fr)`,
        gap: `${gap}px`,
      }}
    >
      {images.map((image, index) => (
        <OptimizedImage
          key={index}
          src={image.src}
          alt={image.alt}
          width={image.width}
          height={image.height}
          className="w-full h-auto"
        />
      ))}
    </div>
  );
}

export default {
  generateBlurPlaceholder,
  compressImage,
  checkWebPSupport,
  generateSrcSet,
  useLazyImage,
  OptimizedImage,
  ResponsiveImage,
  ImageGallery,
};
