export function getImageUrl(image: string | { url: string } | { src: string } | null | undefined): string {
  if (!image) return '';
  if (typeof image === 'string') return image;
  if ('url' in image) return image.url;
  if ('src' in image) return image.src;
  return '';
}

export function getResponsiveImageUrl(baseUrl: string, size: 'thumbnail' | 'medium' | 'large' | 'full' = 'medium'): string {
  const sizes = { thumbnail: '-150x150', medium: '-300x200', large: '-1024x683', full: '' };
  const url = new URL(baseUrl);
  const pathname = url.pathname;
  const lastDotIndex = pathname.lastIndexOf('.');
  if (lastDotIndex === -1) return baseUrl;
  const ext = pathname.substring(lastDotIndex);
  const baseName = pathname.substring(0, lastDotIndex);
  const newSize = sizes[size];
  url.pathname = `${baseName}${newSize}${ext}`;
  return url.toString();
}

export function getPlaceholderImage(width = 400, height = 300, color = '#00f0ff'): string {
  const svg = `<svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg"><rect width="100%" height="100%" fill="${color}"/><text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" font-family="sans-serif" font-size="24" fill="white">${width}x${height}</text></svg>`;
  return `data:image/svg+xml;base64,${btoa(svg)}`;
}

export function preloadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = src;
  });
}

export async function preloadImages(srcs: string[]): Promise<HTMLImageElement[]> {
  const promises = srcs.map((src) => preloadImage(src));
  return Promise.all(promises);
}

export function calculateAspectRatio(width: number, height: number): number {
  return width / height;
}

export function calculateHeight(width: number, aspectRatio: number): number {
  return Math.round(width / aspectRatio);
}

export function calculateWidth(height: number, aspectRatio: number): number {
  return Math.round(height * aspectRatio);
}

export function generateSrcSet(baseUrl: string, sizes: number[]): string {
  return sizes.map((size) => {
    const url = new URL(baseUrl);
    url.searchParams.set('w', size.toString());
    return `${url.toString()} ${size}w`;
  }).join(', ');
}

export function generateSizes(breakpoints: { width: number; size: string }[]): string {
  return breakpoints.map((bp) => `(max-width: ${bp.width}px) ${bp.size}`).join(', ');
}

export interface ImageOptimization {
  quality?: number;
  width?: number;
  height?: number;
  format?: 'webp' | 'jpeg' | 'png';
}

export function optimizeImageUrl(baseUrl: string, options: ImageOptimization = {}): string {
  const url = new URL(baseUrl);
  const { quality = 80, width, height, format = 'webp' } = options;
  if (quality) url.searchParams.set('q', quality.toString());
  if (width) url.searchParams.set('w', width.toString());
  if (height) url.searchParams.set('h', height.toString());
  url.searchParams.set('f', format);
  return url.toString();
}
