'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { X, ChevronLeft, ChevronRight, ZoomIn } from 'lucide-react';
import { cn } from '@/lib/utils';

interface GalleryImage {
  src: string;
  alt: string;
  title?: string;
  description?: string;
}

interface ImageGalleryProps {
  images: GalleryImage[];
  className?: string;
  layout?: 'grid' | 'masonry' | 'slider';
  columns?: 2 | 3 | 4;
  aspectRatio?: 'square' | 'portrait' | 'landscape' | 'auto';
}

export const ImageGallery: React.FC<ImageGalleryProps> = ({
  images,
  className,
  layout = 'grid',
  columns = 3,
  aspectRatio = 'square',
}) => {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  const handlePrevious = () => {
    if (selectedIndex === null) return;
    setSelectedIndex((selectedIndex - 1 + images.length) % images.length);
  };

  const handleNext = () => {
    if (selectedIndex === null) return;
    setSelectedIndex((selectedIndex + 1) % images.length);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (selectedIndex === null) return;
    if (e.key === 'ArrowLeft') handlePrevious();
    if (e.key === 'ArrowRight') handleNext();
    if (e.key === 'Escape') setSelectedIndex(null);
  };

  if (layout === 'slider') {
    return (
      <div className={cn('relative', className)}>
        <div className="relative aspect-video overflow-hidden rounded-lg bg-dark-800">
          {images.map((image, index) => (
            <motion.div
              key={image.src}
              className="absolute inset-0"
              initial={{ opacity: 0 }}
              animate={{ opacity: selectedIndex === index ? 1 : 0 }}
              transition={{ duration: 0.3 }}
            >
              <Image
                src={image.src}
                alt={image.alt}
                fill
                className="object-cover"
              />
            </motion.div>
          ))}

          {/* Navigation */}
          {images.length > 1 && (
            <>
              <button
                onClick={handlePrevious}
                className="absolute left-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/50 hover:bg-black/70 transition-colors"
              >
                <ChevronLeft className="w-6 h-6 text-white" />
              </button>
              <button
                onClick={handleNext}
                className="absolute right-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/50 hover:bg-black/70 transition-colors"
              >
                <ChevronRight className="w-6 h-6 text-white" />
              </button>
            </>
          )}

          {/* Thumbnails */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
            {images.map((image, index) => (
              <button
                key={image.src}
                onClick={() => setSelectedIndex(index)}
                className={cn(
                  'w-16 h-16 rounded overflow-hidden border-2 transition-all',
                  selectedIndex === index
                    ? 'border-cyber-cyan scale-110'
                    : 'border-transparent opacity-60 hover:opacity-100'
                )}
              >
                <Image
                  src={image.src}
                  alt={image.alt}
                  width={64}
                  height={64}
                  className="object-cover"
                />
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  }

  const gridCols: Record<number, string> = {
    2: 'grid-cols-1 md:grid-cols-2',
    3: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
    4: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4',
  };

  const aspectRatios: Record<string, string> = {
    square: 'aspect-square',
    portrait: 'aspect-[3/4]',
    landscape: 'aspect-video',
    auto: 'aspect-auto',
  };

  return (
    <>
      <div className={cn('grid gap-4', gridCols[columns], className)}>
        {images.map((image, index) => (
          <motion.button
            key={image.src}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            onClick={() => setSelectedIndex(index)}
            className="relative group overflow-hidden rounded-lg bg-dark-800"
          >
            <div
              className={cn(
                'relative w-full overflow-hidden',
                aspectRatios[aspectRatio]
              )}
            >
              <Image
                src={image.src}
                alt={image.alt}
                fill
                className="object-cover transition-transform duration-300 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors flex items-center justify-center">
                <ZoomIn className="w-8 h-8 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
            </div>
            {image.title && (
              <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                <p className="text-sm font-medium text-white">{image.title}</p>
              </div>
            )}
          </motion.button>
        ))}
      </div>

      {/* Lightbox */}
      <AnimatePresence>
        {selectedIndex !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onKeyDown={handleKeyDown}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4"
            onClick={() => setSelectedIndex(null)}
          >
            <button
              onClick={() => setSelectedIndex(null)}
              className="absolute top-4 right-4 p-2 rounded-full bg-dark-800 hover:bg-dark-700 transition-colors"
            >
              <X className="w-6 h-6 text-white" />
            </button>

            {images.length > 1 && (
              <>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handlePrevious();
                  }}
                  className="absolute left-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-dark-800 hover:bg-dark-700 transition-colors"
                >
                  <ChevronLeft className="w-6 h-6 text-white" />
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleNext();
                  }}
                  className="absolute right-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-dark-800 hover:bg-dark-700 transition-colors"
                >
                  <ChevronRight className="w-6 h-6 text-white" />
                </button>
              </>
            )}

            <motion.div
              key={selectedIndex}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.2 }}
              className="relative max-w-5xl max-h-[90vh] w-full h-full"
              onClick={(e) => e.stopPropagation()}
            >
              <Image
                src={images[selectedIndex].src}
                alt={images[selectedIndex].alt}
                fill
                className="object-contain"
              />
              {images[selectedIndex].title && (
                <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/80 to-transparent">
                  <h3 className="text-xl font-bold text-white">
                    {images[selectedIndex].title}
                  </h3>
                  {images[selectedIndex].description && (
                    <p className="text-gray-300 mt-1">
                      {images[selectedIndex].description}
                    </p>
                  )}
                </div>
              )}
            </motion.div>

            {/* Counter */}
            {images.length > 1 && (
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 px-4 py-2 rounded-full bg-dark-800 text-white text-sm">
                {selectedIndex + 1} / {images.length}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

interface ImageMasonryProps {
  images: GalleryImage[];
  columns?: 2 | 3 | 4;
  className?: string;
}

export const ImageMasonry: React.FC<ImageMasonryProps> = ({
  images,
  columns = 3,
  className,
}) => {
  return (
    <div
      className={cn('grid gap-4', className)}
      style={{
        gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))`,
      }}
    >
      {images.map((image, index) => (
        <motion.div
          key={image.src}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.05 }}
          className="break-inside-avoid mb-4"
        >
          <div className="relative rounded-lg overflow-hidden bg-dark-800">
            <Image
              src={image.src}
              alt={image.alt}
              width={400}
              height={Math.random() * 200 + 300}
              className="w-full h-auto object-cover"
            />
          </div>
        </motion.div>
      ))}
    </div>
  );
};

export default ImageGallery;
