/**
 * Logger Utility
 *
 * Centralized logging system with different log levels and output formats.
 * Supports development and production environments.
 */

export enum LogLevel {
  DEBUG = 0,
  INFO = 1,
  WARN = 2,
  ERROR = 3,
  FATAL = 4,
}

export interface LogEntry {
  level: LogLevel;
  message: string;
  timestamp: string;
  context?: Record<string, any>;
  stack?: string;
}

class Logger {
  private logLevel: LogLevel;
  private isDevelopment: boolean;

  constructor() {
    this.isDevelopment = process.env.NODE_ENV === 'development';
    this.logLevel = this.isDevelopment ? LogLevel.DEBUG : LogLevel.INFO;
  }

  private shouldLog(level: LogLevel): boolean {
    return level >= this.logLevel;
  }

  private formatMessage(entry: LogEntry): string {
    const timestamp = new Date(entry.timestamp).toISOString();
    const levelName = LogLevel[entry.level];
    return `[${timestamp}] [${levelName}] ${entry.message}`;
  }

  private log(entry: LogEntry) {
    if (!this.shouldLog(entry.level)) return;

    const message = this.formatMessage(entry);

    switch (entry.level) {
      case LogLevel.DEBUG:
        if (this.isDevelopment) {
          console.debug(message, entry.context || '');
        }
        break;
      case LogLevel.INFO:
        console.info(message, entry.context || '');
        break;
      case LogLevel.WARN:
        console.warn(message, entry.context || '');
        break;
      case LogLevel.ERROR:
      case LogLevel.FATAL:
        console.error(message, entry.context || '');
        if (entry.stack) {
          console.error('Stack trace:', entry.stack);
        }
        break;
    }
  }

  debug(message: string, context?: Record<string, any>) {
    this.log({
      level: LogLevel.DEBUG,
      message,
      timestamp: new Date().toISOString(),
      context,
    });
  }

  info(message: string, context?: Record<string, any>) {
    this.log({
      level: LogLevel.INFO,
      message,
      timestamp: new Date().toISOString(),
      context,
    });
  }

  warn(message: string, context?: Record<string, any>) {
    this.log({
      level: LogLevel.WARN,
      message,
      timestamp: new Date().toISOString(),
      context,
    });
  }

  error(message: string, error?: Error | Record<string, any>) {
    const entry: LogEntry = {
      level: LogLevel.ERROR,
      message,
      timestamp: new Date().toISOString(),
    };

    if (error instanceof Error) {
      entry.context = { name: error.name, message: error.message };
      entry.stack = error.stack;
    } else if (error) {
      entry.context = error;
    }

    this.log(entry);
  }

  fatal(message: string, error?: Error | Record<string, any>) {
    const entry: LogEntry = {
      level: LogLevel.FATAL,
      message,
      timestamp: new Date().toISOString(),
    };

    if (error instanceof Error) {
      entry.context = { name: error.name, message: error.message };
      entry.stack = error.stack;
    } else if (error) {
      entry.context = error;
    }

    this.log(entry);
  }
}

export const logger = new Logger();
export default logger;
