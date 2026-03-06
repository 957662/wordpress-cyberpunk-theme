'use client';

import { useState, useCallback } from 'react';

interface UseImageOptimizationOptions {
  quality?: number;
  maxWidth?: number;
  maxHeight?: number;
  format?: 'webp' | 'jpeg' | 'png';
}

export function useImageOptimization(options: UseImageOptimizationOptions = {}) {
  const {
    quality = 80,
    maxWidth = 1920,
    maxHeight = 1080,
    format = 'webp',
  } = options;

  const [isOptimizing, setIsOptimizing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /**
   * Optimize an image file
   */
  const optimizeImage = useCallback(
    async (file: File): Promise<Blob> => {
      setIsOptimizing(true);
      setError(null);

      return new Promise((resolve, reject) => {
        const img = new Image();
        const url = URL.createObjectURL(file);

        img.onload = () => {
          URL.revokeObjectURL(url);

          // Calculate dimensions maintaining aspect ratio
          let width = img.width;
          let height = img.height;

          if (width > maxWidth || height > maxHeight) {
            const widthRatio = maxWidth / width;
            const heightRatio = maxHeight / height;
            const ratio = Math.min(widthRatio, heightRatio);

            width = width * ratio;
            height = height * ratio;
          }

          // Create canvas for resizing
          const canvas = document.createElement('canvas');
          canvas.width = width;
          canvas.height = height;

          const ctx = canvas.getContext('2d');
          if (!ctx) {
            setIsOptimizing(false);
            reject(new Error('Failed to get canvas context'));
            return;
          }

          // Draw image
          ctx.drawImage(img, 0, 0, width, height);

          // Convert to blob
          canvas.toBlob(
            (blob) => {
              setIsOptimizing(false);
              if (blob) {
                resolve(blob);
              } else {
                reject(new Error('Failed to optimize image'));
              }
            },
            format === 'webp' ? 'image/webp' : `image/${format}`,
            quality / 100
          );
        };

        img.onerror = () => {
          URL.revokeObjectURL(url);
          setIsOptimizing(false);
          reject(new Error('Failed to load image'));
        };

        img.src = url;
      });
    },
    [maxWidth, maxHeight, quality, format]
  );

  /**
   * Convert image to base64
   */
  const imageToBase64 = useCallback((file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  }, []);

  /**
   * Get image dimensions
   */
  const getImageDimensions = useCallback(
    (file: File): Promise<{ width: number; height: number }> => {
      return new Promise((resolve, reject) => {
        const img = new Image();
        const url = URL.createObjectURL(file);

        img.onload = () => {
          URL.revokeObjectURL(url);
          resolve({ width: img.width, height: img.height });
        };

        img.onerror = () => {
          URL.revokeObjectURL(url);
          reject(new Error('Failed to load image'));
        };

        img.src = url;
      });
    }, []
  );

  return {
    optimizeImage,
    imageToBase64,
    getImageDimensions,
    isOptimizing,
    error,
  };
}

export default useImageOptimization;
