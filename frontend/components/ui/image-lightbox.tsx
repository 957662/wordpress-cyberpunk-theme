/**
 * 图片灯箱组件
 * 点击图片可全屏查看
 */

'use client';

import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ZoomIn, ZoomOut, RotateCw, Download } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ImageLightboxProps {
  src: string;
  alt: string;
  className?: string;
  children?: React.ReactNode;
}

export function ImageLightbox({
  src,
  alt,
  className,
  children,
}: ImageLightboxProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [scale, setScale] = useState(1);
  const [rotation, setRotation] = useState(0);

  const handleOpen = useCallback(() => {
    setIsOpen(true);
    setScale(1);
    setRotation(0);
  }, []);

  const handleClose = useCallback(() => {
    setIsOpen(false);
    setScale(1);
    setRotation(0);
  }, []);

  const handleZoomIn = useCallback(() => {
    setScale((prev) => Math.min(prev + 0.25, 3));
  }, []);

  const handleZoomOut = useCallback(() => {
    setScale((prev) => Math.max(prev - 0.25, 0.5));
  }, []);

  const handleRotate = useCallback(() => {
    setRotation((prev) => (prev + 90) % 360);
  }, []);

  const handleDownload = useCallback(async () => {
    try {
      const response = await fetch(src);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = alt || 'image';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Failed to download image:', error);
    }
  }, [src, alt]);

  return (
    <>
      <div
        onClick={handleOpen}
        className={cn(
          'cursor-pointer transition-transform hover:scale-[1.02]',
          className
        )}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => e.key === 'Enter' && handleOpen()}
      >
        {children || (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={src} alt={alt} className="h-full w-full" />
        )}
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm"
            onClick={handleClose}
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              className="relative max-h-[90vh] max-w-[90vw]"
              onClick={(e) => e.stopPropagation()}
            >
              {/* 工具栏 */}
              <div className="absolute -top-16 left-1/2 flex -translate-x-1/2 items-center gap-2 rounded-lg bg-foreground/10 p-2 backdrop-blur-sm">
                <button
                  onClick={handleZoomOut}
                  className="rounded-lg p-2 transition-colors hover:bg-cyber-primary/20"
                  title="缩小"
                >
                  <ZoomOut className="h-5 w-5" />
                </button>
                <span className="min-w-[3rem] text-center text-sm">
                  {Math.round(scale * 100)}%
                </span>
                <button
                  onClick={handleZoomIn}
                  className="rounded-lg p-2 transition-colors hover:bg-cyber-primary/20"
                  title="放大"
                >
                  <ZoomIn className="h-5 w-5" />
                </button>
                <div className="mx-2 h-6 w-px bg-white/20" />
                <button
                  onClick={handleRotate}
                  className="rounded-lg p-2 transition-colors hover:bg-cyber-primary/20"
                  title="旋转"
                >
                  <RotateCw className="h-5 w-5" />
                </button>
                <button
                  onClick={handleDownload}
                  className="rounded-lg p-2 transition-colors hover:bg-cyber-primary/20"
                  title="下载"
                >
                  <Download className="h-5 w-5" />
                </button>
                <div className="mx-2 h-6 w-px bg-white/20" />
                <button
                  onClick={handleClose}
                  className="rounded-lg p-2 transition-colors hover:bg-red-500/20 hover:text-red-500"
                  title="关闭 (ESC)"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {/* 图片 */}
              <motion.img
                src={src}
                alt={alt}
                animate={{
                  scale,
                  rotate: rotation,
                }}
                transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                className="max-h-[90vh] max-w-[90vw] object-contain"
                drag
                dragConstraints={{ left: -100, right: 100, top: -100, bottom: 100 }}
                dragElastic={0.1}
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
