'use client';

import React, { useState, useRef, useEffect } from 'react';
import Image from 'next/image';

interface LazyImageProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  className?: string;
  placeholder?: string;
  fallback?: string;
  loading?: 'lazy' | 'eager';
  quality?: number;
  blurDataURL?: string;
  onLoad?: () => void;
  onError?: () => void;
  style?: React.CSSProperties;
  fill?: boolean;
  sizes?: string;
  priority?: boolean;
}

/**
 * 高级懒加载图片组件
 * 支持占位符、错误回退、模糊预览等功能
 */
export function LazyImage({
  src,
  alt,
  width,
  height,
  className = '',
  placeholder = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="400" height="300"%3E%3Crect fill="%231a1a2e" width="400" height="300"/%3E%3C/svg%3E',
  fallback = '/images/fallback.png',
  loading = 'lazy',
  quality = 75,
  blurDataURL,
  onLoad,
  onError,
  style,
  fill = false,
  sizes,
  priority = false,
}: LazyImageProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [imageSrc, setImageSrc] = useState(src);
  const imgRef = useRef<HTMLImageElement>(null);
  const [isInView, setIsInView] = useState(priority);

  useEffect(() => {
    if (priority || loading === 'eager') {
      setIsInView(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          observer.disconnect();
        }
      },
      {
        rootMargin: '50px',
      }
    );

    const currentRef = imgRef.current;
    if (currentRef) {
      observer.observe(currentRef);
    }

    return () => {
      observer.disconnect();
    };
  }, [priority, loading]);

  const handleLoad = () => {
    setIsLoading(false);
    onLoad?.();
  };

  const handleError = () => {
    setIsLoading(false);
    setHasError(true);
    setImageSrc(fallback);
    onError?.();
  };

  if (hasError) {
    return (
      <div
        className={`lazy-image-error ${className}`}
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#1a1a2e',
          color: '#ff0080',
          ...style,
        }}
      >
        <span>图片加载失败</span>
      </div>
    );
  }

  if (!isInView) {
    return (
      <div
        ref={imgRef}
        className={`lazy-image-placeholder ${className}`}
        style={{
          backgroundColor: '#1a1a2e',
          backgroundImage: `url(${placeholder})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          ...style,
        }}
        aria-label={alt}
      />
    );
  }

  return (
    <div className={`lazy-image-wrapper ${className}`} style={style}>
      {isLoading && !blurDataURL && (
        <div
          className="lazy-image-loading"
          style={{
            position: 'absolute',
            inset: 0,
            backgroundColor: '#1a1a2e',
            backgroundImage: `url(${placeholder})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            animation: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
          }}
        />
      )}
      <Image
        src={imageSrc}
        alt={alt}
        width={fill ? undefined : width}
        height={fill ? undefined : height}
        fill={fill}
        sizes={sizes}
        quality={quality}
        placeholder={blurDataURL ? 'blur' : undefined}
        blurDataURL={blurDataURL}
        onLoad={handleLoad}
        onError={handleError}
        className={`lazy-image ${isLoading ? 'loading' : 'loaded'} ${
          hasError ? 'error' : ''
        }`}
        style={{
          opacity: isLoading ? 0 : 1,
          transition: 'opacity 0.3s ease-in-out',
        }}
      />
      <style jsx>{`
        @keyframes pulse {
          0%, 100% {
            opacity: 1;
          }
          50% {
            opacity: 0.5;
          }
        }
        .lazy-image-wrapper {
          position: relative;
          overflow: hidden;
        }
        .lazy-image-loading {
          position: absolute;
          inset: 0;
          z-index: 1;
        }
      `}</style>
    </div>
  );
}

/**
 * 响应式图片组件
 * 根据屏幕尺寸自动选择合适的图片
 */
export function ResponsiveImage({
  src,
  alt,
  sizes = '(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw',
  className,
  ...props
}: LazyImageProps) {
  return (
    <LazyImage
      src={src}
      alt={alt}
      sizes={sizes}
      className={className}
      {...props}
    />
  );
}

/**
 * 渐进式图片加载组件
 * 先显示低质量图片，然后加载高质量图片
 */
export function ProgressiveImage({
  src,
  alt,
  lowQualitySrc,
  className,
  ...props
}: LazyImageProps & { lowQualitySrc: string }) {
  const [currentSrc, setCurrentSrc] = useState(lowQualitySrc);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const img = new Image();
    img.src = src;
    img.onload = () => {
      setCurrentSrc(src);
      setIsLoading(false);
    };
  }, [src]);

  return (
    <LazyImage
      src={currentSrc}
      alt={alt}
      className={`progressive-image ${isLoading ? 'loading' : ''} ${className || ''}`}
      blurDataURL={lowQualitySrc}
      {...props}
    />
  );
}

/**
 * 图片画廊组件
 * 支持懒加载的图片网格
 */
export function ImageGallery({
  images,
  columns = 3,
  gap = 16,
  className = '',
}: {
  images: Array<{ src: string; alt: string; thumb?: string }>;
  columns?: number;
  gap?: number;
  className?: string;
}) {
  const [selectedImage, setSelectedImage] = useState(0);

  return (
    <div className={`image-gallery ${className}`}>
      <div
        className="image-gallery-grid"
        style={{
          display: 'grid',
          gridTemplateColumns: `repeat(${columns}, 1fr)`,
          gap: `${gap}px`,
        }}
      >
        {images.map((image, index) => (
          <div
            key={index}
            className="gallery-item"
            onClick={() => setSelectedImage(index)}
            style={{
              cursor: 'pointer',
              position: 'relative',
              aspectRatio: '16/9',
              overflow: 'hidden',
              borderRadius: '8px',
            }}
          >
            <LazyImage
              src={image.src}
              alt={image.alt}
              fill
              sizes={`(max-width: 768px) 100vw, ${(1 / columns) * 100}vw`}
              className="gallery-image"
              style={{
                objectFit: 'cover',
                transition: 'transform 0.3s ease',
              }}
            />
            <style jsx>{`
              .gallery-item:hover .gallery-image {
                transform: scale(1.05);
              }
            `}</style>
          </div>
        ))}
      </div>

      {selectedImage !== null && (
        <div
          className="gallery-lightbox"
          onClick={() => setSelectedImage(-1)}
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.9)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
            padding: '20px',
          }}
        >
          <button
            onClick={(e) => {
              e.stopPropagation();
              setSelectedImage((selectedImage - 1 + images.length) % images.length);
            }}
            style={{
              position: 'absolute',
              left: '20px',
              top: '50%',
              transform: 'translateY(-50%)',
              padding: '10px 20px',
              backgroundColor: '#00f0ff',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
            }}
          >
            ←
          </button>
          <div
            style={{
              maxWidth: '90vw',
              maxHeight: '90vh',
              position: 'relative',
            }}
          >
            <LazyImage
              src={images[selectedImage]?.src}
              alt={images[selectedImage]?.alt}
              width={1200}
              height={800}
              className="lightbox-image"
            />
          </div>
          <button
            onClick={(e) => {
              e.stopPropagation();
              setSelectedImage((selectedImage + 1) % images.length);
            }}
            style={{
              position: 'absolute',
              right: '20px',
              top: '50%',
              transform: 'translateY(-50%)',
              padding: '10px 20px',
              backgroundColor: '#00f0ff',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
            }}
          >
            →
          </button>
        </div>
      )}
    </div>
  );
}

export default LazyImage;
