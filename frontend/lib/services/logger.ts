/**
 * 日志服务
 * 提供统一的日志记录接口
 */

export enum LogLevel {
  DEBUG = 0,
  INFO = 1,
  WARN = 2,
  ERROR = 3,
}

interface LogEntry {
  level: LogLevel;
  message: string;
  timestamp: string;
  data?: any;
  context?: Record<string, any>;
}

class LoggerService {
  private currentLevel: LogLevel;
  private logs: LogEntry[] = [];
  private maxLogs: number = 1000;
  private enableConsole: boolean = true;

  constructor(level: LogLevel = LogLevel.INFO) {
    this.currentLevel = level;

    // 在开发环境启用控制台输出
    if (process.env.NODE_ENV === 'development') {
      this.enableConsole = true;
    }
  }

  /**
   * 设置日志级别
   */
  setLevel(level: LogLevel): void {
    this.currentLevel = level;
  }

  /**
   * 获取日志级别名称
   */
  private getLevelName(level: LogLevel): string {
    switch (level) {
      case LogLevel.DEBUG:
        return 'DEBUG';
      case LogLevel.INFO:
        return 'INFO';
      case LogLevel.WARN:
        return 'WARN';
      case LogLevel.ERROR:
        return 'ERROR';
      default:
        return 'UNKNOWN';
    }
  }

  /**
   * 格式化日志消息
   */
  private formatMessage(entry: LogEntry): string {
    const { level, message, timestamp } = entry;
    const levelName = this.getLevelName(level);
    return `[${timestamp}] [${levelName}] ${message}`;
  }

  /**
   * 记录日志
   */
  private log(level: LogLevel, message: string, data?: any, context?: Record<string, any>): void {
    if (level < this.currentLevel) {
      return;
    }

    const entry: LogEntry = {
      level,
      message,
      timestamp: new Date().toISOString(),
      data,
      context,
    };

    // 添加到日志列表
    this.logs.push(entry);

    // 限制日志数量
    if (this.logs.length > this.maxLogs) {
      this.logs.shift();
    }

    // 输出到控制台
    if (this.enableConsole) {
      const formattedMessage = this.formatMessage(entry);

      switch (level) {
        case LogLevel.DEBUG:
          console.debug(formattedMessage, data || '', context || '');
          break;
        case LogLevel.INFO:
          console.info(formattedMessage, data || '', context || '');
          break;
        case LogLevel.WARN:
          console.warn(formattedMessage, data || '', context || '');
          break;
        case LogLevel.ERROR:
          console.error(formattedMessage, data || '', context || '');
          break;
      }
    }
  }

  /**
   * DEBUG级别日志
   */
  debug(message: string, data?: any, context?: Record<string, any>): void {
    this.log(LogLevel.DEBUG, message, data, context);
  }

  /**
   * INFO级别日志
   */
  info(message: string, data?: any, context?: Record<string, any>): void {
    this.log(LogLevel.INFO, message, data, context);
  }

  /**
   * WARN级别日志
   */
  warn(message: string, data?: any, context?: Record<string, any>): void {
    this.log(LogLevel.WARN, message, data, context);
  }

  /**
   * ERROR级别日志
   */
  error(message: string, error?: Error | any, context?: Record<string, any>): void {
    this.log(LogLevel.ERROR, message, error, context);
  }

  /**
   * 获取所有日志
   */
  getLogs(): LogEntry[] {
    return [...this.logs];
  }

  /**
   * 清空日志
   */
  clear(): void {
    this.logs = [];
  }

  /**
   * 导出日志
   */
  export(): string {
    return JSON.stringify(this.logs, null, 2);
  }

  /**
   * 下载日志文件
   */
  download(): void {
    const data = this.export();
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `logs-${Date.now()}.json`;
    link.click();
    URL.revokeObjectURL(url);
  }
}

// 创建并导出单例实例
export const logger = new LoggerService(
  process.env.NODE_ENV === 'development' ? LogLevel.DEBUG : LogLevel.INFO
);

/**
 * 创建带上下文的日志记录器
 */
export function createLogger(context: Record<string, any>) {
  return {
    debug: (message: string, data?: any) => logger.debug(message, data, context),
    info: (message: string, data?: any) => logger.info(message, data, context),
    warn: (message: string, data?: any) => logger.warn(message, data, context),
    error: (message: string, error?: Error | any) => logger.error(message, error, context),
  };
}
