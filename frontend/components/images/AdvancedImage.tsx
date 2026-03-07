/**
 * Advanced Image Component
 * 高级图片组件 - 提供懒加载、占位符、模糊效果、响应式等功能
 *
 * @author AI Development Team
 * @version 2.0.0
 */

'use client';

import React, { useState, useRef, useCallback, useEffect } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { Loader2, AlertCircle, ZoomIn, Download } from 'lucide-react';

// 类型定义
export interface AdvancedImageProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  fill?: boolean;
  priority?: boolean;
  quality?: number;
  placeholder?: 'blur' | 'empty' | 'custom';
  blurDataURL?: string;
  sizes?: string;
  className?: string;
  containerClassName?: string;
  objectFit?: 'contain' | 'cover' | 'fill' | 'none' | 'scale-down';
  lazy?: boolean;
  threshold?: number;
  fadeIn?: boolean;
  enableZoom?: boolean;
  enableDownload?: boolean;
  onLoad?: () => void;
  onError?: () => void;
}

export function AdvancedImage({
  src,
  alt,
  width,
  height,
  fill = false,
  priority = false,
  quality = 75,
  placeholder = 'blur',
  blurDataURL,
  sizes,
  className = '',
  containerClassName = '',
  objectFit = 'cover',
  lazy = true,
  threshold = 0.1,
  fadeIn = true,
  enableZoom = false,
  enableDownload = false,
  onLoad,
  onError,
}: AdvancedImageProps) {
  const [isLoading, setIsLoading] = useState(!priority);
  const [isError, setIsError] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [showZoom, setShowZoom] = useState(false);
  const [imageNaturalSize, setImageNaturalSize] = useState({ width: 0, height: 0 });
  const imgRef = useRef<HTMLImageElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  /**
   * 处理图片加载完成
   */
  const handleLoad = useCallback(() => {
    setIsLoading(false);
    setIsLoaded(true);
    onLoad?.();

    // 获取图片原始尺寸
    if (imgRef.current) {
      setImageNaturalSize({
        width: imgRef.current.naturalWidth,
        height: imgRef.current.naturalHeight,
      });
    }
  }, [onLoad]);

  /**
   * 处理图片加载错误
   */
  const handleError = useCallback(() => {
    setIsLoading(false);
    setIsError(true);
    onError?.();
  }, [onError]);

  /**
   * 下载图片
   */
  const handleDownload = useCallback(async () => {
    try {
      const response = await fetch(src);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = alt || 'image';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Failed to download image:', error);
    }
  }, [src, alt]);

  /**
   * 打开缩放视图
   */
  const openZoom = useCallback(() => {
    if (enableZoom) {
      setShowZoom(true);
    }
  }, [enableZoom]);

  /**
   * 关闭缩放视图
   */
  const closeZoom = useCallback(() => {
    setShowZoom(false);
  }, []);

  /**
   * 生成模糊占位符
   */
  const generateBlurDataURL = useCallback(() => {
    if (blurDataURL) return blurDataURL;

    // 生成简单的模糊占位符
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (!ctx) return undefined;

    canvas.width = 10;
    canvas.height = 10;
    ctx.fillStyle = '#1a1a2e';
    ctx.fillRect(0, 0, 10, 10);

    return canvas.toDataURL();
  }, [blurDataURL]);

  return (
    <>
      <div
        ref={containerRef}
        className={`relative overflow-hidden ${containerClassName} ${
          enableZoom ? 'cursor-pointer' : ''
        }`}
        onClick={enableZoom ? openZoom : undefined}
      >
        {/* 加载状态 */}
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-cyber-dark/50">
            <div className="flex flex-col items-center gap-2 text-cyber-cyan">
              <Loader2 className="h-8 w-8 animate-spin" />
              <span className="text-sm">加载中...</span>
            </div>
          </div>
        )}

        {/* 错误状态 */}
        {isError && (
          <div className="absolute inset-0 flex items-center justify-center bg-cyber-dark/50">
            <div className="flex flex-col items-center gap-2 text-cyber-pink">
              <AlertCircle className="h-8 w-8" />
              <span className="text-sm">图片加载失败</span>
            </div>
          </div>
        )}

        {/* 图片 */}
        <AnimatePresence mode="wait">
          <motion.div
            key="image"
            initial={fadeIn ? { opacity: 0 } : false}
            animate={{ opacity: isLoaded ? 1 : 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className={`relative ${fill ? 'h-full w-full' : ''}`}
          >
            <Image
              ref={imgRef}
              src={src}
              alt={alt}
              width={fill ? undefined : width}
              height={fill ? undefined : height}
              fill={fill}
              priority={priority}
              quality={quality}
              placeholder={placeholder}
              blurDataURL={placeholder === 'blur' ? generateBlurDataURL() : undefined}
              sizes={sizes}
              className={`${className} transition-transform duration-300 ${
                enableZoom ? 'hover:scale-105' : ''
              }`}
              style={{ objectFit }}
              onLoad={handleLoad}
              onError={handleError}
              loading={lazy && !priority ? 'lazy' : 'undefined'}
            />
          </motion.div>
        </AnimatePresence>

        {/* 工具栏 */}
        {isLoaded && (enableZoom || enableDownload) && (
          <div className="absolute right-2 top-2 flex gap-2 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
            {enableDownload && (
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={handleDownload}
                className="rounded-full bg-cyber-dark/50 p-2 text-white backdrop-blur-sm hover:bg-cyber-cyan/20"
              >
                <Download className="h-4 w-4" />
              </motion.button>
            )}
            {enableZoom && (
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="rounded-full bg-cyber-dark/50 p-2 text-white backdrop-blur-sm hover:bg-cyber-cyan/20"
              >
                <ZoomIn className="h-4 w-4" />
              </motion.button>
            )}
          </div>
        )}
      </div>

      {/* 缩放视图 */}
      <AnimatePresence>
        {showZoom && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm"
            onClick={closeZoom}
          >
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              transition={{ duration: 0.2 }}
              className="relative max-h-[90vh] max-w-[90vw]"
              onClick={(e) => e.stopPropagation()}
            >
              <Image
                src={src}
                alt={alt}
                width={imageNaturalSize.width}
                height={imageNaturalSize.height}
                quality={100}
                className="max-h-[90vh] max-w-[90vw] object-contain"
                onClick={closeZoom}
              />
              <button
                onClick={closeZoom}
                className="absolute -top-4 -right-4 rounded-full bg-cyber-pink p-2 text-white hover:bg-cyber-pink/80"
              >
                <X className="h-6 w-6" />
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

/**
 * 图片画廊组件
 */
export interface ImageGalleryProps {
  images: Array<{
    src: string;
    alt: string;
    width?: number;
    height?: number;
  }>;
  columns?: number;
  gap?: number;
  enableZoom?: boolean;
  enableDownload?: boolean;
}

export function ImageGallery({
  images,
  columns = 3,
  gap = 4,
  enableZoom = true,
  enableDownload = false,
}: ImageGalleryProps) {
  return (
    <div
      className={`grid gap-${gap}`}
      style={{
        gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))`,
      }}
    >
      {images.map((image, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.05 }}
        >
          <AdvancedImage
            {...image}
            enableZoom={enableZoom}
            enableDownload={enableDownload}
            className="h-64 w-full"
            containerClassName="rounded-lg overflow-hidden border border-cyber-cyan/20"
          />
        </motion.div>
      ))}
    </div>
  );
}

export default AdvancedImage;
