/**
 * 图片优化工具
 */

interface ImageOptimizationOptions {
  quality?: number;
  width?: number;
  height?: number;
  format?: 'webp' | 'avif' | 'jpeg' | 'png';
}

/**
 * 生成响应式图片 URL
 */
export function generateResponsiveImageUrl(
  baseUrl: string,
  options: ImageOptimizationOptions = {}
): string {
  const {
    quality = 80,
    width,
    height,
    format = 'webp',
  } = options;

  const url = new URL(baseUrl, typeof window !== 'undefined' ? window.location.origin : '');

  if (quality) url.searchParams.set('q', quality.toString());
  if (width) url.searchParams.set('w', width.toString());
  if (height) url.searchParams.set('h', height.toString());
  url.searchParams.set('f', format);

  return url.toString();
}

/**
 * 生成 srcset 属性值
 */
export function generateSrcSet(
  baseUrl: string,
  sizes: number[],
  options?: ImageOptimizationOptions
): string {
  return sizes
    .map(size => {
      const url = generateResponsiveImageUrl(baseUrl, { ...options, width: size });
      return `${url} ${size}w`;
    })
    .join(', ');
}

/**
 * 生成 sizes 属性值
 */
export function generateSizes(breakpoints: Record<string, number>): string {
  return Object.entries(breakpoints)
    .map(([breakpoint, size]) => `(min-width: ${breakpoint}) ${size}px`)
    .concat('100vw')
    .join(', ');
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
 * 懒加载图片
 */
export function lazyLoadImage(
  imgElement: HTMLImageElement,
  src: string
): void {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          imgElement.src = src;
          observer.unobserve(imgElement);
        }
      });
    },
    { rootMargin: '50px' }
  );

  observer.observe(imgElement);
}

/**
 * 计算最优图片尺寸
 */
export function calculateOptimalSize(
  containerWidth: number,
  devicePixelRatio: number = 1
): number {
  const maxSize = 2560; // 最大尺寸
  const optimalSize = Math.ceil(containerWidth * devicePixelRatio);
  return Math.min(optimalSize, maxSize);
}

/**
 * 检查 WebP 支持
 */
export function supportsWebP(): Promise<boolean> {
  if (typeof document === 'undefined') return Promise.resolve(false);

  return new Promise((resolve) => {
    const webP = new Image();
    webP.onload = webP.onerror = () => {
      resolve(webP.height === 2);
    };
    webP.src = 'data:image/webp;base64,UklGRjoAAABXRUJQVlA4IC4AAACyAgCdASoCAAIALmk0mk0iIiIiIgBoSygABc6WWgAA/veff/0PP8bA//LwYAAA';
  });
}

/**
 * 检查 AVIF 支持
 */
export function supportsAVIF(): Promise<boolean> {
  if (typeof document === 'undefined') return Promise.resolve(false);

  return new Promise((resolve) => {
    const avif = new Image();
    avif.onload = avif.onerror = () => {
      resolve(avif.height === 2);
    };
    avif.src = 'data:image/avif;base64,AAAAIGZ0eXBhdmlmAAAAAGF2aWZtaWYxbWlhZk1BMUIAAADybWV0YQAAAAAAAAAoaGRscgAAAAAAAAAAcGljdAAAAAAAAAAAAAAAAGxpYmF2aWYAAAAADnBpdG0AAAAAAAEAAAAeaWxvYwAAAABEAAABAAEAAAABAAABGgAAAB0AAAAoaWluZgAAAAAAAQAAABppbmZlAgAAAAABAABhdjAxQ29sb3IAAAAAamlwcnAAAABLaXBjbwAAABRpc3BlAAAAAAAAAAIAAAACAAAAEHBpeGkAAAAAAwgICAAAAAxhdjFDgQ0MAAAAABNjb2xybmNseAACAAIAAYAAAAAXaXBtYQAAAAAAAAABAAEEAQKDBAAAACVtZGF0EgAKCBgANogQEAwgMg8f8D///8WfhwB8+ErK42A=';
  });
}

/**
 * 获取最佳图片格式
 */
export async function getBestImageFormat(): Promise<'avif' | 'webp' | 'jpeg'> {
  if (await supportsAVIF()) return 'avif';
  if (await supportsWebP()) return 'webp';
  return 'jpeg';
}

export default {
  generateResponsiveImageUrl,
  generateSrcSet,
  generateSizes,
  preloadImage,
  lazyLoadImage,
  calculateOptimalSize,
  supportsWebP,
  supportsAVIF,
  getBestImageFormat,
};
