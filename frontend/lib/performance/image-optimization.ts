/**
 * Image Optimization Utilities - 图片优化工具
 * 用于优化图片加载和显示
 */

import Image from 'next/image';

export interface ImageOptimizationOptions {
  quality?: number;
  priority?: boolean;
  placeholder?: 'blur' | 'empty';
  blurDataURL?: string;
  sizes?: string;
}

/**
 * 默认图片优化配置
 */
export const defaultImageOptions: ImageOptimizationOptions = {
  quality: 75,
  priority: false,
  placeholder: 'empty',
};

/**
 * 生成模糊占位符数据 URL
 * 用于图片加载前的占位显示
 */
export function generateBlurDataURL(width: number, height: number): string {
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');

  if (!ctx) return '';

  // 创建渐变背景
  const gradient = ctx.createLinearGradient(0, 0, width, height);
  gradient.addColorStop(0, '#1a1a2e');
  gradient.addColorStop(1, '#16213e');

  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, width, height);

  return canvas.toDataURL();
}

/**
 * 计算响应式图片尺寸
 * 根据容器宽度计算最优图片尺寸
 */
export function calculateResponsiveSizes(
  containerWidth: number,
  breakpoints: number[] = [640, 768, 1024, 1280]
): string {
  const sizes = breakpoints
    .filter(bp => bp <= containerWidth)
    .map(bp => `(max-width: ${bp}px) ${bp}px`)
    .join(', ');

  return `${sizes}, ${containerWidth}px`;
}

/**
 * 生成 srcset 属性
 * 用于不同分辨率的图片加载
 */
export function generateSrcSet(
  baseUrl: string,
  sizes: number[]
): string {
  return sizes
    .map(size => `${baseUrl}?w=${size} ${size}w`)
    .join(', ');
}

/**
 * 懒加载图片配置
 * 只有当图片进入视口时才加载
 */
export const lazyImageConfig = {
  loading: 'lazy' as const,
  decoding: 'async' as const,
};

/**
 * 关键图片配置
 * 用于首屏关键图片的立即加载
 */
export const priorityImageConfig = {
  loading: 'eager' as const,
  decoding: 'sync' as const,
  priority: true,
};

/**
 * 图片格式检测
 * 检测浏览器支持的图片格式
 */
export function getSupportedImageFormat(): 'webp' | 'avif' | 'jpeg' {
  const canvas = document.createElement('canvas');

  // Check AVIF support
  if (canvas.toDataURL('image/avif').indexOf('data:image/avif') === 0) {
    return 'avif';
  }

  // Check WebP support
  if (canvas.toDataURL('image/webp').indexOf('data:image/webp') === 0) {
    return 'webp';
  }

  // Fallback to JPEG
  return 'jpeg';
}

/**
 * 优化后的 Next.js Image 组件配置
 */
export function getOptimizedImageProps(
  src: string,
  width: number,
  height: number,
  options: ImageOptimizationOptions = {}
): React.ComponentProps<typeof Image> {
  const opts = { ...defaultImageOptions, ...options };

  return {
    src,
    width,
    height,
    quality: opts.quality,
    priority: opts.priority,
    placeholder: opts.placeholder,
    blurDataURL: opts.blurDataURL,
    sizes: opts.sizes || calculateResponsiveSizes(width),
    ...(!opts.priority && lazyImageConfig),
  };
}

/**
 * 图片压缩配置
 */
export const imageCompressionConfig = {
  maxSizeMB: 0.5,
  maxWidthOrHeight: 1920,
  useWebWorker: true,
};

/**
 * 预加载图片
 * 在页面加载后预加载即将显示的图片
 */
export function preloadImage(src: string): void {
  if (typeof window === 'undefined') return;

  const link = document.createElement('link');
  link.rel = 'preload';
  link.as = 'image';
  link.href = src;

  // 只有现代浏览器支持 imagesrcset
  if (link.as === 'image' && 'imagesrcset' in link) {
    // 预加载多种尺寸
    const sizes = [640, 768, 1024, 1280];
    const srcset = generateSrcSet(src, sizes);
    (link as any).imagesrcset = srcset;
    (link as any).imagesizes = calculateResponsiveSizes(1280, sizes);
  }

  document.head.appendChild(link);
}

/**
 * 批量预加载图片
 */
export function preloadImages(srcs: string[]): void {
  if (typeof window === 'undefined' || 'requestIdleCallback' in window) {
    (window as any).requestIdleCallback(() => {
      srcs.forEach(preloadImage);
    });
  } else {
    setTimeout(() => {
      srcs.forEach(preloadImage);
    }, 1000);
  }
}

/**
 * 监控图片加载性能
 */
export function trackImagePerformance(src: string): void {
  if (typeof window === 'undefined' || !('PerformanceObserver' in window)) {
    return;
  }

  const observer = new PerformanceObserver((list) => {
    for (const entry of list.getEntries()) {
      if (entry.name.includes(src)) {
        const perfEntry = entry as PerformanceResourceTiming;

        console.info(`Image ${src} loaded in ${perfEntry.duration}ms`);

        // 计算加载时间指标
        const metrics = {
          dnsLookup: perfEntry.domainLookupEnd - perfEntry.domainLookupStart,
          tcpConnection: perfEntry.connectEnd - perfEntry.connectStart,
          requestTime: perfEntry.responseStart - perfEntry.requestStart,
          responseTime: perfEntry.responseEnd - perfEntry.responseStart,
          totalTime: perfEntry.duration,
        };

        // 发送到分析服务
        if (window.gtag) {
          window.gtag('event', 'image_loaded', {
            image_url: src,
            load_time: perfEntry.duration,
            ...metrics,
          });
        }
      }
    }
  });

  observer.observe({ entryTypes: ['resource'] });
}

/**
 * 创建响应式图片源
 * 根据设备像素比提供不同质量的图片
 */
export function createResponsiveSrc(
  baseUrl: string,
  dpr: number = 1
): string {
  const quality = dpr > 1 ? 90 : 75;
  return `${baseUrl}?dpr=${dpr}&q=${quality}`;
}

/**
 * 图片加载错误处理
 */
export function handleImageError(
  event: React.SyntheticEvent<HTMLImageElement>,
  fallbackSrc?: string
): void {
  const img = event.currentTarget;

  if (fallbackSrc && img.src !== fallbackSrc) {
    img.src = fallbackSrc;
  } else {
    // 显示占位符
    img.style.display = 'none';
    const placeholder = img.nextElementSibling as HTMLElement;
    if (placeholder && placeholder.classList.contains('image-placeholder')) {
      placeholder.style.display = 'block';
    }
  }
}
