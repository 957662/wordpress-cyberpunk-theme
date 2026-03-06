/**
 * Auth Store (Enhanced)
 * 增强的认证状态管理
 *
 * 提供完整的用户认证状态管理功能
 */

import { apiService } from '@/lib/services/api-service';
import type { User } from '@/types';

interface AuthState {
  user: User | null;
  accessToken: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

class AuthStoreEnhanced {
  private state: AuthState = {
    user: null,
    accessToken: null,
    refreshToken: null,
    isAuthenticated: false,
    isLoading: false,
  };

  private listeners: Set<(state: AuthState) => void> = new Set();

  constructor() {
    if (typeof window !== 'undefined') {
      this.loadState();
    }
  }

  // ==================== 状态管理 ====================

  getState(): AuthState {
    return { ...this.state };
  }

  private setState(newState: Partial<AuthState>) {
    this.state = { ...this.state, ...newState };
    this.notifyListeners();
    this.saveState();
  }

  subscribe(listener: (state: AuthState) => void): () => void {
    this.listeners.add(listener);
    listener(this.getState());
    return () => this.listeners.delete(listener);
  }

  private notifyListeners() {
    this.listeners.forEach(listener => listener(this.getState()));
  }

  // ==================== 持久化 ====================

  private saveState() {
    if (typeof window === 'undefined') return;

    try {
      const data = {
        user: this.state.user,
        accessToken: this.state.accessToken,
        refreshToken: this.state.refreshToken,
      };
      localStorage.setItem('cyberpress_auth', JSON.stringify(data));
    } catch (error) {
      console.error('Failed to save auth state:', error);
    }
  }

  private loadState() {
    if (typeof window === 'undefined') return;

    try {
      const saved = localStorage.getItem('cyberpress_auth');
      if (saved) {
        const data = JSON.parse(saved);
        this.state = {
          user: data.user,
          accessToken: data.accessToken,
          refreshToken: data.refreshToken,
          isAuthenticated: !!(data.accessToken && data.user),
          isLoading: false,
        };
      }
    } catch (error) {
      console.error('Failed to load auth state:', error);
    }
  }

  private clearState() {
    this.state = {
      user: null,
      accessToken: null,
      refreshToken: null,
      isAuthenticated: false,
      isLoading: false,
    };
    this.notifyListeners();
    this.saveState();
  }

  // ==================== 认证操作 ====================

  async login(email: string, password: string): Promise<void> {
    this.setState({ isLoading: true });

    try {
      const response = await apiService.login(email, password);

      this.setState({
        accessToken: response.access_token,
        refreshToken: response.refresh_token,
        isAuthenticated: true,
        isLoading: false,
      });

      await this.fetchUser();
    } catch (error) {
      this.setState({ isLoading: false });
      throw error;
    }
  }

  async register(userData: {
    username: string;
    email: string;
    password: string;
    full_name?: string;
  }): Promise<void> {
    this.setState({ isLoading: true });

    try {
      await apiService.register(userData);
      await this.login(userData.email, userData.password);
    } catch (error) {
      this.setState({ isLoading: false });
      throw error;
    }
  }

  async logout(): Promise<void> {
    try {
      if (this.state.refreshToken) {
        await apiService.logout(this.state.refreshToken);
      }
    } catch (error) {
      console.error('Logout request failed:', error);
    } finally {
      this.clearState();
      if (typeof window !== 'undefined') {
        window.location.href = '/';
      }
    }
  }

  async refreshTokens(): Promise<void> {
    if (!this.state.refreshToken) {
      throw new Error('No refresh token available');
    }

    try {
      const response = await apiService.refreshToken(this.state.refreshToken);

      this.setState({
        accessToken: response.access_token,
        refreshToken: response.refresh_token || this.state.refreshToken,
      });
    } catch (error) {
      console.error('Token refresh failed:', error);
      this.clearState();
      throw error;
    }
  }

  async fetchUser(): Promise<void> {
    try {
      const user = await apiService.getCurrentUser();
      this.setState({ user });
    } catch (error) {
      console.error('Failed to fetch user:', error);
      throw error;
    }
  }

  async updateProfile(data: {
    full_name?: string;
    bio?: string;
    website_url?: string;
  }): Promise<void> {
    try {
      const user = await apiService.updateProfile(data);
      this.setState({ user });
    } catch (error) {
      console.error('Failed to update profile:', error);
      throw error;
    }
  }

  async uploadAvatar(file: File): Promise<void> {
    try {
      const result = await apiService.uploadAvatar(file);
      if (this.state.user) {
        this.setState({
          user: {
            ...this.state.user,
            avatar_url: result.avatar_url,
          },
        });
      }
    } catch (error) {
      console.error('Failed to upload avatar:', error);
      throw error;
    }
  }

  // ==================== 静态工具方法 ====================

  static getToken(): string | null {
    if (typeof window === 'undefined') return null;

    try {
      const saved = localStorage.getItem('cyberpress_auth');
      if (saved) {
        const data = JSON.parse(saved);
        return data.accessToken || null;
      }
    } catch (error) {
      console.error('Failed to get token:', error);
    }
    return null;
  }

  static getRefreshToken(): string | null {
    if (typeof window === 'undefined') return null;

    try {
      const saved = localStorage.getItem('cyberpress_auth');
      if (saved) {
        const data = JSON.parse(saved);
        return data.refreshToken || null;
      }
    } catch (error) {
      console.error('Failed to get refresh token:', error);
    }
    return null;
  }

  static isAuthenticated(): boolean {
    return !!this.getToken();
  }

  static getUser(): User | null {
    if (typeof window === 'undefined') return null;

    try {
      const saved = localStorage.getItem('cyberpress_auth');
      if (saved) {
        const data = JSON.parse(saved);
        return data.user || null;
      }
    } catch (error) {
      console.error('Failed to get user:', error);
    }
    return null;
  }

  // ==================== 工具方法 ====================

  shouldRefreshToken(): boolean {
    if (!this.state.accessToken) return false;

    try {
      const payload = JSON.parse(atob(this.state.accessToken.split('.')[1]));
      const exp = payload.exp * 1000;
      const now = Date.now();
      return (exp - now) < 5 * 60 * 1000; // 5 分钟内过期
    } catch {
      return false;
    }
  }

  getTokenTimeRemaining(): number {
    if (!this.state.accessToken) return 0;

    try {
      const payload = JSON.parse(atob(this.state.accessToken.split('.')[1]));
      const exp = payload.exp * 1000;
      const now = Date.now();
      return Math.max(0, Math.floor((exp - now) / 1000));
    } catch {
      return 0;
    }
  }

  hasPermission(permission: string): boolean {
    if (!this.state.user) return false;

    if (this.state.user.is_superuser || this.state.user.is_admin) {
      return true;
    }

    return this.state.user.permissions?.includes(permission) || false;
  }

  isAuthor(): boolean {
    return this.state.user?.is_author || false;
  }

  isAdmin(): boolean {
    return this.state.user?.is_admin || false;
  }

  isVerified(): boolean {
    return this.state.user?.is_verified || false;
  }
}

// 导出单例
export const authStoreEnhanced = new AuthStoreEnhanced();

// 导出类型
export type { AuthState };
