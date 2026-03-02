'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { Mic, MicOff, Command, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';
import { VoiceInput, VoiceRecognitionResult } from './VoiceInput';

export interface VoiceCommand {
  trigger: string;
  action: () => void;
  description: string;
  aliases?: string[];
}

export interface VoiceCommandsProps {
  commands: VoiceCommand[];
  language?: string;
  className?: string;
  onCommandRecognized?: (command: VoiceCommand) => void;
  showCommands?: boolean;
  position?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
}

export const VoiceCommands: React.FC<VoiceCommandsProps> = ({
  commands,
  language = 'zh-CN',
  className,
  onCommandRecognized,
  showCommands = true,
  position = 'bottom-right',
}) => {
  const [isActive, setIsActive] = useState(false);
  const [lastCommand, setLastCommand] = useState<string | null>(null);
  const [matchedCommand, setMatchedCommand] = useState<VoiceCommand | null>(null);

  // 查找匹配的命令
  const findMatchingCommand = useCallback((text: string): VoiceCommand | null => {
    const lowerText = text.toLowerCase().trim();

    for (const command of commands) {
      const triggers = [command.trigger, ...(command.aliases || [])];

      for (const trigger of triggers) {
        const lowerTrigger = trigger.toLowerCase();

        // 完全匹配
        if (lowerText === lowerTrigger) {
          return command;
        }

        // 包含匹配
        if (lowerText.includes(lowerTrigger) && lowerText.length < lowerTrigger.length + 10) {
          return command;
        }
      }
    }

    return null;
  }, [commands]);

  // 处理语音识别结果
  const handleTranscript = useCallback((text: string) => {
    const command = findMatchingCommand(text);

    if (command) {
      setLastCommand(text);
      setMatchedCommand(command);
      command.action();
      onCommandRecognized?.(command);

      // 3秒后清除匹配状态
      setTimeout(() => {
        setMatchedCommand(null);
        setLastCommand(null);
      }, 3000);
    }
  }, [findMatchingCommand, onCommandRecognized]);

  // 切换激活状态
  const toggleActive = useCallback(() => {
    setIsActive(prev => !prev);
  }, []);

  // 位置样式
  const positionStyles = {
    'top-left': 'top-4 left-4',
    'top-right': 'top-4 right-4',
    'bottom-left': 'bottom-4 left-4',
    'bottom-right': 'bottom-4 right-4',
  };

  return (
    <div className={cn('fixed z-50', positionStyles[position], className)}>
      {/* 激活按钮 */}
      <button
        onClick={toggleActive}
        className={cn(
          'relative group p-3 rounded-xl transition-all duration-300',
          'backdrop-blur-md border-2',
          isActive
            ? 'bg-cyan-500/20 border-cyan-500 shadow-lg shadow-cyan-500/30'
            : 'bg-gray-900/80 border-gray-700 hover:border-gray-600'
        )}
      >
        {isActive ? (
          <Mic className="w-6 h-6 text-cyan-400 animate-pulse" />
        ) : (
          <MicOff className="w-6 h-6 text-gray-400" />
        )}

        {/* 脉冲动画 */}
        {isActive && (
          <span className="absolute inset-0 rounded-xl animate-ping bg-cyan-500/30" />
        )}
      </button>

      {/* 命令面板 */}
      {isActive && (
        <div className="absolute mt-2 w-80 rounded-xl border border-gray-700 bg-gray-900/95 backdrop-blur-md shadow-2xl overflow-hidden">
          {/* 头部 */}
          <div className="p-4 border-b border-gray-700 bg-gradient-to-r from-cyan-500/10 to-purple-500/10">
            <div className="flex items-center gap-2">
              <Command className="w-5 h-5 text-cyan-400" />
              <h3 className="font-semibold text-white">语音命令</h3>
            </div>
            <p className="text-xs text-gray-400 mt-1">
              说出口令来执行命令
            </p>
          </div>

          {/* 语音输入 */}
          <div className="p-4 border-b border-gray-700">
            <VoiceInput
              onTranscript={handleTranscript}
              language={language}
              placeholder="说出命令..."
              className="bg-transparent"
            />
          </div>

          {/* 最后识别的命令 */}
          {lastCommand && (
            <div className="p-3 border-b border-gray-700 bg-cyan-500/10">
              <div className="flex items-center gap-2 text-cyan-400 text-sm">
                <Sparkles className="w-4 h-4" />
                <span className="font-medium">已识别:</span>
                <span className="text-white">"{lastCommand}"</span>
              </div>
            </div>
          )}

          {/* 命令列表 */}
          {showCommands && (
            <div className="p-4 max-h-60 overflow-y-auto">
              <div className="space-y-2">
                {commands.map((cmd, index) => (
                  <div
                    key={index}
                    className={cn(
                      'p-3 rounded-lg border transition-all',
                      matchedCommand === cmd
                        ? 'border-cyan-500 bg-cyan-500/20'
                        : 'border-gray-700 bg-gray-800/50 hover:border-gray-600'
                    )}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <Command className="w-4 h-4 text-cyan-400 flex-shrink-0" />
                          <span className="font-medium text-white">
                            {cmd.trigger}
                          </span>
                        </div>
                        <p className="text-sm text-gray-400 mt-1">
                          {cmd.description}
                        </p>
                        {cmd.aliases && cmd.aliases.length > 0 && (
                          <div className="flex flex-wrap gap-1 mt-2">
                            {cmd.aliases.map((alias, i) => (
                              <span
                                key={i}
                                className="px-2 py-0.5 text-xs bg-gray-700 text-gray-300 rounded"
                              >
                                {alias}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

// 预定义的常用命令
export const useCommonVoiceCommands = () => {
  return [
    {
      trigger: '滚动到顶部',
      action: () => window.scrollTo({ top: 0, behavior: 'smooth' }),
      description: '滚动到页面顶部',
      aliases: ['回到顶部', '向上滚动', '首页'],
    },
    {
      trigger: '滚动到底部',
      action: () => window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' }),
      description: '滚动到页面底部',
      aliases: ['到底部', '向下滚动', '页尾'],
    },
    {
      trigger: '搜索',
      action: () => {
        const searchInput = document.querySelector('input[type="search"]') as HTMLInputElement;
        searchInput?.focus();
      },
      description: '聚焦搜索框',
      aliases: ['打开搜索', '搜索内容'],
    },
    {
      trigger: '刷新页面',
      action: () => window.location.reload(),
      description: '刷新当前页面',
      aliases: ['重新加载', '刷新'],
    },
    {
      trigger: '切换主题',
      action: () => {
        // 主题切换逻辑
        document.documentElement.classList.toggle('dark');
      },
      description: '切换深色/浅色主题',
      aliases: ['切换模式', '改变主题'],
    },
    {
      trigger: '返回上一页',
      action: () => window.history.back(),
      description: '返回到上一页',
      aliases: ['后退', '返回'],
    },
    {
      trigger: '打印页面',
      action: () => window.print(),
      description: '打印当前页面',
      aliases: ['打印'],
    },
  ];
};

export default VoiceCommands;
