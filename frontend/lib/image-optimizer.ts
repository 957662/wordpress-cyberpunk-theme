/**
 * 图片优化工具库
 */

export interface ImageOptimizationOptions {
  quality?: number;
  width?: number;
  height?: number;
  format?: 'webp' | 'jpeg' | 'png' | 'avif';
  enableProgressive?: boolean;
}

/**
 * 生成优化的图片 URL
 */
export function getOptimizedImageUrl(
  src: string,
  options: ImageOptimizationOptions = {}
): string {
  const { quality = 80, width, height, format = 'webp' } = options;

  // 如果是外部 URL，直接返回
  if (src.startsWith('http://') || src.startsWith('https://')) {
    return src;
  }

  // 构建查询参数
  const params = new URLSearchParams();
  if (quality) params.append('q', quality.toString());
  if (width) params.append('w', width.toString());
  if (height) params.append('h', height.toString());
  if (format) params.append('f', format);

  const queryString = params.toString();
  return queryString ? `${src}?${queryString}` : src;
}

/**
 * 生成响应式图片 srcset
 */
export function generateSrcSet(
  src: string,
  sizes: number[],
  format: ImageOptimizationOptions['format'] = 'webp'
): string {
  return sizes
    .map(size => `${getOptimizedImageUrl(src, { width: size, format })} ${size}w`)
    .join(', ');
}

/**
 * 生成响应式图片 sizes 属性
 */
export function generateSizes(breakpoints: Record<string, string>): string {
  return Object.entries(breakpoints)
    .map(([breakpoint, size]) => `(min-width: ${breakpoint}) ${size}`)
    .reverse()
    .join(', ');
}

/**
 * 预加载图片
 */
export function preloadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.src = src;
    img.onload = () => resolve(img);
    img.onerror = reject;
  });
}

/**
 * 批量预加载图片
 */
export async function preloadImages(
  srcs: string[],
  concurrency: number = 3
): Promise<HTMLImageElement[]> {
  const results: HTMLImageElement[] = [];
  const queue = [...srcs];

  const loadNext = async (): Promise<void> => {
    if (queue.length === 0) return;
    const src = queue.shift()!;
    try {
      const img = await preloadImage(src);
      results.push(img);
    } catch (error) {
      console.error(`Failed to preload image: ${src}`, error);
    }
  };

  const workers = Array.from({ length: Math.min(concurrency, srcs.length) }, () =>
    loadNext()
  );

  await Promise.all(workers);
  return results;
}

/**
 * 图片压缩（使用 Canvas）
 */
export function compressImage(
  file: File,
  options: ImageOptimizationOptions = {}
): Promise<Blob> {
  return new Promise((resolve, reject) => {
    const { quality = 0.8, width, height, format = 'jpeg' } = options;

    const img = new Image();
    const reader = new FileReader();

    reader.onload = (e) => {
      img.src = e.target?.result as string;
    };

    img.onload = () => {
      const canvas = document.createElement('canvas');
      let targetWidth = width || img.width;
      let targetHeight = height || img.height;

      // 保持宽高比
      if (width && !height) {
        targetHeight = (img.height * width) / img.width;
      } else if (height && !width) {
        targetWidth = (img.width * height) / img.height;
      }

      canvas.width = targetWidth;
      canvas.height = targetHeight;

      const ctx = canvas.getContext('2d');
      if (!ctx) {
        reject(new Error('Failed to get canvas context'));
        return;
      }

      ctx.drawImage(img, 0, 0, targetWidth, targetHeight);

      const mimeType = format === 'png' ? 'image/png' : 'image/jpeg';
      canvas.toBlob(
        (blob) => {
          if (blob) {
            resolve(blob);
          } else {
            reject(new Error('Failed to compress image'));
          }
        },
        mimeType,
        quality
      );
    };

    img.onerror = reject;
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

/**
 * 获取图片尺寸
 */
export function getImageDimensions(file: File): Promise<{ width: number; height: number }> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const reader = new FileReader();

    reader.onload = (e) => {
      img.src = e.target?.result as string;
    };

    img.onload = () => {
      resolve({ width: img.width, height: img.height });
    };

    img.onerror = reject;
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

/**
 * 生成占位符图片（base64）
 */
export function generatePlaceholder(
  width: number,
  height: number,
  color: string = '#e5e7eb'
): string {
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;

  const ctx = canvas.getContext('2d');
  if (!ctx) return '';

  ctx.fillStyle = color;
  ctx.fillRect(0, 0, width, height);

  return canvas.toDataURL('image/jpeg', 0.1);
}

/**
 * 检测图片格式支持
 */
export function detectImageSupport(): {
  webp: boolean;
  avif: boolean;
} {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');

  const webp = canvas.toDataURL('image/webp').indexOf('data:image/webp') === 0;
  const avif = canvas.toDataURL('image/avif').indexOf('data:image/avif') === 0;

  return { webp, avif };
}

/**
 * 获取最佳图片格式
 */
export function getBestFormat(): 'avif' | 'webp' | 'jpeg' {
  const support = detectImageSupport();
  if (support.avif) return 'avif';
  if (support.webp) return 'webp';
  return 'jpeg';
}
