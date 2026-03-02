/**
 * 增强的认证服务
 * 提供完整的用户认证功能
 */

export interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  role: 'admin' | 'editor' | 'author' | 'subscriber';
  createdAt: string;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
  expiresAt: number;
}

export interface LoginCredentials {
  email: string;
  password: string;
  remember?: boolean;
}

export interface RegisterData {
  name: string;
  email: string;
  password: string;
}

export interface AuthResponse {
  user: User;
  tokens: AuthTokens;
}

class AuthService {
  private readonly ACCESS_TOKEN_KEY = 'cyberpress_access_token';
  private readonly REFRESH_TOKEN_KEY = 'cyberpress_refresh_token';
  private readonly USER_KEY = 'cyberpress_user';

  /**
   * 登录
   */
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(credentials),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || '登录失败');
      }

      const data: AuthResponse = await response.json();
      this.setAuthData(data);
      return data;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  }

  /**
   * 注册
   */
  async register(data: RegisterData): Promise<AuthResponse> {
    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || '注册失败');
      }

      const authData: AuthResponse = await response.json();
      this.setAuthData(authData);
      return authData;
    } catch (error) {
      console.error('Register error:', error);
      throw error;
    }
  }

  /**
   * 登出
   */
  async logout(): Promise<void> {
    try {
      await fetch('/api/auth/logout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${this.getAccessToken()}`,
        },
      });
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      this.clearAuthData();
    }
  }

  /**
   * 刷新访问令牌
   */
  async refreshAccessToken(): Promise<string | null> {
    const refreshToken = this.getRefreshToken();
    if (!refreshToken) {
      return null;
    }

    try {
      const response = await fetch('/api/auth/refresh', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ refreshToken }),
      });

      if (!response.ok) {
        this.clearAuthData();
        return null;
      }

      const data: { accessToken: string; expiresAt: number } = await response.json();

      // 存储新的访问令牌
      if (typeof window !== 'undefined') {
        localStorage.setItem(this.ACCESS_TOKEN_KEY, data.accessToken);
      }

      return data.accessToken;
    } catch (error) {
      console.error('Refresh token error:', error);
      this.clearAuthData();
      return null;
    }
  }

  /**
   * 获取当前用户
   */
  getCurrentUser(): User | null {
    if (typeof window === 'undefined') return null;

    const userStr = localStorage.getItem(this.USER_KEY);
    if (!userStr) return null;

    try {
      return JSON.parse(userStr);
    } catch {
      return null;
    }
  }

  /**
   * 检查是否已认证
   */
  isAuthenticated(): boolean {
    const token = this.getAccessToken();
    const user = this.getCurrentUser();

    return !!token && !!user;
  }

  /**
   * 检查令牌是否即将过期
   */
  isTokenExpiringSoon(threshold: number = 5 * 60 * 1000): boolean {
    const user = this.getCurrentUser();
    if (!user || !('expiresAt' in user)) return true;

    const expiresAt = (user as any).expiresAt || 0;
    return Date.now() + threshold > expiresAt;
  }

  /**
   * 获取访问令牌
   */
  getAccessToken(): string | null {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem(this.ACCESS_TOKEN_KEY);
  }

  /**
   * 获取刷新令牌
   */
  getRefreshToken(): string | null {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem(this.REFRESH_TOKEN_KEY);
  }

  /**
   * 检查用户权限
   */
  hasPermission(permission: string): boolean {
    const user = this.getCurrentUser();
    if (!user) return false;

    const permissions: Record<User['role'], string[]> = {
      admin: ['create', 'read', 'update', 'delete', 'manage_users', 'manage_settings'],
      editor: ['create', 'read', 'update', 'delete'],
      author: ['create', 'read', 'update'],
      subscriber: ['read'],
    };

    return permissions[user.role]?.includes(permission) || false;
  }

  /**
   * 检查用户角色
   */
  hasRole(role: User['role']): boolean {
    const user = this.getCurrentUser();
    return user?.role === role;
  }

  /**
   * 忘记密码
   */
  async forgotPassword(email: string): Promise<void> {
    const response = await fetch('/api/auth/forgot-password', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || '请求失败');
    }
  }

  /**
   * 重置密码
   */
  async resetPassword(token: string, password: string): Promise<void> {
    const response = await fetch('/api/auth/reset-password', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token, password }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || '重置失败');
    }
  }

  /**
   * 更新用户资料
   */
  async updateProfile(data: Partial<User>): Promise<User> {
    const response = await fetch('/api/auth/profile', {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${this.getAccessToken()}`,
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || '更新失败');
    }

    const updatedUser: User = await response.json();

    // 更新本地存储
    if (typeof window !== 'undefined') {
      localStorage.setItem(this.USER_KEY, JSON.stringify(updatedUser));
    }

    return updatedUser;
  }

  /**
   * 修改密码
   */
  async changePassword(oldPassword: string, newPassword: string): Promise<void> {
    const response = await fetch('/api/auth/change-password', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${this.getAccessToken()}`,
      },
      body: JSON.stringify({ oldPassword, newPassword }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || '修改失败');
    }
  }

  /**
   * 私有方法：设置认证数据
   */
  private setAuthData(data: AuthResponse): void {
    if (typeof window === 'undefined') return;

    localStorage.setItem(this.ACCESS_TOKEN_KEY, data.tokens.accessToken);
    localStorage.setItem(this.REFRESH_TOKEN_KEY, data.tokens.refreshToken);
    localStorage.setItem(this.USER_KEY, JSON.stringify(data.user));
  }

  /**
   * 私有方法：清除认证数据
   */
  private clearAuthData(): void {
    if (typeof window === 'undefined') return;

    localStorage.removeItem(this.ACCESS_TOKEN_KEY);
    localStorage.removeItem(this.REFRESH_TOKEN_KEY);
    localStorage.removeItem(this.USER_KEY);
  }

  /**
   * 获取认证头
   */
  getAuthHeaders(): Record<string, string> {
    const token = this.getAccessToken();
    return token ? { Authorization: `Bearer ${token}` } : {};
  }
}

// 导出单例
export const authService = new AuthService();

// 导出 React Hook
export function useAuth() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 检查认证状态
    const authenticated = authService.isAuthenticated();
    const currentUser = authService.getCurrentUser();

    setIsAuthenticated(authenticated);
    setUser(currentUser);
    setLoading(false);

    // 设置令牌刷新定时器
    if (authenticated && currentUser) {
      const checkInterval = setInterval(async () => {
        if (authService.isTokenExpiringSoon()) {
          const newToken = await authService.refreshAccessToken();
          if (!newToken) {
            setIsAuthenticated(false);
            setUser(null);
          }
        }
      }, 60 * 1000); // 每分钟检查一次

      return () => clearInterval(checkInterval);
    }
  }, []);

  const login = useCallback(async (credentials: LoginCredentials) => {
    const data = await authService.login(credentials);
    setIsAuthenticated(true);
    setUser(data.user);
    return data;
  }, []);

  const register = useCallback(async (data: RegisterData) => {
    const authData = await authService.register(data);
    setIsAuthenticated(true);
    setUser(authData.user);
    return authData;
  }, []);

  const logout = useCallback(async () => {
    await authService.logout();
    setIsAuthenticated(false);
    setUser(null);
  }, []);

  const hasPermission = useCallback((permission: string) => {
    return authService.hasPermission(permission);
  }, [user]);

  const hasRole = useCallback((role: User['role']) => {
    return authService.hasRole(role);
  }, [user]);

  return {
    isAuthenticated,
    user,
    loading,
    login,
    register,
    logout,
    hasPermission,
    hasRole,
  };
}
