/**
 * HTTP Utilities - HTTP 工具函数
 *
 * 提供各种 HTTP 相关的工具函数：
 * - URL 操作
 * - 查询参数处理
 * - Cookie 管理
 * - 请求构建
 * - 响应处理
 */

/**
 * Build URL - 构建带查询参数的 URL
 */
export function buildUrl(
  baseUrl: string,
  params: Record<string, string | number | boolean | undefined | null>
): string {
  const url = new URL(baseUrl);

  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      url.searchParams.set(key, String(value));
    }
  });

  return url.toString();
}

/**
 * Parse Query String - 解析查询字符串
 */
export function parseQueryString(queryString: string): Record<string, string> {
  const params: Record<string, string> = {};
  const urlParams = new URLSearchParams(queryString);

  urlParams.forEach((value, key) => {
    params[key] = value;
  });

  return params;
}

/**
 * Stringify Query Object - 将对象转换为查询字符串
 */
export function stringifyQueryObject(
  obj: Record<string, string | number | boolean | undefined | null>
): string {
  const params = new URLSearchParams();

  Object.entries(obj).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      params.set(key, String(value));
    }
  });

  return params.toString();
}

/**
 * Merge URLs - 合并基础 URL 和相对路径
 */
export function mergeUrls(baseUrl: string, path: string): string {
  const base = baseUrl.endsWith('/') ? baseUrl.slice(0, -1) : baseUrl;
  const relativePath = path.startsWith('/') ? path : `/${path}`;
  return base + relativePath;
}

/**
 * Get URL Path - 获取 URL 路径（不含查询参数和 hash）
 */
export function getUrlPath(url: string): string {
  try {
    const urlObj = new URL(url);
    return urlObj.pathname;
  } catch {
    return url;
  }
}

/**
 * Get URL Domain - 获取 URL 域名
 */
export function getUrlDomain(url: string): string {
  try {
    const urlObj = new URL(url);
    return urlObj.hostname;
  } catch {
    return '';
  }
}

/**
 * Is Same Origin - 判断两个 URL 是否同源
 */
export function isSameOrigin(url1: string, url2: string): boolean {
  try {
    const u1 = new URL(url1);
    const u2 = new URL(url2);
    return u1.origin === u2.origin;
  } catch {
    return false;
  }
}

/**
 * Is HTTPS - 判断是否为 HTTPS 协议
 */
export function isHttps(url: string): boolean {
  try {
    const urlObj = new URL(url);
    return urlObj.protocol === 'https:';
  } catch {
    return false;
  }
}

/**
 * Add Query Param - 添加查询参数
 */
export function addQueryParam(
  url: string,
  key: string,
  value: string | number | boolean
): string {
  try {
    const urlObj = new URL(url);
    urlObj.searchParams.set(key, String(value));
    return urlObj.toString();
  } catch {
    return url;
  }
}

/**
 * Remove Query Param - 移除查询参数
 */
export function removeQueryParam(url: string, key: string): string {
  try {
    const urlObj = new URL(url);
    urlObj.searchParams.delete(key);
    return urlObj.toString();
  } catch {
    return url;
  }
}

/**
 * Get Query Param - 获取查询参数
 */
export function getQueryParam(url: string, key: string): string | null {
  try {
    const urlObj = new URL(url);
    return urlObj.searchParams.get(key);
  } catch {
    return null;
  }
}

/**
 * Get All Query Params - 获取所有查询参数
 */
export function getAllQueryParams(url: string): Record<string, string> {
  try {
    const urlObj = new URL(url);
    const params: Record<string, string> = {};
    urlObj.searchParams.forEach((value, key) => {
      params[key] = value;
    });
    return params;
  } catch {
    return {};
  }
}

/**
 * Cookie Management - Cookie 管理
 */

/**
 * Set Cookie - 设置 Cookie
 */
export function setCookie(
  name: string,
  value: string,
  options: {
    expires?: number | Date;
    maxAge?: number;
    domain?: string;
    path?: string;
    secure?: boolean;
    httpOnly?: boolean;
    sameSite?: 'strict' | 'lax' | 'none';
  } = {}
): void {
  let cookieString = `${name}=${encodeURIComponent(value)}`;

  if (options.expires) {
    if (typeof options.expires === 'number') {
      const date = new Date();
      date.setTime(date.getTime() + options.expires * 1000);
      cookieString += `; expires=${date.toUTCString()}`;
    } else {
      cookieString += `; expires=${options.expires.toUTCString()}`;
    }
  }

  if (options.maxAge) {
    cookieString += `; max-age=${options.maxAge}`;
  }

  if (options.domain) {
    cookieString += `; domain=${options.domain}`;
  }

  if (options.path) {
    cookieString += `; path=${options.path}`;
  }

  if (options.secure) {
    cookieString += '; secure';
  }

  if (options.httpOnly) {
    cookieString += '; httponly';
  }

  if (options.sameSite) {
    cookieString += `; samesite=${options.sameSite}`;
  }

  document.cookie = cookieString;
}

/**
 * Get Cookie - 获取 Cookie
 */
export function getCookie(name: string): string | null {
  const nameEQ = `${name}=`;
  const cookies = document.cookie.split(';');

  for (let i = 0; i < cookies.length; i++) {
    let cookie = cookies[i];
    while (cookie.charAt(0) === ' ') {
      cookie = cookie.substring(1, cookie.length);
    }
    if (cookie.indexOf(nameEQ) === 0) {
      return decodeURIComponent(cookie.substring(nameEQ.length));
    }
  }

  return null;
}

/**
 * Delete Cookie - 删除 Cookie
 */
export function deleteCookie(
  name: string,
  options: { domain?: string; path?: string } = {}
): void {
  setCookie(name, '', {
    ...options,
    expires: new Date(0),
  });
}

/**
 * GetAll Cookies - 获取所有 Cookie
 */
export function getAllCookies(): Record<string, string> {
  const cookies: Record<string, string> = {};
  const cookieStrings = document.cookie.split(';');

  cookieStrings.forEach((cookieString) => {
    const [name, value] = cookieString.split('=').map((s) => s.trim());
    if (name && value) {
      cookies[name] = decodeURIComponent(value);
    }
  });

  return cookies;
}

/**
 * HTTP Headers - HTTP 头管理
 */

/**
 * Normalize Headers - 标准化请求头
 */
export function normalizeHeaders(
  headers: Record<string, string>
): Record<string, string> {
  const normalized: Record<string, string> = {};

  Object.entries(headers).forEach(([key, value]) => {
    const normalizedKey = key
      .split('-')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join('-');
    normalized[normalizedKey] = value;
  });

  return normalized;
}

/**
 * Merge Headers - 合并请求头
 */
export function mergeHeaders(
  ...headers: Array<Record<string, string> | HeadersInit | undefined>
): Record<string, string> {
  const merged: Record<string, string> = {};

  headers.forEach((headerObj) => {
    if (!headerObj) return;

    if (headerObj instanceof Headers) {
      headerObj.forEach((value, key) => {
        merged[key] = value;
      });
    } else {
      Object.entries(headerObj).forEach(([key, value]) => {
        merged[key] = value;
      });
    }
  });

  return merged;
}

/**
 * Request Building - 请求构建
 */

/**
 * Build Request - 构建请求对象
 */
export interface RequestOptions {
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  headers?: Record<string, string>;
  body?: any;
  params?: Record<string, string | number | boolean>;
  timeout?: number;
  credentials?: 'same-origin' | 'include' | 'omit';
}

export async function buildRequest(
  url: string,
  options: RequestOptions = {}
): Promise<Request> {
  const {
    method = 'GET',
    headers = {},
    body,
    params,
    timeout = 30000,
    credentials = 'same-origin',
  } = options;

  // 构建完整 URL
  let fullUrl = url;
  if (params) {
    fullUrl = buildUrl(url, params);
  }

  // 构建请求头
  const requestHeaders: Record<string, string> = {
    'Content-Type': 'application/json',
    ...headers,
  };

  // 构建请求体
  let requestBody: BodyInit | undefined;
  if (body) {
    if (typeof body === 'string') {
      requestBody = body;
    } else if (body instanceof FormData) {
      requestBody = body;
      delete requestHeaders['Content-Type']; // 让浏览器自动设置
    } else {
      requestBody = JSON.stringify(body);
    }
  }

  const requestInit: RequestInit = {
    method,
    headers: requestHeaders,
    body: requestBody,
    credentials,
  };

  return new Request(fullUrl, requestInit);
}

/**
 * Fetch with Timeout - 带超时的 fetch
 */
export async function fetchWithTimeout(
  url: string,
  options: RequestInit & { timeout?: number } = {}
): Promise<Response> {
  const { timeout = 30000, ...fetchOptions } = options;

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);

  try {
    const response = await fetch(url, {
      ...fetchOptions,
      signal: controller.signal,
    });
    clearTimeout(timeoutId);
    return response;
  } catch (error) {
    clearTimeout(timeoutId);
    if (error instanceof Error && error.name === 'AbortError') {
      throw new Error(`Request timeout after ${timeout}ms`);
    }
    throw error;
  }
}

/**
 * Fetch with Retry - 带重试的 fetch
 */
export async function fetchWithRetry(
  url: string,
  options: RequestInit & { retries?: number; retryDelay?: number } = {}
): Promise<Response> {
  const { retries = 3, retryDelay = 1000, ...fetchOptions } = options;

  let lastError: Error | null = null;

  for (let i = 0; i <= retries; i++) {
    try {
      const response = await fetch(url, fetchOptions);

      // 如果响应成功或不是服务器错误，直接返回
      if (response.ok || response.status < 500) {
        return response;
      }

      // 如果是服务器错误，抛出错误以便重试
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    } catch (error) {
      lastError = error as Error;

      // 如果是最后一次尝试，直接抛出错误
      if (i === retries) {
        throw lastError;
      }

      // 等待一段时间后重试
      await new Promise((resolve) => setTimeout(resolve, retryDelay * (i + 1)));
    }
  }

  throw lastError;
}

/**
 * Response Utilities - 响应处理
 */

/**
 * Parse Response - 解析响应
 */
export async function parseResponse<T = any>(
  response: Response
): Promise<T> {
  const contentType = response.headers.get('content-type');

  if (contentType?.includes('application/json')) {
    return response.json();
  } else if (contentType?.includes('text/')) {
    return (await response.text()) as unknown as T;
  } else if (contentType?.includes('application/octet-stream')) {
    return (await response.blob()) as unknown as T;
  } else {
    return (await response.text()) as unknown as T;
  }
}

/**
 * Download File - 下载文件
 */
export async function downloadFile(
  url: string,
  filename?: string
): Promise<void> {
  const response = await fetch(url);
  const blob = await response.blob();

  const downloadUrl = window.URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = downloadUrl;
  link.download = filename || getFilenameFromUrl(url);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  window.URL.revokeObjectURL(downloadUrl);
}

/**
 * Get Filename from URL - 从 URL 获取文件名
 */
export function getFilenameFromUrl(url: string): string {
  try {
    const urlObj = new URL(url);
    const pathname = urlObj.pathname;
    const filename = pathname.split('/').pop();
    return filename || 'download';
  } catch {
    return 'download';
  }
}

/**
 * Upload File - 上传文件
 */
export async function uploadFile(
  url: string,
  file: File,
  options: {
    field?: string;
    data?: Record<string, string>;
    onProgress?: (progress: number) => void;
    headers?: Record<string, string>;
  } = {}
): Promise<Response> {
  const { field = 'file', data = {}, onProgress, headers = {} } = options;

  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();

    // 监听上传进度
    if (onProgress) {
      xhr.upload.addEventListener('progress', (event) => {
        if (event.lengthComputable) {
          const progress = (event.loaded / event.total) * 100;
          onProgress(progress);
        }
      });
    }

    // 监听响应
    xhr.addEventListener('load', () => {
      const response = new Response(xhr.responseText, {
        status: xhr.status,
        statusText: xhr.statusText,
      });
      resolve(response);
    });

    // 监听错误
    xhr.addEventListener('error', () => {
      reject(new Error('Upload failed'));
    });

    // 构建 FormData
    const formData = new FormData();
    formData.append(field, file);

    Object.entries(data).forEach(([key, value]) => {
      formData.append(key, value);
    });

    // 发送请求
    xhr.open('POST', url);

    Object.entries(headers).forEach(([key, value]) => {
      xhr.setRequestHeader(key, value);
    });

    xhr.send(formData);
  });
}

/**
 * Batch Request - 批量请求
 */
export async function batchRequest<T>(
  urls: string[],
  options: RequestInit = {}
): Promise<T[]> {
  const requests = urls.map((url) => fetch(url, options).then((res) => res.json()));
  return Promise.all(requests);
}

/**
 * Concurrent Request - 并发请求（限制并发数）
 */
export async function concurrentRequest<T>(
  urls: string[],
  concurrency: number = 5,
  options: RequestInit = {}
): Promise<T[]> {
  const results: T[] = [];
  const executing: Promise<void>[] = [];

  for (const url of urls) {
    const promise = fetch(url, options)
      .then((res) => res.json())
      .then((data) => {
        results.push(data);
      });

    executing.push(promise);

    if (executing.length >= concurrency) {
      await Promise.race(executing);
      executing.splice(
        executing.findIndex((p) => p === promise),
        1
      );
    }
  }

  await Promise.all(executing);
  return results;
}

/**
 * Cache Busting - 缓存清除
 */
export function addCacheBusting(url: string): string {
  const separator = url.includes('?') ? '&' : '?';
  return `${url}${separator}_=${Date.now()}`;
}

/**
 * Is Absolute URL - 判断是否为绝对 URL
 */
export function isAbsoluteUrl(url: string): boolean {
  return /^https?:\/\//i.test(url);
}

/**
 * Join URLs - 连接多个 URL 部分
 */
export function joinUrls(...parts: string[]): string {
  return parts
    .map((part, index) => {
      // 移除开头的斜杠（除了第一个）
      if (index > 0 && part.startsWith('/')) {
        part = part.slice(1);
      }
      // 移除结尾的斜杠
      if (part.endsWith('/')) {
        part = part.slice(0, -1);
      }
      return part;
    })
    .join('/');
}
