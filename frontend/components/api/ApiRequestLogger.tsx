/**
 * API 请求日志记录器组件
 */

'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { XIcon, TrashIcon, CheckIcon } from '@/components/icons';

export interface ApiLog {
  id: string;
  method: string;
  url: string;
  status: number;
  duration: number;
  timestamp: Date;
  success: boolean;
}

export interface ApiRequestLoggerProps {
  logs: ApiLog[];
  onClear?: () => void;
  maxLogs?: number;
  className?: string;
}

export function ApiRequestLogger({
  logs,
  onClear,
  maxLogs = 50,
  className,
}: ApiRequestLoggerProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [filter, setFilter] = useState<'all' | 'success' | 'error'>('all');

  const filteredLogs = logs
    .filter((log) => {
      if (filter === 'success') return log.success;
      if (filter === 'error') return !log.success;
      return true;
    })
    .slice(0, maxLogs);

  const successCount = logs.filter((l) => l.success).length;
  const errorCount = logs.filter((l) => !l.success).length;

  return (
    <div className={cn('fixed bottom-4 right-4 z-50', className)}>
      {/* 收起状态 */}
      {!isExpanded && (
        <motion.button
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setIsExpanded(true)}
          className="relative px-4 py-2 bg-cyber-card border border-cyber-border rounded-lg shadow-neon-cyan"
        >
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-cyber-cyan animate-pulse" />
            <span className="text-sm text-gray-300">API 日志</span>
            <span className="px-2 py-0.5 bg-cyber-cyan/20 text-cyber-cyan rounded text-xs">
              {logs.length}
            </span>
          </div>
        </motion.button>
      )}

      {/* 展开状态 */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="w-[400px] max-h-[500px] bg-cyber-card border border-cyber-border rounded-lg shadow-2xl overflow-hidden"
          >
            {/* 头部 */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-cyber-border">
              <div className="flex items-center gap-3">
                <h3 className="text-sm font-semibold text-white">API 请求日志</h3>
                <div className="flex gap-1">
                  <button
                    onClick={() => setFilter('all')}
                    className={cn(
                      'px-2 py-1 rounded text-xs',
                      filter === 'all'
                        ? 'bg-cyber-cyan text-cyber-dark'
                        : 'bg-cyber-muted text-gray-400 hover:text-white'
                    )}
                  >
                    全部 ({logs.length})
                  </button>
                  <button
                    onClick={() => setFilter('success')}
                    className={cn(
                      'px-2 py-1 rounded text-xs',
                      filter === 'success'
                        ? 'bg-cyber-green text-cyber-dark'
                        : 'bg-cyber-muted text-gray-400 hover:text-white'
                    )}
                  >
                    成功 ({successCount})
                  </button>
                  <button
                    onClick={() => setFilter('error')}
                    className={cn(
                      'px-2 py-1 rounded text-xs',
                      filter === 'error'
                        ? 'bg-cyber-pink text-white'
                        : 'bg-cyber-muted text-gray-400 hover:text-white'
                    )}
                  >
                    失败 ({errorCount})
                  </button>
                </div>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={onClear}
                  className="p-1 text-gray-400 hover:text-cyber-pink transition-colors"
                  title="清空日志"
                >
                  <TrashIcon className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setIsExpanded(false)}
                  className="p-1 text-gray-400 hover:text-white transition-colors"
                >
                  <XIcon className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* 日志列表 */}
            <div className="overflow-y-auto max-h-[400px]">
              {filteredLogs.length === 0 ? (
                <div className="flex items-center justify-center h-32 text-gray-500 text-sm">
                  暂无日志
                </div>
              ) : (
                <div className="divide-y divide-cyber-border">
                  {filteredLogs.map((log) => (
                    <motion.div
                      key={log.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="px-4 py-3 hover:bg-cyber-muted/50 transition-colors"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <span
                              className={cn(
                                'px-1.5 py-0.5 rounded text-xs font-medium',
                                log.method === 'GET'
                                  ? 'bg-blue-500/20 text-blue-400'
                                  : log.method === 'POST'
                                  ? 'bg-green-500/20 text-green-400'
                                  : log.method === 'PUT'
                                  ? 'bg-yellow-500/20 text-yellow-400'
                                  : log.method === 'DELETE'
                                  ? 'bg-red-500/20 text-red-400'
                                  : 'bg-gray-500/20 text-gray-400'
                              )}
                            >
                              {log.method}
                            </span>
                            <span className="text-xs text-gray-400 truncate">
                              {log.url}
                            </span>
                          </div>
                          <div className="flex items-center gap-2 text-xs text-gray-500">
                            <span
                              className={cn(
                                log.success ? 'text-cyber-green' : 'text-cyber-pink'
                              )}
                            >
                              {log.status}
                            </span>
                            <span>{log.duration}ms</span>
                          </div>
                        </div>
                        <div className="flex-shrink-0">
                          {log.success ? (
                            <CheckIcon className="w-4 h-4 text-cyber-green" />
                          ) : (
                            <XIcon className="w-4 h-4 text-cyber-pink" />
                          )}
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// 日志管理 Hook
export function useApiLogger(maxLogs: number = 100) {
  const [logs, setLogs] = useState<ApiLog[]>([]);

  const addLog = (log: Omit<ApiLog, 'id' | 'timestamp'>) => {
    const newLog: ApiLog = {
      ...log,
      id: `${Date.now()}-${Math.random()}`,
      timestamp: new Date(),
    };

    setLogs((prev) => [newLog, ...prev].slice(0, maxLogs));
  };

  const clearLogs = () => {
    setLogs([]);
  };

  return {
    logs,
    addLog,
    clearLogs,
  };
}
