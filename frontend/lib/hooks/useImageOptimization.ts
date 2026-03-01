/**
 * useImageOptimization Hook
 *
 * 图片优化 Hook
 */

import { useState, useCallback } from 'react';

/**
 * 图片加载状态
 */
export type ImageLoadingStatus = 'idle' | 'loading' | 'loaded' | 'error';

/**
 * 图片优化状态
 */
export interface ImageOptimizationState {
  status: ImageLoadingStatus;
  src: string | null;
  error: Error | null;
}

/**
 * 图片优化选项
 */
export interface ImageOptimizationOptions {
  quality?: number;
  width?: number;
  height?: number;
  format?: 'webp' | 'jpeg' | 'png' | 'auto';
}

/**
 * 图片优化 Hook
 * @returns 图片优化状态和加载函数
 */
export function useImageOptimization(): [
  ImageOptimizationState,
  (src: string, options?: ImageOptimizationOptions) => void,
  () => void
] {
  const [state, setState] = useState<ImageOptimizationState>({
    status: 'idle',
    src: null,
    error: null,
  });

  const loadImage = useCallback(
    (src: string, options?: ImageOptimizationOptions) => {
      setState({ status: 'loading', src: null, error: null });

      const img = new Image();

      img.onload = () => {
        setState({
          status: 'loaded',
          src: src,
          error: null,
        });
      };

      img.onerror = () => {
        setState({
          status: 'error',
          src: null,
          error: new Error('Failed to load image'),
        });
      };

      // 应用优化选项
      let optimizedSrc = src;

      if (options) {
        const { quality = 80, width, height, format = 'auto' } = options;

        // 如果是 Next.js 图片，使用其优化 API
        if (src.startsWith('/')) {
          const params = new URLSearchParams();
          if (quality) params.append('q', quality.toString());
          if (width) params.append('w', width.toString());
          if (height) params.append('h', height.toString());
          if (format !== 'auto') params.append('f', format);

          if (params.toString()) {
            optimizedSrc = `/_next/image?url=${encodeURIComponent(src)}&${params.toString()}`;
          }
        }
      }

      img.src = optimizedSrc;
    },
    []
  );

  const reset = useCallback(() => {
    setState({ status: 'idle', src: null, error: null });
  }, []);

  return [state, loadImage, reset];
}

/**
 * 预加载图片 Hook
 * @param images - 图片 URL 数组
 */
export function usePreloadImages(images: string[]): boolean {
  const [loaded, setLoaded] = useState(false);

  useState(() => {
    if (images.length === 0) {
      setLoaded(true);
      return;
    }

    let loadedCount = 0;
    const totalImages = images.length;

    images.forEach((src) => {
      const img = new Image();
      img.onload = () => {
        loadedCount++;
        if (loadedCount === totalImages) {
          setLoaded(true);
        }
      };
      img.onerror = () => {
        loadedCount++;
        if (loadedCount === totalImages) {
          setLoaded(true);
        }
      };
      img.src = src;
    });
  });

  return loaded;
}

/**
 * 懒加载图片 Hook
 * @param src - 图片 URL
 * @param threshold - 视口阈值（默认 0.1，即 10%）
 * @returns 是否可见
 */
export function useLazyLoadImage(src: string, threshold: number = 0.1): boolean {
  const [isVisible, setIsVisible] = useState(false);

  useState(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(true);
            observer.disconnect();
          }
        });
      },
      { threshold }
    );

    // 创建临时元素观察
    const img = document.createElement('img');
    observer.observe(img);

    return () => {
      observer.disconnect();
    };
  });

  return isVisible;
}
