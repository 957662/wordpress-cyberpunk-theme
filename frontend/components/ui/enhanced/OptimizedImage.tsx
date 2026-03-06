'use client';

import React, { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';

interface OptimizedImageProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  fill?: boolean;
  priority?: boolean;
  quality?: number;
  placeholder?: 'blur' | 'empty';
  blurDataURL?: string;
  className?: string;
  sizes?: string;
  style?: React.CSSProperties;
  onLoad?: () => void;
  onError?: () => void;
  showLoading?: boolean;
  lazy?: boolean;
  zoomOnHover?: boolean;
  objectFit?: 'cover' | 'contain' | 'fill' | 'none' | 'scale-down';
}

const OptimizedImage: React.FC<OptimizedImageProps> = ({
  src,
  alt,
  width,
  height,
  fill = false,
  priority = false,
  quality = 75,
  placeholder = 'blur',
  blurDataURL,
  className = '',
  sizes = '(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw',
  style,
  onLoad,
  onError,
  showLoading = true,
  lazy = true,
  zoomOnHover = false,
  objectFit = 'cover',
}) => {
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  const [isInView, setIsInView] = useState(!lazy || priority);
  const imgRef = useRef<HTMLDivElement>(null);

  // Intersection Observer for lazy loading
  useEffect(() => {
    if (!lazy || priority) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          observer.disconnect();
        }
      },
      { rootMargin: '50px' }
    );

    if (imgRef.current) {
      observer.observe(imgRef.current);
    }

    return () => observer.disconnect();
  }, [lazy, priority]);

  const handleLoad = () => {
    setIsLoading(false);
    onLoad?.();
  };

  const handleError = () => {
    setIsLoading(false);
    setIsError(true);
    onError?.();
  };

  // Generate blur placeholder
  const generateBlurDataURL = (w: number, h: number) => {
    return `data:image/svg+xml;base64,${Buffer.from(
      `<svg width="${w}" height="${h}" xmlns="http://www.w3.org/2000/svg">
        <rect width="100%" height="100%" fill="#1a1a2e"/>
        <text x="50%" y="50%" fill="#00f0ff" text-anchor="middle" dy=".3em" font-size="14">
          Loading...
        </text>
      </svg>`
    ).toString('base64')}`;
  };

  const imageProps = {
    src,
    alt,
    quality,
    priority,
    sizes,
    onLoad: handleLoad,
    onError: handleError,
    style: {
      ...style,
      objectFit,
    },
  };

  const containerProps = fill ? { fill } : { width, height };

  return (
    <motion.div
      ref={imgRef}
      className={`optimized-image-container ${className}`}
      initial={{ opacity: 0 }}
      animate={{ opacity: isLoading ? 0 : 1 }}
      transition={{ duration: 0.3 }}
      style={{
        position: 'relative',
        overflow: 'hidden',
        ...style,
      }}
    >
      {/* Loading Skeleton */}
      {isLoading && showLoading && (
        <div
          className="image-loading-skeleton"
          style={{
            position: 'absolute',
            inset: 0,
            background: 'linear-gradient(90deg, #1a1a2e 25%, #2a2a4e 50%, #1a1a2e 75%)',
            backgroundSize: '200% 100%',
            animation: 'skeleton-loading 1.5s ease-in-out infinite',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <div
            style={{
              width: '40px',
              height: '40px',
              border: '3px solid rgba(0, 240, 255, 0.3)',
              borderTopColor: '#00f0ff',
              borderRadius: '50%',
              animation: 'spin 1s linear infinite',
            }}
          />
        </div>
      )}

      {/* Error State */}
      {isError && (
        <div
          className="image-error-state"
          style={{
            position: 'absolute',
            inset: 0,
            background: 'rgba(0, 0, 0, 0.5)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#ff0080',
          }}
        >
          <div style={{ fontSize: '48px', marginBottom: '8px' }}>⚠️</div>
          <div style={{ fontSize: '14px' }}>Failed to load image</div>
        </div>
      )}

      {/* Actual Image */}
      {isInView && !isError && (
        <motion.div
          whileHover={zoomOnHover ? { scale: 1.1 } : {}}
          transition={{ duration: 0.3 }}
          style={{ width: '100%', height: '100%' }}
        >
          <Image
            {...imageProps}
            {...containerProps}
            className={zoomOnHover ? 'zoom-on-hover' : ''}
            placeholder={placeholder}
            blurDataURL={
              blurDataURL || (width && height ? generateBlurDataURL(width, height) : undefined)
            }
          />
        </motion.div>
      )}

      <style jsx>{`
        .optimized-image-container {
          border-radius: 8px;
          overflow: hidden;
        }

        .zoom-on-hover {
          transition: transform 0.3s ease;
        }

        @keyframes skeleton-loading {
          0% {
            background-position: 200% 0;
          }
          100% {
            background-position: -200% 0;
          }
        }

        @keyframes spin {
          to {
            transform: rotate(360deg);
          }
        }

        /* Gradient overlay for better text readability */
        .optimized-image-container::after {
          content: '';
          position: absolute;
          inset: 0;
          background: linear-gradient(
            to bottom,
            rgba(0, 0, 0, 0) 0%,
            rgba(0, 0, 0, 0.1) 100%
          );
          pointer-events: none;
        }
      `}</style>
    </motion.div>
  );
};

// Gallery Component for Multiple Images
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

export const ImageGallery: React.FC<ImageGalleryProps> = ({
  images,
  columns = 3,
  gap = 16,
  className = '',
}) => {
  return (
    <div
      className={`image-gallery ${className}`}
      style={{
        display: 'grid',
        gridTemplateColumns: `repeat(${columns}, 1fr)`,
        gap: `${gap}px`,
      }}
    >
      {images.map((image, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
          style={{ position: 'relative' }}
        >
          <OptimizedImage
            {...image}
            fill
            style={{ minHeight: '200px' }}
            className="rounded-lg"
          />
        </motion.div>
      ))}
    </div>
  );
};

// Lightbox Component
interface LightboxProps {
  images: string[];
  initialIndex?: number;
  isOpen: boolean;
  onClose: () => void;
}

export const Lightbox: React.FC<LightboxProps> = ({
  images,
  initialIndex = 0,
  isOpen,
  onClose,
}) => {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);

  useEffect(() => {
    setCurrentIndex(initialIndex);
  }, [initialIndex]);

  if (!isOpen) return null;

  const handlePrevious = () => {
    setCurrentIndex((prev) => (prev > 0 ? prev - 1 : images.length - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev < images.length - 1 ? prev + 1 : 0));
  };

  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === 'ArrowLeft') handlePrevious();
    if (e.key === 'ArrowRight') handleNext();
    if (e.key === 'Escape') onClose();
  };

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(0, 0, 0, 0.95)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 9999,
        padding: '20px',
      }}
    >
      <button
        onClick={handlePrevious}
        style={{
          position: 'absolute',
          left: '20px',
          top: '50%',
          transform: 'translateY(-50%)',
          background: 'rgba(0, 240, 255, 0.2)',
          border: '1px solid rgba(0, 240, 255, 0.5)',
          borderRadius: '50%',
          width: '50px',
          height: '50px',
          fontSize: '24px',
          color: '#00f0ff',
          cursor: 'pointer',
          transition: 'all 0.3s ease',
        }}
      >
        ←
      </button>

      <motion.div
        initial={{ scale: 0.8 }}
        animate={{ scale: 1 }}
        transition={{ duration: 0.3 }}
        onClick={(e) => e.stopPropagation()}
        style={{ maxWidth: '90vw', maxHeight: '90vh' }}
      >
        <OptimizedImage
          src={images[currentIndex]}
          alt={`Image ${currentIndex + 1}`}
          width={1200}
          height={800}
          priority
        />
      </motion.div>

      <button
        onClick={handleNext}
        style={{
          position: 'absolute',
          right: '20px',
          top: '50%',
          transform: 'translateY(-50%)',
          background: 'rgba(0, 240, 255, 0.2)',
          border: '1px solid rgba(0, 240, 255, 0.5)',
          borderRadius: '50%',
          width: '50px',
          height: '50px',
          fontSize: '24px',
          color: '#00f0ff',
          cursor: 'pointer',
          transition: 'all 0.3s ease',
        }}
      >
        →
      </button>

      <div
        style={{
          position: 'absolute',
          bottom: '20px',
          left: '50%',
          transform: 'translateX(-50%)',
          color: '#00f0ff',
          fontSize: '14px',
        }}
      >
        {currentIndex + 1} / {images.length}
      </div>
    </motion.div>
  );
};

export default OptimizedImage;
