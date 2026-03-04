/**
 * 图片画廊组件
 * 支持图片预览、缩放、下载等功能
 */

'use client';

import React, { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Download, ZoomIn, ZoomOut, RotateCw, ChevronLeft, ChevronRight } from 'lucide-react';

export interface Image {
  src: string;
  alt: string;
  title?: string;
  description?: string;
}

export interface ImageGalleryProps {
  images: Image[];
  initialIndex?: number;
  showThumbnails?: boolean;
  showDownload?: boolean;
  onClose?: () => void;
  className?: string;
}

/**
 * 图片画廊组件
 */
export function ImageGallery({
  images,
  initialIndex = 0,
  showThumbnails = true,
  showDownload = true,
  onClose,
  className = '',
}: ImageGalleryProps) {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const [scale, setScale] = useState(1);
  const [rotation, setRotation] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });

  const currentImage = images[currentIndex];

  // 上一张
  const previous = useCallback(() => {
    setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
    resetTransform();
  }, [images.length]);

  // 下一张
  const next = useCallback(() => {
    setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
    resetTransform();
  }, [images.length]);

  // 重置变换
  const resetTransform = useCallback(() => {
    setScale(1);
    setRotation(0);
    setPosition({ x: 0, y: 0 });
  }, []);

  // 放大
  const zoomIn = useCallback(() => {
    setScale((prev) => Math.min(prev + 0.2, 3));
  }, []);

  // 缩小
  const zoomOut = useCallback(() => {
    setScale((prev) => Math.max(prev - 0.2, 0.5));
  }, []);

  // 旋转
  const rotate = useCallback(() => {
    setRotation((prev) => (prev + 90) % 360);
  }, []);

  // 下载
  const download = useCallback(() => {
    const link = document.createElement('a');
    link.href = currentImage.src;
    link.download = currentImage.alt || 'image';
    link.click();
  }, [currentImage]);

  // 键盘导航
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') previous();
      if (e.key === 'ArrowRight') next();
      if (e.key === 'Escape') onClose?.();
      if (e.key === '+') zoomIn();
      if (e.key === '-') zoomOut();
      if (e.key === 'r') rotate();
      if (e.key === '0') resetTransform();
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [previous, next, onClose, zoomIn, zoomOut, rotate, resetTransform]);

  return (
    <div className={`fixed inset-0 z-50 bg-black/95 flex flex-col ${className}`}>
      {/* 顶部工具栏 */}
      <div className="flex items-center justify-between p-4 border-b border-cyber-border">
        <div className="flex items-center space-x-2">
          <span className="text-cyber-cyan">
            {currentIndex + 1} / {images.length}
          </span>
          {currentImage.title && (
            <span className="text-white ml-4">{currentImage.title}</span>
          )}
        </div>

        <div className="flex items-center space-x-2">
          {/* 缩放控制 */}
          <motion.button
            onClick={zoomOut}
            className="p-2 text-cyber-cyan hover:text-white transition-colors"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            title="缩小 (-)"
          >
            <ZoomOut className="w-5 h-5" />
          </motion.button>

          <span className="text-cyber-muted text-sm min-w-[60px] text-center">
            {Math.round(scale * 100)}%
          </span>

          <motion.button
            onClick={zoomIn}
            className="p-2 text-cyber-cyan hover:text-white transition-colors"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            title="放大 (+)"
          >
            <ZoomIn className="w-5 h-5" />
          </motion.button>

          {/* 旋转 */}
          <motion.button
            onClick={rotate}
            className="p-2 text-cyber-cyan hover:text-white transition-colors ml-2"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            title="旋转 (R)"
          >
            <RotateCw className="w-5 h-5" />
          </motion.button>

          {/* 下载 */}
          {showDownload && (
            <motion.button
              onClick={download}
              className="p-2 text-cyber-cyan hover:text-white transition-colors ml-2"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              title="下载"
            >
              <Download className="w-5 h-5" />
            </motion.button>
          )}

          {/* 关闭 */}
          <motion.button
            onClick={onClose}
            className="p-2 text-cyber-pink hover:text-white transition-colors ml-2"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            title="关闭 (ESC)"
          >
            <X className="w-5 h-5" />
          </motion.button>
        </div>
      </div>

      {/* 主图片区域 */}
      <div className="flex-1 flex items-center justify-center overflow-hidden relative">
        {/* 上一张按钮 */}
        {images.length > 1 && (
          <motion.button
            onClick={previous}
            className="absolute left-4 z-10 p-3 bg-cyber-card/80 backdrop-blur-sm rounded-full text-cyber-cyan hover:text-white hover:bg-cyber-cyan/20 transition-colors"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            title="上一张 (←)"
          >
            <ChevronLeft className="w-6 h-6" />
          </motion.button>
        )}

        {/* 图片 */}
        <motion.div
          className="relative max-w-full max-h-full"
          animate={{
            scale,
            rotate: rotation,
            x: position.x,
            y: position.y,
          }}
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          style={{
            cursor: scale > 1 ? 'grab' : 'default',
          }}
          onMouseDown={() => scale > 1 && setIsDragging(true)}
          onMouseUp={() => setIsDragging(false)}
          onMouseLeave={() => setIsDragging(false)}
          onMouseMove={(e) => {
            if (isDragging && scale > 1) {
              setPosition((prev) => ({
                x: prev.x + e.movementX,
                y: prev.y + e.movementY,
              }));
            }
          }}
        >
          <img
            src={currentImage.src}
            alt={currentImage.alt}
            className="max-w-full max-h-full object-contain"
            draggable={false}
          />
        </motion.div>

        {/* 下一张按钮 */}
        {images.length > 1 && (
          <motion.button
            onClick={next}
            className="absolute right-4 z-10 p-3 bg-cyber-card/80 backdrop-blur-sm rounded-full text-cyber-cyan hover:text-white hover:bg-cyber-cyan/20 transition-colors"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            title="下一张 (→)"
          >
            <ChevronRight className="w-6 h-6" />
          </motion.button>
        )}
      </div>

      {/* 底部信息栏 */}
      {currentImage.description && (
        <div className="p-4 border-t border-cyber-border">
          <p className="text-cyber-muted text-sm text-center">{currentImage.description}</p>
        </div>
      )}

      {/* 缩略图 */}
      {showThumbnails && images.length > 1 && (
        <div className="p-4 border-t border-cyber-border">
          <div className="flex items-center justify-center space-x-2 overflow-x-auto">
            {images.map((image, index) => (
              <motion.button
                key={index}
                onClick={() => {
                  setCurrentIndex(index);
                  resetTransform();
                }}
                className={`relative flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 transition-all ${
                  index === currentIndex
                    ? 'border-cyber-cyan shadow-[0_0_10px_rgba(0,240,255,0.5)]'
                    : 'border-cyber-border hover:border-cyber-cyan/50'
                }`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <img
                  src={image.src}
                  alt={image.alt}
                  className="w-full h-full object-cover"
                />
                {index === currentIndex && (
                  <div className="absolute inset-0 bg-cyber-cyan/20" />
                )}
              </motion.button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

/**
 * 图片网格组件
 */
export function ImageGrid({
  images,
  onImageClick,
  columns = 3,
  className = '',
}: {
  images: Image[];
  onImageClick?: (index: number) => void;
  columns?: 2 | 3 | 4;
  className?: string;
}) {
  const gridCols = {
    2: 'grid-cols-2',
    3: 'grid-cols-3',
    4: 'grid-cols-4',
  };

  return (
    <div className={`grid ${gridCols[columns]} gap-4 ${className}`}>
      {images.map((image, index) => (
        <motion.div
          key={index}
          className="relative aspect-square rounded-lg overflow-hidden cursor-pointer group border border-cyber-border"
          onClick={() => onImageClick?.(index)}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <img
            src={image.src}
            alt={image.alt}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
          />

          {/* 悬浮遮罩 */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
            <div className="absolute bottom-0 left-0 right-0 p-3">
              <p className="text-white text-sm font-medium truncate">{image.title || image.alt}</p>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
}

/**
 * 霓虹图片画廊（赛博朋克风格）
 */
export function NeonImageGallery(props: ImageGalleryProps) {
  return (
    <div className="neon-gallery">
      {/* 扫描线效果 */}
      <div className="absolute inset-0 pointer-events-none z-10" style={{
        background: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,240,255,0.03) 2px, rgba(0,240,255,0.03) 4px)',
      }} />

      <ImageGallery {...props} className="neon-gallery-content" />

      <style jsx>{`
        .neon-gallery {
          position: relative;
        }
        .neon-gallery :global(.neon-gallery-content) {
          background: linear-gradient(180deg, rgba(10,10,15,0.98) 0%, rgba(26,26,46,0.98) 100%);
        }
      `}</style>
    </div>
  );
}

export default ImageGallery;
