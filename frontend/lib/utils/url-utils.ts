/**
 * URL 工具函数库
 *
 * 提供常用的 URL 操作和处理函数
 */

/**
 * 构建查询字符串
 */
export const buildQueryString = (params: Record<string, any>): string => {
  const searchParams = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      if (Array.isArray(value)) {
        value.forEach((v) => searchParams.append(key, String(v)));
      } else {
        searchParams.append(key, String(value));
      }
    }
  });

  return searchParams.toString();
};

/**
 * 解析查询字符串
 */
export const parseQueryString = (queryString: string): Record<string, string | string[]> => {
  const params: Record<string, string | string[]> = {};
  const searchParams = new URLSearchParams(queryString);

  searchParams.forEach((value, key) => {
    if (key in params) {
      const existing = params[key];
      if (Array.isArray(existing)) {
        existing.push(value);
      } else {
        params[key] = [existing, value];
      }
    } else {
      params[key] = value;
    }
  });

  return params;
};

/**
 * 更新 URL 查询参数
 */
export const updateQueryString = (
  url: string,
  params: Record<string, any>
): string => {
  const [base, queryString] = url.split('?');
  const existingParams = queryString ? parseQueryString(queryString) : {};
  const newParams = { ...existingParams, ...params };

  const newQueryString = buildQueryString(newParams);
  return newQueryString ? `${base}?${newQueryString}` : base;
};

/**
 * 删除 URL 查询参数
 */
export const removeQueryString = (url: string, keys: string[]): string => {
  const [base, queryString] = url.split('?');
  if (!queryString) return url;

  const params = parseQueryString(queryString);
  keys.forEach((key) => delete params[key]);

  const newQueryString = buildQueryString(params);
  return newQueryString ? `${base}?${newQueryString}` : base;
};

/**
 * 获取 URL 查询参数
 */
export const getQueryParams = (url: string): Record<string, string | string[]> => {
  const queryString = url.split('?')[1];
  return queryString ? parseQueryString(queryString) : {};
};

/**
 * 获取单个查询参数
 */
export const getQueryParam = (url: string, key: string): string | string[] | null => {
  const params = getQueryParams(url);
  return params[key] ?? null;
};

/**
 * 检查 URL 是否有效
 */
export const isValidUrl = (url: string): boolean => {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};

/**
 * 检查是否为外部链接
 */
export const isExternalUrl = (url: string, baseUrl?: string): boolean => {
  try {
    const urlObj = new URL(url, baseUrl);
    const baseObj = baseUrl ? new URL(baseUrl) : new URL(window.location.href);

    return urlObj.origin !== baseObj.origin;
  } catch {
    return false;
  }
};

/**
 * 获取 URL 的域名
 */
export const getDomain = (url: string): string | null => {
  try {
    const urlObj = new URL(url);
    return urlObj.hostname;
  } catch {
    return null;
  }
};

/**
 * 获取 URL 的路径
 */
export const getPath = (url: string): string | null => {
  try {
    const urlObj = new URL(url);
    return urlObj.pathname;
  } catch {
    return null;
  }
};

/**
 * 获取 URL 的哈希
 */
export const getHash = (url: string): string | null => {
  try {
    const urlObj = new URL(url);
    return urlObj.hash.slice(1) || null;
  } catch {
    return null;
  }
};

/**
 * 构建带查询参数的 URL
 */
export const buildUrl = (
  baseUrl: string,
  path?: string,
  params?: Record<string, any>,
  hash?: string
): string => {
  let url = baseUrl;

  if (path) {
    url = url.replace(/\/$/, '') + '/' + path.replace(/^\//, '');
  }

  if (params) {
    const queryString = buildQueryString(params);
    if (queryString) {
      url += '?' + queryString;
    }
  }

  if (hash) {
    url += '#' + hash.replace(/^#/, '');
  }

  return url;
};

/**
 * 规范化 URL
 */
export const normalizeUrl = (url: string): string => {
  try {
    const urlObj = new URL(url);

    // 移除尾部斜杠（除非是根路径）
    if (urlObj.pathname !== '/' && urlObj.pathname.endsWith('/')) {
      urlObj.pathname = urlObj.pathname.slice(0, -1);
    }

    // 移除默认端口
    if (
      (urlObj.protocol === 'http:' && urlObj.port === '80') ||
      (urlObj.protocol === 'https:' && urlObj.port === '443')
    ) {
      urlObj.port = '';
    }

    // 移除跟踪参数
    const trackingParams = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content', 'fbclid', 'gclid'];
    trackingParams.forEach((param) => {
      urlObj.searchParams.delete(param);
    });

    return urlObj.toString();
  } catch {
    return url;
  }
};

/**
 * 比较两个 URL 是否相同（忽略跟踪参数）
 */
export const isSameUrl = (url1: string, url2: string): boolean => {
  return normalizeUrl(url1) === normalizeUrl(url2);
};

/**
 * 获取文件扩展名
 */
export const getFileExtension = (url: string): string | null => {
  try {
    const urlObj = new URL(url);
    const pathname = urlObj.pathname;
    const match = pathname.match(/\.([^.]+)$/);
    return match ? match[1].toLowerCase() : null;
  } catch {
    return null;
  }
};

/**
 * 检查是否为图片 URL
 */
export const isImageUrl = (url: string): boolean => {
  const ext = getFileExtension(url);
  const imageExtensions = ['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg', 'bmp', 'ico'];
  return ext ? imageExtensions.includes(ext) : false;
};

/**
 * 检查是否为视频 URL
 */
export const isVideoUrl = (url: string): boolean => {
  const ext = getFileExtension(url);
  const videoExtensions = ['mp4', 'webm', 'ogg', 'mov', 'avi', 'flv', 'wmv'];
  return ext ? videoExtensions.includes(ext) : false;
};

/**
 * 检查是否为音频 URL
 */
export const isAudioUrl = (url: string): boolean => {
  const ext = getFileExtension(url);
  const audioExtensions = ['mp3', 'wav', 'ogg', 'flac', 'aac', 'm4a'];
  return ext ? audioExtensions.includes(ext) : false;
};

/**
 * 获取 URL 参数对象
 */
export const getUrlParams = (): Record<string, string | string[]> => {
  if (typeof window === 'undefined') return {};
  return getQueryParams(window.location.href);
};

/**
 * 设置 URL 参数（不刷新页面）
 */
export const setUrlParams = (params: Record<string, any>): void => {
  if (typeof window === 'undefined') return;

  const newUrl = updateQueryString(window.location.href, params);
  window.history.replaceState({}, '', newUrl);
};

/**
 * 删除 URL 参数（不刷新页面）
 */
export const deleteUrlParams = (keys: string[]): void => {
  if (typeof window === 'undefined') return;

  const newUrl = removeQueryString(window.location.href, keys);
  window.history.replaceState({}, '', newUrl);
};

/**
 * 路径拼接
 */
export const joinPath = (...paths: string[]): string => {
  return paths
    .map((path, index) => {
      if (index === 0) {
        return path.replace(/\/$/, '');
      }
      return path.replace(/^\//, '').replace(/\/$/, '');
    })
    .filter(Boolean)
    .join('/');
};

/**
 * 解析路由路径（例如：/posts/:id）
 */
export const parseRoutePath = (path: string, pattern: string): Record<string, string> | null => {
  const pathSegments = path.split('/').filter(Boolean);
  const patternSegments = pattern.split('/').filter(Boolean);

  if (pathSegments.length !== patternSegments.length) {
    return null;
  }

  const params: Record<string, string> = {};

  for (let i = 0; i < patternSegments.length; i++) {
    const patternSegment = patternSegments[i];
    const pathSegment = pathSegments[i];

    if (patternSegment.startsWith(':')) {
      const paramName = patternSegment.slice(1);
      params[paramName] = pathSegment;
    } else if (patternSegment !== pathSegment) {
      return null;
    }
  }

  return params;
};

/**
 * 匹配路由模式
 */
export const matchRoutePattern = (path: string, pattern: string): boolean => {
  return parseRoutePath(path, pattern) !== null;
};

/**
 * 生成带参数的路由路径
 */
export const generateRoutePath = (pattern: string, params: Record<string, string>): string => {
  return pattern.replace(/:([^/]+)/g, (_, key) => params[key] || '');
};

/**
 * URL 编码
 */
export const encodeUrl = (url: string): string => {
  return encodeURIComponent(url);
};

/**
 * URL 解码
 */
export const decodeUrl = (encodedUrl: string): string => {
  return decodeURIComponent(encodedUrl);
};

/**
 * Base64 编码
 */
export const base64Encode = (str: string): string => {
  if (typeof window === 'undefined') {
    return Buffer.from(str).toString('base64');
  }
  return btoa(str);
};

/**
 * Base64 解码
 */
export const base64Decode = (encodedStr: string): string => {
  if (typeof window === 'undefined') {
    return Buffer.from(encodedStr, 'base64').toString();
  }
  return atob(encodedStr);
};

/**
 * 生成短链接
 */
export const shortenUrl = async (url: string): Promise<string> => {
  // 这里可以集成短链接服务
  // 例如：bit.ly, tinyurl 等
  return url;
};

/**
 * 解析短链接（获取真实 URL）
 */
export const expandUrl = async (shortUrl: string): Promise<string> => {
  try {
    const response = await fetch(shortUrl, { method: 'HEAD', redirect: 'follow' });
    return response.url;
  } catch {
    return shortUrl;
  }
};

/**
 * 获取社交分享链接
 */
export const getShareUrl = (platform: 'twitter' | 'facebook' | 'linkedin' | 'whatsapp', options: {
  url: string;
  title?: string;
  description?: string;
}): string => {
  const { url, title, description } = options;
  const encodedUrl = encodeUrl(url);

  switch (platform) {
    case 'twitter':
      return `https://twitter.com/intent/tweet?url=${encodedUrl}${title ? `&text=${encodeUrl(title)}` : ''}`;

    case 'facebook':
      return `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`;

    case 'linkedin':
      return `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`;

    case 'whatsapp':
      return `https://wa.me/?text=${encodedUrl}${title ? ` ${encodeUrl(title)}` : ''}`;

    default:
      return url;
  }
};

/**
 * 邮箱链接
 */
export const getMailtoLink = (email: string, subject?: string, body?: string): string => {
  let link = `mailto:${email}`;
  const params: string[] = [];

  if (subject) {
    params.push(`subject=${encodeUrl(subject)}`);
  }

  if (body) {
    params.push(`body=${encodeUrl(body)}`);
  }

  if (params.length > 0) {
    link += '?' + params.join('&');
  }

  return link;
};

/**
 * 电话链接
 */
export const getTelLink = (phone: string): string => {
  return `tel:${phone.replace(/\D/g, '')}`;
};

/**
 * SMS 链接
 */
export const getSmsLink = (phone: string, body?: string): string => {
  let link = `sms:${phone.replace(/\D/g, '')}`;
  if (body) {
    link += `?body=${encodeUrl(body)}`;
  }
  return link;
};
