'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronLeft, ChevronRight, Download, ZoomIn, ZoomOut } from 'lucide-react';
import { useTheme } from 'next-themes';

interface ImageLightboxProps {
  images: Array<{
    src: string;
    alt?: string;
    title?: string;
  }>;
  initialIndex?: number;
  isOpen: boolean;
  onClose: () => void;
}

export const ImageLightbox: React.FC<ImageLightboxProps> = ({
  images,
  initialIndex = 0,
  isOpen,
  onClose,
}) => {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const [zoom, setZoom] = useState(1);
  const { theme, resolvedTheme } = useTheme();
  const isDark = theme === 'dark' || resolvedTheme === 'dark';

  useEffect(() => {
    setCurrentIndex(initialIndex);
    setZoom(1);
  }, [initialIndex, isOpen]);

  const handlePrevious = useCallback(() => {
    setCurrentIndex((prev) => (prev > 0 ? prev - 1 : images.length - 1));
    setZoom(1);
  }, [images.length]);

  const handleNext = useCallback(() => {
    setCurrentIndex((prev) => (prev < images.length - 1 ? prev + 1 : 0));
    setZoom(1);
  }, [images.length]);

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (!isOpen) return;
      if (e.key === 'ArrowLeft') handlePrevious();
      if (e.key === 'ArrowRight') handleNext();
      if (e.key === 'Escape') onClose();
      if (e.key === '+' || e.key === '=') setZoom((z) => Math.min(z + 0.2, 3));
      if (e.key === '-' || e.key === '_') setZoom((z) => Math.max(z - 0.2, 0.5));
    },
    [isOpen, handlePrevious, handleNext, onClose]
  );

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  const handleDownload = () => {
    const image = images[currentIndex];
    const link = document.createElement('a');
    link.href = image.src;
    link.download = image.title || image.alt || 'image';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const currentImage = images[currentIndex];

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 backdrop-blur-sm"
        onClick={onClose}
      >
        {/* 背景遮罩 */}
        <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/10 to-purple-500/10" />

        {/* 工具栏 */}
        <div className="absolute top-4 right-4 flex gap-2 z-10">
          {/* 缩放控制 */}
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={(e) => {
              e.stopPropagation();
              setZoom((z) => Math.min(z + 0.2, 3));
            }}
            disabled={zoom >= 3}
            className="p-2 rounded-lg bg-gray-800/80 hover:bg-gray-700/80 text-white border border-cyan-500/30 disabled:opacity-50 disabled:cursor-not-allowed"
            title="放大"
          >
            <ZoomIn size={20} />
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={(e) => {
              e.stopPropagation();
              setZoom((z) => Math.max(z - 0.2, 0.5));
            }}
            disabled={zoom <= 0.5}
            className="p-2 rounded-lg bg-gray-800/80 hover:bg-gray-700/80 text-white border border-cyan-500/30 disabled:opacity-50 disabled:cursor-not-allowed"
            title="缩小"
          >
            <ZoomOut size={20} />
          </motion.button>

          {/* 下载按钮 */}
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={(e) => {
              e.stopPropagation();
              handleDownload();
            }}
            className="p-2 rounded-lg bg-gray-800/80 hover:bg-gray-700/80 text-white border border-cyan-500/30"
            title="下载"
          >
            <Download size={20} />
          </motion.button>

          {/* 关闭按钮 */}
          <motion.button
            whileHover={{ scale: 1.1, rotate: 90 }}
            whileTap={{ scale: 0.9 }}
            onClick={(e) => {
              e.stopPropagation();
              onClose();
            }}
            className="p-2 rounded-lg bg-red-500/80 hover:bg-red-600/80 text-white"
            title="关闭 (ESC)"
          >
            <X size={20} />
          </motion.button>
        </div>

        {/* 上一张按钮 */}
        {images.length > 1 && (
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={(e) => {
              e.stopPropagation();
              handlePrevious();
            }}
            className="absolute left-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-gray-800/80 hover:bg-gray-700/80 text-white border border-cyan-500/30 z-10"
            title="上一张 (←)"
          >
            <ChevronLeft size={24} />
          </motion.button>
        )}

        {/* 下一张按钮 */}
        {images.length > 1 && (
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={(e) => {
              e.stopPropagation();
              handleNext();
            }}
            className="absolute right-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-gray-800/80 hover:bg-gray-700/80 text-white border border-cyan-500/30 z-10"
            title="下一张 (→)"
          >
            <ChevronRight size={24} />
          </motion.button>
        )}

        {/* 图片容器 */}
        <div
          className="relative max-w-90vw max-h-90vw md:max-w-80vw md:max-h-80vw overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          <motion.img
            key={currentIndex}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: zoom }}
            transition={{ duration: 0.3 }}
            src={currentImage.src}
            alt={currentImage.alt}
            className="max-w-full max-h-[80vh] object-contain rounded-lg shadow-2xl"
            style={{
              boxShadow: `0 0 40px ${isDark ? '#00f0ff40' : '#9d00ff40'}`,
            }}
          />

          {/* 图片标题 */}
          {currentImage.title && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent"
            >
              <p className="text-white text-center font-medium">{currentImage.title}</p>
              {currentImage.alt && (
                <p className="text-gray-300 text-center text-sm mt-1">{currentImage.alt}</p>
              )}
            </motion.div>
          )}
        </div>

        {/* 图片计数器 */}
        {images.length > 1 && (
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 px-4 py-2 rounded-full bg-gray-800/80 text-white text-sm border border-cyan-500/30">
            {currentIndex + 1} / {images.length}
          </div>
        )}

        {/* 键盘提示 */}
        <div className="absolute bottom-4 right-4 text-gray-400 text-xs hidden md:block">
          ESC 关闭 • ← → 切换 • + - 缩放
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

// Hook for easy usage
export const useImageLightbox = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [images, setImages] = useState<Array<{ src: string; alt?: string; title?: string }>>([]);
  const [initialIndex, setInitialIndex] = useState(0);

  const open = (
    imageList: Array<{ src: string; alt?: string; title?: string }>,
    index = 0
  ) => {
    setImages(imageList);
    setInitialIndex(index);
    setIsOpen(true);
  };

  const close = () => setIsOpen(false);

  return {
    isOpen,
    images,
    initialIndex,
    open,
    close,
    ImageLightboxComponent: () => (
      <ImageLightbox isOpen={isOpen} images={images} initialIndex={initialIndex} onClose={close} />
    ),
  };
};

export default ImageLightbox;
