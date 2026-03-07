/**
 * Auth stub module
 * 提供认证功能的占位符实现
 */

export interface AuthUser {
  id: string;
  email: string;
  name?: string;
  avatar?: string;
}

export interface AuthSession {
  user: AuthUser | null;
  expires: string;
}

// 获取当前会话
export async function getServerSession(): Promise<AuthSession | null> {
  return null;
}

// 获取当前用户
export async function getCurrentUser(): Promise<AuthUser | null> {
  return null;
}

// 检查是否已登录
export async function isAuthenticated(): Promise<boolean> {
  return false;
}

// 认证提供者配置
export const authOptions = {
  providers: [],
  session: {
    strategy: 'jwt' as const,
  },
};

export default {
  getServerSession,
  getCurrentUser,
  isAuthenticated,
  authOptions,
};

// getSession - 获取当前会话
export async function getSession() {
  // 简单存根实现
  return {
    user: null,
    expires: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
  };
}
