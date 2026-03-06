/**
 * 认证 API 服务
 */

export interface LoginCredentials {
  username: string;
  password: string;
}

export interface RegisterData {
  username: string;
  email: string;
  password: string;
}

export interface AuthResponse {
  success: boolean;
  token?: string;
  user?: UserProfile;
  message?: string;
}

export interface UserProfile {
  id: number;
  username: string;
  email: string;
  firstName?: string;
  lastName?: string;
  displayName?: string;
  avatar?: string;
  bio?: string;
  role?: string;
  createdAt?: string;
  updatedAt?: string;
}

class AuthApiService {
  private baseUrl: string;
  private tokenKey: string = 'auth_token';

  constructor() {
    this.baseUrl = process.env.NEXT_PUBLIC_API_URL || '';
  }

  /**
   * 获取存储的 token
   */
  private getToken(): string | null {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem(this.tokenKey);
  }

  /**
   * 设置 token
   */
  private setToken(token: string): void {
    if (typeof window === 'undefined') return;
    localStorage.setItem(this.tokenKey, token);
  }

  /**
   * 清除 token
   */
  private clearToken(): void {
    if (typeof window === 'undefined') return;
    localStorage.removeItem(this.tokenKey);
  }

  /**
   * 获取请求头
   */
  private getHeaders(): HeadersInit {
    const token = this.getToken();
    return {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
    };
  }

  /**
   * 登录
   */
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    try {
      const response = await fetch(`${this.baseUrl}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(credentials),
      });

      const data: AuthResponse = await response.json();

      if (response.ok && data.token) {
        this.setToken(data.token);
      }

      return data;
    } catch (error) {
      console.error('登录失败:', error);
      return { success: false, message: '网络错误，请稍后重试' };
    }
  }

  /**
   * 注册
   */
  async register(userData: RegisterData): Promise<AuthResponse> {
    try {
      const response = await fetch(`${this.baseUrl}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData),
      });

      const data: AuthResponse = await response.json();

      if (response.ok && data.token) {
        this.setToken(data.token);
      }

      return data;
    } catch (error) {
      console.error('注册失败:', error);
      return { success: false, message: '网络错误，请稍后重试' };
    }
  }

  /**
   * 登出
   */
  async logout(): Promise<{ success: boolean; message?: string }> {
    try {
      this.clearToken();

      // 调用后端登出接口（如果需要）
      const token = this.getToken();
      if (token) {
        await fetch(`${this.baseUrl}/auth/logout`, {
          method: 'POST',
          headers: this.getHeaders(),
        });
      }

      return { success: true, message: '登出成功' };
    } catch (error) {
      console.error('登出失败:', error);
      return { success: false, message: '登出失败' };
    }
  }

  /**
   * 获取当前用户信息
   */
  async getCurrentUser(): Promise<UserProfile | null> {
    try {
      const token = this.getToken();
      if (!token) {
        return null;
      }

      const response = await fetch(`${this.baseUrl}/auth/me`, {
        headers: this.getHeaders(),
      });

      if (!response.ok) {
        if (response.status === 401) {
          this.clearToken();
        }
        return null;
      }

      const user: UserProfile = await response.json();
      return user;
    } catch (error) {
      console.error('获取用户信息失败:', error);
      return null;
    }
  }

  /**
   * 更新用户信息
   */
  async updateProfile(userData: Partial<UserProfile>): Promise<{ success: boolean; user?: UserProfile; message?: string }> {
    try {
      const response = await fetch(`${this.baseUrl}/auth/profile`, {
        method: 'PUT',
        headers: this.getHeaders(),
        body: JSON.stringify(userData),
      });

      if (!response.ok) {
        return { success: false, message: '更新失败' };
      }

      const user: UserProfile = await response.json();
      return { success: true, user };
    } catch (error) {
      console.error('更新用户信息失败:', error);
      return { success: false, message: '网络错误，请稍后重试' };
    }
  }

  /**
   * 修改密码
   */
  async changePassword(oldPassword: string, newPassword: string): Promise<{ success: boolean; message?: string }> {
    try {
      const response = await fetch(`${this.baseUrl}/auth/change-password`, {
        method: 'POST',
        headers: this.getHeaders(),
        body: JSON.stringify({ oldPassword, newPassword }),
      });

      if (!response.ok) {
        return { success: false, message: '密码修改失败' };
      }

      return { success: true, message: '密码修改成功' };
    } catch (error) {
      console.error('修改密码失败:', error);
      return { success: false, message: '网络错误，请稍后重试' };
    }
  }

  /**
   * 重置密码 - 发送邮件
   */
  async forgotPassword(email: string): Promise<{ success: boolean; message?: string }> {
    try {
      const response = await fetch(`${this.baseUrl}/auth/forgot-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      if (!response.ok) {
        return { success: false, message: '发送重置邮件失败' };
      }

      return { success: true, message: '重置邮件已发送' };
    } catch (error) {
      console.error('发送重置邮件失败:', error);
      return { success: false, message: '网络错误，请稍后重试' };
    }
  }

  /**
   * 重置密码 - 使用 token
   */
  async resetPassword(token: string, newPassword: string): Promise<{ success: boolean; message?: string }> {
    try {
      const response = await fetch(`${this.baseUrl}/auth/reset-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, newPassword }),
      });

      if (!response.ok) {
        return { success: false, message: '密码重置失败' };
      }

      return { success: true, message: '密码重置成功' };
    } catch (error) {
      console.error('密码重置失败:', error);
      return { success: false, message: '网络错误，请稍后重试' };
    }
  }

  /**
   * 检查认证状态
   */
  isAuthenticated(): boolean {
    return !!this.getToken();
  }
}

// 导出单例
export const authApiService = new AuthApiService();

// 导出便捷函数
export const login = (credentials: LoginCredentials) => authApiService.login(credentials);
export const register = (userData: RegisterData) => authApiService.register(userData);
export const logout = () => authApiService.logout();
export const getCurrentUser = () => authApiService.getCurrentUser();
export const updateProfile = (userData: Partial<UserProfile>) => authApiService.updateProfile(userData);
export const changePassword = (oldPassword: string, newPassword: string) =>
  authApiService.changePassword(oldPassword, newPassword);
export const forgotPassword = (email: string) => authApiService.forgotPassword(email);
export const resetPassword = (token: string, newPassword: string) =>
  authApiService.resetPassword(token, newPassword);
export const isAuthenticated = () => authApiService.isAuthenticated();

export default authApiService;
