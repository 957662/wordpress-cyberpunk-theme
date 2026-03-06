/**
 * 认证相关 API 服务
 */

import { apiClient } from './api-client';

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  email: string;
  username: string;
  password: string;
  name?: string;
}

export interface AuthResponse {
  user: User;
  token: string;
  refreshToken: string;
}

export interface User {
  id: string;
  email: string;
  username: string;
  name?: string;
  avatar?: string;
  bio?: string;
  role: 'user' | 'author' | 'admin';
  createdAt: string;
}

class AuthService {
  private static TOKEN_KEY = 'auth_token';
  private static USER_KEY = 'auth_user';

  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    const { data } = await apiClient.post<AuthResponse>('/api/auth/login', credentials);
    this.setTokens(data);
    return data;
  }

  async register(userData: RegisterData): Promise<AuthResponse> {
    const { data } = await apiClient.post<AuthResponse>('/api/auth/register', userData);
    this.setTokens(data);
    return data;
  }

  async logout(): Promise<void> {
    try {
      await apiClient.post('/api/auth/logout');
    } finally {
      this.clearTokens();
    }
  }

  async getCurrentUser(): Promise<User> {
    const { data } = await apiClient.get<User>('/api/auth/me');
    this.setUser(data);
    return data;
  }

  private setTokens(auth: AuthResponse): void {
    if (typeof window !== 'undefined') {
      localStorage.setItem(AuthService.TOKEN_KEY, auth.token);
      localStorage.setItem(AuthService.USER_KEY, JSON.stringify(auth.user));
    }
  }

  private setUser(user: User): void {
    if (typeof window !== 'undefined') {
      localStorage.setItem(AuthService.USER_KEY, JSON.stringify(user));
    }
  }

  private clearTokens(): void {
    if (typeof window !== 'undefined') {
      localStorage.removeItem(AuthService.TOKEN_KEY);
      localStorage.removeItem(AuthService.USER_KEY);
    }
  }

  getToken(): string | null {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem(AuthService.TOKEN_KEY);
  }

  getUser(): User | null {
    if (typeof window === 'undefined') return null;
    const userStr = localStorage.getItem(AuthService.USER_KEY);
    return userStr ? JSON.parse(userStr) : null;
  }

  isAuthenticated(): boolean {
    return !!this.getToken();
  }
}

export const authService = new AuthService();
