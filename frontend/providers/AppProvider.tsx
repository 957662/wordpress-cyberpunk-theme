'use client';

/**
 * CyberPress Platform - App Provider
 * 全局应用上下文提供者
 */

import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { ThemeProvider as NextThemesProvider } from 'next-themes';
import type { Theme } from 'next-themes';
import { toast } from 'react-hot-toast';
import type { Notification, SystemConfig, AuthUser } from '@/types';

// ==================== Contexts ====================

interface AppContextType {
  // 用户状态
  user: AuthUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;

  // 应用状态
  config: SystemConfig | null;
  notifications: Notification[];

  // 操作方法
  login: (user: AuthUser) => void;
  logout: () => void;
  updateUser: (user: Partial<AuthUser>) => void;

  // 通知方法
  addNotification: (notification: Omit<Notification, 'id'>) => void;
  removeNotification: (id: string) => void;
  clearNotifications: () => void;

  // 主题方法
  toggleTheme: () => void;
  setTheme: (theme: Theme) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

// ==================== Provider Props ====================

interface AppProviderProps {
  children: ReactNode;
  initialConfig?: SystemConfig;
  initialUser?: AuthUser | null;
}

// ==================== App Provider ====================

export function AppProvider({
  children,
  initialConfig = null,
  initialUser = null,
}: AppProviderProps) {
  // Query Client
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 5 * 60 * 1000, // 5 分钟
            retry: 1,
            refetchOnWindowFocus: false,
          },
          mutations: {
            retry: 1,
          },
        },
      })
  );

  // 用户状态
  const [user, setUser] = useState<AuthUser | null>(initialUser);
  const [isLoading, setIsLoading] = useState(false);

  // 应用配置
  const [config, setConfig] = useState<SystemConfig | null>(initialConfig);

  // 通知列表
  const [notifications, setNotifications] = useState<Notification[]>([]);

  // 主题状态
  const [theme, setThemeState] = useState<Theme>('dark');

  // ==================== 初始化 ====================

  useEffect(() => {
    // 从 localStorage 加载用户信息
    const storedUser = localStorage.getItem('cyberpress_user');
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (error) {
        console.error('Failed to parse stored user:', error);
        localStorage.removeItem('cyberpress_user');
      }
    }

    // 从 localStorage 加载主题
    const storedTheme = localStorage.getItem('theme') as Theme;
    if (storedTheme) {
      setThemeState(storedTheme);
    }

    // 加载应用配置
    loadConfig();

    // 加载性能监控
    if (typeof window !== 'undefined') {
      initPerformanceMonitoring();
    }
  }, []);

  // ==================== 配置加载 ====================

  const loadConfig = async () => {
    try {
      const response = await fetch('/api/config');
      if (response.ok) {
        const data = await response.json();
        setConfig(data);
      }
    } catch (error) {
      console.error('Failed to load config:', error);
      // 使用默认配置
      setConfig(getDefaultConfig());
    }
  };

  const getDefaultConfig = (): SystemConfig => ({
    siteName: 'CyberPress',
    siteDescription: 'A cyberpunk-themed blog platform',
    siteUrl: typeof window !== 'undefined' ? window.location.origin : '',
    language: 'zh-CN',
    timezone: 'Asia/Shanghai',
    dateFormat: 'YYYY-MM-DD',
    timeFormat: 'HH:mm:ss',
    features: {
      comments: true,
      registration: true,
      newsletter: true,
      readingList: true,
      bookmarks: true,
    },
    social: {
      twitter: 'https://twitter.com/cyberpress',
      github: 'https://github.com/cyberpress',
    },
  });

  // ==================== 性能监控 ====================

  const initPerformanceMonitoring = () => {
    // 监控页面加载性能
    if ('performance' in window) {
      window.addEventListener('load', () => {
        setTimeout(() => {
          const perfData = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
          const metrics = {
            loadTime: perfData.loadEventEnd - perfData.fetchStart,
            domReady: perfData.domContentLoadedEventEnd - perfData.fetchStart,
            firstPaint: performance.getEntriesByName('first-paint')[0]?.startTime || 0,
            firstContentfulPaint:
              performance.getEntriesByName('first-contentful-paint')[0]?.startTime || 0,
          };

          console.info('Performance Metrics:', metrics);

          // 发送到分析服务（可选）
          if (process.env.NODE_ENV === 'production') {
            // sendToAnalytics(metrics);
          }
        }, 0);
      });
    }

    // 监控错误
    window.addEventListener('error', (event) => {
      console.error('Global error:', event.error);
      addNotification({
        type: 'error',
        title: '应用程序错误',
        message: '发生了意外错误，请刷新页面重试',
      });
    });

    // 监控未处理的 Promise 拒绝
    window.addEventListener('unhandledrejection', (event) => {
      console.error('Unhandled promise rejection:', event.reason);
      addNotification({
        type: 'error',
        title: '网络错误',
        message: '请求失败，请检查网络连接',
      });
    });
  };

  // ==================== 用户操作 ====================

  const login = useCallback((userData: AuthUser) => {
    setUser(userData);
    localStorage.setItem('cyberpress_user', JSON.stringify(userData));
    toast.success(`欢迎回来，${userData.displayName || userData.username}！`);
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    localStorage.removeItem('cyberpress_user');
    // 清除查询缓存
    queryClient.clear();
    toast.success('已成功退出登录');
  }, [queryClient]);

  const updateUser = useCallback((updates: Partial<AuthUser>) => {
    setUser((prevUser) => {
      if (!prevUser) return null;
      const updatedUser = { ...prevUser, ...updates };
      localStorage.setItem('cyberpress_user', JSON.stringify(updatedUser));
      return updatedUser;
    });
  }, []);

  // ==================== 通知操作 ====================

  const addNotification = useCallback((notification: Omit<Notification, 'id'>) => {
    const id = Date.now().toString();
    const newNotification: Notification = {
      ...notification,
      id,
    };

    setNotifications((prev) => [...prev, newNotification]);

    // 自动显示 toast
    if (notification.type === 'success') {
      toast.success(notification.message);
    } else if (notification.type === 'error') {
      toast.error(notification.message);
    } else if (notification.type === 'warning') {
      toast(notification.message, { icon: '⚠️' });
    } else {
      toast(notification.message);
    }

    // 自动移除
    if (notification.duration !== 0) {
      setTimeout(() => {
        removeNotification(id);
      }, notification.duration || 5000);
    }
  }, []);

  const removeNotification = useCallback((id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  }, []);

  const clearNotifications = useCallback(() => {
    setNotifications([]);
  }, []);

  // ==================== 主题操作 ====================

  const toggleTheme = useCallback(() => {
    setThemeState((prev) => {
      const newTheme = prev === 'dark' ? 'light' : 'dark';
      localStorage.setItem('theme', newTheme);
      return newTheme;
    });
  }, []);

  const setTheme = useCallback((newTheme: Theme) => {
    setThemeState(newTheme);
    localStorage.setItem('theme', newTheme);
  }, []);

  // ==================== Context Value ====================

  const contextValue: AppContextType = {
    user,
    isAuthenticated: !!user,
    isLoading,
    config,
    notifications,
    login,
    logout,
    updateUser,
    addNotification,
    removeNotification,
    clearNotifications,
    toggleTheme,
    setTheme,
  };

  return (
    <AppContext.Provider value={contextValue}>
      <QueryClientProvider client={queryClient}>
        <NextThemesProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          value={{ dark: 'dark', light: 'light' }}
        >
          {children}
          <ReactQueryDevtools initialIsOpen={false} />
        </NextThemesProvider>
      </QueryClientProvider>
    </AppContext.Provider>
  );
}

// ==================== Hook ====================

export function useApp() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}

// ==================== 便捷 Hooks ====================

export function useAuth() {
  const { user, isAuthenticated, isLoading, login, logout, updateUser } = useApp();

  return {
    user,
    isAuthenticated,
    isLoading,
    login,
    logout,
    updateUser,
  };
}

export function useConfig() {
  const { config } = useApp();
  return config;
}

export function useNotification() {
  const { notifications, addNotification, removeNotification, clearNotifications } = useApp();

  return {
    notifications,
    addNotification,
    removeNotification,
    clearNotifications,
    success: (message: string, title?: string) =>
      addNotification({ type: 'success', message, title }),
    error: (message: string, title?: string) =>
      addNotification({ type: 'error', message, title }),
    warning: (message: string, title?: string) =>
      addNotification({ type: 'warning', message, title }),
    info: (message: string, title?: string) =>
      addNotification({ type: 'info', message, title }),
  };
}

export function useTheme() {
  const { toggleTheme, setTheme } = useApp();
  const { theme } = require('next-themes');

  return {
    theme,
    toggleTheme,
    setTheme,
  };
}
