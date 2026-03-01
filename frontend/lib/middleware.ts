/**
 * 中间件工具函数
 * 用于 Next.js 中间件和请求处理
 */

import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

/**
 * 创建 CORS 响应
 */
export function createCorsResponse(
  request: NextRequest,
  response?: NextResponse
): NextResponse {
  const corsResponse = response || NextResponse.next();

  corsResponse.headers.set('Access-Control-Allow-Credentials', 'true');
  corsResponse.headers.set(
    'Access-Control-Allow-Origin',
    process.env.NEXT_PUBLIC_SITE_URL || '*'
  );
  corsResponse.headers.set(
    'Access-Control-Allow-Methods',
    'GET,OPTIONS,PATCH,DELETE,POST,PUT'
  );
  corsResponse.headers.set(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization'
  );

  return corsResponse;
}

/**
 * 处理 OPTIONS 预检请求
 */
export function handleOptionsRequest(request: NextRequest): NextResponse | null {
  if (request.method === 'OPTIONS') {
    return createCorsResponse(request, new NextResponse(null, { status: 200 }));
  }
  return null;
}

/**
 * 检查用户代理
 */
export function checkUserAgent(request: NextRequest): {
  isBot: boolean;
  isMobile: boolean;
  browser: string;
} {
  const userAgent = request.headers.get('user-agent') || '';

  const bots = [
    'googlebot',
    'bingbot',
    'slurp',
    'duckduckbot',
    'baiduspider',
    'yandexbot',
    'sogou',
    'exabot',
    'facebot',
    'ia_archiver',
  ];

  const isBot = bots.some((bot) =>
    userAgent.toLowerCase().includes(bot)
  );

  const isMobile = /mobile|android|iphone|ipad|phone/i.test(userAgent);

  let browser = 'unknown';
  if (userAgent.includes('Chrome')) browser = 'chrome';
  else if (userAgent.includes('Firefox')) browser = 'firefox';
  else if (userAgent.includes('Safari')) browser = 'safari';
  else if (userAgent.includes('Edge')) browser = 'edge';

  return { isBot, isMobile, browser };
}

/**
 * 获取客户端 IP
 */
export function getClientIp(request: NextRequest): string {
  return (
    request.headers.get('x-forwarded-for')?.split(',')[0] ||
    request.headers.get('x-real-ip') ||
    'unknown'
  );
}

/**
 * 速率限制键生成
 */
export function generateRateLimitKey(
  request: NextRequest,
  identifier: string
): string {
  const ip = getClientIp(request);
  return `ratelimit:${identifier}:${ip}`;
}

/**
 * 重定向到登录页
 */
export function redirectToLogin(request: NextRequest): NextResponse {
  const loginUrl = new URL('/login', request.url);
  loginUrl.searchParams.set('callbackUrl', request.url);
  return NextResponse.redirect(loginUrl);
}

/**
 * 重定向到首页
 */
export function redirectToHome(request: NextRequest): NextResponse {
  return NextResponse.redirect(new URL('/', request.url));
}

/**
 * 添加安全头
 */
export function addSecurityHeaders(
  response: NextResponse
): NextResponse {
  // 防止点击劫持
  response.headers.set('X-Frame-Options', 'DENY');

  // 防止 MIME 类型嗅探
  response.headers.set('X-Content-Type-Options', 'nosniff');

  // XSS 保护
  response.headers.set('X-XSS-Protection', '1; mode=block');

  // 严格传输安全
  response.headers.set(
    'Strict-Transport-Security',
    'max-age=31536000; includeSubDomains'
  );

  // 内容安全策略
  response.headers.set(
    'Content-Security-Policy',
    "default-src 'self'; script-src 'self' 'unsafe-eval' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self' data:; connect-src 'self' https:; media-src 'self' https:; object-src 'none'; base-uri 'self'; form-action 'self';"
  );

  // 推荐人策略
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');

  // 权限策略
  response.headers.set(
    'Permissions-Policy',
    'camera=(), microphone=(), geolocation=()'
  );

  return response;
}

/**
 * 检查维护模式
 */
export function checkMaintenanceMode(
  request: NextRequest,
  maintenancePaths: string[] = ['/maintenance']
): NextResponse | null {
  const isInMaintenance = process.env.MAINTENANCE_MODE === 'true';
  const isMaintenancePage = maintenancePaths.some((path) =>
    request.nextUrl.pathname.startsWith(path)
  );

  if (isInMaintenance && !isMaintenancePage) {
    return NextResponse.rewrite(new URL('/maintenance', request.url));
  }

  return null;
}

/**
 * 本地化检测
 */
export function detectLocale(
  request: NextRequest,
  defaultLocale: string = 'zh-CN',
  supportedLocales: string[] = ['zh-CN', 'en-US']
): string {
  const acceptLanguage = request.headers.get('accept-language') || '';
  const preferredLocale = acceptLanguage
    .split(',')[0]
    .split('-')[0];

  const exactMatch = supportedLocales.find((locale) =>
    locale.toLowerCase().startsWith(preferredLocale.toLowerCase())
  );

  return exactMatch || defaultLocale;
}

/**
 * 日志记录
 */
export function logRequest(
  request: NextRequest,
  additionalInfo?: Record<string, any>
): void {
  const logData = {
    method: request.method,
    url: request.url,
    userAgent: request.headers.get('user-agent'),
    ip: getClientIp(request),
    timestamp: new Date().toISOString(),
    ...additionalInfo,
  };

  console.log('[Request]', JSON.stringify(logData, null, 2));
}
