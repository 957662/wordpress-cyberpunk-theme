/**
 * 日志工具
 * 提供统一的日志记录接口
 */

export enum LogLevel {
  DEBUG = 0,
  INFO = 1,
  WARN = 2,
  ERROR = 3,
}

export interface LogEntry {
  level: LogLevel;
  message: string;
  timestamp: string;
  data?: unknown;
  context?: string;
}

class Logger {
  private minLevel: LogLevel = LogLevel.INFO;
  private logs: LogEntry[] = [];
  private maxLogs = 1000;

  constructor() {
    if (process.env.NODE_ENV === 'development') {
      this.minLevel = LogLevel.DEBUG;
    } else {
      this.minLevel = LogLevel.INFO;
    }
  }

  private log(level: LogLevel, message: string, data?: unknown, context?: string): void {
    if (level < this.minLevel) return;

    const entry: LogEntry = {
      level,
      message,
      timestamp: new Date().toISOString(),
      data,
      context,
    };

    // 添加到日志数组
    this.logs.push(entry);

    // 限制日志数量
    if (this.logs.length > this.maxLogs) {
      this.logs.shift();
    }

    // 控制台输出
    const levelName = LogLevel[level];
    const prefix = context ? `[${context}]` : '';

    switch (level) {
      case LogLevel.DEBUG:
        console.debug(`[DEBUG] ${prefix} ${message}`, data || '');
        break;
      case LogLevel.INFO:
        console.info(`[INFO] ${prefix} ${message}`, data || '');
        break;
      case LogLevel.WARN:
        console.warn(`[WARN] ${prefix} ${message}`, data || '');
        break;
      case LogLevel.ERROR:
        console.error(`[ERROR] ${prefix} ${message}`, data || '');
        break;
    }
  }

  debug(message: string, data?: unknown, context?: string): void {
    this.log(LogLevel.DEBUG, message, data, context);
  }

  info(message: string, data?: unknown, context?: string): void {
    this.log(LogLevel.INFO, message, data, context);
  }

  warn(message: string, data?: unknown, context?: string): void {
    this.log(LogLevel.WARN, message, data, context);
  }

  error(message: string, data?: unknown, context?: string): void {
    this.log(LogLevel.ERROR, message, data, context);
  }

  getLogs(level?: LogLevel): LogEntry[] {
    if (level !== undefined) {
      return this.logs.filter((log) => log.level >= level);
    }
    return [...this.logs];
  }

  clearLogs(): void {
    this.logs = [];
  }
}

// 单例实例
export const logger = new Logger();

// 便捷的日志函数
export const log = {
  debug: (message: string, data?: unknown, context?: string) => logger.debug(message, data, context),
  info: (message: string, data?: unknown, context?: string) => logger.info(message, data, context),
  warn: (message: string, data?: unknown, context?: string) => logger.warn(message, data, context),
  error: (message: string, data?: unknown, context?: string) => logger.error(message, data, context),
};
