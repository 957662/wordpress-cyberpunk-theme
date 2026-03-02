'use client';

/**
 * ImageGallery Component - 图片画廊组件
 * 支持 Masonry 布局、Lightbox 预览、图片过滤、懒加载
 */

import { useState, useCallback, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  ChevronLeft,
  ChevronRight,
  Download,
  ZoomIn,
  Grid,
  List,
} from 'lucide-react';
import Image from 'next/image';

// 图片项
export interface GalleryImage {
  id: string;
  src: string;
  alt: string;
  title?: string;
  description?: string;
  width?: number;
  height?: number;
  category?: string;
  date?: string;
  photographer?: string;
  location?: string;
}

// 布局类型
export type GalleryLayout = 'masonry' | 'grid' | 'list';

// 组件Props
export interface ImageGalleryProps {
  /** 图片列表 */
  images: GalleryImage[];
  /** 布局类型 */
  layout?: GalleryLayout;
  /** 列数（响应式） */
  columns?: { xs?: number; sm?: number; md?: number; lg?: number; xl?: number };
  /** 间距 */
  gap?: number;
  /** 是否显示Lightbox */
  enableLightbox?: boolean;
  /** 是否允许下载 */
  enableDownload?: boolean;
  /** 是否显示分类过滤 */
  enableFilter?: boolean;
  /** 图片点击回调 */
  onImageClick?: (image: GalleryImage, index: number) => void;
  /** 自定义样式类名 */
  className?: string;
  /** 懒加载阈值 */
  threshold?: number;
}

export function ImageGallery({
  images,
  layout = 'masonry',
  columns = { xs: 1, sm: 2, md: 3, lg: 4, xl: 5 },
  gap = 16,
  enableLightbox = true,
  enableDownload = true,
  enableFilter = true,
  onImageClick,
  className = '',
  threshold = 0.1,
}: ImageGalleryProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [imageLoaded, setImageLoaded] = useState<Set<string>>(new Set());
  const galleryRef = useRef<HTMLDivElement>(null);

  // 获取分类列表
  const categories = ['all', ...Array.from(new Set(images.map((img) => img.category).filter(Boolean)))];

  // 过滤图片
  const filteredImages = selectedCategory === 'all'
    ? images
    : images.filter((img) => img.category === selectedCategory);

  // 处理图片点击
  const handleImageClick = useCallback((image: GalleryImage, index: number) => {
    if (enableLightbox) {
      setCurrentIndex(index);
      setLightboxOpen(true);
    }
    onImageClick?.(image, index);
  }, [enableLightbox, onImageClick]);

  // 处理图片加载
  const handleImageLoad = useCallback((id: string) => {
    setImageLoaded((prev) => new Set([...prev, id]));
  }, []);

  // 关闭 Lightbox
  const closeLightbox = () => {
    setLightboxOpen(false);
  };

  // 上一张
  const previousImage = () => {
    setCurrentIndex((prev) => (prev > 0 ? prev - 1 : filteredImages.length - 1));
  };

  // 下一张
  const nextImage = () => {
    setCurrentIndex((prev) => (prev < filteredImages.length - 1 ? prev + 1 : 0));
  };

  // 键盘导航
  useEffect(() => {
    if (!lightboxOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeLightbox();
      if (e.key === 'ArrowLeft') previousImage();
      if (e.key === 'ArrowRight') nextImage();
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [lightboxOpen]);

  // 获取当前列数
  const getColumns = () => {
    const width = galleryRef.current?.offsetWidth || 0;
    if (width >= 1280) return columns.xl || columns.lg || 4;
    if (width >= 1024) return columns.lg || columns.md || 3;
    if (width >= 768) return columns.md || columns.sm || 2;
    if (width >= 640) return columns.sm || columns.xs || 1;
    return columns.xs || 1;
  };

  // Masonry布局计算
  const getMasonryLayout = () => {
    const cols = getColumns();
    const columnImages: GalleryImage[][] = Array.from({ length: cols }, () => []);
    const columnHeights: number[] = Array.from({ length: cols }, () => 0);

    filteredImages.forEach((image) => {
      const minHeight = Math.min(...columnHeights);
      const columnIndex = columnHeights.indexOf(minHeight);
      columnImages[columnIndex].push(image);
      columnHeights[columnIndex] += (image.height || 300) / (image.width || 300) + 0.5;
    });

    return columnImages;
  };

  // Grid布局
  const getGridLayout = () => {
    const cols = getColumns();
    const result: GalleryImage[][] = [];
    for (let i = 0; i < filteredImages.length; i += cols) {
      result.push(filteredImages.slice(i, i + cols));
    }
    return result;
  };

  // 渲染图片卡片
  const renderImageCard = (image: GalleryImage, index: number) => {
    const isLoaded = imageLoaded.has(image.id);
    const aspectRatio = image.width && image.height ? image.height / image.width : 1;

    return (
      <motion.div
        key={image.id}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: index * 0.05 }}
        className="cyber-card overflow-hidden group cursor-pointer"
        onClick={() => handleImageClick(image, filteredImages.indexOf(image))}
      >
        {/* 图片容器 */}
        <div className="relative overflow-hidden bg-cyber-dark">
          {/* 占位符 */}
          {!isLoaded && (
            <div
              className="absolute inset-0 bg-cyber-card animate-pulse"
              style={{ aspectRatio: image.width && image.height ? `${image.width}/${image.height}` : undefined }}
            />
          )}

          {/* 图片 */}
          <Image
            src={image.src}
            alt={image.alt}
            width={image.width || 400}
            height={image.height || 300}
            className="w-full h-auto object-cover transition-transform duration-500 group-hover:scale-110"
            onLoad={() => handleImageLoad(image.id)}
            loading="lazy"
          />

          {/* 悬浮遮罩 */}
          <div className="absolute inset-0 bg-gradient-to-t from-cyber-dark/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            {/* 悬浮信息 */}
            <div className="absolute bottom-0 left-0 right-0 p-4">
              {image.title && (
                <h3 className="text-white font-semibold mb-1">{image.title}</h3>
              )}
              {image.category && (
                <span className="inline-block px-2 py-1 text-xs bg-cyber-cyan/20 text-cyber-cyan rounded">
                  {image.category}
                </span>
              )}
            </div>

            {/* 缩放图标 */}
            <div className="absolute top-4 right-4 w-10 h-10 bg-cyber-dark/80 backdrop-blur rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
              <ZoomIn className="w-5 h-5 text-white" />
            </div>
          </div>
        </div>
      </motion.div>
    );
  };

  // 渲染List布局的图片项
  const renderListItem = (image: GalleryImage, index: number) => {
    return (
      <motion.div
        key={image.id}
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: index * 0.05 }}
        className="cyber-card p-4 flex gap-4 cursor-pointer hover:border-cyber-cyan/50 transition-colors"
        onClick={() => handleImageClick(image, index)}
      >
        <div className="relative w-48 h-32 flex-shrink-0 rounded overflow-hidden">
          <Image
            src={image.src}
            alt={image.alt}
            width={200}
            height={150}
            className="w-full h-full object-cover"
            loading="lazy"
          />
        </div>

        <div className="flex-1 min-w-0">
          {image.title && (
            <h3 className="text-white font-semibold mb-2">{image.title}</h3>
          )}
          {image.description && (
            <p className="text-gray-400 text-sm line-clamp-2 mb-2">{image.description}</p>
          )}
          <div className="flex flex-wrap gap-2 text-xs text-gray-500">
            {image.category && (
              <span className="px-2 py-1 bg-cyber-cyan/20 text-cyber-cyan rounded">
                {image.category}
              </span>
            )}
            {image.date && <span>{image.date}</span>}
            {image.location && <span>📍 {image.location}</span>}
          </div>
        </div>
      </motion.div>
    );
  };

  return (
    <div className={`space-y-6 ${className}`}>
      {/* 分类过滤 */}
      {enableFilter && categories.length > 1 && (
        <div className="flex flex-wrap gap-2">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`
                px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300
                ${selectedCategory === category
                  ? 'bg-cyber-cyan text-cyber-dark shadow-lg shadow-cyber-cyan/50'
                  : 'bg-cyber-card text-gray-400 hover:text-white'
                }
              `}
            >
              {category === 'all' ? '全部' : category}
            </button>
          ))}
        </div>
      )}

      {/* 图片画廊 */}
      <div ref={galleryRef} className="min-h-screen">
        {layout === 'list' ? (
          <div className="space-y-4">
            {filteredImages.map((image, index) => renderListItem(image, index))}
          </div>
        ) : layout === 'grid' ? (
          <div
            className="grid gap-4"
            style={{
              gridTemplateColumns: `repeat(${getColumns()}, minmax(0, 1fr))`,
              gap: `${gap}px`,
            }}
          >
            {filteredImages.map((image, index) => renderImageCard(image, index))}
          </div>
        ) : (
          <div className="flex gap-4">
            {getMasonryLayout().map((columnImages, columnIndex) => (
              <div
                key={columnIndex}
                className="flex-1 flex flex-col gap-4"
                style={{ gap: `${gap}px` }}
              >
                {columnImages.map((image) => renderImageCard(image, filteredImages.indexOf(image)))}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Lightbox */}
      <AnimatePresence>
        {lightboxOpen && (
          <>
            {/* 遮罩 */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/95 z-50"
              onClick={closeLightbox}
            />

            {/* Lightbox内容 */}
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
              {/* 关闭按钮 */}
              <button
                onClick={closeLightbox}
                className="absolute top-4 right-4 w-10 h-10 bg-cyber-dark/80 backdrop-blur rounded-full flex items-center justify-center hover:bg-cyber-dark transition-colors z-50"
              >
                <X className="w-6 h-6 text-white" />
              </button>

              {/* 导航按钮 */}
              {filteredImages.length > 1 && (
                <>
                  <button
                    onClick={(e) => { e.stopPropagation(); previousImage(); }}
                    className="absolute left-4 w-12 h-12 bg-cyber-dark/80 backdrop-blur rounded-full flex items-center justify-center hover:bg-cyber-dark transition-colors z-50"
                  >
                    <ChevronLeft className="w-6 h-6 text-white" />
                  </button>
                  <button
                    onClick={(e) => { e.stopPropagation(); nextImage(); }}
                    className="absolute right-4 w-12 h-12 bg-cyber-dark/80 backdrop-blur rounded-full flex items-center justify-center hover:bg-cyber-dark transition-colors z-50"
                  >
                    <ChevronRight className="w-6 h-6 text-white" />
                  </button>
                </>
              )}

              {/* 当前图片 */}
              <motion.div
                key={currentIndex}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="relative max-w-7xl max-h-[90vh] w-full"
                onClick={(e) => e.stopPropagation()}
              >
                <Image
                  src={filteredImages[currentIndex]?.src || ''}
                  alt={filteredImages[currentIndex]?.alt || ''}
                  width={1200}
                  height={800}
                  className="w-full h-auto object-contain max-h-[90vh]"
                />

                {/* 图片信息 */}
                {(filteredImages[currentIndex]?.title || filteredImages[currentIndex]?.description) && (
                  <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/80 to-transparent">
                    {filteredImages[currentIndex]?.title && (
                      <h2 className="text-2xl font-bold text-white mb-2">
                        {filteredImages[currentIndex]?.title}
                      </h2>
                    )}
                    {filteredImages[currentIndex]?.description && (
                      <p className="text-gray-300">
                        {filteredImages[currentIndex]?.description}
                      </p>
                    )}
                    <div className="flex items-center gap-4 mt-3 text-sm text-gray-400">
                      <span>{currentIndex + 1} / {filteredImages.length}</span>
                      {enableDownload && (
                        <a
                          href={filteredImages[currentIndex]?.src}
                          download
                          className="flex items-center gap-1 hover:text-cyber-cyan transition-colors"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <Download className="w-4 h-4" />
                          下载
                        </a>
                      )}
                    </div>
                  </div>
                )}
              </motion.div>
            </div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}

export default ImageGallery;
