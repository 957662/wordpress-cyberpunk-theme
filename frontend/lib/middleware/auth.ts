import { NextRequest, NextResponse } from 'next/server';

/**
 * 认证中间件
 */

// 公开路由（不需要认证）
const publicRoutes = [
  '/',
  '/login',
  '/register',
  '/forgot-password',
  '/blog',
  '/portfolio',
  '/about',
  '/contact',
  '/api/auth/login',
  '/api/auth/register',
];

// 管理员路由前缀
const adminRoutes = ['/admin', '/dashboard'];

/**
 * 检查路由是否为公开路由
 */
function isPublicRoute(pathname: string): boolean {
  return publicRoutes.some(route => pathname.startsWith(route));
}

/**
 * 检查路由是否为管理员路由
 */
function isAdminRoute(pathname: string): boolean {
  return adminRoutes.some(route => pathname.startsWith(route));
}

/**
 * 从请求中获取 token
 */
function getTokenFromRequest(request: NextRequest): string | null {
  // 从 cookie 中获取
  const token = request.cookies.get('auth_token')?.value;
  if (token) return token;

  // 从 Authorization header 中获取
  const authHeader = request.headers.get('authorization');
  if (authHeader?.startsWith('Bearer ')) {
    return authHeader.substring(7);
  }

  return null;
}

/**
 * 验证 token
 */
async function validateToken(token: string): Promise<{ valid: boolean; user?: any; role?: string }> {
  try {
    // 这里应该调用你的认证 API 来验证 token
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/verify`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (response.ok) {
      const data = await response.json();
      return { valid: true, user: data.user, role: data.role };
    }

    return { valid: false };
  } catch (error) {
    console.error('Token validation error:', error);
    return { valid: false };
  }
}

/**
 * 中间件主函数
 */
export async function authMiddleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // 允许公开路由
  if (isPublicRoute(pathname)) {
    return NextResponse.next();
  }

  // 获取 token
  const token = getTokenFromRequest(request);

  // 没有 token，重定向到登录页
  if (!token) {
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('redirect', pathname);
    return NextResponse.redirect(loginUrl);
  }

  // 验证 token
  const validation = await validateToken(token);

  if (!validation.valid) {
    // token 无效，重定向到登录页
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('redirect', pathname);
    return NextResponse.redirect(loginUrl);
  }

  // 检查管理员权限
  if (isAdminRoute(pathname) && validation.role !== 'admin') {
    // 不是管理员，重定向到首页
    return NextResponse.redirect(new URL('/', request.url));
  }

  // 添加用户信息到请求头
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set('x-user-id', validation.user?.id || '');
  requestHeaders.set('x-user-role', validation.role || '');

  const response = NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  });

  return response;
}

/**
 * 创建中间件
 */
export function createMiddleware() {
  return async (request: NextRequest) => {
    return authMiddleware(request);
  };
}
