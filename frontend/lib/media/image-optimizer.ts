/**
 * 图片优化工具
 * 用于优化图片加载、处理和显示
 */

export interface ImageOptions {
  /** 图片宽度 */
  width?: number;
  /** 图片高度 */
  height?: number;
  /** 图片质量 (1-100) */
  quality?: number;
  /** 图片格式 */
  format?: 'webp' | 'avif' | 'jpeg' | 'png' | 'auto';
  /** 是否启用懒加载 */
  lazy?: boolean;
  /** 占位符颜色 */
  placeholder?: string;
  /** 响应式断点 */
  srcSet?: number[];
}

export interface OptimizedImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src: string;
  alt: string;
  options?: ImageOptions;
}

/**
 * 生成优化后的图片 URL
 */
export function getOptimizedImageUrl(
  src: string,
  options: ImageOptions = {}
): string {
  const { width, height, quality = 85, format = 'auto' } = options;

  // 如果是外部图片，直接返回
  if (src.startsWith('http://') || src.startsWith('https://')) {
    if (src.includes('unsplash.com') || src.includes('images.unsplash.com')) {
      // Unsplash 图片优化
      const params = new URLSearchParams();
      if (width) params.append('w', width.toString());
      if (height) params.append('h', height.toString());
      params.append('q', quality.toString());
      params.append('fm', format === 'auto' ? 'webp' : format);
      return `${src}?${params.toString()}`;
    }
    return src;
  }

  // 本地图片使用 Next.js Image Optimization
  const params = new URLSearchParams();
  if (width) params.append('w', width.toString());
  if (height) params.append('h', height.toString());
  if (quality) params.append('q', quality.toString());

  return `/api/image-optimizer?src=${encodeURIComponent(src)}&${params.toString()}`;
}

/**
 * 生成响应式图片 srcset
 */
export function generateSrcSet(
  src: string,
  sizes: number[] = [320, 640, 768, 1024, 1280, 1536],
  options: Omit<ImageOptions, 'srcSet'> = {}
): string {
  return sizes.map((size) => `${getOptimizedImageUrl(src, { ...options, width: size })} ${size}w`).join(', ');
}

/**
 * 生成 sizes 属性
 */
export function generateSizes(breakpoints: Record<string, string>): string {
  return Object.entries(breakpoints)
    .map(([breakpoint, size]) => `(min-width: ${breakpoint}) ${size}`)
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
 * 批量预加载图片
 */
export async function preloadImages(srcs: string[]): Promise<HTMLImageElement[]> {
  const promises = srcs.map((src) => preloadImage(src));
  return Promise.all(promises);
}

/**
 * 获取图片主色调
 */
export async function getImageDominantColor(src: string): Promise<string> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'Anonymous';

    img.onload = () => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');

      if (!ctx) {
        reject(new Error('Failed to get canvas context'));
        return;
      }

      canvas.width = 1;
      canvas.height = 1;

      ctx.drawImage(img, 0, 0, 1, 1);
      const [r, g, b] = ctx.getImageData(0, 0, 1, 1).data;

      resolve(`rgb(${r}, ${g}, ${b})`);
    };

    img.onerror = reject;
    img.src = src;
  });
}

/**
 * 生成模糊占位符
 */
export async function generateBlurPlaceholder(src: string, size: number = 10): Promise<string> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'Anonymous';

    img.onload = () => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');

      if (!ctx) {
        reject(new Error('Failed to get canvas context'));
        return;
      }

      canvas.width = size;
      canvas.height = size;

      // 绘制缩小的图片
      ctx.drawImage(img, 0, 0, size, size);

      // 应用模糊效果
      ctx.filter = 'blur(2px)';
      ctx.drawImage(canvas, 0, 0);

      // 获取 base64
      const dataUrl = canvas.toDataURL('image/jpeg', 0.5);
      resolve(dataUrl);
    };

    img.onerror = reject;
    img.src = src;
  });
}

/**
 * 计算图片的宽高比
 */
export function getImageAspectRatio(width: number, height: number): number {
  return width / height;
}

/**
 * 根据宽高比计算高度
 */
export function calculateHeight(width: number, aspectRatio: number): number {
  return Math.round(width / aspectRatio);
}

/**
 * 图片格式检测
 */
export function detectImageFormat(src: string): string | null {
  const extension = src.split('.').pop()?.toLowerCase();
  const formatMap: Record<string, string> = {
    jpg: 'jpeg',
    jpeg: 'jpeg',
    png: 'png',
    webp: 'webp',
    avif: 'avif',
    gif: 'gif',
    svg: 'svg+xml',
  };

  return formatMap[extension || ''] || null;
}

/**
 * 检查浏览器是否支持某种图片格式
 */
export function supportsImageFormat(format: 'webp' | 'avif'): Promise<boolean> {
  return new Promise((resolve) => {
    const canvas = document.createElement('canvas');

    if (canvas.getContext && canvas.getContext('2d')) {
      const supports = canvas.toDataURL(`image/${format}`).indexOf(`data:image/${format}`) === 0;
      resolve(supports);
    } else {
      resolve(false);
    }
  });
}

/**
 * 优化后的图片组件
 */
export function OptimizedImage({ src, alt, options = {}, ...props }: OptimizedImageProps) {
  const [imageSrc, setImageSrc] = React.useState<string>('');
  const [isLoading, setIsLoading] = React.useState(true);
  const [blurDataUrl, setBlurDataUrl] = React.useState<string>('');
  const imgRef = React.useRef<HTMLImageElement>(null);

  React.useEffect(() => {
    let isMounted = true;

    const loadImage = async () => {
      try {
        // 生成模糊占位符
        if (!options.placeholder) {
          const blurUrl = await generateBlurPlaceholder(src);
          if (isMounted) {
            setBlurDataUrl(blurUrl);
          }
        }

        // 预加载优化后的图片
        const optimizedSrc = getOptimizedImageUrl(src, options);
        await preloadImage(optimizedSrc);

        if (isMounted) {
          setImageSrc(optimizedSrc);
          setIsLoading(false);
        }
      } catch (error) {
        console.error('Failed to load image:', error);
        if (isMounted) {
          setImageSrc(src);
          setIsLoading(false);
        }
      }
    };

    loadImage();

    return () => {
      isMounted = false;
    };
  }, [src, options]);

  const srcSet = options.srcSet ? generateSrcSet(src, options.srcSet, options) : undefined;

  return (
    <div className="relative overflow-hidden">
      {/* 模糊占位符 */}
      {isLoading && blurDataUrl && (
        <div
          className="absolute inset-0 bg-cover bg-center blur-sm"
          style={{ backgroundImage: `url(${blurDataUrl})` }}
        />
      )}

      {/* 实际图片 */}
      <img
        ref={imgRef}
        src={imageSrc || src}
        alt={alt}
        srcSet={srcSet}
        loading={options.lazy ? 'lazy' : 'eager'}
        className={`transition-opacity duration-300 ${isLoading ? 'opacity-0' : 'opacity-100'}`}
        {...props}
      />

      {/* 加载指示器 */}
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-cyan-500" />
        </div>
      )}
    </div>
  );
}

/**
 * 响应式图片组件
 */
export function ResponsiveImage({
  src,
  alt,
  options = {},
  ...props
}: OptimizedImageProps) {
  const defaultSrcSet = [320, 640, 768, 1024, 1280, 1536];
  const srcSet = options.srcSet || defaultSrcSet;

  const sizes = {
    '640px': '100vw',
    '768px': '50vw',
    '1024px': '33.33vw',
    '1280px': '25vw',
  };

  return (
    <img
      src={getOptimizedImageUrl(src, options)}
      alt={alt}
      srcSet={generateSrcSet(src, srcSet, options)}
      sizes={generateSizes(sizes)}
      loading={options.lazy ? 'lazy' : 'eager'}
      {...props}
    />
  );
}

/**
 * 图片画廊优化工具
 */
export class ImageGalleryOptimizer {
  private loadedImages = new Set<string>();
  private blurCache = new Map<string, string>();

  /**
   * 预加载画廊图片
   */
  async preloadGallery(images: string[], startIndex = 0, count = 5): Promise<void> {
    const imagesToLoad = images.slice(startIndex, startIndex + count);

    for (const src of imagesToLoad) {
      if (!this.loadedImages.has(src)) {
        try {
          await preloadImage(src);
          this.loadedImages.add(src);
        } catch (error) {
          console.warn(`Failed to preload gallery image: ${src}`, error);
        }
      }
    }
  }

  /**
   * 获取或生成模糊占位符
   */
  async getBlurPlaceholder(src: string): Promise<string> {
    if (this.blurCache.has(src)) {
      return this.blurCache.get(src)!;
    }

    const blurUrl = await generateBlurPlaceholder(src);
    this.blurCache.set(src, blurUrl);
    return blurUrl;
  }

  /**
   * 清除缓存
   */
  clearCache(): void {
    this.loadedImages.clear();
    this.blurCache.clear();
  }
}

/**
 * 图片压缩工具
 */
export async function compressImage(
  file: File,
  options: {
    maxWidth?: number;
    maxHeight?: number;
    quality?: number;
    format?: 'jpeg' | 'png' | 'webp';
  } = {}
): Promise<Blob> {
  const { maxWidth = 1920, maxHeight = 1080, quality = 0.85, format = 'jpeg' } = options;

  return new Promise((resolve, reject) => {
    const img = new Image();

    img.onload = () => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');

      if (!ctx) {
        reject(new Error('Failed to get canvas context'));
        return;
      }

      // 计算新尺寸
      let width = img.width;
      let height = img.height;

      if (width > maxWidth || height > maxHeight) {
        const ratio = Math.min(maxWidth / width, maxHeight / height);
        width *= ratio;
        height *= ratio;
      }

      canvas.width = width;
      canvas.height = height;

      // 绘制并压缩
      ctx.drawImage(img, 0, 0, width, height);

      canvas.toBlob(
        (blob) => {
          if (blob) {
            resolve(blob);
          } else {
            reject(new Error('Failed to compress image'));
          }
        },
        `image/${format}`,
        quality
      );
    };

    img.onerror = reject;
    img.src = URL.createObjectURL(file);
  });
}

/**
 * 获取图片信息
 */
export async function getImageInfo(file: File): Promise<{
  width: number;
  height: number;
  size: number;
  type: string;
}> {
  return new Promise((resolve, reject) => {
    const img = new Image();

    img.onload = () => {
      resolve({
        width: img.width,
        height: img.height,
        size: file.size,
        type: file.type,
      });
    };

    img.onerror = reject;
    img.src = URL.createObjectURL(file);
  });
}
