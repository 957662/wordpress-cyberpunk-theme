/**
 * Terminal Component - 终端命令行组件
 * 模拟终端界面，支持命令输入和输出
 */

'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Terminal as TerminalIcon, Maximize2, Minimize2, Copy, Check } from 'lucide-react';

export interface TerminalCommand {
  command: string;
  output?: string;
  type?: 'input' | 'output' | 'error' | 'success';
  timestamp?: Date;
}

export interface TerminalProps {
  title?: string;
  initialCommands?: TerminalCommand[];
  onCommand?: (command: string) => string | Promise<string>;
  className?: string;
  height?: number | string;
  readOnly?: boolean;
  showHeader?: boolean;
  theme?: 'dark' | 'cyber' | 'matrix';
}

export function Terminal({
  title = 'Terminal',
  initialCommands = [],
  onCommand,
  className,
  height = 400,
  readOnly = false,
  showHeader = true,
  theme = 'cyber',
}: TerminalProps) {
  const [commands, setCommands] = useState<TerminalCommand[]>(initialCommands);
  const [input, setInput] = useState('');
  const [isMaximized, setIsMaximized] = useState(false);
  const [copied, setCopied] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  const themes = {
    dark: 'bg-gray-900 border-gray-700',
    cyber: 'bg-cyber-dark border-cyber-cyan',
    matrix: 'bg-black border-green-500',
  };

  const textThemes = {
    dark: 'text-gray-100',
    cyber: 'text-cyber-cyan',
    matrix: 'text-green-500',
  };

  // 滚动到底部
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [commands]);

  // 执行命令
  const executeCommand = async (cmd: string) => {
    if (!cmd.trim()) return;

    const newCommand: TerminalCommand = {
      command: cmd,
      type: 'input',
      timestamp: new Date(),
    };

    setCommands(prev => [...prev, newCommand]);
    setInput('');

    if (onCommand) {
      try {
        const output = await onCommand(cmd);
        setCommands(prev => [
          ...prev,
          {
            command: '',
            output,
            type: output.toLowerCase().includes('error') ? 'error' : 'output',
            timestamp: new Date(),
          },
        ]);
      } catch (error) {
        setCommands(prev => [
          ...prev,
          {
            command: '',
            output: String(error),
            type: 'error',
            timestamp: new Date(),
          },
        ]);
      }
    }
  };

  // 处理回车
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      executeCommand(input);
    }
  };

  // 复制命令
  const handleCopy = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  // 获取命令提示符
  const getPrompt = () => {
    return theme === 'matrix' ? 'root@matrix:~# ' : '$ ';
  };

  return (
    <div
      className={cn(
        "rounded-lg border overflow-hidden flex flex-col",
        themes[theme],
        isMaximized && "fixed inset-4 z-50",
        className
      )}
      style={{ height: isMaximized ? 'auto' : height }}
    >
      {/* 头部 */}
      {showHeader && (
        <div className="flex items-center justify-between px-4 py-2 border-b border-current/20">
          <div className="flex items-center gap-2">
            <TerminalIcon className={cn("w-4 h-4", textThemes[theme])} />
            <span className={cn("font-semibold", textThemes[theme])}>{title}</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex gap-1.5">
              <div className="w-3 h-3 rounded-full bg-red-500" />
              <div className="w-3 h-3 rounded-full bg-yellow-500" />
              <div className="w-3 h-3 rounded-full bg-green-500" />
            </div>
            <button
              onClick={() => setIsMaximized(!isMaximized)}
              className={cn(
                "p-1 rounded hover:bg-current/10 transition-colors",
                textThemes[theme]
              )}
            >
              {isMaximized ? (
                <Minimize2 className="w-4 h-4" />
              ) : (
                <Maximize2 className="w-4 h-4" />
              )}
            </button>
          </div>
        </div>
      )}

      {/* 内容区域 */}
      <div
        ref={scrollRef}
        className="flex-1 overflow-auto p-4 font-mono text-sm space-y-2"
      >
        <AnimatePresence mode="popLayout">
          {commands.map((cmd, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 10 }}
              transition={{ duration: 0.2 }}
              className="group"
            >
              {/* 输入命令 */}
              {cmd.command && (
                <div className="flex items-start gap-2">
                  <span className={cn("flex-shrink-0", textThemes[theme])}>
                    {getPrompt()}
                  </span>
                  <span className={cn("flex-1", textThemes[theme])}>
                    {cmd.command}
                  </span>
                  <button
                    onClick={() => handleCopy(cmd.command)}
                    className="opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-current/10 rounded"
                  >
                    {copied ? (
                      <Check className="w-3 h-3 text-green-500" />
                    ) : (
                      <Copy className="w-3 h-3" />
                    )}
                  </button>
                </div>
              )}

              {/* 输出内容 */}
              {cmd.output && (
                <div
                  className={cn(
                    "ml-4 whitespace-pre-wrap break-words",
                    cmd.type === 'error' && "text-red-500",
                    cmd.type === 'success' && "text-green-500",
                    (!cmd.type || cmd.type === 'output') && textThemes[theme]
                  )}
                >
                  {cmd.output}
                </div>
              )}
            </motion.div>
          ))}
        </AnimatePresence>

        {/* 输入框 */}
        {!readOnly && (
          <div className="flex items-center gap-2 mt-2">
            <span className={cn("flex-shrink-0", textThemes[theme])}>
              {getPrompt()}
            </span>
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              className={cn(
                "flex-1 bg-transparent outline-none",
                textThemes[theme],
                "placeholder:opacity-50"
              )}
              placeholder="输入命令..."
              autoFocus
            />
          </div>
        )}
      </div>
    </div>
  );
}

/**
 * TerminalWindow Component - 终端窗口组件
 * 带有预设命令和自动执行功能
 */
export interface TerminalWindowProps extends Omit<TerminalProps, 'onCommand'> {
  autoRun?: boolean;
  commands?: TerminalCommand[];
  typingSpeed?: number;
}

export function TerminalWindow({
  autoRun = false,
  commands = [],
  typingSpeed = 50,
  ...terminalProps
}: TerminalWindowProps) {
  const [displayedCommands, setDisplayedCommands] = useState<TerminalCommand[]>([]);

  useEffect(() => {
    if (autoRun && commands.length > 0) {
      let index = 0;
      const timer = setInterval(() => {
        if (index < commands.length) {
          setDisplayedCommands(prev => [...prev, commands[index]]);
          index++;
        } else {
          clearInterval(timer);
        }
      }, typingSpeed * 10);

      return () => clearInterval(timer);
    }
  }, [autoRun, commands, typingSpeed]);

  return <Terminal {...terminalProps} initialCommands={displayedCommands} />;
}
