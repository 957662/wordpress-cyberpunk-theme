/**
 * API Middleware - API 请求中间件
 * 处理请求/响应拦截、错误处理、重试等
 */

import { ApiError } from '../services/api-service';

// 中间件类型
type MiddlewareFunction = (
  context: MiddlewareContext
) => Promise<MiddlewareContext> | MiddlewareContext;

interface MiddlewareContext {
  url: string;
  options: RequestInit;
  retries?: number;
}

// 重试中间件
export const retryMiddleware: MiddlewareFunction = async (context) => {
  const { url, options, retries = 0 } = context;
  const maxRetries = 3;

  try {
    const response = await fetch(url, options);

    if (!response.ok && retries < maxRetries) {
      // 如果是 5xx 错误或网络错误，进行重试
      if (response.status >= 500 || response.status === 0) {
        const delay = Math.pow(2, retries) * 1000; // 指数退避
        await new Promise((resolve) => setTimeout(resolve, delay));

        return {
          url,
          options,
          retries: retries + 1,
        };
      }
    }

    return context;
  } catch (error) {
    if (retries < maxRetries) {
      const delay = Math.pow(2, retries) * 1000;
      await new Promise((resolve) => setTimeout(resolve, delay));

      return {
        url,
        options,
        retries: retries + 1,
      };
    }

    throw error;
  }
};

// 认证中间件
export const authMiddleware: MiddlewareFunction = async (context) => {
  const token = typeof window !== 'undefined'
    ? localStorage.getItem('auth_token')
    : null;

  if (token) {
    context.options.headers = {
      ...context.options.headers,
      Authorization: `Bearer ${token}`,
    };
  }

  return context;
};

// CSRF 中间件
export const csrfMiddleware: MiddlewareFunction = async (context) => {
  const csrfToken = typeof window !== 'undefined'
    ? getCookie('csrf_token')
    : null;

  if (csrfToken) {
    context.options.headers = {
      ...context.options.headers,
      'X-CSRF-Token': csrfToken,
    };
  }

  return context;
};

// 请求 ID 中间件
export const requestIdMiddleware: MiddlewareFunction = async (context) => {
  const requestId = crypto.randomUUID();

  context.options.headers = {
    ...context.options.headers,
    'X-Request-ID': requestId,
  };

  return context;
};

// 日志中间件
export const loggingMiddleware: MiddlewareFunction = async (context) => {
  const startTime = Date.now();

  console.log(`[API Request] ${context.options.method || 'GET'} ${context.url}`);

  // 添加响应拦截器（需要在实际请求后调用）
  context.options.headers = {
    ...context.options.headers,
    'X-Request-Start': startTime.toString(),
  };

  return context;
};

// 缓存控制中间件
export const cacheMiddleware: MiddlewareFunction = async (context) => {
  const { options } = context;

  // 对于 GET 请求，添加缓存控制
  if (options.method === 'GET' || !options.method) {
    options.headers = {
      ...options.headers,
      'Cache-Control': 'no-cache',
    };
  }

  return context;
};

// 压缩中间件
export const compressionMiddleware: MiddlewareFunction = async (context) => {
  context.options.headers = {
    ...context.options.headers,
    'Accept-Encoding': 'gzip, deflate, br',
  };

  return context;
};

// 内容类型中间件
export const contentTypeMiddleware: MiddlewareFunction = async (context) => {
  const { options } = context;

  // 如果有 body 且没有设置 Content-Type
  if (options.body && !options.headers?.['Content-Type']) {
    // 检查是否是 FormData
    if (options.body instanceof FormData) {
      options.headers = {
        ...options.headers,
        'Content-Type': 'multipart/form-data',
      };
    } else if (typeof options.body === 'string') {
      options.headers = {
        ...options.headers,
        'Content-Type': 'application/json',
      };
    }
  }

  return context;
};

// 超时中间件
export const timeoutMiddleware = (timeout: number = 30000): MiddlewareFunction => {
  return async (context) => {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);

    context.options.signal = controller.signal;

    // 清理超时定时器
    context.options.headers = {
      ...context.options.headers,
      'X-Timeout-ID': timeoutId.toString(),
    };

    return context;
  };
};

// 组合中间件
export function composeMiddleware(...middlewares: MiddlewareFunction[]) {
  return async (context: MiddlewareContext) => {
    let currentContext = context;

    for (const middleware of middlewares) {
      currentContext = await middleware(currentContext);
    }

    return currentContext;
  };
}

// 默认中间件管道
export const defaultMiddlewarePipeline = composeMiddleware(
  requestIdMiddleware,
  authMiddleware,
  csrfMiddleware,
  contentTypeMiddleware,
  cacheMiddleware,
  compressionMiddleware,
  timeoutMiddleware(30000),
  loggingMiddleware,
  retryMiddleware
);

// 辅助函数
function getCookie(name: string): string | null {
  if (typeof window === 'undefined') return null;

  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);

  if (parts.length === 2) {
    return parts.pop()?.split(';').shift() || null;
  }

  return null;
}

// 响应处理器
export async function handleResponse(response: Response): Promise<any> {
  const contentType = response.headers.get('content-type');

  if (contentType?.includes('application/json')) {
    const data = await response.json();

    if (!response.ok) {
      throw new ApiError(
        data.message || '请求失败',
        response.status,
        data.code
      );
    }

    return data;
  }

  if (contentType?.includes('text/')) {
    const text = await response.text();

    if (!response.ok) {
      throw new ApiError(text, response.status);
    }

    return text;
  }

  if (contentType?.includes('application/octet-stream') || contentType?.includes('image/')) {
    const blob = await response.blob();

    if (!response.ok) {
      throw new ApiError('文件下载失败', response.status);
    }

    return blob;
  }

  return response.text();
}

// 错误处理器
export function handleError(error: Error): never {
  if (error instanceof ApiError) {
    throw error;
  }

  if (error instanceof TypeError && error.message.includes('fetch')) {
    throw new ApiError('网络错误，请检查您的连接', 0);
  }

  if (error.name === 'AbortError') {
    throw new ApiError('请求超时', 0);
  }

  throw new ApiError('发生未知错误', 0);
}
