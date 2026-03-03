/**
 * CyberPress Platform - 认证中间件
 * ============================================================================
 * 功能: 路由级别的认证保护
 * 版本: 1.0.0
 * 日期: 2026-03-03
 * ============================================================================
 */

import { NextRequest, NextResponse } from 'next/server';
import { authService } from '@/services/auth-service';

// ============================================================================
// 类型定义
// ============================================================================

interface RouteConfig {
  [key: string]: {
    requiresAuth: boolean;
    roles?: string[];
    permissions?: string[];
  };
}

// ============================================================================
// 路由配置
// ============================================================================

const PUBLIC_ROUTES = [
  '/',
  '/login',
  '/register',
  '/forgot-password',
  '/reset-password',
  '/blog',
  '/blog/[slug]',
  '/about',
  '/contact',
  '/portfolio',
  '/search',
  '/tags',
  '/category',
  '/api/health',
  '/api/auth/login',
  '/api/auth/register',
  '/api/auth/refresh',
  '/api/posts',
  '/api/public',
];

const ADMIN_ROUTES = ['/admin', '/admin/*'];

const EDITOR_ROUTES = ['/editor', '/editor/*'];

const AUTHOR_ROUTES = ['/author', '/author/*'];

// 路由权限配置
const ROUTE_CONFIG: RouteConfig = {
  // Admin routes
  '/admin': {
    requiresAuth: true,
    roles: ['admin'],
  },
  '/admin/dashboard': {
    requiresAuth: true,
    roles: ['admin'],
  },
  '/admin/users': {
    requiresAuth: true,
    roles: ['admin'],
  },
  '/admin/settings': {
    requiresAuth: true,
    roles: ['admin'],
  },

  // Editor routes
  '/editor': {
    requiresAuth: true,
    roles: ['admin', 'editor'],
  },
  '/editor/posts': {
    requiresAuth: true,
    roles: ['admin', 'editor'],
  },
  '/editor/media': {
    requiresAuth: true,
    roles: ['admin', 'editor', 'author'],
  },

  // Author routes
  '/author': {
    requiresAuth: true,
    roles: ['admin', 'editor', 'author'],
  },
  '/author/posts': {
    requiresAuth: true,
    roles: ['admin', 'editor', 'author'],
  },

  // User routes
  '/profile': {
    requiresAuth: true,
  },
  '/settings': {
    requiresAuth: true,
  },
  '/user-dashboard': {
    requiresAuth: true,
  },
};

// ============================================================================
// 工具函数
// ============================================================================

/**
 * 检查路径是否匹配模式
 */
function pathMatch(pattern: string, path: string): boolean {
  // 支持通配符 *
  const regexPattern = pattern
    .replace(/\*/g, '.*')
    .replace(/\[.*?\]/g, '[^/]+');

  const regex = new RegExp(`^${regexPattern}$`);
  return regex.test(path);
}

/**
 * 检查路径是否为公共路径
 */
function isPublicPath(path: string): boolean {
  return PUBLIC_ROUTES.some(route => pathMatch(route, path));
}

/**
 * 获取路由配置
 */
function getRouteConfig(path: string): RouteConfig[string] | undefined {
  // 精确匹配
  if (ROUTE_CONFIG[path]) {
    return ROUTE_CONFIG[path];
  }

  // 通配符匹配
  for (const [route, config] of Object.entries(ROUTE_CONFIG)) {
    if (pathMatch(route, path)) {
      return config;
    }
  }

  return undefined;
}

/**
 * 检查用户是否有权限访问路由
 */
function hasAccess(
  user: any,
  config: RouteConfig[string]
): boolean {
  if (!config) return true;
  if (!config.requiresAuth) return true;

  if (!user) return false;

  // 检查角色
  if (config.roles && config.roles.length > 0) {
    if (!user.role || !config.roles.includes(user.role)) {
      return false;
    }
  }

  // 检查权限
  if (config.permissions && config.permissions.length > 0) {
    const hasPermission = config.permissions.some(permission =>
      authService.hasPermission(permission)
    );
    if (!hasPermission) {
      return false;
    }
  }

  return true;
}

/**
 * 构建登录重定向 URL
 */
function buildLoginUrl(returnUrl: string): string {
  return `/login?returnUrl=${encodeURIComponent(returnUrl)}`;
}

/**
 * 构建无权限重定向 URL
 */
function buildForbiddenUrl(): string {
  return '/403';
}

// ============================================================================
// 中间件主函数
// ============================================================================

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // 1. 跳过 API 路由（由 API 中间件处理）
  if (pathname.startsWith('/api/')) {
    return NextResponse.next();
  }

  // 2. 跳过静态文件
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/static') ||
    pathname.startsWith('/images') ||
    pathname.includes('.')
  ) {
    return NextResponse.next();
  }

  // 3. 检查是否为公共路径
  if (isPublicPath(pathname)) {
    return NextResponse.next();
  }

  // 4. 获取用户信息和路由配置
  const user = authService.getCurrentUser();
  const routeConfig = getRouteConfig(pathname);

  // 5. 如果路由没有配置，允许访问
  if (!routeConfig) {
    return NextResponse.next();
  }

  // 6. 检查访问权限
  if (!hasAccess(user, routeConfig)) {
    // 未认证
    if (!user) {
      const loginUrl = buildLoginUrl(pathname);
      return NextResponse.redirect(new URL(loginUrl, request.url));
    }

    // 无权限
    const forbiddenUrl = buildForbiddenUrl();
    return NextResponse.redirect(new URL(forbiddenUrl, request.url));
  }

  // 7. 检查 Token 是否需要刷新
  const accessToken = authService.getAccessToken();
  if (accessToken) {
    const { isTokenExpiringSoon } = await import('@/services/auth-service');
    if (isTokenExpiringSoon(accessToken)) {
      // 异步刷新 Token（不阻塞请求）
      authService.refreshAccessToken().catch(console.error);
    }
  }

  // 8. 添加用户信息到请求头（供服务端使用）
  const response = NextResponse.next();
  if (user) {
    response.headers.set('x-user-id', user.id);
    response.headers.set('x-user-role', user.role);
  }

  return response;
}

// ============================================================================
// 配置匹配路径
// ============================================================================

export const config = {
  matcher: [
    /*
     * 匹配所有路径除了:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public files
     */
    '/((?!api|_next/static|_next/image|favicon.ico|.*\\..*$).*)',
  ],
};

// ============================================================================
// 导出
// ============================================================================

export default middleware;
