/**
 * Image Utilities
 * 图片处理工具函数
 */

/**
 * 获取图片占位符 URL
 */
export function getPlaceholderUrl(width: number = 800, height: number = 600, text?: string): string {
  const baseUrl = 'https://via.placeholder.com';
  const query = new URLSearchParams({
    width: width.toString(),
    height: height.toString(),
  });

  if (text) {
    query.set('text', text);
  }

  return `${baseUrl}/${width}x${height}${text ? `/${encodeURIComponent(text)}` : ''}`;
}

/**
 * 获取 Unsplash 随机图片
 */
export function getUnsplashUrl(
  keywords: string,
  width: number = 1920,
  height: number = 1080
): string {
  return `https://source.unsplash.com/${width}x${height}/?${encodeURIComponent(keywords)}`;
}

/**
 * 检查图片是否为 WebP 格式
 */
export function isWebP(url: string): boolean {
  return url.toLowerCase().includes('.webp');
}

/**
 * 检查图片是否为 SVG
 */
export function isSVG(url: string): boolean {
  return url.toLowerCase().includes('.svg') || url.includes('data:image/svg');
}

/**
 * 获取图片扩展名
 */
export function getImageExtension(url: string): string {
  const match = url.match(/\.([^.?#]+)(?:[?#]|$)/);
  return match ? match[1].toLowerCase() : '';
}

/**
 * 优化图片 URL
 * 添加缓存破坏参数
 */
export function optimizeImageUrl(url: string, width?: number, height?: number): string {
  try {
    const urlObj = new URL(url);

    if (width) {
      urlObj.searchParams.set('w', width.toString());
    }

    if (height) {
      urlObj.searchParams.set('h', height.toString());
    }

    urlObj.searchParams.set('q', '80'); // 质量
    urlObj.searchParams.set('auto', 'format'); // 自动格式

    return urlObj.toString();
  } catch {
    return url;
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
export async function preloadImages(srcs: string[]): Promise<HTMLImageElement[]> {
  const promises = srcs.map((src) => preloadImage(src).catch(() => null));
  const results = await Promise.all(promises);
  return results.filter((img): img is HTMLImageElement => img !== null);
}

/**
 * 计算图片宽高比
 */
export function calculateAspectRatio(width: number, height: number): number {
  return width / height;
}

/**
 * 根据宽高比计算高度
 */
export function calculateHeight(width: number, aspectRatio: number): number {
  return width / aspectRatio;
}

/**
 * 根据宽高比计算宽度
 */
export function calculateWidth(height: number, aspectRatio: number): number {
  return height * aspectRatio;
}

/**
 * 获取响应式图片 srcset
 */
export function getSrcset(
  baseUrl: string,
  sizes: number[] = [320, 640, 768, 1024, 1280, 1920]
): string {
  return sizes
    .map((size) => `${optimizeImageUrl(baseUrl, size)} ${size}w`)
    .join(', ');
}

/**
 * 获取图片尺寸
 */
export function getImageDimensions(file: File): Promise<{ width: number; height: number }> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      resolve({ width: img.width, height: img.height });
    };
    img.onerror = reject;
    img.src = URL.createObjectURL(file);
  });
}

/**
 * 调整图片尺寸
 */
export function resizeImage(
  file: File,
  maxWidth: number,
  maxHeight: number,
  quality: number = 0.8
): Promise<Blob> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement('canvas');
      let { width, height } = img;

      // 计算新尺寸
      if (width > height) {
        if (width > maxWidth) {
          height = (height * maxWidth) / width;
          width = maxWidth;
        }
      } else {
        if (height > maxHeight) {
          width = (width * maxHeight) / height;
          height = maxHeight;
        }
      }

      canvas.width = width;
      canvas.height = height;

      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(img, 0, 0, width, height);
        canvas.toBlob(
          (blob) => {
            if (blob) {
              resolve(blob);
            } else {
              reject(new Error('Failed to resize image'));
            }
          },
          'image/jpeg',
          quality
        );
      }
    };
    img.onerror = reject;
    img.src = URL.createObjectURL(file);
  });
}

/**
 * 生成渐变色图片数据URL
 */
export function generateGradientImage(
  width: number = 400,
  height: number = 300,
  colors: string[] = ['#00f0ff', '#9d00ff']
): string {
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;

  const ctx = canvas.getContext('2d');
  if (ctx) {
    const gradient = ctx.createLinearGradient(0, 0, width, height);
    colors.forEach((color, index) => {
      gradient.addColorStop(index / (colors.length - 1), color);
    });

    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, width, height);
  }

  return canvas.toDataURL('image/png');
}

/**
 * 图片转 Base64
 */
export function imageToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

/**
 * Base64 转 Blob
 */
export function base64ToBlob(base64: string, type: string = 'image/png'): Blob {
  const byteCharacters = atob(base64.split(',')[1]);
  const byteArrays = [];

  for (let offset = 0; offset < byteCharacters.length; offset += 512) {
    const slice = byteCharacters.slice(offset, offset + 512);
    const byteNumbers = new Array(slice.length);
    for (let i = 0; i < slice.length; i++) {
      byteNumbers[i] = slice.charCodeAt(i);
    }
    const byteArray = new Uint8Array(byteNumbers);
    byteArrays.push(byteArray);
  }

  return new Blob(byteArrays, { type });
}

/**
 * 验证图片文件类型
 */
export function isValidImageType(file: File): boolean {
  const validTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/svg+xml'];
  return validTypes.includes(file.type);
}

/**
 * 验证图片文件大小
 */
export function isValidImageSize(file: File, maxSizeMB: number = 5): boolean {
  const maxSizeBytes = maxSizeMB * 1024 * 1024;
  return file.size <= maxSizeBytes;
}

/**
 * 生成图片占位色
 */
export function generateImagePlaceholder(
  width: number = 1,
  height: number = 1,
  color: string = '#cccccc'
): string {
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;

  const ctx = canvas.getContext('2d');
  if (ctx) {
    ctx.fillStyle = color;
    ctx.fillRect(0, 0, width, height);
  }

  return canvas.toDataURL();
}

/**
 * 获取图片主题色（简化版）
 */
export async function getImageDominantColor(imageUrl: string): Promise<string> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');

      if (!ctx) {
        resolve('#000000');
        return;
      }

      canvas.width = 1;
      canvas.height = 1;
      ctx.drawImage(img, 0, 0, 1, 1);

      const [r, g, b] = ctx.getImageData(0, 0, 1, 1).data;
      resolve(`rgb(${r}, ${g}, ${b})`);
    };
    img.onerror = () => resolve('#000000');
    img.src = imageUrl;
  });
}
