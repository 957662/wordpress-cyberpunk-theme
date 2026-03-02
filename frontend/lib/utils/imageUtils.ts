/**
 * 图片处理工具函数
 */

/**
 * 图片尺寸信息
 */
export interface ImageDimensions {
  width: number;
  height: number;
  aspectRatio: number;
}

/**
 * 图片优化选项
 */
export interface ImageOptimizationOptions {
  quality?: number;
  maxWidth?: number;
  maxHeight?: number;
  format?: 'webp' | 'jpeg' | 'png' | 'avif';
  enableProgressive?: boolean;
}

/**
 * 获取图片尺寸
 */
export async function getImageDimensions(
  src: string
): Promise<ImageDimensions | null> {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => {
      const dimensions: ImageDimensions = {
        width: img.naturalWidth,
        height: img.naturalHeight,
        aspectRatio: img.naturalWidth / img.naturalHeight,
      };
      resolve(dimensions);
    };
    img.onerror = () => resolve(null);
    img.src = src;
  });
}

/**
 * 生成响应式图片 URL
 */
export function generateResponsiveImageUrl(
  baseUrl: string,
  width: number,
  quality = 80
): string {
  // 如果是 Unsplash 图片
  if (baseUrl.includes('unsplash.com')) {
    return `${baseUrl}?w=${width}&q=${quality}&auto=format`;
  }

  // 如果是 Cloudinary 图片
  if (baseUrl.includes('cloudinary.com')) {
    return baseUrl.replace(
      '/upload/',
      `/upload/q_${quality},w_${width}/`
    );
  }

  // 如果是本地图片，添加查询参数
  const url = new URL(baseUrl, window.location.origin);
  url.searchParams.set('width', width.toString());
  url.searchParams.set('quality', quality.toString());
  return url.toString();
}

/**
 * 生成 srcset 属性
 */
export function generateSrcSet(
  baseUrl: string,
  sizes: number[] = [320, 640, 768, 1024, 1280, 1920],
  quality = 80
): string {
  return sizes
    .map((size) => `${generateResponsiveImageUrl(baseUrl, size, quality)} ${size}w`)
    .join(', ');
}

/**
 * 生成 sizes 属性
 */
export function generateSizes(
  breakpoints: { [key: string]: string } = {
    mobile: '100vw',
    tablet: '50vw',
    desktop: '33vw',
  }
): string {
  return Object.entries(breakpoints)
    .map(([breakpoint, size]) => {
      if (breakpoint === 'mobile') {
        return size;
      }
      return `(min-width: ${breakpointToPixels(breakpoint)}px) ${size}`;
    })
    .reverse()
    .join(', ');
}

/**
 * 将断点名称转换为像素值
 */
function breakpointToPixels(breakpoint: string): number {
  const breakpoints: { [key: string]: number } = {
    mobile: 0,
    tablet: 768,
    desktop: 1024,
    wide: 1280,
  };
  return breakpoints[breakpoint] || 0;
}

/**
 * 懒加载图片
 */
export function lazyLoadImage(
  imgElement: HTMLImageElement,
  callback?: () => void
): void {
  if ('loading' in HTMLImageElement.prototype) {
    imgElement.loading = 'lazy';
    if (callback) {
      imgElement.addEventListener('load', callback);
    }
  } else {
    // 降级到 Intersection Observer
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const img = entry.target as HTMLImageElement;
            if (img.dataset.src) {
              img.src = img.dataset.src;
              img.removeAttribute('data-src');
              observer.unobserve(img);
              if (callback) {
                img.addEventListener('load', callback);
              }
            }
          }
        });
      },
      { rootMargin: '50px' }
    );

    observer.observe(imgElement);
  }
}

/**
 * 预加载图片
 */
export function preloadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = src;
  });
}

/**
 * 批量预加载图片
 */
export async function preloadImages(
  urls: string[],
  concurrency = 3
): Promise<HTMLImageElement[]> {
  const results: HTMLImageElement[] = [];
  const queue = [...urls];

  const loadNext = async (): Promise<void> => {
    if (queue.length === 0) return;

    const url = queue.shift()!;
    try {
      const img = await preloadImage(url);
      results.push(img);
    } catch (error) {
      console.error(`Failed to preload image: ${url}`, error);
    }

    if (queue.length > 0) {
      await loadNext();
    }
  };

  const workers = Array.from({ length: Math.min(concurrency, urls.length) }, () =>
    loadNext()
  );

  await Promise.all(workers);
  return results;
}

/**
 * 获取图片主色调
 */
export async function getImageDominantColor(
  src: string
): Promise<string | null> {
  return new Promise((resolve) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';

    img.onload = () => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');

      if (!ctx) {
        resolve(null);
        return;
      }

      canvas.width = 1;
      canvas.height = 1;

      ctx.drawImage(img, 0, 0, 1, 1);
      const [r, g, b] = ctx.getImageData(0, 0, 1, 1).data;

      resolve(`rgb(${r}, ${g}, ${b})`);
    };

    img.onerror = () => resolve(null);
    img.src = src;
  });
}

/**
 * 生成模糊占位符
 */
export function generateBlurPlaceholder(
  src: string,
  width = 10,
  height = 10
): Promise<string | null> {
  return new Promise((resolve) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';

    img.onload = () => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');

      if (!ctx) {
        resolve(null);
        return;
      }

      canvas.width = width;
      canvas.height = height;

      // 缩小图片
      ctx.drawImage(img, 0, 0, width, height);

      // 应用模糊
      ctx.filter = 'blur(2px)';
      ctx.drawImage(canvas, 0, 0);

      // 获取 Data URL
      const dataUrl = canvas.toDataURL('image/jpeg', 0.1);
      resolve(dataUrl);
    };

    img.onerror = () => resolve(null);
    img.src = src;
  });
}

/**
 * 检查图片格式支持
 */
export async function supportsImageFormat(format: 'webp' | 'avif'): Promise<boolean> {
  if (typeof document === 'undefined') return false;

  const canvas = document.createElement('canvas');
  const mimeType = format === 'webp' ? 'image/webp' : 'image/avif';

  return canvas.toDataURL(mimeType).indexOf(`data:${mimeType}`) === 0;
}

/**
 * 选择最佳图片格式
 */
export async function selectBestImageFormat(): Promise<'webp' | 'avif' | 'jpeg'> {
  if (await supportsImageFormat('avif')) {
    return 'avif';
  }
  if (await supportsImageFormat('webp')) {
    return 'webp';
  }
  return 'jpeg';
}

/**
 * 计算最优图片尺寸
 */
export function calculateOptimalSize(
  containerWidth: number,
  devicePixelRatio = window.devicePixelRatio || 1
): number {
  // 向上取整到最近的 100 像素
  return Math.ceil((containerWidth * devicePixelRatio) / 100) * 100;
}

/**
 * 生成图片占位符配置
 */
export function createImagePlaceholder(
  width: number,
  height: number,
  color = '#e0e0e0'
): string {
  const svg = `
    <svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
      <rect width="100%" height="100%" fill="${color}"/>
    </svg>
  `;

  return `data:image/svg+xml;base64,${btoa(svg)}`;
}

/**
 * 图片压缩配置
 */
export const imageCompressionConfig = {
  quality: 0.85,
  maxWidth: 1920,
  maxHeight: 1080,
  formats: ['avif', 'webp', 'jpeg'] as const,
};
