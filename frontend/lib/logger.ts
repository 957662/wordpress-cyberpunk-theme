/**
 * Logger - 统一的日志工具
 * 支持不同级别的日志输出和格式化
 */

enum LogLevel {
  DEBUG = 0,
  INFO = 1,
  WARN = 2,
  ERROR = 3,
  SILENT = 4,
}

interface LogOptions {
  level?: LogLevel;
  context?: string;
  timestamp?: boolean;
  colors?: boolean;
}

class Logger {
  private level: LogLevel = LogLevel.INFO;
  private context: string = '';
  private timestamp: boolean = true;
  private colors: boolean = true;

  // ANSI 颜色代码
  private colorsMap = {
    debug: '\x1b[36m', // Cyan
    info: '\x1b[32m',  // Green
    warn: '\x1b[33m',  // Yellow
    error: '\x1b[31m', // Red
    reset: '\x1b[0m',  // Reset
  };

  constructor(options: LogOptions = {}) {
    this.level = options.level ?? this.level;
    this.context = options.context ?? '';
    this.timestamp = options.timestamp ?? true;
    this.colors = options.colors ?? true;

    // 从环境变量读取日志级别
    const envLevel = process.env.NEXT_PUBLIC_LOG_LEVEL;
    if (envLevel && envLevel in LogLevel) {
      this.level = LogLevel[envLevel.toUpperCase() as keyof typeof LogLevel];
    }
  }

  private formatTimestamp(): string {
    if (!this.timestamp) return '';
    const now = new Date();
    return `[${now.toISOString()}] `;
  }

  private formatContext(): string {
    if (!this.context) return '';
    return `[${this.context}] `;
  }

  private colorize(message: string, level: 'debug' | 'info' | 'warn' | 'error'): string {
    if (!this.colors || typeof window !== 'undefined') {
      return message; // 浏览器环境不支持 ANSI 颜色
    }
    return `${this.colorsMap[level]}${message}${this.colorsMap.reset}`;
  }

  private shouldLog(level: LogLevel): boolean {
    return level >= this.level;
  }

  debug(message: string, ...args: any[]) {
    if (!this.shouldLog(LogLevel.DEBUG)) return;

    const prefix = this.formatTimestamp() + this.formatContext() + '[DEBUG] ';
    const colored = this.colorize(prefix + message, 'debug');

    if (typeof window !== 'undefined') {
      console.log(colored, ...args);
    } else {
      console.log(colored, ...args);
    }
  }

  info(message: string, ...args: any[]) {
    if (!this.shouldLog(LogLevel.INFO)) return;

    const prefix = this.formatTimestamp() + this.formatContext() + '[INFO] ';
    const colored = this.colorize(prefix + message, 'info');

    if (typeof window !== 'undefined') {
      console.info(colored, ...args);
    } else {
      console.info(colored, ...args);
    }
  }

  warn(message: string, ...args: any[]) {
    if (!this.shouldLog(LogLevel.WARN)) return;

    const prefix = this.formatTimestamp() + this.formatContext() + '[WARN] ';
    const colored = this.colorize(prefix + message, 'warn');

    if (typeof window !== 'undefined') {
      console.warn(colored, ...args);
    } else {
      console.warn(colored, ...args);
    }
  }

  error(message: string, error?: Error | unknown, ...args: any[]) {
    if (!this.shouldLog(LogLevel.ERROR)) return;

    const prefix = this.formatTimestamp() + this.formatContext() + '[ERROR] ';
    const colored = this.colorize(prefix + message, 'error');

    if (typeof window !== 'undefined') {
      console.error(colored, error, ...args);
    } else {
      console.error(colored, error, ...args);
    }
  }

  // 创建子 logger
  child(context: string): Logger {
    return new Logger({
      level: this.level,
      context: this.context ? `${this.context}:${context}` : context,
      timestamp: this.timestamp,
      colors: this.colors,
    });
  }

  // 设置日志级别
  setLevel(level: LogLevel | keyof typeof LogLevel): void {
    if (typeof level === 'string') {
      this.level = LogLevel[level.toUpperCase() as keyof typeof LogLevel];
    } else {
      this.level = level;
    }
  }
}

// 默认 logger 实例
export const logger = new Logger();

// 便捷函数
export const createLogger = (context: string) => new Logger({ context });

// 导出 LogLevel 枚举
export { LogLevel };

/**
 * 使用示例:
 *
 * import { logger, createLogger } from '@/lib/logger';
 *
 * // 使用默认 logger
 * logger.info('Application started');
 * logger.error('Something went wrong', error);
 *
 * // 创建带上下文的 logger
 * const dbLogger = createLogger('database');
 * dbLogger.info('Connected to database');
 *
 * // 创建子 logger
 * const appLogger = logger.child('app');
 * appLogger.debug('Debug message');
 */
