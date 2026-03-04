/**
 * 图片优化工具
 * 自动优化图片加载和显示
 */

import { ImageProps } from 'next/image';

/**
 * 图片格式配置
 */
export interface ImageConfig {
  quality?: number;
  formats?: Array<'webp' | 'avif' | 'jpg' | 'png'>;
  sizes?: string[];
  placeholder?: 'blur' | 'empty';
  blurDataURL?: string;
}

/**
 * 默认图片配置
 */
const DEFAULT_IMAGE_CONFIG: ImageConfig = {
  quality: 75,
  formats: ['webp', 'avif'],
  sizes: [
    '(max-width: 640px) 100vw',
    '(max-width: 1024px) 50vw',
    '(max-width: 1536px) 33vw',
    '25vw',
  ],
  placeholder: 'empty',
};

/**
 * 生成优化的图片配置
 */
export function optimizeImageProps(
  src: string,
  config: Partial<ImageConfig> = {}
): Omit<ImageProps, 'src' | 'alt'> {
  const finalConfig = { ...DEFAULT_IMAGE_CONFIG, ...config };

  return {
    quality: finalConfig.quality,
    placeholder: finalConfig.placeholder as any,
    blurDataURL: finalConfig.blurDataURL,
    sizes: finalConfig.sizes?.join(', '),
    fill: false,
    priority: false,
    loading: 'lazy',
  };
}

/**
 * 响应式图片尺寸生成器
 */
export function generateResponsiveSizes(
  baseWidth: number,
  breakpoints: number[] = [640, 750, 828, 1080, 1200, 1920, 2048, 3840]
): ImageProps['sizes'] {
  const sizes = breakpoints
    .map(bp => `(max-width: ${bp}px) ${Math.round((baseWidth / bp) * 100)}vw`)
    .reverse();

  sizes.push(`${baseWidth}px`);
  return sizes.join(', ');
}

/**
 * 生成低质量图片占位符 (LQIP)
 */
export async function generateBlurDataURL(
  src: string,
  width: number = 10,
  height: number = 10
): Promise<string> {
  try {
    // 在实际项目中，这里应该调用图片处理服务
    // 这里返回一个简单的 base64 占位符
    return 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAiIGhlaWdodD0iMTAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0iIzFhMWEyZSIvPjwvc3ZnPg==';
  } catch (error) {
    console.error('Failed to generate blur data URL:', error);
    return '';
  }
}

/**
 * WebP 检测
 */
export function supportsWebP(): Promise<boolean> {
  if (typeof window === 'undefined') {
    return Promise.resolve(false);
  }

  return new Promise(resolve => {
    const webP = new Image();
    webP.onload = webP.onerror = () => {
      resolve(webP.height === 2);
    };
    webP.src = 'data:image/webp;base64,UklGRjoAAABXRUJQVlA4IC4AAACyAgCdASoCAAIALmk0mk0iIiIiIgBoSygABc6WWgAA/veff/0PP8bA//LwYAAA';
  });
}

/**
 * 预加载关键图片
 */
export function preloadCriticalImages(images: string[]): void {
  if (typeof window === 'undefined') return;

  images.forEach(src => {
    const link = document.createElement('link');
    link.rel = 'preload';
    link.as = 'image';
    link.href = src;
    document.head.appendChild(link);
  });
}

/**
 * 懒加载图片观察器
 */
export function createImageIntersectionObserver(
  callback: (entries: IntersectionObserverEntry[]) => void,
  options: IntersectionObserverInit = {}
): IntersectionObserver | null {
  if (typeof window === 'undefined' || !('IntersectionObserver' in window)) {
    return null;
  }

  return new IntersectionObserver(callback, {
    rootMargin: '50px',
    threshold: 0.01,
    ...options,
  });
}

/**
 * 图片加载性能监控
 */
export class ImageLoadMonitor {
  private loadTimes: Map<string, number> = new Map();

  record(imageUrl: string, loadTime: number): void {
    this.loadTimes.set(imageUrl, loadTime);

    // 记录到分析工具
    if (typeof window !== 'undefined' && 'performance' in window) {
      performance.mark(`image-loaded-${imageUrl}`);
    }
  }

  getAverageLoadTime(): number {
    if (this.loadTimes.size === 0) return 0;

    const total = Array.from(this.loadTimes.values()).reduce((sum, time) => sum + time, 0);
    return total / this.loadTimes.size;
  }

  getSlowImages(threshold: number = 3000): string[] {
    return Array.from(this.loadTimes.entries())
      .filter(([_, time]) => time > threshold)
      .map(([url]) => url);
  }

  clear(): void {
    this.loadTimes.clear();
  }
}

export const imageMonitor = new ImageLoadMonitor();
