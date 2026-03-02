'use client';

import React, { useState, useRef, useCallback, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Crop, RotateCw, ZoomIn, ZoomOut, Check, X } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface ImageCropperProps {
  image: string | File;
  onCrop: (blob: Blob) => void;
  onCancel?: () => void;
  aspectRatio?: number;
  circular?: boolean;
  className?: string;
  colorScheme?: 'cyan' | 'purple' | 'pink' | 'green';
}

const colorSchemes = {
  cyan: {
    primary: 'border-cyan-500',
    bg: 'bg-cyan-500',
    text: 'text-cyan-400',
    button: 'bg-cyan-500 hover:bg-cyan-400',
  },
  purple: {
    primary: 'border-purple-500',
    bg: 'bg-purple-500',
    text: 'text-purple-400',
    button: 'bg-purple-500 hover:bg-purple-400',
  },
  pink: {
    primary: 'border-pink-500',
    bg: 'bg-pink-500',
    text: 'text-pink-400',
    button: 'bg-pink-500 hover:bg-pink-400',
  },
  green: {
    primary: 'border-green-500',
    bg: 'bg-green-500',
    text: 'text-green-400',
    button: 'bg-green-500 hover:bg-green-400',
  },
};

interface Position {
  x: number;
  y: number;
}

interface CropArea {
  x: number;
  y: number;
  width: number;
  height: number;
}

const ImageCropper: React.FC<ImageCropperProps> = ({
  image,
  onCrop,
  onCancel,
  aspectRatio = 1,
  circular = false,
  className,
  colorScheme = 'cyan',
}) => {
  const colors = colorSchemes[colorScheme];
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const [imageUrl, setImageUrl] = useState<string>('');
  const [imageLoaded, setImageLoaded] = useState(false);
  const [rotation, setRotation] = useState(0);
  const [scale, setScale] = useState(1);
  const [position, setPosition] = useState<Position>({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState<Position>({ x: 0, y: 0 });
  const [imageSize, setImageSize] = useState({ width: 0, height: 0 });

  // Load image
  useEffect(() => {
    let url = '';
    if (typeof image === 'string') {
      url = image;
    } else {
      url = URL.createObjectURL(image);
    }
    setImageUrl(url);

    return () => {
      if (typeof image !== 'string') {
        URL.revokeObjectURL(url);
      }
    };
  }, [image]);

  const handleImageLoad = useCallback((e: React.SyntheticEvent<HTMLImageElement>) => {
    const img = e.currentTarget;
    setImageSize({ width: img.naturalWidth, height: img.naturalHeight });
    setImageLoaded(true);
  }, []);

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    setIsDragging(true);
    setDragStart({ x: e.clientX - position.x, y: e.clientY - position.y });
  }, [position]);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!isDragging) return;
    setPosition({
      x: e.clientX - dragStart.x,
      y: e.clientY - dragStart.y,
    });
  }, [isDragging, dragStart]);

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  useEffect(() => {
    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove as any);
      window.addEventListener('mouseup', handleMouseUp);
      return () => {
        window.removeEventListener('mousemove', handleMouseMove as any);
        window.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [isDragging, handleMouseMove, handleMouseUp]);

  const handleRotate = useCallback(() => {
    setRotation((prev) => (prev + 90) % 360);
  }, []);

  const handleZoomIn = useCallback(() => {
    setScale((prev) => Math.min(prev + 0.1, 3));
  }, []);

  const handleZoomOut = useCallback(() => {
    setScale((prev) => Math.max(prev - 0.1, 0.5));
  }, []);

  const handleCrop = useCallback(() => {
    if (!canvasRef.current || !containerRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const container = containerRef.current;
    const containerRect = container.getBoundingClientRect();
    const cropSize = Math.min(containerRect.width, containerRect.height) * 0.8;

    canvas.width = cropSize;
    canvas.height = cropSize;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Create circular clip if needed
    if (circular) {
      ctx.beginPath();
      ctx.arc(canvas.width / 2, canvas.height / 2, canvas.width / 2, 0, Math.PI * 2);
      ctx.closePath();
      ctx.clip();
    }

    // Draw transformed image
    ctx.save();
    ctx.translate(canvas.width / 2, canvas.height / 2);
    ctx.rotate((rotation * Math.PI) / 180);
    ctx.scale(scale, scale);
    ctx.translate(-canvas.width / 2 + position.x, -canvas.height / 2 + position.y);

    const img = new Image();
    img.onload = () => {
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      ctx.restore();

      canvas.toBlob((blob) => {
        if (blob) {
          onCrop(blob);
        }
      }, 'image/png');
    };
    img.src = imageUrl;
  }, [imageUrl, rotation, scale, position, circular, onCrop]);

  return (
    <div className={cn('space-y-4', className)}>
      {/* Cropper Container */}
      <div
        ref={containerRef}
        className="relative overflow-hidden rounded-xl border-2 border-dashed border-gray-700 bg-gray-900/50"
        style={{ height: '400px' }}
      >
        <img
          src={imageUrl}
          alt="Crop"
          onLoad={handleImageLoad}
          className={cn(
            'absolute top-1/2 left-1/2 max-w-none origin-center',
            'select-none cursor-move'
          )}
          style={{
            transform: `translate(-50%, -50%) rotate(${rotation}deg) scale(${scale}) translate(${position.x}px, ${position.y}px)`,
            opacity: imageLoaded ? 1 : 0,
          }}
          onMouseDown={handleMouseDown}
          draggable={false}
        />

        {/* Crop Area Overlay */}
        <div
          className={cn(
            'absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 border-2',
            colors.primary,
            circular ? 'rounded-full' : 'rounded-lg'
          )}
          style={{
            width: '80%',
            height: aspectRatio === 1 ? '80%' : `${80 / aspectRatio}%`,
            aspectRatio,
          }}
        />

        {/* Loading State */}
        {!imageLoaded && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <div className="mx-auto h-8 w-8 animate-spin rounded-full border-2 border-gray-600 border-t-cyan-500" />
              <p className="mt-2 text-sm text-gray-400">加载图片中...</p>
            </div>
          </div>
        )}
      </div>

      {/* Controls */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleRotate}
            className="rounded-lg bg-gray-800 p-2 text-white hover:bg-gray-700"
            title="旋转"
          >
            <RotateCw className="h-5 w-5" />
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleZoomOut}
            className="rounded-lg bg-gray-800 p-2 text-white hover:bg-gray-700"
            title="缩小"
          >
            <ZoomOut className="h-5 w-5" />
          </motion.button>

          <div className="w-24 rounded-lg bg-gray-800 px-3 py-2 text-center text-sm text-white">
            {Math.round(scale * 100)}%
          </div>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleZoomIn}
            className="rounded-lg bg-gray-800 p-2 text-white hover:bg-gray-700"
            title="放大"
          >
            <ZoomIn className="h-5 w-5" />
          </motion.button>
        </div>

        <div className="flex items-center gap-2">
          {onCancel && (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onCancel}
              className="flex items-center gap-2 rounded-lg border border-gray-600 px-4 py-2 text-white hover:bg-gray-800"
            >
              <X className="h-4 w-4" />
              取消
            </motion.button>
          )}

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleCrop}
            className={cn('flex items-center gap-2 rounded-lg px-4 py-2 font-semibold text-white', colors.button)}
          >
            <Crop className="h-4 w-4" />
            裁剪
          </motion.button>
        </div>
      </div>

      {/* Hidden Canvas for Crop */}
      <canvas ref={canvasRef} className="hidden" />
    </div>
  );
};

export default ImageCropper;
