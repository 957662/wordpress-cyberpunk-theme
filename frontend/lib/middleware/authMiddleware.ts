/**
 * 认证中间件
 *
 * 处理用户认证相关的请求拦截和响应处理
 */

import { API_BASE_URL } from '@/lib/config';

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
  expiresAt: string;
}

export interface AuthUser {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  role: string;
}

/**
 * 保存认证令牌
 */
export function saveTokens(tokens: AuthTokens): void {
  try {
    localStorage.setItem('auth_tokens', JSON.stringify(tokens));
  } catch (error) {
    console.error('Failed to save tokens:', error);
  }
}

/**
 * 获取认证令牌
 */
export function getTokens(): AuthTokens | null {
  try {
    const saved = localStorage.getItem('auth_tokens');
    return saved ? JSON.parse(saved) : null;
  } catch (error) {
    console.error('Failed to get tokens:', error);
    return null;
  }
}

/**
 * 清除认证令牌
 */
export function clearTokens(): void {
  try {
    localStorage.removeItem('auth_tokens');
    localStorage.removeItem('auth_user');
  } catch (error) {
    console.error('Failed to clear tokens:', error);
  }
}

/**
 * 获取访问令牌
 */
export function getAccessToken(): string | null {
  const tokens = getTokens();
  return tokens?.accessToken || null;
}

/**
 * 检查令牌是否过期
 */
export function isTokenExpired(): boolean {
  const tokens = getTokens();
  if (!tokens) return true;

  const expiresAt = new Date(tokens.expiresAt);
  return expiresAt <= new Date();
}

/**
 * 刷新访问令牌
 */
export async function refreshAccessToken(): Promise<boolean> {
  const tokens = getTokens();
  if (!tokens?.refreshToken) return false;

  try {
    const response = await fetch(`${API_BASE_URL}/auth/refresh`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        refreshToken: tokens.refreshToken,
      }),
    });

    if (!response.ok) {
      clearTokens();
      return false;
    }

    const newTokens = await response.json();
    saveTokens(newTokens);
    return true;
  } catch (error) {
    console.error('Failed to refresh token:', error);
    clearTokens();
    return false;
  }
}

/**
 * 保存认证用户信息
 */
export function saveAuthUser(user: AuthUser): void {
  try {
    localStorage.setItem('auth_user', JSON.stringify(user));
  } catch (error) {
    console.error('Failed to save user:', error);
  }
}

/**
 * 获取认证用户信息
 */
export function getAuthUser(): AuthUser | null {
  try {
    const saved = localStorage.getItem('auth_user');
    return saved ? JSON.parse(saved) : null;
  } catch (error) {
    console.error('Failed to get user:', error);
    return null;
  }
}

/**
 * 检查用户是否已认证
 */
export function isAuthenticated(): boolean {
  const tokens = getTokens();
  if (!tokens) return false;
  return !isTokenExpired();
}

/**
 * 登出
 */
export async function logout(): Promise<void> {
  try {
    const token = getAccessToken();
    if (token) {
      await fetch(`${API_BASE_URL}/auth/logout`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
    }
  } catch (error) {
    console.error('Logout error:', error);
  } finally {
    clearTokens();
    // 重定向到登录页或首页
    if (typeof window !== 'undefined') {
      window.location.href = '/login';
    }
  }
}

/**
 * 认证的 fetch 封装
 */
export async function authFetch(
  url: string,
  options: RequestInit = {}
): Promise<Response> {
  let token = getAccessToken();

  // 如果令牌过期，尝试刷新
  if (token && isTokenExpired()) {
    const refreshed = await refreshAccessToken();
    if (refreshed) {
      token = getAccessToken();
    } else {
      // 刷新失败，跳转到登录页
      if (typeof window !== 'undefined') {
        window.location.href = '/login';
      }
      throw new Error('Authentication failed');
    }
  }

  // 添加认证头
  const headers = {
    ...options.headers,
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };

  let response = await fetch(url, { ...options, headers });

  // 如果收到 401 响应，尝试刷新令牌后重试
  if (response.status === 401 && token) {
    const refreshed = await refreshAccessToken();
    if (refreshed) {
      const newToken = getAccessToken();
      const newHeaders = {
        ...options.headers,
        Authorization: `Bearer ${newToken}`,
      };
      response = await fetch(url, { ...options, headers: newHeaders });
    }
  }

  return response;
}

/**
 * 登录
 */
export async function login(
  email: string,
  password: string
): Promise<{ success: boolean; user?: AuthUser; error?: string }> {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });

    if (!response.ok) {
      const error = await response.json();
      return { success: false, error: error.message || 'Login failed' };
    }

    const data = await response.json();
    saveTokens(data.tokens);
    saveAuthUser(data.user);
    return { success: true, user: data.user };
  } catch (error) {
    return { success: false, error: 'Network error' };
  }
}

/**
 * 注册
 */
export async function register(
  email: string,
  password: string,
  name: string
): Promise<{ success: boolean; user?: AuthUser; error?: string }> {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password, name }),
    });

    if (!response.ok) {
      const error = await response.json();
      return { success: false, error: error.message || 'Registration failed' };
    }

    const data = await response.json();
    saveTokens(data.tokens);
    saveAuthUser(data.user);
    return { success: true, user: data.user };
  } catch (error) {
    return { success: false, error: 'Network error' };
  }
}

/**
 * 发送密码重置邮件
 */
export async function sendPasswordResetEmail(
  email: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/password-reset`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email }),
    });

    if (!response.ok) {
      const error = await response.json();
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (error) {
    return { success: false, error: 'Network error' };
  }
}

/**
 * 重置密码
 */
export async function resetPassword(
  token: string,
  newPassword: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/password-reset/confirm`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ token, newPassword }),
    });

    if (!response.ok) {
      const error = await response.json();
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (error) {
    return { success: false, error: 'Network error' };
  }
}

/**
 * 更新密码
 */
export async function updatePassword(
  currentPassword: string,
  newPassword: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const response = await authFetch(`${API_BASE_URL}/auth/password`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ currentPassword, newPassword }),
    });

    if (!response.ok) {
      const error = await response.json();
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (error) {
    return { success: false, error: 'Network error' };
  }
}
