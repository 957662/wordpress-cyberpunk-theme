/**
 * URL Helper Functions
 *
 * Utility functions for URL manipulation and validation.
 */

/**
 * Check if a URL is valid
 */
export function isValidUrl(url: string): boolean {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}

/**
 * Get URL query parameters as an object
 */
export function getQueryParams(url: string = window.location.href): Record<string, string> {
  const queryParams: Record<string, string> = {};
  const urlObj = new URL(url);

  urlObj.searchParams.forEach((value, key) => {
    queryParams[key] = value;
  });

  return queryParams;
}

/**
 * Build URL with query parameters
 */
export function buildUrl(
  baseUrl: string,
  params: Record<string, string | number | boolean | undefined>
): string {
  const url = new URL(baseUrl);

  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined) {
      url.searchParams.set(key, String(value));
    }
  });

  return url.toString();
}

/**
 * Remove query parameters from URL
 */
export function removeQueryParams(url: string, keys: string[]): string {
  const urlObj = new URL(url);

  keys.forEach((key) => {
    urlObj.searchParams.delete(key);
  });

  return urlObj.toString();
}

/**
 * Get domain from URL
 */
export function getDomain(url: string): string | null {
  try {
    const urlObj = new URL(url);
    return urlObj.hostname;
  } catch {
    return null;
  }
}

/**
 * Check if URL is external
 */
export function isExternalUrl(url: string, baseDomain: string = window.location.hostname): boolean {
  const domain = getDomain(url);
  return domain !== null && domain !== baseDomain;
}

/**
 * Add protocol to URL if missing
 */
export function ensureProtocol(url: string, protocol: 'http:' | 'https:' = 'https:'): string {
  if (!url.match(/^https?:\/\//)) {
    return `${protocol}//${url}`;
  }
  return url;
}

/**
 * Remove trailing slash from URL
 */
export function removeTrailingSlash(url: string): string {
  return url.replace(/\/$/, '') || '/';
}

/**
 * Add trailing slash to URL
 */
export function addTrailingSlash(url: string): string {
  return url.endsWith('/') ? url : `${url}/`;
}

/**
 * Get URL path segments
 */
export function getPathSegments(url: string = window.location.href): string[] {
  try {
    const urlObj = new URL(url);
    return urlObj.pathname.split('/').filter(Boolean);
  } catch {
    return [];
  }
}

/**
 * Check if URL matches pattern (supports wildcards)
 */
export function matchUrlPattern(url: string, pattern: string): boolean {
  const patternRegex = new RegExp(
    '^' + pattern.replace(/\*/g, '.*').replace(/\?/g, '.') + '$'
  );
  return patternRegex.test(url);
}

/**
 * Clean UTM parameters from URL
 */
export function removeUtmParams(url: string): string {
  const utmParams = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content'];
  return removeQueryParams(url, utmParams);
}

/**
 * Get file extension from URL
 */
export function getFileExtension(url: string): string | null {
  try {
    const urlObj = new URL(url);
    const path = urlObj.pathname;
    const match = path.match(/\.([^.]+)$/);
    return match ? match[1] : null;
  } catch {
    return null;
  }
}

/**
 * Check if URL is an image
 */
export function isImageUrl(url: string): boolean {
  const ext = getFileExtension(url);
  const imageExtensions = ['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg', 'ico', 'bmp'];
  return ext !== null && imageExtensions.includes(ext.toLowerCase());
}

/**
 * Create share URL for social platforms
 */
export interface ShareUrlOptions {
  url: string;
  title?: string;
  description?: string;
  image?: string;
}

export function createTwitterUrl(options: ShareUrlOptions): string {
  const params = new URLSearchParams({
    url: options.url,
    text: options.title || '',
  });
  return `https://twitter.com/intent/tweet?${params.toString()}`;
}

export function createFacebookUrl(options: ShareUrlOptions): string {
  const params = new URLSearchParams({
    u: options.url,
  });
  return `https://www.facebook.com/sharer/sharer.php?${params.toString()}`;
}

export function createLinkedInUrl(options: ShareUrlOptions): string {
  const params = new URLSearchParams({
    url: options.url,
    title: options.title || '',
    mini: 'true',
  });
  return `https://www.linkedin.com/shareArticle?${params.toString()}`;
}

export function createWhatsAppUrl(options: ShareUrlOptions): string {
  const params = new URLSearchParams({
    url: options.url,
    text: options.title || '',
  });
  return `https://wa.me/?${params.toString()}`;
}

export function createEmailUrl(options: ShareUrlOptions): string {
  const params = new URLSearchParams({
    subject: options.title || '',
    body: `${options.description || ''}\n\n${options.url}`,
  });
  return `mailto:?${params.toString()}`;
}
