/**
 * 认证服务
 * 处理用户认证相关的API调用
 */

import { httpClient } from '../http-client';
import type {
  User,
  LoginCredentials,
  RegisterData,
  UpdateUserProfileData,
  ApiResponse,
} from '@/types';

interface AuthResponse extends ApiResponse<{
  user: User;
  token: string;
  refreshToken: string;
}> {}

interface UserResponse extends ApiResponse<User> {}

export class AuthService {
  private readonly basePath = '/api/v1/auth';

  /**
   * 用户登录
   */
  async login(credentials: LoginCredentials): Promise<{
    user: User;
    token: string;
    refreshToken: string;
  }> {
    const response = await httpClient.post<AuthResponse>(
      `${this.basePath}/login`,
      credentials
    );
    return {
      user: response.data.user,
      token: response.data.token,
      refreshToken: response.data.refreshToken,
    };
  }

  /**
   * 用户注册
   */
  async register(data: RegisterData): Promise<{
    user: User;
    token: string;
    refreshToken: string;
  }> {
    const response = await httpClient.post<AuthResponse>(
      `${this.basePath}/register`,
      data
    );
    return {
      user: response.data.user,
      token: response.data.token,
      refreshToken: response.data.refreshToken,
    };
  }

  /**
   * 用户登出
   */
  async logout(): Promise<void> {
    await httpClient.post(`${this.basePath}/logout`);
  }

  /**
   * 刷新Token
   */
  async refreshToken(refreshToken: string): Promise<{
    token: string;
    refreshToken: string;
  }> {
    const response = await httpClient.post<{ token: string; refreshToken: string }>(
      `${this.basePath}/refresh`,
      { refreshToken }
    );
    return {
      token: response.token,
      refreshToken: response.refreshToken,
    };
  }

  /**
   * 获取当前用户信息
   */
  async getCurrentUser(): Promise<User> {
    const response = await httpClient.get<UserResponse>(`${this.basePath}/me`);
    return response.data;
  }

  /**
   * 更新用户资料
   */
  async updateProfile(data: UpdateUserProfileData): Promise<User> {
    const response = await httpClient.put<UserResponse>(
      `${this.basePath}/profile`,
      data
    );
    return response.data;
  }

  /**
   * 修改密码
   */
  async changePassword(oldPassword: string, newPassword: string): Promise<void> {
    await httpClient.post(`${this.basePath}/change-password`, {
      oldPassword,
      newPassword,
    });
  }

  /**
   * 发送密码重置邮件
   */
  async forgotPassword(email: string): Promise<void> {
    await httpClient.post(`${this.basePath}/forgot-password`, { email });
  }

  /**
   * 重置密码
   */
  async resetPassword(token: string, password: string): Promise<void> {
    await httpClient.post(`${this.basePath}/reset-password`, {
      token,
      password,
    });
  }

  /**
   * 验证邮箱
   */
  async verifyEmail(token: string): Promise<void> {
    await httpClient.post(`${this.basePath}/verify-email`, { token });
  }

  /**
   * 重新发送验证邮件
   */
  async resendVerificationEmail(): Promise<void> {
    await httpClient.post(`${this.basePath}/resend-verification`);
  }

  /**
   * 上传头像
   */
  async uploadAvatar(file: File): Promise<{ url: string }> {
    const formData = new FormData();
    formData.append('file', file);

    const response = await httpClient.post<{ url: string }>(
      `${this.basePath}/avatar`,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );
    return response;
  }

  /**
   * 删除账户
   */
  async deleteAccount(password: string): Promise<void> {
    await httpClient.delete(`${this.basePath}/account`, {
      data: { password },
    });
  }

  /**
   * 检查用户名是否可用
   */
  async checkUsernameAvailability(username: string): Promise<{ available: boolean }> {
    const response = await httpClient.get<{ available: boolean }>(
      `${this.basePath}/check-username/${username}`
    );
    return response;
  }

  /**
   * 检查邮箱是否可用
   */
  async checkEmailAvailability(email: string): Promise<{ available: boolean }> {
    const response = await httpClient.get<{ available: boolean }>(
      `${this.basePath}/check-email/${email}`
    );
    return response;
  }
}

// 导出单例
export const authService = new AuthService();
