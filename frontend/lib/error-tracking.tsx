/**
 * 错误追踪服务
 * 统一处理应用中的错误
 */

export interface ErrorContext {
  component?: string;
  action?: string;
  route?: string;
  userId?: string;
  sessionId?: string;
  [key: string]: any;
}

export interface ErrorLog {
  id: string;
  message: string;
  stack?: string;
  name: string;
  timestamp: number;
  context: ErrorContext;
  level: 'error' | 'warning' | 'info';
  userAgent: string;
  url: string;
}

export interface ErrorTrackingOptions {
  enableLogging?: boolean;
  enableReporting?: boolean;
  reportingEndpoint?: string;
  maxLogs?: number;
  samplingRate?: number;
}

class ErrorTrackingService {
  private logs: ErrorLog[] = [];
  private options: Required<ErrorTrackingOptions>;
  private sessionId: string;

  constructor(options: ErrorTrackingOptions = {}) {
    this.options = {
      enableLogging: options.enableLogging ?? true,
      enableReporting: options.enableReporting ?? false,
      reportingEndpoint: options.reportingEndpoint || '',
      maxLogs: options.maxLogs || 100,
      samplingRate: options.samplingRate || 1,
    };
    this.sessionId = this.generateSessionId();
    this.setupGlobalHandlers();
  }

  private generateSessionId(): string {
    return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private setupGlobalHandlers() {
    // 全局错误处理
    if (typeof window !== 'undefined') {
      window.addEventListener('error', (event) => {
        this.captureError(event.error || new Error(event.message), {
          component: 'Global',
        });
      });

      window.addEventListener('unhandledrejection', (event) => {
        this.captureError(
          event.reason instanceof Error
            ? event.reason
            : new Error(String(event.reason)),
          {
            component: 'UnhandledPromise',
          }
        );
      });
    }
  }

  /**
   * 捕获错误
   */
  captureError(error: Error | string, context: ErrorContext = {}): string {
    const errorObj: ErrorLog = {
      id: this.generateId(),
      message: typeof error === 'string' ? error : error.message,
      stack: typeof error === 'string' ? undefined : error.stack,
      name: typeof error === 'string' ? 'Error' : error.name,
      timestamp: Date.now(),
      context: {
        ...context,
        sessionId: this.sessionId,
      },
      level: 'error',
      userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : '',
      url: typeof window !== 'undefined' ? window.location.href : '',
    };

    this.addLog(errorObj);

    if (this.options.enableLogging) {
      console.error('[ErrorTracking]', errorObj);
    }

    if (this.options.enableReporting && this.shouldReport()) {
      this.reportError(errorObj);
    }

    return errorObj.id;
  }

  /**
   * 捕获警告
   */
  captureWarning(message: string, context: ErrorContext = {}): string {
    const warningObj: ErrorLog = {
      id: this.generateId(),
      message,
      timestamp: Date.now(),
      context: {
        ...context,
        sessionId: this.sessionId,
      },
      level: 'warning',
      name: 'Warning',
      userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : '',
      url: typeof window !== 'undefined' ? window.location.href : '',
    };

    this.addLog(warningObj);

    if (this.options.enableLogging) {
      console.warn('[ErrorTracking]', warningObj);
    }

    return warningObj.id;
  }

  /**
   * 捕获信息
   */
  captureInfo(message: string, context: ErrorContext = {}): string {
    const infoObj: ErrorLog = {
      id: this.generateId(),
      message,
      timestamp: Date.now(),
      context: {
        ...context,
        sessionId: this.sessionId,
      },
      level: 'info',
      name: 'Info',
      userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : '',
      url: typeof window !== 'undefined' ? window.location.href : '',
    };

    this.addLog(infoObj);

    if (this.options.enableLogging) {
      console.info('[ErrorTracking]', infoObj);
    }

    return infoObj.id;
  }

  private addLog(log: ErrorLog) {
    this.logs.push(log);

    // 限制日志数量
    if (this.logs.length > this.options.maxLogs) {
      this.logs.shift();
    }

    // 保存到 localStorage
    this.saveLogs();
  }

  private generateId(): string {
    return `error_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private shouldReport(): boolean {
    return Math.random() < this.options.samplingRate;
  }

  private async reportError(log: ErrorLog) {
    if (!this.options.reportingEndpoint) return;

    try {
      await fetch(this.options.reportingEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(log),
      });
    } catch (error) {
      console.error('[ErrorTracking] Failed to report error:', error);
    }
  }

  /**
   * 获取所有日志
   */
  getLogs(): ErrorLog[] {
    return [...this.logs];
  }

  /**
   * 按级别获取日志
   */
  getLogsByLevel(level: ErrorLog['level']): ErrorLog[] {
    return this.logs.filter((log) => log.level === level);
  }

  /**
   * 按时间范围获取日志
   */
  getLogsByTimeRange(startTime: number, endTime: number): ErrorLog[] {
    return this.logs.filter(
      (log) => log.timestamp >= startTime && log.timestamp <= endTime
    );
  }

  /**
   * 清空日志
   */
  clearLogs(): void {
    this.logs = [];
    this.saveLogs();
  }

  /**
   * 获取错误统计
   */
  getStats(): {
    total: number;
    byLevel: Record<string, number>;
    byComponent: Record<string, number>;
  } {
    const byLevel: Record<string, number> = {};
    const byComponent: Record<string, number> = {};

    this.logs.forEach((log) => {
      byLevel[log.level] = (byLevel[log.level] || 0) + 1;

      const component = log.context.component || 'Unknown';
      byComponent[component] = (byComponent[component] || 0) + 1;
    });

    return {
      total: this.logs.length,
      byLevel,
      byComponent,
    };
  }

  /**
   * 导出日志
   */
  exportLogs(): string {
    return JSON.stringify(this.logs, null, 2);
  }

  /**
   * 导入日志
   */
  importLogs(json: string): boolean {
    try {
      const logs = JSON.parse(json) as ErrorLog[];
      this.logs = logs;
      this.saveLogs();
      return true;
    } catch {
      return false;
    }
  }

  /**
   * 保存日志到 localStorage
   */
  private saveLogs(): void {
    if (typeof localStorage === 'undefined') return;

    try {
      localStorage.setItem(
        'error_tracking_logs',
        JSON.stringify(this.logs.slice(-50)) // 只保存最近 50 条
      );
    } catch (error) {
      console.error('[ErrorTracking] Failed to save logs:', error);
    }
  }

  /**
   * 从 localStorage 加载日志
   */
  private loadLogs(): void {
    if (typeof localStorage === 'undefined') return;

    try {
      const saved = localStorage.getItem('error_tracking_logs');
      if (saved) {
        this.logs = JSON.parse(saved);
      }
    } catch (error) {
      console.error('[ErrorTracking] Failed to load logs:', error);
    }
  }

  /**
   * 设置用户 ID
   */
  setUserId(userId: string): void {
    this.sessionId = userId;
  }

  /**
   * 设置选项
   */
  setOptions(options: Partial<ErrorTrackingOptions>): void {
    this.options = { ...this.options, ...options };
  }
}

// 单例实例
export const errorTracking = new ErrorTrackingService({
  enableLogging: process.env.NODE_ENV === 'development',
  enableReporting: process.env.NODE_ENV === 'production',
  maxLogs: 100,
});

/**
 * 错误边界组件
 */
import React from 'react';

interface ErrorBoundaryProps {
  children: React.ReactNode;
  fallback?: React.ComponentType<{ error: Error; retry: () => void }>;
  onError?: (error: Error, errorInfo: React.ErrorInfo) => void;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends React.Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    errorTracking.captureError(error, {
      component: 'ErrorBoundary',
      stack: errorInfo.componentStack,
    });

    if (this.props.onError) {
      this.props.onError(error, errorInfo);
    }
  }

  retry = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError && this.state.error) {
      const FallbackComponent = this.props.fallback;

      if (FallbackComponent) {
        return <FallbackComponent error={this.state.error} retry={this.retry} />;
      }

      return (
        <div className="min-h-screen flex items-center justify-center bg-cyber-darker">
          <div className="max-w-md w-full mx-4 p-6 bg-cyber-card border border-cyber-border rounded-lg">
            <div className="text-cyber-pink text-6xl mb-4">⚠️</div>
            <h1 className="text-2xl font-bold text-white mb-2">
              出错了
            </h1>
            <p className="text-gray-400 mb-6">
              {this.state.error.message || '应用遇到了一些问题'}
            </p>
            <button
              onClick={this.retry}
              className="w-full px-4 py-2 bg-gradient-to-r from-cyber-cyan to-cyber-purple
                text-black font-medium rounded-lg hover:shadow-lg hover:shadow-cyber-cyan/25
                transition-all"
            >
              重试
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

/**
 * Hook: 使用错误追踪
 */
export function useErrorTracking() {
  const captureError = React.useCallback(
    (error: Error | string, context?: ErrorContext) => {
      return errorTracking.captureError(error, context);
    },
    []
  );

  const captureWarning = React.useCallback(
    (message: string, context?: ErrorContext) => {
      return errorTracking.captureWarning(message, context);
    },
    []
  );

  const captureInfo = React.useCallback(
    (message: string, context?: ErrorContext) => {
      return errorTracking.captureInfo(message, context);
    },
    []
  );

  const getLogs = React.useCallback(() => {
    return errorTracking.getLogs();
  }, []);

  const clearLogs = React.useCallback(() => {
    errorTracking.clearLogs();
  }, []);

  const getStats = React.useCallback(() => {
    return errorTracking.getStats();
  }, []);

  return {
    captureError,
    captureWarning,
    captureInfo,
    getLogs,
    clearLogs,
    getStats,
  };
}

export default errorTracking;
