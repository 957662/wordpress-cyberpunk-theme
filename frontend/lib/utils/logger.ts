/**
 * 日志工具
 * 提供统一的日志记录接口
 */

enum LogLevel {
  DEBUG = 0,
  INFO = 1,
  WARN = 2,
  ERROR = 3,
}

interface LogEntry {
  level: LogLevel;
  message: string;
  timestamp: Date;
  data?: any;
  context?: string;
}

class Logger {
  private minLevel: LogLevel;
  private enableConsole: boolean;
  private logs: LogEntry[] = [];
  private maxLogs: number = 100;

  constructor() {
    this.minLevel =
      process.env.NODE_ENV === 'production'
        ? LogLevel.INFO
        : LogLevel.DEBUG;
    this.enableConsole = process.env.NODE_ENV !== 'production';
  }

  private shouldLog(level: LogLevel): boolean {
    return level >= this.minLevel;
  }

  private log(level: LogLevel, message: string, data?: any, context?: string) {
    if (!this.shouldLog(level)) return;

    const entry: LogEntry = {
      level,
      message,
      timestamp: new Date(),
      data,
      context,
    };

    // 存储日志
    this.logs.push(entry);
    if (this.logs.length > this.maxLogs) {
      this.logs.shift();
    }

    // 输出到控制台
    if (this.enableConsole) {
      this.logToConsole(entry);
    }
  }

  private logToConsole(entry: LogEntry) {
    const timestamp = entry.timestamp.toISOString();
    const prefix = `[${timestamp}]${entry.context ? ` [${entry.context}]` : ''}`;

    const styles = {
      [LogLevel.DEBUG]: 'color: #888',
      [LogLevel.INFO]: 'color: #00f0ff',
      [LogLevel.WARN]: 'color: #f0ff00',
      [LogLevel.ERROR]: 'color: #ff0080',
    };

    const style = styles[entry.level];

    switch (entry.level) {
      case LogLevel.DEBUG:
        console.debug(`%c${prefix}`, style, entry.message, entry.data || '');
        break;
      case LogLevel.INFO:
        console.info(`%c${prefix}`, style, entry.message, entry.data || '');
        break;
      case LogLevel.WARN:
        console.warn(`%c${prefix}`, style, entry.message, entry.data || '');
        break;
      case LogLevel.ERROR:
        console.error(`%c${prefix}`, style, entry.message, entry.data || '');
        break;
    }
  }

  debug(message: string, data?: any, context?: string) {
    this.log(LogLevel.DEBUG, message, data, context);
  }

  info(message: string, data?: any, context?: string) {
    this.log(LogLevel.INFO, message, data, context);
  }

  warn(message: string, data?: any, context?: string) {
    this.log(LogLevel.WARN, message, data, context);
  }

  error(message: string, error?: Error | any, context?: string) {
    let data = error;

    if (error instanceof Error) {
      data = {
        message: error.message,
        stack: error.stack,
        name: error.name,
      };
    }

    this.log(LogLevel.ERROR, message, data, context);
  }

  /**
   * 创建带上下文的 logger
   */
  createContext(context: string) {
    return {
      debug: (message: string, data?: any) => this.debug(message, data, context),
      info: (message: string, data?: any) => this.info(message, data, context),
      warn: (message: string, data?: any) => this.warn(message, data, context),
      error: (message: string, error?: Error | any) => this.error(message, error, context),
    };
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
  clear() {
    this.logs = [];
  }

  /**
   * 导出日志
   */
  export(): string {
    return JSON.stringify(this.logs, null, 2);
  }

  /**
   * 设置最小日志级别
   */
  setMinLevel(level: LogLevel) {
    this.minLevel = level;
  }

  /**
   * 启用/禁用控制台输出
   */
  setConsoleOutput(enabled: boolean) {
    this.enableConsole = enabled;
  }
}

// 导出单例
export const logger = new Logger();

// 导出便捷方法
export const log = {
  debug: (message: string, data?: any) => logger.debug(message, data),
  info: (message: string, data?: any) => logger.info(message, data),
  warn: (message: string, data?: any) => logger.warn(message, data),
  error: (message: string, error?: Error | any) => logger.error(message, error),
};
