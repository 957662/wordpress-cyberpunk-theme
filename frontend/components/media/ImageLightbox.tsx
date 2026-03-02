'use client';

import React, { useState, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ZoomIn, ZoomOut, Download, ChevronLeft, ChevronRight } from 'lucide-react';

interface Image {
  src: string;
  alt?: string;
  title?: string;
}

interface ImageLightboxProps {
  images: Image[];
  initialIndex?: number;
  isOpen: boolean;
  onClose: () => void;
  allowDownload?: boolean;
  showThumbnails?: boolean;
  colorScheme?: 'cyan' | 'purple' | 'pink' | 'green' | 'orange' | 'blue';
}

const colorSchemes = {
  cyan: {
    primary: 'bg-cyan-500',
    secondary: 'text-cyan-400',
    bg: 'bg-cyan-500/10',
    border: 'border-cyan-500/30',
    hover: 'hover:bg-cyan-500/20',
  },
  purple: {
    primary: 'bg-purple-500',
    secondary: 'text-purple-400',
    bg: 'bg-purple-500/10',
    border: 'border-purple-500/30',
    hover: 'hover:bg-purple-500/20',
  },
  pink: {
    primary: 'bg-pink-500',
    secondary: 'text-pink-400',
    bg: 'bg-pink-500/10',
    border: 'border-pink-500/30',
    hover: 'hover:bg-pink-500/20',
  },
  green: {
    primary: 'bg-green-500',
    secondary: 'text-green-400',
    bg: 'bg-green-500/10',
    border: 'border-green-500/30',
    hover: 'hover:bg-green-500/20',
  },
  orange: {
    primary: 'bg-orange-500',
    secondary: 'text-orange-400',
    bg: 'bg-orange-500/10',
    border: 'border-orange-500/30',
    hover: 'hover:bg-orange-500/20',
  },
  blue: {
    primary: 'bg-blue-500',
    secondary: 'text-blue-400',
    bg: 'bg-blue-500/10',
    border: 'border-blue-500/30',
    hover: 'hover:bg-blue-500/20',
  },
};

export const ImageLightbox: React.FC<ImageLightboxProps> = ({
  images,
  initialIndex = 0,
  isOpen,
  onClose,
  allowDownload = true,
  showThumbnails = true,
  colorScheme = 'cyan',
}) => {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const [zoom, setZoom] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const colors = colorSchemes[colorScheme];

  const currentImage = images[currentIndex];

  // 重置状态当索引改变时
  useEffect(() => {
    setZoom(1);
    setPosition({ x: 0, y: 0 });
  }, [currentIndex]);

  // 键盘导航
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;

      switch (e.key) {
        case 'ArrowLeft':
          navigate(-1);
          break;
        case 'ArrowRight':
          navigate(1);
          break;
        case 'Escape':
          onClose();
          break;
        case '+':
        case '=':
          handleZoomIn();
          break;
        case '-':
          handleZoomOut();
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, currentIndex]);

  // 防止背景滚动
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  const navigate = (direction: number) => {
    const newIndex = (currentIndex + direction + images.length) % images.length;
    setCurrentIndex(newIndex);
  };

  const handleZoomIn = () => {
    setZoom(prev => Math.min(prev + 0.25, 3));
  };

  const handleZoomOut = () => {
    setZoom(prev => Math.max(prev - 0.25, 0.5));
  };

  const handleResetZoom = () => {
    setZoom(1);
    setPosition({ x: 0, y: 0 });
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    if (zoom > 1) {
      setIsDragging(true);
      setDragStart({ x: e.clientX - position.x, y: e.clientY - position.y });
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging && zoom > 1) {
      setPosition({
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y,
      });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleDownload = () => {
    if (currentImage) {
      const link = document.createElement('a');
      link.href = currentImage.src;
      link.download = currentImage.title || 'image';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  if (!isOpen || !currentImage) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
        className="fixed inset-0 z-50 bg-black/95 backdrop-blur-sm"
        onMouseUp={handleMouseUp}
      >
        {/* 顶部工具栏 */}
        <div className="absolute top-0 left-0 right-0 z-10 p-4 bg-gradient-to-b from-black/80 to-transparent">
          <div className="flex items-center justify-between max-w-7xl mx-auto">
            <div className="flex-1">
              {currentImage.title && (
                <h3 className="text-white text-lg font-medium">{currentImage.title}</h3>
              )}
              <p className="text-gray-400 text-sm">
                {currentIndex + 1} / {images.length}
              </p>
            </div>

            <div className="flex items-center gap-2">
              {/* 缩放按钮 */}
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={handleZoomOut}
                disabled={zoom <= 0.5}
                className={`p-2 rounded-lg ${colors.bg} ${colors.secondary} ${colors.hover} disabled:opacity-50`}
              >
                <ZoomOut className="w-5 h-5" />
              </motion.button>

              <span className="text-white px-3">{Math.round(zoom * 100)}%</span>

              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={handleZoomIn}
                disabled={zoom >= 3}
                className={`p-2 rounded-lg ${colors.bg} ${colors.secondary} ${colors.hover} disabled:opacity-50`}
              >
                <ZoomIn className="w-5 h-5" />
              </motion.button>

              {zoom > 1 && (
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={handleResetZoom}
                  className={`px-3 py-2 rounded-lg ${colors.bg} ${colors.secondary} ${colors.hover} text-sm`}
                >
                  重置
                </motion.button>
              )}

              {/* 下载按钮 */}
              {allowDownload && (
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={handleDownload}
                  className={`p-2 rounded-lg ${colors.bg} ${colors.secondary} ${colors.hover}`}
                >
                  <Download className="w-5 h-5" />
                </motion.button>
              )}

              {/* 关闭按钮 */}
              <motion.button
                whileHover={{ scale: 1.1, rotate: 90 }}
                whileTap={{ scale: 0.9 }}
                onClick={onClose}
                className="p-2 rounded-lg bg-red-500/20 text-red-400 hover:bg-red-500/30"
              >
                <X className="w-6 h-6" />
              </motion.button>
            </div>
          </div>
        </div>

        {/* 主图片区域 */}
        <div className="absolute inset-0 flex items-center justify-center">
          {/* 导航按钮 */}
          {images.length > 1 && (
            <>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => navigate(-1)}
                className="absolute left-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-black/50 text-white hover:bg-black/70 transition-colors z-10"
              >
                <ChevronLeft className="w-6 h-6" />
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => navigate(1)}
                className="absolute right-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-black/50 text-white hover:bg-black/70 transition-colors z-10"
              >
                <ChevronRight className="w-6 h-6" />
              </motion.button>
            </>
          )}

          {/* 图片 */}
          <motion.div
            className="relative max-w-full max-h-full overflow-hidden"
            style={{ cursor: zoom > 1 ? 'grab' : 'default' }}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
          >
            <motion.img
              src={currentImage.src}
              alt={currentImage.alt || currentImage.title}
              className="max-w-full max-h-[calc(100vh-200px)] object-contain"
              animate={{
                scale: zoom,
                x: position.x,
                y: position.y,
              }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              drag={zoom > 1}
              dragConstraints={{ left: -100, right: 100, top: -100, bottom: 100 }}
              dragElastic={0.1}
            />
          </motion.div>
        </div>

        {/* 缩略图 */}
        {showThumbnails && images.length > 1 && (
          <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent">
            <div className="flex gap-2 max-w-7xl mx-auto overflow-x-auto pb-2">
              {images.map((image, index) => (
                <motion.button
                  key={index}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setCurrentIndex(index)}
                  className={`flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 transition-all ${
                    index === currentIndex
                      ? `border-cyan-500 opacity-100`
                      : 'border-transparent opacity-60 hover:opacity-100'
                  }`}
                >
                  <img
                    src={image.src}
                    alt={image.alt || image.title}
                    className="w-full h-full object-cover"
                  />
                </motion.button>
              ))}
            </div>
          </div>
        )}
      </motion.div>
    </AnimatePresence>
  );
};

export default ImageLightbox;
